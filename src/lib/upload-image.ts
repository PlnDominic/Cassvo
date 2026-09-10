import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file to a public Supabase Storage bucket and returns its
 * public URL, or null on failure/misconfiguration. Client-only — the
 * browser Supabase client is what actually has an authenticated
 * session with storage write access (see client.ts's own docstring:
 * "for client components that read or upload directly").
 *
 * Used by the Add Business wizard to turn a locally-previewed file
 * into a real, permanent URL before createBusiness() ever runs — the
 * blob: preview URL a <img> shows while editing dies with the tab, so
 * uploading only happens once, at actual submit time, not on every
 * file selection (avoids orphaning uploads for a wizard the admin
 * abandons partway through).
 */
export async function uploadImage(bucket: string, file: File): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    console.error(`uploadImage (${bucket}):`, error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
