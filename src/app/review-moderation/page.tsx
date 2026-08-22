import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { ModerationBoard } from "@/components/review-moderation/moderation-board";
import type { ModerationReview } from "@/components/review-moderation/types";
import { getReviews, getReviewCounts } from "@/lib/data/reviews";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ReviewModerationPage() {
  const [records, counts] = await Promise.all([getReviews(), getReviewCounts()]);

  const reviews: ModerationReview[] = records.map((r) => ({
    id: r.id,
    name: r.authorName,
    avatarUrl: r.authorAvatarUrl,
    location: r.authorLocation,
    timeAgo: r.timeAgo,
    business: r.businessName,
    businessCategory: r.businessCategory,
    businessLocation: r.businessLocation,
    businessPhotoUrl: r.businessPhotoUrl,
    rating: r.rating,
    reviewCount: r.reviewCount,
    date: r.date,
    price: r.priceLevel,
    crowdLevel: r.crowdLevel,
    text: r.text,
    photos: r.photos,
    tags: r.tags,
    status: r.status,
  }));

  return (
    <DashboardShell title="Review Moderation">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Here is everything about reviews" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Reviews" value={formatNumber(counts.total)} iconColor="green" />
          <StatCard
            label="Pending Reviews"
            value={formatNumber(counts.pending)}
            trend={counts.pending > 0 ? { type: "attention", text: "Needs attention" } : undefined}
          />
          <StatCard label="Approved Reviews" value={formatNumber(counts.approved)} iconColor="green" />
          <StatCard label="Rejected Reviews" value={formatNumber(counts.rejected)} />
        </div>

        <ModerationBoard reviews={reviews} />
      </div>
    </DashboardShell>
  );
}
