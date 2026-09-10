import { FilterDropdown } from "../reviews/filter-dropdown";
import type { ReportTypeFilter, ReportDateFilter } from "./types";

const TYPE_OPTIONS: ReportTypeFilter[] = ["All Types", "Review Report", "Problem Report"];
const DATE_OPTIONS: ReportDateFilter[] = ["Filters", "Today", "This Week", "This Month"];

export function ReportsToolbar({
  typeFilter,
  onTypeChange,
  dateFilter,
  onDateChange,
}: {
  typeFilter: ReportTypeFilter;
  onTypeChange: (value: ReportTypeFilter) => void;
  dateFilter: ReportDateFilter;
  onDateChange: (value: ReportDateFilter) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown
        key={typeFilter}
        options={TYPE_OPTIONS}
        defaultValue={typeFilter}
        onChange={(value) => onTypeChange(value as ReportTypeFilter)}
      />
      <FilterDropdown
        key={dateFilter}
        options={DATE_OPTIONS}
        defaultValue={dateFilter}
        onChange={(value) => onDateChange(value as ReportDateFilter)}
      />
    </div>
  );
}
