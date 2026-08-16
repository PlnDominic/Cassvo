import { Badge } from "../../ui/badge";
import type { DraftStatus } from "./types";

const CONFIG: Record<DraftStatus, { label: string; variant: "amber" | "red" | "gray" }> = {
  "in-progress": { label: "In Progress", variant: "amber" },
  "pending-verification": { label: "Pending Verification", variant: "red" },
  incomplete: { label: "Incomplete", variant: "gray" },
};

export function DraftStatusBadge({ status }: { status: DraftStatus }) {
  const config = CONFIG[status];
  return (
    <Badge variant={config.variant}>
      <span className={status === "incomplete" ? "opacity-60" : ""}>{config.label}</span>
    </Badge>
  );
}
