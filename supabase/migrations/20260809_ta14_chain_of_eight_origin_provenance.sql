-- TA-14 Chain of Eight — Foundational Origin Provenance
-- Date: 2026-08-09
--
-- Canonical chronology rule:
--   The foundational TA-14 Chain of Eight was created and publicly published
--   on May 1, 2025 in Transparent Air's S.O.P. of Residential Air Conditioning.
--
--   Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit
--   -> Execution -> Outcome
--
-- The later 24-link architecture is a deeper-resolution expansion developed
-- over the following year. This migration MUST NOT be interpreted as moving
-- the origin of the parent eight-link architecture to a later date.

insert into public.ta14_canonical_sources (
  source_type,
  title,
  source_identifier,
  source_url,
  publication_date,
  filing_date,
  priority_date,
  jurisdiction,
  status,
  version_label,
  public_summary,
  provenance_role,
  metadata
)
values (
  'book',
  'Transparent Air''s S.O.P. of Residential Air Conditioning',
  'TA14-CHAIN-OF-EIGHT-ORIGIN-2025-05-01',
  null,
  '2025-05-01',
  null,
  null,
  'US',
  'publicly published',
  'Foundational publication',
  'Foundational public publication record for the TA-14 eight-link admissible-execution chain: Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit -> Execution -> Outcome.',
  'TA-14 foundational architecture origin record. Preserves May 1, 2025 as the public origin date of the parent Chain of Eight while treating the later 24-link architecture as subsequent expansion and deeper decomposition.',
  jsonb_build_object(
    'canonical', true,
    'architecture_role', 'foundational_chain_of_eight',
    'origin_date', '2025-05-01',
    'foundational_chain', jsonb_build_array(
      'Reality',
      'Record',
      'Continuity',
      'Admissibility',
      'Binding',
      'Commit',
      'Execution',
      'Outcome'
    ),
    'later_expansion', 'TA-14 24-Link Admissible Execution Architecture',
    'chronology_rule', 'The later 24-link architecture expands the May 1, 2025 parent Chain of Eight and does not supersede or move its origin date.'
  )
)
on conflict (source_type, source_identifier)
where source_identifier is not null
do update set
  title = excluded.title,
  publication_date = excluded.publication_date,
  status = excluded.status,
  version_label = excluded.version_label,
  public_summary = excluded.public_summary,
  provenance_role = excluded.provenance_role,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now());

-- Attach the foundational publication to the current 24-link architecture as
-- an ORIGIN record only where the later link is a direct deeper-resolution
-- descendant of one of the parent eight concepts.
--
-- These are chronology/provenance relationships, not assertions that the
-- exact later terminology appeared verbatim in the May 1, 2025 publication.

with origin_source as (
  select id
  from public.ta14_canonical_sources
  where source_type = 'book'
    and source_identifier = 'TA14-CHAIN-OF-EIGHT-ORIGIN-2025-05-01'
),
origin_map(link_order, summary) as (
  values
    (1,  'Admissible Reality is the later deeper-resolution form of the parent Reality position in the May 1, 2025 Chain of Eight.'),
    (2,  'Record is a direct parent-chain element publicly anchored in the May 1, 2025 Chain of Eight.'),
    (3,  'Continuity is a direct parent-chain element publicly anchored in the May 1, 2025 Chain of Eight.'),
    (4,  'Evidence Governance is a later deeper-resolution development within the path from Record and Continuity toward the parent Admissibility position.'),
    (5,  'Admissible Evidence is a later deeper-resolution development within the parent Admissibility position.'),
    (6,  'Admissible Truth is a later deeper-resolution development within the parent Admissibility position.'),
    (7,  'Reliance is a later deeper-resolution development in the path between admissibility and consequence-bearing binding.'),
    (8,  'Authority is a later deeper-resolution development governing who may carry admissible state toward binding and execution.'),
    (9,  'Legitimacy is a later deeper-resolution development governing whether asserted authority may validly participate in the parent execution chain.'),
    (10, 'Consequence Formation is a later deeper-resolution development exposing the formation of consequence before the parent Binding position.'),
    (11, 'Attachment / Assent is a later deeper-resolution development exposing how consequence becomes attached before or through binding.'),
    (12, 'Binding Reality is a later deeper-resolution development immediately preceding the parent Binding position.'),
    (13, 'Binding is a direct parent-chain element publicly anchored in the May 1, 2025 Chain of Eight.'),
    (14, 'Commit Reality is a later deeper-resolution development immediately preceding the parent Commit position.'),
    (15, 'Commit is a direct parent-chain element publicly anchored in the May 1, 2025 Chain of Eight.'),
    (16, 'Execution Reality is a later deeper-resolution development immediately preceding the parent Execution position.'),
    (17, 'Admissible Non-Occurrence is a later deeper-resolution development showing a governed branch in which the parent execution route properly does not occur.'),
    (18, 'Prevented Consequence is a later deeper-resolution development showing the consequence avoided when execution is properly withheld.'),
    (19, 'Execution is a direct parent-chain element publicly anchored in the May 1, 2025 Chain of Eight.'),
    (20, 'Outcome Reality is a later deeper-resolution development immediately preceding the parent Outcome position.'),
    (21, 'Outcome is a direct parent-chain element publicly anchored in the May 1, 2025 Chain of Eight.'),
    (22, 'New Reality is a later recursive development showing the reality produced after Outcome.'),
    (23, 'Memory is a later recursive development preserving prior chain state for future governance.'),
    (24, 'Future Chain is a later recursive development showing how New Reality and Memory become inputs to the next governed chain.')
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
  origin_source.id,
  'origin',
  origin_map.summary,
  true,
  true
from origin_source
cross join origin_map
join public.ta14_canonical_links as links
  on links.link_order = origin_map.link_order
where links.doctrine_state = 'active'
on conflict (link_id, source_id, relation_type)
do update set
  relation_summary = excluded.relation_summary,
  is_primary_provenance = true,
  public_visibility = true,
  updated_at = timezone('utc', now());

-- Validation: the foundational origin source should resolve across all 24
-- current links as parent-origin/deeper-resolution provenance.
do $$
declare
  mapped_count integer;
begin
  select count(*)
  into mapped_count
  from public.ta14_canonical_link_sources as relationships
  join public.ta14_canonical_sources as sources
    on sources.id = relationships.source_id
  where sources.source_identifier = 'TA14-CHAIN-OF-EIGHT-ORIGIN-2025-05-01'
    and relationships.relation_type = 'origin';

  if mapped_count <> 24 then
    raise exception
      'TA-14 foundational origin mapping expected 24 current-link relationships, found %.',
      mapped_count;
  end if;
end;
$$;
