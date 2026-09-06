"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { recordLoginSession } from "@/lib/auth/record-login";
import { loginWithPassword } from "@/lib/actions/auth";

// Deliberately the same wording for "wrong password" and "correct
// password but not an admin" — see loginWithPassword. A distinct
// message for the second case would let anyone with a list of Cassvo
// customer-app emails use this form to test which ones have valid
// passwords, without ever needing admin access.
const LOGIN_FAILED_MESSAGE = "Incorrect email or password, or this account doesn't have admin access.";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "not-admin" ? LOGIN_FAILED_MESSAGE : null,
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    setSubmitting(true);
    // Signing in runs server-side (not supabase-js directly from here
    // anymore) so it can be rate-limited — see loginWithPassword's own
    // comment for why that has to happen server-side to mean anything.
    const outcome = await loginWithPassword(email, password);

    if (!outcome.ok) {
      setSubmitting(false);
      setError(outcome.message);
      return;
    }

    // The server action already established the session (cookies are
    // set on its response); this just picks it up client-side to record
    // the login (needs navigator.userAgent, browser-only) before moving on.
    const supabase = createClient();
    if (supabase) await recordLoginSession(supabase);

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
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Enter your Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-white/60 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
      />

      {error && <p className="text-base font-medium text-brand-red">{error}</p>}

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
