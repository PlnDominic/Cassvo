import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { StarRating } from "../ui/star-rating";
import { Badge } from "../ui/badge";

export interface BusinessHeroData {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  photo: StaticImageData;
  verified: boolean;
  featured: boolean;
  socials: string[];
}

export function BusinessHero({ business, reviewsHref }: { business: BusinessHeroData; reviewsHref: string }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="relative h-[236px] flex-1 overflow-hidden rounded-2xl">
        <Image src={business.photo} alt={business.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <p className="absolute bottom-5 left-5 text-sm font-medium text-white underline underline-offset-2">
          See all Photos
        </p>
        <Link
          href={reviewsHref}
          className="absolute bottom-5 right-5 rounded-xl bg-white px-5 py-3 text-sm font-medium text-brand-red"
        >
          View Reviews
        </Link>
      </div>

      <div className="flex-1 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-medium text-[#060606]">{business.name}</h1>
          {business.verified && <Badge variant="green">Verified Business</Badge>}
          {business.featured && <Badge variant="amber">Featured</Badge>}
        </div>
        <p className="mt-1 text-sm text-[#939393]">
          {business.category} . {business.location}
        </p>
        <StarRating
          rating={business.rating}
          count={business.reviewCount}
          countSuffix=" Reviews"
          size={18}
          className="mt-3"
          textClassName="text-[#060606]"
        />
        <div className="mt-5 flex items-center gap-3">
          {business.socials.map((s) => (
            <div
              key={s}
              className="flex size-11 items-center justify-center rounded-full bg-[#ececed] text-xs font-medium text-[#060606]"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
