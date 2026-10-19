// Browser-safe explanatory trace. Does NOT verify signatures or grant authority.
// Cryptographic examination remains server-side in examination-pipeline.mjs.
export function explainUnverifiedExamination(input) {
 const observationPresent=typeof input?.observation?.description==='string' && input.observation.description.trim().length>0;
 const trace=['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'].map((anchor,i)=>({
  anchor,
  status:i===0&&observationPresent?'CLAIM_RECORDED':'NOT_ESTABLISHED',
  note:i===0?'Observation asserted; source and accuracy not verified':i===1?'No independently authenticated evidence record':i===2?'Continuity and custody not independently established':i===3?'Evidence admissibility not independently established':i===4?'Actor, standing, authority and action binding not independently established':i===5?'No authorized commit receipt':i===6?'Physical execution prohibited in this workspace':'No independently observed execution outcome'
 }));
 return {disposition:'HOLD',simulation:true,executionAuthorized:false,attestation:{status:'INDETERMINATE',trusted:false,reason:'Browser workspace cannot perform trusted server-side attestation verification'},trace};
}
