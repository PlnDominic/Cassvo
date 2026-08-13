"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export function FilterDropdown({
  options,
  defaultValue,
  onChange,
}: {
  options: string[];
  defaultValue: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
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
        className="flex items-center gap-2 rounded-xl border border-[#ececed] bg-white px-4 py-2.5 text-sm font-medium text-[#060606]"
      >
        {selected}
        <ChevronDown size={16} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-[160px] overflow-hidden rounded-[10px] border border-[#ececed] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)]"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === selected}
              onClick={() => {
                setSelected(option);
                setOpen(false);
                onChange?.(option);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-[#f7f7f8] ${
                option === selected ? "text-brand-red" : "text-[#060606]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
