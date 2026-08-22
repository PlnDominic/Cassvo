import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsBoard } from "@/components/settings/settings-board";
import { getAdminUsers, getCurrentAdmin, getActiveSessions } from "@/lib/data/admins";
import { getPlatformSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [admins, admin, sessions, settings] = await Promise.all([
    getAdminUsers(),
    getCurrentAdmin(),
    getActiveSessions(),
    getPlatformSettings(),
  ]);

  return (
    <DashboardShell title="Settings">
      <SettingsBoard
        admins={admins}
        adminName={admin?.name ?? ""}
        sessions={sessions}
        settings={settings}
      />
    </DashboardShell>
  );
}
