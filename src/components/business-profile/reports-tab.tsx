export interface Report {
  reporter: string;
  reason: string;
  date: string;
}

export function ReportsTab({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return <p className="py-6 text-center text-sm text-[#939393]">No reports on file.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] text-sm">
        <thead>
          <tr className="border-b border-[#ececed] text-left text-xs text-[#939393]">
            <th className="pb-3 font-medium">Reporter</th>
            <th className="pb-3 font-medium">Reason</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i} className="border-b border-[#ececed] last:border-b-0">
              <td className="py-3 font-medium text-[#060606]">{r.reporter}</td>
              <td className="py-3 text-[#606060]">{r.reason}</td>
              <td className="py-3 text-[#939393]">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
