export interface OnboardBusinessData {
  name: string;
  category: string;
  businessType: string;
  description: string;
  coverImagePreview: string | null;
  logoImagePreview: string | null;
  verificationDocPreview: string | null;
  address: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  website: string;
  openHours: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  dateRegistered: string;
}

export const EMPTY_ONBOARD_DATA: OnboardBusinessData = {
  name: "",
  category: "",
  businessType: "",
  description: "",
  coverImagePreview: null,
  logoImagePreview: null,
  verificationDocPreview: null,
  address: "",
  city: "",
  region: "",
  phone: "",
  email: "",
  website: "",
  openHours: "",
  legalName: "",
  registrationNumber: "",
  taxId: "",
  dateRegistered: "",
};
