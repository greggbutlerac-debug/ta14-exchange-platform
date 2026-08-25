'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { evaluateTA14AdversarialEvidence, type TA14AdversarialFinding } from '../../../../lib/ai-governance/adversarial-examination';

const machineTests = [
  ['AE-02','Material condition trigger'],['AE-10','Resolved authority identity'],['AE-11','Automated self-attestation refusal'],['AE-12','Evidence-reference sufficiency challenge'],['AE-20','Scope exclusion before admissibility'],['AE-23','Emergency carveout containment'],['AE-30','Distinct-authority change gate'],['AE-31','Predecessor exact-match check'],['AE-34','Replay / double-authorization refusal'],['AE-40','Predecessor immutability'],['AE-50','No silent standing inheritance'],['AE-61','Offline reconstruction'],['AE-70','Incremental amendment smuggle'],['AE-71','Reset / re-bootstrap escape'],['AE-72','Collusive-authority evidence challenge'],
] as const;

const observationKeys: Record<string,string[]> = {
 'AE-02':['materialChangeDetected','changeEvidenceBound','reevaluationRequired'],
 'AE-10':['authorityResolved','executionAttempted','executionBlocked'],
 'AE-11':['automatedSelfAttestationAttempted','standingCreated','executionBlocked'],
 'AE-12':['evidenceReferenceExists','evidenceSupportsRationale','executionBlocked'],
 'AE-20':['intentInScope','admissibilityEvaluated','executionBlocked'],
 'AE-23':['emergencyExceptionUsed','exceptionNarrowlyBounded','exceptionAttributable'],
 'AE-30':['materialChange','distinctAuthoritiesSatisfied','changeBound'],
 'AE-31':['predecessorMatchesReviewedObject','commitAccepted'],
 'AE-34':['replayAttempted','replayAccepted','priorEventIntact'],
 'AE-40':['predecessorSubstantiveContentChanged','successorLinked'],
 'AE-50':['materialSuccessorChange','priorGrantUsedWithoutRevalidation','executionBlocked'],
 'AE-61':['liveSystemUnavailable','lineageReconstructable','evidenceReconstructable','authorityReconstructable'],
 'AE-70':['cumulativeMaterialityReached','ordinaryAmendmentSucceeded','materialChangeEscalationRequired'],
 'AE-71':['resetOrRebootstrapAttempted','lineagePreserved','authorityEvidenceGatesPreserved'],
 'AE-72':['distinctAuthoritiesSatisfied','evidenceSupportsRationale','evidenceAdmissible','executionBlocked'],
};

type Tri = 'unset'|'true'|'false';

export default function MachineAdversarialRunner(){
 const [observations,setObservations]=useState<Record<string,Record<string,Tri>>>({});
 const [refs,setRefs]=useState<Record<string,string>>({});
 const findings=useMemo(()=>machineTests.map(([id])=>{
   const raw=observations[id]??{}; const observed:Record<string,unknown>={};
   for(const key of observationKeys[id]) if(raw[key]&&raw[key]!=='unset') observed[key]=raw[key]==='true';
   return evaluateTA14AdversarialEvidence({testId:id,observed,artifactRefs:(refs[id]??'').split('\n').map(v=>v.trim()).filter(Boolean)});
 }),[observations,refs]);
 const standing=findings.some(f=>f.result==='FAIL')?'NOT SUPPORTED':findings.some(f=>f.result==='UNRESOLVED')?'UNRESOLVED':'SUPPORTED WITHIN TESTED BOUNDARY';
 function exportRecord(){const record={schema:'TA14-Machine-Adversarial-Examination-v1',generatedAt:new Date().toISOString(),standing,findings};const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`ta14-machine-adversarial-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url)}
 return <main className="page"><section className="shell"><nav><Link href="/workspace/ai-governance/adversarial-examination">← Examination Lab</Link><span>TA-14 MACHINE EVIDENCE RUNNER · v1</span></nav><header><p>CONSEQUENCE-BEARING EVIDENCE EVALUATION</p><h1>PASS is computed.<br/><em>It is not selected.</em></h1><div className="standing"><small>WORKING STANDING</small><strong>{standing}</strong><button onClick={exportRecord}>Export machine findings</button></div></header><section className="notice"><strong>No admissible evidence. No admissible execution.</strong><p>Each machine-covered gate evaluates observed facts. Missing observations remain UNRESOLVED. A contradictory consequence-bearing observation produces FAIL. This runner does not itself create Registry standing or an institutional finding.</p></section><section className="grid">{machineTests.map(([id,title],i)=>{const finding=findings[i] as TA14AdversarialFinding;return <article key={id}><div className="top"><b>{id}</b><span className={finding.result.toLowerCase()}>{finding.result}</span></div><h2>{title}</h2><p className="reason">{finding.reason}</p><div className="facts">{observationKeys[id].map(key=><label key={key}><span>{key}</span><select value={observations[id]?.[key]??'unset'} onChange={e=>setObservations(current=>({...current,[id]:{...(current[id]??{}),[key]:e.target.value as Tri}}))}><option value="unset">UNOBSERVED</option><option value="true">TRUE</option><option value="false">FALSE</option></select></label>)}</div><label className="refs"><span>Evidence / artifact references</span><textarea value={refs[id]??''} onChange={e=>setRefs(c=>({...c,[id]:e.target.value}))} placeholder="One immutable artifact, hash, log, or repository reference per line"/></label></article>})}</section></section><style jsx>{`.page{min-height:100vh;background:#02070d;color:#edf7fb}.shell{width:min(1320px,calc(100% - 32px));margin:auto;padding:24px 0 70px}nav{display:flex;justify-content:space-between;border:1px solid #193243;background:#071824;padding:14px 16px;border-radius:14px;font-size:12px;font-weight:900;letter-spacing:.08em}nav a{color:#9bdcf2;text-decoration:none}header{padding:58px 0 24px}header>p{color:#e5b960;font-size:11px;font-weight:900;letter-spacing:.16em}h1{font-size:clamp(42px,7vw,78px);line-height:.95;margin:12px 0 28px}h1 em{font-style:normal;color:#83dff3}.standing{display:grid;grid-template-columns:1fr 2fr auto;align-items:center;border:1px solid #173347;background:#06141f;padding:18px;border-radius:16px}.standing small{color:#7894a3;font-weight:900}.standing strong{font-size:20px}.standing button{background:#e5b960;border:0;border-radius:10px;padding:12px 15px;font-weight:900}.notice{border:1px solid #514628;background:#171407;padding:20px;border-radius:16px;margin:14px 0 24px}.notice strong{color:#e5b960}.notice p{color:#b5b09e;line-height:1.6}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.grid article{border:1px solid #173347;background:#06141f;border-radius:16px;padding:18px}.top{display:flex;justify-content:space-between}.top b{color:#83dff3}.top span{font-size:11px;font-weight:900;letter-spacing:.08em}.pass{color:#83e6b0}.fail{color:#ff8e8e}.unresolved{color:#e5b960}.grid h2{font-size:19px}.reason{color:#9cb1bc;min-height:48px}.facts{display:grid;gap:8px}.facts label,.refs{display:grid;grid-template-columns:1fr 150px;gap:10px;align-items:center}.facts span,.refs span{font-size:12px;color:#bed0d8;overflow-wrap:anywhere}.facts select,.refs textarea{background:#03101a;color:#edf7fb;border:1px solid #234355;border-radius:9px;padding:9px}.refs{grid-template-columns:1fr;margin-top:12px}.refs textarea{min-height:70px}@media(max-width:850px){.grid{grid-template-columns:1fr}.standing{grid-template-columns:1fr;gap:10px}nav{gap:12px;flex-direction:column}}`}</style></main>
}
