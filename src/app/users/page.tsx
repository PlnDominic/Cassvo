import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AdminWelcomeBanner } from "@/components/layout/admin-welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsersBoard } from "@/components/users/users-board";
import { getUsers, getUserCounts } from "@/lib/data/users";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, counts] = await Promise.all([getUsers(), getUserCounts()]);

  return (
    <DashboardShell title="Users">
      <div className="flex flex-col gap-6">
        <AdminWelcomeBanner subtitle="Here is everything about users" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Users" value={formatNumber(counts.total)} />
          <StatCard label="Active Users" value={formatNumber(counts.active)} iconColor="green" />
          <StatCard label="Suspended Users" value={formatNumber(counts.suspended)} />
          <StatCard label="New This month" value={formatNumber(counts.newThisMonth)} iconColor="green" />
        </div>

        <UsersBoard users={users} />
      </div>
    </DashboardShell>
  );
}
