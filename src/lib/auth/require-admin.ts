import { createClient } from "@/lib/supabase/server";

export interface CallerAdmin {
  id: string;
  role: string;
}

/**
 * The signed-in caller's own admin_users row (id + role), or null if
 * they're not signed in or aren't an active admin at all.
 *
 * middleware.ts and RLS's is_admin() both already gate on "is there an
 * active admin_users row" — this exists for the *next* question, which
 * neither of those answers: which role. `admin_users.role` distinguishes
 * 'admin' from 'moderator', but is_admin() (and therefore every RLS
 * policy keyed off it) treats them identically. Actions that should be
 * admin-only — not just any active dashboard user — need this app-level
 * check instead, since RLS won't stop a moderator on its own.
 */
export async function getCallerAdmin(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
): Promise<CallerAdmin | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .eq("active", true)
    .maybeSingle();

  return data;
}

export const NOT_ADMIN_ROLE_MESSAGE = "Only an Admin can do this — Moderators can only manage reviews.";
