"use client";

import { Check } from "lucide-react";

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
      role="checkbox"
      aria-checked={checked}
      className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#060606] outline-none focus-visible:underline"
    >
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-md border transition-colors duration-150 ${
          checked ? "border-brand-red bg-brand-red text-white" : "border-[#d5d5da] bg-white text-transparent"
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </span>
      {label}
    </button>
  );
}
