import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    if (!url || !key) return jsonError('Registry data connection is not configured.', 500);

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(values) {
          try { for (const { name, value, options } of values) cookieStore.set(name, value, options); } catch {}
        },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return jsonError('Authentication required.', 401);

    const [stateResult, notificationResult, summaryResult] = await Promise.all([
      supabase.rpc('ta14_registry_watch_current_state_v1'),
      supabase.rpc('ta14_registry_admin_notifications_read_v1', { p_limit: 200, p_state: null }),
      supabase.rpc('ta14_registry_admin_notifications_summary_v1'),
    ]);

    if (stateResult.error || notificationResult.error || summaryResult.error) {
      console.error('TA-14 Mission Control Registry Watch read failed.', {
        stateError: stateResult.error,
        notificationError: notificationResult.error,
        summaryError: summaryResult.error,
      });
      return jsonError('Unable to load Registry Watch data.', 500);
    }

    const summaryRow = Array.isArray(summaryResult.data) ? summaryResult.data[0] : summaryResult.data;

    return NextResponse.json({
      currentState: stateResult.data ?? {},
      notifications: notificationResult.data ?? [],
      summary: {
        unreadCount: Number(summaryRow?.unread_count ?? 0),
        acknowledgedCount: Number(summaryRow?.acknowledged_count ?? 0),
        resolvedCount: Number(summaryRow?.resolved_count ?? 0),
        actionRequiredCount: Number(summaryRow?.action_required_count ?? 0),
        totalCount: Number(summaryRow?.total_count ?? 0),
      },
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('TA-14 Mission Control Registry Watch GET failed.', error);
    return jsonError('Unable to load Registry Watch data.', 500);
  }
}
