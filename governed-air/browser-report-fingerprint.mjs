// Browser-compatible report digest. Hash is not a signature or trusted attestation.
import {validateExaminationReport} from './report-validation.mjs';
export async function createBrowserReportFingerprint(report) {
 const validation=validateExaminationReport(report);
 if(!validation.valid)throw new Error('Report failed validation: '+validation.issues.join('; '));
 const bytes=new TextEncoder().encode(JSON.stringify(report,null,2));
 if(!globalThis.crypto?.subtle)throw new Error('Secure digest API unavailable');
 const hash=await globalThis.crypto.subtle.digest('SHA-256',bytes);
 const digest=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
 return {algorithm:'SHA-256',digest,byte_length:bytes.length,classification:'UNSIGNED INTEGRITY FINGERPRINT — NOT AN ATTESTATION'};
}
