import {requireReferralAdministrator} from './authorization';

export const dynamic = 'force-dynamic';
export const metadata = {title:'Open Door referral administration | TA14'};

type ReferralRow = {
 id:string; referring_entity_id:string; referred_entity_id:string;
 qualifying_engagement_id:string; paid_amount_cents:number;
 entitlement_cents:number; redeemed_cents:number; eligibility_status:string; paid_verified_at:string|null;
};

export default async function ReferralAdminPage() {
 const gate = await requireReferralAdministrator();
 const shell = (heading:string,detail:string) => <main style={{maxWidth:800,margin:'64px auto',padding:24,fontFamily:'system-ui'}}><h1>TA14 referral administration</h1><h2>{heading}</h2><p>{detail}</p></main>;
 if (!gate.ok) return <main style={{maxWidth:800,margin:'64px auto',padding:24,fontFamily:'system-ui'}}><h1>TA14 referral administration</h1><h2>Access restricted</h2><p>{gate.reason}</p>{'userId' in gate && gate.userId && <p>Authenticated subject ID: <code>{gate.userId}</code></p>}</main>;
 const {admin,user} = gate;
 const {data:rows,error:readError}=await admin.from('ta14_open_door_referral_entitlements')
  .select('id,referring_entity_id,referred_entity_id,qualifying_engagement_id,paid_amount_cents,entitlement_cents,redeemed_cents,eligibility_status,paid_verified_at')
  .order('created_at',{ascending:false}).limit(50);
 if (readError) return shell('Records unavailable','The authorized records could not be loaded. No changes were made.');
 const money=(cents:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
 return <main style={{maxWidth:1100,margin:'48px auto',padding:24,fontFamily:'system-ui'}}>
  <h1>TA14 Pay It Forward — referral administration</h1>
  <p>Authorized account: {user.email}. Read-only evidence and entitlement review. Approval and redemption controls remain on HOLD until independently verified payment and service-order records are linked.</p>
  <div style={{overflowX:'auto'}}>
   <table style={{borderCollapse:'collapse',width:'100%',textAlign:'left'}}>
    <thead><tr>{['Referrer','Referred entity','Engagement','Status','Payment evidence','Approval gate','Paid','Earned','Remaining'].map(x=><th key={x} style={{padding:12,borderBottom:'2px solid #64748b'}}>{x}</th>)}</tr></thead>
    <tbody>{(rows as ReferralRow[]|null)?.map(r=><tr key={r.id}>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.referring_entity_id}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.referred_entity_id}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.qualifying_engagement_id}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.eligibility_status}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{r.paid_verified_at ? 'Verification timestamp recorded; source linkage not established' : 'Not recorded'}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}><strong>HOLD</strong><div style={{fontSize:12}}>Independent payment and referral evidence review required</div></td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{money(r.paid_amount_cents)}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{money(r.entitlement_cents)}</td>
     <td style={{padding:10,borderBottom:'1px solid #ddd'}}>{money(r.entitlement_cents-r.redeemed_cents)}</td>
    </tr>)}</tbody>
   </table>
  </div>
  {(!rows || rows.length===0)&&<p>No referral entitlements have been recorded.</p>}
  <p style={{marginTop:24}}>Only the 50 most recent entries are shown. This page does not award or redeem services. No payment verification may be inferred solely from a timestamp in the ledger.</p>
 </main>;
}
