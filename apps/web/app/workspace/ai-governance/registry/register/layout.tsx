import type { ReactNode } from 'react';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import RegistrationMilestoneCelebration from './RegistrationMilestoneCelebration';
import RecoveryResponseTransport from './RecoveryResponseTransport';

export const dynamic = 'force-dynamic';

function createSessionClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !publishableKey) return null;

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(values) {
        try {
          for (const { name, value, options } of values) cookieStore.set(name, value, options);
        } catch {
          // This layout only needs authoritative session reads.
        }
      },
    },
  });
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) return null;

  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function preserveServerRegistrationEntry(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const sessionClient = createSessionClient(cookieStore);
    const adminClient = createAdminClient();
    if (!sessionClient || !adminClient) return;

    const { data: { user }, error: userError } = await sessionClient.auth.getUser();
    if (userError || !user) return;

    const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await adminClient
      .from('ta14_registry_registration_lifecycle_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_type', 'registration_page_opened')
      .eq('source', 'server')
      .gte('occurred_at', cutoff)
      .limit(1);

    if (recentError) {
      console.error('TA-14 registration server-awareness dedupe lookup failed.', recentError);
      return;
    }
    if ((recent ?? []).length > 0) return;

    const accountEmail = user.email?.trim().toLowerCase() ?? null;
    const { error: insertError } = await adminClient
      .from('ta14_registry_registration_lifecycle_events')
      .insert({
        user_id: user.id,
        submission_id: null,
        event_type: 'registration_page_opened',
        source: 'server',
        session_key: null,
        governance_name: null,
        organization_name: null,
        contact_email: accountEmail,
        event_payload: {
          account_email: accountEmail,
          route_family: '/workspace/ai-governance/registry/register',
          recorded_by: 'ta14-registration-server-awareness-v1',
          authoritative_boundary: 'This event proves an authenticated account reached the registration route. It does not prove that a draft was created, a submission was completed, or a governance was registered.',
        },
      });

    if (insertError) console.error('TA-14 registration server-awareness event insert failed.', insertError);
  } catch (error) {
    console.error('TA-14 registration server-awareness logging failed open.', error);
  }
}

export default async function RegistryRegisterLayout({ children }: Readonly<{ children: ReactNode }>) {
  await preserveServerRegistrationEntry();

  return (
    <>
      <RecoveryResponseTransport />
      {children}
      <RegistrationMilestoneCelebration />
    </>
  );
}
