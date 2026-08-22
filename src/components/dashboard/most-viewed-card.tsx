import Link from "next/link";
import { Trophy } from "lucide-react";
import { StarRating } from "../ui/star-rating";
import type { TrendingBusiness } from "@/lib/data/dashboard";

type MostViewed = TrendingBusiness & { cityArea: string | null; crowdLevel: string | null };

export function MostViewedCard({ business }: { business: MostViewed | null }) {
  return (
    <div className="flex-1 rounded-[11px] bg-white p-4 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-3 text-xs font-medium tracking-[0.01em] text-[#060606]">
        Most Viewed Business This Week
      </p>

      {!business ? (
        <div className="flex h-[187px] items-center justify-center rounded-[9px] bg-[#f7f7f8] text-sm text-[#939393]">
          No businesses yet.
        </div>
      ) : (
        <div className="relative h-[187px] w-full overflow-hidden rounded-[9px] bg-[#1a1a1a]">
          {business.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
            <img src={business.photoUrl} alt={business.name} className="size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />

          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-[20px] border border-white/20 bg-amber-400/10 px-3 py-2 backdrop-blur-sm">
            <Trophy size={20} className="text-amber-400" />
            <div className="text-white">
              <p className="text-sm leading-tight">Most Reviewed</p>
              <p className="text-xs leading-tight">This week</p>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-white">
            <p className="text-xl font-medium tracking-[0.01em]">{business.name}</p>
            <p className="text-xs font-medium tracking-[0.01em]">{business.cityArea ?? business.category}</p>
            <StarRating
              rating={business.rating}
              count={business.reviewCount}
              size={12}
              textClassName="text-white"
              className="mt-1"
            />
          </div>

          <div className="absolute bottom-4 right-4 flex gap-2">
            <Link
              href={`/businesses/${business.id}`}
              className="rounded-xl bg-brand-red px-5 py-3 text-sm font-medium text-white"
            >
              View Profile
            </Link>
            <Link
              href={`/businesses/${business.id}/reviews`}
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-brand-red"
            >
              View Reviews
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
