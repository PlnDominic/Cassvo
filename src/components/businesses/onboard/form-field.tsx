import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({ label, id, className, ...props }: FieldProps) {
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

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export function SelectField({ label, id, options, className, ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[#060606]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none ${className ?? ""}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
      </div>
    </div>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextareaField({ label, id, className, ...props }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-[#060606]">
        {label}
      </label>
      <textarea
        id={id}
        rows={6}
        className={`w-full resize-none rounded-xl border border-[#ececed] bg-white px-4 py-3 text-sm font-medium text-[#060606] placeholder:text-[#939393] focus:border-brand-red focus:outline-none ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
