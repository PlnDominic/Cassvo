import { AuthLayout } from "@/components/auth/auth-layout";
import { BackLink } from "@/components/auth/back-link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <BackLink href="/forgot-password" />
      <div className="flex w-full flex-col gap-16">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Reset Password</h1>
          <p className="text-lg sm:text-2xl">Reset your Password</p>
        </div>

        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
}
