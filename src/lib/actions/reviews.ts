"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isMissingColumnError } from "@/lib/data/reviews";
import type { ActionResult } from "./settings";

const NOT_CONFIGURED: ActionResult = {
  ok: false,
  message: "Supabase is not configured yet — changes cannot be saved.",
};

const REJECT_NOT_READY: ActionResult = {
  ok: false,
  message: "Reject isn't set up yet — run supabase/proposed/004_review_moderation.sql first.",
};

function revalidateModeration() {
  revalidatePath("/review-moderation");
  revalidatePath("/dashboard");
  revalidatePath("/businesses/[id]/reviews", "page");
}

/**
 * Approves a review. Sets is_verified=true — confirmed against real data
 * that this, not is_pending, is what the mobile app treats as "this
 * review is approved" (every review that predates this admin feature has
 * is_verified=true alongside is_pending=false; reviews approved through
 * this dashboard before this fix only got is_pending flipped, so
 * is_verified stayed false and the app never actually surfaced them as
 * approved). is_pending/is_rejected are still cleared too, since the
 * moderation dashboard's own status tabs read those.
 */
export async function approveReview(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  let { error, count } = await supabase
    .from("reviews")
    .update({ is_pending: false, is_rejected: false, is_verified: true }, { count: "exact" })
    .eq("id", id);

  if (error && isMissingColumnError(error)) {
    ({ error, count } = await supabase
      .from("reviews")
      .update({ is_pending: false, is_verified: true }, { count: "exact" })
      .eq("id", id));
  }

  if (error) {
    console.error("approveReview:", error.message);
    return { ok: false, message: error.message };
  }
  if (count === 0) {
    return { ok: false, message: "Nothing changed — this review may not exist, or you don't have permission to moderate it." };
  }

  revalidateModeration();
  return { ok: true, message: "Approved" };
}

/**
 * Rejects a review: hidden from the public app (is_pending=true, matching
 * pre-approval visibility), flagged as a moderator decision
 * (is_rejected=true), and explicitly not verified (is_verified=false) so
 * it can never be mistaken for an approved review. Needs reviews.is_rejected.
 */
export async function rejectReview(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error, count } = await supabase
    .from("reviews")
    .update({ is_pending: true, is_rejected: true, is_verified: false }, { count: "exact" })
    .eq("id", id);

  if (error) {
    if (isMissingColumnError(error)) return REJECT_NOT_READY;
    console.error("rejectReview:", error.message);
    return { ok: false, message: error.message };
  }
  if (count === 0) {
    return { ok: false, message: "Nothing changed — this review may not exist, or you don't have permission to moderate it." };
  }

  revalidateModeration();
  return { ok: true, message: "Rejected" };
}

/** Approves every currently-pending, non-rejected review. Same is_verified fix and is_rejected fallback as approveReview. */
export async function approveAllPending(): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  let { error, count } = await supabase
    .from("reviews")
    .update({ is_pending: false, is_rejected: false, is_verified: true }, { count: "exact" })
    .eq("is_pending", true)
    .eq("is_rejected", false);

  if (error && isMissingColumnError(error)) {
    ({ error, count } = await supabase
      .from("reviews")
      .update({ is_pending: false, is_verified: true }, { count: "exact" })
      .eq("is_pending", true));
  }

  if (error) {
    console.error("approveAllPending:", error.message);
    return { ok: false, message: error.message };
  }

  revalidateModeration();
  return { ok: true, message: count ? `Approved ${count} review${count === 1 ? "" : "s"}` : "Nothing to approve" };
}
