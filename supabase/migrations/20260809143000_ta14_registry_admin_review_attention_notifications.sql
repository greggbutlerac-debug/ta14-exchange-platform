begin;

-- ============================================================================
-- TA-14 REGISTRY ADMIN AWARENESS EXPANSION
--
-- Adds administrator notifications for governance submissions that require
-- human attention after the participant submits them.
--
-- Existing governance_registered notifications remain unchanged.
--
-- New notification types:
--   governance_review_requested
--   governance_registration_exception
--
-- This does not alter registration eligibility, review findings, identifiers,
-- or authoritative Registry state.
-- ============================================================================

alter table public.ta14_registry_admin_notifications
  drop constraint if exists
    ta14_registry_admin_notifications_notification_type_check;

alter table public.ta14_registry_admin_notifications
  add constraint
    ta14_registry_admin_notifications_notification_type_check
  check (
    notification_type in (
      'governance_registered',
      'governance_review_requested',
      'governance_registration_exception'
    )
  );


-- ============================================================================
-- REVIEW-REQUEST NOTIFICATION
--
-- Fires when a governance submission enters SUBMITTED and remains without a
-- Registry Identifier. Automatic pathways that immediately reach REGISTERED
-- are not left as review requests.
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
     and old.requested_review_pathway is not distinct from new.requested_review_pathway
  then
    return new;
  end if;

  notification_key_value :=
    'governance_review_requested:' || new.id::text;

  insert into public.ta14_registry_admin_notifications (
    notification_key,
    notification_type,
    priority,
    registry_submission_id,
    registry_identifier,
    governance_name,
    claimant_name,
    organization_name,
    contact_email,
    requested_review_pathway,
    registry_status,
    occurred_at,
    title,
    message,
    metadata
  )
  values (
    notification_key_value,
    'governance_review_requested',
    'attention',
    new.id,
    new.registry_identifier,
    new.governance_name,
    new.claimant_name,
    new.organization_name,
    new.contact_email,
    new.requested_review_pathway,
    new.status,
    coalesce(new.submitted_at, new.updated_at, now()),
    'Governance review requested',
    concat(
      coalesce(new.governance_name, 'A governance entity'),
      ' submitted for ',
      coalesce(new.requested_review_pathway, 'governance review'),
      ' and is waiting for Registry attention.'
    ),
    jsonb_build_object(
      'submission_id', new.id,
      'review_pathway', new.requested_review_pathway,
      'status', new.status,
      'source', 'ai_governance_registry_submissions'
    )
  )
  on conflict (notification_key) do nothing;

  return new;
end;
$$;

revoke all
  on function public.ta14_registry_notify_review_requested_v1()
  from public, anon, authenticated;

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
-- Fires when the governed automatic finalizer preserves a registration
-- exception requiring administrative attention.
-- ============================================================================

create or replace function
  public.ta14_registry_notify_registration_exception_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_row public.ai_governance_registry_submissions%rowtype;
  notification_key_value text;
begin
  select *
  into submission_row
  from public.ai_governance_registry_submissions
  where id = new.submission_id;

  notification_key_value :=
    'governance_registration_exception:' || new.id::text;

  insert into public.ta14_registry_admin_notifications (
    notification_key,
    notification_type,
    priority,
    registry_submission_id,
    registry_identifier,
    governance_name,
    claimant_name,
    organization_name,
    contact_email,
    requested_review_pathway,
    registry_status,
    occurred_at,
    title,
    message,
    metadata
  )
  values (
    notification_key_value,
    'governance_registration_exception',
    'urgent',
    new.submission_id,
    submission_row.registry_identifier,
    coalesce(submission_row.governance_name, 'Governance registration'),
    submission_row.claimant_name,
    submission_row.organization_name,
    submission_row.contact_email,
    submission_row.requested_review_pathway,
    submission_row.status,
    coalesce(new.created_at, now()),
    'Registration exception requires attention',
    concat(
      coalesce(submission_row.governance_name, 'A governance registration'),
      ' could not complete automatic registration and requires administrative attention.'
    ),
    jsonb_build_object(
      'submission_id', new.submission_id,
      'exception_id', new.id,
      'exception_status', new.exception_status,
      'source', 'ta14_registry_registration_exceptions'
    )
  )
  on conflict (notification_key) do nothing;

  return new;
end;
$$;

revoke all
  on function public.ta14_registry_notify_registration_exception_v1()
  from public, anon, authenticated;

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
-- Makes already-submitted review-pathway records visible immediately after
-- this migration is applied.
-- ============================================================================

insert into public.ta14_registry_admin_notifications (
  notification_key,
  notification_type,
  priority,
  registry_submission_id,
  registry_identifier,
  governance_name,
  claimant_name,
  organization_name,
  contact_email,
  requested_review_pathway,
  registry_status,
  occurred_at,
  title,
  message,
  metadata
)
select
  'governance_review_requested:' || s.id::text,
  'governance_review_requested',
  'attention',
  s.id,
  s.registry_identifier,
  s.governance_name,
  s.claimant_name,
  s.organization_name,
  s.contact_email,
  s.requested_review_pathway,
  s.status,
  coalesce(s.submitted_at, s.updated_at, s.created_at),
  'Governance review requested',
  concat(
    coalesce(s.governance_name, 'A governance entity'),
    ' submitted for ',
    coalesce(s.requested_review_pathway, 'governance review'),
    ' and is waiting for Registry attention.'
  ),
  jsonb_build_object(
    'submission_id', s.id,
    'review_pathway', s.requested_review_pathway,
    'status', s.status,
    'source', 'backfill'
  )
from public.ai_governance_registry_submissions s
where s.status = 'submitted'
  and s.registry_identifier is null
on conflict (notification_key) do nothing;

commit;
