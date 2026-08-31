import Link from 'next/link';

export const dynamic='force-dynamic';
export const metadata={title:'TA-14 AEA Connected Provenance Series',description:'Four connected provenance artifacts preserving separate bilateral boundaries and a final combined chronology.'};

const cards=[
 {n:'01',title:'AB Sahoo / BIGMAE',subtitle:'When the Review Boundary Became the Evidence',status:'PUBLISHED',href:'/workspace/ai-governance/registry/showcase/TA-14-AIGR-0001/artifacts/ta14-ea-000041',note:'Review-boundary and provenance-reconciliation record.'},
 {n:'02',title:'Tim Zlomke / Harmonic',subtitle:'When the Provenance Trail Reached a Third Architect',status:'PUBLISHED',href:'/workspace/ai-governance/registry/showcase/TA-14-AIGR-0001/artifacts/ta14-ea-000042',note:'Cooperative third-party provenance reconciliation.'},
 {n:'03',title:'Gary Williams / Elias',subtitle:'When Two Governance Architectures Let the Evidence Correct Both of Them',status:'PUBLISHED',href:'/workspace/ai-governance/registry/showcase/TA-14-AIGR-0001/artifacts/ta14-ea-000043',note:'Reciprocal provenance reconciliation preserving separate antecedence, convergence, bidirectional influence, and unresolved states.'},
 {n:'04',title:'Combined Multi-Party Record',subtitle:'The Connected Multi-Party Provenance Record',status:'PUBLISHED',href:'/workspace/ai-governance/registry/showcase/TA-14-AIGR-0001/artifacts/ta14-ea-000044',note:'Final series record connecting all three evidence-bearing lanes without manufacturing cross-participant causation.'},
];

export default function Page(){return <main style={{minHeight:'100vh',color:'#f5f8fc',background:'radial-gradient(circle at 10% 5%,rgba(34,96,153,.26),transparent 27%),radial-gradient(circle at 88% 9%,rgba(225,177,76,.16),transparent 26%),linear-gradient(180deg,#01050b,#04111f 45%,#02070d)'}}><div style={{width:'min(1180px,calc(100% - 40px))',margin:'0 auto',padding:'44px 0 90px'}}>
 <p style={{color:'#efc66e',fontSize:11,fontWeight:900,letterSpacing:'.15em'}}>TA-14 ADMISSIBLE EXECUTION ARCHITECTURE GOVERNANCE SHOWCASE</p>
 <h1 style={{fontSize:'clamp(46px,7vw,88px)',lineHeight:.92,letterSpacing:'-.055em',margin:'18px 0 0'}}>THE CONNECTED PROVENANCE RECORD</h1>
 <p style={{maxWidth:920,color:'#a8bfd3',fontSize:20,lineHeight:1.7}}>Four artifacts. Separate evidentiary boundaries. One connected historical problem. The complete series lets readers move between each bilateral record and the final combined chronology without treating exposure, association, or similarity as causation.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:16,marginTop:34}}>{cards.map(c=><article key={c.n} style={{border:'1px solid rgba(148,163,184,.22)',borderRadius:22,padding:24,background:'rgba(6,20,34,.82)'}}>
   <div style={{display:'flex',justifyContent:'space-between',gap:14,alignItems:'start'}}><span style={{width:45,height:45,borderRadius:99,display:'grid',placeItems:'center',border:'1px solid rgba(239,198,110,.36)',color:'#efc66e',fontWeight:950}}>{c.n}</span><span style={{color:'#efc66e',fontSize:10,fontWeight:900,letterSpacing:'.12em'}}>{c.status}</span></div>
   <h2 style={{fontSize:28,margin:'22px 0 5px'}}>{c.title}</h2><p style={{color:'#efc66e',fontWeight:850,margin:'0 0 12px'}}>{c.subtitle}</p><p style={{color:'#9bb2c7',lineHeight:1.65}}>{c.note}</p>
   <Link href={c.href} style={{display:'inline-flex',marginTop:8,padding:'12px 16px',borderRadius:10,background:'linear-gradient(135deg,#f1cd7d,#d3a347)',color:'#07111b',fontWeight:950,textDecoration:'none'}}>Open artifact</Link>
 </article>)}</div>
 <section style={{marginTop:26,border:'1px solid rgba(239,198,110,.30)',borderRadius:22,padding:25,background:'rgba(12,22,30,.78)'}}><h2 style={{marginTop:0}}>Series rule</h2><p style={{color:'#a8bfd3',lineHeight:1.75,fontSize:17}}>A connected chronology does not create a connected attribution. Each bilateral artifact stands on its own affirmative evidence. The combined record maps the historically connected routes but cannot manufacture proposition-level causation that the individual records do not establish.</p></section>
 <p style={{marginTop:28}}><Link href="/workspace/ai-governance/registry/showcase/TA-14-AIGR-0001" style={{color:'#efc66e',fontWeight:900,textDecoration:'none'}}>Return to TA-14 AEA Governance Showcase</Link></p>
 </div></main>}
