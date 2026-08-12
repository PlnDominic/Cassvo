"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareCheck,
  Store,
  Users,
  BarChart2,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

const mainNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Review Moderation", href: "/review-moderation", icon: MessageSquareCheck },
  { label: "Businesses", href: "/businesses", icon: Store },
  { label: "Users", href: "/users", icon: Users },
];

const insightNav = [
  { label: "Reports", href: "/reports", icon: BarChart2 },
  { label: "Analytics", href: "/analytics", icon: TrendingUp },
];

const systemNav = [{ label: "Settings", href: "/settings", icon: Settings }];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex h-[41px] w-full items-center gap-[9px] rounded-[10px] px-[10px] text-[16px] font-medium text-white transition-colors ${
        active ? "bg-brand-red" : "hover:bg-white/5"
      }`}
    >
      <Icon size={22} className="shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-[#060606] px-5 py-8">
      <div className="mb-10 flex items-center gap-2 px-1">
        <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" aria-hidden>
          <circle cx="12" cy="12" r="11" fill="none" stroke="#ea0505" strokeWidth="3" strokeDasharray="52 17" strokeLinecap="round" transform="rotate(-45 12 12)" />
        </svg>
        <span className="text-xl font-medium text-white">Cassvo</span>
      </div>

      <nav className="flex flex-1 flex-col gap-[22px] overflow-y-auto">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white">Main</p>
          <div className="flex flex-col gap-3">
            {mainNav.map((item) => (
              <NavLink key={item.href} {...item} active={pathname === item.href} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[7px]">
          <p className="text-sm text-white">Insight</p>
          <div className="flex flex-col gap-3">
            {insightNav.map((item) => (
              <NavLink key={item.href} {...item} active={pathname === item.href} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[10px]">
          <p className="text-sm text-white">System</p>
          <div className="flex flex-col gap-3">
            {systemNav.map((item) => (
              <NavLink key={item.href} {...item} active={pathname === item.href} />
            ))}
            <button
              type="button"
              className="flex h-[41px] w-full items-center gap-[9px] rounded-[10px] px-[10px] text-left text-[16px] font-medium text-white hover:bg-white/5"
            >
              <LogOut size={22} className="shrink-0" />
              <span>LogOut</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="mt-8 flex items-center gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-red text-sm font-medium text-white">
          A
        </div>
        <span className="text-[16px] font-medium tracking-[0.01em] text-white">Angela A.</span>
      </div>
    </aside>
  );
}
