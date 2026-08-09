begin;

-- ============================================================================
-- TA-14 AUTHORITATIVE REGISTRATION LIFECYCLE TELEMETRY
--
-- Browser telemetry remains useful for:
--
--   registration_page_opened
--   registration_started
--   draft_saved
--   registration_failed
--
-- But SUBMITTED and REGISTERED are authoritative database states. Their
-- lifecycle telemetry should therefore be emitted from the database itself,
-- not depend on browser navigation timing.
--
-- This migration:
--
--   1. deduplicates existing authoritative lifecycle milestones;
--   2. installs a partial unique index per submission/event;
--   3. installs a trigger that emits submission_submitted and
--      registration_completed directly from authoritative Registry state.
--
-- Lifecycle telemetry remains administrative visibility only.
-- ============================================================================


-- ============================================================================
-- DEDUPLICATE EXISTING AUTHORITATIVE MILESTONES
-- ============================================================================

with ranked as (
  select
    id,
    row_number() over (
      partition by submission_id, event_type
      order by
        occurred_at asc,
        created_at asc,
        id asc
    ) as event_rank
  from public.ta14_registry_registration_lifecycle_events
  where
    submission_id is not null
    and event_type in (
      'submission_submitted',
      'registration_completed'
    )
)
delete from public.ta14_registry_registration_lifecycle_events event_record
using ranked
where
  ranked.id = event_record.id
  and ranked.event_rank > 1;


-- ============================================================================
-- ONE AUTHORITATIVE MILESTONE PER SUBMISSION
-- ============================================================================

create unique index if not exists
  ta14_registry_registration_lifecycle_authoritative_milestone_uidx
on public.ta14_registry_registration_lifecycle_events (
  submission_id,
  event_type
)
where
  submission_id is not null
  and event_type in (
    'submission_submitted',
    'registration_completed'
  );


-- ============================================================================
-- AUTHORITATIVE STATE TRIGGER
-- ============================================================================

create or replace function
  public.ta14_registry_emit_authoritative_lifecycle_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submitted_timestamp timestamptz;
  registered_timestamp timestamptz;
begin
  -- --------------------------------------------------------------------------
  -- SUBMITTED
  -- --------------------------------------------------------------------------

  if
    new.status = 'submitted'
    and (
      tg_op = 'INSERT'
      or old.status is distinct from new.status
    )
  then
    submitted_timestamp :=
      coalesce(
        new.submitted_at,
        new.updated_at,
        timezone('utc', now())
      );

    insert into public.ta14_registry_registration_lifecycle_events (
      user_id,
      submission_id,
      event_type,
      source,
      governance_name,
      organization_name,
      contact_email,
      event_payload,
      occurred_at
    )
    values (
      new.owner_user_id,
      new.id,
      'submission_submitted',
      'system',
      new.governance_name,
      new.organization_name,
      new.contact_email,
      jsonb_build_object(
        'authoritative', true,
        'status', new.status,
        'requested_review_pathway',
          new.requested_review_pathway,
        'submitted_at',
          new.submitted_at,
        'recorded_by',
          'ta14_registry_emit_authoritative_lifecycle_v1'
      ),
      submitted_timestamp
    )
    on conflict (
      submission_id,
      event_type
    )
    where
      submission_id is not null
      and event_type in (
        'submission_submitted',
        'registration_completed'
      )
    do nothing;
  end if;


  -- --------------------------------------------------------------------------
  -- REGISTERED
  -- --------------------------------------------------------------------------

  if
    new.status = 'registered'
    and new.registry_identifier is not null
    and (
      tg_op = 'INSERT'
      or old.status is distinct from new.status
      or old.registry_identifier is distinct from new.registry_identifier
    )
  then
    registered_timestamp :=
      coalesce(
        new.accepted_at,
        new.updated_at,
        timezone('utc', now())
      );

    insert into public.ta14_registry_registration_lifecycle_events (
      user_id,
      submission_id,
      event_type,
      source,
      governance_name,
      organization_name,
      contact_email,
      event_payload,
      occurred_at
    )
    values (
      new.owner_user_id,
      new.id,
      'registration_completed',
      'system',
      new.governance_name,
      new.organization_name,
      new.contact_email,
      jsonb_build_object(
        'authoritative', true,
        'status', new.status,
        'registry_identifier',
          new.registry_identifier,
        'accepted_at',
          new.accepted_at,
        'requested_review_pathway',
          new.requested_review_pathway,
        'recorded_by',
          'ta14_registry_emit_authoritative_lifecycle_v1'
      ),
      registered_timestamp
    )
    on conflict (
      submission_id,
      event_type
    )
    where
      submission_id is not null
      and event_type in (
        'submission_submitted',
        'registration_completed'
      )
    do nothing;
  end if;

  return new;
end;
$$;


revoke all
on function
  public.ta14_registry_emit_authoritative_lifecycle_v1()
from public;

revoke all
on function
  public.ta14_registry_emit_authoritative_lifecycle_v1()
from anon;

revoke all
on function
  public.ta14_registry_emit_authoritative_lifecycle_v1()
from authenticated;


drop trigger if exists
  ta14_registry_authoritative_lifecycle
on public.ai_governance_registry_submissions;


create trigger
  ta14_registry_authoritative_lifecycle
after insert or update of
  status,
  registry_identifier,
  submitted_at,
  accepted_at
on public.ai_governance_registry_submissions
for each row
execute function
  public.ta14_registry_emit_authoritative_lifecycle_v1();


-- ============================================================================
-- BACKFILL EXISTING AUTHORITATIVE STATES
--
-- Existing Registry records predate telemetry. Add only the two authoritative
-- milestones so historical journeys have a trustworthy submitted/registered
-- floor without fabricating page-open/start events.
-- ============================================================================

insert into public.ta14_registry_registration_lifecycle_events (
  user_id,
  submission_id,
  event_type,
  source,
  governance_name,
  organization_name,
  contact_email,
  event_payload,
  occurred_at
)
select
  submission.owner_user_id,
  submission.id,
  'submission_submitted',
  'system',
  submission.governance_name,
  submission.organization_name,
  submission.contact_email,
  jsonb_build_object(
    'authoritative', true,
    'historical_backfill', true,
    'status', submission.status,
    'requested_review_pathway',
      submission.requested_review_pathway,
    'submitted_at',
      submission.submitted_at,
    'recorded_by',
      '20260809151500_ta14_registry_authoritative_lifecycle_telemetry'
  ),
  coalesce(
    submission.submitted_at,
    submission.created_at
  )
from public.ai_governance_registry_submissions submission
where
  submission.submitted_at is not null
  or submission.status in (
    'submitted',
    'registered'
  )
on conflict (
  submission_id,
  event_type
)
where
  submission_id is not null
  and event_type in (
    'submission_submitted',
    'registration_completed'
  )
do nothing;


insert into public.ta14_registry_registration_lifecycle_events (
  user_id,
  submission_id,
  event_type,
  source,
  governance_name,
  organization_name,
  contact_email,
  event_payload,
  occurred_at
)
select
  submission.owner_user_id,
  submission.id,
  'registration_completed',
  'system',
  submission.governance_name,
  submission.organization_name,
  submission.contact_email,
  jsonb_build_object(
    'authoritative', true,
    'historical_backfill', true,
    'status', submission.status,
    'registry_identifier',
      submission.registry_identifier,
    'accepted_at',
      submission.accepted_at,
    'requested_review_pathway',
      submission.requested_review_pathway,
    'recorded_by',
      '20260809151500_ta14_registry_authoritative_lifecycle_telemetry'
  ),
  coalesce(
    submission.accepted_at,
    submission.updated_at,
    submission.created_at
  )
from public.ai_governance_registry_submissions submission
where
  submission.status = 'registered'
  and submission.registry_identifier is not null
on conflict (
  submission_id,
  event_type
)
where
  submission_id is not null
  and event_type in (
    'submission_submitted',
    'registration_completed'
  )
do nothing;


commit;
