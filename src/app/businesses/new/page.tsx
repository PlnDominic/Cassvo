import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { OnboardBusinessWizard } from "@/components/businesses/onboard/onboard-business-wizard";

export default function NewBusinessPage() {
  return (
    <DashboardShell title="Businesses" backHref="/businesses">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Onboard a business" greeting="Hi," />
        <OnboardBusinessWizard />
      </div>
    </DashboardShell>
  );
}
