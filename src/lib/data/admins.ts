import type { AdminUser } from "@/components/settings/admin-users-table";
import type { LoginActivityRow } from "@/components/profile/types";

/**
 * BLOCKED / NOT APPLICABLE: the real schema has no `admin_users` or
 * `login_activity` table — per-admin identity, roles and login sessions
 * aren't modeled at all. The dashboard is meant to sit behind a single
 * shared login instead (confirmed 2026-08-22), so these all return empty
 * rather than querying tables that don't exist. The Settings → Admin
 * Management and → Security screens will stay empty until/unless a real
 * admin-identity table is added to the schema, which needs sign-off from
 * whoever owns it.
 */

export async function getAdminUsers(): Promise<AdminUser[]> {
  return [];
}

/** Names available in the "Assign Moderator" picker. */
export async function getModerators(): Promise<string[]> {
  return [];
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

/** No per-admin identity exists in the real schema — there is no "signed-in admin" to return. */
export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  return null;
}

export async function getLoginActivity(_adminId: string): Promise<LoginActivityRow[]> {
  return [];
}

/** Recent admin sessions, for the Settings → Security "Active Sessions" list. */
export async function getActiveSessions(_limit = 5) {
  return [];
}
