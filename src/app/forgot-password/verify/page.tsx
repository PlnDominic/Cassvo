import { AuthLayout } from "@/components/auth/auth-layout";
import { BackLink } from "@/components/auth/back-link";
import { OtpVerifyForm } from "@/components/auth/otp-verify-form";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, Math.min(6, local.length));
  return `${visible}...@${domain}`;
}

export default async function VerifyCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthLayout>
      <BackLink href="/forgot-password" />
      <div className="flex w-full flex-col gap-16">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">
            Forgot Password
          </h1>
          <p className="text-lg sm:text-2xl">
            A code has been sent to your email{" "}
            {email ? maskEmail(email) : "your inbox"}
          </p>
        </div>

        <OtpVerifyForm />
      </div>
    </AuthLayout>
  );
}
