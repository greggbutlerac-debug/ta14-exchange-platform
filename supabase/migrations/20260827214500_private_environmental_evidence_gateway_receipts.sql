create table if not exists public.ta14_private_environmental_gateway_receipts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  record_id text not null,
  replay_id text not null,
  canonical_version text not null check (canonical_version = 'TA14.EEG.RECEIPT.v1'),
  algorithm text not null check (algorithm = 'SHA-256'),
  evidence_hash text not null,
  determination_hash text not null,
  determination text not null check (determination in ('ALLOW','HOLD','DENY','ESCALATE')),
  receipt_payload jsonb not null,
  preserved_at timestamptz not null default now(),
  unique (owner_user_id, replay_id)
);

alter table public.ta14_private_environmental_gateway_receipts enable row level security;
revoke all on table public.ta14_private_environmental_gateway_receipts from anon;
grant select, insert on table public.ta14_private_environmental_gateway_receipts to authenticated;

create policy "environmental gateway owner select" on public.ta14_private_environmental_gateway_receipts
for select to authenticated using (owner_user_id = auth.uid());
create policy "environmental gateway owner insert" on public.ta14_private_environmental_gateway_receipts
for insert to authenticated with check (owner_user_id = auth.uid());

create index if not exists ta14_private_eeg_receipts_owner_preserved_idx on public.ta14_private_environmental_gateway_receipts(owner_user_id, preserved_at desc);
create index if not exists ta14_private_eeg_receipts_replay_idx on public.ta14_private_environmental_gateway_receipts(replay_id);
