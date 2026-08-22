"use client";

import { useState } from "react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { SaveChangesButton } from "./save-changes-button";
import { savePlatformSettings } from "@/lib/actions/settings";
import {
  DELIVERY_LABELS,
  FREQUENCY_LABELS,
  NOTIFICATION_EVENT_LABELS,
  type NotificationSettings,
} from "@/lib/settings-schema";

type EventKey = keyof NotificationSettings["events"];
type DeliveryKey = keyof NotificationSettings["delivery"];
type FrequencyKey = NotificationSettings["frequency"];

export function NotificationsSection({ initial }: { initial: NotificationSettings }) {
  const [values, setValues] = useState<NotificationSettings>(initial);
  const [saved, setSaved] = useState<NotificationSettings>(initial);

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  async function handleSave() {
    const result = await savePlatformSettings("notification", values);
    if (result.ok) setSaved(values);
    return result;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-[#060606]">Notification Settings</p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <ToggleCard title="Notify Me About">
          {(Object.keys(NOTIFICATION_EVENT_LABELS) as EventKey[]).map((key) => (
            <ToggleRow
              key={key}
              label={NOTIFICATION_EVENT_LABELS[key]}
              checked={values.events[key]}
              onChange={(checked) => setValues((prev) => ({ ...prev, events: { ...prev.events, [key]: checked } }))}
            />
          ))}
        </ToggleCard>

        <div className="flex flex-1 flex-col gap-4">
          <ToggleCard title="Delivery Preferences">
            {(Object.keys(DELIVERY_LABELS) as DeliveryKey[]).map((key) => (
              <ToggleRow
                key={key}
                label={DELIVERY_LABELS[key]}
                checked={values.delivery[key]}
                onChange={(checked) =>
                  setValues((prev) => ({ ...prev, delivery: { ...prev.delivery, [key]: checked } }))
                }
              />
            ))}
          </ToggleCard>

          {/* Cadence is one-of, so toggling a row selects it rather than
              flipping it independently. */}
          <ToggleCard title="Notification Frequency">
            {(Object.keys(FREQUENCY_LABELS) as FrequencyKey[]).map((key) => (
              <ToggleRow
                key={key}
                label={FREQUENCY_LABELS[key]}
                checked={values.frequency === key}
                onChange={() => setValues((prev) => ({ ...prev, frequency: key }))}
              />
            ))}
          </ToggleCard>
        </div>
      </div>

      <SaveChangesButton onSave={handleSave} dirty={dirty} />
    </div>
  );
}
