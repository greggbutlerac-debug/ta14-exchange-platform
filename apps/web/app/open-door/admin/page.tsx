import {createClient as createServiceClient} from '@supabase/supabase-js';
import {createClient} from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';
export const metadata = {title:'Open Door referral administration | TA14'};

type ReferralRow = {
 id:string; referring_entity_id:string; referred_entity_id:string;
 qualifying_engagement_id:string; paid_amount_cents:number;
 entitlement_cents:number; redeemed_cents:number; eligibility_status:string;
};

export default async function ReferralAdminPage() {
 const sessionClient = await createClient();
 const {data:{user},error:authError} = await sessionClient.auth.getUser();
 const shell = (heading:string,detail:string) => <main style={{maxWidth:800,margin:'64px auto',padding:24,fontFamily:'system-ui'}}><h1>TA14 referral administration</h1><h2>{heading}</h2><p>{detail}</p></main>;
 if (authError || !user) return shell('Sign-in required','Sign in with a verified TA14 administrator account. Referral records are not public.');

 const primaryAdminEmail = 'ta14admissibleexecution@gmail.com';
 if (user.email?.toLowerCase() !== primaryAdminEmail || !user.email_confirmed_at) {
  return shell('Account not eligible','The primary TA14 administrator must sign in with the verified TA14 email address.');
 }

 // Server-only credentials; do not use NEXT_PUBLIC_ for the service-role key.
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if (!url || !key) return shell('Administrative access unavailable','Secure server configuration is not yet complete.');
 const admin=createServiceClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:allowed,error:allowError}=await admin.from('ta14_open_door_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if (allowError || !allowed) return <main style={{maxWidth:800,margin:'64px auto',padding:24,fontFamily:'system-ui'}}><h1>TA14 referral administration</h1><h2>Administrator enrollment pending</h2><p>Your TA14 email has been verified by the authentication provider, but this account has not yet been granted administrator privileges.</p><p>For secure enrollment, a trusted database administrator must match the authenticated user ID below to the verified Supabase account before adding it to the private administrator allowlist.</p><p><strong>Authenticated user ID:</strong> <code>{user.id}</code></p><p>Do not send passwords, login codes, or service-role credentials. This page does not grant itself access.</p></main>;

 const {data:rows,error:readError}=await admin.from('ta14_open_door_referral_entitlements')
  .select('id,referring_entity_id,referred_entity_id,qualifying_engagement_id,paid_amount_cents,entitlement_cents,redeemed_cents,eligibility_status')
  .order('created_at',{ascending:false}).limit(50);
 if (readError) return shell('Records unavailable','The authorized records could not be loaded. No changes were made.');
 const money=(cents:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
 return <main style={{maxWidth:1100,margin:'48px auto',padding:24,fontFamily:'system-ui'}}>
  <h1>TA14 Pay It Forward — referral administration</h1>
  <p>Authorized account: {user.email}. Read-only ledger review; payment verification, approvals and redemptions are not yet enabled in this interface.</p>
  <div style={{overflowX:'auto'}}>
   <table style={{borderCollapse:'collapse',width:'100%',textAlign:'left'}}>
    <thead><tr>{['Referrer','Referred entity','Engagement','Status','Paid','Earned','Remaining'].map(x=><th key={x} style={{padding:12,borderBottom:'2px solid #64748b'}}>{x}</th>)}</tr></thead>
    <tbody>{(rows as ReferralRow[]|null)?.map(r=><tr key={r.id}>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.referring_entity_id}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.referred_entity_id}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.qualifying_engagement_id}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.eligibility_status}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{money(r.paid_amount_cents)}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{money(r.entitlement_cents)}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{money(r.entitlement_cents-r.redeemed_cents)}</td>
    </tr>)}</tbody>
   </table>
  </div>
  {(!rows || rows.length===0)&&<p>No referral entitlements have been recorded.</p>}
  <p style={{marginTop:24}}>Only the 50 most recent entries are shown. This page does not award or redeem services.</p>
 </main>;
}
