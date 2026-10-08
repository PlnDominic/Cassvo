import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SetPasswordForm } from "@/components/auth/set-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Reset password</h1>
          <p className="text-lg sm:text-2xl">Choose a new password for your admin account</p>
        </div>

        <Suspense>
          <SetPasswordForm mode="reset" />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
