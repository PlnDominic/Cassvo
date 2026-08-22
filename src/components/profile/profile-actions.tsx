"use client";

export function ProfileActions() {
  return (
    <div className="flex items-center justify-end gap-3">
      <button type="button" className="rounded-xl border border-[#ececed] bg-white px-6 py-3 text-sm font-medium text-[#060606]">
        Sign Out other Devices
      </button>
      <button type="button" className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white">
        Download Login History
      </button>
    </div>
  );
}
