import type { ReactNode } from 'react';
import Link from 'next/link';
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
      <aside className="ta14-registry-terms-notice" aria-label="Registry registration terms">
        <div>
          <p>REGISTRY PARTICIPATION BOUNDARY · TERMS v0.1</p>
          <strong>Review the standing rules before you submit.</strong>
          <span>IP ownership, attribution, confidentiality, evidence handling, licensing, publication, claims and non-claims, and Founding Demonstration boundaries are defined before registration.</span>
        </div>
        <Link href="/workspace/ai-governance/registry/terms">Review Registration &amp; Demonstration Terms →</Link>
      </aside>
      {children}
      <RegistrationMilestoneCelebration />
      <style>{`.ta14-registry-terms-notice{position:relative;z-index:20;width:min(1180px,calc(100% - 32px));margin:18px auto 0;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:22px;border:1px solid rgba(127,228,196,.32);border-radius:16px;background:linear-gradient(135deg,rgba(17,70,60,.94),rgba(11,25,47,.97));box-shadow:0 18px 50px rgba(0,0,0,.2);color:#eef4ff;font-family:Inter,system-ui,sans-serif}.ta14-registry-terms-notice div{max-width:790px}.ta14-registry-terms-notice p{margin:0 0 5px;color:#7fe4c4;font-size:.66rem;font-weight:900;letter-spacing:.14em}.ta14-registry-terms-notice strong,.ta14-registry-terms-notice span{display:block}.ta14-registry-terms-notice strong{font-size:1rem;margin-bottom:4px}.ta14-registry-terms-notice span{color:#aebdd4;font-size:.78rem;line-height:1.5}.ta14-registry-terms-notice a{flex:none;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;border-radius:11px;background:linear-gradient(135deg,#7fe4c4,#4da9d8);color:#07101f!important;text-decoration:none;font-size:.8rem;font-weight:900}@media(max-width:760px){.ta14-registry-terms-notice{align-items:stretch;flex-direction:column}.ta14-registry-terms-notice a{width:100%}}`}</style>
    </>
  );
}
