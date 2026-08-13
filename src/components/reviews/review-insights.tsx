import { Avatar } from "../dashboard/avatar";

export interface InsightItem {
  avatarName: string;
  label: string;
  sublabel: string;
}

export function ReviewInsights({ items }: { items: InsightItem[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <p className="mb-5 text-xs font-medium tracking-[0.01em] text-[#060606]">Review Insights</p>
      <div className="flex flex-col gap-5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar name={item.avatarName} size={40} />
            <div>
              <p className="text-sm font-medium text-[#060606]">{item.label}</p>
              <p className="text-xs text-[#939393]">{item.sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
