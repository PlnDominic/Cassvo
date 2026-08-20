"use client";

import { useState } from "react";
import { ToggleSwitch } from "../ui/toggle-switch";
import { SettingsField } from "./settings-field";

export function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  function handleUpdatePassword() {
    if (!passwordsMatch) return;
    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-4 text-sm font-medium text-[#060606]">Change Password</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SettingsField
            id="current-password"
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div />
          <SettingsField
            id="new-password"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <SettingsField
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {confirmPassword.length > 0 && !passwordsMatch && (
          <p className="mt-2 text-xs font-medium text-brand-red">Passwords do not match</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={!currentPassword || !passwordsMatch}
            className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            Update Password
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Password updated</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-[#ececed] pt-6">
        <div>
          <p className="text-sm font-medium text-[#060606]">Two-Factor Authentication</p>
          <p className="text-xs text-[#939393]">Add an extra layer of security to your account</p>
        </div>
        <ToggleSwitch checked={twoFactor} onChange={setTwoFactor} label="Two-Factor Authentication" />
      </div>
    </div>
  );
}
