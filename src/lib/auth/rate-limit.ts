import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_SETTINGS, mergeSettings } from "@/lib/settings-schema";

/**
 * The admin login form's failed-attempt threshold and lockout window —
 * configurable from Settings → Security (platform_settings.security.
 * failedLoginLimit / lockoutMinutes) rather than fixed constants. Shared
 * by src/lib/actions/auth.ts (the actual gate) and
 * src/lib/data/notifications.ts (the securityAlert event, which should
 * fire on the same threshold the login form itself enforces — a
 * mismatch there would make the alert lie about what's actually
 * blocked).
 *
 * Takes a service-role client (or null) rather than calling
 * getPlatformSettings() itself, because loginWithPassword() needs this
 * *before* the caller has signed in at all — platform_settings' own RLS
 * (is_admin()) would block an unauthenticated read via the regular
 * anon-key client, the same reason login_attempts itself needs
 * createAdminClient(). Falls back to DEFAULT_SETTINGS.security (5
 * attempts / 20 minutes) if adminClient is null (SUPABASE_SERVICE_ROLE_KEY
 * not set) or the row doesn't exist yet, same graceful-degradation
 * pattern as everything else in this app.
 */
export async function getRateLimitConfig(adminClient: SupabaseClient | null) {
  if (!adminClient) {
    return {
      maxFailedAttempts: DEFAULT_SETTINGS.security.failedLoginLimit,
      windowMinutes: DEFAULT_SETTINGS.security.lockoutMinutes,
    };
  }

  const { data } = await adminClient.from("platform_settings").select("security").eq("id", true).maybeSingle();
  const security = mergeSettings(DEFAULT_SETTINGS.security, data?.security);
  return { maxFailedAttempts: security.failedLoginLimit, windowMinutes: security.lockoutMinutes };
}
