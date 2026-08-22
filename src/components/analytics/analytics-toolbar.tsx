import { Upload } from "lucide-react";
import { PeriodDropdown } from "../dashboard/period-dropdown";

export function AnalyticsToolbar() {
  return (
    <div className="flex items-center gap-3">
      <PeriodDropdown defaultValue="This Month" />
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-[#ececed] bg-white px-4 py-2.5 text-xs font-medium text-[#060606]"
      >
        Export
        <Upload size={14} />
      </button>
    </div>
  );
}
