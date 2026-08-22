import { createClient } from "@/lib/supabase/server";
import type { UserRow, UserCategory } from "@/components/users/types";
import { formatShortDate, formatRelative } from "@/lib/format";
import { one } from "./util";

export async function getUsers(): Promise<UserRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, phone, reviews_count, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getUsers:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name ?? "Unnamed",
    avatarUrl: row.avatar_url,
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
 * The real schema has no way to report a member directly — only a review
 * or a general problem. This shows reports this member has *filed*
 * instead (the one real relationship that exists), with the "reporter"
 * column repurposed to show what was reported, since repeating the
 * member's own name in every row would be redundant here.
 */
export async function getMemberReports(memberId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const [reviewReports, problemReports] = await Promise.all([
    supabase
      .from("review_reports")
      .select("reason, created_at, review:reviews!review_id (business:businesses!business_id (name))")
      .eq("reporter_id", memberId)
      .order("created_at", { ascending: false }),
    supabase
      .from("problem_reports")
      .select("message, created_at")
      .eq("user_id", memberId)
      .order("created_at", { ascending: false }),
  ]);

  if (reviewReports.error) console.error("getMemberReports (review_reports):", reviewReports.error.message);
  if (problemReports.error) console.error("getMemberReports (problem_reports):", problemReports.error.message);

  const rows = [
    ...(reviewReports.data ?? []).map((row) => {
      const review = one<{ business: { name: string } | { name: string }[] | null }>(row.review);
      const business = review ? one<{ name: string }>(review.business) : null;
      return {
        createdAt: row.created_at,
        reporter: business ? `Review for ${business.name}` : "Review",
        reason: row.reason,
        date: formatRelative(row.created_at),
      };
    }),
    ...(problemReports.data ?? []).map((row) => ({
      createdAt: row.created_at,
      reporter: "General Feedback",
      reason: row.message,
      date: formatRelative(row.created_at),
    })),
  ];

  return rows
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(({ reporter, reason, date }) => ({ reporter, reason, date }));
}
