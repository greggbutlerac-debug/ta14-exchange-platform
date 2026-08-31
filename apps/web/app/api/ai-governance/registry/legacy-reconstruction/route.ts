import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const PROVENANCE_BOUNDARY = {
  originalSubstantivePayloadRecovered: false,
  reconstructedPayloadIsOriginalServerRecord: false,
  originalAttemptTimestampPreserved: true,
  reconstructionTimestampPreserved: true,
} as const;

function createSessionClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new Error('Supabase public environment is not configured.');
  return createServerClient(url, key, { cookies: { getAll: () => cookieStore.getAll(), setAll(values) { try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {} } } });
}

async function requireUser() {
  const cookieStore = await cookies();
  const session = createSessionClient(cookieStore);
  const { data: { user }, error } = await session.auth.getUser();
  return error || !user ? null : { user, session };
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export async function GET() {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').select('*').eq('owner_user_id', user.id).order('reconstructed_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ reconstructions: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const body = record(await request.json());
  const recoveryRecordId = typeof body.recoveryRecordId === 'string' ? body.recoveryRecordId.trim() : '';
  const reconstructedPayload = record(body.reconstructedPayload);
  if (!recoveryRecordId) return NextResponse.json({ error: 'Recovery record ID is required.' }, { status: 400 });

  const { data: recovery, error: recoveryError } = await session.from('ta14_registry_pre_submission_recovery_records').select('id,owner_user_id,first_known_attempt_at,failure_type,recovery_status').eq('id', recoveryRecordId).eq('owner_user_id', user.id).maybeSingle();
  if (recoveryError || !recovery) return NextResponse.json({ error: 'Eligible recovery record was not found for this account.' }, { status: 404 });
  if (!recovery.first_known_attempt_at) return NextResponse.json({ error: 'Original attempt timestamp is required before reconstruction.' }, { status: 409 });

  const row = {
    recovery_record_id: recovery.id,
    owner_user_id: user.id,
    status: 'RECONSTRUCTION_IN_PROGRESS',
    original_attempt_at: recovery.first_known_attempt_at,
    original_failure_type: recovery.failure_type,
    reconstructed_payload: reconstructedPayload,
    provenance_boundary: PROVENANCE_BOUNDARY,
  };
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').upsert(row, { onConflict: 'recovery_record_id' }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, reconstruction: data, notice: 'Reconstructed information is preserved as participant-supplied replacement evidence. It is not represented as the original lost server record.' });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireUser();
  if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const { user, session } = auth;
  const body = record(await request.json());
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  if (!id) return NextResponse.json({ error: 'Reconstruction ID is required.' }, { status: 400 });
  if (body.action !== 'confirm') return NextResponse.json({ error: 'Unsupported reconstruction action.' }, { status: 400 });
  const now = new Date().toISOString();
  const { data, error } = await session.from('ta14_registry_legacy_registration_reconstructions').update({ status: 'PARTICIPANT_CONFIRMED', participant_confirmed_at: now, provenance_boundary: PROVENANCE_BOUNDARY }).eq('id', id).eq('owner_user_id', user.id).eq('status', 'RECONSTRUCTION_IN_PROGRESS').select('*').maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'Only an in-progress reconstruction owned by this account can be confirmed.' }, { status: 409 });
  return NextResponse.json({ ok: true, reconstruction: data });
}
