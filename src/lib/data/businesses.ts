import { createClient } from "@/lib/supabase/server";
import type { Business, BusinessStatus } from "@/components/businesses/types";
import type { BusinessDraft } from "@/components/businesses/drafts/types";
import { formatRelative } from "@/lib/format";
import { one } from "./util";

export async function getBusinesses(): Promise<Business[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, slug, name, category, status, cover_image_url, business_stats(review_count)")
    .eq("is_draft", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBusinesses:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.slug ?? row.id,
    name: row.name,
    category: row.category,
    status: row.status as BusinessStatus,
    reviews: one<{ review_count: number }>(row.business_stats)?.review_count ?? null,
    photoUrl: row.cover_image_url,
  }));
}

export async function getFeaturedBusinessIds(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("featured", true)
    .order("featured_at", { ascending: false });

  if (error) {
    console.error("getFeaturedBusinessIds:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug ?? row.id);
}

export async function getBusinessDrafts(): Promise<BusinessDraft[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, slug, name, draft_progress, draft_state, updated_at")
    .eq("is_draft", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getBusinessDrafts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.slug ?? row.id,
    name: row.name,
    progress: row.draft_progress ?? 0,
    lastUpdated: formatRelative(row.updated_at),
    status: (row.draft_state ?? "incomplete") as BusinessDraft["status"],
  }));
}

export interface BusinessDetail {
  id: string;
  name: string;
  category: string;
  businessType: string | null;
  description: string | null;
  status: BusinessStatus;
  address: string | null;
  cityArea: string | null;
  region: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  operatingHours: string | null;
  priceLevel: number | null;
  amenities: string[];
  legalName: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  dateRegistered: string | null;
  coverImageUrl: string | null;
  logoUrl: string | null;
  featured: boolean;
  photos: string[];
  rating: number | null;
  reviewCount: number;
}

export async function getBusiness(slugOrId: string): Promise<BusinessDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select(
      `id, slug, name, category, business_type, description, status, address, city_area, region,
       phone, email, website, operating_hours, price_level, amenities, legal_name,
       registration_number, tax_id, date_registered, cover_image_url, logo_url, featured,
       business_photos(url, position),
       business_stats(review_count, average_rating)`
    )
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getBusiness:", error.message);
    return null;
  }

  const stats = one<{ review_count: number; average_rating: number | null }>(data.business_stats);
  const photos = ((data.business_photos ?? []) as { url: string; position: number }[])
    .sort((a, b) => a.position - b.position)
    .map((p) => p.url);

  return {
    id: data.slug ?? data.id,
    name: data.name,
    category: data.category,
    businessType: data.business_type,
    description: data.description,
    status: data.status as BusinessStatus,
    address: data.address,
    cityArea: data.city_area,
    region: data.region,
    phone: data.phone,
    email: data.email,
    website: data.website,
    operatingHours: data.operating_hours,
    priceLevel: data.price_level,
    amenities: data.amenities ?? [],
    legalName: data.legal_name,
    registrationNumber: data.registration_number,
    taxId: data.tax_id,
    dateRegistered: data.date_registered,
    coverImageUrl: data.cover_image_url,
    logoUrl: data.logo_url,
    featured: data.featured,
    photos,
    rating: stats?.average_rating ?? null,
    reviewCount: stats?.review_count ?? 0,
  };
}

export async function getBusinessCounts() {
  const supabase = await createClient();
  if (!supabase) return { onboarded: 0, premium: 0, suspended: 0, underReview: 0 };

  const [onboarded, featured, suspended, pending] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("is_draft", false),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("status", "suspended"),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return {
    onboarded: onboarded.count ?? 0,
    premium: featured.count ?? 0,
    suspended: suspended.count ?? 0,
    underReview: pending.count ?? 0,
  };
}
