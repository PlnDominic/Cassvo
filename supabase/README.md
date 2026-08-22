# Cassvo — Supabase setup

The admin dashboard reads everything from Supabase. Until the environment
variables below are set, every page still renders but shows empty states and
zero counts — nothing crashes.

## 1. Environment

Copy `.env.example` to `.env.local` and fill in the values from your project's
**Settings → API** page:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Apply the schema

Run `migrations/0001_init.sql` against the project — either paste it into the
SQL Editor in the Supabase dashboard, or with the CLI:

```bash
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

This creates the tables, the `business_stats` / `member_stats` views, row-level
security policies, and four storage buckets
(`business-photos`, `review-photos`, `avatars`, `verification-documents`).

## 3. Create your first admin

Every table is readable only by a signed-in user who has an **active row in
`admin_users`** — that is what `is_admin()` checks. So the dashboard stays
empty until you create one.

1. Create the user under **Authentication → Users** in the dashboard.
2. Then link it:

```sql
insert into admin_users (auth_user_id, full_name, email, role, permissions, active)
values (
  '<the auth user id>',
  'Angela A.',
  'angela@cassvo.com',
  'super_admin',
  array['Reviews','Businesses','Users','Reports','Analytics','Settings'],
  true
);
```

## Schema notes

- **`members`** are the app's reviewers; **`admin_users`** are dashboard staff.
  They are deliberately separate tables.
- **Review counts and average ratings are never stored on `businesses`.** They
  come from the `business_stats` view, so they cannot drift out of sync with
  the `reviews` table.
- `reports` points at exactly one of `target_review` / `target_business` /
  `target_member`, enforced by a check constraint that matches `target_type`.
- `businesses` doubles as the onboarding-draft store via `is_draft`,
  `draft_progress` and `draft_state`; the Drafts page reads those.
- `platform_settings` is a single row (`id` is a `boolean` primary key locked
  to `true`) holding the five Settings screens as JSONB.

## Where the queries live

`src/lib/data/` — one module per area (`businesses`, `users`, `reviews`,
`reports`, `notifications`, `admins`, `dashboard`). Pages are async server
components that call these; no component holds sample data any more.

Each function returns an empty array/null when Supabase is unconfigured or the
query fails, and logs the error server-side. That is what keeps the dashboard
rendering during setup.
