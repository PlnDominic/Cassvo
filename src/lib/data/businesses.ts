import { createClient } from "@/lib/supabase/server";
import type { Business, BusinessStatus } from "@/components/businesses/types";
import type { BusinessDraft } from "@/components/businesses/drafts/types";
import { one } from "./util";

/**
 * The real `businesses` table has no status enum — only `is_verified`. We
 * derive the dashboard's pending/confirmed distinction from that; there is
 * no "suspended" state in the schema, so that bucket is always empty rather
 * than fabricated.
 */
function deriveStatus(isVerified: boolean | null): BusinessStatus {
  return isVerified ? "confirmed" : "pending";
}

export async function getBusinesses(): Promise<Business[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id, name, is_verified, cover_image, reviews_count, category:categories(title)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBusinesses:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    category: one<{ title: string }>(row.category)?.title ?? "Uncategorized",
    status: deriveStatus(row.is_verified),
    reviews: row.reviews_count,
    photoUrl: row.cover_image,
  }));
}

export async function getFeaturedBusinessIds(): Promise<string[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("businesses")
    .select("id")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getFeaturedBusinessIds:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.id);
}

/**
 * The real schema has no onboarding-draft concept (no `is_draft` /
 * `draft_progress` / `draft_state` columns) — every business row is a
 * published business. This intentionally always returns empty rather than
 * querying columns that don't exist.
 */
export async function getBusinessDrafts(): Promise<BusinessDraft[]> {
  return [];
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

export async function getBusiness(id: string): Promise<BusinessDetail | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("businesses")
    .select(
      `id, name, about, is_verified, address, location, phone, website, working_hours,
       amenities, images, cover_image, is_featured, rating, reviews_count,
       category:categories(title)`
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getBusiness:", error.message);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    category: one<{ title: string }>(data.category)?.title ?? "Uncategorized",
    // Not present on the real schema — the app doesn't distinguish a
    // "business type" separate from category.
    businessType: null,
    description: data.about,
    status: deriveStatus(data.is_verified),
    address: data.address,
    // The real schema stores one free-text `location` field rather than a
    // separate city/region pair.
    cityArea: data.location,
    region: null,
    phone: data.phone,
    // Not present on the real schema — businesses have no email column.
    email: null,
    website: data.website,
    operatingHours: data.working_hours,
    // `price_range`'s real shape is unconfirmed and unused by the UI today.
    priceLevel: null,
    amenities: data.amenities ?? [],
    // Legal/registration fields don't exist on the real schema.
    legalName: null,
    registrationNumber: null,
    taxId: null,
    dateRegistered: null,
    coverImageUrl: data.cover_image,
    // No separate logo column — the app only stores a cover image.
    logoUrl: null,
    featured: data.is_featured,
    photos: data.images ?? [],
    rating: data.rating,
    reviewCount: data.reviews_count,
  };
}

export async function getBusinessCounts() {
  const supabase = await createClient();
  if (!supabase) return { onboarded: 0, premium: 0, suspended: 0, underReview: 0 };

  const [total, featured, unverified] = await Promise.all([
    supabase.from("businesses").select("id", { count: "exact", head: true }),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("is_featured", true),
    supabase.from("businesses").select("id", { count: "exact", head: true }).eq("is_verified", false),
  ]);

  return {
    onboarded: total.count ?? 0,
    premium: featured.count ?? 0,
    // The real schema has no suspension state.
    suspended: 0,
    underReview: unverified.count ?? 0,
  };
}
