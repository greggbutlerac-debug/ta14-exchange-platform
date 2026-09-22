'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const networkNodes=[
 {name:'NORTH AMERICA',x:22,y:32},{name:'SOUTH AMERICA',x:32,y:70},{name:'EUROPE',x:49,y:27},{name:'AFRICA',x:51,y:55},{name:'MIDDLE EAST',x:59,y:43},{name:'SOUTH ASIA',x:68,y:50},{name:'EAST ASIA',x:78,y:34},{name:'OCEANIA',x:84,y:72}
];

type PlaceKey='home'|'school'|'bus'|'clinic';
type State='normal'|'event';

const places={
 home:{label:'HOME',air:'AIR-HOME-014',condition:'PM2.5 8 · CO₂ 640',event:'Indoor record preserved · no material event'},
 school:{label:'SCHOOL',air:'AIR-SCHOOL-214',condition:'CO₂ 1,180 · PM2.5 11',event:'Occupancy rises · ventilation demand changes'},
 bus:{label:'TRANSIT',air:'AIR-BUS-72',condition:'PM2.5 19 · CO₂ 1,460',event:'Traffic plume encountered during transit'},
 clinic:{label:'CLINIC',air:'AIR-CLINIC-03',condition:'PM2.5 7 · CO₂ 720',event:'PAIR chronology arrives with bounded provenance'}
} as const;

const order:PlaceKey[]=['home','school','bus','clinic'];

export default function FAINShowroom(){
 const [place,setPlace]=useState<PlaceKey>('home');
 const [state,setState]=useState<State>('normal');
 const [continuity,setContinuity]=useState(true);
 const [federation,setFederation]=useState(true);
 const [authority,setAuthority]=useState(true);
 const [region,setRegion]=useState('NORTH AMERICA');
 const [federatedRegion,setFederatedRegion]=useState<string|null>(null);
 const [signalClass,setSignalClass]=useState<'ambient'|'exposure'|'event'|'advisory'>('ambient');
 const [jurisdiction,setJurisdiction]=useState(true);
 const [provenance,setProvenance]=useState(true);
 const [clock,setClock]=useState(true);
 const [eventStep,setEventStep]=useState(0);
 const [eventProvenance,setEventProvenance]=useState(true);
 const [eventPair,setEventPair]=useState(true);
 const [eventReliance,setEventReliance]=useState(true);
 const [eventAuthority,setEventAuthority]=useState(true);
 const eventOutcome=!eventProvenance?'HOLD':!eventPair?'HOLD':!eventReliance?'ESCALATE':!eventAuthority?'DENY':'ALLOW';
 const p=places[place];
 const determination=useMemo(()=>{
   if(!continuity) return 'HOLD';
   if(!federation) return 'ESCALATE';
   if(!authority) return 'HOLD';
   return 'ALLOW';
 },[continuity,federation,authority]);
 const color={ALLOW:'#63f0b4',HOLD:'#ffd166',ESCALATE:'#b9a7ff'}[determination];
 const next=()=>setPlace(order[(order.indexOf(place)+1)%order.length]);
 return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 16% 5%,rgba(52,232,191,.17),transparent 27%),radial-gradient(circle at 88% 12%,rgba(88,160,255,.16),transparent 26%),linear-gradient(180deg,#010807,#041713 52%,#010706)',color:'#eefcf8',fontFamily:'Inter,system-ui,sans-serif',padding:'34px 20px 100px'}}>
  <div style={{maxWidth:1240,margin:'auto'}}>
   <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:18,borderBottom:'1px solid rgba(111,232,255,.16)'}}><Link href="/environmental-integrity-governance" style={{color:'#8cebd7',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link><span style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#789f98'}}>PUBLIC TECHNICAL SHOWROOM · INTERACTIVE</span></nav>
   <header style={{padding:'clamp(42px,7vw,84px) 0 48px'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#62f0c4'}}>TA-14 · ATMOSPHERIC INTEGRITY · FEDERATED CONTINUITY</p>
    <h1 style={{fontSize:'clamp(52px,9vw,108px)',lineHeight:.86,letterSpacing:'-.065em',margin:'20px 0'}}>FROM ONE BREATH<br/><span style={{color:'#6fe8ff'}}>TO A FEDERATED RECORD.</span></h1>
    <p style={{maxWidth:980,fontSize:'clamp(18px,2.2vw,27px)',lineHeight:1.55,color:'#b5cbc5'}}>AIR preserves atmospheric reality by place. PAIR preserves person-centered exposure chronology across places. The Federated Atmospheric Integrity Network connects bounded environmental evidence across independently governed nodes without turning federation into ownership, diagnosis, or automatic authority to act.</p>
   </header>


   <section style={{position:'relative',overflow:'hidden',margin:'0 0 26px',padding:'clamp(28px,5vw,52px)',minHeight:500,border:'1px solid rgba(111,232,255,.28)',borderRadius:24,background:'radial-gradient(circle at 50% 48%,rgba(25,225,190,.12),transparent 31%),linear-gradient(180deg,rgba(3,18,25,.96),rgba(1,10,13,.98))',boxShadow:'0 24px 80px rgba(0,0,0,.35)'}}>
    <div style={{position:'relative',zIndex:3,maxWidth:760}}><small style={{fontWeight:950,letterSpacing:'.18em',color:'#6fe8ff'}}>FEDERATED ATMOSPHERIC INTEGRITY NETWORK</small><h2 style={{fontSize:'clamp(34px,5vw,64px)',lineHeight:.98,letterSpacing:'-.05em',margin:'12px 0'}}>LOCAL RECORDS.<br/><span style={{color:'#62f0c4'}}>PLANETARY CONTINUITY.</span></h2><p style={{color:'#a9c5be',lineHeight:1.7}}>A federation does not erase where evidence came from. Each node remains attributable. Bounded signals can connect across cities, institutions, regions and jurisdictions while provenance and governance remain visible.</p></div>
    <div aria-label="Conceptual global federation map" style={{position:'relative',height:300,marginTop:22,borderRadius:'50%',border:'1px solid rgba(111,232,255,.18)',background:'radial-gradient(ellipse at center,rgba(16,72,75,.38),rgba(2,16,23,.78) 62%,rgba(0,5,8,.96))',boxShadow:'inset 0 0 60px rgba(77,230,255,.08)'}}>
     <div style={{position:'absolute',inset:'14% 8%',border:'1px solid rgba(98,240,196,.12)',borderRadius:'50%'}}/><div style={{position:'absolute',inset:'28% 3%',borderTop:'1px solid rgba(111,232,255,.1)',borderBottom:'1px solid rgba(111,232,255,.1)',borderRadius:'50%'}}/>
     <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.62}}>{networkNodes.slice(1).map((n,i)=><line key={n.name} x1={networkNodes[i].x} y1={networkNodes[i].y} x2={n.x} y2={n.y} stroke="#6fe8ff" strokeWidth=".22" strokeDasharray="1.2 1.5"/>)}{networkNodes.slice(2).map((n,i)=><line key={'x'+n.name} x1={networkNodes[i].x} y1={networkNodes[i].y} x2={n.x} y2={n.y} stroke="#62f0c4" strokeWidth=".15" opacity=".7"/>)}</svg>
     {networkNodes.map(n=>{const active=region===n.name||federatedRegion===n.name;return <button key={n.name} onClick={()=>setRegion(n.name)} aria-label={'Select '+n.name} style={{position:'absolute',left:n.x+'%',top:n.y+'%',transform:'translate(-50%,-50%)',textAlign:'center',border:0,background:'transparent',cursor:'pointer',padding:6,color:'inherit'}}><span style={{display:'block',width:active?16:12,height:active?16:12,margin:'auto',borderRadius:'50%',background:active?'#62f0c4':'#6fe8ff',boxShadow:active?'0 0 0 7px rgba(98,240,196,.14),0 0 32px #62f0c4':'0 0 0 5px rgba(111,232,255,.1),0 0 22px #6fe8ff',transition:'all .2s'}}/><b style={{display:'block',marginTop:8,fontSize:9,letterSpacing:'.08em',color:active?'#62f0c4':'#d8fbf5',whiteSpace:'nowrap'}}>{n.name}</b></button>})}
     <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',padding:'12px 15px',borderRadius:999,border:'1px solid rgba(98,240,196,.45)',background:'rgba(1,15,17,.9)',boxShadow:'0 0 40px rgba(98,240,196,.18)',fontWeight:950,color:'#62f0c4',letterSpacing:'.12em',fontSize:10}}>FAIN · BOUNDED SIGNALS</div>
    </div>
    <div style={{marginTop:20,padding:20,border:'1px solid rgba(98,240,196,.22)',borderRadius:16,background:'rgba(2,15,16,.82)'}}><small style={{color:'#789f98',fontWeight:900,letterSpacing:'.14em'}}>SELECTED FEDERATION PATH</small><h3 style={{margin:'8px 0',fontSize:26,color:'#62f0c4'}}>{region} → CITY → BUILDING → AIR → PAIR</h3><p style={{color:'#9db7b0',lineHeight:1.65,margin:'8px 0 14px'}}>Inspect the local record first. Then federate only a bounded signal outward. Source identity and provenance remain attached; federation does not create execution authority.</p><div style={{display:'flex',gap:9,flexWrap:'wrap'}}><button onClick={()=>setFederatedRegion(region)} style={{padding:'11px 14px',cursor:'pointer',fontWeight:950}}>FEDERATE BOUNDED SIGNAL →</button><button onClick={()=>setFederatedRegion(null)} style={{padding:'11px 14px',cursor:'pointer',fontWeight:900}}>CLEAR FEDERATION</button></div>{federatedRegion&&<p style={{marginTop:14,color:'#6fe8ff',fontWeight:900}}>SIGNAL ACTIVE · {federatedRegion} remains attributable while participating in FAIN.</p>}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:10,marginTop:20}}>{[['BUILDING','Local AIR remains attributable'],['PERSON','PAIR preserves exposure continuity'],['CITY','Bounded signals can aggregate'],['REGION','Provenance survives federation'],['WORLD','Connection does not create authority']].map(([a,b])=><div key={a} style={{padding:15,borderRadius:13,border:'1px solid rgba(111,232,255,.13)',background:'rgba(1,10,13,.72)'}}><b style={{color:'#6fe8ff',fontSize:11,letterSpacing:'.12em'}}>{a}</b><div style={{fontSize:12,color:'#8fa9a3',marginTop:6}}>{b}</div></div>)}</div>
   </section>

   <section style={{padding:28,border:'1px solid rgba(111,232,255,.22)',borderRadius:22,background:'rgba(3,18,20,.84)'}}>
    <small style={{color:'#6fe8ff',fontWeight:950,letterSpacing:'.15em'}}>THE ARCHITECTURE</small>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:18}}>
     {[
      ['REALITY','Atmospheric conditions exist before the record.'],
      ['AIR','Place-based atmospheric chronology preserves what happened here.'],
      ['PAIR','Person-centered continuity preserves what was encountered across places and time.'],
      ['FAIN','Federated nodes connect bounded evidence while preserving provenance and local governance.'],
      ['EIG','Environmental Integrity Governance governs integrity, continuity, admissibility and bounded reliance.'],
      ['CONSEQUENCE','TA-14 determines what may cross from proposal into reality now.']
     ].map(([a,b],i)=><article key={a} style={{padding:18,borderRadius:15,border:'1px solid rgba(111,232,255,.15)',background:i===3?'rgba(111,232,255,.09)':'rgba(2,10,12,.7)'}}><b style={{color:i===3?'#6fe8ff':'#62f0c4'}}>{a}</b><p style={{fontSize:13,lineHeight:1.55,color:'#9db7b0'}}>{b}</p></article>)}
    </div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(111,232,255,.2)',borderRadius:22,background:'linear-gradient(180deg,rgba(3,18,22,.93),rgba(2,10,13,.96))'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#6fe8ff'}}>FAIN · FEDERATION OPERATING MODEL</p>
    <h2 style={{fontSize:'clamp(34px,5vw,62px)',letterSpacing:'-.045em',margin:'10px 0 14px'}}>Federation is not connection. It is governed continuity across boundaries.</h2>
    <p style={{maxWidth:1000,color:'#a8c1ba',fontSize:17,lineHeight:1.72}}>A FAIN node does not simply publish sensor values. Each bounded signal must preserve what it represents, where it originated, when it was established, which record class it belongs to, what limitations travel with it, what jurisdiction governs its use, and whether later reliance remains admissible.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:22}}>
     {[
      ['NODE IDENTITY','Every participating source remains attributable to a bounded local node.'],
      ['RECORD CLASS','AIR, PAIR, ambient network signal, event evidence, or advisory context are not interchangeable.'],
      ['TIME INTEGRITY','Currentness, chronology, transitions and unresolved gaps remain visible.'],
      ['PROVENANCE','Source lineage, instrument context and declared limitations travel with federation.'],
      ['JURISDICTION','Cross-boundary availability does not erase local legal, institutional or contractual authority.'],
      ['RELIANCE BOUNDARY','Receiving a signal does not automatically authorize diagnosis, intervention or execution.']
     ].map(([a,b])=><article key={a} style={{padding:20,borderRadius:15,border:'1px solid rgba(111,232,255,.14)',background:'rgba(1,10,13,.72)'}}><b style={{color:'#62f0c4'}}>{a}</b><p style={{color:'#93ada6',lineHeight:1.6,fontSize:13}}>{b}</p></article>)}
    </div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(180,148,255,.22)',borderRadius:22,background:'rgba(6,12,21,.92)'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#b494ff'}}>FAIN SIGNAL ENVELOPE</p>
    <h2 style={{fontSize:'clamp(32px,4.8vw,58px)',letterSpacing:'-.04em',margin:'10px 0'}}>What exactly is allowed to federate?</h2>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'20px 0'}}>{([['ambient','AMBIENT'],['exposure','EXPOSURE'],['event','EVENT'],['advisory','ADVISORY']] as const).map(([k,label])=><button key={k} onClick={()=>setSignalClass(k)} style={{padding:'11px 14px',borderRadius:999,cursor:'pointer',fontWeight:950,border:signalClass===k?'1px solid #b494ff':'1px solid rgba(180,148,255,.2)',background:signalClass===k?'rgba(180,148,255,.12)':'rgba(4,8,14,.72)',color:signalClass===k?'#e7ddff':'#8f88a8'}}>{label}</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
     <article style={{padding:20,border:'1px solid rgba(180,148,255,.2)',borderRadius:15}}><small style={{color:'#8f88a8'}}>CURRENT CLASS</small><h3 style={{color:'#b494ff',fontSize:26,margin:'7px 0'}}>{signalClass.toUpperCase()}</h3><p style={{color:'#a8a4b8',lineHeight:1.6}}>{signalClass==='ambient'?'Place-centered atmospheric conditions available for bounded environmental representation.':signalClass==='exposure'?'Person-associated atmospheric chronology requiring stronger continuity and privacy boundaries.':signalClass==='event'?'A bounded environmental event such as wildfire smoke, plume, ventilation failure or contamination episode.':'A derived awareness signal that may support attention but does not inherit the standing of the underlying record.'}</p></article>
     <article style={{padding:20,border:'1px solid rgba(111,232,255,.16)',borderRadius:15}}><small style={{color:'#789f98'}}>MUST TRAVEL WITH IT</small><p style={{color:'#a8c1ba',lineHeight:1.65}}>Source identity · time window · place or subject binding · instrument context · confidence/limitations · continuity state · jurisdictional context · permitted reliance.</p></article>
     <article style={{padding:20,border:'1px solid rgba(98,240,196,.16)',borderRadius:15}}><small style={{color:'#78a99c'}}>MUST NOT BE IMPLIED</small><p style={{color:'#a8c1ba',lineHeight:1.65}}>Ownership transfer · medical causation · regulatory finding · intervention authority · universal comparability · silent correction · execution permission.</p></article>
    </div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,52px)',border:'1px solid rgba(255,209,92,.2)',borderRadius:22,background:'rgba(18,14,4,.72)'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#ffd15c'}}>CROSS-JURISDICTION TEST</p>
    <h2 style={{fontSize:'clamp(32px,4.8vw,58px)',letterSpacing:'-.04em',margin:'10px 0'}}>A signal can cross geography without crossing every authority boundary.</h2>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12,marginTop:20}}>
     <button onClick={()=>setJurisdiction(!jurisdiction)} style={{padding:20,textAlign:'left',cursor:'pointer',borderRadius:15,border:'1px solid rgba(255,209,92,.25)',background:'rgba(20,15,4,.72)',color:'#f6df9a'}}><b>JURISDICTION</b><div style={{marginTop:8}}>{jurisdiction?'BOUNDARY PRESERVED':'BOUNDARY UNKNOWN'}</div></button>
     <button onClick={()=>setProvenance(!provenance)} style={{padding:20,textAlign:'left',cursor:'pointer',borderRadius:15,border:'1px solid rgba(255,209,92,.25)',background:'rgba(20,15,4,.72)',color:'#f6df9a'}}><b>PROVENANCE</b><div style={{marginTop:8}}>{provenance?'SOURCE TRACEABLE':'SOURCE BROKEN'}</div></button>
     <button onClick={()=>setClock(!clock)} style={{padding:20,textAlign:'left',cursor:'pointer',borderRadius:15,border:'1px solid rgba(255,209,92,.25)',background:'rgba(20,15,4,.72)',color:'#f6df9a'}}><b>TIME CONTINUITY</b><div style={{marginTop:8}}>{clock?'CURRENT / ORDERED':'STALE / DISCONTINUOUS'}</div></button>
    </div>
    <div style={{marginTop:18,padding:20,borderRadius:15,background:'rgba(5,8,10,.72)',border:'1px solid rgba(255,255,255,.08)'}}><b style={{color:'#ffd15c'}}>FEDERATION DETERMINATION</b><p style={{color:'#b8b39f',lineHeight:1.65}}>{jurisdiction&&provenance&&clock?'The signal may participate in bounded federation. Local provenance, chronology and jurisdictional boundaries remain preserved.':!provenance?'HOLD — the signal cannot carry reliable standing across the federation because source provenance is broken.':!clock?'HOLD — temporal continuity is not sufficient to silently treat earlier evidence as current.':'ESCALATE — the receiving jurisdiction cannot determine permitted reliance from the current bounded state.'}</p></div>
   </section>

   <section style={{marginTop:26,padding:'clamp(28px,5vw,54px)',border:'1px solid rgba(98,240,196,.26)',borderRadius:24,background:'radial-gradient(circle at 80% 10%,rgba(255,120,80,.08),transparent 30%),rgba(2,14,15,.95)'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#62f0c4'}}>LIVE FEDERATED EVENT · WILDFIRE SMOKE</p>
    <h2 style={{fontSize:'clamp(36px,5.5vw,68px)',lineHeight:1,letterSpacing:'-.05em',margin:'10px 0'}}>Watch one atmospheric event move from reality to consequence.</h2>
    <p style={{maxWidth:1000,color:'#a8c1ba',fontSize:17,lineHeight:1.72}}>A smoke plume is detected outside a jurisdiction. The event is preserved locally, federated as bounded evidence, encountered by a school, associated with a person-centered chronology, carried into a new environment, and finally relied upon by a system proposing a consequential response.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:8,margin:'24px 0'}}>{[
      ['REALITY','Smoke plume'],['NODE','Outdoor detection'],['AIR','School penetration'],['FAIN','Bounded event'],['PAIR','Exposure chronology'],['NEW PLACE','Clinic arrival'],['CHANGE','Conditions differ'],['PROPOSAL','Ventilation response'],['TA-14','Runtime determination']
     ].map(([a,b],i)=><button key={a} onClick={()=>setEventStep(i)} style={{padding:15,textAlign:'left',cursor:'pointer',borderRadius:13,border:eventStep===i?'1px solid #62f0c4':'1px solid rgba(98,240,196,.12)',background:eventStep===i?'rgba(98,240,196,.1)':'rgba(1,9,11,.72)',color:eventStep===i?'#e2fff6':'#8fa9a3'}}><b style={{display:'block',fontSize:10,letterSpacing:'.1em'}}>{i+1}. {a}</b><span style={{display:'block',fontSize:12,marginTop:6}}>{b}</span></button>)}</div>
    <div style={{padding:22,borderRadius:16,border:'1px solid rgba(111,232,255,.16)',background:'rgba(2,10,13,.78)'}}><small style={{color:'#789f98'}}>CURRENT EVENT STATE</small><h3 style={{fontSize:28,color:'#6fe8ff',margin:'8px 0'}}>{['WILDFIRE SMOKE EXISTS IN THE PHYSICAL ATMOSPHERE','OUTDOOR NODE RECORDS A BOUNDED EVENT','SCHOOL AIR RECORD OBSERVES INDOOR PENETRATION','FAIN CARRIES A BOUNDED EVENT SIGNAL','PAIR PRESERVES PERSON-CENTERED EXPOSURE CHRONOLOGY','PERSON ARRIVES IN A NEW INDEPENDENTLY GOVERNED PLACE','CURRENT LOCAL CONDITIONS NO LONGER MATCH THE PRIOR ENVIRONMENT','AUTOMATED SYSTEM PROPOSES A VENTILATION RESPONSE','TA-14 TESTS THE PROPOSED CONSEQUENCE NOW'][eventStep]}</h3><p style={{color:'#9db7b0',lineHeight:1.65}}>Prior evidence remains evidence. Each transition must preserve the bindings and limitations required for the next reliance; no step silently inherits authority from the step before it.</p></div>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.16em',color:'#ffd166',marginTop:26}}>BREAK THE EVENT</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10}}>
     <button onClick={()=>setEventProvenance(!eventProvenance)} style={{padding:17,cursor:'pointer',fontWeight:900}}>{eventProvenance?'BREAK':'RESTORE'} PROVENANCE</button>
     <button onClick={()=>setEventPair(!eventPair)} style={{padding:17,cursor:'pointer',fontWeight:900}}>{eventPair?'BREAK':'RESTORE'} PAIR CONTINUITY</button>
     <button onClick={()=>setEventReliance(!eventReliance)} style={{padding:17,cursor:'pointer',fontWeight:900}}>{eventReliance?'REMOVE':'RESTORE'} RELIANCE BASIS</button>
     <button onClick={()=>setEventAuthority(!eventAuthority)} style={{padding:17,cursor:'pointer',fontWeight:900}}>{eventAuthority?'REVOKE':'RESTORE'} INTERVENTION AUTHORITY</button>
    </div>
    <div style={{marginTop:20,padding:24,borderRadius:16,border:'1px solid rgba(255,255,255,.1)',background:'rgba(1,7,9,.9)'}}><small style={{color:'#789f98',fontWeight:900}}>END-TO-END DETERMINATION</small><div style={{fontSize:'clamp(46px,7vw,84px)',fontWeight:950,margin:'8px 0',color:eventOutcome==='ALLOW'?'#63f0b4':eventOutcome==='DENY'?'#ff7a7a':eventOutcome==='ESCALATE'?'#b9a7ff':'#ffd166'}}>{eventOutcome}</div><p style={{color:'#a9c0b9',lineHeight:1.65}}>{eventOutcome==='ALLOW'?'The modeled chain retains provenance, person-centered continuity, a permitted reliance basis, and current intervention authority. The proposed consequence may proceed within the modeled boundary.':eventOutcome==='DENY'?'The proposed physical response lacks current intervention authority. Atmospheric evidence cannot manufacture authority to act.':eventOutcome==='ESCALATE'?'The receiving context lacks an established basis for the proposed reliance. Cross-jurisdiction availability is not enough.':'A required evidentiary continuity condition is unresolved. The chain stops rather than silently repairing the missing foundation.'}</p></div>
    <div style={{marginTop:20,padding:22,borderLeft:'3px solid #6fe8ff',background:'rgba(111,232,255,.05)'}}><b style={{color:'#6fe8ff'}}>THE POINT</b><p style={{color:'#a8c1ba',lineHeight:1.7,marginBottom:0}}>FAIN can make atmospheric evidence available across distance. AIR can preserve what happened in a place. PAIR can preserve what a person encountered. None of them, alone or together, automatically establish that a proposed consequence may become reality. That determination remains bounded to admissible evidence, applicable authority, established standing, and present conditions.</p></div>
   </section>

   <section style={{marginTop:26,padding:'clamp(24px,5vw,46px)',border:'1px solid rgba(98,240,196,.23)',borderRadius:22,background:'rgba(3,16,18,.88)'}}>
    <p style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#62f0c4'}}>RUN THE FEDERATION</p>
    <h2 style={{fontSize:'clamp(34px,5vw,60px)',letterSpacing:'-.045em',margin:'10px 0'}}>Move one person through independently governed atmospheric environments.</h2>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'24px 0'}}>{order.map(k=><button key={k} onClick={()=>setPlace(k)} style={{padding:'11px 15px',borderRadius:999,cursor:'pointer',fontWeight:950,border:place===k?'1px solid #6fe8ff':'1px solid rgba(111,232,255,.18)',background:place===k?'rgba(111,232,255,.12)':'rgba(1,8,10,.7)',color:place===k?'#dffaff':'#88a59e'}}>{places[k].label}</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12}}>
     <article style={{padding:22,border:'1px solid rgba(111,232,255,.18)',borderRadius:16,background:'#031013'}}><small style={{color:'#789f98'}}>LOCAL PLACE RECORD</small><h3 style={{fontSize:28,margin:'8px 0',color:'#6fe8ff'}}>{p.air}</h3><p>{state==='normal'?p.condition:p.event}</p><b>AIR REMAINS LOCALLY ATTRIBUTABLE</b></article>
     <article style={{padding:22,border:'1px solid rgba(180,148,255,.25)',borderRadius:16,background:'#07101a'}}><small style={{color:'#9a8bc7'}}>PERSON-CENTERED CHRONOLOGY</small><h3 style={{fontSize:28,margin:'8px 0',color:'#b494ff'}}>PAIR-001</h3><p>{continuity?'Transition preserved from prior environment. Time, place, source and declared limitations travel with the chronology.':'Continuity gap introduced. The record cannot silently repair the missing transition.'}</p><b>{continuity?'CONTINUITY PRESERVED':'CONTINUITY UNRESOLVED'}</b></article>
     <article style={{padding:22,border:'1px solid rgba(98,240,196,.22)',borderRadius:16,background:'#041511'}}><small style={{color:'#78a99c'}}>FEDERATED SIGNAL</small><h3 style={{fontSize:28,margin:'8px 0',color:'#62f0c4'}}>FAIN NODE</h3><p>{federation?'A bounded atmospheric signal may participate in distributed environmental representation while the originating record retains provenance.':'Federated provenance is unavailable. Cross-node reliance requires governed review.'}</p><b>{federation?'BOUNDED FEDERATION':'FEDERATION UNRESOLVED'}</b></article>
    </div>
    <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:18}}>
     <button onClick={next} style={{padding:'13px 16px',cursor:'pointer',fontWeight:900}}>MOVE PERSON →</button>
     <button onClick={()=>setState(state==='normal'?'event':'normal')} style={{padding:'13px 16px',cursor:'pointer',fontWeight:900}}>CHANGE ATMOSPHERE</button>
     <button onClick={()=>setContinuity(!continuity)} style={{padding:'13px 16px',cursor:'pointer',fontWeight:900}}>{continuity?'BREAK':'RESTORE'} PAIR CONTINUITY</button>
     <button onClick={()=>setFederation(!federation)} style={{padding:'13px 16px',cursor:'pointer',fontWeight:900}}>{federation?'BREAK':'RESTORE'} FEDERATION</button>
     <button onClick={()=>setAuthority(!authority)} style={{padding:'13px 16px',cursor:'pointer',fontWeight:900}}>{authority?'EXPIRE':'RESTORE'} AUTHORITY</button>
    </div>
   </section>

   <section style={{marginTop:26,padding:'clamp(26px,5vw,48px)',border:'1px solid rgba(255,255,255,.12)',borderRadius:22,background:'rgba(2,10,12,.9)'}}>
    <small style={{fontWeight:950,letterSpacing:'.16em',color:'#789f98'}}>THE CONSEQUENCE BOUNDARY</small>
    <h2 style={{fontSize:'clamp(30px,4.5vw,54px)',lineHeight:1.08}}>Does this proposed consequence have <span style={{color:'#6fe8ff'}}>admissible evidence</span>, <span style={{color:'#62f0c4'}}>applicable authority</span>, and <span style={{color:'#b494ff'}}>established standing</span> to become reality <em>now</em>?</h2>
    <div style={{fontSize:'clamp(44px,7vw,82px)',fontWeight:950,color,margin:'22px 0'}}>{determination}</div>
    <p style={{maxWidth:900,color:'#a9c0b9',fontSize:17,lineHeight:1.7}}>{determination==='ALLOW'?'The bounded record remains attributable, person-centered continuity is preserved, federation remains governed, and applicable authority is current for this modeled reliance.':determination==='HOLD'?'A required continuity or authority condition is not established now. Earlier atmospheric evidence does not silently inherit present standing.':'The federated relationship cannot currently establish sufficient cross-node provenance for the proposed reliance. Governed review is required.'}</p>
   </section>

   <section style={{marginTop:26,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
    {[
     ['AIR IS NOT A DASHBOARD','It is a governed atmospheric record tied to place, chronology, provenance and declared limitations.'],
     ['PAIR IS NOT A DIAGNOSIS','It preserves person-centered environmental chronology. It does not silently establish medical causation or outcome.'],
     ['FAIN IS NOT ONE GIANT DATABASE','Federation connects bounded signals and records across nodes while preserving source identity, provenance and governance boundaries.'],
     ['EVIDENCE IS NOT INTERVENTION AUTHORITY','Environmental evidence may support awareness or reliance without automatically authorizing physical intervention.']
    ].map(([a,b])=><article key={a} style={{padding:22,border:'1px solid rgba(111,232,255,.14)',borderRadius:16,background:'rgba(3,15,16,.82)'}}><b style={{color:'#6fe8ff'}}>{a}</b><p style={{color:'#9db7b0',lineHeight:1.65}}>{b}</p></article>)}
   </section>

   <footer style={{marginTop:60,paddingTop:34,borderTop:'1px solid rgba(111,232,255,.14)'}}>
    <p style={{fontSize:'clamp(22px,3vw,34px)',fontWeight:900}}>THE PERSON MOVES. THE ATMOSPHERE CHANGES. THE RECORD REMAINS.</p>
    <p style={{color:'#9db7b0',maxWidth:900,lineHeight:1.7}}>This public technical model demonstrates architectural relationships. It does not establish medical diagnosis, causation, regulatory approval, or intervention authority.</p>
    <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><Link href="/environmental-integrity-governance/pair" style={{color:'#b494ff'}}>OPEN PAIR →</Link><Link href="/environmental-integrity-governance" style={{color:'#62f0c4'}}>OPEN ENVIRONMENTAL INTEGRITY GOVERNANCE →</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/three-boundaries" style={{color:'#6fe8ff'}}>OPEN THREE BOUNDARIES →</Link></div>
   </footer>
  </div>
 </main>
}