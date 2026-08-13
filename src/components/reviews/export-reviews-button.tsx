"use client";

import { Plus } from "lucide-react";
import type { ReviewData } from "./review-card";

function toCsv(reviews: ReviewData[]) {
  const header = ["Reviewer", "Location", "Rating", "Review Count", "Date", "Crowd Level", "Review"];
  const rows = reviews.map((r) => [
    r.name,
    r.location,
    r.rating.toString(),
    r.reviewCount.toString(),
    r.date,
    r.crowdLevel,
    `"${r.text.replace(/"/g, '""')}"`,
  ]);
  return [header, ...rows].map((row) => row.join(",")).join("\n");
}

export function ExportReviewsButton({ reviews }: { reviews: ReviewData[] }) {
  function handleExport() {
    const csv = toCsv(reviews);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reviews.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-medium text-white"
    >
      <Plus size={16} />
      Export Reviews
    </button>
  );
}
