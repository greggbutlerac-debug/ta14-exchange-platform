-- TA-14 owner alerts: durable, idempotent outbox for commercial business events.
--
-- One row per real business event, keyed by a deterministic alert_key (for example
-- 'payment_verified:paypal-capture:<captureId>'). Duplicate event delivery (client retries, PayPal
-- webhook redelivery, two code paths observing the same capture) collapses onto the same row, so it
-- can never produce a second email. Email delivery state lives on the row: a failed send never rolls
-- back the business event, stays visible, and is retried by /api/owner-alerts/deliver.
--
-- Governance registration alerts are NOT stored here; they continue to use
-- ta14_registry_admin_notifications and its existing delivery pipeline.

create table if not exists public.ta14_owner_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_key text not null unique,
  alert_type text not null check (
    alert_type in (
      'COMMERCIAL_ENGAGEMENT_ACCEPTED',
      'PAYMENT_INITIATED',
      'PAYMENT_VERIFIED',
      'READY_FOR_FULFILLMENT'
    )
  ),
  -- Whitelisted, display-only facts (who / what / when / amount / action). Never secrets or card data.
  facts jsonb not null,
  is_test boolean not null default false,
  occurred_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  delivery_state text not null default 'pending' check (
    delivery_state in ('pending', 'sending', 'delivered', 'failed', 'suppressed')
  ),
  attempts integer not null default 0,
  claimed_at timestamptz,
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  provider_message_id text,
  last_error text
);

comment on table public.ta14_owner_alerts is
  'Owner email alerts for commercial business events. alert_key makes each event alert at most once.';
comment on column public.ta14_owner_alerts.delivery_state is
  'pending: not yet sent; sending: claimed by a sender; delivered; failed: retried by cron with cooldown; suppressed: test/operator event recorded but not emailed.';

create index if not exists ta14_owner_alerts_delivery_idx
  on public.ta14_owner_alerts (delivery_state, occurred_at desc);

create index if not exists ta14_owner_alerts_occurred_idx
  on public.ta14_owner_alerts (occurred_at desc);

-- Server-only table: no client access. The service role bypasses RLS.
alter table public.ta14_owner_alerts enable row level security;
revoke all on public.ta14_owner_alerts from anon;
revoke all on public.ta14_owner_alerts from authenticated;
