'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SECOND_CORPUS_ARTIFACTS } from '../registry/second-corpus-artifacts';
import { EVIDENCE_HARDENING_ARTIFACTS } from '../registry/evidence-hardening-artifacts';

const artifacts = [...SECOND_CORPUS_ARTIFACTS, ...EVIDENCE_HARDENING_ARTIFACTS];
const chain = ['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'];

export default function ArtifactPage(){
  const p=useParams<{slug:string}>();
  const slug=String(p.slug||'').toLowerCase();
  const a=artifacts.find(x=>x.href.endsWith(slug));
  if(!a)return <main style={{minHeight:'70vh',padding:'80px 24px',background:'#050b12',color:'#eef6ff',fontFamily:'Inter,system-ui,sans-serif'}}><div style={{maxWidth:900,margin:'0 auto'}}><p style={{color:'#7fdfff',fontWeight:800}}>TA-14 ARTIFACTS</p><h1>Artifact record not found.</h1><Link href='/artifacts/registry' style={{color:'#f2cc68'}}>Return to Artifact Registry →</Link></div></main>;
  const hardening=Number(a.artifactId.slice(-6))>=25;
  return <main style={{minHeight:'100vh',padding:'72px 24px 96px',background:'radial-gradient(circle at 85% 0,rgba(68,161,208,.14),transparent 32%),#050b12',color:'#eef6ff',fontFamily:'Inter,system-ui,sans-serif'}}><div style={{maxWidth:1180,margin:'0 auto'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:18,flexWrap:'wrap',alignItems:'center'}}><div><div style={{fontSize:11,letterSpacing:2.2,color:'#f2cc68',fontWeight:900}}>TA-14 EXECUTION ARTIFACT · {hardening?'EVIDENCE HARDENING CORPUS':'SECOND CORPUS'}</div><div style={{marginTop:8,color:'#7fdfff',fontWeight:800}}>{a.artifactId} · {a.registryId}</div></div><Link href='/artifacts/registry' style={{color:'#dbeaf5',textDecoration:'none',border:'1px solid rgba(127,223,255,.22)',padding:'10px 14px',borderRadius:10}}>Open Artifact Registry</Link></div>
    <section style={{marginTop:22,padding:'16px 18px',border:'1px solid rgba(86,227,159,.28)',borderRadius:14,background:'rgba(86,227,159,.05)'}}><strong style={{color:'#56e39f'}}>REGISTRY BOUNDARY · REGISTERED PUBLIC RECORD</strong><p style={{margin:'8px 0 0',color:'#9fb1be',lineHeight:1.65}}>This page preserves artifact identity {a.artifactId} and registry identity {a.registryId}. Claims are bounded to the preserved evidence. Independent standing is not self-awarded.</p></section>
    <h1 style={{fontSize:'clamp(36px,6vw,72px)',lineHeight:1,letterSpacing:'-.045em',margin:'34px 0 18px',maxWidth:980}}>{a.title}</h1>
    <div style={{display:'flex',gap:9,flexWrap:'wrap',marginBottom:28}}><b style={{padding:'8px 11px',borderRadius:999,border:'1px solid rgba(242,204,104,.28)',color:'#f2cc68'}}>{a.determination}</b><span style={{padding:'8px 11px',borderRadius:999,border:'1px solid rgba(127,223,255,.18)',color:'#9fb5c5'}}>{a.sector}</span><span style={{padding:'8px 11px',borderRadius:999,border:'1px solid rgba(127,223,255,.18)',color:'#9fb5c5'}}>Earliest control: {a.earliestControl}</span></div>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,margin:'26px 0'}}>{[['Registry ID',a.registryId],['Execution receipt',a.receipt],['Outcome',a.outcome],['Route',a.routeId]].map(([k,v])=><div key={k} style={{padding:18,border:'1px solid rgba(127,223,255,.13)',borderRadius:14,background:'rgba(7,18,30,.78)'}}><small style={{color:'#71899a',textTransform:'uppercase',letterSpacing:1.2}}>{k}</small><div style={{marginTop:7,fontWeight:800}}>{v}</div></div>)}</section>
    <section style={{padding:'28px 30px',border:'1px solid rgba(242,204,104,.18)',borderRadius:18,background:'linear-gradient(145deg,rgba(242,204,104,.05),rgba(8,19,31,.88))'}}><h2 style={{marginTop:0,fontSize:27}}>Governed finding</h2><p style={{color:'#b1c2cf',lineHeight:1.8,fontSize:16}}>{a.summary}</p></section>
    <h2 style={{fontSize:30,margin:'46px 0 18px'}}>Admissible execution chain</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:9}}>{chain.map((x,i)=><div key={x} style={{padding:15,border:'1px solid rgba(127,223,255,.12)',borderRadius:12,background:'rgba(7,18,30,.72)'}}><small style={{color:'#6f8799'}}>0{i+1}</small><div style={{marginTop:6,fontWeight:850}}>{x}</div><div style={{marginTop:5,fontSize:11,color:x.toUpperCase()===a.earliestControl?'#f2cc68':'#7890a1'}}>{x.toUpperCase()===a.earliestControl?'PRIMARY CONTROL':'PRESERVED'}</div></div>)}</div>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14,marginTop:34}}><div style={{padding:24,border:'1px solid rgba(86,227,159,.2)',borderRadius:15,background:'rgba(86,227,159,.04)'}}><h3 style={{color:'#56e39f',marginTop:0}}>What this record supports</h3><p style={{color:'#afc1ce',lineHeight:1.75}}>{a.proves}</p></div><div style={{padding:24,border:'1px solid rgba(242,204,104,.2)',borderRadius:15,background:'rgba(242,204,104,.04)'}}><h3 style={{color:'#f2cc68',marginTop:0}}>Claims boundary</h3><p style={{color:'#afc1ce',lineHeight:1.75}}>{a.doesNotProve}</p></div></section>
    <section style={{marginTop:34,padding:22,border:'1px solid rgba(127,223,255,.12)',borderRadius:14}}><div style={{fontSize:11,color:'#71899a',letterSpacing:1.3}}>ROOT HASH</div><code style={{display:'block',marginTop:8,color:'#9fdfff',overflowWrap:'anywhere'}}>{a.rootHash}</code><div style={{marginTop:14,fontSize:13,color:'#8298a8'}}>Governance: {a.governanceRegistryId} · {a.governanceName} · Verification level {a.verificationLevel} · Published {a.publishedAt}</div></section>
  </div></main>;
}
