import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS entirely. Server-only:
 * never import this from a Client Component or anything that could end
 * up in the browser bundle (SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_
 * prefix specifically to keep Next.js from ever inlining it client-side).
 *
 * Used only for the one thing RLS deliberately doesn't allow via the
 * normal anon-key client: creating a new admin. `admin_users` has no
 * INSERT policy on purpose (see supabase/proposed/001_admin_users.sql —
 * "should not be self-service via RLS"), and inviting someone means
 * creating their Supabase Auth account too, which the anon key can't do
 * at all.
 *
 * Returns null (never throws) if SUPABASE_SERVICE_ROLE_KEY isn't set,
 * matching the graceful-degradation pattern used by createClient() in
 * ./server and ./client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
