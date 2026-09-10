export interface VerificationDocument {
  id: string;
  title: string;
  filename: string;
  meta: string;
}

export interface AdditionalPhoto {
  id: string;
  preview: string;
  /** The real file, uploaded to Storage at submit time — see src/lib/upload-image.ts. */
  file: File;
}

export interface OnboardBusinessData {
  // Step 1 — Business Info
  name: string;
  /** categories.id (uuid) — see business-info-step.tsx's real category dropdown. */
  category: string;
  businessType: string;
  description: string;
  coverImagePreview: string | null;
  /** The real cover file, uploaded to the business-covers bucket at submit time. */
  coverImageFile: File | null;
  /**
   * Preview-only — businesses has no logo column at all (only a single
   * cover_image), so this is never uploaded or persisted. Kept purely
   * for the wizard's own live preview card; see business-info-step.tsx.
   */
  logoImagePreview: string | null;

  // Step 2 — Details
  phone: string;
  website: string;
  price: string;
  businessAddress: string;
  waitTime: string;
  cityArea: string;
  operatingHours: string;
  amenities: string;

  // Step 3 — Verification
  /** Preview-only — no business_documents table exists on the real schema. */
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
  coverImageFile: null,
  logoImagePreview: null,
  phone: "",
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
