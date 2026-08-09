import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type RegistryAdminNotificationRow = {
  id: string;
  notification_type: string;
  registry_identifier: string | null;
  governance_name: string;
  occurred_at: string;
};

type DeliveryHistoryRow = {
  id: string;
  notification_id: string;
  channel: string;
  provider: string;
  recipient: string;
  delivery_state: 'delivered' | 'failed';
  provider_message_id: string | null;
  failure_reason: string | null;
  attempted_at: string;
  delivered_at: string | null;
  created_at: string;
};

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
          // Route handlers may validate a session even when refresh cookies
          // cannot be written during the current invocation.
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
      'Registry delivery history is missing Supabase server configuration.',
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
        'This account is not authorized to access TA-14 Registry delivery history.',
        403,
      ),
    };
  }

  return {
    ok: true as const,
    reviewerEmail,
  };
}

function readNotificationId(request: NextRequest): string | null {
  const value =
    request.nextUrl.searchParams
      .get('notificationId')
      ?.trim() ?? '';

  return value || null;
}

function readLimit(request: NextRequest): number {
  const raw = request.nextUrl.searchParams.get('limit');

  if (!raw) {
    return 25;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed)) {
    return 25;
  }

  return Math.min(100, Math.max(1, Math.trunc(parsed)));
}

export async function GET(request: NextRequest) {
  try {
    const authorization =
      await requireRegistryAdministrator();

    if (!authorization.ok) {
      return authorization.response;
    }

    const notificationId = readNotificationId(request);

    if (!notificationId) {
      return jsonError('notificationId is required.', 400);
    }

    const limit = readLimit(request);
    const supabase = createAdminClient();

    const {
      data: notification,
      error: notificationError,
    } = await supabase
      .from('ta14_registry_admin_notifications')
      .select(
        [
          'id',
          'notification_type',
          'registry_identifier',
          'governance_name',
          'occurred_at',
        ].join(','),
      )
      .eq('id', notificationId)
      .maybeSingle();

    if (notificationError) {
      console.error(
        'TA-14 Registry delivery history notification lookup failed.',
        notificationError,
      );

      return jsonError(
        'The Registry notification could not be verified.',
        500,
        notificationError.message,
      );
    }

    if (!notification) {
      return jsonError('Registry notification not found.', 404);
    }

    const verifiedNotification =
      notification as unknown as RegistryAdminNotificationRow;

    const { data, error } = await supabase.rpc(
      'ta14_registry_admin_notification_delivery_history_v1',
      {
        p_notification_id: notificationId,
        p_limit: limit,
      },
    );

    if (error) {
      console.error(
        'TA-14 Registry notification delivery history read failed.',
        error,
      );

      return jsonError(
        'Unable to read notification delivery history.',
        500,
        error.message,
      );
    }

    const history =
      (data ?? []) as unknown as DeliveryHistoryRow[];

    const deliveredAttempts = history.filter(
      (row) => row.delivery_state === 'delivered',
    );

    const failedAttempts = history.filter(
      (row) => row.delivery_state === 'failed',
    );

    const recipientsDelivered = Array.from(
      new Set(
        deliveredAttempts.map((row) =>
          row.recipient.trim().toLowerCase(),
        ),
      ),
    );

    const status =
      deliveredAttempts.length > 0
        ? 'delivered'
        : failedAttempts.length > 0
          ? 'failed'
          : 'not_attempted';

    return NextResponse.json(
      {
        ok: true,
        administrator: {
          email: authorization.reviewerEmail,
        },
        notification: {
          id: verifiedNotification.id,
          notificationType:
            verifiedNotification.notification_type,
          registryIdentifier:
            verifiedNotification.registry_identifier,
          governanceName:
            verifiedNotification.governance_name,
          occurredAt:
            verifiedNotification.occurred_at,
        },
        delivery: {
          status,
          deliveredCount: deliveredAttempts.length,
          failedCount: failedAttempts.length,
          recipientsDelivered,
          latestAttemptAt:
            history[0]?.attempted_at ?? null,
          latestDeliveredAt:
            deliveredAttempts[0]?.delivered_at ?? null,
        },
        history,
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
      'TA-14 Registry delivery history route failed.',
      error,
    );

    return jsonError(
      error instanceof Error
        ? error.message
        : 'Registry delivery history failed.',
      500,
    );
  }
}
