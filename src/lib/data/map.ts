import { createClient } from "@/lib/supabase/server";
import { one } from "./util";
import { matchNeighborhood } from "@/lib/geo/ghana-neighborhoods";

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
