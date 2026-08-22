import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { RatingBreakdownBar } from "@/components/reviews/rating-breakdown-bar";
import { FilterDropdown } from "@/components/reviews/filter-dropdown";
import { ExportReviewsButton } from "@/components/reviews/export-reviews-button";
import { ReviewCard, type ReviewData } from "@/components/reviews/review-card";
import { ReviewInsights, type InsightItem } from "@/components/reviews/review-insights";
import { RatingsDonut, type RatingSegment } from "@/components/reviews/ratings-donut";
import { getBusiness } from "@/lib/data/businesses";
import { getReviews, getBusinessRatingBreakdown } from "@/lib/data/reviews";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const SEGMENT_COLORS = ["#1a7431", "#34c759", "#f5b301", "#f97316", "#ea0505"];

export default async function BusinessReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const business = await getBusiness(id);
  if (!business) notFound();

  const [records, breakdown] = await Promise.all([getReviews(id), getBusinessRatingBreakdown(id)]);

  const reviews: ReviewData[] = records.map((r) => ({
    name: r.authorName,
    location: r.authorLocation ?? "—",
    timeAgo: r.timeAgo,
    verified: r.authorVerified,
    rating: r.rating,
    reviewCount: r.reviewCount,
    date: r.date,
    price: r.priceLevel,
    crowdLevel: r.crowdLevel,
    text: r.text,
    photos: r.photos,
    tags: r.tags,
    likes: r.helpful,
    dislikes: r.notHelpful,
  }));

  const ratingSegments: RatingSegment[] = breakdown.map((item, i) => ({
    label: `${item.stars} Star${item.stars === 1 ? "" : "s"}`,
    percent: item.percent,
    color: SEGMENT_COLORS[i],
  }));

  const mostHelpful = records.reduce<(typeof records)[number] | null>(
    (best, r) => (best === null || r.helpful > best.helpful ? r : best),
    null
  );

  const insights: InsightItem[] = [
    {
      avatarName: mostHelpful?.authorName ?? "—",
      label: "Most Helpful Review",
      sublabel: mostHelpful ? `By ${mostHelpful.authorName}` : "—",
    },
    { avatarName: business.name, label: "Total Reviews", sublabel: formatNumber(business.reviewCount) },
    {
      avatarName: "Average",
      label: "Average Rating",
      sublabel: business.rating !== null ? `${business.rating} / 5.0` : "—",
    },
    { avatarName: "Photos", label: "Photos Shared", sublabel: formatNumber(records.flatMap((r) => r.photos).length) },
  ];

  return (
    <DashboardShell title="Business Reviews" backHref={`/businesses/${id}`}>
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle={`All reviews for ${business.name}`} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatCard label="Total Reviews" value={formatNumber(business.reviewCount)} iconColor="green" />
          <StatCard
            label="Average Ratings"
            value={business.rating !== null ? `${business.rating} / 5.0` : "—"}
            iconColor="red"
          />
        </div>

        <RatingBreakdownBar items={breakdown} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FilterDropdown
              options={["All Reviews", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]}
              defaultValue="All Reviews"
            />
            <FilterDropdown
              options={["All Ratings", "Highest First", "Lowest First", "Most Recent"]}
              defaultValue="All Ratings"
            />
          </div>
          <ExportReviewsButton reviews={reviews} />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
            {reviews.length === 0 && (
              <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#939393]">No reviews yet.</p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <ReviewInsights items={insights} />
            <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
              <p className="mb-5 text-xs font-medium tracking-[0.01em] text-[#060606]">Ratings Distribution</p>
              <RatingsDonut segments={ratingSegments} total={business.reviewCount} />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
