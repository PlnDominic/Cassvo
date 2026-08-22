"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import type { ActionResult } from "@/lib/actions/settings";

export function SaveChangesButton({
  onSave,
  label = "Save Changes",
  dirty = true,
}: {
  onSave: () => Promise<ActionResult>;
  label?: string;
  /** When false the button is disabled — nothing has changed since the last save. */
  dirty?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function handleClick() {
    setResult(null);
    startTransition(async () => {
      const outcome = await onSave();
      setResult(outcome);
      if (outcome.ok) window.setTimeout(() => setResult(null), 2500);
    });
  }

  return (
    <div className="flex items-center justify-end gap-3">
      {result && (
        <span
          className={`flex items-center gap-1.5 text-sm font-medium ${
            result.ok ? "text-emerald-600" : "text-brand-red"
          }`}
        >
          {result.ok ? <Check size={16} /> : <TriangleAlert size={16} />}
          {result.message}
        </span>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || !dirty}
        className="flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        {pending ? "Saving…" : label}
      </button>
    </div>
  );
}
