export type BusinessTab = "all" | "pending" | "confirmed" | "suspended";

const TABS: { key: BusinessTab; label: string; countClassName?: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending", countClassName: "text-amber-500" },
  { key: "confirmed", label: "Confirmed", countClassName: "text-emerald-600" },
  { key: "suspended", label: "Suspended", countClassName: "text-brand-red" },
];

export function BusinessTabs({
  active,
  onChange,
  counts,
}: {
  active: BusinessTab;
  onChange: (tab: BusinessTab) => void;
  counts: Record<BusinessTab, number>;
}) {
  return (
    <div className="flex gap-8 border-b border-[#ececed]">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            active === tab.key ? "text-[#060606]" : "text-[#939393]"
          }`}
        >
          {tab.label} <span className={tab.countClassName}>({counts[tab.key].toLocaleString()})</span>
          {active === tab.key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-red" />}
        </button>
      ))}
    </div>
  );
}
