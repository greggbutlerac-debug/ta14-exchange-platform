-- TA-14 Registration Journey Verification
--
-- READ ONLY.
--
-- Run after the registration lifecycle migrations have been applied and the
-- registration UI / lifecycle API have been deployed.
--
-- This verification distinguishes:
--
--   account only
--   registration page opened
--   registration started
--   draft saved
--   submitted
--   registered
--   failed
--
-- Lifecycle telemetry is administrative awareness only. Authoritative
-- governance status remains in ai_governance_registry_submissions.

-- ============================================================================
-- 1. JOURNEY SUMMARY
-- ============================================================================

select
  case
    when latest_registration_completed_at is not null
      then 'registered'

    when latest_submission_submitted_at is not null
      then 'submitted'

    when latest_draft_saved_at is not null
      then 'draft_saved'

    when latest_registration_failed_at is not null
      then 'failed'

    when first_registration_started_at is not null
      then 'started'

    when first_registration_page_opened_at is not null
      then 'opened'

    else 'account_only'
  end as journey_state,

  count(*) as total

from public.ta14_registry_registration_journeys_v1

group by 1

order by 1;


-- ============================================================================
-- 2. ALL CURRENT JOURNEYS
-- ============================================================================

select
  user_id,
  account_email,
  account_created_at,
  last_sign_in_at,

  first_registration_page_opened_at,
  first_registration_started_at,
  latest_draft_saved_at,
  latest_submission_submitted_at,
  latest_registration_completed_at,
  latest_registration_failed_at,

  lifecycle_event_count,
  governance_submission_count,

  latest_submission_id,
  latest_submission_status,
  latest_registry_identifier,
  latest_governance_name,
  latest_organization_name,
  latest_claimant_name,
  latest_contact_email,
  latest_requested_review_pathway

from public.ta14_registry_registration_journeys_v1

order by
  coalesce(
    latest_registration_completed_at,
    latest_submission_submitted_at,
    latest_draft_saved_at,
    latest_registration_failed_at,
    first_registration_started_at,
    first_registration_page_opened_at,
    last_sign_in_at,
    account_created_at
  ) desc nulls last;


-- ============================================================================
-- 3. ACCOUNTS WITH NO GOVERNANCE SUBMISSION
--
-- These are NOT automatically failed registrations.
-- They are accounts that currently have no authoritative governance submission.
-- Lifecycle columns show whether they actually entered the registration flow.
-- ============================================================================

select
  user_id,
  account_email,
  account_created_at,
  last_sign_in_at,
  first_registration_page_opened_at,
  first_registration_started_at,
  latest_draft_saved_at,
  latest_registration_failed_at,
  lifecycle_event_count

from public.ta14_registry_registration_journeys_v1

where governance_submission_count = 0

order by
  coalesce(
    latest_registration_failed_at,
    first_registration_started_at,
    first_registration_page_opened_at,
    last_sign_in_at,
    account_created_at
  ) desc nulls last;


-- ============================================================================
-- 4. PEOPLE WHO OPENED REGISTRATION BUT HAVE NO SUBMISSION
-- ============================================================================

select
  user_id,
  account_email,
  first_registration_page_opened_at,
  first_registration_started_at,
  latest_registration_failed_at,
  lifecycle_event_count

from public.ta14_registry_registration_journeys_v1

where
  governance_submission_count = 0
  and first_registration_page_opened_at is not null

order by first_registration_page_opened_at desc;


-- ============================================================================
-- 5. PEOPLE WHO STARTED REGISTRATION BUT HAVE NO SUBMISSION
--
-- This is the key "someone tried to register" administrative view.
-- ============================================================================

select
  user_id,
  account_email,
  first_registration_started_at,
  first_registration_page_opened_at,
  latest_registration_failed_at,
  lifecycle_event_count

from public.ta14_registry_registration_journeys_v1

where
  governance_submission_count = 0
  and first_registration_started_at is not null

order by first_registration_started_at desc;


-- ============================================================================
-- 6. FAILED REGISTRATION EVENTS
-- ============================================================================

select
  e.id,
  e.user_id,
  u.email as account_email,
  e.submission_id,
  e.event_type,
  e.source,
  e.governance_name,
  e.organization_name,
  e.contact_email,
  e.event_payload,
  e.occurred_at

from public.ta14_registry_registration_lifecycle_events e

left join auth.users u
  on u.id = e.user_id

where e.event_type = 'registration_failed'

order by e.occurred_at desc;


-- ============================================================================
-- 7. RAW LIFECYCLE EVENTS, NEWEST FIRST
-- ============================================================================

select
  e.id,
  e.user_id,
  u.email as account_email,
  e.submission_id,
  e.event_type,
  e.source,
  e.session_key,
  e.governance_name,
  e.organization_name,
  e.contact_email,
  e.occurred_at,
  e.created_at

from public.ta14_registry_registration_lifecycle_events e

left join auth.users u
  on u.id = e.user_id

order by e.occurred_at desc

limit 250;


-- ============================================================================
-- 8. AUTHORITATIVE SUBMISSION STATUS
-- ============================================================================

select
  status,
  count(*) as total

from public.ai_governance_registry_submissions

group by status

order by status;


-- ============================================================================
-- 9. TELEMETRY / AUTHORITATIVE STATE CONSISTENCY
--
-- Completed telemetry should normally correspond to a registered authoritative
-- submission for that user.
--
-- Expected result after normal operation: zero rows.
-- ============================================================================

select
  j.user_id,
  j.account_email,
  j.latest_registration_completed_at,
  j.governance_submission_count,
  j.latest_submission_status,
  j.latest_registry_identifier

from public.ta14_registry_registration_journeys_v1 j

where
  j.latest_registration_completed_at is not null
  and not exists (
    select 1
    from public.ai_governance_registry_submissions s
    where
      s.owner_user_id = j.user_id
      and s.status = 'registered'
  )

order by j.latest_registration_completed_at desc;


-- ============================================================================
-- 10. REGISTERED SUBMISSIONS WITHOUT COMPLETION TELEMETRY
--
-- Historical registrations created before telemetry deployment will appear
-- here and are expected. New post-deployment registrations should not.
-- ============================================================================

select
  s.id as submission_id,
  s.owner_user_id,
  u.email as account_email,
  s.registry_identifier,
  s.governance_name,
  s.status,
  s.submitted_at,
  s.accepted_at,
  s.created_at

from public.ai_governance_registry_submissions s

left join auth.users u
  on u.id = s.owner_user_id

where
  s.status = 'registered'
  and not exists (
    select 1
    from public.ta14_registry_registration_lifecycle_events e
    where
      e.user_id = s.owner_user_id
      and e.submission_id = s.id
      and e.event_type = 'registration_completed'
  )

order by s.accepted_at desc nulls last;


-- ============================================================================
-- 11. DUPLICATE COMPLETION EVENT CHECK
--
-- Expected result: zero rows for post-deployment registrations.
-- ============================================================================

select
  submission_id,
  count(*) as completion_event_count

from public.ta14_registry_registration_lifecycle_events

where
  event_type = 'registration_completed'
  and submission_id is not null

group by submission_id

having count(*) > 1;


-- ============================================================================
-- 12. MICHAEL / AI CORNERSTONE QUICK CHECK
--
-- This searches the authoritative submission layer, account layer, and new
-- registration telemetry together.
-- ============================================================================

select
  'submission' as source,
  s.owner_user_id as user_id,
  u.email as account_email,
  s.governance_name,
  s.organization_name,
  s.claimant_name,
  s.contact_email,
  s.status as state,
  s.registry_identifier,
  s.created_at as occurred_at

from public.ai_governance_registry_submissions s

left join auth.users u
  on u.id = s.owner_user_id

where
  coalesce(s.governance_name, '') ilike '%cornerstone%'
  or coalesce(s.organization_name, '') ilike '%cornerstone%'
  or coalesce(s.claimant_name, '') ilike '%shuler%'
  or coalesce(s.contact_email, '') ilike '%shuler%'

union all

select
  'lifecycle' as source,
  e.user_id,
  u.email as account_email,
  e.governance_name,
  e.organization_name,
  null as claimant_name,
  e.contact_email,
  e.event_type as state,
  null as registry_identifier,
  e.occurred_at

from public.ta14_registry_registration_lifecycle_events e

left join auth.users u
  on u.id = e.user_id

where
  coalesce(e.governance_name, '') ilike '%cornerstone%'
  or coalesce(e.organization_name, '') ilike '%cornerstone%'
  or coalesce(e.contact_email, '') ilike '%shuler%'
  or coalesce(u.email, '') ilike '%shuler%'
  or coalesce(u.email, '') ilike '%cornerstone%'

union all

select
  'account' as source,
  u.id as user_id,
  u.email as account_email,
  null as governance_name,
  null as organization_name,
  null as claimant_name,
  u.email as contact_email,
  'account_created' as state,
  null as registry_identifier,
  u.created_at as occurred_at

from auth.users u

where
  coalesce(u.email, '') ilike '%shuler%'
  or coalesce(u.email, '') ilike '%cornerstone%'
  or coalesce(u.raw_user_meta_data::text, '') ilike '%shuler%'
  or coalesce(u.raw_user_meta_data::text, '') ilike '%cornerstone%'

order by occurred_at desc;


-- ============================================================================
-- ACCEPTANCE TARGET
--
-- After deployment, a signed-in participant who reaches registration should
-- become visible at "opened."
--
-- Their first meaningful form interaction should become visible at "started."
--
-- A successful account-backed save should become visible at "draft_saved."
--
-- Submission and registration should remain separately observable.
--
-- None of these telemetry events may independently create registered status.
-- ============================================================================
