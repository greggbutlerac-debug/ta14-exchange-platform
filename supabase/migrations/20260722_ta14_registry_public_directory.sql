-- TA-14 AI Governance Registry
-- Public Registry Directory v1
-- File: 20260722_ta14_registry_public_directory.sql
--
-- Purpose:
--   1. Create the canonical public projection for finalized Registry records.
--   2. Expose only publication-safe fields through a SECURITY DEFINER RPC.
--   3. Prevent drafts, reviewer notes, private evidence, and controlled records
--      from being returned by the public directory.
--
-- Important:
--   Registration is not certification.
--   This migration creates the public publication layer. A later finalization
--   function will write accepted records into this projection transactionally.

begin;

create extension if not exists pgcrypto;

create table if not exists public.ta14_registry_public_records (
  id uuid primary key default gen_random_uuid(),

  -- Permanent Registry identity
  registry_identifier text not null unique,
  source_record_id uuid unique,

  -- Public architecture identity
  governance_name text not null,
  short_name text,
  version text,
  category text,
  steward text,

  -- Public chronology
  claimed_establishment_date date,
  registered_at timestamptz not null default now(),

  -- Public lifecycle state
  status text not null default 'Registered'
    check (
      status in (
        'Registered',
        'Disputed',
        'Superseded',
        'Withdrawn',
        'Archived'
      )
    ),

  -- Publication control
  visibility text not null default 'public'
    check (visibility in ('public', 'private', 'controlled')),
  is_published boolean not null default false,
  published_at timestamptz,

  -- Public description and scope
  summary text,
  domains text[] not null default '{}'::text[],

  -- Public aggregate indicators only
  evidence_count integer not null default 0
    check (evidence_count >= 0),
  dispute_count integer not null default 0
    check (dispute_count >= 0),

  -- Integrity and lineage
  current_version_record_id uuid,
  supersedes_registry_identifier text,
  record_digest_sha256 text,
  finalized_by uuid,
  finalized_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint ta14_registry_public_identifier_format
    check (registry_identifier ~ '^TA-14-AIGR-[0-9]{4,}$'),

  constraint ta14_registry_public_digest_format
    check (
      record_digest_sha256 is null
      or record_digest_sha256 ~ '^[a-fA-F0-9]{64}$'
    ),

  constraint ta14_registry_publication_state
    check (
      (
        is_published = false
        and published_at is null
      )
      or
      (
        is_published = true
        and visibility = 'public'
        and published_at is not null
        and finalized_at is not null
      )
    )
);

comment on table public.ta14_registry_public_records is
  'Canonical publication-safe projection of finalized TA-14 AI Governance Registry records. Registration is not certification.';

comment on column public.ta14_registry_public_records.source_record_id is
  'Identifier of the canonical internal Registry record from which this public projection was finalized.';

comment on column public.ta14_registry_public_records.record_digest_sha256 is
  'Optional SHA-256 digest of the accepted Registry version used during finalization. The digest preserves integrity; it does not establish truth.';

create index if not exists ta14_registry_public_records_published_idx
  on public.ta14_registry_public_records (is_published, visibility, registered_at desc);

create index if not exists ta14_registry_public_records_status_idx
  on public.ta14_registry_public_records (status, registered_at desc);

create index if not exists ta14_registry_public_records_governance_name_idx
  on public.ta14_registry_public_records using gin (to_tsvector('english', governance_name));

create index if not exists ta14_registry_public_records_domains_idx
  on public.ta14_registry_public_records using gin (domains);

create or replace function public.ta14_registry_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists ta14_registry_public_records_set_updated_at
  on public.ta14_registry_public_records;

create trigger ta14_registry_public_records_set_updated_at
before update on public.ta14_registry_public_records
for each row
execute function public.ta14_registry_set_updated_at();

alter table public.ta14_registry_public_records enable row level security;

drop policy if exists "Public may read published Registry records"
  on public.ta14_registry_public_records;

create policy "Public may read published Registry records"
on public.ta14_registry_public_records
for select
to anon, authenticated
using (
  is_published = true
  and visibility = 'public'
  and status in (
    'Registered',
    'Disputed',
    'Superseded',
    'Withdrawn',
    'Archived'
  )
);

-- Direct writes are intentionally not granted to anon or authenticated users.
-- Finalization must occur through a controlled server-side function or
-- privileged administrative transaction.

revoke all on table public.ta14_registry_public_records from anon;
revoke insert, update, delete, truncate, references, trigger
  on table public.ta14_registry_public_records from authenticated;

grant select on table public.ta14_registry_public_records to anon, authenticated;

create or replace function public.ta14_registry_public_directory_v1()
returns table (
  id uuid,
  registry_identifier text,
  governance_name text,
  short_name text,
  version text,
  category text,
  steward text,
  claimed_establishment_date date,
  registered_at timestamptz,
  status text,
  summary text,
  domains text[],
  evidence_count integer,
  dispute_count integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    record.id,
    record.registry_identifier,
    record.governance_name,
    record.short_name,
    record.version,
    record.category,
    record.steward,
    record.claimed_establishment_date,
    record.registered_at,
    record.status,
    record.summary,
    record.domains,
    record.evidence_count,
    record.dispute_count
  from public.ta14_registry_public_records as record
  where record.is_published = true
    and record.visibility = 'public'
    and record.status in (
      'Registered',
      'Disputed',
      'Superseded',
      'Withdrawn',
      'Archived'
    )
  order by record.registered_at desc, record.registry_identifier asc;
$$;

comment on function public.ta14_registry_public_directory_v1() is
  'Returns publication-safe finalized Registry records for the public TA-14 AI Governance Registry directory.';

revoke all on function public.ta14_registry_public_directory_v1() from public;
grant execute on function public.ta14_registry_public_directory_v1()
  to anon, authenticated;

-- Public detail lookup used by the permanent Registry record page.
create or replace function public.ta14_registry_public_record_v1(
  requested_registry_identifier text
)
returns table (
  id uuid,
  registry_identifier text,
  governance_name text,
  short_name text,
  version text,
  category text,
  steward text,
  claimed_establishment_date date,
  registered_at timestamptz,
  status text,
  summary text,
  domains text[],
  evidence_count integer,
  dispute_count integer,
  supersedes_registry_identifier text,
  record_digest_sha256 text,
  published_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    record.id,
    record.registry_identifier,
    record.governance_name,
    record.short_name,
    record.version,
    record.category,
    record.steward,
    record.claimed_establishment_date,
    record.registered_at,
    record.status,
    record.summary,
    record.domains,
    record.evidence_count,
    record.dispute_count,
    record.supersedes_registry_identifier,
    record.record_digest_sha256,
    record.published_at
  from public.ta14_registry_public_records as record
  where record.registry_identifier = requested_registry_identifier
    and record.is_published = true
    and record.visibility = 'public'
    and record.status in (
      'Registered',
      'Disputed',
      'Superseded',
      'Withdrawn',
      'Archived'
    )
  limit 1;
$$;

comment on function public.ta14_registry_public_record_v1(text) is
  'Returns one publication-safe finalized TA-14 AI Governance Registry record by permanent Registry identifier.';

revoke all on function public.ta14_registry_public_record_v1(text) from public;
grant execute on function public.ta14_registry_public_record_v1(text)
  to anon, authenticated;

commit;
