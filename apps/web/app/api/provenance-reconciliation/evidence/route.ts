import { createHash, randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createUserClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function service() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('PROVENANCE_CONFIGURATION_MISSING');
  return createServiceClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
function text(v: FormDataEntryValue | null, max = 5000) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
function safeName(name: string) { return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(-180) || 'evidence.bin'; }

export async function POST(req: NextRequest) {
  try {
    const userClient = await createUserClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return NextResponse.json({ error: 'AUTHENTICATION_REQUIRED' }, { status: 401 });
    const form = await req.formData();
    const caseId = text(form.get('caseId'), 80);
    const title = text(form.get('title'), 300);
    const description = text(form.get('description'), 5000) || null;
    const evidenceType = text(form.get('evidenceType'), 60) || 'DOCUMENT';
    const sourceUrl = text(form.get('sourceUrl'), 1200) || null;
    const eventDate = text(form.get('eventDate'), 80) || null;
    const file = form.get('file');
    if (!caseId || !title || !(file instanceof File)) return NextResponse.json({ error: 'CASE_TITLE_AND_FILE_REQUIRED' }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 413 });

    const admin = service();
    const { data: provenanceCase, error: caseError } = await admin.from('ta14_provenance_cases').select('id,owner_user_id,status').eq('id', caseId).maybeSingle();
    if (caseError) throw caseError;
    if (!provenanceCase || provenanceCase.owner_user_id !== user.id) return NextResponse.json({ error: 'CASE_NOT_FOUND' }, { status: 404 });
    if (['FROZEN', 'CLOSED'].includes(String(provenanceCase.status))) return NextResponse.json({ error: 'CASE_EVIDENCE_FROZEN' }, { status: 409 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    const storagePath = `${caseId}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName(file.name)}`;
    const { error: uploadError } = await admin.storage.from('provenance-evidence').upload(storagePath, bytes, { contentType: file.type || 'application/octet-stream', upsert: false });
    if (uploadError) throw uploadError;
    const { data: evidence, error: evidenceError } = await admin.from('ta14_provenance_evidence').insert({
      case_id: caseId, submitted_by_user_id: user.id, evidence_type: evidenceType, title, description, event_date: eventDate, source_url: sourceUrl,
      storage_path: storagePath, sha256, original_filename: file.name, mime_type: file.type || null, byte_size: file.size, evidence_status: 'SUBMITTED'
    }).select('id,title,sha256,evidence_status,created_at').single();
    if (evidenceError) throw evidenceError;
    await admin.from('ta14_provenance_events').insert({ case_id: caseId, event_type: 'EVIDENCE_SUBMITTED', actor_label: 'CLAIMANT', event_summary: `Evidence submitted: ${title}`, event_data: { evidence_id: evidence.id, sha256 } });
    return NextResponse.json({ evidence, boundary: 'Submission preserves an evidence object and hash. It does not make the evidence admissible, prove causation, or establish an adverse finding.' }, { status: 201 });
  } catch (error) {
    console.error('TA14_PROVENANCE_EVIDENCE_ERROR', error);
    return NextResponse.json({ error: 'EVIDENCE_UPLOAD_UNAVAILABLE' }, { status: 503 });
  }
}
