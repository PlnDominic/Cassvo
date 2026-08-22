"use client";

import { useState } from "react";
import { NotificationsToolbar } from "./notifications-toolbar";
import { NotificationRow } from "./notification-row";
import type { NotificationItem } from "./types";

export function NotificationsBoard({
  today,
  yesterday,
}: {
  today: NotificationItem[];
  yesterday: NotificationItem[];
}) {
  const [items, setItems] = useState({ today, yesterday });

  const hasUnread = [...items.today, ...items.yesterday].some((n) => n.unread);

  function markAllRead() {
    setItems((prev) => ({
      today: prev.today.map((n) => ({ ...n, unread: false })),
      yesterday: prev.yesterday.map((n) => ({ ...n, unread: false })),
    }));
  }

  function markRead(group: "today" | "yesterday", id: string) {
    setItems((prev) => ({
      ...prev,
      [group]: prev[group].map((n) => (n.id === id ? { ...n, unread: false } : n)),
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-sm font-medium text-[#060606]">All Notification</p>
        <NotificationsToolbar onMarkAllRead={markAllRead} markAllDisabled={!hasUnread} />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#060606]">Today</p>
        <div className="flex flex-col gap-1">
          {items.today.map((n) => (
            <NotificationRow key={n.id} notification={n} onView={() => markRead("today", n.id)} />
          ))}
          {items.today.length === 0 && <p className="text-sm text-[#939393]">Nothing today.</p>}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#060606]">Yesterday</p>
        <div className="flex flex-col gap-1">
          {items.yesterday.map((n) => (
            <NotificationRow key={n.id} notification={n} onView={() => markRead("yesterday", n.id)} />
          ))}
          {items.yesterday.length === 0 && <p className="text-sm text-[#939393]">Nothing yesterday.</p>}
        </div>
      </div>
    </div>
  );
}
