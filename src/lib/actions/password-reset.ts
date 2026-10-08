"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteOrigin } from "@/lib/site-origin";
import type { ActionResult } from "./settings";

// Same message whether or not the email is an admin's, so this form can't
// be used to find out which emails have admin accounts.
const SENT: ActionResult = {
  ok: true,
  message: "If that email belongs to an admin account, a reset link is on its way. Check your inbox.",
};

/**
 * Sends Supabase's password-reset email, only to active admins (mobile-app
 * users share the same Auth accounts and reset through the app). Uses a
 * throwaway client on the implicit flow so the link carries its tokens in
 * the URL and works on any device; the default PKCE flow would only work
 * in the browser that asked for it. The link lands on /reset-password.
 */
export async function requestPasswordReset(emailInput: string): Promise<ActionResult> {
  const email = emailInput.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Enter a valid email address." };

  const adminClient = createAdminClient();
  if (!adminClient || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { ok: false, message: "Password reset isn't configured on the server yet." };
  }

  // Case-insensitive exact match; % and _ escaped so they aren't wildcards.
  const { data: admin } = await adminClient
    .from("admin_users")
    .select("id")
    .ilike("email", email.replace(/[\\%_]/g, "\\$&"))
    .eq("active", true)
    .maybeSingle();
  if (!admin) return SENT;

  const resetClient = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const origin = await getSiteOrigin();
  const { error } = await resetClient.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` });

  // Not shown to the caller (that would reveal the account exists), but
  // logged so a misconfiguration or rate limit is visible in the server log.
  if (error) console.error("requestPasswordReset:", error.message);
  return SENT;
}
