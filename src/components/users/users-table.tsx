import Link from "next/link";
import { Avatar } from "../dashboard/avatar";
import { UserStatusBadge } from "./user-status-badge";
import { RowActionsMenu } from "../ui/row-actions-menu";
import type { UserRow } from "./types";

export function UsersTable({ users, onSuspend }: { users: UserRow[]; onSuspend: (id: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-sm text-[#060606]">
            <th className="px-6 py-4 font-medium">User</th>
            <th className="px-6 py-4 font-medium">Phone Number</th>
            <th className="px-6 py-4 font-medium">Reviews Posted</th>
            <th className="px-6 py-4 font-medium">Reports</th>
            <th className="px-6 py-4 font-medium">Joined Date</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-[#ececed] last:border-b-0">
              <td className="px-6 py-4">
                <Link href={`/users/${user.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <Avatar name={user.name} size={40} />
                  <div>
                    <p className="font-medium text-[#060606]">{user.name}</p>
                    <p className="text-xs text-[#939393]">{user.email}</p>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 text-[#606060]">{user.phone}</td>
              <td className="px-6 py-4 text-[#606060]">{user.reviewsPosted ?? "–"}</td>
              <td className="px-6 py-4 text-[#606060]">{user.reports ?? "–"}</td>
              <td className="px-6 py-4 text-[#606060]">{user.joinedDate}</td>
              <td className="px-6 py-4">
                <UserStatusBadge verified={user.verified} />
              </td>
              <td className="px-6 py-4">
                <RowActionsMenu
                  label={`Actions for ${user.name}`}
                  actions={[
                    { label: "View profile", href: `/users/${user.id}` },
                    { label: "View reports", href: "/reports" },
                    { label: "Suspend user", danger: true, onSelect: () => onSuspend(user.id) },
                  ]}
                />
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-sm text-[#939393]">
                No users in this queue.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
