export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-[140px] overflow-hidden rounded-full bg-[#ececed]">
        <div className="h-full rounded-full bg-brand-red" style={{ width: `${percent}%` }} />
      </div>
      <span className="text-sm text-[#606060]">{percent}%</span>
    </div>
  );
}
