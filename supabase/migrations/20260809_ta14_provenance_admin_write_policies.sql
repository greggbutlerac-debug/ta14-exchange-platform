-- TA-14 Provenance Registry Administrative Write Policies
-- Date: 2026-08-09
--
-- Purpose:
--   Permit authenticated TA-14 administrative users to create and maintain
--   canonical provenance sources and bounded source-to-link relationships.
--
-- Security model:
--   Public/ordinary authenticated users retain read-only access.
--   Write access is restricted to emails listed in
--   TA14_PROVENANCE_ADMIN_EMAILS below.
--
-- IMPORTANT:
--   Replace/add approved administrative emails in the function before
--   production use if additional TA-14 administrators are authorized.

create or replace function public.ta14_is_provenance_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    coalesce(
      lower((select auth.jwt() ->> 'email')) = any (
        array[
          'greggbutlerac@gmail.com'
        ]::text[]
      ),
      false
    );
$$;

revoke all on function public.ta14_is_provenance_admin() from public;
grant execute on function public.ta14_is_provenance_admin()
  to authenticated;

-- ---------------------------------------------------------------------------
-- Canonical source writes
-- ---------------------------------------------------------------------------

drop policy if exists "TA14 provenance admins can insert sources"
  on public.ta14_canonical_sources;

create policy "TA14 provenance admins can insert sources"
  on public.ta14_canonical_sources
  for insert
  to authenticated
  with check (public.ta14_is_provenance_admin());

drop policy if exists "TA14 provenance admins can update sources"
  on public.ta14_canonical_sources;

create policy "TA14 provenance admins can update sources"
  on public.ta14_canonical_sources
  for update
  to authenticated
  using (public.ta14_is_provenance_admin())
  with check (public.ta14_is_provenance_admin());

drop policy if exists "TA14 provenance admins can delete sources"
  on public.ta14_canonical_sources;

create policy "TA14 provenance admins can delete sources"
  on public.ta14_canonical_sources
  for delete
  to authenticated
  using (public.ta14_is_provenance_admin());

-- ---------------------------------------------------------------------------
-- Link-to-source relationship writes
-- ---------------------------------------------------------------------------

drop policy if exists "TA14 provenance admins can insert relationships"
  on public.ta14_canonical_link_sources;

create policy "TA14 provenance admins can insert relationships"
  on public.ta14_canonical_link_sources
  for insert
  to authenticated
  with check (public.ta14_is_provenance_admin());

drop policy if exists "TA14 provenance admins can update relationships"
  on public.ta14_canonical_link_sources;

create policy "TA14 provenance admins can update relationships"
  on public.ta14_canonical_link_sources
  for update
  to authenticated
  using (public.ta14_is_provenance_admin())
  with check (public.ta14_is_provenance_admin());

drop policy if exists "TA14 provenance admins can delete relationships"
  on public.ta14_canonical_link_sources;

create policy "TA14 provenance admins can delete relationships"
  on public.ta14_canonical_link_sources
  for delete
  to authenticated
  using (public.ta14_is_provenance_admin());

-- ---------------------------------------------------------------------------
-- Explicit grants
-- ---------------------------------------------------------------------------

grant insert, update, delete
  on public.ta14_canonical_sources
  to authenticated;

grant insert, update, delete
  on public.ta14_canonical_link_sources
  to authenticated;

comment on function public.ta14_is_provenance_admin() is
  'Returns true only for authenticated identities authorized to maintain the TA-14 canonical provenance registry.';
