import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { VerifyLoginForm } from "@/components/auth/verify-login-form";
import { createClient } from "@/lib/supabase/server";
import { hasPendingLoginCode } from "@/lib/auth/login-code";

export const dynamic = "force-dynamic";

/** "jane.doe@gmail.com" -> "ja***@gmail.com" */
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

export default async function VerifyLoginPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/");

  const codeSent = await hasPendingLoginCode(supabase);

  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">Check your email</h1>
          <p className="text-lg sm:text-2xl">
            {codeSent
              ? `Enter the code we sent to ${maskEmail(user.email)}`
              : `We'll email a sign-in code to ${maskEmail(user.email)}`}
          </p>
        </div>

        <VerifyLoginForm codeSent={codeSent} />
      </div>
    </AuthLayout>
  );
}
