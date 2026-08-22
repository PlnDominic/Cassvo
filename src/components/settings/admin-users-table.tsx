import { Trash2 } from "lucide-react";
import { Avatar } from "../dashboard/avatar";
import { Badge } from "../ui/badge";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastActive: string;
}

export function AdminUsersTable({ admins, onRemove }: { admins: AdminUser[]; onRemove: (id: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#ececed]">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-sm text-[#060606]">
            <th className="px-4 py-3 font-medium">Admin</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last Active</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-b border-[#ececed] last:border-b-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar name={admin.name} size={36} />
                  <div>
                    <p className="font-medium text-[#060606]">{admin.name}</p>
                    <p className="text-xs text-[#939393]">{admin.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-[#606060]">{admin.role}</td>
              <td className="px-4 py-3">
                <Badge variant={admin.active ? "green" : "red"}>{admin.active ? "Active" : "Inactive"}</Badge>
              </td>
              <td className="px-4 py-3 text-[#939393]">{admin.lastActive}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onRemove(admin.id)}
                  aria-label={`Remove ${admin.name}`}
                  className="text-brand-red hover:text-brand-red/70"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
