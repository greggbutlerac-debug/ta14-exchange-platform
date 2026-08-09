-- TA-14 24-Link Canonical Institutional Registry
-- Date: 2026-08-09
--
-- Purpose:
--   Make every TA-14 link a stable institutional object that can be referenced
--   by Academy lessons, Exchange artifacts, reviews, patents, publications,
--   evidence maps, and future credentials.
--
-- Provenance boundary:
--   The foundational Chain of Eight was created and publicly published
--   May 1, 2025:
--   Reality -> Record -> Continuity -> Admissibility -> Binding ->
--   Commit -> Execution -> Outcome.
--
--   The 24-link architecture is the subsequent deeper-resolution expansion.
--   This migration must not be interpreted as moving the origin date of the
--   foundational Chain of Eight.

create extension if not exists pgcrypto;

create table if not exists public.ta14_canonical_links (
  link_id text primary key,
  link_order integer not null unique,
  canonical_name text not null unique,
  slug text not null unique,

  parent_anchor text,
  architecture_region text not null,

  definition text,
  governing_question text,
  evidence_requirements jsonb not null default '[]'::jsonb,
  failure_modes jsonb not null default '[]'::jsonb,
  proof_object text,
  transition_rule text,
  hold_refuse_escalate_rule text,
  upstream_dependencies jsonb not null default '[]'::jsonb,
  downstream_consequence text,
  mastery_task text,

  doctrine_state text not null default 'active',
  canonical_version text not null default '2026-08-09',
  provenance_note text not null,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_canonical_link_id_check
    check (link_id ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'),

  constraint ta14_canonical_link_order_check
    check (link_order between 1 and 24),

  constraint ta14_canonical_link_state_check
    check (doctrine_state in ('draft', 'active', 'superseded', 'retired')),

  constraint ta14_canonical_link_evidence_array_check
    check (jsonb_typeof(evidence_requirements) = 'array'),

  constraint ta14_canonical_link_failure_array_check
    check (jsonb_typeof(failure_modes) = 'array'),

  constraint ta14_canonical_link_dependency_array_check
    check (jsonb_typeof(upstream_dependencies) = 'array')
);

drop trigger if exists ta14_canonical_links_updated_at
  on public.ta14_canonical_links;

create trigger ta14_canonical_links_updated_at
before update on public.ta14_canonical_links
for each row
execute function public.ta14_academy_set_updated_at();

create index if not exists ta14_canonical_links_region_idx
  on public.ta14_canonical_links(architecture_region, link_order);

-- ---------------------------------------------------------------------------
-- Canonical 24-link sequence
-- ---------------------------------------------------------------------------

insert into public.ta14_canonical_links (
  link_id,
  link_order,
  canonical_name,
  slug,
  parent_anchor,
  architecture_region,
  provenance_note
)
values
  (
    'TA14-LINK-01', 1, 'Admissible Reality', 'admissible-reality',
    'Reality', 'Reality and Record',
    'Deeper-resolution link within TA-14. Foundational Reality anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-02', 2, 'Record', 'record',
    'Record', 'Reality and Record',
    'Foundational Chain-of-Eight anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-03', 3, 'Continuity', 'continuity',
    'Continuity', 'Reality and Record',
    'Foundational Chain-of-Eight anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-04', 4, 'Evidence Governance', 'evidence-governance',
    'Admissibility', 'Evidence and Truth',
    'Deeper-resolution expansion of the evidence conditions required for admissibility.'
  ),
  (
    'TA14-LINK-05', 5, 'Admissible Evidence', 'admissible-evidence',
    'Admissibility', 'Evidence and Truth',
    'Deeper-resolution expansion of the evidence conditions required for admissibility.'
  ),
  (
    'TA14-LINK-06', 6, 'Admissible Truth', 'admissible-truth',
    'Admissibility', 'Evidence and Truth',
    'Deeper-resolution expansion of the evidence conditions required for admissibility.'
  ),
  (
    'TA14-LINK-07', 7, 'Reliance', 'reliance',
    'Admissibility', 'Reliance and Authority',
    'Deeper-resolution expansion governing when evidence may be relied upon.'
  ),
  (
    'TA14-LINK-08', 8, 'Authority', 'authority',
    'Admissibility', 'Reliance and Authority',
    'Deeper-resolution expansion governing authority before consequence-bearing progression.'
  ),
  (
    'TA14-LINK-09', 9, 'Legitimacy', 'legitimacy',
    'Admissibility', 'Reliance and Authority',
    'Deeper-resolution expansion governing legitimacy before consequence-bearing progression.'
  ),
  (
    'TA14-LINK-10', 10, 'Consequence Formation', 'consequence-formation',
    'Admissibility', 'Consequence Formation',
    'Deeper-resolution expansion governing consequence while it is still forming.'
  ),
  (
    'TA14-LINK-11', 11, 'Attachment / Assent', 'attachment-assent',
    'Binding', 'Consequence Formation',
    'Deeper-resolution expansion governing attachment or assent before binding.'
  ),
  (
    'TA14-LINK-12', 12, 'Binding Reality', 'binding-reality',
    'Binding', 'Binding and Commit',
    'Deeper-resolution expansion immediately preceding the foundational Binding anchor.'
  ),
  (
    'TA14-LINK-13', 13, 'Binding', 'binding',
    'Binding', 'Binding and Commit',
    'Foundational Chain-of-Eight anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-14', 14, 'Commit Reality', 'commit-reality',
    'Commit', 'Binding and Commit',
    'Deeper-resolution expansion immediately preceding the foundational Commit anchor.'
  ),
  (
    'TA14-LINK-15', 15, 'Commit', 'commit',
    'Commit', 'Binding and Commit',
    'Foundational Chain-of-Eight anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-16', 16, 'Execution Reality', 'execution-reality',
    'Execution', 'Execution and Non-Occurrence',
    'Deeper-resolution expansion immediately preceding the foundational Execution anchor.'
  ),
  (
    'TA14-LINK-17', 17, 'Admissible Non-Occurrence', 'admissible-non-occurrence',
    'Execution', 'Execution and Non-Occurrence',
    'Deeper-resolution expansion preserving correct governed non-execution as an admissible result.'
  ),
  (
    'TA14-LINK-18', 18, 'Prevented Consequence', 'prevented-consequence',
    'Execution', 'Execution and Non-Occurrence',
    'Deeper-resolution expansion preserving consequence correctly prevented from attaching.'
  ),
  (
    'TA14-LINK-19', 19, 'Execution', 'execution',
    'Execution', 'Execution and Non-Occurrence',
    'Foundational Chain-of-Eight anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-20', 20, 'Outcome Reality', 'outcome-reality',
    'Outcome', 'Outcome and Recursion',
    'Deeper-resolution expansion immediately preceding the foundational Outcome anchor.'
  ),
  (
    'TA14-LINK-21', 21, 'Outcome', 'outcome',
    'Outcome', 'Outcome and Recursion',
    'Foundational Chain-of-Eight anchor published May 1, 2025.'
  ),
  (
    'TA14-LINK-22', 22, 'New Reality', 'new-reality',
    'Outcome', 'Outcome and Recursion',
    'Deeper-resolution expansion governing the changed reality produced by the completed chain.'
  ),
  (
    'TA14-LINK-23', 23, 'Memory', 'memory',
    'Outcome', 'Outcome and Recursion',
    'Deeper-resolution expansion governing what knowledge and lineage survive into recurrence.'
  ),
  (
    'TA14-LINK-24', 24, 'Future Chain', 'future-chain',
    'Outcome', 'Outcome and Recursion',
    'Deeper-resolution expansion governing entry into the next admissible-execution cycle.'
  )
on conflict (link_id) do update
set
  link_order = excluded.link_order,
  canonical_name = excluded.canonical_name,
  slug = excluded.slug,
  parent_anchor = excluded.parent_anchor,
  architecture_region = excluded.architecture_region,
  provenance_note = excluded.provenance_note,
  updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- Institutional source / provenance objects
-- ---------------------------------------------------------------------------

create table if not exists public.ta14_canonical_sources (
  id uuid primary key default gen_random_uuid(),

  source_type text not null,
  title text not null,
  source_identifier text,
  source_url text,

  publication_date date,
  filing_date date,
  priority_date date,

  jurisdiction text,
  status text,
  version_label text,

  public_summary text,
  provenance_role text,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_canonical_source_type_check
    check (
      source_type in (
        'patent_application',
        'patent',
        'book',
        'article',
        'publication',
        'website',
        'doi',
        'public_record',
        'artifact',
        'review',
        'other'
      )
    )
);

drop trigger if exists ta14_canonical_sources_updated_at
  on public.ta14_canonical_sources;

create trigger ta14_canonical_sources_updated_at
before update on public.ta14_canonical_sources
for each row
execute function public.ta14_academy_set_updated_at();

create unique index if not exists ta14_canonical_sources_identifier_unique_idx
  on public.ta14_canonical_sources(source_type, source_identifier)
  where source_identifier is not null;

create index if not exists ta14_canonical_sources_date_idx
  on public.ta14_canonical_sources(publication_date, filing_date, priority_date);

-- ---------------------------------------------------------------------------
-- Many-to-many link-to-source relationship
-- ---------------------------------------------------------------------------

create table if not exists public.ta14_canonical_link_sources (
  id uuid primary key default gen_random_uuid(),

  link_id text not null
    references public.ta14_canonical_links(link_id)
    on delete restrict,

  source_id uuid not null
    references public.ta14_canonical_sources(id)
    on delete cascade,

  relation_type text not null,
  relation_summary text,

  is_primary_provenance boolean not null default false,
  public_visibility boolean not null default true,

  created_at timestamptz not null default timezone('utc', now()),

  constraint ta14_canonical_link_source_relation_check
    check (
      relation_type in (
        'origin',
        'provenance',
        'expansion',
        'definition',
        'implementation',
        'evidence',
        'example',
        'review',
        'patent_position',
        'publication_record',
        'related'
      )
    ),

  unique (link_id, source_id, relation_type)
);

create index if not exists ta14_canonical_link_sources_link_idx
  on public.ta14_canonical_link_sources(link_id, relation_type);

create index if not exists ta14_canonical_link_sources_source_idx
  on public.ta14_canonical_link_sources(source_id, relation_type);

-- ---------------------------------------------------------------------------
-- Seed the May 1, 2025 foundational publication as a provenance object.
-- Identifier deliberately uses the known publication date/title boundary
-- rather than inventing an ISBN, ASIN, patent number, or DOI.
-- ---------------------------------------------------------------------------

insert into public.ta14_canonical_sources (
  source_type,
  title,
  source_identifier,
  publication_date,
  status,
  public_summary,
  provenance_role
)
values (
  'book',
  'Transparent Air''s S.O.P. of Residential Air Conditioning',
  'TA14-FOUNDATIONAL-PUBLICATION-2025-05-01',
  date '2025-05-01',
  'published',
  'Foundational public publication of the TA-14 Chain of Eight: Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, Outcome.',
  'Foundational Chain-of-Eight chronology anchor.'
)
on conflict (source_type, source_identifier) where source_identifier is not null
do update set
  title = excluded.title,
  publication_date = excluded.publication_date,
  status = excluded.status,
  public_summary = excluded.public_summary,
  provenance_role = excluded.provenance_role,
  updated_at = timezone('utc', now());

with foundational_source as (
  select id
  from public.ta14_canonical_sources
  where source_type = 'book'
    and source_identifier = 'TA14-FOUNDATIONAL-PUBLICATION-2025-05-01'
)
insert into public.ta14_canonical_link_sources (
  link_id,
  source_id,
  relation_type,
  relation_summary,
  is_primary_provenance,
  public_visibility
)
select
  links.link_id,
  foundational_source.id,
  'origin',
  'Foundational Chain-of-Eight anchor publicly published May 1, 2025.',
  true,
  true
from foundational_source
cross join (
  values
    ('TA14-LINK-01'),
    ('TA14-LINK-02'),
    ('TA14-LINK-03'),
    ('TA14-LINK-13'),
    ('TA14-LINK-15'),
    ('TA14-LINK-19'),
    ('TA14-LINK-21')
) as links(link_id)
on conflict (link_id, source_id, relation_type) do nothing;

-- Admissibility is a foundational Chain-of-Eight anchor, but the current
-- 24-link canon resolves that parent anchor across Links 04-10 rather than
-- naming one current link simply "Admissibility." Preserve that relationship
-- explicitly instead of fabricating a twenty-fourth/current link name.

with foundational_source as (
  select id
  from public.ta14_canonical_sources
  where source_type = 'book'
    and source_identifier = 'TA14-FOUNDATIONAL-PUBLICATION-2025-05-01'
)
insert into public.ta14_canonical_link_sources (
  link_id,
  source_id,
  relation_type,
  relation_summary,
  is_primary_provenance,
  public_visibility
)
select
  links.link_id,
  foundational_source.id,
  'expansion',
  'Current deeper-resolution link descends from the foundational Admissibility anchor published May 1, 2025.',
  false,
  true
from foundational_source
cross join (
  values
    ('TA14-LINK-04'),
    ('TA14-LINK-05'),
    ('TA14-LINK-06'),
    ('TA14-LINK-07'),
    ('TA14-LINK-08'),
    ('TA14-LINK-09'),
    ('TA14-LINK-10')
) as links(link_id)
on conflict (link_id, source_id, relation_type) do nothing;

-- ---------------------------------------------------------------------------
-- RLS: canon and public provenance are readable; mutations remain service-side.
-- ---------------------------------------------------------------------------

alter table public.ta14_canonical_links enable row level security;
alter table public.ta14_canonical_sources enable row level security;
alter table public.ta14_canonical_link_sources enable row level security;

drop policy if exists "Public can read active TA14 canonical links"
  on public.ta14_canonical_links;

create policy "Public can read active TA14 canonical links"
  on public.ta14_canonical_links
  for select
  to anon, authenticated
  using (doctrine_state = 'active');

drop policy if exists "Public can read visible TA14 canonical sources"
  on public.ta14_canonical_sources;

create policy "Public can read visible TA14 canonical sources"
  on public.ta14_canonical_sources
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read visible TA14 link source relations"
  on public.ta14_canonical_link_sources;

create policy "Public can read visible TA14 link source relations"
  on public.ta14_canonical_link_sources
  for select
  to anon, authenticated
  using (public_visibility = true);

grant select on public.ta14_canonical_links to anon, authenticated;
grant select on public.ta14_canonical_sources to anon, authenticated;
grant select on public.ta14_canonical_link_sources to anon, authenticated;

comment on table public.ta14_canonical_links is
  'Stable institutional objects for the canonical TA-14 24-Link Admissible Execution Architecture.';

comment on table public.ta14_canonical_sources is
  'TA-14 provenance and architecture sources including patents, applications, books, articles, websites, public records, artifacts, and reviews.';

comment on table public.ta14_canonical_link_sources is
  'Governed relationships between canonical TA-14 links and patents, publications, artifacts, reviews, and other provenance sources.';
