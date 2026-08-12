import { AuthLayout } from "@/components/auth/auth-layout";
import { BackLink } from "@/components/auth/back-link";
import { TextField } from "@/components/ui/text-field";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <BackLink href="/forgot-password/verify" />
      <div className="flex w-full flex-col gap-16">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">
            Reset Password
          </h1>
          <p className="text-lg sm:text-2xl">Reset your Password</p>
        </div>

        <form className="flex w-full flex-col gap-[99px]">
          <div className="flex flex-col gap-3">
            <TextField
              id="new-password"
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter New Password"
              autoComplete="new-password"
              required
            />
            <TextField
              id="confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm New Password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white"
          >
            Change Password
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
