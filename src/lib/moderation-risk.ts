/**
 * Risk checks behind Settings -> Moderation's Risk Detection toggles.
 * Pure functions over already-loaded rows (no DB access), so the Review
 * Moderation page can run them on the list it fetches anyway.
 */

export type ReviewFlag = "duplicate" | "rating-burst";

/** A business getting this many reviews inside RATING_BURST_WINDOW_HOURS is flagged. */
export const RATING_BURST_MIN_REVIEWS = 5;
export const RATING_BURST_WINDOW_HOURS = 24;

/** Word-set overlap at or above this counts as near-identical, for reviews of at least DUPLICATE_MIN_WORDS words. */
const DUPLICATE_SIMILARITY = 0.85;
const DUPLICATE_MIN_WORDS = 5;

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  for (const word of a) if (b.has(word)) shared++;
  const union = a.size + b.size - shared;
  return union === 0 ? 0 : shared / union;
}

/**
 * Ids of reviews where the same author posted another review with the
 * same or near-identical text (e.g. one copy-pasted review spread across
 * several businesses). Exact matches count at any length; fuzzy matches
 * only for longer reviews, where a high overlap can't be coincidence.
 */
export function findDuplicateReviewIds(reviews: { id: string; authorId: string | null; text: string }[]): Set<string> {
  const byAuthor = new Map<string, { id: string; normalized: string; words: Set<string> }[]>();
  for (const review of reviews) {
    if (!review.authorId) continue;
    const normalized = normalizeText(review.text ?? "");
    if (!normalized) continue;
    const list = byAuthor.get(review.authorId) ?? [];
    list.push({ id: review.id, normalized, words: new Set(normalized.split(" ")) });
    byAuthor.set(review.authorId, list);
  }

  const flagged = new Set<string>();
  for (const list of byAuthor.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const similar =
          a.normalized === b.normalized ||
          (a.words.size >= DUPLICATE_MIN_WORDS &&
            b.words.size >= DUPLICATE_MIN_WORDS &&
            jaccard(a.words, b.words) >= DUPLICATE_SIMILARITY);
        if (similar) {
          flagged.add(a.id);
          flagged.add(b.id);
        }
      }
    }
  }
  return flagged;
}

/**
 * Ids of reviews that fall inside a burst: RATING_BURST_MIN_REVIEWS or
 * more reviews of the same business within RATING_BURST_WINDOW_HOURS.
 * Every review inside such a window is flagged, not just the last one.
 */
export function findRatingBurstReviewIds(
  reviews: { id: string; businessId: string | null; createdAt: string }[],
): Set<string> {
  const windowMs = RATING_BURST_WINDOW_HOURS * 60 * 60 * 1000;
  const byBusiness = new Map<string, { id: string; time: number }[]>();
  for (const review of reviews) {
    if (!review.businessId) continue;
    const time = new Date(review.createdAt).getTime();
    if (Number.isNaN(time)) continue;
    const list = byBusiness.get(review.businessId) ?? [];
    list.push({ id: review.id, time });
    byBusiness.set(review.businessId, list);
  }

  const flagged = new Set<string>();
  for (const list of byBusiness.values()) {
    if (list.length < RATING_BURST_MIN_REVIEWS) continue;
    list.sort((a, b) => a.time - b.time);
    let start = 0;
    for (let end = 0; end < list.length; end++) {
      while (list[end].time - list[start].time > windowMs) start++;
      if (end - start + 1 >= RATING_BURST_MIN_REVIEWS) {
        for (let k = start; k <= end; k++) flagged.add(list[k].id);
      }
    }
  }
  return flagged;
}
