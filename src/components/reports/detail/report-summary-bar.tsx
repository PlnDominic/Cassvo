import { ReportStatusBadge } from "../report-status-badge";
import type { ReportDetailData } from "./types";

const PRIORITY_CLASSES: Record<ReportDetailData["priority"], string> = {
  High: "text-brand-red",
  Medium: "text-amber-500",
  Low: "text-emerald-600",
};

export function ReportSummaryBar({ report }: { report: ReportDetailData }) {
  return (
    <div className="flex flex-col divide-y divide-[#ececed] rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:flex-row sm:divide-x sm:divide-y-0">
      <div className="flex-1 px-6 py-5">
        <p className="mb-1 text-xs text-[#939393]">Report ID</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#060606]">{report.refId}</span>
          <ReportStatusBadge status={report.status} />
        </div>
      </div>
      <div className="flex-1 px-6 py-5">
        <p className="mb-1 text-xs text-[#939393]">Reported By</p>
        <p className="text-sm font-medium text-[#060606]">{report.reportedDate}</p>
      </div>
      <div className="flex-1 px-6 py-5">
        <p className="mb-1 text-xs text-[#939393]">Priority</p>
        <p className={`text-sm font-medium ${PRIORITY_CLASSES[report.priority]}`}>{report.priority}</p>
      </div>
    </div>
  );
}
