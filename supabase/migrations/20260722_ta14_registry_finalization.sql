-- TA-14 AI Governance Registry
-- Controlled Registry Finalization v1
-- File: 20260722_ta14_registry_finalization.sql
--
-- Finalizes only reviewer-accepted submissions.
-- Assigns the permanent TA-14-AIGR identifier, registers the canonical
-- submission, creates the publication-safe projection, and appends an
-- immutable lifecycle event in one transaction.
--
-- Registration is not certification.

begin;

create sequence if not exists public.ta14_registry_identifier_sequence
  as bigint
  start with 1
  increment by 1
  minvalue 1
  no maxvalue
  cache 1;

comment on sequence public.ta14_registry_identifier_sequence is
  'Monotonic source for permanent TA-14 AI Governance Registry identifiers. Sequence gaps may occur after rolled-back transactions and do not invalidate issued identifiers.';

revoke all on sequence public.ta14_registry_identifier_sequence from public;
revoke all on sequence public.ta14_registry_identifier_sequence from anon;
revoke all on sequence public.ta14_registry_identifier_sequence from authenticated;

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
    domains,
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
    array_remove(
      array[
        nullif(btrim(submission_record.geographic_scope), ''),
        nullif(btrim(submission_record.regulatory_scope), '')
      ],
      null
    ),
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
  'Finalizes one reviewer-accepted TA-14 AI Governance Registry submission, assigns its permanent Registry identifier, creates its publication projection, and appends an immutable finalization event. Registration is not certification.';

revoke all on function public.ta14_registry_finalize_submission_v1(uuid) from public;
revoke all on function public.ta14_registry_finalize_submission_v1(uuid) from anon;
grant execute on function public.ta14_registry_finalize_submission_v1(uuid)
  to authenticated;

commit;
