import { BusinessPreviewCard } from "./business-preview-card";
import type { OnboardBusinessData } from "./types";

export function ReviewStep({
  data,
  onSaveDraft,
  onConfirm,
}: {
  data: OnboardBusinessData;
  onSaveDraft: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_180px]">
      <BusinessPreviewCard data={data} />

      <div className="flex flex-row gap-3 lg:flex-col">
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-xl bg-[#f2f2f3] px-6 py-3 text-sm font-medium text-[#939393]"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white"
        >
          Confirm & Onboard
        </button>
      </div>
    </div>
  );
}
