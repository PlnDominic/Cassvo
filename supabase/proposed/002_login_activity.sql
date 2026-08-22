-- =====================================================================
--  PROPOSED — NOT YET APPLIED. Review and run yourself (SQL Editor).
--  Additive only — does not touch any existing table, column, policy,
--  or type. Depends on admin_users existing already (001_admin_users.sql).
-- =====================================================================

create table if not exists login_activity (
  id          uuid primary key default gen_random_uuid(),
  admin_id    uuid not null references admin_users (id) on delete cascade,
  device      text,
  browser     text,
  location    text,
  current     boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table login_activity is
  'One row per recorded admin sign-in, for Settings -> Security "Active Sessions" and the Profile page login-activity table.';

alter table login_activity enable row level security;

-- Any active admin can see every recorded session (matches the existing
-- Settings -> Security screen, which lists everyone's sessions).
create policy "Admins can view login_activity"
  on login_activity for select
  using (is_admin());

-- Any active admin can revoke any session (matches src/lib/actions/settings.ts's
-- revokeSession, which deletes by id).
create policy "Admins can revoke login_activity"
  on login_activity for delete
  using (is_admin());

-- An admin can only insert a row for *themselves* — this is what lets
-- the login flow record "I just signed in" client-side right after
-- auth, without needing a service-role key, while still preventing one
-- admin from fabricating a session for another.
create policy "Admins can record their own login"
  on login_activity for insert
  with check (
    admin_id in (select id from admin_users where auth_user_id = auth.uid())
  );

-- An admin can update their own rows (used to flip older sessions'
-- `current` flag to false when a new one is recorded).
create policy "Admins can update their own login_activity"
  on login_activity for update
  using (
    admin_id in (select id from admin_users where auth_user_id = auth.uid())
  );

-- =====================================================================
--  Table + RLS only. Nothing populates this table automatically yet —
--  no row is written on sign-in until the login flow is updated to
--  insert one (a follow-up code change, not part of this script). Ask
--  for that once this has been run, if you want it.
-- =====================================================================
