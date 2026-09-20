import {createHash} from 'crypto';
import {NextResponse} from 'next/server';

const MECHANISM={id:'TA14-AFA-EABA-SX-001',version:'1.0.1',status:'FROZEN-CHALLENGE-SPEC',acceptance:['freeze mechanism','run baseline','change one material condition','show verdict change','attempt bypass','show protected consequence did not fire','preserve receipt','replay']};
type Action='baseline'|'changed-condition'|'bypass'|'replay';
type Input={passportIntegrity:boolean;freshness:boolean;scope:boolean;localStanding:boolean;commitBinding:boolean;bypass:boolean};

function canonical(v:unknown):string{
 if(v===null||typeof v!=='object') return JSON.stringify(v);
 if(Array.isArray(v)) return '['+v.map(canonical).join(',')+']';
 const o=v as Record<string,unknown>;
 return '{'+Object.keys(o).sort().map(k=>JSON.stringify(k)+':'+canonical(o[k])).join(',')+'}';
}
function consequence(input:Input,determination:string){
 const authorized=determination==='ALLOW'&&!input.bypass;
 return {attempted:true,authorized,fired:authorized,result:authorized?'EXECUTED':'BLOCKED_AT_EABA_GATE'};
}
function execute(action:Exclude<Action,'replay'>){
 const input:Input=action==='baseline'
  ?{passportIntegrity:true,freshness:true,scope:true,localStanding:true,commitBinding:true,bypass:false}
  :action==='changed-condition'
   ?{passportIntegrity:true,freshness:true,scope:true,localStanding:false,commitBinding:true,bypass:false}
   :{passportIntegrity:true,freshness:true,scope:true,localStanding:false,commitBinding:true,bypass:true};
 const all=input.passportIntegrity&&input.freshness&&input.scope&&input.localStanding&&input.commitBinding;
 const determination=all?'ALLOW':'HOLD';
 const gateOpen=determination==='ALLOW'&&!input.bypass;
 const protectedConsequence=consequence(input,determination);
 const trace=['AUTHORITY_CONTEXT_PRESENTED','AFA_BOUNDARY_VERIFIED',input.localStanding?'LOCAL_STANDING_ESTABLISHED':'LOCAL_STANDING_NOT_ESTABLISHED','EABA_DETERMINATION_'+determination,input.bypass?'BYPASS_INVOCATION_ATTEMPTED':'NORMAL_ROUTE','CONSEQUENCE_'+protectedConsequence.result];
 const evidence={mechanism:MECHANISM,input,determination,gateOpen,protectedConsequence,trace};
 const integrityHash=createHash('sha256').update(canonical(evidence)).digest('hex');
 return {...evidence,receipt:{schema:'TA14_EXECUTION_RECEIPT_V1',hashAlgorithm:'SHA-256',canonicalization:'TA14-RECURSIVE-SORTED-JSON-V1',integrityHash}};
}
export async function POST(req:Request){
 const body=await req.json().catch(()=>({}));
 const action=body.action as Action;
 if(action==='replay'){
  const supplied=body.receipt;
  if(!supplied?.action||!supplied?.record||!['baseline','changed-condition','bypass'].includes(supplied.action)) return NextResponse.json({error:'valid receipt required'},{status:400});
  const fresh=execute(supplied.action);
  const originalHash=supplied.record.receipt?.integrityHash;
  const receiptEvidence={mechanism:supplied.record.mechanism,input:supplied.record.input,determination:supplied.record.determination,gateOpen:supplied.record.gateOpen,protectedConsequence:supplied.record.protectedConsequence,trace:supplied.record.trace};
  const receiptHash=createHash('sha256').update(canonical(receiptEvidence)).digest('hex');
  const receiptIntact=receiptHash===originalHash;
  const deterministicMatch=fresh.receipt.integrityHash===originalHash;
  return NextResponse.json({mechanism:MECHANISM,replay:{match:receiptIntact&&deterministicMatch,receiptIntact,deterministicMatch,recomputed:fresh,originalHash,recomputedHash:fresh.receipt.integrityHash}});
 }
 if(!['baseline','changed-condition','bypass'].includes(action)) return NextResponse.json({error:'invalid action'},{status:400});
 return NextResponse.json({action,record:execute(action as Exclude<Action,'replay'>)});
}
export async function GET(){return NextResponse.json({mechanism:MECHANISM});}
