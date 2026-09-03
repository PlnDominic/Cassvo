"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Landing page for the link in Supabase's invite email. The link carries
 * short-lived auth tokens in the URL — as a `#access_token=...` hash
 * fragment (the implicit flow, which is what Supabase's invite email
 * actually sends), never sent to the server.
 *
 * @supabase/ssr's browser client defaults to `flowType: "pkce"`, whose
 * automatic URL-detection only looks for a `?code=` query param — it
 * silently ignores a hash-fragment token, so relying on it here left
 * every invite looking "invalid or expired" even with a valid token
 * sitting right in the URL. This parses the hash directly and calls
 * setSession() with it instead, which works regardless of flow type.
 *
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

    async function resolveSession() {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { data, error } = await supabase!.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Strip the tokens from the visible URL either way — they're
        // single-use and shouldn't linger in the address bar or history.
        window.history.replaceState(null, "", window.location.pathname);
        setStatus(!error && data.session ? "ready" : "invalid");
        return;
      }

      // No hash tokens present — either an already-established session
      // (e.g. a page refresh after the above already ran) or a broken link.
      const { data } = await supabase!.auth.getSession();
      setStatus(data.session ? "ready" : "invalid");
    }

    resolveSession();
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
