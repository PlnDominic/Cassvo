"use client";

export function PermissionToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex items-center gap-2 text-sm font-medium text-[#060606]"
    >
      <span className={`size-4 shrink-0 rounded-full ${checked ? "bg-brand-red" : "bg-[#ececed]"}`} />
      {label}
    </button>
  );
}
