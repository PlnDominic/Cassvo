# Cassvo — Supabase setup

The admin dashboard reads from and writes to the Supabase project that also
serves the live iOS/Android app. **That project's schema is the source of
truth — nothing here modifies it.** Until the environment variables below
are set, every dashboard page still renders but shows empty states and zero
counts; nothing crashes.

## Ground rule

No table, column, type, policy, or setting on the live project gets created,
altered, or dropped from this codebase. `supabase/reference/` holds a schema
this data layer was originally drafted against, back when the project was
believed to be empty — it is **not** the real schema and must never be
applied. It is kept only so the real schema can be diffed against it. There
is deliberately no `supabase/migrations/` folder, so a `supabase db push`
here can't touch anything.

If a page needs a column or table that doesn't exist yet, that's a request
to raise with whoever owns the schema — not something to add directly.

## 1. Environment

Copy `.env.example` to `.env.local` and fill in the values from the
project's **Settings → API** page:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. What the dashboard assumes about the schema

`src/lib/data/` reads from these tables/views. If any of the columns below
are renamed or missing on the real project, the affected page falls back to
an empty/zeroed state rather than erroring — but the feature won't work
until the column exists or the query is adjusted to match what's really
there.

| Table / view | Columns read |
|---|---|
| `members` | `id, full_name, email, phone, avatar_url, location, status, verified, joined_at`, `member_stats(reports_filed)` |
| `businesses` | `id, slug, name, category, status, region, city_area, cover_image_url, draft_progress, draft_state, updated_at`, `business_stats(review_count, average_rating)` |
| `reviews` | `id, business_id, rating, created_at`, `review_photos`, plus fields selected via `REVIEW_SELECT` in `src/lib/data/reviews.ts` |
| `reports` | `id, reason, status, created_at`, `report_evidence`, `reported_by → full_name`, plus `REPORT_SELECT` in `src/lib/data/reports.ts` |
| `notifications` | Real schema confirmed (2026-09-06, `cassvo_backend`): `id, user_id, type, title, subtitle, image_url, entity_id, is_read, created_at`. Not `description, actor_name, kind, href, read_at` as previously assumed here — this dashboard's own Notifications page doesn't read this table (see `src/lib/data/notifications.ts`'s file comment for why), but `src/lib/actions/system-updates.ts` writes to it to push a System Update to every mobile app user. RLS has no INSERT policy at all (only owner-scoped select/update/delete), so writing here requires the service-role client. |
| `admin_users` | `id, auth_user_id, full_name, email, role, avatar_url, permissions, active, invite_pending, last_active_at, created_at` |
| `login_activity` | `id, admin_id, device, browser, location, current, succeeded, created_at` |
| `platform_settings` | single row keyed `id = true`, JSONB columns `general, moderation, notification, security` |
| `system_updates` | dashboard-only table, see `supabase/proposed/007_system_updates.sql` |

## 3. Writes

The Settings pages write to: `platform_settings` (update), `admin_users`
(insert/update/delete), `login_activity` (delete, for "revoke session").
Every write goes through `src/lib/actions/settings.ts` — that file is the
complete list of what this dashboard ever mutates for Settings.

`src/lib/actions/system-updates.ts`'s `postSystemUpdate()` additionally
writes to `system_updates` (this dashboard's own record) and, separately,
`notifications` — one row per row in `profiles` — to actually push a
System Update to every mobile app user. That fan-out relies on a
Postgres trigger already live on the `cassvo_backend` project,
`send-push-on-notification` (`AFTER INSERT ON public.notifications`),
which calls the `send-push` Edge Function to forward the notification to
Expo's push API for whichever recipients have a `profiles.push_token`.
Confirmed live 2026-09-06 — not something this dashboard created, but
worth documenting here since it's the one place this codebase actually
reaches a real user's phone.

## 4. Admin access

Every table appears readable only by a signed-in user with an **active row
in `admin_users`**, gated by an `is_admin()`-style check (per the team's
existing RLS setup) — so the dashboard stays empty until the signed-in
Supabase auth user is linked to an `admin_users` row. Login currently only
navigates client-side and does not yet call
`supabase.auth.signInWithPassword` — that's still open.

## Where the queries live

`src/lib/data/` — one module per area (`businesses`, `users`, `reviews`,
`reports`, `notifications`, `admins`, `dashboard`, `settings`). Pages are
async server components that call these; no component holds sample data.

Each function returns an empty array/null when Supabase is unconfigured or
the query fails, and logs the error server-side — that's what keeps the
dashboard rendering through a schema mismatch instead of crashing.
