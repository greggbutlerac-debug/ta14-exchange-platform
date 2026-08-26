-- TA-14 Consequence Examination Engine
-- Findings -> seal -> receipt -> chronology.
-- Registry identity is referenced only through bindings already carried by the examination run.
-- This migration does not modify Registry submission/readiness/finalization architecture.

create table if not exists public.consequence_examination_findings (
  id uuid primary key default gen_random_uuid(),
  finding_id text not null unique,
  run_id text not null unique references public.consequence_examination_runs(run_id) on delete restrict,
  determination text not null check (determination in ('SUPPORTED','PARTIALLY_SUPPORTED','UNSUPPORTED','INDETERMINATE')),
  finding_body jsonb not null,
  finding_sha256 text not null check (finding_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  issuer_user_id uuid not null references auth.users(id) on delete restrict,
  issuer_name text not null,
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.consequence_examination_seals (
  id uuid primary key default gen_random_uuid(),
  seal_id text not null unique,
  run_id text not null unique references public.consequence_examination_runs(run_id) on delete restrict,
  finding_id text not null unique references public.consequence_examination_findings(finding_id) on delete restrict,
  run_sha256 text not null check (run_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  finding_sha256 text not null check (finding_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  seal_manifest jsonb not null,
  seal_sha256 text not null unique check (seal_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  sealed_by_user_id uuid not null references auth.users(id) on delete restrict,
  sealed_by_name text not null,
  sealed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.consequence_examination_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_id text not null unique,
  run_id text not null unique references public.consequence_examination_runs(run_id) on delete restrict,
  seal_id text not null unique references public.consequence_examination_seals(seal_id) on delete restrict,
  receipt_payload jsonb not null,
  receipt_sha256 text not null unique check (receipt_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  publication_state text not null default 'PUBLIC' check (publication_state in ('PUBLIC','WITHHELD')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  check (publication_state <> 'PUBLIC' or published_at is not null)
);

create table if not exists public.consequence_examination_chronology (
  id bigint generated always as identity primary key,
  run_id text not null references public.consequence_examination_runs(run_id) on delete restrict,
  sequence_no integer not null check (sequence_no > 0),
  event_kind text not null check (event_kind in ('TECHNICAL_FREEZE','RUN_OPENED','S0','S1','S2','S3','S4','S5','S6','S7','FINDING','SEALED','RECEIPT_PUBLISHED','VOIDED')),
  object_id text not null,
  object_sha256 text check (object_sha256 is null or object_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  event_payload jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique(run_id, sequence_no)
);

create index if not exists consequence_examination_findings_run_idx on public.consequence_examination_findings(run_id);
create index if not exists consequence_examination_seals_run_idx on public.consequence_examination_seals(run_id);
create index if not exists consequence_examination_receipts_run_idx on public.consequence_examination_receipts(run_id);
create index if not exists consequence_examination_chronology_run_idx on public.consequence_examination_chronology(run_id, sequence_no);

alter table public.consequence_examination_findings enable row level security;
alter table public.consequence_examination_seals enable row level security;
alter table public.consequence_examination_receipts enable row level security;
alter table public.consequence_examination_chronology enable row level security;

grant select on public.consequence_examination_findings to anon, authenticated;
grant select on public.consequence_examination_seals to anon, authenticated;
grant select on public.consequence_examination_receipts to anon, authenticated;
grant select on public.consequence_examination_chronology to anon, authenticated;
revoke insert, update, delete, truncate on public.consequence_examination_findings from anon, authenticated;
revoke insert, update, delete, truncate on public.consequence_examination_seals from anon, authenticated;
revoke insert, update, delete, truncate on public.consequence_examination_receipts from anon, authenticated;
revoke insert, update, delete, truncate on public.consequence_examination_chronology from anon, authenticated;

create policy public_read_consequence_findings on public.consequence_examination_findings for select to anon, authenticated using (true);
create policy public_read_consequence_seals on public.consequence_examination_seals for select to anon, authenticated using (true);
create policy public_read_public_consequence_receipts on public.consequence_examination_receipts for select to anon, authenticated using (publication_state = 'PUBLIC');
create policy public_read_consequence_chronology on public.consequence_examination_chronology for select to anon, authenticated using (true);

create or replace function public.validate_consequence_finding()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  run_status text;
  run_determination text;
  run_hash text;
begin
  select r.status, r.final_determination, r.run_sha256
    into run_status, run_determination, run_hash
  from public.consequence_examination_runs r
  where r.run_id = new.run_id;

  if run_status is distinct from 'SEALED' then
    raise exception 'Finding requires a sealed examination run';
  end if;
  if run_hash is null then
    raise exception 'Finding requires the sealed run hash';
  end if;
  if new.determination is distinct from run_determination then
    raise exception 'Finding determination must equal the sealed run final determination';
  end if;
  return new;
end;
$$;
revoke all on function public.validate_consequence_finding() from public, anon, authenticated;

create trigger validate_consequence_finding
before insert on public.consequence_examination_findings
for each row execute function public.validate_consequence_finding();

create or replace function public.validate_consequence_seal()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  run_status text;
  authoritative_run_hash text;
  authoritative_finding_run text;
  authoritative_finding_hash text;
begin
  select r.status, r.run_sha256 into run_status, authoritative_run_hash
  from public.consequence_examination_runs r where r.run_id = new.run_id;
  if run_status is distinct from 'SEALED' then
    raise exception 'Seal requires a sealed examination run';
  end if;
  if new.run_sha256 is distinct from authoritative_run_hash then
    raise exception 'Seal run hash must equal the authoritative sealed run hash';
  end if;
  select f.run_id, f.finding_sha256 into authoritative_finding_run, authoritative_finding_hash
  from public.consequence_examination_findings f where f.finding_id = new.finding_id;
  if authoritative_finding_run is distinct from new.run_id then
    raise exception 'Seal finding must belong to the same examination run';
  end if;
  if new.finding_sha256 is distinct from authoritative_finding_hash then
    raise exception 'Seal finding hash must equal the authoritative finding hash';
  end if;
  return new;
end;
$$;
revoke all on function public.validate_consequence_seal() from public, anon, authenticated;

create trigger validate_consequence_seal
before insert on public.consequence_examination_seals
for each row execute function public.validate_consequence_seal();

create or replace function public.validate_consequence_receipt()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  authoritative_seal_run text;
begin
  select s.run_id into authoritative_seal_run
  from public.consequence_examination_seals s where s.seal_id = new.seal_id;
  if authoritative_seal_run is distinct from new.run_id then
    raise exception 'Receipt seal must belong to the same examination run';
  end if;
  return new;
end;
$$;
revoke all on function public.validate_consequence_receipt() from public, anon, authenticated;

create trigger validate_consequence_receipt
before insert on public.consequence_examination_receipts
for each row execute function public.validate_consequence_receipt();

create or replace function public.prevent_consequence_terminal_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Consequence examination terminal records are append-only and cannot be updated or deleted';
end;
$$;
revoke all on function public.prevent_consequence_terminal_mutation() from public, anon, authenticated;

create trigger prevent_consequence_findings_mutation before update or delete on public.consequence_examination_findings for each row execute function public.prevent_consequence_terminal_mutation();
create trigger prevent_consequence_seals_mutation before update or delete on public.consequence_examination_seals for each row execute function public.prevent_consequence_terminal_mutation();
create trigger prevent_consequence_receipts_mutation before update or delete on public.consequence_examination_receipts for each row execute function public.prevent_consequence_terminal_mutation();
create trigger prevent_consequence_chronology_mutation before update or delete on public.consequence_examination_chronology for each row execute function public.prevent_consequence_terminal_mutation();
