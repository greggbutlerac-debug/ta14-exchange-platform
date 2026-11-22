/**
 * HPR increment 2 against a REAL local Supabase stack: GoTrue (cookie
 * sessions issued by @supabase/ssr), PostgREST, Storage API and PostgreSQL.
 * Calls the actual Next.js route handler (PUT) with real session cookies.
 *
 * Skipped unless scripts/hpr/local-supabase-verify.sh (or an operator) sets
 * HPR_LOCAL_SUPABASE_URL / _ANON_KEY / _SERVICE_ROLE_KEY. Refuses any host
 * other than 127.0.0.1 / localhost. Backend-tampering cases additionally
 * need HPR_LOCAL_STORAGE_CONTAINER (docker exec into the local storage
 * container) and are skipped without it.
 */
import {execFileSync} from 'node:child_process';
import {createHash, createHmac, randomBytes, randomUUID} from 'node:crypto';
import {createServerClient} from '@supabase/ssr';
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import {NextRequest} from 'next/server';
import {beforeAll, describe, expect, it} from 'vitest';
import {authenticateFromCookies} from '../../../apps/web/lib/hvac-performance-record/photo-upload/cookie-session';
import {recordStorageOrphans, reconcileDeclaredPhoto} from '../../../apps/web/lib/hvac-performance-record/photo-upload/reconcile';
import {HPR_PRIVATE_BUCKET, servicePort} from '../../../apps/web/lib/hvac-performance-record/photo-upload/supabase-ports';
import {handlePhotoUpload} from '../../../apps/web/lib/hvac-performance-record/photo-upload/upload-handler';
import {jpeg, png, streamOf, webp} from '../photo-upload/fixtures';
import {isLocalSupabaseUrl} from './local-supabase-guard';

const RAW_URL = process.env.HPR_LOCAL_SUPABASE_URL ?? '';
const ANON_KEY = process.env.HPR_LOCAL_SUPABASE_ANON_KEY ?? '';
const SERVICE_KEY = process.env.HPR_LOCAL_SUPABASE_SERVICE_ROLE_KEY ?? '';
const STORAGE_CONTAINER = process.env.HPR_LOCAL_STORAGE_CONTAINER ?? '';
const configured = Boolean(RAW_URL && ANON_KEY && SERVICE_KEY);
if (configured && !isLocalSupabaseUrl(RAW_URL)) throw new Error('HPR local Supabase tests refuse non-local URL: ' + RAW_URL);
// apps/web/lib/supabase/env.ts accepts plain http only for "localhost".
const URL_ENV = RAW_URL.replace('127.0.0.1', 'localhost');

const SUITE_TITLE = configured
  ? 'HPR private photo upload + reconciliation on local Supabase (GoTrue + PostgREST + Storage)'
  : 'NOT EXECUTED — local Supabase stack unavailable (run scripts/hpr/local-supabase-verify.sh); skipped integration coverage is not verification';
if (!configured && process.env.CI) {
  console.warn('[hpr] local Supabase photo-upload suite NOT EXECUTED in this run: skipped, not passed.');
}

const sha = (b: Uint8Array) => createHash('sha256').update(b).digest('hex');
const noSession = {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}};

type Principal = {id: string; cookie: string; cookies: Array<{name: string; value: string}>; db: SupabaseClient};

describe.skipIf(!configured)(SUITE_TITLE, () => {
  let service: SupabaseClient;
  let A: Principal;
  let B: Principal;
  let U: Principal; // authenticated, never enrolled
  let S: Principal; // enrolled, then suspended
  let PUT: (req: NextRequest, ctx: {params: Promise<{submissionId: string}>}) => Promise<Response>;
  let n = 0;

  async function principal(): Promise<Principal> {
    const email = `hpr2-${randomUUID()}@example.test`;
    const password = randomBytes(18).toString('base64url');
    const created = await service.auth.admin.createUser({email, password, email_confirm: true});
    if (created.error) throw created.error;
    // A real @supabase/ssr session: the cookies the app itself would set.
    const jar = new Map<string, string>();
    const ssr = createServerClient(URL_ENV, ANON_KEY, {cookies: {
      getAll: () => [...jar].map(([name, value]) => ({name, value})),
      setAll: list => { for (const c of list) { if (c.value) jar.set(c.name, c.value); else jar.delete(c.name); } },
    }});
    const signedIn = await ssr.auth.signInWithPassword({email, password});
    if (signedIn.error || !signedIn.data.session) throw signedIn.error ?? new Error('no session');
    const cookies = [...jar].map(([name, value]) => ({name, value}));
    return {
      id: created.data.user.id,
      cookies,
      cookie: cookies.map(c => `${c.name}=${c.value}`).join('; '),
      db: createClient(URL_ENV, ANON_KEY, {...noSession, global: {headers: {Authorization: `Bearer ${signedIn.data.session.access_token}`}}}),
    };
  }

  async function photoSubmission(p: Principal, clientSha: string | null = null) {
    const e = await p.db.from('hpr_equipment').insert({manufacturer: 'Carrier', model: '24ACC6', serial_number: 'SN2-' + ++n, equipment_type: 'SPLIT_AC'}).select('id').single();
    if (e.error) throw e.error;
    const i = await p.db.from('hpr_inspections').insert({equipment_id: e.data.id, concern: 'Warm air', operating_mode_as_found: 'COOLING'}).select('id').single();
    if (i.error) throw i.error;
    const s = await p.db.from('hpr_evidence_submissions').insert({
      inspection_id: i.data.id, step_number: 4, client_record_id: 'P2-' + ++n, kind: 'PHOTO',
      client_captured_at: new Date(Date.now() - 60_000).toISOString(), client_declared_sha256: clientSha,
    }).select('id').single();
    if (s.error) throw s.error;
    return {inspectionId: i.data.id as string, submissionId: s.data.id as string, path: `${p.id}/${i.data.id}/${s.data.id}/original`};
  }

  function request(submissionId: string, body: Uint8Array | ReadableStream<Uint8Array> | null, o: {cookie?: string; type?: string; nonce?: string; headers?: Record<string, string>} = {}) {
    const headers: Record<string, string> = {'content-type': o.type ?? 'image/jpeg', 'x-hpr-upload-nonce': o.nonce ?? randomUUID(), ...(o.headers ?? {})};
    if (o.cookie) headers.cookie = o.cookie;
    if (body instanceof Uint8Array) headers['content-length'] = String(body.length);
    return new NextRequest(`http://localhost:3000/api/hpr/evidence/${submissionId}/photo`, {
      method: 'PUT', headers, body: body as BodyInit | null, duplex: 'half',
    } as RequestInit & {duplex: 'half'});
  }

  const put = (submissionId: string, body: Uint8Array | ReadableStream<Uint8Array> | null, o: Parameters<typeof request>[2] = {}) =>
    PUT(request(submissionId, body, o), {params: Promise.resolve({submissionId})});

  async function objectSha(path: string): Promise<string | null> {
    const d = await service.storage.from(HPR_PRIVATE_BUCKET).download(path);
    return d.error ? null : sha(new Uint8Array(await d.data.arrayBuffer()));
  }

  const outcomes = async (p: Principal, submissionId: string) => {
    const r = await p.db.from('hpr_photo_upload_attempts').select('id, hpr_photo_upload_outcomes(outcome, reason_code, object_may_exist)').eq('submission_id', submissionId).order('opened_at');
    if (r.error) throw r.error;
    return (r.data as unknown as Array<{hpr_photo_upload_outcomes: {outcome: string; reason_code: string; object_may_exist: boolean} | null}>)
      .map(a => a.hpr_photo_upload_outcomes);
  };

  const integrity = async (p: Principal, submissionId: string) =>
    (await p.db.from('hpr_evidence_photo_integrity').select('photo_integrity_state').eq('submission_id', submissionId).single()).data?.photo_integrity_state;

  beforeAll(async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = URL_ENV;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    process.env.HPR_PHOTO_UPLOAD_ENABLED = 'true';
    ({PUT} = await import('../../../apps/web/app/api/hpr/evidence/[submissionId]/photo/route'));
    service = createClient(URL_ENV, SERVICE_KEY, noSession);
    [A, B, U, S] = [await principal(), await principal(), await principal(), await principal()];
    const enrolled = await service.from('hpr_technicians').insert([{user_id: A.id}, {user_id: B.id}, {user_id: S.id}]);
    if (enrolled.error) throw enrolled.error;
  }, 60_000);

  it('uploads through the real route: server digest, derived path, UNRECONCILED, boundary intact', async () => {
    const p = await photoSubmission(A);
    const bytes = jpeg(64 * 1024);
    const res = await put(p.submissionId, bytes, {cookie: A.cookie, headers: {'x-technician-id': B.id, 'x-object-path': `${B.id}/x/y/original`}});
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
      object_path: p.path, server_declared_sha256: sha(bytes), declared_byte_size: bytes.length, declared_content_type: 'image/jpeg',
      reconciliation_status: 'UNRECONCILED', verification_status: 'UNVERIFIED', ddd_status: 'LOCKED', intervention_authorization: 'NONE',
    });
    expect(await objectSha(p.path)).toBe(sha(bytes));
    const decl = await A.db.from('hpr_evidence_storage_objects').select('server_declared_sha256, reconciliation_status').eq('submission_id', p.submissionId).single();
    expect(decl.data).toEqual({server_declared_sha256: sha(bytes), reconciliation_status: 'UNRECONCILED'});
    expect(await outcomes(A, p.submissionId)).toEqual([{outcome: 'DECLARED', reason_code: 'HPR_DECLARED', object_may_exist: true}]);
    expect(await integrity(A, p.submissionId)).toBe('DECLARED_UNRECONCILED');
    // The owner can read the original back through Storage RLS; nobody else can.
    const own = await A.db.storage.from(HPR_PRIVATE_BUCKET).download(p.path);
    expect(own.error).toBeNull();
    expect(sha(new Uint8Array(await own.data!.arrayBuffer()))).toBe(sha(bytes));
    expect((await B.db.storage.from(HPR_PRIVATE_BUCKET).download(p.path)).error).not.toBeNull();
    expect((await createClient(URL_ENV, ANON_KEY, noSession).storage.from(HPR_PRIVATE_BUCKET).download(p.path)).error).not.toBeNull();
  });

  it('reconciles by re-reading and re-hashing the stored bytes (MATCH is still UNVERIFIED)', async () => {
    const p = await photoSubmission(A);
    expect((await put(p.submissionId, png(8192), {cookie: A.cookie, type: 'image/png'})).status).toBe(201);
    const r = await reconcileDeclaredPhoto(service, p.submissionId, 'reconciler.local-test');
    expect(r).toMatchObject({result: 'MATCH', observed_sha256: sha(png(8192)), api_role: 'service_role', verification_status: 'UNVERIFIED'});
    expect(await integrity(A, p.submissionId)).toBe('RECONCILED_MATCH');
    const insp = await A.db.from('hpr_inspections').select('ddd_status, intervention_authorization, verification_status').eq('id', p.inspectionId).single();
    expect(insp.data).toEqual({ddd_status: 'LOCKED', intervention_authorization: 'NONE', verification_status: 'UNVERIFIED'});
  });

  it('rejects missing, forged and tampered sessions with 401', async () => {
    const p = await photoSubmission(A);
    expect((await put(p.submissionId, jpeg())).status).toBe(401);
    // A bearer token naming an enrolled technician is ignored (cookies only)...
    const header = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const payload = Buffer.from(JSON.stringify({sub: A.id, role: 'authenticated', aud: 'authenticated', iat: now, exp: now + 600})).toString('base64url');
    const forged = `${header}.${payload}.${createHmac('sha256', randomBytes(32)).update(`${header}.${payload}`).digest('base64url')}`;
    expect((await put(p.submissionId, jpeg(), {headers: {authorization: `Bearer ${forged}`}})).status).toBe(401);
    // ...and a cookie session carrying a JWT signed with a foreign key is rejected by GoTrue.
    const name = A.cookies[0].name.replace(/\.\d+$/, '');
    const forgedSession = 'base64-' + Buffer.from(JSON.stringify({access_token: forged, refresh_token: 'x', token_type: 'bearer', expires_in: 600, expires_at: now + 600, user: {id: A.id}})).toString('base64url');
    expect((await put(p.submissionId, jpeg(), {cookie: `${name}=${forgedSession}`})).status).toBe(401);
    expect(await objectSha(p.path)).toBeNull();
  });

  it('denies unenrolled and suspended users and other technicians (403), storing nothing', async () => {
    const p = await photoSubmission(A);
    const u = await put(p.submissionId, jpeg(), {cookie: U.cookie});
    expect(u.status).toBe(403);
    expect((await u.json()).error).toBe('HPR_TECHNICIAN_NOT_AUTHORIZED');
    const b = await put(p.submissionId, jpeg(), {cookie: B.cookie});
    expect(b.status).toBe(403);
    expect((await b.json()).error).toBe('HPR_SUBMISSION_NOT_ACCESSIBLE');
    const sp = await photoSubmission(S);
    const susp = await service.from('hpr_technicians').update({status: 'suspended', status_changed_at: new Date().toISOString()}).eq('user_id', S.id);
    expect(susp.error).toBeNull();
    const s = await put(sp.submissionId, jpeg(), {cookie: S.cookie});
    expect(s.status).toBe(403);
    expect((await s.json()).error).toBe('HPR_TECHNICIAN_NOT_AUTHORIZED');
    expect(await objectSha(p.path)).toBeNull();
    expect(await objectSha(sp.path)).toBeNull();
  });

  it('enforces 25 MiB: exact limit accepted, limit + 1 rejected while streaming (no Content-Length)', async () => {
    const atLimit = await photoSubmission(A);
    const big = jpeg(25 * 1024 * 1024);
    expect((await put(atLimit.submissionId, big, {cookie: A.cookie})).status).toBe(201);
    const over = await photoSubmission(A);
    const res = await put(over.submissionId, streamOf(jpeg(25 * 1024 * 1024 + 1), 1024 * 1024), {cookie: A.cookie});
    expect(res.status).toBe(413);
    expect((await res.json()).error).toBe('HPR_PAYLOAD_TOO_LARGE');
    expect(await outcomes(A, over.submissionId)).toEqual([{outcome: 'REJECTED', reason_code: 'HPR_PAYLOAD_TOO_LARGE', object_may_exist: false}]);
    expect(await objectSha(over.path)).toBeNull();
  }, 60_000);

  it('rejects MIME / signature mismatch, truncated and partial uploads, recording each', async () => {
    const cases: Array<[Uint8Array | ReadableStream<Uint8Array>, string, number, string]> = [
      [png(), 'image/jpeg', 415, 'HPR_CONTENT_SIGNATURE_MISMATCH'],
      [new TextEncoder().encode('<svg/>'), 'image/webp', 415, 'HPR_CONTENT_SIGNATURE_UNRECOGNIZED'],
      [webp().slice(0, 1500), 'image/webp', 422, 'HPR_CONTENT_TRUNCATED'],
      [streamOf(jpeg(8192), 1024, 4096), 'image/jpeg', 400, 'HPR_PARTIAL_UPLOAD'],
    ];
    for (const [body, type, status, reason] of cases) {
      const p = await photoSubmission(A);
      const res = await put(p.submissionId, body, {cookie: A.cookie, type});
      expect(res.status, reason).toBe(status);
      expect((await res.json()).error).toBe(reason);
      expect(await outcomes(A, p.submissionId)).toEqual([{outcome: 'REJECTED', reason_code: reason, object_may_exist: false}]);
      expect(await objectSha(p.path)).toBeNull();
      expect(await integrity(A, p.submissionId)).toBe('STORAGE_PENDING');
    }
    const p = await photoSubmission(A);
    expect((await put(p.submissionId, jpeg(), {cookie: A.cookie, type: 'image/svg+xml'})).status).toBe(415);
  });

  it('rejects a digest mismatch against client_declared_sha256 before storing', async () => {
    const p = await photoSubmission(A, 'cd'.repeat(32));
    const res = await put(p.submissionId, jpeg(), {cookie: A.cookie});
    expect(res.status).toBe(422);
    expect((await res.json()).error).toBe('HPR_CLIENT_DIGEST_MISMATCH');
    expect(await objectSha(p.path)).toBeNull();
    const ok = await photoSubmission(A, sha(jpeg()));
    expect((await put(ok.submissionId, jpeg(), {cookie: A.cookie})).status).toBe(201);
  });

  it('rejects request replay and duplicate finalization', async () => {
    const p = await photoSubmission(A);
    const nonce = randomUUID();
    expect((await put(p.submissionId, png(), {cookie: A.cookie, nonce, type: 'image/jpeg'})).status).toBe(415);
    const replay = await put(p.submissionId, jpeg(), {cookie: A.cookie, nonce});
    expect(replay.status).toBe(409);
    expect((await replay.json()).error).toBe('HPR_UPLOAD_REPLAY');
    expect((await put(p.submissionId, jpeg(), {cookie: A.cookie})).status).toBe(201);
    const again = await put(p.submissionId, jpeg(1024), {cookie: A.cookie});
    expect(again.status).toBe(409);
    expect((await again.json()).error).toBe('HPR_ALREADY_DECLARED');

    // Concurrent finalization of one submission: exactly one wins.
    const q = await photoSubmission(A);
    const results = await Promise.all([jpeg(4096), jpeg(5000), jpeg(6000)].map(b => put(q.submissionId, b, {cookie: A.cookie})));
    const statuses = results.map(r => r.status).sort();
    expect(statuses.filter(s => s === 201)).toHaveLength(1);
    expect(statuses.filter(s => s === 409)).toHaveLength(2);
    const decls = await A.db.from('hpr_evidence_storage_objects').select('submission_id').eq('submission_id', q.submissionId);
    expect(decls.data).toHaveLength(1);
  });

  it('cannot overwrite, upsert, move or delete an original, even with the service key; clients cannot write', async () => {
    const p = await photoSubmission(A);
    const bytes = jpeg(3000);
    expect((await put(p.submissionId, bytes, {cookie: A.cookie})).status).toBe(201);
    const bucket = service.storage.from(HPR_PRIVATE_BUCKET);
    expect((await bucket.upload(p.path, jpeg(10), {contentType: 'image/jpeg', upsert: false})).error).not.toBeNull();
    expect((await bucket.upload(p.path, jpeg(10), {contentType: 'image/jpeg', upsert: true})).error?.message).toMatch(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    expect((await bucket.update(p.path, jpeg(10), {contentType: 'image/jpeg'})).error?.message).toMatch(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    expect((await bucket.move(p.path, p.path.replace('original', 'moved'))).error?.message).toMatch(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    expect((await bucket.remove([p.path])).error?.message).toMatch(/HPR_PHOTO_OBJECT_IMMUTABLE/);
    expect((await bucket.upload(`${A.id}/evil.jpg`, jpeg(), {contentType: 'image/jpeg'})).error?.message).toMatch(/HPR_PHOTO_PATH_REJECTED/);
    // Direct client writes (own derived path of a pending submission, or any path) are denied by Storage RLS.
    const pending = await photoSubmission(A);
    expect((await A.db.storage.from(HPR_PRIVATE_BUCKET).upload(pending.path, jpeg(), {contentType: 'image/jpeg'})).error).not.toBeNull();
    expect((await A.db.storage.from(HPR_PRIVATE_BUCKET).upload(p.path, jpeg(), {contentType: 'image/jpeg', upsert: true})).error).not.toBeNull();
    expect((await A.db.storage.from(HPR_PRIVATE_BUCKET).remove([p.path])).data ?? []).toEqual([]);
    expect(await objectSha(p.path)).toBe(sha(bytes));
    expect((await service.storage.getBucket(HPR_PRIVATE_BUCKET)).data?.public).toBe(false);
  });

  it('handles object written / declaration failed: orphan recorded, never adopted, recovery by supersession', async () => {
    const p = await photoSubmission(A);
    const real = servicePort(service);
    const res = await handlePhotoUpload(request(p.submissionId, jpeg(), {cookie: A.cookie}), p.submissionId, {
      enabled: true,
      authenticate: () => authenticateFromCookies({getAll: () => A.cookies}),
      service: {...real, completeAttempt: async () => ({data: null, error: {message: 'simulated database outage'}})},
    });
    expect(res.status).toBe(500);
    expect(await objectSha(p.path)).toBe(sha(jpeg()));
    expect(await outcomes(A, p.submissionId)).toEqual([{outcome: 'FAILED', reason_code: 'HPR_DECLARATION_FAILED_OBJECT_ORPHANED', object_may_exist: true}]);
    expect(await integrity(A, p.submissionId)).toBe('STORAGE_PENDING');
    // Not readable by the technician (no declaration), and not adoptable by a retry.
    expect((await A.db.storage.from(HPR_PRIVATE_BUCKET).download(p.path)).error).not.toBeNull();
    const retry = await put(p.submissionId, jpeg(), {cookie: A.cookie});
    expect(retry.status).toBe(409);
    expect((await retry.json()).error).toBe('HPR_OBJECT_ORPHANED');
    const recorded = await recordStorageOrphans(service, 'orphan.local-test');
    expect(recorded).toContain(p.path);
    expect(await recordStorageOrphans(service, 'orphan.local-test')).not.toContain(p.path);
    const orphan = await service.from('hpr_storage_orphan_records').select('disposition').eq('object_path', p.path).single();
    expect(orphan.data?.disposition).toBe('QUARANTINED_RETAINED');
    expect((await A.db.from('hpr_storage_orphan_records').select('id')).error?.code).toBe('42501');
    expect(await objectSha(p.path)).toBe(sha(jpeg())); // retained, not erased
    // Recovery: a superseding PHOTO submission gets a new path.
    const c = await A.db.from('hpr_evidence_submissions').insert({
      inspection_id: p.inspectionId, step_number: 4, client_record_id: 'P2-R' + ++n, kind: 'PHOTO', client_captured_at: new Date().toISOString(),
      supersedes_submission_id: p.submissionId, correction_reason: 'UPLOAD_FAILED',
    }).select('id').single();
    expect(c.error).toBeNull();
    expect((await put(c.data!.id, jpeg(), {cookie: A.cookie})).status).toBe(201);
  });

  it('records an ambiguous storage failure as FAILED with object_may_exist, leaving the submission pending', async () => {
    const p = await photoSubmission(A);
    const real = servicePort(service);
    const res = await handlePhotoUpload(request(p.submissionId, jpeg(), {cookie: A.cookie}), p.submissionId, {
      enabled: true,
      authenticate: () => authenticateFromCookies({getAll: () => A.cookies}),
      service: {...real, uploadOriginal: async () => { throw new Error('ECONNRESET'); }},
    });
    expect(res.status).toBe(502);
    expect(await outcomes(A, p.submissionId)).toEqual([{outcome: 'FAILED', reason_code: 'HPR_STORAGE_WRITE_FAILED', object_may_exist: true}]);
    expect((await put(p.submissionId, jpeg(), {cookie: A.cookie})).status).toBe(201);
  });

  it('is disabled unless HPR_PHOTO_UPLOAD_ENABLED=true', async () => {
    const p = await photoSubmission(A);
    process.env.HPR_PHOTO_UPLOAD_ENABLED = 'false';
    try {
      expect((await put(p.submissionId, jpeg(), {cookie: A.cookie})).status).toBe(503);
    } finally {
      process.env.HPR_PHOTO_UPLOAD_ENABLED = 'true';
    }
  });

  describe.skipIf(!STORAGE_CONTAINER)('backend tampering (privileged access outside the controlled roles)', () => {
    const backendFile = (path: string) => execFileSync('docker', ['exec', STORAGE_CONTAINER, 'sh', '-c',
      `ls -1 "/mnt/stub/stub/${HPR_PRIVATE_BUCKET}/${path}/" | head -1`]).toString().trim();

    it('detects bytes rewritten in the storage backend (DIGEST_MISMATCH, sticky)', async () => {
      const p = await photoSubmission(A);
      expect((await put(p.submissionId, jpeg(4096), {cookie: A.cookie})).status).toBe(201);
      expect((await reconcileDeclaredPhoto(service, p.submissionId, 'reconciler.local-test')).result).toBe('MATCH');
      const version = backendFile(p.path);
      expect(version).toMatch(/^[0-9a-f-]{36}$/);
      // Same length, one byte flipped, written directly into the backend volume.
      execFileSync('docker', ['exec', STORAGE_CONTAINER, 'sh', '-c',
        `printf '\\001' | dd of="/mnt/stub/stub/${HPR_PRIVATE_BUCKET}/${p.path}/${version}" bs=1 seek=100 conv=notrunc 2>/dev/null`]);
      const r = await reconcileDeclaredPhoto(service, p.submissionId, 'reconciler.local-test');
      expect(r.result).toBe('DIGEST_MISMATCH');
      expect(r.observed_byte_size).toBe(4096);
      expect(await integrity(A, p.submissionId)).toBe('RECONCILIATION_FAILED');
      expect((await reconcileDeclaredPhoto(service, p.submissionId, 'reconciler.local-test')).result).toBe('DIGEST_MISMATCH');
    });

    it('records bytes removed from the backend as READ_FAILED (inconclusive, never MATCH)', async () => {
      const p = await photoSubmission(A);
      expect((await put(p.submissionId, jpeg(4096), {cookie: A.cookie})).status).toBe(201);
      const version = backendFile(p.path);
      execFileSync('docker', ['exec', STORAGE_CONTAINER, 'rm', `/mnt/stub/stub/${HPR_PRIVATE_BUCKET}/${p.path}/${version}`]);
      // Observed on storage-api v1.96: metadata present + bytes missing -> HTTP 500.
      const r = await reconcileDeclaredPhoto(service, p.submissionId, 'reconciler.local-test');
      expect(r).toMatchObject({result: 'READ_FAILED', read_error_code: 'STORAGE_HTTP_500', observed_sha256: null});
      expect(await integrity(A, p.submissionId)).toBe('RECONCILIATION_INCONCLUSIVE');
    });
  });
});
