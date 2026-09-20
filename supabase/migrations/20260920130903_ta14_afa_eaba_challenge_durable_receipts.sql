-- Reconstructs production migration 20260920130903 from the live schema.
create table if not exists public.ta14_afa_eaba_challenge_receipts (
  receipt_id uuid primary key default gen_random_uuid(),
  run_id uuid not null unique,
  mechanism_id text not null,
  mechanism_version text not null,
  action text not null,
  evidence_json jsonb not null,
  integrity_hash text not null check (integrity_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);
alter table public.ta14_afa_eaba_challenge_receipts enable row level security;
revoke all on table public.ta14_afa_eaba_challenge_receipts from anon, authenticated;
