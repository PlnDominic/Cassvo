"use client";

import { useRouter, usePathname } from "next/navigation";
import { PeriodDropdown, type Period } from "../dashboard/period-dropdown";

/**
 * The Review Map Analysis page's own period control — was a bare,
 * uncontrolled <PeriodDropdown /> with no onChange at all, so picking a
 * period only changed the dropdown's own label. Pushes ?period= onto
 * the URL, same pattern as AnalyticsToolbar, so the server page re-runs
 * getRegionStats() (and the overview stats derived from it) for the
 * selected window.
 */
export function MapPeriodControl({ period }: { period: Period }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <PeriodDropdown
      value={period}
      onChange={(next) => router.push(`${pathname}?period=${encodeURIComponent(next)}`)}
    />
  );
}
