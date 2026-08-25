import {createClient as createServiceClient} from '@supabase/supabase-js';
import {createClient as createUserClient} from '@/lib/supabase/server';
import {capabilitiesForTier,isPaidStatus,planKeyFromPayPalPlanId,tierFromPlanKey,type EuAiActCapability,type EuAiActTier} from './eu-ai-act-entitlements';

type BillingRow={paypal_subscription_id:string;paypal_plan_id:string|null;plan_key:string|null;owner_user_id:string|null;subscriber_email:string|null;status:string;status_changed_at:string|null;next_billing_time:string|null};
type TrialRow={plan_tier:EuAiActTier;status:string;started_at:string;ends_at:string};
export type EuAiActEntitlement={authenticated:boolean;userId:string|null;email:string|null;tier:EuAiActTier;planKey:string|null;subscriptionId:string|null;status:string;capabilities:EuAiActCapability[];source:'verified_subscription'|'trial'|'free';trialEndsAt?:string|null;};
function service(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Billing service configuration missing.');return createServiceClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
export async function getCurrentEuAiActEntitlement():Promise<EuAiActEntitlement>{
 const userClient=await createUserClient();const{data:{user}}=await userClient.auth.getUser();
 if(!user)return{authenticated:false,userId:null,email:null,tier:'free',planKey:null,subscriptionId:null,status:'FREE',capabilities:capabilitiesForTier('free'),source:'free'};
 const admin=service();let rows:BillingRow[]=[];
 const byUser=await admin.from('ta14_billing_subscriptions').select('paypal_subscription_id,paypal_plan_id,plan_key,owner_user_id,subscriber_email,status,status_changed_at,next_billing_time').eq('owner_user_id',user.id).order('status_changed_at',{ascending:false});
 if(byUser.error)throw byUser.error;rows=(byUser.data??[]) as BillingRow[];
 if(!rows.length&&user.email){const byEmail=await admin.from('ta14_billing_subscriptions').select('paypal_subscription_id,paypal_plan_id,plan_key,owner_user_id,subscriber_email,status,status_changed_at,next_billing_time').ilike('subscriber_email',user.email).order('status_changed_at',{ascending:false});if(byEmail.error)throw byEmail.error;rows=(byEmail.data??[]) as BillingRow[];}
 const active=rows.filter(r=>isPaidStatus(r.status)).sort((a,b)=>{const ta=tierFromPlanKey(a.plan_key??planKeyFromPayPalPlanId(a.paypal_plan_id)),tb=tierFromPlanKey(b.plan_key??planKeyFromPayPalPlanId(b.paypal_plan_id));return ({free:0,passport:1,workspace:2,pro:3,institution:4}[tb]-{free:0,passport:1,workspace:2,pro:3,institution:4}[ta])})[0];
 if(active){const planKey=active.plan_key??planKeyFromPayPalPlanId(active.paypal_plan_id),tier=tierFromPlanKey(planKey);if(!active.owner_user_id){await admin.from('ta14_billing_subscriptions').update({owner_user_id:user.id,plan_key:planKey,updated_at:new Date().toISOString()}).eq('paypal_subscription_id',active.paypal_subscription_id).is('owner_user_id',null)}return{authenticated:true,userId:user.id,email:user.email??null,tier,planKey,subscriptionId:active.paypal_subscription_id,status:active.status,capabilities:capabilitiesForTier(tier),source:'verified_subscription',trialEndsAt:null};}
 const trialResult=await admin.from('ta14_commercial_trials').select('plan_tier,status,started_at,ends_at').eq('user_id',user.id).maybeSingle();
 if(trialResult.error)throw trialResult.error;const trial=trialResult.data as TrialRow|null;
 if(trial&&trial.status==='ACTIVE'){
   if(new Date(trial.ends_at).getTime()>Date.now())return{authenticated:true,userId:user.id,email:user.email??null,tier:trial.plan_tier,planKey:`trial:${trial.plan_tier}`,subscriptionId:null,status:'TRIAL_ACTIVE',capabilities:capabilitiesForTier(trial.plan_tier),source:'trial',trialEndsAt:trial.ends_at};
   await admin.from('ta14_commercial_trials').update({status:'EXPIRED',updated_at:new Date().toISOString()}).eq('user_id',user.id).eq('status','ACTIVE');
 }
 return{authenticated:true,userId:user.id,email:user.email??null,tier:'free',planKey:null,subscriptionId:null,status:rows[0]?.status??(trial?.status==='EXPIRED'?'TRIAL_EXPIRED':'FREE'),capabilities:capabilitiesForTier('free'),source:'free',trialEndsAt:trial?.ends_at??null};
}
export async function requireEuAiActCapability(capability:EuAiActCapability){const entitlement=await getCurrentEuAiActEntitlement();if(!entitlement.capabilities.includes(capability)){const e=new Error('EU_AI_ACT_CAPABILITY_NOT_ENTITLED') as Error&{status?:number;entitlement?:EuAiActEntitlement;required?:EuAiActCapability};e.status=entitlement.authenticated?403:401;e.entitlement=entitlement;e.required=capability;throw e}return entitlement}
