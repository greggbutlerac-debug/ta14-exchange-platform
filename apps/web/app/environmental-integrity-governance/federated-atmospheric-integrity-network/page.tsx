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