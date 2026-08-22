import Link from "next/link";
import { Avatar } from "../dashboard/avatar";
import { Badge } from "../ui/badge";
import type { NotificationItem } from "./types";

export function NotificationRow({ notification, onView }: { notification: NotificationItem; onView: () => void }) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl px-4 py-4 ${
        notification.unread ? "bg-brand-red/5" : "bg-white"
      }`}
    >
      <Avatar name={notification.avatarName} size={40} />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#060606]">{notification.title}</p>
        <p className="text-xs text-[#939393]">{notification.description}</p>
      </div>

      <Badge variant={notification.badgeVariant}>{notification.badgeLabel}</Badge>

      <div className="shrink-0 text-right">
        <p className="text-xs text-[#939393]">{notification.time}</p>
        <Link
          href={notification.href}
          onClick={onView}
          className="text-xs font-medium text-brand-red hover:underline"
        >
          View
        </Link>
      </div>
    </div>
  );
}
