export type DraftFilter = "all" | "in-progress" | "pending-verification";

const FILTERS: { key: DraftFilter; label: string }[] = [
  { key: "all", label: "All Draft" },
  { key: "in-progress", label: "In Progress" },
  { key: "pending-verification", label: "Pending Verification" },
];

export function DraftFilterPills({
  active,
  onChange,
}: {
  active: DraftFilter;
  onChange: (filter: DraftFilter) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onChange(filter.key)}
          className={`rounded-xl px-5 py-2.5 text-sm font-medium ${
            active === filter.key
              ? "bg-brand-red text-white"
              : "border border-[#ececed] bg-white text-[#060606]"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
