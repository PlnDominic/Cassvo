"use client";

import { useState } from "react";

export function SaveChangesButton({ label = "Save Changes" }: { label?: string }) {
  const [saved, setSaved] = useState(false);

  function handleClick() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
      <button type="button" onClick={handleClick} className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white">
        {label}
      </button>
    </div>
  );
}
