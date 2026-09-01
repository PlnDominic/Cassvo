"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { GoogleIcon } from "@/components/icons/google-icon";
import { RuleLine } from "@/components/icons/rule-line";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { recordLoginSession } from "@/lib/auth/record-login";

const NOT_ADMIN_MESSAGE = "This account doesn't have admin access. Ask an existing admin to invite you from Settings.";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "not-admin" ? NOT_ADMIN_MESSAGE : null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    setSubmitting(true);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setSubmitting(false);
      setError(signInError.message === "Invalid login credentials" ? "Incorrect email or password." : signInError.message);
      return;
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
      setSubmitting(false);
      setError(NOT_ADMIN_MESSAGE);
      return;
    }

    await recordLoginSession(supabase);

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <TextField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-base font-medium text-brand-red">{error}</p>}

      <div className="flex flex-col items-center gap-6">
        <div className="flex w-full items-center gap-4">
          <RuleLine className="h-px w-full flex-1" />
          <p className="shrink-0 text-base font-medium tracking-[0.01em] text-line">or continue with</p>
          <RuleLine className="h-px w-full flex-1" />
        </div>

        <button
          type="button"
          aria-label="Google sign-in isn't set up yet"
          title="Google sign-in isn't set up yet"
          disabled
          className="flex size-[60px] cursor-not-allowed items-center justify-center rounded-full border-[0.5px] border-line bg-white opacity-40 shadow-[0px_4px_10px_rgba(0,0,0,0.1)]"
        >
          <GoogleIcon className="size-5" />
        </button>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-70"
      >
        {submitting ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
