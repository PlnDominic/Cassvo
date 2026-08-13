import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

export function DashboardShell({
  children,
  title,
  backHref,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f8]">
      <Sidebar />
      <div className="flex h-full flex-1 flex-col overflow-y-auto">
        <TopBar title={title} backHref={backHref} />
        <main className="flex-1 px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
