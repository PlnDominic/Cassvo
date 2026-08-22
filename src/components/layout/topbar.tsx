"use client";

import Link from "next/link";
import { ArrowLeft, Menu, Search, Settings } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";
import type { DropdownNotification } from "@/lib/data/notifications";

export function TopBar({
  title,
  backHref,
  notifications,
  onMenuClick,
}: {
  title?: string;
  backHref?: string;
  notifications: DropdownNotification[];
  onMenuClick: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 sm:px-6 sm:pt-[18px] lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 lg:hidden"
      >
        <Menu size={20} className="text-black" />
      </button>

      {title && (
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4 lg:flex-none">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Go back"
              className="hidden size-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5 sm:flex"
            >
              <ArrowLeft size={20} className="text-black" />
            </Link>
          )}
          <h1 className="truncate text-lg font-medium text-[#060606] sm:text-xl">{title}</h1>
        </div>
      )}

      <div className={`flex items-center gap-2 sm:gap-3 ${title ? "" : "flex-1 justify-end"}`}>
        <label className="hidden h-[38px] items-center gap-2 rounded-[11px] border border-[#ececed] px-[10px] md:flex md:w-[180px] lg:w-[220px]">
          <Search size={16} className="shrink-0 text-black/60" />
          <input
            type="search"
            placeholder="search anything"
            className="h-full w-full bg-transparent text-[16px] font-medium text-black placeholder:text-black/60 focus:outline-none"
          />
        </label>

        <NotificationsDropdown notifications={notifications} />

        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[#ececed]"
        >
          <Settings size={18} className="text-black" />
        </Link>
      </div>
    </div>
  );
}
