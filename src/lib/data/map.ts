import { createClient } from "@/lib/supabase/server";
import { one } from "./util";
import { matchNeighborhood } from "@/lib/geo/ghana-neighborhoods";
import { resolvePeriodWindow, type GrowthPeriod } from "./dashboard";

export interface MapBusiness {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
}

export interface BusinessMapMarker {
  name: string;
  lat: number;
  lng: number;
  businessCount: number;
  reviewCount: number;
  averageRating: number | null;
  businesses: MapBusiness[];
}

/**
 * Real businesses clustered onto known Accra-area neighborhood coordinates
 * (see lib/geo/ghana-neighborhoods.ts) — there's no lat/lng column on
 * `businesses`, so this is the honest, achievable version of "plot
 * businesses on a map" without fabricating per-business GPS or doing live
 * geocoding of hundreds of rows on every request.
 */
export async function getBusinessMapMarkers(): Promise<BusinessMapMarker[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, location, rating, reviews_count, category:categories(title)")
    .not("location", "is", null);

  if (error) {
    console.error("getBusinessMapMarkers:", error.message);
    return [];
  }

  const byArea = new Map<
    string,
    { lat: number; lng: number; ratingSum: number; rated: number; reviewCount: number; businesses: MapBusiness[] }
  >();

  for (const row of data ?? []) {
    const location = row.location as string;
    if (!location.trim()) continue;
    const area = matchNeighborhood(location);
    const category = one<{ title: string }>(row.category);

    const entry = byArea.get(area.name) ?? {
      lat: area.lat,
      lng: area.lng,
      ratingSum: 0,
      rated: 0,
      reviewCount: 0,
      businesses: [],
    };
    entry.reviewCount += row.reviews_count ?? 0;
    if (row.rating != null && row.rating > 0) {
      entry.ratingSum += row.rating;
      entry.rated += 1;
    }
    entry.businesses.push({
      id: row.id,
      name: row.name,
      category: category?.title ?? "Uncategorized",
      rating: row.rating ?? 0,
      reviewCount: row.reviews_count ?? 0,
    });
    byArea.set(area.name, entry);
  }

  return [...byArea.entries()]
    .map(([name, e]) => ({
      name,
      lat: e.lat,
      lng: e.lng,
      businessCount: e.businesses.length,
      reviewCount: e.reviewCount,
      averageRating: e.rated ? Math.round((e.ratingSum / e.rated) * 10) / 10 : null,
      businesses: e.businesses.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8),
    }))
    .sort((a, b) => b.businessCount - a.businessCount);
}

export interface AreaReviewCount {
  name: string;
  reviewCount: number;
}

/**
 * Reviews actually posted within `period`, grouped onto the same
 * neighborhood clusters as getBusinessMapMarkers() — backs the Reviews
 * in Ghana dashboard card's side list. Deliberately separate from
 * getBusinessMapMarkers(): the map pins represent where businesses
 * *are* (not time-bound — a business's location doesn't change by
 * period), but this list is genuinely "reviews this week/month/etc.",
 * so it has to query `reviews` directly rather than reuse the
 * denormalized reviews_count on businesses (same reasoning as
 * dashboard.ts's getRegionStats/getCategoryPerformance period variants).
 */
export async function getReviewsByArea(period: GrowthPeriod): Promise<AreaReviewCount[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { since } = await resolvePeriodWindow(supabase, "reviews", period);

  const { data, error } = await supabase
    .from("reviews")
    .select("business:businesses!business_id (location)")
    .gte("created_at", since.toISOString());

  if (error) {
    console.error("getReviewsByArea:", error.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const business = one<{ location: string | null }>(row.business);
    const location = business?.location?.trim();
    if (!location) continue;
    const area = matchNeighborhood(location);
    counts.set(area.name, (counts.get(area.name) ?? 0) + 1);
  }

  return [...counts.entries()].map(([name, reviewCount]) => ({ name, reviewCount })).sort((a, b) => b.reviewCount - a.reviewCount);
}
