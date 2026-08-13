"use client";

import Link from "next/link";
import { ArrowLeft, Search, Settings } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown";

export function TopBar({ title, backHref }: { title?: string; backHref?: string }) {
  return (
    <div className={`flex items-center gap-3 px-8 pt-[18px] ${title ? "justify-between" : "justify-end"}`}>
      {title && (
        <div className="flex items-center gap-4">
          {backHref && (
            <Link
              href={backHref}
              aria-label="Go back"
              className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-black/5"
            >
              <ArrowLeft size={20} className="text-black" />
            </Link>
          )}
          <h1 className="text-xl font-medium text-[#060606]">{title}</h1>
        </div>
      )}

      <div className="flex items-center gap-3">
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
    </div>
  );
}
