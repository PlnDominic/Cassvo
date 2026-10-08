"use client";

import { useState } from "react";
import Link from "next/link";
import { TextField } from "@/components/ui/text-field";
import { requestPasswordReset } from "@/lib/actions/password-reset";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const outcome = await requestPasswordReset(email);
    setSubmitting(false);
    if (outcome.ok) setSent(outcome.message);
    else setError(outcome.message);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-lg text-white">{sent}</p>
        <p className="text-base text-white/60">The link expires after a while. Didn&apos;t get it? Check spam, or wait a minute and try again.</p>
        <Link href="/" className="text-base font-medium text-brand-red hover:underline">
          Back to sign in
        </Link>
      </div>
    );
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
        autoFocus
      />

      {error && <p className="text-base font-medium text-brand-red">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-70"
      >
        {submitting ? "Sending…" : "Send Reset Link"}
      </button>

      <Link href="/" className="text-center text-base text-white/60 hover:text-white">
        Back to sign in
      </Link>
    </form>
  );
}
