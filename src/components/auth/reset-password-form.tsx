"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";

export function ResetPasswordForm() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
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
          required
        />
        {error && <p className="text-base font-medium text-brand-red">{error}</p>}
      </div>

      <button
        type="submit"
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white"
      >
        Change Password
      </button>
    </form>
  );
}
