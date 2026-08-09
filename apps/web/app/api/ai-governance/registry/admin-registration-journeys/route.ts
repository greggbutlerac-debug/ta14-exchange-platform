import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type JourneyRow = {
  user_id: string;
  account_email: string | null;
  account_created_at: string | null;
  last_sign_in_at: string | null;
  first_registration_page_opened_at: string | null;
  first_registration_started_at: string | null;
  latest_draft_saved_at: string | null;
  latest_submission_submitted_at: string | null;
  latest_registration_completed_at: string | null;
  latest_registration_failed_at: string | null;
  lifecycle_event_count: number | null;
  governance_submission_count: number | null;
  latest_submission_status: string | null;
};

function parseReviewerEmails(): Set<string> {
  return new Set(
    (process.env.TA14_REGISTRY_REVIEWER_EMAILS ?? '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

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
          // Read authorization remains valid even if refresh cookies cannot
          // be persisted during this route invocation.
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
      'Registration journey administration is missing Supabase server configuration.',
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

async function requireRegistryAdministrator() {
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

  const reviewerEmail =
    user.email?.trim().toLowerCase() ?? '';

  const authorizedEmails = parseReviewerEmails();

  if (!reviewerEmail || !authorizedEmails.has(reviewerEmail)) {
    return {
      ok: false as const,
      response: jsonError(
        'This account is not authorized to access Registry registration journeys.',
        403,
      ),
    };
  }

  return {
    ok: true as const,
    reviewerEmail,
  };
}

function readLimit(request: NextRequest): number {
  const raw = request.nextUrl.searchParams.get('limit');

  if (!raw) {
    return 100;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    return 100;
  }

  return Math.min(500, Math.max(1, Math.trunc(parsed)));
}

function readSearch(request: NextRequest): string {
  return (
    request.nextUrl.searchParams.get('search')?.trim() ?? ''
  ).slice(0, 200);
}

function normalizeCount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.trunc(parsed));
    }
  }

  return 0;
}

function deriveJourneyState(row: JourneyRow): string {
  if (row.latest_registration_completed_at) {
    return 'registered';
  }

  if (row.latest_submission_submitted_at) {
    return 'submitted';
  }

  if (row.latest_draft_saved_at) {
    return 'draft_saved';
  }

  if (row.latest_registration_failed_at) {
    return 'failed';
  }

  if (row.first_registration_started_at) {
    return 'started';
  }

  if (row.first_registration_page_opened_at) {
    return 'opened';
  }

  return 'account_only';
}

function latestJourneyTimestamp(row: JourneyRow): string | null {
  return (
    row.latest_registration_completed_at ??
    row.latest_submission_submitted_at ??
    row.latest_draft_saved_at ??
    row.latest_registration_failed_at ??
    row.first_registration_started_at ??
    row.first_registration_page_opened_at ??
    row.last_sign_in_at ??
    row.account_created_at ??
    null
  );
}

export async function GET(request: NextRequest) {
  try {
    const authorization =
      await requireRegistryAdministrator();

    if (!authorization.ok) {
      return authorization.response;
    }

    const supabase = createAdminClient();
    const limit = readLimit(request);
    const search = readSearch(request);

    const { data, error } = await supabase
      .from('ta14_registry_registration_journeys_v1')
      .select('*')
      .order('account_created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        'TA-14 Registry registration journey read failed.',
        error,
      );

      return jsonError(
        'Unable to read registration journeys.',
        500,
        error.message,
      );
    }

    let rows = (data ?? []) as unknown as JourneyRow[];

    if (search) {
      const needle = search.toLowerCase();

      rows = rows.filter((row) =>
        [
          row.account_email,
          row.latest_submission_status,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(needle),
          ),
      );
    }

    const journeys = rows
      .map((row) => ({
        userId: row.user_id,
        accountEmail: row.account_email,
        accountCreatedAt: row.account_created_at,
        lastSignInAt: row.last_sign_in_at,
        firstRegistrationPageOpenedAt:
          row.first_registration_page_opened_at,
        firstRegistrationStartedAt:
          row.first_registration_started_at,
        latestDraftSavedAt: row.latest_draft_saved_at,
        latestSubmissionSubmittedAt:
          row.latest_submission_submitted_at,
        latestRegistrationCompletedAt:
          row.latest_registration_completed_at,
        latestRegistrationFailedAt:
          row.latest_registration_failed_at,
        lifecycleEventCount: normalizeCount(
          row.lifecycle_event_count,
        ),
        governanceSubmissionCount: normalizeCount(
          row.governance_submission_count,
        ),
        latestSubmissionStatus:
          row.latest_submission_status,
        journeyState: deriveJourneyState(row),
        latestJourneyAt: latestJourneyTimestamp(row),
      }))
      .sort((a, b) => {
        const aTime = a.latestJourneyAt
          ? new Date(a.latestJourneyAt).getTime()
          : 0;
        const bTime = b.latestJourneyAt
          ? new Date(b.latestJourneyAt).getTime()
          : 0;

        return bTime - aTime;
      });

    const summary = {
      totalAccounts: journeys.length,
      accountOnly: journeys.filter(
        (row) => row.journeyState === 'account_only',
      ).length,
      opened: journeys.filter(
        (row) => row.journeyState === 'opened',
      ).length,
      started: journeys.filter(
        (row) => row.journeyState === 'started',
      ).length,
      draftSaved: journeys.filter(
        (row) => row.journeyState === 'draft_saved',
      ).length,
      submitted: journeys.filter(
        (row) => row.journeyState === 'submitted',
      ).length,
      registered: journeys.filter(
        (row) => row.journeyState === 'registered',
      ).length,
      failed: journeys.filter(
        (row) => row.journeyState === 'failed',
      ).length,
    };

    return NextResponse.json(
      {
        ok: true,
        administrator: {
          email: authorization.reviewerEmail,
        },
        summary,
        journeys,
        boundary:
          'Registration journey telemetry is administrative visibility only. Authoritative registration state remains in the governance Registry submission and registration records.',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error(
      'TA-14 Registry registration journey route failed.',
      error,
    );

    return jsonError(
      error instanceof Error
        ? error.message
        : 'Registration journey administration failed.',
      500,
    );
  }
}
