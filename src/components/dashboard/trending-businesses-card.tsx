import Image from "next/image";
import photo1 from "../../../public/images/dashboard/photo-business-1.png";
import photo2 from "../../../public/images/dashboard/photo-business-2.png";
import { StarRating } from "../ui/star-rating";

const businesses = [
  { name: "Kofi’s Kitchen", category: "Food & Dining", rating: 4.8, count: 128, photo: photo1 },
  { name: "Kofi’s Kitchen", category: "Food & Dining", rating: 4.8, count: 128, photo: photo2 },
  { name: "Kofi’s Kitchen", category: "Food & Dining", rating: 4.8, count: 128, photo: photo1 },
  { name: "Kofi’s Kitchen", category: "Food & Dining", rating: 4.8, count: 128, photo: photo2 },
];

export function TrendingBusinessesCard() {
  return (
    <div className="w-[324px] shrink-0 rounded-[10px] bg-white p-4 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-4 text-xs font-medium tracking-[0.01em] text-[#060606]">Trending Businesses</p>
      <div className="flex flex-col gap-4">
        {businesses.map((b, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative size-[45px] shrink-0 overflow-hidden rounded-lg bg-[#d8d8d8]">
                <Image src={b.photo} alt={b.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm text-[#060606]/90">{b.name}</p>
                <p className="text-xs text-[#939393]/90">{b.category}</p>
              </div>
            </div>
            <StarRating rating={b.rating} count={b.count} size={11} />
          </div>
        ))}
      </div>
    </div>
  );
}
