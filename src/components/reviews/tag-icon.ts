import { Sparkles, Smile, ThumbsUp, Utensils, Wallet, Clock } from "lucide-react";

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

/**
 * Review tags are free-form strings on the database, so the icon is chosen by
 * keyword rather than stored alongside the tag.
 */
export function tagIcon(label: string): IconComponent {
  const lower = label.toLowerCase();
  if (lower.includes("service") || lower.includes("staff")) return Sparkles;
  if (lower.includes("worth") || lower.includes("value") || lower.includes("price")) return Wallet;
  if (lower.includes("food") || lower.includes("meal") || lower.includes("taste")) return Utensils;
  if (lower.includes("wait") || lower.includes("fast") || lower.includes("quick")) return Clock;
  if (lower.includes("recommend") || lower.includes("great")) return ThumbsUp;
  return Smile;
}
