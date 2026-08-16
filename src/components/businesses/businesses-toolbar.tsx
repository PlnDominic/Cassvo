import Link from "next/link";
import { Plus } from "lucide-react";
import { FilterDropdown } from "../reviews/filter-dropdown";

export function BusinessesToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <FilterDropdown
          options={["All Categories", "Food & Dining", "Beauty & Fashion", "Event Vendors", "Online Shops", "NightLife", "Others"]}
          defaultValue="All Categories"
        />
        <FilterDropdown options={["All Status", "Pending", "Confirmed", "Suspended"]} defaultValue="All Status" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl bg-[#f2f2f3] px-5 py-2.5 text-sm font-medium text-[#939393]"
        >
          Drafts
        </button>
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
