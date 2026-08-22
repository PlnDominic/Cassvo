"use client";

import { FileText } from "lucide-react";

interface AdminAction {
  label: string;
  colorClassName: string;
}

const ACTIONS: AdminAction[] = [
  { label: "Suspend User", colorClassName: "text-brand-red" },
  { label: "Verify User", colorClassName: "text-emerald-600" },
  { label: "Send Warning", colorClassName: "text-amber-500" },
  { label: "View Reports", colorClassName: "text-[#060606]" },
];

export function AdminActionsCard({ onAction }: { onAction?: (label: string) => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <h3 className="text-base font-medium text-[#060606]">Admin Actions</h3>
      <div className="flex flex-col gap-4">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => onAction?.(action.label)}
            className={`flex items-center gap-2 text-sm font-medium ${action.colorClassName}`}
          >
            <FileText size={16} className="shrink-0 text-brand-red" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
