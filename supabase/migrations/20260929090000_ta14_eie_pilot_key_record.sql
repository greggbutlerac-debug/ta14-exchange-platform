-- TA-14 EIE Tier 1 pilot: pilot role roster and Recorder Key Record (Phase 3).
-- ISOLATED PILOT PROJECT ONLY. NOT APPLIED. Requires owner approval and an identified pilot project reference.
--
-- Roles are recorded, not inferred: an account acts as TA-14 GOVERNANCE OWNER or TA-14 RECORD INTEGRITY
-- CUSTODIAN only if appointed here (by the owner, through the SQL editor under the service role).
-- The Key Record is append-only. Custodian events (register, activate, retire, revoke) and owner approval
-- are written through the runbook; the application only reads. Key material never enters this database:
-- only public verification material and provider resource identity.

create table if not exists public.ta14_eie_pilot_role_assignments (
  assignment_seq bigserial primary key,
  role text not null check (role in ('TA-14 GOVERNANCE OWNER', 'TA-14 RECORD INTEGRITY CUSTODIAN')),
  account_id uuid not null references auth.users(id),
  appointed_by text not null,
  appointed_at timestamptz not null default now(),
  unique (role, account_id)
);

create table if not exists public.ta14_eie_recorder_key_events (
  event_seq bigserial primary key,
  key_id text not null,
  event_type text not null check (event_type in ('REGISTERED', 'APPROVED', 'ACTIVATED', 'RETIRED', 'REVOKED')),
  actor_role text not null check (actor_role in ('TA-14 GOVERNANCE OWNER', 'TA-14 RECORD INTEGRITY CUSTODIAN')),
  actor_account_id uuid not null,
  event jsonb not null,
  recorded_at timestamptz not null default now(),
  check (event->>'keyId' = key_id and event->>'type' = event_type and event->'by'->>'role' = actor_role and event->'by'->>'accountId' = actor_account_id::text),
  -- SOFTWARE is never represented as HSM: the protection level is carried explicitly on registration.
  check (event_type <> 'REGISTERED' or (event->'registration'->>'algorithm' = 'ED25519' and event->'registration'->>'protectionLevel' is not null))
);
create index if not exists ta14_eie_recorder_key_events_key on public.ta14_eie_recorder_key_events (key_id, event_seq);

-- The acting account must hold the role it acts in, and approval must come from the owner role.
create or replace function public.ta14_eie_key_event_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.ta14_eie_pilot_role_assignments r where r.role = new.actor_role and r.account_id = new.actor_account_id) then
    raise exception 'TA14_EIE_ROLE_NOT_ASSIGNED: % is not appointed as %', new.actor_account_id, new.actor_role;
  end if;
  if (new.event_type = 'APPROVED') <> (new.actor_role = 'TA-14 GOVERNANCE OWNER') then
    raise exception 'TA14_EIE_KEY_EVENT_ROLE: % must be recorded by the correct role', new.event_type;
  end if;
  return new;
end;
$$;
revoke all on function public.ta14_eie_key_event_role() from public, anon, authenticated;
create trigger ta14_eie_key_events_role before insert on public.ta14_eie_recorder_key_events
for each row execute function public.ta14_eie_key_event_role();

create or replace function public.ta14_eie_pilot_reject_mutation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  raise exception 'TA14_EIE_APPEND_ONLY: pilot governance records cannot be updated or deleted';
end;
$$;
revoke all on function public.ta14_eie_pilot_reject_mutation() from public, anon, authenticated;

create trigger ta14_eie_role_assignments_append_only before update or delete on public.ta14_eie_pilot_role_assignments
for each row execute function public.ta14_eie_pilot_reject_mutation();
create trigger ta14_eie_key_events_append_only before update or delete on public.ta14_eie_recorder_key_events
for each row execute function public.ta14_eie_pilot_reject_mutation();

alter table public.ta14_eie_pilot_role_assignments enable row level security;
alter table public.ta14_eie_recorder_key_events enable row level security;
revoke all on table public.ta14_eie_pilot_role_assignments from anon, authenticated;
revoke all on table public.ta14_eie_recorder_key_events from anon, authenticated;
revoke update, delete, truncate on table public.ta14_eie_pilot_role_assignments from service_role;
revoke update, delete, truncate on table public.ta14_eie_recorder_key_events from service_role;
