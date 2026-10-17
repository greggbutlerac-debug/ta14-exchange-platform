import 'server-only';
import {createClient as createServiceClient} from '@supabase/supabase-js';
import {createClient as createSessionClient} from '../../../lib/supabase/server';

/**
 * Shared fail-closed administrator gate for referral reads and future writes.
 * The service-role client must never be passed to browser components.
 * Enrollment is intentionally performed outside this application.
 */
export async function requireReferralAdministrator() {
  const session = await createSessionClient();
  const {data:{user},error} = await session.auth.getUser();
  if (error || !user || !user.email_confirmed_at ||
      user.email?.toLowerCase() !== 'ta14admissibleexecution@gmail.com') {
    return {ok:false as const, reason:'Sign in with the verified TA14 administrator account.'};
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return {ok:false as const, reason:'Secure server configuration is incomplete.'};
  }
  const admin = createServiceClient(url,key,{
    auth:{autoRefreshToken:false,persistSession:false}
  });
  // A matching email alone does not confer administrative authority.
  const {data:allow,error:allowError} = await admin
    .from('ta14_open_door_admins')
    .select('user_id')
    .eq('user_id',user.id)
    .maybeSingle();
  if (allowError || !allow) {
    return {ok:false as const, reason:'Administrator enrollment is pending.', userId:user.id};
  }
  return {ok:true as const, user, admin};
}
