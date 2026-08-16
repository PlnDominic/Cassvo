export interface TopRegion {
  name: string;
  value: string;
  color: string;
}

export function TopRegionsCard({ regions }: { regions: TopRegion[] }) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <p className="text-xs font-medium tracking-[0.01em] text-[#060606]">Top Regions Reviews</p>
      <div className="flex flex-col gap-6">
        {regions.map((region) => (
          <div key={region.name} className="flex items-center justify-between gap-6 text-xs font-medium tracking-[0.01em] text-[#060606]">
            <div className="flex items-center gap-1.5">
              <span className="size-[11px] shrink-0 rounded-full" style={{ backgroundColor: region.color }} />
              <span>{region.name}</span>
            </div>
            <span>{region.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
