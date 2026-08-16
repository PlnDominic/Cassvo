import type { StaticImageData } from "next/image";

export type BusinessStatus = "pending" | "confirmed" | "suspended";

export interface Business {
  id: string;
  name: string;
  category: string;
  reviews: number | null;
  status: BusinessStatus;
  photo: StaticImageData;
}
