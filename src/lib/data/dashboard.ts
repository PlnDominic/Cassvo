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
    .select("id, name, rating, reviews_count, cover_image, category:categories(title)")
    .order("reviews_count", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getTrendingBusinesses:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    category: one<{ title: string }>(row.category)?.title ?? "Uncategorized",
    rating: row.rating ?? 0,
    reviewCount: row.reviews_count ?? 0,
    photoUrl: row.cover_image,
  }));
}

/** The most-reviewed business, for the dashboard hero card. */
export async function getMostViewedBusiness(): Promise<
  (TrendingBusiness & { cityArea: string | null; crowdLevel: string | null }) | null
> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, rating, reviews_count, location, cover_image, category:categories(title)")
    .order("reviews_count", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getMostViewedBusiness:", error.message);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    category: one<{ title: string }>(data.category)?.title ?? "Uncategorized",
    cityArea: data.location,
    // Busy/crowd level is only tracked per-review, not on the business itself.
    crowdLevel: null,
    rating: data.rating ?? 0,
    reviewCount: data.reviews_count ?? 0,
    photoUrl: data.cover_image,
  };
}

export interface ActivityEntry {
  actor: string;
  actorAvatarUrl: string | null;
  action: string;
  time: string;
}

/**
 * The real `notifications` table exists but is currently empty, and its
 * columns haven't been reconciled (same blocker as `review_reports` /
 * `problem_reports`). Recent activity is approximated from actual review
 * submissions instead, which is real, verifiable data.
 */
export async function getRecentActivity(limit = 5): Promise<ActivityEntry[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("created_at, author:profiles!user_id (full_name, avatar_url), business:businesses!business_id (name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentActivity:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const author = one<{ full_name: string; avatar_url: string | null }>(row.author);
    const business = one<{ name: string }>(row.business);
    return {
      actor: author?.full_name ?? "Someone",
      actorAvatarUrl: author?.avatar_url ?? null,
      action: business ? `reviewed ${business.name}` : "posted a review",
      time: formatRelative(row.created_at),
    };
  });
}

/** Review counts grouped by business category, for the category-performance card. */
export async function getCategoryPerformance() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("reviews_count, rating, category:categories(title)");

  if (error) {
    console.error("getCategoryPerformance:", error.message);
    return [];
  }

  const byCategory = new Map<string, { reviews: number; ratingSum: number; rated: number }>();
  for (const row of data ?? []) {
    const name = one<{ title: string }>(row.category)?.title ?? "Uncategorized";
    const entry = byCategory.get(name) ?? { reviews: 0, ratingSum: 0, rated: 0 };
    entry.reviews += row.reviews_count ?? 0;
    if (row.rating != null && row.rating > 0) {
      entry.ratingSum += row.rating;
      entry.rated += 1;
    }
    byCategory.set(name, entry);
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

  const { data } = await supabase.from("profiles").select("created_at").gte("created_at", since.toISOString());

  for (const row of data ?? []) {
    const day = new Date(row.created_at);
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

/**
 * The real schema has only one geographic field on `businesses` —
 * `location` (free text, e.g. "Labone") — there's no separate
 * region/city tier. `getRegionStats` and `getCityStats` both group by
 * that same field rather than inventing a distinction the data doesn't
 * have.
 */
async function getLocationStats(limit?: number) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("location, reviews_count, rating")
    .not("location", "is", null);

  if (error) {
    console.error("getLocationStats:", error.message);
    return [];
  }

  const byLocation = new Map<string, { reviews: number; ratingSum: number; rated: number; businesses: number }>();
  for (const row of data ?? []) {
    const location = row.location as string;
    if (!location.trim()) continue;
    const entry = byLocation.get(location) ?? { reviews: 0, ratingSum: 0, rated: 0, businesses: 0 };
    entry.reviews += row.reviews_count ?? 0;
    entry.businesses += 1;
    if (row.rating != null && row.rating > 0) {
      entry.ratingSum += row.rating;
      entry.rated += 1;
    }
    byLocation.set(location, entry);
  }

  const ranked = [...byLocation.entries()]
    .map(([name, e]) => ({
      name,
      reviewCount: e.reviews,
      averageRating: e.rated ? Math.round((e.ratingSum / e.rated) * 10) / 10 : null,
      businessCount: e.businesses,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount);

  return limit ? ranked.slice(0, limit) : ranked;
}

/** Review volume and ratings grouped by business location. */
export async function getRegionStats(): Promise<RegionStat[]> {
  return getLocationStats();
}

export interface CityStat {
  name: string;
  percent: number;
  reviewCount: number;
  businessCount: number;
  averageRating: number | null;
}

const CITY_COLORS = ["#ea0505", "#f59e0b", "#14b8a6", "#6366f1", "#f97316"];

/** Review volume grouped by business location, for the "Reviews in Ghana" map card. */
export async function getCityStats(limit = 5): Promise<(CityStat & { color: string })[]> {
  const ranked = await getLocationStats(limit);
  const max = Math.max(1, ...ranked.map((c) => c.reviewCount));

  return ranked.map((city, i) => ({
    ...city,
    percent: Math.round((city.reviewCount / max) * 100),
    color: CITY_COLORS[i % CITY_COLORS.length],
  }));
}

export interface TrustScore {
  overall: number;
  verifiedReviewsPercent: number;
  businessesVerifiedPercent: number;
  reportResolutionRate: number;
  fakeReviewsRemovedPercent: number;
}

/**
 * Platform-health metrics for the dashboard's Trust Score card.
 * Report resolution and fake-review removal both need the report tables,
 * which aren't reconciled yet (see reports.ts) — they read 0 rather than
 * a fabricated figure until that's unblocked.
 */
export async function getTrustScore(): Promise<TrustScore> {
  const supabase = await createClient();
  if (!supabase) {
    return { overall: 0, verifiedReviewsPercent: 0, businessesVerifiedPercent: 0, reportResolutionRate: 0, fakeReviewsRemovedPercent: 0 };
  }

  const [reviewsTotal, reviewsVerified, businessesTotal, businessesVerified] = await Promise.all([
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_verified", true),
    supabase.from("businesses").select("id", { count: "exact", head: true }),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("is_verified", true),
  ]);

  const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);

  const verifiedReviewsPercent = pct(reviewsVerified.count ?? 0, reviewsTotal.count ?? 0);
  const businessesVerifiedPercent = pct(businessesVerified.count ?? 0, businessesTotal.count ?? 0);
  // Not computable until review_reports / problem_reports are reconciled.
  const reportResolutionRate = 0;
  const fakeReviewsRemovedPercent = 0;

  const overall = Math.round((verifiedReviewsPercent + businessesVerifiedPercent) / 2);

  return { overall, verifiedReviewsPercent, businessesVerifiedPercent, reportResolutionRate, fakeReviewsRemovedPercent };
}
