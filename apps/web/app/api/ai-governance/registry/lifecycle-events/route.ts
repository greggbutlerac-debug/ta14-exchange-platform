import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type RegistrationLifecycleEventType =
  | 'registration_page_opened'
  | 'registration_started'
  | 'draft_saved'
  | 'submission_submitted'
  | 'registration_completed'
  | 'registration_failed';

type RegistrationLifecycleSource =
  | 'web'
  | 'api'
  | 'server'
  | 'system';

type RegistrationLifecyclePayload = {
  eventType?: RegistrationLifecycleEventType;
  source?: RegistrationLifecycleSource;
  sessionKey?: string | null;
  submissionId?: string | null;
  governanceName?: string | null;
  organizationName?: string | null;
  contactEmail?: string | null;
  eventPayload?: Record<string, unknown> | null;
};

const ALLOWED_EVENT_TYPES = new Set<RegistrationLifecycleEventType>([
  'registration_page_opened',
  'registration_started',
  'draft_saved',
  'submission_submitted',
  'registration_completed',
  'registration_failed',
]);

const ALLOWED_SOURCES = new Set<RegistrationLifecycleSource>([
  'web',
  'api',
  'server',
  'system',
]);

function createSessionClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !publishableKey) {
    throw new Error('Supabase public environment is not configured.');
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          for (const { name, value, options } of values) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Session validation remains authoritative even when the current
          // route invocation cannot persist refreshed cookies.
        }
      },
    },
  });
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Registration lifecycle telemetry is missing Supabase server configuration.',
    );
  }

  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function jsonError(
  message: string,
  status = 400,
  details?: unknown,
) {
  return NextResponse.json(
    details === undefined
      ? { error: message }
      : { error: message, details },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  );
}

function cleanText(
  value: unknown,
  maxLength: number,
): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function cleanEmail(value: unknown): string | null {
  const cleaned = cleanText(value, 320);

  if (!cleaned) {
    return null;
  }

  return cleaned.toLowerCase();
}

function cleanSessionKey(value: unknown): string | null {
  const cleaned = cleanText(value, 128);

  if (!cleaned) {
    return null;
  }

  return cleaned.replace(/[^a-zA-Z0-9._:-]/g, '');
}

function cleanEventPayload(
  value: unknown,
): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const entries = Object.entries(
    value as Record<string, unknown>,
  ).slice(0, 40);

  const sanitized: Record<string, unknown> = {};

  for (const [key, rawValue] of entries) {
    if (
      key.toLowerCase().includes('password') ||
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('credential')
    ) {
      continue;
    }

    if (
      typeof rawValue === 'string' ||
      typeof rawValue === 'number' ||
      typeof rawValue === 'boolean' ||
      rawValue === null
    ) {
      sanitized[key.slice(0, 80)] = rawValue;
      continue;
    }

    if (Array.isArray(rawValue)) {
      sanitized[key.slice(0, 80)] = rawValue
        .slice(0, 20)
        .map((item) =>
          typeof item === 'string'
            ? item.slice(0, 500)
            : item,
        );
      continue;
    }

    if (typeof rawValue === 'object') {
      sanitized[key.slice(0, 80)] = rawValue;
    }
  }

  return sanitized;
}

async function requireAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionClient = createSessionClient(cookieStore);

  const {
    data: { user },
    error,
  } = await sessionClient.auth.getUser();

  if (error || !user) {
    return {
      ok: false as const,
      response: jsonError('Authentication required.', 401),
    };
  }

  return {
    ok: true as const,
    user,
  };
}

async function verifySubmissionOwnership(args: {
  submissionId: string;
  userId: string;
}) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('ai_governance_registry_submissions')
    .select('id, owner_user_id')
    .eq('id', args.submissionId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Unable to verify governance submission ownership: ${error.message}`,
    );
  }

  if (!data) {
    return false;
  }

  const row = data as unknown as {
    id: string;
    owner_user_id: string | null;
  };

  return row.owner_user_id === args.userId;
}

export async function POST(request: NextRequest) {
  try {
    const authorization = await requireAuthenticatedUser();

    if (!authorization.ok) {
      return authorization.response;
    }

    const body =
      (await request.json().catch(() => null)) as
        | RegistrationLifecyclePayload
        | null;

    if (!body) {
      return jsonError('A JSON request body is required.', 400);
    }

    const eventType = body.eventType;

    if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
      return jsonError('Unsupported registration lifecycle event.', 400);
    }

    const source =
      body.source && ALLOWED_SOURCES.has(body.source)
        ? body.source
        : 'web';

    const submissionId = cleanText(body.submissionId, 64);

    if (submissionId) {
      const ownsSubmission = await verifySubmissionOwnership({
        submissionId,
        userId: authorization.user.id,
      });

      if (!ownsSubmission) {
        return jsonError(
          'The referenced governance submission does not belong to this account.',
          403,
        );
      }
    }

    const accountEmail =
      authorization.user.email?.trim().toLowerCase() ?? null;

    const requestedContactEmail = cleanEmail(body.contactEmail);

    const contactEmail =
      requestedContactEmail ?? accountEmail;

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('ta14_registry_registration_lifecycle_events')
      .insert({
        user_id: authorization.user.id,
        submission_id: submissionId,
        event_type: eventType,
        source,
        session_key: cleanSessionKey(body.sessionKey),
        governance_name: cleanText(body.governanceName, 500),
        organization_name: cleanText(
          body.organizationName,
          500,
        ),
        contact_email: contactEmail,
        event_payload: {
          ...cleanEventPayload(body.eventPayload),
          account_email: accountEmail,
          recorded_by:
            'ta14-registration-lifecycle-api-v1',
        },
      })
      .select(
        [
          'id',
          'event_type',
          'submission_id',
          'occurred_at',
        ].join(','),
      )
      .single();

    if (error) {
      console.error(
        'TA-14 registration lifecycle event insert failed.',
        error,
      );

      return jsonError(
        'Unable to preserve registration lifecycle event.',
        500,
        error.message,
      );
    }

    return NextResponse.json(
      {
        ok: true,
        event: data,
        boundary:
          'Registration lifecycle telemetry is administrative visibility only. It is not a governance submission, registration, approval, certification, endorsement, or finding.',
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error(
      'TA-14 registration lifecycle telemetry route failed.',
      error,
    );

    return jsonError(
      error instanceof Error
        ? error.message
        : 'Registration lifecycle telemetry failed.',
      500,
    );
  }
}
