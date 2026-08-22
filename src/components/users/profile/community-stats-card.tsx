import type { CommunityStat } from "./types";

export function CommunityStatsCard({ subtitle, stats }: { subtitle: string; stats: CommunityStat[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="text-base font-medium text-[#060606]">Community Stats</h3>
        <p className="text-xs text-[#939393]">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[#f2f2f3] p-4">
            <p className="text-xl font-medium text-[#060606]">{stat.value}</p>
            <p className="text-xs text-[#939393]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
