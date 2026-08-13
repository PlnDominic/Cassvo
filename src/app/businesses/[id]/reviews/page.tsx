import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { RatingBreakdownBar, type RatingBreakdownItem } from "@/components/reviews/rating-breakdown-bar";
import { FilterDropdown } from "@/components/reviews/filter-dropdown";
import { ExportReviewsButton } from "@/components/reviews/export-reviews-button";
import { ReviewCard, type ReviewData } from "@/components/reviews/review-card";
import { ReviewInsights, type InsightItem } from "@/components/reviews/review-insights";
import { RatingsDonut, type RatingSegment } from "@/components/reviews/ratings-donut";
import skyLounge from "../../../../../public/images/dashboard/photo-sky-lounge.png";
import photoBusiness1 from "../../../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../../../public/images/dashboard/photo-business-2.png";

const ratingBreakdown: RatingBreakdownItem[] = [
  { stars: 5, count: 96, percent: 75 },
  { stars: 4, count: 20, percent: 16 },
  { stars: 3, count: 8, percent: 6 },
  { stars: 2, count: 3, percent: 2 },
  { stars: 1, count: 1, percent: 1 },
];

const ratingSegments: RatingSegment[] = [
  { label: "5 Stars", percent: 75, color: "#1a7431" },
  { label: "4 Stars", percent: 16, color: "#34c759" },
  { label: "3 Stars", percent: 6, color: "#f5b301" },
  { label: "2 Stars", percent: 2, color: "#f97316" },
  { label: "1 Star", percent: 1, color: "#ea0505" },
];

const reviewPhotos = [skyLounge, photoBusiness1, photoBusiness2, skyLounge];

const baseReview: Omit<ReviewData, "photos"> = {
  name: "Ama",
  location: "East Legon",
  timeAgo: "2mins ago",
  verified: true,
  rating: 4.8,
  reviewCount: 128,
  date: "12th May 2026",
  price: 2,
  crowdLevel: "E choke",
  text: "The ambience, the food, the staff, everything was a 10/10 ❤️",
  tags: [
    { label: "Great Service", icon: "sparkles" },
    { label: "Worth It", icon: "smile" },
  ],
  likes: 16,
  dislikes: 0,
};

const reviews: ReviewData[] = [
  { ...baseReview, photos: reviewPhotos },
  { ...baseReview, photos: reviewPhotos },
];

const insights: InsightItem[] = [
  { avatarName: "Angela A", label: "Most Helpful Review", sublabel: "By Angela A" },
  { avatarName: "Kwame D.", label: "Most Active Reviewer", sublabel: "Kwame D." },
  { avatarName: "Last 7 Days", label: "Last 7 Days", sublabel: "24 Reviews" },
  { avatarName: "Response Rate", label: "Response Rate", sublabel: "98%" },
];

export default async function BusinessReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <DashboardShell title="Business Reviews" backHref={`/businesses/${id}`}>
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="All Business reviews" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatCard
            label="Total Reviews"
            value="40,689"
            trend={{ type: "up", text: "8.5% Up from yesterday" }}
            iconColor="green"
          />
          <StatCard
            label="Average Ratings"
            value="4.8 / 5.0"
            trend={{ type: "up", text: "8.5% Up from yesterday" }}
            iconColor="red"
          />
        </div>

        <RatingBreakdownBar items={ratingBreakdown} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FilterDropdown options={["All Reviews", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]} defaultValue="All Reviews" />
            <FilterDropdown options={["All Ratings", "Highest First", "Lowest First", "Most Recent"]} defaultValue="All Ratings" />
          </div>
          <ExportReviewsButton reviews={reviews} />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <ReviewInsights items={insights} />
            <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
              <p className="mb-5 text-xs font-medium tracking-[0.01em] text-[#060606]">Ratings Distribution</p>
              <RatingsDonut segments={ratingSegments} total={128} />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
