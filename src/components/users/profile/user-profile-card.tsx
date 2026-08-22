import { FileText } from "lucide-react";
import { Avatar } from "../../dashboard/avatar";
import type { UserProfileData } from "./types";

export function UserProfileCard({ user }: { user: UserProfileData }) {
  const rows: { label: string; value: string }[] = [
    { label: "Location", value: user.location },
    { label: "Joined", value: user.joinedDate },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4">
        <Avatar name={user.name} size={56} />
        <div>
          <p className="text-base font-medium text-[#060606]">{user.name}</p>
          <p className="text-xs text-[#939393]">{user.memberLabel}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 font-medium text-[#060606]">
              <FileText size={16} className="shrink-0 text-brand-red" />
              {row.label}
            </span>
            <span className="text-[#606060]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
