import { createClient } from "@/lib/supabase/server";
import type { ModerationStatus } from "@/components/review-moderation/types";
import { formatDate, formatRelative } from "@/lib/format";
import { one } from "./util";

export interface ReviewRecord {
  id: string;
  authorName: string;
  authorLocation: string | null;
  authorVerified: boolean;
  authorAvatarUrl: string | null;
  timeAgo: string;
  businessName: string;
  businessCategory: string;
  businessLocation: string | null;
  businessPhotoUrl: string | null;
  rating: number;
  reviewCount: number;
  date: string;
  priceLevel: number;
  crowdLevel: string;
  text: string;
  photos: string[];
  tags: string[];
  status: ModerationStatus;
  helpful: number;
  notHelpful: number;
}

const REVIEW_SELECT = `
  id, rating, body, price_level, crowd_level, tags, status, helpful_count,
  not_helpful_count, created_at,
  members:author_id (id, full_name, location, verified, avatar_url),
  businesses:business_id (id, slug, name, category, city_area, cover_image_url, business_stats(review_count)),
  review_photos (url, position)
`;

/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase's inferred
   embedded-relation shapes are unions we normalise by hand below. */
function toRecord(row: any): ReviewRecord {
  const author = row.members;
  const business = row.businesses;
  const photos = ((row.review_photos ?? []) as { url: string; position: number }[])
    .sort((a, b) => a.position - b.position)
    .map((p) => p.url);

  return {
    id: row.id,
    authorName: author?.full_name ?? "Unknown",
    authorLocation: author?.location ?? null,
    authorVerified: author?.verified ?? false,
    authorAvatarUrl: author?.avatar_url ?? null,
    timeAgo: formatRelative(row.created_at),
    businessName: business?.name ?? "—",
    businessCategory: business?.category ?? "—",
    businessLocation: business?.city_area ?? null,
    businessPhotoUrl: business?.cover_image_url ?? null,
    rating: Number(row.rating ?? 0),
    reviewCount: one<{ review_count: number }>(business?.business_stats)?.review_count ?? 0,
    date: formatDate(row.created_at),
    priceLevel: row.price_level ?? 1,
    crowdLevel: row.crowd_level ?? "—",
    text: row.body,
    photos,
    tags: row.tags ?? [],
    status: row.status as ModerationStatus,
    helpful: row.helpful_count ?? 0,
    notHelpful: row.not_helpful_count ?? 0,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getReviews(businessSlugOrId?: string): Promise<ReviewRecord[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase.from("reviews").select(REVIEW_SELECT).order("created_at", { ascending: false });

  if (businessSlugOrId) {
    const { data: business } = await supabase
      .from("businesses")
      .select("id")
      .or(`slug.eq.${businessSlugOrId},id.eq.${businessSlugOrId}`)
      .maybeSingle();
    if (!business) return [];
    query = query.eq("business_id", business.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getReviews:", error.message);
    return [];
  }
  return (data ?? []).map(toRecord);
}

export async function getReviewCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, pending: 0, approved: 0, rejected: 0, averageRating: null as number | null };

  const [total, pending, approved, rejected, ratings] = await Promise.all([
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "rejected"),
    supabase.from("reviews").select("rating").eq("status", "approved"),
  ]);

  const rows = ratings.data ?? [];
  const averageRating = rows.length
    ? Math.round((rows.reduce((sum, r) => sum + Number(r.rating), 0) / rows.length) * 10) / 10
    : null;

  return {
    total: total.count ?? 0,
    pending: pending.count ?? 0,
    approved: approved.count ?? 0,
    rejected: rejected.count ?? 0,
    averageRating,
  };
}

/** Distribution of approved ratings, 5★ down to 1★. */
export async function getBusinessRatingBreakdown(slugOrId: string) {
  const supabase = await createClient();
  const empty = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percent: 0 }));
  if (!supabase) return empty;

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle();
  if (!business) return empty;

  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("status", "approved")
    .eq("business_id", business.id);

  if (!data?.length) return empty;
  const total = data.length;
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = data.filter((r) => Math.round(Number(r.rating)) === stars).length;
    return { stars, count, percent: Math.round((count / total) * 100) };
  });
}

export async function getRatingBreakdown() {
  const supabase = await createClient();
  const empty = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percent: 0 }));
  if (!supabase) return empty;

  const { data, error } = await supabase.from("reviews").select("rating").eq("status", "approved");
  if (error || !data?.length) {
    if (error) console.error("getRatingBreakdown:", error.message);
    return empty;
  }

  const total = data.length;
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = data.filter((r) => Math.round(Number(r.rating)) === stars).length;
    return { stars, count, percent: Math.round((count / total) * 100) };
  });
}
