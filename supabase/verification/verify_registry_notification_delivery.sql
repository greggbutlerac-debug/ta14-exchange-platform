-- TA-14 Registry Notification Delivery Verification
--
-- Run after:
--   1. the admin notification trigger migration is applied;
--   2. the delivery audit migration is applied;
--   3. production email delivery has executed at least once.
--
-- READ ONLY. This file does not mutate Registry state.

-- ============================================================================
-- 1. REGISTRATION / NOTIFICATION COVERAGE
-- ============================================================================

select
  count(*) filter (
    where status = 'registered'
  ) as registered_governances
from public.ai_governance_registry_submissions;

select
  state,
  count(*) as total
from public.ta14_registry_admin_notifications
where notification_type = 'governance_registered'
group by state
order by state;

-- ============================================================================
-- 2. DELIVERY HEALTH
-- ============================================================================

select
  delivery_state,
  count(*) as total
from public.ta14_registry_admin_notification_deliveries
group by delivery_state
order by delivery_state;

-- ============================================================================
-- 3. REGISTRATION -> NOTIFICATION -> EMAIL DELIVERY
-- ============================================================================

select
  n.registry_identifier,
  n.governance_name,
  n.state as notification_state,
  n.occurred_at as registration_notification_at,

  count(d.id) as delivery_attempts,

  count(d.id) filter (
    where d.delivery_state = 'delivered'
  ) as successful_deliveries,

  count(d.id) filter (
    where d.delivery_state = 'failed'
  ) as failed_deliveries,

  max(d.delivered_at) filter (
    where d.delivery_state = 'delivered'
  ) as latest_delivery_at

from public.ta14_registry_admin_notifications n

left join public.ta14_registry_admin_notification_deliveries d
  on d.notification_id = n.id

where n.notification_type = 'governance_registered'

group by
  n.id,
  n.registry_identifier,
  n.governance_name,
  n.state,
  n.occurred_at

order by n.occurred_at desc;

-- ============================================================================
-- 4. DELIVERY FAILURES REQUIRING ATTENTION
-- ============================================================================

select
  n.registry_identifier,
  n.governance_name,
  d.recipient,
  d.provider,
  d.failure_reason,
  d.attempted_at

from public.ta14_registry_admin_notification_deliveries d

join public.ta14_registry_admin_notifications n
  on n.id = d.notification_id

where
  d.delivery_state = 'failed'
  and not exists (
    select 1
    from public.ta14_registry_admin_notification_deliveries success
    where
      success.notification_id = d.notification_id
      and success.channel = d.channel
      and lower(success.recipient) = lower(d.recipient)
      and success.delivery_state = 'delivered'
  )

order by d.attempted_at desc;

-- ============================================================================
-- 5. DUPLICATE SUCCESS CHECK
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
-- 6. ORPHAN NOTIFICATION CHECK
--
-- Registered governances should have an administrative registration
-- notification. Expected result: zero rows once the notification system is
-- fully deployed/backfilled.
-- ============================================================================

select
  s.id,
  s.registry_identifier,
  s.governance_name,
  s.status,
  s.accepted_at

from public.ai_governance_registry_submissions s

where
  s.status = 'registered'
  and not exists (
    select 1
    from public.ta14_registry_admin_notifications n
    where
      n.notification_type = 'governance_registered'
      and (
        n.registry_identifier = s.registry_identifier
        or (
          n.event_payload ->> 'submission_id'
        ) = s.id::text
      )
  )

order by s.accepted_at desc nulls last;

-- ============================================================================
-- 7. LATEST REGISTRATION EVENTS
-- ============================================================================

select
  n.registry_identifier,
  n.governance_name,
  n.claimant_name,
  n.requested_review_pathway,
  n.state,
  n.occurred_at,
  n.created_at

from public.ta14_registry_admin_notifications n

where n.notification_type = 'governance_registered'

order by n.occurred_at desc

limit 25;

-- ============================================================================
-- ACCEPTANCE TARGET
--
-- The operational target is:
--
-- automatic registration
--   -> one authoritative governance_registered notification
--   -> Registry Mission Control awareness
--   -> Registry Inbox visibility
--   -> scheduled email attempt for post-cutoff registrations
--   -> successful delivery receipt or visible failure
--   -> no duplicate successful delivery to the same recipient
--
-- Administrative notification state must remain separate from the underlying
-- governance registration state.
-- ============================================================================
