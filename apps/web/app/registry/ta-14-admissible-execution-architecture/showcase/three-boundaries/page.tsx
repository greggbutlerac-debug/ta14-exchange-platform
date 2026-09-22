'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Choice = 'current'|'expired'|'stale'|'authorized'|'outside'|'observable'|'unverified';
type Result = 'ALLOW'|'HOLD'|'DENY'|'ESCALATE';

const scenarios = {
  ventilation:{label:'VENTILATION',title:'Increase outdoor-air ventilation in Classroom 214.',detail:'CO₂ is elevated. Analytics recommends more outdoor air. A BACnet command is ready.',command:'Increase outdoor airflow'},
  temperature:{label:'TEMPERATURE',title:'Override the occupied cooling setpoint.',detail:'Zone temperature is outside target. Analytics proposes a temporary occupied-setpoint override.',command:'Apply cooling setpoint override'},
  energy:{label:'ENERGY',title:'Shed HVAC load during a demand event.',detail:'A demand-response event is active. The control layer proposes reducing selected HVAC loads.',command:'Shed bounded HVAC load'},
  maintenance:{label:'MAINTENANCE',title:'Reset equipment following a detected fault.',detail:'A fault condition has been detected and a remote reset is proposed before physical inspection.',command:'Issue equipment reset'},
} as const;

const card=(active=false)=>({border:`1px solid ${active?'rgba(108,240,184,.48)':'rgba(105,220,255,.15)'}`,background:active?'linear-gradient(145deg,rgba(21,83,63,.38),rgba(4,17,28,.94))':'rgba(5,18,30,.82)',borderRadius:18});

export default function ThreeBoundariesShowroom(){
  const [scenario,setScenario]=useState<keyof typeof scenarios>('ventilation');
  const [evidence,setEvidence]=useState<Choice>('current');
  const [authority,setAuthority]=useState<Choice>('expired');
  const [scope,setScope]=useState<Choice>('authorized');
  const [network,setNetwork]=useState<Choice>('observable');
  const s=scenarios[scenario];

  const result:Result=useMemo(()=>{
    if(scope==='outside') return 'DENY';
    if(evidence==='stale'||network==='unverified') return 'ESCALATE';
    if(authority==='expired') return 'HOLD';
    return 'ALLOW';
  },[evidence,authority,scope,network]);

  const reason={
    ALLOW:'Current evidence, current authority, bounded scope, and an observable execution path are established for this proposed consequence.',
    HOLD:'The condition may be real and the network may be ready, but current execution standing has not been established.',
    DENY:'The proposed consequence exceeds the established execution boundary.',
    ESCALATE:'The proposition cannot be resolved from the currently admissible state. Governed review is required before execution.'
  }[result];

  const resultColor={ALLOW:'#6cf0b8',HOLD:'#ffd36b',DENY:'#ff7b83',ESCALATE:'#b9a7ff'}[result];

  const Toggle=({label,value,onChange,options}:{label:string,value:Choice,onChange:(v:Choice)=>void,options:[Choice,string][]})=><div style={{padding:18,...card()}}>
    <div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#7f9baa'}}>{label}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>{options.map(([v,t])=><button key={v} onClick={()=>onChange(v)} style={{cursor:'pointer',padding:'12px 9px',borderRadius:11,border:value===v?'1px solid rgba(108,240,184,.55)':'1px solid rgba(120,180,205,.14)',background:value===v?'rgba(108,240,184,.11)':'rgba(2,9,15,.7)',color:value===v?'#dffff0':'#91a8b5',fontWeight:900,fontSize:11,letterSpacing:'.05em'}}>{t}</button>)}</div>
  </div>;

  return <main style={{minHeight:'100vh',padding:'48px 20px 100px',background:'radial-gradient(circle at 82% 0%,rgba(50,205,255,.17),transparent 27%),radial-gradient(circle at 12% 30%,rgba(108,240,184,.10),transparent 30%),linear-gradient(180deg,#02070d,#06111c 48%,#02070d)',color:'#eef8fb',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{maxWidth:1240,margin:'0 auto'}}>
      <nav style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(105,220,255,.12)'}}>
        <Link href="/registry/ta-14-admissible-execution-architecture" style={{color:'#9fe7f7',textDecoration:'none',fontWeight:900}}>← TA-14 Admissible Execution Architecture</Link>
        <span style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#688797'}}>PUBLIC TECHNICAL SHOWROOM · INTERACTIVE</span>
      </nav>

      <section style={{marginTop:26,padding:'clamp(34px,6vw,76px)',border:'1px solid rgba(105,220,255,.22)',borderRadius:30,background:'linear-gradient(145deg,rgba(7,35,51,.96),rgba(4,13,23,.98) 58%,rgba(16,28,48,.95))',boxShadow:'0 38px 120px rgba(0,0,0,.46)'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.22em',color:'#69dcff'}}>TA-14 · THE CONSEQUENCE BOUNDARY</div>
        <h1 style={{fontSize:'clamp(52px,9vw,112px)',lineHeight:.86,letterSpacing:'-.065em',margin:'24px 0 28px'}}>THE THREE<br/><span style={{color:'#6cf0b8'}}>BOUNDARIES</span></h1>
        <p style={{fontSize:'clamp(21px,2.7vw,32px)',fontWeight:900,letterSpacing:'-.025em',margin:'0 0 14px'}}>GOOD DATA IS NOT PERMISSION TO ACT.</p>
        <p style={{fontSize:'clamp(17px,2vw,23px)',lineHeight:1.62,maxWidth:980,color:'#afc5d0'}}>A building can possess trustworthy data. Its network can successfully transport a command. Its equipment can be perfectly capable of executing it. None of those facts establish that the proposed consequence is authorized to become reality <b style={{color:'#6cf0b8'}}>NOW</b>.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:34}}>
          {[['01','DATA SOVEREIGNTY','Can the operational record be owned, accessed, attributed, and trusted?'],['02','EXECUTION GOVERNANCE','Does the consequence have sufficient admissibility, authority, and standing now?'],['03','NETWORK OBSERVATION & ENFORCEMENT','What is moving toward the physical system, and can the determination meet the execution path?']].map(([n,t,d],i)=><div key={n} style={{padding:20,...card(i===1)}}><b style={{color:i===1?'#6cf0b8':'#69dcff',fontSize:12}}>{n}</b><div style={{fontWeight:950,margin:'9px 0 8px',letterSpacing:'.04em'}}>{t}</div><div style={{color:'#8fa7b4',fontSize:13,lineHeight:1.55}}>{d}</div></div>)}
        </div>
      </section>

      <section style={{marginTop:26,padding:'clamp(26px,5vw,48px)',...card()}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#69dcff'}}>RUN THE BOUNDARY</div>
        <h2 style={{fontSize:'clamp(32px,5vw,58px)',letterSpacing:'-.045em',margin:'10px 0 8px'}}>What has to be true before a building command becomes physical reality?</h2>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'24px 0'}}>{Object.entries(scenarios).map(([k,v])=><button key={k} onClick={()=>setScenario(k as keyof typeof scenarios)} style={{cursor:'pointer',padding:'11px 14px',borderRadius:999,border:scenario===k?'1px solid rgba(108,240,184,.5)':'1px solid rgba(105,220,255,.16)',background:scenario===k?'rgba(108,240,184,.1)':'rgba(2,9,15,.6)',color:scenario===k?'#dffff0':'#8fa7b4',fontWeight:950,fontSize:10,letterSpacing:'.08em'}}>{v.label}</button>)}</div>
        <div style={{padding:'clamp(22px,4vw,34px)',borderRadius:20,background:'linear-gradient(120deg,rgba(21,67,83,.35),rgba(2,10,17,.72))',border:'1px solid rgba(105,220,255,.16)'}}>
          <div style={{fontSize:10,fontWeight:950,letterSpacing:'.16em',color:'#708d9b'}}>PROPOSED CONSEQUENCE</div>
          <h3 style={{fontSize:'clamp(24px,3.5vw,40px)',margin:'9px 0',letterSpacing:'-.03em'}}>{s.title}</h3>
          <p style={{margin:0,color:'#9fb4bf',fontSize:16,lineHeight:1.65}}>{s.detail}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:18}}>
          <Toggle label="EVIDENCE" value={evidence} onChange={setEvidence} options={[[ 'current','CURRENT'],['stale','STALE']]}/>
          <Toggle label="AUTHORITY" value={authority} onChange={setAuthority} options={[[ 'current','CURRENT'],['expired','EXPIRED']]}/>
          <Toggle label="SCOPE" value={scope} onChange={setScope} options={[[ 'authorized','AUTHORIZED'],['outside','OUTSIDE BOUNDARY']]}/>
          <Toggle label="NETWORK" value={network} onChange={setNetwork} options={[[ 'observable','OBSERVABLE'],['unverified','UNVERIFIED']]}/>
        </div>

        <div style={{marginTop:18,padding:'clamp(28px,5vw,48px)',borderRadius:24,border:`1px solid ${resultColor}55`,background:`linear-gradient(135deg,${resultColor}12,rgba(3,12,20,.96))`,textAlign:'center'}}>
          <div style={{fontSize:10,fontWeight:950,letterSpacing:'.2em',color:'#7f98a5'}}>TA-14 DETERMINATION</div>
          <div style={{fontSize:'clamp(58px,10vw,112px)',fontWeight:1000,letterSpacing:'-.065em',lineHeight:.95,margin:'16px 0',color:resultColor}}>{result}</div>
          <p style={{maxWidth:820,margin:'0 auto',fontSize:'clamp(16px,2vw,21px)',lineHeight:1.65,color:'#b8cbd4'}}>{reason}</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',gap:10,alignItems:'center',marginTop:18,overflowX:'auto',paddingBottom:4}}>
          {[['RECORD',evidence==='current'?'SUPPORTED':'STALE'],['TA-14',result],['PHYSICAL CONSEQUENCE',result==='ALLOW'?'AUTHORIZED':'NOT AUTHORIZED']].map(([a,b],i)=><div key={a} style={{minWidth:190,padding:18,textAlign:'center',...card(i===1)}}><div style={{fontSize:10,letterSpacing:'.12em',color:'#718b99',fontWeight:900}}>{a}</div><div style={{marginTop:7,fontWeight:1000,color:i===1?resultColor:'#e7f4f8'}}>{b}</div></div>).reduce((acc,el,i)=>{if(i)acc.push(<b key={'a'+i} style={{color:'#4e7181'}}>→</b>);acc.push(el);return acc},[] as React.ReactNode[])}
        </div>
        <div style={{marginTop:18,textAlign:'center',fontWeight:950,fontSize:'clamp(17px,2vw,23px)',color:'#dcecf1'}}>THE ABILITY TO TRANSPORT A COMMAND IS NOT AUTHORITY TO EXECUTE THE CONSEQUENCE.</div>
      </section>

      <section style={{marginTop:26,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12}}>
        {[['DATA CAN BE RIGHT','The sensor may be accurate. The record may be owner-controlled. The analytics may correctly identify the condition. That establishes evidence—not automatic execution authority.'],['GOVERNANCE CAN SAY HOLD','TA-14 evaluates the proposed consequence at the point where information is about to become action: ALLOW · HOLD · DENY · ESCALATE.'],['THE NETWORK CARRIES CONSEQUENCES','Overrides, setpoints, resets, shutdowns, equipment starts, and ventilation changes can move across the OT network toward physical reality.'],['EXECUTION CREATES A NEW REALITY','Once execution occurs, the outcome becomes a new state and a new record. A later consequence requires revalidation.']].map(([t,d],i)=><article key={t} style={{padding:24,...card(i===1)}}><div style={{fontSize:11,fontWeight:1000,color:i===1?'#6cf0b8':'#69dcff'}}>0{i+1}</div><h3 style={{fontSize:20,margin:'10px 0'}}>{t}</h3><p style={{margin:0,color:'#96acb7',lineHeight:1.65}}>{d}</p></article>)}
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',...card()}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#6cf0b8'}}>THE TA-14 CHAIN</div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginTop:20}}>{['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'].map((x,i)=><span key={x} style={{display:'contents'}}><b style={{padding:'10px 12px',borderRadius:10,border:x==='EXECUTION'?'1px solid rgba(108,240,184,.5)':'1px solid rgba(105,220,255,.13)',background:x==='EXECUTION'?'rgba(108,240,184,.1)':'rgba(2,9,15,.55)',fontSize:11,color:x==='EXECUTION'?'#6cf0b8':'#c9dbe2'}}>{x}</b>{i<7&&<span style={{color:'#4e7181'}}>→</span>}</span>)}</div>
        <div style={{marginTop:22,fontSize:'clamp(20px,3vw,31px)',fontWeight:1000}}>NEW REALITY → NEW RECORD → NEW DETERMINATION</div>
        <p style={{color:'#91a8b5',lineHeight:1.7}}>No permanent permission. No silent inheritance of authority. No assumption that yesterday&apos;s approval authorizes today&apos;s consequence.</p>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',...card()}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.18em',color:'#69dcff'}}>THE PUBLIC CONVERSATION THAT EXPOSED THE SEAM</div>
        <h2 style={{fontSize:'clamp(30px,4vw,48px)',letterSpacing:'-.04em',margin:'12px 0 24px'}}>Three different questions. One accountable chain.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12}}>
          {[['KEITH L. / COPPERTREE ANALYTICS','DATA SOVEREIGNTY','Who owns and controls the operational data upon which intelligent-building decisions depend?'],['TA-14 AUTHORITY','EXECUTION GOVERNANCE','Does the proposed consequence have sufficient admissibility, authority, and standing to become reality now?'],['OPTIGO NETWORKS','NETWORK VISIBILITY','Where can commands moving between information and physical consequence be observed—and where could an execution determination meet the network path?']].map(([who,t,q],i)=><div key={who} style={{padding:22,...card(i===1)}}><div style={{fontSize:10,fontWeight:950,letterSpacing:'.12em',color:i===1?'#6cf0b8':'#69dcff'}}>{who}</div><h3 style={{margin:'10px 0',fontSize:20}}>{t}</h3><p style={{margin:0,color:'#9bb0ba',lineHeight:1.65}}>{q}</p></div>)}
        </div>
        <p style={{margin:'22px 0 0',fontSize:12,lineHeight:1.65,color:'#6f8996'}}>This showroom is TA-14 Authority&apos;s architectural interpretation of a public industry conversation. Reference to Keith L., CopperTree Analytics, or Optigo Networks does not represent endorsement, partnership, adoption, certification, or technical integration unless separately established by those parties.</p>
      </section>

      <section style={{marginTop:26,padding:'clamp(48px,7vw,88px) clamp(24px,5vw,54px)',textAlign:'center',border:'1px solid rgba(108,240,184,.28)',borderRadius:30,background:'radial-gradient(circle at 50% 20%,rgba(108,240,184,.11),transparent 42%),rgba(2,9,15,.86)'}}>
        <div style={{fontSize:'clamp(27px,5vw,58px)',fontWeight:1000,letterSpacing:'-.045em',lineHeight:1.05}}>THE NETWORK CAN CARRY THE COMMAND.</div>
        <div style={{fontSize:'clamp(27px,5vw,58px)',fontWeight:1000,letterSpacing:'-.045em',lineHeight:1.05,marginTop:10}}>THE DATA CAN SUPPORT THE COMMAND.</div>
        <p style={{fontSize:'clamp(18px,2.6vw,28px)',maxWidth:900,margin:'28px auto',color:'#9db3bd',lineHeight:1.5}}>Neither fact establishes that the consequence may become reality.</p>
        <div style={{fontSize:'clamp(35px,6vw,72px)',fontWeight:1000,letterSpacing:'-.055em',lineHeight:1,color:'#6cf0b8'}}>THAT DETERMINATION EXISTS AT THE CONSEQUENCE BOUNDARY.</div>
        <div style={{marginTop:32,fontWeight:950,letterSpacing:'.12em',color:'#d8e9ee'}}>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</div>
        <div style={{display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap',marginTop:30}}>
          <button onClick={()=>{setEvidence('current');setAuthority('expired');setScope('authorized');setNetwork('observable');window.scrollTo({top:500,behavior:'smooth'})}} style={{cursor:'pointer',padding:'13px 18px',borderRadius:999,border:'1px solid rgba(108,240,184,.4)',background:'rgba(108,240,184,.1)',color:'#dffff0',fontWeight:950}}>RUN ANOTHER CONSEQUENCE</button>
          <Link href="/registry/ta-14-admissible-execution-architecture" style={{padding:'13px 18px',borderRadius:999,border:'1px solid rgba(105,220,255,.18)',color:'#bfe9f3',textDecoration:'none',fontWeight:950}}>EXPLORE TA-14</Link>
        </div>
      </section>
    </div>
  </main>;
}
