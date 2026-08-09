begin;

-- ============================================================================
-- TA-14 REGISTRY ADMIN REVIEW / EXCEPTION AWARENESS
--
-- Expands the existing Registry Administration Inbox so it surfaces:
--
--   1. governance submissions waiting for a non-automatic review pathway;
--   2. governed automatic-registration exceptions requiring attention.
--
-- Existing governance_registered notifications remain unchanged.
--
-- This migration does not alter registration eligibility, review outcomes,
-- Registry identifiers, certification status, endorsement status, or public
-- Registry records.
-- ============================================================================


-- ============================================================================
-- REVIEW-REQUEST NOTIFICATION
--
-- A submission that remains in SUBMITTED state without a Registry Identifier
-- requires administrative awareness.
--
-- This trigger may briefly observe automatic-pathway submissions as SUBMITTED
-- before the automatic finalizer completes. The resulting Inbox event remains
-- a chronology record; when registration completes, the separate
-- governance_registered event is also preserved.
-- ============================================================================

create or replace function
  public.ta14_registry_notify_review_requested_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_key_value text;
begin
  if new.status <> 'submitted' then
    return new;
  end if;

  if new.registry_identifier is not null then
    return new;
  end if;

  if tg_op = 'UPDATE'
     and old.status = new.status
     and old.requested_review_pathway
       is not distinct from new.requested_review_pathway
  then
    return new;
  end if;

  notification_key_value :=
    'governance_review_requested:' || new.id::text;

  insert into public.ta14_registry_admin_notifications (
    notification_key,
    notification_type,
    priority,
    state,

    submission_id,
    registry_identifier,
    governance_name,
    claimant_name,
    organization_name,
    requested_review_pathway,

    title,
    message,
    event_payload,

    occurred_at
  )
  values (
    notification_key_value,
    'governance_review_requested',
    'attention',
    'unread',

    new.id,
    new.registry_identifier,
    new.governance_name,
    new.claimant_name,
    new.organization_name,
    new.requested_review_pathway,

    'Governance review requested',

    format(
      '%s submitted through the %s pathway and is awaiting Registry attention.',
      new.governance_name,
      coalesce(
        nullif(btrim(new.requested_review_pathway), ''),
        'unspecified review'
      )
    ),

    jsonb_build_object(
      'submission_id', new.id,
      'governance_name', new.governance_name,
      'claimant_name', new.claimant_name,
      'organization_name', new.organization_name,
      'contact_email', new.contact_email,
      'requested_review_pathway',
        new.requested_review_pathway,
      'status', new.status,
      'submitted_at', new.submitted_at,
      'source',
        'ai_governance_registry_submissions',
      'requires_administrative_awareness', true,
      'boundary',
        'A request for Registry review is not registration, certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or proof of performance.'
    ),

    coalesce(
      new.submitted_at,
      new.updated_at,
      timezone('utc', now())
    )
  )
  on conflict (notification_key)
  do nothing;

  return new;
end;
$$;

revoke all
  on function public.ta14_registry_notify_review_requested_v1()
  from public;

revoke all
  on function public.ta14_registry_notify_review_requested_v1()
  from anon;

revoke all
  on function public.ta14_registry_notify_review_requested_v1()
  from authenticated;


drop trigger if exists
  ta14_registry_review_requested_admin_notification
  on public.ai_governance_registry_submissions;

create trigger
  ta14_registry_review_requested_admin_notification
after insert or update of status, requested_review_pathway
on public.ai_governance_registry_submissions
for each row
execute function
  public.ta14_registry_notify_review_requested_v1();


-- ============================================================================
-- REGISTRATION-EXCEPTION NOTIFICATION
--
-- The registration-exception table is created by the deployed Registry
-- database architecture and is already consumed by the application.
--
-- Its observed production/application columns include:
--
--   id
--   submission_id
--   owner_user_id
--   exception_status
--   exception_type
--   exception_code
--   exception_summary
--   exception_details
--   readiness_failures
--   resolution_summary
--   opened_at
--   resolved_at
--   updated_at
--
-- An exception is a stronger administrative signal than an ordinary review
-- request, therefore it uses action_required priority.
-- ============================================================================

create or replace function
  public.ta14_registry_notify_registration_exception_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_row
    public.ai_governance_registry_submissions%rowtype;

  notification_key_value text;
begin
  select *
  into submission_row
  from public.ai_governance_registry_submissions
  where id = new.submission_id;

  notification_key_value :=
    'governance_registration_exception:' ||
    new.id::text;

  insert into public.ta14_registry_admin_notifications (
    notification_key,
    notification_type,
    priority,
    state,

    submission_id,
    registry_identifier,
    governance_name,
    claimant_name,
    organization_name,
    requested_review_pathway,

    title,
    message,
    event_payload,

    occurred_at
  )
  values (
    notification_key_value,
    'governance_registration_exception',
    'action_required',
    'unread',

    new.submission_id,
    submission_row.registry_identifier,
    coalesce(
      submission_row.governance_name,
      'Governance registration'
    ),
    submission_row.claimant_name,
    submission_row.organization_name,
    submission_row.requested_review_pathway,

    'Registration exception requires attention',

    format(
      '%s could not complete automatic registration and requires Registry attention.',
      coalesce(
        submission_row.governance_name,
        'A governance registration'
      )
    ),

    jsonb_build_object(
      'submission_id', new.submission_id,
      'exception_id', new.id,
      'exception_status', new.exception_status,
      'exception_type', new.exception_type,
      'exception_code', new.exception_code,
      'exception_summary', new.exception_summary,
      'exception_details', new.exception_details,
      'readiness_failures', new.readiness_failures,
      'opened_at', new.opened_at,
      'contact_email', submission_row.contact_email,
      'requested_review_pathway',
        submission_row.requested_review_pathway,
      'source',
        'ta14_registry_registration_exceptions',
      'requires_administrative_action', true,
      'boundary',
        'A registration exception concerns registration readiness and does not constitute certification, endorsement, technical validation, legal approval, regulatory approval, or a merits finding concerning the governance architecture.'
    ),

    coalesce(
      new.opened_at,
      new.updated_at,
      timezone('utc', now())
    )
  )
  on conflict (notification_key)
  do nothing;

  return new;
end;
$$;

revoke all
  on function
    public.ta14_registry_notify_registration_exception_v1()
  from public;

revoke all
  on function
    public.ta14_registry_notify_registration_exception_v1()
  from anon;

revoke all
  on function
    public.ta14_registry_notify_registration_exception_v1()
  from authenticated;


drop trigger if exists
  ta14_registry_registration_exception_admin_notification
  on public.ta14_registry_registration_exceptions;

create trigger
  ta14_registry_registration_exception_admin_notification
after insert
on public.ta14_registry_registration_exceptions
for each row
execute function
  public.ta14_registry_notify_registration_exception_v1();


-- ============================================================================
-- BACKFILL CURRENT WAITING SUBMISSIONS
--
-- Makes already-submitted, non-registered governance records visible in the
-- Administration Inbox after deployment.
-- ============================================================================

insert into public.ta14_registry_admin_notifications (
  notification_key,
  notification_type,
  priority,
  state,

  submission_id,
  registry_identifier,
  governance_name,
  claimant_name,
  organization_name,
  requested_review_pathway,

  title,
  message,
  event_payload,

  occurred_at
)
select
  'governance_review_requested:' ||
    submission.id::text,

  'governance_review_requested',
  'attention',
  'unread',

  submission.id,
  submission.registry_identifier,
  submission.governance_name,
  submission.claimant_name,
  submission.organization_name,
  submission.requested_review_pathway,

  'Governance review requested',

  format(
    '%s submitted through the %s pathway and is awaiting Registry attention.',
    submission.governance_name,
    coalesce(
      nullif(
        btrim(submission.requested_review_pathway),
        ''
      ),
      'unspecified review'
    )
  ),

  jsonb_build_object(
    'submission_id', submission.id,
    'governance_name', submission.governance_name,
    'claimant_name', submission.claimant_name,
    'organization_name', submission.organization_name,
    'contact_email', submission.contact_email,
    'requested_review_pathway',
      submission.requested_review_pathway,
    'status', submission.status,
    'submitted_at', submission.submitted_at,
    'source', 'migration_backfill',
    'requires_administrative_awareness', true
  ),

  coalesce(
    submission.submitted_at,
    submission.updated_at,
    submission.created_at
  )

from public.ai_governance_registry_submissions
  as submission

where
  submission.status = 'submitted'
  and submission.registry_identifier is null

on conflict (notification_key)
do nothing;


-- ============================================================================
-- BACKFILL OPEN REGISTRATION EXCEPTIONS
--
-- Existing unresolved exceptions become visible immediately.
-- ============================================================================

insert into public.ta14_registry_admin_notifications (
  notification_key,
  notification_type,
  priority,
  state,

  submission_id,
  registry_identifier,
  governance_name,
  claimant_name,
  organization_name,
  requested_review_pathway,

  title,
  message,
  event_payload,

  occurred_at
)
select
  'governance_registration_exception:' ||
    exception_record.id::text,

  'governance_registration_exception',
  'action_required',
  'unread',

  exception_record.submission_id,
  submission.registry_identifier,
  coalesce(
    submission.governance_name,
    'Governance registration'
  ),
  submission.claimant_name,
  submission.organization_name,
  submission.requested_review_pathway,

  'Registration exception requires attention',

  format(
    '%s has an unresolved registration exception requiring Registry attention.',
    coalesce(
      submission.governance_name,
      'A governance registration'
    )
  ),

  jsonb_build_object(
    'submission_id', exception_record.submission_id,
    'exception_id', exception_record.id,
    'exception_status',
      exception_record.exception_status,
    'exception_type',
      exception_record.exception_type,
    'exception_code',
      exception_record.exception_code,
    'exception_summary',
      exception_record.exception_summary,
    'exception_details',
      exception_record.exception_details,
    'readiness_failures',
      exception_record.readiness_failures,
    'opened_at',
      exception_record.opened_at,
    'contact_email',
      submission.contact_email,
    'source',
      'migration_backfill',
    'requires_administrative_action',
      true
  ),

  coalesce(
    exception_record.opened_at,
    exception_record.updated_at,
    timezone('utc', now())
  )

from public.ta14_registry_registration_exceptions
  as exception_record

left join public.ai_governance_registry_submissions
  as submission
  on submission.id =
    exception_record.submission_id

where
  exception_record.exception_status in (
    'open',
    'correction_required',
    'under_review'
  )

on conflict (notification_key)
do nothing;


commit;
