begin;

-- ============================================================================
-- TA-14 REGISTRATION JOURNEY VIEW CORRECTION
--
-- Corrects aggregate inflation caused by joining lifecycle events and
-- governance submissions directly in the same grouped query.
--
-- The authoritative records remain unchanged.
-- This migration replaces only the administrative journey projection.
-- ============================================================================

create or replace view public.ta14_registry_registration_journeys_v1
with (security_invoker = false)
as
with lifecycle as (
  select
    e.user_id,

    min(e.occurred_at) filter (
      where e.event_type = 'registration_page_opened'
    ) as first_registration_page_opened_at,

    min(e.occurred_at) filter (
      where e.event_type = 'registration_started'
    ) as first_registration_started_at,

    max(e.occurred_at) filter (
      where e.event_type = 'draft_saved'
    ) as latest_draft_saved_at,

    max(e.occurred_at) filter (
      where e.event_type = 'submission_submitted'
    ) as latest_submission_submitted_at,

    max(e.occurred_at) filter (
      where e.event_type = 'registration_completed'
    ) as latest_registration_completed_at,

    max(e.occurred_at) filter (
      where e.event_type = 'registration_failed'
    ) as latest_registration_failed_at,

    count(*) as lifecycle_event_count

  from public.ta14_registry_registration_lifecycle_events e

  where e.user_id is not null

  group by e.user_id
),

submission_counts as (
  select
    s.owner_user_id as user_id,
    count(*) as governance_submission_count

  from public.ai_governance_registry_submissions s

  where s.owner_user_id is not null

  group by s.owner_user_id
),

latest_submission as (
  select distinct on (s.owner_user_id)
    s.owner_user_id as user_id,
    s.id as latest_submission_id,
    s.status as latest_submission_status,
    s.created_at as latest_submission_created_at,
    s.updated_at as latest_submission_updated_at,
    s.submitted_at as latest_submission_submitted_at,
    s.accepted_at as latest_submission_accepted_at,
    s.registry_identifier as latest_registry_identifier,
    s.governance_name as latest_governance_name,
    s.organization_name as latest_organization_name,
    s.claimant_name as latest_claimant_name,
    s.contact_email as latest_contact_email,
    s.requested_review_pathway as latest_requested_review_pathway

  from public.ai_governance_registry_submissions s

  where s.owner_user_id is not null

  order by
    s.owner_user_id,
    s.created_at desc,
    s.id desc
)

select
  u.id as user_id,
  u.email as account_email,
  u.created_at as account_created_at,
  u.last_sign_in_at,

  lifecycle.first_registration_page_opened_at,
  lifecycle.first_registration_started_at,
  lifecycle.latest_draft_saved_at,
  lifecycle.latest_submission_submitted_at,
  lifecycle.latest_registration_completed_at,
  lifecycle.latest_registration_failed_at,

  coalesce(
    lifecycle.lifecycle_event_count,
    0
  )::bigint as lifecycle_event_count,

  coalesce(
    submission_counts.governance_submission_count,
    0
  )::bigint as governance_submission_count,

  latest_submission.latest_submission_id,
  latest_submission.latest_submission_status,
  latest_submission.latest_submission_created_at,
  latest_submission.latest_submission_updated_at,
  latest_submission.latest_submission_submitted_at
    as latest_authoritative_submission_submitted_at,
  latest_submission.latest_submission_accepted_at,
  latest_submission.latest_registry_identifier,
  latest_submission.latest_governance_name,
  latest_submission.latest_organization_name,
  latest_submission.latest_claimant_name,
  latest_submission.latest_contact_email,
  latest_submission.latest_requested_review_pathway

from auth.users u

left join lifecycle
  on lifecycle.user_id = u.id

left join submission_counts
  on submission_counts.user_id = u.id

left join latest_submission
  on latest_submission.user_id = u.id;

comment on view public.ta14_registry_registration_journeys_v1 is
  'Administrative journey projection combining account presence, non-authoritative registration telemetry, and authoritative governance submission state without aggregate multiplication.';

revoke all
  on public.ta14_registry_registration_journeys_v1
  from public;

revoke all
  on public.ta14_registry_registration_journeys_v1
  from anon;

revoke all
  on public.ta14_registry_registration_journeys_v1
  from authenticated;

commit;
