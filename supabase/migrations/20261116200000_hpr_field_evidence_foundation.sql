-- TA-14 HVAC Performance Record (HPR) — field evidence foundation, increment 1
--
-- STATUS: COMMITTED FOR REVIEW / NOT EXECUTED IN ANY SUPABASE PROJECT.
-- Do not apply to production until the migration review in
-- 20261116200000_hpr_field_evidence_foundation.IMPACT.md is complete.
--
-- Scope: database schema, row-level security, and authenticated access
-- boundaries only. This migration does NOT create a storage bucket, an upload
-- route, a digest service, a verifier, an HVAC Analyzer, a DDD, an admission
-- gate, or any execution / Refrigerant Governor capability.
--
-- Governance boundary encoded here:
--   * Technician collects evidence. Every evidence row is UNVERIFIED and the
--     column is CHECK-constrained so it can never hold any other value.
--     Verification, if it ever exists, must be a separate attributable record
--     written by an independent verifier — never a mutation of this evidence.
--   * Technician identity is taken only from auth.uid() (the `sub` claim of
--     the JWT verified by Supabase). Clients cannot write technician_user_id:
--     the column is excluded from the INSERT grant, and guard triggers reject
--     any row whose technician differs from auth.uid().
--   * Original evidence is append-only. UPDATE, DELETE and TRUNCATE are
--     revoked from every API role (including service_role) and rejected by
--     triggers. Corrections are new rows that reference the row they
--     supersede, carry a reason, and are attributed to the correcting
--     technician.
--   * The 14 canonical inspection steps are seeded and then locked.

-- ---------------------------------------------------------------------------
-- Shared guards
-- ---------------------------------------------------------------------------

create or replace function public.hpr_reject_mutation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  raise exception using
    errcode = '42501',
    message = 'HPR_APPEND_ONLY: ' || tg_table_name || ' rejects ' || tg_op
      || '; record a superseding event instead';
end;
$$;

revoke all on function public.hpr_reject_mutation() from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Canonical 14-step baseline (reference data, locked after seed)
-- ---------------------------------------------------------------------------

create table public.hpr_baseline_steps (
  step_number smallint primary key check (step_number between 1 and 14),
  title text not null unique check (length(btrim(title)) > 0),
  zone text not null check (zone in ('INDOOR', 'OUTDOOR_SYSTEM_CLOSURE')),
  constraint hpr_baseline_steps_zone_order check (
    (step_number <= 7 and zone = 'INDOOR')
    or (step_number >= 8 and zone = 'OUTDOOR_SYSTEM_CLOSURE')
  )
);

insert into public.hpr_baseline_steps (step_number, title, zone) values
  (1,  'Approaching & Opening the Air Handler', 'INDOOR'),
  (2,  'Heat Kit & Furnace Operation Check', 'INDOOR'),
  (3,  'Blower Motor & Airflow Integrity', 'INDOOR'),
  (4,  'Evaporator Coil Inspection', 'INDOOR'),
  (5,  'Metering Device Identification', 'INDOOR'),
  (6,  'Filter & Return Airflow Check', 'INDOOR'),
  (7,  'Air Handler Reassembly Check', 'INDOOR'),
  (8,  'Condenser Visual Inspection & Controlled Panel Opening', 'OUTDOOR_SYSTEM_CLOSURE'),
  (9,  'Start Components, Capacitors & Compressor Insulation Verification', 'OUTDOOR_SYSTEM_CLOSURE'),
  (10, 'Compressor & Fan Motor Amp Draw Verification', 'OUTDOOR_SYSTEM_CLOSURE'),
  (11, 'Condenser Panel Reassembly & Mechanical Integrity Check', 'OUTDOOR_SYSTEM_CLOSURE'),
  (12, 'Condenser Coil Cleaning & Airflow Restoration', 'OUTDOOR_SYSTEM_CLOSURE'),
  (13, 'Refrigerant Charge Approximation', 'OUTDOOR_SYSTEM_CLOSURE'),
  (14, 'Condensate Management Verification & System Closure', 'OUTDOOR_SYSTEM_CLOSURE');

do $$
begin
  if (select count(*) from public.hpr_baseline_steps) <> 14 then
    raise exception 'HPR_BASELINE_INVALID: exactly 14 canonical steps are required';
  end if;
end;
$$;

create trigger hpr_baseline_steps_locked
before insert or update or delete on public.hpr_baseline_steps
for each row execute function public.hpr_reject_mutation();

create trigger hpr_baseline_steps_no_truncate
before truncate on public.hpr_baseline_steps
for each statement execute function public.hpr_reject_mutation();

alter table public.hpr_baseline_steps enable row level security;

create policy "HPR baseline steps are readable by authenticated users"
  on public.hpr_baseline_steps for select to authenticated using (true);

-- ---------------------------------------------------------------------------
-- Technician enrollment (authorization, not identity)
--
-- Being signed in is not enough to submit evidence. A user must be enrolled
-- as an active HPR technician. Enrollment is written only by service_role
-- (server-side administration); users cannot enroll themselves.
-- ---------------------------------------------------------------------------

create table public.hpr_technicians (
  user_id uuid primary key references auth.users (id) on delete restrict,
  status text not null default 'active' check (status in ('active', 'suspended')),
  enrolled_at timestamptz not null default now(),
  enrollment_note text,
  status_changed_at timestamptz not null default now()
);

alter table public.hpr_technicians enable row level security;

create policy "HPR technicians can read their own enrollment"
  on public.hpr_technicians for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.hpr_is_active_technician()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.hpr_technicians t
    where t.user_id = auth.uid() and t.status = 'active'
  );
$$;

revoke all on function public.hpr_is_active_technician() from public, anon;
grant execute on function public.hpr_is_active_technician() to authenticated;

-- Returns the verified caller id or raises. Never trusts row contents.
create or replace function public.hpr_require_active_technician()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception using errcode = '42501',
      message = 'HPR_AUTH_REQUIRED: an authenticated technician session is required';
  end if;
  if not exists (
    select 1 from public.hpr_technicians t
    where t.user_id = v_uid and t.status = 'active'
  ) then
    raise exception using errcode = '42501',
      message = 'HPR_TECHNICIAN_NOT_AUTHORIZED: caller is not an active enrolled technician';
  end if;
  return v_uid;
end;
$$;

revoke all on function public.hpr_require_active_technician() from public, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Equipment identity (as registered by a technician)
-- ---------------------------------------------------------------------------

create table public.hpr_equipment (
  id uuid primary key default gen_random_uuid(),
  registered_by uuid not null default auth.uid() references auth.users (id) on delete restrict,
  manufacturer text not null check (length(btrim(manufacturer)) between 1 and 200),
  model text not null check (length(btrim(model)) between 1 and 200),
  serial_number text not null check (length(btrim(serial_number)) between 1 and 200),
  equipment_type text not null check (length(btrim(equipment_type)) between 1 and 200),
  registered_at timestamptz not null default now(),
  verification_status text not null default 'UNVERIFIED' check (verification_status = 'UNVERIFIED')
);

create unique index hpr_equipment_registrant_identity_key
  on public.hpr_equipment (registered_by, lower(btrim(manufacturer)), upper(btrim(serial_number)));

-- ---------------------------------------------------------------------------
-- Technician inspections
-- ---------------------------------------------------------------------------

create table public.hpr_inspections (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.hpr_equipment (id) on delete restrict,
  technician_user_id uuid not null default auth.uid() references auth.users (id) on delete restrict,
  concern text not null check (length(btrim(concern)) between 1 and 4000),
  operating_mode_as_found text not null check (length(btrim(operating_mode_as_found)) between 1 and 200),
  opened_at timestamptz not null default now(),
  canonical_step_count smallint not null default 14 check (canonical_step_count = 14),
  verification_status text not null default 'UNVERIFIED' check (verification_status = 'UNVERIFIED'),
  ddd_status text not null default 'LOCKED' check (ddd_status = 'LOCKED'),
  intervention_authorization text not null default 'NONE' check (intervention_authorization = 'NONE')
);

create index hpr_inspections_technician_idx on public.hpr_inspections (technician_user_id, opened_at);
create index hpr_inspections_equipment_idx on public.hpr_inspections (equipment_id);

-- ---------------------------------------------------------------------------
-- Individual evidence submissions (append-only, always UNVERIFIED)
-- ---------------------------------------------------------------------------

create table public.hpr_evidence_submissions (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.hpr_inspections (id) on delete restrict,
  step_number smallint not null references public.hpr_baseline_steps (step_number),
  technician_user_id uuid not null default auth.uid() references auth.users (id) on delete restrict,
  client_record_id text not null check (length(btrim(client_record_id)) between 1 and 128),
  kind text not null check (kind in ('PHOTO', 'MEASUREMENT', 'OBSERVATION')),
  client_captured_at timestamptz not null,
  submitted_at timestamptz not null default now(),
  observation text check (observation is null or length(btrim(observation)) between 1 and 8000),
  measurement_value double precision,
  measurement_unit text check (measurement_unit is null or length(btrim(measurement_unit)) between 1 and 32),
  instrument_id text check (instrument_id is null or length(btrim(instrument_id)) between 1 and 200),
  calibration_ref text check (calibration_ref is null or length(btrim(calibration_ref)) between 1 and 200),
  -- A digest the client says it computed. Informational only: it is never an
  -- integrity proof. The authoritative digest is server_sha256 on
  -- hpr_evidence_storage_objects, written only by the server.
  client_declared_sha256 text check (client_declared_sha256 is null or client_declared_sha256 ~ '^[0-9a-f]{64}$'),
  supersedes_submission_id uuid references public.hpr_evidence_submissions (id) on delete restrict,
  correction_reason text check (correction_reason is null or length(btrim(correction_reason)) between 1 and 4000),
  source text not null default 'TECHNICIAN_CAPTURE' check (source = 'TECHNICIAN_CAPTURE'),
  verification_status text not null default 'UNVERIFIED' check (verification_status = 'UNVERIFIED'),

  constraint hpr_evidence_measurement_shape check (
    case kind
      when 'MEASUREMENT' then
        measurement_value is not null
        and measurement_value not in ('NaN'::double precision, 'Infinity'::double precision, '-Infinity'::double precision)
        and measurement_unit is not null
        and instrument_id is not null
      else measurement_value is null and measurement_unit is null
    end
  ),
  constraint hpr_evidence_observation_required check (kind <> 'OBSERVATION' or observation is not null),
  constraint hpr_evidence_correction_shape check (
    (supersedes_submission_id is null and correction_reason is null)
    or (supersedes_submission_id is not null and correction_reason is not null)
  ),
  constraint hpr_evidence_not_self_superseding check (supersedes_submission_id is distinct from id)
);

-- Duplicate evidence identifiers are rejected per technician. Scoping to the
-- technician avoids a cross-tenant existence oracle on client identifiers;
-- the server-generated id is the globally unique identity.
create unique index hpr_evidence_client_record_key
  on public.hpr_evidence_submissions (technician_user_id, client_record_id);

-- Linear correction lineage: a submission can be superseded at most once.
create unique index hpr_evidence_single_successor_key
  on public.hpr_evidence_submissions (supersedes_submission_id)
  where supersedes_submission_id is not null;

create index hpr_evidence_inspection_step_idx
  on public.hpr_evidence_submissions (inspection_id, step_number, submitted_at);

-- ---------------------------------------------------------------------------
-- Private storage references (schema only; bucket + upload are increment 2)
--
-- Object path convention (enforced):
--   {technician_user_id}/{inspection_id}/{submission_id}/original
-- Rows are written only through hpr_record_evidence_storage_object(), which
-- is executable only by service_role, i.e. the server after it has streamed
-- the bytes and computed SHA-256 itself.
-- ---------------------------------------------------------------------------

create table public.hpr_evidence_storage_objects (
  submission_id uuid primary key references public.hpr_evidence_submissions (id) on delete restrict,
  bucket_id text not null default 'hpr-field-evidence-private' check (bucket_id = 'hpr-field-evidence-private'),
  object_path text not null unique,
  server_sha256 text not null check (server_sha256 ~ '^[0-9a-f]{64}$'),
  byte_size bigint not null check (byte_size > 0 and byte_size <= 26214400),
  content_type text not null check (content_type in ('image/jpeg', 'image/png', 'image/heic', 'image/webp')),
  recorded_at timestamptz not null default now()
);

create or replace function public.hpr_record_evidence_storage_object(
  p_submission_id uuid,
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
  v_sub public.hpr_evidence_submissions;
  v_row public.hpr_evidence_storage_objects;
begin
  select * into v_sub from public.hpr_evidence_submissions where id = p_submission_id;
  if not found then
    raise exception 'HPR_SUBMISSION_NOT_FOUND';
  end if;
  if v_sub.kind <> 'PHOTO' then
    raise exception 'HPR_STORAGE_KIND_MISMATCH: only PHOTO submissions carry stored objects';
  end if;

  insert into public.hpr_evidence_storage_objects (
    submission_id, object_path, server_sha256, byte_size, content_type
  ) values (
    v_sub.id,
    v_sub.technician_user_id::text || '/' || v_sub.inspection_id::text || '/' || v_sub.id::text || '/original',
    lower(p_server_sha256),
    p_byte_size,
    p_content_type
  )
  returning * into v_row;
  return v_row;
end;
$$;

revoke all on function public.hpr_record_evidence_storage_object(uuid, text, bigint, text)
  from public, anon, authenticated;
grant execute on function public.hpr_record_evidence_storage_object(uuid, text, bigint, text)
  to service_role;

-- ---------------------------------------------------------------------------
-- Identity / ownership guard triggers (fail closed, run before RLS checks)
-- ---------------------------------------------------------------------------

create or replace function public.hpr_guard_equipment_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public.hpr_require_active_technician();
begin
  if new.registered_by is distinct from v_uid then
    raise exception using errcode = '42501',
      message = 'HPR_TECHNICIAN_IDENTITY_MISMATCH: registered_by must be the authenticated caller';
  end if;
  new.registered_at := now();
  new.verification_status := 'UNVERIFIED';
  return new;
end;
$$;

create or replace function public.hpr_guard_inspection_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public.hpr_require_active_technician();
begin
  if new.technician_user_id is distinct from v_uid then
    raise exception using errcode = '42501',
      message = 'HPR_TECHNICIAN_IDENTITY_MISMATCH: technician_user_id must be the authenticated caller';
  end if;
  if not exists (
    select 1 from public.hpr_equipment e
    where e.id = new.equipment_id and e.registered_by = v_uid
  ) then
    raise exception using errcode = '42501',
      message = 'HPR_EQUIPMENT_NOT_ACCESSIBLE: equipment is not registered to the caller';
  end if;
  new.opened_at := now();
  new.canonical_step_count := 14;
  new.verification_status := 'UNVERIFIED';
  new.ddd_status := 'LOCKED';
  new.intervention_authorization := 'NONE';
  return new;
end;
$$;

create or replace function public.hpr_guard_evidence_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := public.hpr_require_active_technician();
  v_prior public.hpr_evidence_submissions;
begin
  if new.technician_user_id is distinct from v_uid then
    raise exception using errcode = '42501',
      message = 'HPR_TECHNICIAN_IDENTITY_MISMATCH: technician_user_id must be the authenticated caller';
  end if;
  if not exists (
    select 1 from public.hpr_inspections i
    where i.id = new.inspection_id and i.technician_user_id = v_uid
  ) then
    raise exception using errcode = '42501',
      message = 'HPR_INSPECTION_NOT_ACCESSIBLE: inspection is not owned by the caller';
  end if;
  if new.client_captured_at > now() + interval '5 minutes' then
    raise exception 'HPR_CAPTURE_TIME_IN_FUTURE: client_captured_at is later than server time';
  end if;

  if new.supersedes_submission_id is not null then
    select * into v_prior from public.hpr_evidence_submissions
      where id = new.supersedes_submission_id;
    if not found
       or v_prior.inspection_id <> new.inspection_id
       or v_prior.technician_user_id <> v_uid then
      raise exception using errcode = '42501',
        message = 'HPR_SUPERSESSION_NOT_ACCESSIBLE: superseded evidence must belong to the same inspection and caller';
    end if;
    if v_prior.step_number <> new.step_number then
      raise exception 'HPR_SUPERSESSION_STEP_MISMATCH: a correction must address the same canonical step';
    end if;
  end if;

  new.submitted_at := now();
  new.source := 'TECHNICIAN_CAPTURE';
  new.verification_status := 'UNVERIFIED';
  return new;
end;
$$;

revoke all on function public.hpr_guard_equipment_insert() from public, anon, authenticated, service_role;
revoke all on function public.hpr_guard_inspection_insert() from public, anon, authenticated, service_role;
revoke all on function public.hpr_guard_evidence_insert() from public, anon, authenticated, service_role;

create trigger hpr_equipment_guard before insert on public.hpr_equipment
  for each row execute function public.hpr_guard_equipment_insert();
create trigger hpr_inspections_guard before insert on public.hpr_inspections
  for each row execute function public.hpr_guard_inspection_insert();
create trigger hpr_evidence_guard before insert on public.hpr_evidence_submissions
  for each row execute function public.hpr_guard_evidence_insert();

-- Append-only enforcement on every record table.
create trigger hpr_equipment_append_only before update or delete on public.hpr_equipment
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_equipment_no_truncate before truncate on public.hpr_equipment
  for each statement execute function public.hpr_reject_mutation();
create trigger hpr_inspections_append_only before update or delete on public.hpr_inspections
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_inspections_no_truncate before truncate on public.hpr_inspections
  for each statement execute function public.hpr_reject_mutation();
create trigger hpr_evidence_append_only before update or delete on public.hpr_evidence_submissions
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_evidence_no_truncate before truncate on public.hpr_evidence_submissions
  for each statement execute function public.hpr_reject_mutation();
create trigger hpr_storage_objects_append_only before update or delete on public.hpr_evidence_storage_objects
  for each row execute function public.hpr_reject_mutation();
create trigger hpr_storage_objects_no_truncate before truncate on public.hpr_evidence_storage_objects
  for each statement execute function public.hpr_reject_mutation();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.hpr_equipment enable row level security;
alter table public.hpr_inspections enable row level security;
alter table public.hpr_evidence_submissions enable row level security;
alter table public.hpr_evidence_storage_objects enable row level security;

create policy "HPR technicians read equipment they registered"
  on public.hpr_equipment for select to authenticated
  using ((select auth.uid()) = registered_by);

create policy "HPR active technicians register equipment as themselves"
  on public.hpr_equipment for insert to authenticated
  with check ((select auth.uid()) = registered_by and public.hpr_is_active_technician());

create policy "HPR technicians read their own inspections"
  on public.hpr_inspections for select to authenticated
  using ((select auth.uid()) = technician_user_id);

create policy "HPR active technicians open inspections as themselves"
  on public.hpr_inspections for insert to authenticated
  with check (
    (select auth.uid()) = technician_user_id
    and public.hpr_is_active_technician()
    and exists (
      select 1 from public.hpr_equipment e
      where e.id = equipment_id and e.registered_by = (select auth.uid())
    )
  );

create policy "HPR technicians read evidence on their own inspections"
  on public.hpr_evidence_submissions for select to authenticated
  using (
    (select auth.uid()) = technician_user_id
    and exists (
      select 1 from public.hpr_inspections i
      where i.id = inspection_id and i.technician_user_id = (select auth.uid())
    )
  );

create policy "HPR active technicians submit evidence to their own inspections"
  on public.hpr_evidence_submissions for insert to authenticated
  with check (
    (select auth.uid()) = technician_user_id
    and public.hpr_is_active_technician()
    and exists (
      select 1 from public.hpr_inspections i
      where i.id = inspection_id and i.technician_user_id = (select auth.uid())
    )
  );

create policy "HPR technicians read storage references for their own evidence"
  on public.hpr_evidence_storage_objects for select to authenticated
  using (
    exists (
      select 1 from public.hpr_evidence_submissions s
      where s.id = submission_id and s.technician_user_id = (select auth.uid())
    )
  );

-- ---------------------------------------------------------------------------
-- Privileges. Supabase grants ALL on new public tables to anon,
-- authenticated and service_role by default; revoke and re-grant minimally.
-- ---------------------------------------------------------------------------

revoke all on table
  public.hpr_baseline_steps,
  public.hpr_technicians,
  public.hpr_equipment,
  public.hpr_inspections,
  public.hpr_evidence_submissions,
  public.hpr_evidence_storage_objects
from public, anon, authenticated, service_role;

grant select on table public.hpr_baseline_steps to authenticated, service_role;

grant select on table public.hpr_technicians to authenticated;
grant select, insert on table public.hpr_technicians to service_role;
grant update (status, status_changed_at, enrollment_note) on table public.hpr_technicians to service_role;

grant select on table public.hpr_equipment to authenticated, service_role;
grant insert (manufacturer, model, serial_number, equipment_type)
  on table public.hpr_equipment to authenticated;

grant select on table public.hpr_inspections to authenticated, service_role;
grant insert (equipment_id, concern, operating_mode_as_found)
  on table public.hpr_inspections to authenticated;

grant select on table public.hpr_evidence_submissions to authenticated, service_role;
grant insert (
  inspection_id, step_number, client_record_id, kind, client_captured_at,
  observation, measurement_value, measurement_unit, instrument_id,
  calibration_ref, client_declared_sha256, supersedes_submission_id,
  correction_reason
) on table public.hpr_evidence_submissions to authenticated;

grant select on table public.hpr_evidence_storage_objects to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Current-evidence projection (no superseding successor). security_invoker
-- so the caller's RLS applies.
-- ---------------------------------------------------------------------------

create view public.hpr_evidence_current
with (security_invoker = true) as
select s.*
from public.hpr_evidence_submissions s
where not exists (
  select 1 from public.hpr_evidence_submissions n
  where n.supersedes_submission_id = s.id
);

revoke all on table public.hpr_evidence_current from public, anon, authenticated, service_role;
grant select on table public.hpr_evidence_current to authenticated, service_role;

comment on table public.hpr_evidence_submissions is
  'HPR technician field evidence. Append-only; always UNVERIFIED. Corrections are superseding rows. Not verification, not a DDD, not intervention authority.';
comment on column public.hpr_evidence_submissions.client_declared_sha256 is
  'Client claim only; never an integrity proof. See hpr_evidence_storage_objects.server_sha256.';
