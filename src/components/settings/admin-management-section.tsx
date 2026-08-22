"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { AdminUsersTable, type AdminUser } from "./admin-users-table";
import { SettingsField } from "./settings-field";
import { SettingsSelect } from "./settings-select";
import { PermissionToggle } from "./permission-toggle";
import { inviteAdmin, removeAdmin, setAdminActive } from "@/lib/actions/settings";
import { ADMIN_PERMISSIONS, ADMIN_ROLES } from "@/lib/settings-schema";
import type { ActionResult } from "@/lib/actions/settings";

const DEFAULT_PERMISSIONS = ["Reviews", "Businesses", "Users", "Reports"];

export function AdminManagementSection({ initialAdmins }: { initialAdmins: AdminUser[] }) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState<string[]>(DEFAULT_PERMISSIONS);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const canInvite = Boolean(fullName.trim() && email.trim() && role) && !pending;

  function announce(outcome: ActionResult) {
    setResult(outcome);
    if (outcome.ok) window.setTimeout(() => setResult(null), 3000);
  }

  function handleRemove(id: string) {
    const previous = admins;
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    startTransition(async () => {
      const outcome = await removeAdmin(id);
      if (!outcome.ok) setAdmins(previous);
      announce(outcome);
    });
  }

  function handleToggleActive(id: string, active: boolean) {
    const previous = admins;
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, active } : a)));
    startTransition(async () => {
      const outcome = await setAdminActive(id, active);
      if (!outcome.ok) setAdmins(previous);
      announce(outcome);
    });
  }

  function handleInvite() {
    if (!canInvite) return;
    startTransition(async () => {
      const outcome = await inviteAdmin({ fullName, email, role, permissions });
      if (outcome.ok) {
        const roleLabel = ADMIN_ROLES.find((r) => r.value === role)?.label ?? role;
        setAdmins((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            role: roleLabel,
            active: false,
            lastActive: "Invite pending",
          },
        ]);
        setFullName("");
        setEmail("");
        setRole("");
        setPermissions(DEFAULT_PERMISSIONS);
      }
      announce(outcome);
    });
  }

  function togglePermission(label: string, checked: boolean) {
    setPermissions((prev) => (checked ? [...prev, label] : prev.filter((p) => p !== label)));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-4 text-sm font-medium text-[#060606]">Admin Users</p>
        <AdminUsersTable admins={admins} onRemove={handleRemove} onToggleActive={handleToggleActive} />
      </div>

      <div>
        <p className="mb-4 text-sm font-medium text-[#060606]">Invite New Admin</p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <SettingsField
            id="invite-name"
            label="Full Name"
            placeholder="Lyna White"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-[#060606]">Permissions</p>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {ADMIN_PERMISSIONS.map((label) => (
                <PermissionToggle
                  key={label}
                  label={label}
                  checked={permissions.includes(label)}
                  onChange={(checked) => togglePermission(label, checked)}
                />
              ))}
            </div>
          </div>

          <SettingsField
            id="invite-email"
            label="Email Address"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <SettingsSelect
          id="invite-role"
          label="Role"
          className="mt-6 max-w-xs"
          value={role}
          onChange={setRole}
          options={[{ value: "", label: "Select Role" }, ...ADMIN_ROLES]}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        {result && (
          <span
            className={`mr-auto flex items-center gap-1.5 text-sm font-medium ${
              result.ok ? "text-emerald-600" : "text-brand-red"
            }`}
          >
            {result.ok ? <Check size={16} /> : <TriangleAlert size={16} />}
            {result.message}
          </span>
        )}
        <button
          type="button"
          onClick={handleInvite}
          disabled={!canInvite}
          className="flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Loader2 size={16} className="animate-spin" />}
          Send Invite
        </button>
      </div>
    </div>
  );
}
