import Link from 'next/link';

export const metadata = {
  title: 'TA-14 × Eight24 | HVACD/R Founding Partnership',
  description: 'Private working overview of the TA-14 × Eight24 HVACD/R technician-readiness program.'
};

const phases = [
  ['01','UNDERSTAND THE SYSTEM','28h','Modules 1–4','HVACD/R foundations, electrical, airflow, heat, moisture, refrigeration, Dehumidification and EPA 608.'],
  ['02','ESTABLISH THE RECORD','20h','Modules 5–7','HPR, Seven In and Seven Out turn measurements into attributable field evidence.'],
  ['03','DETERMINE','18h','Modules 8–10','NIRET, refrigerant diagnostics and DDD establish what the evidence actually supports.'],
  ['04','EXECUTE + VERIFY','13h','Modules 11–12','Define the proposed consequence, govern the execution boundary, intervene and verify through PI-HPR.'],
  ['05','PRESERVE PERFORMANCE','13h','Modules 13–14','Maintenance, commissioning, continuous revalidation, heating systems and heat pumps.'],
  ['06','PROFESSIONAL JUDGMENT','14h','Modules 15–17','Conflicting evidence, communication, authority, pressure and adversarial field conditions.'],
  ['07','PROVE IT','14h','Module 18','Integrated HVACD/R field capstone with progressively independent performance.']
];

const modules = [
  ['01','HVACD/R Field Foundations','5h'],['02','Electrical Foundations & Field Measurement','7h'],
  ['03','Airflow, Heat & Moisture Fundamentals','7h'],['04','Refrigeration, Dehumidification & EPA 608 Foundations','9h'],
  ['05','HVACD/R Performance Record (HPR)','6h'],['06','Seven In — Pre-Entry Examination','7h'],
  ['07','Seven Out — Post-Entry Examination','7h'],['08','NIRET — Refrigerant-System Entry Determination','5h'],
  ['09','Refrigerant-System Diagnostics','8h'],['10','DDD — Diagnostic Determination Discipline','5h'],
  ['11','Evidence-Based Intervention & Repair','8h'],['12','Post-Intervention HVACD/R Performance Record (PI-HPR)','5h'],
  ['13','Maintenance, Commissioning & Continuous Revalidation','5h'],['14','Heating Systems & Heat Pumps','8h'],
  ['15','Advanced Diagnostic Reasoning','6h'],['16','Customer Communication, Documentation & Authority','4h'],
  ['17','Pressure, Adversarial Conditions & Professional Judgment','4h'],['18','Integrated HVACD/R Field Capstone','14h']
];

const ta14 = ['120-hour HVACD/R curriculum architecture','Field reasoning and evidence architecture','Seven In / Seven Out','HPR / PI-HPR','NIRET','DDD','Execution-boundary logic','TA-14 Academy + designated arcades','Technical review, validation and continuing curriculum development'];
const eight24 = ['VR platform and software implementation','Immersive interaction systems','3D production and independently created assets','LMS and deployment infrastructure','AI implementation','Institutional and workforce relationships','Program delivery and commercialization','Customer and cohort operations'];

export default function Page(){
  return <main style={{minHeight:'100vh',background:'#02070c',color:'#edf5f8',fontFamily:'Arial,sans-serif'}}>
    <div style={{maxWidth:1180,margin:'auto',padding:'0 22px'}}>
      <nav style={{padding:'26px 0',display:'flex',justifyContent:'space-between',gap:16,borderBottom:'1px solid #18303b',fontSize:11,fontWeight:900,letterSpacing:1.3}}>
        <Link href="/" style={{color:'#70dcff',textDecoration:'none'}}>TA-14 EXCHANGE</Link>
        <span style={{color:'#efc86c'}}>PRIVATE WORKING ROOM · FOUNDING PARTNERSHIP</span>
      </nav>

      <header style={{padding:'92px 0 64px'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>TA-14 × EIGHT24 SOLUTIONS · HVACD/R TECHNICIAN READINESS PROGRAM</p>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(48px,8vw,96px)',lineHeight:.92,margin:'18px 0 28px'}}>THE WHOLE<br/><i>PARTNERSHIP.</i></h1>
        <p style={{maxWidth:860,color:'#a9bdc6',fontSize:20,lineHeight:1.7}}>One working room for the program, the curriculum, the immersive build, the ownership boundary, the economics and the path from what already exists to commercial deployment.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:34}}>
          {['120 HOURS','18 MODULES','7 PHASES','HVACD/R','14-HOUR CAPSTONE','WALKTHROUGH → GUIDED → PERFORM'].map(x=><span key={x} style={{border:'1px solid #214352',borderRadius:999,padding:'10px 14px',fontSize:10,fontWeight:900,color:'#d6e7ed'}}>{x}</span>)}
        </div>
      </header>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>01 · THE PROPOSITION</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(34px,5vw,62px)',margin:'12px 0'}}>Not a collection of VR exercises.<br/><i>A technician-readiness system.</i></h2>
        <p style={{maxWidth:900,color:'#9fb4be',lineHeight:1.8,fontSize:17}}>The learner progresses from knowledge to observation, evidence, diagnosis, professional judgment, bounded execution and verified outcome. The objective is not merely to make equipment run. It is to establish why an action should occur, execute it within the applicable boundary and preserve what became true afterward.</p>
        <div style={{marginTop:30,padding:26,border:'1px solid #1d4658',borderRadius:18,background:'#06131b',fontFamily:'Georgia,serif',fontSize:'clamp(18px,3vw,29px)',lineHeight:1.5}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</div>
        <div style={{marginTop:16,padding:22,borderLeft:'4px solid #efc86c',background:'#0a1115'}}>
          <b>THE GOVERNING QUESTION</b>
          <p style={{fontFamily:'Georgia,serif',fontSize:22,lineHeight:1.5,marginBottom:0}}>Does this proposed consequence have sufficient <b>Admissible Evidence</b>, <b>Applicable Authority</b>, and <b>Established Standing</b> to become reality NOW?</p>
        </div>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>02 · WHAT EACH SIDE BRINGS</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,marginTop:24}}>
          {[['TA-14',ta14,'#70dcff'],['EIGHT24 SOLUTIONS',eight24,'#efc86c']].map(([name,items,color]:any)=><div key={name} style={{padding:28,border:'1px solid #173746',borderRadius:20,background:'#06121a'}}>
            <h3 style={{fontFamily:'Georgia,serif',fontSize:31,color}}>{name}</h3>
            {(items as string[]).map(x=><p key={x} style={{borderTop:'1px solid #17303a',paddingTop:12,color:'#a9bdc6',fontSize:14}}>✓ {x}</p>)}
          </div>)}
        </div>
        <p style={{marginTop:24,color:'#dbe9ee',fontSize:17}}><b>Boundary:</b> TA-14 supplies the curriculum, field reasoning and execution architecture. Eight24 supplies the immersive implementation, deployment and commercialization engine. The agreement governs the licensed crossing between them.</p>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>03 · THE 120-HOUR JOURNEY</p>
        <div style={{display:'grid',gap:12,marginTop:24}}>
          {phases.map(p=><div key={p[0]} style={{display:'grid',gridTemplateColumns:'70px minmax(180px,1fr) 80px minmax(220px,2fr)',gap:18,alignItems:'center',padding:22,border:'1px solid #173746',borderRadius:16,background:'#06121a'}}>
            <b style={{fontFamily:'Georgia,serif',fontSize:30,color:'#70dcff'}}>{p[0]}</b><div><b>{p[1]}</b><small style={{display:'block',color:'#6f8994',marginTop:5}}>{p[3]}</small></div><b style={{color:'#efc86c'}}>{p[2]}</b><span style={{color:'#9fb4be',fontSize:13,lineHeight:1.55}}>{p[4]}</span>
          </div>)}
        </div>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>04 · CURRICULUM SHOWROOMS</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:44,margin:'12px 0'}}>Every module becomes a room.</h2>
        <p style={{maxWidth:820,color:'#9fb4be',lineHeight:1.7}}>Instead of hiding the curriculum in a static PDF, each module gets an inspectable interactive showroom: purpose, competencies, lesson inventory, delivery mode, evidence objects, VR behavior, assessment, dependencies and completion criteria.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:26}}>
          {modules.map(m=><Link key={m[0]} href={'/eight24-hvacdr/curriculum/module-'+m[0]} style={{padding:20,border:'1px solid #173746',borderRadius:16,background:'#06121a',textDecoration:'none',color:'#edf5f8'}}>
            <div style={{display:'flex',justifyContent:'space-between',color:'#70dcff',fontWeight:900,fontSize:11}}><span>MODULE {m[0]}</span><span>{m[2]}</span></div>
            <h3 style={{fontFamily:'Georgia,serif',fontSize:21,lineHeight:1.25}}>{m[1]}</h3>
            <b style={{color:'#efc86c',fontSize:10}}>OPEN CURRICULUM ROOM →</b>
          </Link>)}
        </div>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>05 · DEHUMIDIFICATION IS NOT A FOOTNOTE</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:42}}>HVAC<b style={{color:'#70dcff'}}>D</b>/R</h2>
        <p style={{maxWidth:880,color:'#9fb4be',lineHeight:1.8,fontSize:17}}>D = Dehumidification. Moisture control is treated as a first-class technical discipline with its own evidence, measurements, operating conditions, diagnostic reasoning, interventions and outcome verification. Acceptable temperature does not automatically establish acceptable moisture performance.</p>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>06 · OWNERSHIP BOUNDARY</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16,marginTop:22}}>
          <div style={{padding:28,border:'1px solid #1b4353',borderRadius:20}}><h3 style={{fontFamily:'Georgia,serif',fontSize:30}}>TA-14 owns TA-14.</h3><p style={{color:'#9fb4be',lineHeight:1.7}}>Underlying curriculum architecture, TA-14 methods, Academy, HPR / PI-HPR, NIRET, DDD, Seven In / Seven Out, execution architecture, independent publishing and TA-14 improvements remain TA-14.</p></div>
          <div style={{padding:28,border:'1px solid #514426',borderRadius:20}}><h3 style={{fontFamily:'Georgia,serif',fontSize:30}}>Eight24 owns Eight24.</h3><p style={{color:'#9fb4be',lineHeight:1.7}}>Platform, source code, VR implementation, independently developed 3D and interaction assets, LMS, deployment infrastructure, customer relationships and pre-existing Eight24 IP remain Eight24.</p></div>
        </div>
        <div style={{textAlign:'center',padding:28,marginTop:16,background:'#06121a',borderRadius:18,border:'1px solid #173746',fontFamily:'Georgia,serif',fontSize:24}}>The partnership agreement governs the <i>licensed crossing.</i></div>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>07 · PROPOSED FOUNDING ECONOMICS · PRIVATE</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:42}}>Fund the continuation. Preserve the upside.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:14,marginTop:24}}>
          {[['$10,000','FOUNDING DEVELOPMENT + INTEGRATION','Due at agreement; recognizes work already underway and establishes funded continuation.'],['MILESTONES','FUTURE DEVELOPMENT','Curriculum and implementation work defined and funded as production proceeds.'],['7.5%','OPENING COMMERCIAL LICENSE','Proposed share of attributable gross commercial revenue from licensed TA-14 HVACD/R products.'],['SEPARATE','VR EXCLUSIVITY','Not included by default. Any exclusivity requires separate economics and meaningful minimum guarantees.']].map(x=><div key={x[1]} style={{padding:24,border:'1px solid #173746',borderRadius:18,background:'#06121a'}}><b style={{fontFamily:'Georgia,serif',fontSize:30,color:'#70dcff'}}>{x[0]}</b><h3 style={{fontSize:12,letterSpacing:1.2,color:'#efc86c'}}>{x[1]}</h3><p style={{color:'#8fa6b0',fontSize:13,lineHeight:1.6}}>{x[2]}</p></div>)}
        </div>
        <p style={{color:'#8098a2',fontSize:12,marginTop:18}}>Working proposal for discussion. This room is not a signed agreement and does not transfer ownership, grant exclusivity or activate a commercial license.</p>
      </section>

      <section style={{padding:'54px 0',borderTop:'1px solid #18303b'}}>
        <p style={{color:'#efc86c',fontWeight:900,fontSize:11,letterSpacing:2}}>08 · WHAT HAPPENS NEXT</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14,marginTop:22}}>
          {[['NOW','Align on commercial framework, founding payment, ownership/license boundary and master curriculum.'],['NEXT','Build the first reusable VR/state/evidence architecture and integrated service-call prototype.'],['THEN','Scale the simulation catalog, deploy cohorts, measure readiness and expand institutional delivery.']].map(x=><div key={x[0]} style={{padding:26,borderTop:'3px solid #70dcff',background:'#06121a'}}><b style={{color:'#efc86c'}}>{x[0]}</b><p style={{color:'#a9bdc6',lineHeight:1.7}}>{x[1]}</p></div>)}
        </div>
      </section>

      <footer style={{padding:'44px 0 70px',borderTop:'1px solid #18303b',color:'#667f89',fontSize:10,display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
        <span>TA-14 × EIGHT24 SOLUTIONS · FOUNDING PARTNERSHIP WORKING ROOM</span><span>HVACD/R · D = DEHUMIDIFICATION</span>
      </footer>
    </div>
  </main>
}