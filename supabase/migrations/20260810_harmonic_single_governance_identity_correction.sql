-- TA-14 AI Governance Registry
-- Harmonic Single Governance Identity Correction
-- File: 20260810_harmonic_single_governance_identity_correction.sql
--
-- Purpose:
--   Correct the early Registry treatment of Harmonic Version 2.0 as a second
--   public governance identity. Harmonic remains one governance architecture
--   under permanent Registry identifier TA-14-AIGR-000008. Version 2.0 remains
--   preserved as version/progression history and as the evidentiary basis for
--   Artifact 002; it is not counted or displayed as another governance.
--
-- Institutional rule established by this correction:
--   One governance architecture = one permanent TA-14-AIGR identifier.
--   Governance versions and governed artifacts evolve beneath that identity.
--
-- Preservation boundary:
--   This correction does not erase Version 2 evidence, Artifact 002, findings,
--   chronology, or the historical fact that TA-14-AIGR-000010 was issued during
--   early Registry implementation. It removes 000010 from the active/public
--   governance-identity surface and records the consolidation administratively.

begin;

create table if not exists public.ta14_registry_administrative_corrections (
  id uuid primary key default gen_random_uuid(),
  correction_key text not null unique,
  affected_registry_identifier text not null,
  canonical_registry_identifier text not null,
  correction_type text not null,
  reason text not null,
  preservation_note text not null,
  corrected_at timestamptz not null default timezone('utc', now())
);

revoke all on table public.ta14_registry_administrative_corrections from public;
revoke all on table public.ta14_registry_administrative_corrections from anon;
revoke all on table public.ta14_registry_administrative_corrections from authenticated;

insert into public.ta14_registry_administrative_corrections (
  correction_key,
  affected_registry_identifier,
  canonical_registry_identifier,
  correction_type,
  reason,
  preservation_note
)
values (
  'harmonic-v2-duplicate-governance-identity-20260810',
  'TA-14-AIGR-000010',
  'TA-14-AIGR-000008',
  'EARLY_REGISTRY_IDENTITY_CONSOLIDATION',
  'Harmonic Constitutional Runtime Version 2.0 was issued a second governance Registry identifier during early implementation. TA-14 Registry policy now treats governance identity as permanent across versions.',
  'Version 2.0 evidence, chronology, Artifact 002, review findings, and historical references remain preserved. The correction changes governance-identity classification and public counting only.'
)
on conflict (correction_key) do nothing;

-- Keep the canonical Harmonic governance identity public and current.
-- The version field reflects the current declared architecture version while
-- the permanent governance identifier remains unchanged.
update public.ta14_registry_public_records
set
  version = '2.0',
  updated_at = timezone('utc', now())
where registry_identifier = 'TA-14-AIGR-000008';

-- Remove the duplicate/version record from the public governance front without
-- deleting it. Controlled/private preservation keeps the historical row
-- available for institutional reconciliation and artifact provenance.
update public.ta14_registry_public_records
set
  status = 'Archived',
  visibility = 'controlled',
  is_published = false,
  published_at = null,
  updated_at = timezone('utc', now())
where registry_identifier = 'TA-14-AIGR-000010';

-- Retire the public two-identity version-series projection. Version lineage now
-- belongs beneath the canonical governance identity rather than beside it.
update public.ta14_registry_version_series
set
  status = 'archived',
  visibility = 'controlled',
  is_published = false,
  updated_at = timezone('utc', now())
where series_identifier = 'TA-14-AIVS-000001';

-- If a separate public Governance Profile was created for 000010, archive it so
-- the public Governance Profiles surface contains one Harmonic identity.
update public.ta14_governance_profiles
set
  profile_status = 'archived',
  updated_at = timezone('utc', now())
where registry_identifier = 'TA-14-AIGR-000010'
  and lower(profile_status) <> 'archived';

-- Advance the canonical Harmonic profile to the current version while retaining
-- its original governance Registry identity.
update public.ta14_governance_profiles
set
  governance_version = '2.0',
  updated_at = timezone('utc', now())
where registry_identifier = 'TA-14-AIGR-000008';

commit;
