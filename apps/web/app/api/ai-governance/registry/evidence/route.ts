import { createHash } from 'node:crypto';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BUCKET = 'ai-governance-registry-evidence';
const MAX_FILE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
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

function createSupabaseClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The existing authenticated request cookies remain readable.
        }
      },
    },
  });
}

function sanitizeFilename(filename: string): string {
  const cleaned = filename
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');

  return cleaned.slice(0, 180) || 'evidence-file';
}

function parseVisibility(value: FormDataEntryValue | null): Visibility {
  if (value === 'public' || value === 'selective') {
    return value;
  }

  return 'private';
}

function stringValue(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const submissionId = request.nextUrl.searchParams.get('submissionId');

    if (!submissionId) {
      return errorResponse('Submission ID is required.');
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Authentication required.', 401);
    }

    const { data, error } = await supabase
      .from('ai_governance_registry_evidence')
      .select(
        [
          'id',
          'submission_id',
          'original_filename',
          'mime_type',
          'size_bytes',
          'sha256_hex',
          'evidence_relationship',
          'evidence_classification',
          'description',
          'visibility',
          'evidence_state',
          'source_date',
          'source_url',
          'submitted_at',
          'storage_bucket',
          'storage_path',
        ].join(','),
      )
      .eq('submission_id', submissionId)
      .eq('owner_user_id', user.id)
      .order('submitted_at', { ascending: true });

    if (error) {
      return errorResponse(error.message);
    }

    return NextResponse.json({ evidence: data ?? [] });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to load Registry evidence.',
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  let createdEvidenceId: string | null = null;
  let uploadedPath: string | null = null;

  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Authentication required.', 401);
    }

    const formData = await request.formData();
    const fileValue = formData.get('file');
    const submissionId = stringValue(formData.get('submissionId'));
    const evidenceRelationship = stringValue(
      formData.get('evidenceRelationship'),
    );
    const evidenceClassification = stringValue(
      formData.get('evidenceClassification'),
    );
    const description = stringValue(formData.get('description'));
    const visibility = parseVisibility(formData.get('visibility'));
    const sourceDate = stringValue(formData.get('sourceDate')) || null;
    const sourceUrl = stringValue(formData.get('sourceUrl')) || null;

    if (!(fileValue instanceof File)) {
      return errorResponse('An evidence file is required.');
    }

    if (!submissionId) {
      return errorResponse(
        'Save the Registry intake as a private draft before uploading evidence.',
      );
    }

    if (!evidenceRelationship) {
      return errorResponse('Evidence relationship is required.');
    }

    if (!description) {
      return errorResponse('Evidence description is required.');
    }

    if (fileValue.size <= 0) {
      return errorResponse('The selected evidence file is empty.');
    }

    if (fileValue.size > MAX_FILE_BYTES) {
      return errorResponse('Evidence files may not exceed 50 MB.');
    }

    if (!ALLOWED_MIME_TYPES.has(fileValue.type)) {
      return errorResponse(
        `Unsupported evidence type: ${fileValue.type || 'unknown'}.`,
      );
    }

    const { data: parent, error: parentError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('id, status, registry_identifier, owner_user_id')
      .eq('id', submissionId)
      .eq('owner_user_id', user.id)
      .single();

    if (parentError || !parent) {
      return errorResponse('Registry draft was not found.', 404);
    }

    if (
      !['draft', 'submitted', 'under_review'].includes(parent.status) ||
      parent.registry_identifier
    ) {
      return errorResponse(
        'Evidence can only be added while the Registry intake remains editable.',
        409,
      );
    }

    const bytes = Buffer.from(await fileValue.arrayBuffer());
    const sha256Hex = createHash('sha256').update(bytes).digest('hex');

    const { data: duplicate } = await supabase
      .from('ai_governance_registry_evidence')
      .select('id, original_filename, sha256_hex')
      .eq('submission_id', submissionId)
      .eq('sha256_hex', sha256Hex)
      .maybeSingle();

    if (duplicate) {
      return NextResponse.json(
        {
          error: 'This exact evidence file is already attached to the draft.',
          duplicateEvidenceId: duplicate.id,
          duplicateFilename: duplicate.original_filename,
          sha256: duplicate.sha256_hex,
        },
        { status: 409 },
      );
    }

    const { data: evidence, error: evidenceError } = await supabase
      .from('ai_governance_registry_evidence')
      .insert({
        submission_id: submissionId,
        owner_user_id: user.id,
        original_filename: fileValue.name,
        storage_bucket: null,
        storage_path: null,
        mime_type: fileValue.type,
        size_bytes: fileValue.size,
        sha256_hex: sha256Hex,
        evidence_relationship: evidenceRelationship,
        evidence_classification: evidenceClassification || null,
        description,
        visibility,
        evidence_state: 'current',
        source_date: sourceDate,
        source_url: sourceUrl,
      })
      .select('id')
      .single();

    if (evidenceError || !evidence) {
      if (evidenceError?.code === '23505') {
        return errorResponse(
          'This exact evidence file is already attached to the draft.',
          409,
        );
      }

      return errorResponse(
        evidenceError?.message || 'Unable to create evidence metadata.',
      );
    }

    createdEvidenceId = evidence.id;

    const safeFilename = sanitizeFilename(fileValue.name);
    uploadedPath = `${user.id}/${submissionId}/${evidence.id}/${safeFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uploadedPath, bytes, {
        contentType: fileValue.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      await supabase
        .from('ai_governance_registry_evidence')
        .delete()
        .eq('id', evidence.id)
        .eq('owner_user_id', user.id);

      return errorResponse(`Evidence upload failed: ${uploadError.message}`);
    }

    const { data: completedEvidence, error: updateError } = await supabase
      .from('ai_governance_registry_evidence')
      .update({
        storage_bucket: BUCKET,
        storage_path: uploadedPath,
      })
      .eq('id', evidence.id)
      .eq('owner_user_id', user.id)
      .select(
        [
          'id',
          'submission_id',
          'original_filename',
          'mime_type',
          'size_bytes',
          'sha256_hex',
          'evidence_relationship',
          'evidence_classification',
          'description',
          'visibility',
          'evidence_state',
          'source_date',
          'source_url',
          'submitted_at',
          'storage_bucket',
          'storage_path',
        ].join(','),
      )
      .single();

    if (updateError || !completedEvidence) {
      await supabase.storage.from(BUCKET).remove([uploadedPath]);
      await supabase
        .from('ai_governance_registry_evidence')
        .delete()
        .eq('id', evidence.id)
        .eq('owner_user_id', user.id);

      return errorResponse(
        updateError?.message || 'Unable to bind evidence storage metadata.',
      );
    }

    return NextResponse.json({
      ok: true,
      evidence: completedEvidence,
      notice:
        'The evidence file is preserved privately and bound to its SHA-256 hash. It is not public until the parent record is formally registered and this evidence item is marked public.',
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to preserve Registry evidence.',
      500,
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const evidenceId = request.nextUrl.searchParams.get('id');

    if (!evidenceId) {
      return errorResponse('Evidence ID is required.');
    }

    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse('Authentication required.', 401);
    }

    const { data: evidence, error: evidenceError } = await supabase
      .from('ai_governance_registry_evidence')
      .select(
        'id, submission_id, storage_bucket, storage_path, owner_user_id',
      )
      .eq('id', evidenceId)
      .eq('owner_user_id', user.id)
      .single();

    if (evidenceError || !evidence) {
      return errorResponse('Evidence record was not found.', 404);
    }

    const { data: parent, error: parentError } = await supabase
      .from('ai_governance_registry_submissions')
      .select('status, registry_identifier')
      .eq('id', evidence.submission_id)
      .eq('owner_user_id', user.id)
      .single();

    if (parentError || !parent) {
      return errorResponse('Registry draft was not found.', 404);
    }

    if (parent.status !== 'draft' || parent.registry_identifier) {
      return errorResponse(
        'Evidence can only be deleted while the Registry intake remains a private draft.',
        409,
      );
    }

    if (evidence.storage_bucket && evidence.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(evidence.storage_bucket)
        .remove([evidence.storage_path]);

      if (storageError) {
        return errorResponse(
          `Unable to remove the evidence object: ${storageError.message}`,
        );
      }
    }

    const { error: deleteError } = await supabase
      .from('ai_governance_registry_evidence')
      .delete()
      .eq('id', evidence.id)
      .eq('owner_user_id', user.id);

    if (deleteError) {
      return errorResponse(deleteError.message);
    }

    return NextResponse.json({
      ok: true,
      notice: 'The evidence file and its draft metadata were deleted.',
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error
        ? error.message
        : 'Unable to delete Registry evidence.',
      500,
    );
  }
}
