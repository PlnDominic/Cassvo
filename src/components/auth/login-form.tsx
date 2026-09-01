"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { recordLoginSession } from "@/lib/auth/record-login";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (signInError) {
      setError(signInError.message === "Invalid login credentials" ? "Incorrect email or password." : signInError.message);
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
