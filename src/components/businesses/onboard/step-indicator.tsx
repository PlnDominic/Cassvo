export interface OnboardStep {
  step: number;
  label: string;
}

export const ONBOARD_STEPS: OnboardStep[] = [
  { step: 1, label: "Business Info" },
  { step: 2, label: "Details" },
  { step: 3, label: "Verification" },
  { step: 4, label: "Review" },
];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap items-center gap-8">
      {ONBOARD_STEPS.map(({ step, label }) => {
        const active = step === current;
        const complete = step < current;
        return (
          <div key={step} className="flex items-center gap-2.5">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                active || complete ? "bg-brand-red text-white" : "bg-[#ececed] text-[#939393]"
              }`}
            >
              {step}
            </span>
            <span className={`text-sm font-medium ${active ? "text-brand-red" : "text-[#060606]"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
