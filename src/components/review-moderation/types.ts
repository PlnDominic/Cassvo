import type { StaticImageData } from "next/image";
import type { ReviewTag } from "../reviews/review-card";

export type ModerationStatus = "pending" | "approved" | "rejected";

export interface ModerationReview {
  id: string;
  name: string;
  location: string;
  timeAgo: string;
  business: string;
  businessCategory: string;
  businessLocation: string;
  businessPhoto: StaticImageData;
  rating: number;
  reviewCount: number;
  date: string;
  price: number;
  crowdLevel: string;
  text: string;
  photos: StaticImageData[];
  tags: ReviewTag[];
  status: ModerationStatus;
}
