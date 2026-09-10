"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { PERIODS, type Period } from "@/lib/period";

export { PERIODS, type Period };

export function PeriodDropdown({
  value,
  defaultValue = "This Week",
  onChange,
}: {
  /** Controlled selection — pass this + onChange to actually drive real filtering. Omit for a purely decorative dropdown (uncontrolled, local-only). */
  value?: Period;
  defaultValue?: Period;
  onChange?: (period: Period) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<Period>(defaultValue);
  const selected = value ?? internalSelected;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-[5px] border border-[#939393]/30 px-3 py-2 text-xs font-medium tracking-[0.01em] text-[#060606]"
      >
        {selected}
        <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-[140px] overflow-hidden rounded-[10px] border border-[#ececed] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)]"
        >
          {PERIODS.map((period) => (
            <button
              key={period}
              type="button"
              role="option"
              aria-selected={period === selected}
              onClick={() => {
                setInternalSelected(period);
                onChange?.(period);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-xs font-medium tracking-[0.01em] hover:bg-[#f7f7f8] ${
                period === selected ? "text-brand-red" : "text-[#060606]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
