import Link from "next/link";

const steps = [
  ["Choose the operating surface", "Use Command for orientation, Directory to inspect preserved artifacts, Register to begin a candidate intake, Governance to confirm the governing architecture, Verification to inspect evidence level, and Ledger to review chronology."],
  ["Confirm governance identity", "Select the permanent TA-14 governance Registry identifier. A new architecture version does not create a second governance identity. Confirm architecture name, steward/organization, and declared version before continuing."],
  ["Describe the bounded event", "Enter the artifact title, sector, proposed action, consequence, route identifier, and route version. Describe one materially bounded governed event rather than making universal claims about an architecture."],
  ["Declare determination and earliest control", "Record ALLOW, HOLD, DENY, or ESCALATE and identify the earliest TA-14 control point at which the consequential route became governed. The determination must correspond to the preserved evidence state."],
  ["Attach execution and outcome evidence", "Preserve the execution receipt, execution effect, observed outcome, package/root hash, and verification level. If evidence is missing, stale, conflicting, or outside scope, do not manufacture completion—hold or escalate the record."],
  ["State the claims boundary", "Write what the artifact proves and what it does not prove. This prevents a bounded event record from being misrepresented as certification, universal architecture validation, or proof outside the preserved conditions."],
  ["Review before publication", "Confirm identity, route, determination, evidence, outcome, hashes, disclosure mode, and claims boundary. Publication should preserve the candidate state rather than silently rewriting earlier evidence."],
  ["Preserve progression", "Once publication is authoritative, append the artifact event beneath the permanent governance identity so later artifacts can show progression without erasing the earlier baseline."],
];

function Diagram() {
  return (
    <div style={{border:"1px solid rgba(218,174,85,.28)",borderRadius:22,padding:20,background:"linear-gradient(145deg,rgba(19,31,43,.96),rgba(5,14,24,.98))"}}>
      <div style={{fontSize:10,fontWeight:900,letterSpacing:".16em",color:"#ddb25d"}}>VISUAL OPERATING MAP</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(115px,1fr))",gap:9,marginTop:16}}>
        {["GOVERNANCE","EVENT","ROUTE","DETERMINATION","EVIDENCE","OUTCOME","BOUNDARY","PUBLISH"].map((item,index)=>(
          <div key={item} style={{position:"relative",padding:"16px 10px",textAlign:"center",borderRadius:13,border:"1px solid rgba(132,161,184,.2)",background:"rgba(255,255,255,.025)"}}>
            <div style={{fontSize:9,color:"#71889b"}}>STEP {index+1}</div>
            <div style={{marginTop:5,fontSize:11,fontWeight:900,color:"#eef4f7"}}>{item}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:13,color:"#8198aa",fontSize:11,lineHeight:1.6}}>This operating map is the Academy visual layer. Production screenshots can be added beneath each step as the engine assurance review captures the verified interface state.</div>
    </div>
  );
}

export default function ArtifactRegistryAcademyGuide() {
  return (
    <main style={{minHeight:"100vh",background:"radial-gradient(circle at 15% 0%,#14283b 0,#07111d 35%,#030810 100%)",color:"#edf3f7",padding:"42px 20px 80px"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <Link href="/artifacts/registry" style={{color:"#9eb3c4",fontSize:12,textDecoration:"none"}}>← Return to Execution Artifact Registry</Link>

        <header style={{marginTop:30,maxWidth:880}}>
          <div style={{fontSize:10,fontWeight:900,letterSpacing:".19em",color:"#ddb25d"}}>TA-14 ACADEMY · EMBEDDED ENGINE GUIDANCE</div>
          <h1 style={{fontSize:"clamp(36px,6vw,72px)",lineHeight:.98,letterSpacing:"-.045em",margin:"13px 0 16px"}}>Execution Artifact Registry</h1>
          <p style={{fontSize:18,lineHeight:1.65,color:"#a8bac8",maxWidth:800}}>A governed walkthrough for creating, reviewing, verifying, and preserving bounded execution artifacts. The objective is not merely to fill fields. It is to create an inspectable record that can survive later review without overstating what the evidence proves.</p>
        </header>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,margin:"30px 0"}}>
          {[["Purpose","Preserve bounded execution evidence"],["Determinations","ALLOW · HOLD · DENY · ESCALATE"],["Identity rule","One governance · many versions"],["Assurance","Formal engine verification in progress"]].map(([a,b])=>(
            <div key={a} style={{border:"1px solid rgba(132,161,184,.18)",borderRadius:16,padding:17,background:"rgba(255,255,255,.025)"}}><div style={{fontSize:9,color:"#7890a3",fontWeight:900,letterSpacing:".12em"}}>{a.toUpperCase()}</div><div style={{marginTop:7,fontWeight:800,fontSize:14}}>{b}</div></div>
          ))}
        </div>

        <Diagram />

        <section style={{marginTop:34}}>
          <div style={{fontSize:10,fontWeight:900,letterSpacing:".16em",color:"#ddb25d"}}>STEP-BY-STEP OPERATING SEQUENCE</div>
          <div style={{display:"grid",gap:12,marginTop:16}}>
            {steps.map(([title,body],index)=>(
              <article key={title} style={{display:"grid",gridTemplateColumns:"56px 1fr",gap:15,border:"1px solid rgba(132,161,184,.16)",borderRadius:18,padding:18,background:"rgba(255,255,255,.02)"}}>
                <div style={{width:48,height:48,borderRadius:14,display:"grid",placeItems:"center",border:"1px solid rgba(219,174,82,.35)",color:"#ddb25d",fontWeight:900}}>{String(index+1).padStart(2,"0")}</div>
                <div><h2 style={{margin:"2px 0 7px",fontSize:18}}>{title}</h2><p style={{margin:0,color:"#9fb2c1",lineHeight:1.65,fontSize:14}}>{body}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:34}}>
          <div style={{border:"1px solid rgba(202,89,89,.25)",borderRadius:18,padding:20,background:"rgba(202,89,89,.045)"}}><div style={{fontSize:10,fontWeight:900,color:"#e9a0a0",letterSpacing:".12em"}}>STOP / HOLD CONDITIONS</div><p style={{color:"#b8c5ce",lineHeight:1.65,fontSize:13}}>Do not force publication when governance identity is unresolved, evidence is missing or stale, route identity is ambiguous, hashes do not correspond, authority is outside scope, the claimed outcome cannot be supported, or the claims boundary overreaches the preserved event.</p></div>
          <div style={{border:"1px solid rgba(75,178,139,.25)",borderRadius:18,padding:20,background:"rgba(75,178,139,.045)"}}><div style={{fontSize:10,fontWeight:900,color:"#8bd3b7",letterSpacing:".12em"}}>CORRECT COMPLETION</div><p style={{color:"#b8c5ce",lineHeight:1.65,fontSize:13}}>A correct completion leaves an identifiable governance, bounded event, declared route, determination, evidence state, execution effect, outcome, verification level, integrity material, disclosure state, and explicit statement of what the artifact does and does not prove.</p></div>
        </section>

        <section style={{marginTop:34,padding:24,borderRadius:20,border:"1px solid rgba(219,174,82,.3)",background:"linear-gradient(135deg,rgba(219,174,82,.08),rgba(255,255,255,.015))"}}>
          <div style={{fontSize:10,fontWeight:900,letterSpacing:".15em",color:"#ddb25d"}}>ACADEMY ASSURANCE NOTE</div>
          <h2 style={{margin:"8px 0",fontSize:23}}>Guidance does not substitute for engine verification.</h2>
          <p style={{margin:0,color:"#a8bac8",lineHeight:1.65,fontSize:14}}>TA-14 will separately test the engine's happy path, refusal and failure states, persistence boundaries, integrity behavior, and integration behavior. Screenshots and worked examples should reflect the verified production interface—not an imagined interface.</p>
        </section>
      </div>
    </main>
  );
}
