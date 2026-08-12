import { ChevronDown, MapPin } from "lucide-react";

const cities = [
  { name: "Accra", value: "96%", color: "#ea0505" },
  { name: "Kumasi", value: "96%", color: "#f59e0b" },
  { name: "Tema", value: "96%", color: "#14b8a6" },
  { name: "Takoradi", value: "96%", color: "#6366f1" },
  { name: "Cape Coast", value: "96%", color: "#f97316" },
];

export function ReviewsMapCard() {
  return (
    <div className="w-[358px] shrink-0 rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium tracking-[0.01em] text-[#060606]">
          <span>Reviews in Ghana</span>
          <ChevronDown size={14} />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-[5px] border border-[#939393]/30 px-3 py-2 text-xs font-medium tracking-[0.01em] text-[#060606]"
        >
          This Week
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex h-[180px] w-[154px] shrink-0 items-center justify-center rounded-[9px] bg-[#f7f7f8]">
          <MapPin size={40} className="text-[#bdbdc2]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-2">
          {cities.map((city) => (
            <div key={city.name} className="flex items-center justify-between gap-6 text-xs font-medium tracking-[0.01em] text-[#060606]">
              <div className="flex items-center gap-1.5">
                <span className="size-[11px] shrink-0 rounded-full" style={{ backgroundColor: city.color }} />
                <span>{city.name}</span>
              </div>
              <span>{city.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="mx-auto mt-5 flex items-center gap-2 rounded-[5px] border border-[#939393]/30 px-4 py-2 text-xs font-medium tracking-[0.01em] text-[#060606]"
      >
        View Full Analysis
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
