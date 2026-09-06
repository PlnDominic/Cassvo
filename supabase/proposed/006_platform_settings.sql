-- =====================================================================
--  PROPOSED — NOT YET APPLIED. Review and run yourself (SQL Editor).
--  Additive only — one new table, no existing table/column/policy
--  touched. Depends on admin_users + is_admin()/is_super_admin()
--  existing already (001_admin_users.sql).
--
--  What it does:
--    - Creates ONE new table, `platform_settings`, a single row
--      (id = true) holding the four Settings screens (General,
--      Moderation, Notifications, Security) as JSONB columns — the
--      exact shape src/lib/actions/settings.ts's savePlatformSettings
--      already writes to and src/lib/settings-schema.ts's
--      PlatformSettings/DEFAULT_SETTINGS already assume. Until this is
--      applied, every Settings tab (Moderation included) renders
--      built-in defaults and "Save" fails with a Postgres
--      "relation does not exist" error.
--    - Seeds that single row with empty JSONB objects, not a literal
--      copy of DEFAULT_SETTINGS — src/lib/data/settings.ts's
--      getPlatformSettings() deep-merges whatever's stored onto
--      DEFAULT_SETTINGS (mergeSettings(), settings-schema.ts), so an
--      empty/partial row already reads back as the same complete
--      defaults the UI showed before this table existed. This also
--      means a later addition to DEFAULT_SETTINGS never orphans this
--      row — no migration needed to backfill a new key.
--    - Enables RLS: any active admin (admin or moderator) can read the
--      row — every Settings tab, moderation included, needs to render
--      for a moderator, even though only an admin can save it. Only an
--      admin (is_super_admin(), not is_admin()) can update it — RLS
--      itself enforces the same admin-only restriction
--      savePlatformSettings() already checks in application code (see
--      supabase/proposed/001_admin_users.sql's is_super_admin() comment
--      for why the app-level check alone isn't enough: it's bypassable
--      by anyone calling Supabase directly with a moderator's own
--      session instead of going through this app).
--    - Deliberately no INSERT/DELETE policy: this is a fixed single-row
--      table (id boolean primary key default true check (id) — literally
--      cannot hold a second row), so nothing should ever need to insert
--      or delete a row once the bootstrap insert below has run.
-- =====================================================================

create table if not exists platform_settings (
  id           boolean primary key default true check (id),
  general      jsonb not null default '{}'::jsonb,
  moderation   jsonb not null default '{}'::jsonb,
  notification jsonb not null default '{}'::jsonb,
  security     jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);

comment on table platform_settings is
  'Single-row (id = true) table backing the Settings page''s General/Moderation/Notifications/Security tabs. Each JSONB column is deep-merged onto src/lib/settings-schema.ts''s DEFAULT_SETTINGS on read, so a missing/partial column or row degrades to defaults instead of breaking.';

-- The one row this table will ever hold. `on conflict (id) do nothing`
-- makes this safe to re-run without clobbering real data if this script
-- is run again after settings have already been saved.
insert into platform_settings (id) values (true) on conflict (id) do nothing;

alter table platform_settings enable row level security;

-- Any active admin, including a moderator, can read the current
-- settings — the Settings page renders all four tabs for a moderator
-- (read-only in the UI/app layer), it just can't save any of them.
drop policy if exists "Admins can view platform_settings" on platform_settings;
create policy "Admins can view platform_settings"
  on platform_settings for select
  using (is_admin());

-- Only an admin (not a moderator) can update platform_settings — gated
-- on is_super_admin() so this holds at the RLS layer itself, not just
-- via savePlatformSettings()'s own caller.role === "admin" check.
drop policy if exists "Admins can update platform_settings" on platform_settings;
create policy "Admins can update platform_settings"
  on platform_settings for update
  using (is_super_admin())
  with check (is_super_admin());
