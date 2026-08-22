"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { Avatar } from "../dashboard/avatar";
import { Badge } from "../ui/badge";
import { SaveChangesButton } from "./save-changes-button";
import type { ActiveSession } from "./types";

const AUTHENTICATION = [
  { label: "Two factor Authentication", subtitle: "Enable 2FA for all admin Account" },
  { label: "Login Verification", subtitle: "Verify login via Email" },
  { label: "Section Monitoring", subtitle: "Track and monitor action sessions" },
];
const PASSWORD_POLICY = ["Require Uppercase Letters( A-Z)", "Require Numbers (0-9)", "Special Characters"];
const FAILED_LOGIN_LIMITS = ["3 attempts", "5 attempts", "10 attempts"];
const LOCKED_DURATIONS = ["10 mins", "20 mins", "1 hour"];

export function SecuritySection({ sessions }: { sessions: ActiveSession[] }) {
  const [auth, setAuth] = useState<Record<string, boolean>>(Object.fromEntries(AUTHENTICATION.map((a) => [a.label, true])));
  const [passwordPolicy, setPasswordPolicy] = useState<Record<string, boolean>>(
    Object.fromEntries(PASSWORD_POLICY.map((p) => [p, true]))
  );
  const [failedLoginLimit, setFailedLoginLimit] = useState(FAILED_LOGIN_LIMITS[0]);
  const [lockedDuration, setLockedDuration] = useState(LOCKED_DURATIONS[1]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <ToggleCard title="Authentication">
          {AUTHENTICATION.map((item) => (
            <ToggleRow
              key={item.label}
              label={item.label}
              subtitle={item.subtitle}
              checked={auth[item.label]}
              onChange={(checked) => setAuth((prev) => ({ ...prev, [item.label]: checked }))}
            />
          ))}
        </ToggleCard>
        <ToggleCard title="Password Policy">
          {PASSWORD_POLICY.map((label) => (
            <ToggleRow
              key={label}
              label={label}
              checked={passwordPolicy[label]}
              onChange={(checked) => setPasswordPolicy((prev) => ({ ...prev, [label]: checked }))}
            />
          ))}
        </ToggleCard>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1 rounded-xl border border-[#ececed] p-5">
          <p className="mb-4 text-sm font-medium text-[#060606]">Login Security</p>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="failed-login-limit" className="mb-2 block text-sm font-medium text-[#060606]">
                Failed login Limit
              </label>
              <div className="relative">
                <select
                  id="failed-login-limit"
                  value={failedLoginLimit}
                  onChange={(e) => setFailedLoginLimit(e.target.value)}
                  className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
                >
                  {FAILED_LOGIN_LIMITS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
              </div>
            </div>

            <div>
              <label htmlFor="locked-duration" className="mb-2 block text-sm font-medium text-[#060606]">
                Locked Duration
              </label>
              <div className="relative">
                <select
                  id="locked-duration"
                  value={lockedDuration}
                  onChange={(e) => setLockedDuration(e.target.value)}
                  className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
                >
                  {LOCKED_DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-[#ececed] p-5">
          <p className="mb-4 text-sm font-medium text-[#060606]">Active Sessions</p>
          <div className="flex flex-col gap-3">
            {sessions.length === 0 && <p className="text-sm text-[#939393]">No active sessions recorded.</p>}
            {sessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={session.name} size={36} />
                  <div>
                    <p className="text-sm font-medium text-[#060606]">{session.name}</p>
                    <p className="text-xs text-[#939393]">{session.detail}</p>
                  </div>
                </div>
                <Badge variant={session.current ? "green" : "gray"}>
                  {session.current ? "Current Session" : session.time}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SaveChangesButton />
    </div>
  );
}
