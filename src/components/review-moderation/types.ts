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
  price: number;
  crowdLevel: string;
  text: string;
  photos: string[];
  tags: string[];
  status: ModerationStatus;
}
