import { Avatar } from "../../dashboard/avatar";
import type { ReportDetailData } from "./types";

export function ReportMetaRow({ report }: { report: ReportDetailData }) {
  const items: { label: string; value: string }[] = [
    { label: "Report Reason", value: report.reason },
    { label: "Reported By", value: report.reportedByName },
    { label: "Against", value: report.against },
    { label: "Total Reports", value: report.totalReports },
    { label: "Current Status", value: report.currentStatus },
  ];

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <Avatar name={item.value} size={36} />
          <div>
            <p className="text-sm font-medium text-[#060606]">{item.label}</p>
            <p className="text-xs text-[#939393]">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
