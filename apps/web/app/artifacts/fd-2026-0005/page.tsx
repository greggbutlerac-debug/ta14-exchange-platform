"use client";

import Link from "next/link";

const lifecycle = [
  { step: "01", label: "CASE ENTRY", title: "Bounded case opened", text: "FD-2026-0005 was opened against the registered Shango MID governance identity with a bounded technical claim, an explicit evidence boundary, declared limitations, and controlled publication conditions." },
  { step: "02", label: "INTEGRITY", title: "Submitted objects verified", text: "TA-14 independently checked the submitted evidence-object integrity identifiers before admitting the bounded package. Integrity verification established object continuity; it did not establish the technical claim by itself." },
  { step: "03", label: "ADMISSION", title: "Evidence admitted with limitations attached", text: "Two bounded evidence objects were admitted for the technical review. Material not submitted into the case remained outside the admitted evidence surface and could not be silently relied upon." },
  { step: "04", label: "REVIEW", title: "Claim tested against the admitted surface", text: "TA-14 evaluated the frozen claim against what the admitted control path and reported run behavior actually demonstrated, rather than against labels, intentions, architecture reputation, or material outside the case." },
  { step: "05", label: "FINDING", title: "Partially Supported", text: "The evidence supported a narrower transaction-boundary proposition than the frozen claim as written. TA-14 therefore preserved a bounded finding instead of upgrading the whole claim to Supported." },
  { step: "06", label: "CORRECTION", title: "Post-finding clarification evaluated", text: "A participant clarification narrowed one test description. TA-14 did not accept the correction merely because it was offered; the corrected proposition was checked against the admitted evidence behavior before the governed record changed." },
  { step: "07", label: "REGISTRY", title: "Registered version independently verified", text: "TA-14 later resolved the remaining administrative identity question directly against the authoritative Registry source and verified Shango MID as Registered Version 2.2." },
  { step: "08", label: "CLOSURE", title: "Case administratively closed", text: "Technical review closed, correction completed, administrative verification completed, and the original evidence-bounded finding remained unchanged." },
] as const;

const supported = [
  "The admitted source-level control path supports rollback atomicity at the visible transaction boundary under the bounded harness condition reviewed in this case.",
  "The submitted run output reports the corresponding bounded atomicity check as passing for the admitted demonstration surface.",
  "The reviewed control path supports a narrower proposition than the broader frozen claim and can be described without relying on unsubmitted dependency behavior.",
  "The case demonstrates that TA-14 can preserve evidence-object integrity, admission limits, correction history, and final case state without rewriting earlier records.",
] as const;

const notEstablished = [
  "The full frozen claim was not established across the broader dependency surface because material dependency implementation was outside the admitted evidence set.",
  "TA-14 did not independently re-execute the submitted claim-check during this founding demonstration.",
  "Production-path coverage was outside the bounded demonstration surface.",
  "Production concurrency behavior was outside the bounded demonstration surface.",
  "A simulated interruption in an admitted test path was not treated as proof of every possible failure originating inside unsubmitted dependency implementation.",
  "The case does not establish certification, endorsement, production readiness, legal validity, regulatory approval, or universal Shango MID performance.",
] as const;

const correctionRules = [
  { title: "A test name is not evidence", text: "A test label, comment, or stated purpose cannot establish the proposition actually tested. The proposition must be derived from the admitted control path and observed evidence behavior." },
  { title: "A correction is not self-authenticating", text: "No correction becomes authoritative merely because it is a correction. A corrected proposition changes the governed record only when the correction is itself supported by the evidence available to the case." },
  { title: "The rule applies both ways", text: "The same discipline applies to favorable and adverse descriptions. A test may not receive extra credit because its label is modest, and it may not receive broader credit because its label is ambitious." },
  { title: "Chronology stays visible", text: "Later clarification can narrow or correct a governed record without deleting the earlier record state. Version lineage preserves what was known, what changed, and why." },
] as const;

const registryChecks = [
  { source: "Canonical Registry submission", field: "current_version", value: "2.2", result: "MATCH" },
  { source: "Public Registry projection", field: "version", value: "2.2", result: "MATCH" },
  { source: "Governance profile", field: "governance_version", value: "2.2", result: "MATCH" },
] as const;

const publicBoundary = [
  "The public page reports the governed finding, case chronology, administrative state, and bounded methodological lessons.",
  "Protected evidence files are not reproduced or exposed through this page.",
  "Private correspondence is not reproduced, quoted, or used as a substitute for the controlled public record.",
  "Non-public technical implementation details are omitted unless they are necessary to state the bounded finding accurately.",
  "Integrity identifiers may be preserved internally without requiring publication of the underlying protected evidence object.",
  "Publication of the finding does not convert restricted evidence into public evidence and does not enlarge TA-14's publication rights over participant-owned material.",
] as const;

const finalState = [
  ["REGISTERED VERSION", "VERIFIED — 2.2"],
  ["GOVERNED FINDING RECORD", "FD-2026-0005-GFR · v1.3"],
  ["TECHNICAL FINDING", "PARTIALLY SUPPORTED"],
  ["TECHNICAL REVIEW", "CLOSED"],
  ["CORRECTION STATUS", "COMPLETE"],
  ["ADMINISTRATIVE VERIFICATION", "COMPLETE"],
  ["CASE STATUS", "ADMINISTRATIVELY CLOSED"],
  ["CLOSURE CLASS", "ADMINISTRATIVE CLOSURE — TECHNICAL FINDING PRESERVED"],
] as const;

const principles = [
  "Evidence determines the finding.",
  "Missing evidence remains missing.",
  "Corrections require evidence too.",
  "Closure does not rewrite the finding.",
] as const;

export default function ShangoFoundingDemonstrationPage() {
  return (
    <main className="page-shell">
      <div className="starfield starfield-a" />
      <div className="starfield starfield-b" />
      <div className="orbit orbit-a"><i /></div>
      <div className="orbit orbit-b"><i /></div>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="grid" />

      <header className="topbar">
        <Link href="/artifacts/registry" className="brand">
          <span className="mark">TA</span>
          <span><strong>TA-14</strong><small>Governed Artifact Record</small></span>
        </Link>
        <nav>
          <Link href="/artifacts/registry">Registered Artifacts</Link>
          <Link href="/workspace/ai-governance/registry/records/TA-14-AIGR-000011">Governance Record</Link>
          <Link href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
          <Link href="/academy">TA-14 Academy</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="badge-row">
            <span className="badge founding">FOUNDING DEMONSTRATION</span>
            <span className="badge governed">GOVERNED FINDING</span>
            <span className="badge closed">CLOSED CASE</span>
            <span className="badge public">PUBLIC RECORD</span>
          </div>
          <p className="kicker">SHANGO MID · FD-2026-0005 · TA-14-AIGR-000011</p>
          <h1>Evidence can support a narrower truth than the claim.</h1>
          <p className="lede">
            Shango MID entered a bounded TA-14 founding demonstration around a frozen transaction-boundary claim. The admitted evidence supported a meaningful but narrower proposition, a post-finding clarification narrowed one test description further, and the final case closed without converting the bounded result into a broader validation.
          </p>

          <div className="finding-banner">
            <span>TA-14 GOVERNED FINDING</span>
            <strong>PARTIALLY SUPPORTED</strong>
            <p>The finding remains evidence-bounded and unchanged by later administrative verification.</p>
          </div>

          <div className="hero-actions">
            <Link className="button primary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000011">Open Shango Registry Record</Link>
            <Link className="button secondary" href="/artifacts/registry">Return to Registered Artifacts</Link>
            <Link className="button ghost" href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
          </div>
        </div>

        <aside className="identity-card">
          <div className="identity-head">
            <span>CONTROLLED PUBLIC IDENTITY</span>
            <strong>TA-14-AIGR-000011</strong>
          </div>
          <dl>
            <div><dt>Governance</dt><dd>Shango MID</dd></div>
            <div><dt>Registered version</dt><dd>2.2 · VERIFIED</dd></div>
            <div><dt>Founding demonstration</dt><dd>FD-2026-0005</dd></div>
            <div><dt>Finding record</dt><dd>FD-2026-0005-GFR · v1.3</dd></div>
            <div><dt>Finding class</dt><dd className="partial">PARTIALLY SUPPORTED</dd></div>
            <div><dt>Technical review</dt><dd className="complete">CLOSED</dd></div>
            <div><dt>Correction</dt><dd className="complete">COMPLETE</dd></div>
            <div><dt>Administrative verification</dt><dd className="complete">COMPLETE</dd></div>
            <div><dt>Case state</dt><dd className="complete">ADMINISTRATIVELY CLOSED</dd></div>
            <div><dt>Record date</dt><dd>August 11, 2026</dd></div>
          </dl>
        </aside>
      </section>

      <section className="principle-strip">
        {principles.map((item, index) => (
          <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
        ))}
      </section>

      <section className="content-shell">
        <article className="panel publication-panel">
          <div className="publication-mark">PUBLICATION BOUNDARY</div>
          <div>
            <p className="section-kicker">WHAT THE WEBSITE PUBLISHES</p>
            <h2>The governed record is public. The private evidence room is not.</h2>
            <p>
              This page publishes the bounded TA-14 finding and the controlled state transitions that produced it. It does not publish protected evidence files, private correspondence, or unnecessary non-public implementation detail. Public transparency attaches to the governance record; it does not erase evidence-protection boundaries.
            </p>
          </div>
          <div className="boundary-grid">
            {publicBoundary.map((item) => <div key={item}><span>✓</span><p>{item}</p></div>)}
          </div>
        </article>

        <article className="panel lifecycle-panel">
          <div className="section-heading">
            <p className="section-kicker">CONTROLLED CASE LIFECYCLE</p>
            <h2>From representation to evidence to finding to closure.</h2>
            <p>The demonstration is useful because the result is reconstructable as a sequence rather than presented as a single verdict.</p>
          </div>
          <div className="timeline">
            {lifecycle.map((item, index) => (
              <div className="timeline-row" key={item.step}>
                <div className="timeline-index"><span>{item.step}</span><i />{index < lifecycle.length - 1 && <b />}</div>
                <div className="timeline-copy"><small>{item.label}</small><h3>{item.title}</h3><p>{item.text}</p></div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel finding-panel">
          <div className="section-heading">
            <p className="section-kicker">EVIDENCE-BOUNDED FINDING</p>
            <h2>What the admitted evidence supports.</h2>
            <p>
              TA-14 did not ask whether Shango MID was promising, sophisticated, or directionally correct. The review asked what the admitted evidence actually established for the frozen proposition.
            </p>
          </div>
          <div className="finding-grid supported-grid">
            {supported.map((item, index) => (
              <div className="finding-card support" key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
            ))}
          </div>
        </article>

        <article className="panel ceiling-panel">
          <div className="section-heading">
            <p className="section-kicker">FINDING CEILING</p>
            <h2>What the case does not establish.</h2>
            <p>
              A bounded finding remains credible only when its ceiling is as visible as its support. Material outside the admitted set was not treated as though it had been reviewed.
            </p>
          </div>
          <div className="finding-grid">
            {notEstablished.map((item, index) => (
              <div className="finding-card limit" key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
            ))}
          </div>
        </article>

        <article className="panel method-panel">
          <div className="section-heading">
            <p className="section-kicker">METHODOLOGY LEARNING</p>
            <h2>The correction became part of the governance method.</h2>
            <p>
              One of the most consequential outputs of FD-2026-0005 was not a stronger finding. It was a stronger rule for how TA-14 handles test descriptions and later corrections.
            </p>
          </div>
          <div className="method-grid">
            {correctionRules.map((rule, index) => (
              <div className="method-card" key={rule.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{rule.title}</h3><p>{rule.text}</p></div>
            ))}
          </div>
          <div className="rule-banner">
            <span>GOVERNING RULE</span>
            <strong>A representation does not establish the underlying condition. A correction does not establish the corrected condition. Evidence must do that work.</strong>
          </div>
        </article>

        <article className="panel correction-panel">
          <div>
            <p className="section-kicker">CONTROLLED CORRECTION</p>
            <h2>The record narrowed without erasing its chronology.</h2>
            <p>
              After the initial finding, a clarification identified that one admitted test path simulated an evidence-path interruption at the visible transaction boundary rather than demonstrating every possible failure internal to an unsubmitted dependency. TA-14 evaluated that clarification against the admitted control path and narrowed the governed description accordingly.
            </p>
            <p>
              The finding class did not change. The result remained <strong>PARTIALLY SUPPORTED</strong>. Earlier record versions remained preserved rather than silently rewritten.
            </p>
          </div>
          <div className="correction-flow">
            <div><span>INITIAL RECORD</span><strong>v1.1</strong><p>Evidence-bounded finding issued.</p></div>
            <b>→</b>
            <div><span>CLARIFICATION</span><strong>CHECKED</strong><p>Correction evaluated against admitted evidence behavior.</p></div>
            <b>→</b>
            <div><span>CURRENT FINDING</span><strong>v1.3</strong><p>Technical finding preserved; description narrowed.</p></div>
          </div>
        </article>

        <article className="panel registry-panel">
          <div className="section-heading">
            <p className="section-kicker">AUTHORITATIVE REGISTRY VERIFICATION</p>
            <h2>Version 2.2 was verified from the Registry side.</h2>
            <p>
              The technical review closed before the final administrative identity field was independently checked. TA-14 later verified that field against the authoritative Registry source rather than accepting the submitted representation as proof of what the Registry stored.
            </p>
          </div>
          <div className="registry-table">
            <div className="registry-row header"><span>Source</span><span>Field</span><span>Observed value</span><span>Result</span></div>
            {registryChecks.map((item) => (
              <div className="registry-row" key={item.source}><strong>{item.source}</strong><code>{item.field}</code><span>{item.value}</span><b>{item.result}</b></div>
            ))}
          </div>
          <div className="verification-result"><span>DETERMINATION</span><strong>VERIFIED — Shango MID is registered under TA-14-AIGR-000011 at Version 2.2.</strong></div>
        </article>

        <article className="panel separation-panel">
          <div className="split-copy">
            <div>
              <p className="section-kicker">TECHNICAL VS. ADMINISTRATIVE STATE</p>
              <h2>Administrative verification did not upgrade the technical finding.</h2>
              <p>
                Verifying the Registry version answered an identity question. It did not create new technical evidence. TA-14 therefore closed the administrative item while preserving the technical finding exactly where the admitted technical evidence had placed it.
              </p>
            </div>
            <div className="equation">
              <span>VERSION VERIFIED</span><b>≠</b><span>TECHNICAL CLAIM UPGRADED</span>
            </div>
          </div>
        </article>

        <article className="claims-grid">
          <div className="claim-card proves">
            <span>WHAT THIS FOUNDING DEMONSTRATION PROVES ABOUT THE PROCESS</span>
            <h3>A governance institution can preserve a useful partial finding without manufacturing certainty.</h3>
            <p>
              FD-2026-0005 shows a bounded route from case entry through evidence integrity, admission, technical finding, correction, Registry-side verification, and controlled closure. The process was capable of narrowing its own language while preserving chronology and evidence limits.
            </p>
          </div>
          <div className="claim-card limits">
            <span>WHAT IT DOES NOT PROVE ABOUT SHANGO MID</span>
            <h3>No certification. No universal validation. No production-readiness claim.</h3>
            <p>
              The demonstration does not certify Shango MID, validate every architectural claim, establish every dependency behavior, prove production concurrency, establish legal or regulatory conformity, or authorize reliance outside the bounded FD-2026-0005 record.
            </p>
          </div>
        </article>

        <article className="panel state-panel">
          <div className="section-heading">
            <p className="section-kicker">FINAL CONTROLLED STATE</p>
            <h2>The case is closed. The finding remains bounded.</h2>
          </div>
          <div className="state-grid">
            {finalState.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
        </article>

        <article className="panel nonclaim-panel">
          <div className="shield">BOUNDARY</div>
          <div>
            <p className="section-kicker">PRESERVED NON-CLAIMS</p>
            <h2>Registration and case closure are not certification.</h2>
            <p>
              Registration is not certification, endorsement, legal validation, regulatory approval, ownership adjudication, or proof of technical performance. Administrative closure does not convert a PARTIALLY SUPPORTED finding into a broader result and does not establish production readiness.
            </p>
          </div>
        </article>
      </section>

      <section className="closing">
        <p>TA-14 AI GOVERNANCE EXCHANGE · FOUNDING DEMONSTRATION RECORD</p>
        <h2>Publish the governed truth. Preserve the evidence boundary.</h2>
        <p className="closing-copy">
          The institutional value of a finding is not that it sounds favorable. It is that a later reader can determine what was examined, what the evidence supported, what remained outside scope, what changed, and why the final record deserves reliance only within its stated boundary.
        </p>
        <div>
          <Link className="button primary" href="/artifacts/registry">Registered Artifacts</Link>
          <Link className="button secondary" href="/workspace/ai-governance/registry/records/TA-14-AIGR-000011">Shango Registry Record</Link>
          <Link className="button secondary" href="/workspace/ai-governance/reviews">Reviews & Responses</Link>
        </div>
      </section>

      <footer>
        <div><strong>TA-14 Authority Governance Institution</strong><span>Shango MID Founding Demonstration · FD-2026-0005</span></div>
        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){background:#02060c;scroll-behavior:smooth}
        :global(body){margin:0;background:#02060c;color:#edf8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit;text-decoration:none}
        .page-shell{--gold:#f4ba54;--blue:#62d8ff;--green:#69efb0;--amber:#ffd37b;--red:#ff7884;--ink:#02060c;min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 82% 10%,rgba(42,126,176,.23),transparent 27%),radial-gradient(circle at 12% 31%,rgba(244,186,84,.1),transparent 25%),radial-gradient(circle at 70% 72%,rgba(68,239,176,.08),transparent 25%),linear-gradient(180deg,#02060c 0%,#06111c 48%,#02060c 100%)}
        .grid{position:absolute;inset:0;pointer-events:none;opacity:.13;background-image:linear-gradient(rgba(95,205,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(95,205,255,.08) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,black,transparent 88%)}
        .ambient{position:absolute;border-radius:50%;filter:blur(110px);opacity:.2;pointer-events:none;animation:drift 14s ease-in-out infinite alternate}.ambient-a{width:580px;height:580px;right:-220px;top:420px;background:#0088d8}.ambient-b{width:520px;height:520px;left:-260px;top:1600px;background:#d79d35;animation-delay:-4s}
        .starfield{position:absolute;inset:-20%;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.9) 0 1px,transparent 1.5px);background-size:130px 130px;opacity:.17;animation:starMove 42s linear infinite}.starfield-b{background-size:190px 190px;opacity:.1;animation-duration:64s;animation-direction:reverse;transform:rotate(7deg)}
        .orbit{position:absolute;border:1px solid rgba(95,216,255,.15);border-radius:50%;pointer-events:none;animation:spin 26s linear infinite}.orbit i{position:absolute;width:8px;height:8px;border-radius:50%;background:var(--blue);box-shadow:0 0 18px rgba(98,216,255,.8)}.orbit-a{width:440px;height:440px;right:-150px;top:160px}.orbit-a i{left:44px;top:48px}.orbit-b{width:300px;height:300px;left:-110px;top:980px;animation-direction:reverse;animation-duration:34s}.orbit-b i{right:32px;bottom:44px;background:var(--gold);box-shadow:0 0 18px rgba(244,186,84,.8)}
        .topbar{min-height:78px;position:relative;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(143,222,255,.13);background:rgba(2,7,13,.9);backdrop-filter:blur(24px)}
        .brand{display:flex;align-items:center;gap:12px}.mark{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(244,186,84,.62);border-radius:13px;color:var(--gold);font-weight:900;background:linear-gradient(145deg,rgba(244,186,84,.2),rgba(12,23,37,.9));box-shadow:0 0 30px rgba(244,186,84,.08)}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.18em;font-size:.92rem}.brand small{margin-top:3px;color:#87a8bd;font-size:.68rem;letter-spacing:.11em;text-transform:uppercase}.topbar nav{display:flex;gap:24px;color:#9ab6c8;font-size:.8rem}.topbar nav a{transition:.2s}.topbar nav a:hover{color:white;transform:translateY(-1px)}
        .hero{position:relative;z-index:3;max-width:1500px;margin:0 auto;display:grid;grid-template-columns:1.14fr .86fr;gap:66px;align-items:center;padding:104px 5vw 84px}.hero-copy{max-width:900px}.badge-row{display:flex;gap:9px;flex-wrap:wrap}.badge{display:inline-flex;align-items:center;border-radius:999px;padding:8px 12px;font-size:.67rem;font-weight:900;letter-spacing:.12em}.founding{border:1px solid rgba(244,186,84,.45);background:rgba(244,186,84,.12);color:#ffd88c}.governed{border:1px solid rgba(98,216,255,.4);background:rgba(98,216,255,.1);color:#9ce9ff}.closed{border:1px solid rgba(105,239,176,.42);background:rgba(105,239,176,.1);color:#9affd2}.public{border:1px solid rgba(190,155,255,.4);background:rgba(190,155,255,.1);color:#dcc6ff}.kicker{margin:25px 0 12px;color:#7fd0ed;font-size:.77rem;letter-spacing:.19em;text-transform:uppercase}.hero h1{font-size:clamp(3.3rem,6.2vw,6.9rem);line-height:.91;letter-spacing:-.052em;margin:0;max-width:1050px;background:linear-gradient(180deg,#fff 20%,#d6edf8 75%,#9fc5d8);-webkit-background-clip:text;color:transparent}.lede{font-size:1.13rem;line-height:1.78;color:#b7cedc;max-width:850px;margin:30px 0}.finding-banner{margin-top:32px;padding:23px 25px;border:1px solid rgba(244,186,84,.34);border-radius:21px;background:linear-gradient(135deg,rgba(244,186,84,.1),rgba(18,50,74,.6));box-shadow:0 24px 70px rgba(0,0,0,.22)}.finding-banner span{display:block;color:#e5b96d;font-size:.68rem;letter-spacing:.16em;font-weight:900}.finding-banner strong{display:block;margin-top:8px;font-size:1.55rem;letter-spacing:.04em}.finding-banner p{margin:8px 0 0;color:#a9c2d2;line-height:1.6}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.button{display:inline-flex;align-items:center;justify-content:center;padding:13px 17px;border-radius:12px;border:1px solid rgba(135,203,234,.18);font-size:.78rem;font-weight:850;letter-spacing:.03em;transition:.22s}.button:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.28)}.primary{background:linear-gradient(135deg,#0d86bd,#185b82);color:white;box-shadow:0 12px 34px rgba(0,131,198,.2)}.secondary{background:rgba(20,45,65,.72);color:#d7effa}.ghost{background:transparent;color:#9eb9c9}
        .identity-card{border:1px solid rgba(105,200,237,.2);border-radius:26px;background:linear-gradient(150deg,rgba(12,28,42,.88),rgba(5,14,24,.95));padding:25px;box-shadow:0 40px 90px rgba(0,0,0,.3);backdrop-filter:blur(20px)}.identity-head{padding-bottom:18px;border-bottom:1px solid rgba(145,218,244,.13)}.identity-head span{display:block;color:#7797ab;font-size:.67rem;letter-spacing:.17em;font-weight:900}.identity-head strong{display:block;margin-top:8px;font-size:1.34rem;color:#b3edff;letter-spacing:.05em}.identity-card dl{margin:0}.identity-card dl div{display:grid;grid-template-columns:.85fr 1.15fr;gap:18px;padding:13px 0;border-bottom:1px solid rgba(144,199,224,.08)}.identity-card dt{color:#718fa3;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em}.identity-card dd{margin:0;text-align:right;color:#d8edf7;font-size:.83rem}.identity-card .partial{color:#ffd27f;font-weight:850}.identity-card .complete{color:#83f3bc;font-weight:850}
        .principle-strip{position:relative;z-index:3;max-width:1500px;margin:0 auto 44px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(110,204,240,.13);border-radius:22px;overflow:hidden;background:rgba(5,16,27,.82);backdrop-filter:blur(18px)}.principle-strip div{min-height:100px;padding:21px 22px;display:flex;gap:14px;align-items:center;border-right:1px solid rgba(110,204,240,.1)}.principle-strip div:last-child{border-right:0}.principle-strip span{font-size:.72rem;color:#e0b365;font-weight:900;letter-spacing:.12em}.principle-strip strong{font-size:.94rem;line-height:1.4}
        .content-shell{position:relative;z-index:3;max-width:1500px;margin:0 auto;padding:24px 5vw 90px}.panel{margin:0 0 30px;border:1px solid rgba(120,205,238,.15);border-radius:26px;background:linear-gradient(145deg,rgba(8,24,38,.88),rgba(4,12,21,.94));padding:34px;box-shadow:0 26px 74px rgba(0,0,0,.2);backdrop-filter:blur(18px)}.section-kicker{margin:0 0 8px;color:#78cce9;font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;font-weight:900}.section-heading h2,.publication-panel h2,.correction-panel h2,.split-copy h2,.nonclaim-panel h2{margin:0;font-size:clamp(1.9rem,3.3vw,3.35rem);line-height:1.04;letter-spacing:-.035em}.section-heading>p:last-child,.publication-panel>div>p:last-child,.correction-panel>div>p,.split-copy p,.nonclaim-panel p{color:#a8c1d0;line-height:1.72}.publication-panel{display:grid;grid-template-columns:auto .8fr 1.2fr;gap:28px;align-items:start;border-color:rgba(244,186,84,.26);background:linear-gradient(145deg,rgba(36,29,16,.52),rgba(6,18,29,.94))}.publication-mark{writing-mode:vertical-rl;transform:rotate(180deg);padding:12px 9px;border-radius:10px;background:rgba(244,186,84,.12);border:1px solid rgba(244,186,84,.28);color:#ffd37b;font-size:.66rem;letter-spacing:.16em;font-weight:900}.boundary-grid{display:grid;gap:9px}.boundary-grid div{display:flex;gap:11px;padding:11px 13px;border:1px solid rgba(117,202,234,.1);border-radius:12px;background:rgba(7,22,34,.7)}.boundary-grid span{color:#73efb3;font-weight:900}.boundary-grid p{margin:0;color:#b4ccda;font-size:.82rem;line-height:1.55}
        .lifecycle-panel{padding:40px}.timeline{margin-top:28px}.timeline-row{display:grid;grid-template-columns:70px 1fr;gap:22px;min-height:135px}.timeline-index{position:relative;display:flex;justify-content:center}.timeline-index span{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(98,216,255,.36);background:#071724;color:#a3e9ff;font-weight:900;font-size:.76rem;z-index:2;box-shadow:0 0 24px rgba(98,216,255,.08)}.timeline-index b{position:absolute;width:1px;top:46px;bottom:0;background:linear-gradient(rgba(98,216,255,.35),rgba(98,216,255,.04))}.timeline-copy{padding:2px 0 26px}.timeline-copy small{color:#d6ad63;letter-spacing:.15em;font-weight:900;font-size:.65rem}.timeline-copy h3{margin:7px 0 8px;font-size:1.35rem}.timeline-copy p{margin:0;color:#9fb9c9;line-height:1.68;max-width:1050px}
        .finding-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin-top:24px}.finding-card{display:grid;grid-template-columns:46px 1fr;gap:13px;padding:20px;border-radius:16px;border:1px solid rgba(119,199,231,.12);background:rgba(7,21,33,.7)}.finding-card span{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;font-size:.7rem;font-weight:900}.finding-card p{margin:0;color:#b0c8d6;line-height:1.63}.finding-card.support{border-color:rgba(105,239,176,.16)}.finding-card.support span{background:rgba(105,239,176,.1);color:#89f9c2}.finding-card.limit{border-color:rgba(255,120,132,.14)}.finding-card.limit span{background:rgba(255,120,132,.09);color:#ff9ca5}.ceiling-panel{background:linear-gradient(145deg,rgba(39,14,20,.38),rgba(6,17,27,.94))}
        .method-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px}.method-card{position:relative;overflow:hidden;padding:22px;border:1px solid rgba(244,186,84,.15);border-radius:17px;background:linear-gradient(145deg,rgba(31,27,18,.68),rgba(7,20,31,.82))}.method-card>span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:10px;background:rgba(244,186,84,.11);color:#ffd27f;font-size:.69rem;font-weight:900}.method-card h3{margin:15px 0 9px;font-size:1.05rem}.method-card p{margin:0;color:#9fb8c7;line-height:1.62;font-size:.84rem}.rule-banner{margin-top:20px;padding:22px 24px;border-radius:17px;border:1px solid rgba(98,216,255,.24);background:linear-gradient(135deg,rgba(98,216,255,.08),rgba(244,186,84,.06))}.rule-banner span{display:block;color:#71cdeb;font-size:.65rem;font-weight:900;letter-spacing:.16em}.rule-banner strong{display:block;margin-top:8px;max-width:1120px;font-size:1.14rem;line-height:1.55}
        .correction-panel{display:grid;grid-template-columns:.88fr 1.12fr;gap:36px;align-items:center}.correction-panel>div>p{margin:15px 0}.correction-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:12px;align-items:center}.correction-flow>div{min-height:150px;padding:19px;border-radius:16px;border:1px solid rgba(120,203,236,.14);background:rgba(6,19,31,.76)}.correction-flow>div span{display:block;color:#7199ae;font-size:.63rem;letter-spacing:.14em;font-weight:900}.correction-flow>div strong{display:block;margin-top:12px;font-size:1.3rem;color:#dff5ff}.correction-flow>div p{margin:9px 0 0;color:#9db6c6;font-size:.8rem;line-height:1.55}.correction-flow>b{color:#e0b462;font-size:1.3rem}
        .registry-table{margin-top:24px;border:1px solid rgba(118,202,236,.13);border-radius:17px;overflow:hidden}.registry-row{display:grid;grid-template-columns:1.45fr 1fr .7fr .65fr;gap:14px;align-items:center;padding:15px 17px;border-bottom:1px solid rgba(117,196,228,.09);background:rgba(6,19,30,.65)}.registry-row:last-child{border-bottom:0}.registry-row.header{background:rgba(12,42,61,.78);color:#7ba7bd;text-transform:uppercase;font-size:.63rem;letter-spacing:.12em;font-weight:900}.registry-row strong{font-size:.85rem}.registry-row code{font-size:.77rem;color:#9edff5}.registry-row b{color:#75f0b4;font-size:.73rem;letter-spacing:.08em}.verification-result{margin-top:17px;padding:18px 20px;border:1px solid rgba(105,239,176,.2);border-radius:15px;background:rgba(105,239,176,.06)}.verification-result span{display:block;color:#74caa3;font-size:.64rem;letter-spacing:.15em;font-weight:900}.verification-result strong{display:block;margin-top:7px;color:#c9fce2}
        .split-copy{display:grid;grid-template-columns:1.15fr .85fr;gap:34px;align-items:center}.equation{display:flex;align-items:center;justify-content:center;gap:18px;padding:28px;border-radius:18px;border:1px solid rgba(244,186,84,.2);background:rgba(36,27,13,.45)}.equation span{font-size:.78rem;letter-spacing:.08em;font-weight:900;text-align:center}.equation b{font-size:1.5rem;color:#ffd078}
        .claims-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px}.claim-card{padding:29px;border-radius:23px;border:1px solid rgba(120,205,238,.14);background:rgba(6,18,29,.9)}.claim-card>span{font-size:.64rem;letter-spacing:.16em;font-weight:900}.claim-card h3{font-size:1.6rem;line-height:1.15;margin:12px 0}.claim-card p{color:#9fb9c8;line-height:1.7}.claim-card.proves{border-color:rgba(105,239,176,.18);background:linear-gradient(145deg,rgba(19,54,42,.36),rgba(5,18,29,.92))}.claim-card.proves>span{color:#72eeb1}.claim-card.limits{border-color:rgba(255,120,132,.16);background:linear-gradient(145deg,rgba(52,18,24,.34),rgba(5,18,29,.92))}.claim-card.limits>span{color:#ff9da6}
        .state-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;margin-top:24px}.state-grid div{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:16px 17px;border-radius:13px;border:1px solid rgba(120,202,234,.11);background:rgba(6,18,29,.72)}.state-grid span{color:#7596a9;font-size:.67rem;letter-spacing:.1em;font-weight:900}.state-grid strong{font-size:.83rem;text-align:right;color:#dff6ff}
        .nonclaim-panel{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;border-color:rgba(244,186,84,.2)}.shield{width:98px;height:98px;display:grid;place-items:center;clip-path:polygon(50% 0,92% 17%,85% 71%,50% 100%,15% 71%,8% 17%);background:linear-gradient(145deg,rgba(244,186,84,.28),rgba(98,216,255,.14));color:#ffe0a2;font-size:.63rem;letter-spacing:.08em;font-weight:900}.nonclaim-panel p{margin-bottom:0}
        .closing{position:relative;z-index:3;text-align:center;padding:82px 5vw 92px;border-top:1px solid rgba(116,200,233,.12);background:radial-gradient(circle at 50% 20%,rgba(32,115,160,.15),transparent 42%)}.closing>p:first-child{color:#e1b769;font-size:.67rem;letter-spacing:.18em;font-weight:900}.closing h2{max-width:970px;margin:12px auto 18px;font-size:clamp(2.5rem,5vw,5.3rem);line-height:.98;letter-spacing:-.045em}.closing-copy{max-width:900px;margin:0 auto 27px;color:#9eb8c8;line-height:1.72}.closing>div{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        footer{position:relative;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:28px 5vw;border-top:1px solid rgba(119,200,232,.1);background:#02070c;color:#7693a5}footer strong,footer span{display:block}footer strong{color:#cce7f3;font-size:.82rem}footer span{margin-top:4px;font-size:.69rem}footer p{font-size:.72rem;letter-spacing:.08em}
        @keyframes starMove{to{transform:translate3d(150px,110px,0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes drift{from{transform:translate3d(0,-10px,0) scale(.95)}to{transform:translate3d(40px,35px,0) scale(1.08)}}
        @media(max-width:1100px){.topbar nav{display:none}.hero{grid-template-columns:1fr;padding-top:78px}.identity-card{max-width:820px}.principle-strip{grid-template-columns:repeat(2,1fr)}.publication-panel{grid-template-columns:auto 1fr}.boundary-grid{grid-column:1/-1}.method-grid{grid-template-columns:repeat(2,1fr)}.correction-panel,.split-copy{grid-template-columns:1fr}.correction-flow{grid-template-columns:1fr}.correction-flow>b{transform:rotate(90deg);text-align:center}.claims-grid{grid-template-columns:1fr}}
        @media(max-width:720px){.topbar{padding:0 18px}.hero{padding:68px 20px 54px}.hero h1{font-size:3.25rem}.principle-strip{margin:0 20px 30px;grid-template-columns:1fr}.principle-strip div{border-right:0;border-bottom:1px solid rgba(110,204,240,.1)}.content-shell{padding:18px 20px 62px}.panel{padding:23px;border-radius:20px}.publication-panel{grid-template-columns:1fr}.publication-mark{writing-mode:horizontal-tb;transform:none;width:max-content}.finding-grid,.method-grid,.state-grid{grid-template-columns:1fr}.registry-row{grid-template-columns:1fr 1fr}.registry-row.header{display:none}.registry-row strong{grid-column:1/-1}.equation{flex-direction:column}.nonclaim-panel{grid-template-columns:1fr}.shield{width:82px;height:82px}.closing{padding:64px 20px 72px}.closing h2{font-size:3rem}footer{flex-direction:column;align-items:flex-start;padding:24px 20px}}
        @media(prefers-reduced-motion:reduce){.starfield,.orbit,.ambient{animation:none!important}}
      `}</style>
    </main>
  );
}
