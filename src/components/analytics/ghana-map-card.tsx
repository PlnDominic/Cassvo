import { InteractiveGhanaMapLoader } from "./interactive-ghana-map-loader";
import type { BusinessMapMarker } from "@/lib/data/map";

export function GhanaMapCard({ markers }: { markers: BusinessMapMarker[] }) {
  return (
    <div className="h-full w-full rounded-[10px] bg-white p-5 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
      <InteractiveGhanaMapLoader markers={markers} height={340} />
    </div>
  );
}
