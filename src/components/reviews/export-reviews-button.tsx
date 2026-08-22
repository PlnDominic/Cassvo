"use client";

import { Plus } from "lucide-react";
import { downloadCsv } from "@/lib/download-csv";
import type { ReviewData } from "./review-card";

export function ExportReviewsButton({ reviews }: { reviews: ReviewData[] }) {
  function handleExport() {
    downloadCsv(
      "reviews.csv",
      ["Reviewer", "Location", "Rating", "Review Count", "Date", "Crowd Level", "Review"],
      reviews.map((r) => [
        r.name,
        r.location,
        r.rating.toString(),
        r.reviewCount.toString(),
        r.date,
        r.crowdLevel,
        r.text,
      ])
    );
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
