import Link from 'next/link';
import ERARecordedExamination from './ERARecordedExamination';

export const metadata = {
  title: 'Elias Reference Agent | TA-14 Governed Showcase',
  description: 'TA-14 governed showcase for the Elias Reference Agent v1.0 registered as TA-14-AIGR-000041.',
};

const claims = [
  'Separates technical capability from execution authority.',
  'Evaluates constituted execution-governance conditions before consequential execution.',
  'Can withhold or refuse execution when required governing conditions are not satisfied.',
  'Can reassess execution standing when materially relevant conditions change.',
  'A previously valid permission does not automatically establish present authority after a relevant state change.',
  'Preserves human authority as external to the agent’s own capability.',
  'Permits uncertainty to remain an admissible state rather than silently converting uncertainty into permission.',
  'Can produce decision evidence showing why execution was permitted, withheld, refused, contained, or escalated.',
  'Is designed to preserve failed or adverse evidence rather than rewrite the historical record.',
  'Represents changes to a frozen implementation through a successor object rather than silent retrospective alteration.',
];

const boundaries = [
  'Not a universal AI-safety or alignment solution.',
  'Does not make an AI system safe merely by being present.',
  'Does not independently create legal authority, organisational authority, jurisdiction, human consent, or policy legitimacy.',
  'Does not guarantee external identity, authority, state, scope, or jurisdictional facts are truthful without independent verification.',
  'Does not guarantee prevention of irreversible consequences outside the governed execution path.',
  'Does not establish production readiness for every consequential domain.',
  'A PASS in one bounded test does not establish standing under materially different conditions.',
];

const limits = [
  ['INPUT STANDING','Decisions depend on the quality, freshness, provenance, and trustworthiness of governance inputs.'],
  ['EXECUTION BOUNDARY','Consequential actions outside the governed execution boundary remain outside the present claim.'],
  ['DISTRIBUTED REALITY','Partial failure, network delay, stale state, concurrent authority changes, and hostile external services require further examination.'],
  ['CONTINUITY','Revocation propagation, containment, rollback, recovery, and cross-system witness continuity depend on the surrounding environment.'],
];

export default function EliasReferenceAgentShowcase(){
  return <main style={{minHeight:'100vh',padding:'68px 22px 110px',background:'radial-gradient(circle at 82% 3%,rgba(130,92,255,.24),transparent 31%),radial-gradient(circle at 12% 34%,rgba(56,235,196,.12),transparent 30%),linear-gradient(180deg,#030611,#07101b 58%,#03070c)',color:'#f3f6ff',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{maxWidth:1200,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <div><div style={{fontSize:11,letterSpacing:2.2,color:'#9e8cff',fontWeight:950}}>TA-14 GOVERNED SHOWCASE · EXTERNAL ARCHITECTURE</div><div style={{marginTop:7,color:'#72f0c9',fontWeight:900}}>TA-14-AIGR-000041 · REGISTERED SEPTEMBER 16, 2026</div></div>
        <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000041" style={{color:'#edf0ff',textDecoration:'none',border:'1px solid rgba(158,140,255,.35)',padding:'11px 15px',borderRadius:11,background:'rgba(158,140,255,.06)'}}>Open Permanent Registry Record</Link>
      </div>

      <section style={{position:'relative',overflow:'hidden',marginTop:28,padding:'clamp(30px,6vw,64px)',border:'1px solid rgba(158,140,255,.25)',borderRadius:30,background:'linear-gradient(145deg,rgba(18,19,50,.96),rgba(5,14,26,.97))',boxShadow:'0 36px 110px rgba(0,0,0,.42)'}}>
        <div aria-hidden style={{position:'absolute',right:-90,top:-120,width:360,height:360,borderRadius:'50%',border:'1px solid rgba(114,240,201,.17)',boxShadow:'0 0 0 38px rgba(158,140,255,.035),0 0 0 78px rgba(114,240,201,.025)'}} />
        <div style={{position:'relative'}}>
          <div style={{color:'#72f0c9',fontSize:12,fontWeight:950,letterSpacing:'.17em'}}>ELIAS SYSTEMS LTD · GARY WILLIAMS</div>
          <h1 style={{fontSize:'clamp(54px,9vw,108px)',lineHeight:.86,letterSpacing:'-.07em',margin:'20px 0 22px'}}>ELIAS<br/><span style={{color:'#a99aff'}}>REFERENCE AGENT</span></h1>
          <p style={{fontSize:'clamp(23px,3.2vw,38px)',lineHeight:1.16,margin:'0 0 22px',maxWidth:940}}>The consequential question is not <em>can the agent act?</em><br/><strong style={{color:'#72f0c9'}}>It is: does the action have present authority to execute?</strong></p>
          <p style={{color:'#b7c2d8',fontSize:17,lineHeight:1.82,maxWidth:920}}>ERA v1.0 is a bounded execution-governance reference implementation for agentic systems. It separates capability from authority, preserves human standing outside the agent, allows uncertainty to remain unresolved, reassesses changed conditions, and produces evidence around consequential execution decisions. This showroom presents the registered claim surface without converting registration into proof.</p>
          <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:28}}>{['REGISTERED v1.0','FROZEN EVIDENCE OBJECT','PUBLIC EVIDENCE','EXAMINATION READY'].map(x=><b key={x} style={{padding:'9px 12px',borderRadius:999,border:'1px solid rgba(114,240,201,.28)',color:'#72f0c9',fontSize:10,letterSpacing:'.1em'}}>{x}</b>)}</div>
        </div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(205px,1fr))',gap:12,margin:'24px 0'}}>{[['Architecture','Agentic execution governance'],['Version','1.0'],['Claimant','Gary Williams'],['Organization','Elias Systems Ltd'],['Registry','TA-14-AIGR-000041'],['Effective','September 14, 2026']].map(([k,v])=><div key={k} style={{padding:19,border:'1px solid rgba(158,140,255,.15)',borderRadius:15,background:'rgba(9,16,31,.82)'}}><small style={{color:'#7886a4',textTransform:'uppercase',letterSpacing:1.25}}>{k}</small><div style={{marginTop:7,fontWeight:900}}>{v}</div></div>)}</section>

      <ERARecordedExamination />

      <section style={{marginTop:34,padding:'30px clamp(22px,4vw,40px)',border:'1px solid rgba(114,240,201,.22)',borderRadius:22,background:'linear-gradient(135deg,rgba(18,67,58,.23),rgba(8,15,29,.84))'}}>
        <div style={{color:'#72f0c9',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>THE EXECUTION SEAM</div>
        <h2 style={{fontSize:'clamp(30px,4vw,46px)',margin:'12px 0 14px',letterSpacing:'-.035em'}}>Capability → Governance Conditions → Execution</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10,marginTop:22}}>{['CAPABILITY','AUTHORITY + HUMAN STANDING','SCOPE + PRESENT STATE','PERMIT · WITHHOLD · REFUSE · CONTAIN · ESCALATE'].map((x,i)=><div key={x} style={{padding:18,borderRadius:14,border:'1px solid rgba(114,240,201,.15)',background:'rgba(2,10,18,.45)'}}><b style={{color:'#a99aff',fontSize:11}}>0{i+1}</b><div style={{marginTop:8,fontWeight:900,lineHeight:1.35}}>{x}</div></div>)}</div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(330px,1fr))',gap:16,marginTop:34}}>
        <article style={{padding:30,border:'1px solid rgba(158,140,255,.2)',borderRadius:20,background:'rgba(9,16,31,.8)'}}><div style={{color:'#a99aff',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>REGISTERED CLAIM SURFACE</div><div style={{marginTop:18,display:'grid',gap:12}}>{claims.map((x,i)=><div key={x} style={{display:'grid',gridTemplateColumns:'30px 1fr',gap:11,color:'#bac4d8',lineHeight:1.62}}><b style={{color:'#72f0c9'}}>{String(i+1).padStart(2,'0')}</b><span>{x}</span></div>)}</div></article>
        <article style={{padding:30,border:'1px solid rgba(245,200,105,.19)',borderRadius:20,background:'linear-gradient(145deg,rgba(63,45,13,.11),rgba(9,16,31,.82))'}}><div style={{color:'#f5c869',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>BOUNDARIES · WHAT REGISTRATION DOES NOT ESTABLISH</div><div style={{marginTop:18,display:'grid',gap:12}}>{boundaries.map(x=><div key={x} style={{padding:'12px 14px',borderLeft:'3px solid #f5c869',background:'rgba(245,200,105,.035)',color:'#b9c1cf',lineHeight:1.58}}>{x}</div>)}</div></article>
      </section>

      <section style={{marginTop:34}}><div style={{color:'#72f0c9',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>WHERE THE HARD EXAMINATION LIVES</div><h2 style={{fontSize:34,margin:'11px 0 18px'}}>ERA declares its own pressure points.</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12}}>{limits.map(([k,v])=><div key={k} style={{padding:22,border:'1px solid rgba(114,240,201,.14)',borderRadius:16,background:'rgba(7,17,27,.76)'}}><b style={{fontSize:11,color:'#a99aff',letterSpacing:'.11em'}}>{k}</b><p style={{margin:'10px 0 0',color:'#aeb9cb',lineHeight:1.68}}>{v}</p></div>)}</div></section>

      <section style={{marginTop:34,padding:32,border:'1px solid rgba(158,140,255,.25)',borderRadius:22,background:'linear-gradient(135deg,rgba(54,39,108,.23),rgba(7,15,28,.88))'}}>
        <div style={{color:'#a99aff',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>PRESERVED EVIDENCE OBJECT</div>
        <h2 style={{fontSize:33,margin:'11px 0 12px'}}>The architecture presented for examination has an identity.</h2>
        <p style={{color:'#b7c1d3',lineHeight:1.82,margin:0}}>The Registry preserves <strong>TA14-ERA-v1.0-CANONICAL-EVIDENCE.zip</strong> as the submitted technical architecture evidence package, with a declared canonical source commit, release digest, manifested files, and a Registry-preserved SHA-256. That identifies the object being presented for examination; it does not establish a TA-14 PASS, certification, or independent adjudication.</p>
      </section>

      <section style={{marginTop:34,padding:32,border:'1px solid rgba(114,240,201,.22)',borderRadius:22,background:'linear-gradient(135deg,rgba(22,75,62,.22),rgba(7,15,28,.88))'}}>
        <div style={{color:'#72f0c9',fontWeight:950,fontSize:11,letterSpacing:'.15em'}}>NEXT GOVERNED GATE · NOT YET A FINDING</div>
        <h2 style={{fontSize:34,margin:'11px 0 12px'}}>Make the claims executable.</h2>
        <p style={{color:'#b8c8c3',lineHeight:1.82,margin:0}}>ERA is now a registered, attributable object with explicit claims, non-claims, limitations, and frozen evidence. The next TA-14 step is prospective examination: freeze a proposition, define the relevant state and authority conditions, define falsifiers and stop rules, challenge changed conditions and bypass paths, preserve the return, and issue only the finding the evidence earns.</p>
      </section>

      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:34}}><Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000041" style={{padding:'14px 18px',borderRadius:11,textDecoration:'none',fontWeight:900,background:'linear-gradient(135deg,#a99aff,#72f0c9)',color:'#07101a'}}>Permanent Registry Record →</Link><Link href="/workspace/ai-governance/adversarial-examination" style={{padding:'14px 18px',borderRadius:11,textDecoration:'none',fontWeight:900,border:'1px solid rgba(158,140,255,.28)',color:'#ddd8ff'}}>Adversarial Examination</Link><Link href="/workspace/ai-governance/examination-engine" style={{padding:'14px 18px',borderRadius:11,textDecoration:'none',fontWeight:900,border:'1px solid rgba(114,240,201,.24)',color:'#c9f8e8'}}>Consequence Examination</Link><Link href="/artifacts" style={{padding:'14px 18px',borderRadius:11,textDecoration:'none',fontWeight:900,border:'1px solid rgba(255,255,255,.13)',color:'#e5eaf3'}}>Artifact Registry</Link></div>
    </div>
  </main>;
}
