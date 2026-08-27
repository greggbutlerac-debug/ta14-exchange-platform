-- TA-14 Consequence Examination Engine
-- Production acceptance corrective migration, executed 2026-08-27.
-- Reconcile the runtime helper to the canonical SCENARIO_STAGE event grammar.

create or replace function public.consequence_record_stage(
  p_run_id text,
  p_operator_user_id uuid,
  p_stage_id text,
  p_payload jsonb,
  p_payload_sha256 text
)
returns public.consequence_examination_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_event public.consequence_examination_events;
  v_expected integer;
  v_stage_num integer;
  v_seq integer;
begin
  if p_stage_id !~ '^S[0-7]$' then raise exception 'Stage must be S0 through S7'; end if;
  if p_payload_sha256 !~ '^[A-Fa-f0-9]{64}$' then raise exception 'Stage payload requires a SHA-256 digest'; end if;

  select * into v_run from public.consequence_examination_runs where run_id=p_run_id for update;
  if v_run.id is null or v_run.status <> 'OPEN' then raise exception 'Stage recording requires an open examination run'; end if;
  if v_run.operator_user_id <> p_operator_user_id then raise exception 'Only the bound examination operator may record stages'; end if;

  select count(*)::integer into v_expected
  from public.consequence_examination_events
  where run_id=p_run_id and stage_id ~ '^S[0-7]$';
  v_stage_num:=substring(p_stage_id from 2)::integer;
  if v_stage_num <> v_expected then raise exception 'Stage chronology violation: expected S%, received %',v_expected,p_stage_id; end if;
  if exists(select 1 from public.consequence_examination_events where run_id=p_run_id and stage_id=p_stage_id) then raise exception 'Stage % already recorded',p_stage_id; end if;

  insert into public.consequence_examination_events(run_id,operator_user_id,event_type,stage_id,payload,payload_sha256)
  values(p_run_id,p_operator_user_id,'SCENARIO_STAGE',p_stage_id,p_payload,lower(p_payload_sha256))
  returning * into v_event;

  select coalesce(max(sequence_no),0)+1 into v_seq from public.consequence_examination_chronology where run_id=p_run_id;
  insert into public.consequence_examination_chronology(run_id,sequence_no,event_kind,object_id,object_sha256,event_payload)
  values(p_run_id,v_seq,p_stage_id,v_event.id::text,lower(p_payload_sha256),p_payload);
  return v_event;
end;
$$;

revoke all on function public.consequence_record_stage(text,uuid,text,jsonb,text) from public, anon, authenticated;
grant execute on function public.consequence_record_stage(text,uuid,text,jsonb,text) to service_role;
