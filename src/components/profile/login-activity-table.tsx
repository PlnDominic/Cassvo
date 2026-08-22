import { Laptop } from "lucide-react";
import { Badge } from "../ui/badge";
import type { LoginActivityRow } from "./types";

export function LoginActivityTable({ rows }: { rows: LoginActivityRow[] }) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium text-[#060606]">Login Activity</p>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-[#ececed] text-left text-sm text-[#060606]">
              <th className="px-6 py-4 font-medium">Device</th>
              <th className="px-6 py-4 font-medium">Browser</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Time</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-[#ececed] last:border-b-0">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-medium text-[#060606]">
                    <Laptop size={16} className="shrink-0 text-[#939393]" />
                    {row.device}
                  </div>
                </td>
                <td className="px-6 py-4 text-[#606060]">{row.browser}</td>
                <td className="px-6 py-4 text-[#606060]">{row.location}</td>
                <td className="px-6 py-4 text-[#606060]">{row.time}</td>
                <td className="px-6 py-4">
                  <Badge variant="green">{row.status === "active" ? "Active Now" : "Successful"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
