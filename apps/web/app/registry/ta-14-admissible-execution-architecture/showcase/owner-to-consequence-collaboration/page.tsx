'use client';

import Link from 'next/link';
import { useState } from 'react';

const partners = [
  ['01','OWNER / ASSET LEADERSHIP','Asset Leadership Network · Michael Bordenaro','Starts with owner need, business-process requirements, organizational adoption, and the standards context that lets leaders require a repeatable process without prescribing one software stack.'],
  ['02','SEMANTIC BUILDING CONTEXT','ONUMA · Kimon Onuma','Supplies shared meaning through RDF/Turtle, persistent identity, semantic relationships, and API interaction so independently governed systems can point to and work with the same asset reality.'],
  ['03','ASSET DATA READINESS','Fixed Asset Health Assessment · Angela Bolton','Reconciles field, system, and human-supplied asset data: is it complete, does it match reality, is it reconciled, and is there authority behind it before downstream use?'],
  ['04','INTEGRITY + CONSEQUENCE GOVERNANCE','TA-14 · Greggory Don Butler','Spans the process from attributable environmental and mechanical reality through continuous integrity records, evidence formation, consequence governance, execution verification, outcome, and changed-context revalidation. At the consequence boundary, TA-14 asks whether the proposition has sufficient ADMISSIBLE EVIDENCE, APPLICABLE AUTHORITY, and ESTABLISHED STANDING to become REALITY NOW.'],
];

const sop = [
  ['OWNER NEED','What outcome, obligation, condition, or decision does the owner need governed?'],
  ['SHARED MEANING','RDF/Turtle and semantic relationships establish what the assets and relationships mean.'],
  ['PERSISTENT IDENTITY','Independent systems maintain shared reference to the same governed object.'],
  ['LIVE INTERACTION','APIs allow bounded two-way interaction without requiring one closed platform.'],
  ['DATA VALIDATION','Asset information is checked, reconciled, and made fit for its stated downstream purpose.'],
  ['PROPOSED CONSEQUENCE','The exact action, change, decision, or downstream use is made explicit.'],
  ['CONSEQUENCE BOUNDARY','TA-14 determines whether the proposed consequence has sufficient ADMISSIBLE EVIDENCE, APPLICABLE AUTHORITY, and ESTABLISHED STANDING to become REALITY NOW.'],
  ['DETERMINATION → EXECUTION','ALLOW · HOLD · DENY · ESCALATE is recorded. ALLOW is not an actuator command; execution remains with the competent authorized system.'],
  ['OUTCOME + REVALIDATION','Record what actually happened. Material change does not inherit permission; it requires revalidation and a new determination.'],
];

export default function OwnerToConsequenceCollaboration(){
  const [ahuState,setAhuState] = useState<'baseline'|'unchanged'|'changed'>('baseline');
  const [graphLayers,setGraphLayers] = useState({re1:true,semantic:true,fixed:true,ta14:true});
  const activeGraphCount = Object.values(graphLayers).filter(Boolean).length;
  const graphSummary = !graphLayers.re1
    ? 'Persistent building identity is no longer available as the common anchor. Companion knowledge may still exist, but this demonstration no longer has the native RE1 object reference that binds the layers to the same building thing.'
    : !graphLayers.semantic && !graphLayers.fixed && !graphLayers.ta14
      ? 'The native RE1 building objects remain. Shared engineering meaning, asset-readiness context, and consequence-governance context have been removed from the view.'
      : !graphLayers.semantic
        ? 'The building objects remain, but much of the explicit shared engineering meaning and relationship context is absent from the composed view.'
        : !graphLayers.ta14
          ? 'The building and semantic context remain visible, but the explicit consequence / authority determination layer is absent. Connection and understanding remain; permission does not appear by implication.'
          : !graphLayers.fixed
            ? 'The building and governance context remain visible, but the experimental asset-information readiness layer is absent.'
            : 'All four independently governed layers are visible around the same persistent building objects. No layer is merged into another.';
  const ahuResult = ahuState === 'changed'
    ? {label:'PRIOR DETERMINATION NO LONGER CARRIES STANDING',detail:'Outdoor PM2.5 changed materially. The earlier state remains in the record, but permission is not inherited. Revalidation is required before a new determination can govern execution.'}
    : ahuState === 'unchanged'
      ? {label:'CONDITIONS REMAIN MATERIALLY CONSISTENT',detail:'No material context change has been introduced in this demonstration. The prior record remains attributable; the consequence may continue through the governed sequence subject to the same bounded proposition.'}
      : {label:'SELECT A CURRENT-STATE CONDITION',detail:'Run the same AHU-17 object through two different present-state conditions. The earlier record is preserved in both paths.'};
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

      <section style={{marginTop:26,padding:'clamp(24px,4vw,36px)',border:'1px solid rgba(242,204,104,.26)',borderRadius:24,background:'linear-gradient(135deg,rgba(70,51,13,.18),rgba(5,17,28,.94))'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>COMPANION LIFECYCLE VIEW · FIXED ASSET CONSULTANT</div>
        <h2 style={{fontSize:'clamp(28px,4.2vw,48px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 14px'}}>See the collaboration across the full asset lifecycle.</h2>
        <p style={{maxWidth:960,color:'#c9c1aa',lineHeight:1.7,fontSize:16}}>Angela Bolton's Design to Disposal page maps the independently owned systems across the fixed-asset lifecycle, including RE1, CNS/CP, TA-14, Fixed Asset Health Assessment, ERP, capital planning, and the Asset Leadership Network.</p>
        <a href="https://fixedassetconsultant.com/design-to-disposal/" target="_blank" rel="noreferrer" style={{display:'inline-flex',marginTop:18,padding:'13px 17px',borderRadius:11,border:'1px solid rgba(242,204,104,.48)',background:'rgba(242,204,104,.1)',color:'#fff0bd',textDecoration:'none',fontWeight:950,letterSpacing:'.04em'}}>OPEN DESIGN TO DISPOSAL →</a>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(242,204,104,.25)',borderRadius:26,background:'linear-gradient(135deg,rgba(70,51,13,.22),rgba(5,17,28,.94))'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>FOUR INDEPENDENT ROLES · ONE SHARED PROCESS</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 24px'}}>Nobody has to become somebody else.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12}}>{partners.map(([n,k,t,d],i)=><article key={n} style={{padding:22,borderRadius:17,border:i===3?'1px solid rgba(127,240,189,.28)':'1px solid rgba(113,231,255,.14)',background:i===3?'rgba(127,240,189,.045)':'rgba(2,10,17,.5)'}}><div style={{fontSize:26,fontWeight:950,color:i===3?'#7ff0bd':'#58cfe8'}}>{n}</div><div style={{marginTop:12,fontSize:11,fontWeight:950,letterSpacing:'.1em',color:'#8fa7b5'}}>{k}</div><h3 style={{fontSize:19,margin:'7px 0 10px'}}>{t}</h3><p style={{margin:0,color:'#b7c7cf',lineHeight:1.65,fontSize:14}}>{d}</p></article>)}</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(113,231,255,.24)',borderRadius:26,background:'linear-gradient(135deg,rgba(8,45,62,.82),rgba(5,17,28,.95))'}}>
        <div style={{color:'#78e8ff',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>TA-14 · CROSS-CUTTING INTEGRITY + CONSEQUENCE LAYER</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 16px'}}>TA-14 does not begin at the final gate.</h2>
        <p style={{maxWidth:1000,color:'#c1d3dc',lineHeight:1.7,fontSize:17}}>Within this proposed collaboration, TA-14 can carry attributable environmental and mechanical reality forward into evidence, governance, execution, outcome, and revalidation. Atmospheric Integrity Records provide a longitudinal record rather than a single alarm or snapshot.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:22}}>{[
          ['01 · REALITY CAPTURE','Exterior and interior atmospheric nodes establish environmental context. Mechanical signals can include vibration, thermal behavior, sound, amp draw, heat, and other attributable machine-state evidence.'],
          ['02 · CONTINUOUS INTEGRITY RECORD','Atmospheric and mechanical observations remain tied to persistent assets, locations, time, provenance, and the conditions under which they were observed.'],
          ['03 · DRIFT VISIBILITY','Longitudinal records can expose developing environmental or mechanical drift before an obvious failure where the evidence supports that conclusion; the record does not promise a universal prediction interval.'],
          ['04 · EVIDENCE FORMATION','Observed reality becomes candidate evidence for a specific bounded proposition rather than being treated as self-authorizing telemetry.'],
          ['05 · CONSEQUENCE GOVERNANCE','TA-14 asks whether the proposed consequence has sufficient ADMISSIBLE EVIDENCE, APPLICABLE AUTHORITY, and ESTABLISHED STANDING to become REALITY NOW.'],
          ['06 · EXECUTION + VERIFICATION','A bounded determination remains distinct from actuation. Applicable TA-14 execution, evidence, verification, and receipt mechanisms preserve what was authorized, what executed, and what can be reconstructed.'],
          ['07 · OUTCOME RECORD','Exterior, interior, and mechanical state can be observed after intervention so the actual outcome becomes part of the continuing record.'],
          ['08 · NEW BASELINE + REVALIDATION','The outcome can establish a new attributable baseline. Material change does not inherit permission; the changed reality requires revalidation and a new determination.'],
        ].map(([k,v])=><article key={k} style={{padding:20,borderRadius:15,border:'1px solid rgba(113,231,255,.14)',background:'rgba(2,10,17,.5)'}}><b style={{color:'#78e8ff',fontSize:12,letterSpacing:'.07em'}}>{k}</b><p style={{margin:'9px 0 0',color:'#c1d1d9',lineHeight:1.6,fontSize:14}}>{v}</p></article>)}</div>
        <div style={{marginTop:18,padding:'20px',border:'1px solid rgba(127,240,189,.22)',borderRadius:15,background:'rgba(127,240,189,.04)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.13em',color:'#7ff0bd'}}>ONE CONTINUOUS FUNCTION</div><p style={{margin:'9px 0 0',fontSize:'clamp(17px,2vw,22px)',fontWeight:900,lineHeight:1.55,color:'#dceee6'}}>ENVIRONMENTAL + MECHANICAL REALITY → CONTINUOUS RECORD → DRIFT / DEVIATION → EVIDENCE → GOVERNANCE → EXECUTION / VERIFICATION → OUTCOME → REVALIDATION</p></div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(127,240,189,.23)',borderRadius:26,background:'linear-gradient(135deg,rgba(16,68,54,.2),rgba(5,17,28,.94))'}}>
        <div style={{color:'#7ff0bd',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>THE OWNER-TO-CONSEQUENCE SOP · CANDIDATE SHARED INTERFACE</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 16px'}}>One sequence. Multiple competent systems.</h2>
        <p style={{maxWidth:980,color:'#b8cad5',lineHeight:1.7,fontSize:17}}>The owner can require the governed sequence without dictating the implementation inside every step. Each participating architecture preserves its own methods, evidence, authority, and intellectual property.</p>
        <div style={{display:'grid',gap:9,marginTop:24}}>{sop.map(([k,v],i)=><div key={k} style={{display:'grid',gridTemplateColumns:'52px minmax(190px,280px) 1fr',gap:14,padding:'17px 18px',border:'1px solid rgba(127,240,189,.12)',borderRadius:14,background:'rgba(2,10,17,.48)',alignItems:'start'}}><b style={{color:'#7ff0bd',fontSize:18}}>{String(i+1).padStart(2,'0')}</b><strong style={{fontSize:12,letterSpacing:'.07em',color:'#e7f6ee'}}>{k}</strong><span style={{fontSize:14,lineHeight:1.55,color:'#b8c8c1'}}>{v}</span></div>)}</div>
        <div style={{marginTop:22,padding:'18px 20px',border:'1px solid rgba(113,231,255,.18)',borderRadius:14,background:'rgba(113,231,255,.035)',fontSize:'clamp(18px,2.2vw,24px)',fontWeight:950}}>The technologies may change. The governed process does not.</div>
        <div style={{marginTop:14,padding:'20px',border:'1px solid rgba(242,204,104,.24)',borderRadius:14,background:'rgba(242,204,104,.04)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.14em',color:'#f2cc68'}}>THE RECORD PERSISTS ACROSS THE ENTIRE SEQUENCE</div><p style={{margin:'10px 0 0',lineHeight:1.65,color:'#d9d0b4'}}>Owner Need → Evidence → Validation → Proposition → Determination → Execution → Outcome → Revalidation</p><p style={{margin:'10px 0 0',lineHeight:1.65,color:'#bdb7a4'}}>A later state does not erase an earlier state. It supersedes it with an attributable record. HOLD remains part of the record after ALLOW. An expired determination remains part of the record after revalidation. Negative results remain part of the record after subsequent success.</p></div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(113,231,255,.22)',borderRadius:26,background:'linear-gradient(135deg,rgba(8,39,58,.8),rgba(5,17,28,.94))'}}>
        <div style={{color:'#78e8ff',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>RUN THE COLLABORATION · SIMPLE EXAMPLE</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 18px'}}>AHU-17 needs a consequential decision.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(215px,1fr))',gap:10}}>
          {[
            ['OWNER','Maintain acceptable indoor conditions without creating an unmanaged outdoor-air consequence.'],
            ['ONUMA / CONTEXT','AHU-17 is persistently identified; its zone, relationships, live state, and proposed ventilation change are addressable.'],
            ['ANGELA / DATA','Relevant asset records are reconciled against field/system reality and checked for completeness and authority for downstream use.'],
            ['TA-14 / INTEGRITY + BOUNDARY','Exterior atmosphere, interior atmosphere, and attributable mechanical condition can remain part of the continuing integrity record. That record can expose changed conditions and support the bounded test of whether the proposed ventilation consequence has sufficient ADMISSIBLE EVIDENCE, APPLICABLE AUTHORITY, and ESTABLISHED STANDING to become REALITY NOW.'],
          ].map(([k,v])=><div key={k} style={{padding:20,borderRadius:15,border:'1px solid rgba(113,231,255,.14)',background:'rgba(2,10,17,.5)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.08em',color:'#78e8ff'}}>{k}</div><p style={{margin:'9px 0 0',color:'#c1d1d9',lineHeight:1.6}}>{v}</p></div>)}
        </div>
        <div style={{marginTop:18,padding:'22px',border:'1px solid rgba(242,204,104,.28)',borderRadius:16,background:'rgba(242,204,104,.045)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.12em',color:'#f2cc68'}}>CHANGE REALITY · PRESERVE THE RECORD</div><p style={{fontSize:18,lineHeight:1.6,color:'#e5dfca',margin:'8px 0 16px'}}>Choose the current condition for the same persistently identified AHU-17. The demonstration changes the present state; it does not rewrite the earlier determination.</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button onClick={()=>setAhuState('unchanged')} style={{cursor:'pointer',padding:'13px 16px',borderRadius:10,border:'1px solid rgba(127,240,189,.45)',background:ahuState==='unchanged'?'rgba(127,240,189,.16)':'rgba(2,10,17,.6)',color:'#dff8eb',fontWeight:900}}>OUTDOOR PM2.5 UNCHANGED</button><button onClick={()=>setAhuState('changed')} style={{cursor:'pointer',padding:'13px 16px',borderRadius:10,border:'1px solid rgba(242,204,104,.5)',background:ahuState==='changed'?'rgba(242,204,104,.16)':'rgba(2,10,17,.6)',color:'#f6e8bd',fontWeight:900}}>OUTDOOR PM2.5 RISES</button></div></div>
        <div aria-live="polite" style={{marginTop:14,padding:'22px',border:'1px solid rgba(127,240,189,.22)',borderRadius:16,background:'rgba(127,240,189,.04)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.12em',color:ahuState==='changed'?'#f2cc68':'#7ff0bd'}}>{ahuResult.label}</div><p style={{margin:'9px 0 0',color:'#c6d7cf',lineHeight:1.65}}>{ahuResult.detail}</p>{ahuState==='changed'&&<div style={{marginTop:13,fontSize:'clamp(19px,2.7vw,28px)',fontWeight:950,color:'#7ff0bd'}}>REVALIDATE → ALLOW · HOLD · DENY · ESCALATE</div>}</div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(177,135,255,.25)',borderRadius:26,background:'linear-gradient(135deg,rgba(70,39,105,.22),rgba(5,17,28,.95))'}}>
        <div style={{color:'#c8a7ff',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>EXPERIMENTAL GRAPH-OF-GRAPHS · LIVE WORKING SURFACE</div>
        <h2 style={{fontSize:'clamp(31px,4.8vw,55px)',letterSpacing:'-.04em',lineHeight:1.04,margin:'12px 0 16px'}}>Different graphs. Same persistent thing.<br/><span style={{color:'#e7dcff'}}>Building it while examining it.</span></h2>
        <p style={{maxWidth:1000,color:'#c9bed8',lineHeight:1.7,fontSize:17}}>ONUMA independently extended its Semantic Bridge Explorer to display TA-14 consequence governance and Fixed Asset information readiness as explicitly experimental layers. A companion Turtle graph was then created beside — not inside — the original RE1 building graph.</p>
        <div style={{marginTop:22,padding:'20px',border:'1px solid rgba(177,135,255,.22)',borderRadius:15,background:'rgba(177,135,255,.045)',fontSize:'clamp(17px,2vw,22px)',fontWeight:900,lineHeight:1.55}}>RE1 BUILDING GRAPH → PERSISTENT ASSET IDENTITY ← EXPERIMENTAL GOVERNANCE GRAPH</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginTop:18}}>{[
          ['RE1 / ONUMA','The original building Turtle remains independently owned and unchanged. It supplies persistent building objects, semantic relationships, and shared reference.'],
          ['FIXED ASSET · EXPERIMENTAL','Asset-information readiness and validation are represented as an experimental companion layer without redefining the source building graph.'],
          ['TA-14 · EXPERIMENTAL','Current reality, provenance, admissible evidence, applicable authority, established standing, proposed consequence, and bounded determination attach around the persistent object without becoming an execution command.'],
          ['BOUNDARY','Prototype only. Not production integration. Not formal interoperability. Not a TA-14 or Fixed Asset ontology definition.'],
        ].map(([k,v])=><article key={k} style={{padding:20,borderRadius:15,border:'1px solid rgba(177,135,255,.14)',background:'rgba(2,10,17,.5)'}}><b style={{color:'#c8a7ff',fontSize:12,letterSpacing:'.07em'}}>{k}</b><p style={{margin:'9px 0 0',color:'#c9c2d1',lineHeight:1.6,fontSize:14}}>{v}</p></article>)}</div>
        <div style={{marginTop:22,padding:'22px',border:'1px solid rgba(113,231,255,.2)',borderRadius:16,background:'rgba(6,20,31,.72)'}}>
          <div style={{fontSize:11,fontWeight:950,letterSpacing:'.13em',color:'#78e8ff'}}>INTERACTIVE GRAPH-OF-GRAPHS VIEW · TURN LAYERS ON AND OFF</div>
          <h3 style={{fontSize:'clamp(22px,3vw,34px)',margin:'10px 0 10px'}}>What survives when a graph disappears?</h3>
          <p style={{margin:'0 0 16px',color:'#b8cad5',lineHeight:1.65}}>This is the architectural point the live exercise makes visible: the composed application can change while independently governed sources remain distinct. Toggle a layer to inspect what disappears from the combined view and what remains attributable to the persistent building object.</p>
          <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
            {[
              ['re1','RE1 / ONUMA'],['semantic','SEMANTIC / 223'],['fixed','FIXED ASSET'],['ta14','TA-14 GOVERNANCE'],
            ].map(([key,label])=><button key={key} onClick={()=>setGraphLayers(s=>({...s,[key]:!s[key as keyof typeof s]}))} style={{cursor:'pointer',padding:'11px 13px',borderRadius:10,border:'1px solid rgba(113,231,255,.35)',background:graphLayers[key as keyof typeof graphLayers]?'rgba(113,231,255,.14)':'rgba(2,10,17,.65)',color:graphLayers[key as keyof typeof graphLayers]?'#dff8ff':'#7c909b',fontWeight:900}}>{graphLayers[key as keyof typeof graphLayers]?'ON · ':'OFF · '}{label}</button>)}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:9,marginTop:16}}>
            {[
              ['RE1 / ONUMA','Persistent building objects + native source graph',graphLayers.re1],['SEMANTIC / 223','Engineering meaning + relationships',graphLayers.semantic],['FIXED ASSET','Experimental information-readiness context',graphLayers.fixed],['TA-14','Experimental consequence / authority context',graphLayers.ta14],
            ].map(([k,v,on])=><div key={k as string} style={{padding:15,borderRadius:12,border:'1px solid '+(on?'rgba(127,240,189,.22)':'rgba(255,255,255,.08)'),background:on?'rgba(127,240,189,.045)':'rgba(255,255,255,.02)',opacity:on?1:.45}}><b style={{display:'block',color:on?'#7ff0bd':'#7e8a90',fontSize:11}}>{k}</b><span style={{display:'block',marginTop:7,color:'#aebfc8',fontSize:13,lineHeight:1.5}}>{v}</span></div>)}
          </div>
          <div aria-live="polite" style={{marginTop:15,padding:'16px 18px',borderLeft:'3px solid #c8a7ff',background:'rgba(177,135,255,.045)'}}><b style={{color:'#c8a7ff'}}>{activeGraphCount} / 4 LAYERS VISIBLE</b><p style={{margin:'7px 0 0',color:'#cec6d7',lineHeight:1.6}}>{graphSummary}</p></div>
          <div style={{marginTop:14,padding:'16px 18px',border:'1px solid rgba(242,204,104,.2)',borderRadius:12,background:'rgba(242,204,104,.035)'}}><b style={{color:'#f2cc68'}}>DURABLE ≠ APPLICATION</b><p style={{margin:'7px 0 0',color:'#d6ceb8',lineHeight:1.6}}>The visual application is a replaceable view. The durable layer is the accessible source data, persistent identities, relationships, RDF and APIs that can be reconstructed into another interface without silently merging ownership or authority.</p></div>
        </div>
        <div style={{marginTop:18,padding:'20px',border:'1px solid rgba(242,204,104,.24)',borderRadius:15,background:'rgba(242,204,104,.04)'}}><div style={{fontSize:11,fontWeight:950,letterSpacing:'.13em',color:'#f2cc68'}}>NAMESPACE RECONCILIATION · PRESERVED, NOT SILENTLY REWRITTEN</div><p style={{margin:'9px 0 0',color:'#d8cfb5',lineHeight:1.65}}>The received experimental companion used a provisional RE1 resource namespace. Comparison with the source building Turtle established the canonical source base as <code style={{color:'#fff0bd'}}>http://onuma.com/id#</code>. The local object IDs, ONUMA IDs, and IFC GUIDs reconciled; only the companion namespace binding required correction. The source RE1 graph was not modified.</p></div>
        <div style={{marginTop:18,display:'flex',gap:10,flexWrap:'wrap'}}>
          <a href="/artifacts/re1-governance-experimental-graph-of-graphs-v0-1-reconciled.ttl" style={{padding:'12px 15px',borderRadius:10,border:'1px solid rgba(177,135,255,.38)',color:'#e4d5ff',textDecoration:'none',fontWeight:900}}>OPEN RECONCILED EXPERIMENTAL TTL →</a>
        </div>
      </section>

      <section style={{marginTop:26,padding:'clamp(28px,5vw,48px)',border:'1px solid rgba(242,204,104,.24)',borderRadius:26,background:'linear-gradient(135deg,rgba(65,48,13,.2),rgba(5,17,28,.94))'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:950,letterSpacing:'.17em'}}>WHAT THURSDAY COULD SHOW</div>
        <h2 style={{fontSize:'clamp(30px,4.6vw,52px)',letterSpacing:'-.04em',margin:'12px 0 22px'}}>Not four presentations. One end-to-end demonstration.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:10}}>{[
          ['01 · MIKE','Begin with the owner requirement and why a repeatable process is needed.'],
          ['02 · KIMON','Expose the same asset through semantic context, persistent identity, and live interaction.'],
          ['03 · ANGELA','Show how the asset information is reconciled and prepared for trustworthy downstream use.'],
          ['04 · GREGGORY','Show how environmental and mechanical reality can remain continuous with the evidence record, then carry the explicit proposed consequence to the TA-14 boundary and issue the bounded determination.'],
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

      <section style={{marginTop:26,padding:'clamp(26px,4vw,40px)',border:'1px solid rgba(242,204,104,.24)',borderRadius:24,background:'linear-gradient(135deg,rgba(70,51,13,.18),rgba(7,18,30,.82))'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:950,letterSpacing:'.16em'}}>COLLABORATION RECORD · APPEND-ONLY PUBLIC HISTORY</div>
        <h2 style={{fontSize:'clamp(28px,4vw,46px)',letterSpacing:'-.04em',margin:'12px 0'}}>SUPERSEDED ≠ ERASED.</h2>
        <p style={{maxWidth:940,color:'#c9c1aa',lineHeight:1.7}}>Material revisions to this collaboration are preserved as attributable states. Later versions may supersede earlier interpretations, but they do not silently rewrite them. Demonstrations, negative results, HOLD conditions, expired determinations, and subsequent revalidations remain part of the record.</p>
        <div style={{marginTop:18,padding:'18px',borderLeft:'3px solid #f2cc68',background:'rgba(242,204,104,.035)'}}><b style={{color:'#f2cc68'}}>v0.1 · September 22, 2026</b><p style={{margin:'7px 0 0',color:'#d5cfbd',lineHeight:1.6}}>Proposed Owner-to-Consequence working collaboration established as a public technical examination surface. Initial roles, candidate shared SOP, AHU-17 changed-context example, bounded first mandate, and collaboration boundaries recorded.</p></div>
        <div style={{marginTop:10,padding:'18px',borderLeft:'3px solid #7ff0bd',background:'rgba(127,240,189,.035)'}}><b style={{color:'#7ff0bd'}}>v0.2 · September 22, 2026</b><p style={{margin:'7px 0 0',color:'#c5d8cf',lineHeight:1.6}}>Canonical TA-14 consequence test made explicit: ADMISSIBLE EVIDENCE · APPLICABLE AUTHORITY · ESTABLISHED STANDING · REALITY NOW. Determination separated from execution, persistent-record doctrine added, and supersession made visible without erasure.</p></div>
        <div style={{marginTop:10,padding:'18px',borderLeft:'3px solid #78e8ff',background:'rgba(113,231,255,.035)'}}><b style={{color:'#78e8ff'}}>v0.3 · September 22, 2026</b><p style={{margin:'7px 0 0',color:'#c4d8df',lineHeight:1.6}}>AHU-17 changed-context examination made interactive. Visitors can hold outdoor PM2.5 materially consistent or introduce a material rise and observe that the prior determination remains recorded while its standing is re-examined rather than silently inherited.</p></div>
        <div style={{marginTop:10,padding:'18px',borderLeft:'3px solid #c8a7ff',background:'rgba(177,135,255,.035)'}}><b style={{color:'#c8a7ff'}}>v0.4 · September 22, 2026</b><p style={{margin:'7px 0 0',color:'#d0c5dd',lineHeight:1.6}}>ONUMA Semantic Bridge Explorer experimental layers and the first RE1 graph-of-graphs companion artifact recorded. Original RE1 building graph remains unchanged; companion governance graph references the same persistent assets. Namespace comparison identified and reconciled the source RE1 base URI while preserving the received prototype as prior history.</p></div>
      </section>

      <section style={{marginTop:26,padding:'40px 26px',textAlign:'center',border:'1px solid rgba(127,240,189,.2)',borderRadius:24,background:'linear-gradient(135deg,rgba(17,64,52,.18),rgba(7,18,30,.82))'}}>
        <div style={{fontSize:10,fontWeight:950,letterSpacing:'.18em',color:'#829b90'}}>THE QUESTION FOR THE FOUR PARTICIPANTS</div>
        <div style={{marginTop:13,fontSize:'clamp(25px,4vw,45px)',fontWeight:950,letterSpacing:'-.035em'}}>Is this the shared process we are actually building?</div>
        <p style={{maxWidth:820,margin:'16px auto 0',color:'#9db1a8',lineHeight:1.7}}>If the answer survives the demonstrations, the parties can decide what the collaboration should become. The architecture does not require that answer in advance.</p>
      </section>
    </div>
  </main>;
}
