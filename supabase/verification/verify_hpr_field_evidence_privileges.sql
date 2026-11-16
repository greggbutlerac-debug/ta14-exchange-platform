-- TA-14 HPR Field Evidence — privilege / RLS verification
--
-- READ ONLY. Run in a Supabase BRANCH or PREVIEW project after:
--
--   20261116200000_hpr_field_evidence_foundation.sql
--
-- Do not run the migration against production to use this script.
-- Every query returns ZERO ROWS when the database matches the reviewed
-- design. Any returned row is a finding. Compare with the PGlite suite in
-- tests/hvac-performance-record/persistence/field-evidence-rls.test.ts
-- ("review D2: privilege audit").

-- ============================================================================
-- 1. FUNCTION EXECUTE GRANTS (includes trigger functions and PUBLIC)
--    Expected: hpr_is_active_technician -> authenticated only;
--              hpr_declare_evidence_storage_object -> service_role only;
--              every other hpr_* function -> nobody.
-- ============================================================================

with expected(fn, role_name) as (
  values
    ('hpr_is_active_technician', 'authenticated'),
    ('hpr_declare_evidence_storage_object', 'service_role')
),
actual as (
  select p.proname as fn, r.role_name,
         has_function_privilege(r.role_name, p.oid, 'EXECUTE') as can_execute
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  cross join (values ('anon'), ('authenticated'), ('service_role')) r(role_name)
  where n.nspname = 'public' and p.proname like 'hpr\_%'
)
select a.fn, a.role_name, a.can_execute, (e.fn is not null) as expected_execute
from actual a
left join expected e on e.fn = a.fn and e.role_name = a.role_name
where a.can_execute is distinct from (e.fn is not null)
union all
select p.proname, 'PUBLIC', true, false
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a
where n.nspname = 'public' and p.proname like 'hpr\_%'
  and a.grantee = 0 and a.privilege_type = 'EXECUTE';

-- ============================================================================
-- 2. SECURITY DEFINER FUNCTIONS WITHOUT search_path = ''
-- ============================================================================

select p.proname, p.proconfig
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'hpr\_%' and p.prosecdef
  and not coalesce(p.proconfig @> array['search_path=""'], false);

-- ============================================================================
-- 3. TABLE-LEVEL PRIVILEGES OUTSIDE THE REVIEWED MATRIX
--    Allowed: SELECT for authenticated + service_role on every HPR object;
--             INSERT on hpr_technicians for service_role. Nothing else.
-- ============================================================================

with objects(o) as (
  values ('hpr_baseline_steps'), ('hpr_technicians'), ('hpr_equipment'), ('hpr_inspections'),
         ('hpr_evidence_submissions'), ('hpr_evidence_storage_objects'), ('hpr_evidence_current')
),
roles(r) as (values ('anon'), ('authenticated'), ('service_role')),
privs(p) as (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('REFERENCES'), ('TRIGGER'))
select r, o, p
from objects, roles, privs
where has_table_privilege(r, 'public.' || o, p)
  and not (
    (p = 'SELECT' and r in ('authenticated', 'service_role'))
    or (r = 'service_role' and o = 'hpr_technicians' and p = 'INSERT')
  );

-- ============================================================================
-- 4. COLUMN-LEVEL INSERT/UPDATE GRANTS OUTSIDE THE REVIEWED SET
-- ============================================================================

with allowed(r, t, c, p) as (
  values
    ('authenticated', 'hpr_equipment', 'manufacturer', 'INSERT'),
    ('authenticated', 'hpr_equipment', 'model', 'INSERT'),
    ('authenticated', 'hpr_equipment', 'serial_number', 'INSERT'),
    ('authenticated', 'hpr_equipment', 'equipment_type', 'INSERT'),
    ('authenticated', 'hpr_inspections', 'equipment_id', 'INSERT'),
    ('authenticated', 'hpr_inspections', 'concern', 'INSERT'),
    ('authenticated', 'hpr_inspections', 'operating_mode_as_found', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'inspection_id', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'step_number', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'client_record_id', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'kind', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'client_captured_at', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'observation', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'measurement_value', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'measurement_unit', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'instrument_id', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'calibration_ref', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'client_declared_sha256', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'supersedes_submission_id', 'INSERT'),
    ('authenticated', 'hpr_evidence_submissions', 'correction_reason', 'INSERT'),
    ('service_role', 'hpr_technicians', 'user_id', 'INSERT'),
    ('service_role', 'hpr_technicians', 'status', 'INSERT'),
    ('service_role', 'hpr_technicians', 'enrolled_at', 'INSERT'),
    ('service_role', 'hpr_technicians', 'enrollment_note', 'INSERT'),
    ('service_role', 'hpr_technicians', 'status_changed_at', 'INSERT'),
    ('service_role', 'hpr_technicians', 'status', 'UPDATE'),
    ('service_role', 'hpr_technicians', 'status_changed_at', 'UPDATE'),
    ('service_role', 'hpr_technicians', 'enrollment_note', 'UPDATE')
)
select r.r as role_name, c.table_name, c.column_name, p.p as privilege
from information_schema.columns c
cross join (values ('anon'), ('authenticated'), ('service_role')) r(r)
cross join (values ('INSERT'), ('UPDATE')) p(p)
where c.table_schema = 'public' and c.table_name like 'hpr\_%'
  and c.table_name <> 'hpr_evidence_current'
  and has_column_privilege(r.r, 'public.' || c.table_name, c.column_name, p.p)
  and not exists (
    select 1 from allowed a
    where a.r = r.r and a.t = c.table_name and a.c = c.column_name and a.p = p.p
  );

-- ============================================================================
-- 5. HPR TABLES WITHOUT RLS ENABLED
-- ============================================================================

select c.relname
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'hpr\_%'
  and not c.relrowsecurity;

-- ============================================================================
-- 6. MISSING APPEND-ONLY / GUARD TRIGGERS (or triggers disabled)
-- ============================================================================

with expected(tbl, trg) as (
  values
    ('hpr_baseline_steps', 'hpr_baseline_steps_locked'),
    ('hpr_baseline_steps', 'hpr_baseline_steps_no_truncate'),
    ('hpr_equipment', 'hpr_equipment_guard'),
    ('hpr_equipment', 'hpr_equipment_append_only'),
    ('hpr_equipment', 'hpr_equipment_no_truncate'),
    ('hpr_inspections', 'hpr_inspections_guard'),
    ('hpr_inspections', 'hpr_inspections_append_only'),
    ('hpr_inspections', 'hpr_inspections_no_truncate'),
    ('hpr_evidence_submissions', 'hpr_evidence_guard'),
    ('hpr_evidence_submissions', 'hpr_evidence_append_only'),
    ('hpr_evidence_submissions', 'hpr_evidence_no_truncate'),
    ('hpr_evidence_storage_objects', 'hpr_storage_objects_append_only'),
    ('hpr_evidence_storage_objects', 'hpr_storage_objects_no_truncate')
)
select e.tbl, e.trg, t.tgenabled
from expected e
left join pg_trigger t
  on t.tgname = e.trg and t.tgrelid = ('public.' || e.tbl)::regclass and not t.tgisinternal
where t.oid is null or t.tgenabled <> 'O';

-- ============================================================================
-- 7. PHOTO EVIDENCE STILL STORAGE_PENDING (informational, not a failure)
-- ============================================================================

select count(*) as storage_pending_photos
from public.hpr_evidence_current
where storage_state = 'STORAGE_PENDING';
