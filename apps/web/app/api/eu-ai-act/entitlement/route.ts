import {NextResponse} from 'next/server';
import {getCurrentEuAiActEntitlement} from '@/lib/billing/server-entitlements';
export const dynamic='force-dynamic';export const runtime='nodejs';
export async function GET(){try{const entitlement=await getCurrentEuAiActEntitlement();return NextResponse.json({...entitlement,boundary:'Entitlement establishes subscription access only. It does not establish legal compliance, certification, regulatory approval, admissibility, or a favorable TA-14 determination.'},{headers:{'Cache-Control':'no-store'}})}catch(error){console.error('TA14_EU_AI_ACT_ENTITLEMENT_ERROR',error);return NextResponse.json({error:'ENTITLEMENT_SERVICE_UNAVAILABLE'},{status:503,headers:{'Cache-Control':'no-store'}})}}
