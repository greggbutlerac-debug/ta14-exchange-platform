import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type JsonRecord = Record<string, unknown>;

type SessionClient = ReturnType<typeof createSessionClient>;

function createSessionClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !publishableKey) throw new Error('Supabase public environment is not configured.');
  return createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Existing session cookies remain authoritative for this request.
        }
      },
    },
  });
}

async function requireUser(): Promise<{ user: NonNullable<Awaited<ReturnType<SessionClient['auth']['getUser']>>['data']['user']>; session: SessionClient } | null> {
  const cookieStore = await cookies();
  const session = createSessionClient(cookieStore);
  const {
    data: { user },
    error,
  } = await session.auth.getUser();
  if (error || !user) return null;
  return { user, session };
}

function cleanText(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null;
  const next = value.trim();
  return next ? next.slice(0, max) : null;
}

function cleanStep(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(13, Math.trunc(n))) : 0;
}

function sanitizePayload(value: unknown): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as JsonRecord;
}

export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { user, session } = auth;
    const { data, error } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .select('*')
      .eq('user_id', user.id)
      .eq('state', 'active')
      .order('last_saved_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ recovery: data ?? null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load registration recovery.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { user, session } = auth;
    const body = sanitizePayload(await request.json());
    const recoveryKey = cleanText(body.recoveryKey, 128);
    if (!recoveryKey || recoveryKey.length < 8) {
      return NextResponse.json({ error: 'Recovery key is required.' }, { status: 400 });
    }

    const form = sanitizePayload(body.form);
    const payload = {
      ...body,
      recoveryKey,
      activeStep: cleanStep(body.activeStep),
    };
    const row = {
      user_id: user.id,
      recovery_key: recoveryKey,
      state: 'active',
      active_step: cleanStep(body.activeStep),
      governance_name: cleanText(form.governanceName, 500),
      organization_name: cleanText(form.organization, 500),
      contact_email: cleanText(form.contactEmail, 320)?.toLowerCase() ?? null,
      draft_payload: payload,
      last_saved_at: new Date().toISOString(),
    };

    const { data, error } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .upsert(row, { onConflict: 'user_id,recovery_key' })
      .select('id, recovery_key, state, active_step, first_saved_at, last_saved_at')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      ok: true,
      recovery: data,
      notice:
        'Incomplete registration preserved to the signed-in account. This is recovery state only, not a Registry submission.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to preserve registration recovery.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireUser();
    if (!auth) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

    const { user, session } = auth;
    const body = sanitizePayload(await request.json());
    const recoveryKey = cleanText(body.recoveryKey, 128);
    const submissionId = cleanText(body.submissionId, 64);
    const state = body.state === 'completed' ? 'completed' : 'promoted';
    if (!recoveryKey) return NextResponse.json({ error: 'Recovery key is required.' }, { status: 400 });

    const changes: JsonRecord = {
      state,
      submission_id: submissionId,
      last_saved_at: new Date().toISOString(),
    };
    if (state === 'promoted') changes.promoted_at = new Date().toISOString();
    if (state === 'completed') changes.completed_at = new Date().toISOString();

    const { data, error } = await session
      .from('ta14_registry_registration_recovery_drafts')
      .update(changes)
      .eq('user_id', user.id)
      .eq('recovery_key', recoveryKey)
      .select('id, state, submission_id, promoted_at, completed_at')
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, recovery: data ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to update registration recovery.' },
      { status: 500 },
    );
  }
}
