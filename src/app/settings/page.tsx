import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsBoard } from "@/components/settings/settings-board";
import { getAdminUsers, getCurrentAdmin, getActiveSessions } from "@/lib/data/admins";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [admins, admin, sessions] = await Promise.all([getAdminUsers(), getCurrentAdmin(), getActiveSessions()]);

  return (
    <DashboardShell title="Settings">
      <SettingsBoard admins={admins} adminName={admin?.name ?? ""} sessions={sessions} />
    </DashboardShell>
  );
}
