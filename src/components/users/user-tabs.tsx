export type UserTab = "all" | "active" | "warned" | "suspended" | "guest";

const TABS: { key: UserTab; label: string; countClassName?: string }[] = [
  { key: "all", label: "All Users" },
  { key: "active", label: "Active", countClassName: "text-emerald-600" },
  { key: "warned", label: "Warned", countClassName: "text-amber-500" },
  { key: "suspended", label: "Suspended", countClassName: "text-brand-red" },
  { key: "guest", label: "Guests" },
];

export function UserTabs({
  active,
  onChange,
  counts,
}: {
  active: UserTab;
  onChange: (tab: UserTab) => void;
  counts: Record<UserTab, number>;
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
