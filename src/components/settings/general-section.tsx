"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SettingsField, TextareaField } from "./settings-field";
import { SaveChangesButton } from "./save-changes-button";

const COUNTRIES = ["Ghana", "Nigeria", "Kenya", "South Africa"];
const TIME_ZONES = ["(GMT . 00:00) Ghana", "(GMT . +01:00) Nigeria", "(GMT . +03:00) Kenya"];

export function GeneralSection() {
  const [name, setName] = useState("Cassvo");
  const [description, setDescription] = useState("Discover trusted businesses, real reviews ...");
  const [email, setEmail] = useState("support@cassvo");
  const [phone, setPhone] = useState("+233 591056230");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [timeZone, setTimeZone] = useState(TIME_ZONES[0]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-[#060606]">General Settings</p>

      <SettingsField id="platform-name" label="Platform Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextareaField
        id="platform-description"
        label="Platform Description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SettingsField
          id="supported-email"
          label="Supported Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SettingsField id="contact-number" label="Contact Number" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <div className="flex flex-col gap-2">
          <label htmlFor="default-country" className="text-sm font-medium text-[#060606]">
            Default Country
          </label>
          <div className="relative">
            <select
              id="default-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="time-zone" className="text-sm font-medium text-[#060606]">
            Time Zone
          </label>
          <div className="relative">
            <select
              id="time-zone"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
            >
              {TIME_ZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
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
