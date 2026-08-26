import Link from 'next/link';

const evidence=[
 ['T0 · Baseline','Localized elevated moisture is documented at the affected wall assembly. HVAC operation, indoor RH, visible condition, instrument identity, location, and time are preserved.','SUPPORTS INVESTIGATION'],
 ['T1 · Initial determination','The admitted record supports a bounded source investigation and limited non-destructive intervention. It does not establish whole-building contamination, medical causation, or a remediation scope.','ALLOW — BOUNDED'],
 ['T2 · Material change','Before commit, a new active water event is observed and indoor humidity materially changes. The frozen T0 condition no longer represents the execution environment.','REVALIDATION REQUIRED'],
 ['T3 · Commit boundary','The earlier ALLOW cannot be carried forward as if nothing changed. The proposed intervention is held until the changed condition is recorded and the proposition is re-established.','HOLD'],
];

export default function ChangedConditionMoisturePage(){
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#15392f 0,#071511 38%,#030807 78%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
  <nav style={{padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)',display:'flex',gap:24,flexWrap:'wrap'}}><Link href='/environmental-integrity-governance/demonstrations' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL PROVING GROUND</Link><Link href='/environmental-integrity-governance/demonstrations/architecture' style={{color:'#b8d0c5',textDecoration:'none',fontWeight:800}}>DEMONSTRATION ARCHITECTURE</Link></nav>
  <section style={{maxWidth:1180,margin:'0 auto',padding:'72px 24px 96px'}}>
   <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>EIG DEMONSTRATION 002 · R1 · CHANGED-CONDITION CONTROL</p>
   <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,76px)',lineHeight:1.02,margin:'14px 0 20px'}}>The Moisture Condition Changed Before Commit.</h1>
   <p style={{maxWidth:900,color:'#b8d0c5',fontSize:19,lineHeight:1.72}}>An environmental intervention can be supportable when evaluated and still become inadmissible before execution. This case tests whether governance notices the difference.</p>
   <div style={{marginTop:38,padding:26,border:'1px solid rgba(120,240,190,.32)',borderRadius:18,background:'rgba(7,28,21,.82)'}}><small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.13em'}}>BOUNDED PROPOSITION</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34,margin:'9px 0'}}>May the originally authorized moisture intervention proceed after a material environmental change occurs before commitment?</h2><p style={{color:'#b8d0c5',lineHeight:1.65,margin:0}}>Non-claims: this demonstration does not diagnose illness, establish mold species or exposure, assign construction liability, or prescribe a complete remediation protocol.</p></div>
   <h2 style={{fontFamily:'Georgia,serif',fontSize:40,margin:'58px 0 18px'}}>Evidence sequence</h2>
   <div style={{display:'grid',gap:14}}>{evidence.map(([t,title,copy,result])=><article key={t} style={{padding:24,border:'1px solid rgba(120,240,190,.2)',borderRadius:16,background:'rgba(5,20,15,.66)'}}><small style={{color:'#71e5ad',fontWeight:900}}>{t}</small><h3 style={{fontFamily:'Georgia,serif',fontSize:29,margin:'7px 0'}}>{title}</h3><p style={{color:'#aac3b8',lineHeight:1.62}}>{copy}</p><strong style={{display:'inline-block',padding:'7px 10px',borderRadius:8,background:'rgba(113,229,173,.12)',color:'#83f0bd'}}>{result}</strong></article>)}</div>
   <div style={{marginTop:48,padding:30,border:'1px solid rgba(255,211,104,.3)',borderRadius:18,background:'rgba(45,31,7,.32)'}}><small style={{color:'#f0cf75',fontWeight:900,letterSpacing:'.14em'}}>GOVERNED DETERMINATION</small><h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(38px,6vw,58px)',margin:'10px 0'}}>HOLD</h2><p style={{color:'#d2c9a8',fontSize:18,lineHeight:1.7}}>The T0 evidence remains a valid historical record. It no longer establishes present admissibility for the T3 consequence. The changed condition begins a revalidation requirement; it does not silently inherit the earlier ALLOW.</p></div>
   <h2 style={{fontFamily:'Georgia,serif',fontSize:40,margin:'58px 0 16px'}}>What this demonstrates</h2>
   <p style={{maxWidth:920,color:'#b8d0c5',fontSize:18,lineHeight:1.75}}>Historical supportability ≠ present execution standing. Permission at T0 does not authorize a materially different reality at T3. The governance function is not merely to record that conditions changed; it is to prevent the stale determination from crossing the commit boundary.</p>
   <div style={{marginTop:34,padding:24,borderLeft:'4px solid #58dda7',background:'rgba(5,20,15,.62)'}}><strong style={{fontSize:20}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</strong><p style={{color:'#aac3b8',lineHeight:1.65,marginBottom:0}}>When Reality changes before Commit, the chain must not pretend the old admissibility determination still governs the new reality.</p></div>
  </section>
 </main>;
}
