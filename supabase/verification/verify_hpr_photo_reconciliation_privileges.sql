-- TA-14 HPR increment 2 — private photo storage / reconciliation verification
--
-- READ ONLY. Run on an isolated local stack (or a future preview project)
-- after BOTH:
--
--   20261116200000_hpr_field_evidence_foundation.sql        (#704)
--   20261122120000_hpr_private_photo_reconciliation.sql     (increment 2)
--
-- Every query returns ZERO ROWS when the database matches the reviewed
-- design; any row is a finding. Section 1 here SUPERSEDES section 1 of
-- verify_hpr_field_evidence_privileges.sql (increment 2 adds functions and
-- revokes service_role from hpr_declare_evidence_storage_object). Sections
-- 2-6 of that file still apply unchanged and are run alongside this one by
-- scripts/hpr/local-supabase-verify.sh. Compare with
-- tests/hvac-performance-record/persistence/photo-reconciliation-rls.test.ts.

-- ============================================================================
-- 1. COMBINED FUNCTION EXECUTE MATRIX (every hpr_* function, PUBLIC included)
-- ============================================================================

with expected(fn, role_name) as (
  values
    ('hpr_is_active_technician', 'authenticated'),
    ('hpr_open_photo_upload_attempt', 'authenticated'),
    ('hpr_complete_photo_upload_attempt', 'service_role'),
    ('hpr_record_photo_upload_failure', 'service_role'),
    ('hpr_record_storage_reconciliation', 'service_role'),
    ('hpr_list_storage_orphans', 'service_role'),
    ('hpr_record_storage_orphan', 'service_role')
),
actual as (
  select p.proname as fn, r.role_name,
         has_function_privilege(r.role_name, p.oid, 'EXECUTE') as can_execute
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  cross join (values ('anon'), ('authenticated'), ('service_role')) r(role_name)
  where n.nspname = 'public' and p.proname like 'hpr\_%'
)
select 'S1' as section, a.fn, a.role_name, a.can_execute::text as detail
from actual a
left join expected e on e.fn = a.fn and e.role_name = a.role_name
where a.can_execute is distinct from (e.fn is not null)
union all
select 'S1', p.proname, 'PUBLIC', 'true'
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
where n.nspname = 'public' and p.proname like 'hpr\_%'
  and acl.grantee = 0 and acl.privilege_type = 'EXECUTE';

-- ============================================================================
-- 2. PRIVATE BUCKET SETTINGS
-- ============================================================================

select 'S2' as section, 'hpr-field-evidence-private' as bucket, 'missing' as detail
where not exists (select 1 from storage.buckets where id = 'hpr-field-evidence-private')
union all
select 'S2', b.id, 'public=' || b.public || ' limit=' || coalesce(b.file_size_limit::text, 'null')
  || ' mime=' || coalesce(array_to_string(b.allowed_mime_types, ','), 'null')
from storage.buckets b
where b.id = 'hpr-field-evidence-private'
  and (b.public is distinct from false
       or b.file_size_limit is distinct from 26214400
       or b.allowed_mime_types is null
       or not (b.allowed_mime_types <@ array['image/jpeg', 'image/png', 'image/heic', 'image/webp']::text[]
               and b.allowed_mime_types @> array['image/jpeg', 'image/png', 'image/heic', 'image/webp']::text[]));

-- ============================================================================
-- 3. storage.objects POLICIES
--    a) policies naming this bucket: only the reviewed SELECT for authenticated;
--    b) client-role write policies (INSERT/UPDATE/DELETE/ALL) that do not pin
--       bucket_id to a literal: they could admit writes into this bucket.
--       (Evaluate any hit; in a full-history database other buckets' policies
--       are listed here only if they are not bucket-scoped.)
-- ============================================================================

select 'S3a' as section, p.policyname, p.cmd, array_to_string(p.roles, ',') as detail
from pg_policies p
where p.schemaname = 'storage' and p.tablename = 'objects'
  and (coalesce(p.qual, '') || coalesce(p.with_check, '')) like '%hpr-field-evidence-private%'
  and not (p.cmd = 'SELECT' and p.roles = array['authenticated']::name[]
           and p.policyname = 'HPR technicians read their own declared photo originals')
union all
select 'S3b', p.policyname, p.cmd, array_to_string(p.roles, ',')
from pg_policies p
where p.schemaname = 'storage' and p.tablename = 'objects'
  and p.permissive = 'PERMISSIVE'
  and p.cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
  and p.roles && array['public', 'anon', 'authenticated']::name[]
  and (coalesce(p.qual, '') || ' ' || coalesce(p.with_check, '')) !~ 'bucket_id\s*=\s*''[^'']+''';

-- ============================================================================
-- 4. BUCKET GUARD TRIGGER on storage.objects (present and enabled)
-- ============================================================================

select 'S4' as section, 'hpr_private_photo_object_guard' as trigger_name, coalesce(t.tgenabled::text, 'missing') as detail
from (select 1) x
left join pg_trigger t
  on t.tgname = 'hpr_private_photo_object_guard' and t.tgrelid = 'storage.objects'::regclass and not t.tgisinternal
where t.oid is null or t.tgenabled <> 'O';

-- ============================================================================
-- 5. APPEND-ONLY TRIGGERS ON INCREMENT-2 TABLES (present and enabled)
-- ============================================================================

with expected(tbl, trg) as (
  values
    ('hpr_photo_upload_attempts', 'hpr_upload_attempts_append_only'),
    ('hpr_photo_upload_attempts', 'hpr_upload_attempts_no_truncate'),
    ('hpr_photo_upload_outcomes', 'hpr_upload_outcomes_append_only'),
    ('hpr_photo_upload_outcomes', 'hpr_upload_outcomes_no_truncate'),
    ('hpr_evidence_storage_reconciliations', 'hpr_reconciliations_append_only'),
    ('hpr_evidence_storage_reconciliations', 'hpr_reconciliations_no_truncate'),
    ('hpr_storage_orphan_records', 'hpr_orphans_append_only'),
    ('hpr_storage_orphan_records', 'hpr_orphans_no_truncate')
)
select 'S5' as section, e.tbl, e.trg, coalesce(t.tgenabled::text, 'missing') as detail
from expected e
left join pg_trigger t
  on t.tgname = e.trg and t.tgrelid = ('public.' || e.tbl)::regclass and not t.tgisinternal
where t.oid is null or t.tgenabled <> 'O';

-- ============================================================================
-- 6. INCREMENT-2 TABLE / VIEW PRIVILEGES
--    Allowed: SELECT for authenticated + service_role, except orphan records
--    (service_role only). No INSERT/UPDATE/DELETE/TRUNCATE for any API role.
-- ============================================================================

with objects(o) as (
  values ('hpr_photo_upload_attempts'), ('hpr_photo_upload_outcomes'),
         ('hpr_evidence_storage_reconciliations'), ('hpr_storage_orphan_records'),
         ('hpr_evidence_photo_integrity')
),
roles(r) as (values ('anon'), ('authenticated'), ('service_role')),
privs(p) as (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('REFERENCES'), ('TRIGGER'))
select 'S6' as section, r, o, p
from objects, roles, privs
where has_table_privilege(r, 'public.' || o, p)
  and not (p = 'SELECT' and (r = 'service_role' or (r = 'authenticated' and o <> 'hpr_storage_orphan_records')));

-- ============================================================================
-- 7. STATUS COUNTS (informational, not a failure; one row)
-- ============================================================================

select
  (select count(*) from public.hpr_photo_upload_attempts a
    where a.lease_expires_at <= now()
      and not exists (select 1 from public.hpr_photo_upload_outcomes o where o.attempt_id = a.id)) as expired_attempts_without_outcome,
  (select count(*) from public.hpr_list_storage_orphans()) as unrecorded_orphans,
  (select count(*) from public.hpr_evidence_photo_integrity where photo_integrity_state = 'RECONCILIATION_FAILED') as reconciliation_failed,
  (select count(*) from public.hpr_evidence_photo_integrity where photo_integrity_state = 'RECONCILIATION_INCONCLUSIVE') as reconciliation_inconclusive;
