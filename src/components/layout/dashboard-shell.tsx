import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { getCurrentAdmin } from "@/lib/data/admins";
import { getRecentNotifications } from "@/lib/data/notifications";

export async function DashboardShell({
  children,
  title,
  backHref,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
}) {
  const [admin, notifications] = await Promise.all([getCurrentAdmin(), getRecentNotifications()]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f8]">
      <Sidebar adminName={admin?.name ?? null} avatarUrl={admin?.avatarUrl ?? null} />
      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <TopBar title={title} backHref={backHref} notifications={notifications} />
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
