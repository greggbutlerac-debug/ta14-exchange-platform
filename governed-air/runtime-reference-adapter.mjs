// Read-only normalization of a separately obtained reference runtime response.
// No HTTP transport or execution capability. Caller-supplied authorization is never trusted.
const BOUNDARY='REFERENCE_ONLY_PRODUCTION_HOLD';
const HOLD=Object.freeze({boundary:BOUNDARY,effective_disposition:'HOLD',production_execution_authorized:false,production_commit_authorized:false});
const safeText=(x)=>typeof x==='string'?x.slice(0,160):null;
export function projectRuntimeReferenceForWorkspace(raw){
 const problems=[];
 if(!raw||typeof raw!=='object'||Array.isArray(raw))problems.push('INVALID_RUNTIME_RESPONSE');
 const root=problems.length?{}:raw;
 const orchestration=root.orchestration_result;
 if(!orchestration||typeof orchestration!=='object'||Array.isArray(orchestration))problems.push('MISSING_ORCHESTRATION');
 const source=orchestration&&typeof orchestration==='object'&&!Array.isArray(orchestration)?orchestration:{};
 if(source.reference_only!==true||source.boundary!==BOUNDARY||source.effective_disposition!=='HOLD'||source.production_execution_authorized!==false||source.production_commit_authorized!==false||source.execution_authorized!==false)problems.push('INVALID_PRODUCTION_BOUNDARY');
 const p=source.reference_artifact_presentation;
 if(!p||typeof p!=='object'||Array.isArray(p))problems.push('MISSING_ARTIFACT_PROJECTION');
 else if(p.record_type!=='REFERENCE_ARTIFACT_PRESENTATION'||p.boundary!==BOUNDARY||p.effective_disposition!=='HOLD'||p.production_execution_authorized!==false||p.production_commit_authorized!==false||p.actual_execution_verified!==false||p.independent_authority_established!==false)problems.push('INVALID_ARTIFACT_PROJECTION');
 return Object.freeze({
  schema_version:'governed-air-read-only-runtime-v0.1',
  mode:'REFERENCE_ONLY',
  valid_reference_response:problems.length===0,
  diagnostics:problems,
  reference_result:{
   decision:safeText(source.enforcement_decision?.decision),
   receipt_status:safeText(p?.reference_receipt_status),
   receipt_execution_authorized_claim:p?.reference_receipt_execution_authorized_claim===true,
   snapshot_execution_authorized_claim:p?.reference_snapshot_execution_authorized_claim===true
  },
  production_authorization:{...HOLD}
 });
}
