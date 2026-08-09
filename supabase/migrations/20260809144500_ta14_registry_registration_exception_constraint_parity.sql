begin;

-- ============================================================================
-- TA-14 REGISTRY REGISTRATION EXCEPTION CONSTRAINT PARITY
--
-- Follow-on migration.
--
-- Do not rely on editing 20260809140000 after it may already have been applied.
-- This migration upgrades existing deployments to the same invariants expected
-- by the current repository definition.
-- ============================================================================

update public.ta14_registry_registration_exceptions
set
  exception_status = coalesce(
    exception_status,
    'open'
  ),
  exception_type = coalesce(
    nullif(btrim(exception_type), ''),
    'automatic_registration_readiness'
  ),
  exception_summary = coalesce(
    nullif(btrim(exception_summary), ''),
    'Automatic Governance Entity Registration requires attention.'
  ),
  exception_details = coalesce(
    exception_details,
    '{}'::text[]
  ),
  readiness_failures = coalesce(
    readiness_failures,
    '{}'::text[]
  ),
  opened_at = coalesce(
    opened_at,
    created_at,
    timezone('utc', now())
  ),
  created_at = coalesce(
    created_at,
    opened_at,
    timezone('utc', now())
  ),
  updated_at = coalesce(
    updated_at,
    opened_at,
    created_at,
    timezone('utc', now())
  );


update public.ta14_registry_registration_exceptions exception_record
set
  owner_user_id = submission.owner_user_id
from public.ai_governance_registry_submissions submission
where
  submission.id = exception_record.submission_id
  and exception_record.owner_user_id is null;


-- Resolve duplicate simultaneous active exceptions before installing the
-- authoritative one-active-exception-per-submission invariant.

with ranked_active_exceptions as (
  select
    id,
    row_number() over (
      partition by submission_id
      order by
        opened_at desc nulls last,
        created_at desc nulls last,
        id desc
    ) as active_rank
  from public.ta14_registry_registration_exceptions
  where
    exception_status in (
      'open',
      'correction_required',
      'under_review'
    )
)
update public.ta14_registry_registration_exceptions exception_record
set
  exception_status = 'resolved',
  resolution_summary = coalesce(
    nullif(btrim(exception_record.resolution_summary), ''),
    'Resolved during TA-14 Registry exception constraint-parity migration because a newer active registration exception exists for the same submission.'
  ),
  resolved_at = coalesce(
    exception_record.resolved_at,
    timezone('utc', now())
  ),
  updated_at = timezone('utc', now())
from ranked_active_exceptions ranked
where
  ranked.id = exception_record.id
  and ranked.active_rank > 1;


alter table public.ta14_registry_registration_exceptions
  alter column submission_id set not null;

alter table public.ta14_registry_registration_exceptions
  alter column owner_user_id set not null;

alter table public.ta14_registry_registration_exceptions
  alter column exception_status set not null;

alter table public.ta14_registry_registration_exceptions
  alter column exception_type set not null;

alter table public.ta14_registry_registration_exceptions
  alter column exception_summary set not null;

alter table public.ta14_registry_registration_exceptions
  alter column exception_details set not null;

alter table public.ta14_registry_registration_exceptions
  alter column readiness_failures set not null;

alter table public.ta14_registry_registration_exceptions
  alter column opened_at set not null;

alter table public.ta14_registry_registration_exceptions
  alter column created_at set not null;

alter table public.ta14_registry_registration_exceptions
  alter column updated_at set not null;


alter table public.ta14_registry_registration_exceptions
  drop constraint if exists
    ta14_registry_registration_exceptions_status_check;

alter table public.ta14_registry_registration_exceptions
  add constraint
    ta14_registry_registration_exceptions_status_check
  check (
    exception_status in (
      'open',
      'correction_required',
      'under_review',
      'resolved',
      'dismissed'
    )
  );


alter table public.ta14_registry_registration_exceptions
  drop constraint if exists
    ta14_registry_registration_exceptions_summary_check;

alter table public.ta14_registry_registration_exceptions
  add constraint
    ta14_registry_registration_exceptions_summary_check
  check (
    length(btrim(exception_summary)) > 0
  );


alter table public.ta14_registry_registration_exceptions
  drop constraint if exists
    ta14_registry_registration_exceptions_resolution_check;

alter table public.ta14_registry_registration_exceptions
  add constraint
    ta14_registry_registration_exceptions_resolution_check
  check (
    (
      exception_status in ('resolved', 'dismissed')
      and resolved_at is not null
    )
    or
    exception_status not in ('resolved', 'dismissed')
  );


create unique index if not exists
  ta14_registry_registration_exceptions_one_active_per_submission_uidx
on public.ta14_registry_registration_exceptions (
  submission_id
)
where
  exception_status in (
    'open',
    'correction_required',
    'under_review'
  );


-- ============================================================================
-- SECURITY-DEFINER RECORDER REPLACEMENT
--
-- Reinstall the recorder with explicit authenticated-owner enforcement so an
-- already-deployed earlier version cannot remain permissive.
-- ============================================================================

create or replace function
  public.ta14_registry_record_registration_exception_v1(
    requested_submission_id uuid,
    requested_exception_code text,
    requested_summary text,
    requested_details text[],
    requested_readiness_failures text[]
  )
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_record
    public.ai_governance_registry_submissions%rowtype;
  existing_exception_id uuid;
  new_exception_id uuid;
begin
  select *
  into submission_record
  from public.ai_governance_registry_submissions
  where id = requested_submission_id;

  if not found then
    raise exception
      'Registry submission % was not found.',
      requested_submission_id
      using errcode = 'P0002';
  end if;

  if submission_record.owner_user_id is null then
    raise exception
      'Registry submission % does not have an owner account.',
      requested_submission_id
      using errcode = '23514';
  end if;

  if auth.role() <> 'service_role'
     and (
       auth.uid() is null
       or auth.uid() <> submission_record.owner_user_id
     )
  then
    raise exception
      'The authenticated account is not authorized to record an exception for Registry submission %.',
      requested_submission_id
      using errcode = '42501';
  end if;

  select id
  into existing_exception_id
  from public.ta14_registry_registration_exceptions
  where
    submission_id = requested_submission_id
    and exception_status in (
      'open',
      'correction_required',
      'under_review'
    )
  order by opened_at desc
  limit 1;

  if existing_exception_id is not null then
    update public.ta14_registry_registration_exceptions
    set
      owner_user_id = submission_record.owner_user_id,
      exception_type = 'automatic_registration_readiness',
      exception_code = requested_exception_code,
      exception_summary = coalesce(
        nullif(btrim(requested_summary), ''),
        'Automatic Governance Entity Registration requires attention.'
      ),
      exception_details = coalesce(
        requested_details,
        '{}'::text[]
      ),
      readiness_failures = coalesce(
        requested_readiness_failures,
        '{}'::text[]
      ),
      updated_at = timezone('utc', now())
    where id = existing_exception_id;

    return existing_exception_id;
  end if;

  insert into public.ta14_registry_registration_exceptions (
    submission_id,
    owner_user_id,
    exception_status,
    exception_type,
    exception_code,
    exception_summary,
    exception_details,
    readiness_failures,
    opened_at,
    created_at,
    updated_at
  )
  values (
    requested_submission_id,
    submission_record.owner_user_id,
    'open',
    'automatic_registration_readiness',
    requested_exception_code,
    coalesce(
      nullif(btrim(requested_summary), ''),
      'Automatic Governance Entity Registration requires attention.'
    ),
    coalesce(
      requested_details,
      '{}'::text[]
    ),
    coalesce(
      requested_readiness_failures,
      '{}'::text[]
    ),
    timezone('utc', now()),
    timezone('utc', now()),
    timezone('utc', now())
  )
  returning id into new_exception_id;

  return new_exception_id;
end;
$$;


revoke all
on function
  public.ta14_registry_record_registration_exception_v1(
    uuid,
    text,
    text,
    text[],
    text[]
  )
from public;

revoke all
on function
  public.ta14_registry_record_registration_exception_v1(
    uuid,
    text,
    text,
    text[],
    text[]
  )
from anon;

grant execute
on function
  public.ta14_registry_record_registration_exception_v1(
    uuid,
    text,
    text,
    text[],
    text[]
  )
to authenticated;


commit;
