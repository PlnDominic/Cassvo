import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsToolbar } from "@/components/analytics/analytics-toolbar";
import { AnalyticsLineChart } from "@/components/analytics/analytics-line-chart";
import { TopBusinessesCard, type TopBusiness } from "@/components/analytics/top-businesses-card";
import { CategoryPerformanceBars } from "@/components/analytics/category-performance-bars";
import { getUserCounts } from "@/lib/data/users";
import { getBusinessCounts } from "@/lib/data/businesses";
import { getReviewCounts } from "@/lib/data/reviews";
import {
  getTrendingBusinesses,
  getCategoryPerformance,
  getReviewGrowth,
  getMemberGrowth,
} from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [users, businesses, reviews, trending, categories, reviewGrowth, memberGrowth] = await Promise.all([
    getUserCounts(),
    getBusinessCounts(),
    getReviewCounts(),
    getTrendingBusinesses(4),
    getCategoryPerformance(),
    getReviewGrowth(),
    getMemberGrowth(),
  ]);

  const topBusinesses: TopBusiness[] = trending.map((b) => ({
    name: b.name,
    category: b.category,
    rating: b.rating,
    reviewCount: b.reviewCount,
    change: "—",
    photoUrl: b.photoUrl,
  }));

  const categoryBars = categories.map((c) => ({ label: c.name, percent: c.percent }));

  const newUsers = memberGrowth.reduce((sum, p) => sum + p.value, 0);
  const growthRate = users.total > 0 ? Math.round((newUsers / users.total) * 100) : 0;

  return (
    <DashboardShell title="Analytics">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Check performance and growth" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="User Growth Rate" value={`${growthRate} %`} />
          <StatCard label="Total Users" value={formatNumber(users.total)} />
          <StatCard label="Total Businesses" value={formatNumber(businesses.onboarded)} />
          <StatCard label="Total Reviews" value={formatNumber(reviews.total)} />
        </div>

        <AnalyticsToolbar
          userGrowth={memberGrowth}
          reviewGrowth={reviewGrowth}
          topBusinesses={topBusinesses}
          categories={categoryBars}
        />

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_300px]">
          <AnalyticsLineChart
            title="User Growth"
            total={formatNumber(users.total)}
            changeText={`+ ${growthRate}%`}
            points={memberGrowth}
          />
          <TopBusinessesCard businesses={topBusinesses} />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[340px_1fr]">
          <CategoryPerformanceBars items={categoryBars} />
          <AnalyticsLineChart
            title="Review Growth"
            total={formatNumber(reviews.total)}
            changeText={`+ ${reviewGrowth.reduce((s, p) => s + p.value, 0)}`}
            points={reviewGrowth}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
