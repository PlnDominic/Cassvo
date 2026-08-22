"use client";

import { ToggleSwitch } from "../ui/toggle-switch";

export function ToggleRow({
  label,
  subtitle,
  checked,
  onChange,
}: {
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-sm text-[#606060]">{label}</p>
        {subtitle && <p className="text-xs text-[#939393]">{subtitle}</p>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
