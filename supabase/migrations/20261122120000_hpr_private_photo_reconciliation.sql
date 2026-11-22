-- TA-14 HVAC Performance Record (HPR) — increment 2: private photograph
-- storage, server-side hashing support, and append-only reconciliation.
--
-- STATUS: COMMITTED FOR REVIEW / EXECUTED ONLY ON AN ISOLATED LOCAL STACK.
-- Not applied to any hosted Supabase project. Stacked on
-- 20261116200000_hpr_field_evidence_foundation.sql (PR #704), which is not
-- modified. See 20261122120000_hpr_private_photo_reconciliation.IMPACT.md.
--
-- Scope:
--   * private bucket hpr-field-evidence-private (no public access, no client
--     write, no overwrite / delete / move of stored originals);
--   * append-only upload attempts and outcomes (request-replay and
--     duplicate-finalization guard; failures are recorded, never erased);
--   * declaration only through a completed upload attempt whose object exists;
--   * append-only reconciliation evidence (re-read bytes, recomputed digest)
--     that never updates the declaration;
--   * append-only orphan records (logical quarantine; nothing is deleted).
--
-- Governance boundary (unchanged from #704):
--   * evidence stays UNVERIFIED; DDD stays LOCKED; intervention stays NONE;
--   * a declaration is NOT verification; a MATCH reconciliation is NOT
--     verification either. It shows only that the bytes the service stored
--     still hash to the digest the service declared, as observed by a service
--     process in the same trust domain. It is not independent HVAC
--     verification, not admission, and not permission to act;
--   * nothing here touches the Refrigerant Governor.

-- ---------------------------------------------------------------------------
-- 1. Private bucket
-- ---------------------------------------------------------------------------

-- Plain insert (no ON CONFLICT DO UPDATE): if a bucket with this id already
-- exists with other settings, the migration fails instead of silently
-- adopting or rewriting it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hpr-field-evidence-private',
  'hpr-field-evidence-private',
  false,
  26214400,
  array['image/jpeg', 'image/png', 'image/heic', 'image/webp']
);

-- Read-only access for the owning technician, and only to an original that
-- has been declared for a submission the caller owns. Orphans and objects at
-- any other path are not readable by clients. There is deliberately NO
-- insert, update or delete policy for anon / authenticated on this bucket:
-- clients cannot write, overwrite, move or delete objects. Uploads happen
-- only through the server route (service_role).
create policy "HPR technicians read their own declared photo originals"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'hpr-field-evidence-private'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and exists (
      select 1
      from public.hpr_evidence_storage_objects d
      join public.hpr_evidence_submissions s on s.id = d.submission_id
      where d.object_path = storage.objects.name
        and s.technician_user_id = (select auth.uid())
    )
  );

-- Bucket guard trigger on storage.objects. service_role bypasses RLS, so
-- RLS alone cannot stop a server credential from overwriting (upsert),
-- moving or deleting an original. This trigger rejects, for this bucket only:
--   * UPDATE (upsert-overwrite, move/rename, metadata rewrite);
--   * DELETE;
--   * INSERT at any path that is not a derived original path
--     {uuid}/{uuid}/{uuid}/original.
-- LIMIT: like the #704 append-only triggers, a privileged PostgreSQL owner
-- can disable this trigger. Protection against that actor is procedural.
create or replace function public.hpr_guard_private_photo_object()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bucket text := case when tg_op = 'DELETE' then old.bucket_id else new.bucket_id end;
begin
  if tg_op in ('UPDATE', 'DELETE') and old.bucket_id = 'hpr-field-evidence-private' then
    raise exception using errcode = '42501',
      message = 'HPR_PHOTO_OBJECT_IMMUTABLE: hpr-field-evidence-private rejects ' || tg_op
        || '; originals are never overwritten, moved or deleted';
  end if;
  if tg_op = 'UPDATE' and new.bucket_id = 'hpr-field-evidence-private' then
    raise exception using errcode = '42501',
      message = 'HPR_PHOTO_OBJECT_IMMUTABLE: objects cannot be moved into hpr-field-evidence-private';
  end if;
  if tg_op = 'INSERT' and v_bucket = 'hpr-field-evidence-private' then
    if new.name !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/original$' then
      raise exception using errcode = '42501',
        message = 'HPR_PHOTO_PATH_REJECTED: only derived {technician}/{inspection}/{submission}/original paths are accepted';
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.hpr_guard_private_photo_object() from public, anon, authenticated, service_role;

create trigger hpr_private_photo_object_guard
  before insert or update or delete on storage.objects
  for each row execute function public.hpr_guard_private_photo_object();

-- ---------------------------------------------------------------------------
-- 2. Upload attempts (append-only) and their single outcome (append-only)
-- ---------------------------------------------------------------------------

create table public.hpr_photo_upload_attempts (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.hpr_evidence_submissions (id) on delete restrict,
  technician_user_id uuid not null references auth.users (id) on delete restrict,
  -- Client-generated per request. Unique per technician: replaying a request
  -- (same nonce) is rejected even if the earlier attempt failed.
  request_nonce uuid not null,
  object_path text not null,
  opened_at timestamptz not null default now(),
  lease_expires_at timestamptz not null,
  constraint hpr_upload_attempt_lease check (lease_expires_at > opened_at)
);

create unique index hpr_photo_upload_attempt_nonce_key
  on public.hpr_photo_upload_attempts (technician_user_id, request_nonce);
create index hpr_photo_upload_attempt_submission_idx
  on public.hpr_photo_upload_attempts (submission_id, opened_at);

create table public.hpr_photo_upload_outcomes (
  attempt_id uuid primary key references public.hpr_photo_upload_attempts (id) on delete restrict,
  outcome text not null check (outcome in ('DECLARED', 'REJECTED', 'FAILED')),
  reason_code text not null check (reason_code ~ '^HPR_[A-Z0-9_]{1,80}$'),
  -- Server-observed values, when the server got that far. Not proofs.
  observed_sha256 text check (observed_sha256 is null or observed_sha256 ~ '^[0-9a-f]{64}$'),
  observed_byte_size bigint check (observed_byte_size is null or observed_byte_size >= 0),
  object_may_exist boolean not null,
  recorded_at timestamptz not null default now(),
  constraint hpr_upload_outcome_declared_shape check (
    outcome <> 'DECLARED' or (reason_code = 'HPR_DECLARED' and object_may_exist and observed_sha256 is not null)
  )
);

-- Opens an attempt as the AUTHENTICATED technician (PostgREST with the
-- user's verified JWT). Attribution and the object path come from the
-- database, never from the client.
create or replace function public.hpr_open_photo_upload_attempt(
  p_submission_id uuid,
  p_request_nonce uuid
)
returns table (
  attempt_id uuid,
  submission_id uuid,
  inspection_id uuid,
  technician_user_id uuid,
  object_path text,
  client_declared_sha256 text,
  lease_expires_at timestamptz
)
language plpgsql
volatile
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_uid uuid := public.hpr_require_active_technician();
  v_sub public.hpr_evidence_submissions;
  v_path text;
  v_attempt public.hpr_photo_upload_attempts;
begin
  if p_submission_id is null or p_request_nonce is null then
    raise exception using errcode = '22023', message = 'HPR_UPLOAD_ARGUMENT_REQUIRED';
  end if;

  -- Serialize attempts per submission (duplicate finalization guard).
  perform pg_advisory_xact_lock(hashtextextended('hpr_photo_upload:' || p_submission_id::text, 0));

  select * into v_sub from public.hpr_evidence_submissions s where s.id = p_submission_id;
  -- Same error for "absent" and "someone else's" (no cross-tenant oracle).
  if not found
     or v_sub.technician_user_id <> v_uid
     or not exists (
       select 1 from public.hpr_inspections i
       where i.id = v_sub.inspection_id and i.technician_user_id = v_uid
     ) then
    raise exception using errcode = '42501',
      message = 'HPR_SUBMISSION_NOT_ACCESSIBLE: photo submission is not owned by the caller';
  end if;
  if v_sub.kind <> 'PHOTO' then
    raise exception using errcode = '22023',
      message = 'HPR_STORAGE_KIND_MISMATCH: only PHOTO submissions carry stored objects';
  end if;
  if exists (select 1 from public.hpr_evidence_submissions n where n.supersedes_submission_id = v_sub.id) then
    raise exception using errcode = '22023',
      message = 'HPR_SUBMISSION_SUPERSEDED: upload to the current (superseding) submission instead';
  end if;
  if exists (select 1 from public.hpr_evidence_storage_objects d where d.submission_id = v_sub.id) then
    raise exception using errcode = '23505',
      message = 'HPR_ALREADY_DECLARED: this submission already has a declared original';
  end if;

  v_path := v_sub.technician_user_id::text || '/' || v_sub.inspection_id::text || '/' || v_sub.id::text || '/original';

  if exists (
    select 1 from storage.objects o
    where o.bucket_id = 'hpr-field-evidence-private' and o.name = v_path
  ) then
    raise exception using errcode = '23505',
      message = 'HPR_OBJECT_ORPHANED: an undeclared object already exists at the derived path; record a superseding submission';
  end if;

  if exists (
    select 1 from public.hpr_photo_upload_attempts a
    where a.submission_id = v_sub.id
      and a.lease_expires_at > now()
      and not exists (select 1 from public.hpr_photo_upload_outcomes o where o.attempt_id = a.id)
  ) then
    raise exception using errcode = '55P03',
      message = 'HPR_UPLOAD_IN_PROGRESS: another upload attempt for this submission is open';
  end if;

  begin
    insert into public.hpr_photo_upload_attempts (
      submission_id, technician_user_id, request_nonce, object_path, lease_expires_at
    ) values (
      v_sub.id, v_uid, p_request_nonce, v_path, now() + interval '15 minutes'
    ) returning * into v_attempt;
  exception when unique_violation then
    raise exception using errcode = '23505',
      message = 'HPR_UPLOAD_REPLAY: this request nonce has already been used';
  end;

  return query select v_attempt.id, v_sub.id, v_sub.inspection_id, v_uid, v_path,
    v_sub.client_declared_sha256, v_attempt.lease_expires_at;
end;
$$;

-- Completes an attempt (service_role, server-side). The digest, size and
-- MIME type are what the SERVER computed while streaming the original. The
-- database additionally requires that an object exists at the derived path
-- and that the storage service's recorded size equals the declared size.
create or replace function public.hpr_complete_photo_upload_attempt(
  p_attempt_id uuid,
  p_server_sha256 text,
  p_byte_size bigint,
  p_content_type text
)
returns public.hpr_evidence_storage_objects
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_attempt public.hpr_photo_upload_attempts;
  v_object storage.objects;
  v_row public.hpr_evidence_storage_objects;
  v_sub public.hpr_evidence_submissions;
begin
  select * into v_attempt from public.hpr_photo_upload_attempts a where a.id = p_attempt_id for update;
  if not found then
    raise exception using errcode = '42501', message = 'HPR_UPLOAD_ATTEMPT_NOT_FOUND';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('hpr_photo_upload:' || v_attempt.submission_id::text, 0));

  if exists (select 1 from public.hpr_photo_upload_outcomes o where o.attempt_id = v_attempt.id) then
    raise exception using errcode = '23505',
      message = 'HPR_UPLOAD_ALREADY_FINALIZED: this attempt already has an outcome';
  end if;
  if v_attempt.lease_expires_at <= now() then
    raise exception using errcode = '55P03',
      message = 'HPR_UPLOAD_LEASE_EXPIRED: attempt lease expired before finalization';
  end if;
  if p_server_sha256 is null or p_server_sha256 !~ '^[0-9a-f]{64}$' then
    raise exception using errcode = '22023', message = 'HPR_SERVER_DIGEST_INVALID';
  end if;

  select * into v_sub from public.hpr_evidence_submissions s where s.id = v_attempt.submission_id;
  if v_sub.client_declared_sha256 is not null and v_sub.client_declared_sha256 <> p_server_sha256 then
    raise exception using errcode = '22023',
      message = 'HPR_CLIENT_DIGEST_MISMATCH: server digest differs from client_declared_sha256';
  end if;

  select * into v_object from storage.objects o
    where o.bucket_id = 'hpr-field-evidence-private' and o.name = v_attempt.object_path;
  if not found then
    raise exception using errcode = '22023',
      message = 'HPR_OBJECT_ABSENT: no stored object at the derived path';
  end if;
  if (v_object.metadata ->> 'size') is null or (v_object.metadata ->> 'size')::bigint <> p_byte_size then
    raise exception using errcode = '22023',
      message = 'HPR_OBJECT_SIZE_MISMATCH: storage size differs from the server-streamed byte count';
  end if;
  if (v_object.metadata ->> 'mimetype') is distinct from p_content_type then
    raise exception using errcode = '22023',
      message = 'HPR_OBJECT_MIME_MISMATCH: storage content type differs from the validated content type';
  end if;

  -- The #704 declaration table and its CHECKs (size, MIME allowlist,
  -- UNRECONCILED, unique path) apply unchanged.
  insert into public.hpr_evidence_storage_objects (
    submission_id, object_path, server_declared_sha256, declared_byte_size, declared_content_type
  ) values (
    v_attempt.submission_id, v_attempt.object_path, p_server_sha256, p_byte_size, p_content_type
  ) returning * into v_row;

  insert into public.hpr_photo_upload_outcomes (
    attempt_id, outcome, reason_code, observed_sha256, observed_byte_size, object_may_exist
  ) values (
    v_attempt.id, 'DECLARED', 'HPR_DECLARED', p_server_sha256, p_byte_size, true
  );
  return v_row;
end;
$$;

-- Records a failed / rejected attempt (service_role). Never deletes anything.
create or replace function public.hpr_record_photo_upload_failure(
  p_attempt_id uuid,
  p_outcome text,
  p_reason_code text,
  p_observed_sha256 text,
  p_observed_byte_size bigint,
  p_object_may_exist boolean
)
returns public.hpr_photo_upload_outcomes
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_row public.hpr_photo_upload_outcomes;
begin
  if p_outcome not in ('REJECTED', 'FAILED') then
    raise exception using errcode = '22023', message = 'HPR_OUTCOME_INVALID: failures are REJECTED or FAILED';
  end if;
  if not exists (select 1 from public.hpr_photo_upload_attempts a where a.id = p_attempt_id) then
    raise exception using errcode = '42501', message = 'HPR_UPLOAD_ATTEMPT_NOT_FOUND';
  end if;
  insert into public.hpr_photo_upload_outcomes (
    attempt_id, outcome, reason_code, observed_sha256, observed_byte_size, object_may_exist
  ) values (
    p_attempt_id, p_outcome, p_reason_code, lower(p_observed_sha256), p_observed_byte_size, coalesce(p_object_may_exist, true)
  ) returning * into v_row;
  return v_row;
exception when unique_violation then
  raise exception using errcode = '23505',
    message = 'HPR_UPLOAD_ALREADY_FINALIZED: this attempt already has an outcome';
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Reconciliation evidence (append-only; never updates the declaration)
-- ---------------------------------------------------------------------------

-- The API role of the request (from the PostgREST-verified JWT), not the
-- SECURITY DEFINER owner. Falls back to session_user outside PostgREST.
create or replace function public.hpr_request_api_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    session_user::text
  );
$$;

revoke all on function public.hpr_request_api_role() from public, anon, authenticated, service_role;

create table public.hpr_evidence_storage_reconciliations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.hpr_evidence_storage_objects (submission_id) on delete restrict,
  object_path text not null,
  -- Who ran it. reconciler_id is the service job's self-declared name;
  -- api_role is recorded by the database from the verified request JWT.
  reconciler_kind text not null default 'SERVICE_RECONCILER' check (reconciler_kind = 'SERVICE_RECONCILER'),
  reconciler_id text not null check (reconciler_id ~ '^[a-z0-9][a-z0-9._:-]{0,127}$'),
  api_role text not null,
  -- What the database itself saw in storage.objects at record time.
  storage_row_present boolean not null,
  storage_reported_byte_size bigint,
  -- What the reconciler observed by downloading the bytes and re-hashing.
  observed_object_present boolean not null,
  observed_byte_size bigint check (observed_byte_size is null or observed_byte_size >= 0),
  observed_sha256 text check (observed_sha256 is null or observed_sha256 ~ '^[0-9a-f]{64}$'),
  -- Set when the reconciler could not read the bytes for a reason other than
  -- a definite "not found" (Storage answers 500 when the metadata row exists
  -- but the backend bytes are missing, which is indistinguishable from a
  -- transient fault). Recorded so a persistent read failure is visible.
  read_error_code text check (read_error_code is null or read_error_code ~ '^[A-Z0-9_]{1,64}$'),
  -- Computed by the database from the declaration; not accepted from the caller.
  result text not null check (result in ('MATCH', 'DIGEST_MISMATCH', 'SIZE_MISMATCH', 'OBJECT_ABSENT', 'READ_FAILED')),
  read_started_at timestamptz not null,
  read_completed_at timestamptz not null,
  recorded_at timestamptz not null default now(),
  verification_status text not null default 'UNVERIFIED' check (verification_status = 'UNVERIFIED'),
  constraint hpr_reconciliation_timing check (read_started_at <= read_completed_at and read_completed_at <= recorded_at + interval '5 seconds'),
  constraint hpr_reconciliation_observation_shape check (
    (observed_object_present and observed_byte_size is not null and observed_sha256 is not null)
    or (not observed_object_present and observed_byte_size is null and observed_sha256 is null)
  ),
  constraint hpr_reconciliation_read_error_shape check (read_error_code is null or not observed_object_present)
);

create index hpr_reconciliation_submission_idx
  on public.hpr_evidence_storage_reconciliations (submission_id, recorded_at);

comment on table public.hpr_evidence_storage_reconciliations is
  'Append-only reconciliation evidence: a service process re-read the stored original and recomputed its SHA-256. MATCH means stored bytes still match the server declaration. It is NOT independent HVAC verification, not admission, and not permission to act. Same trust domain as the uploader (service_role).';

create or replace function public.hpr_record_storage_reconciliation(
  p_submission_id uuid,
  p_reconciler_id text,
  p_observed_object_present boolean,
  p_observed_byte_size bigint,
  p_observed_sha256 text,
  p_read_started_at timestamptz,
  p_read_completed_at timestamptz,
  p_read_error_code text default null
)
returns public.hpr_evidence_storage_reconciliations
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_decl public.hpr_evidence_storage_objects;
  v_object storage.objects;
  v_present boolean;
  v_size bigint;
  v_result text;
  v_row public.hpr_evidence_storage_reconciliations;
begin
  select * into v_decl from public.hpr_evidence_storage_objects d where d.submission_id = p_submission_id;
  if not found then
    raise exception using errcode = '22023',
      message = 'HPR_DECLARATION_NOT_FOUND: only declared originals can be reconciled';
  end if;
  if p_read_started_at is null or p_read_completed_at is null
     or p_read_started_at > p_read_completed_at
     or p_read_completed_at > now() + interval '5 seconds'
     or p_read_started_at < v_decl.declared_at - interval '5 seconds' then
    raise exception using errcode = '22023', message = 'HPR_RECONCILIATION_TIMING_INVALID';
  end if;

  select * into v_object from storage.objects o
    where o.bucket_id = v_decl.bucket_id and o.name = v_decl.object_path;
  v_present := found;
  v_size := case when v_present then nullif(v_object.metadata ->> 'size', '')::bigint end;

  if p_read_error_code is not null and coalesce(p_observed_object_present, false) then
    raise exception using errcode = '22023', message = 'HPR_RECONCILIATION_SHAPE_INVALID: a read error cannot carry observed bytes';
  end if;

  -- Fail closed: absent if the database has no object row or the reconciler
  -- got a definite not-found; READ_FAILED if it could not read for another
  -- reason. Neither is ever MATCH.
  v_result := case
    when not v_present then 'OBJECT_ABSENT'
    when p_read_error_code is not null then 'READ_FAILED'
    when not coalesce(p_observed_object_present, false) then 'OBJECT_ABSENT'
    when p_observed_byte_size is distinct from v_decl.declared_byte_size
      or v_size is distinct from v_decl.declared_byte_size then 'SIZE_MISMATCH'
    when lower(p_observed_sha256) is distinct from v_decl.server_declared_sha256 then 'DIGEST_MISMATCH'
    else 'MATCH'
  end;

  insert into public.hpr_evidence_storage_reconciliations (
    submission_id, object_path, reconciler_id, api_role,
    storage_row_present, storage_reported_byte_size,
    observed_object_present, observed_byte_size, observed_sha256, read_error_code,
    result, read_started_at, read_completed_at
  ) values (
    v_decl.submission_id, v_decl.object_path, p_reconciler_id, public.hpr_request_api_role(),
    v_present, v_size,
    coalesce(p_observed_object_present, false),
    case when coalesce(p_observed_object_present, false) then p_observed_byte_size end,
    case when coalesce(p_observed_object_present, false) then lower(p_observed_sha256) end,
    p_read_error_code,
    v_result, p_read_started_at, p_read_completed_at
  ) returning * into v_row;
  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Orphans: objects in the bucket with no declaration. Logical quarantine
--    only. Nothing is deleted or moved (the bucket guard forbids both).
-- ---------------------------------------------------------------------------

create table public.hpr_storage_orphan_records (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'hpr-field-evidence-private' check (bucket_id = 'hpr-field-evidence-private'),
  object_path text not null unique,
  storage_object_id uuid not null,
  storage_created_at timestamptz,
  storage_reported_byte_size bigint,
  -- The upload attempt that targeted this path, if any (for review only;
  -- an orphan is never adopted automatically).
  last_attempt_id uuid references public.hpr_photo_upload_attempts (id) on delete restrict,
  disposition text not null default 'QUARANTINED_RETAINED' check (disposition = 'QUARANTINED_RETAINED'),
  detector_id text not null check (detector_id ~ '^[a-z0-9][a-z0-9._:-]{0,127}$'),
  api_role text not null,
  detected_at timestamptz not null default now()
);

create or replace function public.hpr_list_storage_orphans()
returns table (object_path text, storage_object_id uuid, storage_created_at timestamptz, storage_reported_byte_size bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select o.name, o.id, o.created_at, nullif(o.metadata ->> 'size', '')::bigint
  from storage.objects o
  where o.bucket_id = 'hpr-field-evidence-private'
    and not exists (select 1 from public.hpr_evidence_storage_objects d where d.object_path = o.name)
    and not exists (select 1 from public.hpr_storage_orphan_records r where r.object_path = o.name)
  order by o.created_at, o.name;
$$;

create or replace function public.hpr_record_storage_orphan(
  p_object_path text,
  p_detector_id text
)
returns public.hpr_storage_orphan_records
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  v_object storage.objects;
  v_row public.hpr_storage_orphan_records;
begin
  select * into v_object from storage.objects o
    where o.bucket_id = 'hpr-field-evidence-private' and o.name = p_object_path;
  if not found then
    raise exception using errcode = '22023', message = 'HPR_OBJECT_ABSENT: no such object in the private bucket';
  end if;
  if exists (select 1 from public.hpr_evidence_storage_objects d where d.object_path = p_object_path) then
    raise exception using errcode = '22023', message = 'HPR_NOT_ORPHAN: object has a declaration';
  end if;
  insert into public.hpr_storage_orphan_records (
    object_path, storage_object_id, storage_created_at, storage_reported_byte_size,
    last_attempt_id, detector_id, api_role
  ) values (
    p_object_path, v_object.id, v_object.created_at, nullif(v_object.metadata ->> 'size', '')::bigint,
    (select a.id from public.hpr_photo_upload_attempts a where a.object_path = p_object_path
       order by a.opened_at desc limit 1),
    p_detector_id, public.hpr_request_api_role()
  ) returning * into v_row;
  return v_row;
exception when unique_violation then
  raise exception using errcode = '23505', message = 'HPR_ORPHAN_ALREADY_RECORDED';
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Integrity projection (security_invoker). The #704 view
--    hpr_evidence_current is left unchanged.
--
-- photo_integrity_state:
--   STORAGE_PENDING        no declaration (upload not finalized)
--   DECLARED_UNRECONCILED  declared, never reconciled
--   RECONCILIATION_FAILED  any DIGEST_MISMATCH / SIZE_MISMATCH / OBJECT_ABSENT
--                          (sticky; a later MATCH does not clear it — review)
--   RECONCILIATION_INCONCLUSIVE  latest reconciliation is READ_FAILED
--   RECONCILED_MATCH       latest is MATCH and no failure was ever recorded
-- None of these means verified, complete or admissible.
-- ---------------------------------------------------------------------------

create view public.hpr_evidence_photo_integrity
with (security_invoker = true) as
select
  s.id as submission_id,
  s.inspection_id,
  s.step_number,
  s.technician_user_id,
  d.object_path,
  d.server_declared_sha256,
  d.declared_byte_size,
  d.declared_content_type,
  d.declared_at,
  r.reconciliation_count,
  r.last_reconciled_at,
  case
    when d.submission_id is null then 'STORAGE_PENDING'
    when coalesce(r.reconciliation_count, 0) = 0 then 'DECLARED_UNRECONCILED'
    when r.failure_count > 0 then 'RECONCILIATION_FAILED'
    when r.latest_result = 'MATCH' then 'RECONCILED_MATCH'
    else 'RECONCILIATION_INCONCLUSIVE'
  end as photo_integrity_state,
  s.verification_status
from public.hpr_evidence_submissions s
left join public.hpr_evidence_storage_objects d on d.submission_id = s.id
left join lateral (
  select count(*) as reconciliation_count,
         count(*) filter (where x.result in ('DIGEST_MISMATCH', 'SIZE_MISMATCH', 'OBJECT_ABSENT')) as failure_count,
         (array_agg(x.result order by x.recorded_at desc, x.id desc))[1] as latest_result,
         max(x.recorded_at) as last_reconciled_at
  from public.hpr_evidence_storage_reconciliations x
  where x.submission_id = s.id
) r on true
where s.kind = 'PHOTO';

-- ---------------------------------------------------------------------------
-- 6. Append-only triggers, RLS, privileges
-- ---------------------------------------------------------------------------

create trigger hpr_upload_attempts_append_only before update or delete on public.hpr_photo_upload_attempts
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_upload_attempts_no_truncate before truncate on public.hpr_photo_upload_attempts
  for each statement execute function public.hpr_reject_mutation();
create trigger hpr_upload_outcomes_append_only before update or delete on public.hpr_photo_upload_outcomes
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_upload_outcomes_no_truncate before truncate on public.hpr_photo_upload_outcomes
  for each statement execute function public.hpr_reject_mutation();
create trigger hpr_reconciliations_append_only before update or delete on public.hpr_evidence_storage_reconciliations
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_reconciliations_no_truncate before truncate on public.hpr_evidence_storage_reconciliations
  for each statement execute function public.hpr_reject_mutation();
create trigger hpr_orphans_append_only before update or delete on public.hpr_storage_orphan_records
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_orphans_no_truncate before truncate on public.hpr_storage_orphan_records
  for each statement execute function public.hpr_reject_mutation();

alter table public.hpr_photo_upload_attempts enable row level security;
alter table public.hpr_photo_upload_outcomes enable row level security;
alter table public.hpr_evidence_storage_reconciliations enable row level security;
alter table public.hpr_storage_orphan_records enable row level security;

create policy "HPR technicians read their own upload attempts"
  on public.hpr_photo_upload_attempts for select to authenticated
  using ((select auth.uid()) = technician_user_id);

create policy "HPR technicians read outcomes of their own upload attempts"
  on public.hpr_photo_upload_outcomes for select to authenticated
  using (exists (
    select 1 from public.hpr_photo_upload_attempts a
    where a.id = attempt_id and a.technician_user_id = (select auth.uid())
  ));

create policy "HPR technicians read reconciliations of their own evidence"
  on public.hpr_evidence_storage_reconciliations for select to authenticated
  using (exists (
    select 1 from public.hpr_evidence_submissions s
    where s.id = submission_id and s.technician_user_id = (select auth.uid())
  ));
-- hpr_storage_orphan_records: no client policy (service_role only).

revoke all on table
  public.hpr_photo_upload_attempts,
  public.hpr_photo_upload_outcomes,
  public.hpr_evidence_storage_reconciliations,
  public.hpr_storage_orphan_records,
  public.hpr_evidence_photo_integrity
from public, anon, authenticated, service_role;

grant select on table public.hpr_photo_upload_attempts to authenticated, service_role;
grant select on table public.hpr_photo_upload_outcomes to authenticated, service_role;
grant select on table public.hpr_evidence_storage_reconciliations to authenticated, service_role;
grant select on table public.hpr_storage_orphan_records to service_role;
grant select on table public.hpr_evidence_photo_integrity to authenticated, service_role;

revoke all on function public.hpr_open_photo_upload_attempt(uuid, uuid) from public, anon, authenticated, service_role;
grant execute on function public.hpr_open_photo_upload_attempt(uuid, uuid) to authenticated;

revoke all on function public.hpr_complete_photo_upload_attempt(uuid, text, bigint, text) from public, anon, authenticated, service_role;
grant execute on function public.hpr_complete_photo_upload_attempt(uuid, text, bigint, text) to service_role;

revoke all on function public.hpr_record_photo_upload_failure(uuid, text, text, text, bigint, boolean) from public, anon, authenticated, service_role;
grant execute on function public.hpr_record_photo_upload_failure(uuid, text, text, text, bigint, boolean) to service_role;

revoke all on function public.hpr_record_storage_reconciliation(uuid, text, boolean, bigint, text, timestamptz, timestamptz, text) from public, anon, authenticated, service_role;
grant execute on function public.hpr_record_storage_reconciliation(uuid, text, boolean, bigint, text, timestamptz, timestamptz, text) to service_role;

revoke all on function public.hpr_list_storage_orphans() from public, anon, authenticated, service_role;
grant execute on function public.hpr_list_storage_orphans() to service_role;

revoke all on function public.hpr_record_storage_orphan(text, text) from public, anon, authenticated, service_role;
grant execute on function public.hpr_record_storage_orphan(text, text) to service_role;

-- Declarations now go only through hpr_complete_photo_upload_attempt, which
-- requires an open attempt and an existing object. The #704 function stays
-- (unchanged) but service_role can no longer call it directly, so a
-- declaration without a stored object can no longer be created.
revoke execute on function public.hpr_declare_evidence_storage_object(uuid, text, bigint, text) from service_role;

comment on function public.hpr_open_photo_upload_attempt(uuid, uuid) is
  'authenticated only. Opens an append-only upload attempt for a PHOTO submission owned by auth.uid(); derives the object path. Nonce replay and concurrent attempts are rejected.';
comment on function public.hpr_complete_photo_upload_attempt(uuid, text, bigint, text) is
  'service_role only. Declares the server-computed digest after checking the object exists with the same size and MIME. Result is UNRECONCILED; not verification.';
comment on function public.hpr_record_storage_reconciliation(uuid, text, boolean, bigint, text, timestamptz, timestamptz, text) is
  'service_role only. Appends a reconciliation; the result is computed by the database from the declaration. MATCH is not verification.';
