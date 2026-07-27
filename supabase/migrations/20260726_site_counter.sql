-- TA-14 Exchange site counter
-- Creates privacy-preserving aggregate counters and one RPC that records
-- a page view and returns the latest totals atomically.
--
-- Repository destination:
-- supabase/migrations/20260726_site_counter.sql

begin;

create table if not exists public.site_counter_totals (
  counter_key text primary key,
  total_visits bigint not null default 0 check (total_visits >= 0),
  total_page_views bigint not null default 0 check (total_page_views >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_counter_sessions (
  session_key text primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  page_view_count bigint not null default 1 check (page_view_count >= 1)
);

comment on table public.site_counter_totals is
  'Aggregate TA-14 Exchange visitor and page-view totals.';

comment on table public.site_counter_sessions is
  'Privacy-preserving anonymous session keys used only to prevent counting every page view as a new visit.';

insert into public.site_counter_totals (
  counter_key,
  total_visits,
  total_page_views
)
values (
  'global',
  0,
  0
)
on conflict (counter_key) do nothing;

alter table public.site_counter_totals enable row level security;
alter table public.site_counter_sessions enable row level security;

revoke all on table public.site_counter_totals from anon, authenticated;
revoke all on table public.site_counter_sessions from anon, authenticated;

create or replace function public.record_site_counter_event(
  p_session_key text
)
returns table (
  total_visits bigint,
  total_page_views bigint,
  is_new_visit boolean,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session_key text;
  v_is_new_visit boolean := false;
begin
  v_session_key := nullif(trim(p_session_key), '');

  if v_session_key is null then
    raise exception 'A non-empty session key is required.';
  end if;

  if length(v_session_key) > 200 then
    raise exception 'Session key exceeds maximum length.';
  end if;

  insert into public.site_counter_sessions (
    session_key,
    first_seen_at,
    last_seen_at,
    page_view_count
  )
  values (
    v_session_key,
    now(),
    now(),
    1
  )
  on conflict (session_key) do update
    set last_seen_at = excluded.last_seen_at,
        page_view_count = public.site_counter_sessions.page_view_count + 1
  returning (xmax = 0)
  into v_is_new_visit;

  update public.site_counter_totals
  set total_visits =
        public.site_counter_totals.total_visits
        + case when v_is_new_visit then 1 else 0 end,
      total_page_views =
        public.site_counter_totals.total_page_views + 1,
      updated_at = now()
  where counter_key = 'global';

  return query
  select
    counters.total_visits,
    counters.total_page_views,
    v_is_new_visit,
    counters.updated_at
  from public.site_counter_totals as counters
  where counters.counter_key = 'global';
end;
$$;

comment on function public.record_site_counter_event(text) is
  'Records one page view, increments visits once per anonymous session key, and returns current aggregate totals.';

create or replace function public.get_site_counter_totals()
returns table (
  total_visits bigint,
  total_page_views bigint,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  select
    counters.total_visits,
    counters.total_page_views,
    counters.updated_at
  from public.site_counter_totals as counters
  where counters.counter_key = 'global';
$$;

comment on function public.get_site_counter_totals() is
  'Returns current aggregate TA-14 Exchange site-counter totals without recording a page view.';

revoke all on function public.record_site_counter_event(text)
  from public, anon, authenticated;

revoke all on function public.get_site_counter_totals()
  from public, anon, authenticated;

grant execute on function public.record_site_counter_event(text)
  to service_role;

grant execute on function public.get_site_counter_totals()
  to service_role;

commit;
