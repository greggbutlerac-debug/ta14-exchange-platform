'use server';

import {requireReferralAdministrator} from './authorization';

export type ReferralActionResult = {ok:boolean; message:string};

/**
 * Explicit fail-closed gate. The deployed approval RPC currently accepts a
 * payment timestamp without authoritative payment-evidence binding. Until
 * the evidence schema, reviewer workflow, reversal controls and revised RPC
 * are deployed and tested, NO browser/server action may award entitlements.
 *
 * This is a deliberate HOLD, not an implementation placeholder that can
 * silently approve records through the old RPC.
 */
export async function approveReferral(_formData:FormData):Promise<ReferralActionResult> {
  const gate=await requireReferralAdministrator();
  if (!gate.ok) return {ok:false,message:'Administrator authorization required.'};
  return {
    ok:false,
    message:'Approval on HOLD: authoritative payment evidence, reviewer attribution and reversal checks are not yet enforced by the deployed database function.'
  };
}

/**
 * Redemption requires a verified linked service order and refund/reversal
 * controls. No unverified client-supplied amount may debit an entitlement.
 */
export async function redeemReferral(_formData:FormData):Promise<ReferralActionResult> {
  const gate=await requireReferralAdministrator();
  if (!gate.ok) return {ok:false,message:'Administrator authorization required.'};
  return {
    ok:false,
    message:'Redemption on HOLD: verified service-order linkage and reversal controls are not yet deployed.'
  };
}
