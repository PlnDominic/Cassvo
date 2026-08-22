import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { ReportDetailBoard } from "@/components/reports/detail/report-detail-board";
import type { ReportDetailData } from "@/components/reports/detail/types";
import { getReport } from "@/lib/data/reports";
import { getModerators } from "@/lib/data/admins";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getReport(id);
  if (!record) notFound();

  const moderators = await getModerators();

  const report: ReportDetailData = {
    refId: record.reference,
    status: record.status,
    reportedDate: record.reportedDate,
    priority: (record.priority.charAt(0).toUpperCase() + record.priority.slice(1)) as "High" | "Medium" | "Low",
    reason: record.reason,
    reportedByName: record.reportedByName,
    against: record.againstName,
    totalReports: `${record.totalReports} Report${record.totalReports === 1 ? "" : "s"}`,
    currentStatus: record.status === "investigating" ? "Under Investigation" : record.status,
    reporterName: record.reporterName,
    reporterLocation: record.reporterLocation ?? "—",
    reporterTimeAgo: record.reporterTimeAgo,
    reporterVerified: record.reporterVerified,
    evidenceReasonText: record.details ?? record.reason,
    images: record.images,
    recommendationTitle: record.priority === "high" ? "Escalate for review" : "Review when possible",
    recommendationText:
      record.priority === "high"
        ? "This review has a high risk score and requires moderator attention"
        : "This report is queued for standard moderation review",
  };

  return (
    <DashboardShell title="Report Details" backHref="/reports">
      <div className="flex flex-col gap-6">
        <WelcomeBanner
          name="Angela. A"
          initial="A"
          subtitle="Review report details, evidence and moderation actions"
          greeting="Hi,"
        />
        <ReportDetailBoard report={report} reportId={record.id} moderators={moderators} initialNotes={record.notes ?? ""} />
      </div>
    </DashboardShell>
  );
}
