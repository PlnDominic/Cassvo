"use client";

import { useState } from "react";
import { ToggleCard } from "./toggle-card";
import { ToggleRow } from "./toggle-row";
import { SaveChangesButton } from "./save-changes-button";
import { savePlatformSettings } from "@/lib/actions/settings";
import { NOTIFICATION_EVENT_LABELS, type NotificationSettings } from "@/lib/settings-schema";

type EventKey = keyof NotificationSettings["events"];

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
      <div>
        <p className="text-sm font-medium text-[#060606]">Notification Settings</p>
        <p className="text-xs text-[#939393]">Choose which events appear on the Notifications page</p>
      </div>

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

      <SaveChangesButton onSave={handleSave} dirty={dirty} />
    </div>
  );
}
