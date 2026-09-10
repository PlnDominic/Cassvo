"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PeriodDropdown, type Period } from "./period-dropdown";
import { InteractiveGhanaMapLoader } from "../analytics/interactive-ghana-map-loader";
import { fetchReviewsByArea } from "@/lib/actions/dashboard";
import type { BusinessMapMarker, AreaReviewCount } from "@/lib/data/map";

const INITIAL_PERIOD: Period = "This Week";

/**
 * Had a <PeriodDropdown /> with no onChange at all — same root bug as
 * Analytics/Review Map Analysis/Category Performance. The map pins
 * (`markers`) stay static: they show where businesses *are*, which
 * isn't time-bound. Only the side list — actual review counts per
 * area — reacts to the period, via its own independent state (not a
 * shared ?period= URL param, since Category Performance has its own
 * separate dropdown on the same /dashboard page).
 */
export function ReviewsMapCard({
  markers,
  initialAreaCounts,
}: {
  markers: BusinessMapMarker[];
  initialAreaCounts: AreaReviewCount[];
}) {
  const [period, setPeriod] = useState<Period>(INITIAL_PERIOD);
  const [areaCounts, setAreaCounts] = useState(initialAreaCounts);
  const [pending, startTransition] = useTransition();

  function handlePeriodChange(next: Period) {
    setPeriod(next);
    startTransition(async () => {
      setAreaCounts(await fetchReviewsByArea(next));
    });
  }

  const top = areaCounts.slice(0, 5);

  return (
    <div className="w-full rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium tracking-[0.01em] text-[#060606]">
          <span>Reviews in Ghana</span>
          <ChevronDown size={14} />
        </div>
        <PeriodDropdown value={period} onChange={handlePeriodChange} />
      </div>
      <div className="flex items-center gap-6">
        <div className="h-[180px] flex-1">
          <InteractiveGhanaMapLoader markers={markers} height={180} />
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {pending ? (
            <span className="text-xs text-[#939393]">Loading…</span>
          ) : top.length === 0 ? (
            <span className="text-xs text-[#939393]">No reviews yet</span>
          ) : (
            top.map((area) => (
              <div
                key={area.name}
                className="flex items-center justify-between gap-6 text-xs font-medium tracking-[0.01em] text-[#060606]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="size-[11px] shrink-0 rounded-full bg-brand-red" />
                  <span>{area.name}</span>
                </div>
                <span>{area.reviewCount}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <Link
        href="/analytics/map"
        className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-[5px] border border-[#939393]/30 px-4 py-2 text-xs font-medium tracking-[0.01em] text-[#060606]"
      >
        View Full Analysis
        <ChevronDown size={14} />
      </Link>
    </div>
  );
}
