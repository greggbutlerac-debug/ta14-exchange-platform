import Link from 'next/link';

const admitted=[
 {google:4,delivered:1,title:'Have humans ever tried eating raw oysters? Can they eat them without ...'},
 {google:5,delivered:2,title:'How dangerous or how much of a life threatening risk is it to eat raw oysters?'},
 {google:6,delivered:3,title:'Oyster Myths & Facts (April 2025)'},
 {google:8,delivered:4,title:'The Right Way to Eat a Raw Oyster'},
];
const denied=[1,2,3,7,9,10];
const card={border:'1px solid rgba(255,255,255,.14)',borderRadius:18,padding:22,background:'#07131d'} as const;
export default function Page(){return <main style={{minHeight:'100vh',background:'#02080d',color:'#f5fbff',fontFamily:'Arial,sans-serif',padding:'42px 20px'}}><div style={{maxWidth:1180,margin:'0 auto'}}>
 <nav style={{marginBottom:28}}><Link href="/ai-governance/admissible-computation" style={{color:'#74ddff'}}>← ACA Showcase</Link></nav>
 <p style={{letterSpacing:3,fontWeight:900,color:'#74ddff'}}>TA-14 · ACA EVIDENCE SHOWCASE</p>
 <h1 style={{fontSize:'clamp(2.7rem,7vw,6rem)',lineHeight:.94,margin:'12px 0 18px'}}>THE SIX RESULTS<br/>YOU NEVER SAW.</h1>
 <p style={{fontSize:'clamp(1.1rem,2vw,1.45rem)',maxWidth:900,lineHeight:1.55}}>One live provider run. Ten Google candidates frozen exactly as established. Four crossed the governed delivery boundary. Six did not. TA-14 preserved both sides of the event — including why.</p>
 <div style={{...card,marginTop:28,borderColor:'#2c9dcc'}}><b>FROZEN RECORD · ASG-MTXOZ67X</b><p>Request: <strong>eat raw oysters</strong> · Provider: GOOGLE_VIA_SERPER · Requested 10 · Returned 10 · Evaluated 10</p><div style={{display:'flex',gap:12,flexWrap:'wrap'}}>{[['ALLOW','4'],['HOLD','0'],['DENY','6'],['ESCALATE','0'],['DELIVERED','4']].map(([a,b])=><span key={a} style={{padding:'10px 14px',border:'1px solid #385267',borderRadius:9}}><b>{a}</b> {b}</span>)}</div></div>
 <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:18,marginTop:18}}>
  <div style={{...card,borderColor:'#2fcf7b'}}><p style={{color:'#65e89e',fontWeight:900}}>ADMITTED EVIDENCE</p><h2>4 crossed the boundary</h2><p>Each retained its original Google rank and acquired a separate delivered rank. ALLOW means bounded delivery standing under the active request and profile — not absolute truth.</p>{admitted.map(x=><div key={x.google} style={{padding:'13px 0',borderTop:'1px solid #20313d'}}><b>Google #{x.google} → Delivered #{x.delivered}</b><br/><span>{x.title}</span><br/><small style={{color:'#65e89e'}}>ALLOW · EVIDENCE_SUFFICIENT · T2</small></div>)}</div>
  <div style={{...card,borderColor:'#e35d68'}}><p style={{color:'#ff7c86',fontWeight:900}}>NON-ADMITTED EVIDENCE</p><h2>6 did not cross</h2><p>They were not erased, silently replaced, or renumbered. Their original provider rank and reason for non-delivery remain evidence.</p>{denied.map(x=><div key={x} style={{padding:'13px 0',borderTop:'1px solid #20313d'}}><b>Google #{x}</b><br/><small style={{color:'#ff7c86'}}>DENY · REL_SCOPE_FAIL · T1</small><br/><span>Insufficient bounded coverage of the request's meaningful subject tokens after lexical normalization.</span></div>)}</div>
 </section>
 <section style={{...card,marginTop:18}}><p style={{letterSpacing:2,fontWeight:900}}>THE SAME PRINCIPLE · TWO BOUNDARIES</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:22}}><div><h2 style={{color:'#74ddff'}}>ACA · COMPUTATIONAL CONSEQUENCE</h2><p>Candidate → frozen evidence → governed evaluation → delivery or non-delivery → reason preserved.</p><b>Why didn't this result cross the boundary?</b></div><div><h2 style={{color:'#ff7c86'}}>AEA · EXECUTION CONSEQUENCE</h2><p>Consequence proposed → Execution Reality → Execution or Admissible Non-Occurrence → Prevented Consequence.</p><b>Why didn't this action occur?</b></div></div></section>
 <section style={{...card,marginTop:18,textAlign:'center'}}><h2>Retrieval is not delivery authority.</h2><p>Google supplies the candidates. TA-14 governs delivery. What crossed is preserved. What did not cross is preserved. Why is preserved.</p><Link href="/ai-governance/admissible-computation/search" style={{display:'inline-block',marginTop:8,padding:'13px 18px',border:'1px solid #74ddff',borderRadius:10,color:'#74ddff',fontWeight:900}}>RUN ADMISSIBLE SEARCH →</Link></section>
 <p style={{textAlign:'center',marginTop:32,fontWeight:900,letterSpacing:2}}>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</p>
 </div></main>}
