import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, mergeSettings, type PlatformSettings } from "@/lib/settings-schema";

/**
 * Reads the single `platform_settings` row (id = true — see
 * supabase/proposed/006_platform_settings.sql) and deep-merges its four
 * JSONB columns onto DEFAULT_SETTINGS via mergeSettings(). That merge is
 * what keeps this safe against schema drift in both directions: a column
 * that's missing, null, or only has some of its keys set (e.g. the table
 * hasn't been created yet, or a key was added to DEFAULT_SETTINGS after
 * the row was last saved) still reads back as a complete, correctly
 * typed PlatformSettings — nothing here ever needs a backfill migration.
 *
 * Falls back to DEFAULT_SETTINGS outright (never throws) when Supabase
 * isn't configured, the table doesn't exist yet, or the query fails for
 * any other reason — matching every other data/ module's degrade-to-
 * empty-state pattern, so a schema mismatch never crashes the page.
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  const supabase = await createClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from("platform_settings")
    .select("general, moderation, notification, security")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    console.error("getPlatformSettings:", error.message);
    return DEFAULT_SETTINGS;
  }
  if (!data) return DEFAULT_SETTINGS;

  return mergeSettings(DEFAULT_SETTINGS, data);
}
