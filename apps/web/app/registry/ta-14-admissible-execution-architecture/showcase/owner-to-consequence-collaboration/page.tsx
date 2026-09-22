'use client';

import Link from 'next/link';

const partners = [
  ['01','OWNER / ASSET LEADERSHIP','Asset Leadership Network · Michael Bordenaro','Starts with owner need, business-process requirements, organizational adoption, and the standards context that lets leaders require a repeatable process without prescribing one software stack.'],
  ['02','SEMANTIC BUILDING CONTEXT','ONUMA · Kimon Onuma','Supplies shared meaning through RDF/Turtle, persistent identity, semantic relationships, and API interaction so independently governed systems can point to and work with the same asset reality.'],
  ['03','ASSET DATA READINESS','Fixed Asset Health Assessment · Angela Bolton','Reconciles field, system, and human-supplied asset data: is it complete, does it match reality, is it reconciled, and is there authority behind it before downstream use?'],
  ['04','CONSEQUENCE GOVERNANCE','TA-14 · Greggory Don Butler','At the final boundary, tests whether a proposed consequence has sufficient admissibility, applicable authority, and established standing to become reality now.'],
];

const sop = [
  ['OWNER NEED','What outcome, obligation, condition, or decision does the owner need governed?'],
  ['SHARED MEANING','RDF/Turtle and semantic relationships establish what the assets and relationships mean.'],
  ['PERSISTENT IDENTITY','Independent systems maintain shared reference to the same governed object.'],
  ['LIVE INTERACTION','APIs allow bounded two-way interaction without requiring one closed platform.'],
  ['DATA VALIDATION','Asset information is checked, reconciled, and made fit for its stated downstream purpose.'],
  ['PROPOSED CONSEQUENCE','The exact action, change, decision, or downstream use is made explicit.'],
  ['CONSEQUENCE BOUNDARY','TA-14 evaluates admissibility, authority, standing, and current context.'],
  ['OUTCOME + REVALIDATION','ALLOW · HOLD · DENY · ESCALATE. Material change requires revalidation.'],
];

export default function OwnerToConsequenceCollaboration(){
  return <main style={{minHeight:'100vh',padding:'48px 20px 96px',background:'radial-gradient(circle at 50% -10%,rgba(90,225,255,.18),transparent 34%),radial-gradient(circle at 10% 55%,rgba(127,240,189,.08),transparent 28%),linear-gradient(180deg,#02070d,#06111c 48%,#02070d)',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{maxWidth:1220,margin:'0 auto'}}>
      <nav style={{display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',paddingBottom:20,borderBottom:'1px solid rgba(113,231,255,.14)'}}>
        <Link href="/registry/ta-14-admissible-execution-architecture/showcase/cross-architecture-revalidation" style={{color:'#9edff0',textDecoration:'none',fontWeight:850}}>← Flagship interoperability showroom</Link>
        <Link href="/registry/ta-14-admissible-execution-architecture/showcase/governed-connection-profile" style={{color:'#91a8b7',textDecoration:'none'}}>Governed connection profile →</Link>
      </nav>

      <section style={{marginTop:26,padding:'clamp(36px,6vw,72px)',border:'1px solid rgba(113,231,255,.23)',borderRadius:30,background:'linear-gradient(145deg,rgba(8,37,54,.96),rgba(5,14,24,.98) 58%,rgba(21,31,57,.94))',boxShadow:'0 34px 100px rgba(0,0,0,.42)'}}>
        <div style={{fontSize:11,fontWeight:950,letterSpacing:'.2em',color:'#78e8ff'}}>PUBLIC TECHNICAL SHOWROOM · PROPOSED WORKING COLLABORATION</div>
        <h1 style={{fontSize:'clamp(44px,7vw,88px)',lineHeight:.94,letterSpacing:'-.055em',margin:'20px 0 22px'}}>FROM OWNER NEED<br/><span style={{color:'#7ff0bd'}}>TO GOVERNED CONSEQUENCE.</span></h1>
        <p style={{fontSize:'clamp(18px,2.2vw,26px)',lineHeight:1.5,maxWidth:980,color:'#b8cad5',margin:0}}>A proposed vendor-neutral collaboration showing how asset leadership, semantic building context, asset-data validation, and consequence governance can remain independently owned while operating as one reconstructable process.</p>
        <div style={{marginTop:28,padding:'18px 20px',borderLeft:'3px solid #7ff0bd',background:'rgba(127,240,189,.045)',fontSize:'clamp(18px,2.2vw,24px)',fontWeight:900}}>The collaboration is the interface between the architectures — not a merger of them.</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(242,204,104,.25)',borderRadius:26,background:'linear-gradient(135deg,rgba(70,51,13,.22),rgba(5,17,28,.94))'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>FOUR INDEPENDENT ROLES · ONE SHARED PROCESS</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 24px'}}>Nobody has to become somebody else.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12}}>{partners.map(([n,k,t,d],i)=><article key={n} style={{padding:22,borderRadius:17,border:i===3?'1px solid rgba(127,240,189,.28)':'1px solid rgba(113,231,255,.14)',background:i===3?'rgba(127,240,189,.045)':'rgba(2,10,17,.5)'}}><div style={{fontSize:26,fontWeight:950,color:i===3?'#7ff0bd':'#58cfe8'}}>{n}</div><div style={{marginTop:12,fontSize:11,fontWeight:950,letterSpacing:'.1em',color:'#8fa7b5'}}>{k}</div><h3 style={{fontSize:19,margin:'7px 0 10px'}}>{t}</h3><p style={{margin:0,color:'#b7c7cf',lineHeight:1.65,fontSize:14}}>{d}</p></article>)}</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(127,240,189,.23)',borderRadius:26,background:'linear-gradient(135deg,rgba(16,68,54,.2),rgba(5,17,28,.94))'}}>
        <div style={{color:'#7ff0bd',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>THE OWNER-TO-CONSEQUENCE SOP · CANDIDATE SHARED INTERFACE</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 16px'}}>One sequence. Multiple competent systems.</h2>
        <p style={{maxWidth:980,color:'#b8cad5',lineHeight:1.7,fontSize:17}}>The owner can require the governed sequence without dictating the implementation inside every step. Each participating architecture preserves its own methods, evidence, authority, and intellectual property.</p>
        <div style={{display:'grid',gap:9,marginTop:24}}>{sop.map(([k,v],i)=><div key={k} style={{display:'grid',gridTemplateColumns:'52px minmax(190px,280px) 1fr',gap:14,padding:'17px 18px',border:'1px solid rgba(127,240,189,.12)',borderRadius:14,background:'rgba(2,10,17,.48)',alignItems:'start'}}><b style={{color:'#7ff0bd',fontSize:18}}>{String(i+1).padStart(2,'0')}</b><strong style={{fontSize:12,letterSpacing:'.07em',color:'#e7f6ee'}}>{k}</strong><span style={{fontSize:14,lineHeight:1.55,color:'#b8c8c1'}}>{v}</span></div>)}</div>
        <div style={{marginTop:22,padding:'18px 20px',border:'1px solid rgba(113,231,255,.18)',borderRadius:14,background:'rgba(113,231,255,.035)',fontSize:'clamp(18px,2.2vw,24px)',fontWeight:950}}>The technologies may change. The governed process does not.</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:26,background:'linear-gradient(135deg,rgba(8,39,58,.8),rgba(5,17,28,.94))'}}>
        <div style={{color:'#78e8ff',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>RUN THE COLLABORATION · SIMPLE EXAMPLE</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 18px'}}>AHU-17 needs a consequential decision.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(215px,1fr))',gap:10}}>
          {[
            ['OWNER','Maintain acceptable indoor conditions without creating an unmanaged outdoor-air consequence.'],
            ['ONUMA / CONTEXT','AHU-17 is persistently identified; its zone, relationships, live state, and proposed ventilation change are addressable.'],
            ['ANGELA / DATA','Relevant asset records are reconciled against field/system reality and checked for completeness and authority for downstream use.'],
            ['TA-14 / BOUNDARY','The proposed ventilation consequence is evaluated against admissible evidence, applicable authority, standing, and current conditions.'],
          ].map(([k,v])=><div key={k} style={{padding:20,borderRadius:15,border:'1px solid rgba(113,231,255,.14)',background:'rgba(2,10,17,.5)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.08em',color:'#78e8ff'}}>{k}</div><p style={{margin:'9px 0 0',color:'#c1d1d9',lineHeight:1.6}}>{v}</p></div>)}
        </div>
        <div style={{marginTop:18,padding:'22px',border:'1px solid rgba(242,204,104,.28)',borderRadius:16,background:'rgba(242,204,104,.045)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.12em',color:'#f2cc68'}}>MATERIAL CHANGE</div><p style={{fontSize:18,lineHeight:1.6,color:'#e5dfca',margin:'8px 0 0'}}>Outdoor PM2.5 rises materially after the earlier state was evaluated. The old decision does not silently carry forward.</p></div>
        <div style={{marginTop:14,textAlign:'center',fontSize:'clamp(20px,3vw,30px)',fontWeight:950,color:'#7ff0bd'}}>REVALIDATE → ALLOW · HOLD · DENY · ESCALATE</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(242,204,104,.24)',borderRadius:26,background:'linear-gradient(135deg,rgba(65,48,13,.2),rgba(5,17,28,.94))'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>WHAT THURSDAY COULD SHOW</div>
        <h2 style={{fontSize:'clamp(30px,4.6vw,52px)',letterSpacing:'-.04em',margin:'12px 0 22px'}}>Not four presentations. One end-to-end demonstration.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>{[
          ['01 · MIKE','Begin with the owner requirement and why a repeatable process is needed.'],
          ['02 · KIMON','Expose the same asset through semantic context, persistent identity, and live interaction.'],
          ['03 · ANGELA','Show how the asset information is reconciled and prepared for trustworthy downstream use.'],
          ['04 · GREGGORY','Carry an explicit proposed consequence to the TA-14 boundary and issue the bounded determination.'],
          ['05 · TOGETHER','Change a material condition and demonstrate why the process requires revalidation rather than inherited permission.'],
        ].map(([k,v])=><article key={k} style={{padding:20,borderRadius:15,border:'1px solid rgba(242,204,104,.13)',background:'rgba(2,10,17,.5)'}}><b style={{color:'#f2cc68',fontSize:12,letterSpacing:'.07em'}}>{k}</b><p style={{margin:'9px 0 0',color:'#c9c5b8',lineHeight:1.6}}>{v}</p></article>)}</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(127,240,189,.22)',borderRadius:26,background:'linear-gradient(135deg,rgba(16,68,54,.18),rgba(5,17,28,.94))'}}>
        <div style={{color:'#7ff0bd',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>BOUNDED FIRST MANDATE</div>
        <h2 style={{fontSize:'clamp(30px,4.6vw,52px)',letterSpacing:'-.04em',lineHeight:1.05,margin:'12px 0 16px'}}>Develop. Demonstrate. Document.</h2>
        <p style={{fontSize:'clamp(19px,2.4vw,27px)',lineHeight:1.5,maxWidth:1000,color:'#d8e8e0'}}>Develop, demonstrate, and document a vendor-neutral Owner-to-Consequence Standard Operating Procedure for trusted asset data and governed action.</p>
        <div style={{marginTop:22,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10}}>{[
          ['NOW','ALN Thursday discussion + workshop'],
          ['NEXT','PAE operating-building pathway'],
          ['DOCUMENT','Shared SOP + reference implementation'],
          ['TARGET','Meaningful October 20 demonstration'],
        ].map(([k,v])=><div key={k} style={{padding:18,borderRadius:14,border:'1px solid rgba(127,240,189,.13)',background:'rgba(2,10,17,.48)'}}><small style={{fontWeight:950,letterSpacing:'.09em',color:'#7ff0bd'}}>{k}</small><div style={{marginTop:8,fontWeight:850,color:'#dcebe4'}}>{v}</div></div>)}</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(26px,4vw,40px)',border:'1px solid rgba(113,231,255,.16)',borderRadius:24,background:'rgba(7,18,30,.76)'}}>
        <div style={{color:'#78e8ff',fontSize:11,fontWeight:950,letterSpacing:'.16em'}}>BOUNDARIES · PROPOSAL, NOT PRE-DECLARED PARTNERSHIP</div>
        <div style={{display:'grid',gap:10,marginTop:18}}>{[
          'This surface proposes a working collaboration; it does not represent a signed partnership, joint venture, endorsement, certification, or transfer of authority.',
          'ALN, ONUMA, Fixed Asset Health Assessment, and TA-14 remain independently owned and governed unless separately agreed in writing.',
          'Each party retains responsibility for its own methods, evidence, systems, claims, intellectual property, and authority.',
          'The shared object is the interface and repeatable process to be tested. Demonstration outcomes are not pre-declared.',
          'PAE work remains prospective and subject to PAE access, scope, confidentiality, operational authority, and publication boundaries.',
        ].map((x,i)=><div key={x} style={{display:'grid',gridTemplateColumns:'32px 1fr',gap:10,padding:'14px 16px',borderLeft:'3px solid rgba(113,231,255,.65)',background:'rgba(113,231,255,.025)',color:'#aebfc8',lineHeight:1.6}}><b style={{color:'#78e8ff'}}>{String(i+1).padStart(2,'0')}</b><span>{x}</span></div>)}</div>
      </section>

      <section style={{marginTop:26,padding:'40px 26px',textAlign:'center',border:'1px solid rgba(127,240,189,.2)',borderRadius:24,background:'linear-gradient(135deg,rgba(17,64,52,.18),rgba(7,18,30,.82))'}}>
        <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#829b90'}}>THE QUESTION FOR THE FOUR PARTICIPANTS</div>
        <div style={{marginTop:13,fontSize:'clamp(25px,4vw,45px)',fontWeight:950,letterSpacing:'-.035em'}}>Is this the shared process we are actually building?</div>
        <p style={{maxWidth:820,margin:'16px auto 0',color:'#9db1a8',lineHeight:1.7}}>If the answer survives the demonstrations, the parties can decide what the collaboration should become. The architecture does not require that answer in advance.</p>
      </section>
    </div>
  </main>;
}
