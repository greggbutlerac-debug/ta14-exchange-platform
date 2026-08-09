begin;

-- ============================================================================
-- TA-14 REGISTRY UNIVERSAL SUBMISSION-RECEIVED AWARENESS
--
-- Problem corrected:
--   Automatic registration pathways were intentionally excluded from the
--   governance_review_requested notification because their SUBMITTED state may
--   be transient. That is correct for review semantics, but it left no
--   universal administrative awareness event proving that a participant had
--   completed and submitted Governance Entity Registration.
--
-- Result:
--   Every governance submission creates exactly one unread
--   governance_submission_received notification as soon as it reaches a
--   submitted or registered state. Automatic pathways are NOT excluded.
--
--   A later governance_registered event remains separate and continues to mean
--   that registration completed and a permanent Registry Identifier exists.
--
-- Boundary:
--   Submission received != registration completed != public publication !=
--   certification, endorsement, validation, approval, or patent determination.
-- ============================================================================

create or replace function
  public.ta14_registry_notify_submission_received_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_key_value text;
  occurred_at_value timestamptz;
begin
  -- Draft records are not completed submissions.
  if new.status not in ('submitted', 'registered') then
    return new;
  end if;

  notification_key_value :=
    'governance_submission_received:' || new.id::text;

  occurred_at_value := coalesce(
    new.submitted_at,
    new.accepted_at,
    new.updated_at,
    new.created_at,
    timezone('utc', now())
  );

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
    'governance_submission_received',
    'attention',
    'unread',

    new.id,
    new.registry_identifier,
    new.governance_name,
    new.claimant_name,
    new.organization_name,
    new.requested_review_pathway,

    'Governance registration submission received',

    format(
      '%s submitted a Governance Entity Registration record. Registry processing state: %s.',
      coalesce(nullif(btrim(new.governance_name), ''), 'A governance entity'),
      new.status
    ),

    jsonb_build_object(
      'submission_id', new.id,
      'registry_identifier', new.registry_identifier,
      'governance_name', new.governance_name,
      'claimant_name', new.claimant_name,
      'organization_name', new.organization_name,
      'contact_email', new.contact_email,
      'requested_review_pathway', new.requested_review_pathway,
      'status', new.status,
      'submitted_at', new.submitted_at,
      'accepted_at', new.accepted_at,
      'source', 'ai_governance_registry_submissions',
      'automatic_pathways_included', true,
      'requires_administrative_awareness', true,
      'boundary',
        'Submission received means the participant completed and submitted a Governance Entity Registration record. It does not by itself mean registration completed, public publication occurred, certification was granted, endorsement was issued, technical performance was validated, legal or regulatory approval was obtained, ownership was adjudicated, or patent scope was determined.'
    ),

    occurred_at_value
  )
  on conflict (notification_key)
  do update set
    registry_identifier = excluded.registry_identifier,
    governance_name = excluded.governance_name,
    claimant_name = excluded.claimant_name,
    organization_name = excluded.organization_name,
    requested_review_pathway = excluded.requested_review_pathway,
    message = excluded.message,
    event_payload =
      public.ta14_registry_admin_notifications.event_payload ||
      excluded.event_payload;

  return new;
end;
$$;

revoke all
  on function public.ta14_registry_notify_submission_received_v1()
  from public;

revoke all
  on function public.ta14_registry_notify_submission_received_v1()
  from anon;

revoke all
  on function public.ta14_registry_notify_submission_received_v1()
  from authenticated;

-- Observe both initial inserts and subsequent transitions out of draft.
drop trigger if exists
  ta14_registry_submission_received_admin_notification
  on public.ai_governance_registry_submissions;

create trigger
  ta14_registry_submission_received_admin_notification
after insert or update of status, submitted_at
on public.ai_governance_registry_submissions
for each row
execute function
  public.ta14_registry_notify_submission_received_v1();

-- ============================================================================
-- BACKFILL
--
-- Any submission that has already reached SUBMITTED or REGISTERED state now
-- receives the universal submission-received awareness event if it did not
-- already have one. This is deliberately independent of review pathway.
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
  'governance_submission_received:' || submission.id::text,
  'governance_submission_received',
  'attention',
  'unread',

  submission.id,
  submission.registry_identifier,
  submission.governance_name,
  submission.claimant_name,
  submission.organization_name,
  submission.requested_review_pathway,

  'Governance registration submission received',

  format(
    '%s submitted a Governance Entity Registration record. Registry processing state: %s.',
    coalesce(nullif(btrim(submission.governance_name), ''), 'A governance entity'),
    submission.status
  ),

  jsonb_build_object(
    'submission_id', submission.id,
    'registry_identifier', submission.registry_identifier,
    'governance_name', submission.governance_name,
    'claimant_name', submission.claimant_name,
    'organization_name', submission.organization_name,
    'contact_email', submission.contact_email,
    'requested_review_pathway', submission.requested_review_pathway,
    'status', submission.status,
    'submitted_at', submission.submitted_at,
    'accepted_at', submission.accepted_at,
    'source', 'migration_backfill',
    'automatic_pathways_included', true,
    'requires_administrative_awareness', true
  ),

  coalesce(
    submission.submitted_at,
    submission.accepted_at,
    submission.updated_at,
    submission.created_at
  )

from public.ai_governance_registry_submissions as submission
where submission.status in ('submitted', 'registered')
on conflict (notification_key)
do update set
  registry_identifier = excluded.registry_identifier,
  governance_name = excluded.governance_name,
  claimant_name = excluded.claimant_name,
  organization_name = excluded.organization_name,
  requested_review_pathway = excluded.requested_review_pathway,
  message = excluded.message,
  event_payload =
    public.ta14_registry_admin_notifications.event_payload ||
    excluded.event_payload;

-- Helpful index for the new awareness class.
create index if not exists
  ta14_registry_admin_notifications_submission_received_idx
on public.ta14_registry_admin_notifications (
  notification_type,
  occurred_at desc
)
where notification_type = 'governance_submission_received';

comment on function public.ta14_registry_notify_submission_received_v1() is
  'Creates one universal administrative awareness event when a Governance Entity Registration reaches submitted or registered state, including automatic registration pathways.';

commit;
