import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { ReportDetailBoard } from "@/components/reports/detail/report-detail-board";
import type { ReportDetailData } from "@/components/reports/detail/types";
import photoBusiness1 from "../../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../../public/images/dashboard/photo-business-2.png";
import skyLounge from "../../../../public/images/dashboard/photo-sky-lounge.png";

const report: ReportDetailData = {
  refId: "#RP-2025--143",
  status: "pending",
  reportedDate: "May 21, 2026 . 2:33PM",
  priority: "High",
  reason: "Fake Review",
  reportedByName: "Angela A.",
  against: "Sky Lounge",
  totalReports: "3 Reports",
  currentStatus: "Under Investigation",
  reporterName: "Ama",
  reporterLocation: "East Legon",
  reporterTimeAgo: "2mins ago",
  reporterVerified: true,
  evidenceReasonText:
    "The appears to be a fake review. The uploaded photos do not belong to sky Lounge and several users have mentioned similar concerns",
  images: [photoBusiness1, photoBusiness2, skyLounge],
  recommendationTitle: "Escalate for review",
  recommendationText: "This review has a high risk score and requires moderator attention",
};

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await params;

  return (
    <DashboardShell title="Report Details">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Review report details, evidence and moderation actions" greeting="Hi," />
        <ReportDetailBoard report={report} />
      </div>
    </DashboardShell>
  );
}
