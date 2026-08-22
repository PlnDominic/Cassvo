import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { PhotosTab } from "@/components/business-profile/photos-tab";
import { ReportsTab, type Report } from "@/components/business-profile/reports-tab";
import { UserProfileCard } from "@/components/users/profile/user-profile-card";
import { CommunityStatsCard } from "@/components/users/profile/community-stats-card";
import { UserProfileTabs } from "@/components/users/profile/user-profile-tabs";
import { UserReviewsTab } from "@/components/users/profile/user-reviews-tab";
import { AdminActionsCard } from "@/components/users/profile/admin-actions-card";
import type { UserProfileData, CommunityStat, UserReview } from "@/components/users/profile/types";
import skyLounge from "../../../../public/images/dashboard/photo-sky-lounge.png";
import photoBusiness1 from "../../../../public/images/dashboard/photo-business-1.png";
import photoBusiness2 from "../../../../public/images/dashboard/photo-business-2.png";

const user: UserProfileData = {
  name: "Amma Nile",
  memberLabel: "Verified Community Member",
  location: "East Legon",
  joinedDate: "May 12, 2026",
  email: "angie@gmail.com",
  phone: "+233 590245622",
};

const communityStats: CommunityStat[] = [
  { label: "Reviews Written", value: "124" },
  { label: "Photos Uploaded", value: "124" },
  { label: "Helpful Reviews", value: "124" },
  { label: "Businesses Reviewed", value: "124" },
];

const reviews: UserReview[] = [
  { business: "Kofi's Kitchen", category: "Food & Dining", text: "The ambience, the food, the staff, everything was a 10/10 ❤️", rating: 4.8, reviewCount: 128, date: "06/07/2026", photo: photoBusiness1 },
  { business: "Kofi's Kitchen", category: "Food & Dining", text: "The ambience, the food, the staff, everything was a 10/10 ❤️", rating: 4.8, reviewCount: 128, date: "06/07/2026", photo: photoBusiness2 },
  { business: "Kofi's Kitchen", category: "Food & Dining", text: "The ambience, the food, the staff, everything was a 10/10 ❤️", rating: 4.8, reviewCount: 128, date: "06/07/2026", photo: photoBusiness1 },
];

const reports: Report[] = [
  { reporter: "Ella M", reason: "Suspicious review activity", date: "2 days ago", status: "Pending" },
  { reporter: "Kwame D.", reason: "Incorrect opening hours", date: "5 days ago", status: "Resolved" },
];

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await params;

  return (
    <DashboardShell title="User Profile">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="View User Information Easily" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UserProfileCard user={user} />
          <CommunityStatsCard subtitle={user.memberLabel} stats={communityStats} />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_280px]">
          <UserProfileTabs
            reviews={<UserReviewsTab reviews={reviews} />}
            photos={<PhotosTab photos={[skyLounge, photoBusiness1, photoBusiness2, skyLounge]} />}
            reports={<ReportsTab reports={reports} />}
            collections={
              <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#939393]">No collections yet.</p>
            }
          />
          <AdminActionsCard userName={user.name} />
        </div>
      </div>
    </DashboardShell>
  );
}
