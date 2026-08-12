"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, MessageSquareWarning, Store, UserPlus, Star } from "lucide-react";

interface Notification {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconClassName: string;
  text: string;
  time: string;
  unread: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    icon: Star,
    iconClassName: "bg-brand-red/10 text-brand-red",
    text: "Angela A. left a 5-star review on Kofi’s Kitchen",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: "2",
    icon: MessageSquareWarning,
    iconClassName: "bg-amber-500/10 text-amber-500",
    text: "Ella M reported a suspicious review",
    time: "18 mins ago",
    unread: false,
  },
  {
    id: "3",
    icon: Store,
    iconClassName: "bg-emerald-500/10 text-emerald-500",
    text: "Ella M registered a new business",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "4",
    icon: UserPlus,
    iconClassName: "bg-indigo-500/10 text-indigo-500",
    text: "Kwame D. needs help with a pending report",
    time: "3 hours ago",
    unread: false,
  },
];

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);

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

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggleOpen}
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
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-brand-red hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-[#939393]">No notifications</p>
            ) : (
              notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-[#ececed] px-4 py-3 last:border-b-0 ${
                      n.unread ? "bg-brand-red/5" : ""
                    }`}
                  >
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${n.iconClassName}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs leading-snug text-[#060606]">{n.text}</p>
                      <p className="mt-1 text-[11px] text-[#939393]">{n.time}</p>
                    </div>
                    {n.unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-red" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
