import {createClient} from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = {title:'Open Door referral administration | TA14'};

export default async function ReferralAdminPage() {
 const supabase = await createClient();
 const {data:{user},error:authError} = await supabase.auth.getUser();
 if (authError || !user) {
  return <main style={{maxWidth:700,margin:'64px auto',padding:24,fontFamily:'system-ui'}}><h1>TA14 referral administration</h1><p>Sign in with an authorized TA14 account to access this workspace.</p><p>This page does not expose referral records to the public.</p></main>;
 }
 // Important: Being signed in does not confer administrative authority.
 // The private referral ledger intentionally has no authenticated-user SELECT policy.
 // No service-role credentials or mutation functions are exposed to this route.
 return <main style={{maxWidth:780,margin:'64px auto',padding:24,fontFamily:'system-ui'}}>
  <h1>TA14 referral administration</h1>
  <p>Signed in as {user.email ?? 'authenticated account'}.</p>
  <h2>Administrator authorization pending</h2>
  <p>The referral ledger is restricted to trusted server-side administration. Sign-in alone does not authorize access to customer referrals, payment verification, approvals, or redemptions.</p>
  <p>Before this workspace can operate, TA14 must configure an explicit administrator allowlist or role, server-side authorization checks, a payment verification workflow, and a durable audit trail.</p>
  <p>No referral data is displayed or modified on this page.</p>
 </main>;
}
