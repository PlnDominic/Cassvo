"use client";

import { useState } from "react";
import { ReportsToolbar } from "./reports-toolbar";
import { ReportsTable } from "./reports-table";
import type { ReportRow, ReportTypeFilter, ReportDateFilter } from "./types";

/** Mirrors moderation-board.tsx's withinMonth() — same shape, different option labels ("Today" instead of "This Year"). */
function withinDateFilter(createdAt: string, filter: ReportDateFilter): boolean {
  if (filter === "Filters") return true;
  const date = new Date(createdAt);
  const now = new Date();
  if (filter === "Today") return date.toDateString() === now.toDateString();
  if (filter === "This Week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    return date >= weekAgo;
  }
  if (filter === "This Month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  return true;
}

const TYPE_TO_KIND: Record<Exclude<ReportTypeFilter, "All Types">, ReportRow["kind"]> = {
  "Review Report": "review",
  "Problem Report": "problem",
};

/**
 * Reports page previously rendered ReportsToolbar and ReportsTable
 * directly from the server page with no client state at all — both
 * FilterDropdowns changed their own label and nothing else. This wraps
 * them the same way moderation-board.tsx already does for Review
 * Moderation's own filters, filtering the already-loaded reports list
 * client-side.
 */
export function ReportsBoard({
  reports,
  escalationThreshold,
}: {
  reports: ReportRow[];
  /** From Settings -> Moderation. Reports on a review reported this many times sort first and get an Escalated badge. */
  escalationThreshold: number;
}) {
  const [typeFilter, setTypeFilter] = useState<ReportTypeFilter>("All Types");
  const [dateFilter, setDateFilter] = useState<ReportDateFilter>("Filters");

  const isEscalated = (report: ReportRow) =>
    report.targetReportCount !== null && report.targetReportCount >= escalationThreshold;

  // Escalated first; Array.prototype.sort is stable, so newest-first order holds within each group.
  const filtered = reports
    .filter((report) => {
      if (typeFilter !== "All Types" && report.kind !== TYPE_TO_KIND[typeFilter]) return false;
      if (!withinDateFilter(report.createdAt, dateFilter)) return false;
      return true;
    })
    .sort((a, b) => Number(isEscalated(b)) - Number(isEscalated(a)));

  return (
    <div className="flex flex-col gap-6">
      <ReportsToolbar
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />
      <ReportsTable reports={filtered} isEscalated={isEscalated} />
    </div>
  );
}
