-- TA-14 Consequence Examination Engine
-- Canonical Examination Run Manifest v1 (TA14-RM-v1)
-- Freeze-worthy definition of the aggregate examination-run hash.
-- No Registry submission/readiness/finalization objects are created or modified.

create or replace function public.consequence_run_manifest_v1(p_run_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_freeze public.consequence_technical_freezes;
  v_stages jsonb;
begin
  select * into v_run
  from public.consequence_examination_runs
  where run_id=p_run_id;
  if v_run.id is null then
    raise exception 'Examination run not found';
  end if;

  select * into v_freeze
  from public.consequence_technical_freezes
  where record_id=v_run.freeze_record_id and freeze_sha256=v_run.freeze_sha256;
  if v_freeze.id is null then
    raise exception 'Bound Technical Freeze not found';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'stage_id',e.stage_id,
      'payload_sha256',lower(e.payload_sha256)
    ) order by substring(e.stage_id from 2)::integer
  ) into v_stages
  from public.consequence_examination_events e
  where e.run_id=p_run_id and e.stage_id ~ '^S[0-7]$';

  if jsonb_array_length(coalesce(v_stages,'[]'::jsonb)) <> 8 then
    raise exception 'TA14-RM-v1 requires exactly S0-S7';
  end if;

  return jsonb_build_object(
    'manifest_spec','TA14-RM-v1',
    'run_id',v_run.run_id,
    'registry_record_id',v_run.registry_record_id,
    'registry_version_record_id',v_run.registry_version_record_id,
    'definition_id',v_run.definition_id,
    'technical_freeze',jsonb_build_object(
      'record_id',v_run.freeze_record_id,
      'freeze_sha256',lower(v_run.freeze_sha256)
    ),
    'operator',jsonb_build_object(
      'user_id',v_run.operator_user_id,
      'name',v_run.operator_name
    ),
    'environment_identity',v_run.environment_identity,
    'stages',v_stages,
    'final_determination',v_run.final_determination,
    'outcome_record',v_run.outcome_record
  );
end;
$$;

create or replace function public.consequence_run_sha256_v1(p_run_id text)
returns text
language sql
stable
set search_path = ''
as $$
  select public.consequence_sha256_v1(public.consequence_run_manifest_v1(p_run_id));
$$;

create or replace function public.consequence_verify_run_hash_v1(p_run_id text)
returns boolean
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_recorded text;
begin
  select run_sha256 into v_recorded
  from public.consequence_examination_runs
  where run_id=p_run_id;
  if v_recorded is null then return false; end if;
  return public.consequence_run_sha256_v1(p_run_id)=lower(v_recorded);
end;
$$;

create or replace function public.consequence_verify_integrity_v3(p_run_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_base jsonb;
  v_failures jsonb;
  v_run public.consequence_examination_runs;
begin
  v_base:=public.consequence_verify_integrity_v2(p_run_id);
  if coalesce(v_base->>'integrity','')='NOT_FOUND' then
    return v_base || jsonb_build_object('run_manifest_spec','TA14-RM-v1','run_hash_integrity','NOT_APPLICABLE');
  end if;

  v_failures:=coalesce(v_base->'failures','[]'::jsonb);
  select * into v_run from public.consequence_examination_runs where run_id=p_run_id;

  if v_run.status='SEALED' then
    if not public.consequence_verify_run_hash_v1(p_run_id) then
      v_failures:=v_failures||jsonb_build_array('RUN_MANIFEST_HASH_MISMATCH');
    end if;
  end if;

  return (v_base-'integrity'-'cryptographic_integrity'-'failures'-'verification_boundary') ||
    jsonb_build_object(
      'integrity',case when jsonb_array_length(v_failures)=0 then 'VERIFIED' else 'FAILED' end,
      'cryptographic_integrity',case when jsonb_array_length(v_failures)=0 then 'VERIFIED' else 'FAILED' end,
      'run_hash_integrity',case when v_run.status<>'SEALED' then 'NOT_APPLICABLE' when public.consequence_verify_run_hash_v1(p_run_id) then 'VERIFIED' else 'FAILED' end,
      'run_manifest_spec','TA14-RM-v1',
      'run_manifest_sha256',case when v_run.status='SEALED' then public.consequence_run_sha256_v1(p_run_id) else null end,
      'failures',v_failures,
      'verification_boundary','TA14-CES-v1 + TA14-RM-v1 recompute S0-S7, finding, seal, receipt, and aggregate sealed-run evidence hashes. Registry identity remains referenced, not recreated.'
    );
end;
$$;

revoke all on function public.consequence_run_manifest_v1(text) from public, anon, authenticated;
revoke all on function public.consequence_run_sha256_v1(text) from public, anon, authenticated;
revoke all on function public.consequence_verify_run_hash_v1(text) from public, anon, authenticated;
revoke all on function public.consequence_verify_integrity_v3(text) from public, anon, authenticated;
grant execute on function public.consequence_run_manifest_v1(text) to service_role;
grant execute on function public.consequence_run_sha256_v1(text) to service_role;
grant execute on function public.consequence_verify_run_hash_v1(text) to service_role;
grant execute on function public.consequence_verify_integrity_v3(text) to service_role;
