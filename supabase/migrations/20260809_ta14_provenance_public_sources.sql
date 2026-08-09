-- TA-14 Canonical Public Provenance Sources
-- Date: 2026-08-09
--
-- Purpose:
--   Seed the canonical TA-14 public patent-position and publication-chronology
--   pages as institutional provenance sources so the 24-Link Provenance Map
--   has stable public entry points before individual patent applications,
--   publications, and artifacts are mapped in later migrations.
--
-- Important:
--   These source records establish public provenance references only.
--   They do not by themselves establish patent grant, patent scope,
--   infringement, certification, endorsement, or legal conclusion.

insert into public.ta14_canonical_sources (
  source_type,
  title,
  source_identifier,
  source_url,
  status,
  public_summary,
  provenance_role,
  metadata
)
values
  (
    'website',
    'TA-14 Patent Position and Patent Portfolio',
    'TA14-PUBLIC-PATENT-POSITION-PORTFOLIO',
    'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-patent-position-and-patent-portfolio',
    'public',
    'Canonical TA-14 public entry point for patent-position and patent-portfolio records.',
    'Public patent-position and patent-portfolio provenance index.',
    jsonb_build_object(
      'canonical', true,
      'source_class', 'patent_position_index'
    )
  ),
  (
    'website',
    'TA-14 Public Article / Publication Chronology',
    'TA14-PUBLIC-PUBLICATION-CHRONOLOGY',
    'https://sites.google.com/view/ta-14-admissible-execution-arc/ta-14-public-article-publication-chronology?authuser=0',
    'public',
    'Canonical TA-14 public entry point for article and publication chronology.',
    'Public chronology index for TA-14 publications and architecture development records.',
    jsonb_build_object(
      'canonical', true,
      'source_class', 'publication_chronology_index'
    )
  )
on conflict (source_type, source_identifier) where source_identifier is not null
do update set
  title = excluded.title,
  source_url = excluded.source_url,
  status = excluded.status,
  public_summary = excluded.public_summary,
  provenance_role = excluded.provenance_role,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());

-- The public patent-position portfolio is relevant to the full architecture.
-- This relationship means "consult this canonical portfolio index for the
-- patent-position record associated with TA-14"; it does not assert that
-- every listed patent/application necessarily claims every individual link.

with patent_index as (
  select id
  from public.ta14_canonical_sources
  where source_type = 'website'
    and source_identifier = 'TA14-PUBLIC-PATENT-POSITION-PORTFOLIO'
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
  patent_index.id,
  'patent_position',
  'Canonical public TA-14 patent-position / portfolio index. Individual patent-to-link scope should be recorded separately.',
  false,
  true
from patent_index
cross join public.ta14_canonical_links as links
where links.doctrine_state = 'active'
on conflict (link_id, source_id, relation_type) do nothing;

-- The chronology index is likewise attached to all links as a public research
-- entry point. Individual publication-to-link relationships should later be
-- entered with exact dates and bounded relation summaries.

with chronology_index as (
  select id
  from public.ta14_canonical_sources
  where source_type = 'website'
    and source_identifier = 'TA14-PUBLIC-PUBLICATION-CHRONOLOGY'
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
  chronology_index.id,
  'publication_record',
  'Canonical public TA-14 publication chronology index. Exact source chronology should be recorded as individual source relationships.',
  false,
  true
from chronology_index
cross join public.ta14_canonical_links as links
where links.doctrine_state = 'active'
on conflict (link_id, source_id, relation_type) do nothing;

comment on table public.ta14_canonical_sources is
  'TA-14 provenance sources. Index pages may point to broader portfolios or chronologies; individual source-to-link scope remains separately governed.';
