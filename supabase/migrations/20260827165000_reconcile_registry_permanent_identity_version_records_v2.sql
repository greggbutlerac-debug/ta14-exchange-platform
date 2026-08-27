-- TA-14 Registry permanent-identity version continuity reconciliation.
-- Production acceptance corrective migration, executed 2026-08-27.
-- Preserve existing version records; permit multiple immutable versions beneath one permanent TA-14-AIGR identity.

alter table public.ta14_registry_version_records
  drop constraint if exists ta14_registry_version_records_registry_identifier_key;

create index if not exists ta14_registry_version_records_registry_identifier_idx
  on public.ta14_registry_version_records (registry_identifier);

create unique index if not exists ta14_registry_version_records_identity_version_key
  on public.ta14_registry_version_records (registry_identifier, version_label);

insert into public.ta14_registry_version_records (
  series_id, registry_identifier, submission_id, version_label,
  effective_version_date, predecessor_registry_identifier,
  relationship_to_predecessor, baseline_state, implementation_state,
  frozen_at, lineage_statement, evidence_boundary
)
select
  v1.series_id,
  'TA-14-AIGR-000008',
  archived_v2.source_record_id,
  '2.0',
  archived_v2.registered_at::date,
  null,
  'MAJOR_REVISION',
  'FROZEN',
  'DEMONSTRATED',
  archived_v2.finalized_at,
  'Harmonic Constitutional Runtime Version 2.0 is preserved beneath permanent Registry identity TA-14-AIGR-000008 following the governed single-identity correction of 2026-08-10. The historical issuance of TA-14-AIGR-000010 remains preserved as an archived administrative fact and is not reactivated as a separate governance identity.',
  'Version 2.0 stands on its own declarations, evidence, demonstrations, findings, and frozen baseline. No PASS state, finding, evidentiary conclusion, or execution authority is inherited from Version 1.0 merely by shared permanent Registry identity.'
from public.ta14_registry_version_records v1
join public.ta14_registry_public_records canonical
  on canonical.registry_identifier='TA-14-AIGR-000008'
join public.ta14_registry_public_records archived_v2
  on archived_v2.registry_identifier='TA-14-AIGR-000010'
where v1.registry_identifier='TA-14-AIGR-000008'
  and v1.version_label='1.0'
  and canonical.version='2.0'
  and archived_v2.version='2.0'
  and lower(archived_v2.status)='archived'
  and not exists (
    select 1 from public.ta14_registry_version_records x
    where x.registry_identifier='TA-14-AIGR-000008' and x.version_label='2.0'
  );

update public.ta14_registry_public_records r
set current_version_record_id = v.id,
    updated_at = timezone('utc', now())
from public.ta14_registry_version_records v
where r.registry_identifier='TA-14-AIGR-000008'
  and v.registry_identifier=r.registry_identifier
  and v.version_label=r.version
  and r.current_version_record_id is distinct from v.id;
