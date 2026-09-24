"use client";
import Link from "next/link";

const specimens=[
 {id:"A",delta:"$100,000 → $90,000",meaning:"Standing-preserving ΔN",result:"REFUSED · INADMISSIBLE · BLOCK",authority:"AUTHORITY_NOT_ESTABLISHED"},
 {id:"B",delta:"$100,000 → $50,000",meaning:"Standing-defeating ΔN",result:"REFUSED · INADMISSIBLE · BLOCK",authority:"AUTHORITY_NOT_ESTABLISHED"}
];

export default function HarmonicArtifact004(){
 return <main style={{minHeight:"100vh",background:"linear-gradient(180deg,#02070c,#071522 52%,#02070c)",color:"#eef6fb",fontFamily:"Inter,Arial,sans-serif"}}>
  <div style={{width:"min(1180px,calc(100% - 34px))",margin:"auto",paddingBottom:80}}>
   <nav style={{height:76,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #ffffff16"}}><Link href="/governance-showcase/TA-14-AIGR-000008">← HARMONIC GOVERNANCE</Link><Link href="/registry/ta-14-admissible-execution-architecture/showcase/harmonic-prospective-examination">LIVE R1 SHOWROOM →</Link></nav>
   <header style={{padding:"82px 0 58px"}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><b>HARMONIC ARTIFACT 004</b><b>TA-14-AIGR-000008</b><b>EXECUTED PROSPECTIVE EXAMINATION</b><b>V4.1 · /api/evaluate</b></div>
    <p style={{color:"#f2c66d",fontSize:11,fontWeight:900,letterSpacing:".16em",marginTop:24}}>TA-14 × HARMONIC · R1 EXECUTED RECORD</p>
    <h1 style={{font:"clamp(48px,7vw,88px)/.97 Georgia,serif",letterSpacing:"-.04em",maxWidth:1050,margin:"14px 0 24px"}}>When the test stayed frozen and both specimens blocked.</h1>
    <p style={{maxWidth:920,color:"#abc0cd",fontSize:18,lineHeight:1.7}}>Artifact 004 preserves the first completed run of the prospective Harmonic continuation-admissibility examination. The proposition, native contract, materiality rule, specimens and falsifier were frozen before execution. No packet repair occurred between A and B.</p>
   </header>
   <section style={{padding:"34px",border:"1px solid #f2c66d55",borderRadius:20,background:"#f2c66d0b"}}>
    <small style={{color:"#f2c66d",fontWeight:900}}>BOUNDED R1 DETERMINATION</small><h2 style={{font:"clamp(34px,5vw,58px)/1.04 Georgia,serif",margin:"10px 0"}}>INDETERMINATE ON THE FROZEN PROPOSITION</h2>
    <p style={{color:"#b3c4ce",lineHeight:1.7}}>The examination executed successfully, but both specimens encountered the same antecedent evidentiary failures before the decisive ΔN produced a differentiated authority result. The preserved record does not establish any frozen falsifier strongly enough to declare the proposition falsified.</p>
   </section>
   <section style={{padding:"58px 0"}}>
    <p style={{color:"#78dfff",fontSize:11,fontWeight:900}}>PAIRED NATIVE RESULTS</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>{specimens.map(s=><article key={s.id} style={{padding:26,border:"1px solid #ffffff18",borderRadius:18,background:"#07131fbb"}}><small>SPECIMEN {s.id} · {s.meaning}</small><h2 style={{font:"36px Georgia,serif"}}>{s.delta}</h2><p>Same proposed consequence: <b>$75,000</b></p><p><b>{s.result}</b></p><p style={{color:"#f2c66d"}}>{s.authority}</p></article>)}</div>
   </section>
   <section style={{padding:"34px",border:"1px solid #ffffff18",borderRadius:20}}>
    <p style={{color:"#78dfff",fontSize:11,fontWeight:900}}>FROZEN FALSIFIER JUDGMENT</p>
    <h3>F1 · NOT ESTABLISHED</h3><p style={{color:"#abc0cd",lineHeight:1.65}}>A was non-permitting, but the record does not show that result arose solely because the standing-preserving ΔN was misclassified as standing-defeating.</p>
    <h3>F2 · NOT ESTABLISHED</h3><p style={{color:"#abc0cd",lineHeight:1.65}}>B did not remain executable through inherited historical validity.</p>
    <h3>F3 · NOT ESTABLISHED ON THE PRESERVED R1 RECORD</h3><p style={{color:"#abc0cd",lineHeight:1.65}}>The runtime stated that upstream cognition establishes the attributable present-state representation and requested additional authority/evidentiary establishment. The preserved record does not establish that Harmonic required the prohibited upstream standing/admissibility conclusion rather than additional attributable facts or witnesses.</p>
   </section>
   <section style={{padding:"34px",border:"1px solid #ffffff18",borderRadius:20,marginTop:18}}>
    <p style={{color:"#78dfff",fontSize:11,fontWeight:900}}>NATIVE RECORD ANCHORS · PRESERVED R1</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18}}>
     <article><h3>SPECIMEN A</h3><p style={{color:"#abc0cd",lineHeight:1.7,wordBreak:"break-all"}}><b>Packet hash</b><br/>6597b04682975fc4ddaf2d9553466883ffca97c3a0d44f867218cb27fcc1e93b<br/><br/><b>Determination ID</b><br/>CD-4dbce442-8f2f-4386-99f4-41484140252a<br/><br/><b>Receipt ID</b><br/>CR-744aec81-ce54-4f64-8225-8c3b863b7919<br/><br/><b>Transaction digest</b><br/>d6c5f9aac449b5f9f862a26795a1ca1c2ab3d42079213325e50a216c59a4aae6</p></article>
     <article><h3>SPECIMEN B</h3><p style={{color:"#abc0cd",lineHeight:1.7,wordBreak:"break-all"}}><b>Packet hash</b><br/>bd0815afb9165eb00202f9ede8777bbaa2d67a7b7aa1d00ac50360962bd16e33<br/><br/><b>Determination ID</b><br/>CD-04ec710a-de2c-4955-bb09-ed7ae287ddef<br/><br/><b>Receipt ID</b><br/>CR-d7281a3d-f2b4-4f74-9de0-0617f6668c00<br/><br/><b>Transaction digest</b><br/>3a46d2dc9cbd79463326efc64881336d0313b2c6a6733cef4e7789cf8c73cc63</p></article>
    </div>
    <p style={{color:"#8199a8",lineHeight:1.65,marginBottom:0}}>These anchors identify the frozen input packets and the native Harmonic records returned during R1. They preserve execution lineage; they do not expand the bounded determination.</p>
   </section>
   <section style={{padding:"58px 0"}}>
    <p style={{color:"#78dfff",fontSize:11,fontWeight:900}}>PRESERVATION RULE</p><h2 style={{font:"42px Georgia,serif"}}>The result does not rewrite the test.</h2><p style={{maxWidth:900,color:"#abc0cd",lineHeight:1.7}}>Artifact 004 retains the prospective freeze as antecedent evidence. No post-result repair, new criterion, runtime substitution, or packet revision is folded back into R1. Any successor examination must constitute a new governed chain.</p>
    <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}><Link href="/registry/ta-14-admissible-execution-architecture/showcase/harmonic-prospective-examination">OPEN EXECUTED SHOWROOM →</Link><Link href="/artifacts/fd-2026-0002-case-003">← HARMONIC ARTIFACT 003</Link></div>
   </section>
   <footer style={{padding:"30px 0",borderTop:"1px solid #ffffff16",color:"#f2c66d"}}><b>HARMONIC ARTIFACT 004 · TA-14-AIGR-000008</b><p>No admissible evidence. No admissible execution.</p></footer>
  </div>
 </main>
}