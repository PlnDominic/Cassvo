"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Star } from "lucide-react";
import type { BusinessMapMarker } from "@/lib/data/map";
import { ACCRA_CENTER } from "@/lib/geo/ghana-neighborhoods";

const MARKER_COLOR = "#ea0505";

function radiusFor(businessCount: number, max: number) {
  const min = 8;
  const cap = 28;
  if (max <= 1) return min;
  return Math.round(min + (cap - min) * Math.sqrt(businessCount / max));
}

/** Re-centers the map when the marker set changes (e.g. a fresh data load). */
function FitToMarkers({ markers }: { markers: BusinessMapMarker[] }) {
  const map = useMap();
  useMemo(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 13);
      return;
    }
    const bounds = markers.map((m) => [m.lat, m.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);
  return null;
}

export function InteractiveGhanaMap({
  markers,
  height = 260,
}: {
  markers: BusinessMapMarker[];
  height?: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const max = Math.max(1, ...markers.map((m) => m.businessCount));

  if (markers.length === 0) {
    return (
      <div
        className="flex w-full items-center justify-center rounded-[9px] bg-[#f7f7f8] text-sm text-[#939393]"
        style={{ height }}
      >
        No business locations yet.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-[9px]" style={{ height }}>
      <MapContainer
        center={[ACCRA_CENTER.lat, ACCRA_CENTER.lng]}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToMarkers markers={markers} />
        {markers.map((marker) => (
          <CircleMarker
            key={marker.name}
            center={[marker.lat, marker.lng]}
            radius={radiusFor(marker.businessCount, max)}
            pathOptions={{
              color: MARKER_COLOR,
              fillColor: MARKER_COLOR,
              fillOpacity: selected === marker.name ? 0.75 : 0.5,
              weight: 2,
            }}
            eventHandlers={{
              click: () => setSelected(marker.name),
              popupclose: () => setSelected((s) => (s === marker.name ? null : s)),
            }}
          >
            <Popup>
              <div className="flex min-w-[180px] flex-col gap-2 text-sm">
                <div>
                  <p className="font-medium text-[#060606]">{marker.name}</p>
                  <p className="text-xs text-[#606060]">
                    {marker.businessCount} business{marker.businessCount === 1 ? "" : "es"} ·{" "}
                    {marker.reviewCount} review{marker.reviewCount === 1 ? "" : "s"}
                    {marker.averageRating !== null && (
                      <span className="ml-1 inline-flex items-center gap-0.5">
                        <Star size={11} className="fill-brand-red text-brand-red" />
                        {marker.averageRating}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-1 border-t border-[#ececed] pt-2">
                  {marker.businesses.slice(0, 5).map((b) => (
                    <Link
                      key={b.id}
                      href={`/businesses/${b.id}`}
                      className="truncate text-xs font-medium text-[#060606] hover:text-brand-red"
                    >
                      {b.name} <span className="text-[#939393]">· {b.category}</span>
                    </Link>
                  ))}
                  {marker.businessCount > marker.businesses.length && (
                    <span className="text-xs text-[#939393]">
                      +{marker.businessCount - marker.businesses.length} more
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
