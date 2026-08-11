"use client";

import Link from "next/link";

const demonstrations = [
  {
    number: "01",
    governance: "Harmonic Constitutional Runtime",
    registry: "TA-14-AIGR-000008",
    caseId: "FD-2026-0002 · CASE 001",
    artifactId: "TA14-EAR-000013",
    artifactClass: "BOUNDED RUNTIME DEMONSTRATION",
    title: "Authority Revoked Before Consequential Execution",
    finding: "PARTIALLY DEMONSTRATED — EVIDENCE-BOUNDED",
    findingShort: "Evidence-bounded runtime demonstration",
    story: "The runtime behavior was demonstrated, but the complete surrounding institutional chronology was not independently demonstrated. TA-14 preserved both facts instead of converting a successful bounded runtime result into a broader institutional claim.",
    proves: [
      "A frozen external governance runtime can enter a bounded TA-14 demonstration without becoming TA-14.",
      "The admitted runtime artifact can support a refusal / block determination under the submitted constitutional state.",
      "TA-14 can preserve demonstrated runtime behavior while refusing to invent missing surrounding chronology.",
      "A bounded finding can create engineering value without rewriting the evaluated version.",
    ],
    doesNotProve: [
      "Complete pre-change authority chronology outside the admitted runtime packet.",
      "Independent proof of every surrounding institutional state transition.",
      "Universal Harmonic capability or production readiness.",
      "Certification, endorsement, or validation beyond the frozen Version 1.0 case.",
    ],
    lesson: "Evidence determines the ceiling of the finding.",
    href: "/artifacts/fd-2026-0002-case-001",
    registryHref: "/workspace/ai-governance/registry/records/TA-14-AIGR-000008",
    tone: "blue",
  },
  {
    number: "02",
    governance: "Harmonic Constitutional Runtime",
    registry: "TA-14-AIGR-000010",
    caseId: "FD-2026-0002 · CASE 002",
    artifactId: "HARMONIC ARTIFACT 002",
    artifactClass: "EVIDENCE ADVANCEMENT REVIEW",
    title: "Version 2 Evidence Advancement and Runtime Validation Boundary",
    finding: "ARCHITECTURAL ADVANCEMENT SUPPORTED — RUNTIME VALIDATION OPEN",
    findingShort: "Partial Admissibility",
    story: "A separate Version 2 evidence package materially advanced declaration, lineage, validation methodology, independent architectural exercise, and implementation-freeze attribution. TA-14 preserved the advancement while leaving executable proof through Binding, Commit, Execution, and Outcome open.",
    proves: [
      "A later governance version can stand on its own Registry identity and evidence rather than inheriting earlier findings.",
      "Architecture, methodology, provenance, and implementation attribution can materially advance before executable validation is complete.",
      "The Exchange can preserve progression without retroactively upgrading the original Version 1 record.",
      "Open proof surfaces can remain visible as explicit future evidence requirements.",
    ],
    doesNotProve: [
      "End-to-end execution of the frozen Version 2 runtime under a materially changed-state scenario.",
      "Non-bypassable Binding, Commit, or Execution control.",
      "A complete runtime receipt/replay chain tied to downstream effect.",
      "Production validation, certification, or universal Version 2 performance.",
    ],
    lesson: "Progression should be visible without inheritance or historical rewrite.",
    href: "/artifacts/fd-2026-0002-case-002",
    registryHref: "/workspace/ai-governance/registry/records/TA-14-AIGR-000010",
    tone: "gold",
  },
  {
    number: "03",
    governance: "Shango MID",
    registry: "TA-14-AIGR-000011",
    caseId: "FD-2026-0005",
    artifactId: "FD-2026-0005-GFR",
    artifactClass: "GOVERNED FINDING · CLOSED CASE",
    title: "Evidence Can Support a Narrower Truth Than the Claim",
    finding: "PARTIALLY SUPPORTED — UNCHANGED",
    findingShort: "Controlled closure",
    story: "Shango MID moved through evidence integrity, admission, technical review, governed finding, factual correction, Registry-side version verification, and administrative closure. The correction narrowed the governed description but did not manufacture a stronger technical finding.",
    proves: [
      "TA-14 can carry a governed case from bounded entry through controlled administrative closure.",
      "A correction can be evaluated against evidence rather than accepted as self-authenticating.",
      "Administrative verification can resolve identity/version state without upgrading the technical finding.",
      "The public governance record can be published while protected evidence files remain non-public.",
    ],
    doesNotProve: [
      "The full frozen Shango claim across unsubmitted dependency behavior.",
      "Independent re-execution of every submitted claim-check.",
      "Production-path or production-concurrency coverage.",
      "Certification, endorsement, legal approval, regulatory approval, or universal Shango MID performance.",
    ],
    lesson: "A correction changes the record only when evidence supports the corrected condition.",
    href: "/artifacts/fd-2026-0005",
    registryHref: "/workspace/ai-governance/registry/records/TA-14-AIGR-000011",
    tone: "green",
  },
] as const;

const institutionalFunctions = [
  {
    label: "BOUND THE FINDING",
    title: "Do not let a successful demonstration outrun its evidence.",
    text: "Harmonic Case 001 shows that the Exchange can recognize real demonstrated behavior while preserving the missing institutional evidence around it.",
  },
  {
    label: "PRESERVE PROGRESSION",
    title: "Let later engineering improve without rewriting the earlier state.",
    text: "Harmonic Case 002 shows that a later version can materially advance while the earlier evidence-bounded finding remains historically intact.",
  },
  {
    label: "CLOSE THE CASE",
    title: "Corrections and administrative verification do not automatically strengthen technical proof.",
    text: "Shango shows a complete governed route through correction, Registry verification, and controlled closure while the technical finding remains bounded.",
  },
] as const;

export default function FoundingDemonstrationsPage() {
  return (
    <main className="page-shell">
      <div className="grid" />
      <div className="glow glow-a" />
      <div className="glow glow-b" />
      <div className="stars" />

      <header className="topbar">
        <Link href="/artifacts/registry" className="brand">
          <span className="mark">TA</span>
          <span><strong>TA-14</strong><small>Founding Demonstrations</small></span>
        </Link>
        <nav>
          <Link href="/artifacts/registry">Registered Artifacts</Link>
          <Link href="/workspace/ai-governance/registry/directory">Governance Registry</Link>
          <Link href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
          <Link href="/academy">TA-14 Academy</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">TA-14 AI GOVERNANCE EXCHANGE · FOUNDING DEMONSTRATIONS</p>
        <h1>Registration is only the beginning.</h1>
        <p className="lede">
          A governance architecture becomes institutionally useful when its public record can show more than identity. The Exchange is beginning to preserve how claims enter review, what evidence actually supports, where proof stops, what changes afterward, and which conclusions remain intact over time.
        </p>
        <div className="hero-rule">
          <strong>Three artifacts. Three governance functions. One rule:</strong>
          <span>the record must never claim more than the evidence can carry.</span>
        </div>
        <div className="hero-actions">
          <Link href="/artifacts/registry" className="button primary">Browse Registered Artifacts</Link>
          <Link href="/workspace/ai-governance/registry/directory" className="button secondary">Open Governance Registry</Link>
        </div>
      </section>

      <section className="function-grid">
        {institutionalFunctions.map((item, index) => (
          <article key={item.label}>
            <span>{String(index + 1).padStart(2, "0")} · {item.label}</span>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="collection">
        <div className="section-heading">
          <p>PUBLIC GOVERNED ARTIFACT SERIES</p>
          <h2>What the Exchange has demonstrated so far.</h2>
          <span>
            These records are deliberately different. They should not be read as three equivalent PASS/FAIL reviews. Each demonstrates a different institutional capability and preserves a different evidence boundary.
          </span>
        </div>

        {demonstrations.map((demo) => (
          <article className={`demo-card ${demo.tone}`} key={demo.href}>
            <div className="demo-head">
              <div className="number">{demo.number}</div>
              <div className="demo-identity">
                <span>{demo.artifactClass}</span>
                <h3>{demo.title}</h3>
                <p>{demo.governance} · {demo.registry} · {demo.caseId}</p>
              </div>
              <div className="artifact-id">{demo.artifactId}</div>
            </div>

            <div className="finding">
              <span>TA-14 GOVERNED RESULT</span>
              <strong>{demo.finding}</strong>
              <small>{demo.findingShort}</small>
            </div>

            <p className="story">{demo.story}</p>

            <div className="evidence-grid">
              <div className="proof-column">
                <p className="column-label">WHAT THIS RECORD ESTABLISHES</p>
                {demo.proves.map((item) => <div className="evidence-line positive" key={item}><b>✓</b><span>{item}</span></div>)}
              </div>
              <div className="proof-column">
                <p className="column-label">WHAT REMAINS OUTSIDE THE FINDING</p>
                {demo.doesNotProve.map((item) => <div className="evidence-line limit" key={item}><b>—</b><span>{item}</span></div>)}
              </div>
            </div>

            <div className="lesson">
              <span>INSTITUTIONAL LESSON</span>
              <strong>{demo.lesson}</strong>
            </div>

            <div className="card-actions">
              <Link href={demo.href} className="button primary">Open Governed Artifact</Link>
              <Link href={demo.registryHref} className="button secondary">Open Registry Identity</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="privacy">
        <div>
          <p className="eyebrow">PUBLICATION BOUNDARY</p>
          <h2>Public governance history does not require a public evidence room.</h2>
        </div>
        <div className="privacy-grid">
          <div><strong>PUBLIC</strong><p>Registry identity, bounded findings, declared limitations, public chronology, controlled case status, publication-safe methodological lessons.</p></div>
          <div><strong>PROTECTED</strong><p>Private correspondence, non-public source material, protected evidence files, unpublished implementation detail, internal credentials, and participant material outside the authorized public record.</p></div>
        </div>
      </section>

      <section className="institutional-close">
        <p className="eyebrow">WHAT THE EXCHANGE IS BECOMING</p>
        <h2>A registered architecture should accumulate a governed history—not just a profile.</h2>
        <p>
          Identity establishes that an architecture exists. Governed artifacts establish what happened next: what it claimed, what entered review, what the evidence supported, what remained unresolved, what changed afterward, and which historical states must remain preserved.
        </p>
        <div className="sequence">
          <span>REGISTER</span><b>→</b><span>DECLARE</span><b>→</b><span>ADMIT EVIDENCE</span><b>→</b><span>REVIEW</span><b>→</b><span>FIND</span><b>→</b><span>CORRECT / ADVANCE</span><b>→</b><span>CLOSE OR CONTINUE</span>
        </div>
      </section>

      <footer>
        <div><strong>TA-14 Authority Governance Institution</strong><span>TA-14 AI Governance Exchange · Founding Demonstrations</span></div>
        <p>Every consequence has a route. TA-14 proves whether it should exist.</p>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){background:#02060c;scroll-behavior:smooth}
        :global(body){margin:0;background:#02060c;color:#edf8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit;text-decoration:none}
        .page-shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 80% 10%,rgba(25,115,170,.22),transparent 27%),radial-gradient(circle at 12% 38%,rgba(244,186,84,.12),transparent 24%),linear-gradient(180deg,#02060c,#071521 48%,#02060c)}
        .grid{position:absolute;inset:0;pointer-events:none;opacity:.12;background-image:linear-gradient(rgba(105,204,246,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(105,204,246,.08) 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 92%)}
        .stars{position:absolute;inset:-15%;pointer-events:none;opacity:.12;background-image:radial-gradient(circle,white 0 1px,transparent 1.5px);background-size:170px 170px;animation:drift 55s linear infinite}
        .glow{position:absolute;border-radius:50%;filter:blur(130px);opacity:.16;pointer-events:none}.glow-a{width:600px;height:600px;right:-260px;top:900px;background:#00a3ff}.glow-b{width:520px;height:520px;left:-240px;top:2100px;background:#e1a13d}
        .topbar{min-height:78px;position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(143,222,255,.13);background:rgba(2,7,13,.9);backdrop-filter:blur(24px)}
        .brand{display:flex;align-items:center;gap:12px}.mark{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(244,186,84,.62);border-radius:13px;color:#f4ba54;font-weight:900;background:linear-gradient(145deg,rgba(244,186,84,.2),rgba(12,23,37,.9))}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.18em;font-size:.92rem}.brand small{margin-top:3px;color:#87a8bd;font-size:.68rem;letter-spacing:.11em;text-transform:uppercase}.topbar nav{display:flex;gap:24px;color:#9ab6c8;font-size:.8rem}.topbar nav a:hover{color:white}
        .hero{position:relative;z-index:2;max-width:1450px;margin:0 auto;padding:112px 5vw 86px;text-align:center}.eyebrow{margin:0;color:#80cee9;font-size:.72rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.hero h1{max-width:1100px;margin:18px auto 25px;font-size:clamp(4rem,8vw,8.4rem);line-height:.88;letter-spacing:-.06em;background:linear-gradient(180deg,#fff,#d4edf8 70%,#95bbcf);-webkit-background-clip:text;color:transparent}.lede{max-width:980px;margin:0 auto;color:#b3cad8;font-size:1.17rem;line-height:1.78}.hero-rule{max-width:930px;margin:34px auto 0;padding:21px 24px;border:1px solid rgba(244,186,84,.25);border-radius:18px;background:rgba(244,186,84,.07)}.hero-rule strong,.hero-rule span{display:block}.hero-rule strong{color:#ffdc96}.hero-rule span{margin-top:7px;color:#b6cbd8}.hero-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:27px}.button{display:inline-flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:12px;border:1px solid rgba(140,210,239,.18);font-size:.78rem;font-weight:850;transition:.2s}.button:hover{transform:translateY(-2px)}.primary{background:linear-gradient(135deg,#0c86bd,#195c84);color:white}.secondary{background:rgba(18,42,61,.72);color:#d6eef8}
        .function-grid{position:relative;z-index:2;max-width:1350px;margin:0 auto 84px;padding:0 5vw;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.function-grid article{padding:26px;border:1px solid rgba(117,201,234,.14);border-radius:22px;background:linear-gradient(145deg,rgba(8,25,39,.88),rgba(4,13,22,.94))}.function-grid span{color:#d9ad61;font-size:.65rem;font-weight:900;letter-spacing:.13em}.function-grid h2{font-size:1.45rem;line-height:1.15;margin:13px 0 11px}.function-grid p{margin:0;color:#9db8c8;line-height:1.68;font-size:.86rem}
        .collection{position:relative;z-index:2;max-width:1450px;margin:0 auto;padding:0 5vw 90px}.section-heading{max-width:980px;margin-bottom:32px}.section-heading>p{margin:0;color:#73cae9;font-size:.68rem;font-weight:900;letter-spacing:.17em}.section-heading h2{font-size:clamp(2.4rem,4.5vw,4.7rem);line-height:1;margin:10px 0 14px;letter-spacing:-.04em}.section-heading>span{display:block;color:#a4bdcc;line-height:1.7}
        .demo-card{margin-bottom:30px;padding:34px;border-radius:28px;border:1px solid rgba(118,202,235,.15);background:linear-gradient(145deg,rgba(8,25,39,.92),rgba(3,12,21,.96));box-shadow:0 34px 90px rgba(0,0,0,.22)}.demo-card.blue{border-color:rgba(98,216,255,.2)}.demo-card.gold{border-color:rgba(244,186,84,.22)}.demo-card.green{border-color:rgba(105,239,176,.2)}.demo-head{display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:start}.number{width:58px;height:58px;display:grid;place-items:center;border-radius:17px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);font-weight:900;color:#b9e9f9}.demo-identity>span{color:#dfb56b;font-size:.65rem;font-weight:900;letter-spacing:.15em}.demo-identity h3{font-size:clamp(1.8rem,3vw,3.1rem);line-height:1.02;margin:8px 0}.demo-identity p{margin:0;color:#7fa0b3;font-size:.78rem}.artifact-id{padding:9px 11px;border-radius:10px;background:rgba(255,255,255,.04);color:#8ba8ba;font-size:.67rem;letter-spacing:.08em}
        .finding{margin:25px 0 20px;padding:20px 22px;border-radius:17px;border:1px solid rgba(244,186,84,.2);background:linear-gradient(135deg,rgba(244,186,84,.08),rgba(23,55,77,.54))}.finding span,.finding strong,.finding small{display:block}.finding span{color:#d9ad61;font-size:.62rem;font-weight:900;letter-spacing:.15em}.finding strong{margin-top:7px;font-size:1.25rem}.finding small{margin-top:5px;color:#91abba}.story{max-width:1120px;color:#abc3d1;line-height:1.73;font-size:.95rem}.evidence-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:24px}.proof-column{padding:22px;border:1px solid rgba(119,200,233,.1);border-radius:17px;background:rgba(5,18,29,.64)}.column-label{margin:0 0 14px;color:#7899ac;font-size:.63rem;font-weight:900;letter-spacing:.14em}.evidence-line{display:grid;grid-template-columns:28px 1fr;gap:9px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06)}.evidence-line:last-child{border-bottom:0}.evidence-line b{font-size:.8rem}.positive b{color:#76efb6}.limit b{color:#ff9ba4}.evidence-line span{color:#a8c1cf;font-size:.83rem;line-height:1.55}.lesson{margin-top:20px;padding:17px 19px;border-left:3px solid #64d7ff;background:rgba(100,215,255,.055);border-radius:0 13px 13px 0}.lesson span{display:block;color:#73cce9;font-size:.61rem;font-weight:900;letter-spacing:.15em}.lesson strong{display:block;margin-top:6px;font-size:1.03rem}.card-actions{display:flex;gap:11px;flex-wrap:wrap;margin-top:22px}
        .privacy{position:relative;z-index:2;max-width:1350px;margin:0 auto 90px;padding:34px 5vw;border-top:1px solid rgba(117,201,233,.12);border-bottom:1px solid rgba(117,201,233,.12)}.privacy h2{font-size:clamp(2rem,4vw,4rem);line-height:1;margin:10px 0 26px;letter-spacing:-.04em}.privacy-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.privacy-grid div{padding:22px;border-radius:17px;border:1px solid rgba(117,201,233,.12);background:rgba(6,19,30,.7)}.privacy-grid strong{font-size:.72rem;letter-spacing:.14em;color:#e0b668}.privacy-grid p{margin:10px 0 0;color:#9fb9c8;line-height:1.65}
        .institutional-close{position:relative;z-index:2;max-width:1300px;margin:0 auto;padding:0 5vw 100px;text-align:center}.institutional-close h2{max-width:1000px;margin:13px auto 20px;font-size:clamp(2.5rem,5vw,5.3rem);line-height:.98;letter-spacing:-.045em}.institutional-close>p:not(.eyebrow){max-width:900px;margin:0 auto;color:#a6becc;line-height:1.72}.sequence{display:flex;justify-content:center;align-items:center;gap:10px;flex-wrap:wrap;margin-top:30px;padding:22px;border:1px solid rgba(244,186,84,.18);border-radius:18px;background:rgba(244,186,84,.05)}.sequence span{font-size:.68rem;font-weight:900;letter-spacing:.08em}.sequence b{color:#e0b564}
        footer{position:relative;z-index:2;display:flex;justify-content:space-between;gap:25px;padding:28px 5vw;border-top:1px solid rgba(118,199,232,.1);background:#02070c;color:#7895a7}footer strong,footer span{display:block}footer strong{color:#d4ebf5;font-size:.82rem}footer span{margin-top:4px;font-size:.68rem}footer p{font-size:.72rem}
        @keyframes drift{to{transform:translate3d(160px,120px,0)}}
        @media(max-width:1000px){.topbar nav{display:none}.function-grid{grid-template-columns:1fr}.demo-head{grid-template-columns:auto 1fr}.artifact-id{grid-column:2}.evidence-grid,.privacy-grid{grid-template-columns:1fr}}
        @media(max-width:650px){.topbar{padding:0 18px}.hero{padding:78px 20px 65px}.hero h1{font-size:4rem}.function-grid,.collection{padding-left:20px;padding-right:20px}.demo-card{padding:23px}.demo-head{grid-template-columns:1fr}.artifact-id{grid-column:auto;width:max-content}.number{width:48px;height:48px}.privacy{padding-left:20px;padding-right:20px}.institutional-close{padding-left:20px;padding-right:20px}.institutional-close h2{font-size:3rem}footer{flex-direction:column;padding:24px 20px}}
        @media(prefers-reduced-motion:reduce){.stars{animation:none}}
      `}</style>
    </main>
  );
}
