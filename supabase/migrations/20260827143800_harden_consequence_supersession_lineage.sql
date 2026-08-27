-- TA-14 Consequence Examination Engine
-- Post-live corrective migration: prevent competing or cyclic SUPERSEDES lineage.
-- Does not alter Registry identity or the 14-step Registry architecture.

create unique index if not exists consequence_examination_lineage_source_supersedes_uq
  on public.consequence_examination_lineage(source_run_id)
  where relationship='SUPERSEDES';

create or replace function public.consequence_record_examination_lineage(
  p_lineage_id text,
  p_source_run_id text,
  p_successor_run_id text,
  p_reconsideration_id text,
  p_relationship text,
  p_recorded_by_user_id uuid,
  p_recorded_by_name text,
  p_lineage_body jsonb,
  p_lineage_sha256 text
)
returns public.consequence_examination_lineage
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_source public.consequence_examination_runs;
  v_successor public.consequence_examination_runs;
  v_reconsideration public.consequence_examination_reconsiderations;
  v_record public.consequence_examination_lineage;
  v_seq integer;
  v_creates_cycle boolean := false;
begin
  if p_relationship not in ('SUPERSEDES','REEXAMINES') then raise exception 'Invalid examination lineage relationship'; end if;
  if p_source_run_id=p_successor_run_id then raise exception 'An examination cannot be its own successor'; end if;
  if p_lineage_sha256 !~ '^[A-Fa-f0-9]{64}$' then raise exception 'Lineage requires SHA-256'; end if;
  if not public.consequence_verify_payload_hash_v1(p_lineage_body,p_lineage_sha256) then
    raise exception 'Lineage body does not match TA14-CES-v1 SHA-256';
  end if;

  select * into v_source from public.consequence_examination_runs where run_id=p_source_run_id for update;
  select * into v_successor from public.consequence_examination_runs where run_id=p_successor_run_id;
  if v_source.id is null or v_source.status<>'SEALED' or v_source.run_sha256 is null then raise exception 'Source examination must be sealed'; end if;
  if v_successor.id is null or v_successor.status<>'SEALED' or v_successor.run_sha256 is null then raise exception 'Successor examination must be sealed'; end if;
  if v_source.registry_record_id is distinct from v_successor.registry_record_id or v_source.registry_version_record_id is distinct from v_successor.registry_version_record_id then
    raise exception 'Lineage requires the same registered architecture/version';
  end if;

  if p_relationship='SUPERSEDES' then
    if exists (
      select 1
      from public.consequence_examination_lineage
      where source_run_id=p_source_run_id and relationship='SUPERSEDES'
    ) then
      raise exception 'Source examination already has a superseding successor';
    end if;

    with recursive successor_path(run_id) as (
      select p_successor_run_id
      union
      select l.successor_run_id
      from public.consequence_examination_lineage l
      join successor_path p on l.source_run_id=p.run_id
      where l.relationship='SUPERSEDES'
    )
    select exists (
      select 1 from successor_path where run_id=p_source_run_id
    ) into v_creates_cycle;

    if v_creates_cycle then
      raise exception 'Supersession lineage would create a cycle';
    end if;

    if p_reconsideration_id is null then raise exception 'SUPERSEDES requires a reconsideration record'; end if;
    select * into v_reconsideration from public.consequence_examination_reconsiderations where reconsideration_id=p_reconsideration_id;
    if v_reconsideration.id is null then raise exception 'Reconsideration not found'; end if;
    if v_reconsideration.run_id<>p_source_run_id or v_reconsideration.superseding_run_id<>p_successor_run_id or v_reconsideration.determination<>'SUPERSEDING_EXAMINATION_REQUIRED' then
      raise exception 'Reconsideration does not authorize this supersession lineage';
    end if;
  elsif p_reconsideration_id is not null then
    select * into v_reconsideration from public.consequence_examination_reconsiderations where reconsideration_id=p_reconsideration_id;
    if v_reconsideration.id is null or v_reconsideration.run_id<>p_source_run_id then raise exception 'Reconsideration does not belong to source run'; end if;
  end if;

  insert into public.consequence_examination_lineage(
    lineage_id,source_run_id,successor_run_id,reconsideration_id,relationship,
    source_run_sha256,successor_run_sha256,registry_record_id,registry_version_record_id,
    lineage_body,lineage_sha256,recorded_by_user_id,recorded_by_name
  ) values (
    p_lineage_id,p_source_run_id,p_successor_run_id,p_reconsideration_id,p_relationship,
    v_source.run_sha256,v_successor.run_sha256,v_source.registry_record_id,v_source.registry_version_record_id,
    p_lineage_body,lower(p_lineage_sha256),p_recorded_by_user_id,p_recorded_by_name
  ) returning * into v_record;

  select coalesce(max(sequence_no),0)+1 into v_seq from public.consequence_examination_chronology where run_id=p_source_run_id;
  insert into public.consequence_examination_chronology(run_id,sequence_no,event_kind,object_id,object_sha256,event_payload)
  values (p_source_run_id,v_seq,'EXAMINATION_LINEAGE',p_lineage_id,lower(p_lineage_sha256),
    jsonb_build_object('relationship',p_relationship,'successor_run_id',p_successor_run_id,
      'source_run_sha256',v_source.run_sha256,'successor_run_sha256',v_successor.run_sha256,
      'reconsideration_id',p_reconsideration_id,'registry_record_id',v_source.registry_record_id,
      'registry_version_record_id',v_source.registry_version_record_id));

  return v_record;
end;
$$;

revoke all on function public.consequence_record_examination_lineage(text,text,text,text,text,uuid,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.consequence_record_examination_lineage(text,text,text,text,text,uuid,text,jsonb,text) to service_role;


