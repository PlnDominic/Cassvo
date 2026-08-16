import { MapPin, Phone, Globe, Sparkles, Umbrella, Martini, BedDouble } from "lucide-react";
import type { OnboardBusinessData } from "./types";
import { PhotoGallery } from "./photo-gallery";
import coverFallback from "../../../../public/images/dashboard/photo-sky-lounge.png";

const PRICE_LEVEL: Record<string, number> = { Budget: 1, Moderate: 2, Premium: 2, Luxury: 3 };

function amenityIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("seat") || lower.includes("outdoor")) return Umbrella;
  if (lower.includes("cocktail") || lower.includes("bar") || lower.includes("drink")) return Martini;
  if (lower.includes("breakfast") || lower.includes("bed") || lower.includes("sleep")) return BedDouble;
  return Sparkles;
}

export function BusinessPreviewCard({ data }: { data: OnboardBusinessData }) {
  const amenities = data.amenities
    .split(/[,\n]/)
    .map((a) => a.trim())
    .filter(Boolean);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div className="relative h-[190px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- mix of static fallback and user-uploaded blob preview */}
        <img src={data.coverImagePreview ?? coverFallback.src} alt="" className="size-full object-cover" />
      </div>

      <div className="grid grid-cols-1 gap-8 p-6 pt-0 lg:grid-cols-[1fr_220px]">
        <div className="-mt-10 flex items-end gap-4 lg:col-span-2">
          <div className="flex size-[90px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#0b0b0b]">
            {data.logoImagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview
              <img src={data.logoImagePreview} alt="Logo" className="size-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-white/50">Logo</span>
            )}
          </div>
          <div className="pb-1">
            <h2 className="text-lg font-medium text-[#060606]">{data.name || "Business name"}</h2>
            <p className="text-sm text-[#939393]">
              {[data.businessType, data.cityArea].filter(Boolean).join(" · ") || "–"}
              <span className="ml-2 font-medium text-emerald-500">Verified</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-10">
            <div>
              <p className="text-base font-medium text-[#060606]">{"¢".repeat(PRICE_LEVEL[data.price] ?? 1)}</p>
              <p className="text-xs text-[#939393]">Price</p>
            </div>
            <div>
              <p className="text-base font-medium text-[#060606]">{data.waitTime || "–"}</p>
              <p className="text-xs text-[#939393]">wait Time</p>
            </div>
            <div>
              <p className="text-base font-medium text-[#060606]">{data.operatingHours || "–"}</p>
              <p className="text-xs text-[#939393]">Working Hours</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-[#060606]">About</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#606060]">{data.description || "–"}</p>
          </div>

          {amenities.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-[#060606]">Amenities</h3>
              <div className="flex flex-wrap gap-8">
                {amenities.map((amenity) => {
                  const Icon = amenityIcon(amenity);
                  return (
                    <div key={amenity} className="flex flex-col items-center gap-2 text-center">
                      <Icon size={22} strokeWidth={1.5} className="text-[#060606]" />
                      <span className="text-xs text-[#606060]">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-sm font-medium text-[#060606]">Contact Info</h3>
            <div className="flex flex-col gap-2 text-sm text-[#606060]">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-[#939393]" />
                {data.businessAddress || "–"}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-[#939393]" />
                {data.phone || "–"}
              </div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="shrink-0 text-[#939393]" />
                {data.website || "–"}
              </div>
            </div>
          </div>
        </div>

        <div>
          <PhotoGallery photos={data.additionalPhotos} editable={false} columns={2} />
        </div>
      </div>
    </div>
  );
}
