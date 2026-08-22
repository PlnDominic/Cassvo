import { UserReviewRow } from "./user-review-row";
import type { UserReview } from "./types";

export function UserReviewsTab({ reviews }: { reviews: UserReview[] }) {
  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review, i) => (
        <UserReviewRow key={i} review={review} />
      ))}
      {reviews.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#939393]">No reviews yet.</p>
      )}
    </div>
  );
}
