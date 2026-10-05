-- =====================================================================
--  PROPOSED - NOT YET APPLIED. Review and run yourself (SQL Editor).
--  Re-runnable. Depends on 001_admin_users.sql and
--  006_platform_settings.sql.
--
--  Login Verification (Settings -> Security): when
--  platform_settings.security.authentication.loginEmailCode is true, a
--  dashboard session only counts as an admin after its owner has
--  entered a code emailed to them following a password sign-in.
--
--  What it does:
--    - Creates `login_verifications`, one row per auth session that has
--      been sent / has entered a code. Service-role only (no policies);
--      written by src/lib/actions/login-verification.ts.
--    - Creates login_verification_status(): 'not_required' | 'verified'
--      | 'pending' | 'password_required' for the caller's own session.
--    - Redefines is_admin() and is_super_admin() to also require
--      login_verified(), so an unverified session gets no admin access
--      through RLS either, not just through the dashboard's pages.
--      With the setting off, both behave exactly as before.
--    - Adds an own-row SELECT policy on admin_users, so the login flow
--      can still recognise an admin whose session isn't verified yet.
--
--  To switch the requirement off without the dashboard (e.g. if codes
--  aren't arriving and nobody can get in):
--    update platform_settings
--    set security = jsonb_set(security, '{authentication,loginEmailCode}', 'false')
--    where id;
-- =====================================================================

create table if not exists login_verifications (
  session_id    uuid primary key,
  admin_id      uuid not null references admin_users (id) on delete cascade,
  code_sent_at  timestamptz,
  attempts      integer not null default 0,
  verified_at   timestamptz,
  created_at    timestamptz not null default now()
);

comment on table login_verifications is
  'Per-session state for Settings -> Security "Login Verification": whether the emailed sign-in code was sent and entered. Service-role only.';

alter table login_verifications enable row level security;

-- ---------------------------------------------------------------- status

-- SECURITY DEFINER so it can read platform_settings and
-- login_verifications regardless of the caller's own access (an
-- unverified session can read neither through RLS).
create or replace function login_verification_status()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select case
    when not coalesce(
      (select (security -> 'authentication' ->> 'loginEmailCode')::boolean from platform_settings where id),
      false
    ) then 'not_required'
    -- The code is a second step after a password, not a replacement for
    -- one: a session created by an emailed link/code alone (amr without
    -- "password") must sign in with a password first.
    when not coalesce((auth.jwt() -> 'amr') @> '[{"method": "password"}]'::jsonb, false)
      then 'password_required'
    when exists (
      select 1
      from login_verifications
      where session_id = nullif(auth.jwt() ->> 'session_id', '')::uuid
        and verified_at is not null
    ) then 'verified'
    else 'pending'
  end;
$$;

comment on function login_verification_status() is
  'Login Verification state of the calling session: not_required, verified, pending, or password_required.';

create or replace function login_verified()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select login_verification_status() in ('not_required', 'verified');
$$;

grant execute on function login_verification_status() to authenticated;
grant execute on function login_verified() to authenticated;

-- ---------------------------------------------------------------- is_admin()

-- Same bodies as 001_admin_users.sql, plus `and login_verified()`.
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
  ) and login_verified();
$$;

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
  ) and login_verified();
$$;

-- ---------------------------------------------------------------- admin_users

-- With is_admin() now false for an unverified session, "Admins can view
-- admin_users" no longer lets that session see its own row, which the
-- login flow and middleware need to recognise it as an admin mid-login.
-- Own row only; the full roster still needs is_admin().
drop policy if exists "Admins can view their own admin_users row" on admin_users;
create policy "Admins can view their own admin_users row"
  on admin_users for select
  using (auth_user_id = auth.uid());
