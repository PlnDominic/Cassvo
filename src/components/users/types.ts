export type UserCategory = "active" | "warned" | "suspended" | "guest";

export interface UserRow {
  id: string;
  name: string;
  avatarUrl: string | null;
  email: string;
  phone: string;
  reviewsPosted: number | null;
  reports: number | null;
  joinedDate: string;
  verified: boolean;
  category: UserCategory;
}
