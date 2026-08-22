import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReportsToolbar } from "@/components/reports/reports-toolbar";
import { ReportsTable } from "@/components/reports/reports-table";
import type { ReportRow } from "@/components/reports/types";

const reports: ReportRow[] = [
  { id: "1", reportedItem: "KikiBees review By AmaA", type: "Review", reportedBy: "Nana Yaw", reason: "fake review", date: "2 mins ago", status: "pending", highlighted: true },
  { id: "2", reportedItem: "Sky Lounge", type: "Business", reportedBy: "Evelyn Sagie", reason: "Misleading Info", date: "10 mins ago", status: "investigating" },
  { id: "3", reportedItem: "User", type: "User", reportedBy: "Bill Smith", reason: "Spam", date: "18 mins ago", status: "pending" },
  { id: "4", reportedItem: "Coco lounge", type: "Review", reportedBy: "Angela Alor", reason: "Inapproriate", date: "2hrs ago", status: "resolved" },
  { id: "5", reportedItem: "Kempinski", type: "Business", reportedBy: "Danis Yawson", reason: "Scam", date: "4 days ago", status: "investigating" },
  { id: "6", reportedItem: "Lilys Catering Services", type: "Business", reportedBy: "Ella Williams", reason: "Misleading", date: "1 week ago", status: "resolved" },
];

export default function ReportsPage() {
  return (
    <DashboardShell title="Report">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Moderate and manage reports" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard label="Total Reports" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Resolved Reports" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Pending" value="40,689" />
        </div>

        <ReportsToolbar />

        <ReportsTable reports={reports} />
      </div>
    </DashboardShell>
  );
}
