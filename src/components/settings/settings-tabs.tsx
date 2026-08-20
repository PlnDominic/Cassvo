"use client";

import { useState } from "react";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notifications" },
  { key: "security", label: "Security" },
];

export function SettingsTabs({
  profile,
  notifications,
  security,
}: {
  profile: React.ReactNode;
  notifications: React.ReactNode;
  security: React.ReactNode;
}) {
  const [active, setActive] = useState("profile");

  const content: Record<string, React.ReactNode> = { profile, notifications, security };

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
              className={`relative pb-3 text-sm font-medium transition-colors ${
                isActive ? "text-[#060606]" : "text-[#606060] hover:text-[#060606]"
              }`}
            >
              {tab.label}
              {isActive && <span className="absolute -bottom-px left-0 h-[2px] w-full bg-brand-red" />}
            </button>
          );
        })}
      </div>

      <div className="pt-6">{content[active]}</div>
    </div>
  );
}
