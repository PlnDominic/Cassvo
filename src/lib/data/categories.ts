import { createClient } from "@/lib/supabase/server";

export interface CategoryOption {
  id: string;
  title: string;
}

/** categories is world-readable (RLS: "anyone can read categories", using true) — no special access needed. */
export async function getCategories(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("categories").select("id, title").order("title");

  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }
  return data ?? [];
}
