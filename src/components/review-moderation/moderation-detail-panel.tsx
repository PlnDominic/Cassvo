import { Check, X } from "lucide-react";
import { Avatar } from "../dashboard/avatar";
import { StarRating } from "../ui/star-rating";
import type { ModerationReview } from "./types";

export function ModerationDetailPanel({
  review,
  onApprove,
  onReject,
}: {
  review: ModerationReview;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={review.name} src={review.avatarUrl} size={52} />
          <div>
            <p className="text-base font-medium text-[#060606]">
              {review.name}, {review.location}
            </p>
            <p className="text-xs text-[#939393]">{review.timeAgo}</p>
            <p className="text-xs text-[#939393]">Reviewed: {review.business}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-[#060606]">{review.business}</p>
            <p className="text-xs text-[#939393]">{review.businessCategory}</p>
            <p className="text-xs text-[#939393]">{review.businessLocation}</p>
          </div>
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
            {review.businessPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
              <img src={review.businessPhotoUrl} alt={review.business} className="size-full object-cover" />
            ) : (
              <div className="size-full bg-[#f7f7f8]" />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
        <div>
          <p className="mb-1 text-xs text-[#939393]">Rating</p>
          <StarRating rating={review.rating} count={review.reviewCount} size={16} textClassName="text-[#060606]" />
        </div>
        <div>
          <p className="mb-1 text-xs text-[#939393]">Date</p>
          <p className="text-sm font-medium text-[#060606]">{review.date}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#939393]">Price</p>
          <p className="text-sm font-medium text-[#060606]">{"¢".repeat(review.price)}</p>
        </div>
        <div>
          <p className="mb-1 text-xs text-[#939393]">Crowd Level</p>
          <span className="inline-flex rounded-full border border-brand-red bg-brand-red/10 px-3 py-1 text-xs font-medium text-brand-red">
            {review.crowdLevel}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-[#939393]">Review</p>
        <p className="text-sm leading-relaxed text-[#060606]">{review.text}</p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {review.photos.slice(0, 3).map((photo, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
            {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
            <img src={photo} alt="" className="size-full object-cover" />
          </div>
        ))}
        {review.photos.length > 3 && (
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f7f8]">
            {/* eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL */}
            <img src={review.photos[3]} alt="" className="size-full object-cover brightness-50" />
            <div className="absolute inset-0 flex items-center justify-center text-lg font-medium text-white">
              {review.photos.length - 3}+
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#606060]">
        {review.tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1.5">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onApprove}
          disabled={review.status === "approved"}
          className="flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          <Check size={16} />
          Approve
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={review.status === "rejected"}
          className="flex items-center gap-2 rounded-xl border border-[#ececed] px-6 py-3 text-sm font-medium text-[#060606] disabled:opacity-50"
        >
          <X size={16} />
          Reject
        </button>
      </div>
    </div>
  );
}
