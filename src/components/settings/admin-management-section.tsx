"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AdminUsersTable, type AdminUser } from "./admin-users-table";
import { SettingsField } from "./settings-field";
import { PermissionToggle } from "./permission-toggle";

const ROLES = ["Select Role", "Super Admin", "Moderator", "Analyst"];
const PERMISSIONS = ["Reviews", "Businesses", "Users", "Reports", "Analytics", "Settings"];

export function AdminManagementSection({ initialAdmins }: { initialAdmins: AdminUser[] }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    Reviews: true,
    Businesses: true,
    Users: true,
    Reports: true,
    Analytics: false,
    Settings: false,
  });

  const canInvite = Boolean(fullName.trim() && email.trim() && role !== ROLES[0]);

  function removeAdmin(id: string) {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }

  function sendInvite() {
    if (!canInvite) return;
    setAdmins((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: fullName.trim(),
        email: email.trim(),
        role,
        active: false,
        lastActive: "Invite pending",
      },
    ]);
    setFullName("");
    setEmail("");
    setRole(ROLES[0]);
    setInviteMessage(`Invite sent to ${email.trim()}`);
    window.setTimeout(() => setInviteMessage(null), 3000);
  }

  function togglePermission(label: string, checked: boolean) {
    setPermissions((prev) => ({ ...prev, [label]: checked }));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-4 text-sm font-medium text-[#060606]">Admin Users</p>
        <AdminUsersTable admins={admins} onRemove={removeAdmin} />
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-[#060606]">Invite New Admin</p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <SettingsField id="invite-name" label="Full Name" placeholder="Lyna White" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <div>
            <p className="mb-2 text-sm font-medium text-[#060606]">Permissions</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {PERMISSIONS.map((label) => (
                <PermissionToggle
                  key={label}
                  label={label}
                  checked={permissions[label]}
                  onChange={(checked) => togglePermission(label, checked)}
                />
              ))}
            </div>
          </div>

          <SettingsField
            id="invite-email"
            label="Email Address"
            type="email"
            placeholder="@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-6 max-w-xs">
          <label htmlFor="invite-role" className="mb-2 block text-sm font-medium text-[#060606]">
            Role
          </label>
          <div className="relative">
            <select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-[52px] w-full appearance-none rounded-xl border border-[#ececed] bg-white px-4 pr-10 text-sm font-medium text-[#060606] focus:border-brand-red focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#939393]" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {inviteMessage && <span className="mr-auto text-sm font-medium text-emerald-600">{inviteMessage}</span>}
        <button
          type="button"
          onClick={sendInvite}
          disabled={!canInvite}
          className="rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          Send Invite
        </button>
      </div>
    </div>
  );
}
