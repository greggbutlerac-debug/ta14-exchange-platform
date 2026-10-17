-- TA14 Open Door evidence binding, proposed migration (NOT automatically deployed).
-- Additive fields only; existing entitlements remain unverified and on HOLD
-- until an authorized steward links an independently inspected source record.
alter table public.ta14_open_door_referral_entitlements
  add column if not exists payment_evidence_reference text,
  add column if not exists payment_evidence_verified_by uuid references auth.users(id),
  add column if not exists payment_evidence_reviewed_at timestamptz,
  add column if not exists service_order_reference text,
  add column if not exists service_order_verified_by uuid references auth.users(id),
  add column if not exists service_order_reviewed_at timestamptz,
  add column if not exists payment_reversal_status text not null default 'unknown',
  add column if not exists payment_reversal_checked_at timestamptz;

-- All three attributes must travel together for each evidence binding.
alter table public.ta14_open_door_referral_entitlements
  add constraint ta14_open_door_payment_evidence_complete
  check (
    (payment_evidence_reference is null and payment_evidence_verified_by is null and payment_evidence_reviewed_at is null)
    or
    (nullif(btrim(payment_evidence_reference),'') is not null and payment_evidence_verified_by is not null and payment_evidence_reviewed_at is not null)
  );

alter table public.ta14_open_door_referral_entitlements
  add constraint ta14_open_door_service_order_complete
  check (
    (service_order_reference is null and service_order_verified_by is null and service_order_reviewed_at is null)
    or
    (nullif(btrim(service_order_reference),'') is not null and service_order_verified_by is not null and service_order_reviewed_at is not null)
  );

-- Existing approval RPC must be revised to require a verified payment-evidence
-- reference before exposing any approval control. Existing redeemed amounts
-- require separate reconciliation before redemption UI is enabled.
-- Do not store raw payment credentials or sensitive case files here.

-- Unknown, disputed, or reversed payments must never be presumed clear.
alter table public.ta14_open_door_referral_entitlements
  add constraint ta14_open_door_reversal_status_valid
  check (payment_reversal_status in ('unknown','clear','disputed','refunded','charged_back'));

-- A claimed clear status must have a review timestamp, though the provider
-- source must still be checked independently at the moment of approval.
alter table public.ta14_open_door_referral_entitlements
  add constraint ta14_open_door_reversal_review_complete
  check (payment_reversal_status <> 'clear' or payment_reversal_checked_at is not null);
