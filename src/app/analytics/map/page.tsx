import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { PeriodDropdown } from "@/components/dashboard/period-dropdown";
import { OverviewStatsCard, type OverviewStat } from "@/components/analytics/overview-stats-card";
import { GhanaMapCard } from "@/components/analytics/ghana-map-card";
import { TopRegionsCard, type TopRegion } from "@/components/analytics/top-regions-card";
import { RegionPerformanceOverview, type RegionPerformance } from "@/components/analytics/region-performance-overview";
import { DownloadReportButton } from "@/components/analytics/download-report-button";

const overviewStats: OverviewStat[] = [
  { label: "Total Reviews", value: "1,890,096", trend: "8.5% Up from yesterday" },
  { label: "Active Businesses", value: "1,890,096", trend: "8.5% Up from last Month" },
  { label: "Countries", value: "32" },
  { label: "Average Rating", value: "4.7", trend: "8.5% Up from last Month" },
];

const topRegions: TopRegion[] = [
  { name: "Accra", value: "42,231", color: "#ea0505" },
  { name: "Ashanti", value: "42,231", color: "#f59e0b" },
  { name: "Western", value: "42,231", color: "#14b8a6" },
  { name: "Central", value: "42,231", color: "#6366f1" },
];

const regionPerformance: RegionPerformance[] = [
  { name: "Greater Accra", reviewCount: "4,980", rating: "4.7", trend: "8.5%" },
  { name: "Ashanti Region", reviewCount: "4,980", rating: "4.7", trend: "8.5%" },
  { name: "Volta Region", reviewCount: "4,980", rating: "4.7", trend: "8.5%" },
  { name: "Upper East", reviewCount: "4,980", rating: "4.7", trend: "8.5%" },
  { name: "Western Region", reviewCount: "4,980", rating: "4.7", trend: "8.5%" },
];

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Review Map Analysis" backHref="/analytics">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="See how Cassvo is growing in Ghana" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-[39px] items-center rounded-[10px] border border-[#ececed] px-4 text-xs font-medium tracking-[0.01em] text-[#060606]">
              Ghana
            </span>
            <PeriodDropdown defaultValue="This Month" />
          </div>
          <DownloadReportButton stats={overviewStats} regions={regionPerformance} />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[233px_1fr_273px]">
          <OverviewStatsCard stats={overviewStats} />
          <GhanaMapCard />
          <TopRegionsCard regions={topRegions} />
        </div>

        <RegionPerformanceOverview regions={regionPerformance} />
      </div>
    </DashboardShell>
  );
}
