"use client";

import { useState } from "react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { SettingsSelect } from "./settings-select";
import { SaveChangesButton } from "./save-changes-button";
import { savePlatformSettings } from "@/lib/actions/settings";
import {
  BUSINESS_VERIFICATION_LABELS,
  ESCALATION_THRESHOLDS,
  RISK_DETECTION_LABELS,
  type ModerationSettings,
} from "@/lib/settings-schema";

type RiskKey = keyof ModerationSettings["riskDetection"];
type VerificationKey = keyof ModerationSettings["businessVerification"];

export function ModerationSection({ initial }: { initial: ModerationSettings }) {
  const [values, setValues] = useState<ModerationSettings>(initial);
  const [saved, setSaved] = useState<ModerationSettings>(initial);

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  async function handleSave() {
    const result = await savePlatformSettings("moderation", values);
    if (result.ok) setSaved(values);
    return result;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-[#060606]">Moderation Settings</p>
        <p className="text-xs text-[#939393]">Configure how reviews, reports and business submissions are handled</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <ToggleCard title="AI Risk Detection">
          {(Object.keys(RISK_DETECTION_LABELS) as RiskKey[]).map((key) => (
            <ToggleRow
              key={key}
              label={RISK_DETECTION_LABELS[key]}
              checked={values.riskDetection[key]}
              onChange={(checked) =>
                setValues((prev) => ({ ...prev, riskDetection: { ...prev.riskDetection, [key]: checked } }))
              }
            />
          ))}
        </ToggleCard>
        <ToggleCard title="Business Verification">
          {(Object.keys(BUSINESS_VERIFICATION_LABELS) as VerificationKey[]).map((key) => (
            <ToggleRow
              key={key}
              label={BUSINESS_VERIFICATION_LABELS[key]}
              checked={values.businessVerification[key]}
              onChange={(checked) =>
                setValues((prev) => ({
                  ...prev,
                  businessVerification: { ...prev.businessVerification, [key]: checked },
                }))
              }
            />
          ))}
        </ToggleCard>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-[#060606]">Escalation</p>
        <SettingsSelect
          id="escalation-threshold"
          label="Report Escalation Threshold"
          className="max-w-xs"
          value={values.escalationThreshold}
          onChange={(value) => setValues((prev) => ({ ...prev, escalationThreshold: Number(value) }))}
          options={ESCALATION_THRESHOLDS.map((t) => ({ value: t, label: `${t} Reports` }))}
        />
      </div>

      <SaveChangesButton onSave={handleSave} dirty={dirty} />
    </div>
  );
}
