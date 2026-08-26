-- TA-14 Consequence Examination Engine
-- Independent Verification / Replay Evidence v1.
-- Verification is separately attributable and append-only in meaning.
-- It cannot alter the original run, finding, seal, receipt, or Registry identity.

create table if not exists public.consequence_independent_verifications (
  id uuid primary key default gen_random_uuid(),
  verification_id text not null unique,
  run_id text not null references public.consequence_examination_runs(run_id),
  verifier_user_id uuid not null,
  verifier_name text not null,
  verifier_organization text,
  verification_method text not null,
  source_run_sha256 text not null,
  source_seal_id text,
  source_seal_sha256 text,
  replay_environment jsonb not null default '{}'::jsonb,
  verification_result text not null check (verification_result in ('VERIFIED','FAILED','INDETERMINATE')),
  verification_body jsonb not null,
  verification_sha256 text not null check (verification_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists consequence_independent_verifications_run_idx
  on public.consequence_independent_verifications(run_id, issued_at);

alter table public.consequence_independent_verifications enable row level security;

create or replace function public.consequence_record_independent_verification(
  p_verification_id text,
  p_run_id text,
  p_verifier_user_id uuid,
  p_verifier_name text,
  p_verifier_organization text,
  p_verification_method text,
  p_replay_environment jsonb,
  p_verification_result text,
  p_verification_body jsonb,
  p_verification_sha256 text
)
returns public.consequence_independent_verifications
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_seal public.consequence_examination_seals;
  v_record public.consequence_independent_verifications;
  v_seq integer;
begin
  if p_verification_result not in ('VERIFIED','FAILED','INDETERMINATE') then
    raise exception 'Invalid independent verification result';
  end if;
  if p_verification_sha256 !~ '^[A-Fa-f0-9]{64}$' then
    raise exception 'Independent verification requires SHA-256';
  end if;
  if not public.consequence_verify_payload_hash_v1(p_verification_body,p_verification_sha256) then
    raise exception 'Independent verification body does not match TA14-CES-v1 SHA-256';
  end if;

  select * into v_run from public.consequence_examination_runs where run_id=p_run_id for update;
  if v_run.id is null or v_run.status <> 'SEALED' or v_run.run_sha256 is null then
    raise exception 'Independent verification requires an already sealed examination run';
  end if;

  select * into v_seal from public.consequence_examination_seals where run_id=p_run_id;

  insert into public.consequence_independent_verifications (
    verification_id,run_id,verifier_user_id,verifier_name,verifier_organization,
    verification_method,source_run_sha256,source_seal_id,source_seal_sha256,
    replay_environment,verification_result,verification_body,verification_sha256
  ) values (
    p_verification_id,p_run_id,p_verifier_user_id,p_verifier_name,p_verifier_organization,
    p_verification_method,v_run.run_sha256,v_seal.seal_id,v_seal.seal_sha256,
    coalesce(p_replay_environment,'{}'::jsonb),p_verification_result,p_verification_body,
    lower(p_verification_sha256)
  ) returning * into v_record;

  select coalesce(max(sequence_no),0)+1 into v_seq
  from public.consequence_examination_chronology where run_id=p_run_id;

  insert into public.consequence_examination_chronology
    (run_id,sequence_no,event_kind,object_id,object_sha256,event_payload)
  values (
    p_run_id,v_seq,'INDEPENDENT_VERIFICATION',p_verification_id,lower(p_verification_sha256),
    jsonb_build_object(
      'verification_result',p_verification_result,
      'verification_method',p_verification_method,
      'verifier_name',p_verifier_name,
      'verifier_organization',p_verifier_organization,
      'source_run_sha256',v_run.run_sha256,
      'source_seal_id',v_seal.seal_id,
      'source_seal_sha256',v_seal.seal_sha256,
      'registry_record_id',v_run.registry_record_id,
      'registry_version_record_id',v_run.registry_version_record_id
    )
  );

  return v_record;
end;
$$;

create or replace function public.consequence_verify_independent_verification(p_verification_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_ver public.consequence_independent_verifications;
  v_run public.consequence_examination_runs;
  v_seal public.consequence_examination_seals;
  v_failures jsonb := '[]'::jsonb;
begin
  select * into v_ver from public.consequence_independent_verifications where verification_id=p_verification_id;
  if v_ver.id is null then
    return jsonb_build_object('verification_id',p_verification_id,'integrity','NOT_FOUND','failures',jsonb_build_array('VERIFICATION_NOT_FOUND'));
  end if;

  select * into v_run from public.consequence_examination_runs where run_id=v_ver.run_id;
  if v_run.id is null then v_failures:=v_failures||jsonb_build_array('SOURCE_RUN_NOT_FOUND');
  elsif v_run.run_sha256 is distinct from v_ver.source_run_sha256 then v_failures:=v_failures||jsonb_build_array('SOURCE_RUN_HASH_MISMATCH'); end if;

  if v_ver.source_seal_id is not null then
    select * into v_seal from public.consequence_examination_seals where seal_id=v_ver.source_seal_id;
    if v_seal.id is null then v_failures:=v_failures||jsonb_build_array('SOURCE_SEAL_NOT_FOUND');
    elsif v_seal.run_id is distinct from v_ver.run_id then v_failures:=v_failures||jsonb_build_array('SOURCE_SEAL_RUN_MISMATCH');
    elsif v_seal.seal_sha256 is distinct from v_ver.source_seal_sha256 then v_failures:=v_failures||jsonb_build_array('SOURCE_SEAL_HASH_MISMATCH'); end if;
  end if;

  if not public.consequence_verify_payload_hash_v1(v_ver.verification_body,v_ver.verification_sha256) then
    v_failures:=v_failures||jsonb_build_array('VERIFICATION_BODY_HASH_MISMATCH');
  end if;

  return jsonb_build_object(
    'verification_id',v_ver.verification_id,
    'run_id',v_ver.run_id,
    'integrity',case when jsonb_array_length(v_failures)=0 then 'VERIFIED' else 'FAILED' end,
    'verification_result',v_ver.verification_result,
    'verifier_name',v_ver.verifier_name,
    'verifier_organization',v_ver.verifier_organization,
    'source_run_sha256',v_ver.source_run_sha256,
    'source_seal_id',v_ver.source_seal_id,
    'verification_sha256',v_ver.verification_sha256,
    'failures',v_failures,
    'semantic_boundary','This is a separately attributable verification evidence object. It cannot retrospectively alter the source examination determination, finding, seal, receipt, or Registry identity.'
  );
end;
$$;

revoke all on table public.consequence_independent_verifications from public, anon, authenticated;
revoke all on function public.consequence_record_independent_verification(text,text,uuid,text,text,text,jsonb,text,jsonb,text) from public, anon, authenticated;
revoke all on function public.consequence_verify_independent_verification(text) from public, anon, authenticated;
grant execute on function public.consequence_record_independent_verification(text,text,uuid,text,text,text,jsonb,text,jsonb,text) to service_role;
grant execute on function public.consequence_verify_independent_verification(text) to service_role;
