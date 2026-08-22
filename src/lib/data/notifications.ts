import { createClient } from "@/lib/supabase/server";
import type { NotificationItem, NotificationBadgeVariant } from "@/components/notifications/types";
import { formatRelative } from "@/lib/format";

const KIND_BADGE: Record<string, { label: string; variant: NotificationBadgeVariant }> = {
  review: { label: "Review", variant: "red" },
  business: { label: "Business", variant: "green" },
  user: { label: "Users", variant: "amber" },
  system: { label: "System", variant: "amber" },
};

function isToday(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function isYesterday(timestamp: string) {
  const date = new Date(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

function toItem(row: {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  href: string | null;
  actor_name: string | null;
  read_at: string | null;
  created_at: string;
}): NotificationItem {
  const badge = KIND_BADGE[row.kind] ?? KIND_BADGE.system;
  return {
    id: row.id,
    avatarName: row.actor_name ?? row.title,
    title: row.title,
    description: row.description ?? "",
    badgeLabel: badge.label,
    badgeVariant: badge.variant,
    time: formatRelative(row.created_at),
    href: row.href ?? "/notifications",
    unread: row.read_at === null,
  };
}

export async function getNotifications(): Promise<{ today: NotificationItem[]; yesterday: NotificationItem[] }> {
  const supabase = await createClient();
  if (!supabase) return { today: [], yesterday: [] };

  const { data, error } = await supabase
    .from("notifications")
    .select("id, kind, title, description, href, actor_name, read_at, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("getNotifications:", error.message);
    return { today: [], yesterday: [] };
  }

  const rows = data ?? [];
  return {
    today: rows.filter((r) => isToday(r.created_at)).map(toItem),
    yesterday: rows.filter((r) => isYesterday(r.created_at)).map(toItem),
  };
}

export async function getNotificationCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, unread: 0, highPriority: 0, systemAlerts: 0 };

  const [total, unread, review, system] = await Promise.all([
    supabase.from("notifications").select("id", { count: "exact", head: true }),
    supabase.from("notifications").select("id", { count: "exact", head: true }).is("read_at", null),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("kind", "review"),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("kind", "system"),
  ]);

  return {
    total: total.count ?? 0,
    unread: unread.count ?? 0,
    highPriority: review.count ?? 0,
    systemAlerts: system.count ?? 0,
  };
}
