export type ModerationTab = "all" | "pending" | "approved" | "rejected" | "flagged";

const TABS: { key: ModerationTab; label: string; countClassName?: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending", countClassName: "text-amber-500" },
  { key: "approved", label: "Approved", countClassName: "text-emerald-600" },
  { key: "rejected", label: "Rejected", countClassName: "text-brand-red" },
  { key: "flagged", label: "Flagged", countClassName: "text-amber-500" },
];

export function ModerationTabs({
  active,
  onChange,
  counts,
}: {
  active: ModerationTab;
  onChange: (tab: ModerationTab) => void;
  counts: Record<ModerationTab, number>;
}) {
  return (
    <div className="flex gap-8 overflow-x-auto border-b border-[#ececed]">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative shrink-0 whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
            active === tab.key ? "text-[#060606]" : "text-[#939393]"
          }`}
        >
          {tab.label} <span className={tab.countClassName}>({counts[tab.key].toLocaleString()})</span>
          {active === tab.key && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-brand-red" />}
        </button>
      ))}
    </div>
  );
}
