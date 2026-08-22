export interface CategoryPerformanceItem {
  label: string;
  percent: number;
}

export function CategoryPerformanceBars({ items }: { items: CategoryPerformanceItem[] }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-medium text-[#060606]">Category Performance</p>
      {items.length === 0 && <p className="py-6 text-center text-xs text-[#939393]">No category data yet.</p>}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="w-[110px] shrink-0 text-xs font-medium text-[#060606]">{item.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#ececed]">
              <div className="h-full rounded-full bg-brand-red" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
