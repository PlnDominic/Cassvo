import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/components/settings/admin-users-table";
import type { LoginActivityRow } from "@/components/profile/types";
import type { ActiveSession } from "@/components/settings/types";
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

/** True for a Postgres "relation does not exist" or PostgREST's schema-cache equivalent. */
function isMissingLoginActivityTable(error: { code?: string; message?: string } | null) {
  return error?.code === "42P01" || error?.code === "PGRST205" || Boolean(error?.message?.includes("login_activity"));
}

/**
 * Profile page's "Recent Login Activity" table, scoped to one admin —
 * see supabase/proposed/002_login_activity.sql for the table this reads
 * (not yet applied on every project, hence the missing-table check) and
 * src/lib/auth/record-login.ts for what writes to it. Degrades to []
 * rather than erroring if the table isn't there yet, same pattern as
 * getPlatformSettings's SETTINGS_NOT_READY fallback.
 */
export async function getLoginActivity(adminId: string): Promise<LoginActivityRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("login_activity")
    .select("device, browser, location, current, created_at")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    if (!isMissingLoginActivityTable(error)) console.error("getLoginActivity:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    device: row.device ?? "Unknown device",
    browser: row.browser ?? "Unknown browser",
    location: row.location ?? "—",
    time: formatRelative(row.created_at),
    status: row.current ? "active" : "successful",
  }));
}

/**
 * Settings → Security's "Active Sessions" list — every admin's recorded
 * sessions, not just the viewer's own (matches login_activity's own RLS:
 * "Admins can view login_activity" lets any active admin see everyone's
 * rows, same scope this screen already had when it was a static list).
 * Same table and same missing-table fallback as getLoginActivity above.
 */
export async function getActiveSessions(limit = 5): Promise<ActiveSession[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("login_activity")
    .select("id, device, browser, location, current, created_at, admin:admin_users!admin_id (full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    if (!isMissingLoginActivityTable(error)) console.error("getActiveSessions:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const admin = Array.isArray(row.admin) ? row.admin[0] : row.admin;
    const detail = [row.device, row.browser].filter(Boolean).join(" - ") || "Unknown device";
    return {
      id: row.id,
      name: admin?.full_name ?? "Unknown admin",
      detail: row.location ? `${detail} - ${row.location}` : detail,
      time: formatRelative(row.created_at),
      current: row.current,
    };
  });
}
