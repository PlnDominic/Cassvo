-- =====================================================================
--  PROPOSED — NOT YET APPLIED.
--
--  This is a script to review and run yourself (Supabase Dashboard ->
--  SQL Editor, or `supabase db execute`) — it is not run automatically
--  by anything in this repo, and nothing here has applied it to the
--  live project.
--
--  What it does:
--    - Creates ONE new table, `admin_users`, linking a Supabase Auth
--      user to a dashboard identity (name, role, active flag).
--    - Creates ONE new function, `is_admin()`, used by this table's
--      own RLS policies.
--    - Enables RLS on `admin_users` and adds policies scoped to it.
--
--  What it does NOT do:
--    - Touch any existing table, column, policy, or type. `businesses`,
--      `reviews`, `profiles`, etc. are untouched — this is additive
--      only, run in isolation from everything else in the schema.
--    - Create the first admin row for you (see the bootstrap step
--      at the bottom — that part needs to be run by hand, once, by
--      someone with SQL Editor access).
--
--  Why a table at all: right now the dashboard has no way to tell one
--  signed-in user from another admin, or from a regular app user who
--  happens to have a Supabase Auth account (e.g. anyone who used
--  /signup). This table is what makes "admin" a real, checkable thing.
-- =====================================================================

-- ---------------------------------------------------------------- table

create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid not null unique references auth.users (id) on delete cascade,
  full_name     text not null,
  email         text not null unique,
  role          text not null default 'admin' check (role in ('admin', 'moderator')),
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

comment on table admin_users is
  'Links a Supabase Auth user to a Cassvo dashboard admin identity. Having an auth.users account is not enough on its own — a matching, active row here is what grants dashboard access once RLS policies are updated to require it.';

-- ---------------------------------------------------------------- is_admin()

-- SECURITY DEFINER so this can be called from a policy on admin_users
-- itself without that policy needing to read admin_users non-recursively.
-- STABLE so Postgres can cache the result within one statement.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from admin_users
    where auth_user_id = auth.uid()
      and active
  );
$$;

comment on function is_admin() is
  'True when the currently authenticated user has an active admin_users row. Used by RLS policies — safe to reuse on other tables later without redefining it.';

-- ---------------------------------------------------------------- RLS

alter table admin_users enable row level security;

-- Any active admin can see the full admin roster (needed for the
-- Settings -> Admin Management table).
create policy "Admins can view admin_users"
  on admin_users for select
  using (is_admin());

-- Any active admin can edit another admin's role/active flag.
create policy "Admins can update admin_users"
  on admin_users for update
  using (is_admin());

-- Any active admin can remove another admin.
create policy "Admins can remove admin_users"
  on admin_users for delete
  using (is_admin());

-- Deliberately no INSERT policy: creating a new admin is a privileged
-- action that should not be self-service via RLS (a user granting
-- themselves admin by inserting their own row). New admin rows are
-- created via the SQL Editor, or later via a server action that uses
-- the service-role key rather than RLS.

-- ---------------------------------------------------------------- bootstrap

-- Run this once, by hand, after the table above exists — RLS blocks
-- every insert until at least one admin row exists (is_admin() is
-- false for everyone until then), so this first row has to go in
-- directly rather than through the dashboard.
--
-- 1. Find your auth user id: Authentication -> Users in the Supabase
--    dashboard, or:
--      select id, email from auth.users where email = 'you@example.com';
--
-- 2. Insert yourself as the first admin:
--
--   insert into admin_users (auth_user_id, full_name, email, role, active)
--   values (
--     '<paste the auth user id from step 1>',
--     'Your Name',
--     'you@example.com',
--     'admin',
--     true
--   );
