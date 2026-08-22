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
 * Approves a review: publicly visible, no rejection flag. Falls back to
 * only touching is_pending if is_rejected doesn't exist yet
 * (004_review_moderation.sql not applied) — approving doesn't strictly
 * need that column, only Reject does.
 */
export async function approveReview(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  let { error, count } = await supabase
    .from("reviews")
    .update({ is_pending: false, is_rejected: false }, { count: "exact" })
    .eq("id", id);

  if (error && isMissingColumnError(error)) {
    ({ error, count } = await supabase.from("reviews").update({ is_pending: false }, { count: "exact" }).eq("id", id));
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

/** Rejects a review: hidden from the public app, flagged as a moderator decision. Needs reviews.is_rejected. */
export async function rejectReview(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  const { error, count } = await supabase
    .from("reviews")
    .update({ is_pending: true, is_rejected: true }, { count: "exact" })
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

/** Approves every currently-pending, non-rejected review. Same is_rejected fallback as approveReview. */
export async function approveAllPending(): Promise<ActionResult> {
  const supabase = await createClient();
  if (!supabase) return NOT_CONFIGURED;

  let { error, count } = await supabase
    .from("reviews")
    .update({ is_pending: false, is_rejected: false }, { count: "exact" })
    .eq("is_pending", true)
    .eq("is_rejected", false);

  if (error && isMissingColumnError(error)) {
    ({ error, count } = await supabase
      .from("reviews")
      .update({ is_pending: false }, { count: "exact" })
      .eq("is_pending", true));
  }

  if (error) {
    console.error("approveAllPending:", error.message);
    return { ok: false, message: error.message };
  }

  revalidateModeration();
  return { ok: true, message: count ? `Approved ${count} review${count === 1 ? "" : "s"}` : "Nothing to approve" };
}
