begin;

-- ============================================================================
-- TA-14 REGISTRY ADMIN NOTIFICATION LIFECYCLE CLOSURE
--
-- Purpose:
-- Keep Registry administration awareness synchronized with the underlying
-- condition without mutating the authoritative governance record.
--
--   review requested
--     -> automatically resolved when the submission no longer requires that
--        waiting-review condition
--
--   registration exception
--     -> automatically resolved when the exception itself is resolved or
--        dismissed
--
-- Notification resolution remains administrative awareness only.
-- ============================================================================


-- ============================================================================
-- REVIEW REQUEST CLOSURE
-- ============================================================================

create or replace function
  public.ta14_registry_close_review_requested_notification_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_key_value text;
  still_waiting boolean;
begin
  notification_key_value :=
    'governance_review_requested:' || new.id::text;

  still_waiting :=
    new.status = 'submitted'
    and new.registry_identifier is null
    and coalesce(
      new.requested_review_pathway,
      'Record-only registration'
    ) not in (
      'Record-only registration',
      'Administrative completeness review'
    );

  if still_waiting then
    return new;
  end if;

  update public.ta14_registry_admin_notifications
  set
    state = 'resolved',
    resolved_at = coalesce(
      resolved_at,
      timezone('utc', now())
    ),
    event_payload =
      coalesce(event_payload, '{}'::jsonb)
      || jsonb_build_object(
        'administrative_resolution',
          'Underlying governance submission no longer remains in the waiting-review condition.',
        'resolved_by',
          'ta14_registry_close_review_requested_notification_v1',
        'submission_status',
          new.status,
        'registry_identifier',
          new.registry_identifier,
        'resolved_condition_at',
          timezone('utc', now())
      )
  where
    notification_key = notification_key_value
    and state <> 'resolved';

  return new;
end;
$$;


revoke all
on function
  public.ta14_registry_close_review_requested_notification_v1()
from public;

revoke all
on function
  public.ta14_registry_close_review_requested_notification_v1()
from anon;

revoke all
on function
  public.ta14_registry_close_review_requested_notification_v1()
from authenticated;


drop trigger if exists
  ta14_registry_close_review_requested_notification
on public.ai_governance_registry_submissions;


create trigger
  ta14_registry_close_review_requested_notification
after update of
  status,
  registry_identifier,
  requested_review_pathway
on public.ai_governance_registry_submissions
for each row
execute function
  public.ta14_registry_close_review_requested_notification_v1();


-- ============================================================================
-- REGISTRATION EXCEPTION CLOSURE
-- ============================================================================

create or replace function
  public.ta14_registry_close_registration_exception_notification_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_key_value text;
begin
  if new.exception_status not in (
    'resolved',
    'dismissed'
  ) then
    return new;
  end if;

  notification_key_value :=
    'governance_registration_exception:' ||
    new.id::text;

  update public.ta14_registry_admin_notifications
  set
    state = 'resolved',
    resolved_at = coalesce(
      resolved_at,
      new.resolved_at,
      timezone('utc', now())
    ),
    event_payload =
      coalesce(event_payload, '{}'::jsonb)
      || jsonb_build_object(
        'administrative_resolution',
          'Underlying registration exception is no longer active.',
        'resolved_by',
          'ta14_registry_close_registration_exception_notification_v1',
        'exception_status',
          new.exception_status,
        'exception_resolved_at',
          new.resolved_at,
        'resolution_summary',
          new.resolution_summary,
        'resolved_condition_at',
          timezone('utc', now())
      )
  where
    notification_key = notification_key_value
    and state <> 'resolved';

  return new;
end;
$$;


revoke all
on function
  public.ta14_registry_close_registration_exception_notification_v1()
from public;

revoke all
on function
  public.ta14_registry_close_registration_exception_notification_v1()
from anon;

revoke all
on function
  public.ta14_registry_close_registration_exception_notification_v1()
from authenticated;


drop trigger if exists
  ta14_registry_close_registration_exception_notification
on public.ta14_registry_registration_exceptions;


create trigger
  ta14_registry_close_registration_exception_notification
after update of
  exception_status,
  resolved_at,
  resolution_summary
on public.ta14_registry_registration_exceptions
for each row
execute function
  public.ta14_registry_close_registration_exception_notification_v1();


-- ============================================================================
-- CURRENT-STATE RECONCILIATION
--
-- Resolve stale review-request alerts that no longer correspond to a waiting
-- human-review submission.
-- ============================================================================

update public.ta14_registry_admin_notifications notification
set
  state = 'resolved',
  resolved_at = coalesce(
    notification.resolved_at,
    timezone('utc', now())
  ),
  event_payload =
    coalesce(notification.event_payload, '{}'::jsonb)
    || jsonb_build_object(
      'administrative_resolution',
        'Reconciled because the underlying submission no longer remains in the waiting-review condition.',
      'resolved_by',
        '20260809150000_ta14_registry_admin_notification_lifecycle_closure'
    )
from public.ai_governance_registry_submissions submission
where
  notification.notification_type =
    'governance_review_requested'
  and notification.submission_id =
    submission.id
  and notification.state <> 'resolved'
  and not (
    submission.status = 'submitted'
    and submission.registry_identifier is null
    and coalesce(
      submission.requested_review_pathway,
      'Record-only registration'
    ) not in (
      'Record-only registration',
      'Administrative completeness review'
    )
  );


-- ============================================================================
-- CURRENT EXCEPTION RECONCILIATION
-- ============================================================================

update public.ta14_registry_admin_notifications notification
set
  state = 'resolved',
  resolved_at = coalesce(
    notification.resolved_at,
    exception_record.resolved_at,
    timezone('utc', now())
  ),
  event_payload =
    coalesce(notification.event_payload, '{}'::jsonb)
    || jsonb_build_object(
      'administrative_resolution',
        'Reconciled because the underlying registration exception is resolved or dismissed.',
      'resolved_by',
        '20260809150000_ta14_registry_admin_notification_lifecycle_closure',
      'exception_status',
        exception_record.exception_status
    )
from public.ta14_registry_registration_exceptions
  exception_record
where
  notification.notification_type =
    'governance_registration_exception'
  and notification.notification_key =
    'governance_registration_exception:' ||
      exception_record.id::text
  and notification.state <> 'resolved'
  and exception_record.exception_status in (
    'resolved',
    'dismissed'
  );


commit;
