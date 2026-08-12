"use client";

import Link from "next/link";

const phases = [
  ["01", "REGISTER", "Preserve identity before review", "The governance architecture must enter the Registry with a stable identifier, version, provenance, declared capability, boundaries, and non-claims before a Founding Demonstration opens."],
  ["02", "BOUND", "Freeze the proposition after the implementation exists", "TA-14 does not pre-engineer the participant's repair or freeze a target claim before there is an implemented condition and evidence surface. The participant brings the narrowest falsifiable claim the existing evidence can carry."],
  ["03", "INTEGRITY", "Verify the submitted objects", "Submitted evidence objects are identified and integrity-checked before they are treated as review material. Object continuity is not technical proof; it establishes which objects actually entered the case."],
  ["04", "ADMIT", "Define the evidence surface", "TA-14 records what is admitted, what is excluded, what remains unavailable, and which limitations travel with the admitted package. Material outside the admitted surface cannot silently support the finding."],
  ["05", "REVIEW", "Test only the frozen proposition", "The review evaluates the bounded claim against admitted evidence. Architecture reputation, intention, labels, unsubmitted dependencies, and favorable interpretation do not substitute for evidence."],
  ["06", "FIND", "Issue only the finding the evidence can carry", "A successful bounded behavior does not automatically establish the broader claim. Findings must preserve both support and ceiling."],
  ["07", "CORRECT", "Corrections require evidence too", "A participant may challenge or correct the record, but a correction is still a representation. The corrected proposition changes the governed record only when the available evidence supports it."],
  ["08", "VERIFY", "Administrative facts answer to their authoritative source", "Registry identity, version, publication state, or other authoritative administrative conditions must be checked from the source that actually governs that condition rather than accepted from a participant representation."],
  ["09", "CLOSE", "Closure does not upgrade technical proof", "Technical review, correction, administrative verification, publication authority, and case closure are separate states. Completing an administrative item cannot strengthen the technical finding without new admitted technical evidence."],
  ["10", "PRESERVE", "Keep chronology visible", "Earlier record states remain preserved. Supersession, narrowing, correction, and closure add governed history; they do not erase it."],
] as const;

const principles = [
  {
    title: "Representation is not condition",
    text: "The representation does not establish the underlying condition. The condition has to be independently supported by the relevant evidence.",
    provenance: "Articulated during FD-2026-0005 after the Shango correction sequence and later applied by TA-14 to its own Registry-side verification obligation.",
  },
  {
    title: "Assessor independence",
    text: "TA-14 should not shape a participant's repair, pre-agree an implementation target, and then later assess whether the participant satisfied the condition TA-14 helped design.",
    provenance: "Refined during planning for a future Shango demonstration when both parties recognized that pre-shaping the repair would cause the assessor to evaluate its own influence.",
  },
  {
    title: "Evidence ceiling",
    text: "A governed finding must stop where admitted evidence stops. Missing evidence remains missing even when the submitted behavior is directionally strong.",
    provenance: "Demonstrated across Harmonic Case 001 and Shango FD-2026-0005.",
  },
  {
    title: "Correction symmetry",
    text: "The same evidentiary discipline applies to favorable and adverse descriptions. A modest label does not earn quiet credit, and an ambitious label does not enlarge what was actually tested.",
    provenance: "Generalized from the Shango T3 correction methodology.",
  },
  {
    title: "Chronology over rewrite",
    text: "A later clarification can change the current record without pretending the earlier state never existed.",
    provenance: "Operationalized through versioned governed-finding records and controlled supersession in FD-2026-0005.",
  },
  {
    title: "Public record, protected evidence",
    text: "A governance institution can publish the bounded finding, chronology, limitations, and closure state without converting protected evidence files or private correspondence into public material.",
    provenance: "Demonstrated through Shango's selective-disclosure publication authorization.",
  },
] as const;

const independenceRules = [
  "Participants build independently before TA-14 freezes a new technical proposition.",
  "TA-14 may explain the review method, evidence expectations, and publication boundary, but does not design the participant's repair for later assessment.",
  "A demonstration claim should emerge from the implemented condition and existing evidence surface rather than from a target sentence the implementation is then engineered to satisfy.",
  "TA-14 records conflicts, prior assistance, or material influence that could affect independence and may narrow, defer, or refuse a demonstration when independence cannot be preserved.",
  "A fee waiver, partnership relationship, registration status, or prior favorable interaction does not predetermine the finding class.",
] as const;

const findingClasses = [
  ["SUPPORTED", "The admitted evidence supports the bounded proposition as written within the stated case conditions.", "This does not imply certification, universal performance, production readiness, legal validity, or support outside the frozen proposition."],
  ["PARTIALLY SUPPORTED", "The admitted evidence supports a meaningful subset or narrower proposition, but not the bounded claim in full.", "The supported portion and the evidence ceiling must both be stated publicly when the finding is published."],
  ["NOT SUPPORTED", "The admitted evidence does not establish the bounded proposition under the reviewed conditions.", "This is not necessarily proof that the underlying capability is absent; it is a finding about the admitted evidence and frozen claim."],
  ["NOT REVIEWABLE", "The proposition cannot be responsibly evaluated because the evidence surface, identity, scope, integrity, or other prerequisite is insufficient or indeterminate.", "TA-14 should not convert missing reviewability into a technical verdict."],
] as const;

const stopConditions = [
  "The participant asks TA-14 to design the implementation that TA-14 would later assess.",
  "The claim is still moving materially while evidence is being reviewed.",
  "Evidence objects cannot be reliably identified or integrity-checked.",
  "A consequential dependency is required to establish the claim but remains outside the admitted surface without a bounded limitation.",
  "Publication rights are being inferred from participation instead of established for the intended public surface.",
  "A correction would alter the finding but the corrected proposition cannot be evidenced.",
  "Administrative completion is being used as a substitute for new technical proof.",
  "A participant expects certification, endorsement, or a predetermined favorable result as consideration for entering the demonstration.",
] as const;

const publicationRules = [
  "Public findings travel with their scope, limitations, finding class, and explicit non-claims.",
  "Protected evidence remains protected unless separately authorized for the relevant publication surface.",
  "Private correspondence is not quoted merely because the resulting governed finding is public.",
  "Participant-originated corrections should be attributed accurately when attribution materially affects the public chronology and publication authority permits it.",
  "Different publication surfaces may require separate permission when the prior permission was surface-specific.",
  "Anonymity can reduce exposure, but it does not itself establish permission when a described party remains reasonably identifiable.",
] as const;

const provenance = [
  ["Harmonic Case 001", "Evidence-bounded runtime demonstration", "Established that demonstrated runtime behavior and missing surrounding institutional chronology can coexist in one finding without being collapsed into a broader PASS."],
  ["Harmonic Case 002", "Progression without inheritance", "Established that later architecture and evidence advancement can be preserved without retroactively upgrading the earlier evaluated state."],
  ["Shango FD-2026-0005", "Correction, verification, and closure", "Established correction symmetry, representation-versus-condition discipline, separation of technical and administrative state, publication-boundary control, and controlled case closure."],
] as const;

export default function FoundingDemonstrationMethodologyPage() {
  return (
    <main className="shell">
      <div className="grid" />
      <div className="glow one" />
      <div className="glow two" />

      <header className="topbar">
        <Link className="brand" href="/artifacts/founding-demonstrations">
          <span className="mark">TA</span>
          <span><strong>TA-14</strong><small>Founding Demonstration Standard</small></span>
        </Link>
        <nav>
          <Link href="/artifacts/founding-demonstrations">Demonstrations</Link>
          <Link href="/artifacts/registry">Registered Artifacts</Link>
          <Link href="/workspace/ai-governance/registry/directory">Governance Registry</Link>
          <Link href="/academy">Academy</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">TA-14 AI GOVERNANCE EXCHANGE · PUBLIC OPERATING STANDARD</p>
        <h1>Founding Demonstration Methodology & Independence Standard</h1>
        <p className="lede">
          A Founding Demonstration is not a promotional review and not a route to a predetermined badge. It is a bounded institutional process for determining what a frozen claim can actually support when identity, evidence, limitations, corrections, authority, publication boundaries, and chronology are governed together.
        </p>
        <div className="root-rule">
          <span>ROOT EVIDENTIARY PRINCIPLE</span>
          <strong>The representation does not establish the underlying condition. The condition has to be independently supported by the relevant evidence.</strong>
        </div>
        <div className="hero-actions">
          <Link className="button primary" href="/artifacts/founding-demonstrations">View Founding Demonstrations</Link>
          <Link className="button secondary" href="/workspace/ai-governance/registry/register">Register Governance First</Link>
        </div>
      </section>

      <section className="standard-meta">
        <div><span>STANDARD STATUS</span><strong>PUBLIC OPERATING STANDARD</strong></div>
        <div><span>APPLIES TO</span><strong>TA-14 FOUNDING DEMONSTRATIONS</strong></div>
        <div><span>ORIGIN BASIS</span><strong>LIVE EXCHANGE CASE EXPERIENCE</strong></div>
        <div><span>CORE POSTURE</span><strong>EVIDENCE-FIRST · INDEPENDENCE-FIRST</strong></div>
      </section>

      <section className="section">
        <div className="heading"><p>01 · GOVERNED SEQUENCE</p><h2>The demonstration begins before evidence review and ends after preservation.</h2><span>Each phase answers a different governance question. Skipping a phase can create a finding that looks clean while hiding where authority, evidence, scope, or chronology actually failed.</span></div>
        <div className="timeline">
          {phases.map(([n,label,title,text], i) => (
            <article key={label} className="phase">
              <div className="rail"><span>{n}</span>{i < phases.length-1 && <i />}</div>
              <div><small>{label}</small><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section panel">
        <div className="heading"><p>02 · INDEPENDENCE</p><h2>TA-14 should not build the answer and then assess its own influence.</h2><span>Method guidance is permitted. Solution shaping for the implementation being evaluated is not the same thing.</span></div>
        <div className="rule-grid">
          {independenceRules.map((rule, i) => <div className="rule" key={rule}><span>{String(i+1).padStart(2,"0")}</span><p>{rule}</p></div>)}
        </div>
        <div className="callout"><strong>NO PRE-FROZEN TARGET</strong><p>If the repair does not yet exist, TA-14 does not freeze the future claim. The participant builds independently. When an implemented condition and evidence surface exist, the participant brings the narrowest falsifiable proposition the evidence can carry.</p></div>
      </section>

      <section className="section">
        <div className="heading"><p>03 · EVIDENTIARY PRINCIPLES</p><h2>Different failures can share the same root substitution.</h2><span>A label, correction, registration payload, anonymity choice, or administrative statement can all be well-formed representations while still failing to establish the condition they describe.</span></div>
        <div className="principle-grid">
          {principles.map((p,i)=><article key={p.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{p.title}</h3><strong>{p.text}</strong><p>{p.provenance}</p></article>)}
        </div>
      </section>

      <section className="section panel">
        <div className="heading"><p>04 · FINDING CLASSES</p><h2>A finding is an evidence state, not a marketing grade.</h2><span>These classes describe what the admitted evidence establishes for the frozen proposition. They do not certify the architecture as a whole.</span></div>
        <div className="findings">
          {findingClasses.map(([label,meaning,boundary])=><article key={label}><span>{label}</span><h3>{meaning}</h3><p>{boundary}</p></article>)}
        </div>
      </section>

      <section className="section split">
        <div className="panel">
          <div className="heading compact"><p>05 · STOP / HOLD CONDITIONS</p><h2>When the process should stop before a verdict.</h2></div>
          <div className="list">{stopConditions.map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div>
        </div>
        <div className="panel">
          <div className="heading compact"><p>06 · PUBLICATION CONTROL</p><h2>Transparency of finding does not erase evidence protection.</h2></div>
          <div className="list">{publicationRules.map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div>
        </div>
      </section>

      <section className="section panel">
        <div className="heading"><p>07 · CASE PROVENANCE</p><h2>This standard came from operating cases, not only abstract doctrine.</h2><span>The rules below were refined through distinct demonstrations that exposed different institutional functions.</span></div>
        <div className="provenance">
          {provenance.map(([name,role,lesson],i)=><article key={name}><div>{String(i+1).padStart(2,"0")}</div><span>{name}</span><h3>{role}</h3><p>{lesson}</p></article>)}
        </div>
        <div className="provenance-actions">
          <Link className="button secondary" href="/artifacts/fd-2026-0002-case-001">Harmonic Case 001</Link>
          <Link className="button secondary" href="/artifacts/fd-2026-0002-case-002">Harmonic Case 002</Link>
          <Link className="button primary" href="/artifacts/fd-2026-0005">Shango FD-2026-0005</Link>
        </div>
      </section>

      <section className="section declaration">
        <p>08 · INSTITUTIONAL DECLARATION</p>
        <h2>A Founding Demonstration is credible only if TA-14 is willing to preserve an inconvenient result.</h2>
        <div className="declaration-grid">
          <div><span>TA-14 MAY FIND</span><strong>SUPPORTED</strong></div>
          <div><span>TA-14 MAY FIND</span><strong>PARTIALLY SUPPORTED</strong></div>
          <div><span>TA-14 MAY FIND</span><strong>NOT SUPPORTED</strong></div>
          <div><span>TA-14 MAY FIND</span><strong>NOT REVIEWABLE</strong></div>
        </div>
        <p className="close-copy">Registration status, fee waiver, partner status, publication permission, prior relationship, or participant reputation does not determine which finding class applies. The admitted evidence does.</p>
      </section>

      <section className="closing">
        <p>TA-14 FOUNDING DEMONSTRATION STANDARD</p>
        <h2>Register first. Build independently. Bring the evidence. Let the finding remain bounded.</h2>
        <div>
          <Link className="button primary" href="/workspace/ai-governance/registry/register">Register Governance</Link>
          <Link className="button secondary" href="/artifacts/founding-demonstrations">Explore Demonstrations</Link>
        </div>
      </section>

      <footer><div><strong>TA-14 Authority Governance Institution</strong><span>TA-14 AI Governance Exchange · Founding Demonstration Methodology & Independence Standard</span></div><p>No admissible evidence. No admissible execution.</p></footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}:global(html){background:#02060c;scroll-behavior:smooth}:global(body){margin:0;background:#02060c;color:#eef8ff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}:global(a){color:inherit;text-decoration:none}
        .shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 85% 8%,rgba(22,125,177,.22),transparent 28%),radial-gradient(circle at 10% 34%,rgba(244,186,84,.10),transparent 24%),linear-gradient(180deg,#02060c,#071521 52%,#02060c)}.grid{position:absolute;inset:0;pointer-events:none;opacity:.11;background-image:linear-gradient(rgba(98,216,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(98,216,255,.08) 1px,transparent 1px);background-size:68px 68px}.glow{position:absolute;border-radius:50%;filter:blur(120px);opacity:.14;pointer-events:none}.glow.one{width:540px;height:540px;right:-240px;top:900px;background:#008fd4}.glow.two{width:500px;height:500px;left:-250px;top:2100px;background:#d89f38}
        .topbar{position:relative;z-index:10;min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(143,222,255,.13);background:rgba(2,7,13,.9);backdrop-filter:blur(22px)}.brand{display:flex;gap:12px;align-items:center}.mark{width:44px;height:44px;display:grid;place-items:center;border-radius:13px;border:1px solid rgba(244,186,84,.58);color:#ffd37b;font-weight:900;background:rgba(244,186,84,.09)}.brand strong,.brand small{display:block}.brand strong{letter-spacing:.16em;font-size:.9rem}.brand small{margin-top:3px;color:#829faf;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase}.topbar nav{display:flex;gap:22px;color:#9bb7c7;font-size:.79rem}.topbar nav a:hover{color:white}
        .hero{position:relative;z-index:2;max-width:1450px;margin:0 auto;padding:108px 5vw 78px}.eyebrow,.heading>p,.declaration>p:first-child,.closing>p:first-child{color:#7ed3ef;font-size:.7rem;letter-spacing:.17em;font-weight:900;text-transform:uppercase}.hero h1{max-width:1200px;margin:16px 0 26px;font-size:clamp(3.4rem,6.5vw,7rem);line-height:.91;letter-spacing:-.055em;background:linear-gradient(180deg,#fff,#d7eef8 72%,#94bed1);-webkit-background-clip:text;color:transparent}.lede{max-width:1020px;color:#b2cad7;font-size:1.13rem;line-height:1.78}.root-rule{max-width:1100px;margin-top:31px;padding:25px;border:1px solid rgba(244,186,84,.3);border-radius:20px;background:linear-gradient(135deg,rgba(244,186,84,.09),rgba(12,42,61,.64))}.root-rule span{display:block;color:#e4b864;font-size:.66rem;letter-spacing:.16em;font-weight:900}.root-rule strong{display:block;margin-top:10px;font-size:1.28rem;line-height:1.5}.hero-actions,.provenance-actions,.closing>div{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.button{display:inline-flex;align-items:center;justify-content:center;padding:12px 16px;border-radius:11px;border:1px solid rgba(130,205,235,.18);font-size:.78rem;font-weight:850}.primary{background:linear-gradient(135deg,#0b85bc,#185b82)}.secondary{background:rgba(17,43,61,.72);color:#d9eff9}
        .standard-meta{position:relative;z-index:2;max-width:1320px;margin:0 auto 34px;display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(111,202,238,.14);border-radius:20px;overflow:hidden;background:rgba(5,17,28,.82)}.standard-meta div{padding:20px;border-right:1px solid rgba(111,202,238,.1)}.standard-meta div:last-child{border-right:0}.standard-meta span{display:block;color:#728fa1;font-size:.62rem;letter-spacing:.12em;font-weight:900}.standard-meta strong{display:block;margin-top:7px;font-size:.83rem}
        .section{position:relative;z-index:2;max-width:1320px;margin:0 auto;padding:68px 5vw}.panel{padding:38px;border:1px solid rgba(111,202,238,.14);border-radius:24px;background:linear-gradient(145deg,rgba(7,23,36,.88),rgba(4,13,22,.94));box-shadow:0 26px 70px rgba(0,0,0,.2)}.heading{max-width:1030px;margin-bottom:28px}.heading p{margin:0 0 8px}.heading h2{margin:0;font-size:clamp(2rem,4vw,4rem);line-height:1.02;letter-spacing:-.04em}.heading>span{display:block;margin-top:13px;color:#9eb9c9;line-height:1.7}.heading.compact h2{font-size:2rem}
        .timeline{margin-top:20px}.phase{display:grid;grid-template-columns:72px 1fr;min-height:145px;gap:22px}.rail{position:relative;display:flex;justify-content:center}.rail span{width:46px;height:46px;display:grid;place-items:center;border:1px solid rgba(98,216,255,.35);border-radius:50%;background:#071724;color:#a4ebff;font-size:.72rem;font-weight:900;z-index:2}.rail i{position:absolute;top:46px;bottom:0;width:1px;background:linear-gradient(rgba(98,216,255,.3),rgba(98,216,255,.04))}.phase small{color:#e2b567;font-size:.65rem;letter-spacing:.14em;font-weight:900}.phase h3{margin:6px 0 8px;font-size:1.3rem}.phase p{margin:0;max-width:980px;color:#9fb8c8;line-height:1.66}
        .rule-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}.rule{display:grid;grid-template-columns:40px 1fr;gap:12px;padding:17px;border:1px solid rgba(111,202,238,.1);border-radius:14px;background:rgba(5,19,30,.7)}.rule>span{width:34px;height:34px;display:grid;place-items:center;border-radius:9px;background:rgba(98,216,255,.09);color:#94e5ff;font-size:.67rem;font-weight:900}.rule p{margin:0;color:#b1c8d5;line-height:1.58}.callout{margin-top:17px;padding:20px;border:1px solid rgba(244,186,84,.2);border-radius:15px;background:rgba(244,186,84,.06)}.callout strong{color:#ffd480;letter-spacing:.12em;font-size:.68rem}.callout p{margin:8px 0 0;color:#b9ced8;line-height:1.67}
        .principle-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.principle-grid article{padding:22px;border:1px solid rgba(118,202,235,.13);border-radius:17px;background:rgba(5,18,29,.8)}.principle-grid article>span{color:#e4b466;font-size:.67rem;font-weight:900}.principle-grid h3{margin:12px 0 9px;font-size:1.12rem}.principle-grid strong{display:block;color:#dceef6;line-height:1.55;font-size:.92rem}.principle-grid p{margin:13px 0 0;color:#829eae;line-height:1.6;font-size:.78rem}
        .findings{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.findings article{padding:22px;border:1px solid rgba(118,202,235,.12);border-radius:16px;background:rgba(6,19,30,.68)}.findings span{color:#ffd37b;font-size:.68rem;letter-spacing:.12em;font-weight:900}.findings h3{font-size:1.05rem;line-height:1.55;margin:10px 0}.findings p{margin:0;color:#91adbd;line-height:1.6;font-size:.82rem}
        .split{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:1400px}.split>.panel{margin:0}.list{display:grid;gap:9px}.list>div{display:grid;grid-template-columns:38px 1fr;gap:11px;padding:12px;border:1px solid rgba(120,202,234,.09);border-radius:12px;background:rgba(5,17,27,.65)}.list b{color:#e2b463;font-size:.66rem}.list span{color:#a8c1ce;line-height:1.55;font-size:.82rem}
        .provenance{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.provenance article{padding:22px;border:1px solid rgba(118,202,235,.12);border-radius:17px;background:rgba(6,19,30,.7)}.provenance article>div{color:#e4b466;font-weight:900;font-size:.7rem}.provenance span{display:block;margin-top:12px;color:#74cde9;font-size:.68rem;letter-spacing:.1em;font-weight:900}.provenance h3{margin:7px 0 9px}.provenance p{margin:0;color:#9fb7c6;line-height:1.65;font-size:.84rem}
        .declaration{text-align:center}.declaration h2{max-width:1050px;margin:12px auto 25px;font-size:clamp(2.3rem,4.7vw,4.9rem);line-height:.98;letter-spacing:-.045em}.declaration-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.declaration-grid div{padding:20px;border:1px solid rgba(244,186,84,.16);border-radius:14px;background:rgba(32,25,13,.35)}.declaration-grid span{display:block;color:#8ca8b7;font-size:.61rem;letter-spacing:.11em}.declaration-grid strong{display:block;margin-top:8px;font-size:.84rem}.close-copy{max-width:900px;margin:24px auto 0;color:#9db7c6;line-height:1.7}
        .closing{position:relative;z-index:2;text-align:center;padding:80px 5vw 88px;border-top:1px solid rgba(117,201,233,.11);background:radial-gradient(circle at 50% 15%,rgba(27,109,151,.14),transparent 45%)}.closing h2{max-width:1000px;margin:12px auto 22px;font-size:clamp(2.5rem,5vw,5.1rem);line-height:.98;letter-spacing:-.045em}.closing>div{justify-content:center}footer{position:relative;z-index:2;display:flex;justify-content:space-between;gap:28px;padding:28px 5vw;border-top:1px solid rgba(117,201,233,.1);background:#02070c;color:#7693a5}footer strong,footer span{display:block}footer strong{color:#cce7f3;font-size:.81rem}footer span{margin-top:4px;font-size:.68rem}footer p{font-size:.7rem;letter-spacing:.07em}
        @media(max-width:1050px){.topbar nav{display:none}.standard-meta{grid-template-columns:repeat(2,1fr);margin-left:5vw;margin-right:5vw}.principle-grid,.provenance{grid-template-columns:1fr 1fr}.split{grid-template-columns:1fr}.declaration-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:700px){.hero,.section{padding-left:20px;padding-right:20px}.hero h1{font-size:3.25rem}.standard-meta{grid-template-columns:1fr;margin-left:20px;margin-right:20px}.standard-meta div{border-right:0;border-bottom:1px solid rgba(111,202,238,.1)}.rule-grid,.principle-grid,.findings,.provenance,.declaration-grid{grid-template-columns:1fr}.panel{padding:23px}.phase{grid-template-columns:54px 1fr}.topbar{padding:0 20px}footer{padding:24px 20px;flex-direction:column}}
      `}</style>
    </main>
  );
}
