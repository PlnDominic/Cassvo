export interface ProfileStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface LoginActivityRow {
  device: string;
  browser: string;
  location: string;
  time: string;
  status: "active" | "successful";
}
