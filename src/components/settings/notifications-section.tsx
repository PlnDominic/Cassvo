"use client";

import { useState } from "react";
import { ToggleSwitch } from "../ui/toggle-switch";

interface NotificationRow {
  key: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}

const ROWS: NotificationRow[] = [
  { key: "new-reviews", label: "New Reviews", description: "Get notified when a business receives a new review", defaultChecked: true },
  { key: "pending-reports", label: "Pending Reports", description: "Get notified when a review is reported", defaultChecked: true },
  { key: "business-submissions", label: "Business Submissions", description: "Get notified when a business is submitted for onboarding", defaultChecked: true },
  { key: "weekly-summary", label: "Weekly Summary Email", description: "A weekly digest of activity across Cassvo", defaultChecked: false },
];

export function NotificationsSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(ROWS.map((row) => [row.key, row.defaultChecked]))
  );

  return (
    <div className="flex flex-col divide-y divide-[#ececed]">
      {ROWS.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
          <div>
            <p className="text-sm font-medium text-[#060606]">{row.label}</p>
            <p className="text-xs text-[#939393]">{row.description}</p>
          </div>
          <ToggleSwitch
            checked={checked[row.key]}
            onChange={(value) => setChecked((prev) => ({ ...prev, [row.key]: value }))}
            label={row.label}
          />
        </div>
      ))}
    </div>
  );
}
