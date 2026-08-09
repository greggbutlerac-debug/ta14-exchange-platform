import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type DeliverySummaryRow = {
  delivered_count: number | null;
  failed_count: number | null;
  unique_notifications_delivered: number | null;
  latest_attempt_at: string | null;
  latest_delivery_at: string | null;
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
          // Session validation can still proceed if cookie refresh is not
          // writable in this route-handler invocation.
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
      'Registry delivery health is missing Supabase server configuration.',
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
        'This account is not authorized to access TA-14 Registry delivery health.',
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

export async function GET() {
  try {
    const authorization =
      await requireRegistryAdministrator();

    if (!authorization.ok) {
      return authorization.response;
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc(
      'ta14_registry_admin_notification_delivery_summary_v1',
    );

    if (error) {
      console.error(
        'TA-14 Registry notification delivery health read failed.',
        error,
      );

      return jsonError(
        'Unable to read Registry notification delivery health.',
        500,
        error.message,
      );
    }

    const row = (
      Array.isArray(data) ? data[0] : data
    ) as unknown as DeliverySummaryRow | null;

    const deliveredCount = normalizeCount(
      row?.delivered_count,
    );

    const failedCount = normalizeCount(
      row?.failed_count,
    );

    const uniqueNotificationsDelivered =
      normalizeCount(
        row?.unique_notifications_delivered,
      );

    const health =
      failedCount > 0
        ? 'attention'
        : deliveredCount > 0
          ? 'healthy'
          : 'idle';

    return NextResponse.json(
      {
        ok: true,
        administrator: {
          email: authorization.reviewerEmail,
        },
        health,
        summary: {
          deliveredCount,
          failedCount,
          uniqueNotificationsDelivered,
          latestAttemptAt:
            row?.latest_attempt_at ?? null,
          latestDeliveryAt:
            row?.latest_delivery_at ?? null,
        },
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
      'TA-14 Registry delivery health route failed.',
      error,
    );

    return jsonError(
      error instanceof Error
        ? error.message
        : 'Registry delivery health failed.',
      500,
    );
  }
}
