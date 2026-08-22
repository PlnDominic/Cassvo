import Link from "next/link";
import { Star } from "lucide-react";
import { Avatar } from "../../dashboard/avatar";
import type { ReportDetail } from "@/lib/data/reports";

export function ReportedContentCard({ report }: { report: ReportDetail }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Reporter</h3>
        <div className="flex items-center gap-3">
          <Avatar name={report.reporterName} size={44} />
          <div>
            <p className="text-sm font-medium text-[#060606]">{report.reporterName}</p>
            <p className="text-xs text-[#939393]">{report.reporterTimeAgo}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs text-[#939393]">{report.kind === "review" ? "Reason" : "Message"}</p>
        <p className="text-sm leading-relaxed text-[#060606]">{report.reason}</p>
      </div>

      {report.kind === "review" && (
        <div className="rounded-xl border border-[#ececed] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs text-[#939393]">Reported Review</p>
            {report.reviewRating !== null && (
              <span className="flex items-center gap-1 text-xs font-medium text-[#060606]">
                <Star size={13} className="fill-brand-red text-brand-red" />
                {report.reviewRating}
              </span>
            )}
          </div>
          {report.reviewContent && (
            <p className="mb-3 text-sm leading-relaxed text-[#060606]">&ldquo;{report.reviewContent}&rdquo;</p>
          )}
          {report.businessId && (
            <Link
              href={`/businesses/${report.businessId}/reviews`}
              className="text-xs font-medium text-brand-red hover:underline"
            >
              View all reviews for {report.businessName}
            </Link>
          )}
        </div>
      )}

      {report.kind === "problem" && report.contactEmail && (
        <div className="rounded-xl border border-[#ececed] p-4">
          <p className="mb-1 text-xs text-[#939393]">Reply to</p>
          <a href={`mailto:${report.contactEmail}`} className="text-sm font-medium text-brand-red hover:underline">
            {report.contactEmail}
          </a>
        </div>
      )}
    </div>
  );
}
