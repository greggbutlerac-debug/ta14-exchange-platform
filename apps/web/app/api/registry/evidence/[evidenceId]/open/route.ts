import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SIGNED_URL_TTL_SECONDS = 300;

type RouteContext = {
  params: Promise<{
    evidenceId: string;
  }>;
};

type EvidenceRow = {
  id: string;
  original_filename: string;
  storage_bucket: string | null;
  storage_path: string | null;
  source_url: string | null;
};

function createSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not configured.');
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(values) {
        try {
          values.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Existing request cookies remain readable in this route handler.
        }
      },
    },
  });
}

function isSafeExternalUrl(value: string | null): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function noStoreJson(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  const { evidenceId } = await context.params;
  const normalizedEvidenceId = evidenceId.trim();

  if (!normalizedEvidenceId) {
    return noStoreJson(
      {
        error: 'INVALID_EVIDENCE_IDENTIFIER',
        message: 'A Registry evidence identifier is required.',
      },
      400,
    );
  }

  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseClient(cookieStore);

    // RLS is the access-control boundary here. Anonymous readers can resolve
    // only public evidence. Owners and TA-14 reviewers can resolve evidence
    // granted to them by the Registry evidence policies.
    const { data, error } = await supabase
      .from('ai_governance_registry_evidence')
      .select(
        'id, original_filename, storage_bucket, storage_path, source_url',
      )
      .eq('id', normalizedEvidenceId)
      .maybeSingle();

    if (error) {
      return noStoreJson(
        {
          error: 'EVIDENCE_LOOKUP_FAILED',
          message: 'The Registry evidence record could not be opened.',
        },
        500,
      );
    }

    if (!data) {
      return noStoreJson(
        {
          error: 'EVIDENCE_NOT_AVAILABLE',
          message:
            'This evidence record is not available to the current reader.',
        },
        404,
      );
    }

    const evidence = data as EvidenceRow;

    if (evidence.storage_bucket && evidence.storage_path) {
      const { data: signed, error: signedError } = await supabase.storage
        .from(evidence.storage_bucket)
        .createSignedUrl(
          evidence.storage_path,
          SIGNED_URL_TTL_SECONDS,
          {
            download: evidence.original_filename,
          },
        );

      if (!signedError && signed?.signedUrl) {
        return NextResponse.redirect(signed.signedUrl, {
          status: 302,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }
    }

    if (isSafeExternalUrl(evidence.source_url)) {
      return NextResponse.redirect(evidence.source_url, {
        status: 302,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    return noStoreJson(
      {
        error: 'EVIDENCE_OBJECT_UNAVAILABLE',
        message:
          'The evidence metadata is available, but no readable file or source URL is attached.',
      },
      404,
    );
  } catch (caught) {
    return noStoreJson(
      {
        error: 'EVIDENCE_OPEN_FAILED',
        message:
          caught instanceof Error
            ? caught.message
            : 'The Registry evidence service is unavailable.',
      },
      500,
    );
  }
}
