import type { ReportStatus } from "../types";

export interface ReportDetailData {
  refId: string;
  status: ReportStatus;
  reportedDate: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  reportedByName: string;
  against: string;
  totalReports: string;
  currentStatus: string;
  reporterName: string;
  reporterLocation: string;
  reporterTimeAgo: string;
  reporterVerified: boolean;
  evidenceReasonText: string;
  images: string[];
  recommendationTitle: string;
  recommendationText: string;
}
