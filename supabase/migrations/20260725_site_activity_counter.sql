-- TA-14 Exchange public site activity counter
-- Counts:
--   1) one site visit per browser session ID
--   2) one page view per accepted route request
-- Privacy:
--   no IP address, email address, account ID, or fingerprint is stored

create extension if not exists pgcrypto;

create table if not exists public.site_activity_totals (
  id smallint primary key default 1 check (id = 1),
  visitors bigint not null default 0 check (visitors >= 0),
  page_views bigint not null default 0 check (page_views >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_activity_totals (id, visitors, page_views)
values (1, 0, 0)
on conflict (id) do nothing;

create table if not exists public.site_activity_visits (
  visit_id uuid primary key,
  first_path text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  page_views bigint not null default 1 check (page_views >= 1)
);

create index if not exists site_activity_visits_last_seen_at_idx
  on public.site_activity_visits (last_seen_at desc);

alter table public.site_activity_totals enable row level security;
alter table public.site_activity_visits enable row level security;

revoke all on table public.site_activity_totals from anon, authenticated;
revoke all on table public.site_activity_visits from anon, authenticated;

create or replace function public.record_site_activity(
  p_visit_id uuid,
  p_path text
)
returns table (
  new_visitor boolean,
  visitors bigint,
  page_views bigint,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_visitor boolean := false;
begin
  if p_visit_id is null then
    raise exception 'visit ID is required';
  end if;

  if p_path is null
     or length(btrim(p_path)) = 0
     or length(p_path) > 500
     or left(p_path, 1) <> '/' then
    raise exception 'valid path is required';
  end if;

  insert into public.site_activity_visits (
    visit_id,
    first_path,
    first_seen_at,
    last_seen_at,
    page_views
  )
  values (
    p_visit_id,
    p_path,
    now(),
    now(),
    1
  )
  on conflict (visit_id) do update
    set last_seen_at = now(),
        page_views = public.site_activity_visits.page_views + 1;

  v_new_visitor := found;

  -- FOUND is true for both INSERT and UPDATE after an upsert, so determine
  -- whether this session was first created from its current page-view count.
  select (sav.page_views = 1)
    into v_new_visitor
  from public.site_activity_visits sav
  where sav.visit_id = p_visit_id;

  update public.site_activity_totals
  set visitors = site_activity_totals.visitors
      + case when v_new_visitor then 1 else 0 end,
      page_views = site_activity_totals.page_views + 1,
      updated_at = now()
  where id = 1
  returning
    v_new_visitor,
    site_activity_totals.visitors,
    site_activity_totals.page_views,
    site_activity_totals.updated_at
  into
    new_visitor,
    visitors,
    page_views,
    updated_at;

  return next;
end;
$$;

revoke all on function public.record_site_activity(uuid, text)
  from public, anon, authenticated;

comment on table public.site_activity_totals is
  'Singleton public activity totals for TA-14 Exchange site visits and page views.';

comment on table public.site_activity_visits is
  'Privacy-minimal browser-session records used to count one visit per session.';

comment on function public.record_site_activity(uuid, text) is
  'Atomically records one page view and increments visitors only for a new browser session.';
