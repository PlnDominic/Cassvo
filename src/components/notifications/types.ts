export type NotificationBadgeVariant = "red" | "green" | "amber";

export interface NotificationItem {
  id: string;
  avatarName: string;
  title: string;
  description: string;
  badgeLabel: string;
  badgeVariant: NotificationBadgeVariant;
  time: string;
  unread: boolean;
}
