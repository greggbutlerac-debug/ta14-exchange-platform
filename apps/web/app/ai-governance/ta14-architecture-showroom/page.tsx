import Link from 'next/link';

const architectures = [
  {
    mark:'HPS',
    title:'Human Performance Stack',
    question:'Can this human perform under the present conditions?',
    role:'Human-performance jurisdiction. HPS addresses readiness, capability, condition, guidance and performance context. Passing HPS does not itself create intervention authority.',
    accent:'#c98cff',
    actions:[
      ['OPEN HPS PUBLIC SITE','https://sites.google.com/view/humanperformancestackhps/home'],
      ['OPEN HPS BOOK','https://www.amazon.com/dp/B0H753DRJS'],
      ['READ HPS PUBLICATION','https://medium.com/@greggbutlerac/from-guidance-to-execution-defining-the-human-performance-stack-hps-hpgs-neurosync-hpw-cd4a46cc986b'],
    ]
  },
  {
    mark:'AHIA',
    title:'Admissible Human Intervention Architecture',
    question:'May this human legitimately intervene in this consequential route?',
    role:'Human-intervention jurisdiction. AHIA governs when human intervention may enter, alter, continue, override or terminate a consequence-bearing execution route. Human presence never substitutes for current authority.',
    accent:'#70efc1',
    actions:[
      ['OPEN AHIA PUBLIC SITE','https://sites.google.com/view/ta-14-admissible-human-interve/home'],
      ['READ HUMAN-IN-THE-LOOP RECORD','https://medium.com/@greggbutlerac/human-in-the-loop-is-not-governance-1b51c8baa965'],
      ['OPEN HUMAN OVERSIGHT LAB','/workspace/ai-governance/playground/specialized/human-oversight'],
    ]
  },
  {
    mark:'ACA',
    title:'Admissible Computation Architecture',
    question:'May this computation occur under the present conditions?',
    role:'Computation jurisdiction. ACA evaluates whether a bounded computational proposal has standing before computational resources, retrieval, model work or downstream action are committed.',
    accent:'#65dfff',
    actions:[
      ['OPEN ACA SHOWCASE','/ai-governance/admissible-computation'],
      ['RUN ADMISSIBLE SEARCH','/ai-governance/admissible-computation/search'],
      ['OPEN PUBLIC PROOF','/ai-governance/admissible-computation/showcase/admissible-search-proof'],
      ['OPEN PILOT LAB','/ai-governance/admissible-computation/pilot-lab'],
      ['OPEN PILOT KIT','/ai-governance/admissible-computation/pilot-kit'],
    ]
  },
  {
    mark:'AEA',
    title:'Admissible Execution Architecture',
    question:'May this consequence-bearing execution proceed now?',
    role:'Parent consequence/execution architecture. AEA governs the route from admissible reality and evidence through authority, binding, commit, execution, outcome, memory and future-chain inheritance.',
    accent:'#f0c66f',
    actions:[
      ['OPEN AEA REGISTRY','/registry/ta-14-admissible-execution-architecture'],
      ['OPEN AEA PUBLIC SITE','https://sites.google.com/view/admissibleexecutionarchitectur/home'],
      ['EXPLORE 24-LINK ARCHITECTURE','/academy/24-link-architecture'],
      ['OPEN CLAIMS & BOUNDARIES','/registry/ta-14-admissible-execution-architecture/claims-and-boundaries'],
      ['OPEN PUBLICATIONS','/registry/ta-14-admissible-execution-architecture/publications'],
      ['OPEN PATENTS','/registry/ta-14-admissible-execution-architecture/patents'],
    ]
  },
];

const principles = [
  ['NO BORROWED AUTHORITY','No component may borrow authority from another component’s admissibility.'],
  ['NO HUMAN EXCEPTION','Capability, seniority, expertise or physical presence do not themselves confer intervention authority.'],
  ['NO COMPUTE-TO-EXECUTE LEAP','An admissible computation may still terminate in HOLD, DENY or ESCALATE at the execution boundary.'],
  ['NO INHERITED PERMISSION','Changed reality requires revalidation. Prior permission does not silently survive materially changed conditions.'],
  ['NON-OCCURRENCE HAS STANDING','A justified refusal or non-execution can be a correct governed outcome rather than a system failure.'],
  ['INTEROPERABILITY ≠ INHERITANCE','Architectures may interoperate. Authority does not automatically transfer between them.'],
];

function Action({href,label}:{href:string;label:string}){
  const external = href.startsWith('http');
  const style={display:'inline-flex',alignItems:'center',justifyContent:'center',minHeight:42,padding:'0 13px',border:'1px solid rgba(124,225,255,.3)',borderRadius:9,background:'rgba(5,18,28,.82)',color:'#ddf8ff',textDecoration:'none',fontSize:10,fontWeight:900,letterSpacing:'.07em'} as const;
  return external ? <a href={href} target="_blank" rel="noreferrer" style={style}>{label} ↗</a> : <Link href={href} style={style}>{label} →</Link>;
}

export const metadata={title:'TA-14 Canonical Architecture Showroom',description:'A public explanation of TA-14 Authority, AEA, HPS, AHIA and ACA and the boundaries between performance, intervention, computation and execution.'};

export default function Page(){return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 20% 0%,rgba(0,207,255,.16),transparent 28%),radial-gradient(circle at 85% 15%,rgba(57,255,136,.10),transparent 25%),linear-gradient(180deg,#02070c,#06131c 52%,#02070b)',color:'#f4f8fb',fontFamily:'Inter,ui-sans-serif,system-ui,sans-serif'}}>
  <div style={{width:'min(1180px,calc(100% - 34px))',margin:'0 auto',padding:'30px 0 100px'}}>
    <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,padding:'10px 0 28px',borderBottom:'1px solid rgba(255,255,255,.08)'}}><Link href="/" style={{color:'#85ebff',textDecoration:'none',fontWeight:900,letterSpacing:'.08em'}}>← TA-14 EXCHANGE</Link><Link href="/workspace/ai-governance/registry" style={{color:'#b7c8d1',textDecoration:'none',fontSize:11}}>GOVERNANCE REGISTRY</Link></nav>

    <header style={{padding:'76px 0 44px',maxWidth:1020}}>
      <p style={{color:'#67ffb2',fontSize:10,fontWeight:950,letterSpacing:'.18em'}}>TA-14 AUTHORITY · CANONICAL ARCHITECTURE SHOWROOM</p>
      <h1 style={{fontSize:'clamp(50px,8vw,92px)',lineHeight:.92,letterSpacing:'-.055em',margin:'16px 0 22px'}}>HOW TA-14 <span style={{color:'#77eaff'}}>GOVERNS CONSEQUENCE.</span></h1>
      <p style={{fontSize:20,lineHeight:1.65,color:'#b4c5cf',maxWidth:900}}>TA-14 is the institutional authority umbrella. AEA governs the consequence-bearing execution route. HPS, AHIA and ACA are distinct governance jurisdictions that may intersect that route without inheriting authority from one another.</p>
      <div style={{marginTop:28,padding:'22px 24px',border:'1px solid rgba(119,234,255,.34)',borderRadius:16,background:'rgba(2,15,23,.86)',boxShadow:'0 0 35px rgba(0,218,255,.08)'}}><strong style={{display:'block',fontSize:'clamp(22px,4vw,36px)',lineHeight:1.15}}>NO COMPONENT MAY BORROW AUTHORITY FROM ANOTHER COMPONENT’S ADMISSIBILITY.</strong><p style={{margin:'10px 0 0',color:'#78f6bb'}}>Architectures may interoperate. Authority does not automatically transfer between them.</p></div>
    </header>

    <section style={{padding:'24px 0 60px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:16}}>{architectures.map(a=><article key={a.mark} style={{padding:24,border:`1px solid ${a.accent}55`,borderRadius:18,background:'linear-gradient(160deg,rgba(7,22,32,.95),rgba(2,9,14,.97))',boxShadow:`inset 0 0 40px ${a.accent}0d`}}>
        <span style={{display:'grid',placeItems:'center',width:66,height:66,borderRadius:18,border:`1px solid ${a.accent}88`,color:a.accent,fontSize:17,fontWeight:950,boxShadow:`0 0 24px ${a.accent}28`}}>{a.mark}</span>
        <h2 style={{fontSize:26,lineHeight:1.08,margin:'20px 0 10px'}}>{a.title}</h2>
        <p style={{color:a.accent,fontWeight:850,lineHeight:1.5,minHeight:54}}>{a.question}</p>
        <p style={{color:'#9fb1bc',lineHeight:1.65,fontSize:13,minHeight:132}}>{a.role}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:18}}>{a.actions.map(([label,href])=><Action key={label} href={href} label={label}/>)}</div>
      </article>)}</div>
    </section>

    <section style={{padding:'56px 0',borderTop:'1px solid rgba(255,255,255,.08)'}}>
      <p style={{color:'#72e6ff',fontSize:10,fontWeight:900,letterSpacing:'.16em'}}>THE RELATIONSHIP</p><h2 style={{fontSize:'clamp(34px,5vw,58px)',margin:'10px 0 22px'}}>SEPARATE JURISDICTIONS. ONE CONSEQUENCE BOUNDARY.</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>{principles.map(([title,copy])=><div key={title} style={{padding:20,border:'1px solid rgba(120,192,222,.18)',borderRadius:14,background:'rgba(3,14,22,.75)'}}><b style={{display:'block',color:'#76e9ff',fontSize:11,letterSpacing:'.08em'}}>{title}</b><p style={{margin:'9px 0 0',color:'#a5b6c0',fontSize:13,lineHeight:1.6}}>{copy}</p></div>)}</div>
    </section>

    <section style={{padding:'56px 0',borderTop:'1px solid rgba(255,255,255,.08)'}}>
      <p style={{color:'#68ffb0',fontSize:10,fontWeight:900,letterSpacing:'.16em'}}>WHAT THIS MEANS IN PRACTICE</p><h2 style={{fontSize:'clamp(34px,5vw,58px)',margin:'10px 0 24px'}}>PASSING ONE BOUNDARY DOES NOT PASS THE NEXT.</h2>
      <div style={{display:'grid',gap:12}}>{[
        ['HPS PASS · AHIA HOLD','The human may be capable of performing the task while lacking present authority to intervene.'],
        ['ACA ALLOW · AEA HOLD','The computation may be admissible while the resulting consequence is not presently admissible to execute.'],
        ['AHIA ALLOW · AEA HOLD','A human may legitimately intervene in the governance route without being authorized to perform the underlying physical or consequential action.'],
        ['AEA HOLD · GOVERNANCE SUCCESS','Stopping execution when evidence, authority or current reality is insufficient is an affirmative governed outcome—not a defect.'],
      ].map(([title,copy])=><div key={title} style={{display:'grid',gridTemplateColumns:'minmax(180px,280px) 1fr',gap:20,padding:20,border:'1px solid rgba(255,255,255,.08)',borderRadius:12,background:'rgba(0,0,0,.18)'}}><b style={{color:'#f0d188'}}>{title}</b><span style={{color:'#a9bbc5',lineHeight:1.55}}>{copy}</span></div>)}</div>
    </section>

    <section style={{padding:'56px 0',borderTop:'1px solid rgba(255,255,255,.08)'}}>
      <p style={{color:'#72e6ff',fontSize:10,fontWeight:900,letterSpacing:'.16em'}}>FOLLOW THE EVIDENCE</p><h2 style={{fontSize:'clamp(34px,5vw,58px)',margin:'10px 0 22px'}}>ENTER THE INSTITUTION.</h2>
      <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
        <Action href="/workspace/ai-governance/registry" label="OPEN GOVERNANCE REGISTRY"/>
        <Action href="/governance-showcase" label="OPEN GOVERNANCE SHOWCASE"/>
        <Action href="/artifacts" label="OPEN ARTIFACTS"/>
        <Action href="/academy" label="ENTER TA-14 ACADEMY"/>
        <Action href="/academy/24-link-architecture" label="EXPLORE 24-LINK ARCHITECTURE"/>
        <Action href="/ai-governance/admissible-architecture" label="OPEN ADMISSIBLE ARCHITECTURE MAP"/>
      </div>
    </section>

    <footer style={{marginTop:30,paddingTop:26,borderTop:'1px solid rgba(255,255,255,.08)',color:'#6f8796',fontSize:11}}>TA-14 Authority · Evidence before consequence · No admissible evidence. No admissible execution.</footer>
  </div>
</main>}
