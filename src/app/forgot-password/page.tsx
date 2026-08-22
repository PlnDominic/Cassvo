import { AuthLayout } from "@/components/auth/auth-layout";
import { BackLink } from "@/components/auth/back-link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <BackLink href="/" />
      <div className="flex w-full flex-col gap-16">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">
            Forgot Password
          </h1>
          <p className="text-lg sm:text-2xl">Enter your email to reset your password</p>
        </div>

        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}
