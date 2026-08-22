import { createClient } from "@/lib/supabase/server";
import type { UserRow, UserCategory } from "@/components/users/types";
import { formatShortDate, formatRelative } from "@/lib/format";
import { one } from "./util";

export async function getUsers(): Promise<UserRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("members")
    .select("id, full_name, email, phone, verified, status, joined_at, member_stats(reviews_posted, reports_filed)")
    .order("joined_at", { ascending: false });

  if (error) {
    console.error("getUsers:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const stats = one<{ reviews_posted: number; reports_filed: number }>(row.member_stats);
    return {
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone ?? "—",
      reviewsPosted: stats?.reviews_posted ?? 0,
      reports: stats?.reports_filed ?? 0,
      joinedDate: formatShortDate(row.joined_at),
      verified: row.verified,
      category: row.status as UserCategory,
    };
  });
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
    .from("members")
    .select("id, full_name, email, phone, location, avatar_url, verified, status, joined_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getMember:", error.message);
    return null;
  }

  const { data: reviewRows } = await supabase
    .from("reviews")
    .select("id, business_id, helpful_count, review_photos(id)")
    .eq("author_id", id);

  const reviews = reviewRows ?? [];
  const photosUploaded = reviews.reduce(
    (sum, r) => sum + (((r.review_photos ?? []) as unknown[]).length),
    0
  );

  return {
    id: data.id,
    name: data.full_name,
    email: data.email,
    phone: data.phone,
    location: data.location,
    avatarUrl: data.avatar_url,
    verified: data.verified,
    status: data.status as UserCategory,
    joinedAt: data.joined_at,
    reviewsWritten: reviews.length,
    photosUploaded,
    helpfulReviews: reviews.filter((r) => (r.helpful_count ?? 0) > 0).length,
    businessesReviewed: new Set(reviews.map((r) => r.business_id)).size,
  };
}

export async function getUserCounts() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, active: 0, suspended: 0, newThisMonth: 0 };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [total, active, suspended, recent] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("status", "suspended"),
    supabase.from("members").select("id", { count: "exact", head: true }).gte("joined_at", startOfMonth.toISOString()),
  ]);

  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    suspended: suspended.count ?? 0,
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
      `id, rating, body, created_at,
       businesses:business_id (name, category, cover_image_url, business_stats(review_count)),
       review_photos (url, position)`
    )
    .eq("author_id", memberId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMemberReviews:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const business = one<{
      name: string;
      category: string;
      cover_image_url: string | null;
      business_stats: { review_count: number } | { review_count: number }[] | null;
    }>(row.businesses);

    return {
      business: business?.name ?? "—",
      category: business?.category ?? "—",
      text: row.body,
      rating: Number(row.rating ?? 0),
      reviewCount: one<{ review_count: number }>(business?.business_stats)?.review_count ?? 0,
      date: formatShortDate(row.created_at),
      photoUrl: business?.cover_image_url ?? null,
      photos: ((row.review_photos ?? []) as { url: string; position: number }[])
        .sort((a, b) => a.position - b.position)
        .map((p) => p.url),
    };
  });
}

export async function getMemberReports(memberId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reports")
    .select("id, reason, status, created_at, reporter:reported_by (full_name)")
    .eq("target_member", memberId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMemberReports:", error.message);
    return [];
  }

  const STATUS_LABEL = { pending: "Pending", investigating: "Pending", resolved: "Resolved" } as const;

  return (data ?? []).map((row) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reporter: (row.reporter as any)?.full_name ?? "—",
    reason: row.reason,
    date: formatRelative(row.created_at),
    status: STATUS_LABEL[row.status as keyof typeof STATUS_LABEL] as "Pending" | "Resolved" | "Dismissed",
  }));
}
