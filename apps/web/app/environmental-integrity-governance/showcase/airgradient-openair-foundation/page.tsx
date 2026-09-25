'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type State='supported'|'missing';
type Action='OPEN_WINDOWS'|'MECH_VENT'|'FILTRATION'|'ADVISORY'|'HOLD';
type Result='ALLOW'|'HOLD'|'DENY'|'ESCALATE';

const actions=[
  ['OPEN_WINDOWS','OPEN WINDOWS','Increase natural ventilation.'],
  ['MECH_VENT','MECHANICAL VENTILATION','Increase or adjust mechanical outdoor-air delivery.'],
  ['FILTRATION','FILTRATION','Increase or deploy filtration within an authorized operating plan.'],
  ['ADVISORY','ISSUE ADVISORY','Communicate a bounded precaution or response instruction.'],
  ['HOLD','HOLD ACTION','Preserve the evidence and wait for an authorized decision.'],
] as const;

export default function AirGradientOpenAirFoundationShowroom(){
  const [indoor,setIndoor]=useState<State>('supported');
  const [outdoor,setOutdoor]=useState<State>('supported');
  const [authority,setAuthority]=useState<State>('missing');
  const [standing,setStanding]=useState<State>('supported');
  const [action,setAction]=useState<Action>('OPEN_WINDOWS');

  const result:Result=useMemo(()=>{
    if(indoor==='missing'||outdoor==='missing') return 'HOLD';
    if(authority==='missing') return 'HOLD';
    if(standing==='missing') return 'ESCALATE';
    if(action==='OPEN_WINDOWS') return 'ESCALATE';
    if(action==='HOLD') return 'HOLD';
    return 'ALLOW';
  },[indoor,outdoor,authority,standing,action]);

  const accent={ALLOW:'#7ff0bd',HOLD:'#f2c46d',DENY:'#ff7d8c',ESCALATE:'#c7adff'}[result];
  const explanation={
    ALLOW:'The demonstration has current indoor and outdoor evidence, an identified authority path, established standing, and a bounded proposed consequence. ALLOW remains a governance determination; TA-14 does not execute the physical action.',
    HOLD:'The record is not sufficient for execution yet. The evidence or authority path is incomplete, or the selected consequence is intentionally being held.',
    DENY:'The proposed consequence is outside the examined authority or scope.',
    ESCALATE:'Competing environmental conditions or unresolved standing make silent automated execution inappropriate. Route the decision to an authorized actor.'
  }[result];

  const chip=(on:boolean)=>({cursor:'pointer',padding:'10px 13px',borderRadius:999,border:on?'1px solid rgba(127,240,189,.58)':'1px solid rgba(117,215,255,.18)',background:on?'rgba(127,240,189,.10)':'rgba(3,13,21,.72)',color:on?'#e8fff4':'#8ea5b0',fontWeight:950,fontSize:10,letterSpacing:'.06em'} as const);

  return <main style={{minHeight:'100vh',padding:'46px 20px 110px',background:'radial-gradient(circle at 82% 2%,rgba(65,206,255,.17),transparent 27%),radial-gradient(circle at 7% 35%,rgba(94,238,183,.11),transparent 29%),linear-gradient(180deg,#02070c,#06121b 50%,#02070c)',color:'#eef8fb',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{maxWidth:1240,margin:'0 auto'}}>
      <nav style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(111,220,255,.12)'}}>
        <Link href="/showrooms/environmental-atmospheric" style={{color:'#9eeaff',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL & ATMOSPHERIC SHOWROOMS</Link>
        <div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#718c98'}}>PUBLIC TECHNICAL SHOWROOM · OPEN FOR CORRECTION</div>
      </nav>

      <section style={{marginTop:26,padding:'clamp(38px,7vw,80px)',border:'1px solid rgba(111,220,255,.23)',borderRadius:32,background:'linear-gradient(145deg,rgba(8,40,55,.97),rgba(3,13,21,.99) 58%,rgba(13,38,31,.96))',boxShadow:'0 38px 120px rgba(0,0,0,.45)'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.21em',color:'#70dcff'}}>AIRGRADIENT × OPENAIR FOUNDATION × TA-14 · INDEPENDENT EXAMINATION SURFACE</div>
        <h1 style={{fontSize:'clamp(48px,8vw,104px)',lineHeight:.9,letterSpacing:'-.065em',margin:'22px 0 28px'}}>A DASHBOARD CAN SHOW<br/><span style={{color:'#7ff0bd'}}>WHAT IS HAPPENING.</span></h1>
        <h2 style={{fontSize:'clamp(25px,4vw,50px)',lineHeight:1.03,letterSpacing:'-.045em',margin:'0 0 22px'}}>What authorizes what happens next?</h2>
        <p style={{fontSize:'clamp(17px,2vw,23px)',lineHeight:1.62,maxWidth:1040,color:'#b9ccd5',margin:0}}>AirGradient and the OpenAir Foundation focus on making environmental conditions visible, open and locally useful. TA-14 does not replace that monitoring layer. This showroom examines the next seam: when a measurement supports a proposed real-world consequence, what evidence, authority and standing must exist before action becomes admissible?</p>
      </section>

      <section style={{marginTop:22,padding:'clamp(28px,5vw,50px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:25,background:'rgba(4,17,24,.9)'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>THE PUBLIC RECORD</div>
        <h2 style={{fontSize:'clamp(33px,5vw,60px)',letterSpacing:'-.045em',lineHeight:1.02,margin:'11px 0 18px'}}>Monitoring becomes public infrastructure when communities can use it.</h2>
        <p style={{maxWidth:1040,color:'#a8bcc6',fontSize:16,lineHeight:1.72}}>UNICEF documents a nationwide Lao PDR program with AirGradient monitors in 148 schools across 148 districts. The program combines real-time air-quality data with training, local capacity building and AI-supported forecasting. AirGradient has separately described the broader deployment as roughly 160 monitors. The OpenAir Foundation now frames measurement as the beginning of a longer journey toward practical protection.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:22}}>
          {[
            ['148 SCHOOLS','UNICEF-documented school deployment across every district in Lao PDR.'],
            ['OPEN SOURCE','Monitoring hardware, firmware, tools and open-data pathways are central to the AirGradient / OpenAir approach.'],
            ['LOCAL CAPACITY','Teachers, students and officials are trained to understand, maintain and use the monitoring network.'],
            ['MEASUREMENT → PROTECTION','OpenAir Foundation explicitly frames monitoring as a starting point rather than the end state.']
          ].map(([a,b])=><div key={a} style={{padding:20,borderRadius:16,border:'1px solid rgba(111,220,255,.13)',background:'rgba(2,10,17,.55)'}}><div style={{fontSize:22,fontWeight:1000,color:'#70dcff'}}>{a}</div><p style={{margin:'8px 0 0',fontSize:13,lineHeight:1.6,color:'#91a8b5'}}>{b}</p></div>)}
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:20}}>
          <a href="https://www.unicef.org/innovation/stories/innovation-across-borders-lao-pdr" target="_blank" rel="noreferrer" style={{color:'#baf2ff',fontWeight:900,textDecoration:'none'}}>UNICEF LAO PDR RECORD ↗</a>
          <a href="https://www.airgradient.com/blog/project-lao-pdr-with-unicef/" target="_blank" rel="noreferrer" style={{color:'#baf2ff',fontWeight:900,textDecoration:'none'}}>AIRGRADIENT PROJECT ↗</a>
          <a href="https://openair.foundation/what-we-do" target="_blank" rel="noreferrer" style={{color:'#baf2ff',fontWeight:900,textDecoration:'none'}}>OPENAIR FOUNDATION ↗</a>
        </div>
      </section>

      <section style={{marginTop:22,padding:'clamp(28px,5vw,50px)',border:'1px solid rgba(199,173,255,.22)',borderRadius:25,background:'linear-gradient(135deg,rgba(26,17,44,.66),rgba(3,12,20,.96))'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#c7adff'}}>THE NORTHERN THAILAND PROBLEM</div>
        <h2 style={{fontSize:'clamp(33px,5vw,60px)',letterSpacing:'-.045em',lineHeight:1.02,margin:'11px 0 18px'}}>Indoor evidence can point one way. Outdoor evidence can point the other.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
          <div style={{padding:24,borderRadius:18,border:'1px solid rgba(111,220,255,.18)',background:'rgba(2,10,17,.58)'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.14em',color:'#70dcff'}}>INSIDE</div><h3 style={{fontSize:24,margin:'10px 0'}}>VENTILATION PRESSURE</h3><p style={{color:'#a4b8c1',lineHeight:1.65}}>Closing a naturally ventilated classroom can allow heat, CO₂ and ventilation concerns to worsen. Indoor measurements may support a need to change conditions.</p></div>
          <div style={{padding:24,borderRadius:18,border:'1px solid rgba(255,125,140,.20)',background:'rgba(35,8,14,.36)'}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.14em',color:'#ff9aa5'}}>OUTSIDE</div><h3 style={{fontSize:24,margin:'10px 0'}}>POLLUTION PRESSURE</h3><p style={{color:'#a4b8c1',lineHeight:1.65}}>During regional burning or smoke events, opening the building may import polluted outdoor air. Outdoor measurements may support the opposite response.</p></div>
        </div>
        <div style={{marginTop:16,padding:22,borderRadius:17,border:'1px solid rgba(127,240,189,.32)',background:'rgba(127,240,189,.05)',fontSize:'clamp(21px,3vw,36px)',fontWeight:1000,lineHeight:1.2}}>THE SENSOR DOES NOT RESOLVE THE GOVERNANCE CONFLICT.<br/><span style={{color:'#7ff0bd'}}>IT MAKES THE CONFLICT VISIBLE.</span></div>
      </section>

      <section style={{marginTop:22,padding:'clamp(28px,5vw,50px)',border:'1px solid rgba(111,220,255,.17)',borderRadius:25,background:'rgba(4,14,22,.93)'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>THE CONSEQUENCE PATH</div>
        <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'11px 0 22px'}}>Measurement → Evidence → Authority → Action → Verification</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(205px,1fr))',gap:10}}>
          {[
            ['MEASUREMENT','The environmental condition becomes observable.'],
            ['EVIDENCE','Identity, timing, continuity, calibration context and applicability are examined.'],
            ['AUTHORITY','The actor, policy or system empowered to approve this consequence is identified.'],
            ['ACTION','A specific bounded intervention is committed and executed by the authorized party.'],
            ['VERIFICATION','The resulting condition becomes new evidence and may require revalidation.']
          ].map(([a,b],i)=><div key={a} style={{padding:20,borderRadius:16,border:i===2?'1px solid rgba(127,240,189,.4)':'1px solid rgba(111,220,255,.13)',background:i===2?'rgba(127,240,189,.055)':'rgba(2,9,15,.55)'}}><b style={{color:i===2?'#7ff0bd':'#eef8fb'}}>{a}</b><p style={{fontSize:13,lineHeight:1.58,color:'#91a8b5',margin:'8px 0 0'}}>{b}</p></div>)}
        </div>
      </section>

      <section style={{marginTop:22,padding:'clamp(30px,5vw,54px)',border:`1px solid ${accent}55`,borderRadius:27,background:'linear-gradient(145deg,rgba(7,30,38,.94),rgba(3,11,18,.98))'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>RUN THE SCHOOL AIR EXAM</div>
        <h2 style={{fontSize:'clamp(34px,5.5vw,66px)',letterSpacing:'-.05em',lineHeight:1,margin:'12px 0 12px'}}>The dashboard has evidence. Does the consequence have permission?</h2>
        <p style={{maxWidth:980,color:'#9fb4be',lineHeight:1.68}}>This is a governance demonstration, not ventilation, filtration, exposure or medical guidance. No intervention threshold is asserted.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12,marginTop:22}}>
          <div style={{padding:20,borderRadius:16,border:'1px solid rgba(111,220,255,.14)',background:'rgba(2,9,15,.55)'}}><div style={{fontSize:10,fontWeight:950,color:'#70dcff'}}>INDOOR EVIDENCE</div><div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:12}}><button onClick={()=>setIndoor('supported')} style={chip(indoor==='supported')}>CURRENT</button><button onClick={()=>setIndoor('missing')} style={chip(indoor==='missing')}>INSUFFICIENT</button></div></div>
          <div style={{padding:20,borderRadius:16,border:'1px solid rgba(111,220,255,.14)',background:'rgba(2,9,15,.55)'}}><div style={{fontSize:10,fontWeight:950,color:'#70dcff'}}>OUTDOOR EVIDENCE</div><div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:12}}><button onClick={()=>setOutdoor('supported')} style={chip(outdoor==='supported')}>CURRENT</button><button onClick={()=>setOutdoor('missing')} style={chip(outdoor==='missing')}>INSUFFICIENT</button></div></div>
          <div style={{padding:20,borderRadius:16,border:'1px solid rgba(111,220,255,.14)',background:'rgba(2,9,15,.55)'}}><div style={{fontSize:10,fontWeight:950,color:'#70dcff'}}>APPLICABLE AUTHORITY</div><div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:12}}><button onClick={()=>setAuthority('supported')} style={chip(authority==='supported')}>ESTABLISHED</button><button onClick={()=>setAuthority('missing')} style={chip(authority==='missing')}>UNRESOLVED</button></div></div>
          <div style={{padding:20,borderRadius:16,border:'1px solid rgba(111,220,255,.14)',background:'rgba(2,9,15,.55)'}}><div style={{fontSize:10,fontWeight:950,color:'#70dcff'}}>ESTABLISHED STANDING</div><div style={{display:'flex',gap:7,flexWrap:'wrap',marginTop:12}}><button onClick={()=>setStanding('supported')} style={chip(standing==='supported')}>ESTABLISHED</button><button onClick={()=>setStanding('missing')} style={chip(standing==='missing')}>UNRESOLVED</button></div></div>
        </div>

        <div style={{marginTop:18}}>
          <div style={{fontSize:10,fontWeight:950,letterSpacing:'.14em',color:'#70dcff'}}>PROPOSED CONSEQUENCE</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:10}}>{actions.map(([id,label])=><button key={id} onClick={()=>setAction(id)} style={{cursor:'pointer',padding:'11px 14px',borderRadius:999,border:action===id?'1px solid #7ff0bd':'1px solid rgba(111,220,255,.18)',background:action===id?'rgba(127,240,189,.10)':'transparent',color:action===id?'#7ff0bd':'#9ab0bc',fontWeight:950,fontSize:10}}>{label}</button>)}</div>
        </div>

        <div style={{marginTop:20,padding:'clamp(28px,5vw,48px)',borderRadius:22,border:`1px solid ${accent}55`,background:`${accent}0d`,textAlign:'center'}}>
          <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#839aa5'}}>TA-14 DETERMINATION</div>
          <div style={{fontSize:'clamp(58px,10vw,118px)',lineHeight:.9,fontWeight:1000,letterSpacing:'-.07em',margin:'16px 0',color:accent}}>{result}</div>
          <p style={{maxWidth:850,margin:'0 auto',fontSize:'clamp(15px,2vw,20px)',lineHeight:1.65,color:'#b9ccd5'}}>{explanation}</p>
        </div>
      </section>

      <section style={{marginTop:22,padding:'clamp(28px,5vw,50px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:25,background:'rgba(4,17,24,.9)'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#7ff0bd'}}>NO MERGER REQUIRED</div>
        <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'11px 0 22px'}}>Keep the monitoring architecture. Govern the seam.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:10}}>
          {[
            ['AIRGRADIENT','Measurement hardware, data pathways, public monitoring tools and associated technical infrastructure remain independently governed.'],
            ['OPENAIR FOUNDATION','Open-source stewardship, community capacity, public-interest infrastructure and protection programs remain independently governed.'],
            ['LOCAL / PUBLIC AUTHORITY','Schools, ministries, agencies, facility operators and other competent actors retain their own legal and operational authority.'],
            ['TA-14','Examines whether a proposed consequence has sufficient Admissible Evidence, Applicable Authority and Established Standing to become reality NOW.']
          ].map(([a,b],i)=><div key={a} style={{padding:21,borderRadius:16,border:i===3?'1px solid rgba(127,240,189,.38)':'1px solid rgba(111,220,255,.13)',background:i===3?'rgba(127,240,189,.05)':'rgba(2,9,15,.52)'}}><b style={{color:i===3?'#7ff0bd':'#70dcff'}}>{a}</b><p style={{fontSize:13,lineHeight:1.6,color:'#95abb5',margin:'8px 0 0'}}>{b}</p></div>)}
        </div>
        <p style={{margin:'18px 0 0',color:'#78909b',fontSize:12,lineHeight:1.65}}>This independent showroom does not imply endorsement, adoption, sponsorship, partnership or institutional approval by AirGradient, OpenAir Foundation, UNICEF, any government, school, ministry or other referenced participant. Achim Haug, AirGradient and OpenAir Foundation are invited to correct, narrow or reject any representation of their work on this surface.</p>
      </section>

      <section style={{marginTop:22,padding:'clamp(30px,5vw,56px)',border:'1px solid rgba(111,220,255,.20)',borderRadius:26,background:'linear-gradient(145deg,rgba(9,31,43,.94),rgba(3,11,18,.98))'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#70dcff'}}>THE QUESTION TO TAKE FORWARD</div>
        <h2 style={{fontSize:'clamp(38px,6vw,74px)',letterSpacing:'-.055em',lineHeight:.96,margin:'12px 0 22px'}}>DON'T STOP AT<br/><span style={{color:'#7ff0bd'}}>“WHAT DOES THE AIR SAY?”</span></h2>
        <div style={{fontSize:'clamp(23px,3.6vw,44px)',lineHeight:1.12,fontWeight:1000,maxWidth:1050}}>ASK: WHAT CONSEQUENCE DOES THIS EVIDENCE SUPPORT — AND WHO HAS THE AUTHORITY TO MAKE IT REAL?</div>
        <div style={{marginTop:24,padding:22,borderRadius:17,border:'1px solid rgba(127,240,189,.32)',background:'rgba(127,240,189,.05)',fontSize:'clamp(20px,3vw,34px)',fontWeight:1000}}>MEASUREMENT IS NOT AUTHORITY.<br/>EVIDENCE IS NOT EXECUTION.<br/><span style={{color:'#7ff0bd'}}>PROTECTION REQUIRES THE WHOLE CHAIN.</span></div>
      </section>

      <footer style={{marginTop:28,paddingTop:20,borderTop:'1px solid rgba(111,220,255,.1)',display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',color:'#647d88',fontSize:10,lineHeight:1.7}}>
        <div>TA-14 AUTHORITY · PUBLIC TECHNICAL SHOWROOM · AIRGRADIENT / OPENAIR FOUNDATION</div>
        <div>OPEN FOR CORRECTION · NO ENDORSEMENT IMPLIED</div>
      </footer>
    </div>
  </main>;
}
