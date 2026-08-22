import { Avatar } from "../../dashboard/avatar";
import type { ReportDetail } from "@/lib/data/reports";

export function ReportMetaRow({ report }: { report: ReportDetail }) {
  const items: { label: string; value: string }[] = [
    { label: report.kind === "review" ? "Report Reason" : "Message", value: report.reason },
    { label: "Reported By", value: report.reporterName },
    ...(report.businessName ? [{ label: "Against", value: report.businessName }] : []),
    ...(report.contactEmail ? [{ label: "Contact Email", value: report.contactEmail }] : []),
  ];

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <Avatar name={item.value} size={36} />
          <div>
            <p className="text-sm font-medium text-[#060606]">{item.label}</p>
            <p className="max-w-xs truncate text-xs text-[#939393]">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
