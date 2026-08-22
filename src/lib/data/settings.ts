import { DEFAULT_SETTINGS, type PlatformSettings } from "@/lib/settings-schema";

/**
 * BLOCKED / NOT APPLICABLE: the real schema has no `platform_settings`
 * table, so these are UI-only defaults until such a table exists (needs
 * sign-off from whoever owns the schema — see admins.ts for the matching
 * note on admin identity). Settings entered on the Settings page currently
 * can't persist anywhere real.
 */
export async function getPlatformSettings(): Promise<PlatformSettings> {
  return DEFAULT_SETTINGS;
}
