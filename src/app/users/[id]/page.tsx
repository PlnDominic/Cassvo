import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { PhotosTab } from "@/components/business-profile/photos-tab";
import { ReportsTab } from "@/components/business-profile/reports-tab";
import { UserProfileCard } from "@/components/users/profile/user-profile-card";
import { CommunityStatsCard } from "@/components/users/profile/community-stats-card";
import { UserProfileTabs } from "@/components/users/profile/user-profile-tabs";
import { UserReviewsTab } from "@/components/users/profile/user-reviews-tab";
import { AdminActionsCard } from "@/components/users/profile/admin-actions-card";
import { getMember, getMemberReviews, getMemberReports } from "@/lib/data/users";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  const [reviews, reports] = await Promise.all([getMemberReviews(id), getMemberReports(id)]);
  const photos = reviews.flatMap((r) => r.photos);
  const memberLabel = member.verified ? "Verified Community Member" : "Community Member";

  return (
    <DashboardShell title="User Profile">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="View User Information Easily" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UserProfileCard
            user={{
              name: member.name,
              avatarUrl: member.avatarUrl,
              memberLabel,
              location: member.location ?? "—",
              joinedDate: formatDate(member.joinedAt),
              email: member.email,
              phone: member.phone ?? "—",
            }}
          />
          <CommunityStatsCard
            subtitle={memberLabel}
            stats={[
              { label: "Reviews Written", value: formatNumber(member.reviewsWritten) },
              { label: "Photos Uploaded", value: formatNumber(member.photosUploaded) },
              { label: "Helpful Reviews", value: formatNumber(member.helpfulReviews) },
              { label: "Businesses Reviewed", value: formatNumber(member.businessesReviewed) },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_280px]">
          <UserProfileTabs
            photoCount={photos.length}
            reportCount={reports.length}
            collectionCount={0}
            reviews={<UserReviewsTab reviews={reviews} />}
            photos={<PhotosTab photos={photos} />}
            reports={<ReportsTab reports={reports} />}
            collections={
              <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#939393]">No collections yet.</p>
            }
          />
          <AdminActionsCard userName={member.name} />
        </div>
      </div>
    </DashboardShell>
  );
}
