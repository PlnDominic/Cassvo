import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { BusinessesBoard } from "@/components/businesses/businesses-board";
import { getBusinesses, getFeaturedBusinessIds, getBusinessCounts } from "@/lib/data/businesses";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BusinessesPage() {
  const [businesses, featuredIds, counts] = await Promise.all([
    getBusinesses(),
    getFeaturedBusinessIds(),
    getBusinessCounts(),
  ]);

  return (
    <DashboardShell title="Businesses">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Here is everything about reviews" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Onboarded Businesses" value={formatNumber(counts.onboarded)} iconColor="green" />
          <StatCard label="Premium Businesses" value={formatNumber(counts.premium)} />
          <StatCard label="Suspended Businesses" value={formatNumber(counts.suspended)} />
          <StatCard label="Under Review" value={formatNumber(counts.underReview)} />
        </div>

        <BusinessesBoard businesses={businesses} initialFeaturedIds={featuredIds} />
      </div>
    </DashboardShell>
  );
}
