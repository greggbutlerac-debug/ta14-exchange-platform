"use client";

import Link from "next/link";

const supported = [
  "The participant evidence reports successful authenticated execution of the three frozen R1 read-only calls: subscription_list, group_list, and group_resource_list.",
  "Four explicit prohibited-operation challenges were recorded as locally denied with upstream_request_sent: false.",
  "All 17 identifiers advertised by the authenticated live catalog were evaluated against the frozen R1 policy and recorded as locally denied before upstream execution.",
] as const;

const limits = [
  "Complete correspondence between the three callable frozen aliases and the authenticated tools/list catalog is not established.",
  "TA-14 did not independently reproduce the Azure MCP execution during this documentary review.",
  "The record does not establish Azure write authority, universal Azure-read safety, future-state standing, production readiness, legal compliance, certification, endorsement, or universal security.",
] as const;

const states = [
  ["Positive frozen read execution", "SUPPORTED"],
  ["Explicit negative restraint", "SUPPORTED"],
  ["Authenticated catalog-surface containment", "SUPPORTED"],
  ["Catalog correspondence", "NOT ESTABLISHED"],
  ["Canonical evidence-content digest", "VERIFIED - MATCHES PARTICIPANT ASSERTED DIGEST"],
  ["Independent live reproduction by TA-14", "NOT PERFORMED"],
  ["Participant factual review", "PENDING"],
  ["Case state", "OPEN - DRAFT NOT CLOSED"],
] as const;

export default function VsaCobitChainR1Showcase(){
  return <main className="page-shell">
    <div className="grid"/><div className="glow glow-a"/><div className="glow glow-b"/>
    <header className="topbar">
      <Link href="/artifacts/founding-demonstrations" className="brand"><span className="mark">TA</span><span><strong>TA-14</strong><small>Governed Demonstration</small></span></Link>
      <nav><Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000025">VSA Registry Record</Link><Link href="/artifacts/founding-demonstrations">Founding Demonstrations</Link><Link href="/artifacts/registry">Artifact Registry</Link></nav>
    </header>

    <section className="hero">
      <div className="badges"><span>OPEN GOVERNED DEMONSTRATION</span><span>PARTICIPANT FACTUAL REVIEW PENDING</span></div>
      <p className="eyebrow">VALIDATION STANDING ASSURANCE v1.0 · TA-14-AIGR-000025</p>
      <h1>A PASS can survive beside an unresolved condition.</h1>
      <p className="lede">VSA / COBIT-Chain Azure MCP Gateway R1 entered a bounded documentary review around one question: can three frozen read-only calls execute while every non-frozen route advertised by the authenticated live upstream catalog is refused before upstream execution?</p>
      <div className="finding"><span>CURRENT TA-14 DRAFT FINDING</span><strong>SUPPORTED - BOUNDED PASS</strong><p>The bounded containment proposition is supported by the admitted participant evidence. Catalog correspondence remains not established and travels with the PASS.</p></div>
      <div className="actions"><Link className="button primary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000025">Open VSA Registry Identity</Link><Link className="button secondary" href="/artifacts/founding-demonstrations/methodology">Review Demonstration Methodology</Link></div>
    </section>

    <section className="meta">
      <div><span>PARTICIPANT CHALLENGE</span><strong>TA14-VSA-GREG-R1-002</strong></div>
      <div><span>GATEWAY MODE</span><strong>r1-read-only</strong></div>
      <div><span>TA-14 FINDING RECORD ID</span><strong>PENDING ASSIGNMENT</strong></div>
      <div><span>PUBLICATION STATE</span><strong>OPEN DRAFT</strong></div>
    </section>

    <section className="section">
      <div className="heading"><p>01 · BOUNDED QUESTION</p><h2>One proposition, frozen before the finding.</h2></div>
      <div className="question">Can the deployed gateway execute its frozen read-only Azure MCP calls while containing the authenticated live upstream catalog so that every non-frozen advertised route is refused before upstream execution?</div>
      <div className="tool-row"><span>subscription_list</span><span>group_list</span><span>group_resource_list</span></div>
    </section>

    <section className="section split">
      <article className="panel support"><div className="heading compact"><p>02 · WHAT THE ADMITTED EVIDENCE SUPPORTS</p><h2>Bounded containment and restraint.</h2></div>{supported.map((x,i)=><div className="line positive" key={x}><b>{String(i+1).padStart(2,"0")}</b><p>{x}</p></div>)}</article>
      <article className="panel limit"><div className="heading compact"><p>03 · FINDING CEILING</p><h2>What the record does not establish.</h2></div>{limits.map((x,i)=><div className="line negative" key={x}><b>{String(i+1).padStart(2,"0")}</b><p>{x}</p></div>)}</article>
    </section>

    <section className="section unresolved">
      <p className="eyebrow">04 · MATERIAL UNRESOLVED CONDITION</p>
      <h2>catalog_correspondence_established: FALSE</h2>
      <p>The authenticated <code>tools/list</code> catalog did not advertise the three callable frozen aliases. The participant preserved that discrepancy instead of treating successful execution as proof of catalog correspondence.</p>
      <strong>This condition survives the bounded PASS.</strong>
    </section>

    <section className="section panel">
      <div className="heading"><p>05 · FINAL GOVERNED STATE</p><h2>Support and ceiling remain visible together.</h2></div>
      <div className="state-grid">{states.map(([label,value])=><div key={label}><span>{label}</span><strong className={value.includes("SUPPORTED")||value.includes("VERIFIED")?"good":value.includes("NOT ESTABLISHED")||value.includes("NOT PERFORMED")?"open":"pending"}>{value}</strong></div>)}</div>
    </section>

    <section className="section integrity">
      <div><p className="eyebrow">06 · EVIDENCE INTEGRITY</p><h2>Two digests, two different jobs.</h2></div>
      <div className="digest"><span>Canonical evidence-content SHA-256</span><code>18b0e4a8e668b13a64264c340ad1721a2404c3ba51331ec6bd321e951d575b27</code><p>Verified to match the participant-asserted digest under the documented canonicalization method.</p></div>
      <div className="digest"><span>Received file-byte SHA-256</span><code>8cc10f302788885a248497c7bcb7d262e03eb1045582b38d2c3a56ab7e86f112</code><p>Preserves the identity of the exact evidence file received by TA-14.</p></div>
      <p className="ceiling">Neither digest independently establishes the truth of the technical propositions contained in the evidence object.</p>
    </section>

    <section className="section declaration">
      <p className="eyebrow">07 · INSTITUTIONAL STATEMENT</p>
      <h2>The unresolved condition does not disappear because the bounded proposition passed.</h2>
      <p>The PASS does not disappear because an adjacent condition remains unresolved.</p>
      <strong>Both states travel together. That is the governed result.</strong>
    </section>

    <section className="section pending">
      <p className="eyebrow">08 · CURRENT CASE POSTURE</p><h2>Participant factual review is pending.</h2>
      <p>This public showcase reflects the current draft governed state. It is not a closed case, final certification, or participant endorsement of TA-14's wording. If a factual correction or dispute is submitted, the correction is evaluated against the evidence and preserved in chronology rather than silently rewriting the record.</p>
    </section>

    <footer><div><strong>TA-14 Authority Governance Institution</strong><span>VSA / COBIT-Chain Azure MCP Gateway R1 · Open Governed Demonstration</span></div><p>No claim beyond the evidence.</p></footer>

    <style jsx>{`:global(*){box-sizing:border-box}:global(html){background:#02060c}:global(body){margin:0;background:#02060c;color:#edf8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}:global(a){color:inherit;text-decoration:none}.page-shell{--gold:#f4ba54;--cyan:#64d9ff;--green:#69efb3;--amber:#ffc85b;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 85% 12%,rgba(27,126,188,.2),transparent 28%),radial-gradient(circle at 10% 45%,rgba(244,186,84,.11),transparent 26%),linear-gradient(180deg,#02060c,#071521 50%,#02060c)}.grid{position:absolute;inset:0;opacity:.11;pointer-events:none;background-image:linear-gradient(rgba(100,217,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(100,217,255,.09) 1px,transparent 1px);background-size:70px 70px}.glow{position:absolute;border-radius:50%;filter:blur(120px);opacity:.15;pointer-events:none}.glow-a{width:500px;height:500px;right:-200px;top:700px;background:#00a8ff}.glow-b{width:450px;height:450px;left:-200px;top:1900px;background:#e4a83e}.topbar{position:relative;z-index:10;min-height:76px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid rgba(100,217,255,.14);background:rgba(2,7,13,.88);backdrop-filter:blur(22px)}.brand{display:flex;align-items:center;gap:12px}.mark{width:43px;height:43px;display:grid;place-items:center;border-radius:13px;border:1px solid rgba(244,186,84,.58);color:var(--gold);font-weight:900;background:rgba(244,186,84,.09)}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.16em}.brand small{margin-top:3px;color:#83a7bd;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em}.topbar nav{display:flex;gap:22px;color:#9ab6c8;font-size:.8rem}.hero,.section,.meta{position:relative;z-index:2;width:min(1120px,90vw);margin:0 auto}.hero{padding:88px 0 58px}.badges{display:flex;gap:9px;flex-wrap:wrap}.badges span{padding:8px 11px;border-radius:999px;border:1px solid rgba(255,200,91,.35);background:rgba(255,200,91,.08);color:#ffd77e;font-size:.69rem;font-weight:900;letter-spacing:.1em}.eyebrow{color:#78dfff;font-weight:900;letter-spacing:.15em;text-transform:uppercase;font-size:.72rem}.hero h1{max-width:900px;margin:18px 0;font-size:clamp(3.2rem,7vw,6.8rem);line-height:.92;letter-spacing:-.055em}.lede{max-width:900px;color:#b8cedd;font-size:1.18rem;line-height:1.75}.finding{margin-top:34px;padding:26px 28px;border:1px solid rgba(105,239,179,.38);border-radius:20px;background:linear-gradient(135deg,rgba(26,102,77,.22),rgba(5,17,26,.76))}.finding span{display:block;color:#8af0c0;font-size:.72rem;font-weight:900;letter-spacing:.14em}.finding strong{display:block;margin:8px 0;font-size:2rem}.finding p{margin:0;color:#bcd4c9;line-height:1.65}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.button{display:inline-flex;align-items:center;min-height:48px;padding:0 18px;border-radius:12px;font-weight:850}.primary{background:linear-gradient(135deg,#d8aa4e,#9a6a1d);color:#06111b}.secondary{border:1px solid rgba(127,180,211,.28);background:rgba(255,255,255,.025);color:#c9dfed}.meta{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;border:1px solid rgba(127,180,211,.14);background:rgba(127,180,211,.14)}.meta div{padding:18px;background:#07121d}.meta span{display:block;color:#718da1;font-size:.64rem;font-weight:900;letter-spacing:.12em}.meta strong{display:block;margin-top:7px;font-size:.95rem}.section{padding:74px 0}.heading p{margin:0}.heading h2{margin:10px 0 28px;font-size:clamp(2rem,4vw,3.4rem);letter-spacing:-.035em}.heading.compact h2{font-size:2rem}.question{padding:28px;border-left:4px solid var(--cyan);background:rgba(100,217,255,.055);font-size:1.45rem;font-weight:760;line-height:1.55}.tool-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.tool-row span{padding:10px 13px;border:1px solid rgba(100,217,255,.2);border-radius:9px;background:#071622;color:#bdeeff;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.split{display:grid;grid-template-columns:1fr 1fr;gap:18px}.panel{padding:30px;border:1px solid rgba(126,177,207,.16);border-radius:22px;background:rgba(7,20,31,.78)}.line{display:grid;grid-template-columns:42px 1fr;gap:12px;padding:15px 0;border-top:1px solid rgba(255,255,255,.06)}.line b{width:34px;height:34px;display:grid;place-items:center;border-radius:10px}.line p{margin:0;color:#b8cad6;line-height:1.55}.positive b{background:rgba(105,239,179,.1);color:var(--green)}.negative b{background:rgba(255,200,91,.09);color:var(--amber)}.unresolved{padding:34px;margin-top:20px;border:1px solid rgba(255,200,91,.52);border-radius:22px;background:linear-gradient(135deg,rgba(102,70,9,.32),rgba(12,18,23,.8))}.unresolved h2{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:clamp(1.4rem,3vw,2.5rem);color:#ffd372}.unresolved p{max-width:900px;color:#d7c69c;line-height:1.7}.unresolved strong{color:#fff0c7}.state-grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(130,174,201,.13)}.state-grid div{display:flex;justify-content:space-between;gap:22px;padding:16px;border-bottom:1px solid rgba(130,174,201,.12);background:rgba(255,255,255,.015)}.state-grid span{color:#9fb5c4}.state-grid strong{text-align:right;font-size:.82rem}.good{color:#6ff0b5}.open{color:#ffd372}.pending{color:#93b8ce}.integrity{display:grid;gap:16px}.digest{padding:22px;border:1px solid rgba(100,217,255,.18);border-radius:16px;background:rgba(4,18,29,.7)}.digest span{display:block;color:#78dfff;font-size:.72rem;font-weight:900;letter-spacing:.1em}.digest code{display:block;margin:10px 0;overflow-wrap:anywhere;color:#eef8ff}.digest p,.ceiling{color:#9fb6c5;line-height:1.6}.declaration{border-top:1px solid rgba(105,239,179,.25);border-bottom:1px solid rgba(105,239,179,.25)}.declaration h2{max-width:900px;font-size:clamp(2.2rem,5vw,4.6rem);line-height:1.02;letter-spacing:-.045em}.declaration p{color:#b7cfca;font-size:1.1rem}.declaration strong{font-size:1.35rem;color:#80efbc}.pending p:last-child{max-width:950px;color:#abc0ce;line-height:1.75}.pending h2{font-size:2.7rem}.page-shell footer{position:relative;z-index:2;width:min(1120px,90vw);margin:0 auto;padding:36px 0 50px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:space-between;gap:30px;color:#7892a4}.page-shell footer strong,.page-shell footer span{display:block}.page-shell footer strong{color:#dbe8f0}.page-shell footer span{margin-top:5px;font-size:.8rem}.page-shell footer p{color:#d4aa58;font-weight:800}@media(max-width:850px){.topbar nav{display:none}.meta,.split,.state-grid{grid-template-columns:1fr}.hero{padding-top:60px}.state-grid div{align-items:flex-start;flex-direction:column}.state-grid strong{text-align:left}.page-shell footer{flex-direction:column}}`}</style>
  </main>;
}
