import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_SETTINGS, mergeSettings } from "@/lib/settings-schema";

/** Coarse device/browser labels from the UA string — good enough for a sessions list, not a fingerprint. */
function parseUserAgent(ua: string) {
  const device = /iPhone|iPad/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Macintosh/.test(ua)
        ? "Mac"
        : /Windows/.test(ua)
          ? "Windows"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown device";

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Chrome\//.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Safari\//.test(ua)
          ? "Safari"
          : "Unknown browser";

  return { device, browser };
}

/**
 * Records "I just signed in" as a login_activity row for the current
 * admin, flipping any of their previous sessions' `current` flag off
 * first. Called right after a successful sign-in or an auto-signed-in
 * sign-up. Best-effort: a failure here (table not created yet, RLS not
 * applied yet) is logged and swallowed rather than blocking access —
 * this is a nice-to-have audit trail, not a gate.
 *
 * Settings → Security's "Session Monitoring" toggle
 * (platform_settings.security.authentication.sessionMonitoring) gates
 * this: explicitly off means no row gets written at all, not just
 * hidden from view. Missing/unset (table not applied yet, or no row)
 * defaults to on, matching DEFAULT_SETTINGS and this feature's
 * always-on behavior before this toggle did anything.
 */
export async function recordLoginSession(supabase: SupabaseClient) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: admin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!admin) return;

    const { data: settingsRow } = await supabase.from("platform_settings").select("security").eq("id", true).maybeSingle();
    const security = mergeSettings(DEFAULT_SETTINGS.security, settingsRow?.security);
    if (!security.authentication.sessionMonitoring) return;

    const { device, browser } = parseUserAgent(navigator.userAgent);

    await supabase.from("login_activity").update({ current: false }).eq("admin_id", admin.id).eq("current", true);
    await supabase.from("login_activity").insert({
      admin_id: admin.id,
      device,
      browser,
      location: null,
      current: true,
    });
  } catch (error) {
    console.error("recordLoginSession:", error);
  }
}
