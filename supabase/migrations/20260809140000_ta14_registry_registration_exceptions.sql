begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- TA-14 REGISTRY REGISTRATION EXCEPTIONS
--
-- Repository parity migration.
--
-- The production application already consumes:
--
--   public.ta14_registry_registration_exceptions
--   public.ta14_registry_record_registration_exception_v1(...)
--
-- This migration makes that subsystem reproducible from source control.
--
-- A registration exception records that automatic Governance Entity
-- Registration could not complete under the governed readiness rules.
--
-- An exception is not:
--   * a rejection of the governance architecture;
--   * certification;
--   * endorsement;
--   * technical validation;
--   * legal or regulatory approval;
--   * ownership adjudication; or
--   * proof of performance.
-- ============================================================================


-- ============================================================================
-- TABLE
-- ============================================================================

create table if not exists
  public.ta14_registry_registration_exceptions (
    id uuid primary key default gen_random_uuid(),

    submission_id uuid not null
      references public.ai_governance_registry_submissions(id)
      on delete cascade,

    owner_user_id uuid not null
      references auth.users(id)
      on delete cascade,

    exception_status text not null default 'open',

    exception_type text not null
      default 'automatic_registration_readiness',

    exception_code text,

    exception_summary text not null,

    exception_details text[] not null
      default '{}'::text[],

    readiness_failures text[] not null
      default '{}'::text[],

    resolution_summary text,

    opened_at timestamptz not null
      default timezone('utc', now()),

    resolved_at timestamptz,

    created_at timestamptz not null
      default timezone('utc', now()),

    updated_at timestamptz not null
      default timezone('utc', now()),

    constraint
      ta14_registry_registration_exceptions_status_check
    check (
      exception_status in (
        'open',
        'correction_required',
        'under_review',
        'resolved',
        'dismissed'
      )
    ),

    constraint
      ta14_registry_registration_exceptions_summary_check
    check (
      length(btrim(exception_summary)) > 0
    ),

    constraint
      ta14_registry_registration_exceptions_resolution_check
    check (
      (
        exception_status in ('resolved', 'dismissed')
        and resolved_at is not null
      )
      or
      (
        exception_status not in ('resolved', 'dismissed')
      )
    )
  );


comment on table
  public.ta14_registry_registration_exceptions
is
  'Governed readiness exceptions produced when automatic TA-14 Governance Entity Registration cannot complete. Exception state is administrative registration readiness only and is not certification, endorsement, technical validation, legal approval, regulatory approval, ownership adjudication, or a merits finding.';


comment on column
  public.ta14_registry_registration_exceptions.submission_id
is
  'Authoritative governance Registry submission to which the exception belongs.';


comment on column
  public.ta14_registry_registration_exceptions.owner_user_id
is
  'Authenticated Registry account that owns the referenced governance submission.';


comment on column
  public.ta14_registry_registration_exceptions.exception_status
is
  'Administrative exception lifecycle state. Active states are open, correction_required, and under_review.';


comment on column
  public.ta14_registry_registration_exceptions.readiness_failures
is
  'Structured readiness conditions that prevented automatic Governance Entity Registration.';


-- ============================================================================
-- FORWARD-COMPATIBLE COLUMN PARITY
--
-- These ALTER statements make this migration safe when the table already
-- exists in a partially deployed environment.
-- ============================================================================

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  owner_user_id uuid
  references auth.users(id)
  on delete cascade;

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  exception_status text
  default 'open';

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  exception_type text
  default 'automatic_registration_readiness';

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  exception_code text;

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  exception_summary text;

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  exception_details text[]
  default '{}'::text[];

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  readiness_failures text[]
  default '{}'::text[];

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  resolution_summary text;

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  opened_at timestamptz
  default timezone('utc', now());

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  resolved_at timestamptz;

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  created_at timestamptz
  default timezone('utc', now());

alter table
  public.ta14_registry_registration_exceptions
add column if not exists
  updated_at timestamptz
  default timezone('utc', now());


-- ============================================================================
-- EXISTING-ROW REPAIR
--
-- Only fills administratively necessary values where an older deployment
-- left them null.
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


-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists
  ta14_registry_registration_exceptions_submission_idx
on public.ta14_registry_registration_exceptions (
  submission_id,
  opened_at desc
);


create index if not exists
  ta14_registry_registration_exceptions_owner_idx
on public.ta14_registry_registration_exceptions (
  owner_user_id,
  opened_at desc
);


create index if not exists
  ta14_registry_registration_exceptions_status_idx
on public.ta14_registry_registration_exceptions (
  exception_status,
  opened_at desc
);


create index if not exists
  ta14_registry_registration_exceptions_active_submission_idx
on public.ta14_registry_registration_exceptions (
  submission_id,
  exception_status,
  opened_at desc
)
where
  exception_status in (
    'open',
    'correction_required',
    'under_review'
  );


-- ============================================================================
-- SINGLE ACTIVE EXCEPTION INVARIANT
--
-- The recorder already reuses an equivalent active exception. This partial
-- unique index makes the database itself enforce the stronger invariant that
-- a submission cannot accumulate multiple simultaneous active registration
-- exceptions under concurrent or repeated finalization attempts.
--
-- Existing duplicate active rows are preserved historically by resolving all
-- but the newest row before the invariant is installed.
-- ============================================================================

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
    'Resolved during TA-14 Registry exception-invariant migration because a newer active registration exception exists for the same submission.'
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
-- UPDATED_AT TRIGGER
-- ============================================================================

create or replace function
  public.ta14_registry_registration_exception_touch_updated_at_v1()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;


drop trigger if exists
  ta14_registry_registration_exception_touch_updated_at
on public.ta14_registry_registration_exceptions;


create trigger
  ta14_registry_registration_exception_touch_updated_at
before update
on public.ta14_registry_registration_exceptions
for each row
execute function
  public.ta14_registry_registration_exception_touch_updated_at_v1();


-- ============================================================================
-- RLS
--
-- Participants may read only exception records belonging to their own
-- governance submissions. They cannot directly insert, update, or delete
-- exception records from the browser.
--
-- The governed server/database finalization path records exceptions.
-- ============================================================================

alter table
  public.ta14_registry_registration_exceptions
enable row level security;


drop policy if exists
  ta14_registry_registration_exceptions_owner_select
on public.ta14_registry_registration_exceptions;


create policy
  ta14_registry_registration_exceptions_owner_select
on public.ta14_registry_registration_exceptions
for select
to authenticated
using (
  owner_user_id = auth.uid()
);


revoke all
on table public.ta14_registry_registration_exceptions
from public;

revoke all
on table public.ta14_registry_registration_exceptions
from anon;

revoke insert, update, delete
on table public.ta14_registry_registration_exceptions
from authenticated;

grant select
on table public.ta14_registry_registration_exceptions
to authenticated;


-- ============================================================================
-- GOVERNED EXCEPTION RECORDER
--
-- Called by:
--
--   /api/ai-governance/registry/submit
--
-- when the governed auto-finalizer returns PostgreSQL 23514.
--
-- The caller supplies the submission identifier and readiness evidence.
-- Ownership is re-resolved from the authoritative submission record inside
-- the database.
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

  /*
   * SECURITY BOUNDARY
   *
   * This is a SECURITY DEFINER function. An authenticated participant may
   * record an exception only for a submission they actually own. The
   * service_role remains permitted for governed server-side administration.
   *
   * Re-resolving owner_user_id from the submission is not sufficient by
   * itself; the caller must also be bound to that owner.
   */
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

  /*
   * Preserve one active readiness exception per submission.
   * Repeated finalization attempts update the existing administrative record
   * rather than multiplying simultaneous open exceptions. The partial unique
   * index below/above makes the same invariant authoritative at database level.
   */
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
      owner_user_id =
        submission_record.owner_user_id,

      exception_type =
        'automatic_registration_readiness',

      exception_code =
        requested_exception_code,

      exception_summary =
        coalesce(
          nullif(btrim(requested_summary), ''),
          'Automatic Governance Entity Registration requires attention.'
        ),

      exception_details =
        coalesce(
          requested_details,
          '{}'::text[]
        ),

      readiness_failures =
        coalesce(
          requested_readiness_failures,
          '{}'::text[]
        ),

      updated_at =
        timezone('utc', now())

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
  returning id
  into new_exception_id;

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

/*
 * Authenticated application calls execute through the participant's Supabase
 * session. The function re-resolves ownership from the authoritative
 * submission record AND requires auth.uid() to match that owner.
 * Service-role/server calls remain supported.
 */
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


-- ============================================================================
-- ACTIVE EXCEPTION LOOKUP
-- ============================================================================

create or replace function
  public.ta14_registry_active_registration_exception_v1(
    requested_submission_id uuid
  )
returns table (
  id uuid,
  submission_id uuid,
  exception_status text,
  exception_type text,
  exception_code text,
  exception_summary text,
  exception_details text[],
  readiness_failures text[],
  resolution_summary text,
  opened_at timestamptz,
  resolved_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    exception_record.id,
    exception_record.submission_id,
    exception_record.exception_status,
    exception_record.exception_type,
    exception_record.exception_code,
    exception_record.exception_summary,
    exception_record.exception_details,
    exception_record.readiness_failures,
    exception_record.resolution_summary,
    exception_record.opened_at,
    exception_record.resolved_at,
    exception_record.updated_at

  from public.ta14_registry_registration_exceptions
    as exception_record

  join public.ai_governance_registry_submissions
    as submission
    on submission.id =
      exception_record.submission_id

  where
    exception_record.submission_id =
      requested_submission_id

    and exception_record.exception_status in (
      'open',
      'correction_required',
      'under_review'
    )

    and (
      auth.uid() = submission.owner_user_id
      or auth.role() = 'service_role'
    )

  order by
    exception_record.opened_at desc

  limit 1;
$$;


revoke all
on function
  public.ta14_registry_active_registration_exception_v1(uuid)
from public;

revoke all
on function
  public.ta14_registry_active_registration_exception_v1(uuid)
from anon;

grant execute
on function
  public.ta14_registry_active_registration_exception_v1(uuid)
to authenticated;


commit;
