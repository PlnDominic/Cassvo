import { ChevronDown } from "lucide-react";

export function SettingsSelect<T extends string | number>({
  id,
  label,
  value,
  onChange,
  options,
  className,
}: {
  id: string;
  label?: string;
  value: T;
  onChange: (value: string) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#060606]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[52px] w-full cursor-pointer appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] transition-colors focus:border-brand-red focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
      </div>
    </div>
  );
}
