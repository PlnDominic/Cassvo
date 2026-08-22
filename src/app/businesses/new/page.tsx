import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OnboardBusinessWizard } from "@/components/businesses/onboard/onboard-business-wizard";
import { getCurrentAdmin } from "@/lib/data/admins";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const admin = await getCurrentAdmin();

  return (
    <DashboardShell title="Businesses" backHref="/businesses">
      <OnboardBusinessWizard adminName={admin?.name ?? ""} />
    </DashboardShell>
  );
}
