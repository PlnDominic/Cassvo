import { ReportSummaryBar } from "./report-summary-bar";
import { ReportMetaRow } from "./report-meta-row";
import { ReportedContentCard } from "./reported-content-card";
import type { ReportDetail } from "@/lib/data/reports";

export function ReportDetailBoard({ report }: { report: ReportDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <ReportSummaryBar report={report} />
      <ReportMetaRow report={report} />
      <ReportedContentCard report={report} />
    </div>
  );
}
