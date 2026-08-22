import { Star, X, Plus, CheckCircle2 } from "lucide-react";
import type { Business } from "./types";

const HOW_IT_WORKS = [
  "Featured businesses will appear on the discovery page on the mobile app",
  "You can feature up to 2 Businesses each week",
  "Featured Businesses are automatically refreshes every Monday",
];

export function FeaturedBusinessCard({
  featured,
  maxFeatured,
  onRemove,
  onAdd,
}: {
  featured: Business[];
  maxFeatured: number;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-2xl bg-[#fdeeee] p-6">
      <div className="flex items-start gap-3">
        <Star size={20} className="mt-0.5 shrink-0 text-amber-500" />
        <div>
          <h3 className="text-base font-medium text-[#060606]">Featured Business Of the Week</h3>
          <p className="text-sm text-[#606060]">Select 1-2 Businesses to feature on the mobile app this week</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium text-[#060606]">Featured this week</p>
          <p className="mb-3 text-xs text-[#939393]">
            {featured.length}/{maxFeatured} Businesses selected
          </p>
          <div className="flex flex-wrap gap-3">
            {featured.map((business) => (
              <div key={business.id} className="relative h-[100px] w-[180px] shrink-0 overflow-hidden rounded-xl">
                {business.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
                  <img src={business.photoUrl} alt={business.name} className="size-full object-cover" />
                ) : (
                  <div className="size-full bg-[#2a2a2a]" />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <button
                  type="button"
                  onClick={() => onRemove(business.id)}
                  aria-label={`Remove ${business.name} from featured`}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-medium">{business.name}</p>
                  <p className="text-xs text-white/80">{business.category}</p>
                </div>
              </div>
            ))}
            {featured.length < maxFeatured && (
              <button
                type="button"
                onClick={onAdd}
                className="flex h-[100px] w-[180px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#c9c9cb] text-sm font-medium text-[#939393] hover:border-brand-red hover:text-brand-red"
              >
                <Plus size={20} />
                Add Business
              </button>
            )}
          </div>
        </div>

        <div className="lg:border-l lg:border-black/10 lg:pl-8">
          <p className="mb-3 text-sm font-medium text-[#060606]">How it works</p>
          <ul className="flex flex-col gap-2.5">
            {HOW_IT_WORKS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#606060]">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#939393]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
