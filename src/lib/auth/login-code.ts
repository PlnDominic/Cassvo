import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Server-only. Sends and checks the emailed sign-in code for Settings ->
 * Security "Login Verification". There's no email provider in this app,
 * so the code goes out through Supabase Auth's own email OTP
 * (signInWithOtp, "Magic Link" email template, which must include
 * {{ .Token }} for a code to appear in the email). Per-session state
 * lives in login_verifications (supabase/proposed/009_login_verification.sql),
 * keyed by the JWT's session_id, and is written with the service-role
 * client only.
 */

const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

export interface LoginCodeResult {
  ok: boolean;
  message: string;
}

/** A throwaway anon client: OTP calls on it must never touch the caller's own cookie session. */
function createOtpClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function getSessionContext(supabase: SupabaseClient) {
  const [{ data: userData }, { data: claimsData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getClaims(),
  ]);
  const user = userData.user;
  const sessionId = claimsData?.claims?.session_id as string | undefined;
  if (!user?.email || !sessionId) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", user.id)
    .eq("active", true)
    .maybeSingle();
  if (!admin) return null;

  return { email: user.email, sessionId, adminId: admin.id as string };
}

/** Whether a code has already been sent for the caller's current session. */
export async function hasPendingLoginCode(supabase: SupabaseClient): Promise<boolean> {
  const context = await getSessionContext(supabase);
  const adminClient = createAdminClient();
  if (!context || !adminClient) return false;

  const { data } = await adminClient
    .from("login_verifications")
    .select("code_sent_at")
    .eq("session_id", context.sessionId)
    .maybeSingle();
  return Boolean(data?.code_sent_at);
}

export async function sendLoginCode(supabase: SupabaseClient): Promise<LoginCodeResult> {
  const context = await getSessionContext(supabase);
  if (!context) return { ok: false, message: "Your session has expired. Sign in again." };

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { ok: false, message: "Login Verification isn't configured - SUPABASE_SERVICE_ROLE_KEY is missing on the server." };
  }

  const { data: existing } = await adminClient
    .from("login_verifications")
    .select("code_sent_at")
    .eq("session_id", context.sessionId)
    .maybeSingle();

  if (existing?.code_sent_at) {
    const elapsed = (Date.now() - new Date(existing.code_sent_at).getTime()) / 1000;
    if (elapsed < RESEND_COOLDOWN_SECONDS) {
      return { ok: false, message: `Wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed)} seconds before requesting another code.` };
    }
  }

  const { error: otpError } = await createOtpClient().auth.signInWithOtp({
    email: context.email,
    options: { shouldCreateUser: false },
  });
  if (otpError) {
    console.error("sendLoginCode:", otpError.message);
    return { ok: false, message: `Couldn't send the code: ${otpError.message}` };
  }

  const { error } = await adminClient.from("login_verifications").upsert({
    session_id: context.sessionId,
    admin_id: context.adminId,
    code_sent_at: new Date().toISOString(),
    attempts: 0,
    verified_at: null,
  });
  if (error) {
    console.error("sendLoginCode (login_verifications):", error.message);
    return { ok: false, message: error.message };
  }

  // Housekeeping: one row per sign-in adds up; nothing needs them after a month.
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await adminClient.from("login_verifications").delete().eq("admin_id", context.adminId).lt("created_at", monthAgo);

  return { ok: true, message: `Code sent to ${context.email}` };
}

export async function verifyLoginCode(supabase: SupabaseClient, codeInput: string): Promise<LoginCodeResult> {
  const code = codeInput.replace(/\s/g, "");
  if (!/^\d{6,10}$/.test(code)) return { ok: false, message: "Enter the code from the email." };

  const context = await getSessionContext(supabase);
  if (!context) return { ok: false, message: "Your session has expired. Sign in again." };

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { ok: false, message: "Login Verification isn't configured - SUPABASE_SERVICE_ROLE_KEY is missing on the server." };
  }

  const { data: row } = await adminClient
    .from("login_verifications")
    .select("attempts, code_sent_at, verified_at")
    .eq("session_id", context.sessionId)
    .maybeSingle();

  if (row?.verified_at) return { ok: true, message: "Verified" };
  if (!row?.code_sent_at) return { ok: false, message: "Request a code first." };
  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false, message: "Too many incorrect codes. Request a new code." };
  }

  // Counted before checking, so an error mid-check still uses up the try.
  // Not atomic: simultaneous guesses can share one count, but Supabase's
  // own rate limit on code verification still applies to those.
  await adminClient
    .from("login_verifications")
    .update({ attempts: row.attempts + 1 })
    .eq("session_id", context.sessionId);

  const otpClient = createOtpClient();
  const { data, error } = await otpClient.auth.verifyOtp({ email: context.email, token: code, type: "email" });
  if (error || !data.session) {
    const left = MAX_ATTEMPTS - (row.attempts + 1);
    return {
      ok: false,
      message: left > 0 ? `That code is incorrect or has expired. ${left} ${left === 1 ? "try" : "tries"} left.` : "Too many incorrect codes. Request a new code.",
    };
  }

  // verifyOtp opened a separate session of its own; only the caller's
  // password session should stay signed in. Local scope, so this ends
  // just that throwaway session and not the caller's.
  await otpClient.auth.signOut({ scope: "local" });

  const { error: updateError } = await adminClient
    .from("login_verifications")
    .update({ verified_at: new Date().toISOString() })
    .eq("session_id", context.sessionId);
  if (updateError) {
    console.error("verifyLoginCode:", updateError.message);
    return { ok: false, message: updateError.message };
  }

  return { ok: true, message: "Verified" };
}

/**
 * Marks the caller's current session verified without a code. Only for
 * the admin switching Login Verification on, so they aren't bounced out
 * of the session they're using to change the setting.
 */
export async function markCurrentSessionVerified(supabase: SupabaseClient): Promise<LoginCodeResult> {
  const context = await getSessionContext(supabase);
  const adminClient = createAdminClient();
  if (!context || !adminClient) return { ok: false, message: "Couldn't confirm your current session." };

  const now = new Date().toISOString();
  const { error } = await adminClient.from("login_verifications").upsert({
    session_id: context.sessionId,
    admin_id: context.adminId,
    code_sent_at: null,
    attempts: 0,
    verified_at: now,
  });
  return error ? { ok: false, message: error.message } : { ok: true, message: "Verified" };
}
