import { MessageSquare, Store, Flag, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProfileHero } from "@/components/profile/profile-hero";
import { PersonalInformationCard } from "@/components/profile/personal-information-card";
import { RecentActivityCard } from "@/components/profile/recent-activity-card";
import { PermissionAccessCard } from "@/components/profile/permission-access-card";
import { LoginActivityTable } from "@/components/profile/login-activity-table";
import { ProfileActions } from "@/components/profile/profile-actions";
import type { ProfileStat } from "@/components/profile/types";
import { getCurrentAdmin, getLoginActivity } from "@/lib/data/admins";
import { getRecentActivity } from "@/lib/data/dashboard";
import { formatDate, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return (
      <DashboardShell title="Profile">
        <p className="rounded-2xl bg-white p-10 text-center text-sm text-[#939393]">
          No admin account found. Add a row to <code>admin_users</code> to see your profile here.
        </p>
      </DashboardShell>
    );
  }

  const [loginActivity, activity] = await Promise.all([getLoginActivity(admin.id), getRecentActivity(2)]);

  const stats: ProfileStat[] = [
    { label: "Reviews Approved", value: formatNumber(admin.reviewsApproved), icon: MessageSquare },
    { label: "Businesses Onboarded", value: formatNumber(admin.businessesOnboarded), icon: Store },
    { label: "Reports Resolved", value: formatNumber(admin.reportsResolved), icon: Flag },
    { label: "Trust Score", value: "—", icon: ShieldCheck },
  ];

  return (
    <DashboardShell title="Profile">
      <div className="flex flex-col gap-6">
        <ProfileHero
          name={admin.name}
          badge={admin.role}
          role="Platform Administrator"
          location="—"
          joined={`Joined ${formatDate(admin.joinedAt)}`}
          stats={stats}
        />

        <PersonalInformationCard
          info={{ fullName: admin.name, email: admin.email, role: admin.role, location: "—" }}
        />

        <div className="flex flex-col gap-6 sm:flex-row">
          <RecentActivityCard activity={activity.map((a) => ({ time: a.time, description: a.action }))} />
          <PermissionAccessCard permissions={admin.permissions} />
        </div>

        <LoginActivityTable rows={loginActivity} />

        <ProfileActions loginActivity={loginActivity} />
      </div>
    </DashboardShell>
  );
}
