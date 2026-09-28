-- TA-14 EIE Tier 1 pilot: RFC 3161 checkpoint witness chain (Phase 3, P3 = 3b).
-- ISOLATED PILOT PROJECT ONLY. NOT APPLIED. Requires owner approval.
--
-- One append-only chain per Recorder: checkpoint_k = {recorderId, seq, windowId, sealHash, closedAt,
-- prevCheckpointHash}. The TSA saw only checkpoint_hash. Each row preserves the complete timestamp token,
-- TSA identity, time, algorithm and imprint needed for offline verification. Service role only.

create table if not exists public.ta14_eie_witness_checkpoints (
  recorder_id text not null,
  seq integer not null check (seq >= 1),
  window_id text not null unique references public.ta14_eie_evidence_windows(window_id),
  seal_hash text not null check (seal_hash ~ '^[0-9a-f]{64}$'),
  checkpoint_hash text not null unique check (checkpoint_hash ~ '^[0-9a-f]{64}$'),
  prev_checkpoint_hash text check (prev_checkpoint_hash is null or prev_checkpoint_hash ~ '^[0-9a-f]{64}$'),
  tsa_gen_time timestamptz not null,
  record jsonb not null,
  stored_at timestamptz not null default now(),
  primary key (recorder_id, seq),
  check (record->>'checkpointHash' = checkpoint_hash and record->'checkpoint'->>'windowId' = window_id
    and record->'tsa'->>'tokenDerBase64' is not null and record->'tsa'->>'messageImprintHex' = checkpoint_hash)
);

-- The chain only grows: contiguous seq, linked to the previous checkpoint, and bound to the window's actual seal.
create or replace function public.ta14_eie_witness_linkage()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  head record;
  sealed text;
begin
  select c.seq, c.checkpoint_hash into head from public.ta14_eie_witness_checkpoints c
    where c.recorder_id = new.recorder_id order by c.seq desc limit 1;
  if (head.seq is null and (new.seq <> 1 or new.prev_checkpoint_hash is not null))
     or (head.seq is not null and (new.seq <> head.seq + 1 or new.prev_checkpoint_hash is distinct from head.checkpoint_hash)) then
    raise exception 'TA14_EIE_WITNESS_CHAIN_BROKEN: checkpoint % does not extend the chain of %', new.seq, new.recorder_id;
  end if;
  select s.seal_hash into sealed from public.ta14_eie_window_seals s where s.window_id = new.window_id;
  if sealed is null or sealed <> new.seal_hash then
    raise exception 'TA14_EIE_WITNESS_SEAL_MISMATCH: checkpoint does not bind the sealed window %', new.window_id;
  end if;
  return new;
end;
$$;
revoke all on function public.ta14_eie_witness_linkage() from public, anon, authenticated;
create trigger ta14_eie_witness_linkage before insert on public.ta14_eie_witness_checkpoints
for each row execute function public.ta14_eie_witness_linkage();

create trigger ta14_eie_witness_append_only before update or delete on public.ta14_eie_witness_checkpoints
for each row execute function public.ta14_eie_pilot_reject_mutation();

alter table public.ta14_eie_witness_checkpoints enable row level security;
revoke all on table public.ta14_eie_witness_checkpoints from anon, authenticated;
revoke update, delete, truncate on table public.ta14_eie_witness_checkpoints from service_role;
