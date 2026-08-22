import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { DraftsBoard } from "@/components/businesses/drafts/drafts-board";
import { getBusinessDrafts } from "@/lib/data/businesses";

export const dynamic = "force-dynamic";

export default async function BusinessDraftsPage() {
  const drafts = await getBusinessDrafts();

  return (
    <DashboardShell title="Businesses">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Continue or manage your saved onboarding draft"
          greeting="Hi,"
        />
        <DraftsBoard drafts={drafts} />
      </div>
    </DashboardShell>
  );
}
