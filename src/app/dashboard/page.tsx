import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { MostViewedCard } from "@/components/dashboard/most-viewed-card";
import { TrustScoreCard } from "@/components/dashboard/trust-score-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TrendingBusinessesCard } from "@/components/dashboard/trending-businesses-card";
import { ReviewsMapCard } from "@/components/dashboard/reviews-map-card";
import { CategoryPerformanceCard } from "@/components/dashboard/category-performance-card";
import { getReviewCounts } from "@/lib/data/reviews";
import { getCurrentAdmin } from "@/lib/data/admins";
import { getUserCounts } from "@/lib/data/users";
import { getBusinessCounts } from "@/lib/data/businesses";
import {
  getTrendingBusinesses,
  getMostViewedBusiness,
  getRecentActivity,
  getCategoryPerformance,
  getCityStats,
  getTrustScore,
} from "@/lib/data/dashboard";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [admin, reviews, users, businesses, trending, mostViewed, activity, categories, cities, trustScore] = await Promise.all([
    getCurrentAdmin(),
    getReviewCounts(),
    getUserCounts(),
    getBusinessCounts(),
    getTrendingBusinesses(),
    getMostViewedBusiness(),
    getRecentActivity(),
    getCategoryPerformance(),
    getCityStats(),
    getTrustScore(),
  ]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-full bg-brand-red text-xl font-medium text-white">
            {admin?.name?.trim().charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="text-xl font-medium text-[#060606]">{admin ? `Welcome ${admin.name}` : "Welcome"}</h1>
            <p className="text-base text-[#060606]">Here is what is happening on Cassvo today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Reviews" value={formatNumber(reviews.total)} />
          <StatCard
            label="Pending Reviews"
            value={formatNumber(reviews.pending)}
            trend={reviews.pending > 0 ? { type: "attention", text: "Needs attention" } : undefined}
          />
          <StatCard label="Total Users" value={formatNumber(users.total)} />
          <StatCard label="Total Businesses" value={formatNumber(businesses.onboarded)} />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
          <MostViewedCard business={mostViewed} />
          <TrustScoreCard score={trustScore} />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <TrendingBusinessesCard businesses={trending} />
          <ReviewsMapCard cities={cities} />
          <CategoryPerformanceCard categories={categories} />
        </div>

        <RecentActivity activity={activity} />
      </div>
    </DashboardShell>
  );
}
