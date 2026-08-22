import { StarRating } from "../../ui/star-rating";
import type { UserReview } from "./types";

export function UserReviewRow({ review }: { review: UserReview }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
        {review.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
          <img src={review.photoUrl} alt={review.business} className="size-full object-cover" />
        ) : (
          <div className="size-full bg-[#f7f7f8]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#060606]">{review.business}</p>
        <p className="text-xs text-[#939393]">{review.category}</p>
        <p className="mt-1 truncate text-sm text-[#606060]">{review.text}</p>
      </div>
      <div className="hidden shrink-0 sm:block">
        <StarRating rating={review.rating} count={review.reviewCount} size={16} textClassName="text-[#060606]" />
      </div>
      <p className="shrink-0 text-sm text-[#939393]">{review.date}</p>
    </div>
  );
}
