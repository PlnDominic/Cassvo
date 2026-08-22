/**
 * Shape, defaults and display labels for the platform settings stored in the
 * single `platform_settings` row. Keys are stable identifiers rather than
 * display strings, so renaming a label in the UI never orphans saved data.
 */

export interface GeneralSettings {
  platformName: string;
  platformDescription: string;
  supportEmail: string;
  contactNumber: string;
  defaultCountry: string;
  timeZone: string;
}

export interface ModerationSettings {
  riskDetection: {
    aiScreening: boolean;
    duplicateReviews: boolean;
    spamReviews: boolean;
    suspiciousRatingActivity: boolean;
  };
  businessVerification: {
    requireDocuments: boolean;
    requireProofOfAddress: boolean;
    manualReviewNewListings: boolean;
    autoVerifyTrustedCategories: boolean;
  };
  escalationThreshold: number;
}

export interface NotificationSettings {
  events: {
    newReviewSubmitted: boolean;
    reviewFlagged: boolean;
    newBusinessRegistration: boolean;
    userReportSubmitted: boolean;
    securityAlert: boolean;
    systemUpdate: boolean;
  };
  delivery: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  /** Mutually exclusive — one cadence at a time. */
  frequency: "realtime" | "hourly" | "daily";
}

export interface SecuritySettings {
  authentication: {
    twoFactor: boolean;
    loginVerification: boolean;
    sessionMonitoring: boolean;
  };
  passwordPolicy: {
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialCharacters: boolean;
  };
  failedLoginLimit: number;
  lockoutMinutes: number;
}

export interface PlatformSettings {
  general: GeneralSettings;
  moderation: ModerationSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
}

export type SettingsSectionKey = keyof PlatformSettings;

export const DEFAULT_SETTINGS: PlatformSettings = {
  general: {
    platformName: "Cassvo",
    platformDescription: "Discover trusted businesses, real reviews and honest ratings.",
    supportEmail: "support@cassvo.com",
    contactNumber: "",
    defaultCountry: "Ghana",
    timeZone: "Africa/Accra",
  },
  moderation: {
    riskDetection: {
      aiScreening: true,
      duplicateReviews: true,
      spamReviews: true,
      suspiciousRatingActivity: true,
    },
    businessVerification: {
      requireDocuments: true,
      requireProofOfAddress: true,
      manualReviewNewListings: true,
      autoVerifyTrustedCategories: false,
    },
    escalationThreshold: 5,
  },
  notification: {
    events: {
      newReviewSubmitted: true,
      reviewFlagged: true,
      newBusinessRegistration: true,
      userReportSubmitted: true,
      securityAlert: true,
      systemUpdate: true,
    },
    delivery: { email: true, sms: false, push: true },
    frequency: "realtime",
  },
  security: {
    authentication: {
      twoFactor: true,
      loginVerification: true,
      sessionMonitoring: true,
    },
    passwordPolicy: {
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialCharacters: true,
    },
    failedLoginLimit: 5,
    lockoutMinutes: 20,
  },
};

// ---------------------------------------------------------------- labels

export const RISK_DETECTION_LABELS: Record<keyof ModerationSettings["riskDetection"], string> = {
  aiScreening: "Enable AI Review Screening",
  duplicateReviews: "Detect Duplicate Reviews",
  spamReviews: "Detect Spam Reviews",
  suspiciousRatingActivity: "Detect Suspicious Rating Activity",
};

export const BUSINESS_VERIFICATION_LABELS: Record<keyof ModerationSettings["businessVerification"], string> = {
  requireDocuments: "Require Business Documents",
  requireProofOfAddress: "Require Proof of Address",
  manualReviewNewListings: "Manually Review New Listings",
  autoVerifyTrustedCategories: "Auto-verify Trusted Categories",
};

export const NOTIFICATION_EVENT_LABELS: Record<keyof NotificationSettings["events"], string> = {
  newReviewSubmitted: "New Review Submitted",
  reviewFlagged: "Review Flagged",
  newBusinessRegistration: "New Business Registration",
  userReportSubmitted: "User Report Submitted",
  securityAlert: "Security Alert",
  systemUpdate: "System Update",
};

export const DELIVERY_LABELS: Record<keyof NotificationSettings["delivery"], string> = {
  email: "Email Notification",
  sms: "SMS Notification",
  push: "Push Notifications",
};

export const FREQUENCY_LABELS: Record<NotificationSettings["frequency"], string> = {
  realtime: "Real-Time",
  hourly: "Hourly Digest",
  daily: "Daily Digest",
};

export const AUTHENTICATION_LABELS: Record<
  keyof SecuritySettings["authentication"],
  { label: string; subtitle: string }
> = {
  twoFactor: { label: "Two Factor Authentication", subtitle: "Enable 2FA for all admin accounts" },
  loginVerification: { label: "Login Verification", subtitle: "Verify each login via email" },
  sessionMonitoring: { label: "Session Monitoring", subtitle: "Track and monitor active sessions" },
};

export const PASSWORD_POLICY_LABELS: Record<keyof SecuritySettings["passwordPolicy"], string> = {
  requireUppercase: "Require Uppercase Letters (A-Z)",
  requireNumbers: "Require Numbers (0-9)",
  requireSpecialCharacters: "Require Special Characters",
};

// ---------------------------------------------------------------- options

export const COUNTRIES = ["Ghana", "Nigeria", "Kenya", "South Africa"];

export const TIME_ZONES = [
  { value: "Africa/Accra", label: "(GMT +00:00) Accra" },
  { value: "Africa/Lagos", label: "(GMT +01:00) Lagos" },
  { value: "Africa/Nairobi", label: "(GMT +03:00) Nairobi" },
  { value: "Africa/Johannesburg", label: "(GMT +02:00) Johannesburg" },
];

export const ESCALATION_THRESHOLDS = [3, 5, 10];
export const FAILED_LOGIN_LIMITS = [3, 5, 10];
export const LOCKOUT_DURATIONS = [10, 20, 60];

export const ADMIN_ROLES = [
  { value: "super_admin", label: "Super Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "analyst", label: "Analyst" },
];

export const ADMIN_PERMISSIONS = ["Reviews", "Businesses", "Users", "Reports", "Analytics", "Settings"];

// ---------------------------------------------------------------- merging

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep-merges a stored (possibly partial or stale) settings object onto the
 * defaults, so a row written before a new key existed still yields a complete,
 * correctly typed object.
 */
export function mergeSettings<T>(defaults: T, stored: unknown): T {
  if (!isPlainObject(stored)) return defaults;
  if (!isPlainObject(defaults)) return (stored as T) ?? defaults;

  const result: Record<string, unknown> = { ...defaults };
  for (const [key, defaultValue] of Object.entries(defaults)) {
    const storedValue = stored[key];
    if (storedValue === undefined) continue;
    result[key] = isPlainObject(defaultValue) ? mergeSettings(defaultValue, storedValue) : storedValue;
  }
  return result as T;
}
