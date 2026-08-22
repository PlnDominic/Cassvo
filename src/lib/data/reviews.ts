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
  createdAt: string;
  priceLevel: number;
  crowdLevel: string;
  text: string;
  photos: string[];
  tags: string[];
  status: ModerationStatus;
  helpful: number;
  notHelpful: number;
}

const REVIEW_FIELDS = `
  id, rating, content, price_rating, busy_status, loved_tags, is_pending, is_verified,
  upvotes_count, created_at, images,
  author:profiles!user_id (id, full_name, location, avatar_url),
  business:businesses!business_id (id, name, cover_image, reviews_count, category:categories(title))
`;

/**
 * `is_rejected` is a proposed additive column (see
 * supabase/proposed/004_review_moderation.sql) that may not exist yet on
 * every environment. Select it optimistically, but fall back to the
 * columns that are guaranteed to exist rather than letting the whole
 * reviews list go blank if the migration hasn't been run yet.
 */
const REVIEW_SELECT = `${REVIEW_FIELDS.trim()}, is_rejected`;

export function isMissingColumnError(error: { code?: string; message?: string } | null) {
  return error?.code === "42703" || error?.code === "PGRST204" || Boolean(error?.message?.includes("is_rejected"));
}

function deriveStatus(isPending: boolean | null, isRejected: boolean | null | undefined): ModerationStatus {
  if (isRejected) return "rejected";
  return isPending ? "pending" : "approved";
}

/** `price_rating` is a free-text string of "₵" symbols; count them for the numeric level the UI expects. */
function countCedis(priceRating: string | null): number {
  return priceRating ? (priceRating.match(/₵/g)?.length ?? 0) : 0;
}

/* eslint-disable @typescript-eslint/no-explicit-any -- Supabase's inferred
   embedded-relation shapes are unions we normalise by hand below. */
function toRecord(row: any): ReviewRecord {
  const author = one<{ id: string; full_name: string; location: string | null; avatar_url: string | null }>(
    row.author,
  );
  const business = one<{
    id: string;
    name: string;
    cover_image: string | null;
    reviews_count: number;
    category: { title: string } | { title: string }[] | null;
  }>(row.business);
  const category = business ? one<{ title: string }>(business.category) : null;

  return {
    id: row.id,
    authorName: author?.full_name ?? "Unknown",
    authorLocation: author?.location || null,
    // The real schema has no per-review "verified" flag on the author —
    // only the review itself carries `is_verified`.
    authorVerified: row.is_verified ?? false,
    authorAvatarUrl: author?.avatar_url ?? null,
    timeAgo: formatRelative(row.created_at),
    businessName: business?.name ?? "—",
    businessCategory: category?.title ?? "—",
    // The real `businesses` table has no separate city/region field.
    businessLocation: null,
    businessPhotoUrl: business?.cover_image ?? null,
    rating: Number(row.rating ?? 0),
    reviewCount: business?.reviews_count ?? 0,
    date: formatDate(row.created_at),
    createdAt: row.created_at,
    priceLevel: countCedis(row.price_rating),
    crowdLevel: row.busy_status ?? "—",
    text: row.content,
    photos: row.images ?? [],
    tags: row.loved_tags ?? [],
    status: deriveStatus(row.is_pending, row.is_rejected),
    helpful: row.upvotes_count ?? 0,
    // The real schema has no downvote count.
    notHelpful: 0,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getReviews(businessId?: string): Promise<ReviewRecord[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase.from("reviews").select(REVIEW_SELECT).order("created_at", { ascending: false });
  if (businessId) query = query.eq("business_id", businessId);

  const { data, error } = await query;

  if (error && isMissingColumnError(error)) {
    // 004_review_moderation.sql hasn't been run yet — retry without is_rejected.
    let fallback = supabase.from("reviews").select(REVIEW_FIELDS).order("created_at", { ascending: false });
    if (businessId) fallback = fallback.eq("business_id", businessId);
    const retry = await fallback;
    if (retry.error) {
      console.error("getReviews:", retry.error.message);
      return [];
    }
    return (retry.data ?? []).map(toRecord);
  }

  if (error) {
    console.error("getReviews:", error.message);
    return [];
  }
  return (data ?? []).map(toRecord);
}

export async function getReviewCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, pending: 0, approved: 0, rejected: 0, averageRating: null as number | null };

  // `count: "exact", head: true` requests carry no response body even on
  // failure, so a missing-column error never reaches error.code the way a
  // normal select does. Check with one cheap real select first instead of
  // relying on parsing a HEAD response's (nonexistent) error body.
  const canary = await supabase.from("reviews").select("is_rejected").limit(1);
  const hasIsRejected = !isMissingColumnError(canary.error);

  if (!hasIsRejected) {
    const [total, pending, approved, ratings] = await Promise.all([
      supabase.from("reviews").select("id", { count: "exact", head: true }),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_pending", true),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_pending", false),
      supabase.from("reviews").select("rating").eq("is_pending", false),
    ]);
    const rows = ratings.data ?? [];
    const averageRating = rows.length
      ? Math.round((rows.reduce((sum, r) => sum + Number(r.rating), 0) / rows.length) * 10) / 10
      : null;
    return {
      total: total.count ?? 0,
      pending: pending.count ?? 0,
      approved: approved.count ?? 0,
      rejected: 0,
      averageRating,
    };
  }

  const [total, pending, approved, rejected, ratings] = await Promise.all([
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_pending", true).eq("is_rejected", false),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_pending", false).eq("is_rejected", false),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("is_rejected", true),
    supabase.from("reviews").select("rating").eq("is_pending", false).eq("is_rejected", false),
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
export async function getBusinessRatingBreakdown(businessId: string) {
  const supabase = await createClient();
  const empty = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, percent: 0 }));
  if (!supabase) return empty;

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("is_pending", false)
    .eq("business_id", businessId);

  if (error || !data?.length) {
    if (error) console.error("getBusinessRatingBreakdown:", error.message);
    return empty;
  }
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

  const { data, error } = await supabase.from("reviews").select("rating").eq("is_pending", false);
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
