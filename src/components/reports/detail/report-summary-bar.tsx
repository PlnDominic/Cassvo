import { ReportKindBadge } from "../report-kind-badge";
import type { ReportDetail } from "@/lib/data/reports";

export function ReportSummaryBar({ report }: { report: ReportDetail }) {
  return (
    <div className="flex flex-col divide-y divide-[#ececed] rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:flex-row sm:divide-x sm:divide-y-0">
      <div className="flex-1 px-6 py-5">
        <p className="mb-1 text-xs text-[#939393]">Report Type</p>
        <ReportKindBadge kind={report.kind} />
      </div>
      <div className="flex-1 px-6 py-5">
        <p className="mb-1 text-xs text-[#939393]">Reported</p>
        <p className="text-sm font-medium text-[#060606]">{report.date}</p>
      </div>
      <div className="flex-1 px-6 py-5">
        <p className="mb-1 text-xs text-[#939393]">Total Reports</p>
        <p className="text-sm font-medium text-[#060606]">
          {report.totalReports} {report.totalReports === 1 ? "Report" : "Reports"}
        </p>
      </div>
    </div>
  );
}
