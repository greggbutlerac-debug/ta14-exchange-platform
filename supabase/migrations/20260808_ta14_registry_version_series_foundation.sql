-- TA-14 AI Governance Registry
-- Governed Version Series Foundation v1
-- File: 20260808_ta14_registry_version_series_foundation.sql
--
-- Purpose:
--   1. Preserve continuity across independently registered governance versions.
--   2. Keep each TA-14-AIGR record independently attributable and unchanged.
--   3. Provide a public, inspectable version-series projection without carrying
--      findings, PASS states, or evidentiary conclusions from one version to another.
--   4. Establish Harmonic Constitutional Runtime version series
--      TA-14-AIVS-000001 for TA-14-AIGR-000008 -> TA-14-AIGR-000010.
--
-- Boundary:
--   Version-series membership records lineage only. It does not imply
--   certification, equivalence, inheritance of findings, supersession, or
--   evidentiary carry-forward unless separately and explicitly recorded.

begin;

create extension if not exists pgcrypto;

create sequence if not exists public.ta14_registry_version_series_sequence
  as bigint
  start with 1
  increment by 1
  minvalue 1
  no maxvalue
  cache 1;

comment on sequence public.ta14_registry_version_series_sequence is
  'Monotonic source for TA-14 AI Governance Version Series identifiers. Sequence gaps do not invalidate issued identifiers.';

revoke all on sequence public.ta14_registry_version_series_sequence from public;
revoke all on sequence public.ta14_registry_version_series_sequence from anon;
revoke all on sequence public.ta14_registry_version_series_sequence from authenticated;

create table if not exists public.ta14_registry_version_series (
  id uuid primary key default gen_random_uuid(),
  series_identifier text not null unique,
  governance_name text not null,
  short_name text,
  category text,
  steward text,
  status text not null default 'active'
    check (status in ('active', 'closed', 'archived')),
  visibility text not null default 'public'
    check (visibility in ('public', 'private', 'controlled')),
  is_published boolean not null default true,
  series_summary text,
  boundary_statement text not null default
    'Version-series membership preserves lineage only. Each Registry version stands on its own declarations, evidence, review, and findings.',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_registry_version_series_identifier_format
    check (series_identifier ~ '^TA-14-AIVS-[0-9]{6,}$'),

  constraint ta14_registry_version_series_publication_state
    check (
      is_published = false
      or visibility = 'public'
    )
);

comment on table public.ta14_registry_version_series is
  'Governed lineage container connecting independently registered TA-14 AI Governance Registry versions without merging their declarations, evidence, or findings.';

create table if not exists public.ta14_registry_version_series_members (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null
    references public.ta14_registry_version_series(id)
    on delete restrict,
  registry_record_id uuid not null
    references public.ta14_registry_public_records(id)
    on delete restrict,
  registry_identifier text not null,
  version_label text,
  ordinal integer not null check (ordinal > 0),
  relationship_type text not null
    check (relationship_type in ('baseline', 'continuation', 'fork', 'supersession')),
  previous_registry_identifier text,
  lineage_note text,
  findings_inherited boolean not null default false,
  evidence_inherited boolean not null default false,
  added_at timestamptz not null default timezone('utc', now()),

  constraint ta14_registry_version_series_member_identifier_format
    check (registry_identifier ~ '^TA-14-AIGR-[0-9]{4,}$'),

  constraint ta14_registry_version_series_member_previous_format
    check (
      previous_registry_identifier is null
      or previous_registry_identifier ~ '^TA-14-AIGR-[0-9]{4,}$'
    ),

  constraint ta14_registry_version_series_one_record_once
    unique (registry_identifier),

  constraint ta14_registry_version_series_unique_ordinal
    unique (series_id, ordinal),

  constraint ta14_registry_version_series_unique_record
    unique (series_id, registry_record_id)
);

comment on table public.ta14_registry_version_series_members is
  'Ordered membership of independently registered governance records within a TA-14 version series. Membership does not carry forward findings or evidence by default.';

comment on column public.ta14_registry_version_series_members.findings_inherited is
  'Must remain false unless a separately governed process explicitly permits inheritance. Default version-series behavior is no finding inheritance.';

comment on column public.ta14_registry_version_series_members.evidence_inherited is
  'Must remain false unless a separately governed process explicitly permits inheritance. Default version-series behavior is no evidence inheritance.';

create index if not exists ta14_registry_version_series_name_idx
  on public.ta14_registry_version_series (governance_name);

create index if not exists ta14_registry_version_series_members_series_idx
  on public.ta14_registry_version_series_members (series_id, ordinal);

create index if not exists ta14_registry_version_series_members_registry_idx
  on public.ta14_registry_version_series_members (registry_identifier);

create or replace function public.ta14_registry_version_series_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists ta14_registry_version_series_set_updated_at
  on public.ta14_registry_version_series;

create trigger ta14_registry_version_series_set_updated_at
before update on public.ta14_registry_version_series
for each row
execute function public.ta14_registry_version_series_set_updated_at();

alter table public.ta14_registry_version_series enable row level security;
alter table public.ta14_registry_version_series_members enable row level security;

drop policy if exists "Public may read published Registry version series"
  on public.ta14_registry_version_series;

create policy "Public may read published Registry version series"
on public.ta14_registry_version_series
for select
to anon, authenticated
using (
  is_published = true
  and visibility = 'public'
  and status in ('active', 'closed', 'archived')
);

drop policy if exists "Public may read published Registry version series members"
  on public.ta14_registry_version_series_members;

create policy "Public may read published Registry version series members"
on public.ta14_registry_version_series_members
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.ta14_registry_version_series series
    where series.id = series_id
      and series.is_published = true
      and series.visibility = 'public'
  )
  and exists (
    select 1
    from public.ta14_registry_public_records record
    where record.id = registry_record_id
      and record.is_published = true
      and record.visibility = 'public'
  )
);

revoke all on table public.ta14_registry_version_series from anon, authenticated;
revoke all on table public.ta14_registry_version_series_members from anon, authenticated;

grant select on table public.ta14_registry_version_series to anon, authenticated;
grant select on table public.ta14_registry_version_series_members to anon, authenticated;

-- -------------------------------------------------------------------------
-- Public lookup: resolve the version series attached to a Registry record.
-- -------------------------------------------------------------------------
create or replace function public.ta14_registry_public_version_series_for_record_v1(
  requested_registry_identifier text
)
returns table (
  series_identifier text,
  governance_name text,
  short_name text,
  category text,
  steward text,
  status text,
  series_summary text,
  boundary_statement text,
  member_count integer,
  current_member_ordinal integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    series.series_identifier,
    series.governance_name,
    series.short_name,
    series.category,
    series.steward,
    series.status,
    series.series_summary,
    series.boundary_statement,
    (
      select count(*)::integer
      from public.ta14_registry_version_series_members all_members
      join public.ta14_registry_public_records public_record
        on public_record.id = all_members.registry_record_id
      where all_members.series_id = series.id
        and public_record.is_published = true
        and public_record.visibility = 'public'
    ) as member_count,
    member.ordinal as current_member_ordinal
  from public.ta14_registry_version_series_members member
  join public.ta14_registry_version_series series
    on series.id = member.series_id
  join public.ta14_registry_public_records record
    on record.id = member.registry_record_id
  where member.registry_identifier = requested_registry_identifier
    and record.registry_identifier = requested_registry_identifier
    and record.is_published = true
    and record.visibility = 'public'
    and series.is_published = true
    and series.visibility = 'public'
  limit 1;
$$;

comment on function public.ta14_registry_public_version_series_for_record_v1(text) is
  'Returns the publication-safe TA-14 AI Governance Version Series associated with a public Registry record.';

revoke all on function public.ta14_registry_public_version_series_for_record_v1(text) from public;
grant execute on function public.ta14_registry_public_version_series_for_record_v1(text)
  to anon, authenticated;

-- -------------------------------------------------------------------------
-- Public lookup: ordered members of one version series.
-- -------------------------------------------------------------------------
create or replace function public.ta14_registry_public_version_series_members_v1(
  requested_series_identifier text
)
returns table (
  series_identifier text,
  registry_identifier text,
  governance_name text,
  version text,
  registry_status text,
  registered_at timestamptz,
  ordinal integer,
  relationship_type text,
  previous_registry_identifier text,
  lineage_note text,
  findings_inherited boolean,
  evidence_inherited boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    series.series_identifier,
    member.registry_identifier,
    record.governance_name,
    record.version,
    record.status,
    record.registered_at,
    member.ordinal,
    member.relationship_type,
    member.previous_registry_identifier,
    member.lineage_note,
    member.findings_inherited,
    member.evidence_inherited
  from public.ta14_registry_version_series series
  join public.ta14_registry_version_series_members member
    on member.series_id = series.id
  join public.ta14_registry_public_records record
    on record.id = member.registry_record_id
  where series.series_identifier = requested_series_identifier
    and series.is_published = true
    and series.visibility = 'public'
    and record.is_published = true
    and record.visibility = 'public'
  order by member.ordinal asc;
$$;

comment on function public.ta14_registry_public_version_series_members_v1(text) is
  'Returns publication-safe ordered Registry members for one TA-14 AI Governance Version Series. Findings and evidence do not carry forward by default.';

revoke all on function public.ta14_registry_public_version_series_members_v1(text) from public;
grant execute on function public.ta14_registry_public_version_series_members_v1(text)
  to anon, authenticated;

-- -------------------------------------------------------------------------
-- Establish Harmonic Constitutional Runtime Version Series 000001.
-- This records continuity only. It does not alter either Registry record.
-- -------------------------------------------------------------------------
do $$
declare
  harmonic_series_id uuid;
  v1_record public.ta14_registry_public_records%rowtype;
  v2_record public.ta14_registry_public_records%rowtype;
begin
  select *
  into v1_record
  from public.ta14_registry_public_records
  where registry_identifier = 'TA-14-AIGR-000008'
  limit 1;

  select *
  into v2_record
  from public.ta14_registry_public_records
  where registry_identifier = 'TA-14-AIGR-000010'
  limit 1;

  if v1_record.id is null or v2_record.id is null then
    raise notice 'Harmonic version-series seed skipped because TA-14-AIGR-000008 and/or TA-14-AIGR-000010 is not present in this environment.';
    return;
  end if;

  if v1_record.governance_name is distinct from v2_record.governance_name then
    raise exception 'Harmonic version-series seed refused: Registry governance names do not match.';
  end if;

  insert into public.ta14_registry_version_series (
    series_identifier,
    governance_name,
    short_name,
    category,
    steward,
    status,
    visibility,
    is_published,
    series_summary,
    boundary_statement
  )
  values (
    'TA-14-AIVS-000001',
    v1_record.governance_name,
    coalesce(v2_record.short_name, v1_record.short_name),
    coalesce(v2_record.category, v1_record.category),
    coalesce(v2_record.steward, v1_record.steward),
    'active',
    'public',
    true,
    'Governed version lineage for Harmonic Constitutional Runtime. Version 1.0 and Version 2.0 remain independently registered records with their own declarations, evidence, demonstrations, reviews, and findings.',
    'TA-14-AIVS-000001 preserves the V1 -> V2 lineage without reopening, modifying, or supplementing Version 1.0 / FD-2026-0002 Case 001. Version 2.0 inherits no PASS, finding, or evidentiary conclusion from Version 1.0.'
  )
  on conflict (series_identifier) do update
  set
    governance_name = excluded.governance_name,
    short_name = excluded.short_name,
    category = excluded.category,
    steward = excluded.steward,
    series_summary = excluded.series_summary,
    boundary_statement = excluded.boundary_statement,
    updated_at = timezone('utc', now())
  returning id into harmonic_series_id;

  insert into public.ta14_registry_version_series_members (
    series_id,
    registry_record_id,
    registry_identifier,
    version_label,
    ordinal,
    relationship_type,
    previous_registry_identifier,
    lineage_note,
    findings_inherited,
    evidence_inherited
  )
  values (
    harmonic_series_id,
    v1_record.id,
    v1_record.registry_identifier,
    v1_record.version,
    1,
    'baseline',
    null,
    'Original independently registered Harmonic baseline. Version 1.0 / FD-2026-0002 Case 001 remains frozen and unchanged.',
    false,
    false
  )
  on conflict (registry_identifier) do nothing;

  insert into public.ta14_registry_version_series_members (
    series_id,
    registry_record_id,
    registry_identifier,
    version_label,
    ordinal,
    relationship_type,
    previous_registry_identifier,
    lineage_note,
    findings_inherited,
    evidence_inherited
  )
  values (
    harmonic_series_id,
    v2_record.id,
    v2_record.registry_identifier,
    v2_record.version,
    2,
    'continuation',
    v1_record.registry_identifier,
    'Independent Version 2.0 continuation of Harmonic Constitutional Runtime. The V2 baseline and subsequent review path stand on their own evidence.',
    false,
    false
  )
  on conflict (registry_identifier) do nothing;

  perform setval(
    'public.ta14_registry_version_series_sequence',
    greatest(
      1,
      coalesce(
        (
          select max((regexp_match(series_identifier, '([0-9]+)$'))[1]::bigint)
          from public.ta14_registry_version_series
        ),
        1
      )
    ),
    true
  );
end;
$$;

commit;
