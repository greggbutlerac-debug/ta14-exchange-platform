-- TA-14 Consequence Examination Engine
-- Current Reliance Resolution v1.
-- Derives present reliance posture without mutating any historical examination object.
-- No Registry submission/readiness/finalization architecture is altered.

create or replace function public.consequence_resolve_current_reliance(p_run_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_finding public.consequence_examination_findings;
  v_seal public.consequence_examination_seals;
  v_latest_lineage public.consequence_examination_lineage;
  v_open_challenges integer := 0;
  v_latest_reconsideration public.consequence_examination_reconsiderations;
  v_current_run_id text;
  v_current_run_sha256 text;
  v_posture text;
  v_reason text;
begin
  select * into v_run
  from public.consequence_examination_runs
  where run_id=p_run_id;

  if v_run.id is null then
    return jsonb_build_object(
      'run_id',p_run_id,
      'reliance_posture','NOT_FOUND',
      'reason','EXAMINATION_NOT_FOUND'
    );
  end if;

  if v_run.status <> 'SEALED' or v_run.run_sha256 is null then
    return jsonb_build_object(
      'run_id',p_run_id,
      'registry_record_id',v_run.registry_record_id,
      'registry_version_record_id',v_run.registry_version_record_id,
      'reliance_posture','NOT_RELIANCE_ELIGIBLE',
      'reason','EXAMINATION_NOT_SEALED'
    );
  end if;

  select * into v_finding
  from public.consequence_examination_findings
  where run_id=p_run_id;

  select * into v_seal
  from public.consequence_examination_seals
  where run_id=p_run_id;

  select count(*) into v_open_challenges
  from public.consequence_examination_challenges
  where run_id=p_run_id and status in ('OPEN','UNDER_RECONSIDERATION');

  select * into v_latest_reconsideration
  from public.consequence_examination_reconsiderations
  where run_id=p_run_id
  order by issued_at desc
  limit 1;

  select * into v_latest_lineage
  from public.consequence_examination_lineage
  where source_run_id=p_run_id and relationship='SUPERSEDES'
  order by recorded_at desc
  limit 1;

  if v_latest_lineage.id is not null then
    v_current_run_id:=v_latest_lineage.successor_run_id;
    v_current_run_sha256:=v_latest_lineage.successor_run_sha256;
    v_posture:='SUPERSEDED';
    v_reason:='A separately sealed successor examination is the later reliance object.';
  elsif v_latest_reconsideration.id is not null and v_latest_reconsideration.determination='SUPERSEDING_EXAMINATION_REQUIRED' then
    v_current_run_id:=p_run_id;
    v_current_run_sha256:=v_run.run_sha256;
    v_posture:='REEXAMINATION_REQUIRED';
    v_reason:='Reconsideration requires a superseding examination; no completed supersession lineage is yet controlling.';
  elsif v_open_challenges > 0 then
    v_current_run_id:=p_run_id;
    v_current_run_sha256:=v_run.run_sha256;
    v_posture:='CHALLENGED';
    v_reason:='The sealed examination remains historical fact but has an unresolved challenge.';
  elsif v_latest_reconsideration.id is not null and v_latest_reconsideration.determination='INDETERMINATE' then
    v_current_run_id:=p_run_id;
    v_current_run_sha256:=v_run.run_sha256;
    v_posture:='RELIANCE_UNRESOLVED';
    v_reason:='Latest reconsideration is indeterminate.';
  else
    v_current_run_id:=p_run_id;
    v_current_run_sha256:=v_run.run_sha256;
    v_posture:='CURRENT';
    v_reason:='No later supersession or unresolved challenge changes the present reliance posture.';
  end if;

  return jsonb_build_object(
    'queried_run_id',p_run_id,
    'queried_run_sha256',v_run.run_sha256,
    'registry_record_id',v_run.registry_record_id,
    'registry_version_record_id',v_run.registry_version_record_id,
    'source_finding_id',v_finding.finding_id,
    'source_finding_sha256',v_finding.finding_sha256,
    'source_seal_id',v_seal.seal_id,
    'source_seal_sha256',v_seal.seal_sha256,
    'reliance_posture',v_posture,
    'reason',v_reason,
    'current_reliance_run_id',v_current_run_id,
    'current_reliance_run_sha256',v_current_run_sha256,
    'open_challenge_count',v_open_challenges,
    'latest_reconsideration_id',v_latest_reconsideration.reconsideration_id,
    'latest_reconsideration_determination',v_latest_reconsideration.determination,
    'supersession_lineage_id',v_latest_lineage.lineage_id,
    'semantic_boundary','This function derives current reliance posture from preserved historical records. It does not amend, revoke, erase, or rewrite any examination, finding, seal, receipt, challenge, reconsideration, lineage object, or Registry identity.'
  );
end;
$$;

create or replace function public.consequence_resolve_lineage_head(p_run_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_start public.consequence_examination_runs;
  v_current text := p_run_id;
  v_next text;
  v_depth integer := 0;
  v_path jsonb := jsonb_build_array(p_run_id);
begin
  select * into v_start from public.consequence_examination_runs where run_id=p_run_id;
  if v_start.id is null then
    return jsonb_build_object('run_id',p_run_id,'status','NOT_FOUND');
  end if;

  loop
    select successor_run_id into v_next
    from public.consequence_examination_lineage
    where source_run_id=v_current and relationship='SUPERSEDES'
    order by recorded_at desc
    limit 1;

    exit when v_next is null;
    if v_path @> jsonb_build_array(v_next) then
      return jsonb_build_object(
        'run_id',p_run_id,'status','LINEAGE_CYCLE_DETECTED','path',v_path || jsonb_build_array(v_next)
      );
    end if;

    v_current:=v_next;
    v_path:=v_path || jsonb_build_array(v_current);
    v_depth:=v_depth+1;
    if v_depth > 100 then
      return jsonb_build_object('run_id',p_run_id,'status','LINEAGE_DEPTH_EXCEEDED','path',v_path);
    end if;
    v_next:=null;
  end loop;

  return jsonb_build_object(
    'run_id',p_run_id,
    'status','RESOLVED',
    'lineage_head_run_id',v_current,
    'supersession_depth',v_depth,
    'path',v_path,
    'registry_record_id',v_start.registry_record_id,
    'registry_version_record_id',v_start.registry_version_record_id,
    'semantic_boundary','Lineage resolution identifies the latest preserved successor. It does not mutate historical examinations.'
  );
end;
$$;

revoke all on function public.consequence_resolve_current_reliance(text) from public, anon, authenticated;
revoke all on function public.consequence_resolve_lineage_head(text) from public, anon, authenticated;
grant execute on function public.consequence_resolve_current_reliance(text) to service_role;
grant execute on function public.consequence_resolve_lineage_head(text) to service_role;
