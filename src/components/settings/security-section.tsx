"use client";

import { useState, useTransition } from "react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { SettingsSelect } from "./settings-select";
import { Avatar } from "../dashboard/avatar";
import { Badge } from "../ui/badge";
import { SaveChangesButton } from "./save-changes-button";
import { revokeSession, savePlatformSettings } from "@/lib/actions/settings";
import {
  AUTHENTICATION_LABELS,
  FAILED_LOGIN_LIMITS,
  LOCKOUT_DURATIONS,
  PASSWORD_POLICY_LABELS,
  type SecuritySettings,
} from "@/lib/settings-schema";
import type { ActiveSession } from "./types";

type AuthKey = keyof SecuritySettings["authentication"];
type PolicyKey = keyof SecuritySettings["passwordPolicy"];

function formatDuration(minutes: number) {
  return minutes >= 60 ? `${minutes / 60} hour${minutes >= 120 ? "s" : ""}` : `${minutes} mins`;
}

export function SecuritySection({
  initial,
  sessions,
}: {
  initial: SecuritySettings;
  sessions: ActiveSession[];
}) {
  const [values, setValues] = useState<SecuritySettings>(initial);
  const [saved, setSaved] = useState<SecuritySettings>(initial);
  const [revoked, setRevoked] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);
  const visibleSessions = sessions.filter((s) => !revoked.includes(s.id));

  async function handleSave() {
    const result = await savePlatformSettings("security", values);
    if (result.ok) setSaved(values);
    return result;
  }

  function handleRevoke(id: string) {
    startTransition(async () => {
      const result = await revokeSession(id);
      if (result.ok) setRevoked((prev) => [...prev, id]);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <ToggleCard title="Authentication">
          {(Object.keys(AUTHENTICATION_LABELS) as AuthKey[]).map((key) => (
            <ToggleRow
              key={key}
              label={AUTHENTICATION_LABELS[key].label}
              subtitle={AUTHENTICATION_LABELS[key].subtitle}
              checked={values.authentication[key]}
              onChange={(checked) =>
                setValues((prev) => ({ ...prev, authentication: { ...prev.authentication, [key]: checked } }))
              }
            />
          ))}
        </ToggleCard>
        <ToggleCard title="Password Policy">
          {(Object.keys(PASSWORD_POLICY_LABELS) as PolicyKey[]).map((key) => (
            <ToggleRow
              key={key}
              label={PASSWORD_POLICY_LABELS[key]}
              checked={values.passwordPolicy[key]}
              onChange={(checked) =>
                setValues((prev) => ({ ...prev, passwordPolicy: { ...prev.passwordPolicy, [key]: checked } }))
              }
            />
          ))}
        </ToggleCard>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 rounded-xl border border-[#ececed] p-5">
          <p className="mb-4 text-sm font-medium text-[#060606]">Login Security</p>
          <div className="flex flex-col gap-4">
            <SettingsSelect
              id="failed-login-limit"
              label="Failed Login Limit"
              value={values.failedLoginLimit}
              onChange={(value) => setValues((prev) => ({ ...prev, failedLoginLimit: Number(value) }))}
              options={FAILED_LOGIN_LIMITS.map((l) => ({ value: l, label: `${l} attempts` }))}
            />
            <SettingsSelect
              id="locked-duration"
              label="Lockout Duration"
              value={values.lockoutMinutes}
              onChange={(value) => setValues((prev) => ({ ...prev, lockoutMinutes: Number(value) }))}
              options={LOCKOUT_DURATIONS.map((d) => ({ value: d, label: formatDuration(d) }))}
            />
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-[#ececed] p-5">
          <p className="mb-4 text-sm font-medium text-[#060606]">Active Sessions</p>
          <div className="flex flex-col gap-3">
            {visibleSessions.length === 0 && <p className="text-sm text-[#939393]">No active sessions recorded.</p>}
            {visibleSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={session.name} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#060606]">{session.name}</p>
                    <p className="truncate text-xs text-[#939393]">{session.detail}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={session.current ? "green" : "gray"}>
                    {session.current ? "Current Session" : session.time}
                  </Badge>
                  {!session.current && (
                    <button
                      type="button"
                      onClick={() => handleRevoke(session.id)}
                      disabled={pending}
                      className="text-xs font-medium text-brand-red hover:underline disabled:opacity-50"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SaveChangesButton onSave={handleSave} dirty={dirty} />
    </div>
  );
}
