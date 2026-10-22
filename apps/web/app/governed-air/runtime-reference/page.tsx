import {projectRuntimeReferenceForWorkspace} from '../../../../../governed-air/runtime-reference-adapter.mjs';
import {syntheticRuntimeResponse} from '../../../../../governed-air/runtime-reference-fixture.mjs';
export const dynamic='force-static';
export default function RuntimeReferencePage(){
 const result=projectRuntimeReferenceForWorkspace(syntheticRuntimeResponse);
 const boundary=result.production_authorization;
 return <main style={{minHeight:'100vh',background:'#071923',color:'#e7f5f9',padding:'36px 20px',fontFamily:'system-ui,sans-serif'}}>
 <div style={{maxWidth:850,margin:'auto'}}>
 <p style={{color:'#80dad8',letterSpacing:2,fontSize:12}}>TA14 · GOVERNED AIR · PRIVATE DEVELOPMENT</p>
 <h1>Runtime Reference Boundary Demonstration</h1>
 <p><strong>SYNTHETIC FIXTURE ONLY.</strong> No Python runtime connection, real observation, authority verification, or equipment execution is represented.</p>
 <section style={{border:'1px solid #567c8a',padding:22,borderRadius:12,marginTop:24}}>
 <h2>Reference claims — not production permission</h2>
 <p>Reference decision: <strong>{result.reference_result.decision||'UNAVAILABLE'}</strong></p>
 <p>Legacy receipt status: <strong>{result.reference_result.receipt_status||'UNAVAILABLE'}</strong></p>
 <p>Legacy snapshot authorization claim: <strong>{String(result.reference_result.snapshot_execution_authorized_claim)}</strong></p>
 <p>Reference response validation: <strong>{result.valid_reference_response?'VALID REFERENCE SHAPE':'INVALID / HOLD'}</strong></p>
 </section>
 <section style={{border:'2px solid #efbb78',padding:22,borderRadius:12,marginTop:20}}>
 <h2>Effective production boundary</h2>
 <p style={{fontSize:30,fontWeight:800}}>{boundary.effective_disposition}</p>
 <p>Production execution authorized: <strong>{String(boundary.production_execution_authorized)}</strong></p>
 <p>Production commit authorized: <strong>{String(boundary.production_commit_authorized)}</strong></p>
 <p>Boundary: <code>{boundary.boundary}</code></p>
 </section>
 <p style={{marginTop:24}}>Reference PROCEED and EXECUTED are historical simulation claims. This page contains no equipment commands, actuation controls, or authorization credentials.</p>
 <a href="/governed-air/workspace" style={{color:'#80dad8'}}>Return to Examination Workspace</a>
 </div>
 </main>;
}
