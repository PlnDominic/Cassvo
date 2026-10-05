import { ReportSummaryBar } from "./report-summary-bar";
import { ReportMetaRow } from "./report-meta-row";
import { ReportedContentCard } from "./reported-content-card";
import type { ReportDetail } from "@/lib/data/reports";

export function ReportDetailBoard({ report, escalated }: { report: ReportDetail; escalated: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <ReportSummaryBar report={report} escalated={escalated} />
      <ReportMetaRow report={report} />
      <ReportedContentCard report={report} />
    </div>
  );
}
