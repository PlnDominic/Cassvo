"use client";

import { useState, useTransition } from "react";
import { PeriodDropdown, type Period } from "./period-dropdown";
import { fetchCategoryPerformance } from "@/lib/actions/dashboard";

export interface CategoryRow {
  name: string;
  reviews: number;
  rating: number | null;
  percent: number;
}

const INITIAL_PERIOD: Period = "This Week";

/**
 * Had a <PeriodDropdown /> with no onChange at all — same root bug as
 * Analytics/Review Map Analysis, but this card gets its own independent
 * period (not a shared ?period= URL param, since Reviews in Ghana has
 * its own separate dropdown on the same /dashboard page) via a server
 * action call instead of a page navigation.
 */
export function CategoryPerformanceCard({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [period, setPeriod] = useState<Period>(INITIAL_PERIOD);
  const [categories, setCategories] = useState(initialCategories);
  const [pending, startTransition] = useTransition();

  function handlePeriodChange(next: Period) {
    setPeriod(next);
    startTransition(async () => {
      setCategories(await fetchCategoryPerformance(next));
    });
  }

  return (
    <div className="w-full rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium tracking-[0.01em] text-[#060606]">Category Performance</p>
        <PeriodDropdown value={period} onChange={handlePeriodChange} />
      </div>

      {pending ? (
        <p className="py-6 text-center text-xs text-[#939393]">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#939393]">No category data yet.</p>
      ) : (
        <>
          <div className="flex justify-between text-[10px] font-medium tracking-[0.01em] text-[#939393]">
            <span>Category</span>
            <div className="flex gap-9">
              <span>Reviews</span>
              <span>Avg. Rating</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {categories.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between text-xs font-medium tracking-[0.01em] text-[#060606]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="size-[11px] shrink-0 rounded-full bg-brand-red" />
                  <span>{c.name}</span>
                </div>
                <div className="flex gap-9">
                  <span className="w-[45px]">{c.reviews.toLocaleString()}</span>
                  <span className="w-[60px]">{c.rating ?? "–"}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
