export function ToggleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 rounded-xl border border-[#ececed] p-5">
      <p className="mb-2 text-sm font-medium text-[#060606]">{title}</p>
      <div className="flex flex-col divide-y divide-[#ececed]">{children}</div>
    </div>
  );
}
