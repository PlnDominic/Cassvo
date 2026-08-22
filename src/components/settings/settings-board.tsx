"use client";

import { useState } from "react";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { SettingsNav } from "./settings-nav";
import { GeneralSection } from "./general-section";
import { ModerationSection } from "./moderation-section";
import { NotificationsSection } from "./notifications-section";
import { AdminManagementSection } from "./admin-management-section";
import { SecuritySection } from "./security-section";
import type { AdminUser } from "./admin-users-table";
import type { SettingsSection, ActiveSession } from "./types";

const SUBTITLES: Record<SettingsSection, string> = {
  general: "Manage platform settings and Preferences",
  moderation: "Manage platform settings and Preferences",
  notification: "Manage platform settings and Preferences",
  admin: "Manage platform administrations and their permissions",
  security: "Manage security preferences and system access",
};

export function SettingsBoard({
  admins,
  adminName,
  sessions,
}: {
  admins: AdminUser[];
  adminName: string;
  sessions: ActiveSession[];
}) {
  const [section, setSection] = useState<SettingsSection>("general");

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner
        name={adminName}
        initial={adminName.trim().charAt(0).toUpperCase() || "?"}
        subtitle={SUBTITLES[section]}
        greeting="Hi,"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <SettingsNav active={section} onChange={setSection} />

        <div className="flex-1 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)] sm:p-8">
          {section === "general" && <GeneralSection />}
          {section === "moderation" && <ModerationSection />}
          {section === "notification" && <NotificationsSection />}
          {section === "admin" && <AdminManagementSection initialAdmins={admins} />}
          {section === "security" && <SecuritySection sessions={sessions} />}
        </div>
      </div>
    </div>
  );
}
