import { ChevronDown } from "lucide-react";

const categories = [
  { name: "Food & Dining", reviews: "2,687", rating: "4.5", change: "+5%" },
  { name: "Beauty & Fashion", reviews: "–", rating: "–", change: "+5%" },
  { name: "Event Vendors", reviews: "800", rating: "4.9", change: "+5%" },
  { name: "Online Shops", reviews: "1,708", rating: "4.2", change: "+5%" },
  { name: "NightLife", reviews: "768", rating: "4.5", change: "+5%" },
  { name: "Others", reviews: "3,097", rating: "4.6", change: "+5%" },
];

export function CategoryPerformanceCard() {
  return (
    <div className="w-[405px] shrink-0 rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium tracking-[0.01em] text-[#060606]">Category Performance</p>
        <button
          type="button"
          className="flex items-center gap-2 rounded-[5px] border border-[#939393]/30 px-3 py-2 text-xs font-medium tracking-[0.01em] text-[#060606]"
        >
          This Week
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex justify-between text-[10px] font-medium tracking-[0.01em] text-[#939393]">
        <span>Category</span>
        <div className="flex gap-9">
          <span>Reviews</span>
          <span>Avg. Rating</span>
          <span>Vs Prior</span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {categories.map((c) => (
          <div key={c.name} className="flex items-center justify-between text-xs font-medium tracking-[0.01em] text-[#060606]">
            <div className="flex items-center gap-1.5">
              <span className="size-[11px] shrink-0 rounded-full bg-brand-red" />
              <span>{c.name}</span>
            </div>
            <div className="flex gap-9">
              <span className="w-[45px]">{c.reviews}</span>
              <span className="w-[60px]">{c.rating}</span>
              <span className="w-[30px] text-[#48bb78]">{c.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
