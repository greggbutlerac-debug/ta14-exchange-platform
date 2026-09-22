"use client";

import { useMemo, useState } from "react";

type Run = "preserved" | "defeated";

const fixed = [
  ["T₀ authority", "Facilities authority A-214 · active"],
  ["Actor", "Building automation controller BAC-07"],
  ["Proposed consequence", "Increase outdoor-air ventilation in Classroom 214"],
  ["Execution path", "Controller → governed commit → AHU-2 outside-air command"],
];

const evidence = {
  preserved: {
    delta: "ΔN₁",
    change: "Occupancy increases from 21 to 27. The actor, authority, scope, equipment relationship, and intervention boundary remain unchanged.",
    standing: "ESTABLISHED",
    determination: "ALLOW",
    reason: "Changed reality is material to the operating state, but it does not defeat a standing-bearing fact. The authoritative facts still connect the actor, applicable authority, governed object, scope, and proposed consequence.",
    record: [
      ["Authoritative changed fact", "Occupancy: 21 → 27"],
      ["Provenance", "Room occupancy service · signed event · sequence continuous"],
      ["Admissible evidence", "ESTABLISHED · current and attributable"],
      ["Applicable authority", "ESTABLISHED · A-214 remains active and in scope"],
      ["Standing", "ESTABLISHED · required relationships survive ΔN₁"],
      ["Execution state", "ALLOW · governed commit may proceed"],
    ],
  },
  defeated: {
    delta: "ΔN₂",
    change: "AHU-2 is placed under an active fire-smoke control override. That authoritative state change removes the controller's standing to issue the proposed ventilation consequence through the normal execution path.",
    standing: "DEFEATED",
    determination: "HOLD",
    reason: "The proposed consequence is unchanged, but a standing-bearing fact is not. TA-14 derives the failure from the authoritative fire-smoke override and preserved provenance before commit. No upstream STANDING = TRUE verdict is accepted.",
    record: [
      ["Authoritative changed fact", "AHU-2 fire-smoke override: INACTIVE → ACTIVE"],
      ["Provenance", "Life-safety control record · signed event · sequence continuous"],
      ["Admissible evidence", "ESTABLISHED · current and attributable"],
      ["Applicable authority", "A-214 exists, but normal execution authority no longer applies to this path"],
      ["Standing", "DEFEATED · execution relationship broken by ΔN₂"],
      ["Execution state", "HOLD · commit blocked before consequence binds"],
    ],
  },
};

export default function ChangedRealityTestPage() {
  const [run, setRun] = useState<Run>("preserved");
  const current = useMemo(() => evidence[run], [run]);

  return (
    <main style={{minHeight:"100vh",background:"#05070b",color:"#f5f7fb",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"}}>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"56px 22px 90px"}}>
        <div style={{fontSize:12,letterSpacing:3,color:"#7dd3fc",marginBottom:14}}>TA-14 AUTHORITY · PUBLIC TECHNICAL SHOWROOM · RUNTIME TEST</div>
        <h1 style={{fontSize:"clamp(38px,7vw,82px)",lineHeight:.95,margin:"0 0 18px",letterSpacing:-3}}>THE CHANGED-REALITY TEST</h1>
        <p style={{fontSize:"clamp(20px,3vw,34px)",maxWidth:900,lineHeight:1.15,margin:"0 0 22px"}}>Can one authoritative fact stop the same consequence?</p>
        <p style={{maxWidth:900,color:"#b7c0cf",fontSize:16,lineHeight:1.65}}>
          Freeze the starting conditions. Keep the authority, actor, proposed consequence, and execution path identical.
          Change one authoritative fact. Then inspect whether TA-14 derives a different standing and execution determination before consequence binds.
        </p>

        <section style={{marginTop:34,border:"1px solid #263142",background:"#0a0f18",borderRadius:18,padding:22}}>
          <div style={{fontSize:12,letterSpacing:2,color:"#94a3b8",marginBottom:16}}>CONTROL · HELD CONSTANT</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12}}>
            {fixed.map(([k,v]) => <div key={k} style={{border:"1px solid #1f2937",borderRadius:12,padding:15,background:"#080c13"}}><div style={{fontSize:11,color:"#7dd3fc",marginBottom:8}}>{k.toUpperCase()}</div><div style={{lineHeight:1.45}}>{v}</div></div>)}
          </div>
        </section>

        <section style={{marginTop:24,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
          <button onClick={()=>setRun("preserved")} style={{textAlign:"left",cursor:"pointer",border:run==="preserved"?"1px solid #67e8f9":"1px solid #263142",background:run==="preserved"?"#0c1b22":"#0a0f18",color:"#f8fafc",borderRadius:16,padding:20}}>
            <div style={{fontSize:12,letterSpacing:2,color:"#67e8f9"}}>RUN A · ΔN₁</div>
            <div style={{fontSize:24,fontWeight:800,marginTop:8}}>STANDING PRESERVED</div>
            <div style={{color:"#aeb8c7",marginTop:10,lineHeight:1.5}}>Change reality without defeating a standing-bearing fact.</div>
          </button>
          <button onClick={()=>setRun("defeated")} style={{textAlign:"left",cursor:"pointer",border:run==="defeated"?"1px solid #fbbf24":"1px solid #263142",background:run==="defeated"?"#211807":"#0a0f18",color:"#f8fafc",borderRadius:16,padding:20}}>
            <div style={{fontSize:12,letterSpacing:2,color:"#fbbf24"}}>RUN B · ΔN₂</div>
            <div style={{fontSize:24,fontWeight:800,marginTop:8}}>STANDING DEFEATED</div>
            <div style={{color:"#aeb8c7",marginTop:10,lineHeight:1.5}}>Change one standing-bearing authoritative fact.</div>
          </button>
        </section>

        <section style={{marginTop:24,border:"1px solid #263142",borderRadius:18,overflow:"hidden",background:"#080c13"}}>
          <div style={{padding:22,borderBottom:"1px solid #263142"}}>
            <div style={{fontSize:12,letterSpacing:2,color:"#94a3b8"}}>AUTHORITATIVE CHANGED REALITY · {current.delta}</div>
            <p style={{fontSize:18,lineHeight:1.6,margin:"12px 0 0"}}>{current.change}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
            <div style={{padding:22,borderRight:"1px solid #263142"}}>
              <div style={{fontSize:11,color:"#94a3b8",letterSpacing:2}}>DERIVED STANDING</div>
              <div style={{fontSize:34,fontWeight:900,marginTop:8}}>{current.standing}</div>
            </div>
            <div style={{padding:22}}>
              <div style={{fontSize:11,color:"#94a3b8",letterSpacing:2}}>EXECUTION DETERMINATION</div>
              <div style={{fontSize:34,fontWeight:900,marginTop:8}}>{current.determination}</div>
            </div>
          </div>
        </section>

        <section style={{marginTop:24}}>
          <div style={{fontSize:12,letterSpacing:2,color:"#7dd3fc",marginBottom:12}}>DO NOT TRUST THE RESULT. INSPECT WHERE IT WAS DERIVED.</div>
          <div style={{border:"1px solid #263142",borderRadius:18,overflow:"hidden"}}>
            {current.record.map(([k,v],i)=><div key={k} style={{display:"grid",gridTemplateColumns:"minmax(190px,.7fr) 2fr",gap:16,padding:"15px 18px",background:i%2?"#080c13":"#0b111b",borderBottom:i===current.record.length-1?"none":"1px solid #1f2937"}}><strong style={{color:"#cbd5e1"}}>{k}</strong><span style={{color:"#e5e7eb",lineHeight:1.45}}>{v}</span></div>)}
          </div>
          <p style={{color:"#aeb8c7",lineHeight:1.65,marginTop:16}}>{current.reason}</p>
        </section>

        <section style={{marginTop:38,borderTop:"1px solid #263142",paddingTop:30}}>
          <div style={{fontSize:12,letterSpacing:2,color:"#94a3b8"}}>THE CONSEQUENCE BOUNDARY</div>
          <h2 style={{fontSize:"clamp(26px,4vw,44px)",lineHeight:1.08,maxWidth:980}}>Does this proposed consequence have admissible evidence, applicable authority, and established standing to become reality now?</h2>
          <div style={{display:"flex",flexWrap:"wrap",gap:9,marginTop:18}}>
            {["REALITY","RECORD","CONTINUITY","ADMISSIBILITY","BINDING","COMMIT","EXECUTION","OUTCOME"].map((x,i)=><span key={x} style={{border:"1px solid #263142",borderRadius:999,padding:"8px 11px",fontSize:11,color:i===3||i===4?"#7dd3fc":"#cbd5e1"}}>{x}</span>)}
          </div>
          <p style={{marginTop:22,fontSize:18,fontWeight:800}}>ADMISSIBLE EVIDENCE · APPLICABLE AUTHORITY · ESTABLISHED STANDING · NOW.</p>
          <p style={{color:"#94a3b8",lineHeight:1.6,maxWidth:900}}>This showroom is a controlled TA-14 runtime demonstration. It tests whether changed authoritative reality changes the derived execution state before consequence binds. It does not treat an upstream standing verdict as proof.</p>
          <p style={{marginTop:24,fontSize:18}}><strong>No admissible evidence. No admissible execution.</strong></p>
        </section>
      </div>
    </main>
  );
}
