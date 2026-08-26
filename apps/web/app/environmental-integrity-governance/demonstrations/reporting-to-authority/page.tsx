import Link from 'next/link';

const stages = [
  ['01','MONITORING','Sensors observe environmental conditions over time.'],
  ['02','REPORTING','Historical measurements are aggregated, compared, summarized, and communicated.'],
  ['03','GOVERNED EVIDENCE','Attribution, chronology, continuity, scope, context, limitations, and integrity are preserved.'],
  ['04','ADMISSIBILITY','The record is tested against the specific proposition and consequence it is being asked to support.'],
  ['05','AUTHORITY','A bounded determination identifies what action, reliance, or escalation is actually authorized.'],
  ['06','EXECUTION','Only an admissible, presently valid determination may cross the governed execution boundary.'],
] as const;

const tests = [
  ['Attribution','Can the relevant measurements be attributed to identified instruments, locations, periods, and operating context?'],
  ['Continuity','Can the record show that the evidence remained sufficiently chronological, intact, and comparable for the proposition?'],
  ['Context','Are occupancy, HVAC state, outdoor conditions, activities, interventions, and other material conditions preserved where relevant?'],
  ['Proposition fit','Does the record support this specific conclusion rather than merely a broader environmental observation?'],
  ['Present standing','Has anything materially changed since the record or report was produced?'],
  ['Authority','Who or what is permitted to bind consequence, and what is the declared limit of that authority?'],
] as const;

export default function ReportingToAuthorityDemo(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#12372d 0,#071511 38%,#030807 78%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{display:'flex',justifyContent:'space-between',gap:20,padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)',background:'rgba(3,12,9,.82)',position:'sticky',top:0,zIndex:10,backdropFilter:'blur(16px)'}}>
      <Link href='/environmental-integrity-governance/demonstrations' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL PROVING GROUND</Link>
      <span style={{fontSize:12,letterSpacing:'.16em',color:'#9ebcaf'}}>EIG DEMONSTRATION 003 · R1</span>
    </nav>

    <section style={{maxWidth:1240,margin:'0 auto',padding:'72px 24px 34px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>FROM ENVIRONMENTAL REPORTING TO ENVIRONMENTAL AUTHORITY</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(42px,7vw,80px)',lineHeight:.98,margin:'14px 0 20px'}}>What is this record<br/>authorized to cause?</h1>
      <p style={{maxWidth:900,color:'#b8d0c5',fontSize:18,lineHeight:1.7}}>Continuous monitoring can observe environmental reality. Historical reporting can organize and interpret those observations. Neither function, by itself, establishes that a record has standing to authorize a consequential building action. This demonstration isolates the boundary between useful environmental information and governed environmental authority.</p>
      <div style={{marginTop:26,padding:18,border:'1px solid rgba(255,211,106,.32)',background:'rgba(83,57,8,.16)',color:'#f1d994'}}><strong>NON-CLAIM:</strong> TA-14 does not claim that historical exposure reporting is invalid, insufficient for every use, or equivalent to environmental governance. The question here is narrower: what additional conditions must be established before a record may support governed consequence?</div>
    </section>

    <section style={{maxWidth:1240,margin:'0 auto',padding:'18px 24px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em',fontSize:12}}>THE ARCHITECTURAL LADDER</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>{stages.map(([n,title,body])=><article key={n} style={{padding:24,border:'1px solid rgba(120,240,190,.2)',background:'rgba(6,24,18,.74)',borderRadius:16}}><small style={{color:'#6ee8ad',fontWeight:900}}>{n}</small><h2 style={{fontFamily:'Georgia,serif',fontSize:27,margin:'8px 0'}}>{title}</h2><p style={{color:'#b7cec3',lineHeight:1.65,margin:0}}>{body}</p></article>)}</div>
    </section>

    <section style={{maxWidth:1240,margin:'24px auto',padding:24}}>
      <div style={{padding:30,border:'1px solid rgba(120,240,190,.28)',borderRadius:18,background:'rgba(4,21,15,.9)'}}>
        <small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em'}}>THE DISTINCTION</small>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(32px,5vw,52px)',margin:'8px 0 16px'}}>A report can describe a condition without possessing authority to bind consequence.</h2>
        <p style={{color:'#c7d9d1',lineHeight:1.75,maxWidth:1000}}>A threshold exceedance, exposure percentage, trend, score, alarm, dashboard state, historical chart, or standardized report may be highly useful evidence. The governance question begins when that information is asked to justify a specific action: restrict occupancy, alter HVAC operation, authorize remediation, reopen a space, attribute responsibility, spend money, trigger an automated control, or support another consequential decision.</p>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:'0 auto',padding:24}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em',fontSize:12}}>ADMISSIBILITY TESTS BEFORE CONSEQUENCE</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:12}}>{tests.map(([title,body])=><article key={title} style={{padding:22,border:'1px solid rgba(120,240,190,.18)',background:'rgba(5,22,16,.66)',borderRadius:14}}><strong style={{display:'block',fontSize:20,color:'#e9fff5',marginBottom:8}}>{title}</strong><p style={{margin:0,color:'#afc8bc',lineHeight:1.65}}>{body}</p></article>)}</div>
    </section>

    <section style={{maxWidth:1240,margin:'20px auto',padding:24}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16}}>
        <article style={{padding:26,border:'1px solid rgba(110,232,173,.25)',background:'rgba(8,31,23,.72)',borderRadius:18}}><small style={{color:'#71e5ad',fontWeight:900}}>MONITORED / REPORTED ENVIRONMENT</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34}}>What happened?</h2><p style={{color:'#b7cec3',lineHeight:1.7}}>Measures conditions, preserves trends, applies thresholds or analytical rules, and communicates observed or calculated environmental state.</p></article>
        <article style={{padding:26,border:'1px solid rgba(130,187,255,.3)',background:'rgba(7,19,34,.72)',borderRadius:18}}><small style={{color:'#87bcff',fontWeight:900}}>PROVABLE ENVIRONMENT</small><h2 style={{fontFamily:'Georgia,serif',fontSize:34}}>What may happen because of it?</h2><p style={{color:'#bccbdb',lineHeight:1.7}}>Preserves the evidentiary and authority chain needed to defend why a consequential action was ALLOWed, HOLDed, DENYed, or ESCALATEd at the governed boundary.</p></article>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:'18px auto 0',padding:'24px 24px 90px'}}>
      <div style={{padding:28,border:'1px solid rgba(255,209,92,.28)',borderRadius:18,background:'rgba(40,31,5,.42)'}}><small style={{color:'#ffd15c',fontWeight:900,letterSpacing:'.14em'}}>PUBLIC CASE REFERENCE · AUGUST 25, 2026</small><h2 style={{fontFamily:'Georgia,serif',fontSize:32,margin:'9px 0'}}>HibouAir · GO IAQS Historical Exposure Reports</h2><p style={{color:'#d6cda8',lineHeight:1.7,maxWidth:980}}>HibouAir publicly describes turning continuously collected historical indoor environmental measurements into structured GO IAQS exposure reports, including occupied-period analysis and historical context. TA-14 uses that public development here only as a boundary case: it demonstrates the increasing value of structured environmental reporting while leaving the separate governance question of admissible consequence expressly open.</p><a href='https://www.hibouair.com/blog/hibouair-introduces-go-iaqs-reports/' target='_blank' rel='noreferrer' style={{display:'inline-block',marginTop:10,color:'#ffd15c',fontWeight:900}}>VIEW PUBLIC SOURCE ↗</a></div>
      <blockquote style={{margin:'38px 0 0',padding:'24px 28px',borderLeft:'3px solid #73eab1',background:'rgba(5,20,15,.62)',fontFamily:'Georgia,serif',fontSize:25,lineHeight:1.45}}>Continuous monitoring observes the environment. Historical reporting interprets the observations. Environmental Integrity Governance determines whether the evidence has standing for consequence.</blockquote>
      <div style={{marginTop:20,padding:22,border:'1px solid rgba(120,240,190,.2)',background:'rgba(5,20,15,.62)',borderRadius:14}}><strong style={{color:'#83f0bd'}}>TA-14 governing rule:</strong><p style={{margin:'8px 0 0',fontSize:22,fontFamily:'Georgia,serif'}}>No admissible environmental evidence. No admissible environmental intervention.</p></div>
    </section>
  </main>;
}
