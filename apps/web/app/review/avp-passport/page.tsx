export const metadata = {
  title: "TA-14 AVP Passport — Greggory Review",
  robots: { index: false, follow: false },
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{border:"1px solid #334155",borderRadius:16,padding:24,background:"#0f172a",marginBottom:18}}>
    <h2 style={{fontSize:22,margin:"0 0 12px"}}>{title}</h2>{children}
  </section>
);

export default function Page() {
  return <main style={{maxWidth:1040,margin:"0 auto",padding:"48px 22px 90px",fontFamily:"Arial, sans-serif",color:"#e2e8f0",background:"#020617",minHeight:"100vh"}}>
    <div style={{border:"2px solid #f59e0b",borderRadius:14,padding:16,marginBottom:28,color:"#fde68a",fontWeight:800}}>
      CANDIDATE — GREGGORY REVIEW — NOT REGISTERED — NOT SENT TO ANTO
    </div>
    <p style={{letterSpacing:2,textTransform:"uppercase",color:"#94a3b8"}}>TA-14 Authority · Pre-send review surface</p>
    <h1 style={{fontSize:46,lineHeight:1.05,margin:"8px 0 14px"}}>cp:ta14.avp.passport</h1>
    <p style={{fontSize:22,lineHeight:1.5,color:"#cbd5e1"}}>Authority Passport presentation across a governed CNS/CP connection. The crossing carries authority context. It does not carry execution authority.</p>

    <Card title="The boundary">
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
        {["Presenter domain","CNS/CP connection","Receiving domain","TA-14 consequence boundary"].map((x,i)=><div key={x} style={{padding:16,border:"1px solid #475569",borderRadius:12}}><b>{i+1}. {x}</b><p>{["Presents the Authority Passport and its integrity identity.","Establishes whether the connection exists and what may cross.","Returns a bounded decision and signed receipt.","Separately determines whether a proposed consequence may become reality NOW."][i]}</p></div>)}
      </div>
      <p style={{fontSize:20,fontWeight:800}}>Connection success does not establish execution authority.</p>
    </Card>

    <Card title="What crosses">
      <p><b>Presenter → Receiver:</b> Authority Passport as an opaque governed value plus Passport digest. Purpose, scope, budget, expiry and other AVP semantics remain TA-14 content; CNS/CP carries them without becoming their authority.</p>
      <p><b>Receiver → Presenter:</b> decision, signed receipt, and when applicable a narrowing proof binding.</p>
      <p><b>Does not cross as execution authority:</b> local constitution, local lease, local capsule, Commit, Execution, Effect or Closure. Their absence is intentional.</p>
    </Card>

    <Card title="Receipt paths">
      <p><b>ACCEPT_NARROWED</b> — the receipt binds the digest of the actual NarrowingProof.</p>
      <p><b>ACCEPT</b> — candidate CP binding uses an integrity-bound no-narrowing assertion; it does not manufacture a NarrowingProof. This is a Connection Profile binding rule, not a retroactive change to frozen AVP v1.0.2.</p>
      <p style={{color:"#fde68a"}}><b>Review point:</b> this no-narrowing binding remains a candidate until Greggory approves it and Anto later checks CNS/CP well-formedness/boundary placement.</p>
    </Card>

    <Card title="Revocation is two different things">
      <p><b>Passport revocation:</b> TA-14 authority-context event. A revoked Passport causes the receiving side to HOLD/reject its use under the applicable governance.</p>
      <p><b>Connection revocation:</b> CNS/CP connection-policy event. It ends the governed exchange.</p>
      <p>Revoking one does not silently revoke the other. A renewed or superseding Passport is a new value on the governed connection, not automatically a new connection.</p>
    </Card>

    <Card title="TA-14 consequence boundary">
      <blockquote style={{fontSize:24,lineHeight:1.45,margin:"8px 0",borderLeft:"4px solid #94a3b8",paddingLeft:18}}>
        Does this proposed consequence have sufficient <b>Admissible Evidence</b>, <b>Applicable Authority</b>, and <b>Established Standing</b> to become reality <b>NOW</b>?
      </blockquote>
      <p><b>No admissible evidence. No admissible execution.</b></p>
      <p>CNS/CP governs the connection. AVP carries authority context. TA-14 governs admissible execution at the consequence boundary. Authority context may cross; execution authority must be established locally.</p>
    </Card>

    <Card title="Evidence preserved">
      <p>The repository preserves the original local failing run, the receipt-integrity correction, and the corrected 15-fixture local validation in which all expected outcomes were met.</p>
      <p><b>Invariant recorded by the harness:</b> execution_authority = NOT_ESTABLISHED_BY_CP; local_execution_observed = false.</p>
      <p>This is bounded local fixture evidence only. It is not a CNS/CP registry, publication, conformance or interoperability claim.</p>
    </Card>

    <Card title="What Anto would be asked to check — only after Greggory approves">
      <p>1. Is the Connection Profile structurally well-formed?</p>
      <p>2. Are the crossing properties correctly placed at the connection layer?</p>
      <p>3. Does anything improperly reach below the connection boundary?</p>
      <p>4. Are Passport revocation and connection revocation kept distinct?</p>
      <p>TA-14/AVP semantics, admissibility, Applicable Authority, Established Standing and the consequence determination are not delegated by that review.</p>
    </Card>

    <Card title="Current gate">
      <p><b>STOP.</b> Greggory reviews this candidate before any submission to Anto. No registry or conformance claim is made here.</p>
    </Card>
  </main>;
}
