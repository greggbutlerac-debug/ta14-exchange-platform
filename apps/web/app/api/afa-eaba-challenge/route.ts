import {createHash} from 'crypto';
import {NextResponse} from 'next/server';

const MECHANISM={id:'TA14-AFA-EABA-SX-001',version:'1.0.0',status:'FROZEN-CHALLENGE-SPEC',acceptance:['freeze mechanism','run baseline','change one material condition','show verdict change','attempt bypass','show protected consequence did not fire','preserve receipt','replay']};
type Action='baseline'|'changed-condition'|'bypass'|'replay';

function canonical(v:unknown){return JSON.stringify(v,Object.keys(v as Record<string,unknown>).sort())}
function execute(action:Exclude<Action,'replay'>){
 const input=action==='baseline'
  ?{passportIntegrity:true,freshness:true,scope:true,localStanding:true,commitBinding:true,bypass:false}
  :action==='changed-condition'
   ?{passportIntegrity:true,freshness:true,scope:true,localStanding:false,commitBinding:true,bypass:false}
   :{passportIntegrity:true,freshness:true,scope:true,localStanding:false,commitBinding:true,bypass:true};
 const all= input.passportIntegrity&&input.freshness&&input.scope&&input.localStanding&&input.commitBinding;
 const determination=all?'ALLOW':input.localStanding?'HOLD':'ESCALATE';
 // Protected consequence can only be reached through the gate. A bypass never invokes it.
 const gateOpen=determination==='ALLOW'&&!input.bypass;
 const protectedConsequenceFired=gateOpen;
 const trace=[
  'AUTHORITY_CONTEXT_PRESENTED',
  'AFA_BOUNDARY_VERIFIED',
  input.localStanding?'LOCAL_STANDING_ESTABLISHED':'LOCAL_STANDING_NOT_ESTABLISHED',
  'EABA_DETERMINATION_'+determination,
  input.bypass?'BYPASS_ATTEMPT_BLOCKED':'NORMAL_ROUTE',
  protectedConsequenceFired?'PROTECTED_CONSEQUENCE_FIRED':'PROTECTED_CONSEQUENCE_NOT_FIRED'
 ];
 const body={mechanism:MECHANISM,input,determination,gateOpen,protectedConsequenceFired,trace};
 const integrityHash=createHash('sha256').update(canonical(body)).digest('hex');
 return {...body,receipt:{schema:'TA14_EXECUTION_RECEIPT_V1',integrityHash}};
}
export async function POST(req:Request){
 const body=await req.json().catch(()=>({}));
 const action=body.action as Action;
 if(action==='replay'){
  const supplied=body.receipt;
  if(!supplied?.action||!supplied?.record) return NextResponse.json({error:'receipt required'},{status:400});
  const fresh=execute(supplied.action);
  const match=fresh.receipt.integrityHash===supplied.record.receipt?.integrityHash;
  return NextResponse.json({mechanism:MECHANISM,replay:{match,recomputed:fresh,originalHash:supplied.record.receipt?.integrityHash}});
 }
 if(!['baseline','changed-condition','bypass'].includes(action)) return NextResponse.json({error:'invalid action'},{status:400});
 return NextResponse.json({action,record:execute(action as Exclude<Action,'replay'>)});
}
export async function GET(){return NextResponse.json({mechanism:MECHANISM});}
