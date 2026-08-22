-- =====================================================================
--  PROPOSED — NOT YET APPLIED.
--
--  Unlike 001/002, this touches EXISTING tables (review_reports,
--  problem_reports) rather than creating new ones — it adds one
--  additional SELECT policy to each, on top of whatever 2 policies
--  already exist there. It does not remove, replace, or weaken any
--  existing policy; a mobile-app user's own access is unaffected.
--
--  Loop in whoever owns the schema before running this — this is the
--  kind of change they specifically asked to review.
--
--  Why: the existing policies on these tables were almost certainly
--  written for the mobile app (e.g. "a user can see their own filed
--  report"), not for admin dashboard access. That's why the Reports
--  page shows 0 records despite real rows existing — the signed-in
--  admin isn't the reporter on any of them, so existing RLS correctly
--  hides them. This grants read access to anyone with an active
--  admin_users row, additively.
-- =====================================================================

create policy "Admins can view review_reports"
  on review_reports for select
  using (is_admin());

create policy "Admins can view problem_reports"
  on problem_reports for select
  using (is_admin());
