"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareCheck,
  Store,
  Users,
  BarChart2,
  TrendingUp,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex h-[41px] w-full items-center gap-[9px] rounded-[10px] px-[10px] text-[16px] font-medium text-white transition-colors ${
        active ? "bg-brand-red" : "hover:bg-white/5"
      }`}
    >
      <Icon size={22} className="shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({
  adminName,
  avatarUrl,
  open,
  onClose,
}: {
  adminName: string | null;
  avatarUrl: string | null;
  /** Whether the mobile drawer is open. Ignored at the lg breakpoint and up, where the sidebar is always visible. */
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Backdrop — mobile drawer only. */}
      {open && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[260px] max-w-[82vw] shrink-0 -translate-x-full flex-col bg-[#060606] px-5 py-6 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[260px] lg:max-w-none lg:translate-x-0 lg:py-8 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-7 w-7 shrink-0" aria-hidden>
              <circle cx="12" cy="12" r="11" fill="none" stroke="#ea0505" strokeWidth="3" strokeDasharray="52 17" strokeLinecap="round" transform="rotate(-45 12 12)" />
            </svg>
            <span className="text-xl font-medium text-white">Cassvo</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-[22px] overflow-y-auto">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-white">Main</p>
            <div className="flex flex-col gap-3">
              {mainNav.map((item) => (
                <NavLink key={item.href} {...item} active={pathname === item.href} onNavigate={onClose} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <p className="text-sm text-white">Insight</p>
            <div className="flex flex-col gap-3">
              {insightNav.map((item) => (
                <NavLink key={item.href} {...item} active={pathname === item.href} onNavigate={onClose} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <p className="text-sm text-white">System</p>
            <div className="flex flex-col gap-3">
              {systemNav.map((item) => (
                <NavLink key={item.href} {...item} active={pathname === item.href} onNavigate={onClose} />
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-[41px] w-full items-center gap-[9px] rounded-[10px] px-[10px] text-left text-[16px] font-medium text-white hover:bg-white/5"
              >
                <LogOut size={22} className="shrink-0" />
                <span>LogOut</span>
              </button>
            </div>
          </div>
        </nav>

        <Link href="/profile" onClick={onClose} className="mt-8 flex items-center gap-2 hover:opacity-80">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-red text-sm font-medium text-white">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote Supabase storage URL
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              (adminName?.trim().charAt(0).toUpperCase() ?? "?")
            )}
          </div>
          <span className="text-[16px] font-medium tracking-[0.01em] text-white">
            {adminName ?? "Not signed in"}
          </span>
        </Link>
      </aside>
    </>
  );
}
