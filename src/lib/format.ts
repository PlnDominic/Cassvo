const UNITS: [limitSeconds: number, divisor: number, unit: Intl.RelativeTimeFormatUnit][] = [
  [60, 1, "second"],
  [3600, 60, "minute"],
  [86400, 3600, "hour"],
  [604800, 86400, "day"],
  [2629800, 604800, "week"],
  [31557600, 2629800, "month"],
  [Infinity, 31557600, "year"],
];

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** "2 mins ago" style label for a timestamp. */
export function formatRelative(timestamp: string | null | undefined): string {
  if (!timestamp) return "—";
  const then = new Date(timestamp).getTime();
  if (Number.isNaN(then)) return "—";

  const diffSeconds = (then - Date.now()) / 1000;
  const abs = Math.abs(diffSeconds);

  for (const [limit, divisor, unit] of UNITS) {
    if (abs < limit) return relative.format(Math.round(diffSeconds / divisor), unit);
  }
  return "—";
}

/** "12th May 2026" style date label. */
export function formatDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

/** "06/07/2026" style short date. */
export function formatShortDate(timestamp: string | null | undefined): string {
  if (!timestamp) return "—";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB").format(date);
}

/** Compact number for stat tiles: 1,284 / 12.9K / 4.2M */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}
