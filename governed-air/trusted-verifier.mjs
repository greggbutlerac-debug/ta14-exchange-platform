// Governed Air trusted-verification interface (development stub).
// No caller-controlled data may produce a trusted verification receipt.
// No cryptographic verifier or execution authority is implemented.
const STATUSES = Object.freeze({VERIFIED:'VERIFIED',REJECTED:'REJECTED',INDETERMINATE:'INDETERMINATE'});
export function verifyEvidenceClaim(claim, context) {
  return Object.freeze({
    status: STATUSES.INDETERMINATE,
    trusted: false,
    executionAuthorized: false,
    reason: 'No independent evidence verifier or trusted attestation configured',
    claimReference: typeof claim?.reference === 'string' ? claim.reference : null,
    tenantId: typeof context?.tenantId === 'string' ? context.tenantId : null
  });
}
export function verifyAuthorityClaim(claim, context) {
  return Object.freeze({
    status: STATUSES.INDETERMINATE,
    trusted: false,
    executionAuthorized: false,
    reason: 'No independent authority and standing verifier configured',
    claimReference: typeof claim?.reference === 'string' ? claim.reference : null,
    tenantId: typeof context?.tenantId === 'string' ? context.tenantId : null
  });
}
export function assessVerificationBoundary(input) {
  const evidence=verifyEvidenceClaim(input?.evidence,input?.context);
  const authority=verifyAuthorityClaim(input?.authority,input?.context);
  return Object.freeze({
    disposition:'HOLD',
    executionAuthorized:false,
    evidence,
    authority,
    reason:'Trusted verification is unavailable. No action receipt may be issued.'
  });
}
