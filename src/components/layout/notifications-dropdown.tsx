"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, MessageSquareWarning, Store, UserPlus, Star } from "lucide-react";
import type { DropdownNotification } from "@/lib/data/notifications";

const KIND_ICON = {
  review: { icon: Star, className: "bg-brand-red/10 text-brand-red" },
  business: { icon: Store, className: "bg-emerald-500/10 text-emerald-500" },
  user: { icon: UserPlus, className: "bg-indigo-500/10 text-indigo-500" },
  system: { icon: MessageSquareWarning, className: "bg-amber-500/10 text-amber-500" },
} as const;

export function NotificationsDropdown({ notifications: initial }: { notifications: DropdownNotification[] }) {
  const [open, setOpen] = useState(false);
  // Only the locally-dismissed ids live in state; the rows themselves stay
  // owned by the server, so fresh props flow through without a sync effect.
  const [readIds, setReadIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const notifications = initial.map((n) => ({ ...n, unread: n.unread && !readIds.includes(n.id) }));
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function markAllRead() {
    setReadIds(initial.map((n) => n.id));
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex size-10 items-center justify-center rounded-[10px] border border-[#ececed]"
      >
        <Bell size={18} className="text-black" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-[0.3px] border-[#e0e0e3] bg-brand-red text-[9px] font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[340px] overflow-hidden rounded-[14px] border border-[#ececed] bg-white shadow-[0px_12px_32px_0px_rgba(0,0,0,0.12)]"
        >
          <div className="flex items-center justify-between border-b border-[#ececed] px-4 py-3">
            <p className="text-sm font-medium text-[#060606]">Notifications</p>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="text-xs font-medium text-brand-red hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-[#939393]">No notifications</p>
            ) : (
              notifications.map((n) => {
                const config = KIND_ICON[n.kind as keyof typeof KIND_ICON] ?? KIND_ICON.system;
                const Icon = config.icon;
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex gap-3 border-b border-[#ececed] px-4 py-3 last:border-b-0 hover:bg-[#f7f7f8] ${
                      n.unread ? "bg-brand-red/5" : ""
                    }`}
                  >
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs leading-snug text-[#060606]">{n.text}</p>
                      <p className="mt-1 text-[11px] text-[#939393]">{n.time}</p>
                    </div>
                    {n.unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-red" />}
                  </Link>
                );
              })
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-[#ececed] px-4 py-3 text-center text-xs font-medium text-brand-red hover:underline"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
