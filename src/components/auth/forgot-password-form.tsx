"use client";

import { useState } from "react";
import { TextField } from "@/components/ui/text-field";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);

    // Always show the same success state regardless of whether the email
    // exists — otherwise this form leaks which emails have an account.
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-6 text-white">
        <p className="text-lg sm:text-2xl">
          If an account exists for <span className="font-medium">{email}</span>, a password reset link has been sent.
        </p>
        <p className="text-base text-white/70">Follow the link in that email to set a new password.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-16">
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

      {error && <p className="text-base font-medium text-brand-red">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-70"
      >
        {submitting ? "Sending…" : "Continue"}
      </button>
    </form>
  );
}
