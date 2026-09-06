"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RATE_LIMIT_WINDOW_MINUTES, MAX_FAILED_ATTEMPTS } from "@/lib/auth/rate-limit";
import type { ActionResult } from "./settings";

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

// Deliberately the same wording for "wrong password" and "correct
// password but not an admin" — a distinct message for the second case
// would let anyone with a list of Cassvo customer-app emails use this
// form to test which ones have valid passwords, without ever needing
// admin access (this is the same fix as security finding #2).
const LOGIN_FAILED_MESSAGE = "Incorrect email or password, or this account doesn't have admin access.";

const RATE_LIMITED_MESSAGE = "Too many failed attempts. Try again in a few minutes.";

/**
 * Signing in has to happen here, server-side, rather than via
 * supabase-js directly from the browser (as it did before) — that's
 * what makes the rate-limit check below meaningful. A check that only
 * ran client-side would be trivially bypassed by anyone scripting
 * requests straight at this form; running it here means every attempt
 * that goes through this app's own login page is actually gated.
 *
 * This doesn't replace Supabase Auth's own project-level rate limits
 * (Dashboard → Authentication → Rate Limits), which are the backstop
 * against someone bypassing this form entirely and calling Supabase's
 * Auth API directly with the public anon key — that's out of this
 * app's reach regardless. This closes the more likely gap: brute-forcing
 * through the deployed login page itself.
 */
export async function loginWithPassword(emailInput: string, password: string): Promise<ActionResult> {
  const email = emailInput.trim().toLowerCase();
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const adminClient = createAdminClient();
  if (adminClient) {
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count } = await adminClient
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .eq("succeeded", false)
      .gte("created_at", windowStart);

    if ((count ?? 0) >= MAX_FAILED_ATTEMPTS) {
      return { ok: false, message: RATE_LIMITED_MESSAGE };
    }
  }
  // No adminClient (SUPABASE_SERVICE_ROLE_KEY not set) — degrades to no
  // rate limiting rather than blocking login entirely, same graceful
  // pattern as every other service-role-dependent feature in this app.

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  async function logAttempt(succeeded: boolean) {
    if (!adminClient) return;
    await adminClient.from("login_attempts").insert({ email, succeeded }).then(
      () => {},
      (error) => console.error("loginWithPassword (log attempt):", error),
    );
  }

  if (signInError) {
    await logAttempt(false);
    return { ok: false, message: signInError.message === "Invalid login credentials" ? LOGIN_FAILED_MESSAGE : signInError.message };
  }

  // A valid Cassvo Auth account isn't enough — the admin dashboard is a
  // separate, invite-only surface. Only a matching active admin_users
  // row grants access; anyone else is signed back out immediately.
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", signInData.user.id)
    .eq("active", true)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    await logAttempt(false);
    return { ok: false, message: LOGIN_FAILED_MESSAGE };
  }

  await logAttempt(true);
  return { ok: true, message: "Signed in" };
}
