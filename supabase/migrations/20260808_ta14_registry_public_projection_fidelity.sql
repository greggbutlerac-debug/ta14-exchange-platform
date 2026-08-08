-- TA-14 AI Governance Registry
-- Public Projection Fidelity Repair v1
-- File: 20260808_ta14_registry_public_projection_fidelity.sql
--
-- Purpose:
--   1. Preserve registrant-declared claims, non-claims, limitations, and
--      regulatory scope in the canonical public Registry projection.
--   2. Backfill already-finalized public records from their authoritative
--      governed submissions without rewriting those submissions.
--   3. Expose the preserved qualifier fields through the permanent-record RPC.
--   4. Ensure future Registry finalizations copy those fields into the public
--      projection transactionally.
--
-- Governing boundary:
--   Registration is not certification.
--   This migration repairs projection fidelity; it does not alter a
--   registrant's governed declaration or prior institutional finding.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. PUBLIC PROJECTION SCHEMA
-- ---------------------------------------------------------------------------

alter table public.ta14_registry_public_records
  add column if not exists formal_claims text,
  add column if not exists explicit_non_claims text,
  add column if not exists known_limitations text,
  add column if not exists regulatory_scope text,
  add column if not exists public_projection_digest_sha256 text,
  add column if not exists public_projection_digest_version text;

comment on column public.ta14_registry_public_records.formal_claims is
  'Registrant-declared formal claims copied from the governed Registry submission for faithful public projection.';

comment on column public.ta14_registry_public_records.explicit_non_claims is
  'Registrant-declared explicit non-claims copied from the governed Registry submission for faithful public projection.';

comment on column public.ta14_registry_public_records.known_limitations is
  'Registrant-declared known limitations copied from the governed Registry submission for faithful public projection.';

comment on column public.ta14_registry_public_records.regulatory_scope is
  'Registrant-declared regulatory or framework scope copied from the governed Registry submission for faithful public projection.';

comment on column public.ta14_registry_public_records.public_projection_digest_sha256 is
  'Optional SHA-256 digest of the publication-safe Registry projection. This digest preserves projection integrity; it does not establish truth, certification, or legal sufficiency.';

comment on column public.ta14_registry_public_records.public_projection_digest_version is
  'Version label for the public projection digest construction used for this record.';

-- Keep the digest field bounded when populated. Existing live values are
-- preserved and this migration does not invent or overwrite their digest.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'ta14_registry_public_projection_digest_format'
      and conrelid = 'public.ta14_registry_public_records'::regclass
  ) then
    alter table public.ta14_registry_public_records
      add constraint ta14_registry_public_projection_digest_format
      check (
        public_projection_digest_sha256 is null
        or public_projection_digest_sha256 ~ '^[a-fA-F0-9]{64}$'
      );
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. BACKFILL EXISTING FINALIZED RECORDS FROM THE AUTHORITATIVE SUBMISSION
-- ---------------------------------------------------------------------------
-- The source submission remains authoritative. This updates only the
-- publication-safe projection.

update public.ta14_registry_public_records as public_record
set
  formal_claims = submission.formal_claims,
  explicit_non_claims = submission.explicit_non_claims,
  known_limitations = submission.known_limitations,
  regulatory_scope = submission.regulatory_scope
from public.ai_governance_registry_submissions as submission
where public_record.source_record_id = submission.id
  and (
    public_record.formal_claims is distinct from submission.formal_claims
    or public_record.explicit_non_claims is distinct from submission.explicit_non_claims
    or public_record.known_limitations is distinct from submission.known_limitations
    or public_record.regulatory_scope is distinct from submission.regulatory_scope
  );

-- ---------------------------------------------------------------------------
-- 3. PUBLIC PERMANENT-RECORD RPC
-- ---------------------------------------------------------------------------
-- PostgreSQL cannot change an existing function's RETURNS TABLE signature via
-- CREATE OR REPLACE, so drop and recreate this public read RPC deliberately.

drop function if exists public.ta14_registry_public_record_v1(text);

create function public.ta14_registry_public_record_v1(
  requested_registry_identifier text
)
returns table (
  id uuid,
  registry_identifier text,
  governance_name text,
  short_name text,
  version text,
  category text,
  steward text,
  claimed_establishment_date date,
  registered_at timestamptz,
  status text,
  summary text,
  formal_claims text,
  explicit_non_claims text,
  known_limitations text,
  domains text[],
  regulatory_scope text,
  evidence_count integer,
  dispute_count integer,
  supersedes_registry_identifier text,
  record_digest_sha256 text,
  public_projection_digest_sha256 text,
  public_projection_digest_version text,
  published_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    record.id,
    record.registry_identifier,
    record.governance_name,
    record.short_name,
    record.version,
    record.category,
    record.steward,
    record.claimed_establishment_date,
    record.registered_at,
    record.status,
    record.summary,
    record.formal_claims,
    record.explicit_non_claims,
    record.known_limitations,
    record.domains,
    record.regulatory_scope,
    record.evidence_count,
    record.dispute_count,
    record.supersedes_registry_identifier,
    record.record_digest_sha256,
    record.public_projection_digest_sha256,
    record.public_projection_digest_version,
    record.published_at
  from public.ta14_registry_public_records as record
  where record.registry_identifier = requested_registry_identifier
    and record.is_published = true
    and record.visibility = 'public'
    and record.status in (
      'Registered',
      'Disputed',
      'Superseded',
      'Withdrawn',
      'Archived'
    )
  limit 1;
$$;

comment on function public.ta14_registry_public_record_v1(text) is
  'Returns one publication-safe finalized TA-14 AI Governance Registry record, including registrant-declared claims, non-claims, limitations, regulatory scope, and available integrity digests. Registration is not certification.';

revoke all on function public.ta14_registry_public_record_v1(text) from public;
grant execute on function public.ta14_registry_public_record_v1(text)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. FUTURE FINALIZATION
-- ---------------------------------------------------------------------------
-- Replace the controlled finalization function so future accepted submissions
-- carry their registrant-declared qualifiers into the public projection at the
-- same transaction boundary as the permanent Registry identifier.

create or replace function public.ta14_registry_finalize_submission_v1(
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
  submission_record public.ai_governance_registry_submissions%rowtype;
  assigned_identifier text;
  finalization_time timestamptz := timezone('utc', now());
  prior_event_hash text;
  final_event_hash text;
  public_projection_id uuid;
  public_visibility text;
  publish_record boolean;
  evidence_total integer;
  dispute_total integer;
  canonical_digest text;
  event_payload jsonb;
begin
  if auth.uid() is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication is required to finalize a Registry submission.';
  end if;

  if not public.ta14_registry_is_reviewer() then
    raise exception using
      errcode = '42501',
      message = 'Only an authorized TA-14 Registry reviewer may finalize a submission.';
  end if;

  select *
  into submission_record
  from public.ai_governance_registry_submissions
  where id = requested_submission_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Registry submission not found.';
  end if;

  -- Idempotent return for a record already finalized through this institution.
  if submission_record.status = 'registered'
     and submission_record.registry_identifier is not null then
    select record.id, record.is_published
    into public_projection_id, publish_record
    from public.ta14_registry_public_records as record
    where record.source_record_id = submission_record.id
    limit 1;

    return query
    select
      submission_record.id,
      submission_record.registry_identifier,
      submission_record.accepted_at,
      public_projection_id,
      coalesce(publish_record, false);

    return;
  end if;

  if submission_record.status <> 'accepted' then
    raise exception using
      errcode = '23514',
      message = format(
        'Registry submission must be accepted before finalization. Current status: %s.',
        submission_record.status
      );
  end if;

  if submission_record.review_decision is distinct from 'accept_for_registration' then
    raise exception using
      errcode = '23514',
      message = 'The latest bounded reviewer decision must be accept_for_registration.';
  end if;

  if submission_record.reviewed_at is null
     or submission_record.reviewed_by_user_id is null
     or nullif(btrim(coalesce(submission_record.review_rationale, '')), '') is null then
    raise exception using
      errcode = '23514',
      message = 'A dated, attributable reviewer acceptance with rationale is required before finalization.';
  end if;

  if not (
    submission_record.authority_declaration_accepted
    and submission_record.accuracy_declaration_accepted
    and submission_record.registry_boundary_accepted
  ) then
    raise exception using
      errcode = '23514',
      message = 'All Registry authority, accuracy, and boundary declarations must be accepted before finalization.';
  end if;

  assigned_identifier :=
    'TA-14-AIGR-' ||
    lpad(
      nextval('public.ta14_registry_identifier_sequence')::text,
      6,
      '0'
    );

  select count(*)::integer
  into evidence_total
  from public.ai_governance_registry_evidence
  where submission_id = submission_record.id
    and evidence_state = 'current';

  select count(*)::integer
  into dispute_total
  from public.ai_governance_registry_disputes
  where submission_id = submission_record.id
    and status not in ('dismissed', 'withdrawn');

  public_visibility :=
    case submission_record.record_visibility
      when 'public' then 'public'
      when 'selective' then 'controlled'
      else 'private'
    end;

  publish_record := public_visibility = 'public';

  canonical_digest := encode(
    digest(
      concat_ws(
        E'\n',
        submission_record.id::text,
        assigned_identifier,
        submission_record.governance_name,
        coalesce(submission_record.short_name, ''),
        submission_record.governance_category,
        submission_record.current_version,
        submission_record.claimed_establishment_date::text,
        submission_record.claimant_name,
        submission_record.claimant_type,
        submission_record.submitter_authority_role,
        submission_record.authority_basis,
        coalesce(submission_record.current_steward, ''),
        coalesce(submission_record.organization_name, ''),
        submission_record.plain_language_description,
        submission_record.formal_claims,
        submission_record.explicit_non_claims,
        coalesce(submission_record.known_limitations, ''),
        coalesce(submission_record.known_disputes, ''),
        submission_record.ownership_declaration,
        coalesce(submission_record.license_statement, ''),
        submission_record.record_visibility,
        finalization_time::text
      ),
      'sha256'
    ),
    'hex'
  );

  update public.ai_governance_registry_submissions
  set
    status = 'registered',
    registry_identifier = assigned_identifier,
    accepted_at = coalesce(accepted_at, finalization_time)
  where id = submission_record.id;

  insert into public.ta14_registry_public_records (
    registry_identifier,
    source_record_id,
    governance_name,
    short_name,
    version,
    category,
    steward,
    claimed_establishment_date,
    registered_at,
    status,
    visibility,
    is_published,
    published_at,
    summary,
    formal_claims,
    explicit_non_claims,
    known_limitations,
    domains,
    regulatory_scope,
    evidence_count,
    dispute_count,
    record_digest_sha256,
    finalized_by,
    finalized_at
  )
  values (
    assigned_identifier,
    submission_record.id,
    submission_record.governance_name,
    submission_record.short_name,
    submission_record.current_version,
    submission_record.governance_category,
    coalesce(
      nullif(btrim(submission_record.current_steward), ''),
      nullif(btrim(submission_record.organization_name), ''),
      submission_record.claimant_name
    ),
    submission_record.claimed_establishment_date,
    finalization_time,
    'Registered',
    public_visibility,
    publish_record,
    case when publish_record then finalization_time else null end,
    submission_record.plain_language_description,
    submission_record.formal_claims,
    submission_record.explicit_non_claims,
    submission_record.known_limitations,
    array_remove(
      array[
        nullif(btrim(submission_record.geographic_scope), ''),
        nullif(btrim(submission_record.regulatory_scope), '')
      ],
      null
    ),
    submission_record.regulatory_scope,
    evidence_total,
    dispute_total,
    canonical_digest,
    auth.uid(),
    finalization_time
  )
  returning id into public_projection_id;

  select event_hash
  into prior_event_hash
  from public.ai_governance_registry_events
  where submission_id = submission_record.id
  order by occurred_at desc, id desc
  limit 1;

  event_payload := jsonb_build_object(
    'registry_identifier', assigned_identifier,
    'review_decision', submission_record.review_decision,
    'reviewed_at', submission_record.reviewed_at,
    'reviewed_by_user_id', submission_record.reviewed_by_user_id,
    'record_visibility', submission_record.record_visibility,
    'publicly_published', publish_record,
    'public_record_id', public_projection_id,
    'record_digest_sha256', canonical_digest,
    'evidence_count', evidence_total,
    'active_dispute_count', dispute_total,
    'projection_fidelity', jsonb_build_object(
      'formal_claims_preserved', true,
      'explicit_non_claims_preserved', true,
      'known_limitations_preserved', submission_record.known_limitations is not null,
      'regulatory_scope_preserved', submission_record.regulatory_scope is not null
    ),
    'boundary', 'Registration is not certification.'
  );

  final_event_hash := encode(
    digest(
      concat_ws(
        '|',
        submission_record.id::text,
        assigned_identifier,
        'registry_finalized',
        finalization_time::text,
        auth.uid()::text,
        coalesce(prior_event_hash, ''),
        event_payload::text
      ),
      'sha256'
    ),
    'hex'
  );

  insert into public.ai_governance_registry_events (
    submission_id,
    actor_user_id,
    actor_label,
    actor_role,
    event_type,
    event_summary,
    event_payload,
    previous_event_hash,
    event_hash,
    occurred_at
  )
  values (
    submission_record.id,
    auth.uid(),
    coalesce(auth.jwt() ->> 'email', 'Authorized Registry reviewer'),
    'registry_reviewer',
    'registry_finalized',
    format(
      'Registry submission finalized as %s. Registration is not certification.',
      assigned_identifier
    ),
    event_payload,
    prior_event_hash,
    final_event_hash,
    finalization_time
  );

  return query
  select
    submission_record.id,
    assigned_identifier,
    finalization_time,
    public_projection_id,
    publish_record;
end;
$$;

comment on function public.ta14_registry_finalize_submission_v1(uuid) is
  'Finalizes an accepted TA-14 AI Governance Registry submission and preserves registrant-declared claims, non-claims, limitations, and regulatory scope in the publication-safe projection. Registration is not certification.';

revoke all on function public.ta14_registry_finalize_submission_v1(uuid) from public;
revoke all on function public.ta14_registry_finalize_submission_v1(uuid) from anon;
grant execute on function public.ta14_registry_finalize_submission_v1(uuid)
  to authenticated;

commit;
