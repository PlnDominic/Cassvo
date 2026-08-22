import { FilterDropdown } from "../reviews/filter-dropdown";

export function ReportsToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown options={["All Types", "Review", "Business", "User"]} defaultValue="All Types" />
      <FilterDropdown options={["All Status", "Pending", "Investigating", "Resolved"]} defaultValue="All Status" />
      <FilterDropdown options={["Filters", "Today", "This Week", "This Month"]} defaultValue="Filters" />
    </div>
  );
}
