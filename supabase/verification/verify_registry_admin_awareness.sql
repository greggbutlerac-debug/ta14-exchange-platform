-- TA-14 Registry Admin Awareness Verification
--
-- READ ONLY.
--
-- Run after applying:
--
--   20260809090000_ta14_registry_admin_notifications.sql
--   20260809_ta14_registry_admin_notification_deliveries.sql
--   20260809140000_ta14_registry_registration_exceptions.sql
--   20260809143000_ta14_registry_admin_review_attention_notifications.sql
--   20260809144500_ta14_registry_registration_exception_constraint_parity.sql
--   20260809150000_ta14_registry_admin_notification_lifecycle_closure.sql
--
-- This verifies that Registry administration awareness tracks the current
-- governance-registration condition without changing authoritative Registry
-- state.

-- ============================================================================
-- 1. NOTIFICATION TYPE / STATE SUMMARY
-- ============================================================================

select
  notification_type,
  priority,
  state,
  count(*) as total
from public.ta14_registry_admin_notifications
where notification_type in (
  'governance_registered',
  'governance_review_requested',
  'governance_registration_exception'
)
group by
  notification_type,
  priority,
  state
order by
  notification_type,
  priority,
  state;


-- ============================================================================
-- 2. HUMAN-REVIEW SUBMISSIONS WITHOUT ACTIVE AWARENESS
--
-- Expected result: zero rows.
-- ============================================================================

select
  s.id as submission_id,
  s.governance_name,
  s.claimant_name,
  s.organization_name,
  s.contact_email,
  s.requested_review_pathway,
  s.status,
  s.submitted_at
from public.ai_governance_registry_submissions s
where
  s.status = 'submitted'
  and s.registry_identifier is null
  and coalesce(
    s.requested_review_pathway,
    'Record-only registration'
  ) not in (
    'Record-only registration',
    'Administrative completeness review'
  )
  and not exists (
    select 1
    from public.ta14_registry_admin_notifications n
    where
      n.notification_key =
        'governance_review_requested:' || s.id::text
      and n.state <> 'resolved'
  )
order by s.submitted_at desc nulls last;


-- ============================================================================
-- 3. FALSE ACTIVE REVIEW ALERTS
--
-- Expected result: zero rows.
-- ============================================================================

select
  n.id as notification_id,
  n.notification_key,
  n.state,
  n.governance_name,
  n.requested_review_pathway,
  n.occurred_at,
  s.status as submission_status,
  s.registry_identifier
from public.ta14_registry_admin_notifications n
left join public.ai_governance_registry_submissions s
  on s.id = n.submission_id
where
  n.notification_type = 'governance_review_requested'
  and n.state <> 'resolved'
  and (
    s.id is null
    or s.status <> 'submitted'
    or s.registry_identifier is not null
    or coalesce(
      s.requested_review_pathway,
      'Record-only registration'
    ) in (
      'Record-only registration',
      'Administrative completeness review'
    )
  )
order by n.occurred_at desc;


-- ============================================================================
-- 4. ACTIVE EXCEPTIONS WITHOUT ACTION-REQUIRED AWARENESS
--
-- Expected result: zero rows.
-- ============================================================================

select
  e.id as exception_id,
  e.submission_id,
  e.exception_status,
  e.exception_code,
  e.exception_summary,
  e.opened_at,
  s.governance_name
from public.ta14_registry_registration_exceptions e
left join public.ai_governance_registry_submissions s
  on s.id = e.submission_id
where
  e.exception_status in (
    'open',
    'correction_required',
    'under_review'
  )
  and not exists (
    select 1
    from public.ta14_registry_admin_notifications n
    where
      n.notification_key =
        'governance_registration_exception:' || e.id::text
      and n.state <> 'resolved'
  )
order by e.opened_at desc;


-- ============================================================================
-- 5. FALSE ACTIVE EXCEPTION ALERTS
--
-- Expected result: zero rows.
-- ============================================================================

select
  n.id as notification_id,
  n.notification_key,
  n.state,
  n.governance_name,
  n.occurred_at,
  e.exception_status,
  e.resolved_at
from public.ta14_registry_admin_notifications n
left join public.ta14_registry_registration_exceptions e
  on n.notification_key =
    'governance_registration_exception:' || e.id::text
where
  n.notification_type =
    'governance_registration_exception'
  and n.state <> 'resolved'
  and (
    e.id is null
    or e.exception_status in (
      'resolved',
      'dismissed'
    )
  )
order by n.occurred_at desc;


-- ============================================================================
-- 6. AUTOMATIC PATHWAYS MUST NOT HAVE REVIEW-REQUEST ALERTS
--
-- Expected result: zero rows.
-- ============================================================================

select
  n.id as notification_id,
  n.notification_key,
  n.governance_name,
  n.requested_review_pathway,
  n.state,
  n.occurred_at
from public.ta14_registry_admin_notifications n
where
  n.notification_type = 'governance_review_requested'
  and coalesce(
    n.requested_review_pathway,
    'Record-only registration'
  ) in (
    'Record-only registration',
    'Administrative completeness review'
  )
order by n.occurred_at desc;


-- ============================================================================
-- 7. ONE ACTIVE EXCEPTION PER SUBMISSION
--
-- Expected result: zero rows.
-- ============================================================================

select
  submission_id,
  count(*) as active_exception_count
from public.ta14_registry_registration_exceptions
where
  exception_status in (
    'open',
    'correction_required',
    'under_review'
  )
group by submission_id
having count(*) > 1
order by active_exception_count desc;


-- ============================================================================
-- 8. EXCEPTION OWNER CONSISTENCY
--
-- Expected result: zero rows.
-- ============================================================================

select
  e.id as exception_id,
  e.submission_id,
  e.owner_user_id as exception_owner,
  s.owner_user_id as submission_owner,
  s.governance_name
from public.ta14_registry_registration_exceptions e
join public.ai_governance_registry_submissions s
  on s.id = e.submission_id
where
  e.owner_user_id is distinct from s.owner_user_id;


-- ============================================================================
-- 9. REGISTRATION NOTIFICATION COVERAGE
--
-- Expected result: zero rows for registrations created after notification
-- deployment/backfill.
-- ============================================================================

select
  s.id as submission_id,
  s.registry_identifier,
  s.governance_name,
  s.accepted_at
from public.ai_governance_registry_submissions s
where
  s.status = 'registered'
  and s.registry_identifier is not null
  and not exists (
    select 1
    from public.ta14_registry_admin_notifications n
    where
      n.notification_type = 'governance_registered'
      and n.submission_id = s.id
  )
order by s.accepted_at desc nulls last;


-- ============================================================================
-- 10. EMAIL DELIVERY COVERAGE
--
-- Shows every active notification and its successful delivery count.
-- ============================================================================

select
  n.id as notification_id,
  n.notification_type,
  n.priority,
  n.state,
  n.registry_identifier,
  n.governance_name,
  n.requested_review_pathway,
  n.occurred_at,

  count(d.id) filter (
    where d.delivery_state = 'delivered'
  ) as successful_deliveries,

  count(d.id) filter (
    where d.delivery_state = 'failed'
  ) as failed_delivery_attempts,

  max(d.delivered_at) filter (
    where d.delivery_state = 'delivered'
  ) as latest_delivered_at,

  max(d.attempted_at) as latest_attempt_at

from public.ta14_registry_admin_notifications n

left join public.ta14_registry_admin_notification_deliveries d
  on d.notification_id = n.id

where
  n.notification_type in (
    'governance_registered',
    'governance_review_requested',
    'governance_registration_exception'
  )

group by
  n.id,
  n.notification_type,
  n.priority,
  n.state,
  n.registry_identifier,
  n.governance_name,
  n.requested_review_pathway,
  n.occurred_at

order by n.occurred_at desc;


-- ============================================================================
-- 11. DUPLICATE SUCCESSFUL EMAIL CHECK
--
-- Expected result: zero rows.
-- ============================================================================

select
  notification_id,
  channel,
  lower(recipient) as recipient,
  count(*) as successful_delivery_count
from public.ta14_registry_admin_notification_deliveries
where delivery_state = 'delivered'
group by
  notification_id,
  channel,
  lower(recipient)
having count(*) > 1;


-- ============================================================================
-- 12. ACTIVE ATTENTION QUEUE
--
-- This is the concise administrator queue that should represent what still
-- needs awareness/action now.
-- ============================================================================

select
  n.notification_type,
  n.priority,
  n.state,
  n.submission_id,
  n.registry_identifier,
  n.governance_name,
  n.claimant_name,
  n.organization_name,
  n.requested_review_pathway,
  n.title,
  n.message,
  n.occurred_at
from public.ta14_registry_admin_notifications n
where
  n.state <> 'resolved'
  and n.notification_type in (
    'governance_review_requested',
    'governance_registration_exception'
  )
order by
  case n.priority
    when 'critical' then 1
    when 'action_required' then 2
    when 'attention' then 3
    else 4
  end,
  n.occurred_at asc;


-- ============================================================================
-- 13. REGISTRATION JOURNEY QUEUE
--
-- Shows accounts that have entered registration but have not yet reached a
-- registered authoritative record.
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
  latest_registration_failed_at,
  lifecycle_event_count,
  governance_submission_count,
  latest_submission_status,
  latest_governance_name,
  latest_organization_name,
  latest_claimant_name,
  latest_contact_email
from public.ta14_registry_registration_journeys_v1
where
  latest_registration_completed_at is null
  and (
    first_registration_page_opened_at is not null
    or first_registration_started_at is not null
    or latest_draft_saved_at is not null
    or latest_submission_submitted_at is not null
    or latest_registration_failed_at is not null
  )
order by
  coalesce(
    latest_registration_failed_at,
    latest_submission_submitted_at,
    latest_draft_saved_at,
    first_registration_started_at,
    first_registration_page_opened_at,
    last_sign_in_at,
    account_created_at
  ) desc nulls last;


-- ============================================================================
-- 14. MICHAEL / AI CORNERSTONE CURRENT STATE
-- ============================================================================

with candidate_users as (
  select
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at
  from auth.users u
  where
    coalesce(u.email, '') ilike '%shuler%'
    or coalesce(u.email, '') ilike '%cornerstone%'
    or coalesce(u.raw_user_meta_data::text, '') ilike '%shuler%'
    or coalesce(u.raw_user_meta_data::text, '') ilike '%cornerstone%'
),

candidate_submissions as (
  select s.*
  from public.ai_governance_registry_submissions s
  where
    coalesce(s.governance_name, '') ilike '%cornerstone%'
    or coalesce(s.organization_name, '') ilike '%cornerstone%'
    or coalesce(s.claimant_name, '') ilike '%shuler%'
    or coalesce(s.contact_email, '') ilike '%shuler%'
    or s.owner_user_id in (
      select id
      from candidate_users
    )
)

select
  'account' as source,
  u.id as user_id,
  null::uuid as submission_id,
  u.email as account_email,
  null::text as governance_name,
  'account_created' as state,
  null::text as registry_identifier,
  u.created_at as occurred_at
from candidate_users u

union all

select
  'submission',
  s.owner_user_id,
  s.id,
  u.email,
  s.governance_name,
  s.status,
  s.registry_identifier,
  coalesce(
    s.accepted_at,
    s.submitted_at,
    s.updated_at,
    s.created_at
  )
from candidate_submissions s
left join auth.users u
  on u.id = s.owner_user_id

union all

select
  'notification',
  s.owner_user_id,
  n.submission_id,
  u.email,
  n.governance_name,
  n.notification_type,
  n.registry_identifier,
  n.occurred_at
from public.ta14_registry_admin_notifications n
left join public.ai_governance_registry_submissions s
  on s.id = n.submission_id
left join auth.users u
  on u.id = s.owner_user_id
where
  coalesce(n.governance_name, '') ilike '%cornerstone%'
  or coalesce(n.organization_name, '') ilike '%cornerstone%'
  or coalesce(n.claimant_name, '') ilike '%shuler%'
  or s.owner_user_id in (
    select id
    from candidate_users
  )

order by occurred_at desc;


-- ============================================================================
-- OPERATIONAL ACCEPTANCE
--
-- Before sending another external participant through registration:
--
--   * sections 2-9 and 11 should return zero unexpected rows;
--   * section 12 should show only conditions that genuinely still need admin
--     attention;
--   * section 13 should accurately show incomplete registration journeys;
--   * completed automatic registrations should create exactly one registered
--     awareness event;
--   * resolved review/exception conditions should no longer remain active;
--   * external email delivery should be deduplicated and auditable.
--
-- No admissible evidence. No admissible execution.
-- ============================================================================
