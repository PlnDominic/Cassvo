import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { ProfileSection } from "@/components/settings/profile-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { SecuritySection } from "@/components/settings/security-section";

export default function SettingsPage() {
  return (
    <DashboardShell title="Settings">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Manage your account and preferences" greeting="Hi," />

        <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
          <SettingsTabs
            profile={<ProfileSection />}
            notifications={<NotificationsSection />}
            security={<SecuritySection />}
          />
        </div>
      </div>
    </DashboardShell>
  );
}
