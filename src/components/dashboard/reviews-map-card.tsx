import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import { PeriodDropdown } from "./period-dropdown";
import type { CityStat } from "@/lib/data/dashboard";

export function ReviewsMapCard({ cities }: { cities: (CityStat & { color: string })[] }) {
  return (
    <div className="w-full rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium tracking-[0.01em] text-[#060606]">
          <span>Reviews in Ghana</span>
          <ChevronDown size={14} />
        </div>
        <PeriodDropdown />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex h-[180px] flex-1 items-center justify-center rounded-[9px] bg-[#f7f7f8]">
          <MapPin size={40} className="text-[#bdbdc2]" strokeWidth={1.5} />
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          {cities.length === 0 ? (
            <span className="text-xs text-[#939393]">No reviews yet</span>
          ) : (
            cities.map((city) => (
              <div
                key={city.name}
                className="flex items-center justify-between gap-6 text-xs font-medium tracking-[0.01em] text-[#060606]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="size-[11px] shrink-0 rounded-full" style={{ backgroundColor: city.color }} />
                  <span>{city.name}</span>
                </div>
                <span>{city.percent}%</span>
              </div>
            ))
          )}
        </div>
      </div>
      <Link
        href="/analytics/map"
        className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-[5px] border border-[#939393]/30 px-4 py-2 text-xs font-medium tracking-[0.01em] text-[#060606]"
      >
        View Full Analysis
        <ChevronDown size={14} />
      </Link>
    </div>
  );
}
