-- =====================================================================
--  PROPOSED — NOT YET APPLIED.
--
--  Touches the existing `reviews` table (one new column + one new
--  policy) — loop in whoever owns the schema before running this,
--  same as 003.
--
--  What it does:
--    1. Adds reviews.is_rejected (boolean, default false) — a real,
--       distinct "rejected by a moderator" state, additive alongside
--       the existing is_pending. Approving sets is_pending=false,
--       is_rejected=false; rejecting sets is_pending=true (hidden,
--       same as before a review is approved), is_rejected=true.
--       Nothing existing reads or depends on this column, so every
--       current row defaulting to false is a no-op for the mobile app.
--    2. Adds an admin UPDATE policy on `reviews`. The existing 2
--       policies on this table were almost certainly written for the
--       mobile app's own use case (an author can edit their own
--       review) — not for an admin approving/rejecting someone else's.
--       Without this, the Approve/Reject buttons would silently fail
--       to persist (RLS blocks the write, PostgREST returns success
--       with zero rows changed) even before is_rejected existed.
-- =====================================================================

alter table reviews add column if not exists is_rejected boolean not null default false;

comment on column reviews.is_rejected is
  'Set by an admin from the Review Moderation dashboard. Distinct from is_pending: is_pending gates public visibility, is_rejected records a moderator''s decision. A rejected review has is_pending=true (hidden) and is_rejected=true.';

create policy "Admins can moderate reviews"
  on reviews for update
  using (is_admin())
  with check (is_admin());
