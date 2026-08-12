import { Avatar } from "./avatar";
import { StarRating } from "../ui/star-rating";

const activity = [
  { name: "Angela A.", time: "2mins ago", text: "Reviewed Kofi’s Kitchen", rating: 5 },
  { name: "Kwame D.", time: "2mins ago", text: "Needs Help", danger: true },
  { name: "Ella M", time: "2mins ago", text: "Reported a suspicious review" },
  { name: "Abena K.", time: "2mins ago", text: "Reviewed Kofi’s Kitchen", rating: 5 },
  { name: "Ella M", time: "2mins ago", text: "Registered a new business" },
];

export function RecentActivity() {
  return (
    <div className="rounded-[14px] bg-white p-6 shadow-[6px_6px_27px_0px_rgba(0,0,0,0.08)]">
      <p className="mb-6 text-xs font-medium tracking-[0.01em] text-[#060606]">Recent Activity</p>
      <div className="flex flex-wrap gap-x-8 gap-y-6">
        {activity.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            {i > 0 && <div className="mr-5 h-13 w-px shrink-0 bg-[#e2e2e4]" />}
            <Avatar name={item.name} />
            <div className="flex flex-col gap-1">
              <p className={`text-xs font-medium tracking-[0.01em] ${item.danger ? "text-brand-red" : "text-[#939393]"}`}>
                {item.text}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium tracking-[0.01em]">
                <span className="text-[#060606]">{item.name}</span>
                <span className="text-[#939393]">{item.time}</span>
              </div>
              {item.rating && <StarRating rating={item.rating} size={10} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
