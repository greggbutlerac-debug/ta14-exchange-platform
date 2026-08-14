import type { TransferRouteDraft } from './route-draft-transfer';

type FoundingRoute = {
  id: string;
  title: string;
  domain: string;
  owner: string;
  version: number;
  status: string;
  chain: Record<string,string>;
};

export const exchangeFoundingRoutes: FoundingRoute[] = [
  {id:'vendor-payment-v3',title:'High-Value Vendor Payment',domain:'Finance',owner:'TA-14 Authority',version:3,status:'ALLOW',chain:{reality:'Invoice, purchase order, supplier identity and payment request exist.',record:'Canonical request and evidence package are preserved.',continuity:'Evidence origin, transformations, source digests, timestamps and versions remain traceable.',admissibility:'Required evidence and policy thresholds must be satisfied and current.',binding:'Bind actor, authority, beneficiary, amount, currency and destination.',commit:'Freeze the canonical admitted route, dependency set, decision receipt and route digest before execution.',execution:'Permit only the payment instruction that matches the committed actor, amount, currency and destination.',outcome:'Verify settlement using the processor receipt, bank trace, amount, destination and reconciliation result.'}},
  {id:'ai-agent-refund-v1',title:'AI Agent Customer Refund',domain:'AI Governance',owner:'TA-14 Exchange Lab',version:1,status:'HOLD',chain:{reality:'Customer account, order, complaint and proposed refund exist.',record:'Conversation, order state and refund proposal are recorded.',continuity:'Order and customer source records, timestamps and versions remain traceable.',admissibility:'Policy threshold exists; temporal validity remains unresolved.',binding:'Bind agent identity, delegated authority, customer account, amount and tool destination.',commit:'UNKNOWN',execution:'UNKNOWN',outcome:'UNKNOWN'}},
  {id:'hvac-refrigerant-intervention-v2',title:'Refrigerant Intervention Threshold',domain:'HVAC',owner:'Transparent Air',version:2,status:'ALLOW',chain:{reality:'Operating conditions and system state are observed in the field.',record:'Measurements, video, equipment identity and environmental state are preserved.',continuity:'Probe, technician, location, source timestamps and measurement continuity are maintained.',admissibility:'The non-invasive entry threshold must be satisfied before refrigerant intervention.',binding:'Bind technician, equipment, property, refrigerant, intervention and operating environment.',commit:'Freeze the diagnostic determination, admitted evidence, authorized intervention, limits and route digest.',execution:'Permit only refrigerant movement corresponding to the committed intervention and limits.',outcome:'Verify post-intervention performance with final readings, material balance and equipment response.'}},
  {id:'clinical-ai-escalation-v1',title:'Clinical AI Escalation Route',domain:'Healthcare',owner:'Community Draft',version:1,status:'ESCALATE',chain:{reality:'Patient state and proposed clinical action are described.',record:'Clinical observations are partially recorded.',continuity:'Source-system continuity is incomplete.',admissibility:'Required clinician review is absent.',binding:'Patient identity is present; authority binding is unresolved.',commit:'UNKNOWN',execution:'UNKNOWN',outcome:'UNKNOWN'}}
];

export function getFoundingExchangeRoute(routeId:string):FoundingRoute|undefined{
  return exchangeFoundingRoutes.find(route=>route.id===routeId);
}

export function foundingRouteToDraft(route:FoundingRoute,options?:{fork?:boolean}):TransferRouteDraft{
  const chain=route.chain as TransferRouteDraft['chain'];
  const missing=Object.entries(chain).filter(([,value])=>!value||value==='UNKNOWN').map(([key])=>key);
  return {
    schema:'TA14_ROUTE_DRAFT_V1',
    routeId: options?.fork ? `draft:${route.id}-fork` : route.id,
    status: missing.length ? 'HOLD' : 'READY_FOR_TEST',
    metadata:{name:options?.fork?`${route.title} — Fork`:route.title,domain:route.domain,owner:route.owner,version:route.version},
    chain,
    readiness:{completedStages:8-missing.length,totalStages:8,missingStages:missing,nextAction:missing.length?'COMPLETE_ROUTE_DEFINITION':'SUBMIT_TO_SANDBOX'},
    governingPrinciple:'No admissible evidence. No admissible execution.'
  };
}
