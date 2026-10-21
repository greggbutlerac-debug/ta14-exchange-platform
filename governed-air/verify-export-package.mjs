// Independently inspect an exported Governed Air teaching package.
// This validates structural consistency and digest equality, not issuer trust or authority.
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {reviewExaminationPackage} from './independent-review.mjs';

export function reviewExportPackage(bundle){
 if(!bundle||typeof bundle!=='object'||Array.isArray(bundle)||bundle.schema!=='ta14-governed-air-export-package-v0.1'){
  return {packageValid:false,integrityMatch:false,disposition:'HOLD',authorityEstablished:false,executionAuthorized:false,reason:'Invalid export package schema'};
 }
 const result=reviewExaminationPackage(bundle.report,bundle.fingerprint);
 return {packageValid:result.reportValid&&result.integrityMatch, ...result};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const file=process.argv[2];
 if(!file){console.error('Usage: node governed-air/verify-export-package.mjs package.json');process.exitCode=2}
 else{
  try{
   const result=reviewExportPackage(JSON.parse(readFileSync(file,'utf8')));
   console.log(JSON.stringify(result,null,2));
   if(!result.packageValid)process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=2}
 }
}
