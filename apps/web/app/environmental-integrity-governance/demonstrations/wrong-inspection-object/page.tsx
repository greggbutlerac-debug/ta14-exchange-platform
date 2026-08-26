import Link from 'next/link';

const candidates = [
  ['Visible symptom','Three occupied rooms repeatedly exceed the declared humidity envelope.'],
  ['Possible object A','Envelope moisture intrusion affecting one pressure or exposure path.'],
  ['Possible object B','Ventilation or HVAC sequencing creating a localized latent-load condition.'],
  ['Possible object C','Sensor placement, calibration, drift, or attribution failure.'],
  ['Possible object D','Occupancy or process load materially different from the assumed operating state.'],
] as const;

const prohibitions = [
  'Do not convert a visible symptom into a causal finding.',
  'Do not assign fault merely because an accountable surface is visible.',
  'Do not treat localization as proof, admissibility, authority, or consequence.',
  'Do not bind intervention to an object whose inspection boundary remains ambiguous.',
] as const;

export default function WrongInspectionObjectDemo(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#17382e 0,#071511 40%,#030807 80%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{display:'flex',justifyContent:'space-between',gap:20,padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)'}}>
      <Link href='/environmental-integrity-governance/demonstrations' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL PROVING GROUND</Link>
      <span style={{fontSize:12,letterSpacing:'.16em',color:'#9ebcaf'}}>EIG DEMONSTRATION 005 · R1</span>
    </nav>

    <section style={{maxWidth:1200,margin:'0 auto',padding:'76px 24px 34px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>REALITY → RECORD BOUNDARY · OBJECT LOCALIZATION</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,78px)',lineHeight:1,margin:'14px 0 20px'}}>The Wrong Inspection Object</h1>
      <p style={{maxWidth:900,color:'#b8d0c5',fontSize:18,lineHeight:1.7}}>A visible environmental condition has become persistent enough to demand inspection. The failure begins if governance silently assumes that the visible symptom is also the causal object, governed proposition, or authorized target of intervention.</p>
      <div style={{marginTop:26,padding:20,border:'1px solid rgba(255,211,106,.32)',background:'rgba(83,57,8,.16)',borderRadius:14,color:'#f1d994'}}><strong>BOUNDARY RULE:</strong> The object of governance must be sufficiently bounded before evidence concerning that object can acquire proposition-specific admissibility standing. Localization identifies what is being inspected; it does not establish cause, fault, authority, admissibility, or consequence.</div>
    </section>

    <section style={{maxWidth:1200,margin:'0 auto',padding:'20px 24px'}}>
      <small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em'}}>SCENARIO</small>
      <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(32px,5vw,52px)',margin:'8px 0 18px'}}>Three rooms show elevated humidity. What exactly is the inspection object?</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:12}}>{candidates.map(([title,body],i)=><article key={title} style={{padding:23,border:i===0?'1px solid rgba(255,173,142,.35)':'1px solid rgba(120,240,190,.18)',background:i===0?'rgba(49,22,10,.58)':'rgba(5,22,16,.66)',borderRadius:15}}><strong style={{fontSize:19,color:i===0?'#ffad8e':'#e9fff5'}}>{title}</strong><p style={{color:'#b8cdc3',lineHeight:1.65,marginBottom:0}}>{body}</p></article>)}</div>
    </section>

    <section style={{maxWidth:1200,margin:'20px auto',padding:24}}>
      <div style={{padding:30,border:'1px solid rgba(130,187,255,.3)',background:'rgba(7,19,34,.7)',borderRadius:18}}>
        <small style={{color:'#87bcff',fontWeight:900,letterSpacing:'.14em'}}>THE GOVERNANCE TEST</small>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:38,margin:'9px 0 15px'}}>Can the record distinguish the condition without pretending it has already explained it?</h2>
        <p style={{color:'#c2cfdb',lineHeight:1.75}}>The system may preserve the humidity exceedance as an independently inspectable condition while causal identity remains unresolved. Evidence collection can then be bounded to the localized condition and competing propositions. A determination must not inherit certainty that the localization step never established.</p>
      </div>
    </section>

    <section style={{maxWidth:1200,margin:'0 auto',padding:24}}>
      <small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em'}}>PROHIBITED INFERENCES</small>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12,marginTop:12}}>{prohibitions.map((x,i)=><div key={x} style={{padding:20,border:'1px solid rgba(255,146,106,.24)',borderRadius:14,background:'rgba(39,18,10,.45)',color:'#d9c5bb',lineHeight:1.6}}><strong style={{color:'#ffad8e'}}>0{i+1}</strong><br/>{x}</div>)}</div>
    </section>

    <section style={{maxWidth:1200,margin:'18px auto 0',padding:'24px 24px 90px'}}>
      <div style={{padding:28,border:'1px solid rgba(120,240,190,.26)',background:'rgba(5,20,15,.68)',borderRadius:18}}>
        <small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em'}}>TA-14 PLACEMENT</small>
        <p style={{fontFamily:'Georgia,serif',fontSize:'clamp(23px,4vw,34px)',lineHeight:1.45,margin:'10px 0'}}>Unbounded Reality → Localized Inspection Object → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</p>
        <p style={{color:'#b8d0c5',lineHeight:1.7,marginBottom:0}}>The canonical eight-stage TA-14 chain remains unchanged. Object localization is treated as a prerequisite at the Reality → Record boundary: a constraint on honest record formation, not a ninth governance stage.</p>
      </div>
      <blockquote style={{margin:'30px 0 0',padding:'22px 26px',borderLeft:'3px solid #73eab1',background:'rgba(5,20,15,.58)',fontFamily:'Georgia,serif',fontSize:24,lineHeight:1.45}}>Governance can be internally correct and still govern the wrong thing. The inspection object must be bounded before consequence is bound to it.</blockquote>
    </section>
  </main>;
}
