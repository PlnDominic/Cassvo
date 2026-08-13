import { ReactNode } from "react";

export interface InfoBarItem {
  label: string;
  value: ReactNode;
}

export function InfoBar({ items }: { items: InfoBarItem[] }) {
  return (
    <div className="flex flex-wrap items-stretch divide-x divide-[#ececed] rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      {items.map((item, i) => (
        <div key={i} className="min-w-0 flex-1 px-6 py-5">
          <p className="mb-1 truncate text-xs text-[#939393]">{item.label}</p>
          <div className="text-sm font-medium text-[#060606]">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
