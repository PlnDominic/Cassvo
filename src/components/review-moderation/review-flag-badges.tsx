import { TriangleAlert } from "lucide-react";
import { RATING_BURST_MIN_REVIEWS, RATING_BURST_WINDOW_HOURS, type ReviewFlag } from "@/lib/moderation-risk";

export const FLAG_CONFIG: Record<ReviewFlag, { label: string; detail: string }> = {
  duplicate: {
    label: "Possible Duplicate",
    detail: "This reviewer posted the same or near-identical text in another review.",
  },
  "rating-burst": {
    label: "Rating Burst",
    detail: `This business got ${RATING_BURST_MIN_REVIEWS}+ reviews within ${RATING_BURST_WINDOW_HOURS} hours around the time of this review.`,
  },
};

export function ReviewFlagBadges({ flags }: { flags: ReviewFlag[] }) {
  if (flags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {flags.map((flag) => (
        <span
          key={flag}
          title={FLAG_CONFIG[flag].detail}
          className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
        >
          <TriangleAlert size={12} />
          {FLAG_CONFIG[flag].label}
        </span>
      ))}
    </div>
  );
}
