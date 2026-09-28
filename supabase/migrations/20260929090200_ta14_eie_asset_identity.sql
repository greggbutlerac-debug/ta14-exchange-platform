-- TA-14 EIE Tier 1 pilot: governed asset identity events and raw evidence storage (Phase 3, ruling 4).
-- ISOLATED PILOT PROJECT ONLY. NOT APPLIED. Requires owner approval.
--
-- Append-only events, attributable to the authenticated account stamped by the server. The original
-- transcriber and the verifier of a transcription must be different accounts (enforced here as well as in
-- the domain). Nameplate photos and calibration certificates are stored content-addressed (path = SHA-256)
-- in a private bucket; the hash is recorded in the event.

create table if not exists public.ta14_eie_asset_events (
  event_seq bigserial primary key,
  asset_id text not null,
  event_type text not null check (event_type in ('ASSET_REGISTERED', 'COMPONENT_REGISTERED', 'NAMEPLATE_EVIDENCE', 'TRANSCRIPTION', 'TRANSCRIPTION_VERIFICATION', 'COMPONENT_REPLACED')),
  actor_account_id uuid not null references auth.users(id),
  event jsonb not null,
  recorded_at timestamptz not null default now(),
  check (event->>'assetId' = asset_id and event->>'type' = event_type and event->'by'->>'accountId' = actor_account_id::text)
);
create index if not exists ta14_eie_asset_events_asset on public.ta14_eie_asset_events (asset_id, event_seq);

create or replace function public.ta14_eie_transcription_independence()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  transcriber uuid;
begin
  if new.event_type = 'TRANSCRIPTION_VERIFICATION' then
    select e.actor_account_id into transcriber from public.ta14_eie_asset_events e
      where e.event_type = 'TRANSCRIPTION' and e.event->>'transcriptionId' = new.event->>'transcriptionId';
    if transcriber is null then
      raise exception 'TA14_EIE_TRANSCRIPTION_UNKNOWN: %', new.event->>'transcriptionId';
    end if;
    if transcriber = new.actor_account_id then
      raise exception 'TA14_EIE_SELF_VERIFICATION: the transcriber cannot verify their own transcription';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.ta14_eie_transcription_independence() from public, anon, authenticated;
create trigger ta14_eie_asset_events_independence before insert on public.ta14_eie_asset_events
for each row execute function public.ta14_eie_transcription_independence();

create trigger ta14_eie_asset_events_append_only before update or delete on public.ta14_eie_asset_events
for each row execute function public.ta14_eie_pilot_reject_mutation();

alter table public.ta14_eie_asset_events enable row level security;
revoke all on table public.ta14_eie_asset_events from anon, authenticated;
revoke update, delete, truncate on table public.ta14_eie_asset_events from service_role;

-- Private, content-addressed raw evidence (nameplate photos, calibration certificates). No public access,
-- no anon/authenticated policies: the server writes with the service role and never overwrites (upsert=false).
insert into storage.buckets (id, name, public) values ('eie-pilot-evidence', 'eie-pilot-evidence', false)
on conflict (id) do nothing;
