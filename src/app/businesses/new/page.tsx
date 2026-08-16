import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OnboardBusinessWizard } from "@/components/businesses/onboard/onboard-business-wizard";

export default function NewBusinessPage() {
  return (
    <DashboardShell title="Businesses" backHref="/businesses">
      <OnboardBusinessWizard />
    </DashboardShell>
  );
}
