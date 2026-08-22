"use client";

import dynamic from "next/dynamic";
import type { BusinessMapMarker } from "@/lib/data/map";

// Leaflet touches `window` at import time, so it can never run during SSR.
const InteractiveGhanaMap = dynamic(
  () => import("./interactive-ghana-map").then((mod) => mod.InteractiveGhanaMap),
  {
    ssr: false,
    loading: () => <div className="w-full animate-pulse rounded-[9px] bg-[#f7f7f8]" style={{ height: "100%" }} />,
  },
);

export function InteractiveGhanaMapLoader({ markers, height }: { markers: BusinessMapMarker[]; height?: number }) {
  return <InteractiveGhanaMap markers={markers} height={height} />;
}
