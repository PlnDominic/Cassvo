/**
 * Shape, defaults and display labels for the platform settings stored in the
 * single `platform_settings` row. Keys are stable identifiers rather than
 * display strings, so renaming a label in the UI never orphans saved data.
 */

import { RATING_BURST_MIN_REVIEWS, RATING_BURST_WINDOW_HOURS } from "./moderation-risk";

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
    duplicateReviews: boolean;
    suspiciousRatingActivity: boolean;
  };
  /** Review reports on one review at or above this count are marked Escalated on the Reports page. */
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
}

export interface SecuritySettings {
  authentication: {
    /** Require a code emailed after each password sign-in. Enforced by supabase/proposed/009_login_verification.sql. */
    loginEmailCode: boolean;
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
      duplicateReviews: true,
      suspiciousRatingActivity: true,
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
  },
  security: {
    authentication: {
      loginEmailCode: false,
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

export const RISK_DETECTION_LABELS: Record<
  keyof ModerationSettings["riskDetection"],
  { label: string; subtitle: string }
> = {
  duplicateReviews: {
    label: "Detect Duplicate Reviews",
    subtitle: "Flag reviews where the same person posted near-identical text more than once",
  },
  suspiciousRatingActivity: {
    label: "Detect Suspicious Rating Activity",
    subtitle: `Flag reviews when a business gets ${RATING_BURST_MIN_REVIEWS}+ reviews within ${RATING_BURST_WINDOW_HOURS} hours`,
  },
};

export const NOTIFICATION_EVENT_LABELS: Record<keyof NotificationSettings["events"], string> = {
  newReviewSubmitted: "New Review Submitted",
  reviewFlagged: "Review Flagged",
  newBusinessRegistration: "New Business Registration",
  userReportSubmitted: "User Report Submitted",
  securityAlert: "Security Alert",
  systemUpdate: "System Update",
};

export const AUTHENTICATION_LABELS: Record<
  keyof SecuritySettings["authentication"],
  { label: string; subtitle: string }
> = {
  loginEmailCode: {
    label: "Login Verification",
    subtitle: "After the password, admins enter a code emailed to them",
  },
  sessionMonitoring: { label: "Session Monitoring", subtitle: "Track and monitor active sessions" },
};

export const PASSWORD_POLICY_LABELS: Record<keyof SecuritySettings["passwordPolicy"], string> = {
  requireUppercase: "Require Uppercase Letters (A-Z)",
  requireNumbers: "Require Numbers (0-9)",
  requireSpecialCharacters: "Require Special Characters",
};

/**
 * Checks a candidate password against Settings → Security's saved
 * password policy (platform_settings.security.passwordPolicy) — the
 * only place in this app a password is ever set is
 * set-password-form.tsx (accepting an invite, or resetting a forgotten
 * password), which uses this instead of just a fixed
 * length check. Returns the human-readable list of unmet requirements
 * (empty means the password passes); the 8-character minimum applies
 * regardless of what's toggled on.
 */
export function checkPasswordPolicy(password: string, policy: SecuritySettings["passwordPolicy"]): string[] {
  const problems: string[] = [];
  if (password.length < 8) problems.push("at least 8 characters");
  if (policy.requireUppercase && !/[A-Z]/.test(password)) problems.push("an uppercase letter");
  if (policy.requireNumbers && !/[0-9]/.test(password)) problems.push("a number");
  if (policy.requireSpecialCharacters && !/[^A-Za-z0-9]/.test(password)) problems.push("a special character");
  return problems;
}

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

// admin_users.role has a check constraint of ('admin', 'moderator') — see
// supabase/proposed/001_admin_users.sql. These are the only two real roles.
export const ADMIN_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
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
