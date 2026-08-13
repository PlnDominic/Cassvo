import { Umbrella, Martini, BedDouble } from "lucide-react";

interface Highlight {
  label: string;
  value: string;
  dotColor: string;
  valueClassName?: string;
}

interface Amenity {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const highlights: Highlight[] = [
  { label: "Review Growth", value: "+18%", dotColor: "#ea0505", valueClassName: "text-emerald-600" },
  { label: "Top rating", value: "5.0", dotColor: "#f59e0b" },
  { label: "Response time", value: "2hrs 15mins", dotColor: "#14b8a6" },
];

const amenities: Amenity[] = [
  { label: "Outdoor Seating", icon: Umbrella },
  { label: "Great Cocktails", icon: Martini },
  { label: "Breakfast In Bed", icon: BedDouble },
];

export function OverviewTab({
  about,
  address,
  mapQuery,
}: {
  about: string;
  address: string;
  mapQuery: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.8fr_1.1fr]">
      <div>
        <h3 className="mb-3 text-lg font-medium text-[#060606]">About</h3>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[#606060]">{about}</p>

        <h3 className="mt-8 mb-4 text-lg font-medium text-[#060606]">Amenities</h3>
        <div className="flex gap-10">
          {amenities.map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2 text-center">
              <a.icon size={28} strokeWidth={1.5} className="text-[#060606]" />
              <span className="text-xs text-[#606060]">{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:border-l lg:border-[#ececed] lg:pl-8">
        <h3 className="mb-4 text-lg font-medium text-[#060606]">Highlights</h3>
        <div className="flex flex-col gap-6">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center justify-between gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 text-[#060606]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: h.dotColor }} />
                <span>{h.label}</span>
              </div>
              <span className={h.valueClassName ?? "text-[#060606]"}>{h.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:border-l lg:border-[#ececed] lg:pl-8">
        <h3 className="mb-4 text-lg font-medium text-[#060606]">Business location</h3>
        <div className="h-[220px] w-full overflow-hidden rounded-2xl border border-[#ececed]">
          <iframe
            title="Business location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
            className="size-full border-0"
            loading="lazy"
          />
        </div>
        <p className="mt-3 text-sm text-[#606060]">{address}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-red hover:underline"
        >
          View on Google Map
        </a>
      </div>
    </div>
  );
}
