-- TA-14 Exchange Platform
-- Creates authenticated, account-owned route storage in Supabase.

create extension if not exists pgcrypto;

create table if not exists public.exchange_routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  route_id text not null,
  route_name text not null,
  domain text not null,
  owner text not null,
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'READY_FOR_TEST', 'HOLD', 'ALLOW', 'DENY', 'ESCALATE')),
  version integer not null default 1 check (version >= 1),
  route_data jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, route_id)
);

create index if not exists exchange_routes_user_id_idx
  on public.exchange_routes (user_id);

create index if not exists exchange_routes_user_updated_idx
  on public.exchange_routes (user_id, updated_at desc);

create or replace function public.set_exchange_route_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_exchange_routes_updated_at
  on public.exchange_routes;

create trigger set_exchange_routes_updated_at
before update on public.exchange_routes
for each row
execute function public.set_exchange_route_updated_at();

alter table public.exchange_routes enable row level security;

drop policy if exists "Users can view their own exchange routes"
  on public.exchange_routes;

create policy "Users can view their own exchange routes"
on public.exchange_routes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own exchange routes"
  on public.exchange_routes;

create policy "Users can create their own exchange routes"
on public.exchange_routes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own exchange routes"
  on public.exchange_routes;

create policy "Users can update their own exchange routes"
on public.exchange_routes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own exchange routes"
  on public.exchange_routes;

create policy "Users can delete their own exchange routes"
on public.exchange_routes
for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete
on public.exchange_routes
to authenticated;
