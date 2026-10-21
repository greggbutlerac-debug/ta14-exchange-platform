// Independent review of a report plus an externally preserved SHA-256 reference.
// Never infer authorship, admissibility, standing, or authorization from a hash.
import {verifyReportFingerprint} from './report-fingerprint.mjs';
export function reviewExaminationPackage(report,fingerprint,context={}) {
 const check=verifyReportFingerprint(report,fingerprint);
 const referenceIndependentlyHeld=context?.referenceIndependentlyHeld===true;
 const findings=[
  {control:'Structural report validation',status:check.reportValid?'PASS':'FAIL'},
  {control:'SHA-256 report equality',status:check.matches?'PASS':'FAIL'},
  {control:'Independent reference custody',status:referenceIndependentlyHeld?'ASSERTED_NOT_VERIFIED':'NOT_ESTABLISHED'},
  {control:'Report issuer identity',status:'NOT_ESTABLISHED'},
  {control:'Evidence admissibility',status:'NOT_ESTABLISHED'},
  {control:'Applicable authority and standing',status:'NOT_ESTABLISHED'},
  {control:'Execution authorization',status:'NOT_ESTABLISHED'}
 ];
 return Object.freeze({
  schema:'ta14-governed-air-independent-review-v0.1',
  integrityMatch:check.matches,
  reportValid:check.reportValid,
  referenceIndependentlyHeld,
  provenanceVerified:false,
  authorityEstablished:false,
  executionAuthorized:false,
  disposition:'HOLD',
  findings,
  warning:'Hash equality establishes only byte-level consistency with a separately preserved reference. It does not authenticate the issuer, establish evidence or standing, or authorize an action.'
 });
}
