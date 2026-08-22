import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { NotificationsBoard } from "@/components/notifications/notifications-board";
import type { NotificationItem } from "@/components/notifications/types";

const today: NotificationItem[] = [
  {
    id: "1",
    avatarName: "Sky Lounge",
    title: "Review Flagged for fake content",
    description: "Sky lounge received a report from 3 users",
    badgeLabel: "Review",
    badgeVariant: "red",
    time: "2mins ago",
    href: "/review-moderation",
    unread: true,
  },
  {
    id: "2",
    avatarName: "Bloom Spa",
    title: "New Business Submitted",
    description: "Bloom Spa is awaiting confirmation",
    badgeLabel: "Business",
    badgeVariant: "green",
    time: "2mins ago",
    href: "/businesses",
    unread: false,
  },
  {
    id: "3",
    avatarName: "Kwame D",
    title: "New User Registered",
    description: "Kwame D joined Cassvo",
    badgeLabel: "Users",
    badgeVariant: "amber",
    time: "2mins ago",
    href: "/users",
    unread: false,
  },
];

const yesterday: NotificationItem[] = [];

export default function NotificationsPage() {
  return (
    <DashboardShell title="Notification">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Manage security preferences and system access" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Notification" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Unread" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="High Priority" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="System Alerts" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
        </div>

        <NotificationsBoard today={today} yesterday={yesterday} />
      </div>
    </DashboardShell>
  );
}
