import { Search } from "lucide-react";
import { FilterDropdown } from "../reviews/filter-dropdown";

export function NotificationsToolbar({
  onMarkAllRead,
  markAllDisabled,
}: {
  onMarkAllRead: () => void;
  markAllDisabled: boolean;
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

      <FilterDropdown options={["Filters", "Review", "Business", "Users"]} defaultValue="Filters" />

      <button
        type="button"
        onClick={onMarkAllRead}
        disabled={markAllDisabled}
        className="rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        Mark all as read
      </button>
    </div>
  );
}
