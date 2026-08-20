import { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function SettingsField({ label, id, className, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[#060606]">
        {label}
      </label>
      <input
        id={id}
        className={`h-[52px] w-full rounded-xl border border-[#ececed] bg-white px-4 text-sm font-medium text-[#060606] placeholder:text-[#939393] focus:border-brand-red focus:outline-none ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
