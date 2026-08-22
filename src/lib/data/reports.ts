import type { ReportRow, ReportStatus } from "@/components/reports/types";

/**
 * BLOCKED: the real schema has no single `reports` table. Reports live in
 * two separate tables — `review_reports` and `problem_reports` — and both
 * are currently empty, so their columns can't be inspected via the anon
 * key (Supabase only exposes a table's shape through the Management API,
 * which needs elevated org access we don't have, or by reading a row that
 * doesn't exist yet). Every function below intentionally returns an empty/
 * null result rather than querying a table that doesn't match, so these
 * pages render correctly empty instead of erroring.
 *
 * To unblock: share the columns of `review_reports` and `problem_reports`
 * (a Table Editor screenshot of each, like the one used to reconcile the
 * other tables, is enough) and this module gets rewritten against them.
 */

export async function getReports(): Promise<ReportRow[]> {
  return [];
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

export async function getReport(_id: string): Promise<ReportDetailRecord | null> {
  return null;
}

export async function getReportCounts() {
  return { total: 0, resolved: 0, pending: 0 };
}

/** Reports filed against one business, shaped for the business profile's Reports tab. */
export async function getBusinessReports(_businessId: string) {
  return [] as { reporter: string; reason: string; date: string; status: "Pending" | "Resolved" | "Dismissed" }[];
}
