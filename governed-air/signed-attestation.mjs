// Development-only cryptographic attestation verifier. No execution authorization.
// Trusted keys MUST be supplied by the host, never by the claimant or envelope.
// Ed25519 signatures cover the exact payload bytes (UTF-8) with a domain separator.
import {createPublicKey, verify as verifySignature} from 'node:crypto';
const PREFIX=Buffer.from('TA14-GOVERNED-AIR-ATTESTATION-v1\n','utf8');
const fail=(reason)=>Object.freeze({status:'INDETERMINATE',trusted:false,executionAuthorized:false,reason});
export function verifySignedAttestation(envelope, trustedKeys, expected, now=Date.now()) {
 try {
  if (!envelope || typeof envelope!=='object' || !expected || typeof expected!=='object') return fail('Invalid verifier input');
  if (typeof envelope.payload!=='string' || !envelope.payload || typeof envelope.signature!=='string' || typeof envelope.key_id!=='string') return fail('Missing signed attestation fields');
  if (!trustedKeys || !Object.prototype.hasOwnProperty.call(trustedKeys,envelope.key_id)) return fail('No independently configured trust anchor');
  const key=trustedKeys[envelope.key_id];
  if (!key || typeof key.publicKeyPem!=='string' || key.revoked===true) return fail('Trust anchor missing or revoked');
  const payload=JSON.parse(envelope.payload);
  if (!payload || typeof payload!=='object' || Array.isArray(payload)) return fail('Invalid signed payload');
  for (const field of ['tenant_id','case_id','subject_id','action','site_id','policy_version']) {
   if (typeof expected[field]!=='string' || !expected[field] || payload[field]!==expected[field]) return fail('Binding mismatch: '+field);
  }
  if (payload.key_id!==envelope.key_id || payload.schema!=='ta14-attestation-v1') return fail('Invalid attestation schema or key binding');
  if (payload.verification_status!=='VERIFIED') return fail('Attestation does not establish verification');
  if (!Number.isFinite(payload.issued_at) || !Number.isFinite(payload.expires_at) || payload.issued_at>now || payload.expires_at<=now || payload.expires_at<=payload.issued_at) return fail('Attestation expired or not yet valid');
  if (Number.isFinite(key.notBefore) && now<key.notBefore || Number.isFinite(key.notAfter) && now>=key.notAfter) return fail('Trust anchor outside validity period');
  if (!/^[A-Za-z0-9_-]+$/.test(envelope.signature)) return fail('Invalid signature encoding');
  const sig=Buffer.from(envelope.signature,'base64url');
  if (sig.length!==64) return fail('Invalid Ed25519 signature length');
  const pub=createPublicKey(key.publicKeyPem);
  if (pub.asymmetricKeyType!=='ed25519') return fail('Unsupported key algorithm');
  const valid=verifySignature(null,Buffer.concat([PREFIX,Buffer.from(envelope.payload,'utf8')]),pub,sig);
  if (!valid) return fail('Signature verification failed');
  // Authenticity is not the same as authorization. Revocation, freshness of external
  // evidence, standing, and one-time execution receipts remain separate requirements.
  return Object.freeze({status:'VERIFIED',trusted:true,executionAuthorized:false,reason:'Signature and scoped attestation verified; no execution authority established',payload:Object.freeze(payload)});
 } catch {return fail('Malformed or unverifiable attestation')}
}
