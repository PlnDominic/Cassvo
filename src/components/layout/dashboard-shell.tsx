import { ShellChrome } from "./shell-chrome";
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
    <ShellChrome adminName={admin?.name ?? null} avatarUrl={admin?.avatarUrl ?? null} notifications={notifications} title={title} backHref={backHref}>
      {children}
    </ShellChrome>
  );
}
