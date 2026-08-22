import { Avatar } from "../../dashboard/avatar";
import { Badge } from "../../ui/badge";
import type { ReportDetailData } from "./types";

export function EvidenceCard({ report }: { report: ReportDetailData }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Evidence Submitted</h3>
        <p className="mb-3 text-xs text-[#939393]">Reporter</p>
        <div className="flex items-center gap-3">
          <Avatar name={report.reporterName} size={44} />
          <div>
            <p className="text-sm font-medium text-[#060606]">
              {report.reporterName}, {report.reporterLocation}
            </p>
            <p className="text-xs text-[#939393]">{report.reporterTimeAgo}</p>
          </div>
        </div>
        {report.reporterVerified && (
          <div className="mt-2">
            <Badge variant="green">Verified User</Badge>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs text-[#939393]">Reason</p>
        <p className="text-sm leading-relaxed text-[#060606]">{report.evidenceReasonText}</p>
      </div>
    </div>
  );
}
