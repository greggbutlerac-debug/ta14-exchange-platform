/**
 * Supabase adapters for the HPR photo upload / reconciliation core.
 *
 * SERVER ONLY. The service client reads SUPABASE_SERVICE_ROLE_KEY, which must
 * never be exposed with a NEXT_PUBLIC_ prefix or imported from a client
 * component (a test enforces both).
 */
import {createClient, type SupabaseClient} from '@supabase/supabase-js';
import type {HprPhotoContentType} from './content-signature';
import type {OpenedAttempt, ServicePort, UserDatabasePort} from './upload-handler';

export const HPR_PRIVATE_BUCKET = 'hpr-field-evidence-private';

export function createHprServiceClient(env: NodeJS.ProcessEnv = process.env): SupabaseClient {
  const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error('HPR service configuration missing.');
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}});
}

export function userDatabasePort(db: SupabaseClient): UserDatabasePort {
  return {
    async openAttempt(submissionId, nonce) {
      const r = await db.rpc('hpr_open_photo_upload_attempt', {p_submission_id: submissionId, p_request_nonce: nonce}).single();
      return {data: (r.data as OpenedAttempt | null) ?? null, error: r.error};
    },
  };
}

export function servicePort(service: SupabaseClient): ServicePort {
  return {
    async uploadOriginal(objectPath, bytes, contentType: HprPhotoContentType) {
      const r = await service.storage.from(HPR_PRIVATE_BUCKET).upload(objectPath, bytes, {
        contentType,
        upsert: false,
        cacheControl: 'no-store',
      });
      const err = r.error as (Error & {statusCode?: string | number; status?: number}) | null;
      return {error: err ? {message: err.message, statusCode: err.statusCode ?? err.status} : null};
    },
    async completeAttempt(attemptId, sha256, byteSize, contentType) {
      const r = await service.rpc('hpr_complete_photo_upload_attempt', {
        p_attempt_id: attemptId, p_server_sha256: sha256, p_byte_size: byteSize, p_content_type: contentType,
      }).single();
      return {data: r.data, error: r.error};
    },
    async recordFailure(i) {
      const r = await service.rpc('hpr_record_photo_upload_failure', {
        p_attempt_id: i.attemptId, p_outcome: i.outcome, p_reason_code: i.reasonCode,
        p_observed_sha256: i.observedSha256, p_observed_byte_size: i.observedByteSize, p_object_may_exist: i.objectMayExist,
      });
      return {error: r.error};
    },
  };
}
