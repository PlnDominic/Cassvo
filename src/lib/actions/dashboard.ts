"use server";

import { getCategoryPerformance, type GrowthPeriod } from "@/lib/data/dashboard";
import { getReviewsByArea } from "@/lib/data/map";

/**
 * Read-only re-fetches for the two Dashboard cards with their own,
 * independent Period dropdown (Reviews in Ghana, Category Performance).
 * No caller-role check here — these are the same read any signed-in
 * admin already gets just by loading /dashboard (gated by middleware +
 * RLS like every other page), just re-run for a different window on
 * demand from client state rather than a full page navigation. Plain
 * pass-throughs to the data layer; kept as actions only because a
 * Client Component can't call src/lib/data/* directly.
 */
export async function fetchCategoryPerformance(period: GrowthPeriod) {
  return getCategoryPerformance(period);
}

export async function fetchReviewsByArea(period: GrowthPeriod) {
  return getReviewsByArea(period);
}
