import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

type Touch = {
  referrer_host?: string | null;
  search_engine?: string | null;
  search_query?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  page_path?: string | null;
  country?: string | null;
  device_class?: string | null;
};

function sourceLabel(touch: Touch | null | undefined) {
  if (!touch) return 'Unattributed';
  if (touch.utm_source) return touch.utm_source;
  if (touch.search_engine) return touch.search_engine;
  if (touch.referrer_host) return touch.referrer_host;
  return 'Direct / unattributed';
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!url || !publicKey || !serviceRoleKey) return jsonError('Registration conversion data connection is not configured.', 500);

    const session = createServerClient(url, publicKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(values) { try { for (const { name, value, options } of values) cookieStore.set(name, value, options); } catch {} },
      },
    });
    const { data: { user }, error: userError } = await session.auth.getUser();
    if (userError || !user) return jsonError('Authentication required.', 401);

    const admin = createAdminClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [journeyResult, recoveryResult, attributionResult] = await Promise.all([
      admin.from('ta14_registry_registration_journeys_v1').select('user_id,account_created_at,first_registration_page_opened_at,first_registration_started_at,latest_draft_saved_at,latest_submission_submitted_at,latest_registration_completed_at,latest_submission_created_at,latest_submission_status'),
      admin.from('ta14_registry_registration_recovery_drafts').select('user_id,state,first_saved_at,last_saved_at,submission_id').gte('last_saved_at', since),
      admin.from('ta14_seo_user_attribution').select('user_id,first_seen_at,latest_seen_at,first_touch,latest_touch'),
    ]);

    if (journeyResult.error || recoveryResult.error || attributionResult.error) {
      console.error('TA-14 registration conversion read failed.', { journeyError: journeyResult.error, recoveryError: recoveryResult.error, attributionError: attributionResult.error });
      return jsonError('Unable to load registration conversion intelligence.', 500);
    }

    const journeys = journeyResult.data ?? [];
    const recoveryRows = recoveryResult.data ?? [];
    const attributionRows = attributionResult.data ?? [];
    const inWindow = (value: string | null | undefined) => Boolean(value && value >= since);
    const recoveryUsers = new Set(recoveryRows.map((row) => row.user_id).filter(Boolean));
    const recoveryActiveUsers = new Set(recoveryRows.filter((row) => row.state === 'active').map((row) => row.user_id).filter(Boolean));
    const attributionByUser = new Map(attributionRows.map((row) => [row.user_id, row]));

    const summary = {
      windowDays: 30,
      accountsCreated: journeys.filter((row) => inWindow(row.account_created_at)).length,
      registrationOpened: journeys.filter((row) => inWindow(row.first_registration_page_opened_at)).length,
      registrationStarted: journeys.filter((row) => inWindow(row.first_registration_started_at)).length,
      recoveryPreservedUsers: recoveryUsers.size,
      recoveryCheckpoints: recoveryRows.length,
      activeRecoveryUsers: recoveryActiveUsers.size,
      registryDraftCreated: journeys.filter((row) => inWindow(row.latest_submission_created_at) && row.latest_submission_status === 'draft').length,
      submitted: journeys.filter((row) => inWindow(row.latest_submission_submitted_at)).length,
      registered: journeys.filter((row) => inWindow(row.latest_registration_completed_at)).length,
    };

    const attributedJourneys = journeys
      .filter((journey) => attributionByUser.has(journey.user_id))
      .map((journey) => {
        const attribution = attributionByUser.get(journey.user_id)!;
        const firstTouch = (attribution.first_touch ?? null) as Touch | null;
        const latestTouch = (attribution.latest_touch ?? null) as Touch | null;
        const stage = journey.latest_registration_completed_at ? 'Registered' : journey.latest_submission_submitted_at ? 'Submitted' : journey.latest_submission_created_at ? 'Registry draft' : recoveryUsers.has(journey.user_id) ? 'Recovery preserved' : journey.first_registration_started_at ? 'Started' : journey.first_registration_page_opened_at ? 'Opened' : 'Account';
        return {
          stage,
          source: sourceLabel(firstTouch),
          latestSource: sourceLabel(latestTouch),
          firstPage: firstTouch?.page_path ?? null,
          campaign: firstTouch?.utm_campaign ?? null,
          searchQuery: firstTouch?.search_query ?? null,
          country: firstTouch?.country ?? null,
          device: firstTouch?.device_class ?? null,
          firstSeenAt: attribution.first_seen_at,
          latestSeenAt: attribution.latest_seen_at,
        };
      });

    const sourceMap = new Map<string, { source: string; identities: number; registered: number; submitted: number; recovery: number }>();
    for (const journey of attributedJourneys) {
      const current = sourceMap.get(journey.source) ?? { source: journey.source, identities: 0, registered: 0, submitted: 0, recovery: 0 };
      current.identities += 1;
      if (journey.stage === 'Registered') current.registered += 1;
      if (journey.stage === 'Submitted' || journey.stage === 'Registered') current.submitted += 1;
      if (journey.stage === 'Recovery preserved') current.recovery += 1;
      sourceMap.set(journey.source, current);
    }

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      summary,
      attribution: {
        authenticatedIdentities: attributionRows.length,
        registryJourneysAttributed: attributedJourneys.length,
        sources: [...sourceMap.values()].sort((a, b) => b.registered - a.registered || b.identities - a.identities),
        journeys: attributedJourneys,
      },
      boundary: 'Recovery Preserved is account-backed recovery telemetry only. It is not a Registry draft, submission, registration, approval, certification, or execution authority. Discovery attribution is observational first-touch/latest-touch evidence and does not prove that a source caused conversion. Stage counts are rolling-window observations and are not asserted as a single closed cohort.',
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('TA-14 registration conversion intelligence failed.', error);
    return jsonError('Unable to load registration conversion intelligence.', 500);
  }
}
