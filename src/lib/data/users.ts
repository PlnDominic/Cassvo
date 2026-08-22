import { createClient } from "@/lib/supabase/server";
import type { UserRow, UserCategory } from "@/components/users/types";
import { formatShortDate } from "@/lib/format";
import { one } from "./util";

export async function getUsers(): Promise<UserRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, reviews_count, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUsers:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name ?? "Unnamed",
    // Email lives in Supabase Auth, not `profiles`, and isn't reachable
    // with the anon key — only a service-role key can read auth.users.
    email: "—",
    phone: row.phone ?? "—",
    reviewsPosted: row.reviews_count ?? 0,
    // Report counts against a member require the review_reports /
    // problem_reports tables, whose columns aren't reconciled yet.
    reports: null,
    joinedDate: formatShortDate(row.created_at),
    // The real schema has no per-member verification flag — only
    // individual reviews carry `is_verified`.
    verified: false,
    // No suspension/warning state exists on `profiles`, so every member
    // reads as "active" rather than a fabricated status.
    category: "active" as UserCategory,
  }));
}

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  verified: boolean;
  status: UserCategory;
  joinedAt: string | null;
  reviewsWritten: number;
  photosUploaded: number;
  helpfulReviews: number;
  businessesReviewed: number;
}

export async function getMember(id: string): Promise<MemberProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, location, avatar_url, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getMember:", error.message);
    return null;
  }

  const { data: reviewRows } = await supabase
    .from("reviews")
    .select("id, business_id, upvotes_count, images")
    .eq("user_id", id);

  const reviews = reviewRows ?? [];
  const photosUploaded = reviews.reduce((sum, r) => sum + ((r.images ?? []) as unknown[]).length, 0);

  return {
    id: data.id,
    name: data.full_name ?? "Unnamed",
    email: "—",
    phone: data.phone,
    location: data.location,
    avatarUrl: data.avatar_url,
    verified: false,
    status: "active",
    joinedAt: data.created_at,
    reviewsWritten: reviews.length,
    photosUploaded,
    helpfulReviews: reviews.filter((r) => (r.upvotes_count ?? 0) > 0).length,
    businessesReviewed: new Set(reviews.map((r) => r.business_id)).size,
  };
}

export async function getUserCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, active: 0, suspended: 0, newThisMonth: 0 };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [total, recent] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
  ]);

  return {
    total: total.count ?? 0,
    // No suspension state on `profiles` — everyone counts as active.
    active: total.count ?? 0,
    suspended: 0,
    newThisMonth: recent.count ?? 0,
  };
}

export interface MemberReview {
  business: string;
  category: string;
  text: string;
  rating: number;
  reviewCount: number;
  date: string;
  photoUrl: string | null;
  photos: string[];
}

export async function getMemberReviews(memberId: string): Promise<MemberReview[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select(
      `id, rating, content, created_at, images,
       business:businesses!business_id (name, cover_image, reviews_count, category:categories(title))`,
    )
    .eq("user_id", memberId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMemberReviews:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const business = one<{
      name: string;
      cover_image: string | null;
      reviews_count: number;
      category: { title: string } | { title: string }[] | null;
    }>(row.business);
    const category = business ? one<{ title: string }>(business.category) : null;

    return {
      business: business?.name ?? "—",
      category: category?.title ?? "—",
      text: row.content,
      rating: Number(row.rating ?? 0),
      reviewCount: business?.reviews_count ?? 0,
      date: formatShortDate(row.created_at),
      photoUrl: business?.cover_image ?? null,
      photos: row.images ?? [],
    };
  });
}

/**
 * Reports filed against a member require the real `review_reports` /
 * `problem_reports` tables, whose columns aren't reconciled yet (both are
 * currently empty, so their shape can't be inspected without write access).
 */
export async function getMemberReports(_memberId: string) {
  return [];
}
