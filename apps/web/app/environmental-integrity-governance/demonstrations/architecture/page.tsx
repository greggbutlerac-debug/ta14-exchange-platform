import Link from 'next/link';

const stages = [
  ['01','Reality','Declare the bounded environmental condition, place, time, affected environment, and proposed consequence.'],
  ['02','Record','Preserve the measurements, observations, source identity, timestamps, calibration or provenance context, and known limitations.'],
  ['03','Continuity','Establish whether the evidence remains attributable and continuous from observation through the governed decision point.'],
  ['04','Admissibility','Determine whether each evidence object is admissible for this proposition and this consequence — not merely whether the data exists.'],
  ['05','Binding','Bind the admitted evidence, governing threshold, authority, scope, non-claims, and changed-condition rules to the proposed action.'],
  ['06','Commit','Revalidate immediately before consequence. Material change can force HOLD, DENY, or ESCALATE before the boundary is crossed.'],
  ['07','Execution','Permit only the bounded execution actually supported by the admitted evidence and declared authority.'],
  ['08','Outcome','Preserve what occurred, what did not occur, resulting conditions, unresolved uncertainty, and the evidence required for any new chain.'],
];

const required = [
  'A bounded proposition that can actually be tested',
  'Declared claims and explicit non-claims',
  'Frozen or otherwise identifiable evidence inputs',
  'Source, time, location, provenance, and uncertainty context',
  'A consequence-specific admissibility test',
  'Changed-condition and contradiction handling',
  'A declared authority and execution boundary',
  'ALLOW / HOLD / DENY / ESCALATE determination grammar',
  'A preserved pre-commit determination',
  'An inspectable outcome record and unresolved-condition record',
];

const families = [
  ['Conflicting environmental records','Competing measurements, contexts, instruments, or observations.'],
  ['Mold & moisture','Risk envelopes, moisture events, remediation evidence, and post-intervention conditions.'],
  ['Legionella','Water-system evidence, thresholds, uncertainty, intervention authority, and verification.'],
  ['HVACD/R performance','Performance records, diagnostic evidence, intervention boundaries, and post-intervention proof.'],
  ['Schools & public environments','Occupancy, ventilation, particulate, CO₂, humidity, outdoor conditions, and consequence decisions.'],
  ['AIR / PAIR','Longitudinal atmospheric records whose meaning depends on person, place, time, exposure, and provenance.'],
  ['Pollution & community monitoring','Distributed sensing, source context, conflicting observations, thresholds, and public consequence.'],
  ['Changed conditions','Cases where initially supportable action becomes unsupported before execution.'],
];

export default function EIGDemonstrationArchitecturePage(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#12372d 0,#071511 38%,#030807 78%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)',display:'flex',gap:24,flexWrap:'wrap'}}>
      <Link href='/environmental-integrity-governance' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link>
      <Link href='/environmental-integrity-governance/demonstrations' style={{color:'#b8d0c5',textDecoration:'none',fontWeight:800}}>PROVING GROUND</Link>
    </nav>
    <section style={{maxWidth:1180,margin:'0 auto',padding:'72px 24px 96px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>EIG DEMONSTRATION ARCHITECTURE · R1</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,78px)',lineHeight:1.02,margin:'14px 0 22px'}}>One architecture. Many environmental realities.</h1>
      <p style={{maxWidth:900,color:'#b8d0c5',fontSize:19,lineHeight:1.75}}>Every EIG demonstration should test a bounded proposition without rewriting the governance framework around the desired result. The environmental subject may change. The evidence may change. The consequence may change. The integrity requirements do not.</p>

      <div style={{marginTop:42,padding:28,border:'1px solid rgba(120,240,190,.34)',borderRadius:18,background:'rgba(7,28,21,.82)'}}>
        <small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em'}}>GOVERNING RULE</small>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,48px)',margin:'10px 0 8px'}}>No admissible evidence. No admissible execution.</h2>
        <p style={{color:'#b8d0c5',lineHeight:1.7,margin:0}}>A measurement does not acquire authority merely because it exists. Evidence must remain attributable, proposition-relevant, consequence-sufficient, and valid at the commit boundary.</p>
      </div>

      <h2 style={{fontFamily:'Georgia,serif',fontSize:42,margin:'64px 0 18px'}}>Canonical demonstration chain</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14}}>
        {stages.map(([n,title,copy])=><article key={n} style={{padding:22,border:'1px solid rgba(120,240,190,.2)',borderRadius:16,background:'rgba(5,20,15,.68)'}}><small style={{color:'#71e5ad',fontWeight:900}}>{n}</small><h3 style={{fontFamily:'Georgia,serif',fontSize:27,margin:'7px 0 9px'}}>{title}</h3><p style={{color:'#a9c3b7',lineHeight:1.62,margin:0}}>{copy}</p></article>)}
      </div>

      <h2 style={{fontFamily:'Georgia,serif',fontSize:42,margin:'64px 0 18px'}}>Minimum demonstration record</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:10}}>
        {required.map((item,i)=><div key={item} style={{padding:'16px 18px',borderLeft:'3px solid #58dda7',background:'rgba(5,20,15,.62)',color:'#c4d9cf',lineHeight:1.55}}><strong style={{color:'#83f0bd',marginRight:9}}>{String(i+1).padStart(2,'0')}</strong>{item}</div>)}
      </div>

      <div style={{marginTop:60,padding:28,border:'1px solid rgba(255,214,112,.25)',borderRadius:18,background:'rgba(35,28,8,.28)'}}>
        <small style={{color:'#f0cf75',fontWeight:900,letterSpacing:'.14em'}}>ANTI-LAUNDERING RULE</small>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:34,margin:'10px 0'}}>The demonstration may expose uncertainty. It may not erase it.</h2>
        <p style={{color:'#cfc8ad',lineHeight:1.7,margin:0}}>Contradictions, missing correspondence, unsupported bridges, unavailable authority, changed conditions, and unresolved limitations remain visible. A bounded PASS cannot silently become a broader claim. A later replay cannot retrospectively repair the evidence state that existed at commit.</p>
      </div>

      <h2 style={{fontFamily:'Georgia,serif',fontSize:42,margin:'64px 0 18px'}}>Reusable demonstration families</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:14}}>
        {families.map(([title,copy])=><article key={title} style={{padding:22,border:'1px solid rgba(120,240,190,.18)',borderRadius:16,background:'rgba(5,20,15,.58)'}}><h3 style={{fontFamily:'Georgia,serif',fontSize:25,margin:'0 0 8px'}}>{title}</h3><p style={{color:'#a9c3b7',lineHeight:1.62,margin:0}}>{copy}</p></article>)}
      </div>

      <div style={{marginTop:60,padding:'30px 0',borderTop:'1px solid rgba(120,240,190,.2)'}}>
        <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.12em',fontSize:12}}>THE STANDARD IS NOT WHETHER THE DASHBOARD LOOKS CONVINCING.</p>
        <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,48px)',lineHeight:1.18,margin:'12px 0 22px'}}>The standard is whether the evidence can defensibly support the consequence at the moment execution becomes real.</p>
        <Link href='/environmental-integrity-governance/demonstrations' style={{display:'inline-block',padding:'14px 18px',borderRadius:12,background:'#83f0bd',color:'#04140e',textDecoration:'none',fontWeight:950}}>ENTER THE PROVING GROUND →</Link>
      </div>
    </section>
  </main>;
}
