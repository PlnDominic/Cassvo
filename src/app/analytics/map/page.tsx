import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { PeriodDropdown } from "@/components/dashboard/period-dropdown";
import { OverviewStatsCard, type OverviewStat } from "@/components/analytics/overview-stats-card";
import { GhanaMapCard } from "@/components/analytics/ghana-map-card";
import { TopRegionsCard, type TopRegion } from "@/components/analytics/top-regions-card";
import { RegionPerformanceOverview, type RegionPerformance } from "@/components/analytics/region-performance-overview";
import { DownloadReportButton } from "@/components/analytics/download-report-button";
import { getReviewCounts } from "@/lib/data/reviews";
import { getBusinessCounts } from "@/lib/data/businesses";
import { getRegionStats } from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const REGION_COLORS = ["#ea0505", "#f59e0b", "#14b8a6", "#6366f1", "#f97316", "#8b5cf6"];

export default async function ReviewMapAnalysisPage() {
  const [reviews, businesses, regions] = await Promise.all([
    getReviewCounts(),
    getBusinessCounts(),
    getRegionStats(),
  ]);

  const overviewStats: OverviewStat[] = [
    { label: "Total Reviews", value: formatNumber(reviews.total) },
    { label: "Active Businesses", value: formatNumber(businesses.onboarded) },
    { label: "Regions", value: formatNumber(regions.length) },
    { label: "Average Rating", value: reviews.averageRating !== null ? String(reviews.averageRating) : "—" },
  ];

  const topRegions: TopRegion[] = regions.slice(0, 4).map((r, i) => ({
    name: r.name,
    value: formatNumber(r.reviewCount),
    color: REGION_COLORS[i % REGION_COLORS.length],
  }));

  const regionPerformance: RegionPerformance[] = regions.slice(0, 5).map((r) => ({
    name: r.name,
    reviewCount: formatNumber(r.reviewCount),
    rating: r.averageRating !== null ? String(r.averageRating) : "—",
    trend: "—",
  }));

  return (
    <DashboardShell title="Review Map Analysis" backHref="/analytics">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="See how Cassvo is growing in Ghana" />

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
