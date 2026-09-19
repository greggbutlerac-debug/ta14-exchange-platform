-- TA-14 AI Governance Registry
-- Minimal record-only readiness / optional enrichment migration
--
-- Preserves the canonical 14-step intake experience while ensuring that
-- optional enrichment cannot become a hidden database registration gate.
-- Registration remains distinct from examination, assurance, certification,
-- endorsement, legal validation, or proof of technical performance.

begin;

-- ---------------------------------------------------------------------------
-- SCHEMA COMPATIBILITY
-- Older Registry deployments made enrichment fields NOT NULL. Those columns
-- remain available and fully usable, but blank enrichment is now legitimate.
-- ---------------------------------------------------------------------------

alter table public.ai_governance_registry_submissions
  alter column governance_category drop not null,
  alter column claimed_establishment_date drop not null,
  alter column claimant_type drop not null,
  alter column authority_basis drop not null,
  alter column explicit_non_claims drop not null,
  alter column ownership_declaration drop not null,
  alter column requested_review_pathway drop not null;

alter table public.ai_governance_registry_submissions
  alter column requested_review_pathway set default 'Record-only registration';

-- current_steward is a true record-only continuity requirement under the
-- 14-step policy. Existing historical rows are not rewritten.

-- ---------------------------------------------------------------------------
-- AUTHORITATIVE MINIMAL READINESS
-- Returns only true record-only blocking failures. Evidence count, public URL,
-- enrichment fields, patents, publications, repositories, jurisdiction,
-- detailed authority basis, non-claims, ownership narrative, and optional
-- review selection are deliberately absent from this function.
-- ---------------------------------------------------------------------------

create or replace function public.ta14_registry_minimal_readiness_v1(
  requested_submission_id uuid
)
returns text[]
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  s public.ai_governance_registry_submissions%rowtype;
  failures text[] := '{}'::text[];
begin
  select * into s
  from public.ai_governance_registry_submissions
  where id = requested_submission_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'Registry submission not found.';
  end if;

  if auth.role() <> 'service_role'
     and (auth.uid() is null or auth.uid() <> s.owner_user_id)
     and not public.ta14_registry_is_reviewer()
  then
    raise exception using errcode = '42501', message = 'Not authorized to evaluate this Registry submission.';
  end if;

  if nullif(btrim(coalesce(s.governance_name, '')), '') is null then failures := array_append(failures, 'governance_name'); end if;
  if nullif(btrim(coalesce(s.current_version, '')), '') is null then failures := array_append(failures, 'current_version'); end if;
  if nullif(btrim(coalesce(s.claimant_name, '')), '') is null then failures := array_append(failures, 'claimant_name'); end if;
  if nullif(btrim(coalesce(s.submitter_authority_role, '')), '') is null then failures := array_append(failures, 'submitter_authority_role'); end if;
  if nullif(btrim(coalesce(s.current_steward, '')), '') is null then failures := array_append(failures, 'current_steward'); end if;
  if nullif(btrim(coalesce(s.contact_email, '')), '') is null then failures := array_append(failures, 'contact_email'); end if;
  if nullif(btrim(coalesce(s.plain_language_description, '')), '') is null then failures := array_append(failures, 'plain_language_description'); end if;
  if nullif(btrim(coalesce(s.formal_claims, '')), '') is null then failures := array_append(failures, 'formal_claims'); end if;
  if not coalesce(s.authority_declaration_accepted, false) then failures := array_append(failures, 'authority_declaration_accepted'); end if;
  if not coalesce(s.accuracy_declaration_accepted, false) then failures := array_append(failures, 'accuracy_declaration_accepted'); end if;
  if not coalesce(s.registry_boundary_accepted, false) then failures := array_append(failures, 'registry_boundary_accepted'); end if;

  return failures;
end;
$$;

comment on function public.ta14_registry_minimal_readiness_v1(uuid) is
  'Evaluates only the true blocking fields for ordinary TA-14 Governance Entity Registration. Optional enrichment and evidence are not record-only registration gates.';

revoke all on function public.ta14_registry_minimal_readiness_v1(uuid) from public;
revoke all on function public.ta14_registry_minimal_readiness_v1(uuid) from anon;
grant execute on function public.ta14_registry_minimal_readiness_v1(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- AUTOMATIC RECORD-ONLY FINALIZATION
-- This function intentionally does not award reviewer acceptance, technical
-- validation, assurance, certification, or endorsement. It registers an
-- attributable declared governance record after minimal readiness succeeds.
-- ---------------------------------------------------------------------------

create or replace function public.ta14_registry_auto_finalize_submission_v1(
  requested_submission_id uuid
)
returns table (
  submission_id uuid,
  registry_identifier text,
  registered_at timestamptz,
  public_record_id uuid,
  is_publicly_published boolean
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  s public.ai_governance_registry_submissions%rowtype;
  failures text[];
  assigned_identifier text;
  finalization_time timestamptz := timezone('utc', now());
  public_visibility text;
  publish_record boolean;
  public_projection_id uuid;
  evidence_total integer := 0;
  dispute_total integer := 0;
  canonical_digest text;
begin
  if auth.uid() is null then
    raise exception using errcode = '42501', message = 'Authentication is required to register a governance entity.';
  end if;

  select * into s
  from public.ai_governance_registry_submissions
  where id = requested_submission_id
    and owner_user_id = auth.uid()
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'Registry submission not found for the authenticated owner.';
  end if;

  if s.status = 'registered' and s.registry_identifier is not null then
    select r.id, r.is_published into public_projection_id, publish_record
    from public.ta14_registry_public_records r
    where r.source_record_id = s.id
    limit 1;

    return query select s.id, s.registry_identifier, s.accepted_at, public_projection_id, coalesce(publish_record, false);
    return;
  end if;

  if s.status <> 'submitted' then
    raise exception using errcode = '23514', message = format('Registry submission must be submitted before automatic registration. Current status: %s.', s.status);
  end if;

  failures := public.ta14_registry_minimal_readiness_v1(s.id);
  if coalesce(array_length(failures, 1), 0) > 0 then
    raise exception using
      errcode = '23514',
      message = 'Governance Entity Registration is missing required record-only information.',
      detail = array_to_string(failures, '|');
  end if;

  -- Blank review choice resolves to record-only. Any deeper pathway must be
  -- handled by its own governed review/examination process.
  if coalesce(nullif(btrim(s.requested_review_pathway), ''), 'Record-only registration')
     not in ('Record-only registration', 'Administrative completeness review')
  then
    raise exception using errcode = '23514', message = 'This submission selected a review pathway that is not eligible for automatic record-only finalization.';
  end if;

  assigned_identifier := 'TA-14-AIGR-' || lpad(nextval('public.ta14_registry_identifier_sequence')::text, 6, '0');

  select count(*)::integer into evidence_total
  from public.ai_governance_registry_evidence
  where submission_id = s.id and evidence_state = 'current';

  select count(*)::integer into dispute_total
  from public.ai_governance_registry_disputes
  where submission_id = s.id and status not in ('dismissed', 'withdrawn');

  public_visibility := case s.record_visibility when 'public' then 'public' when 'selective' then 'controlled' else 'private' end;
  publish_record := public_visibility = 'public';

  canonical_digest := encode(
    digest(
      concat_ws(E'\n',
        s.id::text,
        assigned_identifier,
        coalesce(s.governance_name, ''),
        coalesce(s.current_version, ''),
        coalesce(s.claimant_name, ''),
        coalesce(s.submitter_authority_role, ''),
        coalesce(s.current_steward, ''),
        coalesce(s.contact_email, ''),
        coalesce(s.plain_language_description, ''),
        coalesce(s.formal_claims, ''),
        coalesce(s.explicit_non_claims, ''),
        coalesce(s.known_limitations, ''),
        coalesce(s.governance_category, ''),
        coalesce(s.claimant_type, ''),
        coalesce(s.authority_basis, ''),
        coalesce(s.ownership_declaration, ''),
        finalization_time::text
      ),
      'sha256'
    ),
    'hex'
  );

  update public.ai_governance_registry_submissions
  set status = 'registered',
      registry_identifier = assigned_identifier,
      accepted_at = finalization_time,
      requested_review_pathway = coalesce(nullif(btrim(requested_review_pathway), ''), 'Record-only registration')
  where id = s.id;

  insert into public.ta14_registry_public_records (
    registry_identifier, source_record_id, governance_name, short_name, version,
    category, steward, claimed_establishment_date, registered_at, status,
    visibility, is_published, published_at, summary, domains, evidence_count,
    dispute_count, record_digest_sha256, finalized_by, finalized_at
  ) values (
    assigned_identifier, s.id, s.governance_name, s.short_name, s.current_version,
    s.governance_category, s.current_steward, s.claimed_establishment_date,
    finalization_time, 'Registered', public_visibility, publish_record,
    case when publish_record then finalization_time else null end,
    s.plain_language_description,
    array_remove(array[nullif(btrim(coalesce(s.geographic_scope, '')), ''), nullif(btrim(coalesce(s.regulatory_scope, '')), '')], null),
    evidence_total, dispute_total, canonical_digest, auth.uid(), finalization_time
  ) returning id into public_projection_id;

  return query select s.id, assigned_identifier, finalization_time, public_projection_id, publish_record;
end;
$$;

comment on function public.ta14_registry_auto_finalize_submission_v1(uuid) is
  'Automatically finalizes a minimally complete record-only TA-14 Governance Entity Registration owned by the authenticated caller. Registration is not assurance, certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or proof of performance.';

revoke all on function public.ta14_registry_auto_finalize_submission_v1(uuid) from public;
revoke all on function public.ta14_registry_auto_finalize_submission_v1(uuid) from anon;
grant execute on function public.ta14_registry_auto_finalize_submission_v1(uuid) to authenticated;

commit;
