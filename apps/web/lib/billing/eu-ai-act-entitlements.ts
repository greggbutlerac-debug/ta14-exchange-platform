export type EuAiActTier='free'|'passport'|'workspace'|'pro'|'institution';
export type EuAiActCapability=
 |'public_classifier'|'public_pressure_lab'|'system_passports'|'saved_classification'
 |'obligation_ledger'|'evidence_ledger'|'evidence_gap_analysis'|'governance_history'
 |'material_change_revalidation'|'atlas_governance_brief'|'governed_exports'
 |'portfolio_command_center'|'multi_owner_governance'|'examiner_rooms'
 |'executive_reporting'|'challenge_response'|'institutional_review_pathway';

export const TIER_RANK:Record<EuAiActTier,number>={free:0,passport:1,workspace:2,pro:3,institution:4};
export const PLAN_ID_TO_KEY:Record<string,string>={
 'P-27064640V37858307NJ66HPQ':'passport-monthly','P-7H005701JR262984GNJ66HPQ':'passport-annual',
 'P-79H84120C7502222KNJ66HPY':'workspace-monthly','P-50V814897V6426841NJ66HPY':'workspace-annual',
 'P-4JR402866N272811NNJ66HPY':'pro-monthly','P-8WE10125YP5373259NJ66HPY':'pro-annual',
 'P-95E93366H2071870RNJ66HQA':'institution-monthly','P-3LK89794Y1493825LNJ66HQA':'institution-annual'
};
export const CAPABILITY_MIN_TIER:Record<EuAiActCapability,EuAiActTier>={
 public_classifier:'free',public_pressure_lab:'free',system_passports:'passport',saved_classification:'passport',
 obligation_ledger:'workspace',evidence_ledger:'workspace',evidence_gap_analysis:'workspace',governance_history:'workspace',
 material_change_revalidation:'pro',atlas_governance_brief:'pro',governed_exports:'pro',portfolio_command_center:'pro',
 multi_owner_governance:'institution',examiner_rooms:'institution',executive_reporting:'institution',challenge_response:'institution',institutional_review_pathway:'institution'
};
export function tierFromPlanKey(planKey:string|null|undefined):EuAiActTier{const base=(planKey??'').split('-')[0];return base==='passport'||base==='workspace'||base==='pro'||base==='institution'?base:'free'}
export function planKeyFromPayPalPlanId(planId:string|null|undefined){return planId?PLAN_ID_TO_KEY[planId]??null:null}
export function hasCapability(tier:EuAiActTier,capability:EuAiActCapability){return TIER_RANK[tier]>=TIER_RANK[CAPABILITY_MIN_TIER[capability]]}
export function capabilitiesForTier(tier:EuAiActTier){return (Object.keys(CAPABILITY_MIN_TIER) as EuAiActCapability[]).filter(c=>hasCapability(tier,c))}
export function isPaidStatus(status:string|null|undefined){return status==='ACTIVE'}
