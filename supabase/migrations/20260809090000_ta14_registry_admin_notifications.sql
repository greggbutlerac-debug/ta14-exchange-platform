begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- TA-14 REGISTRY ADMINISTRATIVE NOTIFICATION FOUNDATION
--
-- Purpose:
--   Preserve institutional awareness when a governance becomes registered.
--
-- Boundary:
--   This migration does not make registration manual and does not change the
--   registration decision. It observes the authoritative transition to
--   status = 'registered' and records a separate administrative awareness
--   event for authorized Registry administration.
-- ============================================================================

create table if not exists public.ta14_registry_admin_notifications (
  id uuid primary key default gen_random_uuid(),

  notification_key text not null unique,
  notification_type text not null,
  priority text not null default 'informational',
  state text not null default 'unread',

  submission_id uuid
    references public.ai_governance_registry_submissions(id)
    on delete set null,

  registry_identifier text,
  governance_name text not null,
  claimant_name text,
  organization_name text,
  requested_review_pathway text,

  title text not null,
  message text not null,
  event_payload jsonb not null default '{}'::jsonb,

  occurred_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),

  acknowledged_at timestamptz,
  acknowledged_by_user_id uuid
    references auth.users(id)
    on delete set null,

  resolved_at timestamptz,
  resolved_by_user_id uuid
    references auth.users(id)
    on delete set null,

  constraint ta14_registry_admin_notification_priority_check
    check (
      priority in (
        'informational',
        'attention',
        'action_required',
        'critical'
      )
    ),

  constraint ta14_registry_admin_notification_state_check
    check (
      state in (
        'unread',
        'acknowledged',
        'resolved'
      )
    ),

  constraint ta14_registry_admin_notification_identifier_check
    check (
      notification_type <> 'governance_registered'
      or registry_identifier is not null
    )
);

comment on table public.ta14_registry_admin_notifications is
  'Institutional administration inbox for TA-14 Registry events. Administrative awareness is separate from governance registration, review, finding, certification, endorsement, validation, or approval.';

comment on column public.ta14_registry_admin_notifications.notification_key is
  'Deterministic deduplication key for one institutional notification per governed event.';

comment on column public.ta14_registry_admin_notifications.state is
  'Administrative awareness state only. Acknowledging or resolving a notification does not modify the underlying Registry record.';

-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists
  ta14_registry_admin_notifications_state_idx
on public.ta14_registry_admin_notifications (
  state,
  occurred_at desc
);

create index if not exists
  ta14_registry_admin_notifications_submission_idx
on public.ta14_registry_admin_notifications (
  submission_id,
  occurred_at desc
);

create index if not exists
  ta14_registry_admin_notifications_identifier_idx
on public.ta14_registry_admin_notifications (
  registry_identifier
)
where registry_identifier is not null;

create index if not exists
  ta14_registry_admin_notifications_type_idx
on public.ta14_registry_admin_notifications (
  notification_type,
  occurred_at desc
);

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- Browser roles do not receive direct table access. Authorized administration
-- is mediated through protected server-side routes using the service role.
-- ============================================================================

alter table public.ta14_registry_admin_notifications
  enable row level security;

revoke all
  on table public.ta14_registry_admin_notifications
  from public;

revoke all
  on table public.ta14_registry_admin_notifications
  from anon;

revoke all
  on table public.ta14_registry_admin_notifications
  from authenticated;

-- ============================================================================
-- AUTHORITATIVE REGISTRATION-AWARENESS FUNCTION
-- ============================================================================

create or replace function
  public.ta14_registry_create_registration_notification_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_notification_key text;
begin
  -- Only a completed Registry registration with a permanent identifier creates
  -- the governance_registered awareness event.
  if new.status <> 'registered'
     or new.registry_identifier is null then
    return new;
  end if;

  -- Ordinary updates to an already-registered record must not create duplicate
  -- awareness events. A changed identifier is treated as a distinct event and
  -- is separately deduplicated by notification_key.
  if tg_op = 'UPDATE'
     and old.status = 'registered'
     and old.registry_identifier is not distinct from new.registry_identifier then
    return new;
  end if;

  v_notification_key :=
    'governance_registered:' ||
    new.id::text ||
    ':' ||
    new.registry_identifier;

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
    v_notification_key,
    'governance_registered',
    'informational',
    'unread',
    new.id,
    new.registry_identifier,
    new.governance_name,
    new.claimant_name,
    new.organization_name,
    new.requested_review_pathway,
    'New governance registered',
    format(
      '%s has been registered as %s through the %s pathway.',
      new.governance_name,
      new.registry_identifier,
      coalesce(
        nullif(btrim(new.requested_review_pathway), ''),
        'unspecified'
      )
    ),
    jsonb_build_object(
      'submission_id', new.id,
      'registry_identifier', new.registry_identifier,
      'governance_name', new.governance_name,
      'claimant_name', new.claimant_name,
      'organization_name', new.organization_name,
      'requested_review_pathway', new.requested_review_pathway,
      'status', new.status,
      'submitted_at', new.submitted_at,
      'accepted_at', new.accepted_at,
      'automatic_awareness_event', true,
      'boundary',
        'Registration records an attributable governance identity and declared information. It is not certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or proof of performance.'
    ),
    coalesce(
      new.accepted_at,
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
  on function public.ta14_registry_create_registration_notification_v1()
  from public;

revoke all
  on function public.ta14_registry_create_registration_notification_v1()
  from anon;

revoke all
  on function public.ta14_registry_create_registration_notification_v1()
  from authenticated;

-- ============================================================================
-- REGISTRATION TRIGGER
--
-- Database-level observation means registration awareness is not coupled to a
-- single application route. Automatic finalization, reviewer finalization,
-- recovery paths, and future application routes converge on the same event.
-- ============================================================================

drop trigger if exists
  ta14_registry_registration_admin_notification
  on public.ai_governance_registry_submissions;

create trigger ta14_registry_registration_admin_notification
after insert or update of status, registry_identifier
on public.ai_governance_registry_submissions
for each row
execute function public.ta14_registry_create_registration_notification_v1();

-- ============================================================================
-- BACKFILL EXISTING REGISTRATIONS
--
-- Idempotent. Existing notifications are preserved. Registered governances that
-- predate this migration receive an unread administrative awareness record.
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
  'governance_registered:' ||
    submission.id::text ||
    ':' ||
    submission.registry_identifier,
  'governance_registered',
  'informational',
  'unread',
  submission.id,
  submission.registry_identifier,
  submission.governance_name,
  submission.claimant_name,
  submission.organization_name,
  submission.requested_review_pathway,
  'New governance registered',
  format(
    '%s has been registered as %s through the %s pathway.',
    submission.governance_name,
    submission.registry_identifier,
    coalesce(
      nullif(btrim(submission.requested_review_pathway), ''),
      'unspecified'
    )
  ),
  jsonb_build_object(
    'submission_id', submission.id,
    'registry_identifier', submission.registry_identifier,
    'governance_name', submission.governance_name,
    'claimant_name', submission.claimant_name,
    'organization_name', submission.organization_name,
    'requested_review_pathway', submission.requested_review_pathway,
    'status', submission.status,
    'submitted_at', submission.submitted_at,
    'accepted_at', submission.accepted_at,
    'backfilled_existing_registration', true,
    'boundary',
      'Registration records an attributable governance identity and declared information. It is not certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or proof of performance.'
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
on conflict (notification_key)
do nothing;

-- ============================================================================
-- ADMINISTRATIVE SUMMARY RPC
-- ============================================================================

create or replace function
  public.ta14_registry_admin_notification_summary_v1()
returns table (
  unread_count bigint,
  acknowledged_count bigint,
  resolved_count bigint,
  total_count bigint,
  newest_event_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*) filter (
      where state = 'unread'
    ) as unread_count,
    count(*) filter (
      where state = 'acknowledged'
    ) as acknowledged_count,
    count(*) filter (
      where state = 'resolved'
    ) as resolved_count,
    count(*) as total_count,
    max(occurred_at) as newest_event_at
  from public.ta14_registry_admin_notifications;
$$;

revoke all
  on function public.ta14_registry_admin_notification_summary_v1()
  from public;

revoke all
  on function public.ta14_registry_admin_notification_summary_v1()
  from anon;

revoke all
  on function public.ta14_registry_admin_notification_summary_v1()
  from authenticated;

commit;
