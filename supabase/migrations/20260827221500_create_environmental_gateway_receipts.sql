-- TA-14 Environmental Evidence Gateway private receipt ledger
-- Owner-only application surface. Service-role writes/reads only; no public policies.

create table if not exists public.ta14_environmental_gateway_receipts (
  id uuid primary key default gen_random_uuid(),
  record_id text not null,
  replay_id text not null unique,
  canonical_version text not null,
  determination text not null,
  determination_hash text not null unique,
  evidence_hash text not null,
  input_snapshot jsonb not null,
  result_snapshot jsonb not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create index if not exists ta14_eeg_receipts_created_at_idx
  on public.ta14_environmental_gateway_receipts (created_at desc);

create index if not exists ta14_eeg_receipts_record_id_idx
  on public.ta14_environmental_gateway_receipts (record_id);

alter table public.ta14_environmental_gateway_receipts enable row level security;

comment on table public.ta14_environmental_gateway_receipts is
  'Private immutable receipt ledger for the TA-14 Environmental Evidence Gateway HibouAir reference implementation. No public RLS policies; server service-role access only.';
