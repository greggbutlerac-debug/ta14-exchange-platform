-- TA-14 Consequence Examination Engine
-- Controlled finding -> examination seal -> public/withheld receipt issuance.
-- Registry identity remains inherited from the already-bound examination run.
-- No Registry submission/readiness/finalization objects are created or modified.

create or replace function public.consequence_issue_finding(
  p_run_id text,
  p_issuer_user_id uuid,
  p_issuer_name text,
  p_finding_id text,
  p_finding_body jsonb,
  p_finding_sha256 text
)
returns public.consequence_examination_findings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_finding public.consequence_examination_findings;
  v_seq integer;
begin
  if p_finding_sha256 !~ '^[A-Fa-f0-9]{64}$' then
    raise exception 'Finding requires a SHA-256 digest';
  end if;

  select * into v_run
  from public.consequence_examination_runs
  where run_id = p_run_id
  for update;

  if v_run.id is null or v_run.status <> 'SEALED' then
    raise exception 'Finding requires a sealed examination run';
  end if;
  if v_run.final_determination is null or v_run.run_sha256 is null then
    raise exception 'Sealed run is missing terminal determination or hash';
  end if;
  if v_run.registry_record_id is null or v_run.registry_version_record_id is null then
    raise exception 'Sealed run lacks Registry architecture/version binding';
  end if;

  insert into public.consequence_examination_findings
    (finding_id, run_id, determination, finding_body, finding_sha256,
     issuer_user_id, issuer_name)
  values
    (p_finding_id, p_run_id, v_run.final_determination, p_finding_body,
     lower(p_finding_sha256), p_issuer_user_id, p_issuer_name)
  returning * into v_finding;

  select coalesce(max(sequence_no),0)+1 into v_seq
  from public.consequence_examination_chronology where run_id=p_run_id;

  insert into public.consequence_examination_chronology
    (run_id, sequence_no, event_kind, object_id, object_sha256, event_payload)
  values
    (p_run_id, v_seq, 'FINDING', p_finding_id, lower(p_finding_sha256),
     jsonb_build_object(
       'determination', v_run.final_determination,
       'registry_record_id', v_run.registry_record_id,
       'registry_version_record_id', v_run.registry_version_record_id,
       'issuer_name', p_issuer_name));

  return v_finding;
end;
$$;

create or replace function public.consequence_issue_seal(
  p_run_id text,
  p_finding_id text,
  p_sealed_by_user_id uuid,
  p_sealed_by_name text,
  p_seal_id text,
  p_seal_manifest jsonb,
  p_seal_sha256 text
)
returns public.consequence_examination_seals
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_finding public.consequence_examination_findings;
  v_seal public.consequence_examination_seals;
  v_seq integer;
begin
  if p_seal_sha256 !~ '^[A-Fa-f0-9]{64}$' then
    raise exception 'Examination seal requires a SHA-256 digest';
  end if;

  select * into v_run
  from public.consequence_examination_runs
  where run_id=p_run_id
  for update;
  if v_run.id is null or v_run.status <> 'SEALED' or v_run.run_sha256 is null then
    raise exception 'Examination seal requires a sealed run';
  end if;

  select * into v_finding
  from public.consequence_examination_findings
  where finding_id=p_finding_id;
  if v_finding.id is null or v_finding.run_id <> p_run_id then
    raise exception 'Finding must belong to the sealed examination run';
  end if;

  insert into public.consequence_examination_seals
    (seal_id, run_id, finding_id, run_sha256, finding_sha256,
     seal_manifest, seal_sha256, sealed_by_user_id, sealed_by_name)
  values
    (p_seal_id, p_run_id, p_finding_id, v_run.run_sha256,
     v_finding.finding_sha256, p_seal_manifest, lower(p_seal_sha256),
     p_sealed_by_user_id, p_sealed_by_name)
  returning * into v_seal;

  select coalesce(max(sequence_no),0)+1 into v_seq
  from public.consequence_examination_chronology where run_id=p_run_id;

  insert into public.consequence_examination_chronology
    (run_id, sequence_no, event_kind, object_id, object_sha256, event_payload)
  values
    (p_run_id, v_seq, 'SEALED', p_seal_id, lower(p_seal_sha256),
     jsonb_build_object(
       'finding_id', p_finding_id,
       'run_sha256', v_run.run_sha256,
       'finding_sha256', v_finding.finding_sha256,
       'sealed_by_name', p_sealed_by_name));

  return v_seal;
end;
$$;

create or replace function public.consequence_issue_receipt(
  p_run_id text,
  p_seal_id text,
  p_receipt_id text,
  p_receipt_payload jsonb,
  p_receipt_sha256 text,
  p_publication_state text default 'PUBLIC'
)
returns public.consequence_examination_receipts
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_run public.consequence_examination_runs;
  v_seal public.consequence_examination_seals;
  v_receipt public.consequence_examination_receipts;
  v_seq integer;
  v_published_at timestamptz;
begin
  if p_receipt_sha256 !~ '^[A-Fa-f0-9]{64}$' then
    raise exception 'Receipt requires a SHA-256 digest';
  end if;
  if p_publication_state not in ('PUBLIC','WITHHELD') then
    raise exception 'Publication state must be PUBLIC or WITHHELD';
  end if;

  select * into v_run
  from public.consequence_examination_runs
  where run_id=p_run_id;
  if v_run.id is null or v_run.status <> 'SEALED' then
    raise exception 'Receipt requires a sealed examination run';
  end if;

  select * into v_seal
  from public.consequence_examination_seals
  where seal_id=p_seal_id;
  if v_seal.id is null or v_seal.run_id <> p_run_id then
    raise exception 'Receipt seal must belong to the same examination run';
  end if;

  v_published_at := case when p_publication_state='PUBLIC' then now() else null end;

  insert into public.consequence_examination_receipts
    (receipt_id, run_id, seal_id, receipt_payload, receipt_sha256,
     publication_state, published_at)
  values
    (p_receipt_id, p_run_id, p_seal_id, p_receipt_payload,
     lower(p_receipt_sha256), p_publication_state, v_published_at)
  returning * into v_receipt;

  if p_publication_state='PUBLIC' then
    select coalesce(max(sequence_no),0)+1 into v_seq
    from public.consequence_examination_chronology where run_id=p_run_id;

    insert into public.consequence_examination_chronology
      (run_id, sequence_no, event_kind, object_id, object_sha256, event_payload)
    values
      (p_run_id, v_seq, 'RECEIPT_PUBLISHED', p_receipt_id,
       lower(p_receipt_sha256),
       jsonb_build_object(
         'seal_id', p_seal_id,
         'seal_sha256', v_seal.seal_sha256,
         'registry_record_id', v_run.registry_record_id,
         'registry_version_record_id', v_run.registry_version_record_id));
  end if;

  return v_receipt;
end;
$$;

revoke all on function public.consequence_issue_finding(text,uuid,text,text,jsonb,text) from public, anon, authenticated;
revoke all on function public.consequence_issue_seal(text,text,uuid,text,text,jsonb,text) from public, anon, authenticated;
revoke all on function public.consequence_issue_receipt(text,text,text,jsonb,text,text) from public, anon, authenticated;
