import { createClient } from "@/lib/supabase/server";
import type { ReportRow } from "@/components/reports/types";
import { formatRelative, formatDate } from "@/lib/format";
import { one } from "./util";

/**
 * The real schema has two separate, unrelated report tables and no
 * status/priority workflow at all — a report simply exists once filed:
 *
 *  - review_reports(id, review_id, reporter_id, reason, created_at):
 *    a member flagging a specific review.
 *  - problem_reports(id, user_id, message, contact_email, created_at):
 *    general feedback/issue reports, not tied to any review, business,
 *    or user — closer to a contact form than a moderation queue.
 *
 * Neither reporter_id nor problem_reports.user_id has a declared FK to
 * `profiles` (they reference auth.users directly), so reporter names
 * are resolved with a manual second query rather than a select() embed.
 */

export async function resolveNames(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>, ids: (string | null)[]) {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (unique.length === 0) return new Map<string, string>();

  const { data } = await supabase.from("profiles").select("id, full_name").in("id", unique);
  return new Map((data ?? []).map((row) => [row.id, row.full_name as string]));
}

export async function getReports(): Promise<ReportRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const [reviewReports, problemReports] = await Promise.all([
    supabase
      .from("review_reports")
      .select(
        "id, reason, created_at, reporter_id, review:reviews!review_id (business:businesses!business_id (name))",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("problem_reports")
      .select("id, message, contact_email, created_at, user_id")
      .order("created_at", { ascending: false }),
  ]);

  if (reviewReports.error) console.error("getReports (review_reports):", reviewReports.error.message);
  if (problemReports.error) console.error("getReports (problem_reports):", problemReports.error.message);

  const names = await resolveNames(supabase, [
    ...(reviewReports.data ?? []).map((r) => r.reporter_id),
    ...(problemReports.data ?? []).map((r) => r.user_id),
  ]);

  const rows = [
    ...(reviewReports.data ?? []).map((row) => {
      const review = one<{ business: { name: string } | { name: string }[] | null }>(row.review);
      const business = review ? one<{ name: string }>(review.business) : null;
      return {
        createdAt: row.created_at,
        row: {
          id: `review-${row.id}`,
          kind: "review" as const,
          kindLabel: "Review Report" as const,
          reportedItem: business ? `Review for ${business.name}` : "Review",
          reportedBy: names.get(row.reporter_id) ?? "—",
          reason: row.reason,
          date: formatRelative(row.created_at),
        } satisfies ReportRow,
      };
    }),
    ...(problemReports.data ?? []).map((row) => ({
      createdAt: row.created_at,
      row: {
        id: `problem-${row.id}`,
        kind: "problem" as const,
        kindLabel: "Problem Report" as const,
        reportedItem: "General Feedback",
        reportedBy: names.get(row.user_id) ?? row.contact_email ?? "Anonymous",
        reason: row.message,
        date: formatRelative(row.created_at),
      } satisfies ReportRow,
    })),
  ];

  return rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((r) => r.row);
}

export async function getReportCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, reviewReports: 0, problemReports: 0 };

  const [reviewCount, problemCount] = await Promise.all([
    supabase.from("review_reports").select("id", { count: "exact", head: true }),
    supabase.from("problem_reports").select("id", { count: "exact", head: true }),
  ]);

  const reviewReports = reviewCount.count ?? 0;
  const problemReports = problemCount.count ?? 0;
  return { total: reviewReports + problemReports, reviewReports, problemReports };
}

export interface ReportDetail {
  id: string;
  kind: "review" | "problem";
  kindLabel: "Review Report" | "Problem Report";
  reason: string;
  date: string;
  reporterName: string;
  reporterTimeAgo: string;
  /** How many times this exact target has been reported. Always 1 for a problem report, since those aren't tied to a shared target. */
  totalReports: number;
  reviewId: string | null;
  reviewContent: string | null;
  reviewRating: number | null;
  businessId: string | null;
  businessName: string | null;
  contactEmail: string | null;
}

/** `id` is the composite id from getReports(), e.g. "review-<uuid>" or "problem-<uuid>". */
export async function getReport(compositeId: string): Promise<ReportDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  if (compositeId.startsWith("review-")) {
    const id = compositeId.slice("review-".length);
    const { data, error } = await supabase
      .from("review_reports")
      .select(
        "id, reason, created_at, reporter_id, review:reviews!review_id (id, content, rating, business_id, business:businesses!business_id (id, name))",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getReport:", error.message);
      return null;
    }

    const review = one<{
      id: string;
      content: string;
      rating: number;
      business_id: string;
      business: { id: string; name: string } | { id: string; name: string }[] | null;
    }>(data.review);
    const business = review ? one<{ id: string; name: string }>(review.business) : null;
    const names = await resolveNames(supabase, [data.reporter_id]);

    const { count } = review
      ? await supabase.from("review_reports").select("id", { count: "exact", head: true }).eq("review_id", review.id)
      : { count: 1 };

    return {
      id: compositeId,
      kind: "review",
      kindLabel: "Review Report",
      reason: data.reason,
      date: formatDate(data.created_at),
      reporterName: names.get(data.reporter_id) ?? "—",
      reporterTimeAgo: formatRelative(data.created_at),
      totalReports: count ?? 1,
      reviewId: review?.id ?? null,
      reviewContent: review?.content ?? null,
      reviewRating: review?.rating ?? null,
      businessId: business?.id ?? null,
      businessName: business?.name ?? null,
      contactEmail: null,
    };
  }

  if (compositeId.startsWith("problem-")) {
    const id = compositeId.slice("problem-".length);
    const { data, error } = await supabase
      .from("problem_reports")
      .select("id, message, contact_email, created_at, user_id")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getReport:", error.message);
      return null;
    }

    const names = await resolveNames(supabase, [data.user_id]);

    return {
      id: compositeId,
      kind: "problem",
      kindLabel: "Problem Report",
      reason: data.message,
      date: formatDate(data.created_at),
      reporterName: names.get(data.user_id) ?? data.contact_email ?? "Anonymous",
      reporterTimeAgo: formatRelative(data.created_at),
      totalReports: 1,
      reviewId: null,
      reviewContent: null,
      reviewRating: null,
      businessId: null,
      businessName: null,
      contactEmail: data.contact_email,
    };
  }

  return null;
}

/** Reports filed against reviews belonging to one business — the real schema has no direct business-level report. */
export async function getBusinessReports(businessId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("review_reports")
    .select("id, reason, created_at, reporter_id, reviews!review_id!inner (business_id)")
    .eq("reviews.business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBusinessReports:", error.message);
    return [];
  }

  const names = await resolveNames(supabase, (data ?? []).map((row) => row.reporter_id));

  return (data ?? []).map((row) => ({
    reporter: names.get(row.reporter_id) ?? "—",
    reason: row.reason,
    date: formatRelative(row.created_at),
  }));
}
