import { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function TextField({ label, id, className, ...props }: TextFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xl font-medium tracking-[0.01em] text-white sm:text-2xl"
      >
        {label}
      </label>
      <input
        id={id}
        className={`h-[60px] w-full rounded-xl border-[0.5px] border-line bg-transparent px-4 text-base font-medium tracking-[0.01em] text-white placeholder:text-placeholder focus:outline-none focus:ring-1 focus:ring-brand-red ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
