"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCallerAdmin, NOT_ADMIN_ROLE_MESSAGE } from "@/lib/auth/require-admin";
import type { ActionResult } from "./settings";

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

const NOT_ADMIN_ROLE: ActionResult = { ok: false, message: NOT_ADMIN_ROLE_MESSAGE };

/**
 * Deletes a member's account — the admin-side fix for "the mobile app
 * isn't letting him delete his account". `profiles` has no DELETE policy
 * (RLS here is read-only, same posture as `businesses`), so this goes
 * through the service-role client; admin-only on top of that.
 *
 * Order matters: the `profiles` row is deleted first, since anything with
 * a foreign key into it (reviews, reports, …) will reject the delete with
 * a constraint-violation error if it isn't set up to cascade — that error
 * is surfaced as-is rather than guessed at. Only once the profile itself
 * is gone do we remove the underlying Supabase Auth account
 * (`profiles.id` is the Supabase convention for matching `auth.users.id`),
 * so a failed profile delete never leaves someone locked out of an
 * account that still has data attached to it.
 */
export async function deleteUser(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { ok: false, message: "Deleting isn't configured yet — SUPABASE_SERVICE_ROLE_KEY is missing on the server." };
  }

  const { error: profileError } = await adminClient.from("profiles").delete().eq("id", id);
  if (profileError) {
    console.error("deleteUser (profiles):", profileError.message);
    return { ok: false, message: profileError.message };
  }

  const { error: authError } = await adminClient.auth.admin.deleteUser(id);
  if (authError) {
    console.error("deleteUser (auth):", authError.message);
    return { ok: false, message: `Profile deleted, but the account itself couldn't be removed: ${authError.message}` };
  }

  revalidatePath("/users");
  return { ok: true, message: "User deleted" };
}
