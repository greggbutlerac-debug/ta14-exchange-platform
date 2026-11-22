/**
 * Unit tests for the HPR photo upload core: content signatures, bounded
 * streaming digests, and the handler's fail-closed ordering against fake
 * ports. Real Supabase behavior is in ../local-supabase.
 */
import {createHash, randomUUID} from 'node:crypto';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  checkContentSignature,
  HPR_PHOTO_MAX_BYTES,
  sniffImageType,
} from '../../../apps/web/lib/hvac-performance-record/photo-upload/content-signature';
import {readBodyWithDigest} from '../../../apps/web/lib/hvac-performance-record/photo-upload/stream-digest';
import {
  handlePhotoUpload,
  type OpenedAttempt,
  type PhotoUploadDeps,
  type ServicePort,
} from '../../../apps/web/lib/hvac-performance-record/photo-upload/upload-handler';
import {heic, jpeg, png, streamOf, webp} from './fixtures';

const sha = (b: Uint8Array) => createHash('sha256').update(b).digest('hex');

describe('content signature', () => {
  it('recognizes each allowed type from its bytes', () => {
    expect(sniffImageType(jpeg())).toBe('image/jpeg');
    expect(sniffImageType(png())).toBe('image/png');
    expect(sniffImageType(webp())).toBe('image/webp');
    expect(sniffImageType(heic())).toBe('image/heic');
    expect(sniffImageType(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBeNull();
    expect(sniffImageType(new TextEncoder().encode('GIF89a......'))).toBeNull();
  });

  it('rejects a declared type that differs from the bytes', () => {
    expect(checkContentSignature(png(), 'image/jpeg')).toEqual({ok: false, reason: 'HPR_CONTENT_SIGNATURE_MISMATCH'});
    expect(checkContentSignature(new TextEncoder().encode('MZ executable'), 'image/jpeg')).toEqual({ok: false, reason: 'HPR_CONTENT_SIGNATURE_UNRECOGNIZED'});
  });

  it('rejects truncated files of every type', () => {
    expect(checkContentSignature(jpeg().slice(0, 1000), 'image/jpeg')).toEqual({ok: false, reason: 'HPR_CONTENT_TRUNCATED'});
    expect(checkContentSignature(png().slice(0, 1000), 'image/png')).toEqual({ok: false, reason: 'HPR_CONTENT_TRUNCATED'});
    expect(checkContentSignature(webp().slice(0, 1000), 'image/webp')).toEqual({ok: false, reason: 'HPR_CONTENT_TRUNCATED'});
    expect(checkContentSignature(heic().slice(0, 1000), 'image/heic')).toEqual({ok: false, reason: 'HPR_CONTENT_TRUNCATED'});
    for (const [b, t] of [[jpeg(), 'image/jpeg'], [png(), 'image/png'], [webp(), 'image/webp'], [heic(), 'image/heic']] as const) {
      expect(checkContentSignature(b, t)).toEqual({ok: true, contentType: t});
    }
  });
});

describe('bounded streaming digest', () => {
  it('hashes exactly the received bytes', async () => {
    const b = jpeg(10_000);
    const r = await readBodyWithDigest(streamOf(b, 333), HPR_PHOTO_MAX_BYTES, b.length);
    expect(r.sha256).toBe(sha(b));
    expect(r.byteSize).toBe(10_000);
  });

  it('stops reading as soon as the limit is exceeded', async () => {
    let pulled = 0;
    const endless = new ReadableStream<Uint8Array>({pull(c) { pulled++; c.enqueue(new Uint8Array(1024 * 1024)); }});
    await expect(readBodyWithDigest(endless, HPR_PHOTO_MAX_BYTES, null)).rejects.toMatchObject({reason: 'HPR_PAYLOAD_TOO_LARGE'});
    expect(pulled).toBeLessThanOrEqual(27);
  });

  it('treats a short body, an aborted stream and an empty body as failures', async () => {
    const b = jpeg(4096);
    await expect(readBodyWithDigest(streamOf(b), HPR_PHOTO_MAX_BYTES, 8192)).rejects.toMatchObject({reason: 'HPR_PARTIAL_UPLOAD'});
    await expect(readBodyWithDigest(streamOf(b, 1024, 2048), HPR_PHOTO_MAX_BYTES, null)).rejects.toMatchObject({reason: 'HPR_PARTIAL_UPLOAD'});
    await expect(readBodyWithDigest(streamOf(new Uint8Array(0)), HPR_PHOTO_MAX_BYTES, null)).rejects.toMatchObject({reason: 'HPR_PAYLOAD_EMPTY'});
    await expect(readBodyWithDigest(null, HPR_PHOTO_MAX_BYTES, null)).rejects.toMatchObject({reason: 'HPR_PAYLOAD_EMPTY'});
  });
});

describe('upload handler ordering (fake ports)', () => {
  const USER = randomUUID();
  const SUB = randomUUID();

  function harness(opts: {clientSha?: string | null; upload?: ServicePort['uploadOriginal']; complete?: ServicePort['completeAttempt']; attemptUser?: string} = {}) {
    const calls: string[] = [];
    const failures: Array<{reasonCode: string; outcome: string; objectMayExist: boolean}> = [];
    const attempt: OpenedAttempt = {
      attempt_id: randomUUID(), submission_id: SUB, inspection_id: randomUUID(), technician_user_id: opts.attemptUser ?? USER,
      object_path: `${USER}/i/${SUB}/original`, client_declared_sha256: opts.clientSha ?? null, lease_expires_at: new Date().toISOString(),
    };
    const deps: PhotoUploadDeps = {
      enabled: true,
      authenticate: async () => ({userId: USER, db: {openAttempt: async () => { calls.push('open'); return {data: attempt, error: null}; }}}),
      service: {
        uploadOriginal: opts.upload ?? (async () => { calls.push('upload'); return {error: null}; }),
        completeAttempt: opts.complete ?? (async () => { calls.push('complete'); return {data: {}, error: null}; }),
        recordFailure: async i => { calls.push('fail'); failures.push(i); return {error: null}; },
      },
    };
    return {deps, calls, failures, attempt};
  }

  const req = (body: Uint8Array | null, headers: Record<string, string> = {}) => new Request('http://localhost/api/hpr/evidence/x/photo', {
    method: 'PUT',
    headers: {'content-type': 'image/jpeg', 'x-hpr-upload-nonce': randomUUID(), ...(body ? {'content-length': String(body.length)} : {}), ...headers},
    body: body as BodyInit | null,
  });

  it('is disabled unless explicitly enabled, and needs authentication', async () => {
    const h = harness();
    expect((await handlePhotoUpload(req(jpeg()), SUB, {...h.deps, enabled: false})).status).toBe(503);
    expect((await handlePhotoUpload(req(jpeg()), SUB, {...h.deps, authenticate: async () => null})).status).toBe(401);
    expect((await handlePhotoUpload(req(jpeg()), SUB, {...h.deps, authenticate: async () => { throw new Error('bad jwt'); }})).status).toBe(401);
    expect(h.calls).toEqual([]);
  });

  it('rejects before opening an attempt: bad id, MIME header, oversize Content-Length, missing nonce', async () => {
    const h = harness();
    expect((await handlePhotoUpload(req(jpeg()), '../etc/passwd', h.deps)).status).toBe(400);
    expect((await handlePhotoUpload(req(jpeg(), {'content-type': 'image/svg+xml'}), SUB, h.deps)).status).toBe(415);
    expect((await handlePhotoUpload(new Request('http://localhost/x', {method: 'PUT', headers: {'content-type': 'image/jpeg', 'x-hpr-upload-nonce': randomUUID(), 'content-length': String(HPR_PHOTO_MAX_BYTES + 1)}, body: new Uint8Array(1)}), SUB, h.deps)).status).toBe(413);
    expect((await handlePhotoUpload(req(jpeg(), {'x-hpr-upload-nonce': 'replay'}), SUB, h.deps)).status).toBe(400);
    expect(h.calls).toEqual([]);
  });

  it('records and rejects signature mismatch, truncation and client digest mismatch without storing', async () => {
    for (const [body, headers, clientSha, reason] of [
      [png(), {}, null, 'HPR_CONTENT_SIGNATURE_MISMATCH'],
      [jpeg().slice(0, 1000), {}, null, 'HPR_CONTENT_TRUNCATED'],
      [jpeg(), {}, 'cd'.repeat(32), 'HPR_CLIENT_DIGEST_MISMATCH'],
    ] as const) {
      const h = harness({clientSha});
      const res = await handlePhotoUpload(req(body, headers), SUB, h.deps);
      expect((await res.json()).error).toBe(reason);
      expect(h.calls).toEqual(['open', 'fail']);
      expect(h.failures[0]).toMatchObject({reasonCode: reason, outcome: 'REJECTED', objectMayExist: false});
    }
  });

  it('ignores client-supplied identity, path and digest headers', async () => {
    const h = harness();
    let storedPath = '';
    h.deps.service.uploadOriginal = async p => { storedPath = p; return {error: null}; };
    const res = await handlePhotoUpload(req(jpeg(), {
      'x-technician-id': randomUUID(), 'x-object-path': 'attacker/path/original', 'x-client-sha256': 'ab'.repeat(32),
    }), SUB, h.deps);
    expect(res.status).toBe(201);
    expect(storedPath).toBe(h.attempt.object_path);
    const body = await res.json();
    expect(body).toMatchObject({server_declared_sha256: sha(jpeg()), reconciliation_status: 'UNRECONCILED', verification_status: 'UNVERIFIED', ddd_status: 'LOCKED', intervention_authorization: 'NONE'});
  });

  it('fails closed if the database ever returns a different identity', async () => {
    const h = harness({attemptUser: randomUUID()});
    const res = await handlePhotoUpload(req(jpeg()), SUB, h.deps);
    expect(res.status).toBe(500);
    expect(h.calls).toEqual(['open', 'fail']);
  });

  it('records object-exists as REJECTED and ambiguous storage errors as FAILED (object may exist)', async () => {
    const exists = harness({upload: async () => ({error: {message: 'The resource already exists', statusCode: '409'}})});
    expect((await handlePhotoUpload(req(jpeg()), SUB, exists.deps)).status).toBe(409);
    expect(exists.failures[0]).toMatchObject({outcome: 'REJECTED', reasonCode: 'HPR_OBJECT_EXISTS', objectMayExist: false});
    const flaky = harness({upload: async () => { throw new Error('socket hang up'); }});
    expect((await handlePhotoUpload(req(jpeg()), SUB, flaky.deps)).status).toBe(502);
    expect(flaky.failures[0]).toMatchObject({outcome: 'FAILED', reasonCode: 'HPR_STORAGE_WRITE_FAILED', objectMayExist: true});
  });

  it('records an orphaned object when declaration fails after storage succeeded', async () => {
    const h = harness({complete: async () => { throw new Error('connection reset'); }});
    const res = await handlePhotoUpload(req(jpeg()), SUB, h.deps);
    expect(res.status).toBe(500);
    expect(h.failures[0]).toMatchObject({outcome: 'FAILED', reasonCode: 'HPR_DECLARATION_FAILED_OBJECT_ORPHANED', objectMayExist: true});
  });
});

describe('service credential stays server-only', () => {
  const root = path.resolve(__dirname, '../../../apps/web');
  function walk(dir: string, out: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
      if (name === 'node_modules' || name === '.next') continue;
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) walk(p, out);
      else if (/\.(ts|tsx)$/.test(name)) out.push(p);
    }
    return out;
  }
  const files = walk(root);

  it('no client component imports the HPR photo-upload modules', () => {
    const offenders = files.filter(f => {
      const s = readFileSync(f, 'utf8');
      return /^['"]use client['"]/m.test(s) && /hvac-performance-record\/photo-upload/.test(s);
    });
    expect(offenders).toEqual([]);
  });

  it('the service role key is never read through a NEXT_PUBLIC_ variable', () => {
    const offenders = files.filter(f => /NEXT_PUBLIC_[A-Z_]*SERVICE_ROLE/.test(readFileSync(f, 'utf8')));
    expect(offenders).toEqual([]);
  });
});
