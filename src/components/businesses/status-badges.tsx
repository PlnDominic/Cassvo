import { Badge } from "../ui/badge";
import type { BusinessStatus } from "./types";

const VERIFICATION: Record<BusinessStatus, { label: string; variant: "green" | "amber" | "red" }> = {
  confirmed: { label: "Confirmed", variant: "green" },
  pending: { label: "Pending", variant: "amber" },
  suspended: { label: "Suspended", variant: "red" },
};

const STATUS: Record<BusinessStatus, { label: string; variant: "green" | "amber" | "red" }> = {
  confirmed: { label: "Verified", variant: "green" },
  pending: { label: "Unverified", variant: "red" },
  suspended: { label: "Suspended", variant: "red" },
};

export function VerificationBadge({ status }: { status: BusinessStatus }) {
  const config = VERIFICATION[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function BusinessStatusBadge({ status }: { status: BusinessStatus }) {
  const config = STATUS[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
