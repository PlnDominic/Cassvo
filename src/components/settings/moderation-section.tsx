"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { SaveChangesButton } from "./save-changes-button";

const RISK_DETECTION = ["Enable AI Review Screening", "Detect Duplicate Reviews", "Detect Spam Reviews", "Detect of suspicious rating activity"];
const BUSINESS_VERIFICATION = ["Require Business Documents", "Detect Duplicate Reviews", "Detect Spam Reviews", "Detect of suspicious rating activity"];
const THRESHOLDS = ["3 Reports", "5 Reports", "10 Reports"];

export function ModerationSection() {
  const [risk, setRisk] = useState<Record<string, boolean>>(Object.fromEntries(RISK_DETECTION.map((r) => [r, true])));
  const [verification, setVerification] = useState<Record<string, boolean>>(
    Object.fromEntries(BUSINESS_VERIFICATION.map((r) => [r, true]))
  );
  const [threshold, setThreshold] = useState(THRESHOLDS[1]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-[#060606]">Moderation Settings</p>
        <p className="text-xs text-[#939393]">Configure how reviews, reports and Business submissions are handled</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <ToggleCard title="All Risk Detection">
          {RISK_DETECTION.map((label) => (
            <ToggleRow
              key={label}
              label={label}
              checked={risk[label]}
              onChange={(checked) => setRisk((prev) => ({ ...prev, [label]: checked }))}
            />
          ))}
        </ToggleCard>
        <ToggleCard title="Business Verification">
          {BUSINESS_VERIFICATION.map((label) => (
            <ToggleRow
              key={label}
              label={label}
              checked={verification[label]}
              onChange={(checked) => setVerification((prev) => ({ ...prev, [label]: checked }))}
            />
          ))}
        </ToggleCard>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#060606]">Moderation Settings</p>
        <div className="max-w-xs">
          <label htmlFor="escalation-threshold" className="mb-2 block text-sm font-medium text-[#060606]">
            Report Escalation Threshold
          </label>
          <div className="relative">
            <select
              id="escalation-threshold"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
            >
              {THRESHOLDS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
          </div>
        </div>
      </div>

      <SaveChangesButton />
    </div>
  );
}
