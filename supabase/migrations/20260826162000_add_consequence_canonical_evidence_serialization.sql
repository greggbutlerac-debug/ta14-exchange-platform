-- TA-14 Consequence Examination Engine
-- Canonical Evidence Serialization v1 + SHA-256 recomputation.
-- Freeze-worthy cryptographic boundary.
-- Does not modify Registry submission/readiness/finalization architecture.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.consequence_canonical_json_v1(p_value jsonb)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select p_value::text;
$$;

create or replace function public.consequence_sha256_v1(p_value jsonb)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select encode(extensions.digest(convert_to(public.consequence_canonical_json_v1(p_value), 'UTF8'), 'sha256'), 'hex');
$$;

create or replace function public.consequence_verify_payload_hash_v1(
  p_value jsonb,
  p_expected_sha256 text
)
returns boolean
language sql
immutable
strict
set search_path = ''
as $$
  select public.consequence_sha256_v1(p_value) = lower(p_expected_sha256);
$$;

revoke all on function public.consequence_canonical_json_v1(jsonb) from public, anon, authenticated;
revoke all on function public.consequence_sha256_v1(jsonb) from public, anon, authenticated;
revoke all on function public.consequence_verify_payload_hash_v1(jsonb,text) from public, anon, authenticated;
grant execute on function public.consequence_canonical_json_v1(jsonb) to service_role;
grant execute on function public.consequence_sha256_v1(jsonb) to service_role;
grant execute on function public.consequence_verify_payload_hash_v1(jsonb,text) to service_role;

create or replace function public.consequence_verify_integrity_v2(p_run_id text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_base jsonb;
  v_failures jsonb;
  v_event record;
  v_finding public.consequence_examination_findings;
  v_seal public.consequence_examination_seals;
  v_receipt public.consequence_examination_receipts;
begin
  v_base := public.consequence_verify_integrity(p_run_id);
  if coalesce(v_base->>'integrity','') = 'NOT_FOUND' then
    return v_base || jsonb_build_object('cryptographic_integrity','NOT_APPLICABLE','canonicalization','TA14-CES-v1');
  end if;

  v_failures := coalesce(v_base->'failures','[]'::jsonb);

  for v_event in
    select stage_id,payload,payload_sha256
    from public.consequence_examination_events
    where run_id=p_run_id and stage_id ~ '^S[0-7]$'
  loop
    if not public.consequence_verify_payload_hash_v1(v_event.payload,v_event.payload_sha256) then
      v_failures := v_failures || jsonb_build_array(v_event.stage_id || '_PAYLOAD_HASH_MISMATCH');
    end if;
  end loop;

  select * into v_finding from public.consequence_examination_findings where run_id=p_run_id;
  if v_finding.id is not null and not public.consequence_verify_payload_hash_v1(v_finding.finding_body,v_finding.finding_sha256) then
    v_failures := v_failures || jsonb_build_array('FINDING_PAYLOAD_HASH_MISMATCH');
  end if;

  select * into v_seal from public.consequence_examination_seals where run_id=p_run_id;
  if v_seal.id is not null and not public.consequence_verify_payload_hash_v1(v_seal.seal_manifest,v_seal.seal_sha256) then
    v_failures := v_failures || jsonb_build_array('SEAL_PAYLOAD_HASH_MISMATCH');
  end if;

  select * into v_receipt from public.consequence_examination_receipts where run_id=p_run_id;
  if v_receipt.id is not null and not public.consequence_verify_payload_hash_v1(v_receipt.receipt_payload,v_receipt.receipt_sha256) then
    v_failures := v_failures || jsonb_build_array('RECEIPT_PAYLOAD_HASH_MISMATCH');
  end if;

  return (v_base - 'integrity' - 'failures' - 'verification_boundary') ||
    jsonb_build_object(
      'integrity',case when jsonb_array_length(v_failures)=0 then 'VERIFIED' else 'FAILED' end,
      'cryptographic_integrity',case when jsonb_array_length(v_failures)=0 then 'VERIFIED' else 'FAILED' end,
      'canonicalization','TA14-CES-v1',
      'canonical_rule','PostgreSQL jsonb normalized textual representation encoded as UTF-8; SHA-256 over those exact bytes.',
      'failures',v_failures,
      'verification_boundary','TA14-CES-v1 recomputes S0-S7 payload, finding, seal-manifest, and receipt-payload SHA-256 values. Run aggregate hash recomputation remains outside this version until the run-manifest composition is separately frozen.'
    );
end;
$$;

revoke all on function public.consequence_verify_integrity_v2(text) from public, anon, authenticated;
grant execute on function public.consequence_verify_integrity_v2(text) to service_role;
