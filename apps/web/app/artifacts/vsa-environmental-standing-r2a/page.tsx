"use client";

import Link from "next/link";

const supported = [
  "Historical T0 qualification remains preserved while present proposition-specific standing changes under the declared changed-condition rules.",
  "The immaterial C1 display-label change does not withdraw standing from any proposition.",
  "The material C2 geometry, airflow, and load change selectively moves P3, P5, P6, and P7 into reassessment while P1, P2, and P4 remain supportable.",
  "At the governed T3 reassessment checkpoint, in-limit values, current calibration, green dashboards, and a high-confidence inference do not substitute for missing current representativeness or recovery evidence.",
  "E2 selectively restores P3 and P5 without restoring P6 or P7; E3 then restores P6 and permits P7 closure under the declared dependency logic.",
  "The frozen R2A package is replayable against the declared proposition graph, materiality rules, evidence registry, standing sequence, and explicit claims/non-claims boundary.",
] as const;

const limits = [
  "The demonstration does not establish autonomous or independent discovery of an otherwise unrepresented hidden physical/context drift.",
  "The demonstration is synthetic and does not establish real-facility qualification, GMP compliance, environmental safety, sterility assurance, product quality, or regulatory acceptance.",
  "The demonstration does not establish authority to operate, release, manufacture, compound, dispense, administer, or expose personnel.",
  "The demonstration does not establish TA-14 Environmental Integrity functionality, universal VSA validity, certification of VSA or COBIT-Chain, or universal production readiness.",
] as const;

const timeline = [
  ["T0", "BASELINE", "P1-P7 SUPPORTABLE", "Historical qualification established under QB1."],
  ["T1", "IMMATERIAL CHANGE", "NO WITHDRAWAL", "Display-label change leaves relied-upon physical/context basis unchanged."],
  ["T2", "MATERIAL C2", "SELECTIVE REASSESSMENT", "P3/P5/P6/P7 require reassessment; P1/P2/P4 remain supportable."],
  ["T3", "GOVERNED CHECKPOINT", "P3/P5/P6/P7 NOT ESTABLISHED", "Required current evidence remains absent despite calibrated, in-limit measurements."],
  ["T4", "E2 ADMITTED", "P3/P5 RESTORED", "Representativeness returns selectively; P6 and P7 remain not established."],
  ["T5", "E3 ADMITTED", "P6/P7 RESTORED", "Recovery evidence closes the final declared dependency."],
] as const;

export default function VsaEnvironmentalStandingR2A(){
  return <main className="page-shell">
    <div className="grid" />
    <div className="glow glow-a" />
    <div className="glow glow-b" />

    <header className="topbar">
      <Link href="/artifacts/founding-demonstrations" className="brand"><span className="mark">TA</span><span><strong>TA-14</strong><small>Governed Demonstration</small></span></Link>
      <nav>
        <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000025">VSA Registry Record</Link>
        <Link href="/artifacts/founding-demonstrations">Founding Demonstrations</Link>
        <Link href="/artifacts/registry">Artifact Registry</Link>
      </nav>
    </header>

    <section className="hero">
      <div className="badges"><span>FOUNDING DEMONSTRATION 06</span><span>INDEPENDENT TA-14 CHALLENGE COMPLETE</span><span>C01 PRESERVED</span></div>
      <p className="eyebrow">VALIDATION STANDING ASSURANCE v1.0 · TA-14-AIGR-000025</p>
      <h1>Historical truth can survive while present standing is withdrawn.</h1>
      <p className="lede">VSA Environmental Validation Standing Under Hidden Physical Context Drift tests whether historically supportable evidence can remain authentic while becoming insufficient for present proposition-specific standing after a material physical/context change - and whether standing can be restored only by evidence that actually closes the affected proposition.</p>

      <div className="finding">
        <span>TA-14 FINAL GOVERNED DETERMINATION</span>
        <strong>SUPPORTED - BOUNDED SYNTHETIC FOUNDING DEMONSTRATION</strong>
        <p>The frozen R2A evidence surface reproduces the declared standing transitions and selective restoration sequence. One epistemic boundary remains preserved without defeating support.</p>
      </div>

      <div className="actions">
        <a className="button primary" href="https://github.com/taiwoyusuf/cobit-chain/releases/tag/ta14-vsa-env-r2a" target="_blank" rel="noreferrer">Open Frozen R2A Release</a>
        <Link className="button secondary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000025">Open VSA Registry Identity</Link>
      </div>
    </section>

    <section className="meta">
      <div><span>TA-14 ARTIFACT ID</span><strong>TA14-EAR-000014</strong></div>
      <div><span>VSA CASE</span><strong>CASE 02 · ENVIRONMENTAL STANDING</strong></div>
      <div><span>FROZEN COMMIT</span><strong>51e8e358be5541fd88e5a398e22a4502cb7c8c35</strong></div>
      <div><span>PUBLICATION STATE</span><strong>PUBLISHED GOVERNED FINDING</strong></div>
    </section>

    <section className="section integrity">
      <div className="heading"><p>01 · FROZEN REVIEW BOUNDARY</p><h2>The evidence surface could not move after challenge.</h2></div>
      <div className="digest"><span>R2A PACKAGE MANIFEST SHA-256</span><code>4df161d27d088d1d284360bf2b7679bf7849fdfa65d921d2f04a107a54b20473</code><p>The manifest value identifies the participant-declared frozen package boundary used for TA-14's independent review.</p></div>
      <div className="digest"><span>GITHUB COMMIT</span><code>51e8e358be5541fd88e5a398e22a4502cb7c8c35</code><p>The published merge commit preserved the R2A technical evidence surface submitted for the second VSA Founding Demonstration.</p></div>
    </section>

    <section className="section split">
      <article className="panel support"><div className="heading compact"><p>02 · WHAT THE EVIDENCE SUPPORTS</p><h2>Standing follows applicability, not file existence.</h2></div>{supported.map((x,i)=><div className="line positive" key={x}><b>{String(i+1).padStart(2,"0")}</b><p>{x}</p></div>)}</article>
      <article className="panel limit"><div className="heading compact"><p>03 · FINDING CEILING</p><h2>What TA-14 does not infer.</h2></div>{limits.map((x,i)=><div className="line negative" key={x}><b>{String(i+1).padStart(2,"0")}</b><p>{x}</p></div>)}</article>
    </section>

    <section className="section condition">
      <p className="eyebrow">04 · PRESERVED CONDITION C01</p>
      <h2>Hidden-drift detection is not established.</h2>
      <p>The admitted record establishes governance of validation standing after C2 is represented within the evidence surface. It does not establish autonomous sensing, discovery, or inference of an otherwise unknown physical/context change.</p>
      <strong>This boundary survives the SUPPORT determination.</strong>
    </section>

    <section className="section">
      <div className="heading"><p>05 · STANDING SEQUENCE</p><h2>Historical state remains intact while current standing changes.</h2></div>
      <div className="timeline">{timeline.map(([time,event,state,text])=><article key={time}><div className="time">{time}</div><div><span>{event}</span><strong>{state}</strong><p>{text}</p></div></article>)}</div>
    </section>

    <section className="section invariants">
      <p className="eyebrow">06 · REPRODUCED GOVERNANCE INVARIANTS</p>
      <h2>The demonstration works because these are not synonyms.</h2>
      <div className="invariant-grid">
        <div>HISTORICAL QUALIFICATION <b>!=</b> CURRENT VALIDATION STANDING</div>
        <div>CALIBRATED <b>!=</b> REPRESENTATIVE</div>
        <div>WITHIN LIMITS <b>!=</b> CURRENT STANDING</div>
        <div>AUTHENTIC EVIDENCE <b>!=</b> CURRENTLY APPLICABLE EVIDENCE</div>
        <div>SAME NUMERICAL VALUE <b>!=</b> SAME EVIDENTIARY STANDING</div>
        <div>RESTORED SUPPORT <b>!=</b> CONTAGIOUS RESTORATION</div>
      </div>
    </section>

    <section className="section declaration">
      <p className="eyebrow">07 · TA-14 INSTITUTIONAL FINDING</p>
      <h2>The past was not rewritten. The present was re-qualified.</h2>
      <p>A previously supportable evidentiary state was subjected to a material changed-condition basis. Unaffected propositions retained standing. Affected propositions lost present standing where required current evidence was absent. Historical supportability remained preserved. Restoration occurred only when proposition-specific current evidence closed the declared deficiency.</p>
      <strong>No claim beyond the evidence.</strong>
    </section>

    <section className="section lineage">
      <p className="eyebrow">08 · VSA GOVERNED LINEAGE</p>
      <h2>One registry identity. Multiple bounded demonstrations.</h2>
      <div className="lineage-row">
        <Link href="/artifacts/vsa-cobit-chain-r1"><span>CASE 01</span><strong>Azure MCP execution containment</strong><small>Bounded PASS with unresolved catalog-correspondence condition</small></Link>
        <b>→</b>
        <div className="current"><span>CASE 02</span><strong>Environmental validation standing</strong><small>Supported with C01 drift-detection boundary preserved</small></div>
      </div>
    </section>

    <footer><div><strong>TA-14 Authority Governance Institution</strong><span>VSA Environmental Validation Standing · Founding Demonstration 06</span></div><p>No admissible evidence. No admissible execution.</p></footer>

    <style jsx>{`:global(*){box-sizing:border-box}:global(html){background:#02060c;scroll-behavior:smooth}:global(body){margin:0;background:#02060c;color:#edf8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}:global(a){color:inherit;text-decoration:none}.page-shell{--gold:#f4ba54;--cyan:#64d9ff;--green:#69efb3;--amber:#ffc85b;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 82% 10%,rgba(22,127,185,.2),transparent 28%),radial-gradient(circle at 8% 50%,rgba(244,186,84,.11),transparent 27%),linear-gradient(180deg,#02060c,#071521 50%,#02060c)}.grid{position:absolute;inset:0;opacity:.1;pointer-events:none;background-image:linear-gradient(rgba(100,217,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(100,217,255,.08) 1px,transparent 1px);background-size:70px 70px}.glow{position:absolute;border-radius:50%;filter:blur(120px);opacity:.15;pointer-events:none}.glow-a{width:500px;height:500px;right:-200px;top:750px;background:#00a8ff}.glow-b{width:450px;height:450px;left:-220px;top:2300px;background:#e4a83e}.topbar{position:relative;z-index:10;min-height:76px;padding:0 5vw;display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid rgba(100,217,255,.14);background:rgba(2,7,13,.88);backdrop-filter:blur(22px)}.brand{display:flex;align-items:center;gap:12px}.mark{width:43px;height:43px;display:grid;place-items:center;border-radius:13px;border:1px solid rgba(244,186,84,.58);color:var(--gold);font-weight:900;background:rgba(244,186,84,.09)}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.16em}.brand small{margin-top:3px;color:#83a7bd;font-size:.68rem;text-transform:uppercase;letter-spacing:.1em}.topbar nav{display:flex;gap:22px;color:#9ab6c8;font-size:.8rem}.hero,.section,.meta{position:relative;z-index:2;width:min(1120px,90vw);margin:0 auto}.hero{padding:88px 0 58px}.badges{display:flex;gap:9px;flex-wrap:wrap}.badges span{padding:8px 11px;border-radius:999px;border:1px solid rgba(105,239,179,.35);background:rgba(105,239,179,.07);color:#8af0c0;font-size:.69rem;font-weight:900;letter-spacing:.1em}.eyebrow{color:#78dfff;font-weight:900;letter-spacing:.15em;text-transform:uppercase;font-size:.72rem}.hero h1{max-width:980px;margin:18px 0;font-size:clamp(3rem,7vw,6.5rem);line-height:.94;letter-spacing:-.055em}.lede{max-width:940px;color:#b8cedd;font-size:1.15rem;line-height:1.75}.finding{margin-top:34px;padding:26px 28px;border:1px solid rgba(105,239,179,.38);border-radius:20px;background:linear-gradient(135deg,rgba(26,102,77,.22),rgba(5,17,26,.76))}.finding span{display:block;color:#8af0c0;font-size:.72rem;font-weight:900;letter-spacing:.14em}.finding strong{display:block;margin:8px 0;font-size:clamp(1.35rem,3vw,2rem)}.finding p{margin:0;color:#bcd4c9;line-height:1.65}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.button{display:inline-flex;align-items:center;min-height:48px;padding:0 18px;border-radius:12px;font-weight:850}.primary{background:linear-gradient(135deg,#d8aa4e,#9a6a1d);color:#06111b}.secondary{border:1px solid rgba(127,180,211,.28);background:rgba(255,255,255,.025);color:#c9dfed}.meta{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;border:1px solid rgba(127,180,211,.14);background:rgba(127,180,211,.14)}.meta div{padding:18px;background:#07121d;overflow-wrap:anywhere}.meta span{display:block;color:#718da1;font-size:.64rem;font-weight:900;letter-spacing:.12em}.meta strong{display:block;margin-top:7px;font-size:.84rem}.section{padding:72px 0}.heading p{margin:0;color:#78dfff;font-weight:900;letter-spacing:.13em;font-size:.7rem}.heading h2{margin:10px 0 28px;font-size:clamp(2rem,4vw,3.3rem);letter-spacing:-.035em}.heading.compact h2{font-size:2rem}.split{display:grid;grid-template-columns:1fr 1fr;gap:18px}.panel{padding:30px;border:1px solid rgba(126,177,207,.16);border-radius:22px;background:rgba(7,20,31,.78)}.line{display:grid;grid-template-columns:42px 1fr;gap:12px;padding:15px 0;border-top:1px solid rgba(255,255,255,.06)}.line b{width:34px;height:34px;display:grid;place-items:center;border-radius:10px}.line p{margin:0;color:#b8cad6;line-height:1.55}.positive b{background:rgba(105,239,179,.1);color:var(--green)}.negative b{background:rgba(255,200,91,.09);color:var(--amber)}.condition{padding:34px;margin-top:20px;border:1px solid rgba(255,200,91,.52);border-radius:22px;background:linear-gradient(135deg,rgba(102,70,9,.32),rgba(12,18,23,.8))}.condition h2{font-size:clamp(2rem,4vw,3.4rem);color:#ffd372}.condition p{max-width:900px;color:#d7c69c;line-height:1.7}.condition strong{color:#fff0c7}.integrity{display:grid;gap:16px}.digest{padding:22px;border:1px solid rgba(100,217,255,.18);border-radius:16px;background:rgba(4,18,29,.7)}.digest span{display:block;color:#78dfff;font-size:.72rem;font-weight:900;letter-spacing:.12em}.digest code{display:block;margin:10px 0;color:#fff3c8;word-break:break-all;font-size:.88rem}.digest p{margin:0;color:#9db6c6;line-height:1.6}.timeline{display:grid;gap:10px}.timeline article{display:grid;grid-template-columns:74px 1fr;gap:18px;padding:19px;border:1px solid rgba(126,177,207,.15);border-radius:15px;background:rgba(6,18,28,.72)}.time{display:grid;place-items:center;min-height:66px;border-radius:12px;background:rgba(100,217,255,.08);color:#78dfff;font-weight:950;font-size:1.15rem}.timeline span{display:block;color:#7898ab;font-size:.7rem;font-weight:900;letter-spacing:.1em}.timeline strong{display:block;margin:6px 0;color:#ecf9ff}.timeline p{margin:0;color:#9db6c6;line-height:1.5}.invariants{text-align:center}.invariant-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:28px;text-align:left}.invariant-grid div{padding:22px;border:1px solid rgba(100,217,255,.15);border-radius:14px;background:rgba(4,18,29,.7);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#cceeff}.invariant-grid b{color:#ffd372}.declaration{padding:48px;border-top:1px solid rgba(244,186,84,.25);border-bottom:1px solid rgba(244,186,84,.25);text-align:center}.declaration h2{font-size:clamp(2.2rem,5vw,4rem);letter-spacing:-.04em}.declaration p{max-width:900px;margin:0 auto;color:#b4cad8;line-height:1.8}.declaration strong{display:block;margin-top:24px;color:#f4ba54;letter-spacing:.08em}.lineage h2{font-size:clamp(2rem,4vw,3.2rem)}.lineage-row{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:stretch}.lineage-row>a,.lineage-row .current{padding:24px;border:1px solid rgba(100,217,255,.16);border-radius:18px;background:rgba(7,20,31,.78)}.lineage-row span{display:block;color:#78dfff;font-size:.7rem;font-weight:900;letter-spacing:.12em}.lineage-row strong{display:block;margin:9px 0;font-size:1.25rem}.lineage-row small{color:#92adbd;line-height:1.5}.lineage-row>b{align-self:center;color:#f4ba54;font-size:1.8rem}footer{position:relative;z-index:2;width:min(1120px,90vw);margin:30px auto 0;padding:35px 0 48px;border-top:1px solid rgba(126,177,207,.14);display:flex;justify-content:space-between;gap:20px;color:#7693a6}footer strong,footer span{display:block}footer strong{color:#dcecf6}footer span{margin-top:5px;font-size:.78rem}footer p{margin:0;color:#f4ba54;font-weight:800}@media(max-width:820px){.topbar{align-items:flex-start;padding-top:16px;padding-bottom:16px}.topbar nav{display:none}.hero{padding-top:62px}.meta,.split,.invariant-grid{grid-template-columns:1fr}.lineage-row{grid-template-columns:1fr}.lineage-row>b{transform:rotate(90deg);justify-self:center}.timeline article{grid-template-columns:58px 1fr}footer{display:block}footer p{margin-top:18px}}`}</style>
  </main>;
}
