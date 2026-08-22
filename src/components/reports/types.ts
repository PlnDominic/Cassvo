export type ReportStatus = "pending" | "investigating" | "resolved";

export interface ReportRow {
  id: string;
  reportedItem: string;
  type: "Review" | "Business" | "User";
  reportedBy: string;
  reason: string;
  date: string;
  status: ReportStatus;
  highlighted?: boolean;
}
