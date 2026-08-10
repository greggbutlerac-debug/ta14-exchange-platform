-- TA-14 Governance Life-History Foundation
-- One governance identity; many immutable progression events beneath it.

begin;

create table if not exists public.ta14_governance_life_history_events (
  id uuid primary key default gen_random_uuid(),
  registry_identifier text not null,
  event_key text not null unique,
  event_type text not null check (event_type in (
    'registration','version','artifact','finding','gap_opened','gap_closed',
    'participant_review','participant_response','evidence_challenge',
    'factual_correction','technical_comment','demonstration','examination','external_publication'
  )),
  event_date timestamptz not null,
  title text not null,
  summary text,
  governance_version text,
  artifact_identifier text,
  demonstration_identifier text,
  related_record_href text,
  evidence_state text,
  publication_state text not null default 'published' check (publication_state in ('draft','controlled','published','withdrawn')),
  sequence_number integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (registry_identifier, sequence_number)
);

create index if not exists ta14_governance_life_history_registry_idx
  on public.ta14_governance_life_history_events (registry_identifier, event_date, sequence_number);

alter table public.ta14_governance_life_history_events enable row level security;

revoke all on table public.ta14_governance_life_history_events from anon;
revoke all on table public.ta14_governance_life_history_events from authenticated;
grant select on table public.ta14_governance_life_history_events to anon;
grant select on table public.ta14_governance_life_history_events to authenticated;

drop policy if exists "Public can read published governance life history" on public.ta14_governance_life_history_events;
create policy "Public can read published governance life history"
on public.ta14_governance_life_history_events
for select
to anon, authenticated
using (publication_state = 'published');

create or replace view public.ta14_governance_life_history_public_v1 as
select
  registry_identifier,
  event_key,
  event_type,
  event_date,
  title,
  summary,
  governance_version,
  artifact_identifier,
  demonstration_identifier,
  related_record_href,
  evidence_state,
  sequence_number,
  metadata
from public.ta14_governance_life_history_events
where publication_state = 'published';

grant select on public.ta14_governance_life_history_public_v1 to anon, authenticated;

-- Harmonic is the first live progression model. These events preserve the
-- permanent identity while making version and artifact progression explicit.
insert into public.ta14_governance_life_history_events (
  registry_identifier,event_key,event_type,event_date,title,summary,
  governance_version,artifact_identifier,demonstration_identifier,
  related_record_href,evidence_state,sequence_number,metadata
)
values
(
  'TA-14-AIGR-000008','harmonic-registration','registration','2026-08-07T00:00:00Z',
  'Governance identity entered the TA-14 public record',
  'Harmonic Constitutional Runtime established its permanent TA-14 governance identity. Later versions remain beneath this identifier rather than creating additional governances.',
  '1.0',null,null,'/workspace/ai-governance/registry/records/TA-14-AIGR-000008','registered',10,
  '{"institutional_rule":"one governance identity; many versions"}'::jsonb
),
(
  'TA-14-AIGR-000008','harmonic-case-001','artifact','2026-08-07T12:00:00Z',
  'Artifact 001 — governed baseline',
  'The first Harmonic governed artifact established a bounded evidence baseline and preserved the initial review state for later comparison.',
  '1.0','FD-2026-0002-CASE-001','FD-2026-0002',
  '/artifacts/fd-2026-0002-case-001','baseline_preserved',20,
  '{"case":"001","role":"baseline"}'::jsonb
),
(
  'TA-14-AIGR-000008','harmonic-case-002','artifact','2026-08-08T12:00:00Z',
  'Artifact 002 — progression record',
  'The second governed artifact preserved the next evidence state so Harmonic development can be compared against the earlier baseline without rewriting it.',
  '2.0','FD-2026-0002-CASE-002','FD-2026-0002',
  '/artifacts/fd-2026-0002-case-002','progression_preserved',30,
  '{"case":"002","role":"progression"}'::jsonb
),
(
  'TA-14-AIGR-000008','harmonic-version-2','version','2026-08-08T12:01:00Z',
  'Current architecture version advanced to 2.0',
  'Version 2.0 is preserved as evolution of the same Harmonic governance identity, not as a second registered governance.',
  '2.0',null,null,null,'version_lineage_preserved',40,
  '{"supersedes_version":"1.0","canonical_registry_identifier":"TA-14-AIGR-000008"}'::jsonb
)
on conflict (event_key) do nothing;

commit;
