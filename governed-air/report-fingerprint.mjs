// Independent, reproducible integrity check for exported development reports.
// SHA-256 proves byte equality with a known digest, not origin, authenticity or authority.
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {validateExaminationReport} from './report-validation.mjs';
export function fingerprintReport(report) {
 const validation=validateExaminationReport(report);
 if(!validation.valid)throw new Error('Invalid report: '+validation.issues.join('; '));
 const bytes=Buffer.from(JSON.stringify(report,null,2),'utf8');
 return Object.freeze({algorithm:'SHA-256',digest:createHash('sha256').update(bytes).digest('hex'),byte_length:bytes.length,classification:'UNSIGNED INTEGRITY FINGERPRINT — NOT AN ATTESTATION'});
}
export function verifyReportFingerprint(report,fingerprint) {
 try {
  const expected=fingerprintReport(report);
  return {matches:fingerprint?.algorithm==='SHA-256'&&fingerprint?.digest===expected.digest&&fingerprint?.byte_length===expected.byte_length,reportValid:true,authorityEstablished:false};
 } catch {return {matches:false,reportValid:false,authorityEstablished:false}}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
 const [reportFile,fingerprintFile]=process.argv.slice(2);
 if(!reportFile||!fingerprintFile){console.error('Usage: node governed-air/report-fingerprint.mjs report.json fingerprint.json');process.exitCode=2}
 else {
  try {
   const report=JSON.parse(readFileSync(reportFile,'utf8'));
   const fingerprint=JSON.parse(readFileSync(fingerprintFile,'utf8'));
   const result=verifyReportFingerprint(report,fingerprint);
   console.log(JSON.stringify(result,null,2));
   if(!result.matches)process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=2}
 }
}
