import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AcceptInviteForm } from "@/components/auth/accept-invite-form";

export default function AcceptInvitePage() {
  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Welcome to Cassvo</h1>
          <p className="text-lg sm:text-2xl">Set a password to finish setting up your admin account</p>
        </div>

        <Suspense>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
