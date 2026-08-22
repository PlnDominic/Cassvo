import { Search, Check, X, Info } from "lucide-react";

export function ReportActionsToolbar({
  onResolve,
  onRemoveReview,
  onRequestMoreReview,
  onSuspendUser,
}: {
  onResolve: () => void;
  onRemoveReview: () => void;
  onRequestMoreReview: () => void;
  onSuspendUser: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex h-[39px] flex-1 min-w-[200px] items-center gap-2 rounded-[10px] border border-[#ececed] px-[10px]">
        <Search size={16} className="shrink-0 text-black/60" />
        <input
          type="search"
          placeholder="search anything"
          className="h-full w-full bg-transparent text-sm font-medium text-black placeholder:text-black/60 focus:outline-none"
        />
      </label>

      <button
        type="button"
        onClick={onResolve}
        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white"
      >
        <Check size={16} />
        Resolved
      </button>
      <button
        type="button"
        onClick={onRemoveReview}
        className="rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white"
      >
        Remove Review
      </button>
      <button
        type="button"
        onClick={onRequestMoreReview}
        className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-medium text-amber-600"
      >
        <Info size={16} />
        Request More Review
      </button>
      <button
        type="button"
        onClick={onSuspendUser}
        className="flex items-center gap-2 rounded-xl border border-[#ececed] bg-white px-5 py-2.5 text-sm font-medium text-[#060606]"
      >
        <X size={16} />
        Suspend User
      </button>
    </div>
  );
}
