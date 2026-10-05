"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCallerAdmin, NOT_ADMIN_ROLE_MESSAGE } from "@/lib/auth/require-admin";
import { markCurrentSessionVerified } from "@/lib/auth/login-code";
import type { PlatformSettings, SecuritySettings, SettingsSectionKey } from "@/lib/settings-schema";

export interface ActionResult {
  ok: boolean;
  message: string;
}

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

const NOT_ADMIN_ROLE: ActionResult = { ok: false, message: NOT_ADMIN_ROLE_MESSAGE };

const SETTINGS_NOT_READY: ActionResult = {
  ok: false,
  message: "Settings aren't set up yet — run supabase/proposed/006_platform_settings.sql first.",
};

/** True for a Postgres "relation does not exist" or PostgREST's schema-cache equivalent. */
function isMissingTableError(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.code === "PGRST205" || Boolean(error?.message?.includes("platform_settings"));
}

/**
 * Persists one section of the platform settings row (see
 * supabase/proposed/006_platform_settings.sql for the table this writes
 * to, and src/lib/data/settings.ts for the matching read path).
 *
 * Admin-only: is_admin() only checks "does this session have an active
 * admin_users row," never role, so platform_settings' own RLS UPDATE
 * policy is gated on is_super_admin() instead — but that's enforced here
 * too, in application code, since this is also where the friendlier
 * NOT_ADMIN_ROLE_MESSAGE comes from (RLS alone would just report 0 rows
 * changed, indistinguishable from "this table doesn't exist yet").
 */
export async function savePlatformSettings<K extends SettingsSectionKey>(
  section: K,
  values: PlatformSettings[K],
): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  if (section === "security" && (values as SecuritySettings).authentication.loginEmailCode) {
    const { data: status, error: statusError } = await supabase.rpc("login_verification_status");
    if (statusError) {
      return {
        ok: false,
        message: "Login Verification needs supabase/proposed/009_login_verification.sql run first.",
      };
    }
    // Switching it on: count the session doing the switching as verified,
    // so this admin isn't sent to the code screen mid-change and can
    // still switch it back off if codes turn out not to arrive.
    if (status === "not_required") {
      const marked = await markCurrentSessionVerified(supabase);
      if (!marked.ok) return marked;
    }
  }

  const { error, count } = await supabase
    .from("platform_settings")
    .update({ [section]: values, updated_at: new Date().toISOString() }, { count: "exact" })
    .eq("id", true);

  if (error) {
    if (isMissingTableError(error)) return SETTINGS_NOT_READY;
    console.error("savePlatformSettings:", error.message);
    return { ok: false, message: error.message };
  }
  if (count === 0) return SETTINGS_NOT_READY;

  revalidatePath("/settings");
  return { ok: true, message: "Saved" };
}

// ---------------------------------------------------------------- admins

async function getSiteOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

/**
 * Looks up an existing Supabase Auth account by email - used to promote
 * a mobile-app user to admin instead of inviting them (see inviteAdmin
 * below). The admin Auth API has no "get user by email" endpoint in this
 * SDK version, only paginated listUsers(), so this pages through the
 * full user list and matches client-side. Fine at this app's scale; this
 * only runs when an admin invite hits an already-registered email, not
 * on every page load.
 */
async function findAuthUserByEmail(adminClient: ReturnType<typeof createAdminClient>, email: string) {
  if (!adminClient) return null;
  const perPage = 1000;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("findAuthUserByEmail:", error.message);
      return null;
    }
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < perPage) return null;
  }
  return null;
}

/**
 * Invites a new admin: creates their Supabase Auth account (via the
 * service-role client — the anon key can't do this at all) and their
 * admin_users row together, then Supabase emails them a real "set your
 * password" link that lands on /accept-invite.
 *
 * `admin_users` has no INSERT policy for the regular anon-key client
 * (see supabase/proposed/001_admin_users.sql), so the row write below
 * also goes through the service-role client, which bypasses RLS
 * entirely — meaning the "only an admin can invite" check has to happen
 * here in application code instead of relying on RLS. Admin-only, same
 * reasoning as savePlatformSettings above: a moderator shouldn't be able
 * to invite anyone, admin or moderator.
 *
 * Someone who already has a Cassvo Auth account (every mobile-app user
 * does) can't be invited a second time - Supabase Auth rejects the
 * duplicate signup with "already been registered" - so this is also
 * where the dashboard's second path to admin lives: on that exact
 * error, look the existing account up by email and attach an
 * admin_users row to it directly instead of failing outright. No new
 * password is set and no invite email goes out; they sign in with the
 * password they already have, same as any other mobile-app user.
 */
export async function inviteAdmin(input: {
  fullName: string;
  email: string;
  role: string;
  permissions: string[];
}): Promise<ActionResult> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!fullName) return { ok: false, message: "Full name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email address." };
  if (input.role !== "admin" && input.role !== "moderator") return { ok: false, message: "Select a role." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return {
      ok: false,
      message: "Invites aren't configured yet — SUPABASE_SERVICE_ROLE_KEY is missing on the server.",
    };
  }

  const origin = await getSiteOrigin();
  const { data: invited, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/accept-invite`,
  });

  if (inviteError || !invited.user) {
    if (inviteError?.message.includes("already been registered")) {
      return promoteExistingUserToAdmin(adminClient, { fullName, email, role: input.role });
    }
    console.error("inviteAdmin (auth):", inviteError?.message);
    return { ok: false, message: inviteError?.message ?? "Couldn't send the invite." };
  }

  const { error } = await adminClient.from("admin_users").insert({
    auth_user_id: invited.user.id,
    full_name: fullName,
    email,
    role: input.role,
    active: true,
  });

  if (error) {
    console.error("inviteAdmin (admin_users):", error.message);
    // The auth account was created but the admin_users row failed — clean
    // up so retrying the invite doesn't hit "already registered".
    await adminClient.auth.admin.deleteUser(invited.user.id);
    const message = error.code === "23505" ? "An admin with that email already exists." : error.message;
    return { ok: false, message };
  }

  revalidatePath("/settings");
  return { ok: true, message: `Invite sent to ${email}` };
}

/**
 * The "promotion" path inviteAdmin falls back to for an email that
 * already has a Cassvo Auth account - see inviteAdmin's own comment for
 * why this exists. Not exported: it's reached only through inviteAdmin,
 * which has already done the admin-only check and the service-role
 * client null-check this needs too.
 */
async function promoteExistingUserToAdmin(
  adminClient: NonNullable<ReturnType<typeof createAdminClient>>,
  input: { fullName: string; email: string; role: string },
): Promise<ActionResult> {
  const existingUser = await findAuthUserByEmail(adminClient, input.email);
  if (!existingUser) {
    return { ok: false, message: "An account with that email already exists, but it couldn't be found to promote." };
  }

  const { error } = await adminClient.from("admin_users").insert({
    auth_user_id: existingUser.id,
    full_name: input.fullName,
    email: input.email,
    role: input.role,
    active: true,
  });

  if (error) {
    console.error("promoteExistingUserToAdmin:", error.message);
    const message = error.code === "23505" ? "An admin with that email already exists." : error.message;
    return { ok: false, message };
  }

  revalidatePath("/settings");
  return {
    ok: true,
    message: `${input.email} already had an account — granted admin access directly. They can sign in with their existing password.`,
  };
}

/** Admin-only — a moderator shouldn't be able to remove anyone. */
export async function removeAdmin(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const { error } = await supabase.from("admin_users").delete().eq("id", id);

  if (error) {
    console.error("removeAdmin:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Admin removed" };
}

/**
 * Admin-only — a moderator shouldn't be able to change anyone's role
 * (including promoting themselves to admin).
 */
export async function updateAdminRole(id: string, role: string): Promise<ActionResult> {
  if (role !== "admin" && role !== "moderator") return { ok: false, message: "Invalid role." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const { error } = await supabase.from("admin_users").update({ role }).eq("id", id);

  if (error) {
    console.error("updateAdminRole:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Role updated" };
}

/** Admin-only — a moderator shouldn't be able to activate/deactivate anyone. */
export async function setAdminActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const { error } = await supabase.from("admin_users").update({ active }).eq("id", id);

  if (error) {
    console.error("setAdminActive:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: active ? "Admin activated" : "Admin deactivated" };
}

// ---------------------------------------------------------------- sessions

/** Ends one recorded admin session. Admin-only — a moderator shouldn't be able to revoke anyone's session. */
export async function revokeSession(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const { error } = await supabase.from("login_activity").delete().eq("id", id);

  if (error) {
    console.error("revokeSession:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Session revoked" };
}
