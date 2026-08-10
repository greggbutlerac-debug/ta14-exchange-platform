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
  lifecycle_event_count: number | string | null;
  governance_submission_count: number | string | null;
  latest_submission_id: string | null;
  latest_submission_status: string | null;
  latest_submission_created_at: string | null;
  latest_submission_updated_at: string | null;
  latest_authoritative_submission_submitted_at: string | null;
  latest_submission_accepted_at: string | null;
  latest_registry_identifier: string | null;
  latest_governance_name: string | null;
  latest_organization_name: string | null;
  latest_claimant_name: string | null;
  latest_contact_email: string | null;
  latest_requested_review_pathway: string | null;
};

type JourneyState =
  | 'registered'
  | 'submitted'
  | 'draft_saved'
  | 'failed'
  | 'started'
  | 'opened'
  | 'account_only';

type AttentionState =
  | 'none'
  | 'failed'
  | 'stalled'
  | 'in_progress';

const STALLED_AFTER_MS = 24 * 60 * 60 * 1000;

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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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

  const reviewerEmail = user.email?.trim().toLowerCase() ?? '';
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

  if (!raw) return 250;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 250;

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

function deriveJourneyState(row: JourneyRow): JourneyState {
  if (
    row.latest_registration_completed_at ||
    (row.latest_submission_status === 'registered' &&
      row.latest_registry_identifier)
  ) {
    return 'registered';
  }

  if (
    row.latest_submission_submitted_at ||
    row.latest_authoritative_submission_submitted_at ||
    ['submitted', 'under_review', 'hold', 'escalated', 'accepted', 'disputed'].includes(
      row.latest_submission_status ?? '',
    )
  ) {
    return 'submitted';
  }

  if (row.latest_draft_saved_at || row.latest_submission_status === 'draft') {
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
    row.latest_submission_accepted_at ??
    row.latest_authoritative_submission_submitted_at ??
    row.latest_submission_submitted_at ??
    row.latest_submission_updated_at ??
    row.latest_draft_saved_at ??
    row.latest_registration_failed_at ??
    row.first_registration_started_at ??
    row.first_registration_page_opened_at ??
    row.last_sign_in_at ??
    row.account_created_at ??
    null
  );
}

function deriveAttentionState(
  journeyState: JourneyState,
  latestJourneyAt: string | null,
): AttentionState {
  if (journeyState === 'registered' || journeyState === 'submitted') {
    return 'none';
  }

  if (journeyState === 'failed') {
    return 'failed';
  }

  if (!latestJourneyAt) {
    return 'in_progress';
  }

  const timestamp = new Date(latestJourneyAt).getTime();

  if (!Number.isFinite(timestamp)) {
    return 'in_progress';
  }

  if (Date.now() - timestamp >= STALLED_AFTER_MS) {
    return 'stalled';
  }

  return 'in_progress';
}

export async function GET(request: NextRequest) {
  try {
    const authorization = await requireRegistryAdministrator();

    if (!authorization.ok) {
      return authorization.response;
    }

    const supabase = createAdminClient();
    const limit = readLimit(request);
    const search = readSearch(request);

    const { data: viewData, error: viewError } = await supabase
      .from('ta14_registry_registration_journeys_v1')
      .select('*')
      .order('account_created_at', { ascending: false })
      .limit(limit);

    let rows: JourneyRow[];
    let dataSource: 'journey_view' | 'direct_fallback' = 'journey_view';
    let fallbackWarning: string | null = null;

    if (!viewError) {
      rows = (viewData ?? []) as unknown as JourneyRow[];
    } else {
      console.warn(
        'TA-14 Registry journey view unavailable; using direct fallback.',
        viewError,
      );

      dataSource = 'direct_fallback';
      fallbackWarning = viewError.message;

      const [eventsResult, submissionsResult, usersResult] = await Promise.all([
        supabase
          .from('ta14_registry_registration_lifecycle_events')
          .select(
            'user_id,event_type,occurred_at,submission_id,governance_name,organization_name,contact_email',
          )
          .order('occurred_at', { ascending: false })
          .limit(5000),
        supabase
          .from('ai_governance_registry_submissions')
          .select(
            'id,owner_user_id,status,created_at,updated_at,submitted_at,accepted_at,registry_identifier,governance_name,organization_name,claimant_name,contact_email,requested_review_pathway',
          )
          .not('owner_user_id', 'is', null)
          .order('created_at', { ascending: false })
          .limit(2000),
        supabase.auth.admin.listUsers({
          page: 1,
          perPage: Math.max(limit, 500),
        }),
      ]);

      if (submissionsResult.error) {
        console.error(
          'TA-14 Registry fallback submission read failed.',
          submissionsResult.error,
        );

        return jsonError(
          'Unable to read registration journeys.',
          500,
          `Journey view failed: ${viewError.message}; submission fallback failed: ${submissionsResult.error.message}`,
        );
      }

      const lifecycleEvents = eventsResult.error
        ? []
        : (eventsResult.data ?? []);

      if (eventsResult.error) {
        console.warn(
          'TA-14 Registry lifecycle telemetry unavailable in fallback.',
          eventsResult.error,
        );
      }

      const authUsers = usersResult.error
        ? []
        : (usersResult.data?.users ?? []);

      if (usersResult.error) {
        console.warn(
          'TA-14 Registry account listing unavailable in fallback.',
          usersResult.error,
        );
      }

      type MutableJourney = JourneyRow & {
        _latestSubmissionCreatedAtMs?: number;
      };

      const byUserId = new Map<string, MutableJourney>();

      const ensureRow = (userId: string): MutableJourney => {
        const existing = byUserId.get(userId);
        if (existing) return existing;

        const created: MutableJourney = {
          user_id: userId,
          account_email: null,
          account_created_at: null,
          last_sign_in_at: null,
          first_registration_page_opened_at: null,
          first_registration_started_at: null,
          latest_draft_saved_at: null,
          latest_submission_submitted_at: null,
          latest_registration_completed_at: null,
          latest_registration_failed_at: null,
          lifecycle_event_count: 0,
          governance_submission_count: 0,
          latest_submission_id: null,
          latest_submission_status: null,
          latest_submission_created_at: null,
          latest_submission_updated_at: null,
          latest_authoritative_submission_submitted_at: null,
          latest_submission_accepted_at: null,
          latest_registry_identifier: null,
          latest_governance_name: null,
          latest_organization_name: null,
          latest_claimant_name: null,
          latest_contact_email: null,
          latest_requested_review_pathway: null,
        };

        byUserId.set(userId, created);
        return created;
      };

      for (const user of authUsers) {
        const row = ensureRow(user.id);
        row.account_email = user.email ?? null;
        row.account_created_at = user.created_at ?? null;
        row.last_sign_in_at = user.last_sign_in_at ?? null;
      }

      for (const event of lifecycleEvents) {
        if (!event.user_id) continue;
        const row = ensureRow(event.user_id);
        row.lifecycle_event_count = normalizeCount(row.lifecycle_event_count) + 1;

        const occurredAt = event.occurred_at ?? null;
        switch (event.event_type) {
          case 'registration_page_opened':
            if (
              occurredAt &&
              (!row.first_registration_page_opened_at ||
                new Date(occurredAt).getTime() <
                  new Date(row.first_registration_page_opened_at).getTime())
            ) {
              row.first_registration_page_opened_at = occurredAt;
            }
            break;
          case 'registration_started':
            if (
              occurredAt &&
              (!row.first_registration_started_at ||
                new Date(occurredAt).getTime() <
                  new Date(row.first_registration_started_at).getTime())
            ) {
              row.first_registration_started_at = occurredAt;
            }
            break;
          case 'draft_saved':
            if (
              occurredAt &&
              (!row.latest_draft_saved_at ||
                new Date(occurredAt).getTime() >
                  new Date(row.latest_draft_saved_at).getTime())
            ) {
              row.latest_draft_saved_at = occurredAt;
            }
            break;
          case 'submission_submitted':
            if (
              occurredAt &&
              (!row.latest_submission_submitted_at ||
                new Date(occurredAt).getTime() >
                  new Date(row.latest_submission_submitted_at).getTime())
            ) {
              row.latest_submission_submitted_at = occurredAt;
            }
            break;
          case 'registration_completed':
            if (
              occurredAt &&
              (!row.latest_registration_completed_at ||
                new Date(occurredAt).getTime() >
                  new Date(row.latest_registration_completed_at).getTime())
            ) {
              row.latest_registration_completed_at = occurredAt;
            }
            break;
          case 'registration_failed':
            if (
              occurredAt &&
              (!row.latest_registration_failed_at ||
                new Date(occurredAt).getTime() >
                  new Date(row.latest_registration_failed_at).getTime())
            ) {
              row.latest_registration_failed_at = occurredAt;
            }
            break;
        }

        if (!row.latest_governance_name && event.governance_name) {
          row.latest_governance_name = event.governance_name;
        }
        if (!row.latest_organization_name && event.organization_name) {
          row.latest_organization_name = event.organization_name;
        }
        if (!row.latest_contact_email && event.contact_email) {
          row.latest_contact_email = event.contact_email;
        }
      }

      for (const submission of submissionsResult.data ?? []) {
        if (!submission.owner_user_id) continue;
        const row = ensureRow(submission.owner_user_id);
        row.governance_submission_count =
          normalizeCount(row.governance_submission_count) + 1;

        const createdAtMs = submission.created_at
          ? new Date(submission.created_at).getTime()
          : 0;

        if (
          row._latestSubmissionCreatedAtMs === undefined ||
          createdAtMs > row._latestSubmissionCreatedAtMs
        ) {
          row._latestSubmissionCreatedAtMs = createdAtMs;
          row.latest_submission_id = submission.id;
          row.latest_submission_status = submission.status;
          row.latest_submission_created_at = submission.created_at;
          row.latest_submission_updated_at = submission.updated_at;
          row.latest_authoritative_submission_submitted_at =
            submission.submitted_at;
          row.latest_submission_accepted_at = submission.accepted_at;
          row.latest_registry_identifier = submission.registry_identifier;
          row.latest_governance_name = submission.governance_name;
          row.latest_organization_name = submission.organization_name;
          row.latest_claimant_name = submission.claimant_name;
          row.latest_contact_email = submission.contact_email;
          row.latest_requested_review_pathway =
            submission.requested_review_pathway;
        }
      }

      rows = Array.from(byUserId.values())
        .sort((a, b) => {
          const aTime = a.account_created_at
            ? new Date(a.account_created_at).getTime()
            : 0;
          const bTime = b.account_created_at
            ? new Date(b.account_created_at).getTime()
            : 0;
          return bTime - aTime;
        })
        .slice(0, limit)
        .map(({ _latestSubmissionCreatedAtMs: _ignored, ...row }) => row);
    }

    if (search) {
      const needle = search.toLowerCase();

      rows = rows.filter((row) =>
        [
          row.account_email,
          row.latest_contact_email,
          row.latest_governance_name,
          row.latest_organization_name,
          row.latest_claimant_name,
          row.latest_registry_identifier,
          row.latest_submission_status,
          row.latest_requested_review_pathway,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(needle),
          ),
      );
    }

    const journeys = rows
      .map((row) => {
        const journeyState = deriveJourneyState(row);
        const latestJourneyAt = latestJourneyTimestamp(row);
        const attentionState = deriveAttentionState(
          journeyState,
          latestJourneyAt,
        );

        return {
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
            row.latest_submission_submitted_at ??
            row.latest_authoritative_submission_submitted_at,
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
          latestSubmissionId: row.latest_submission_id,
          latestSubmissionStatus: row.latest_submission_status,
          latestSubmissionCreatedAt:
            row.latest_submission_created_at,
          latestSubmissionUpdatedAt:
            row.latest_submission_updated_at,
          latestSubmissionAcceptedAt:
            row.latest_submission_accepted_at,
          registryIdentifier: row.latest_registry_identifier,
          governanceName: row.latest_governance_name,
          organizationName: row.latest_organization_name,
          claimantName: row.latest_claimant_name,
          contactEmail: row.latest_contact_email,
          requestedReviewPathway:
            row.latest_requested_review_pathway,
          journeyState,
          latestJourneyAt,
          attentionState,
          needsAttention: attentionState !== 'none',
        };
      })
      .sort((a, b) => {
        if (a.needsAttention !== b.needsAttention) {
          return a.needsAttention ? -1 : 1;
        }

        const priority = (state: AttentionState) => {
          if (state === 'failed') return 0;
          if (state === 'stalled') return 1;
          if (state === 'in_progress') return 2;
          return 3;
        };

        const priorityDifference =
          priority(a.attentionState) - priority(b.attentionState);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

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
        (row) => row.attentionState === 'failed',
      ).length,
      stalled: journeys.filter(
        (row) => row.attentionState === 'stalled',
      ).length,
      inProgress: journeys.filter(
        (row) => row.attentionState === 'in_progress',
      ).length,
      needsAttention: journeys.filter(
        (row) => row.needsAttention,
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
        diagnostics: {
          dataSource,
          fallbackWarning,
        },
        attentionPolicy: {
          stalledAfterHours: 24,
          explanation:
            'A journey needs attention when registration has not reached submitted or registered state. Failed attempts are immediate attention; incomplete journeys become stalled after 24 hours without newer activity.',
        },
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
