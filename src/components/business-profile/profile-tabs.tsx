"use client";

import { useState } from "react";

interface Tab {
  key: string;
  label: string;
  count?: number;
  danger?: boolean;
}

const tabs: Tab[] = [
  { key: "overview", label: "Overview" },
  { key: "photos", label: "Photos", count: 14 },
  { key: "business-info", label: "Business Info" },
  { key: "reports", label: "Reports", count: 60, danger: true },
];

export function ProfileTabs({
  overview,
  photos,
  businessInfo,
  reports,
}: {
  overview: React.ReactNode;
  photos: React.ReactNode;
  businessInfo: React.ReactNode;
  reports: React.ReactNode;
}) {
  const [active, setActive] = useState("overview");

  const content: Record<string, React.ReactNode> = {
    overview,
    photos,
    "business-info": businessInfo,
    reports,
  };

  return (
    <div>
      <div className="flex gap-8 border-b border-[#ececed]">
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`relative flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-[#060606]"
                  : tab.danger
                    ? "text-brand-red"
                    : "text-[#606060] hover:text-[#060606]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={tab.danger && !isActive ? "text-brand-red" : "text-[#939393]"}>
                  ({tab.count})
                </span>
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
