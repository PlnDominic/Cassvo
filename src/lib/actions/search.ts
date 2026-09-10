"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { one } from "@/lib/data/util";

export interface SearchResult {
  id: string;
  type: "business" | "user" | "review";
  title: string;
  subtitle: string;
  href: string;
}

const RESULTS_PER_TYPE = 5;

/**
 * Backs the topbar's "search anything" box (src/components/layout/global-search.tsx)
 * — previously a plain <input> with no state or handler at all, so typing
 * into it did nothing anywhere in the app.
 *
 * Businesses and reviews are read with the caller's own session — both
 * tables are world-readable (RLS: "anyone can read businesses" /
 * confirmed working reads elsewhere in src/lib/data/), so no special
 * access is needed. profiles (users) is different: its RLS is almost
 * certainly owner-scoped (auth.uid() = id), matching the same reasoning
 * already documented in src/lib/actions/system-updates.ts's fanOutPush()
 * — an admin session can't read other users' profile rows through the
 * normal client, so that part goes through createAdminClient().
 *
 * Scoped to businesses/users/reviews for now — reports could reasonably
 * be added the same way later.
 */
export async function searchEverything(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const supabase = await createClient();
  if (!supabase) return [];
  const adminClient = createAdminClient();

  const [businesses, reviews, users] = await Promise.all([
    supabase.from("businesses").select("id, name, location").ilike("name", `%${q}%`).limit(RESULTS_PER_TYPE),
    supabase
      .from("reviews")
      .select("id, content, business:businesses!business_id (name)")
      .ilike("content", `%${q}%`)
      .limit(RESULTS_PER_TYPE),
    adminClient
      ? adminClient.from("profiles").select("id, full_name, location").ilike("full_name", `%${q}%`).limit(RESULTS_PER_TYPE)
      : Promise.resolve({ data: [] as { id: string; full_name: string | null; location: string | null }[] }),
  ]);

  const results: SearchResult[] = [];

  for (const row of businesses.data ?? []) {
    results.push({
      id: row.id,
      type: "business",
      title: row.name,
      subtitle: row.location ?? "Business",
      href: `/businesses/${row.id}`,
    });
  }

  for (const row of reviews.data ?? []) {
    const business = one<{ name: string }>(row.business);
    results.push({
      id: row.id,
      type: "review",
      title: business ? `Review on ${business.name}` : "Review",
      subtitle: row.content?.slice(0, 80) ?? "",
      href: "/review-moderation",
    });
  }

  for (const row of users.data ?? []) {
    results.push({
      id: row.id,
      type: "user",
      title: row.full_name ?? "Unnamed user",
      subtitle: row.location ?? "User",
      href: `/users/${row.id}`,
    });
  }

  return results;
}
