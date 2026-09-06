-- =====================================================================
--  PROPOSED — NOT YET APPLIED. Review and run yourself (SQL Editor).
--  Additive only — one new table, no existing table/column/policy
--  touched. Depends on admin_users + is_admin()/is_super_admin()
--  existing already (001_admin_users.sql).
--
--  What it does:
--    - Creates ONE new table, `system_updates`, for admin-posted
--      announcements ("Maintenance completed", "New feature: X") shown
--      on the Notifications page under the systemUpdate "Notify Me
--      About" toggle (platform_settings.notification.events.systemUpdate,
--      see settings-schema.ts). Until this is applied, that toggle has
--      nothing to gate — see src/lib/data/notifications.ts's file
--      comment, and postSystemUpdate() (src/lib/actions/system-updates.ts)
--      fails with a clear "not set up yet" message instead of a raw
--      Postgres error.
--    - Enables RLS: any active admin (admin or moderator) can read
--      updates — an announcement is meant for everyone on the
--      dashboard. Only an admin (not a moderator) can post or remove
--      one, gated on is_super_admin() rather than is_admin() so this
--      holds at the RLS layer itself, not just via
--      postSystemUpdate()'s own caller.role === "admin" check — same
--      reasoning as every other admin-only write in this dashboard
--      (see 001_admin_users.sql's is_super_admin() comment).
-- =====================================================================

create table if not exists system_updates (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  created_by  uuid references admin_users (id) on delete set null,
  created_at  timestamptz not null default now()
);

comment on table system_updates is
  'Admin-posted announcements ("Maintenance completed", "New feature: X") shown on the Notifications page under the systemUpdate event toggle. Posted via src/lib/actions/system-updates.ts, admin-only.';

create index if not exists system_updates_created_at_idx on system_updates (created_at desc);

alter table system_updates enable row level security;

drop policy if exists "Admins can view system_updates" on system_updates;
create policy "Admins can view system_updates"
  on system_updates for select
  using (is_admin());

drop policy if exists "Admins can post system_updates" on system_updates;
create policy "Admins can post system_updates"
  on system_updates for insert
  with check (is_super_admin());

drop policy if exists "Admins can remove system_updates" on system_updates;
create policy "Admins can remove system_updates"
  on system_updates for delete
  using (is_super_admin());
