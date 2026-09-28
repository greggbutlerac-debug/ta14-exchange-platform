-- TA-14 EIE Tier 1 pilot: documented instrument register (Phase 3).
-- ISOLATED PILOT PROJECT ONLY. NOT APPLIED. Requires owner approval.
--
-- Append-only, attributable events. Calibration records are DOCUMENTED (certificate reference plus the
-- SHA-256 of the stored certificate), never VERIFIED by this system.

create table if not exists public.ta14_eie_instrument_events (
  event_seq bigserial primary key,
  instrument_id text not null,
  event_type text not null check (event_type in ('INSTRUMENT_REGISTERED', 'CALIBRATION_DOCUMENTED')),
  actor_account_id uuid not null references auth.users(id),
  event jsonb not null,
  recorded_at timestamptz not null default now(),
  check (event->>'instrumentId' = instrument_id and event->>'type' = event_type and event->'by'->>'accountId' = actor_account_id::text),
  check (event_type <> 'CALIBRATION_DOCUMENTED' or event->>'certificateSha256' ~ '^[0-9a-f]{64}$')
);
create index if not exists ta14_eie_instrument_events_instrument on public.ta14_eie_instrument_events (instrument_id, event_seq);

create trigger ta14_eie_instrument_events_append_only before update or delete on public.ta14_eie_instrument_events
for each row execute function public.ta14_eie_pilot_reject_mutation();

alter table public.ta14_eie_instrument_events enable row level security;
revoke all on table public.ta14_eie_instrument_events from anon, authenticated;
revoke update, delete, truncate on table public.ta14_eie_instrument_events from service_role;
