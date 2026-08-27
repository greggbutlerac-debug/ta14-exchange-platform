-- TA-14 Consequence Examination Engine
-- Independent Verification Standing + Replay Admissibility v1.
-- No Registry submission/readiness/finalization architecture is altered.

create table if not exists public.consequence_verification_admissibility (
  id uuid primary key default gen_random_uuid(),
  admissibility_id text not null unique,
  run_id text not null references public.consequence_examination_runs(run_id),
  verifier_user_id uuid not null,
  verifier_name text not null,
  verifier_organization text,
  standing_basis jsonb not null,
  independence_declaration jsonb not null,
  accepted_scope jsonb not null,
  replay_boundary jsonb not null,
  source_run_sha256 text not null,
  source_seal_id text,
  source_seal_sha256 text,
  admissibility_determination text not null check (admissibility_determination in ('ADMISSIBLE','PARTIALLY_ADMISSIBLE','INADMISSIBLE','INDETERMINATE')),
  limitations jsonb not null default '[]'::jsonb,
  admissibility_body jsonb not null,
  admissibility_sha256 text not null check (admissibility_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists consequence_verification_admissibility_run_verifier_uq
  on public.consequence_verification_admissibility(run_id, verifier_user_id);

alter table public.consequence_verification_admissibility enable row level security;

create or replace function public.consequence_record_verification_admissibility(
  p_admissibility_id text,
  p_run_id text,
  p_verifier_user_id uuid,
  p_verifier_name text,
  p_verifier_organization text,
  p_standing_basis jsonb,
  p_independence_declaration jsonb,
  p_accepted_scope jsonb,
  p_replay_boundary jsonb,
  p_admissibility_determination text,
  p_limitations jsonb,
  p_admissibility_body jsonb,
  p_admissibility_sha256 text
)
returns public.consequence_verification_admissibility
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_seal public.consequence_examination_seals;
  v_record public.consequence_verification_admissibility;
  v_seq integer;
begin
  if p_admissibility_determination not in ('ADMISSIBLE','PARTIALLY_ADMISSIBLE','INADMISSIBLE','INDETERMINATE') then
    raise exception 'Invalid verification admissibility determination';
  end if;
  if p_admissibility_sha256 !~ '^[A-Fa-f0-9]{64}$' then
    raise exception 'Verification admissibility requires SHA-256';
  end if;
  if not public.consequence_verify_payload_hash_v1(p_admissibility_body,p_admissibility_sha256) then
    raise exception 'Admissibility body does not match TA14-CES-v1 SHA-256';
  end if;

  select * into v_run from public.consequence_examination_runs where run_id=p_run_id for update;
  if v_run.id is null or v_run.status <> 'SEALED' or v_run.run_sha256 is null then
    raise exception 'Verification admissibility requires a sealed source run';
  end if;
  if p_verifier_user_id = v_run.operator_user_id then
    raise exception 'Independent verifier cannot be the bound examination operator';
  end if;

  select * into v_seal from public.consequence_examination_seals where run_id=p_run_id;

  insert into public.consequence_verification_admissibility (
    admissibility_id,run_id,verifier_user_id,verifier_name,verifier_organization,
    standing_basis,independence_declaration,accepted_scope,replay_boundary,
    source_run_sha256,source_seal_id,source_seal_sha256,
    admissibility_determination,limitations,admissibility_body,admissibility_sha256
  ) values (
    p_admissibility_id,p_run_id,p_verifier_user_id,p_verifier_name,p_verifier_organization,
    p_standing_basis,p_independence_declaration,p_accepted_scope,p_replay_boundary,
    v_run.run_sha256,v_seal.seal_id,v_seal.seal_sha256,
    p_admissibility_determination,coalesce(p_limitations,'[]'::jsonb),p_admissibility_body,lower(p_admissibility_sha256)
  ) returning * into v_record;

  select coalesce(max(sequence_no),0)+1 into v_seq
  from public.consequence_examination_chronology where run_id=p_run_id;

  insert into public.consequence_examination_chronology
    (run_id,sequence_no,event_kind,object_id,object_sha256,event_payload)
  values (
    p_run_id,v_seq,'VERIFIER_ADMISSIBILITY',p_admissibility_id,lower(p_admissibility_sha256),
    jsonb_build_object(
      'verifier_user_id',p_verifier_user_id,
      'verifier_name',p_verifier_name,
      'verifier_organization',p_verifier_organization,
      'admissibility_determination',p_admissibility_determination,
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

create or replace function public.consequence_record_independent_verification_v2(
  p_admissibility_id text,
  p_verification_id text,
  p_run_id text,
  p_verifier_user_id uuid,
  p_verifier_name text,
  p_verifier_organization text,
  p_accepted_scope jsonb,
  p_replay_boundary jsonb,
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
  v_adm public.consequence_verification_admissibility;
begin
  select * into v_adm
  from public.consequence_verification_admissibility
  where admissibility_id=p_admissibility_id;

  if v_adm.id is null then raise exception 'Frozen verifier admissibility record is required'; end if;
  if v_adm.run_id <> p_run_id then raise exception 'Admissibility record belongs to another run'; end if;
  if v_adm.verifier_user_id <> p_verifier_user_id then raise exception 'Verifier identity does not match admissibility record'; end if;
  if v_adm.verifier_name is distinct from p_verifier_name
     or v_adm.verifier_organization is distinct from p_verifier_organization then
    raise exception 'Verifier attribution does not match admissibility record';
  end if;
  if v_adm.accepted_scope is distinct from p_accepted_scope then
    raise exception 'Verification scope does not match frozen admissibility scope';
  end if;
  if v_adm.replay_boundary is distinct from p_replay_boundary then
    raise exception 'Replay boundary does not match frozen admissibility boundary';
  end if;
  if v_adm.admissibility_determination not in ('ADMISSIBLE','PARTIALLY_ADMISSIBLE') then
    raise exception 'Verifier is not admissible for independent verification';
  end if;

  return public.consequence_record_independent_verification(
    p_verification_id,p_run_id,p_verifier_user_id,p_verifier_name,p_verifier_organization,
    p_verification_method,p_replay_environment,p_verification_result,p_verification_body,p_verification_sha256
  );
end;
$$;

revoke all on table public.consequence_verification_admissibility from public, anon, authenticated;
revoke execute on function public.consequence_record_independent_verification(text,text,uuid,text,text,text,jsonb,text,jsonb,text) from service_role;
revoke all on function public.consequence_record_verification_admissibility(text,text,uuid,text,text,jsonb,jsonb,jsonb,jsonb,text,jsonb,jsonb,text) from public, anon, authenticated;
revoke all on function public.consequence_record_independent_verification_v2(text,text,text,uuid,text,text,jsonb,jsonb,text,jsonb,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.consequence_record_verification_admissibility(text,text,uuid,text,text,jsonb,jsonb,jsonb,jsonb,text,jsonb,jsonb,text) to service_role;
grant execute on function public.consequence_record_independent_verification_v2(text,text,text,uuid,text,text,jsonb,jsonb,text,jsonb,text,jsonb,text) to service_role;
