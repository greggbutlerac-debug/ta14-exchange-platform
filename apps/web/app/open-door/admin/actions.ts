'use server';

import {revalidatePath} from 'next/cache';
import {requireReferralAdministrator} from './authorization';

export type ReferralActionResult = {ok:boolean; message:string};

function parseId(value:FormDataEntryValue|null):string|null {
  if (typeof value!=='string') return null;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : null;
}

/**
 * Restricted server action. A service-role RPC is called only after an
 * independently enrolled administrator is authenticated and the ledger
 * identifies a verified paid engagement. Never accept payment amounts
 * from form data.
 */
export async function approveReferral(formData:FormData):Promise<ReferralActionResult> {
  const gate=await requireReferralAdministrator();
  if (!gate.ok) return {ok:false,message:'Administrator authorization required.'};
  const id=parseId(formData.get('referral_id'));
  if (!id) return {ok:false,message:'Invalid referral identifier.'};

  const {data:record,error:readError}=await gate.admin
    .from('ta14_open_door_referral_entitlements')
    .select('id,eligibility_status,paid_amount_cents,paid_verified_at,referring_entity_id,referred_entity_id')
    .eq('id',id).maybeSingle();
  if (readError || !record) return {ok:false,message:'Referral record unavailable.'};
  if (record.eligibility_status!=='pending' || !record.paid_verified_at ||
      record.paid_amount_cents<=0 || record.referring_entity_id===record.referred_entity_id) {
    return {ok:false,message:'Referral is not eligible for approval.'};
  }

  // Only a previously verified paid record can be approved. Payment verification
  // and eligibility review are out-of-band until a governed intake is implemented.
  const {error}=await gate.admin.rpc('ta14_open_door_approve_referral',{p_id:id});
  if (error) return {ok:false,message:'Approval failed. Check ledger state and audit.'};
  revalidatePath('/open-door/admin');
  return {ok:true,message:'Referral approved; verify the audit record.'};
}

/**
 * Redemption is intentionally unavailable until a linked, verified service
 * order and refund/reversal controls exist. Never debit balances from an
 * unverified browser-submitted amount.
 */
export async function redeemReferral(_formData:FormData):Promise<ReferralActionResult> {
  const gate=await requireReferralAdministrator();
  if (!gate.ok) return {ok:false,message:'Administrator authorization required.'};
  return {ok:false,message:'Redemption remains on HOLD pending verified service-order linkage and reversal controls.'};
}
