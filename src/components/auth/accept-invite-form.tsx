"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Landing page for the link in Supabase's invite email. The link carries
 * short-lived auth tokens (in the URL, not visible to the server) that
 * @supabase/ssr's browser client picks up automatically on load — this
 * page just waits for that to resolve into a real session before letting
 * the invitee set the password they'll actually log in with afterward.
 * middleware.ts treats "/accept-invite" as public specifically so this
 * first, cookie-less request isn't bounced away before that can happen.
 */
export function AcceptInviteForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">(
    isSupabaseConfigured ? "checking" : "invalid",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let settled = false;
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !settled) {
        settled = true;
        setStatus("ready");
      }
    });

    // getSession() resolves once the client's automatic URL-token
    // handling has finished — null means there was never a valid invite
    // token to begin with (a broken link, or one already used/expired).
    supabase.auth.getSession().then(({ data }) => {
      if (!settled) {
        settled = true;
        setStatus(data.session ? "ready" : "invalid");
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const supabase = createClient();
    if (!supabase) return;

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-lg text-white/70">
        <Loader2 size={18} className="animate-spin" />
        Verifying your invite…
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-lg font-medium text-brand-red">
          <TriangleAlert size={18} />
          This invite link is invalid or has expired.
        </p>
        <p className="text-white/70">Ask an existing admin to send you a new invite from Settings.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      <TextField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="New Password"
        placeholder="At least 8 characters"
        autoComplete="new-password"
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

      <TextField
        id="confirm-password"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        label="Confirm Password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {error && <p className="text-base font-medium text-brand-red">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-70"
      >
        {submitting ? "Saving…" : "Set Password & Continue"}
      </button>
    </form>
  );
}
