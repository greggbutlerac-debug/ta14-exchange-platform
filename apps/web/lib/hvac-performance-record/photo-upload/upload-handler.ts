/**
 * HPR photograph upload — server-side core (framework independent).
 *
 * Trust model:
 *   * Identity comes only from a session the server verified with Supabase
 *     Auth (`authenticate`). The client's technicianId, object path, content
 *     type and SHA-256 are never trusted.
 *   * The attempt is opened with the USER's credentials, so auth.uid(),
 *     enrollment, ownership, kind = PHOTO, not-superseded, not-yet-declared,
 *     nonce replay and concurrent-attempt checks all run in the database,
 *     which also derives the object path.
 *   * Bytes are hashed on the server as they stream in; size is enforced
 *     while streaming; the content signature must match the declared type.
 *   * The object is written with no upsert at the derived path (the bucket
 *     trigger also rejects overwrite / move / delete for service_role).
 *   * Only then does service_role declare it; the database re-checks that
 *     the object exists with the same size and MIME type.
 *   * Every failure after an attempt is opened is recorded as an append-only
 *     outcome. Nothing is deleted. An object written without a declaration is
 *     an orphan for the reconciliation job (never auto-adopted).
 *
 * The result is a DECLARATION (UNRECONCILED). It is not verification, not
 * admission and not permission to act. DDD stays LOCKED; intervention NONE.
 */
import {
  checkContentSignature,
  HPR_PHOTO_MAX_BYTES,
  isHprPhotoContentType,
  type HprPhotoContentType,
} from './content-signature';
import {HprBodyError, readBodyWithDigest} from './stream-digest';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const HPR_UPLOAD_NONCE_HEADER = 'x-hpr-upload-nonce';

export type PgError = {code?: string; message?: string} | null | undefined;

export type OpenedAttempt = {
  attempt_id: string;
  submission_id: string;
  inspection_id: string;
  technician_user_id: string;
  object_path: string;
  client_declared_sha256: string | null;
  lease_expires_at: string;
};

/** Calls made with the authenticated user's own credentials. */
export interface UserDatabasePort {
  openAttempt(submissionId: string, nonce: string): Promise<{data: OpenedAttempt | null; error: PgError}>;
}

/** Server-only calls made with the service_role credential. */
export interface ServicePort {
  uploadOriginal(objectPath: string, bytes: Uint8Array, contentType: HprPhotoContentType): Promise<{error: {message?: string; statusCode?: string | number} | null}>;
  completeAttempt(attemptId: string, sha256: string, byteSize: number, contentType: HprPhotoContentType): Promise<{data: unknown; error: PgError}>;
  recordFailure(input: {
    attemptId: string;
    outcome: 'REJECTED' | 'FAILED';
    reasonCode: string;
    observedSha256: string | null;
    observedByteSize: number | null;
    objectMayExist: boolean;
  }): Promise<{error: PgError}>;
}

export type Authenticated = {userId: string; db: UserDatabasePort};

export type PhotoUploadDeps = {
  enabled: boolean;
  /** Resolves a server-verified Supabase user, or null. Must not trust client-supplied identity. */
  authenticate(): Promise<Authenticated | null>;
  service: ServicePort;
  log?: (event: string, detail: Record<string, unknown>) => void;
};

const BOUNDARY = {
  reconciliation_status: 'UNRECONCILED',
  verification_status: 'UNVERIFIED',
  ddd_status: 'LOCKED',
  intervention_authorization: 'NONE',
} as const;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {'content-type': 'application/json', 'cache-control': 'no-store'},
  });
}

const fail = (status: number, reason: string) => json(status, {error: reason, ...BOUNDARY});

/** Extracts the HPR_* reason code a database function raised, if any. */
export function reasonFrom(error: PgError, fallback: string): string {
  const m = /\b(HPR_[A-Z0-9_]+)/.exec(error?.message ?? '');
  return m ? m[1] : fallback;
}

function statusForOpenError(error: PgError): number {
  switch (error?.code) {
    case '42501': return 403;
    case '23505': return 409;
    case '55P03': return 409;
    case '22023': return 422;
    case 'PGRST301': case 'PGRST302': return 401;
    default: return 500;
  }
}

export async function handlePhotoUpload(
  request: Request,
  submissionId: string,
  deps: PhotoUploadDeps,
): Promise<Response> {
  const log = deps.log ?? (() => undefined);
  if (!deps.enabled) return fail(503, 'HPR_PHOTO_UPLOAD_DISABLED');
  if (request.method !== 'PUT') return fail(405, 'HPR_METHOD_NOT_ALLOWED');
  if (!UUID.test(submissionId)) return fail(400, 'HPR_SUBMISSION_ID_INVALID');

  const caller = await deps.authenticate().catch(() => null);
  if (!caller) return fail(401, 'HPR_AUTH_REQUIRED');

  const declaredType = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (!isHprPhotoContentType(declaredType)) return fail(415, 'HPR_CONTENT_TYPE_NOT_ALLOWED');

  const lengthHeader = request.headers.get('content-length');
  let declaredLength: number | null = null;
  if (lengthHeader !== null) {
    if (!/^\d{1,12}$/.test(lengthHeader)) return fail(400, 'HPR_CONTENT_LENGTH_INVALID');
    declaredLength = Number(lengthHeader);
    if (declaredLength > HPR_PHOTO_MAX_BYTES) return fail(413, 'HPR_PAYLOAD_TOO_LARGE');
  }

  const nonce = (request.headers.get(HPR_UPLOAD_NONCE_HEADER) ?? '').toLowerCase();
  if (!UUID.test(nonce)) return fail(400, 'HPR_UPLOAD_NONCE_REQUIRED');

  // 1. Open the attempt as the user. Database derives attribution and path.
  const opened = await caller.db.openAttempt(submissionId, nonce);
  if (opened.error || !opened.data) {
    const reason = reasonFrom(opened.error, 'HPR_UPLOAD_OPEN_FAILED');
    log('hpr.photo.open_rejected', {reason, code: opened.error?.code});
    return fail(statusForOpenError(opened.error), reason);
  }
  const attempt = opened.data;
  if (attempt.technician_user_id !== caller.userId || attempt.submission_id !== submissionId) {
    // Defensive: the database must never return another identity.
    await deps.service.recordFailure({attemptId: attempt.attempt_id, outcome: 'FAILED', reasonCode: 'HPR_ATTRIBUTION_INCONSISTENT', observedSha256: null, observedByteSize: null, objectMayExist: false});
    return fail(500, 'HPR_ATTRIBUTION_INCONSISTENT');
  }

  const record = async (outcome: 'REJECTED' | 'FAILED', reasonCode: string, observed: {sha256?: string; size?: number} = {}, objectMayExist = false) => {
    const r = await deps.service.recordFailure({
      attemptId: attempt.attempt_id, outcome, reasonCode,
      observedSha256: observed.sha256 ?? null, observedByteSize: observed.size ?? null, objectMayExist,
    }).catch(e => ({error: {message: String(e)}}));
    if (r.error) log('hpr.photo.outcome_record_failed', {attempt: attempt.attempt_id, reasonCode});
  };

  // 2. Stream, enforce size, hash the actual bytes.
  let body;
  try {
    body = await readBodyWithDigest(request.body, HPR_PHOTO_MAX_BYTES, declaredLength);
  } catch (e) {
    const reason = e instanceof HprBodyError ? e.reason : 'HPR_BODY_READ_FAILED';
    await record('REJECTED', reason);
    return fail(reason === 'HPR_PAYLOAD_TOO_LARGE' ? 413 : 400, reason);
  }
  const observed = {sha256: body.sha256, size: body.byteSize};

  // 3. Content signature must match the declared type and be complete.
  const signature = checkContentSignature(body.bytes, declaredType);
  if (!signature.ok) {
    await record('REJECTED', signature.reason, observed);
    return fail(signature.reason === 'HPR_CONTENT_TRUNCATED' ? 422 : 415, signature.reason);
  }

  // 4. A client-declared digest (from the submission row, not the request)
  //    must equal the server digest. Checked before anything is stored.
  if (attempt.client_declared_sha256 && attempt.client_declared_sha256 !== body.sha256) {
    await record('REJECTED', 'HPR_CLIENT_DIGEST_MISMATCH', observed);
    return fail(422, 'HPR_CLIENT_DIGEST_MISMATCH');
  }

  // 5. Single-write object at the derived path.
  const uploaded = await deps.service.uploadOriginal(attempt.object_path, body.bytes, signature.contentType)
    .catch((e): {error: {message?: string; statusCode?: string | number}} => ({error: {message: String(e)}}));
  if (uploaded.error) {
    const exists = String(uploaded.error.statusCode) === '409' || /already exists|Duplicate/i.test(uploaded.error.message ?? '');
    const reason = exists ? 'HPR_OBJECT_EXISTS' : reasonFrom(uploaded.error, 'HPR_STORAGE_WRITE_FAILED');
    // On an ambiguous storage error the object may exist; the orphan job decides.
    await record(exists ? 'REJECTED' : 'FAILED', reason, observed, !exists);
    log('hpr.photo.storage_write_failed', {attempt: attempt.attempt_id, reason});
    return fail(exists ? 409 : 502, reason);
  }

  // 6. Declare (service_role). The database re-checks existence, size, MIME.
  const completed = await deps.service.completeAttempt(attempt.attempt_id, body.sha256, body.byteSize, signature.contentType)
    .catch(e => ({data: null, error: {message: String(e)}}));
  if (completed.error) {
    const reason = reasonFrom(completed.error, 'HPR_DECLARATION_FAILED');
    await record('FAILED', reason === 'HPR_DECLARATION_FAILED' ? 'HPR_DECLARATION_FAILED_OBJECT_ORPHANED' : reason, observed, true);
    log('hpr.photo.declaration_failed', {attempt: attempt.attempt_id, reason});
    return fail(reason === 'HPR_UPLOAD_ALREADY_FINALIZED' ? 409 : 500, reason);
  }

  return json(201, {
    submission_id: attempt.submission_id,
    attempt_id: attempt.attempt_id,
    object_path: attempt.object_path,
    server_declared_sha256: body.sha256,
    declared_byte_size: body.byteSize,
    declared_content_type: signature.contentType,
    ...BOUNDARY,
  });
}
