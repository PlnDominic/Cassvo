import { BadgeCheck, Star } from "lucide-react";
import { CircularProgress } from "./circular-progress";
import type { TrustScore } from "@/lib/data/dashboard";

function tier(overall: number) {
  if (overall >= 85) return { label: "Excellent", color: "#34c759" };
  if (overall >= 60) return { label: "Good", color: "#f59e0b" };
  return { label: "Needs Attention", color: "#ea0505" };
}

export function TrustScoreCard({ score }: { score: TrustScore }) {
  const { label, color } = tier(score.overall);
  const rows = [
    { label: "Verified Reviews", value: `${score.verifiedReviewsPercent}%` },
    { label: "Businesses Verified", value: `${score.businessesVerifiedPercent}%` },
    { label: "Report Resolution Rate", value: `${score.reportResolutionRate}%` },
    { label: "Fake Reviews removed", value: `${score.fakeReviewsRemovedPercent}%` },
  ];

  return (
    <div className="flex-1 rounded-[11px] bg-white p-5 shadow-[6px_6px_56px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium tracking-[0.01em] text-[#060606]">
          <span>Trust Score</span>
          <BadgeCheck size={16} className="text-[#060606]" />
        </div>
        <span
          className="rounded-[10px] px-3 py-1 text-xs font-medium tracking-[0.01em]"
          style={{ backgroundColor: `${color}4D`, color }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-8">
        <CircularProgress percent={score.overall} label={`${score.overall}%`} sublabel="Overall Trust" color={color} />
        <div className="h-[148px] w-px shrink-0 bg-[#e2e2e4]" />
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center gap-1.5">
                <Star size={12} className="fill-brand-red text-brand-red" />
                <span className="text-xs font-medium tracking-[0.01em] text-[#060606]">{row.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {rows.map((row) => (
              <span key={row.label} className="text-xs font-medium tracking-[0.01em] text-[#060606]">
                {row.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
