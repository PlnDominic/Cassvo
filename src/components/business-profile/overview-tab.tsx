import { MapPin } from "lucide-react";

interface Highlight {
  label: string;
  value: string;
  dotColor: string;
  valueClassName?: string;
}

const highlights: Highlight[] = [
  { label: "Review Growth", value: "+18%", dotColor: "#ea0505", valueClassName: "text-emerald-600" },
  { label: "Top rating", value: "5.0", dotColor: "#f59e0b" },
  { label: "Response Rate", value: "92%", dotColor: "#14b8a6", valueClassName: "text-emerald-600" },
  { label: "Repeat Customers", value: "64%", dotColor: "#6366f1" },
];

export function OverviewTab({ about }: { about: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_1.1fr]">
      <div>
        <h3 className="mb-3 text-lg font-medium text-[#060606]">About</h3>
        <p className="text-sm leading-relaxed text-[#606060]">{about}</p>
        <div className="mt-6 h-1 w-16 rounded-full bg-black/10" />
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium text-[#060606]">Highlights</h3>
        <div className="flex flex-col gap-4">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center gap-2 text-[#060606]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: h.dotColor }} />
                <span>{h.label}</span>
              </div>
              <span className={h.valueClassName ?? "text-[#060606]"}>{h.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-medium text-[#060606]">Business location</h3>
        <div className="flex h-[220px] items-center justify-center rounded-2xl bg-[#f7f7f8]">
          <MapPin size={40} className="text-[#bdbdc2]" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
