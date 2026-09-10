import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OnboardBusinessWizard } from "@/components/businesses/onboard/onboard-business-wizard";
import { getCurrentAdmin } from "@/lib/data/admins";
import { getCategories } from "@/lib/data/categories";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const [admin, categories] = await Promise.all([getCurrentAdmin(), getCategories()]);

  return (
    <DashboardShell title="Businesses" backHref="/businesses">
      <OnboardBusinessWizard adminName={admin?.name ?? ""} categories={categories} />
    </DashboardShell>
  );
}
