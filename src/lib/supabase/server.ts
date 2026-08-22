import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when the Supabase environment variables are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Server-side Supabase client for Server Components, Route Handlers and
 * Server Actions. Returns null when Supabase is not configured yet, so the
 * dashboard renders empty states instead of crashing during setup.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — safe to ignore when middleware
          // is refreshing the session.
        }
      },
    },
  });
}
