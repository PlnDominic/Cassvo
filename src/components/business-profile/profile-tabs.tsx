"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface Tab {
  key: string;
  label: string;
  count?: number;
  countClassName?: string;
  danger?: boolean;
}



export function ProfileTabs({
  overview,
  photos,
  businessInfo,
  reports,
  photoCount,
  reportCount,
}: {
  overview: React.ReactNode;
  photos: React.ReactNode;
  businessInfo: React.ReactNode;
  reports: React.ReactNode;
  photoCount: number;
  reportCount: number;
}) {
  const tabs: Tab[] = [
    { key: "overview", label: "Overview" },
    { key: "photos", label: "Photos", count: photoCount, countClassName: "text-emerald-600" },
    { key: "business-info", label: "Business Info" },
    { key: "reports", label: "Reports", count: reportCount, danger: true },
  ];
  const searchParams = useSearchParams();
  const requested = searchParams.get("tab");
  const initial = tabs.some((t) => t.key === requested) ? (requested as string) : "overview";
  const [active, setActive] = useState(initial);

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
                <span
                  className={
                    tab.danger && !isActive
                      ? "text-brand-red"
                      : (tab.countClassName ?? "text-[#939393]")
                  }
                >
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
