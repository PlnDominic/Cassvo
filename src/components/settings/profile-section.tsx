"use client";

import { useId, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Avatar } from "../dashboard/avatar";
import { SettingsField } from "./settings-field";

export function ProfileSection() {
  const [name, setName] = useState("Angela A.");
  const [email, setEmail] = useState("angela.a@cassvo.com");
  const [phone, setPhone] = useState("+233 20 125 4567");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAvatarFile(file: File | undefined) {
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleSave() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="relative">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-uploaded blob preview
            <img src={avatarPreview} alt="" className="size-16 rounded-full object-cover" />
          ) : (
            <Avatar name={name} size={64} />
          )}
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleAvatarFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Change photo"
            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-[#ececed] bg-white text-[#060606]"
          >
            <Camera size={14} />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-[#060606]">Profile Photo</p>
          <p className="text-xs text-[#939393]">JPG or PNG, at least 200×200px</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <SettingsField id="settings-name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <SettingsField
          id="settings-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <SettingsField id="settings-phone" label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <SettingsField id="settings-role" label="Role" value="Admin" disabled className="text-[#939393]" />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white"
        >
          Save Changes
        </button>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
      </div>
    </div>
  );
}
