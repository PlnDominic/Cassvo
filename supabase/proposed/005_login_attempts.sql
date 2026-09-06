-- =====================================================================
--  PROPOSED — NOT YET APPLIED. Review and run yourself (SQL Editor).
--  Additive only — one new table, no existing table/column/policy
--  touched.
--
--  Backs app-level rate limiting on the admin login form (security
--  finding #6): src/lib/actions/auth.ts counts recent failed attempts
--  for the submitted email before calling Supabase Auth at all, and
--  blocks with a generic "too many attempts" message once a threshold
--  is hit within a sliding window. Every row here is written by that
--  server action using the service-role client (src/lib/supabase/admin.ts)
--  — never by the anon key — so RLS is enabled with *zero* policies:
--  default-deny for both the anon and authenticated roles, reachable
--  only server-side. This does not create any new publicly-writable
--  surface.
-- =====================================================================

create table if not exists login_attempts (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  succeeded   boolean not null,
  created_at  timestamptz not null default now()
);

comment on table login_attempts is
  'Append-only log of admin-login attempts (success or failure) against the submitted email, used only to rate-limit repeated failures. Written exclusively by the service-role client from src/lib/actions/auth.ts — RLS is enabled with no policies, so neither anon nor authenticated roles can read or write it directly.';

create index if not exists login_attempts_email_created_at_idx
  on login_attempts (email, created_at desc);

alter table login_attempts enable row level security;

-- Deliberately no policies at all (see comment above and in the table
-- comment) — this table is invisible to both the anon key and any
-- authenticated session; only the service-role client touches it.

-- =====================================================================
--  Row volume: this is a low-traffic internal login form, so no cleanup
--  job is included. If it ever grows large, a simple retention delete
--  (e.g. `delete from login_attempts where created_at < now() - interval
--  '30 days'`) run occasionally would be enough — not added here since
--  nothing in the app depends on old rows existing.
-- =====================================================================
