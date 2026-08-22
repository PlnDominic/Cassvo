import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/components/settings/admin-users-table";
import type { LoginActivityRow } from "@/components/profile/types";
import { formatRelative } from "@/lib/format";

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin",
  moderator: "Moderator",
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name, email, role, active, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getAdminUsers:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name,
    email: row.email,
    role: ROLE_LABEL[row.role] ?? row.role,
    active: row.active,
    // The real schema doesn't track last-active time on admin_users.
    lastActive: formatRelative(row.created_at),
  }));
}

/** Names available in the "Assign Moderator" picker. */
export async function getModerators(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("admin_users")
    .select("full_name")
    .eq("active", true)
    .order("full_name");

  if (error) {
    console.error("getModerators:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.full_name);
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  permissions: string[];
  joinedAt: string | null;
  reviewsApproved: number;
  businessesOnboarded: number;
  reportsResolved: number;
}

/** The signed-in admin, resolved from the auth session to its admin_users row. */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name, email, role, active, created_at")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !data || !data.active) {
    if (error) console.error("getCurrentAdmin:", error.message);
    return null;
  }

  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    role: ROLE_LABEL[data.role] ?? data.role,
    avatarUrl: null,
    // admin_users has no permissions column yet — every admin has full access for now.
    permissions: [],
    joinedAt: data.created_at,
    // No moderation-action tracking exists on reviews/businesses/reports yet
    // (no moderated_by/assigned_to columns), so these read 0 rather than a
    // fabricated figure.
    reviewsApproved: 0,
    businessesOnboarded: 0,
    reportsResolved: 0,
  };
}

/**
 * BLOCKED / NOT APPLICABLE: the real schema has no `login_activity` table,
 * so per-session history isn't tracked. Settings → Security "Active
 * Sessions" and the Profile page's login-activity table stay empty until
 * such a table exists.
 */
export async function getLoginActivity(_adminId: string): Promise<LoginActivityRow[]> {
  return [];
}

export async function getActiveSessions(_limit = 5) {
  return [];
}
