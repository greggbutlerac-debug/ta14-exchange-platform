import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function publicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    null
  );
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const key = publicKey();

  if (!supabaseUrl || !key) {
    return NextResponse.json(
      { ok: false, state: 'CONFIGURATION_MISSING' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/rpc/ta14_registry_public_directory_v1`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    );

    const body = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, state: 'UPSTREAM_ERROR', upstreamStatus: response.status },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { ok: false, state: 'INVALID_UPSTREAM_RESPONSE' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { ok: false, state: 'INVALID_UPSTREAM_RESPONSE' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }

    return NextResponse.json(
      { ok: true, state: 'LIVE', publicRecordCount: payload.length, checkedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, state: 'UNAVAILABLE' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
