import { Check, Loader2, Search } from "lucide-react";
import { FilterDropdown } from "../reviews/filter-dropdown";

export function ModerationToolbar({
  onApproveAll,
  approveAllDisabled,
  approveAllPending,
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  rating,
  onRatingChange,
  month,
  onMonthChange,
}: {
  onApproveAll: () => void;
  approveAllDisabled: boolean;
  approveAllPending: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  category: string;
  onCategoryChange: (value: string) => void;
  rating: string;
  onRatingChange: (value: string) => void;
  month: string;
  onMonthChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onApproveAll}
        disabled={approveAllDisabled || approveAllPending}
        className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {approveAllPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
        Approve All
      </button>

      <label className="flex h-[39px] flex-1 min-w-[180px] items-center gap-2 rounded-[10px] border border-[#ececed] px-[10px]">
        <Search size={16} className="shrink-0 text-black/60" />
        <input
          type="search"
          placeholder="search anything"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-full w-full bg-transparent text-sm font-medium text-black placeholder:text-black/60 focus:outline-none"
        />
      </label>

      <FilterDropdown options={["Category", ...categories]} defaultValue={category} onChange={onCategoryChange} />
      <FilterDropdown
        options={["Rating", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]}
        defaultValue={rating}
        onChange={onRatingChange}
      />
      <FilterDropdown
        options={["Month", "This Week", "This Month", "This Year"]}
        defaultValue={month}
        onChange={onMonthChange}
      />
    </div>
  );
}
