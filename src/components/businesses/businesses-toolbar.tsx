import Link from "next/link";
import { Plus } from "lucide-react";
import { FilterDropdown } from "../reviews/filter-dropdown";
import type { BusinessTab } from "./business-tabs";

const STATUS_OPTIONS: { label: string; tab: BusinessTab }[] = [
  { label: "All Status", tab: "all" },
  { label: "Pending", tab: "pending" },
  { label: "Confirmed", tab: "confirmed" },
  { label: "Suspended", tab: "suspended" },
];

export function BusinessesToolbar({
  categoryOptions,
  categoryValue,
  onCategoryChange,
  statusTab,
  onStatusChange,
}: {
  /** Real category titles — see getCategories(); "All Categories" is prepended by the caller. */
  categoryOptions: string[];
  categoryValue: string;
  onCategoryChange: (value: string) => void;
  /** Mirrors BusinessTabs' own active tab — this dropdown is a second control over the same state, kept in sync with it. */
  statusTab: BusinessTab;
  onStatusChange: (tab: BusinessTab) => void;
}) {
  const statusLabel = STATUS_OPTIONS.find((s) => s.tab === statusTab)?.label ?? "All Status";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <FilterDropdown
          key={categoryValue}
          options={categoryOptions}
          defaultValue={categoryValue}
          onChange={onCategoryChange}
        />
        <FilterDropdown
          key={statusTab}
          options={STATUS_OPTIONS.map((s) => s.label)}
          defaultValue={statusLabel}
          onChange={(label) => {
            const match = STATUS_OPTIONS.find((s) => s.label === label);
            if (match) onStatusChange(match.tab);
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/businesses/drafts"
          className="rounded-xl bg-[#f2f2f3] px-5 py-2.5 text-sm font-medium text-[#939393] hover:text-[#060606]"
        >
          Drafts
        </Link>
        <Link
          href="/businesses/new"
          className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={16} />
          Add Business
        </Link>
      </div>
    </div>
  );
}
