"use server";

import { createClient } from "@/lib/supabase/server";
import { sendLoginCode, verifyLoginCode, type LoginCodeResult } from "@/lib/auth/login-code";

const NOT_CONFIGURED: LoginCodeResult = { ok: false, message: "Supabase isn't configured." };

export async function resendLoginCode(): Promise<LoginCodeResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;
  return sendLoginCode(supabase);
}

export async function submitLoginCode(code: string): Promise<LoginCodeResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;
  return verifyLoginCode(supabase, code);
}

/** Lets someone stuck on the code screen start over with a different account. */
export async function signOutOfPendingLogin(): Promise<void> {
  const supabase = await createClient();
  await supabase?.auth.signOut({ scope: "local" });
}
