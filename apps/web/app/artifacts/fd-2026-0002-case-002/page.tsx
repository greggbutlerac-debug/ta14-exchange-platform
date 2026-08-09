"use client";

import Link from "next/link";

const evidenceRecords = [
  {
    id: "EVIDENCE 1",
    title: "Git Freeze 2.jpg",
    role: "Public provenance environment",
    supports:
      "Supports attribution of an active Moral Clarity AI development environment and related public governance/runtime repositories at the time of the Version 2 registration.",
    boundary:
      "Does not establish the contents or behavior of the private Harmonic Version 2 implementation.",
  },
  {
    id: "EVIDENCE 2",
    title: "Git Freeze Production.jpg",
    role: "Private implementation freeze identity",
    supports:
      "Supports the existence of an attributable private Version 2 implementation baseline and frozen implementation state preserved in controlled Registry evidence.",
    boundary:
      "Does not independently verify the private source-code contents or prove that the frozen implementation performs every declared constitutional behavior.",
  },
  {
    id: "EVIDENCE 3",
    title: "HCS-v1.0-specification-library (2).zip",
    role: "Predecessor architecture and lineage",
    supports:
      "Supports documented predecessor architecture for continuation admissibility, present-state evaluation, continuity, authority, evidence, re-evaluation, reconstructability, and constitutional interfaces before Version 2.",
    boundary:
      "Does not establish that Version 1 specifications are unchanged implementation components of Version 2 or that Version 2 runtime behavior has been independently validated.",
  },
  {
    id: "EVIDENCE 4",
    title: "Validation.pdf",
    role: "Falsifiable validation methodology",
    supports:
      "Establishes a repeatable, implementation-independent protocol for testing whether materially different governance domains can be represented through domain mappings while the constitutional runtime remains invariant.",
    boundary:
      "The living evaluation matrix identifies planned runs whose validation results were not yet recorded in the submitted protocol.",
  },
  {
    id: "EVIDENCE 5",
    title: "healthcare-synthetic-evaluation-harmonic-composition-v1.pdf",
    role: "Independent architectural composition",
    supports:
      "Provides an independently authored changed-condition healthcare composition in which new evidence, withdrawn discharge authority, stale reliance, continuity loss, and required reassessment are mapped into Harmonic's continuation-admissibility boundary.",
    boundary:
      "Does not show an executable Harmonic runtime receiving the scenario, producing a determination receipt, replaying the state change, or technically preventing downstream execution.",
  },
  {
    id: "EVIDENCE 6",
    title: "N417.pdf",
    role: "Foundational filing provenance",
    supports:
      "Supports dated USPTO receipt provenance for U.S. Provisional Patent Application No. 63/929,196, filed by Timothy Zlomke on December 2, 2025.",
    boundary:
      "Establishes receipt of the filing materials only; it is not a patent grant, patentability finding, implementation validation, or proof that every Version 2 mechanism is claimed by the filing.",
  },
  {
    id: "EVIDENCE 7",
    title: "Harmonic_Sovereign_Declaration_v2.0.pdf",
    role: "Attributable Version 2 declaration",
    supports:
      "Establishes Harmonic Version 2's own declared constitutional responsibility, changed-state re-evaluation rule, governed determination classes, authority/execution separation, evidence posture, implementation freeze, and explicit non-claims.",
    boundary:
      "Is a sovereign self-description and does not independently validate the declared claims.",
  },
];

const supportedFindings = [
  "Harmonic Constitutional Runtime Version 2.0 is separately registered as TA-14-AIGR-000010 and inherits neither the evidentiary conclusions nor the finding from Version 1.0.",
  "The Version 2 declaration expressly states that materially relevant constitutional state changes suspend reliance on a prior determination and require re-evaluation before consequential execution.",
  "The declaration preserves unresolved or UNKNOWN constitutional state rather than converting inability to establish a required condition into affirmative permission to continue.",
  "The declaration separates Harmonic's constitutional continuation determination from the institution's separate authority and responsibility to execute a downstream consequential act.",
  "A falsifiable validation methodology is documented for testing runtime invariance across materially different governance domains while preserving visible failure classifications when runtime mutation is required.",
  "An independently authored healthcare composition coherently exercises the declared boundary under material clinical change, stale evidence, withdrawal of prior discharge authority, continuity loss, and required reassessment.",
  "The Version 2 implementation is attributable to a declared private repository, branch, and freeze commit, while the evidence appropriately stops short of claiming independent source-code verification.",
  "The seven-record evidence package preserves distinct roles for declaration, methodology, independent composition, implementation identity, lineage, and provenance rather than treating evidence presence as universal proof.",
];

const openProofSurfaces = [
  "No admitted record independently demonstrates the frozen Version 2 runtime executing a materially changed-state scenario end to end.",
  "No admitted record shows the initial Version 2 determination object followed by a constitutionally relevant state or authority change and a second executable re-evaluation against that changed state.",
  "No admitted record independently demonstrates an executable ALLOW, CONSTRAIN, ESCALATE, BLOCK, or EMERGENCY_CONTINUITY response generated by the frozen Version 2 implementation under a governed test run.",
  "No admitted record independently demonstrates a Version 2 constitutional receipt and replay chain that reconstructs the changed-state determination from preserved runtime artifacts.",
  "No admitted record proves that a Harmonic determination technically changes what the downstream executing system can do, or that a BLOCK/CONSTRAIN result is non-bypassable at the execution boundary.",
  "No admitted record independently reconciles a Version 2 determination to downstream execution or real-world effect; Harmonic explicitly preserves this as an open limitation.",
  "The Validation Protocol defines the method for runtime-invariance testing, but its submitted living evaluation matrix does not contain completed validation results for the planned domain runs.",
];

const chain = [
  { stage: "Reality", status: "PARTIAL", note: "Changed conditions and external facts are represented in declarations and independent compositions, but not independently captured as a live Version 2 runtime event." },
  { stage: "Record", status: "SUPPORTED", note: "Seven attributable evidence records, hashes, Registry identity, version lineage, and implementation-freeze references are preserved." },
  { stage: "Continuity", status: "SUPPORTED", note: "Version 1 → Version 2 lineage is explicit; Version 2 stands on its own evidence and does not inherit prior findings." },
  { stage: "Admissibility", status: "SUPPORTED AT ARCHITECTURAL LEVEL", note: "Present-state continuation admissibility, UNKNOWN preservation, authority change, and re-evaluation are declared and methodologically specified." },
  { stage: "Binding", status: "OPEN", note: "No admitted Version 2 evidence proves a bind event or technically non-bypassable consequence boundary." },
  { stage: "Commit", status: "OPEN", note: "No admitted Version 2 evidence independently demonstrates commit control tied to the constitutional determination." },
  { stage: "Execution", status: "OPEN", note: "No admitted Version 2 runtime trace or execution receipt proves the determination changed downstream executable behavior." },
  { stage: "Outcome", status: "OPEN", note: "No admitted Version 2 outcome record independently reconciles the determination to actual downstream effect or zero-effect closure." },
];

const nextEvidence = [
  "Exact frozen Version 2 runtime identifier and commit, as preserved in controlled Registry evidence.",
  "A bounded scenario beginning with an admissible proposed consequential transition and an attributable initial determination.",
  "A materially relevant state and/or authority change before consequential execution.",
  "The updated evidence/state packet presented to the same frozen Version 2 runtime.",
  "A second determination showing the runtime's changed-state response, including reason codes or bounded explanatory state.",
  "A preserved constitutional receipt and replay artifact attributable to both the initial and re-evaluated states.",
  "Evidence of what the downstream execution boundary did in response to the second determination, including whether execution was prevented, constrained, escalated, or otherwise controlled.",
  "An outcome record or explicit zero-action closure where available, with any remaining attribution gap preserved rather than inferred away.",
];

const lineage = [
  "Version 1.0 Registry Baseline",
  "Case 001 Bounded Runtime Demonstration",
  "Evidence-Bounded TA-14 Finding",
  "Participant Review and Engineering Learning",
  "Separate Version 2.0 Registry Baseline",
  "Seven-Record Version 2 Evidence Package",
  "Case 002 Evidence Review",
  "Executable Version 2 Demonstration Required for Deeper Runtime Finding",
];

export default function HarmonicArtifactTwoPage() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grid" />

      <header className="topbar">
        <Link href="/artifacts/registry" className="brand">
          <span className="mark">TA</span>
          <span><strong>TA-14</strong><small>Governed Artifact Record</small></span>
        </Link>
        <nav>
          <Link href="/artifacts/registry">Artifact Registry</Link>
          <Link href="/workspace/ai-governance/registry/profiles/harmonic-constitutional-runtime-2">Harmonic v2 Profile</Link>
          <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000010">Registry Baseline</Link>
          <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000010/evidence">Evidence Records</Link>
          <Link href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="badge external">HARMONIC ARTIFACT 002</span>
            <span className="badge review">EVIDENCE REVIEW ARTIFACT</span>
          </div>
          <p className="kicker">FD-2026-0002 · CASE 002 · TA-14-AIGR-000010</p>
          <h1>Version 2 Evidence Advancement and Runtime Validation Boundary</h1>
          <p className="lede">
            Harmonic Constitutional Runtime Version 2.0 entered a second bounded TA-14 review through a seven-record evidence package preserved against its own registered baseline. The package materially strengthens declaration, lineage, validation methodology, independent architectural exercise, and implementation-freeze attribution. It does not yet establish executable Version 2 proof across binding, commit, execution, or outcome.
          </p>

          <div className="finding-banner">
            <span>TA-14 INDEPENDENT FINDING</span>
            <strong>ARCHITECTURAL ADVANCEMENT SUPPORTED — RUNTIME VALIDATION OPEN</strong>
            <p>Decision class: Partial Admissibility · Evidence-bounded Version 2 finding.</p>
          </div>

          <div className="hero-actions">
            <Link className="button primary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000010/evidence">Open Seven Evidence Records</Link>
            <Link className="button secondary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000010">Open Permanent Registry Record</Link>
            <Link className="button secondary" href="/artifacts/fd-2026-0002-case-001">Open Case 001</Link>
            <Link className="button ghost" href="/artifacts/registry">Return to Artifact Registry</Link>
          </div>
        </div>

        <aside className="identity-card">
          <div className="identity-head">
            <span>REGISTERED GOVERNANCE BASELINE</span>
            <strong>TA-14-AIGR-000010</strong>
          </div>
          <dl>
            <div><dt>Governance</dt><dd>Harmonic Constitutional Runtime</dd></div>
            <div><dt>Steward</dt><dd>Timothy E. Zlomke</dd></div>
            <div><dt>Organization</dt><dd>Moral Clarity AI</dd></div>
            <div><dt>Registered version</dt><dd>2.0</dd></div>
            <div><dt>Version series</dt><dd>TA-14-AIVS-000001 · position 2 of 2</dd></div>
            <div><dt>Prior findings inherited</dt><dd>No</dd></div>
            <div><dt>Prior evidence inherited</dt><dd>No</dd></div>
            <div><dt>Evidence records reviewed</dt><dd>7 of 7</dd></div>
            <div><dt>Private freeze reference</dt><dd>Preserved in controlled Registry evidence</dd></div>
            <div><dt>TA-14 finding</dt><dd className="partial">PARTIAL ADMISSIBILITY</dd></div>
            <div><dt>Execution validation</dt><dd className="open">OPEN</dd></div>
          </dl>
        </aside>
      </section>

      <section className="principle-strip">
        <div><span>01</span><strong>Read every admitted record.</strong></div>
        <div><span>02</span><strong>Keep declaration separate from demonstration.</strong></div>
        <div><span>03</span><strong>Preserve Version 1 and Version 2 independently.</strong></div>
        <div><span>04</span><strong>Do not convert implementation identity into runtime proof.</strong></div>
      </section>

      <section className="content-shell">
        <article className="panel split-panel">
          <div>
            <p className="section-kicker">CASE 002 REVIEW QUESTION</p>
            <h2>What has Version 2 actually advanced?</h2>
            <p>
              Case 002 does not ask whether Harmonic is serious or whether the Version 2 architecture has matured. The submitted evidence supports both architectural seriousness and a materially stronger evidentiary posture. The governing question is narrower: which Version 2 claims are supported at the declaration, methodology, independent-composition, lineage, and implementation-identity layers, and which claims still require executable runtime evidence before stronger admissibility can attach?
            </p>
          </div>
          <div className="check-list">
            {supportedFindings.map((item) => <div key={item}><span>✓</span><p>{item}</p></div>)}
          </div>
        </article>

        <article className="panel evidence-panel">
          <p className="section-kicker">COMPLETE EVIDENCE PACKAGE</p>
          <h2>Seven records. Seven bounded evidentiary roles.</h2>
          <p className="intro">
            TA-14 reviewed all seven evidence records preserved with the Version 2 Registry baseline. No record is treated as proving more than its own evidentiary role.
          </p>
          <div className="evidence-grid">
            {evidenceRecords.map((record) => (
              <div className="evidence-card" key={record.id}>
                <div className="evidence-head"><span>{record.id}</span><strong>{record.role}</strong></div>
                <h3>{record.title}</h3>
                <div className="evidence-block support"><b>Supports</b><p>{record.supports}</p></div>
                <div className="evidence-block limit"><b>Does not prove</b><p>{record.boundary}</p></div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel split-panel boundary-panel">
          <div>
            <p className="section-kicker">EVIDENTIARY BOUNDARY</p>
            <h2>The missing layer is executable Version 2 proof.</h2>
            <p>
              The evidence package materially advances the architecture beyond Case 001's surrounding-evidence gap, but it does not close the full admissibility chain. TA-14 therefore does not convert Version 2's declaration, methodology, independent composition, or implementation freeze into proof of binding, commit, execution control, replay, or outcome.
            </p>
          </div>
          <div className="boundary-list">
            {openProofSurfaces.map((item) => <div key={item}><span>!</span><p>{item}</p></div>)}
          </div>
        </article>

        <article className="panel chain-panel">
          <p className="section-kicker">TA-14 CHAIN MAPPING</p>
          <h2>Where the Version 2 evidence reaches — and where it stops.</h2>
          <div className="chain-grid">
            {chain.map((item, index) => (
              <div className="chain-card" key={item.stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.stage}</h3>
                <b className={item.status.includes("OPEN") ? "status-open" : item.status.includes("PARTIAL") ? "status-partial" : "status-supported"}>{item.status}</b>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel lineage-panel">
          <p className="section-kicker">PRESERVED VERSION CHRONOLOGY</p>
          <h2>Case 002 continues the record without rewriting Case 001.</h2>
          <p className="intro">
            Harmonic Version 2.0 is a separate continuation baseline. The Registry expressly preserves that Version 2 inherits neither Version 1 evidence nor the Case 001 finding. Case 002 therefore reviews Version 2 on its own seven-record package while preserving the engineering learning that connects the chronology.
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
            <p className="section-kicker">NEXT-STAGE EVIDENCE REQUIREMENT</p>
            <h2>One executable changed-state demonstration can pressure-test the remaining boundary.</h2>
            <p>
              The next review should not ask Tim for more general architecture prose. It should request a bounded executable demonstration against the declared frozen Version 2 implementation so TA-14 can observe the transition from initial admissibility through changed state, re-evaluation, determination, receipt/replay, execution control, and outcome accounting.
            </p>
          </div>
          <div className="response-grid">
            {nextEvidence.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
          </div>
        </article>

        <article className="panel institutional-panel">
          <div className="institutional-copy">
            <p className="section-kicker">TA-14 INDEPENDENT FINDING</p>
            <h2>Architectural advancement is supported. Runtime validation remains open.</h2>
            <p>
              Harmonic Constitutional Runtime Version 2.0 demonstrates a materially stronger architecture-and-evidence posture than the frozen Version 1.0 baseline reviewed in Case 001. The complete seven-record package supports Version 2's declared changed-state governance model, explicit authority/execution separation, falsifiable validation methodology, independent architectural composition, preserved lineage, and attributable implementation freeze at their respective evidentiary levels. The package does not yet independently establish executable Version 2 behavior across binding, commit, execution control, replay, or outcome. TA-14 therefore records a <strong>Partial Admissibility</strong> finding rather than an Admissible PASS or production-runtime validation.
            </p>
          </div>
          <div className="formula">
            <span>DECLARATION</span><b>→</b><span>METHOD</span><b>→</b><span>INDEPENDENT COMPOSITION</span><b>→</b><span>IMPLEMENTATION FREEZE</span><b>→</b><span>EXECUTABLE PROOF NEXT</span>
          </div>
        </article>

        <section className="claims-grid">
          <article className="claim-card proves">
            <span>WHAT CASE 002 SUPPORTS</span>
            <h3>Version 2 has crossed from engineering response into evidence-backed architectural advancement.</h3>
            <p>
              TA-14 can now support that Harmonic Version 2 has an independently registered baseline, a documented changed-state continuation model, explicit non-claims, a falsifiable validation protocol, independent healthcare composition, preserved predecessor specifications, attributable filing provenance, and an identifiable private implementation freeze.
            </p>
          </article>
          <article className="claim-card limits">
            <span>WHAT CASE 002 DOES NOT SUPPORT</span>
            <h3>No production-runtime or route-complete admissibility conclusion is issued.</h3>
            <p>
              Case 002 does not certify Harmonic, validate every Version 2 claim, establish legal or regulatory compliance, prove non-bypassable execution control, prove downstream execution or non-execution, establish complete determination/effect attribution, or carry any Version 1 PASS or finding into Version 2.
            </p>
          </article>
        </section>
      </section>

      <section className="closing">
        <p>CASE 002 BOUNDARY</p>
        <h2>No executable Version 2 evidence. No executable Version 2 finding.</h2>
        <div>
          <Link className="button primary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000010/evidence">Inspect Evidence Package</Link>
          <Link className="button secondary" href="/artifacts/fd-2026-0002-case-001">Compare Case 001</Link>
          <Link className="button ghost" href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
        </div>
      </section>

      <footer>
        <div><strong>TA-14 Governed Artifact Record</strong><span>Harmonic Artifact 002 · FD-2026-0002 Case 002</span></div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box} :global(html){background:#02060c;scroll-behavior:smooth} :global(body){margin:0;background:#02060c;color:#edf8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif} :global(a){color:inherit;text-decoration:none}
        .page-shell{--gold:#f4ba54;--blue:#63d8ff;--green:#67efb0;--red:#ff737f;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 78% 8%,rgba(26,109,158,.23),transparent 30%),radial-gradient(circle at 14% 35%,rgba(244,186,84,.12),transparent 24%),linear-gradient(180deg,#02060c 0%,#06111d 48%,#02060c 100%)}
        .grid{position:absolute;inset:0;pointer-events:none;opacity:.14;background-image:linear-gradient(rgba(95,205,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(95,205,255,.08) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,black,transparent 82%)}
        .ambient{position:absolute;border-radius:50%;filter:blur(110px);opacity:.22;pointer-events:none}.ambient-a{width:560px;height:560px;right:-180px;top:320px;background:#00a8ff}.ambient-b{width:520px;height:520px;left:-260px;top:1040px;background:#d8993a}
        .topbar{min-height:78px;position:relative;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(143,222,255,.13);background:rgba(2,7,13,.9);backdrop-filter:blur(24px)}
        .brand{display:flex;align-items:center;gap:12px}.mark{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(244,186,84,.62);border-radius:13px;color:var(--gold);font-weight:900;background:linear-gradient(145deg,rgba(244,186,84,.2),rgba(12,23,37,.9))}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.18em;font-size:.92rem}.brand small{margin-top:3px;color:#87a8bd;font-size:.68rem;letter-spacing:.11em;text-transform:uppercase}.topbar nav{display:flex;gap:22px;color:#9ab6c8;font-size:.78rem}.topbar nav a:hover{color:white}
        .hero{position:relative;z-index:2;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:1.12fr .88fr;gap:60px;align-items:center;padding:100px 5vw 80px}.hero-copy{max-width:900px}.eyebrow-row{display:flex;gap:10px;flex-wrap:wrap}.badge{display:inline-flex;align-items:center;border-radius:999px;padding:8px 12px;font-size:.7rem;font-weight:900;letter-spacing:.12em}.external{border:1px solid rgba(244,186,84,.45);background:rgba(244,186,84,.12);color:#ffd785}.review{border:1px solid rgba(99,216,255,.4);background:rgba(99,216,255,.1);color:#9ce8ff}.kicker{margin:24px 0 10px;color:#80cfea;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase}.hero h1{font-size:clamp(3rem,5.7vw,6.3rem);line-height:.94;letter-spacing:-.045em;margin:0;max-width:1050px}.lede{font-size:1.13rem;line-height:1.75;color:#b8cedc;max-width:860px;margin:28px 0}.finding-banner{margin-top:30px;padding:22px 24px;border:1px solid rgba(244,186,84,.32);border-radius:20px;background:linear-gradient(135deg,rgba(244,186,84,.09),rgba(17,43,65,.55))}.finding-banner span{display:block;color:#edbd69;font-size:.7rem;letter-spacing:.16em;font-weight:900}.finding-banner strong{display:block;margin:8px 0;font-size:1.25rem}.finding-banner p{margin:0;color:#bfd0da}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button{display:inline-flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:12px;font-weight:850;font-size:.82rem;border:1px solid rgba(143,222,255,.2)}.primary{background:linear-gradient(135deg,#0a95cb,#126284);color:white}.secondary{background:rgba(14,34,52,.75);color:#cdeefe}.ghost{background:transparent;color:#9db7c7}
        .identity-card{border:1px solid rgba(143,222,255,.18);border-radius:26px;padding:26px;background:linear-gradient(180deg,rgba(7,18,31,.93),rgba(6,14,24,.82));box-shadow:0 28px 80px rgba(0,0,0,.34),inset 0 0 50px rgba(99,216,255,.03)}.identity-head{padding-bottom:18px;border-bottom:1px solid rgba(143,222,255,.12)}.identity-head span{display:block;color:#8ba8ba;font-size:.68rem;letter-spacing:.16em}.identity-head strong{display:block;margin-top:7px;color:#fff;font-size:1.35rem}.identity-card dl{margin:10px 0 0}.identity-card dl div{display:grid;grid-template-columns:160px 1fr;gap:16px;padding:13px 0;border-bottom:1px solid rgba(143,222,255,.09)}dt{color:#7896aa;font-size:.76rem}dd{margin:0;color:#e7f6ff;font-size:.86rem;line-height:1.5;word-break:break-word}.partial{color:#ffd37f!important;font-weight:900}.open{color:#ff929b!important;font-weight:900}
        .principle-strip{position:relative;z-index:2;max-width:1500px;margin:0 auto 80px;padding:0 5vw;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.principle-strip div{border:1px solid rgba(143,222,255,.13);border-radius:16px;padding:18px;background:rgba(7,18,31,.7);display:flex;gap:12px;align-items:center}.principle-strip span{color:var(--gold);font-weight:900}.principle-strip strong{font-size:.88rem;line-height:1.45}
        .content-shell{position:relative;z-index:2;max-width:1500px;margin:0 auto;padding:0 5vw 100px;display:grid;gap:22px}.panel,.claim-card{border:1px solid rgba(143,222,255,.14);border-radius:24px;background:rgba(7,18,31,.78);box-shadow:0 20px 60px rgba(0,0,0,.2)}.panel{padding:34px}.split-panel{display:grid;grid-template-columns:.88fr 1.12fr;gap:44px;align-items:start}.section-kicker{margin:0 0 10px;color:#7dcde9;font-size:.7rem;font-weight:900;letter-spacing:.16em}.panel h2{font-size:clamp(1.8rem,3vw,3.1rem);line-height:1.06;margin:0 0 16px}.panel p{color:#a9c0cf;line-height:1.75}.intro{max-width:1050px}.check-list,.boundary-list{display:grid;gap:10px}.check-list div,.boundary-list div{display:grid;grid-template-columns:34px 1fr;gap:12px;align-items:start;padding:15px;border-radius:14px;background:rgba(11,28,44,.8);border:1px solid rgba(143,222,255,.08)}.check-list span{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:rgba(103,239,176,.12);color:#7ff6bd;font-weight:900}.boundary-list span{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;background:rgba(255,115,127,.1);color:#ff8a94;font-weight:900}.check-list p,.boundary-list p{margin:0;color:#d1e2eb;line-height:1.55}.boundary-panel{border-color:rgba(255,115,127,.18)}
        .evidence-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:26px}.evidence-card{padding:22px;border-radius:18px;background:rgba(8,24,40,.82);border:1px solid rgba(143,222,255,.1)}.evidence-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.evidence-head span{color:#f2bd63;font-size:.69rem;font-weight:900;letter-spacing:.12em}.evidence-head strong{color:#8bcce6;font-size:.72rem;text-align:right}.evidence-card h3{font-size:1.15rem;line-height:1.3;margin:12px 0 16px}.evidence-block{padding:13px 14px;border-radius:12px;margin-top:10px}.evidence-block b{display:block;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase}.evidence-block p{margin:7px 0 0;font-size:.9rem;line-height:1.55}.support{background:rgba(103,239,176,.055);border:1px solid rgba(103,239,176,.12)}.support b{color:#80efba}.limit{background:rgba(255,115,127,.045);border:1px solid rgba(255,115,127,.1)}.limit b{color:#ff959e}
        .chain-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:28px}.chain-card{padding:20px;border-radius:16px;background:rgba(11,28,44,.82);border:1px solid rgba(143,222,255,.1)}.chain-card>span{color:#f3bf65;font-size:.7rem;font-weight:900}.chain-card h3{margin:7px 0 10px;font-size:1.1rem}.chain-card>b{display:inline-flex;padding:5px 8px;border-radius:999px;font-size:.63rem;letter-spacing:.08em}.status-supported{background:rgba(103,239,176,.1);color:#8df2c1}.status-partial{background:rgba(244,186,84,.12);color:#ffd37f}.status-open{background:rgba(255,115,127,.1);color:#ff9aa2}.chain-card p{font-size:.88rem;line-height:1.55;margin:12px 0 0}
        .lineage{margin-top:30px;display:flex;gap:8px;align-items:stretch;overflow-x:auto;padding-bottom:6px}.lineage-step{min-width:155px;flex:1;position:relative;padding:18px;border-radius:15px;background:rgba(11,28,44,.85);border:1px solid rgba(143,222,255,.1)}.lineage-step span{display:block;color:#f3bf65;font-size:.72rem}.lineage-step strong{display:block;margin-top:7px;font-size:.82rem;line-height:1.35}.lineage-step b{position:absolute;right:-8px;top:50%;z-index:2;color:#5ebcdc}
        .response-panel{display:grid;grid-template-columns:.9fr 1.1fr;gap:42px}.response-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.response-grid div{padding:17px;border-radius:14px;background:rgba(11,28,44,.82);border:1px solid rgba(143,222,255,.09)}.response-grid span{display:block;color:#7ccfee;font-size:.7rem;font-weight:900}.response-grid strong{display:block;margin-top:6px;font-size:.86rem;line-height:1.45}
        .institutional-panel{background:linear-gradient(135deg,rgba(244,186,84,.1),rgba(7,18,31,.86) 45%,rgba(99,216,255,.06))}.institutional-copy{max-width:1100px}.formula{margin-top:28px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:18px;border:1px solid rgba(244,186,84,.2);border-radius:16px;background:rgba(2,9,16,.52)}.formula span{font-size:.74rem;font-weight:900;letter-spacing:.08em;color:#e9f6fd}.formula b{color:var(--gold)}
        .claims-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.claim-card{padding:30px}.claim-card span{font-size:.7rem;font-weight:900;letter-spacing:.15em}.claim-card h3{font-size:1.5rem;line-height:1.15;margin:10px 0}.claim-card p{color:#a9c0cf;line-height:1.7}.proves{border-color:rgba(103,239,176,.2)}.proves span{color:#7ff6bd}.limits{border-color:rgba(255,115,127,.18)}.limits span{color:#ff8f98}
        .closing{position:relative;z-index:2;text-align:center;padding:90px 5vw;border-top:1px solid rgba(143,222,255,.1);background:radial-gradient(circle at 50% 100%,rgba(244,186,84,.1),transparent 45%)}.closing p{color:#e2b969;font-size:.72rem;letter-spacing:.18em;font-weight:900}.closing h2{max-width:950px;margin:12px auto 28px;font-size:clamp(2rem,4vw,4.1rem);line-height:1.05}.closing div{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}footer{position:relative;z-index:2;min-height:110px;padding:30px 5vw;border-top:1px solid rgba(143,222,255,.1);display:flex;align-items:center;justify-content:space-between;gap:24px;color:#7897aa}footer strong,footer span{display:block}footer strong{color:#e8f7ff}footer span{margin-top:5px;font-size:.76rem}footer p{font-size:.78rem;letter-spacing:.08em}
        @media(max-width:1100px){.hero,.split-panel,.response-panel{grid-template-columns:1fr}.principle-strip{grid-template-columns:1fr 1fr}.claims-grid{grid-template-columns:1fr}.chain-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.topbar nav{display:none}.hero{padding-top:70px}.identity-card dl div{grid-template-columns:1fr}.response-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:760px){.evidence-grid{grid-template-columns:1fr}.chain-grid{grid-template-columns:1fr}}
        @media(max-width:650px){.principle-strip{grid-template-columns:1fr}.response-grid{grid-template-columns:1fr}.hero h1{font-size:2.8rem}.topbar{padding:0 18px}.hero,.principle-strip,.content-shell{padding-left:18px;padding-right:18px}.panel,.claim-card{padding:22px}.lineage{display:grid}.lineage-step b{display:none}footer{align-items:flex-start;flex-direction:column}}
      `}</style>
    </main>
  );
}
