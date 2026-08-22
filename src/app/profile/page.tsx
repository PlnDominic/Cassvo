import { MessageSquare, Store, Flag, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProfileHero } from "@/components/profile/profile-hero";
import { PersonalInformationCard } from "@/components/profile/personal-information-card";
import { RecentActivityCard } from "@/components/profile/recent-activity-card";
import { PermissionAccessCard } from "@/components/profile/permission-access-card";
import { LoginActivityTable } from "@/components/profile/login-activity-table";
import { ProfileActions } from "@/components/profile/profile-actions";
import type { ProfileStat, LoginActivityRow } from "@/components/profile/types";

const stats: ProfileStat[] = [
  { label: "Reviews Approved", value: "12,435", icon: MessageSquare },
  { label: "Businesses Onboarded", value: "12,435", icon: Store },
  { label: "Reports Resolved", value: "12,435", icon: Flag },
  { label: "Trust Score", value: "99%", icon: ShieldCheck },
];

const permissions = ["Review Moderation", "Business management", "User management", "Reports", "Analytics", "Settings", "Admin Management"];

const activity = [
  { time: "Today, 9:43 am", description: "Approved review for Kofi's Kitchen" },
  { time: "Today, 9:43 am", description: "Resolved Report" },
];

const loginActivity: LoginActivityRow[] = [
  { device: "Windows 11", browser: "Chrome 124.0", location: "Accra, Ghana", time: "Current Session", status: "active" },
  { device: "MacOS Sonoma", browser: "Safari", location: "Tema, Ghana", time: "Yesterday, 12:00am", status: "successful" },
  { device: "Windows 11", browser: "Chrome 124.0", location: "Accra, Ghana", time: "Yesterday, 12:00am", status: "successful" },
];

export default function ProfilePage() {
  return (
    <DashboardShell title="Profile">
      <div className="flex flex-col gap-6">
        <ProfileHero
          name="Angela. A"
          badge="Super Admin"
          role="Platform Administrator"
          location="Accra, Ghana"
          joined="Joined July, 2026"
          stats={stats}
        />

        <PersonalInformationCard
          info={{ fullName: "Angela A.", email: "angela@cassvo.com", role: "Super Admin", location: "Accra, Ghana" }}
        />

        <div className="flex flex-col gap-6 sm:flex-row">
          <RecentActivityCard activity={activity} />
          <PermissionAccessCard permissions={permissions} />
        </div>

        <LoginActivityTable rows={loginActivity} />

        <ProfileActions />
      </div>
    </DashboardShell>
  );
}
