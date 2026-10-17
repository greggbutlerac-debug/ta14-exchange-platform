// Workspace boundary v0.1: caller assertions are never trusted verification.
// This module only restricts the teaching evaluator. No execution capability.
import {evaluate} from './decision-engine.mjs';
export function examineUnverifiedClaims(input) {
  const result=evaluate(input);
  if (result.disposition!=='ALLOW') return {...result,claimsVerified:false,executionAuthorized:false};
  return {...result,disposition:'HOLD',reason:'Caller-supplied evidence, authority and standing are unverified. Simulation cannot establish authority.',claimsVerified:false,executionAuthorized:false};
}
