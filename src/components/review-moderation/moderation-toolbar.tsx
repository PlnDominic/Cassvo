import { Check, Search } from "lucide-react";
import { FilterDropdown } from "../reviews/filter-dropdown";

export function ModerationToolbar({ onApproveAll, approveAllDisabled }: { onApproveAll: () => void; approveAllDisabled: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onApproveAll}
        disabled={approveAllDisabled}
        className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        <Check size={16} />
        Approve All
      </button>

      <label className="flex h-[39px] flex-1 min-w-[180px] items-center gap-2 rounded-[10px] border border-[#ececed] px-[10px]">
        <Search size={16} className="shrink-0 text-black/60" />
        <input
          type="search"
          placeholder="search anything"
          className="h-full w-full bg-transparent text-sm font-medium text-black placeholder:text-black/60 focus:outline-none"
        />
      </label>

      <FilterDropdown options={["Category", "Food & Dining", "NightLife", "Beauty & Fashion"]} defaultValue="Category" />
      <FilterDropdown options={["Rating", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]} defaultValue="Rating" />
      <FilterDropdown options={["Month", "This Week", "This Month", "This Year"]} defaultValue="Month" />
    </div>
  );
}
