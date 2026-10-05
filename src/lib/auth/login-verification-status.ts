import type { SupabaseClient } from "@supabase/supabase-js";

export type LoginVerificationStatus = "not_required" | "verified" | "pending" | "password_required";

export const VERIFY_LOGIN_PATH = "/verify-login";

/**
 * The calling session's Login Verification state, from the database's
 * login_verification_status() (supabase/proposed/009_login_verification.sql).
 * If that function doesn't exist yet the requirement can't be on, so
 * that reads as not_required; any other failure reads as pending, so an
 * outage never waves an unverified session through.
 */
export async function getLoginVerificationStatus(supabase: SupabaseClient): Promise<LoginVerificationStatus> {
  const { data, error } = await supabase.rpc("login_verification_status");
  if (error) {
    const missing = error.code === "42883" || error.code === "PGRST202";
    if (!missing) console.error("getLoginVerificationStatus:", error.message);
    return missing ? "not_required" : "pending";
  }
  return data as LoginVerificationStatus;
}

export function isLoginVerified(status: LoginVerificationStatus) {
  return status === "not_required" || status === "verified";
}
