"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 59;

export function OtpVerifyForm() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isComplete = digits.every((d) => d !== "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isComplete) return;
    router.push("/reset-password");
  }

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[99px]">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-medium tracking-[0.01em] text-white sm:text-2xl">
          Enter 6 - digit code
        </p>
        <div className="flex gap-2" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`h-[60px] w-[77px] rounded-xl border-[0.5px] bg-transparent text-center text-base font-medium text-white focus:outline-none ${
                digit ? "border-brand-red" : "border-line"
              }`}
            />
          ))}
        </div>
        {secondsLeft > 0 ? (
          <p className="text-xl font-medium tracking-[0.01em] text-white sm:text-2xl">
            Resend Code in {minutes}:{seconds}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setSecondsLeft(RESEND_SECONDS)}
            className="w-fit text-xl font-medium tracking-[0.01em] text-brand-red sm:text-2xl"
          >
            Resend Code
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={!isComplete}
        className="flex h-[60px] w-full items-center justify-center rounded-[10px] border border-white/10 bg-brand-red text-2xl font-medium tracking-[0.01em] text-white disabled:opacity-50"
      >
        Continue
      </button>
    </form>
  );
}
