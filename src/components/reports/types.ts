export type ReportKind = "review" | "problem";

export type ReportTypeFilter = "All Types" | "Review Report" | "Problem Report";
export type ReportDateFilter = "Filters" | "Today" | "This Week" | "This Month";

export interface ReportRow {
  id: string;
  kind: ReportKind;
  kindLabel: "Review Report" | "Problem Report";
  reportedItem: string;
  reportedBy: string;
  reason: string;
  /** Formatted for display (e.g. "2 hours ago"). */
  date: string;
  /** Raw ISO timestamp — for actual date filtering; `date` is already relative-formatted and unparseable for that. */
  createdAt: string;
}
