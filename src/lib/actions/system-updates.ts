"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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
 * Posts a System Update announcement (see
 * supabase/proposed/007_system_updates.sql for the table this writes to,
 * and src/lib/data/notifications.ts for how it's read back).
 *
 * Admin-only: is_admin() only checks "does this session have an active
 * admin_users row," never role, so system_updates' own RLS INSERT
 * policy is gated on is_super_admin() instead — but that's enforced
 * here too, in application code, same reasoning as every other
 * admin-only action in settings.ts (a moderator posting a platform-wide
 * announcement isn't something RLS alone should be trusted to block).
 */
export async function postSystemUpdate(title: string, description: string): Promise<ActionResult> {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return { ok: false, message: "Enter a title." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const { error } = await supabase.from("system_updates").insert({
    title: trimmedTitle,
    description: description.trim() || null,
    created_by: caller.id,
  });

  if (error) {
    if (isMissingTableError(error)) return NOT_READY;
    console.error("postSystemUpdate:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/notifications");
  return { ok: true, message: "Posted" };
}
