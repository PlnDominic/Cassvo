export interface ActivityEntry {
  time: string;
  description: string;
}

export function RecentActivityCard({ activity }: { activity: ActivityEntry[] }) {
  return (
    <div className="flex-1 rounded-2xl bg-white p-6 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      <p className="mb-4 text-sm font-medium text-[#060606]">Recent Activity</p>
      {activity.length === 0 && <p className="text-sm text-[#939393]">No recent activity.</p>}
      <div className="flex flex-col gap-4">
        {activity.map((entry, i) => (
          <div key={i}>
            <p className="text-xs text-[#939393]">{entry.time}</p>
            <p className="text-sm font-medium text-[#060606]">{entry.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
