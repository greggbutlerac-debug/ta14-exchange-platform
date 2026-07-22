-- TA-14 AI Governance Registry
-- Foundational Supabase schema
-- Purpose: persist registry intakes, evidence manifests, lifecycle events,
-- disputes, public records, and immutable lineage without treating
-- registration as certification.

create extension if not exists pgcrypto;

create or replace function public.ta14_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.ai_governance_registry_submissions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  governance_name text not null,
  short_name text,
  governance_category text not null,
  current_version text not null,
  claimed_establishment_date date not null,
  effective_version_date date,

  claimant_name text not null,
  claimant_type text not null,
  submitter_authority_role text not null,
  authority_basis text not null,
  current_steward text,
  organization_name text,
  contact_email text not null,
  public_contact_mode text not null default 'registry_contact_form',
  public_website text,

  geographic_scope text,
  regulatory_scope text,
  plain_language_description text not null,
  formal_claims text not null,
  explicit_non_claims text not null,
  known_limitations text,
  known_disputes text,

  ownership_declaration text not null,
  license_statement text,
  requested_review_pathway text not null,
  record_visibility text not null default 'public',

  allow_review_requests boolean not null default false,
  allow_collaboration_inquiries boolean not null default false,
  allow_dispute_notices boolean not null default true,

  authority_declaration_accepted boolean not null default false,
  accuracy_declaration_accepted boolean not null default false,
  registry_boundary_accepted boolean not null default false,

  intake_manifest jsonb not null default '{}'::jsonb,

  status text not null default 'draft',
  registry_identifier text unique,
  submitted_at timestamptz,
  accepted_at timestamptz,
  withdrawn_at timestamptz,
  archived_at timestamptz,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_submission_status_check
    check (
      status in (
        'draft',
        'submitted',
        'under_review',
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived',
        'rejected'
      )
    ),

  constraint ai_registry_visibility_check
    check (record_visibility in ('public', 'private', 'selective')),

  constraint ai_registry_public_contact_mode_check
    check (
      public_contact_mode in (
        'registry_contact_form',
        'public_email',
        'website_only',
        'private'
      )
    ),

  constraint ai_registry_registered_identifier_check
    check (
      status <> 'registered'
      or (
        registry_identifier is not null
        and accepted_at is not null
      )
    )
);

drop trigger if exists ta14_registry_submission_updated_at
  on public.ai_governance_registry_submissions;

create trigger ta14_registry_submission_updated_at
before update on public.ai_governance_registry_submissions
for each row
execute function public.ta14_set_updated_at();

create table if not exists public.ai_governance_registry_evidence (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  original_filename text not null,
  storage_bucket text,
  storage_path text,
  mime_type text not null,
  size_bytes bigint not null,
  sha256_hex text not null,

  evidence_relationship text not null,
  evidence_classification text,
  description text not null,
  visibility text not null default 'private',
  evidence_state text not null default 'current',

  source_date date,
  source_url text,
  submitted_at timestamptz not null default timezone('utc', now()),
  superseded_by_evidence_id uuid
    references public.ai_governance_registry_evidence(id)
    on delete set null,

  created_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_evidence_size_check
    check (size_bytes >= 0 and size_bytes <= 52428800),

  constraint ai_registry_evidence_visibility_check
    check (visibility in ('public', 'private', 'selective')),

  constraint ai_registry_evidence_state_check
    check (evidence_state in ('current', 'superseded', 'withdrawn', 'unavailable')),

  constraint ai_registry_evidence_hash_check
    check (sha256_hex ~ '^[0-9a-fA-F]{64}$')
);

create unique index if not exists ai_registry_evidence_submission_hash_unique
  on public.ai_governance_registry_evidence(submission_id, lower(sha256_hex));

create table if not exists public.ai_governance_registry_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,

  actor_user_id uuid references auth.users(id) on delete set null,
  actor_label text not null,
  actor_role text not null,
  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,
  previous_event_hash text,
  event_hash text not null,
  occurred_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_event_hash_check
    check (event_hash ~ '^[0-9a-fA-F]{64}$'),

  constraint ai_registry_previous_event_hash_check
    check (
      previous_event_hash is null
      or previous_event_hash ~ '^[0-9a-fA-F]{64}$'
    )
);

create index if not exists ai_registry_events_submission_time_idx
  on public.ai_governance_registry_events(submission_id, occurred_at, id);

create or replace function public.ta14_prevent_registry_event_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  raise exception 'Registry lifecycle events are append-only.';
end;
$$;

drop trigger if exists ta14_registry_events_immutable
  on public.ai_governance_registry_events;

create trigger ta14_registry_events_immutable
before update or delete on public.ai_governance_registry_events
for each row
execute function public.ta14_prevent_registry_event_mutation();

create table if not exists public.ai_governance_registry_disputes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,

  filed_by_user_id uuid references auth.users(id) on delete set null,
  filer_name text not null,
  filer_contact text not null,
  dispute_type text not null,
  statement text not null,
  supporting_evidence_manifest jsonb not null default '[]'::jsonb,

  status text not null default 'submitted',
  public_summary text,
  resolution_summary text,
  filed_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz,

  constraint ai_registry_dispute_status_check
    check (
      status in (
        'submitted',
        'under_review',
        'response_requested',
        'resolved',
        'dismissed',
        'withdrawn'
      )
    )
);

create index if not exists ai_registry_disputes_submission_idx
  on public.ai_governance_registry_disputes(submission_id, filed_at desc);

create or replace view public.ai_governance_registry_public_records
with (security_invoker = true)
as
select
  s.id,
  s.registry_identifier,
  s.governance_name,
  s.short_name,
  s.governance_category,
  s.current_version,
  s.claimed_establishment_date,
  s.effective_version_date,
  s.claimant_name,
  s.claimant_type,
  s.current_steward,
  s.organization_name,
  case
    when s.public_contact_mode = 'public_email' then s.contact_email
    else null
  end as public_contact_email,
  case
    when s.public_contact_mode in ('website_only', 'registry_contact_form')
      then s.public_website
    else null
  end as public_website,
  s.public_contact_mode,
  s.geographic_scope,
  s.regulatory_scope,
  s.plain_language_description,
  s.formal_claims,
  s.explicit_non_claims,
  s.known_limitations,
  s.known_disputes,
  s.ownership_declaration,
  s.license_statement,
  s.requested_review_pathway,
  s.status,
  s.submitted_at,
  s.accepted_at,
  s.updated_at,
  (
    select count(*)
    from public.ai_governance_registry_evidence e
    where e.submission_id = s.id
      and e.visibility = 'public'
      and e.evidence_state = 'current'
  ) as public_evidence_count,
  (
    select count(*)
    from public.ai_governance_registry_disputes d
    where d.submission_id = s.id
      and d.status not in ('dismissed', 'withdrawn')
  ) as active_dispute_count
from public.ai_governance_registry_submissions s
where s.record_visibility = 'public'
  and s.status in (
    'registered',
    'disputed',
    'superseded',
    'withdrawn',
    'archived'
  )
  and s.registry_identifier is not null;

alter table public.ai_governance_registry_submissions enable row level security;
alter table public.ai_governance_registry_evidence enable row level security;
alter table public.ai_governance_registry_events enable row level security;
alter table public.ai_governance_registry_disputes enable row level security;

drop policy if exists "Registry owners can read their submissions"
  on public.ai_governance_registry_submissions;

create policy "Registry owners can read their submissions"
on public.ai_governance_registry_submissions
for select
to authenticated
using (owner_user_id = auth.uid());

drop policy if exists "Public can read published registry submissions"
  on public.ai_governance_registry_submissions;

create policy "Public can read published registry submissions"
on public.ai_governance_registry_submissions
for select
to anon, authenticated
using (
  record_visibility = 'public'
  and status in (
    'registered',
    'disputed',
    'superseded',
    'withdrawn',
    'archived'
  )
  and registry_identifier is not null
);

drop policy if exists "Authenticated users can create registry drafts"
  on public.ai_governance_registry_submissions;

create policy "Authenticated users can create registry drafts"
on public.ai_governance_registry_submissions
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
  and status = 'draft'
  and registry_identifier is null
);

drop policy if exists "Owners can update editable registry submissions"
  on public.ai_governance_registry_submissions;

create policy "Owners can update editable registry submissions"
on public.ai_governance_registry_submissions
for update
to authenticated
using (
  owner_user_id = auth.uid()
  and status in ('draft', 'submitted', 'under_review')
)
with check (
  owner_user_id = auth.uid()
  and status in ('draft', 'submitted', 'under_review')
  and registry_identifier is null
);

drop policy if exists "Owners can delete registry drafts"
  on public.ai_governance_registry_submissions;

create policy "Owners can delete registry drafts"
on public.ai_governance_registry_submissions
for delete
to authenticated
using (
  owner_user_id = auth.uid()
  and status = 'draft'
  and registry_identifier is null
);

drop policy if exists "Owners can read their registry evidence"
  on public.ai_governance_registry_evidence;

create policy "Owners can read their registry evidence"
on public.ai_governance_registry_evidence
for select
to authenticated
using (owner_user_id = auth.uid());

drop policy if exists "Public can read public evidence metadata"
  on public.ai_governance_registry_evidence;

create policy "Public can read public evidence metadata"
on public.ai_governance_registry_evidence
for select
to anon, authenticated
using (
  visibility = 'public'
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
      and s.registry_identifier is not null
  )
);

drop policy if exists "Owners can create evidence for editable submissions"
  on public.ai_governance_registry_evidence;

create policy "Owners can create evidence for editable submissions"
on public.ai_governance_registry_evidence
for insert
to authenticated
with check (
  owner_user_id = auth.uid()
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.owner_user_id = auth.uid()
      and s.status in ('draft', 'submitted', 'under_review')
      and s.registry_identifier is null
  )
);

drop policy if exists "Owners can update evidence for editable submissions"
  on public.ai_governance_registry_evidence;

create policy "Owners can update evidence for editable submissions"
on public.ai_governance_registry_evidence
for update
to authenticated
using (
  owner_user_id = auth.uid()
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.owner_user_id = auth.uid()
      and s.status in ('draft', 'submitted', 'under_review')
      and s.registry_identifier is null
  )
)
with check (owner_user_id = auth.uid());

drop policy if exists "Owners can delete evidence from drafts"
  on public.ai_governance_registry_evidence;

create policy "Owners can delete evidence from drafts"
on public.ai_governance_registry_evidence
for delete
to authenticated
using (
  owner_user_id = auth.uid()
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.owner_user_id = auth.uid()
      and s.status = 'draft'
      and s.registry_identifier is null
  )
);

drop policy if exists "Owners can read registry lifecycle events"
  on public.ai_governance_registry_events;

create policy "Owners can read registry lifecycle events"
on public.ai_governance_registry_events
for select
to authenticated
using (
  exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.owner_user_id = auth.uid()
  )
);

drop policy if exists "Public can read published registry lifecycle events"
  on public.ai_governance_registry_events;

create policy "Public can read published registry lifecycle events"
on public.ai_governance_registry_events
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
      and s.registry_identifier is not null
  )
);

drop policy if exists "Authenticated users can file registry disputes"
  on public.ai_governance_registry_disputes;

create policy "Authenticated users can file registry disputes"
on public.ai_governance_registry_disputes
for insert
to authenticated
with check (filed_by_user_id = auth.uid());

drop policy if exists "Dispute filers can read their disputes"
  on public.ai_governance_registry_disputes;

create policy "Dispute filers can read their disputes"
on public.ai_governance_registry_disputes
for select
to authenticated
using (filed_by_user_id = auth.uid());

drop policy if exists "Owners can read disputes on their submissions"
  on public.ai_governance_registry_disputes;

create policy "Owners can read disputes on their submissions"
on public.ai_governance_registry_disputes
for select
to authenticated
using (
  exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.owner_user_id = auth.uid()
  )
);

drop policy if exists "Public can read unresolved public-record disputes"
  on public.ai_governance_registry_disputes;

create policy "Public can read unresolved public-record disputes"
on public.ai_governance_registry_disputes
for select
to anon, authenticated
using (
  public_summary is not null
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
      and s.registry_identifier is not null
  )
);

grant select on public.ai_governance_registry_public_records
  to anon, authenticated;

comment on table public.ai_governance_registry_submissions is
  'TA-14 governed registration intakes and accepted registry records. Registration preserves declarations; it does not certify them.';

comment on table public.ai_governance_registry_evidence is
  'Evidence metadata and storage references bound to a registry submission. File presence does not establish truth, authenticity, ownership, or efficacy.';

comment on table public.ai_governance_registry_events is
  'Append-only lifecycle and provenance events for each registry submission and record.';

comment on table public.ai_governance_registry_disputes is
  'Preserved challenges concerning attribution, ownership, scope, evidence, status, or material accuracy.';
