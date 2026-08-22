import { Badge } from "../ui/badge";
import type { ReportKind } from "./types";

const CONFIG: Record<ReportKind, { label: string; variant: "red" | "amber" }> = {
  review: { label: "Review Report", variant: "red" },
  problem: { label: "Problem Report", variant: "amber" },
};

export function ReportKindBadge({ kind }: { kind: ReportKind }) {
  const config = CONFIG[kind];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
