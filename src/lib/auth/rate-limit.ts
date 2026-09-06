/**
 * Shared with src/lib/data/notifications.ts (Security Alert events) —
 * kept out of src/lib/actions/auth.ts because a "use server" file can
 * only export async server actions, not plain constants.
 */
export const RATE_LIMIT_WINDOW_MINUTES = 15;
export const MAX_FAILED_ATTEMPTS = 5;
