"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCallerAdmin, NOT_ADMIN_ROLE_MESSAGE } from "@/lib/auth/require-admin";
import type { ActionResult } from "./settings";

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

const NOT_ADMIN_ROLE: ActionResult = { ok: false, message: NOT_ADMIN_ROLE_MESSAGE };

export interface CreateBusinessInput {
  name: string;
  categoryId: string;
  description: string;
  phone: string;
  website: string;
  priceRange: string;
  waitTime: string;
  /** Required on the real table (businesses.location is NOT NULL) — the wizard's City/Area field. */
  cityArea: string;
  operatingHours: string;
  /** Free text from the wizard; split into businesses.amenities (text[]). */
  amenities: string;
  businessAddress: string;
  /** Already-uploaded public URL, or null if no cover was chosen. */
  coverImageUrl: string | null;
  /** Already-uploaded public URLs for the gallery. */
  imageUrls: string[];
}

export interface CreateBusinessResult extends ActionResult {
  id?: string;
}

/**
 * Creates a real row in `businesses` — this is the fix for the Add
 * Business wizard never having called any backend at all (onboard-
 * business-wizard.tsx previously just flipped local state to show a
 * fake "Business onboarded" screen).
 *
 * "Save as Draft" and "Confirm & Onboard" both call this and produce
 * the exact same row: the real schema has no draft concept whatsoever
 * (no is_draft/draft_progress/draft_state columns — see
 * src/lib/data/businesses.ts's getBusinessDrafts(), which returns []
 * for exactly this reason), so there is no real distinct "draft" state
 * to save into. Both set is_verified = true: an admin manually running
 * this wizard has already reviewed what they're entering, unlike a
 * business self-registering through the mobile app.
 *
 * businesses has no INSERT policy at all (RLS here is read-only —
 * "Businesses are viewable by everyone" / "anyone can read businesses",
 * both SELECT), so this goes through the service-role client, same
 * reasoning as every other table in this app with no write policy for
 * a regular session (notifications, admin_users, login_attempts).
 * Admin-only in application code on top of that, same posture as every
 * other administrative action in this dashboard (security finding #1)
 * — RLS alone can't distinguish a moderator from an admin here either.
 *
 * Two real columns the wizard collects have nowhere to go and are
 * deliberately dropped rather than silently mismapped: `email` (no
 * email column on businesses — same gap src/lib/data/businesses.ts
 * already documents on the read side) and the Business Logo upload (no
 * logo column at all — only a single cover_image). Verification
 * documents are dropped too: there's no business_documents table on
 * the real schema.
 */
export async function createBusiness(input: CreateBusinessInput): Promise<CreateBusinessResult> {
  const name = input.name.trim();
  const cityArea = input.cityArea.trim();
  if (!name) return { ok: false, message: "Business name is required." };
  if (!cityArea) return { ok: false, message: "City/Area is required." };

  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const caller = await getCallerAdmin(supabase);
  if (!caller) return { ok: false, message: "You don't have admin access." };
  if (caller.role !== "admin") return NOT_ADMIN_ROLE;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { ok: false, message: "Business creation isn't configured yet — SUPABASE_SERVICE_ROLE_KEY is missing on the server." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const amenities = input.amenities
    .split(/[,\n]/)
    .map((a) => a.trim())
    .filter(Boolean);

  const { data, error } = await adminClient
    .from("businesses")
    .insert({
      name,
      location: cityArea,
      address: input.businessAddress.trim() || null,
      phone: input.phone.trim() || null,
      website: input.website.trim() || null,
      about: input.description.trim() || null,
      category_id: input.categoryId || null,
      price_range: input.priceRange || null,
      wait_time: input.waitTime.trim() || null,
      working_hours: input.operatingHours.trim() || null,
      amenities,
      cover_image: input.coverImageUrl,
      images: input.imageUrls,
      is_verified: true,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createBusiness:", error.message);
    return { ok: false, message: error.message };
  }

  revalidatePath("/businesses");
  return { ok: true, message: "Business created", id: data.id };
}
