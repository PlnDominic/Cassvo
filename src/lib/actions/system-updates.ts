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

const NOT_READY: ActionResult = {
  ok: false,
  message: "System updates aren't set up yet — run supabase/proposed/007_system_updates.sql first.",
};

function isMissingTableError(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.code === "PGRST205" || Boolean(error?.message?.includes("system_updates"));
}

/**
 * Fans a system update out to every mobile app user as a real
 * public.notifications row — the send-push-on-notification trigger
 * (an AFTER INSERT trigger, confirmed live against cassvo_backend) fires
 * on each one and forwards it to the Expo push API for anyone with a
 * push_token; users without one just get it silently once the mobile
 * app next reads its own notifications. There's no INSERT policy on
 * notifications (only owner-scoped read/update/delete), so this — like
 * reading every profile id in the first place — has to go through
 * createAdminClient() rather than the caller's own session.
 *
 * Never throws; a failure here degrades to "posted to the dashboard,
 * but no push went out" rather than losing the system_updates row that
 * already saved successfully.
 */
async function fanOutPush(systemUpdateId: string, title: string, description: string): Promise<string | null> {
  const adminClient = createAdminClient();
  if (!adminClient) return "SUPABASE_SERVICE_ROLE_KEY isn't set, so no push was sent.";

  const { data: profiles, error: profilesError } = await adminClient.from("profiles").select("id");
  if (profilesError) {
    console.error("postSystemUpdate (fan-out, read profiles):", profilesError.message);
    return "Couldn't look up recipients, so no push was sent.";
  }
  if (!profiles || profiles.length === 0) return null;

  const { error: insertError } = await adminClient.from("notifications").insert(
    profiles.map((profile) => ({
      user_id: profile.id,
      type: "system_update",
      title,
      subtitle: description || null,
      entity_id: systemUpdateId,
    })),
  );

  if (insertError) {
    console.error("postSystemUpdate (fan-out, insert notifications):", insertError.message);
    return "Saved, but the push notification failed to send — check the server log.";
  }

  return null;
}

/**
 * Posts a System Update announcement (see
 * supabase/proposed/007_system_updates.sql for the table this writes to,
 * and src/lib/data/notifications.ts for how it's read back on the
 * dashboard's own Notifications page) — and, separately, pushes it to
 * every mobile app user via fanOutPush() above.
 *
 * Admin-only: is_admin() only checks "does this session have an active
 * admin_users row," never role, so system_updates' own RLS INSERT
 * policy is gated on is_super_admin() instead — but that's enforced
 * here too, in application code, same reasoning as every other
 * admin-only action in settings.ts (a moderator posting a platform-wide
 * announcement — let alone pushing one to every real user's phone —
 * isn't something RLS alone should be trusted to block).
 */
export async function postSystemUpdate(title: string, description: string): Promise<ActionResult> {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return { ok: false, message: "Enter a title." };
  const trimmedDescription = description.trim();

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const { data, error } = await supabase
    .from("system_updates")
    .insert({
      title: trimmedTitle,
      description: trimmedDescription || null,
      created_by: caller.id,
    })
    .select("id")
    .single();

  if (error) {
    if (isMissingTableError(error)) return NOT_READY;
    console.error("postSystemUpdate:", error.message);
    return { ok: false, message: error.message };
  }

  const pushWarning = await fanOutPush(data.id, trimmedTitle, trimmedDescription);

  revalidatePath("/notifications");
  return { ok: true, message: pushWarning ? `Posted — ${pushWarning}` : "Posted and pushed to all users" };
}
