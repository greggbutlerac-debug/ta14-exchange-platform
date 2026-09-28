-- TA-14-EIE-ARCH-1.0 Phase 1: Environmental Integrity Recorder evidence windows (s03, s19).
-- NOT APPLIED. Requires owner approval before it is applied to any Supabase project.
--
-- Append-only stores: windows, window entries (the hash chain), window seals.
-- The Recorder writes under the service role only; no anon or authenticated policies exist,
-- so submitters reach these tables only through the Recorder. Nothing is updated or deleted.
-- Hashes are computed by the Recorder (packages/domain/eie); the database preserves them.

create table if not exists public.ta14_eie_evidence_windows (
  window_id text primary key check (window_id ~ '^EIE-WIN-[0-9a-f]{64}$'),
  header_hash text not null unique check (header_hash ~ '^[0-9a-f]{64}$'),
  architecture_fingerprint text not null
    check (architecture_fingerprint = 'f4575172495fec67c29b964465d5f90f23845dbe98d30bd31f4e9281ba075170'),
  recorder_id text not null,
  recorder_mode text not null check (recorder_mode in ('SIMULATION', 'PRODUCTION')),
  purpose text not null check (purpose in ('CONTINUOUS', 'BASELINE_NONINVASIVE', 'PRESSURE_EVIDENCE', 'EXECUTION', 'POST_STABILIZATION', 'POST_VERIFICATION')),
  asset_id text not null,
  opened_at timestamptz not null,
  gate_a_receipt_id text,
  header jsonb not null,
  stored_at timestamptz not null default now()
);

create table if not exists public.ta14_eie_window_entries (
  window_id text not null references public.ta14_eie_evidence_windows(window_id),
  window_seq integer not null check (window_seq >= 1),
  kind text not null check (kind in ('OBSERVATION', 'CORRECTION', 'EVENT', 'REJECTED_SUBMISSION', 'PREMATURE_PRESSURE_ENTRY', 'GATE_A_RECEIPT', 'MATERIAL_CHANGE', 'GAP')),
  recorded_at timestamptz not null,
  prev_entry_hash text not null check (prev_entry_hash ~ '^[0-9a-f]{64}$'),
  entry_hash text not null unique check (entry_hash ~ '^[0-9a-f]{64}$'),
  observation_id text,
  observation_hash text check (observation_hash is null or observation_hash ~ '^[0-9a-f]{64}$'),
  record jsonb not null,
  stored_at timestamptz not null default now(),
  primary key (window_id, window_seq)
);

create table if not exists public.ta14_eie_window_seals (
  window_id text primary key references public.ta14_eie_evidence_windows(window_id),
  close_trigger jsonb not null,
  closed_at timestamptz not null,
  continuity_status text not null check (continuity_status in ('INTACT', 'DEGRADED', 'BROKEN')),
  last_entry_hash text not null check (last_entry_hash ~ '^[0-9a-f]{64}$'),
  seal_hash text not null unique check (seal_hash ~ '^[0-9a-f]{64}$'),
  recorder_key_id text not null,
  recorder_signature text not null,
  seal jsonb not null,
  stored_at timestamptz not null default now()
);

-- An observationId is preserved as admitted evidence at most once (replay protection across windows).
create unique index if not exists ta14_eie_window_entries_observation_id
  on public.ta14_eie_window_entries (observation_id) where observation_id is not null;
-- s02 forward-only: a Gate A receipt opens at most one PRESSURE_EVIDENCE window.
create unique index if not exists ta14_eie_windows_pressure_receipt
  on public.ta14_eie_evidence_windows (gate_a_receipt_id) where purpose = 'PRESSURE_EVIDENCE';
create index if not exists ta14_eie_windows_asset on public.ta14_eie_evidence_windows (asset_id, opened_at);

alter table public.ta14_eie_evidence_windows enable row level security;
alter table public.ta14_eie_window_entries enable row level security;
alter table public.ta14_eie_window_seals enable row level security;

revoke all on table public.ta14_eie_evidence_windows from anon, authenticated;
revoke all on table public.ta14_eie_window_entries from anon, authenticated;
revoke all on table public.ta14_eie_window_seals from anon, authenticated;

-- Preserved evidence cannot be updated or deleted.
create or replace function public.ta14_eie_reject_mutation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  raise exception 'TA14_EIE_APPEND_ONLY: preserved evidence-window records cannot be updated or deleted';
end;
$$;
revoke all on function public.ta14_eie_reject_mutation() from public, anon, authenticated;

create trigger ta14_eie_windows_append_only before update or delete on public.ta14_eie_evidence_windows
for each row execute function public.ta14_eie_reject_mutation();
create trigger ta14_eie_entries_append_only before update or delete on public.ta14_eie_window_entries
for each row execute function public.ta14_eie_reject_mutation();
create trigger ta14_eie_seals_append_only before update or delete on public.ta14_eie_window_seals
for each row execute function public.ta14_eie_reject_mutation();

-- Entries: contiguous sequence, predecessor linkage, and nothing after the seal.
create or replace function public.ta14_eie_entry_linkage()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  expected_prev text;
  last_seq integer;
begin
  if exists (select 1 from public.ta14_eie_window_seals s where s.window_id = new.window_id) then
    raise exception 'TA14_EIE_WINDOW_SEALED: window % is sealed', new.window_id;
  end if;
  select e.window_seq, e.entry_hash into last_seq, expected_prev
    from public.ta14_eie_window_entries e where e.window_id = new.window_id
    order by e.window_seq desc limit 1;
  if last_seq is null then
    select w.header_hash into expected_prev from public.ta14_eie_evidence_windows w where w.window_id = new.window_id;
    last_seq := 0;
  end if;
  if new.window_seq <> last_seq + 1 or new.prev_entry_hash <> expected_prev then
    raise exception 'TA14_EIE_LINEAGE_BROKEN: entry % does not extend window % chain', new.window_seq, new.window_id;
  end if;
  return new;
end;
$$;
revoke all on function public.ta14_eie_entry_linkage() from public, anon, authenticated;

create trigger ta14_eie_entries_linkage before insert on public.ta14_eie_window_entries
for each row execute function public.ta14_eie_entry_linkage();

-- Seals must close on the current chain head.
create or replace function public.ta14_eie_seal_linkage()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  head text;
begin
  select e.entry_hash into head from public.ta14_eie_window_entries e
    where e.window_id = new.window_id order by e.window_seq desc limit 1;
  if head is null then
    select w.header_hash into head from public.ta14_eie_evidence_windows w where w.window_id = new.window_id;
  end if;
  if new.last_entry_hash <> head then
    raise exception 'TA14_EIE_SEAL_MISMATCH: seal does not close on the chain head of window %', new.window_id;
  end if;
  return new;
end;
$$;
revoke all on function public.ta14_eie_seal_linkage() from public, anon, authenticated;

create trigger ta14_eie_seals_linkage before insert on public.ta14_eie_window_seals
for each row execute function public.ta14_eie_seal_linkage();

revoke update, delete, truncate on table public.ta14_eie_evidence_windows from service_role;
revoke update, delete, truncate on table public.ta14_eie_window_entries from service_role;
revoke update, delete, truncate on table public.ta14_eie_window_seals from service_role;
