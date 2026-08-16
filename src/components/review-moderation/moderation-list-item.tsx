import { Sparkles, Smile, CheckCircle2 } from "lucide-react";
import { Avatar } from "../dashboard/avatar";
import { ModerationStatusBadge } from "./status-badge";
import type { ModerationReview } from "./types";

const TAG_ICONS = { sparkles: Sparkles, smile: Smile } as const;

export function ModerationListItem({
  review,
  selected,
  onSelect,
}: {
  review: ModerationReview;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
        selected ? "border-brand-red/40 bg-brand-red/5" : "border-transparent bg-white hover:border-[#ececed]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={review.name} size={40} />
          <div>
            <p className="text-sm font-medium text-[#060606]">{review.name}, {review.location}</p>
            <p className="text-xs text-[#939393]">
              {review.timeAgo} · Reviewed: {review.business}
            </p>
          </div>
        </div>
        <CheckCircle2
          size={20}
          className={review.status === "approved" ? "fill-brand-red text-white" : "text-[#e2e2e4]"}
        />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-[#060606]">{review.text}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#606060]">
          {review.tags.map((tag) => {
            const Icon = TAG_ICONS[tag.icon];
            return (
              <span key={tag.label} className="flex items-center gap-1">
                <Icon size={14} className="text-[#606060]" />
                {tag.label}
              </span>
            );
          })}
        </div>
        <ModerationStatusBadge status={review.status} />
      </div>
    </button>
  );
}
