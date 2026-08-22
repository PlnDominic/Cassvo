import { DashboardShell } from "@/components/layout/dashboard-shell";
import { WelcomeBanner } from "@/components/business-profile/welcome-banner";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsersBoard } from "@/components/users/users-board";
import type { UserRow } from "@/components/users/types";

const users: UserRow[] = [
  { id: "1", name: "Amma Nile", email: "nile456@gmail.com", phone: "+233 560245622", reviewsPosted: 43, reports: 43, joinedDate: "06/07/2026", verified: true, category: "active" },
  { id: "2", name: "Meriam Bale", email: "bale@gmail.com", phone: "+233 560245622", reviewsPosted: 12, reports: 12, joinedDate: "06/07/2026", verified: false, category: "warned" },
  { id: "3", name: "John Doe", email: "johhny@gmail.com", phone: "+234 560245622", reviewsPosted: null, reports: null, joinedDate: "06/07/2026", verified: false, category: "guest" },
  { id: "4", name: "Bella Asante", email: "Ella@gmail.com", phone: "+234 560245622", reviewsPosted: 65, reports: 65, joinedDate: "06/07/2026", verified: true, category: "active" },
  { id: "5", name: "Charles Blay", email: "Blade@gmail.com", phone: "+234 560245622", reviewsPosted: 234, reports: 234, joinedDate: "06/07/2026", verified: false, category: "suspended" },
  { id: "6", name: "Amma Nile", email: "Nile@gmail.com", phone: "+234 560245622", reviewsPosted: 3, reports: 3, joinedDate: "06/07/2026", verified: true, category: "active" },
];

export default function UsersPage() {
  return (
    <DashboardShell title="Users">
      <div className="flex flex-col gap-6">
        <WelcomeBanner name="Angela. A" initial="A" subtitle="Here is everything about reviews" greeting="Hi," />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Users" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="Active Users" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} iconColor="green" />
          <StatCard label="Suspended Users" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} />
          <StatCard label="New This month" value="40,689" trend={{ type: "up", text: "8.5% Up from yesterday" }} iconColor="green" />
        </div>

        <UsersBoard users={users} />
      </div>
    </DashboardShell>
  );
}
