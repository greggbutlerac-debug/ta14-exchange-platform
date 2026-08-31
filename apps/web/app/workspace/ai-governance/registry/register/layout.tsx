import type { ReactNode } from 'react';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { requireUser } from '../../../../../lib/auth/require-user';
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

type PreSubmissionRecovery = {
  recovery_key: string;
  organization_name: string | null;
  reported_governance_name: string | null;
  failure_type: string;
  recovery_status: string;
  substantive_intake_recovered: boolean;
  substantive_intake_reconstructed: boolean;
  first_known_attempt_at: string | null;
};

async function getRegistrationContext(): Promise<{ recovery: PreSubmissionRecovery | null }> {
  try {
    const cookieStore = await cookies();
    const sessionClient = createSessionClient(cookieStore);
    const adminClient = createAdminClient();
    if (!sessionClient || !adminClient) return { recovery: null };

    const { data: { user }, error: userError } = await sessionClient.auth.getUser();
    if (userError || !user) return { recovery: null };

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
    } else if ((recent ?? []).length === 0) {
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
    }

    const { data: recoveryRows, error: recoveryError } = await adminClient
      .from('ta14_registry_pre_submission_recovery_records')
      .select('recovery_key, organization_name, reported_governance_name, failure_type, recovery_status, substantive_intake_recovered, substantive_intake_reconstructed, first_known_attempt_at')
      .eq('owner_user_id', user.id)
      .eq('recovery_status', 'open')
      .order('recorded_at', { ascending: false })
      .limit(1);

    if (recoveryError) {
      console.error('TA-14 pre-submission recovery lookup failed.', recoveryError);
      return { recovery: null };
    }

    return { recovery: (recoveryRows?.[0] as PreSubmissionRecovery | undefined) ?? null };
  } catch (error) {
    console.error('TA-14 registration context lookup failed open.', error);
    return { recovery: null };
  }
}

export default async function RegistryRegisterLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireUser();
  const { recovery } = await getRegistrationContext();

  return (
    <>
      <RecoveryResponseTransport />
      <aside className="ta14-registry-terms-notice" aria-label="Registry registration terms">
        <div>
          <p>PRE-REGISTRATION PROTECTION &amp; EXAMINATION BOUNDARY · TERMS v0.2</p>
          <strong>Know the authority, evidence, and IP boundary before you submit.</strong>
          <span>Registration does not transfer IP, certify an architecture, grant operational authority, admit undisclosed evidence, or authorize appropriation of another methodology. TA-14 findings remain proposition-bounded and separate from participant authority.</span>
        </div>
        <Link href="/workspace/ai-governance/registry/terms">Review Protection &amp; Examination Terms →</Link>
      </aside>
      {recovery ? (
        <aside className="ta14-registry-recovery-notice" aria-label="Controlled registration recovery">
          <div>
            <p>CONTROLLED REGISTRATION RECOVERY · {recovery.recovery_key}</p>
            <strong>Your earlier registration attempt has an administrative preservation record.</strong>
            <span>
              {recovery.organization_name ? `${recovery.organization_name}: ` : ''}
              TA-14 preserved the earlier attempt and the Exchange-side persistence failure. The missing substantive intake was not recovered and has not been reconstructed. Re-enter only information you can presently verify. A new canonical submission will not erase or rewrite the preserved earlier-attempt record.
            </span>
          </div>
          <div className="ta14-registry-recovery-state">
            <b>RECOVERY OPEN</b>
            <span>Original substantive fields: UNRECOVERED</span>
            <span>Retroactive reconstruction: NOT PERMITTED</span>
          </div>
        </aside>
      ) : null}
      {children}
      <RegistrationMilestoneCelebration />
      <style>{`.ta14-registry-terms-notice,.ta14-registry-recovery-notice{position:relative;z-index:20;width:min(1180px,calc(100% - 32px));margin:18px auto 0;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:22px;border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.2);color:#eef4ff;font-family:Inter,system-ui,sans-serif}.ta14-registry-terms-notice{border:1px solid rgba(127,228,196,.32);background:linear-gradient(135deg,rgba(17,70,60,.94),rgba(11,25,47,.97))}.ta14-registry-terms-notice div,.ta14-registry-recovery-notice>div:first-child{max-width:790px}.ta14-registry-terms-notice p,.ta14-registry-recovery-notice p{margin:0 0 5px;font-size:.66rem;font-weight:900;letter-spacing:.14em}.ta14-registry-terms-notice p{color:#7fe4c4}.ta14-registry-terms-notice strong,.ta14-registry-terms-notice span,.ta14-registry-recovery-notice strong,.ta14-registry-recovery-notice span{display:block}.ta14-registry-terms-notice strong,.ta14-registry-recovery-notice strong{font-size:1rem;margin-bottom:4px}.ta14-registry-terms-notice span,.ta14-registry-recovery-notice span{color:#aebdd4;font-size:.78rem;line-height:1.5}.ta14-registry-terms-notice a{flex:none;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 14px;border-radius:11px;background:linear-gradient(135deg,#7fe4c4,#4da9d8);color:#07101f!important;text-decoration:none;font-size:.8rem;font-weight:900}.ta14-registry-recovery-notice{border:1px solid rgba(255,205,92,.46);background:linear-gradient(135deg,rgba(74,53,12,.96),rgba(22,27,42,.98))}.ta14-registry-recovery-notice p{color:#ffd36d}.ta14-registry-recovery-state{flex:none;min-width:245px;padding:12px 14px;border:1px solid rgba(255,211,109,.28);border-radius:12px;background:rgba(6,12,22,.48)}.ta14-registry-recovery-state b{display:block;color:#ffd36d;font-size:.75rem;letter-spacing:.1em;margin-bottom:6px}.ta14-registry-recovery-state span{font-size:.7rem!important;color:#d7deea!important}@media(max-width:760px){.ta14-registry-terms-notice,.ta14-registry-recovery-notice{align-items:stretch;flex-direction:column}.ta14-registry-terms-notice a{width:100%}.ta14-registry-recovery-state{min-width:0}}`}</style>
    </>
  );
}
