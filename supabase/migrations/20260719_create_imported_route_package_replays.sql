create extension if not exists pgcrypto;

create table if not exists public.exchange_imported_route_package_replays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_type text not null,
  package_version text not null,
  source_receipt_id uuid not null,
  source_route_id text not null,
  replay_status text not null check (
    replay_status in (
      'VERIFIED',
      'MISMATCH',
      'INCOMPLETE',
      'UNVERIFIABLE'
    )
  ),
  recorded_sha256 text not null,
  calculated_sha256 text,
  hash_matches boolean,
  artifact_receipt_reference_count integer not null default 0 check (
    artifact_receipt_reference_count >= 0
  ),
  failures jsonb not null default '[]'::jsonb,
  imported_package jsonb not null,
  replay_result jsonb not null,
  replayed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists
  exchange_imported_route_package_replays_user_created_idx
on public.exchange_imported_route_package_replays (
  user_id,
  created_at desc
);

create index if not exists
  exchange_imported_route_package_replays_source_receipt_idx
on public.exchange_imported_route_package_replays (
  source_receipt_id,
  created_at desc
);

alter table public.exchange_imported_route_package_replays
  enable row level security;

drop policy if exists
  "Users may read their imported route replay receipts"
on public.exchange_imported_route_package_replays;

create policy
  "Users may read their imported route replay receipts"
on public.exchange_imported_route_package_replays
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists
  "Users may create imported route replay receipts"
on public.exchange_imported_route_package_replays;

create policy
  "Users may create imported route replay receipts"
on public.exchange_imported_route_package_replays
for insert
to authenticated
with check (auth.uid() = user_id);

revoke all on public.exchange_imported_route_package_replays
from anon;

grant select, insert
on public.exchange_imported_route_package_replays
to authenticated;
