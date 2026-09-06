import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RATE_LIMIT_WINDOW_MINUTES, MAX_FAILED_ATTEMPTS } from "@/lib/auth/rate-limit";
import type { NotificationItem, NotificationBadgeVariant } from "@/components/notifications/types";
import { formatRelative } from "@/lib/format";
import { one } from "./util";
import { resolveNames } from "./reports";
import { getPlatformSettings } from "./settings";
import type { NotificationSettings } from "@/lib/settings-schema";

/**
 * The real `notifications` table exists but has never had a single row
 * written to it (confirmed: content-range: 0 on a plain count, not an RLS
 * block) — nothing in this system populates it. Rather than show a
 * permanently-empty page, notifications are synthesized from actual
 * platform events: new reviews, flagged reviews, general problem reports,
 * and new businesses. There's no source for a real "system alert" or
 * "security alert" event, so those categories stay honestly empty instead
 * of being invented.
 *
 * securityAlert has a real source too: login_attempts (the failed-login
 * rate-limit log from src/lib/actions/auth.ts / security finding #6) —
 * an email that's hit the same MAX_FAILED_ATTEMPTS-within-
 * RATE_LIMIT_WINDOW_MINUTES threshold the login form itself blocks on is
 * a genuine security-relevant event, not a fabricated one. login_attempts
 * has zero RLS policies by design (service-role only, see
 * supabase/proposed/005_login_attempts.sql), so reading it here goes
 * through createAdminClient() rather than the regular anon-key client
 * every other query in this file uses.
 *
 * systemUpdate still has no real source — nothing in this app tracks
 * deploys, maintenance windows, or product announcements — so that
 * category stays honestly empty, same reasoning as before.
 *
 * Settings → Notifications' "Notify Me About" toggles
 * (platform_settings.notification.events, see settings-schema.ts) gate
 * which of these actually show up here: each synthesized event carries
 * the settings key it corresponds to, and one is dropped entirely if
 * that toggle is off. This is in-app only — the delivery-channel toggles
 * (Email/SMS/Push) and the Frequency setting have no effect here, since
 * this page is read live on every load rather than pushed to anyone;
 * there's no provider wired up to actually email/text/push these.
 */

type EventKey = keyof NotificationSettings["events"];
type Kind = "review" | "flag" | "business" | "security";

const KIND_META: Record<Kind, { icon: "review" | "business" | "user" | "system"; badgeLabel: string; badgeVariant: NotificationBadgeVariant }> = {
  review: { icon: "review", badgeLabel: "Review", badgeVariant: "red" },
  flag: { icon: "system", badgeLabel: "Flagged", badgeVariant: "amber" },
  business: { icon: "business", badgeLabel: "Business", badgeVariant: "green" },
  security: { icon: "system", badgeLabel: "Security", badgeVariant: "red" },
};

interface Event {
  id: string;
  kind: Kind;
  /** Which "Notify Me About" toggle this event is gated by. */
  settingKey: EventKey;
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

interface SecurityAlert {
  email: string;
  count: number;
  /** Most recent failed attempt in the window — when this alert "happened". */
  createdAt: string;
}

/**
 * One alert per email currently at or over MAX_FAILED_ATTEMPTS failed
 * sign-ins within the last RATE_LIMIT_WINDOW_MINUTES — the exact
 * threshold the login form itself rate-limits on. Naturally self-clears
 * from the feed once that email's failures age out of the window,
 * without needing any separate "resolved" state.
 *
 * Returns [] (not an error) when SUPABASE_SERVICE_ROLE_KEY isn't set —
 * same graceful-degradation pattern as every other service-role-
 * dependent feature in this app.
 */
async function getSecurityAlerts(): Promise<SecurityAlert[]> {
  const adminClient = createAdminClient();
  if (!adminClient) return [];

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { data, error } = await adminClient
    .from("login_attempts")
    .select("email, created_at")
    .eq("succeeded", false)
    .gte("created_at", windowStart)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getSecurityAlerts:", error.message);
    return [];
  }

  // Rows arrive newest-first, so the first row seen for an email is its
  // most recent failure — exactly the timestamp this alert should carry.
  const byEmail = new Map<string, SecurityAlert>();
  for (const row of data ?? []) {
    const existing = byEmail.get(row.email);
    if (existing) existing.count += 1;
    else byEmail.set(row.email, { email: row.email, count: 1, createdAt: row.created_at });
  }

  return [...byEmail.values()].filter((alert) => alert.count >= MAX_FAILED_ATTEMPTS);
}

async function getRecentEvents(limit: number): Promise<Event[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const [settings, securityAlerts, reviews, reviewReports, problemReports, businesses] = await Promise.all([
    getPlatformSettings(),
    getSecurityAlerts(),
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

  const wants = settings.notification.events;

  const names = await resolveNames(supabase, [
    ...(reviewReports.data ?? []).map((r) => r.reporter_id),
    ...(problemReports.data ?? []).map((r) => r.user_id),
  ]);

  const events: Event[] = [];

  if (wants.newReviewSubmitted) {
    for (const row of reviews.data ?? []) {
      const author = one<{ full_name: string }>(row.author);
      const business = one<{ name: string }>(row.business);
      events.push({
        id: `review-${row.id}`,
        kind: "review",
        settingKey: "newReviewSubmitted",
        avatarName: author?.full_name ?? "Someone",
        title: "New Review Submitted",
        description: business ? `${author?.full_name ?? "Someone"} reviewed ${business.name}` : "New review submitted",
        href: "/review-moderation",
        createdAt: row.created_at,
      });
    }
  }

  if (wants.reviewFlagged) {
    for (const row of reviewReports.data ?? []) {
      events.push({
        id: `review-report-${row.id}`,
        kind: "flag",
        settingKey: "reviewFlagged",
        avatarName: names.get(row.reporter_id) ?? "Someone",
        title: "Review Flagged",
        description: row.reason,
        href: `/reports/review-${row.id}`,
        createdAt: row.created_at,
      });
    }
  }

  if (wants.userReportSubmitted) {
    for (const row of problemReports.data ?? []) {
      events.push({
        id: `problem-report-${row.id}`,
        kind: "flag",
        settingKey: "userReportSubmitted",
        avatarName: names.get(row.user_id) ?? row.contact_email ?? "Someone",
        title: "Problem Reported",
        description: row.message,
        href: `/reports/problem-${row.id}`,
        createdAt: row.created_at,
      });
    }
  }

  if (wants.newBusinessRegistration) {
    for (const row of businesses.data ?? []) {
      events.push({
        id: `business-${row.id}`,
        kind: "business",
        settingKey: "newBusinessRegistration",
        avatarName: row.name,
        title: "New Business Registration",
        description: `${row.name} was added to the platform`,
        href: `/businesses/${row.id}`,
        createdAt: row.created_at,
      });
    }
  }

  if (wants.securityAlert) {
    for (const alert of securityAlerts) {
      events.push({
        id: `security-${alert.email}`,
        kind: "security",
        settingKey: "securityAlert",
        avatarName: alert.email,
        title: "Security Alert",
        description: `${alert.count} failed sign-in attempts for ${alert.email} in the last ${RATE_LIMIT_WINDOW_MINUTES} minutes`,
        href: "/settings",
        createdAt: alert.createdAt,
      });
    }
  }

  // systemUpdate has no real event source to gate — see the file-level
  // comment — so that toggle has nothing to do yet regardless of on/off.

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
    highPriority: events.filter((e) => e.kind === "flag" || e.kind === "security").length,
    // No real source for system-level alerts (deploys, outages, etc.) —
    // distinct from securityAlert, which does have a source (see above)
    // and is already counted under highPriority.
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
