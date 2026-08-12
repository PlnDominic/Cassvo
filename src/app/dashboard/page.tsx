import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { MostViewedCard } from "@/components/dashboard/most-viewed-card";
import { TrustScoreCard } from "@/components/dashboard/trust-score-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TrendingBusinessesCard } from "@/components/dashboard/trending-businesses-card";
import { ReviewsMapCard } from "@/components/dashboard/reviews-map-card";
import { CategoryPerformanceCard } from "@/components/dashboard/category-performance-card";

const stats: { label: string; value: string; trend: { type: "up" | "attention"; text: string } }[] = [
  { label: "Total Reviews", value: "40,689", trend: { type: "up", text: "8.5% Up from yesterday" } },
  { label: "Pending Reviews", value: "40,689", trend: { type: "attention", text: "Needs attention" } },
  { label: "Total Users", value: "40,689", trend: { type: "up", text: "8.5% Up from yesterday" } },
  { label: "Total Businesses", value: "40,689", trend: { type: "up", text: "8.5% Up from yesterday" } },
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-5">
          <div className="flex size-13 shrink-0 items-center justify-center rounded-full bg-brand-red text-xl font-medium text-white">
            A
          </div>
          <div>
            <h1 className="text-xl font-medium text-[#060606]">Welcome Angela. A</h1>
            <p className="text-base text-[#060606]">Here is what is happening on Cassvo today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
          <MostViewedCard />
          <TrustScoreCard />
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <TrendingBusinessesCard />
          <ReviewsMapCard />
          <CategoryPerformanceCard />
        </div>

        <RecentActivity />
      </div>
    </DashboardShell>
  );
}
