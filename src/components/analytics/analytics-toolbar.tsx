"use client";

import { Upload } from "lucide-react";
import { PeriodDropdown } from "../dashboard/period-dropdown";
import { downloadCsv } from "@/lib/download-csv";
import type { ChartPoint } from "./analytics-line-chart";
import type { TopBusiness } from "./top-businesses-card";
import type { CategoryPerformanceItem } from "./category-performance-bars";

export function AnalyticsToolbar({
  userGrowth,
  reviewGrowth,
  topBusinesses,
  categories,
}: {
  userGrowth: ChartPoint[];
  reviewGrowth: ChartPoint[];
  topBusinesses: TopBusiness[];
  categories: CategoryPerformanceItem[];
}) {
  function handleExport() {
    const rows: string[][] = [
      ...userGrowth.map((p) => ["User Growth", p.label, String(p.value)]),
      ...reviewGrowth.map((p) => ["Review Growth", p.label, String(p.value)]),
      ...topBusinesses.map((b) => ["Top Business", b.name, `${b.rating} (${b.reviewCount} reviews) ${b.change}`]),
      ...categories.map((c) => ["Category Performance", c.label, `${c.percent}%`]),
    ];
    downloadCsv("cassvo-analytics.csv", ["Section", "Label", "Value"], rows);
  }

  return (
    <div className="flex items-center gap-3">
      <PeriodDropdown defaultValue="This Month" />
      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-2 rounded-xl border border-[#ececed] bg-white px-4 py-2.5 text-xs font-medium text-[#060606] hover:border-brand-red hover:text-brand-red"
      >
        Export
        <Upload size={14} />
      </button>
    </div>
  );
}
