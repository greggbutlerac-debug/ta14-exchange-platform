/*
 * Owner gate for the Refrigeration Consequence Boundary examination (pending publication approval).
 *
 * Same rule as the private /admin surfaces: only the signed-in owner (TA14_REVENUE_OWNER_USER_ID)
 * may see it; everyone else gets 404. It fails closed: a missing owner id, a missing session, or any
 * Supabase error denies access.
 *
 * Local verification: TA14_RCB_LOCAL_PREVIEW=1 opens it, but only when VERCEL is unset, so the
 * bypass can never activate on a Vercel deployment.
 */
import { createClient } from '../../../lib/supabase/server';

export type AccessDecision = { allowed: boolean; basis: 'OWNER' | 'LOCAL_PREVIEW' | 'DENIED'; reason: string };

export function decideAccess(input: { ownerId?: string; userId?: string | null; vercel?: string; localPreview?: string }): AccessDecision {
  if (input.localPreview === '1' && !input.vercel) return { allowed: true, basis: 'LOCAL_PREVIEW', reason: 'Local preview flag set and not running on Vercel.' };
  const ownerId = input.ownerId?.trim();
  if (!ownerId) return { allowed: false, basis: 'DENIED', reason: 'Owner identity not configured.' };
  if (!input.userId) return { allowed: false, basis: 'DENIED', reason: 'No authenticated session.' };
  if (input.userId !== ownerId) return { allowed: false, basis: 'DENIED', reason: 'Authenticated user is not the owner.' };
  return { allowed: true, basis: 'OWNER', reason: 'Authenticated owner.' };
}

export async function examinationAccess(): Promise<AccessDecision> {
  const env = { ownerId: process.env.TA14_REVENUE_OWNER_USER_ID, vercel: process.env.VERCEL, localPreview: process.env.TA14_RCB_LOCAL_PREVIEW };
  const early = decideAccess({ ...env, userId: null });
  if (early.basis === 'LOCAL_PREVIEW' || !env.ownerId?.trim()) return early;
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  } catch {
    userId = null; // fail closed
  }
  return decideAccess({ ...env, userId });
}
