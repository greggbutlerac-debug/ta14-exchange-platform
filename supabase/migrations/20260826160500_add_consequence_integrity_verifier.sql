-- TA-14 Consequence Examination Engine
-- End-to-end structural integrity verifier.
-- Verifies linkage and recorded digest continuity; it does not recompute hashes from JSON payloads.
-- Does not modify Registry submission/readiness/finalization architecture.

create or replace function public.consequence_verify_integrity(p_run_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_freeze public.consequence_technical_freezes;
  v_finding public.consequence_examination_findings;
  v_seal public.consequence_examination_seals;
  v_receipt public.consequence_examination_receipts;
  v_registry_identifier text;
  v_registry_version text;
  v_version_identifier text;
  v_version_label text;
  v_stage_count integer;
  v_distinct_stage_count integer;
  v_stage_order text[];
  v_chronology_count integer;
  v_chronology_min integer;
  v_chronology_max integer;
  v_chronology_distinct integer;
  v_failures jsonb := '[]'::jsonb;
  v_terminal_state text;
begin
  select * into v_run from public.consequence_examination_runs where run_id=p_run_id;
  if v_run.id is null then
    return jsonb_build_object('run_id',p_run_id,'integrity','NOT_FOUND','failures',jsonb_build_array('RUN_NOT_FOUND'));
  end if;

  select * into v_freeze from public.consequence_technical_freezes
  where record_id=v_run.freeze_record_id and freeze_sha256=v_run.freeze_sha256;
  if v_freeze.id is null then
    v_failures := v_failures || jsonb_build_array('FREEZE_NOT_FOUND');
  else
    if v_freeze.status <> 'TECHNICAL_FREEZE_ISSUED' then v_failures:=v_failures||jsonb_build_array('FREEZE_NOT_ISSUED'); end if;
    if v_freeze.definition_id is distinct from v_run.definition_id then v_failures:=v_failures||jsonb_build_array('DEFINITION_BINDING_MISMATCH'); end if;
    if v_freeze.registry_record_id is distinct from v_run.registry_record_id then v_failures:=v_failures||jsonb_build_array('REGISTRY_RECORD_BINDING_MISMATCH'); end if;
    if v_freeze.registry_version_record_id is distinct from v_run.registry_version_record_id then v_failures:=v_failures||jsonb_build_array('REGISTRY_VERSION_BINDING_MISMATCH'); end if;
  end if;

  select r.registry_identifier,r.version into v_registry_identifier,v_registry_version
  from public.ta14_registry_public_records r
  where r.id=v_run.registry_record_id and lower(r.status)='registered';
  if v_registry_identifier is null then
    v_failures:=v_failures||jsonb_build_array('REGISTERED_ARCHITECTURE_NOT_FOUND');
  end if;

  select v.registry_identifier,v.version_label into v_version_identifier,v_version_label
  from public.ta14_registry_version_records v where v.id=v_run.registry_version_record_id;
  if v_version_identifier is null then
    v_failures:=v_failures||jsonb_build_array('REGISTRY_VERSION_NOT_FOUND');
  else
    if upper(v_version_identifier) <> upper(v_registry_identifier) then v_failures:=v_failures||jsonb_build_array('REGISTRY_IDENTIFIER_VERSION_MISMATCH'); end if;
    if coalesce(trim(v_version_label),'') <> coalesce(trim(v_registry_version),'') then v_failures:=v_failures||jsonb_build_array('REGISTRY_VERSION_LABEL_MISMATCH'); end if;
  end if;

  select count(*)::integer,count(distinct stage_id)::integer,array_agg(stage_id order by recorded_at,id)
  into v_stage_count,v_distinct_stage_count,v_stage_order
  from public.consequence_examination_events
  where run_id=p_run_id and stage_id ~ '^S[0-7]$';

  if v_run.status='SEALED' then
    if v_stage_count<>8 or v_distinct_stage_count<>8 then v_failures:=v_failures||jsonb_build_array('S0_S7_INCOMPLETE'); end if;
    if v_stage_order is distinct from array['S0','S1','S2','S3','S4','S5','S6','S7']::text[] then v_failures:=v_failures||jsonb_build_array('S0_S7_ORDER_INVALID'); end if;
    if v_run.final_determination is null then v_failures:=v_failures||jsonb_build_array('FINAL_DETERMINATION_MISSING'); end if;
    if v_run.run_sha256 is null or v_run.run_sha256 !~ '^[A-Fa-f0-9]{64}$' then v_failures:=v_failures||jsonb_build_array('RUN_HASH_INVALID'); end if;
  end if;

  select * into v_finding from public.consequence_examination_findings where run_id=p_run_id;
  if v_finding.id is not null then
    if v_run.status<>'SEALED' then v_failures:=v_failures||jsonb_build_array('FINDING_ON_UNSEALED_RUN'); end if;
    if v_finding.determination is distinct from v_run.final_determination then v_failures:=v_failures||jsonb_build_array('FINDING_DETERMINATION_MISMATCH'); end if;
  end if;

  select * into v_seal from public.consequence_examination_seals where run_id=p_run_id;
  if v_seal.id is not null then
    if v_finding.id is null then v_failures:=v_failures||jsonb_build_array('SEAL_WITHOUT_FINDING'); end if;
    if v_seal.finding_id is distinct from v_finding.finding_id then v_failures:=v_failures||jsonb_build_array('SEAL_FINDING_MISMATCH'); end if;
    if v_seal.run_sha256 is distinct from v_run.run_sha256 then v_failures:=v_failures||jsonb_build_array('SEAL_RUN_HASH_MISMATCH'); end if;
    if v_seal.finding_sha256 is distinct from v_finding.finding_sha256 then v_failures:=v_failures||jsonb_build_array('SEAL_FINDING_HASH_MISMATCH'); end if;
  end if;

  select * into v_receipt from public.consequence_examination_receipts where run_id=p_run_id;
  if v_receipt.id is not null then
    if v_seal.id is null then v_failures:=v_failures||jsonb_build_array('RECEIPT_WITHOUT_SEAL'); end if;
    if v_receipt.seal_id is distinct from v_seal.seal_id then v_failures:=v_failures||jsonb_build_array('RECEIPT_SEAL_MISMATCH'); end if;
    if v_receipt.publication_state='PUBLIC' and v_receipt.published_at is null then v_failures:=v_failures||jsonb_build_array('PUBLIC_RECEIPT_WITHOUT_PUBLICATION_TIME'); end if;
  end if;

  select count(*)::integer,min(sequence_no),max(sequence_no),count(distinct sequence_no)::integer
  into v_chronology_count,v_chronology_min,v_chronology_max,v_chronology_distinct
  from public.consequence_examination_chronology where run_id=p_run_id;
  if v_chronology_count>0 and (v_chronology_min<>1 or v_chronology_max<>v_chronology_count or v_chronology_distinct<>v_chronology_count) then
    v_failures:=v_failures||jsonb_build_array('CHRONOLOGY_SEQUENCE_GAP_OR_DUPLICATE');
  end if;

  if v_receipt.id is not null then v_terminal_state:='RECEIPT_ISSUED';
  elsif v_seal.id is not null then v_terminal_state:='EXAMINATION_SEALED';
  elsif v_finding.id is not null then v_terminal_state:='FINDING_ISSUED';
  elsif v_run.status='SEALED' then v_terminal_state:='RUN_SEALED';
  else v_terminal_state:='RUN_OPEN'; end if;

  return jsonb_build_object(
    'run_id',p_run_id,
    'integrity',case when jsonb_array_length(v_failures)=0 then 'VERIFIED' else 'FAILED' end,
    'terminal_state',v_terminal_state,
    'registry_identifier',v_registry_identifier,
    'registry_version',v_registry_version,
    'definition_id',v_run.definition_id,
    'technical_freeze',jsonb_build_object('record_id',v_run.freeze_record_id,'sha256',v_run.freeze_sha256),
    'stages_recorded',coalesce(v_stage_count,0),
    'finding_id',v_finding.finding_id,
    'seal_id',v_seal.seal_id,
    'receipt_id',v_receipt.receipt_id,
    'chronology_events',coalesce(v_chronology_count,0),
    'failures',v_failures,
    'verification_boundary','Structural linkage and recorded digest continuity only; cryptographic payload recomputation is outside this database verifier.'
  );
end;
$$;

revoke all on function public.consequence_verify_integrity(text) from public, anon, authenticated;
grant execute on function public.consequence_verify_integrity(text) to service_role;
