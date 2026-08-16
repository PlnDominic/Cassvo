"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { StepIndicator } from "./step-indicator";
import { BusinessInfoStep } from "./business-info-step";
import { DetailsStep } from "./details-step";
import { VerificationStep } from "./verification-step";
import { ReviewStep } from "./review-step";
import { EMPTY_ONBOARD_DATA, type OnboardBusinessData } from "./types";

export function OnboardBusinessWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardBusinessData>(EMPTY_ONBOARD_DATA);
  const [submitted, setSubmitted] = useState(false);

  function patch(update: Partial<OnboardBusinessData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  function handleBack() {
    if (step === 1) {
      router.push("/businesses");
      return;
    }
    setStep((s) => s - 1);
  }

  function handleNext() {
    if (step === 4) {
      setSubmitted(true);
      return;
    }
    setStep((s) => s + 1);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-16 text-center shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
        <h2 className="text-lg font-medium text-[#060606]">Business submitted for review</h2>
        <p className="max-w-md text-sm text-[#939393]">
          {data.name || "This business"} has been submitted and is now pending verification.
        </p>
        <button
          type="button"
          onClick={() => router.push("/businesses")}
          className="mt-3 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white"
        >
          Back to Businesses
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator current={step} />

      <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
        {step === 1 && <BusinessInfoStep data={data} onChange={patch} />}
        {step === 2 && <DetailsStep data={data} onChange={patch} />}
        {step === 3 && <VerificationStep data={data} onChange={patch} />}
        {step === 4 && <ReviewStep data={data} />}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="rounded-xl border border-[#ececed] bg-white px-6 py-3 text-sm font-medium text-[#060606]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-1.5 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white"
        >
          {step === 4 ? "Submit" : "Next"}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
