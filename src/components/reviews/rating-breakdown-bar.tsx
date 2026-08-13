export interface RatingBreakdownItem {
  stars: number;
  count: number;
  percent: number;
}

export function RatingBreakdownBar({ items }: { items: RatingBreakdownItem[] }) {
  return (
    <div className="flex flex-wrap divide-x divide-[#ececed] rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      {items.map((item) => (
        <div key={item.stars} className="min-w-[180px] flex-1 px-6 py-5">
          <p className="text-xs text-[#939393]">
            {item.stars} {item.stars === 1 ? "Star" : "Stars"}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-medium text-[#060606]">{item.count}</span>
            <span className="text-xs text-[#939393]">({item.percent}%)</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#ececed]">
            <div
              className="h-full rounded-full bg-[#34c759]"
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
