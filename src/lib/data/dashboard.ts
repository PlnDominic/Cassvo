import { createClient } from "@/lib/supabase/server";
import { one } from "./util";
import { formatRelative } from "@/lib/format";

export interface TrendingBusiness {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  photoUrl: string | null;
}

export async function getTrendingBusinesses(limit = 4): Promise<TrendingBusiness[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, slug, name, category, cover_image_url, business_stats(review_count, average_rating)")
    .eq("status", "confirmed")
    .limit(limit);

  if (error) {
    console.error("getTrendingBusinesses:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => {
      const stats = one<{ review_count: number; average_rating: number | null }>(row.business_stats);
      return {
        id: row.slug ?? row.id,
        name: row.name,
        category: row.category,
        rating: stats?.average_rating ?? 0,
        reviewCount: stats?.review_count ?? 0,
        photoUrl: row.cover_image_url,
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount);
}

/** The most-reviewed confirmed business, for the dashboard hero card. */
export async function getMostViewedBusiness(): Promise<TrendingBusiness & { cityArea: string | null; crowdLevel: string | null } | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select("id, slug, name, category, city_area, cover_image_url, business_stats(review_count, average_rating)")
    .eq("status", "confirmed")
    .limit(20);

  if (error || !data?.length) {
    if (error) console.error("getMostViewedBusiness:", error.message);
    return null;
  }

  const ranked = data
    .map((row) => {
      const stats = one<{ review_count: number; average_rating: number | null }>(row.business_stats);
      return {
        id: row.slug ?? row.id,
        name: row.name,
        category: row.category,
        cityArea: row.city_area,
        crowdLevel: null,
        rating: stats?.average_rating ?? 0,
        reviewCount: stats?.review_count ?? 0,
        photoUrl: row.cover_image_url,
      };
    })
    .sort((a, b) => b.reviewCount - a.reviewCount);

  return ranked[0] ?? null;
}

export interface ActivityEntry {
  actor: string;
  action: string;
  time: string;
}

export async function getRecentActivity(limit = 5): Promise<ActivityEntry[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("title, description, actor_name, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentActivity:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    actor: row.actor_name ?? "System",
    action: row.description ?? row.title,
    time: formatRelative(row.created_at),
  }));
}

/** Review counts grouped by business category, for the category-performance card. */
export async function getCategoryPerformance() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("category, business_stats(review_count, average_rating)");

  if (error) {
    console.error("getCategoryPerformance:", error.message);
    return [];
  }

  const byCategory = new Map<string, { reviews: number; ratingSum: number; rated: number }>();
  for (const row of data ?? []) {
    const stats = one<{ review_count: number; average_rating: number | null }>(row.business_stats);
    const entry = byCategory.get(row.category) ?? { reviews: 0, ratingSum: 0, rated: 0 };
    entry.reviews += stats?.review_count ?? 0;
    if (stats?.average_rating != null) {
      entry.ratingSum += stats.average_rating;
      entry.rated += 1;
    }
    byCategory.set(row.category, entry);
  }

  const max = Math.max(1, ...[...byCategory.values()].map((e) => e.reviews));

  return [...byCategory.entries()]
    .map(([name, e]) => ({
      name,
      reviews: e.reviews,
      rating: e.rated ? Math.round((e.ratingSum / e.rated) * 10) / 10 : null,
      percent: Math.round((e.reviews / max) * 100),
    }))
    .sort((a, b) => b.reviews - a.reviews);
}

/** Daily review counts over the last `days` days, for the growth charts. */
export async function getReviewGrowth(days = 8) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: days }, (_, i) => {
    const date = new Date(since);
    date.setDate(since.getDate() + i);
    return { date, label: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }), value: 0 };
  });

  if (!supabase) return buckets.map(({ label, value }) => ({ label, value }));

  const { data } = await supabase.from("reviews").select("created_at").gte("created_at", since.toISOString());

  for (const row of data ?? []) {
    const day = new Date(row.created_at);
    day.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.date.getTime() === day.getTime());
    if (bucket) bucket.value += 1;
  }

  return buckets.map(({ label, value }) => ({ label, value }));
}

export async function getMemberGrowth(days = 8) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: days }, (_, i) => {
    const date = new Date(since);
    date.setDate(since.getDate() + i);
    return { date, label: date.toLocaleDateString("en-GB", { month: "short", day: "numeric" }), value: 0 };
  });

  if (!supabase) return buckets.map(({ label, value }) => ({ label, value }));

  const { data } = await supabase.from("members").select("joined_at").gte("joined_at", since.toISOString());

  for (const row of data ?? []) {
    const day = new Date(row.joined_at);
    day.setHours(0, 0, 0, 0);
    const bucket = buckets.find((b) => b.date.getTime() === day.getTime());
    if (bucket) bucket.value += 1;
  }

  return buckets.map(({ label, value }) => ({ label, value }));
}

export interface RegionStat {
  name: string;
  reviewCount: number;
  averageRating: number | null;
  businessCount: number;
}

/** Review volume and ratings grouped by business region. */
export async function getRegionStats(): Promise<RegionStat[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("region, business_stats(review_count, average_rating)")
    .not("region", "is", null);

  if (error) {
    console.error("getRegionStats:", error.message);
    return [];
  }

  const byRegion = new Map<string, { reviews: number; ratingSum: number; rated: number; businesses: number }>();
  for (const row of data ?? []) {
    const region = row.region as string;
    const stats = one<{ review_count: number; average_rating: number | null }>(row.business_stats);
    const entry = byRegion.get(region) ?? { reviews: 0, ratingSum: 0, rated: 0, businesses: 0 };
    entry.reviews += stats?.review_count ?? 0;
    entry.businesses += 1;
    if (stats?.average_rating != null) {
      entry.ratingSum += stats.average_rating;
      entry.rated += 1;
    }
    byRegion.set(region, entry);
  }

  return [...byRegion.entries()]
    .map(([name, e]) => ({
      name,
      reviewCount: e.reviews,
      averageRating: e.rated ? Math.round((e.ratingSum / e.rated) * 10) / 10 : null,
      businessCount: e.businesses,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount);
}
