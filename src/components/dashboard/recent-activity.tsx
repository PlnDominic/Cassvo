import { Avatar } from "./avatar";
import type { ActivityEntry } from "@/lib/data/dashboard";

export function RecentActivity({ activity }: { activity: ActivityEntry[] }) {
  return (
    <div className="rounded-[14px] bg-white p-6 shadow-[6px_6px_27px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-6 text-xs font-medium tracking-[0.01em] text-[#060606]">Recent Activity</p>
      {activity.length === 0 ? (
        <p className="py-4 text-center text-xs text-[#939393]">No activity yet.</p>
      ) : (
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          {activity.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {i > 0 && <div className="mr-5 h-13 w-px shrink-0 bg-[#e2e2e4]" />}
              <Avatar name={item.actor} />
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium tracking-[0.01em] text-[#939393]">{item.action}</p>
                <div className="flex items-center gap-4 text-xs font-medium tracking-[0.01em]">
                  <span className="text-[#060606]">{item.actor}</span>
                  <span className="text-[#939393]">{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
