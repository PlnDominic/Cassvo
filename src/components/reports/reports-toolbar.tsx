import { FilterDropdown } from "../reviews/filter-dropdown";

export function ReportsToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown options={["All Types", "Review Report", "Problem Report"]} defaultValue="All Types" />
      <FilterDropdown options={["Filters", "Today", "This Week", "This Month"]} defaultValue="Filters" />
    </div>
  );
}
