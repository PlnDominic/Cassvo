"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { resendLoginCode, signOutOfPendingLogin, submitLoginCode } from "@/lib/actions/login-verification";

export function VerifyLoginForm({ codeSent: initiallySent }: { codeSent: boolean }) {
  const router = useRouter();
  const [codeSent, setCodeSent] = useState(initiallySent);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    const outcome = await submitLoginCode(code);
    if (!outcome.ok) {
      setSubmitting(false);
      setError(outcome.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function handleSend() {
    setError(null);
    setNotice(null);
    setSending(true);
    const outcome = await resendLoginCode();
    setSending(false);
    if (outcome.ok) {
      setCodeSent(true);
      setCode("");
      setNotice(outcome.message);
    } else {
      setError(outcome.message);
    }
  }

  async function handleSignOut() {
    await signOutOfPendingLogin();
    router.push("/");
    router.refresh();
  }

  if (!codeSent) {
    return (
      <div className="flex w-full flex-col gap-6">
        {error && <p className="text-base font-medium text-brand-red">{error}</p>}
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-70"
        >
          {sending ? "Sending…" : "Send Code"}
        </button>
        <button type="button" onClick={handleSignOut} className="text-base text-white/60 hover:text-white">
          Sign in with a different account
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      <TextField
        id="code"
        name="code"
        label="Sign-in Code"
        placeholder="Enter the code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={12}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        autoFocus
      />

      {error && <p className="text-base font-medium text-brand-red">{error}</p>}
      {notice && <p className="text-base font-medium text-emerald-400">{notice}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-70"
      >
        {submitting ? "Verifying…" : "Verify"}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-base">
        <button type="button" onClick={handleSend} disabled={sending} className="text-white/60 hover:text-white disabled:opacity-50">
          {sending ? "Sending…" : "Resend code"}
        </button>
        <button type="button" onClick={handleSignOut} className="text-white/60 hover:text-white">
          Sign in with a different account
        </button>
      </div>
    </form>
  );
}
