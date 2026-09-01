import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Welcome</h1>
          <p className="text-lg sm:text-2xl">Sign into your Cassvo Admin Account</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
