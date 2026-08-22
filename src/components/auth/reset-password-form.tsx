"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  // The password-reset email link lands here with a recovery session
  // already established by the Supabase client. If there's no session,
  // this page was opened directly rather than via a real reset link.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("This reset link is invalid or has expired. Request a new one.");
      } else {
        setReady(true);
      }
    });
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <p className="text-base font-medium text-brand-red">
        Supabase isn&apos;t configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
      </p>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);

    const supabase = createClient();
    if (!supabase) return;

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[99px]">
      <div className="flex flex-col gap-3">
        <TextField
          id="new-password"
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter New Password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={!ready}
          required
        />
        <TextField
          id="confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm New Password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={!ready}
          required
        />
        {error && <p className="text-base font-medium text-brand-red">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={!ready || submitting}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-50"
      >
        {submitting ? "Updating…" : "Change Password"}
      </button>
    </form>
  );
}
