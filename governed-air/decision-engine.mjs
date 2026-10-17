// Governed Air teaching fixture v0.2. NOT production governance or equipment control.
export function evaluate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {disposition:'DENY',reason:'Invalid examination request',missingEvidence:[],missingAuthority:[],simulation:true};
  const evidenceFields=['source','timestamp','calibration','continuity'];
  const authorityFields=['actor','capacity','standing_basis','authority_relationship','applicable_policy'];
  const present=(obj,key)=>typeof obj?.[key]==='string' && obj[key].trim().length>0;
  const missingEvidence=evidenceFields.filter(k=>!present(input.evidence,k));
  const missingAuthority=authorityFields.filter(k=>!present(input.authority,k));
  const base={missingEvidence,missingAuthority,simulation:true};
  const action=input.proposed_action;
  if (!['investigate','change_ventilation','dismiss'].includes(action)) return {...base,disposition:'DENY',reason:'Unknown proposed action'};
  if (input.safety_escalation===true) return {...base,disposition:'ESCALATE',reason:'Refer to independently applicable safety procedure; no autonomous action'};
  if (action==='dismiss') return {...base,disposition:'HOLD',reason:'Dismissal is not authorized by this teaching fixture; review the observation'};
  if (missingEvidence.length || missingAuthority.length) return {...base,disposition:'HOLD',reason:'Evidence and/or authority not established'};
  if (action==='change_ventilation') return {...base,disposition:'HOLD',reason:'Physical intervention requires separate site-specific execution authorization'};
  return {...base,disposition:'ALLOW',reason:'Simulated bounded investigation only; no real-world authority or physical intervention'};
}
