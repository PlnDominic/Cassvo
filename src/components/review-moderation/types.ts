import type { ReviewFlag } from "@/lib/moderation-risk";

export type ModerationStatus = "pending" | "approved" | "rejected";

export interface ModerationReview {
  id: string;
  name: string;
  avatarUrl: string | null;
  location: string | null;
  timeAgo: string;
  business: string;
  businessCategory: string;
  businessLocation: string | null;
  businessPhotoUrl: string | null;
  rating: number;
  reviewCount: number;
  date: string;
  createdAt: string;
  price: number;
  crowdLevel: string;
  text: string;
  photos: string[];
  tags: string[];
  status: ModerationStatus;
  /** Set by Settings -> Moderation's Risk Detection checks; empty when nothing was flagged or the checks are off. */
  flags: ReviewFlag[];
}
