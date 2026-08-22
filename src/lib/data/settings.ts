import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, mergeSettings, type PlatformSettings } from "@/lib/settings-schema";

/**
 * The single platform settings row, deep-merged onto the defaults so missing
 * or stale keys still produce a complete object.
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  const supabase = await createClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from("platform_settings")
    .select("general, moderation, notification, security")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getPlatformSettings:", error.message);
    return DEFAULT_SETTINGS;
  }

  return {
    general: mergeSettings(DEFAULT_SETTINGS.general, data.general),
    moderation: mergeSettings(DEFAULT_SETTINGS.moderation, data.moderation),
    notification: mergeSettings(DEFAULT_SETTINGS.notification, data.notification),
    security: mergeSettings(DEFAULT_SETTINGS.security, data.security),
  };
}
