"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { SettingsNav } from "@/components/settings/settings-nav";
import { GeneralSection } from "@/components/settings/general-section";
import { ModerationSection } from "@/components/settings/moderation-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { AdminManagementSection } from "@/components/settings/admin-management-section";
import { SecuritySection } from "@/components/settings/security-section";
import type { SettingsSection } from "@/components/settings/types";

const SUBTITLES: Record<SettingsSection, string> = {
  general: "Manage platform settings and Preferences",
  moderation: "Manage platform settings and Preferences",
  notification: "Manage platform settings and Preferences",
  admin: "Manage platform administrations and their permissions",
  security: "Manage security preferences and system access",
};

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("general");

  return (
    <DashboardShell title="Settings">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle={SUBTITLES[section]} greeting="Hi," />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <SettingsNav active={section} onChange={setSection} />

          <div className="flex-1 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
            {section === "general" && <GeneralSection />}
            {section === "moderation" && <ModerationSection />}
            {section === "notification" && <NotificationsSection />}
            {section === "admin" && <AdminManagementSection />}
            {section === "security" && <SecuritySection />}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
