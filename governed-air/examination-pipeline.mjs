// Governed Air examination pipeline v0.1.
// Authenticated attestation is only one prerequisite; it never grants execution.
import {verifySignedAttestation} from './signed-attestation.mjs';
import {assessVerificationBoundary} from './trusted-verifier.mjs';
export function examineGovernedAirCase(input, trust) {
 const base=assessVerificationBoundary(input);
 const anchors=['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'];
 const trace=anchors.map((anchor,index)=>({
  anchor,
  status:index===0 && typeof input?.observation?.description==='string' && input.observation.description.trim()?'CLAIM_RECORDED':'NOT_ESTABLISHED',
  note:index===0?'An observation is asserted, not independently verified':'Independent verification and authorization are required'
 }));
 const context=input?.binding;
 const envelope=input?.attestation;
 const attestation=verifySignedAttestation(envelope,trust?.keys,context,trust?.now);
 if(attestation.trusted){
  trace[1]={anchor:'Record',status:'ATTESTATION_AUTHENTICATED',note:'Signed scoped attestation authenticated; underlying evidence admissibility remains unestablished'};
  trace[4]={anchor:'Binding',status:'ATTESTATION_BOUND',note:'Signature binds attestation to the supplied expected context; no execution receipt'};
 }
 const checks={
  attestationAuthentic:attestation.trusted,
  evidenceIndependentlyAdmissible:false,
  actorStandingIndependentlyEstablished:false,
  applicableAuthorityEstablished:false,
  revocationFreshnessEstablished:false,
  executionReceiptValid:false
 };
 return Object.freeze({
  disposition:'HOLD',
  simulation:true,
  executionAuthorized:false,
  reason:attestation.trusted?'Signature verified; evidence admissibility, standing, revocation and execution authority remain unestablished':'No authenticated attestation or independent authority verification',
  attestation:{status:attestation.status,trusted:attestation.trusted,reason:attestation.reason},
  checks,
  trace,
  underlyingBoundary:base.disposition
 });
}
