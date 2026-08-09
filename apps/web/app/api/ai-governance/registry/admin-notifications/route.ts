import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type NotificationState = 'unread' | 'acknowledged' | 'resolved';
type NotificationPriority =
  | 'informational'
  | 'attention'
  | 'action_required'
  | 'critical';

type NotificationRow = {
  id: string;
  notification_key: string;
  notification_type: string;
  priority: NotificationPriority;
  state: NotificationState;
  submission_id: string | null;
  registry_identifier: string | null;
  governance_name: string;
  claimant_name: string | null;
  organization_name: string | null;
  requested_review_pathway: string | null;
  title: string;
  message: string;
  event_payload: Record<string, unknown> | null;
  occurred_at: string;
  created_at: string;
  acknowledged_at: string | null;
  acknowledged_by_user_id: string | null;
  resolved_at: string | null;
  resolved_by_user_id: string | null;
};

type NotificationSummaryRow = {
  state: NotificationState;
  priority: NotificationPriority;
};

type UpdateNotificationRequest = {
  notificationId?: string;
  action?: 'acknowledge' | 'resolve' | 'reopen';
};

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function parseReviewerEmails(): Set<string> {
  return new Set(
    (process.env.TA14_REGISTRY_REVIEWER_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
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
          // Route handlers can still validate the current session even when a
          // framework boundary prevents a cookie refresh in this invocation.
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
      'Registry administration environment is not configured. Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    details === undefined ? { error: message } : { error: message, details },
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
        'This account is not authorized to access the TA-14 Registry Administration Inbox.',
        403,
      ),
    };
  }

  return {
    ok: true as const,
    user,
    reviewerEmail,
  };
}

function normalizeLimit(value: string | null): number {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

function normalizeState(value: string | null): NotificationState | null {
  if (
    value === 'unread' ||
    value === 'acknowledged' ||
    value === 'resolved'
  ) {
    return value;
  }

  return null;
}

function buildSummary(rows: NotificationSummaryRow[]) {
  let unreadCount = 0;
  let acknowledgedCount = 0;
  let resolvedCount = 0;
  let actionRequiredCount = 0;

  for (const row of rows) {
    if (row.state === 'unread') unreadCount += 1;
    if (row.state === 'acknowledged') acknowledgedCount += 1;
    if (row.state === 'resolved') resolvedCount += 1;

    if (
      row.state !== 'resolved' &&
      (row.priority === 'action_required' || row.priority === 'critical')
    ) {
      actionRequiredCount += 1;
    }
  }

  return {
    unreadCount,
    acknowledgedCount,
    resolvedCount,
    actionRequiredCount,
    totalCount: rows.length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const authorization = await requireRegistryAdministrator();

    if (!authorization.ok) {
      return authorization.response;
    }

    const adminClient = createAdminClient();
    const state = normalizeState(request.nextUrl.searchParams.get('state'));
    const limit = normalizeLimit(request.nextUrl.searchParams.get('limit'));

    let query = adminClient
      .from('ta14_registry_admin_notifications')
      .select(
        [
          'id',
          'notification_key',
          'notification_type',
          'priority',
          'state',
          'submission_id',
          'registry_identifier',
          'governance_name',
          'claimant_name',
          'organization_name',
          'requested_review_pathway',
          'title',
          'message',
          'event_payload',
          'occurred_at',
          'created_at',
          'acknowledged_at',
          'acknowledged_by_user_id',
          'resolved_at',
          'resolved_by_user_id',
        ].join(','),
      )
      .order('occurred_at', { ascending: false })
      .limit(limit);

    if (state) {
      query = query.eq('state', state);
    }

    const { data, error } = await query;

    if (error) {
      console.error('TA-14 Registry Inbox read failed.', error);
      return jsonError('Unable to load Registry administration notifications.', 500);
    }

    const notifications = (data ?? []) as unknown as NotificationRow[];

    const { data: summaryData, error: summaryError } = await adminClient
      .from('ta14_registry_admin_notifications')
      .select('state,priority');

    if (summaryError) {
      console.error('TA-14 Registry Inbox summary failed.', summaryError);
      return jsonError('Unable to load Registry notification summary.', 500);
    }

    const summaryRows = (summaryData ?? []) as NotificationSummaryRow[];

    return NextResponse.json(
      {
        notifications,
        summary: buildSummary(summaryRows),
        administrator: {
          email: authorization.reviewerEmail,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('TA-14 Registry Inbox GET failed.', error);
    return jsonError('Unable to load the Registry Administration Inbox.', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authorization = await requireRegistryAdministrator();

    if (!authorization.ok) {
      return authorization.response;
    }

    const body = (await request.json()) as UpdateNotificationRequest;
    const notificationId = body.notificationId?.trim();
    const action = body.action;

    if (!notificationId) {
      return jsonError('Notification ID is required.');
    }

    if (
      action !== 'acknowledge' &&
      action !== 'resolve' &&
      action !== 'reopen'
    ) {
      return jsonError('A valid notification action is required.');
    }

    const adminClient = createAdminClient();
    const now = new Date().toISOString();

    const { data: current, error: currentError } = await adminClient
      .from('ta14_registry_admin_notifications')
      .select('id,state')
      .eq('id', notificationId)
      .maybeSingle();

    if (currentError) {
      console.error('TA-14 Registry Inbox notification lookup failed.', currentError);
      return jsonError('Unable to load the requested notification.', 500);
    }

    if (!current) {
      return jsonError('Registry administration notification not found.', 404);
    }

    const updatePayload: Record<string, unknown> = {};

    if (action === 'acknowledge') {
      if (current.state === 'resolved') {
        return jsonError(
          'A resolved notification must be reopened before it can be acknowledged again.',
          409,
        );
      }

      updatePayload.state = 'acknowledged';
      updatePayload.acknowledged_at = now;
      updatePayload.acknowledged_by_user_id = authorization.user.id;
    }

    if (action === 'resolve') {
      updatePayload.state = 'resolved';
      updatePayload.resolved_at = now;
      updatePayload.resolved_by_user_id = authorization.user.id;

      if (current.state === 'unread') {
        updatePayload.acknowledged_at = now;
        updatePayload.acknowledged_by_user_id = authorization.user.id;
      }
    }

    if (action === 'reopen') {
      updatePayload.state = 'unread';
      updatePayload.acknowledged_at = null;
      updatePayload.acknowledged_by_user_id = null;
      updatePayload.resolved_at = null;
      updatePayload.resolved_by_user_id = null;
    }

    const { data: updated, error: updateError } = await adminClient
      .from('ta14_registry_admin_notifications')
      .update(updatePayload)
      .eq('id', notificationId)
      .select('*')
      .single();

    if (updateError) {
      console.error('TA-14 Registry Inbox update failed.', updateError);
      return jsonError('Unable to update the Registry notification.', 500);
    }

    return NextResponse.json(
      {
        notification: updated as NotificationRow,
        action,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch (error) {
    console.error('TA-14 Registry Inbox PATCH failed.', error);
    return jsonError('Unable to update the Registry Administration Inbox.', 500);
  }
}
