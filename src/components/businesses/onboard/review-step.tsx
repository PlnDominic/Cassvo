import { Loader2, TriangleAlert } from "lucide-react";
import { BusinessPreviewCard } from "./business-preview-card";
import type { OnboardBusinessData } from "./types";

export function ReviewStep({
  data,
  pending,
  error,
  onSaveDraft,
  onConfirm,
}: {
  data: OnboardBusinessData;
  pending: boolean;
  error: string | null;
  onSaveDraft: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="flex items-center gap-2 rounded-xl bg-brand-red/10 px-4 py-3 text-sm font-medium text-brand-red">
          <TriangleAlert size={16} className="shrink-0" />
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_180px]">
        <BusinessPreviewCard data={data} />

        <div className="flex flex-row gap-3 lg:flex-col">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={pending}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#f2f2f3] px-6 py-3 text-sm font-medium text-[#939393] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            Confirm & Onboard
          </button>
        </div>
      </div>
    </div>
  );
}
