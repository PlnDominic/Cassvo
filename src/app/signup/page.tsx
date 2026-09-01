import { AuthLayout } from "@/components/auth/auth-layout";
import { BackLink } from "@/components/auth/back-link";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <BackLink href="/" />
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Create Account</h1>
          <p className="text-lg sm:text-2xl">Set up your Cassvo Admin Account</p>
        </div>

        <SignUpForm />
      </div>
    </AuthLayout>
  );
}
