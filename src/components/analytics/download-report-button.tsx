"use client";

import { Plus } from "lucide-react";
import { downloadCsv } from "@/lib/download-csv";
import type { OverviewStat } from "./overview-stats-card";
import type { RegionPerformance } from "./region-performance-overview";

export function DownloadReportButton({
  stats,
  regions,
}: {
  stats: OverviewStat[];
  regions: RegionPerformance[];
}) {
  function handleDownload() {
    const rows: string[][] = [
      ...stats.map((s) => ["Metric", s.label, s.value, s.trend ?? ""]),
      ...regions.map((r) => ["Region", r.name, `${r.reviewCount} reviews`, `${r.rating} (${r.trend})`]),
    ];
    downloadCsv("review-map-analysis.csv", ["Section", "Label", "Value", "Detail"], rows);
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
