-- TA-14 Registry Registration Exception Verification
--
-- READ ONLY.
--
-- Run after:
--
--   20260809140000_ta14_registry_registration_exceptions.sql
--   20260809143000_ta14_registry_admin_review_attention_notifications.sql
--
-- This verifies repository/database parity before sending another participant
-- through Governance Entity Registration.

-- ============================================================================
-- 1. REQUIRED TABLE EXISTS
-- ============================================================================

select
  table_schema,
  table_name
from information_schema.tables
where
  table_schema = 'public'
  and table_name = 'ta14_registry_registration_exceptions';


-- ============================================================================
-- 2. REQUIRED EXCEPTION COLUMNS
-- ============================================================================

select
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where
  table_schema = 'public'
  and table_name = 'ta14_registry_registration_exceptions'
order by ordinal_position;


-- ============================================================================
-- 3. REQUIRED RPC SIGNATURES
-- ============================================================================

select
  n.nspname as function_schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  pg_get_function_result(p.oid) as result_type
from pg_proc p
join pg_namespace n
  on n.oid = p.pronamespace
where
  n.nspname = 'public'
  and p.proname in (
    'ta14_registry_record_registration_exception_v1',
    'ta14_registry_active_registration_exception_v1',
    'ta14_registry_registration_exception_touch_updated_at_v1',
    'ta14_registry_notify_registration_exception_v1',
    'ta14_registry_notify_review_requested_v1'
  )
order by p.proname;


-- ============================================================================
-- 4. REQUIRED TRIGGERS
-- ============================================================================

select
  event_object_schema,
  event_object_table,
  trigger_name,
  event_manipulation,
  action_timing
from information_schema.triggers
where
  event_object_schema = 'public'
  and trigger_name in (
    'ta14_registry_registration_exception_touch_updated_at',
    'ta14_registry_registration_exception_admin_notification',
    'ta14_registry_review_requested_admin_notification'
  )
order by trigger_name, event_manipulation;


-- ============================================================================
-- 5. CURRENT OPEN EXCEPTIONS
-- ============================================================================

select
  e.id,
  e.submission_id,
  e.owner_user_id,
  e.exception_status,
  e.exception_type,
  e.exception_code,
  e.exception_summary,
  e.readiness_failures,
  e.opened_at,
  e.updated_at,
  s.registry_identifier,
  s.governance_name,
  s.claimant_name,
  s.organization_name,
  s.contact_email,
  s.requested_review_pathway,
  s.status as submission_status
from public.ta14_registry_registration_exceptions e
left join public.ai_governance_registry_submissions s
  on s.id = e.submission_id
where
  e.exception_status in (
    'open',
    'correction_required',
    'under_review'
  )
order by e.opened_at desc;


-- ============================================================================
-- 6. OPEN EXCEPTIONS WITHOUT ADMIN NOTIFICATIONS
--
-- Expected result: zero rows after the notification migration/backfill.
-- ============================================================================

select
  e.id as exception_id,
  e.submission_id,
  e.exception_status,
  e.exception_code,
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
  )
order by e.opened_at desc;


-- ============================================================================
-- 7. WAITING HUMAN-REVIEW SUBMISSIONS WITHOUT ADMIN NOTIFICATIONS
--
-- Automatic pathways are intentionally excluded.
--
-- Expected result: zero rows after the notification migration/backfill.
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
  )
order by s.submitted_at desc nulls last;


-- ============================================================================
-- 8. FALSE REVIEW ALERT CHECK FOR AUTOMATIC PATHWAYS
--
-- Expected result: zero rows for notifications created after the corrected
-- review-attention migration is deployed.
-- ============================================================================

select
  n.id as notification_id,
  n.notification_key,
  n.notification_type,
  n.submission_id,
  n.governance_name,
  n.requested_review_pathway,
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
-- 9. DUPLICATE ACTIVE EXCEPTION CHECK
--
-- The exception recorder is designed to reuse an existing active exception
-- for the same submission and exception code.
--
-- Expected result: zero rows.
-- ============================================================================

select
  submission_id,
  coalesce(exception_code, '') as exception_code,
  count(*) as active_exception_count
from public.ta14_registry_registration_exceptions
where
  exception_status in (
    'open',
    'correction_required',
    'under_review'
  )
group by
  submission_id,
  coalesce(exception_code, '')
having count(*) > 1
order by active_exception_count desc;


-- ============================================================================
-- 10. OWNER / SUBMISSION CONSISTENCY
--
-- Expected result: zero rows.
-- ============================================================================

select
  e.id as exception_id,
  e.submission_id,
  e.owner_user_id as exception_owner_user_id,
  s.owner_user_id as submission_owner_user_id,
  s.governance_name
from public.ta14_registry_registration_exceptions e
join public.ai_governance_registry_submissions s
  on s.id = e.submission_id
where
  e.owner_user_id is distinct from s.owner_user_id;


-- ============================================================================
-- 11. REGISTERED SUBMISSIONS WITH ACTIVE EXCEPTIONS
--
-- A resolved historical exception is fine.
-- A still-active exception attached to a registered submission deserves
-- administrative inspection.
-- ============================================================================

select
  e.id as exception_id,
  e.exception_status,
  e.exception_code,
  e.opened_at,
  s.id as submission_id,
  s.registry_identifier,
  s.governance_name,
  s.accepted_at
from public.ta14_registry_registration_exceptions e
join public.ai_governance_registry_submissions s
  on s.id = e.submission_id
where
  s.status = 'registered'
  and e.exception_status in (
    'open',
    'correction_required',
    'under_review'
  )
order by s.accepted_at desc nulls last;


-- ============================================================================
-- 12. NOTIFICATION COVERAGE SUMMARY
-- ============================================================================

select
  notification_type,
  priority,
  state,
  count(*) as total
from public.ta14_registry_admin_notifications
where
  notification_type in (
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
-- 13. RECENT EXCEPTION / REVIEW / REGISTRATION TIMELINE
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
  n.occurred_at,
  n.created_at
from public.ta14_registry_admin_notifications n
where
  n.notification_type in (
    'governance_registered',
    'governance_review_requested',
    'governance_registration_exception'
  )
order by n.occurred_at desc
limit 100;


-- ============================================================================
-- 14. MICHAEL / AI CORNERSTONE FOCUSED CHECK
--
-- Searches account, submission, exception, and admin-notification layers.
-- ============================================================================

with candidate_users as (
  select
    u.id as user_id,
    u.email,
    u.created_at as account_created_at,
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
      select user_id
      from candidate_users
    )
)

select
  'account' as source,
  u.user_id,
  null::uuid as submission_id,
  u.email as account_email,
  null::text as governance_name,
  'account_created' as state,
  null::text as registry_identifier,
  u.account_created_at as occurred_at
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
  'exception',
  e.owner_user_id,
  e.submission_id,
  u.email,
  s.governance_name,
  e.exception_status,
  s.registry_identifier,
  e.opened_at
from public.ta14_registry_registration_exceptions e
left join candidate_submissions s
  on s.id = e.submission_id
left join auth.users u
  on u.id = e.owner_user_id
where
  s.id is not null
  or e.owner_user_id in (
    select user_id
    from candidate_users
  )

union all

select
  'admin_notification',
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
  or coalesce(n.claimant_name, '') ilike '%shuler%'
  or coalesce(n.organization_name, '') ilike '%cornerstone%'
  or s.owner_user_id in (
    select user_id
    from candidate_users
  )

order by occurred_at desc;


-- ============================================================================
-- ACCEPTANCE TARGET
--
-- Before asking Michael or another external governance participant to retry:
--
--   * required table exists;
--   * required RPCs exist with expected signatures;
--   * required triggers exist;
--   * no orphaned owner relationships exist;
--   * no duplicate active exceptions exist;
--   * open exceptions have action-required admin notifications;
--   * waiting human-review submissions have review-request notifications;
--   * automatic pathways do not generate false review-request notifications.
--
-- No admissible evidence. No admissible execution.
-- ============================================================================
