begin;

-- ============================================================================
-- TA-14 REGISTRY FAILED REGISTRATION ADMIN NOTIFICATIONS
--
-- Purpose:
--   Promote authoritative registration-failure telemetry into immediate
--   administrative awareness so a participant cannot fail during Governance
--   Entity Registration without appearing in the Registry Administration
--   Inbox.
--
-- Boundary:
--   Lifecycle telemetry remains operational evidence only. This notification
--   does not create, approve, register, publish, certify, endorse, validate,
--   or adjudicate the governance entity or submission.
-- ============================================================================

create or replace function
  public.ta14_registry_notify_registration_failed_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_record public.ai_governance_registry_submissions%rowtype;
  governance_name_value text;
  claimant_name_value text;
  organization_name_value text;
  review_pathway_value text;
  registry_identifier_value text;
  contact_email_value text;
  notification_key_value text;
begin
  if new.event_type <> 'registration_failed' then
    return new;
  end if;

  if new.submission_id is not null then
    select *
      into submission_record
      from public.ai_governance_registry_submissions
     where id = new.submission_id;
  end if;

  governance_name_value := coalesce(
    nullif(btrim(new.governance_name), ''),
    nullif(btrim(submission_record.governance_name), ''),
    nullif(btrim(new.organization_name), ''),
    nullif(btrim(submission_record.organization_name), ''),
    nullif(btrim(new.contact_email), ''),
    nullif(btrim(submission_record.contact_email), ''),
    'Unidentified governance registration attempt'
  );

  claimant_name_value := nullif(btrim(submission_record.claimant_name), '');

  organization_name_value := coalesce(
    nullif(btrim(new.organization_name), ''),
    nullif(btrim(submission_record.organization_name), '')
  );

  review_pathway_value :=
    nullif(btrim(submission_record.requested_review_pathway), '');

  registry_identifier_value :=
    nullif(btrim(submission_record.registry_identifier), '');

  contact_email_value := coalesce(
    nullif(btrim(new.contact_email), ''),
    nullif(btrim(submission_record.contact_email), '')
  );

  notification_key_value :=
    'governance_registration_failed:' || new.id::text;

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
    'governance_registration_failed',
    'action_required',
    'unread',
    new.submission_id,
    registry_identifier_value,
    governance_name_value,
    claimant_name_value,
    organization_name_value,
    review_pathway_value,
    'Governance registration failed',
    format(
      '%s encountered a Governance Entity Registration failure and requires administrative attention.',
      governance_name_value
    ),
    jsonb_build_object(
      'lifecycle_event_id', new.id,
      'user_id', new.user_id,
      'submission_id', new.submission_id,
      'session_key', new.session_key,
      'governance_name', governance_name_value,
      'claimant_name', claimant_name_value,
      'organization_name', organization_name_value,
      'contact_email', contact_email_value,
      'registry_identifier', registry_identifier_value,
      'requested_review_pathway', review_pathway_value,
      'source', new.source,
      'failure_payload', coalesce(new.event_payload, '{}'::jsonb),
      'occurred_at', new.occurred_at,
      'requires_administrative_awareness', true,
      'boundary',
        'A registration failure notification records an interrupted or unsuccessful registration journey. It does not establish that a Governance Entity Registration was successfully submitted, registered, accepted, publicly published, certified, endorsed, validated, or approved.'
    ),
    new.occurred_at
  )
  on conflict (notification_key)
  do update set
    submission_id = excluded.submission_id,
    registry_identifier = excluded.registry_identifier,
    governance_name = excluded.governance_name,
    claimant_name = excluded.claimant_name,
    organization_name = excluded.organization_name,
    requested_review_pathway = excluded.requested_review_pathway,
    priority = 'action_required',
    state = case
      when public.ta14_registry_admin_notifications.state = 'resolved'
        then public.ta14_registry_admin_notifications.state
      else 'unread'
    end,
    message = excluded.message,
    event_payload =
      public.ta14_registry_admin_notifications.event_payload ||
      excluded.event_payload,
    occurred_at = excluded.occurred_at;

  return new;
end;
$$;

revoke all
  on function public.ta14_registry_notify_registration_failed_v1()
  from public;

revoke all
  on function public.ta14_registry_notify_registration_failed_v1()
  from anon;

revoke all
  on function public.ta14_registry_notify_registration_failed_v1()
  from authenticated;

drop trigger if exists
  ta14_registry_registration_failed_admin_notification
  on public.ta14_registry_registration_lifecycle_events;

create trigger
  ta14_registry_registration_failed_admin_notification
after insert
on public.ta14_registry_registration_lifecycle_events
for each row
when (new.event_type = 'registration_failed')
execute function
  public.ta14_registry_notify_registration_failed_v1();

-- Backfill previously recorded failures so existing left-behind registrants
-- become visible immediately after this migration is applied.
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
  'governance_registration_failed:' || lifecycle.id::text,
  'governance_registration_failed',
  'action_required',
  'unread',
  lifecycle.submission_id,
  submission.registry_identifier,
  coalesce(
    nullif(btrim(lifecycle.governance_name), ''),
    nullif(btrim(submission.governance_name), ''),
    nullif(btrim(lifecycle.organization_name), ''),
    nullif(btrim(submission.organization_name), ''),
    nullif(btrim(lifecycle.contact_email), ''),
    nullif(btrim(submission.contact_email), ''),
    'Unidentified governance registration attempt'
  ),
  submission.claimant_name,
  coalesce(
    nullif(btrim(lifecycle.organization_name), ''),
    nullif(btrim(submission.organization_name), '')
  ),
  submission.requested_review_pathway,
  'Governance registration failed',
  format(
    '%s encountered a Governance Entity Registration failure and requires administrative attention.',
    coalesce(
      nullif(btrim(lifecycle.governance_name), ''),
      nullif(btrim(submission.governance_name), ''),
      nullif(btrim(lifecycle.organization_name), ''),
      nullif(btrim(submission.organization_name), ''),
      nullif(btrim(lifecycle.contact_email), ''),
      nullif(btrim(submission.contact_email), ''),
      'Unidentified governance registration attempt'
    )
  ),
  jsonb_build_object(
    'lifecycle_event_id', lifecycle.id,
    'user_id', lifecycle.user_id,
    'submission_id', lifecycle.submission_id,
    'session_key', lifecycle.session_key,
    'governance_name', lifecycle.governance_name,
    'organization_name', lifecycle.organization_name,
    'contact_email', coalesce(lifecycle.contact_email, submission.contact_email),
    'source', 'migration_backfill',
    'failure_payload', coalesce(lifecycle.event_payload, '{}'::jsonb),
    'occurred_at', lifecycle.occurred_at,
    'requires_administrative_awareness', true
  ),
  lifecycle.occurred_at
from public.ta14_registry_registration_lifecycle_events as lifecycle
left join public.ai_governance_registry_submissions as submission
  on submission.id = lifecycle.submission_id
where lifecycle.event_type = 'registration_failed'
on conflict (notification_key)
do nothing;

create index if not exists
  ta14_registry_admin_notifications_registration_failed_idx
on public.ta14_registry_admin_notifications (
  notification_type,
  state,
  occurred_at desc
)
where notification_type = 'governance_registration_failed';

commit;
