-- TA-14 Exchange billing foundation
-- Stores verified PayPal subscription lifecycle state and webhook receipts.

create table if not exists public.ta14_billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  paypal_subscription_id text not null unique,
  paypal_plan_id text,
  plan_key text,
  customer_reference text,
  subscriber_email text,
  subscriber_payer_id text,
  status text not null default 'UNKNOWN',
  status_changed_at timestamptz,
  next_billing_time timestamptz,
  raw_resource jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ta14_billing_subscriptions_customer_reference_idx
  on public.ta14_billing_subscriptions(customer_reference);
create index if not exists ta14_billing_subscriptions_status_idx
  on public.ta14_billing_subscriptions(status);

create table if not exists public.ta14_paypal_webhook_events (
  id uuid primary key default gen_random_uuid(),
  paypal_event_id text not null unique,
  event_type text not null,
  resource_id text,
  verification_status text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.ta14_billing_subscriptions enable row level security;
alter table public.ta14_paypal_webhook_events enable row level security;

comment on table public.ta14_billing_subscriptions is
  'Server-controlled TA-14 subscription entitlement state derived from verified PayPal lifecycle events.';
comment on table public.ta14_paypal_webhook_events is
  'Immutable-style receipt log for PayPal webhook events used to establish billing provenance and idempotency.';
