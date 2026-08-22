import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Browser Supabase client, for client components that read or upload directly. */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(url!, anonKey!);
}
