import { createClient } from "@/lib/supabase/server";
import type { ReportRow, ReportStatus } from "@/components/reports/types";
import { formatRelative, formatDate } from "@/lib/format";

const TARGET_LABEL = { review: "Review", business: "Business", user: "User" } as const;

/* eslint-disable @typescript-eslint/no-explicit-any -- embedded relations */
function targetName(row: any): string {
  if (row.target_type === "business") return row.target_business_ref?.name ?? "—";
  if (row.target_type === "user") return row.target_member_ref?.full_name ?? "—";
  const review = row.target_review_ref;
  if (!review) return "—";
  const author = review.members?.full_name;
  const business = review.businesses?.name;
  return business && author ? `${business} review by ${author}` : (business ?? "Review");
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const REPORT_SELECT = `
  id, reference, target_type, reason, details, status, priority, notes, created_at,
  reporter:reported_by (id, full_name),
  target_business_ref:target_business (id, slug, name),
  target_member_ref:target_member (id, full_name),
  target_review_ref:target_review (
    id, body,
    members:author_id (full_name, location, verified),
    businesses:business_id (name, slug)
  )
`;

export async function getReports(): Promise<ReportRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("reports").select(REPORT_SELECT).order("created_at", { ascending: false });

  if (error) {
    console.error("getReports:", error.message);
    return [];
  }

  return (data ?? []).map((row, index) => ({
    id: row.id,
    reportedItem: targetName(row),
    type: TARGET_LABEL[row.target_type as keyof typeof TARGET_LABEL],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reportedBy: (row.reporter as any)?.full_name ?? "—",
    reason: row.reason,
    date: formatRelative(row.created_at),
    status: row.status as ReportStatus,
    highlighted: index === 0 && row.status === "pending",
  }));
}

export interface ReportDetailRecord {
  id: string;
  reference: string;
  status: ReportStatus;
  priority: "low" | "medium" | "high";
  reason: string;
  details: string | null;
  notes: string | null;
  createdAt: string;
  reportedDate: string;
  reportedByName: string;
  againstName: string;
  totalReports: number;
  reporterName: string;
  reporterLocation: string | null;
  reporterVerified: boolean;
  reporterTimeAgo: string;
  images: string[];
}

export async function getReport(id: string): Promise<ReportDetailRecord | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reports")
    .select(`${REPORT_SELECT}, report_evidence(url)`)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getReport:", error.message);
    return null;
  }

  const against = targetName(data);
  const { count } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("target_type", data.target_type)
    .eq(
      data.target_type === "business" ? "target_business" : data.target_type === "user" ? "target_member" : "target_review",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)[
        data.target_type === "business" ? "target_business_ref" : data.target_type === "user" ? "target_member_ref" : "target_review_ref"
      ]?.id ?? ""
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reporter = data.reporter as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const review = data.target_review_ref as any;

  return {
    id: data.id,
    reference: `#${data.reference}`,
    status: data.status as ReportStatus,
    priority: data.priority as "low" | "medium" | "high",
    reason: data.reason,
    details: data.details,
    notes: data.notes,
    createdAt: data.created_at,
    reportedDate: formatDate(data.created_at),
    reportedByName: reporter?.full_name ?? "—",
    againstName: against,
    totalReports: count ?? 1,
    reporterName: review?.members?.full_name ?? reporter?.full_name ?? "—",
    reporterLocation: review?.members?.location ?? null,
    reporterVerified: review?.members?.verified ?? false,
    reporterTimeAgo: formatRelative(data.created_at),
    images: ((data.report_evidence ?? []) as { url: string }[]).map((e) => e.url),
  };
}

export async function getReportCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, resolved: 0, pending: 0 };

  const [total, resolved, pending] = await Promise.all([
    supabase.from("reports").select("id", { count: "exact", head: true }),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "resolved"),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return { total: total.count ?? 0, resolved: resolved.count ?? 0, pending: pending.count ?? 0 };
}

/** Reports filed against one business, shaped for the business profile's Reports tab. */
export async function getBusinessReports(slugOrId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle();
  if (!business) return [];

  const { data, error } = await supabase
    .from("reports")
    .select("id, reason, status, created_at, reporter:reported_by (full_name)")
    .eq("target_business", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBusinessReports:", error.message);
    return [];
  }

  const STATUS_LABEL = { pending: "Pending", investigating: "Pending", resolved: "Resolved" } as const;

  return (data ?? []).map((row) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reporter: (row.reporter as any)?.full_name ?? "—",
    reason: row.reason,
    date: formatRelative(row.created_at),
    status: STATUS_LABEL[row.status as keyof typeof STATUS_LABEL] as "Pending" | "Resolved" | "Dismissed",
  }));
}
