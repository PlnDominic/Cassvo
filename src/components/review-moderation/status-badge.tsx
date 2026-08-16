import { Badge } from "../ui/badge";
import type { ModerationStatus } from "./types";

const STATUS_CONFIG: Record<ModerationStatus, { label: string; variant: "amber" | "green" | "red" }> = {
  pending: { label: "Pending", variant: "amber" },
  approved: { label: "Approved", variant: "green" },
  rejected: { label: "Rejected", variant: "red" },
};

export function ModerationStatusBadge({ status }: { status: ModerationStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
