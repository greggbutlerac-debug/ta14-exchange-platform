"use client";

import Link from "next/link";

const lineage = [
  "Harmonic Version 1.0",
  "Registered Baseline",
  "Frozen Demonstration",
  "Evidence Admission",
  "TA-14 Independent Finding",
  "Participant Review",
  "Engineering Learning",
  "Separate Version 2 Development",
];

const demonstrated = [
  "The evaluated implementation was Harmonic Constitutional Runtime Version 1.0 under the registered governance identity TA-14-AIGR-000008.",
  "The implementation was frozen before the bounded demonstration rather than modified in response to observations during review.",
  "The admitted runtime artifact recorded a refusal / block determination under the constitutional state represented within the submitted execution packet.",
  "The evidence supported that the frozen runtime reconstructed the constitutional state represented within the packet and produced its own determination.",
];

const notIndependentlyDemonstrated = [
  "The complete pre-change authority state outside the runtime packet.",
  "An independently attributable authority-revocation event establishing the surrounding institutional chronology.",
  "An independently preserved post-change authority state outside the runtime artifact.",
  "An external outcome record independently confirming that the consequential execution did not occur.",
];

const engineeringResponse = [
  "Independently attributable institutional evidence objects.",
  "Constitutional state snapshots.",
  "Constitutional receipts.",
  "Execution outcomes.",
  "Replay artifacts.",
  "Evidence bundles that compose with the runtime rather than being silently folded into Version 1.0.",
];

export default function HarmonicArtifactPage() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grid" />

      <header className="topbar">
        <Link href="/artifacts/registry" className="brand">
          <span className="mark">TA</span>
          <span><strong>TA-14</strong><small>Execution Artifact Registry</small></span>
        </Link>
        <nav>
          <Link href="/artifacts/registry">Registry</Link>
          <Link href="/workspace/ai-governance/registry/profiles/harmonic-constitutional-runtime">Governance Profile</Link>
          <Link href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
          <Link href="/academy/case-studies/harmonic-fd-2026-0002-case-001">Academy Lesson</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="badge external">FIRST EXTERNAL GOVERNANCE ARTIFACT</span>
            <span className="badge published">PUBLISHED</span>
          </div>
          <p className="kicker">TA14-EAR-000013 · FD-2026-0002 · CASE 001</p>
          <h1>Authority Revoked Before Consequential Execution</h1>
          <p className="lede">
            Harmonic Constitutional Runtime Version 1.0 entered a bounded TA-14 demonstration and produced a runtime refusal / block determination under the constitutional state represented in the admitted execution packet. The public record preserves both what the runtime demonstrated and what the surrounding evidence did not independently establish.
          </p>

          <div className="finding-banner">
            <span>TA-14 INDEPENDENT FINDING</span>
            <strong>PARTIALLY DEMONSTRATED — EVIDENCE-BOUNDED</strong>
            <p>Runtime behavior demonstrated. Full surrounding chronology not independently demonstrated.</p>
          </div>

          <div className="hero-actions">
            <Link className="button primary" href="/workspace/ai-governance/registry/profiles/harmonic-constitutional-runtime">Open Harmonic Governance Profile</Link>
            <Link className="button secondary" href="/workspace/ai-governance/reviews">Open Reviews & Responses</Link>
            <Link className="button secondary" href="/artifacts/fd-2026-0002-case-002">Continue to Case 002</Link>
            <Link className="button academy" href="/academy/case-studies/harmonic-fd-2026-0002-case-001">Open TA-14 Academy Lesson</Link>
            <Link className="button ghost" href="/artifacts/registry">Return to Artifact Registry</Link>
          </div>
        </div>

        <aside className="identity-card">
          <div className="identity-head">
            <span>REGISTERED GOVERNANCE</span>
            <strong>TA-14-AIGR-000008</strong>
          </div>
          <dl>
            <div><dt>Governance</dt><dd>Harmonic Constitutional Runtime</dd></div>
            <div><dt>Steward</dt><dd>Timothy E. Zlomke</dd></div>
            <div><dt>Organization</dt><dd>Moral Clarity AI</dd></div>
            <div><dt>Registered version</dt><dd>1.0</dd></div>
            <div><dt>Demonstration</dt><dd>FD-2026-0002</dd></div>
            <div><dt>Case</dt><dd>Case 001</dd></div>
            <div><dt>Runtime determination</dt><dd className="deny">REFUSAL / BLOCK</dd></div>
            <div><dt>Registry determination class</dt><dd className="deny">DENY</dd></div>
            <div><dt>Verification level</dt><dd>L3 · bounded runtime evidence</dd></div>
            <div><dt>Repository publication date</dt><dd>August 7, 2026 · exact artifact publication time not declared in the preserved repository record</dd></div>
            <div><dt>Package root hash</dt><dd>Not published in the repository export supplied for this build</dd></div>
          </dl>
        </aside>
      </section>

      <section className="principle-strip">
        <div><span>01</span><strong>Preserve what was demonstrated.</strong></div>
        <div><span>02</span><strong>Preserve what remained unproven.</strong></div>
        <div><span>03</span><strong>Do not rewrite the evaluated version.</strong></div>
        <div><span>04</span><strong>Let later engineering build the bridge.</strong></div>
      </section>

      <section className="content-shell">
        <article className="panel split-panel">
          <div>
            <p className="section-kicker">WHAT THE EVIDENCE SUPPORTS</p>
            <h2>Runtime behavior was demonstrated.</h2>
            <p>
              The Exchange does not convert the participant's architecture into TA-14 and does not convert a bounded runtime result into a universal capability claim. This record is limited to the frozen Version 1.0 demonstration and the admitted evidence associated with Case 001.
            </p>
          </div>
          <div className="check-list">
            {demonstrated.map((item) => <div key={item}><span>✓</span><p>{item}</p></div>)}
          </div>
        </article>

        <article className="panel split-panel boundary-panel">
          <div>
            <p className="section-kicker">EVIDENTIARY BOUNDARY</p>
            <h2>The surrounding chronology remained incomplete.</h2>
            <p>
              TA-14 did not treat missing surrounding records as though they existed. The finding therefore remained <strong>PARTIALLY DEMONSTRATED — EVIDENCE-BOUNDED</strong> rather than being expanded into a stronger institutional conclusion.
            </p>
          </div>
          <div className="boundary-list">
            {notIndependentlyDemonstrated.map((item) => <div key={item}><span>!</span><p>{item}</p></div>)}
          </div>
        </article>

        <article className="panel lineage-panel">
          <p className="section-kicker">PRESERVED LINEAGE</p>
          <h2>Version 2 does not erase Version 1.</h2>
          <p className="intro">
            The institutional value of the case is the preserved progression. Harmonic's participant review states that the Case 001 finding directly influenced subsequent Version 2 engineering. The Exchange keeps that learning visible without retroactively changing the frozen Version 1.0 record.
          </p>
          <div className="lineage">
            {lineage.map((item, index) => (
              <div className="lineage-step" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < lineage.length - 1 && <b>→</b>}
              </div>
            ))}
          </div>
        </article>

        <article className="panel response-panel">
          <div>
            <p className="section-kicker">ENGINEERING RESPONSE</p>
            <h2>The exposed gap became a bridge-building requirement.</h2>
            <p>
              In his preserved Participant Review, Timothy E. Zlomke states that the evidentiary boundary directly influenced the subsequent Harmonic engineering work. Rather than altering the frozen implementation, a separate Version 2 lineage was begun around stronger institutional evidence objects and replayability.
            </p>
          </div>
          <div className="response-grid">
            {engineeringResponse.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
          </div>
        </article>

        <article className="panel institutional-panel">
          <div className="institutional-copy">
            <p className="section-kicker">WHY THIS ARTIFACT MATTERS</p>
            <h2>The Exchange worked exactly as intended.</h2>
            <p>
              This is the first externally registered governance execution artifact connected to an outside governance identity in the Exchange. Its value is not that TA-14 declared Harmonic "right" or "wrong." Its value is that the process separated demonstrated runtime behavior from unsupported surrounding inference, preserved the participant's independent voice, and created a record capable of shaping future engineering without rewriting the past.
            </p>
          </div>
          <div className="formula">
            <span>EVIDENCE</span><b>→</b><span>GAP</span><b>→</b><span>UNDERSTANDING</span><b>→</b><span>ENGINEERING RESPONSE</span><b>→</b><span>STRONGER FUTURE EVIDENCE</span>
          </div>
        </article>

        <article className="claims-grid">
          <div className="claim-card proves">
            <span>WHAT THIS ARTIFACT PROVES</span>
            <h3>Bounded runtime behavior under the submitted constitutional state.</h3>
            <p>
              The admitted evidence supports that the frozen Harmonic Version 1.0 runtime reconstructed the constitutional state represented within the submitted packet and produced its own refusal / block determination for FD-2026-0002 Case 001.
            </p>
          </div>
          <div className="claim-card limits">
            <span>WHAT THIS ARTIFACT DOES NOT PROVE</span>
            <h3>No universal capability claim and no invented surrounding chronology.</h3>
            <p>
              The artifact does not independently establish the complete institutional sequence outside the runtime, does not certify Harmonic, does not validate every Harmonic claim, and does not establish behavior outside the frozen Version 1.0 case and admitted evidence.
            </p>
          </div>
        </article>
      </section>

      <section className="closing">
        <p>TA-14 AUTHORITY · EXECUTION ARTIFACT REGISTRY</p>
        <h2>Expose the gap. Preserve the record. Build the bridge before consequence binds.</h2>
        <div>
          <Link className="button primary" href="/artifacts/fd-2026-0002-case-002">Continue to Case 002</Link>
          <Link className="button secondary" href="/artifacts/registry">Inspect Registry</Link>
          <Link className="button secondary" href="/artifacts/challenge?artifact=FD-2026-0002-CASE-001">Challenge This Record</Link>
        </div>
      </section>

      <footer>
        <div><strong>TA-14 Execution Artifact Registry</strong><span>External Governance Artifact · TA14-EAR-000013</span></div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box} :global(html){background:#02060c;scroll-behavior:smooth} :global(body){margin:0;background:#02060c;color:#edf8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif} :global(a){color:inherit;text-decoration:none}
        .page-shell{--gold:#f4ba54;--blue:#63d8ff;--green:#67efb0;--red:#ff737f;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 78% 8%,rgba(26,109,158,.23),transparent 30%),radial-gradient(circle at 14% 35%,rgba(244,186,84,.12),transparent 24%),linear-gradient(180deg,#02060c 0%,#06111d 48%,#02060c 100%)}
        .grid{position:absolute;inset:0;pointer-events:none;opacity:.14;background-image:linear-gradient(rgba(95,205,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(95,205,255,.08) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,black,transparent 82%)}
        .ambient{position:absolute;border-radius:50%;filter:blur(110px);opacity:.22;pointer-events:none}.ambient-a{width:560px;height:560px;right:-180px;top:320px;background:#00a8ff}.ambient-b{width:520px;height:520px;left:-260px;top:1040px;background:#d8993a}
        .topbar{min-height:78px;position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(143,222,255,.13);background:rgba(2,7,13,.9);backdrop-filter:blur(24px)}
        .brand{display:flex;align-items:center;gap:12px}.mark{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(244,186,84,.62);border-radius:13px;color:var(--gold);font-weight:900;background:linear-gradient(145deg,rgba(244,186,84,.2),rgba(12,23,37,.9))}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.18em;font-size:.92rem}.brand small{margin-top:3px;color:#87a8bd;font-size:.68rem;letter-spacing:.11em;text-transform:uppercase}.topbar nav{display:flex;gap:26px;color:#9ab6c8;font-size:.82rem}.topbar nav a:hover{color:white}
        .hero{position:relative;z-index:2;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:1.12fr .88fr;gap:60px;align-items:center;padding:100px 5vw 80px}.hero-copy{max-width:850px}.eyebrow-row{display:flex;gap:10px;flex-wrap:wrap}.badge{display:inline-flex;align-items:center;border-radius:999px;padding:8px 12px;font-size:.7rem;font-weight:900;letter-spacing:.12em}.external{border:1px solid rgba(244,186,84,.45);background:rgba(244,186,84,.12);color:#ffd785}.published{border:1px solid rgba(103,239,176,.4);background:rgba(103,239,176,.1);color:#93ffd0}.kicker{margin:24px 0 10px;color:#80cfea;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase}.hero h1{font-size:clamp(3rem,6vw,6.6rem);line-height:.93;letter-spacing:-.045em;margin:0;max-width:980px}.lede{font-size:1.13rem;line-height:1.75;color:#b8cedc;max-width:820px;margin:28px 0}.finding-banner{margin-top:30px;padding:22px 24px;border:1px solid rgba(244,186,84,.32);border-radius:20px;background:linear-gradient(135deg,rgba(244,186,84,.09),rgba(17,43,65,.55))}.finding-banner span{display:block;color:#edbd69;font-size:.7rem;letter-spacing:.16em;font-weight:900}.finding-banner strong{display:block;margin:8px 0;font-size:1.25rem}.finding-banner p{margin:0;color:#bfd0da}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button{display:inline-flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:12px;font-weight:850;font-size:.82rem;border:1px solid rgba(143,222,255,.2)}.primary{background:linear-gradient(135deg,#0a95cb,#126284);color:white}.secondary{background:rgba(14,34,52,.75);color:#cdeefe}.academy{background:linear-gradient(135deg,rgba(244,186,84,.22),rgba(117,76,20,.42));border-color:rgba(244,186,84,.42);color:#ffe1a1}.ghost{background:transparent;color:#9db7c7}
        .identity-card{border:1px solid rgba(143,222,255,.18);border-radius:26px;padding:26px;background:linear-gradient(180deg,rgba(7,18,31,.93),rgba(6,14,24,.82));box-shadow:0 28px 80px rgba(0,0,0,.34),inset 0 0 50px rgba(99,216,255,.03)}.identity-head{padding-bottom:18px;border-bottom:1px solid rgba(143,222,255,.12)}.identity-head span{display:block;color:#8ba8ba;font-size:.68rem;letter-spacing:.16em}.identity-head strong{display:block;margin-top:7px;color:#fff;font-size:1.35rem}.identity-card dl{margin:10px 0 0}.identity-card dl div{display:grid;grid-template-columns:150px 1fr;gap:16px;padding:13px 0;border-bottom:1px solid rgba(143,222,255,.09)}dt{color:#7896aa;font-size:.76rem}dd{margin:0;color:#e7f6ff;font-size:.86rem;line-height:1.5}.deny{color:#ff929b!important;font-weight:900}
        .principle-strip{position:relative;z-index:2;max-width:1500px;margin:0 auto 80px;padding:0 5vw;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.principle-strip div{border:1px solid rgba(143,222,255,.13);border-radius:16px;padding:18px;background:rgba(7,18,31,.7);display:flex;gap:12px;align-items:center}.principle-strip span{color:var(--gold);font-weight:900}.principle-strip strong{font-size:.88rem;line-height:1.45}
        .content-shell{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:0 5vw 100px;display:grid;gap:22px}.panel,.claim-card{border:1px solid rgba(143,222,255,.14);border-radius:24px;background:rgba(7,18,31,.78);box-shadow:0 20px 60px rgba(0,0,0,.2)}.panel{padding:34px}.split-panel{display:grid;grid-template-columns:.88fr 1.12fr;gap:44px;align-items:start}.section-kicker{margin:0 0 10px;color:#7dcde9;font-size:.7rem;font-weight:900;letter-spacing:.16em}.panel h2{font-size:clamp(1.8rem,3vw,3.1rem);line-height:1.06;margin:0 0 16px}.panel p{color:#a9c0cf;line-height:1.75}.check-list,.boundary-list{display:grid;gap:10px}.check-list div,.boundary-list div{display:grid;grid-template-columns:34px 1fr;gap:12px;align-items:start;padding:15px;border-radius:14px;background:rgba(11,28,44,.8);border:1px solid rgba(143,222,255,.08)}.check-list span{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:rgba(103,239,176,.12);color:#7ff6bd;font-weight:900}.boundary-list span{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:rgba(255,115,127,.1);color:#ff8a94;font-weight:900}.check-list p,.boundary-list p{margin:0;color:#d1e2eb;line-height:1.55}.boundary-panel{border-color:rgba(255,115,127,.18)}
        .lineage-panel .intro{max-width:1050px}.lineage{margin-top:30px;display:flex;gap:8px;align-items:stretch;overflow-x:auto;padding-bottom:6px}.lineage-step{min-width:155px;flex:1;position:relative;padding:18px;border-radius:15px;background:rgba(11,28,44,.85);border:1px solid rgba(143,222,255,.1)}.lineage-step span{display:block;color:#f3bf65;font-size:.72rem}.lineage-step strong{display:block;margin-top:7px;font-size:.82rem;line-height:1.35}.lineage-step b{position:absolute;right:-8px;top:50%;z-index:2;color:#5ebcdc}
        .response-panel{display:grid;grid-template-columns:.9fr 1.1fr;gap:42px}.response-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.response-grid div{padding:17px;border-radius:14px;background:rgba(11,28,44,.82);border:1px solid rgba(143,222,255,.09)}.response-grid span{display:block;color:#7ccfee;font-size:.7rem;font-weight:900}.response-grid strong{display:block;margin-top:6px;font-size:.86rem;line-height:1.45}
        .institutional-panel{background:linear-gradient(135deg,rgba(244,186,84,.1),rgba(7,18,31,.86) 45%,rgba(99,216,255,.06))}.institutional-copy{max-width:1100px}.formula{margin-top:28px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:18px;border:1px solid rgba(244,186,84,.2);border-radius:16px;background:rgba(2,9,16,.52)}.formula span{font-size:.74rem;font-weight:900;letter-spacing:.08em;color:#e9f6fd}.formula b{color:var(--gold)}
        .claims-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.claim-card{padding:30px}.claim-card span{font-size:.7rem;font-weight:900;letter-spacing:.15em}.claim-card h3{font-size:1.5rem;line-height:1.15;margin:10px 0}.claim-card p{color:#a9c0cf;line-height:1.7}.proves{border-color:rgba(103,239,176,.2)}.proves span{color:#7ff6bd}.limits{border-color:rgba(255,115,127,.18)}.limits span{color:#ff8f98}
        .closing{position:relative;z-index:2;text-align:center;padding:90px 5vw;border-top:1px solid rgba(143,222,255,.1);background:radial-gradient(circle at 50% 100%,rgba(244,186,84,.1),transparent 45%)}.closing p{color:#e2b969;font-size:.72rem;letter-spacing:.18em;font-weight:900}.closing h2{max-width:950px;margin:12px auto 28px;font-size:clamp(2rem,4vw,4.1rem);line-height:1.05}.closing div{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}footer{position:relative;z-index:2;min-height:110px;padding:30px 5vw;border-top:1px solid rgba(143,222,255,.1);display:flex;align-items:center;justify-content:space-between;gap:24px;color:#7897aa}footer strong,footer span{display:block}footer strong{color:#e8f7ff}footer span{margin-top:5px;font-size:.76rem}footer p{font-size:.78rem;letter-spacing:.08em}
        @media(max-width:1000px){.hero,.split-panel,.response-panel{grid-template-columns:1fr}.principle-strip{grid-template-columns:1fr 1fr}.claims-grid{grid-template-columns:1fr}.topbar nav{display:none}.hero{padding-top:70px}.identity-card dl div{grid-template-columns:1fr}.response-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:650px){.principle-strip{grid-template-columns:1fr}.response-grid{grid-template-columns:1fr}.hero h1{font-size:2.8rem}.topbar{padding:0 18px}.hero,.principle-strip,.content-shell{padding-left:18px;padding-right:18px}.panel,.claim-card{padding:22px}.lineage{display:grid}.lineage-step b{display:none}footer{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
