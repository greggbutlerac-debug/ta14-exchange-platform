// Run from the repository root: node scripts/verify-environmental-accountability-assets.mjs
import {existsSync, statSync} from 'node:fs';
import {join} from 'node:path';
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
for(const name of names){const path=join(dir,name);if(!existsSync(path)||statSync(path).size===0){console.error('MISSING:',path);failures++;}else console.log('OK:',path);}
if(failures){console.error(failures+' assets missing. Keep assetsPublished=false.');process.exitCode=1;}
else console.log('All 11 assets present. Verify visual accuracy and PDF before enabling assetsPublished.');
