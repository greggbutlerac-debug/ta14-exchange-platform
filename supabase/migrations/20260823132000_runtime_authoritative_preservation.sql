-- TA-14 Runtime Governance: authoritative append-only preservation ledger
-- Browser storage is explicitly non-authoritative. This table is the durable
-- institutional boundary for preserved runtime governed records.

create table if not exists public.runtime_governed_records (
  record_id text primary key,
  receipt_id uuid not null default gen_random_uuid() unique,
  actor_user_id uuid not null references auth.users(id),
  schema_version text not null,
  visibility text not null,
  determination text not null,
  route_draft_id text not null,
  stored_run_id text not null,
  content_digest text not null,
  record_json jsonb not null,
  persisted_at timestamptz not null default now(),
  constraint runtime_governed_records_digest_format
    check (content_digest ~ '^[0-9a-f]{64}$')
);

create index if not exists runtime_governed_records_actor_idx
  on public.runtime_governed_records(actor_user_id, persisted_at desc);
create index if not exists runtime_governed_records_route_idx
  on public.runtime_governed_records(route_draft_id, persisted_at desc);

alter table public.runtime_governed_records enable row level security;

-- Authenticated actors may retrieve only records they preserved. Service-role
-- operations bypass RLS for institutional verification and controlled review.
drop policy if exists runtime_records_owner_read on public.runtime_governed_records;
create policy runtime_records_owner_read
  on public.runtime_governed_records
  for select
  to authenticated
  using (actor_user_id = auth.uid());

-- No client INSERT/UPDATE/DELETE policies are created. Authoritative writes
-- occur only through the server service-role boundary.

create or replace function public.reject_runtime_governed_record_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'TA14_APPEND_ONLY_RECORD: authoritative runtime governed records cannot be updated or deleted';
end;
$$;

-- Even service-role application code cannot silently mutate/delete rows through
-- ordinary table operations. Corrections must be new records with lineage.
drop trigger if exists runtime_governed_records_no_update on public.runtime_governed_records;
create trigger runtime_governed_records_no_update
before update on public.runtime_governed_records
for each row execute function public.reject_runtime_governed_record_mutation();

drop trigger if exists runtime_governed_records_no_delete on public.runtime_governed_records;
create trigger runtime_governed_records_no_delete
before delete on public.runtime_governed_records
for each row execute function public.reject_runtime_governed_record_mutation();

comment on table public.runtime_governed_records is
  'TA-14 authoritative append-only runtime governed record ledger. Rows are immutable; successor state is represented by new records and lineage, never mutation.';
