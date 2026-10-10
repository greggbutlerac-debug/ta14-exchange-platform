// Run from the repository root: node scripts/verify-environmental-accountability-assets.mjs
import {existsSync, statSync, openSync, readSync, closeSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const expected = new Map([["TA14_Environmental_Accountability_01_The_Promise.png",2039095,"70ab4f46ae6b840563d1d6d90cece5b9b0716780f83543d86eb547f5751b775a"],["TA14_Environmental_Accountability_02_Human_Infrastructure.png",2089103,"519bf6eb2e30f6c88c1c1df1fc9a82e379eec74fe62609767d16e2e03985668f"],["TA14_Environmental_Accountability_03_Regulatory_Obligation.png",2170542,"7b6e0f663a08a582ded54822f0f6f58254084dac0bf83eeb6007f88119e878b8"],["TA14_Environmental_Accountability_04_Measurement_Limits.png",2012643,"b9b44a8407db56834b0b384cfe4e27f3db4030c9b86c181236c80fafb1ded037"],["TA14_Environmental_Accountability_05_Atmospheric_Integrity_Records.png",2017788,"f291b9d661157c00e1086e95e3b88b3ee886461cbc03ba308941aafd9a765773"],["TA14_Environmental_Accountability_06_Authority_Boundary.png",2072321,"233a1a6df70b3bde6fcbacee71394cc1914ec70cddbd2fb058d7ea1ff5670027"],["TA14_Environmental_Accountability_07_Authorized_Intervention.png",2072083,"33bad640b75fbde278c2eed6c5e87997a2a37aa840a5616bd7172353729176ba"],["TA14_Environmental_Accountability_08_Verified_Outcome.png",2084119,"8fa76f1a1b589c8845bbdb0ed3d6fd279b7c38fc5d46363a1bb787ac70dd8f5a"],["TA14_Environmental_Accountability_09_Independent_Examination.png",2121713,"a64535f38ba2031ab1e459b56f167829c67de690505366954a8c7dc01c228dc7"],["TA14_Environmental_Accountability_10_Institutional_Invitation.png",2232823,"d1b8634ba34e7443059d9daea6016db97b4564310977c6eb6f9de7f490928870"],["TA14_Environmental_Accountability_Institutional_Examination_and_Pilot_Reference_v3.0.pdf",47867,"bcf870498de297a38c92abd47907c45dd3dd4c61b60143d927d0fc5d6aae9a92"]].map(([name,size,sha256])=>[name,{size,sha256}]));
const dir='apps/web/public/environmental-accountability';
const names=[
'TA14_Environmental_Accountability_01_The_Promise.png',
'TA14_Environmental_Accountability_02_Human_Infrastructure.png',
'TA14_Environmental_Accountability_03_Regulatory_Obligation.png',
'TA14_Environmental_Accountability_04_Measurement_Limits.png',
'TA14_Environmental_Accountability_05_Atmospheric_Integrity_Records.png',
'TA14_Environmental_Accountability_06_Authority_Boundary.png',
'TA14_Environmental_Accountability_07_Authorized_Intervention.png',
'TA14_Environmental_Accountability_08_Verified_Outcome.png',
'TA14_Environmental_Accountability_09_Independent_Examination.png',
'TA14_Environmental_Accountability_10_Institutional_Invitation.png',
'TA14_Environmental_Accountability_Institutional_Examination_and_Pilot_Reference_v3.0.pdf'
];
let failures=0;
for(const name of names){const path=join(dir,name);if(!existsSync(path)||statSync(path).size===0){console.error('MISSING:',path);failures++;continue;}
 const fd=openSync(path,'r');const header=Buffer.alloc(24);const count=readSync(fd,header,0,24,0);closeSync(fd);
 const png=name.endsWith('.png');const valid=png ? count===24 && header.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && header.toString('ascii',12,16)==='IHDR' : header.toString('ascii',0,5)==='%PDF-';
 if(!valid){console.error('INVALID FILE SIGNATURE:',path);failures++;continue;}
 if(png){const width=header.readUInt32BE(16),height=header.readUInt32BE(20);if(width<1000||height<600){console.error('UNEXPECTED IMAGE SIZE:',path,width,height);failures++;continue;}}
 const expectedFile=expected.get(name);
 if(!expectedFile || statSync(path).size!==expectedFile.size){console.error('SIZE MISMATCH:',path);failures++;continue;}
 const actualHash=createHash('sha256').update(readFileSync(path)).digest('hex');
 if(actualHash!==expectedFile.sha256){console.error('SHA-256 MISMATCH:',path);failures++;continue;}
 console.log('OK (signature, dimensions, size, SHA-256):',path);}
if(failures){console.error(failures+' assets missing or invalid. Keep assetsPublished=false.');process.exitCode=1;}
else console.log('All 11 assets present. Verify visual accuracy and PDF before enabling assetsPublished.');
