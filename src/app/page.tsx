import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { TextField } from "@/components/ui/text-field";
import { GoogleIcon } from "@/components/icons/google-icon";
import { RuleLine } from "@/components/icons/rule-line";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-1 text-white">
          <h1 className="text-4xl font-medium sm:text-5xl lg:text-6xl">
            Welcome
          </h1>
          <p className="text-lg sm:text-2xl">
            Sign into your Cassvo Admin Account
          </p>
        </div>

        <form className="flex w-full flex-col gap-8">
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            autoComplete="email"
            required
          />

          <div className="flex flex-col gap-2">
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your Password"
              autoComplete="current-password"
              required
            />
            <Link
              href="/forgot-password"
              className="text-base font-medium tracking-[0.01em] text-brand-red"
            >
              Forgot Password
            </Link>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex w-full items-center gap-4">
              <RuleLine className="h-px w-full flex-1" />
              <p className="shrink-0 text-base font-medium tracking-[0.01em] text-line">
                or continue with
              </p>
              <RuleLine className="h-px w-full flex-1" />
            </div>

            <button
              type="button"
              aria-label="Continue with Google"
              className="flex size-[60px] items-center justify-center rounded-full border-[0.5px] border-line bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.1)]"
            >
              <GoogleIcon className="size-5" />
            </button>
          </div>

          <button
            type="submit"
            className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white"
          >
            Login
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
