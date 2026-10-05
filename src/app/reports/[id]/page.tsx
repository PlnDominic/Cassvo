import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { ReportDetailBoard } from "@/components/reports/detail/report-detail-board";
import { getReport } from "@/lib/data/reports";
import { getPlatformSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [report, settings] = await Promise.all([getReport(id), getPlatformSettings()]);
  if (!report) notFound();
  const escalated = report.kind === "review" && report.totalReports >= settings.moderation.escalationThreshold;

  return (
    <DashboardShell title="Report Details" backHref="/reports">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle={report.kindLabel} greeting="Hi," />
        <ReportDetailBoard report={report} escalated={escalated} />
      </div>
    </DashboardShell>
  );
}
