import { TrendingUp } from "lucide-react";

export interface RegionPerformance {
  name: string;
  reviewCount: string;
  rating: string;
  trend: string;
}

export function RegionPerformanceOverview({ regions }: { regions: RegionPerformance[] }) {
  return (
    <div className="w-full rounded-[10px] bg-white p-5 shadow-[6px_6px_27px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-6 text-xs font-medium tracking-[0.01em] text-[#060606]">Region Performance Overview</p>
      <div className="flex flex-wrap gap-x-12 gap-y-6 divide-x divide-[#ececed]">
        {regions.map((region, i) => (
          <div key={region.name} className={`flex flex-col gap-1 ${i > 0 ? "pl-12" : ""}`}>
            <p className="text-xs font-medium text-[#939393]">{region.reviewCount}</p>
            <p className="text-xs font-medium text-[#060606]">{region.name}</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-[32px] leading-none text-[#060606]">{region.rating}</span>
              <span className="mb-0.5 flex items-center gap-1 text-xs">
                <TrendingUp size={16} className="text-[#34c759]" />
                <span className="font-medium text-[#34c759]">{region.trend}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
