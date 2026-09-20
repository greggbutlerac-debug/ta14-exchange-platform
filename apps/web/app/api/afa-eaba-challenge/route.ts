import {createHash,randomUUID} from 'crypto';
import {createClient} from '@supabase/supabase-js';
import {NextResponse} from 'next/server';

const MECHANISM_SOURCE_BINDING={sourceCommit:'61cfa5483fe927e08a8dcdd4261b30f32b904603',sourcePath:'apps/web/app/api/afa-eaba-challenge/route.ts',freezeBasis:'CANONICAL_MECHANISM_SPEC',deploymentCommit:process.env.VERCEL_GIT_COMMIT_SHA??'LOCAL_OR_UNKNOWN'} as const;
const MECHANISM={id:'TA14-AFA-EABA-SX-001',version:'1.2.0',status:'FROZEN-CHALLENGE-SPEC',sourceBinding:MECHANISM_SOURCE_BINDING,acceptance:['freeze mechanism','run baseline','change one material condition','show verdict change','attempt bypass','show protected consequence did not fire','preserve receipt','replay']};
type Action='baseline'|'changed-condition'|'bypass'|'replay'|'finalize';
type ExecutableAction='baseline'|'changed-condition'|'bypass';
const PREVIOUS_ACTION:Record<ExecutableAction,ExecutableAction|null>={baseline:null,'changed-condition':'baseline',bypass:'changed-condition'};
type Input={passportIntegrity:boolean;freshness:boolean;scope:boolean;localStanding:boolean;commitBinding:boolean;bypass:boolean};

function canonical(v:unknown):string{if(v===null||typeof v!=='object')return JSON.stringify(v);if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';const o=v as Record<string,unknown>;return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}'}
function db(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('CHALLENGE_LEDGER_NOT_CONFIGURED');return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
function inputFor(action:ExecutableAction):Input{return action==='baseline'?{passportIntegrity:true,freshness:true,scope:true,localStanding:true,commitBinding:true,bypass:false}:action==='changed-condition'?{passportIntegrity:true,freshness:true,scope:true,localStanding:false,commitBinding:true,bypass:false}:{passportIntegrity:true,freshness:true,scope:true,localStanding:false,commitBinding:true,bypass:true}}

async function execute(action:ExecutableAction,sequence?:{examinationId:string;previousReceiptId?:string|null;skipSequenceValidation?:boolean}){
 const input=inputFor(action),runId=randomUUID(),s=db();
 const examinationId=sequence?.examinationId??randomUUID();
 const expectedPrevious=PREVIOUS_ACTION[action];
 if(expectedPrevious&&!sequence?.skipSequenceValidation){
  if(!sequence?.previousReceiptId)throw new Error('SEQUENCE_EVIDENCE_REQUIRED:'+expectedPrevious);
  const {data:previous,error:previousError}=await s.from('ta14_afa_eaba_challenge_receipts').select('receipt_id,action,evidence_json').eq('receipt_id',sequence.previousReceiptId).maybeSingle();
  if(previousError||!previous)throw new Error('SEQUENCE_RECEIPT_NOT_FOUND');
  if(previous.action!==expectedPrevious)throw new Error('SEQUENCE_VIOLATION:EXPECTED_'+expectedPrevious.toUpperCase().replace('-','_'));
  const previousEvidence=previous.evidence_json as any;
  if(previousEvidence?.examinationId!==examinationId)throw new Error('SEQUENCE_EXAMINATION_MISMATCH');
 }
 const all=input.passportIntegrity&&input.freshness&&input.scope&&input.localStanding&&input.commitBinding;
 const determination=all?'ALLOW':'HOLD',gateOpen=determination==='ALLOW'&&!input.bypass;
 const {data:effect,error:rpcError}=await s.rpc('ta14_afa_eaba_apply_effect',{p_run_id:runId,p_mechanism_id:MECHANISM.id,p_mechanism_version:MECHANISM.version,p_action:action,p_passport_integrity:input.passportIntegrity,p_freshness:input.freshness,p_scope:input.scope,p_local_standing:input.localStanding,p_commit_binding:input.commitBinding,p_bypass:input.bypass});
 if(rpcError)throw new Error('PROTECTED_EFFECT_GATE_FAILED:'+rpcError.code);
 const {data:effectRow,error:effectReadError}=await s.from('ta14_afa_eaba_challenge_effects').select('effect_id,run_id,created_at').eq('run_id',runId).maybeSingle();
 if(effectReadError)throw new Error('PROTECTED_EFFECT_OBSERVATION_FAILED:'+effectReadError.code);
 const protectedConsequence={attempted:true,authorized:Boolean(effect?.authorized),fired:Boolean(effectRow),effectId:effectRow?.effect_id??null,databaseResult:effectRow?'DURABLE_EFFECT_ROW_OBSERVED':'NO_EFFECT_ROW_OBSERVED',observation:'SEPARATE_POST_GATE_DATABASE_READ'};
 const trace=['AUTHORITY_CONTEXT_PRESENTED','AFA_BOUNDARY_VERIFIED',input.localStanding?'LOCAL_STANDING_ESTABLISHED':'LOCAL_STANDING_NOT_ESTABLISHED','EABA_DETERMINATION_'+determination,input.bypass?'BYPASS_INVOCATION_ATTEMPTED':'NORMAL_ROUTE','DATABASE_EFFECT_'+(effectRow?'OBSERVED':'ABSENT')];
 const mechanismBindingHash=createHash('sha256').update(canonical({id:MECHANISM.id,version:MECHANISM.version,status:MECHANISM.status,sourceBinding:MECHANISM.sourceBinding,acceptance:MECHANISM.acceptance})).digest('hex');
 const evidence={runId,examinationId,sequence:{action,previousReceiptId:sequence?.previousReceiptId??null},mechanism:MECHANISM,mechanismBinding:{...MECHANISM_SOURCE_BINDING,hashAlgorithm:'SHA-256',bindingHash:mechanismBindingHash},input,determination,gateOpen,protectedConsequence,trace};
 const integrityHash=createHash('sha256').update(canonical(evidence)).digest('hex');
 const {data:stored,error:storeError}=await s.from('ta14_afa_eaba_challenge_receipts').insert({run_id:runId,mechanism_id:MECHANISM.id,mechanism_version:MECHANISM.version,action,evidence_json:evidence,integrity_hash:integrityHash}).select('receipt_id,created_at').single();
 if(storeError||!stored)throw new Error('RECEIPT_PRESERVATION_FAILED:'+(storeError?.code??'UNKNOWN'));
 return {...evidence,receipt:{schema:'TA14_EXECUTION_RECEIPT_V2',receiptId:stored.receipt_id,persistedAt:stored.created_at,storageAuthority:'SUPABASE_SERVER_LEDGER',hashAlgorithm:'SHA-256',canonicalization:'TA14-RECURSIVE-SORTED-JSON-V1',integrityHash}};
}
export async function POST(req:Request){
 try{
  const body=await req.json().catch(()=>({})),action=body.action as Action;
  if(action==='replay'){
   const supplied=body.receipt;
   const receiptId=supplied?.record?.receipt?.receiptId;
   if(!receiptId)return NextResponse.json({error:'preserved receipt required'},{status:400});
   const s=db();
   const {data:stored,error}=await s.from('ta14_afa_eaba_challenge_receipts').select('action,evidence_json,integrity_hash,created_at').eq('receipt_id',receiptId).maybeSingle();
   if(error||!stored)return NextResponse.json({error:'preserved receipt not found'},{status:404});
   const storedHash=createHash('sha256').update(canonical(stored.evidence_json)).digest('hex');
   const receiptIntact=storedHash===stored.integrity_hash;
   const original=stored.evidence_json as any;
   const {data:effectRow}=await s.from('ta14_afa_eaba_challenge_effects').select('effect_id').eq('run_id',original.runId).maybeSingle();
   const consequenceStillCorresponds=Boolean(effectRow)===Boolean(original.protectedConsequence?.fired);
   const replayAction=stored.action as ExecutableAction;
   if(!['baseline','changed-condition','bypass'].includes(replayAction))return NextResponse.json({error:'preserved action is not replayable'},{status:400});
   const replayExaminationId=randomUUID();
   const reexecution=await execute(replayAction,{examinationId:replayExaminationId,skipSequenceValidation:true});
   const sameInput=canonical(reexecution.input)===canonical(original.input);
   const sameDetermination=reexecution.determination===original.determination;
   const sameGateState=reexecution.gateOpen===original.gateOpen;
   const sameConsequenceOutcome=Boolean(reexecution.protectedConsequence?.fired)===Boolean(original.protectedConsequence?.fired);
   const operationalMatch=sameInput&&sameDetermination&&sameGateState&&sameConsequenceOutcome;
   return NextResponse.json({mechanism:MECHANISM,replay:{match:receiptIntact&&consequenceStillCorresponds&&operationalMatch,receiptIntact,consequenceStillCorresponds,operationalMatch,comparison:{sameInput,sameDetermination,sameGateState,sameConsequenceOutcome},source:'DURABLE_SERVER_LEDGER_PLUS_FRESH_REEXECUTION',receiptId,originalHash:stored.integrity_hash,persistedAt:stored.created_at,reexecution:{runId:reexecution.runId,receiptId:reexecution.receipt.receiptId,integrityHash:reexecution.receipt.integrityHash,determination:reexecution.determination,gateOpen:reexecution.gateOpen,protectedConsequence:reexecution.protectedConsequence}}});
  }
  if(action==='finalize'){
   const examinationId=body.examinationId as string|undefined;
   const replayResult=body.replay;
   if(!examinationId||!replayResult?.replay?.match)return NextResponse.json({error:'completed examination and matching replay required'},{status:400});
   const s=db();
   const {data:rows,error}=await s.from('ta14_afa_eaba_challenge_receipts').select('receipt_id,action,evidence_json,integrity_hash,created_at').in('action',['baseline','changed-condition','bypass']).order('created_at',{ascending:true});
   if(error)return NextResponse.json({error:'examination receipts unavailable'},{status:500});
   const chain=(rows??[]).filter((r:any)=>r.evidence_json?.examinationId===examinationId);
   const baseline=chain.find((r:any)=>r.action==='baseline'),changed=chain.find((r:any)=>r.action==='changed-condition'),bypass=chain.find((r:any)=>r.action==='bypass');
   if(!baseline||!changed||!bypass)return NextResponse.json({error:'complete durable examination chain not found'},{status:400});
   if(changed.evidence_json?.sequence?.previousReceiptId!==baseline.receipt_id||bypass.evidence_json?.sequence?.previousReceiptId!==changed.receipt_id)return NextResponse.json({error:'durable examination chain is not contiguous'},{status:400});
   const report={schema:'TA14_BOUNDED_EXAMINATION_REPORT_V2',finding:'SUPPORTED — BOUNDED EXAMINATION',examinationId,mechanism:MECHANISM,acceptanceSource:{type:'PUBLIC_LINKEDIN_COMMENT',url:'https://www.linkedin.com/posts/ta-14-authority-today-we-published-another-ugcPost-7507215874878054400-OJfm/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFovYx4B0iJkFAupdhBF61p2RryWF88x0q0'},controlledDelta:{field:'localStanding',baseline:true,changed:false},receipts:{baseline,changed,bypass},replay:replayResult.replay,claimBoundary:'Bounded to TA14-AFA-EABA-SX-001 and its durable database effect sink.'};
   const integrityHash=createHash('sha256').update(canonical(report)).digest('hex');
   const {data:stored,error:storeError}=await s.from('ta14_afa_eaba_challenge_reports').insert({examination_id:examinationId,mechanism_id:MECHANISM.id,mechanism_version:MECHANISM.version,report_json:report,integrity_hash:integrityHash}).select('report_id,created_at').single();
   if(storeError){const {data:existing}=await s.from('ta14_afa_eaba_challenge_reports').select('report_id,created_at,report_json,integrity_hash').eq('examination_id',examinationId).maybeSingle();if(existing)return NextResponse.json({report:existing.report_json,preservation:{reportId:existing.report_id,persistedAt:existing.created_at,integrityHash:existing.integrity_hash,storageAuthority:'SUPABASE_APPEND_ONLY_REPORT_LEDGER'}});throw new Error('REPORT_PRESERVATION_FAILED:'+storeError.code);}
   return NextResponse.json({report,preservation:{reportId:stored.report_id,persistedAt:stored.created_at,integrityHash,storageAuthority:'SUPABASE_APPEND_ONLY_REPORT_LEDGER'}});
  }
  if(!['baseline','changed-condition','bypass'].includes(action))return NextResponse.json({error:'invalid action'},{status:400});
  const sequence=body.sequence as {examinationId?:string;previousReceiptId?:string|null}|undefined;
  if(action!=='baseline'&&!sequence?.examinationId)return NextResponse.json({error:'examination sequence required'},{status:400});
  const examinationId=action==='baseline'?(sequence?.examinationId??randomUUID()):sequence!.examinationId!;
  return NextResponse.json({action,record:await execute(action as ExecutableAction,{examinationId,previousReceiptId:sequence?.previousReceiptId??null})});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'challenge execution failed'},{status:500})}
}
export async function GET(){return NextResponse.json({mechanism:MECHANISM,evidenceBoundary:'DURABLE_SERVER_LEDGER_AND_DATABASE_EFFECT_SINK'});}
