/**
 * Deliberately NOT in period-dropdown.tsx ("use client"): a Server
 * Component importing a plain value (not just a type) from a client
 * module gets a client-reference proxy in the server bundle, not the
 * real array — that's exactly what broke /analytics and /analytics/map
 * in production (`PERIODS.includes is not a function`, digest
 * 1792767463) despite a clean local build and passing tsc. Type-only
 * imports are erased at compile time and were never the problem; this
 * only matters for the actual PERIODS array value.
 */
export const PERIODS = ["This Week", "This Month", "This Year", "All Time"] as const;
export type Period = (typeof PERIODS)[number];
