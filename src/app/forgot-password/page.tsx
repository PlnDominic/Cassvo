import { AuthLayout } from "@/components/auth/auth-layout";
import { BackLink } from "@/components/auth/back-link";
import { TextField } from "@/components/ui/text-field";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <BackLink href="/" />
      <div className="flex w-full flex-col gap-16">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">
            Forgot Password
          </h1>
          <p className="text-lg sm:text-2xl">Enter Email to reset Password</p>
        </div>

        <form
          action="/forgot-password/verify"
          className="flex w-full flex-col gap-[99px]"
        >
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <button
            type="submit"
            className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white"
          >
            Continue
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
