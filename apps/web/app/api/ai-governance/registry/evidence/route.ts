import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BUCKET = 'ai-governance-registry-evidence';
const MAX_FILE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/zip',
  'application/x-zip-compressed',
]);

type Visibility = 'public' | 'private' | 'selective';

const PROVENANCE_STATUSES = new Set([
  'REGISTRANT-PRODUCED',
  'TA14-PRODUCED',
  'INDEPENDENTLY PRODUCED',
  'INDEPENDENTLY REPRODUCED',
  'PUBLIC-SOURCE',
  'CROSS-PARTY',
  'NOT INDEPENDENTLY ESTABLISHED',
  'NOT REPORTED',
  'NOT SUBMITTED',
  'NOT PRESERVED',
  'OUTSIDE REVIEW SCOPE',
]);

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase environment variables are not configured.');
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(values) {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Existing authenticated request cookies remain readable. */ }
      },
    },
  });
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) throw new Error('Supabase service-role environment variables are not configured.');
  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function sanitizeFilename(filename: string): string {
  const cleaned = filename.normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
  return cleaned.slice(0, 180) || 'evidence-file';
}

function parseVisibility(value: unknown): Visibility {
  if (value === 'public' || value === 'selective') return value;
  return 'private';
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseProvenanceStatus(value: unknown): string | null {
  const status = text(value);
  if (!status) return null;
  if (!PROVENANCE_STATUSES.has(status)) throw new Error('Unsupported provenance status.');
  return status;
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const evidenceSelect = [
  'id','submission_id','original_filename','mime_type','size_bytes','sha256_hex',
  'evidence_relationship','evidence_classification','description','visibility',
  'evidence_state','source_date','source_url','submitted_at','storage_bucket','storage_path','provenance_status',
].join(',');

async function requireUser() {
  const cookieStore = await cookies();
  const supabase = createSupabaseClient(cookieStore);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export async function GET(request: NextRequest) {
  try {
    const submissionId = request.nextUrl.searchParams.get('submissionId');
    if (!submissionId) return errorResponse('Submission ID is required.');
    const { supabase, user } = await requireUser();
    if (!user) return errorResponse('Authentication required.', 401);
    const { data, error } = await supabase.from('ai_governance_registry_evidence').select(evidenceSelect).eq('submission_id', submissionId).eq('owner_user_id', user.id).not('storage_path', 'is', null).order('submitted_at', { ascending: true });
    if (error) return errorResponse(error.message);
    return NextResponse.json({ evidence: data ?? [] });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to load Registry evidence.', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser();
    if (!user) return errorResponse('Authentication required.', 401);

    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return errorResponse('Registry evidence binaries must use the authorized direct-upload path.', 415);
    }

    const body = await request.json() as Record<string, unknown>;
    const action = text(body.action);

    if (action === 'authorize_direct_upload') {
      const submissionId = text(body.submissionId);
      const originalFilename = text(body.originalFilename);
      const mimeType = text(body.mimeType) || 'application/octet-stream';
      const sizeBytes = Number(body.sizeBytes ?? 0);
      const sha256Hex = text(body.sha256Hex).toLowerCase();
      const evidenceRelationship = text(body.evidenceRelationship);
      const evidenceClassification = text(body.evidenceClassification);
      const description = text(body.description);
      const visibility = parseVisibility(body.visibility);
      const provenanceStatus = parseProvenanceStatus(body.provenanceStatus);

      if (!submissionId) return errorResponse('Save the Registry intake as a private draft before uploading evidence.');
      if (!originalFilename) return errorResponse('Evidence filename is required.');
      if (!evidenceRelationship) return errorResponse('Evidence relationship is required.');
      if (!description) return errorResponse('Evidence description is required.');
      if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) return errorResponse('The selected evidence file is empty.');
      if (sizeBytes > MAX_FILE_BYTES) return errorResponse('Evidence files may not exceed 50 MB.');
      if (!ALLOWED_MIME_TYPES.has(mimeType)) return errorResponse(`Unsupported evidence type: ${mimeType || 'unknown'}.`);
      if (!/^[a-f0-9]{64}$/.test(sha256Hex)) return errorResponse('A valid SHA-256 evidence hash is required.');

      const { data: parent, error: parentError } = await supabase.from('ai_governance_registry_submissions').select('id, status, registry_identifier, owner_user_id').eq('id', submissionId).eq('owner_user_id', user.id).single();
      if (parentError || !parent) return errorResponse('Registry draft was not found.', 404);
      if (!['draft', 'submitted', 'under_review'].includes(parent.status) || parent.registry_identifier) return errorResponse('Evidence can only be added while the Registry intake remains editable.', 409);

      const { data: duplicate } = await supabase.from('ai_governance_registry_evidence').select('id, original_filename, sha256_hex').eq('submission_id', submissionId).eq('sha256_hex', sha256Hex).maybeSingle();
      if (duplicate) return NextResponse.json({ error: 'This exact evidence file is already attached to the draft.', duplicateEvidenceId: duplicate.id, duplicateFilename: duplicate.original_filename, sha256: duplicate.sha256_hex }, { status: 409 });

      const { data: evidence, error: evidenceError } = await supabase.from('ai_governance_registry_evidence').insert({
        submission_id: submissionId,
        owner_user_id: user.id,
        original_filename: originalFilename,
        storage_bucket: null,
        storage_path: null,
        mime_type: mimeType,
        size_bytes: sizeBytes,
        sha256_hex: sha256Hex,
        evidence_relationship: evidenceRelationship,
        evidence_classification: evidenceClassification || null,
        description,
        visibility,
        evidence_state: 'pending_upload',
        source_date: null,
        source_url: null,
        provenance_status: provenanceStatus,
      }).select('id').single();

      if (evidenceError || !evidence) {
        if (evidenceError?.code === '23505') return errorResponse('This exact evidence file is already attached to the draft.', 409);
        return errorResponse(evidenceError?.message || 'Unable to create evidence metadata.');
      }

      const storagePath = `${user.id}/${submissionId}/${evidence.id}/${sanitizeFilename(originalFilename)}`;
      const admin = createAdminClient();
      const { data: signedUpload, error: signedUploadError } = await admin.storage.from(BUCKET).createSignedUploadUrl(storagePath);
      if (signedUploadError || !signedUpload?.token) {
        await supabase.from('ai_governance_registry_evidence').delete().eq('id', evidence.id).eq('owner_user_id', user.id);
        return errorResponse(signedUploadError?.message || 'Unable to authorize evidence storage.', 500);
      }

      return NextResponse.json({
        ok: true,
        evidenceId: evidence.id,
        bucket: BUCKET,
        storagePath,
        uploadToken: signedUpload.token,
      });
    }

    if (action === 'confirm_direct_upload') {
      const evidenceId = text(body.evidenceId);
      if (!evidenceId) return errorResponse('Evidence ID is required.');
      const { data: evidence, error: evidenceError } = await supabase.from('ai_governance_registry_evidence').select('*').eq('id', evidenceId).eq('owner_user_id', user.id).single();
      if (evidenceError || !evidence) return errorResponse('Evidence record was not found.', 404);
      if (evidence.storage_path) return errorResponse('Evidence is already preserved.', 409);

      const storagePath = `${user.id}/${evidence.submission_id}/${evidence.id}/${sanitizeFilename(evidence.original_filename)}`;
      const admin = createAdminClient();
      const slash = storagePath.lastIndexOf('/');
      const folder = storagePath.slice(0, slash);
      const filename = storagePath.slice(slash + 1);
      const { data: objects, error: storageError } = await admin.storage.from(BUCKET).list(folder, { search: filename, limit: 10 });
      if (storageError) return errorResponse(`Unable to verify evidence storage: ${storageError.message}`, 502);
      const storedObject = (objects ?? []).find((item) => item.name === filename);
      if (!storedObject) return errorResponse('The evidence object was not found after upload. Preservation remains incomplete.', 409);
      const storedSize = Number(storedObject.metadata?.size ?? storedObject.metadata?.contentLength ?? 0);
      if (storedSize > 0 && storedSize !== Number(evidence.size_bytes)) {
        await admin.storage.from(BUCKET).remove([storagePath]);
        await supabase.from('ai_governance_registry_evidence').delete().eq('id', evidence.id).eq('owner_user_id', user.id);
        return errorResponse('The stored evidence size does not match the authorized evidence object.', 409);
      }

      const { data: completedEvidence, error: updateError } = await supabase.from('ai_governance_registry_evidence').update({
        storage_bucket: BUCKET,
        storage_path: storagePath,
        evidence_state: 'current',
      }).eq('id', evidence.id).eq('owner_user_id', user.id).select(evidenceSelect).single();
      if (updateError || !completedEvidence) {
        await admin.storage.from(BUCKET).remove([storagePath]);
        await supabase.from('ai_governance_registry_evidence').delete().eq('id', evidence.id).eq('owner_user_id', user.id);
        return errorResponse(updateError?.message || 'Unable to bind evidence storage metadata.');
      }

      return NextResponse.json({ ok: true, evidence: completedEvidence, notice: 'The evidence file is preserved privately and bound to its SHA-256 hash. It is not public until the parent record is formally registered and this evidence item is marked public.' });
    }

    if (action === 'abort_direct_upload') {
      const evidenceId = text(body.evidenceId);
      if (!evidenceId) return errorResponse('Evidence ID is required.');
      const { data: evidence } = await supabase.from('ai_governance_registry_evidence').select('id, submission_id, original_filename, storage_path').eq('id', evidenceId).eq('owner_user_id', user.id).maybeSingle();
      if (evidence) {
        const storagePath = evidence.storage_path || `${user.id}/${evidence.submission_id}/${evidence.id}/${sanitizeFilename(evidence.original_filename)}`;
        const admin = createAdminClient();
        await admin.storage.from(BUCKET).remove([storagePath]);
        await supabase.from('ai_governance_registry_evidence').delete().eq('id', evidence.id).eq('owner_user_id', user.id);
      }
      return NextResponse.json({ ok: true });
    }

    return errorResponse('Unsupported evidence operation.', 400);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to preserve Registry evidence.', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const evidenceId = request.nextUrl.searchParams.get('id');
    if (!evidenceId) return errorResponse('Evidence ID is required.');
    const { supabase, user } = await requireUser();
    if (!user) return errorResponse('Authentication required.', 401);

    const { data: evidence, error: evidenceError } = await supabase.from('ai_governance_registry_evidence').select('id, submission_id, storage_bucket, storage_path, owner_user_id').eq('id', evidenceId).eq('owner_user_id', user.id).single();
    if (evidenceError || !evidence) return errorResponse('Evidence record was not found.', 404);
    const { data: parent, error: parentError } = await supabase.from('ai_governance_registry_submissions').select('status, registry_identifier').eq('id', evidence.submission_id).eq('owner_user_id', user.id).single();
    if (parentError || !parent) return errorResponse('Registry draft was not found.', 404);
    if (parent.status !== 'draft' || parent.registry_identifier) return errorResponse('Evidence can only be deleted while the Registry intake remains a private draft.', 409);

    if (evidence.storage_bucket && evidence.storage_path) {
      const admin = createAdminClient();
      const { error: storageError } = await admin.storage.from(evidence.storage_bucket).remove([evidence.storage_path]);
      if (storageError) return errorResponse(`Unable to remove the evidence object: ${storageError.message}`);
    }
    const { error: deleteError } = await supabase.from('ai_governance_registry_evidence').delete().eq('id', evidence.id).eq('owner_user_id', user.id);
    if (deleteError) return errorResponse(deleteError.message);
    return NextResponse.json({ ok: true, notice: 'The evidence file and its draft metadata were deleted.' });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Unable to delete Registry evidence.', 500);
  }
}
