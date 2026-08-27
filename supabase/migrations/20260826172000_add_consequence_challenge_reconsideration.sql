-- TA-14 Consequence Examination Engine
-- Post-Examination Challenge + Reconsideration v1.
-- Historical examinations are never rewritten.
-- A changed conclusion requires a separately attributable superseding examination.
-- No Registry submission/readiness/finalization architecture is altered.

create table if not exists public.consequence_examination_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_id text not null unique,
  run_id text not null references public.consequence_examination_runs(run_id),
  challenger_user_id uuid not null,
  challenger_name text not null,
  challenger_organization text,
  challenge_basis text not null,
  challenge_scope jsonb not null,
  challenge_evidence jsonb not null,
  source_run_sha256 text not null,
  source_finding_id text,
  source_finding_sha256 text,
  source_seal_id text,
  source_seal_sha256 text,
  challenge_sha256 text not null check (challenge_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  status text not null default 'OPEN' check (status in ('OPEN','UNDER_RECONSIDERATION','RESOLVED')),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists consequence_examination_challenges_run_idx
  on public.consequence_examination_challenges(run_id, submitted_at);

create table if not exists public.consequence_examination_reconsiderations (
  id uuid primary key default gen_random_uuid(),
  reconsideration_id text not null unique,
  challenge_id text not null unique references public.consequence_examination_challenges(challenge_id),
  run_id text not null references public.consequence_examination_runs(run_id),
  reviewer_user_id uuid not null,
  reviewer_name text not null,
  reviewer_organization text,
  determination text not null check (determination in ('SUSTAINED','SUPERSEDING_EXAMINATION_REQUIRED','REJECTED','INDETERMINATE')),
  rationale jsonb not null,
  limitations jsonb not null default '[]'::jsonb,
  superseding_run_id text references public.consequence_examination_runs(run_id),
  source_run_sha256 text not null,
  reconsideration_sha256 text not null check (reconsideration_sha256 ~ '^[A-Fa-f0-9]{64}$'),
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (
    (determination='SUPERSEDING_EXAMINATION_REQUIRED' and superseding_run_id is not null)
    or
    (determination<>'SUPERSEDING_EXAMINATION_REQUIRED' and superseding_run_id is null)
  )
);

create index if not exists consequence_examination_reconsiderations_run_idx
  on public.consequence_examination_reconsiderations(run_id, issued_at);

alter table public.consequence_examination_challenges enable row level security;
alter table public.consequence_examination_reconsiderations enable row level security;

create or replace function public.consequence_record_challenge(
  p_challenge_id text,
  p_run_id text,
  p_challenger_user_id uuid,
  p_challenger_name text,
  p_challenger_organization text,
  p_challenge_basis text,
  p_challenge_scope jsonb,
  p_challenge_evidence jsonb,
  p_challenge_sha256 text
)
returns public.consequence_examination_challenges
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_finding public.consequence_examination_findings;
  v_seal public.consequence_examination_seals;
  v_record public.consequence_examination_challenges;
  v_body jsonb;
  v_seq integer;
begin
  if p_challenge_sha256 !~ '^[A-Fa-f0-9]{64}$' then raise exception 'Challenge requires SHA-256'; end if;

  select * into v_run from public.consequence_examination_runs where run_id=p_run_id for update;
  if v_run.id is null or v_run.status<>'SEALED' or v_run.run_sha256 is null then
    raise exception 'Challenge requires a sealed source examination';
  end if;

  select * into v_finding from public.consequence_examination_findings where run_id=p_run_id;
  select * into v_seal from public.consequence_examination_seals where run_id=p_run_id;

  v_body:=jsonb_build_object(
    'challenge_id',p_challenge_id,
    'run_id',p_run_id,
    'challenger_user_id',p_challenger_user_id,
    'challenger_name',p_challenger_name,
    'challenger_organization',p_challenger_organization,
    'challenge_basis',p_challenge_basis,
    'challenge_scope',p_challenge_scope,
    'challenge_evidence',p_challenge_evidence,
    'source_run_sha256',v_run.run_sha256,
    'source_finding_id',v_finding.finding_id,
    'source_finding_sha256',v_finding.finding_sha256,
    'source_seal_id',v_seal.seal_id,
    'source_seal_sha256',v_seal.seal_sha256
  );

  if not public.consequence_verify_payload_hash_v1(v_body,p_challenge_sha256) then
    raise exception 'Challenge body does not match TA14-CES-v1 SHA-256';
  end if;

  insert into public.consequence_examination_challenges(
    challenge_id,run_id,challenger_user_id,challenger_name,challenger_organization,
    challenge_basis,challenge_scope,challenge_evidence,source_run_sha256,
    source_finding_id,source_finding_sha256,source_seal_id,source_seal_sha256,challenge_sha256
  ) values (
    p_challenge_id,p_run_id,p_challenger_user_id,p_challenger_name,p_challenger_organization,
    p_challenge_basis,p_challenge_scope,p_challenge_evidence,v_run.run_sha256,
    v_finding.finding_id,v_finding.finding_sha256,v_seal.seal_id,v_seal.seal_sha256,lower(p_challenge_sha256)
  ) returning * into v_record;

  select coalesce(max(sequence_no),0)+1 into v_seq from public.consequence_examination_chronology where run_id=p_run_id;
  insert into public.consequence_examination_chronology(run_id,sequence_no,event_kind,object_id,object_sha256,event_payload)
  values (p_run_id,v_seq,'CHALLENGE_SUBMITTED',p_challenge_id,lower(p_challenge_sha256),
    jsonb_build_object('challenger_name',p_challenger_name,'challenge_basis',p_challenge_basis,
      'source_run_sha256',v_run.run_sha256,'registry_record_id',v_run.registry_record_id,
      'registry_version_record_id',v_run.registry_version_record_id));

  return v_record;
end;
$$;

create or replace function public.consequence_issue_reconsideration(
  p_reconsideration_id text,
  p_challenge_id text,
  p_reviewer_user_id uuid,
  p_reviewer_name text,
  p_reviewer_organization text,
  p_determination text,
  p_rationale jsonb,
  p_limitations jsonb,
  p_superseding_run_id text,
  p_reconsideration_sha256 text
)
returns public.consequence_examination_reconsiderations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_challenge public.consequence_examination_challenges;
  v_run public.consequence_examination_runs;
  v_super public.consequence_examination_runs;
  v_record public.consequence_examination_reconsiderations;
  v_body jsonb;
  v_seq integer;
begin
  if p_determination not in ('SUSTAINED','SUPERSEDING_EXAMINATION_REQUIRED','REJECTED','INDETERMINATE') then raise exception 'Invalid reconsideration determination'; end if;
  if p_reconsideration_sha256 !~ '^[A-Fa-f0-9]{64}$' then raise exception 'Reconsideration requires SHA-256'; end if;

  select * into v_challenge from public.consequence_examination_challenges where challenge_id=p_challenge_id for update;
  if v_challenge.id is null or v_challenge.status='RESOLVED' then raise exception 'Open challenge required'; end if;
  select * into v_run
  from public.consequence_examination_runs
  where run_id=v_challenge.run_id
  for update;

  if v_run.id is null or v_run.status<>'SEALED' or v_run.run_sha256 is null then
    raise exception 'Reconsideration requires the preserved sealed source examination';
  end if;

  if p_determination='SUPERSEDING_EXAMINATION_REQUIRED' then
    if p_superseding_run_id is null then raise exception 'Superseding run is required'; end if;
    select * into v_super from public.consequence_examination_runs where run_id=p_superseding_run_id;
    if v_super.id is null then raise exception 'Superseding examination run not found'; end if;
    if v_super.run_id=v_run.run_id then raise exception 'Source examination cannot supersede itself'; end if;
    if v_super.registry_record_id is distinct from v_run.registry_record_id or v_super.registry_version_record_id is distinct from v_run.registry_version_record_id then
      raise exception 'Superseding examination must bind to the same registered architecture/version';
    end if;
  elsif p_superseding_run_id is not null then
    raise exception 'Superseding run is only permitted for SUPERSEDING_EXAMINATION_REQUIRED';
  end if;

  v_body:=jsonb_build_object(
    'reconsideration_id',p_reconsideration_id,'challenge_id',p_challenge_id,'run_id',v_run.run_id,
    'reviewer_user_id',p_reviewer_user_id,'reviewer_name',p_reviewer_name,
    'reviewer_organization',p_reviewer_organization,'determination',p_determination,
    'rationale',p_rationale,'limitations',coalesce(p_limitations,'[]'::jsonb),
    'superseding_run_id',p_superseding_run_id,'source_run_sha256',v_run.run_sha256,
    'challenge_sha256',v_challenge.challenge_sha256
  );
  if not public.consequence_verify_payload_hash_v1(v_body,p_reconsideration_sha256) then
    raise exception 'Reconsideration body does not match TA14-CES-v1 SHA-256';
  end if;

  insert into public.consequence_examination_reconsiderations(
    reconsideration_id,challenge_id,run_id,reviewer_user_id,reviewer_name,reviewer_organization,
    determination,rationale,limitations,superseding_run_id,source_run_sha256,reconsideration_sha256
  ) values (
    p_reconsideration_id,p_challenge_id,v_run.run_id,p_reviewer_user_id,p_reviewer_name,p_reviewer_organization,
    p_determination,p_rationale,coalesce(p_limitations,'[]'::jsonb),p_superseding_run_id,v_run.run_sha256,lower(p_reconsideration_sha256)
  ) returning * into v_record;

  update public.consequence_examination_challenges set status='RESOLVED' where challenge_id=p_challenge_id;

  select coalesce(max(sequence_no),0)+1 into v_seq from public.consequence_examination_chronology where run_id=v_run.run_id;
  insert into public.consequence_examination_chronology(run_id,sequence_no,event_kind,object_id,object_sha256,event_payload)
  values (v_run.run_id,v_seq,'RECONSIDERATION_ISSUED',p_reconsideration_id,lower(p_reconsideration_sha256),
    jsonb_build_object('challenge_id',p_challenge_id,'determination',p_determination,
      'superseding_run_id',p_superseding_run_id,'source_run_sha256',v_run.run_sha256,
      'registry_record_id',v_run.registry_record_id,'registry_version_record_id',v_run.registry_version_record_id));

  return v_record;
end;
$$;

revoke all on table public.consequence_examination_challenges from public, anon, authenticated;
revoke all on table public.consequence_examination_reconsiderations from public, anon, authenticated;
revoke all on function public.consequence_record_challenge(text,text,uuid,text,text,text,jsonb,jsonb,text) from public, anon, authenticated;
revoke all on function public.consequence_issue_reconsideration(text,text,uuid,text,text,text,jsonb,jsonb,text,text) from public, anon, authenticated;
grant execute on function public.consequence_record_challenge(text,text,uuid,text,text,text,jsonb,jsonb,text) to service_role;
grant execute on function public.consequence_issue_reconsideration(text,text,uuid,text,text,text,jsonb,jsonb,text,text) to service_role;
