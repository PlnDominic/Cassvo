export type SettingsSection = "general" | "moderation" | "notification" | "admin" | "security";

export interface ActiveSession {
  name: string;
  detail: string;
  time: string;
  current: boolean;
}
