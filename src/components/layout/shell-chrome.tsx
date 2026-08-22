"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import type { DropdownNotification } from "@/lib/data/notifications";

export function ShellChrome({
  adminName,
  avatarUrl,
  notifications,
  title,
  backHref,
  children,
}: {
  adminName: string | null;
  avatarUrl: string | null;
  notifications: DropdownNotification[];
  title?: string;
  backHref?: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f7f8]">
      <Sidebar adminName={adminName} avatarUrl={avatarUrl} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
        <TopBar title={title} backHref={backHref} notifications={notifications} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
