create table if not exists public.ta14_private_gcea_events (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  run_id text not null,
  sequence_no integer not null check (sequence_no > 0),
  event_type text not null check (event_type in ('BASELINE','MATERIAL_CHANGE','AUTHORITY_CHALLENGE','BOUNDARY_DETERMINATION','REAUTHORIZATION','RESTORATION','REPLAY_VERIFICATION')),
  asset_id text not null,
  asset_version text not null,
  route_id text not null,
  determination text check (determination is null or determination in ('ALLOW','HOLD','DENY','ESCALATE')),
  standing text check (standing is null or standing in ('CURRENT','CHALLENGED','EXPIRED','REVOKED')),
  receipt_hash text not null,
  replay_id text not null,
  event_payload jsonb not null,
  previous_event_hash text,
  event_hash text not null,
  preserved_at timestamptz not null default now(),
  unique(owner_user_id, run_id, sequence_no),
  unique(owner_user_id, event_hash)
);

alter table public.ta14_private_gcea_events enable row level security;
revoke all on public.ta14_private_gcea_events from anon;
revoke all on public.ta14_private_gcea_events from authenticated;
grant select, insert on public.ta14_private_gcea_events to authenticated;

drop policy if exists ta14_private_gcea_events_owner_select on public.ta14_private_gcea_events;
create policy ta14_private_gcea_events_owner_select on public.ta14_private_gcea_events for select to authenticated using (owner_user_id = auth.uid());

drop policy if exists ta14_private_gcea_events_owner_insert on public.ta14_private_gcea_events;
create policy ta14_private_gcea_events_owner_insert on public.ta14_private_gcea_events for insert to authenticated with check (owner_user_id = auth.uid());

create index if not exists ta14_private_gcea_events_owner_run_idx on public.ta14_private_gcea_events(owner_user_id, run_id, sequence_no);
create index if not exists ta14_private_gcea_events_replay_idx on public.ta14_private_gcea_events(owner_user_id, replay_id);

create or replace function public.ta14_private_gcea_events_immutable()
returns trigger language plpgsql set search_path = public as $$
begin
  raise exception 'TA-14 private GCEA chronology is append-only';
end;
$$;

drop trigger if exists ta14_private_gcea_events_no_update_delete on public.ta14_private_gcea_events;
create trigger ta14_private_gcea_events_no_update_delete before update or delete on public.ta14_private_gcea_events for each row execute function public.ta14_private_gcea_events_immutable();
