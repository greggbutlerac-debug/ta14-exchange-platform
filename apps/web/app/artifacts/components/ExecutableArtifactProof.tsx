'use client';

import { getGeneratedExecutionEvidence } from '../../../lib/execution-artifacts/generated-evidence';

const repo='https://github.com/greggbutlerac-debug/ta14-exchange-platform/blob/main/';
const codeStyle={display:'block',whiteSpace:'pre-wrap' as const,overflowWrap:'anywhere' as const,padding:18,borderRadius:12,background:'#02060a',border:'1px solid rgba(127,223,255,.14)',color:'#bfe9ff',fontSize:12,lineHeight:1.65};

export default function ExecutableArtifactProof({artifactId}:{artifactId:string}){
 const evidence=getGeneratedExecutionEvidence(artifactId);
 if(!evidence)return <section style={{margin:'36px 0',padding:24,border:'1px solid #f2cc68',borderRadius:16}}><b>EXECUTABLE EVIDENCE NOT AVAILABLE</b><p>No generated executable evidence package is attached to this record.</p></section>;
 const n=Number(artifactId.slice(-6));
 const specPath=n<=12?'apps/web/lib/execution-artifacts/specifications/founding-corpus-specifications.ts':n<=24?'apps/web/lib/execution-artifacts/specifications/second-corpus-specifications.ts':'apps/web/lib/execution-artifacts/specifications/evidence-hardening-specifications.ts';
 return <section id='executable-artifact-proof' style={{margin:'52px 0',padding:'28px 30px',border:'2px solid rgba(86,227,159,.45)',borderRadius:18,background:'rgba(2,10,16,.92)',color:'#eef6ff'}}>
  <div style={{fontSize:12,letterSpacing:2,color:'#56e39f',fontWeight:900}}>EXECUTABLE ARTIFACT · INSPECT THE PROOF</div>
  <h2 style={{fontSize:32,margin:'10px 0'}}>This is the executable artifact itself.</h2>
  <p style={{color:'#afc1ce',lineHeight:1.75}}>This surface is generated from the frozen specification through the TA-14 eight-stage execution harness. Inspect the predicates, trace, receipt, manifest, cryptographic root and source code below.</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:12,margin:'20px 0 34px'}}>{[['Determination',evidence.receipt.determination],['Terminal stage',evidence.receipt.terminalStage],['Route',evidence.receipt.routeId],['Executed at',evidence.receipt.executedAt]].map(([k,v])=><div key={k} style={{padding:15,border:'1px solid rgba(127,223,255,.15)',borderRadius:12}}><small style={{color:'#71899a'}}>{k}</small><div style={{fontWeight:900,marginTop:5,overflowWrap:'anywhere'}}>{v}</div></div>)}</div>
  <h3>1. Frozen specification / input</h3><code style={codeStyle}>{JSON.stringify(evidence.specification,null,2)}</code>
  <h3 style={{marginTop:38}}>2. Executed eight-stage trace</h3><div style={{display:'grid',gap:8}}>{evidence.trace.map((t,i)=><div key={t.stage} style={{padding:14,border:'1px solid rgba(127,223,255,.14)',borderRadius:10,display:'grid',gridTemplateColumns:'42px minmax(100px,140px) minmax(100px,130px) 1fr',gap:8}}><span style={{color:'#71899a'}}>0{i+1}</span><b>{t.stage}</b><b style={{color:t.disposition==='PASS'?'#56e39f':t.disposition==='NOT_REACHED'?'#71899a':'#f2cc68'}}>{t.disposition}</b><span style={{color:'#a9bdca'}}>{t.reason}</span></div>)}</div>
  <h3 style={{marginTop:38}}>3. Machine-generated execution receipt</h3><code style={codeStyle}>{JSON.stringify(evidence.receipt,null,2)}</code>
  <h3 style={{marginTop:38}}>4. Evidence manifest</h3><code style={codeStyle}>{JSON.stringify(evidence.manifest,null,2)}</code>
  <h3 style={{marginTop:38}}>5. Cryptographic package root</h3><code style={codeStyle}>{evidence.rootHash}</code>
  <h3 style={{marginTop:38}}>6. Source code and reproduction</h3><div style={{display:'flex',gap:14,flexWrap:'wrap'}}><a style={{color:'#7fdfff'}} target='_blank' rel='noreferrer' href={repo+'apps/web/lib/execution-artifacts/execution-harness.ts'}>Execution harness ↗</a><a style={{color:'#7fdfff'}} target='_blank' rel='noreferrer' href={repo+specPath}>Frozen specification ↗</a><a style={{color:'#7fdfff'}} target='_blank' rel='noreferrer' href={repo+'apps/web/lib/execution-artifacts/generated-evidence.ts'}>Evidence generator ↗</a><a style={{color:'#7fdfff'}} target='_blank' rel='noreferrer' href={repo+specPath.replace('.ts','.test.ts')}>Mutation tests ↗</a></div>
  <div style={{marginTop:28,padding:18,border:'1px solid rgba(242,204,104,.25)',borderRadius:12}}><b style={{color:'#f2cc68'}}>CLAIMS BOUNDARY</b><p style={{color:'#afc1ce',marginBottom:0}}>{evidence.specification.claimsBoundary}</p></div>
 </section>;
}
