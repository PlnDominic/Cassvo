"use client";

import { useState } from "react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { SaveChangesButton } from "./save-changes-button";

const NOTIFICATION_SETTINGS = [
  "New Review Submitted",
  "Review Flagged",
  "New Business Registration",
  "User Report Submitted",
  "Security Alert",
  "System Update",
];
const DELIVERY_PREFERENCES = ["Email Notification", "Sms Notification", "Push Notifications"];
const NOTIFICATION_FREQUENCY = ["Real - Time", "Hourly Digest", "Daily Digest"];

function useToggleGroup(labels: string[]) {
  return useState<Record<string, boolean>>(Object.fromEntries(labels.map((l) => [l, true])));
}

export function NotificationsSection() {
  const [settings, setSettings] = useToggleGroup(NOTIFICATION_SETTINGS);
  const [delivery, setDelivery] = useToggleGroup(DELIVERY_PREFERENCES);
  const [frequency, setFrequency] = useToggleGroup(NOTIFICATION_FREQUENCY);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-[#060606]">Notification Settings</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <ToggleCard title="Notification Settings">
          {NOTIFICATION_SETTINGS.map((label) => (
            <ToggleRow
              key={label}
              label={label}
              checked={settings[label]}
              onChange={(checked) => setSettings((prev) => ({ ...prev, [label]: checked }))}
            />
          ))}
        </ToggleCard>

        <div className="flex flex-1 flex-col gap-4">
          <ToggleCard title="Delivery Preferences">
            {DELIVERY_PREFERENCES.map((label) => (
              <ToggleRow
                key={label}
                label={label}
                checked={delivery[label]}
                onChange={(checked) => setDelivery((prev) => ({ ...prev, [label]: checked }))}
              />
            ))}
          </ToggleCard>

          <ToggleCard title="Notification Frequency">
            {NOTIFICATION_FREQUENCY.map((label) => (
              <ToggleRow
                key={label}
                label={label}
                checked={frequency[label]}
                onChange={(checked) => setFrequency((prev) => ({ ...prev, [label]: checked }))}
              />
            ))}
          </ToggleCard>
        </div>
      </div>

      <SaveChangesButton />
    </div>
  );
}
