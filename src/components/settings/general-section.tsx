"use client";

import { useState } from "react";
import { SettingsField, TextareaField } from "./settings-field";
import { SettingsSelect } from "./settings-select";
import { SaveChangesButton } from "./save-changes-button";
import { savePlatformSettings } from "@/lib/actions/settings";
import { COUNTRIES, TIME_ZONES, type GeneralSettings } from "@/lib/settings-schema";

export function GeneralSection({ initial }: { initial: GeneralSettings }) {
  const [values, setValues] = useState<GeneralSettings>(initial);
  const [saved, setSaved] = useState<GeneralSettings>(initial);

  function patch(update: Partial<GeneralSettings>) {
    setValues((prev) => ({ ...prev, ...update }));
  }

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  async function handleSave() {
    const result = await savePlatformSettings("general", values);
    if (result.ok) setSaved(values);
    return result;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-[#060606]">General Settings</p>

      <SettingsField
        id="platform-name"
        label="Platform Name"
        value={values.platformName}
        onChange={(e) => patch({ platformName: e.target.value })}
      />
      <TextareaField
        id="platform-description"
        label="Platform Description"
        rows={3}
        value={values.platformDescription}
        onChange={(e) => patch({ platformDescription: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SettingsField
          id="supported-email"
          label="Support Email"
          type="email"
          value={values.supportEmail}
          onChange={(e) => patch({ supportEmail: e.target.value })}
        />
        <SettingsField
          id="contact-number"
          label="Contact Number"
          placeholder="+233 000 000 000"
          value={values.contactNumber}
          onChange={(e) => patch({ contactNumber: e.target.value })}
        />
        <SettingsSelect
          id="default-country"
          label="Default Country"
          value={values.defaultCountry}
          onChange={(value) => patch({ defaultCountry: value })}
          options={COUNTRIES.map((c) => ({ value: c, label: c }))}
        />
        <SettingsSelect
          id="time-zone"
          label="Time Zone"
          value={values.timeZone}
          onChange={(value) => patch({ timeZone: value })}
          options={TIME_ZONES}
        />
      </div>

      <SaveChangesButton onSave={handleSave} dirty={dirty} />
    </div>
  );
}
