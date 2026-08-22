-- =====================================================================
--  DO NOT RUN THIS FILE AGAINST THE CASSVO PROJECT.
--
--  This was written when we believed the Supabase project was new and
--  empty. It is NOT the real schema. The live project already has its
--  own schema serving the iOS/Android app, and that schema is the
--  single source of truth.
--
--  Applying this would attempt to create 12 tables, 9 enum types and
--  2 views, and would run `alter table ... enable row level security`.
--  Enabling RLS on an existing table without matching policies makes it
--  return zero rows to the mobile app — a silent production outage.
--
--  It is kept only as a record of what the dashboard's data layer was
--  originally written against, so it can be diffed against the real
--  schema. It lives outside supabase/migrations/ on purpose, so that
--  `supabase db push` cannot pick it up.
-- =====================================================================

-- Cassvo admin platform — initial schema
-- Domain model derived from the admin dashboard UI.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums

create type business_status   as enum ('pending', 'confirmed', 'suspended');
create type draft_status      as enum ('in-progress', 'pending-verification', 'incomplete');
create type member_status     as enum ('active', 'warned', 'suspended', 'guest');
create type review_status     as enum ('pending', 'approved', 'rejected');
create type report_status     as enum ('pending', 'investigating', 'resolved');
create type report_target     as enum ('review', 'business', 'user');
create type report_priority   as enum ('low', 'medium', 'high');
create type admin_role        as enum ('super_admin', 'moderator', 'analyst');
create type notification_kind as enum ('review', 'business', 'user', 'system');

-- ---------------------------------------------------------------- members
-- App users (reviewers). Optionally linked to a Supabase auth user.

create table members (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  full_name    text not null,
  email        text not null unique,
  phone        text,
  avatar_url   text,
  location     text,
  status       member_status not null default 'active',
  verified     boolean not null default false,
  joined_at    timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index members_status_idx on members (status);

-- ---------------------------------------------------------------- businesses

create table businesses (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  category            text not null,
  business_type       text,
  description         text,
  status              business_status not null default 'pending',

  -- contact / location
  address             text,
  city_area           text,
  region              text,
  phone               text,
  email               text,
  website             text,
  operating_hours     text,
  wait_time           text,
  price_level         smallint check (price_level between 1 and 4),
  amenities           text[] not null default '{}',

  -- verification
  legal_name          text,
  registration_number text,
  tax_id              text,
  date_registered     date,

  -- media
  cover_image_url     text,
  logo_url            text,

  -- merchandising
  featured            boolean not null default false,
  featured_at         timestamptz,

  -- onboarding drafts
  is_draft            boolean not null default false,
  draft_progress      smallint not null default 0 check (draft_progress between 0 and 100),
  draft_state         draft_status,

  owner_id            uuid references members (id) on delete set null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index businesses_status_idx   on businesses (status);
create index businesses_featured_idx on businesses (featured) where featured;
create index businesses_draft_idx    on businesses (is_draft) where is_draft;

create table business_photos (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  url         text not null,
  position    smallint not null default 0,
  created_at  timestamptz not null default now()
);

create index business_photos_business_idx on business_photos (business_id, position);

create table business_documents (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  title       text not null,
  file_url    text not null,
  file_size   bigint,
  mime_type   text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index business_documents_business_idx on business_documents (business_id);

-- ---------------------------------------------------------------- reviews

create table reviews (
  id                uuid primary key default gen_random_uuid(),
  business_id       uuid not null references businesses (id) on delete cascade,
  author_id         uuid references members (id) on delete set null,
  rating            numeric(2,1) not null check (rating >= 0 and rating <= 5),
  body              text not null,
  price_level       smallint check (price_level between 1 and 4),
  crowd_level       text,
  tags              text[] not null default '{}',
  status            review_status not null default 'pending',
  helpful_count     integer not null default 0,
  not_helpful_count integer not null default 0,
  visited_on        date,
  moderated_by      uuid,
  moderated_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index reviews_business_idx on reviews (business_id);
create index reviews_status_idx   on reviews (status);
create index reviews_author_idx   on reviews (author_id);

create table review_photos (
  id         uuid primary key default gen_random_uuid(),
  review_id  uuid not null references reviews (id) on delete cascade,
  url        text not null,
  position   smallint not null default 0,
  created_at timestamptz not null default now()
);

create index review_photos_review_idx on review_photos (review_id, position);

-- ---------------------------------------------------------------- admins

create table admin_users (
  id             uuid primary key default gen_random_uuid(),
  auth_user_id   uuid unique references auth.users (id) on delete cascade,
  full_name      text not null,
  email          text not null unique,
  role           admin_role not null default 'moderator',
  permissions    text[] not null default '{}',
  avatar_url     text,
  active         boolean not null default true,
  invite_pending boolean not null default false,
  last_active_at timestamptz,
  created_at     timestamptz not null default now()
);

create table login_activity (
  id           uuid primary key default gen_random_uuid(),
  admin_id     uuid not null references admin_users (id) on delete cascade,
  device       text,
  browser      text,
  location     text,
  current      boolean not null default false,
  succeeded    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index login_activity_admin_idx on login_activity (admin_id, created_at desc);

-- ---------------------------------------------------------------- reports

create table reports (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique default ('RP-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random() * 100000))::text, 5, '0')),
  target_type    report_target not null,
  target_review  uuid references reviews (id)   on delete cascade,
  target_business uuid references businesses (id) on delete cascade,
  target_member  uuid references members (id)   on delete cascade,
  reported_by    uuid references members (id)   on delete set null,
  reason         text not null,
  details        text,
  status         report_status not null default 'pending',
  priority       report_priority not null default 'medium',
  assigned_to    uuid references admin_users (id) on delete set null,
  notes          text,
  resolved_at    timestamptz,
  created_at     timestamptz not null default now(),

  -- exactly one target must be set, matching target_type
  constraint reports_target_matches_type check (
    (target_type = 'review'   and target_review   is not null and target_business is null and target_member is null) or
    (target_type = 'business' and target_business is not null and target_review   is null and target_member is null) or
    (target_type = 'user'     and target_member   is not null and target_review   is null and target_business is null)
  )
);

create index reports_status_idx on reports (status);
create index reports_created_idx on reports (created_at desc);

create table report_evidence (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references reports (id) on delete cascade,
  url        text not null,
  created_at timestamptz not null default now()
);

create index report_evidence_report_idx on report_evidence (report_id);

-- ---------------------------------------------------------------- notifications

create table notifications (
  id          uuid primary key default gen_random_uuid(),
  kind        notification_kind not null,
  title       text not null,
  description text,
  href        text,
  actor_name  text,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index notifications_created_idx on notifications (created_at desc);
create index notifications_unread_idx  on notifications (read_at) where read_at is null;

-- ---------------------------------------------------------------- settings
-- Single-row table holding the platform settings screens.

create table platform_settings (
  id           boolean primary key default true check (id),
  general      jsonb not null default '{}'::jsonb,
  moderation   jsonb not null default '{}'::jsonb,
  notification jsonb not null default '{}'::jsonb,
  security     jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now()
);

insert into platform_settings (id) values (true) on conflict do nothing;

-- ---------------------------------------------------------------- updated_at

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger members_updated_at    before update on members    for each row execute function set_updated_at();
create trigger businesses_updated_at before update on businesses for each row execute function set_updated_at();
create trigger reviews_updated_at    before update on reviews    for each row execute function set_updated_at();

-- ---------------------------------------------------------------- derived stats
-- Ratings/counts are derived rather than denormalised so they cannot drift.

create view business_stats as
select
  b.id                                            as business_id,
  count(r.id) filter (where r.status = 'approved') as review_count,
  round(avg(r.rating) filter (where r.status = 'approved'), 1) as average_rating
from businesses b
left join reviews r on r.business_id = b.id
group by b.id;

create view member_stats as
select
  m.id                            as member_id,
  count(distinct r.id)            as reviews_posted,
  count(distinct rep.id)          as reports_filed
from members m
left join reviews r   on r.author_id = m.id
left join reports rep on rep.reported_by = m.id
group by m.id;

-- ---------------------------------------------------------------- RLS
-- The admin dashboard is staff-only: every table is readable/writable
-- solely by a signed-in user who has an active admin_users row.

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users
    where auth_user_id = auth.uid() and active
  );
$$;

alter table members            enable row level security;
alter table businesses         enable row level security;
alter table business_photos    enable row level security;
alter table business_documents enable row level security;
alter table reviews            enable row level security;
alter table review_photos      enable row level security;
alter table admin_users        enable row level security;
alter table login_activity     enable row level security;
alter table reports            enable row level security;
alter table report_evidence    enable row level security;
alter table notifications      enable row level security;
alter table platform_settings  enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'members','businesses','business_photos','business_documents','reviews',
    'review_photos','admin_users','login_activity','reports','report_evidence',
    'notifications','platform_settings'
  ]
  loop
    execute format(
      'create policy %I on %I for all to authenticated using (is_admin()) with check (is_admin());',
      t || '_admin_all', t
    );
  end loop;
end $$;

-- Let a signed-in admin always see their own row, so is_admin() can bootstrap.
create policy admin_users_self_read on admin_users
  for select to authenticated
  using (auth_user_id = auth.uid());

-- ---------------------------------------------------------------- storage

insert into storage.buckets (id, name, public)
values
  ('business-photos', 'business-photos', true),
  ('review-photos',   'review-photos',   true),
  ('avatars',         'avatars',         true),
  ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;

-- Public buckets: world-readable, admin-writable.
create policy "public buckets are readable"
  on storage.objects for select
  using (bucket_id in ('business-photos', 'review-photos', 'avatars'));

create policy "admins manage public buckets"
  on storage.objects for all to authenticated
  using (bucket_id in ('business-photos', 'review-photos', 'avatars') and is_admin())
  with check (bucket_id in ('business-photos', 'review-photos', 'avatars') and is_admin());

-- Verification documents are private: admins only, both directions.
create policy "admins manage verification documents"
  on storage.objects for all to authenticated
  using (bucket_id = 'verification-documents' and is_admin())
  with check (bucket_id = 'verification-documents' and is_admin());
