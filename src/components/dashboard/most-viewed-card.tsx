import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";
import skyLounge from "../../../public/images/dashboard/photo-sky-lounge.png";
import { StarRating } from "../ui/star-rating";

export function MostViewedCard() {
  return (
    <div className="flex-1 rounded-[11px] bg-white p-4 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-3 text-xs font-medium tracking-[0.01em] text-[#060606]">
        Most Viewed Business This Week
      </p>
      <div className="relative h-[187px] w-full overflow-hidden rounded-[9px]">
        <Image src={skyLounge} alt="Sky Lounge" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />

        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-[20px] border border-white/20 bg-amber-400/10 px-3 py-2 backdrop-blur-sm">
          <Trophy size={20} className="text-amber-400" />
          <div className="text-white">
            <p className="text-sm leading-tight">Most Reviewed</p>
            <p className="text-xs leading-tight">This week</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 flex flex-col gap-1 text-white">
          <p className="text-xl font-medium tracking-[0.01em]">Sky Lounge</p>
          <p className="text-xs font-medium tracking-[0.01em]">East Legon</p>
          <StarRating rating={4.8} count={128} size={12} textClassName="text-white" className="mt-1" />
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-[20px] border border-brand-red bg-brand-red/30 px-3 py-1 text-sm font-medium tracking-[0.01em] text-brand-red">
              E choke
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link
            href="/businesses/sky-lounge"
            className="rounded-xl bg-brand-red px-5 py-3 text-sm font-medium text-white"
          >
            View Profile
          </Link>
          <Link
            href="/businesses/sky-lounge/reviews"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-brand-red"
          >
            View Reviews
          </Link>
        </div>
      </div>
    </div>
  );
}
