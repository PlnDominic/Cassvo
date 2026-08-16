"use client";

import { Plus } from "lucide-react";
import type { OverviewStat } from "./overview-stats-card";
import type { RegionPerformance } from "./region-performance-overview";

function toCsv(stats: OverviewStat[], regions: RegionPerformance[]) {
  const statsSection = [["Metric", "Value", "Trend"], ...stats.map((s) => [s.label, s.value, s.trend ?? ""])];
  const regionsSection = [
    ["Region", "Reviews", "Avg. Rating", "Trend"],
    ...regions.map((r) => [r.name, r.reviewCount, r.rating, r.trend]),
  ];
  return [...statsSection, [], ...regionsSection].map((row) => row.join(",")).join("\n");
}

export function DownloadReportButton({
  stats,
  regions,
}: {
  stats: OverviewStat[];
  regions: RegionPerformance[];
}) {
  function handleDownload() {
    const csv = toCsv(stats, regions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "review-map-analysis.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white"
    >
      <Plus size={16} />
      Download Report
    </button>
  );
}
