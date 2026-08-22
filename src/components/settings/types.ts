export type SettingsSection = "general" | "moderation" | "notification" | "admin" | "security";

export interface ActiveSession {
  id: string;
  name: string;
  detail: string;
  time: string;
  current: boolean;
}
