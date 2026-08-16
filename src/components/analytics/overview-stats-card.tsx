import { TrendingUp } from "lucide-react";

export interface OverviewStat {
  label: string;
  value: string;
  trend?: string;
}

export function OverviewStatsCard({ stats }: { stats: OverviewStat[] }) {
  return (
    <div className="flex w-full flex-col gap-9 rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-[#939393]">{stat.label}</p>
          <p className="text-[36px] leading-none text-[#060606]">{stat.value}</p>
          {stat.trend && (
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp size={16} className="text-[#34c759]" />
              <span className="font-medium text-[#34c759]">{stat.trend.split(" ")[0]}</span>
              <span className="text-[#646464]">{stat.trend.split(" ").slice(1).join(" ")}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
