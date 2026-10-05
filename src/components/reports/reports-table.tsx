import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { ReportKindBadge } from "./report-kind-badge";
import type { ReportRow } from "./types";

export function ReportsTable({
  reports,
  isEscalated,
}: {
  reports: ReportRow[];
  isEscalated: (report: ReportRow) => boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-sm text-[#060606]">
            <th className="px-6 py-4 font-medium">Reported Item</th>
            <th className="px-6 py-4 font-medium">Type</th>
            <th className="px-6 py-4 font-medium">Reported By</th>
            <th className="px-6 py-4 font-medium">Reason</th>
            <th className="px-6 py-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-b border-[#ececed] last:border-b-0">
              <td className="px-6 py-4 font-medium text-[#060606]">
                <div className="flex flex-col items-start gap-1.5">
                  <Link href={`/reports/${report.id}`} className="hover:text-brand-red">
                    {report.reportedItem}
                  </Link>
                  {isEscalated(report) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 px-2.5 py-0.5 text-xs font-medium text-brand-red">
                      <TriangleAlert size={12} />
                      Escalated · {report.targetReportCount} reports
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <ReportKindBadge kind={report.kind} />
              </td>
              <td className="px-6 py-4 text-[#606060]">{report.reportedBy}</td>
              <td className="px-6 py-4 text-[#606060]">{report.reason}</td>
              <td className="px-6 py-4 text-[#939393]">{report.date}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#939393]">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
