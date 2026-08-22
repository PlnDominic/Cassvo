import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsToolbar } from "@/components/analytics/analytics-toolbar";
import { AnalyticsLineChart, type ChartPoint } from "@/components/analytics/analytics-line-chart";
import { TopBusinessesCard, type TopBusiness } from "@/components/analytics/top-businesses-card";
import { CategoryPerformanceBars, type CategoryPerformanceItem } from "@/components/analytics/category-performance-bars";
import skyLounge from "../../../public/images/dashboard/photo-sky-lounge.png";
import photoBusiness1 from "../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../public/images/dashboard/photo-business-2.png";

const userGrowthPoints: ChartPoint[] = [
  { label: "May 6", value: 700 },
  { label: "May 7", value: 1300 },
  { label: "May 8", value: 1050 },
  { label: "May 9", value: 1400 },
  { label: "May 10", value: 2400 },
  { label: "May 11", value: 750 },
  { label: "May 12", value: 1550 },
  { label: "May 13", value: 1750 },
];

const reviewGrowthPoints: ChartPoint[] = [
  { label: "May 6", value: 550 },
  { label: "May 7", value: 1450 },
  { label: "May 8", value: 950 },
  { label: "May 9", value: 1150 },
  { label: "May 10", value: 2400 },
  { label: "May 11", value: 800 },
  { label: "May 12", value: 1500 },
  { label: "May 13", value: 1900 },
];

const topBusinesses: TopBusiness[] = [
  { name: "Kofi's Kitchen", category: "Food & Dining", rating: 4.8, reviewCount: 128, change: "+5%", photo: photoBusiness1 },
  { name: "Blooms Space", category: "Beauty & Fashion", rating: 4.8, reviewCount: 128, change: "+5%", photo: photoBusiness2 },
  { name: "Sky Lounge", category: "NightLife", rating: 4.8, reviewCount: 128, change: "+5%", photo: skyLounge },
  { name: "Kempinski", category: "Hotel", rating: 4.8, reviewCount: 128, change: "+5%", photo: photoBusiness1 },
];

const categoryPerformance: CategoryPerformanceItem[] = [
  { label: "Beauty & Fashion", percent: 90 },
  { label: "Event Vendors", percent: 75 },
  { label: "Explore Ghana", percent: 65 },
  { label: "NightLife", percent: 55 },
  { label: "Food & Dining", percent: 45 },
  { label: "Hotel & Lodging", percent: 35 },
  { label: "Others", percent: 40 },
];

export default function AnalyticsPage() {
  return (
    <DashboardShell title="Analytics">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Check performance and growth" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="User Growth Rate" value="22 %" trend={{ type: "up", text: "8.5% Up from last Week" }} />
          <StatCard label="Total Users" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Total Businesses" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Page Views" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
        </div>

        <AnalyticsToolbar />

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_300px]">
          <AnalyticsLineChart title="User Growth" total="34,302" changeText="+ 8.5%" points={userGrowthPoints} />
          <TopBusinessesCard businesses={topBusinesses} />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[340px_1fr]">
          <CategoryPerformanceBars items={categoryPerformance} />
          <AnalyticsLineChart title="Review Growth" total="34,302" changeText="+ 8.5%" points={reviewGrowthPoints} />
        </div>
      </div>
    </DashboardShell>
  );
}
