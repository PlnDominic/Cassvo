"use client";

import Link from "next/link";
import { Search, Settings } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";

export function TopBar() {
  return (
    <div className="flex items-center justify-end gap-3 px-8 pt-[18px]">
      <label className="flex h-[38px] w-[220px] items-center gap-2 rounded-[11px] border border-[#ececed] px-[10px]">
        <Search size={16} className="shrink-0 text-black/60" />
        <input
          type="search"
          placeholder="search anything"
          className="h-full w-full bg-transparent text-[16px] font-medium text-black placeholder:text-black/60 focus:outline-none"
        />
      </label>

      <NotificationsDropdown />

      <Link
        href="/settings"
        aria-label="Settings"
        className="flex size-10 items-center justify-center rounded-[10px] border border-[#ececed]"
      >
        <Settings size={18} className="text-black" />
      </Link>
    </div>
  );
}
