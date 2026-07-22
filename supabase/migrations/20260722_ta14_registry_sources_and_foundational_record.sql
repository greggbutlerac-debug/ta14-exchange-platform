-- TA-14 AI Governance Registry
-- Evidence-source expansion and foundational Registry record
--
-- Adds repeatable, first-class records for:
--   * Publications and articles
--   * GitHub and other software repositories
--   * Zenodo deposits and DOIs
--   * Patent applications, granted patents, and conversion lineage
--
-- Also attempts to establish TA-14 Admissible Execution Architecture as
-- Registry record TA-14-AIGR-0001 when the institutional owner account exists.

create extension if not exists pgcrypto;

create table if not exists public.ai_governance_registry_publications (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  publication_type text not null,
  title text not null,
  authors text not null,
  publisher_or_platform text,
  publication_date date,
  url text,
  doi text,
  isbn text,
  citation_text text,
  abstract_or_description text,
  relationship_to_governance text not null,
  visibility text not null default 'public',
  record_state text not null default 'current',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_publication_type_check
    check (
      publication_type in (
        'article',
        'book',
        'book_chapter',
        'paper',
        'report',
        'standard',
        'white_paper',
        'presentation',
        'website',
        'other'
      )
    ),

  constraint ai_registry_publication_visibility_check
    check (visibility in ('public', 'private', 'selective')),

  constraint ai_registry_publication_state_check
    check (record_state in ('current', 'superseded', 'withdrawn', 'unavailable'))
);

drop trigger if exists ta14_registry_publications_updated_at
  on public.ai_governance_registry_publications;

create trigger ta14_registry_publications_updated_at
before update on public.ai_governance_registry_publications
for each row
execute function public.ta14_set_updated_at();

create index if not exists ai_registry_publications_submission_idx
  on public.ai_governance_registry_publications(submission_id, publication_date desc);

create table if not exists public.ai_governance_registry_repositories (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  provider text not null default 'github',
  repository_name text not null,
  repository_owner text,
  repository_url text not null,
  default_branch text,
  release_or_tag text,
  commit_sha text,
  license text,
  access_state text not null default 'public',
  repository_state text not null default 'active',
  description text,
  relationship_to_governance text not null,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_repository_provider_check
    check (provider in ('github', 'gitlab', 'bitbucket', 'codeberg', 'other')),

  constraint ai_registry_repository_access_check
    check (access_state in ('public', 'private', 'restricted')),

  constraint ai_registry_repository_state_check
    check (
      repository_state in (
        'active',
        'archived',
        'superseded',
        'withdrawn',
        'unavailable'
      )
    )
);

drop trigger if exists ta14_registry_repositories_updated_at
  on public.ai_governance_registry_repositories;

create trigger ta14_registry_repositories_updated_at
before update on public.ai_governance_registry_repositories
for each row
execute function public.ta14_set_updated_at();

create index if not exists ai_registry_repositories_submission_idx
  on public.ai_governance_registry_repositories(submission_id, provider);

create table if not exists public.ai_governance_registry_zenodo_records (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  record_url text not null,
  doi text,
  concept_doi text,
  zenodo_record_id text,
  version text,
  publication_date date,
  creators text,
  resource_type text,
  description text,
  relationship_to_governance text not null,
  visibility text not null default 'public',
  record_state text not null default 'current',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_zenodo_visibility_check
    check (visibility in ('public', 'private', 'selective')),

  constraint ai_registry_zenodo_state_check
    check (record_state in ('current', 'superseded', 'withdrawn', 'unavailable'))
);

drop trigger if exists ta14_registry_zenodo_updated_at
  on public.ai_governance_registry_zenodo_records;

create trigger ta14_registry_zenodo_updated_at
before update on public.ai_governance_registry_zenodo_records
for each row
execute function public.ta14_set_updated_at();

create index if not exists ai_registry_zenodo_submission_idx
  on public.ai_governance_registry_zenodo_records(submission_id, publication_date desc);

create table if not exists public.ai_governance_registry_patent_records (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.ai_governance_registry_submissions(id)
    on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  jurisdiction text not null,
  filing_type text not null,
  application_status text not null default 'filed',

  application_number text,
  publication_number text,
  patent_number text,

  filing_date date,
  publication_date date,
  grant_date date,
  priority_date date,

  inventors text,
  applicant_or_assignee text,
  official_url text,
  description text,
  relationship_to_governance text not null,

  converted_from_patent_record_id uuid
    references public.ai_governance_registry_patent_records(id)
    on delete set null,
  continuation_of_patent_record_id uuid
    references public.ai_governance_registry_patent_records(id)
    on delete set null,

  visibility text not null default 'public',
  record_state text not null default 'current',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ai_registry_patent_filing_type_check
    check (
      filing_type in (
        'provisional_application',
        'non_provisional_application',
        'pct_application',
        'continuation',
        'continuation_in_part',
        'divisional',
        'reissue_application',
        'utility_patent',
        'design_patent',
        'plant_patent',
        'foreign_application',
        'other'
      )
    ),

  constraint ai_registry_patent_status_check
    check (
      application_status in (
        'draft',
        'filed',
        'pending',
        'published',
        'allowed',
        'granted',
        'abandoned',
        'rejected',
        'expired',
        'lapsed',
        'withdrawn'
      )
    ),

  constraint ai_registry_patent_visibility_check
    check (visibility in ('public', 'private', 'selective')),

  constraint ai_registry_patent_state_check
    check (record_state in ('current', 'superseded', 'withdrawn', 'unavailable')),

  constraint ai_registry_granted_patent_fields_check
    check (
      application_status <> 'granted'
      or (
        patent_number is not null
        and grant_date is not null
      )
    )
);

drop trigger if exists ta14_registry_patents_updated_at
  on public.ai_governance_registry_patent_records;

create trigger ta14_registry_patents_updated_at
before update on public.ai_governance_registry_patent_records
for each row
execute function public.ta14_set_updated_at();

create index if not exists ai_registry_patents_submission_idx
  on public.ai_governance_registry_patent_records(submission_id, filing_date desc);

create unique index if not exists ai_registry_patent_application_unique
  on public.ai_governance_registry_patent_records(
    submission_id,
    jurisdiction,
    application_number
  )
  where application_number is not null;

alter table public.ai_governance_registry_publications enable row level security;
alter table public.ai_governance_registry_repositories enable row level security;
alter table public.ai_governance_registry_zenodo_records enable row level security;
alter table public.ai_governance_registry_patent_records enable row level security;

-- Shared policy pattern: owners may manage linked records while the parent
-- Registry submission remains editable. Public readers may see only public
-- source records attached to a published Registry record.

drop policy if exists "Owners can manage registry publications"
  on public.ai_governance_registry_publications;

create policy "Owners can manage registry publications"
on public.ai_governance_registry_publications
for all
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

drop policy if exists "Public can read published registry publications"
  on public.ai_governance_registry_publications;

create policy "Public can read published registry publications"
on public.ai_governance_registry_publications
for select
to anon, authenticated
using (
  visibility = 'public'
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.registry_identifier is not null
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
  )
);

drop policy if exists "Owners can manage registry repositories"
  on public.ai_governance_registry_repositories;

create policy "Owners can manage registry repositories"
on public.ai_governance_registry_repositories
for all
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

drop policy if exists "Public can read published registry repositories"
  on public.ai_governance_registry_repositories;

create policy "Public can read published registry repositories"
on public.ai_governance_registry_repositories
for select
to anon, authenticated
using (
  access_state = 'public'
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.registry_identifier is not null
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
  )
);

drop policy if exists "Owners can manage registry Zenodo records"
  on public.ai_governance_registry_zenodo_records;

create policy "Owners can manage registry Zenodo records"
on public.ai_governance_registry_zenodo_records
for all
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

drop policy if exists "Public can read published Registry Zenodo records"
  on public.ai_governance_registry_zenodo_records;

create policy "Public can read published Registry Zenodo records"
on public.ai_governance_registry_zenodo_records
for select
to anon, authenticated
using (
  visibility = 'public'
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.registry_identifier is not null
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
  )
);

drop policy if exists "Owners can manage registry patent records"
  on public.ai_governance_registry_patent_records;

create policy "Owners can manage registry patent records"
on public.ai_governance_registry_patent_records
for all
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

drop policy if exists "Public can read published registry patent records"
  on public.ai_governance_registry_patent_records;

create policy "Public can read published registry patent records"
on public.ai_governance_registry_patent_records
for select
to anon, authenticated
using (
  visibility = 'public'
  and exists (
    select 1
    from public.ai_governance_registry_submissions s
    where s.id = submission_id
      and s.record_visibility = 'public'
      and s.registry_identifier is not null
      and s.status in (
        'registered',
        'disputed',
        'superseded',
        'withdrawn',
        'archived'
      )
  )
);

comment on table public.ai_governance_registry_publications is
  'Repeatable articles, books, papers, reports, and other publications declared as supporting or contextual records.';

comment on table public.ai_governance_registry_repositories is
  'Dedicated software repository records, including GitHub repositories, releases, tags, and commit references.';

comment on table public.ai_governance_registry_zenodo_records is
  'Repeatable Zenodo deposits with record DOI, concept DOI, version, and relationship to the registered governance architecture.';

comment on table public.ai_governance_registry_patent_records is
  'Patent applications and granted patents with provisional, non-provisional, continuation, publication, grant, and conversion lineage.';

do $$
declare
  institutional_owner_id uuid;
  foundational_submission_id uuid;
  foundational_event_hash text;
begin
  select id
  into institutional_owner_id
  from auth.users
  where lower(email) = lower('greggbutlerac@gmail.com')
  order by created_at asc
  limit 1;

  if institutional_owner_id is null then
    raise notice
      'TA-14-AIGR-0001 was not seeded because the institutional owner account was not found.';
    return;
  end if;

  insert into public.ai_governance_registry_submissions (
    owner_user_id,
    governance_name,
    short_name,
    governance_category,
    current_version,
    claimed_establishment_date,
    effective_version_date,
    claimant_name,
    claimant_type,
    submitter_authority_role,
    authority_basis,
    current_steward,
    organization_name,
    contact_email,
    public_contact_mode,
    public_website,
    geographic_scope,
    regulatory_scope,
    plain_language_description,
    formal_claims,
    explicit_non_claims,
    known_limitations,
    known_disputes,
    ownership_declaration,
    license_statement,
    requested_review_pathway,
    record_visibility,
    allow_review_requests,
    allow_collaboration_inquiries,
    allow_dispute_notices,
    authority_declaration_accepted,
    accuracy_declaration_accepted,
    registry_boundary_accepted,
    intake_manifest,
    status,
    registry_identifier,
    submitted_at,
    accepted_at
  )
  values (
    institutional_owner_id,
    'TA-14 Admissible Execution Architecture',
    'TA-14 AEA',
    'Admissible execution governance',
    'Foundational Registry Record 1.0',
    date '2025-05-01',
    date '2026-07-22',
    'Greggory Don Butler',
    'individual_founder_or_author',
    'founder',
    'Founder and declared architect of the governance architecture; institutional record established by TA-14 Authority Governance Institution.',
    'TA-14 Authority Governance Institution',
    'TA-14 Authority Governance Institution',
    'greggbutlerac@gmail.com',
    'registry_contact_form',
    'https://ta14-exchange-platform-theta.vercel.app',
    'Global',
    'AI governance, evidence governance, runtime governance, consequential execution, and governed records',
    'A governance architecture for separating reality, records, continuity, admissibility, binding, commitment, execution, and outcomes so consequential execution can be inspected and governed without allowing one layer to silently replace another.',
    E'TA-14 claims to define an inspectable route from evidence to consequential execution.\nTA-14 claims to preserve separation between records, interpretations, determinations, commitments, executions, and outcomes.\nTA-14 claims to support ALLOW, HOLD, DENY, and ESCALATE route determinations under declared evidence and authority conditions.',
    E'Registration does not certify that every TA-14 implementation is correct, lawful, effective, complete, or fit for every use.\nThe Registry record does not replace legal, regulatory, technical, scientific, or professional review.\nA recorded claim is not automatically proven merely because it appears in the Registry.',
    'Implementation quality depends on declared evidence, authority, integration, domain rules, and preservation of the governing route. External validation and jurisdiction-specific review may still be required.',
    'No known dispute is declared in this foundational Registry record. The public dispute pathway remains available.',
    'Greggory Don Butler and TA-14 Authority Governance Institution claim authorship, stewardship, and authority to establish this foundational Registry record, subject to any later disclosed joint interests, competing claims, or adjudicated rights.',
    'Rights reserved except where a specific publication, repository, demonstration, or artifact states a different license.',
    'identity_and_authority_review',
    'public',
    true,
    true,
    true,
    true,
    true,
    true,
    jsonb_build_object(
      'record_type', 'foundational_registry_record',
      'institution', 'TA-14 Authority Governance Institution',
      'registration_boundary',
      'Registration preserves the declaration and supporting record; it is not certification.'
    ),
    'registered',
    'TA-14-AIGR-0001',
    timezone('utc', now()),
    timezone('utc', now())
  )
  on conflict (registry_identifier)
  do update set
    governance_name = excluded.governance_name,
    short_name = excluded.short_name,
    governance_category = excluded.governance_category,
    current_version = excluded.current_version,
    effective_version_date = excluded.effective_version_date,
    current_steward = excluded.current_steward,
    organization_name = excluded.organization_name,
    plain_language_description = excluded.plain_language_description,
    formal_claims = excluded.formal_claims,
    explicit_non_claims = excluded.explicit_non_claims,
    known_limitations = excluded.known_limitations,
    ownership_declaration = excluded.ownership_declaration,
    license_statement = excluded.license_statement,
    intake_manifest = excluded.intake_manifest,
    updated_at = timezone('utc', now())
  returning id into foundational_submission_id;

  foundational_event_hash := encode(
    digest(
      foundational_submission_id::text
      || '|TA-14-AIGR-0001|foundational_registration|'
      || timezone('utc', now())::text,
      'sha256'
    ),
    'hex'
  );

  if not exists (
    select 1
    from public.ai_governance_registry_events
    where submission_id = foundational_submission_id
      and event_type = 'foundational_registration'
  ) then
    insert into public.ai_governance_registry_events (
      submission_id,
      actor_user_id,
      actor_label,
      actor_role,
      event_type,
      event_summary,
      event_payload,
      previous_event_hash,
      event_hash
    )
    values (
      foundational_submission_id,
      institutional_owner_id,
      'TA-14 Authority Governance Institution',
      'founding_registry_authority',
      'foundational_registration',
      'Established TA-14 Admissible Execution Architecture as the first foundational AI Governance Registry record.',
      jsonb_build_object(
        'registry_identifier', 'TA-14-AIGR-0001',
        'registration_is_certification', false,
        'record_status', 'registered'
      ),
      null,
      foundational_event_hash
    );
  end if;
end;
$$;
