"use client";

const SIZES = {
  sm: { track: "h-5 w-9", knob: "size-4", on: "translate-x-[18px]", off: "translate-x-0.5" },
  md: { track: "h-6 w-11", knob: "size-5", on: "translate-x-[22px]", off: "translate-x-0.5" },
};

export function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`group relative shrink-0 cursor-pointer rounded-full outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-brand-red/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${s.track} ${
        checked
          ? "bg-brand-red shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]"
          : "bg-[#d5d5da] shadow-[inset_0_1px_2px_rgba(0,0,0,0.10)]"
      }`}
    >
      {/* top-0/bottom-0 + my-auto centres vertically without using transform,
          leaving transform free for the horizontal slide. */}
      <span
        className={`absolute inset-y-0 left-0 my-auto rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.28)] transition-transform duration-200 ease-out group-active:scale-95 ${s.knob} ${
          checked ? s.on : s.off
        }`}
      />
    </button>
  );
}
