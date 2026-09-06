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
--    - Creates TWO new functions, `is_admin()` and `is_super_admin()`,
--      used by this table's own RLS policies (the latter also used by
--      login_activity's, in 002_login_activity.sql).
--    - Enables RLS on `admin_users` and adds policies scoped to it. The
--      UPDATE/DELETE policies are admin-only (is_super_admin()), not
--      just any active admin_users row (is_admin()) — otherwise a
--      moderator could edit or delete admin_users rows, including their
--      own role, by calling Supabase directly instead of through this
--      app's admin-only server actions.
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

-- ---------------------------------------------------------------- is_super_admin()

-- Stricter than is_admin(): true only for an active row whose role is
-- specifically 'admin', not 'moderator'. admin_users' own UPDATE/DELETE
-- policies (below) and login_activity's DELETE policy (002) need this,
-- not is_admin() — the app layer (src/lib/actions/settings.ts) already
-- checks caller.role === 'admin' before calling any of those mutations,
-- but that check is bypassable by anyone who calls the Supabase REST/JS
-- API directly with a moderator's own session instead of going through
-- this app. RLS is the real trust boundary here, so it has to enforce
-- the same role restriction itself — a policy that only calls is_admin()
-- would let a moderator promote themselves to 'admin' (or deactivate/
-- delete any admin, including the actual admins) by writing to
-- admin_users directly, with the app-level check never in the loop.
create or replace function is_super_admin()
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
      and role = 'admin'
  );
$$;

comment on function is_super_admin() is
  'True when the currently authenticated user has an active admin_users row with role = ''admin'' (not ''moderator''). Used to gate RLS policies that must stay admin-only even against direct API/client calls, not just the app''s own server actions.';

-- ---------------------------------------------------------------- RLS

alter table admin_users enable row level security;

-- Any active admin (admin or moderator) can see the full admin roster
-- (needed for the Settings -> Admin Management table, and for the
-- "Assign Moderator" picker, which any admin dashboard user can open).
create policy "Admins can view admin_users"
  on admin_users for select
  using (is_admin());

-- Only an admin (not a moderator) can edit another admin's role/active
-- flag — enforced here via is_super_admin(), not just in application
-- code, so a moderator can't bypass the app and self-promote by calling
-- Supabase directly with their own session. with_check mirrors using()
-- so a caller also can't turn a row into something that would pass a
-- laxer check after the fact.
-- Dropped and recreated rather than left as a bare `create policy` —
-- this same policy name may already exist on a project that ran an
-- earlier version of this script with the old, is_admin()-only
-- definition; this makes the fix re-runnable instead of erroring on
-- "policy already exists".
drop policy if exists "Admins can update admin_users" on admin_users;
create policy "Admins can update admin_users"
  on admin_users for update
  using (is_super_admin())
  with check (is_super_admin());

-- Only an admin (not a moderator) can remove another admin — same
-- reasoning as the update policy above.
drop policy if exists "Admins can remove admin_users" on admin_users;
create policy "Admins can remove admin_users"
  on admin_users for delete
  using (is_super_admin());

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
