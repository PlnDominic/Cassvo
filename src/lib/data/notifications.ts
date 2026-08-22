import { createClient } from "@/lib/supabase/server";
import type { NotificationItem, NotificationBadgeVariant } from "@/components/notifications/types";
import { formatRelative } from "@/lib/format";
import { one } from "./util";
import { resolveNames } from "./reports";

/**
 * The real `notifications` table exists but has never had a single row
 * written to it (confirmed: content-range: 0 on a plain count, not an RLS
 * block) — nothing in this system populates it. Rather than show a
 * permanently-empty page, notifications are synthesized from actual
 * platform events: new reviews, flagged reviews, general problem reports,
 * and new businesses. There's no source for a real "system alert" or
 * "security alert" event, so those categories stay honestly empty instead
 * of being invented.
 */

type Kind = "review" | "flag" | "business";

const KIND_META: Record<Kind, { icon: "review" | "business" | "user" | "system"; badgeLabel: string; badgeVariant: NotificationBadgeVariant }> = {
  review: { icon: "review", badgeLabel: "Review", badgeVariant: "red" },
  flag: { icon: "system", badgeLabel: "Flagged", badgeVariant: "amber" },
  business: { icon: "business", badgeLabel: "Business", badgeVariant: "green" },
};

interface Event {
  id: string;
  kind: Kind;
  avatarName: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
}

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

/** Unread has no real backing (nothing tracks per-admin read state) — events from the last 24h read as unread. */
function isUnread(createdAt: string) {
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

async function getRecentEvents(limit: number): Promise<Event[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const [reviews, reviewReports, problemReports, businesses] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, content, business_id, created_at, author:profiles!user_id (full_name), business:businesses!business_id (name)")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("review_reports")
      .select("id, reason, reporter_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("problem_reports")
      .select("id, message, contact_email, user_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase.from("businesses").select("id, name, created_at").order("created_at", { ascending: false }).limit(limit),
  ]);

  const names = await resolveNames(supabase, [
    ...(reviewReports.data ?? []).map((r) => r.reporter_id),
    ...(problemReports.data ?? []).map((r) => r.user_id),
  ]);

  const events: Event[] = [];

  for (const row of reviews.data ?? []) {
    const author = one<{ full_name: string }>(row.author);
    const business = one<{ name: string }>(row.business);
    events.push({
      id: `review-${row.id}`,
      kind: "review",
      avatarName: author?.full_name ?? "Someone",
      title: "New Review Submitted",
      description: business ? `${author?.full_name ?? "Someone"} reviewed ${business.name}` : "New review submitted",
      href: "/review-moderation",
      createdAt: row.created_at,
    });
  }

  for (const row of reviewReports.data ?? []) {
    events.push({
      id: `review-report-${row.id}`,
      kind: "flag",
      avatarName: names.get(row.reporter_id) ?? "Someone",
      title: "Review Flagged",
      description: row.reason,
      href: `/reports/review-${row.id}`,
      createdAt: row.created_at,
    });
  }

  for (const row of problemReports.data ?? []) {
    events.push({
      id: `problem-report-${row.id}`,
      kind: "flag",
      avatarName: names.get(row.user_id) ?? row.contact_email ?? "Someone",
      title: "Problem Reported",
      description: row.message,
      href: `/reports/problem-${row.id}`,
      createdAt: row.created_at,
    });
  }

  for (const row of businesses.data ?? []) {
    events.push({
      id: `business-${row.id}`,
      kind: "business",
      avatarName: row.name,
      title: "New Business Registration",
      description: `${row.name} was added to the platform`,
      href: `/businesses/${row.id}`,
      createdAt: row.created_at,
    });
  }

  return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

function toItem(event: Event): NotificationItem {
  const meta = KIND_META[event.kind];
  return {
    id: event.id,
    avatarName: event.avatarName,
    title: event.title,
    description: event.description,
    badgeLabel: meta.badgeLabel,
    badgeVariant: meta.badgeVariant,
    time: formatRelative(event.createdAt),
    href: event.href,
    unread: isUnread(event.createdAt),
  };
}

export async function getNotifications(): Promise<{ today: NotificationItem[]; yesterday: NotificationItem[] }> {
  const events = await getRecentEvents(50);
  return {
    today: events.filter((e) => isToday(e.createdAt)).map(toItem),
    yesterday: events.filter((e) => isYesterday(e.createdAt)).map(toItem),
  };
}

export async function getNotificationCounts() {
  const events = await getRecentEvents(50);
  return {
    total: events.length,
    unread: events.filter((e) => isUnread(e.createdAt)).length,
    highPriority: events.filter((e) => e.kind === "flag").length,
    // No real source for system-level alerts (deploys, outages, etc.).
    systemAlerts: 0,
  };
}

export interface DropdownNotification {
  id: string;
  kind: string;
  text: string;
  time: string;
  href: string;
  unread: boolean;
}

/** The most recent notifications, for the topbar bell dropdown. */
export async function getRecentNotifications(limit = 5): Promise<DropdownNotification[]> {
  const events = await getRecentEvents(limit);
  return events.map((event) => ({
    id: event.id,
    kind: KIND_META[event.kind].icon,
    text: event.description,
    time: formatRelative(event.createdAt),
    href: event.href,
    unread: isUnread(event.createdAt),
  }));
}
