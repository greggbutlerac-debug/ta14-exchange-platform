// Deterministic report projection for a hypothetical Governed Air examination.
// The report is an explanation of a simulation, never an execution receipt.
export function createExaminationReport(record,serverResult) {
 if(!record||typeof record!=='object') throw new TypeError('Examination record required');
 const disposition='HOLD';
 const gates=Array.isArray(serverResult?.trace)?serverResult.trace:record.pipeline?.trace||[];
 const requirements=Array.isArray(record.gaps)?record.gaps:[];
 return {
  schema:'ta14-governed-air-report-v0.1',
  title:'Governed Air — Preliminary Examination Record',
  classification:'HYPOTHETICAL SIMULATION — NOT AN EXECUTION AUTHORIZATION',
  case_id:String(record.case_id||'UNSPECIFIED'),
  created_at:String(record.created_at||''),
  observation:record.observation||{},
  proposed_action:record.proposed_action||'unspecified',
  disposition,
  execution_authorized:false,
  examination_source:serverResult?'server-side development pipeline':'local explanatory fallback',
  decision_basis:serverResult?.reason||record.result?.reason||'Independent admissibility and authority not established',
  eight_anchor_trace:gates,
  outstanding_requirements:requirements.map(r=>({gate:r.gate,requirement:r.label,claim_status:r.claimStatus,required_proof:r.requiredProof,established:false})),
  limitation:'No independent verification of evidence, standing, applicable authority, revocation or execution receipt. No physical controls or safety procedures are operated.',
  review_note:'This document records a fictional teaching examination and must not be presented as regulatory approval, validated site evidence, or authority to act.'
 };
}
