"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StepIndicator } from "./step-indicator";
import { BusinessInfoStep } from "./business-info-step";
import { DetailsStep } from "./details-step";
import { VerificationStep } from "./verification-step";
import { ReviewStep } from "./review-step";
import { EMPTY_ONBOARD_DATA, type OnboardBusinessData } from "./types";

const STEP_SUBTITLES: Record<number, string> = {
  1: "Onboard a business",
  2: "Add more information about the business",
  3: "Verify the authenticity of the business",
  4: "Preview before onboarding",
};

export function OnboardBusinessWizard({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardBusinessData>(EMPTY_ONBOARD_DATA);
  const [result, setResult] = useState<"draft" | "verified" | null>(null);

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
    setStep((s) => s + 1);
  }

  if (result) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-16 text-center shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
        <h2 className="text-lg font-medium text-[#060606]">
          {result === "draft" ? "Saved as draft" : "Business onboarded"}
        </h2>
        <p className="max-w-md text-sm text-[#939393]">
          {result === "draft"
            ? `${data.name || "This business"} has been saved and can be finished later.`
            : `${data.name || "This business"} has been confirmed and onboarded to Cassvo.`}
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
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        name={adminName}
        initial={adminName.trim().charAt(0).toUpperCase() || "?"}
        subtitle={STEP_SUBTITLES[step]}
        greeting="Hi,"
      />

      <div className="flex flex-col gap-8">
        <StepIndicator current={step} />

        {step === 4 ? (
          <ReviewStep data={data} onSaveDraft={() => setResult("draft")} onConfirm={() => setResult("verified")} />
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
            {step === 1 && <BusinessInfoStep data={data} onChange={patch} />}
            {step === 2 && <DetailsStep data={data} onChange={patch} />}
            {step === 3 && <VerificationStep data={data} onChange={patch} />}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl border border-[#ececed] bg-white px-6 py-3 text-sm font-medium text-[#060606]"
          >
            Back
          </button>

          {step < 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white"
            >
              Next
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
