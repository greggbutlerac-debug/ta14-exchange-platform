-- TA-14 Exchange public site activity foundation
-- Creates a durable aggregate counter that is publicly readable but cannot
-- be modified directly by anonymous or authenticated browser clients.

begin;

create table if not exists public.ta14_site_activity (
  id smallint primary key default 1,
  total_visitors bigint not null default 0,
  total_page_views bigint not null default 0,
  first_recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint ta14_site_activity_singleton_check check (id = 1),
  constraint ta14_site_activity_total_visitors_check check (total_visitors >= 0),
  constraint ta14_site_activity_total_page_views_check check (total_page_views >= 0)
);

insert into public.ta14_site_activity (
  id,
  total_visitors,
  total_page_views
)
values (1, 0, 0)
on conflict (id) do nothing;

alter table public.ta14_site_activity enable row level security;

drop policy if exists "Public can read TA-14 site activity"
  on public.ta14_site_activity;

create policy "Public can read TA-14 site activity"
  on public.ta14_site_activity
  for select
  to anon, authenticated
  using (true);

grant select on table public.ta14_site_activity to anon, authenticated;

revoke insert, update, delete, truncate, references, trigger
  on table public.ta14_site_activity
  from anon, authenticated;

create or replace function public.increment_ta14_site_activity(
  p_new_visitor boolean default false
)
returns public.ta14_site_activity
language plpgsql
security definer
set search_path = public
as $$
declare
  v_activity public.ta14_site_activity;
begin
  update public.ta14_site_activity
  set
    total_visitors = total_visitors + case when p_new_visitor then 1 else 0 end,
    total_page_views = total_page_views + 1,
    updated_at = now()
  where id = 1
  returning * into v_activity;

  if v_activity.id is null then
    raise exception 'TA-14 site activity record is unavailable';
  end if;

  return v_activity;
end;
$$;

revoke all on function public.increment_ta14_site_activity(boolean)
  from public, anon, authenticated;

grant execute on function public.increment_ta14_site_activity(boolean)
  to service_role;

comment on table public.ta14_site_activity is
  'Public aggregate activity totals for the TA-14 AI Governance Exchange.';

comment on function public.increment_ta14_site_activity(boolean) is
  'Atomically increments page views and optionally visitors. Executable only by service_role.';

commit;
