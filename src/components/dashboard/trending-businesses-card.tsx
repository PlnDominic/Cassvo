import Link from "next/link";
import { StarRating } from "../ui/star-rating";
import type { TrendingBusiness } from "@/lib/data/dashboard";

export function TrendingBusinessesCard({ businesses }: { businesses: TrendingBusiness[] }) {
  return (
    <div className="w-full rounded-[10px] bg-white p-4 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-4 text-xs font-medium tracking-[0.01em] text-[#060606]">Trending Businesses</p>
      {businesses.length === 0 ? (
        <p className="py-6 text-center text-xs text-[#939393]">No businesses yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {businesses.map((b) => (
            <Link key={b.id} href={`/businesses/${b.id}`} className="flex items-center justify-between hover:opacity-80">
              <div className="flex items-center gap-4">
                <div className="relative size-[45px] shrink-0 overflow-hidden rounded-lg bg-[#d8d8d8]">
                  {b.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
                    <img src={b.photoUrl} alt={b.name} className="size-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-[#060606]/90">{b.name}</p>
                  <p className="text-xs text-[#939393]/90">{b.category}</p>
                </div>
              </div>
              <StarRating rating={b.rating} count={b.reviewCount} size={11} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
