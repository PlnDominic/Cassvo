import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { ModerationBoard } from "@/components/review-moderation/moderation-board";
import type { ModerationReview } from "@/components/review-moderation/types";
import skyLounge from "../../../public/images/dashboard/photo-sky-lounge.png";
import photoBusiness1 from "../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../public/images/dashboard/photo-business-2.png";

const reviewPhotos = [skyLounge, photoBusiness1, photoBusiness2, skyLounge];

const baseReview = {
  name: "Ama",
  location: "East Legon",
  timeAgo: "2mins ago",
  business: "Kempinski",
  businessCategory: "Hotel",
  businessLocation: "Osu, Accra",
  businessPhoto: photoBusiness1,
  rating: 4.8,
  reviewCount: 128,
  date: "12th May 2026",
  price: 2,
  crowdLevel: "E choke",
  text: "The ambience, the food, the staff, everything was a 10/10 ❤️",
  photos: reviewPhotos,
  tags: [
    { label: "Great Service", icon: "sparkles" as const },
    { label: "Worth It", icon: "smile" as const },
  ],
};

const reviews: ModerationReview[] = [
  { ...baseReview, id: "1", status: "pending" },
  { ...baseReview, id: "2", status: "approved" },
  { ...baseReview, id: "3", status: "rejected" },
  { ...baseReview, id: "4", status: "pending" },
  { ...baseReview, id: "5", status: "pending" },
  { ...baseReview, id: "6", status: "approved" },
];

export default function ReviewModerationPage() {
  return (
    <DashboardShell title="Review Moderation">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Here is everything about reviews" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Reviews" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} iconColor="green" />
          <StatCard label="Pending Reviews" value="40,689" trend={{ type: "attention", text: "Needs attention" }} />
          <StatCard label="Approved Reviews" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} iconColor="green" />
          <StatCard label="Rejected Reviews" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
        </div>

        <ModerationBoard reviews={reviews} />
      </div>
    </DashboardShell>
  );
}
