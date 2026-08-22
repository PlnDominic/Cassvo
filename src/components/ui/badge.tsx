const VARIANTS = {
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-brand-red/10 text-brand-red",
  purple: "bg-indigo-100 text-indigo-700",
  gray: "bg-black/5 text-[#060606]",
};

export function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
