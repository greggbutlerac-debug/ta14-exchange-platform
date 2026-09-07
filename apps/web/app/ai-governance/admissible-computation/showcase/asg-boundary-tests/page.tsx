import Link from "next/link";

const runs = [
  {
    id: "ASG-MTRPEORA",
    engine: "asg.v0.4",
    query: "marshmellows",
    state: "PRESERVED FAILURE",
    result: "8 established · 0 ALLOW · 8 DENY · 0 delivered",
    finding: "Literal token equality rejected the provider-established marshmallow subject because the bounded request contained a one-character spelling error.",
    consequence: "Established the need for governed lexical normalization without rewriting the original request."
  },
  {
    id: "ASG-MTRPI8AR",
    engine: "asg.v0.5",
    query: "marshmallows",
    state: "PRESERVED FALSE DENY",
    result: "7 established · 6 ALLOW · 1 DENY · 6 delivered",
    finding: "The singular Wikipedia candidate ‘Marshmallow’ was rejected against the plural request ‘marshmallows.’",
    consequence: "Established the need for bounded singular/plural continuity."
  },
  {
    id: "ASG-MTRPVZ9U",
    engine: "asg.v0.6",
    query: "sumbitch",
    state: "PRESERVED BOUNDARY TEST",
    result: "9 established · 8 ALLOW · 1 DENY · 8 delivered",
    finding: "The candidate ‘SOM BITCH’ remained outside lexical standing because admitting it would require a phonetic/colloquial transformation across token boundaries.",
    consequence: "Demonstrates where bounded normalization deliberately stops interpreting."
  },
  {
    id: "ASG-MTRPZ6TK",
    engine: "asg.v0.6",
    query: ".khvlugckjtdxjkhv b/lm n /lkhblvu ky fijyfxcikulhbj 'kn';ulgc itrxi",
    state: "PROVIDER-INFERENCE REJECTION",
    result: "7 established · 0 ALLOW · 7 DENY · 0 delivered",
    finding: "The provider inferred University of Louisville Golf Club candidates from an otherwise unbound request. TA-14 preserved all seven candidates but did not inherit the provider’s inferred meaning as delivery standing.",
    consequence: "Demonstrates provider interpretation is candidate evidence, not delivery authority."
  }
];

export default function Page(){
  return <main style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px 96px",fontFamily:"Arial, sans-serif"}}>
    <Link href="/ai-governance/admissible-computation">← ACA Showcase</Link>
    <p style={{marginTop:40,fontWeight:700,letterSpacing:2}}>TA-14 · ADMISSIBLE SEARCH GATEWAY</p>
    <h1 style={{fontSize:"clamp(36px,6vw,72px)",lineHeight:1.02,margin:"12px 0 20px"}}>Governed normalization has a boundary.</h1>
    <p style={{fontSize:20,lineHeight:1.6,maxWidth:900}}>These preserved runs show the difference between correcting a bounded lexical mismatch and silently inventing semantic equivalence. Google may discover candidates using its own interpretation. TA-14 independently determines whether the preserved evidence has sufficient standing to cross the delivery boundary.</p>

    <section style={{marginTop:48,padding:"28px",border:"1px solid #777"}}>
      <strong>GOVERNING RULE</strong>
      <p style={{fontSize:22,lineHeight:1.5,marginBottom:0}}>The original request is never rewritten. Normalization may establish tightly bounded lexical continuity; it does not automatically authorize phonetic, colloquial, conceptual, cross-token, or provider-inferred interpretation.</p>
    </section>

    <div style={{display:"grid",gap:24,marginTop:40}}>
      {runs.map((r)=><article key={r.id} style={{padding:"28px",border:"1px solid #777"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:13,fontWeight:700,letterSpacing:1}}><span>{r.id}</span><span>·</span><span>{r.engine}</span><span>·</span><span>{r.state}</span></div>
        <h2 style={{fontSize:32,margin:"14px 0 6px",overflowWrap:"anywhere"}}>{r.query}</h2>
        <p><strong>{r.result}</strong></p>
        <p style={{fontSize:18,lineHeight:1.55}}>{r.finding}</p>
        <p style={{lineHeight:1.55}}><strong>Architectural consequence:</strong> {r.consequence}</p>
      </article>)}
    </div>

    <section style={{marginTop:48}}>
      <h2>Why the DENY matters</h2>
      <p style={{fontSize:18,lineHeight:1.65,maxWidth:900}}>A provider result is evidence that the provider considered a candidate relevant. It is not automatic evidence that TA-14 must deliver it. Preserving a defensible DENY demonstrates separation between candidate discovery and delivery authority. Preserving false DENYs demonstrates that the governor itself remains testable and correctable without rewriting prior records.</p>
    </section>

    <section style={{marginTop:48,padding:"28px",border:"1px solid #777"}}>
      <strong>CLAIMS BOUNDARY</strong>
      <p style={{lineHeight:1.6,marginBottom:0}}>These records demonstrate behavior of the bounded ASG implementation and its evolving rules. They do not establish that every ALLOW is objectively correct, that every DENY is universally correct, or that TA-14 governs Google’s internal search computation.</p>
    </section>
  </main>
}
