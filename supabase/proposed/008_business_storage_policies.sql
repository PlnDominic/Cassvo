-- =====================================================================
--  PROPOSED — NOT YET APPLIED. Review and run yourself (SQL Editor).
--  Touches EXISTING storage.objects policies (adds new ones scoped to
--  the business-covers/business-photos buckets only) — does not modify
--  any policy on avatars/review-photos/collection-covers, and does not
--  touch any non-storage table. Depends on is_admin()/is_super_admin()
--  already existing (001_admin_users.sql).
--
--  Why: confirmed live (2026-09) — business-covers has a SELECT policy
--  only ("business covers are readable"), no INSERT/UPDATE/DELETE at
--  all. business-photos has *no* policies whatsoever. Both are public
--  buckets, so existing images still display fine (a public bucket's
--  GET-by-URL path doesn't go through these RLS policies) — but any
--  write, including the Add/Edit Business wizard's own image uploads
--  (src/lib/upload-image.ts, called from the browser with the admin's
--  own session, not the service-role client createBusiness()/
--  updateBusiness() use for the row itself), always does. That's what
--  was failing: "new row violates row-level security policy".
--
--  Gated on is_super_admin() (role = 'admin'), not is_admin() — matches
--  createBusiness()/updateBusiness()'s own admin-only posture. Without
--  this, RLS would be the one place that restriction didn't hold: a
--  moderator can't create/edit a business row (blocked in application
--  code + by the service-role-only write), but could otherwise have
--  uploaded files into these buckets directly via the browser client
--  regardless of that.
-- =====================================================================

drop policy if exists "Admins can upload business covers" on storage.objects;
create policy "Admins can upload business covers"
  on storage.objects for insert
  with check (bucket_id = 'business-covers' and is_super_admin());

drop policy if exists "Admins can update business covers" on storage.objects;
create policy "Admins can update business covers"
  on storage.objects for update
  using (bucket_id = 'business-covers' and is_super_admin());

drop policy if exists "Admins can delete business covers" on storage.objects;
create policy "Admins can delete business covers"
  on storage.objects for delete
  using (bucket_id = 'business-covers' and is_super_admin());

-- business-photos has no policies at all yet — add read (matching the
-- other public buckets' own pattern) alongside admin-only writes.
drop policy if exists "Business photos are readable" on storage.objects;
create policy "Business photos are readable"
  on storage.objects for select
  using (bucket_id = 'business-photos');

drop policy if exists "Admins can upload business photos" on storage.objects;
create policy "Admins can upload business photos"
  on storage.objects for insert
  with check (bucket_id = 'business-photos' and is_super_admin());

drop policy if exists "Admins can update business photos" on storage.objects;
create policy "Admins can update business photos"
  on storage.objects for update
  using (bucket_id = 'business-photos' and is_super_admin());

drop policy if exists "Admins can delete business photos" on storage.objects;
create policy "Admins can delete business photos"
  on storage.objects for delete
  using (bucket_id = 'business-photos' and is_super_admin());
