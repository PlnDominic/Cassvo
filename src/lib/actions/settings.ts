"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PlatformSettings, SettingsSectionKey } from "@/lib/settings-schema";

export interface ActionResult {
  ok: boolean;
  message: string;
}

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

/** Persists one section of the platform settings row. */
export async function savePlatformSettings<K extends SettingsSectionKey>(
  section: K,
  values: PlatformSettings[K],
): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase
    .from("platform_settings")
    .update({ [section]: values, updated_at: new Date().toISOString() })
    .eq("id", true);

  if (error) {
    console.error("savePlatformSettings:", error.message);
    return { ok: false, message: error.message };
  }

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
 * Invites a new admin: creates their Supabase Auth account (via the
 * service-role client — the anon key can't do this at all) and their
 * admin_users row together, then Supabase emails them a real "set your
 * password" link that lands on /accept-invite.
 *
 * `admin_users` has no INSERT policy for the regular anon-key client
 * (see supabase/proposed/001_admin_users.sql), so the row write below
 * also goes through the service-role client, which bypasses RLS
 * entirely — meaning the "only an active admin can invite" check has to
 * happen here in application code instead of relying on RLS.
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

  const {
    data: { user: caller },
  } = await supabase.auth.getUser();
  const { data: callerAdmin } = caller
    ? await supabase.from("admin_users").select("id").eq("auth_user_id", caller.id).eq("active", true).maybeSingle()
    : { data: null };
  if (!callerAdmin) return { ok: false, message: "Only an active admin can invite another admin." };

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
    console.error("inviteAdmin (auth):", inviteError?.message);
    const message = inviteError?.message.includes("already been registered")
      ? "An account with that email already exists."
      : (inviteError?.message ?? "Couldn't send the invite.");
    return { ok: false, message };
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

export async function removeAdmin(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").delete().eq("id", id);

  if (error) {
    console.error("removeAdmin:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Admin removed" };
}

export async function updateAdminRole(id: string, role: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").update({ role }).eq("id", id);

  if (error) {
    console.error("updateAdminRole:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Role updated" };
}

export async function setAdminActive(id: string, active: boolean): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("admin_users").update({ active }).eq("id", id);

  if (error) {
    console.error("setAdminActive:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: active ? "Admin activated" : "Admin deactivated" };
}

// ---------------------------------------------------------------- sessions

/** Ends one recorded admin session. */
export async function revokeSession(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error } = await supabase.from("login_activity").delete().eq("id", id);

  if (error) {
    console.error("revokeSession:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "Session revoked" };
}
