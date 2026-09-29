export default function EdiaqiCroatiaShowroom() {
  return (
    <main style={{fontFamily:"Arial, sans-serif",background:"#f4f7f8",color:"#10242d",minHeight:"100vh"}}>
      <header style={{background:"#062b3a",color:"white",padding:"72px 6vw"}}>
        <p style={{fontWeight:900,letterSpacing:2,fontSize:12}}>CROATIA · EDIAQI × TA-14 · 29 SEPTEMBER 2026</p>
        <h1 style={{fontFamily:"Georgia, serif",fontSize:"clamp(46px,7vw,84px)",lineHeight:.95,maxWidth:1000}}>Monitoring air is necessary.<br/><span style={{color:"#8ee5ff"}}>It is not governing air.</span></h1>
        <p style={{fontFamily:"Georgia, serif",fontSize:20,lineHeight:1.6,maxWidth:850}}>A public conference surface for Greggory Don Butler's remote oral presentation to the EDIAQI Indoor Air Quality Conference in Zagreb.</p>
        <p style={{fontSize:11,fontWeight:900}}>INDEPENDENT TA-14 SURFACE · NOT AN EDIAQI ENDORSEMENT · OPEN FOR CORRECTION</p>
      </header>
      <section style={{padding:"64px 6vw",maxWidth:1150,margin:"auto"}}>
        <h2 style={{fontFamily:"Georgia, serif",fontSize:"clamp(36px,5vw,60px)"}}>Continuous monitoring gives us visibility. Governance requires more.</h2>
        <p style={{fontFamily:"Georgia, serif",fontSize:19,lineHeight:1.7,maxWidth:900}}>Indoor air changes continuously. Occupancy, outdoor conditions, equipment performance, filtration, pressure, humidity and ventilation change. Continuous monitoring is therefore necessary to govern air well.</p>
        <blockquote style={{margin:"36px 0",padding:"28px",background:"white",borderLeft:"6px solid #087ba3",fontFamily:"Georgia, serif",fontSize:30,lineHeight:1.4}}>Continuous monitoring is not the same thing as governing air. It is necessary to governing air. It is not everything necessary to govern air.</blockquote>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
          {[
            ["MONITOR","What is happening?","Sensors and records establish present observations: CO2, particulate matter, humidity, temperature, pressure, VOCs and ventilation."],
            ["UNDERSTAND","What might need to happen?","Analytics, engineering logic and AI can interpret evidence, detect changed conditions and propose a response."],
            ["GOVERN","What may happen now?","Governance asks whether the proposed consequence has sufficient evidence, applicable authority and established standing before it becomes reality."]
          ].map(([a,b,c])=><article key={a} style={{background:"white",border:"1px solid #d2e0e5",padding:26}}><small style={{fontWeight:900,color:"#08799f"}}>{a}</small><h3 style={{fontFamily:"Georgia, serif",fontSize:27}}>{b}</h3><p style={{lineHeight:1.7}}>{c}</p></article>)}
        </div>
      </section>
      <section style={{padding:"64px 6vw",background:"#061c26",color:"white"}}>
        <div style={{maxWidth:1150,margin:"auto"}}>
          <p style={{fontWeight:900,color:"#67dbff"}}>TA-14 · CONSEQUENCE BOUNDARY</p>
          <h2 style={{fontFamily:"Georgia, serif",fontSize:"clamp(36px,5vw,60px)"}}>The measurement does not authorize the consequence.</h2>
          <p style={{fontFamily:"Georgia, serif",fontSize:24,lineHeight:1.5}}>Does this proposed consequence have sufficient <strong>Admissible Evidence, Applicable Authority, and Established Standing</strong> to become reality NOW?</p>
          <p style={{fontWeight:900,letterSpacing:1.5}}>REALITY → RECORD → CONTINUITY → ADMISSIBILITY → BINDING → COMMIT → EXECUTION → OUTCOME</p>
        </div>
      </section>
      <section style={{padding:"64px 6vw",maxWidth:1150,margin:"auto"}}>
        <h2 style={{fontFamily:"Georgia, serif",fontSize:"clamp(36px,5vw,60px)"}}>The sensor can be right and the proposed action can still be wrong.</h2>
        <div style={{background:"white",border:"1px solid #ccdce2",padding:30}}>
          <h3 style={{fontFamily:"Georgia, serif",fontSize:30}}>Indoor particulate matter rises.</h3>
          <p style={{fontSize:16,lineHeight:1.75}}>Continuous monitoring detects the change. A control strategy proposes increasing outdoor air. But outdoor monitoring shows wildfire smoke. The indoor evidence may be correct. The control logic may be correct. The equipment may be capable of acting. Yet increasing outdoor air can still be the wrong consequence.</p>
          <p style={{fontSize:16,lineHeight:1.75}}><strong>The question is not only whether the data is true. It is whether the evidence is sufficient for this consequence, under these conditions, at this moment.</strong></p>
          <p style={{fontWeight:900}}>ALLOW · HOLD · DENY · ESCALATE</p>
        </div>
        <h2 style={{fontFamily:"Georgia, serif",fontSize:42,marginTop:55}}>Continuous monitoring helps us know when reality changes. Governance determines what changed reality may legitimately cause.</h2>
        <p style={{marginTop:35,padding:22,background:"white",border:"1px solid #d2e0e5",lineHeight:1.7}}><strong>Disclosure boundary.</strong> This is an independent TA-14 public conference surface prepared in connection with Greggory Don Butler's selected remote oral presentation at the EDIAQI Indoor Air Quality Conference in Zagreb on 29 September 2026. It does not state or imply that EDIAQI, its organisers, speakers, participants, funders or partner institutions have adopted, validated or endorsed TA-14. Conference-related factual corrections are welcomed.</p>
      </section>
    </main>
  );
}
