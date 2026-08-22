/**
 * Supabase returns embedded relations as an array whenever it cannot infer a
 * to-one relationship — which is always the case for views, since they carry
 * no foreign-key metadata. Normalise both shapes to a single row or null.
 */
export function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
