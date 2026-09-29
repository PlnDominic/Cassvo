/**
 * Case/spacing/punctuation/diacritic-insensitive key for matching an
 * uploaded file's name to a business name - e.g. "Aura Street Café.jpg"
 * and "aura-street-cafe" both normalize to "aurastreetcafe". Shared
 * between the batch-upload matching UI and (if ever needed) a test for
 * it; no server-only imports, safe from a Client Component.
 */
export function normalizeBusinessName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Filename minus its extension - "Aura Street Café.jpg" → "Aura Street Café". */
export function stripExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot > 0 ? filename.slice(0, dot) : filename;
}
