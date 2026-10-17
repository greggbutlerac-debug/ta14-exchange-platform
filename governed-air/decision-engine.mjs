// Governed Air v0.1 — simulation-only deterministic evaluation.
// This module never actuates physical equipment.
export function evaluate(input) {
  const requiredEvidence = ['source','timestamp','calibration','continuity'];
  const requiredAuthority = ['actor','capacity','standing_basis','authority_relationship','applicable_policy'];
  const missingEvidence = requiredEvidence.filter(k => !input.evidence?.[k]);
  const missingAuthority = requiredAuthority.filter(k => !input.authority?.[k]);
  const action = input.proposed_action;
  if (!['investigate','change_ventilation','dismiss'].includes(action)) return {disposition:'DENY',reason:'Unknown proposed action',missingEvidence,missingAuthority,simulation:true};
  if (input.safety_escalation === true) return {disposition:'ESCALATE',reason:'Refer to applicable safety procedure; no autonomous action',missingEvidence,missingAuthority,simulation:true};
  if (action === 'dismiss' && input.observation?.value >= 1500) return {disposition:'HOLD',reason:'Observation requires accountable review before dismissal; threshold is scenario-specific, not a health limit',missingEvidence,missingAuthority,simulation:true};
  if (missingEvidence.length || missingAuthority.length) return {disposition:'HOLD',reason:'Evidence and/or authority not established',missingEvidence,missingAuthority,simulation:true};
  if (action === 'change_ventilation') return {disposition:'HOLD',reason:'Physical intervention requires separate site-specific execution authorization and controls',missingEvidence,missingAuthority,simulation:true};
  return {disposition:'ALLOW',reason:'Bounded investigation only; not physical intervention',missingEvidence,missingAuthority,simulation:true};
}
