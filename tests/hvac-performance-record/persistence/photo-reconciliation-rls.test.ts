/**
 * Executes the #704 migration + the increment-2 photo/reconciliation
 * migration in real Postgres (PGlite, with a minimal storage.* model) and
 * attacks the upload-attempt, declaration, storage and reconciliation
 * boundaries as anon / authenticated / service_role.
 *
 * The Storage API itself is modeled here only as direct inserts into
 * storage.objects by service_role (as the Storage server does). Real Storage
 * behavior is exercised in ../local-supabase/photo-upload-local-supabase.test.ts.
 */
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {PRODUCTION_ADMISSION_OPERATIONAL} from '../../../apps/web/lib/hvac-performance-record/production-admission';
import {SupabaseSim, type Actor} from './supabase-pglite-harness';

const TECH_A = '00000000-0000-4000-8000-0000000000a1';
const TECH_B = '00000000-0000-4000-8000-0000000000b1';
const SUSPENDED = '00000000-0000-4000-8000-0000000000c1';
const UNENROLLED = '00000000-0000-4000-8000-0000000000d1';
const A: Actor = {role: 'authenticated', sub: TECH_A};
const B: Actor = {role: 'authenticated', sub: TECH_B};
const anon: Actor = {role: 'anon'};
const service: Actor = {role: 'service_role'};
const BUCKET = 'hpr-field-evidence-private';
const SHA = 'ab'.repeat(32);
const DENIED = /permission denied/;
const APPEND_ONLY = /HPR_APPEND_ONLY/;

let sim: SupabaseSim;
let n = 0;

async function photo(actor: Actor, extra: {clientSha?: string; kind?: string} = {}) {
  const [eq] = await sim.as<{id: string}>(actor,
    `insert into public.hpr_equipment (manufacturer, model, serial_number, equipment_type)
     values ('Carrier', '24ACC6', $1, 'SPLIT_AC') returning id`, ['SN-P' + ++n]);
  const [insp] = await sim.as<{id: string}>(actor,
    `insert into public.hpr_inspections (equipment_id, concern, operating_mode_as_found)
     values ($1, 'Warm air', 'COOLING') returning id`, [eq.id]);
  const kind = extra.kind ?? 'PHOTO';
  const [sub] = await sim.as<{id: string}>(actor,
    `insert into public.hpr_evidence_submissions
       (inspection_id, step_number, client_record_id, kind, client_captured_at, observation, client_declared_sha256)
     values ($1, 4, $2, $3, now() - interval '1 minute', $4, $5) returning id`,
    [insp.id, 'REC-P' + ++n, kind, kind === 'OBSERVATION' ? 'note' : null, extra.clientSha ?? null]);
  return {inspectionId: insp.id, submissionId: sub.id, path: `${(actor as {sub: string}).sub}/${insp.id}/${sub.id}/original`};
}

type Attempt = {attempt_id: string; object_path: string; technician_user_id: string; client_declared_sha256: string | null};
const open = async (actor: Actor, submissionId: string, nonce = randomUUID()) =>
  (await sim.as<Attempt>(actor, 'select * from public.hpr_open_photo_upload_attempt($1, $2)', [submissionId, nonce]))[0];

/** What the Storage server does on a successful upload: insert the object row as service_role. */
const storeObject = (name: string, size = 4096, mimetype = 'image/jpeg', bucket = BUCKET) =>
  sim.as(service, `insert into storage.objects (bucket_id, name, metadata) values ($1, $2, $3::jsonb)`,
    [bucket, name, JSON.stringify({size, mimetype})]);

const complete = (attemptId: string, sha = SHA, size = 4096, type = 'image/jpeg', actor: Actor = service) =>
  sim.as(actor, 'select * from public.hpr_complete_photo_upload_attempt($1, $2, $3, $4)', [attemptId, sha, size, type]);

const recordFailure = (attemptId: string, outcome = 'REJECTED', reason = 'HPR_PAYLOAD_TOO_LARGE') =>
  sim.as(service, 'select * from public.hpr_record_photo_upload_failure($1, $2, $3, null, null, false)', [attemptId, outcome, reason]);

const reconcile = (submissionId: string, o: {present?: boolean; size?: number | null; sha?: string | null; actor?: Actor} = {}) =>
  sim.as<{result: string; api_role: string; verification_status: string; storage_row_present: boolean}>(o.actor ?? service,
    `select * from public.hpr_record_storage_reconciliation($1, 'reconciler.local', $2, $3, $4, now() - interval '1 second', now())`,
    [submissionId, o.present ?? true, o.size === undefined ? 4096 : o.size, o.sha === undefined ? SHA : o.sha]);

async function declared(actor: Actor = A) {
  const p = await photo(actor);
  const at = await open(actor, p.submissionId);
  await storeObject(at.object_path);
  await complete(at.attempt_id);
  return {...p, attemptId: at.attempt_id};
}

const integrity = async (submissionId: string) =>
  (await sim.as<{photo_integrity_state: string}>(A, 'select photo_integrity_state from public.hpr_evidence_photo_integrity where submission_id = $1', [submissionId]))[0]?.photo_integrity_state;

beforeAll(async () => {
  sim = await SupabaseSim.create({photoIncrement: true});
  for (const id of [TECH_A, TECH_B, SUSPENDED, UNENROLLED]) await sim.createUser(id);
  await sim.enrollTechnician(TECH_A);
  await sim.enrollTechnician(TECH_B);
  await sim.enrollTechnician(SUSPENDED);
}, 60_000);

afterAll(async () => { await sim?.close(); });

describe('private bucket and storage.objects boundary', () => {
  it('creates a private bucket limited to 25 MiB and four image types', async () => {
    const [b] = await sim.admin<{public: boolean; file_size_limit: string; allowed_mime_types: string[]}>(
      'select public, file_size_limit, allowed_mime_types from storage.buckets where id = $1', [BUCKET]);
    expect(b.public).toBe(false);
    expect(Number(b.file_size_limit)).toBe(26214400);
    expect([...b.allowed_mime_types].sort()).toEqual(['image/heic', 'image/jpeg', 'image/png', 'image/webp']);
  });

  it('defines only a SELECT policy for clients on this bucket (no insert/update/delete)', async () => {
    const rows = await sim.admin<{cmd: string; roles: string[]}>(
      `select cmd, roles::text[] as roles from pg_policies where schemaname = 'storage' and tablename = 'objects'
         and (coalesce(qual, '') || coalesce(with_check, '')) like '%hpr-field-evidence-private%'`);
    expect(rows).toEqual([{cmd: 'SELECT', roles: ['authenticated']}]);
  });

  it('denies clients writing objects, even at their own derived path', async () => {
    const p = await photo(A);
    for (const actor of [A, anon]) {
      await expect(sim.as(actor, `insert into storage.objects (bucket_id, name, metadata) values ($1, $2, '{}')`, [BUCKET, p.path]))
        .rejects.toThrow(/row-level security/);
    }
  });

  it('rejects overwrite, move and delete of an original even for service_role', async () => {
    const d = await declared();
    await expect(sim.as(service, `update storage.objects set metadata = '{"size":1}' where name = $1`, [d.path])).rejects.toThrow(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    await expect(sim.as(service, `update storage.objects set name = $2 where name = $1`, [d.path, d.path.replace('original', 'x')])).rejects.toThrow(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    await expect(sim.as(service, `delete from storage.objects where name = $1`, [d.path])).rejects.toThrow(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    await expect(sim.as(service, `insert into storage.objects (bucket_id, name, metadata) values ($1, $2, '{}')
      on conflict (bucket_id, name) do update set metadata = excluded.metadata`, [BUCKET, d.path])).rejects.toThrow(/HPR_PHOTO_OBJECT_IMMUTABLE/);
  });

  it('rejects objects moved into the bucket and non-derived paths (path tampering)', async () => {
    await sim.admin(`insert into storage.buckets (id, name) values ('other', 'other') on conflict do nothing`);
    await sim.as(service, `insert into storage.objects (bucket_id, name, metadata) values ('other', 'a/b.jpg', '{}')`);
    await expect(sim.as(service, `update storage.objects set bucket_id = $1, name = $2 where bucket_id = 'other' and name = 'a/b.jpg'`,
      [BUCKET, `${TECH_A}/${randomUUID()}/${randomUUID()}/original`])).rejects.toThrow(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    for (const bad of ['x.jpg', `${TECH_A}/../${randomUUID()}/${randomUUID()}/original`, `${TECH_A}/${randomUUID()}/${randomUUID()}/original.jpg`,
      `quarantine/${TECH_A}/${randomUUID()}/${randomUUID()}/original`, `${TECH_A.toUpperCase()}/${randomUUID()}/${randomUUID()}/original`]) {
      await expect(storeObject(bad), bad).rejects.toThrow(/HPR_PHOTO_PATH_REJECTED/);
    }
    // Other buckets are unaffected by the guard.
    await sim.as(service, `delete from storage.objects where bucket_id = 'other'`);
  });

  it('lets a technician read only their own declared original; not orphans or other technicians', async () => {
    const d = await declared(A);
    const own = await sim.as(A, 'select name from storage.objects where bucket_id = $1 and name = $2', [BUCKET, d.path]);
    expect(own).toHaveLength(1);
    expect(await sim.as(B, 'select name from storage.objects where name = $1', [d.path])).toEqual([]);
    expect(await sim.as(anon, 'select name from storage.objects where name = $1', [d.path])).toEqual([]);
    const orphan = await photo(A);
    await storeObject(orphan.path);
    expect(await sim.as(A, 'select name from storage.objects where name = $1', [orphan.path])).toEqual([]);
  });
});

describe('upload attempts: attribution, authorization, replay and duplicate finalization', () => {
  it('derives attribution and path in the database', async () => {
    const p = await photo(A);
    const at = await open(A, p.submissionId);
    expect(at.technician_user_id).toBe(TECH_A);
    expect(at.object_path).toBe(p.path);
  });

  it('denies anon, service_role, unenrolled and suspended callers', async () => {
    const p = await photo(A);
    await expect(open(anon, p.submissionId)).rejects.toThrow(DENIED);
    await expect(open(service, p.submissionId)).rejects.toThrow(DENIED);
    await expect(open({role: 'authenticated', sub: UNENROLLED}, p.submissionId)).rejects.toThrow(/HPR_TECHNICIAN_NOT_AUTHORIZED/);
    const s = await photo({role: 'authenticated', sub: SUSPENDED});
    await sim.as(service, `update public.hpr_technicians set status = 'suspended', status_changed_at = now() where user_id = $1`, [SUSPENDED]);
    await expect(open({role: 'authenticated', sub: SUSPENDED}, s.submissionId)).rejects.toThrow(/HPR_TECHNICIAN_NOT_AUTHORIZED/);
  });

  it('gives the same answer for another technician\'s submission and a nonexistent one (no oracle)', async () => {
    const p = await photo(A);
    await expect(open(B, p.submissionId)).rejects.toThrow(/HPR_SUBMISSION_NOT_ACCESSIBLE/);
    await expect(open(B, randomUUID())).rejects.toThrow(/HPR_SUBMISSION_NOT_ACCESSIBLE/);
  });

  it('rejects non-PHOTO and superseded submissions', async () => {
    const o = await photo(A, {kind: 'OBSERVATION'});
    await expect(open(A, o.submissionId)).rejects.toThrow(/HPR_STORAGE_KIND_MISMATCH/);
    const p = await photo(A);
    await sim.as(A, `insert into public.hpr_evidence_submissions
      (inspection_id, step_number, client_record_id, kind, client_captured_at, supersedes_submission_id, correction_reason)
      values ($1, 4, $2, 'PHOTO', now(), $3, 'UPLOAD_FAILED')`, [p.inspectionId, 'REC-S' + ++n, p.submissionId]);
    await expect(open(A, p.submissionId)).rejects.toThrow(/HPR_SUBMISSION_SUPERSEDED/);
  });

  it('rejects a replayed nonce, even after the first attempt failed', async () => {
    const p = await photo(A);
    const nonce = randomUUID();
    const first = await open(A, p.submissionId, nonce);
    await recordFailure(first.attempt_id);
    await expect(open(A, p.submissionId, nonce)).rejects.toThrow(/HPR_UPLOAD_REPLAY/);
  });

  it('allows one open attempt at a time; a recorded failure or an expired lease releases it', async () => {
    const p = await photo(A);
    const first = await open(A, p.submissionId);
    await expect(open(A, p.submissionId)).rejects.toThrow(/HPR_UPLOAD_IN_PROGRESS/);
    await recordFailure(first.attempt_id, 'FAILED', 'HPR_STORAGE_WRITE_FAILED');
    await open(A, p.submissionId);
    const q = await photo(A);
    await sim.admin(`insert into public.hpr_photo_upload_attempts (submission_id, technician_user_id, request_nonce, object_path, opened_at, lease_expires_at)
      values ($1, $2, $3, $4, now() - interval '1 hour', now() - interval '45 minutes')`, [q.submissionId, TECH_A, randomUUID(), q.path]);
    await open(A, q.submissionId);
  });

  it('rejects a new attempt once declared, and refuses to adopt an orphan object at the path', async () => {
    const d = await declared();
    await expect(open(A, d.submissionId)).rejects.toThrow(/HPR_ALREADY_DECLARED/);
    const p = await photo(A);
    await storeObject(p.path);
    await expect(open(A, p.submissionId)).rejects.toThrow(/HPR_OBJECT_ORPHANED/);
  });
});

describe('declaration through a completed attempt', () => {
  it('declares UNRECONCILED, records a DECLARED outcome, and keeps the #704 boundary', async () => {
    const d = await declared();
    const [decl] = await sim.as<{reconciliation_status: string; object_path: string}>(A,
      'select reconciliation_status, object_path from public.hpr_evidence_storage_objects where submission_id = $1', [d.submissionId]);
    expect(decl).toEqual({reconciliation_status: 'UNRECONCILED', object_path: d.path});
    const [out] = await sim.as<{outcome: string}>(A, 'select outcome from public.hpr_photo_upload_outcomes where attempt_id = $1', [d.attemptId]);
    expect(out.outcome).toBe('DECLARED');
    const [cur] = await sim.as<{storage_state: string; verification_status: string}>(A,
      'select storage_state, verification_status from public.hpr_evidence_current where id = $1', [d.submissionId]);
    expect(cur).toEqual({storage_state: 'DECLARED_UNRECONCILED', verification_status: 'UNVERIFIED'});
    expect(await integrity(d.submissionId)).toBe('DECLARED_UNRECONCILED');
    const [insp] = await sim.as<{ddd_status: string; intervention_authorization: string}>(A,
      'select ddd_status, intervention_authorization from public.hpr_inspections where id = $1', [d.inspectionId]);
    expect(insp).toEqual({ddd_status: 'LOCKED', intervention_authorization: 'NONE'});
  });

  it('fails closed on absent object, size, MIME and client digest mismatch', async () => {
    const p = await photo(A, {clientSha: 'cd'.repeat(32)});
    const at = await open(A, p.submissionId);
    expect(at.client_declared_sha256).toBe('cd'.repeat(32));
    await expect(complete(at.attempt_id, 'cd'.repeat(32))).rejects.toThrow(/HPR_OBJECT_ABSENT/);
    await storeObject(at.object_path, 4096, 'image/jpeg');
    await expect(complete(at.attempt_id, SHA)).rejects.toThrow(/HPR_CLIENT_DIGEST_MISMATCH/);
    await expect(complete(at.attempt_id, 'cd'.repeat(32), 4095)).rejects.toThrow(/HPR_OBJECT_SIZE_MISMATCH/);
    await expect(complete(at.attempt_id, 'cd'.repeat(32), 4096, 'image/png')).rejects.toThrow(/HPR_OBJECT_MIME_MISMATCH/);
    await expect(complete(at.attempt_id, 'not-hex')).rejects.toThrow(/HPR_SERVER_DIGEST_INVALID/);
    expect(await integrity(p.submissionId)).toBe('STORAGE_PENDING');
  });

  it('rejects a second finalization of the same attempt and finalization after the lease', async () => {
    const d = await declared();
    await expect(complete(d.attemptId)).rejects.toThrow(/HPR_UPLOAD_ALREADY_FINALIZED/);
    await expect(recordFailure(d.attemptId)).rejects.toThrow(/HPR_UPLOAD_ALREADY_FINALIZED/);
    const q = await photo(A);
    const [stale] = await sim.admin<{id: string}>(`insert into public.hpr_photo_upload_attempts
      (submission_id, technician_user_id, request_nonce, object_path, opened_at, lease_expires_at)
      values ($1, $2, $3, $4, now() - interval '1 hour', now() - interval '45 minutes') returning id`, [q.submissionId, TECH_A, randomUUID(), q.path]);
    await storeObject(q.path);
    await expect(complete(stale.id)).rejects.toThrow(/HPR_UPLOAD_LEASE_EXPIRED/);
  });

  it('allows declaration only by service_role through the attempt path', async () => {
    const p = await photo(A);
    const at = await open(A, p.submissionId);
    await storeObject(at.object_path);
    await expect(complete(at.attempt_id, SHA, 4096, 'image/jpeg', A)).rejects.toThrow(DENIED);
    await expect(complete(at.attempt_id, SHA, 4096, 'image/jpeg', anon)).rejects.toThrow(DENIED);
    // The #704 direct declaration function is no longer callable by service_role.
    await expect(sim.as(service, `select public.hpr_declare_evidence_storage_object($1, $2, 1, 'image/jpeg')`, [p.submissionId, SHA]))
      .rejects.toThrow(DENIED);
    await expect(recordFailure(at.attempt_id, 'DECLARED', 'HPR_DECLARED')).rejects.toThrow(/HPR_OUTCOME_INVALID/);
  });
});

describe('reconciliation evidence', () => {
  it('records MATCH with database-computed result and request role; still UNVERIFIED', async () => {
    const d = await declared();
    const [r] = await reconcile(d.submissionId);
    expect(r).toMatchObject({result: 'MATCH', api_role: 'service_role', verification_status: 'UNVERIFIED', storage_row_present: true});
    expect(await integrity(d.submissionId)).toBe('RECONCILED_MATCH');
  });

  it('detects digest and size mismatch and makes failure sticky', async () => {
    const d = await declared();
    expect((await reconcile(d.submissionId, {sha: 'ef'.repeat(32)}))[0].result).toBe('DIGEST_MISMATCH');
    expect((await reconcile(d.submissionId, {size: 4097}))[0].result).toBe('SIZE_MISMATCH');
    expect((await reconcile(d.submissionId))[0].result).toBe('MATCH');
    expect(await integrity(d.submissionId)).toBe('RECONCILIATION_FAILED');
  });

  it('records OBJECT_ABSENT when either the reconciler or the database sees no object', async () => {
    const d = await declared();
    expect((await reconcile(d.submissionId, {present: false, size: null, sha: null}))[0].result).toBe('OBJECT_ABSENT');
    const e = await declared();
    // Privileged-owner tampering (outside the controlled roles): metadata row removed.
    await sim.admin('alter table storage.objects disable trigger hpr_private_photo_object_guard');
    await sim.admin('delete from storage.objects where name = $1', [e.path]);
    await sim.admin('alter table storage.objects enable trigger hpr_private_photo_object_guard');
    const [r] = await reconcile(e.submissionId);
    expect(r).toMatchObject({result: 'OBJECT_ABSENT', storage_row_present: false});
  });

  it('records READ_FAILED as inconclusive (never MATCH); a later MATCH restores, a failure stays sticky', async () => {
    const d = await declared();
    const [r] = await sim.as<{result: string; read_error_code: string}>(service,
      `select * from public.hpr_record_storage_reconciliation($1, 'reconciler.local', false, null, null, now() - interval '1 second', now(), 'STORAGE_HTTP_500')`, [d.submissionId]);
    expect(r).toMatchObject({result: 'READ_FAILED', read_error_code: 'STORAGE_HTTP_500'});
    expect(await integrity(d.submissionId)).toBe('RECONCILIATION_INCONCLUSIVE');
    await reconcile(d.submissionId);
    expect(await integrity(d.submissionId)).toBe('RECONCILED_MATCH');
    await expect(sim.as(service,
      `select public.hpr_record_storage_reconciliation($1, 'reconciler.local', true, 4096, $2, now() - interval '1 second', now(), 'STORAGE_HTTP_500')`, [d.submissionId, SHA]))
      .rejects.toThrow(/HPR_RECONCILIATION_SHAPE_INVALID/);
  });

  it('cannot be written by technicians, reconciles only declared originals, and validates timing', async () => {
    const d = await declared();
    await expect(reconcile(d.submissionId, {actor: A})).rejects.toThrow(DENIED);
    const p = await photo(A);
    await expect(reconcile(p.submissionId)).rejects.toThrow(/HPR_DECLARATION_NOT_FOUND/);
    await expect(sim.as(service, `select public.hpr_record_storage_reconciliation($1, 'r', true, 4096, $2, now(), now() - interval '1 minute')`,
      [d.submissionId, SHA])).rejects.toThrow(/HPR_RECONCILIATION_TIMING_INVALID/);
    await expect(sim.as(service, `select public.hpr_record_storage_reconciliation($1, 'Bad Id!', true, 4096, $2, now() - interval '1 second', now())`,
      [d.submissionId, SHA])).rejects.toThrow(/check constraint/);
  });

  it('is visible to the owning technician only', async () => {
    const d = await declared();
    await reconcile(d.submissionId);
    expect(await sim.as(A, 'select id from public.hpr_evidence_storage_reconciliations where submission_id = $1', [d.submissionId])).toHaveLength(1);
    expect(await sim.as(B, 'select id from public.hpr_evidence_storage_reconciliations where submission_id = $1', [d.submissionId])).toEqual([]);
    expect(await sim.as(B, 'select submission_id from public.hpr_evidence_photo_integrity where submission_id = $1', [d.submissionId])).toEqual([]);
    expect(await sim.as(B, 'select id from public.hpr_photo_upload_attempts where submission_id = $1', [d.submissionId])).toEqual([]);
  });

  it('defines no verified, complete or admissible integrity state', async () => {
    const [v] = await sim.admin<{def: string}>(`select pg_get_viewdef('public.hpr_evidence_photo_integrity'::regclass) as def`);
    expect(v.def).not.toMatch(/'(VERIFIED|COMPLETE|ADMISSIBLE|ADMITTED)'/);
    expect(PRODUCTION_ADMISSION_OPERATIONAL).toBe(false);
  });
});

describe('orphans: logical quarantine, never deleted', () => {
  it('lists and records undeclared objects once; technicians cannot see orphan records', async () => {
    const p = await photo(A);
    const at = await open(A, p.submissionId);
    await storeObject(at.object_path);
    await recordFailure(at.attempt_id, 'FAILED', 'HPR_DECLARATION_FAILED_OBJECT_ORPHANED');
    const listed = await sim.as<{object_path: string}>(service, 'select * from public.hpr_list_storage_orphans()');
    expect(listed.map(r => r.object_path)).toContain(p.path);
    const [rec] = await sim.as<{disposition: string; last_attempt_id: string; api_role: string}>(service,
      `select * from public.hpr_record_storage_orphan($1, 'orphan.detector')`, [p.path]);
    expect(rec).toMatchObject({disposition: 'QUARANTINED_RETAINED', last_attempt_id: at.attempt_id, api_role: 'service_role'});
    await expect(sim.as(service, `select public.hpr_record_storage_orphan($1, 'orphan.detector')`, [p.path])).rejects.toThrow(/HPR_ORPHAN_ALREADY_RECORDED/);
    const after = await sim.as<{object_path: string}>(service, 'select * from public.hpr_list_storage_orphans()');
    expect(after.map(r => r.object_path)).not.toContain(p.path);
    await expect(sim.as(A, 'select * from public.hpr_storage_orphan_records')).rejects.toThrow(DENIED);
    await expect(sim.as(A, 'select * from public.hpr_list_storage_orphans()')).rejects.toThrow(DENIED);
    // The object is still there.
    expect(await sim.admin('select 1 from storage.objects where name = $1', [p.path])).toHaveLength(1);
    const d = await declared();
    await expect(sim.as(service, `select public.hpr_record_storage_orphan($1, 'orphan.detector')`, [d.path])).rejects.toThrow(/HPR_NOT_ORPHAN/);
  });
});

describe('append-only and privilege matrix (increment 2 objects)', () => {
  const TABLES = ['hpr_photo_upload_attempts', 'hpr_photo_upload_outcomes', 'hpr_evidence_storage_reconciliations', 'hpr_storage_orphan_records'];

  it('rejects UPDATE / DELETE / TRUNCATE on every new table for every API role', async () => {
    const d = await declared();
    await reconcile(d.submissionId);
    for (const t of TABLES) {
      for (const actor of [A, service, anon]) {
        const col = t === 'hpr_photo_upload_outcomes' ? 'reason_code' : 'id';
        await expect(sim.as(actor, `update public.${t} set ${col} = ${col}`), `${t} update`).rejects.toThrow(DENIED);
        await expect(sim.as(actor, `delete from public.${t}`), `${t} delete`).rejects.toThrow(DENIED);
        await expect(sim.as(actor, `truncate public.${t}`), `${t} truncate`).rejects.toThrow(DENIED);
      }
      // Even the owner is stopped by the triggers while they are in place.
      await expect(sim.admin(`delete from public.${t}`)).rejects.toThrow(APPEND_ONLY);
    }
  });

  it('grants no direct INSERT on the new tables to any API role', async () => {
    const rows = await sim.admin<{table_name: string; grantee: string; privilege_type: string}>(
      `select table_name, grantee, privilege_type from information_schema.role_table_grants
       where table_schema = 'public' and table_name = any($1) and grantee in ('anon', 'authenticated', 'service_role', 'PUBLIC')
       order by 1, 2, 3`, [[...TABLES, 'hpr_evidence_photo_integrity']]);
    expect(rows.filter(r => r.privilege_type !== 'SELECT')).toEqual([]);
    expect(rows.map(r => `${r.table_name}:${r.grantee}`)).toEqual([
      'hpr_evidence_photo_integrity:authenticated', 'hpr_evidence_photo_integrity:service_role',
      'hpr_evidence_storage_reconciliations:authenticated', 'hpr_evidence_storage_reconciliations:service_role',
      'hpr_photo_upload_attempts:authenticated', 'hpr_photo_upload_attempts:service_role',
      'hpr_photo_upload_outcomes:authenticated', 'hpr_photo_upload_outcomes:service_role',
      'hpr_storage_orphan_records:service_role',
    ]);
  });

  it('has the exact EXECUTE matrix for every hpr_* function in both increments', async () => {
    const rows = await sim.admin<{fn: string; grantees: string}>(`
      select p.proname as fn,
             coalesce((select string_agg(r, ',' order by r) from (
               select 'PUBLIC' as r where has_function_privilege('public', p.oid, 'execute') and exists (
                 select 1 from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) a where a.grantee = 0)
               union all select x from unnest(array['anon', 'authenticated', 'service_role']) x
               where has_function_privilege(x, p.oid, 'execute')) s), '') as grantees
      from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace
      where ns.nspname = 'public' and p.proname like 'hpr\\_%' order by 1`);
    expect(Object.fromEntries(rows.map(r => [r.fn, r.grantees]))).toEqual({
      hpr_complete_photo_upload_attempt: 'service_role',
      hpr_declare_evidence_storage_object: '',
      hpr_guard_equipment_insert: '',
      hpr_guard_evidence_insert: '',
      hpr_guard_inspection_insert: '',
      hpr_guard_private_photo_object: '',
      hpr_is_active_technician: 'authenticated',
      hpr_list_storage_orphans: 'service_role',
      hpr_open_photo_upload_attempt: 'authenticated',
      hpr_record_photo_upload_failure: 'service_role',
      hpr_record_storage_orphan: 'service_role',
      hpr_record_storage_reconciliation: 'service_role',
      hpr_reject_mutation: '',
      hpr_request_api_role: '',
      hpr_require_active_technician: '',
    });
  });

  it('the increment-2 verification SQL and #704 sections 2-7 report no findings', async () => {
    const read = (f: string) => readFileSync(fileURLToPath(new URL(`../../../supabase/verification/${f}`, import.meta.url)), 'utf8');
    const inc2 = await sim.db.exec(read('verify_hpr_photo_reconciliation_privileges.sql'));
    expect(inc2).toHaveLength(7);
    inc2.slice(0, 6).forEach((r, i) => expect(r.rows, 'increment-2 section ' + (i + 1)).toEqual([]));
    expect(inc2[6].rows).toHaveLength(1);
    const base = read('verify_hpr_field_evidence_privileges.sql');
    const fromSection2 = base.slice(base.search(/^-- 2\. /m));
    const r704 = await sim.db.exec(fromSection2);
    expect(r704).toHaveLength(6);
    r704.slice(0, 5).forEach((r, i) => expect(r.rows, '#704 section ' + (i + 2)).toEqual([]));
  });

  it('pins search_path on every SECURITY DEFINER hpr_* function', async () => {
    const rows = await sim.admin<{proname: string}>(`
      select p.proname from pg_proc p join pg_namespace ns on ns.oid = p.pronamespace
      where ns.nspname = 'public' and p.proname like 'hpr\\_%' and p.prosecdef
        and not coalesce(p.proconfig @> array['search_path=""'], false)`);
    expect(rows).toEqual([]);
  });
});
