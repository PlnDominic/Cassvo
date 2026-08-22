import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReportsToolbar } from "@/components/reports/reports-toolbar";
import { ReportsTable } from "@/components/reports/reports-table";
import { getReports, getReportCounts } from "@/lib/data/reports";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [reports, counts] = await Promise.all([getReports(), getReportCounts()]);

  return (
    <DashboardShell title="Report">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Moderate and manage reports" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard label="Total Reports" value={formatNumber(counts.total)} />
          <StatCard label="Resolved Reports" value={formatNumber(counts.resolved)} iconColor="green" />
          <StatCard label="Pending" value={formatNumber(counts.pending)} />
        </div>

        <ReportsToolbar />

        <ReportsTable reports={reports} />
      </div>
    </DashboardShell>
  );
}
