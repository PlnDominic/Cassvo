"use client";

import { useState } from "react";

const TABS = [
  { key: "reviews", label: "Reviews" },
  { key: "photos", label: "Photos", count: 1920 },
  { key: "reports", label: "Reports", count: 14, danger: true },
  { key: "collections", label: "Collections", count: 2547 },
];

export function UserProfileTabs({
  reviews,
  photos,
  reports,
  collections,
}: {
  reviews: React.ReactNode;
  photos: React.ReactNode;
  reports: React.ReactNode;
  collections: React.ReactNode;
}) {
  const [active, setActive] = useState("reviews");

  const content: Record<string, React.ReactNode> = { reviews, photos, reports, collections };

  return (
    <div>
      <div className="flex gap-8 border-b border-[#ececed]">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`relative flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors ${
                isActive ? "text-[#060606]" : "text-[#606060] hover:text-[#060606]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={tab.danger ? "text-brand-red" : "text-[#939393]"}>({tab.count.toLocaleString()})</span>
              )}
              {isActive && <span className="absolute -bottom-px left-0 h-[2px] w-full bg-brand-red" />}
            </button>
          );
        })}
      </div>

      <div className="pt-6">{content[active]}</div>
    </div>
  );
}
