export interface Report {
  reporter: string;
  reason: string;
  date: string;
  status: "Pending" | "Resolved" | "Dismissed";
}

const statusStyles: Record<Report["status"], string> = {
  Pending: "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Dismissed: "bg-black/5 text-[#606060]",
};

export function ReportsTab({ reports }: { reports: Report[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-xs text-[#939393]">
            <th className="pb-3 font-medium">Reporter</th>
            <th className="pb-3 font-medium">Reason</th>
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-b border-[#ececed] last:border-b-0">
              <td className="py-3 font-medium text-[#060606]">{r.reporter}</td>
              <td className="py-3 text-[#606060]">{r.reason}</td>
              <td className="py-3 text-[#939393]">{r.date}</td>
              <td className="py-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[r.status]}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
