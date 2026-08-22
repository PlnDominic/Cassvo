import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsBoard } from "@/components/settings/settings-board";
import { getAdminUsers } from "@/lib/data/admins";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const admins = await getAdminUsers();

  return (
    <DashboardShell title="Settings">
      <SettingsBoard admins={admins} />
    </DashboardShell>
  );
}
