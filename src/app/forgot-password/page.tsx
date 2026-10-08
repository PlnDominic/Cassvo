import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Forgot password?</h1>
          <p className="text-lg sm:text-2xl">Enter your admin email and we&apos;ll send you a reset link</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}
