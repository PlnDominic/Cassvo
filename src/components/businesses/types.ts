export type BusinessStatus = "pending" | "confirmed" | "suspended";

export interface Business {
  id: string;
  name: string;
  category: string;
  reviews: number | null;
  status: BusinessStatus;
  /** Cover image URL from Supabase storage; null when none uploaded yet. */
  photoUrl: string | null;
}
