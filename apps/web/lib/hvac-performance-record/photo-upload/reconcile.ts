/**
 * HPR storage reconciliation and orphan detection — SERVER ONLY.
 *
 * Reconciliation re-reads the stored original through Supabase Storage,
 * recomputes SHA-256 and the byte count independently of the upload request,
 * and appends a reconciliation record. The database (not this code) computes
 * the result against the declaration. Nothing is updated or deleted.
 *
 * Trust boundary: this runs with service_role, the same trust domain as the
 * uploader. A MATCH shows the stored bytes still hash to the declared digest.
 * It does not show who took the photograph, what it depicts, or that the
 * HVAC work is correct. It is not independent verification, not admission,
 * and not permission to act.
 *
 * Not scheduled or deployed anywhere in this increment.
 */
import type {SupabaseClient} from '@supabase/supabase-js';
import {digestStream} from './stream-digest';
import {HPR_PRIVATE_BUCKET} from './supabase-ports';

export type ReconciliationRecord = {
  id: string;
  submission_id: string;
  result: 'MATCH' | 'DIGEST_MISMATCH' | 'SIZE_MISMATCH' | 'OBJECT_ABSENT' | 'READ_FAILED';
  read_error_code: string | null;
  observed_sha256: string | null;
  observed_byte_size: number | null;
  api_role: string;
  verification_status: 'UNVERIFIED';
};

type StorageError = {statusCode?: string | number; status?: number; message?: string} | null;

function httpStatus(error: StorageError): string {
  return String(error?.statusCode ?? error?.status ?? '').replace(/[^0-9]/g, '');
}

function isNotFound(error: StorageError): boolean {
  return httpStatus(error) === '404' || /object not found/i.test(error?.message ?? '');
}

export async function reconcileDeclaredPhoto(
  service: SupabaseClient,
  submissionId: string,
  reconcilerId: string,
): Promise<ReconciliationRecord> {
  const decl = await service.from('hpr_evidence_storage_objects')
    .select('object_path').eq('submission_id', submissionId).single();
  if (decl.error || !decl.data) throw new Error('HPR_DECLARATION_NOT_FOUND');

  const startedAt = new Date().toISOString();
  const dl = await service.storage.from(HPR_PRIVATE_BUCKET).download(decl.data.object_path as string);
  let observed: {present: boolean; sha256: string | null; size: number | null; readError: string | null};
  if (dl.error) {
    // A definite "not found" is OBJECT_ABSENT (sticky failure). Any other
    // read error is READ_FAILED (inconclusive, never a match): Storage
    // returns 500 when metadata exists but the backend bytes are missing,
    // which cannot be told apart from a transient fault here.
    const e = dl.error as StorageError;
    observed = isNotFound(e)
      ? {present: false, sha256: null, size: null, readError: null}
      : {present: false, sha256: null, size: null, readError: `STORAGE_HTTP_${httpStatus(e) || 'UNKNOWN'}`};
  } else {
    const d = await digestStream(dl.data.stream() as ReadableStream<Uint8Array>);
    observed = {present: true, sha256: d.sha256, size: d.byteSize, readError: null};
  }
  const completedAt = new Date().toISOString();

  const r = await service.rpc('hpr_record_storage_reconciliation', {
    p_submission_id: submissionId,
    p_reconciler_id: reconcilerId,
    p_observed_object_present: observed.present,
    p_observed_byte_size: observed.size,
    p_observed_sha256: observed.sha256,
    p_read_started_at: startedAt,
    p_read_completed_at: completedAt,
    p_read_error_code: observed.readError,
  }).single();
  if (r.error) throw new Error(r.error.message);
  return r.data as ReconciliationRecord;
}

/**
 * Lists bucket objects with no declaration and no orphan record, and records
 * each as QUARANTINED_RETAINED. Orphans are never declared automatically,
 * moved, overwritten or deleted; physical disposal waits for the retention
 * decision (D3) and must itself be a recorded event.
 */
export async function recordStorageOrphans(service: SupabaseClient, detectorId: string): Promise<string[]> {
  const list = await service.rpc('hpr_list_storage_orphans');
  if (list.error) throw new Error(list.error.message);
  const recorded: string[] = [];
  for (const row of (list.data ?? []) as Array<{object_path: string}>) {
    const r = await service.rpc('hpr_record_storage_orphan', {p_object_path: row.object_path, p_detector_id: detectorId});
    if (r.error && !/HPR_ORPHAN_ALREADY_RECORDED|HPR_NOT_ORPHAN/.test(r.error.message)) throw new Error(r.error.message);
    if (!r.error) recorded.push(row.object_path);
  }
  return recorded;
}
