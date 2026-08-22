export interface VerificationDocument {
  id: string;
  title: string;
  filename: string;
  meta: string;
}

export interface AdditionalPhoto {
  id: string;
  preview: string;
}

export interface OnboardBusinessData {
  // Step 1 — Business Info
  name: string;
  category: string;
  businessType: string;
  description: string;
  coverImagePreview: string | null;
  logoImagePreview: string | null;

  // Step 2 — Details
  phone: string;
  email: string;
  website: string;
  price: string;
  businessAddress: string;
  waitTime: string;
  cityArea: string;
  operatingHours: string;
  amenities: string;

  // Step 3 — Verification
  documents: VerificationDocument[];
  additionalPhotos: AdditionalPhoto[];
}

export const PRICE_OPTIONS = ["Budget", "Moderate", "Premium", "Luxury"];

export const DEFAULT_DOCUMENTS: VerificationDocument[] = [];

export const EMPTY_ONBOARD_DATA: OnboardBusinessData = {
  name: "",
  category: "",
  businessType: "",
  description: "",
  coverImagePreview: null,
  logoImagePreview: null,
  phone: "",
  email: "",
  website: "",
  price: "Premium",
  businessAddress: "",
  waitTime: "",
  cityArea: "",
  operatingHours: "",
  amenities: "",
  documents: DEFAULT_DOCUMENTS,
  additionalPhotos: [],
};
