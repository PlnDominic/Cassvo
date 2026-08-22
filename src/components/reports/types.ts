export type ReportKind = "review" | "problem";

export interface ReportRow {
  id: string;
  kind: ReportKind;
  kindLabel: "Review Report" | "Problem Report";
  reportedItem: string;
  reportedBy: string;
  reason: string;
  date: string;
}
