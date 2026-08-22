import { Settings, Grid2x2, Bell, UserCog, ShieldCheck } from "lucide-react";
import type { SettingsSection } from "./types";

const NAV_ITEMS: { key: SettingsSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "moderation", label: "Moderation", icon: Grid2x2 },
  { key: "notification", label: "Notification", icon: Bell },
  { key: "admin", label: "Admin Management", icon: UserCog },
  { key: "security", label: "Security", icon: ShieldCheck },
];

export function SettingsNav({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
}) {
  return (
    <nav className="flex w-[150px] shrink-0 flex-col gap-1.5 rounded-2xl bg-white p-3 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.04)]">
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
              isActive ? "bg-brand-red text-white" : "text-[#060606] hover:bg-[#f7f7f8]"
            }`}
          >
            <item.icon size={16} className={isActive ? "text-white" : "text-[#939393]"} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
