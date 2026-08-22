import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/components/settings/admin-users-table";
import type { LoginActivityRow } from "@/components/profile/types";
import { formatRelative } from "@/lib/format";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  moderator: "Moderator",
  analyst: "Analyst",
};

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name, email, role, active, invite_pending, last_active_at")
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
    lastActive: row.invite_pending ? "Invite pending" : formatRelative(row.last_active_at),
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

/** The signed-in admin, or the first admin when auth is not wired up yet. */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: auth } = await supabase.auth.getUser();

  const query = supabase
    .from("admin_users")
    .select("id, full_name, email, role, avatar_url, permissions, created_at");

  const { data, error } = auth.user
    ? await query.eq("auth_user_id", auth.user.id).maybeSingle()
    : await query.order("created_at").limit(1).maybeSingle();

  if (error || !data) {
    if (error) console.error("getCurrentAdmin:", error.message);
    return null;
  }

  const [approved, onboarded, resolved] = await Promise.all([
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("moderated_by", data.id).eq("status", "approved"),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("assigned_to", data.id).eq("status", "resolved"),
  ]);

  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    role: ROLE_LABEL[data.role] ?? data.role,
    avatarUrl: data.avatar_url,
    permissions: data.permissions ?? [],
    joinedAt: data.created_at,
    reviewsApproved: approved.count ?? 0,
    businessesOnboarded: onboarded.count ?? 0,
    reportsResolved: resolved.count ?? 0,
  };
}

export async function getLoginActivity(adminId: string): Promise<LoginActivityRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("login_activity")
    .select("device, browser, location, current, succeeded, created_at")
    .eq("admin_id", adminId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("getLoginActivity:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    device: row.device ?? "—",
    browser: row.browser ?? "—",
    location: row.location ?? "—",
    time: row.current ? "Current Session" : formatRelative(row.created_at),
    status: row.current ? "active" : "successful",
  }));
}

/** Recent admin sessions, for the Settings → Security "Active Sessions" list. */
export async function getActiveSessions(limit = 5) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("login_activity")
    .select("id, device, browser, location, current, created_at, admin_users:admin_id (full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getActiveSessions:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = Array.isArray(row.admin_users) ? (row.admin_users[0] as any) : (row.admin_users as any);
    return {
      id: row.id,
      name: admin?.full_name ?? "Unknown",
      detail: [row.device, row.browser, row.location].filter(Boolean).join(" · ") || (admin?.email ?? "—"),
      time: formatRelative(row.created_at),
      current: row.current,
    };
  });
}
