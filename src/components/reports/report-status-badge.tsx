import { Badge } from "../ui/badge";
import type { ReportStatus } from "./types";

const CONFIG: Record<ReportStatus, { label: string; variant: "red" | "purple" | "green" }> = {
  pending: { label: "Pending", variant: "red" },
  investigating: { label: "Investigating", variant: "purple" },
  resolved: { label: "Resolved", variant: "green" },
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const config = CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
