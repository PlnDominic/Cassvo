import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { NotificationsBoard } from "@/components/notifications/notifications-board";
import { getNotifications, getNotificationCounts } from "@/lib/data/notifications";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [{ today, yesterday }, counts] = await Promise.all([getNotifications(), getNotificationCounts()]);

  return (
    <DashboardShell title="Notification">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Manage security preferences and system access"
          greeting="Hi,"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Notification" value={formatNumber(counts.total)} />
          <StatCard label="Unread" value={formatNumber(counts.unread)} />
          <StatCard label="High Priority" value={formatNumber(counts.highPriority)} />
          <StatCard label="System Alerts" value={formatNumber(counts.systemAlerts)} />
        </div>

        <NotificationsBoard today={today} yesterday={yesterday} />
      </div>
    </DashboardShell>
  );
}
