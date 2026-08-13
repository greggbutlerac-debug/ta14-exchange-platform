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
  status text