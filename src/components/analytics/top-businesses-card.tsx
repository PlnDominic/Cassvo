import Image, { type StaticImageData } from "next/image";
import { StarRating } from "../ui/star-rating";

export interface TopBusiness {
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  change: string;
  photo: StaticImageData;
}

export function TopBusinessesCard({ businesses }: { businesses: TopBusiness[] }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-medium text-[#060606]">Top Businesses</p>
      <div className="flex flex-col gap-4">
        {businesses.map((business) => (
          <div key={business.name} className="flex items-center gap-3">
            <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#f7f7f8]">
              <Image src={business.photo} alt={business.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#060606]">{business.name}</p>
              <p className="text-xs text-[#939393]">{business.category}</p>
            </div>
            <div className="shrink-0 text-right">
              <StarRating rating={business.rating} count={business.reviewCount} size={11} textClassName="text-[#060606]" />
              <p className="mt-0.5 text-xs font-medium text-emerald-500">{business.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
