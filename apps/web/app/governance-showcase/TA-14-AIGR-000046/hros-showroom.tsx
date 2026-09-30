"use client";

import Link from "next/link";
import { useState } from "react";

import {
  HROS_CONDITIONS,
  HROS_EVIDENCE,
  HROS_LINKS,
  HROS_LIVING_HISTORY,
  HROS_NODES,
  HROS_RECORD,
  NEXT_EXAMINATION_SURFACES,
  NODE_STATUS_LABEL,
  REGISTERED_FORMAL_CLAIMS,
  REGISTERED_KNOWN_LIMITATIONS,
  REGISTERED_NON_CLAIMS,
  REGISTRATION_ESTABLISHED,
  REGISTRATION_NOT_ESTABLISHED,
  splitRegisteredLine,
  type ConditionId,
} from "./showroom-data";

const CLAIM_NUMBERS = REGISTERED_FORMAL_CLAIMS.map((_, i) => i + 1);
const listNumbers = (prefix: string, numbers: number[]) => numbers.map((n) => `${prefix} ${n}`).join(" · ");

function RegisteredQuote({ prefix, number, line }: { prefix: string; number: number; line: string }) {
  const { heading, body } = splitRegisteredLine(line);
  return (
    <li>
      <span className="qn">{prefix} {number}</span>
      <div><b>{heading}</b><p>{body}</p></div>
    </li>
  );
}

export default function HrosShowroom({ initialCondition = "baseline", initialClaim = null }: { initialCondition?: ConditionId; initialClaim?: number | null }) {
  const [conditionId, setConditionId] = useState<ConditionId>(initialCondition);
  const [claim, setClaim] = useState<number | null>(initialClaim);
  const condition = HROS_CONDITIONS.find((c) => c.id === conditionId) ?? HROS_CONDITIONS[0];
  const claimEvidence = claim === null ? HROS_EVIDENCE : HROS_EVIDENCE.filter((e) => e.supportsClaims.includes(claim));

  return <main className="hros"><div className="wrap">
    <nav aria-label="Showroom">
      <Link href="/">TA-14 EXCHANGE</Link>
      <span><Link href={HROS_LINKS.registeredGovernance}>REGISTERED GOVERNANCE</Link><Link href={HROS_LINKS.artifactRegistry}>ARTIFACT REGISTRY →</Link></span>
    </nav>

    <header>
      <div className="badges"><b>REGISTERED GOVERNANCE</b><b>INTERACTIVE SHOWROOM</b><b>{HROS_RECORD.registryIdentifier} · VERSION {HROS_RECORD.version}</b></div>
      <p className="eyebrow">HUMAN ROUTER PROTOCOL OPERATING SYSTEM · WeRAI AI INTEGRATION INC. · STEVEN JAMES STOBO</p>
      <h1>Capability proposes. A human authorizes. The record remembers who did.</h1>
      <p className="lede">HROS declares a fail-closed runtime architecture that keeps generative capability separate from execution authority. This showroom lets you operate that declared chain — and keeps two things apart on purpose: what HROS <em>declares</em>, and what TA-14 has actually <em>examined</em>. For HROS, TA-14 has examined nothing yet. Registration preserved the record; it did not prove the architecture.</p>
      <div className="cta">
        <Link className="primary" href={HROS_LINKS.record}>OPEN PERMANENT RECORD {HROS_RECORD.registryIdentifier} →</Link>
        <Link href={HROS_LINKS.evidence}>PRESERVED EVIDENCE →</Link>
        <Link href={HROS_LINKS.history}>LIFE HISTORY →</Link>
      </div>
      <dl className="facts">
        <div><dt>Registry identifier</dt><dd>{HROS_RECORD.registryIdentifier}</dd></div>
        <div><dt>Record state</dt><dd>{HROS_RECORD.status}</dd></div>
        <div><dt>Steward</dt><dd>{HROS_RECORD.steward}</dd></div>
        <div><dt>Organization</dt><dd>{HROS_RECORD.organization}</dd></div>
        <div><dt>Registered</dt><dd>{HROS_RECORD.registeredDisplay}</dd></div>
        <div><dt>TA-14 examinations</dt><dd>None published</dd></div>
      </dl>
    </header>

    <section aria-labelledby="model-h">
      <p className="eyebrow">HROS DECLARED ARCHITECTURE · OPERATE THE AUTHORITY CHAIN</p>
      <h2 id="model-h">Break the chain. See where HROS says it stops.</h2>
      <p className="sub">Choose a condition. Each node reports what the registered declarations say happens there — or says plainly that the record is silent. Nothing on this model has been run or observed by TA-14.</p>

      <figure className="visual">
        <img src="/hros-human-authority-execution-boundary.png" alt="HROS teaching visual showing capability reaching a human authority boundary before execution." />
        <figcaption><b>THE HUMAN-AUTHORITY BOUNDARY</b><span>The proposal may be technically possible. HROS declares that capability still stops here until attributable human authority is present. The image teaches the separation; the interactive chain below lets you test the declaration.</span></figcaption>
      </figure>

      <div className="controls" role="group" aria-label="Choose a condition">
        {HROS_CONDITIONS.map((c) => (
          <button key={c.id} type="button" aria-pressed={c.id === conditionId} aria-controls="hros-state" onClick={() => setConditionId(c.id)}>{c.control}</button>
        ))}
      </div>

      <ol className="chain" aria-label="Declared authority chain">
        {HROS_NODES.map((node, i) => {
          const status = condition.nodes[node.id];
          return <li key={node.id} className={`node s-${status}`} data-status={status}>
            <span className="num">{String(i + 1).padStart(2, "0")} · {listNumbers("CLAIM", node.claims)}</span>
            <b>{node.label}</b>
            <p>{node.role}</p>
            <em>{NODE_STATUS_LABEL[status]}</em>
            {i < HROS_NODES.length - 1 && <i aria-hidden="true">→</i>}
          </li>;
        })}
      </ol>

      <div id="hros-state" className="state" role="status" aria-live="polite" aria-atomic="true">
        <div className="declared-tag">HROS DECLARED ARCHITECTURE · NOT A TA-14 FINDING</div>
        <small>CURRENT CONDITION</small>
        <strong>{condition.label}</strong>
        <h3>{condition.result}</h3>
        <p>{condition.declared}</p>
        {condition.gap && <p className="gap"><b>WHERE THE RECORD IS SILENT</b> {condition.gap}</p>}
        <div className="basis">
          <div>
            <small>DECLARED BASIS · VERBATIM</small>
            <ul>{condition.claims.map((n) => <RegisteredQuote key={n} prefix="CLAIM" number={n} line={REGISTERED_FORMAL_CLAIMS[n - 1]} />)}</ul>
          </div>
          {(condition.nonClaims.length > 0 || condition.limitations.length > 0) && <div>
            <small>REGISTERED BOUNDARY · VERBATIM</small>
            <ul>
              {condition.nonClaims.map((n) => <RegisteredQuote key={`nc${n}`} prefix="NON-CLAIM" number={n} line={REGISTERED_NON_CLAIMS[n - 1]} />)}
              {condition.limitations.map((n) => <RegisteredQuote key={`l${n}`} prefix="LIMITATION" number={n} line={REGISTERED_KNOWN_LIMITATIONS[n - 1]} />)}
            </ul>
          </div>}
        </div>
        <p className="examined"><b>WHAT TA-14 HAS EXAMINED FOR THIS CONDITION</b> Nothing. No TA-14 demonstration, examination finding or governed artifact is published under {HROS_RECORD.registryIdentifier}.</p>
      </div>

      <figure className="visual">
        <img src="/hros-fail-closed-bypass-boundary.png" alt="HROS teaching visual showing attempted execution routes encountering a fail-closed authority boundary." />
        <figcaption><b>THE BYPASS QUESTION</b><span>A governed boundary matters most when another route tries to go around it. This visual frames the adversarial question: if transport, API, finance, database or physical actuation approaches execution another way, where does authority still have to be established?</span></figcaption>
      </figure>

      <div className="rule"><b>IMPORTANT BOUNDARY</b> This interactive model explains HROS&apos;s declared architecture from the permanent Registry record. Operating it does not run HROS, and it does not convert declaration into runtime proof. Claim numbers follow the order in which the claims appear in the registered text.</div>
    </section>

    <section aria-labelledby="declared-h">
      <p className="eyebrow">THE GOVERNANCE IN ITS OWN TERMS · VERBATIM FROM THE REGISTRY RECORD</p>
      <h2 id="declared-h">Seven declarations. Five non-claims. Four limitations.</h2>
      <p className="sub">Copied from the permanent Registry record without editing. The record controls; if this page and the record ever differ, the record is right.</p>
      <div className="columns">
        <article className="col declared">
          <span className="tag">HROS DECLARED ARCHITECTURE</span>
          <h3>Formal claims</h3>
          <ol className="quotes">{REGISTERED_FORMAL_CLAIMS.map((line, i) => <RegisteredQuote key={i} prefix="CLAIM" number={i + 1} line={line} />)}</ol>
        </article>
        <div className="stack">
          <article className="col bound">
            <span className="tag">EXPLICIT NON-CLAIMS</span>
            <h3>What HROS says it does not claim</h3>
            <ol className="quotes">{REGISTERED_NON_CLAIMS.map((line, i) => <RegisteredQuote key={i} prefix="NON-CLAIM" number={i + 1} line={line} />)}</ol>
          </article>
          <article className="col bound">
            <span className="tag">KNOWN LIMITATIONS</span>
            <h3>Where HROS says its guarantees thin out</h3>
            <ol className="quotes">{REGISTERED_KNOWN_LIMITATIONS.map((line, i) => <RegisteredQuote key={i} prefix="LIMITATION" number={i + 1} line={line} />)}</ol>
          </article>
        </div>
      </div>
    </section>

    <section aria-labelledby="evidence-h">
      <p className="eyebrow">PRESERVED EVIDENCE · FIVE PUBLIC ITEMS</p>
      <h2 id="evidence-h">Trace a claim to what was submitted for it.</h2>
      <p className="sub">Each item is registrant-submitted and preserved with its SHA-256 digest. The claim support shown is the registrant&apos;s own statement. Evidence presence is not a TA-14 finding.</p>
      <div className="controls" role="group" aria-label="Filter evidence by claim">
        <button type="button" aria-pressed={claim === null} aria-controls="hros-evidence" onClick={() => setClaim(null)}>ALL EVIDENCE</button>
        {CLAIM_NUMBERS.map((n) => <button key={n} type="button" aria-pressed={claim === n} aria-controls="hros-evidence" onClick={() => setClaim(n)}>CLAIM {n}</button>)}
      </div>
      <p className="trace" role="status" aria-live="polite">
        {claim === null
          ? `Showing all ${HROS_EVIDENCE.length} preserved items.`
          : `${claimEvidence.length} of ${HROS_EVIDENCE.length} items state support for Claim ${claim} — ${splitRegisteredLine(REGISTERED_FORMAL_CLAIMS[claim - 1]).heading}. Stated support is not established support.`}
      </p>
      <ol id="hros-evidence" className="evidence">
        {HROS_EVIDENCE.map((item) => {
          const active = claim === null || item.supportsClaims.includes(claim);
          return <li key={item.sha256} className={active ? "on" : "off"} data-active={active}>
            <span className="tag">EVIDENCE {item.index} · {item.mimeType} · {item.size} · PUBLIC · CURRENT</span>
            <h3>{item.fileName}</h3>
            <p className="claims">Registrant-stated support: {listNumbers("Claim", item.supportsClaims)}</p>
            <blockquote>{item.description}</blockquote>
            {item.note && <p className="note"><b>TA-14 NOTE</b> {item.note}</p>}
            <p className="hash"><small>SHA-256</small><code>{item.sha256}</code></p>
            <Link href={HROS_LINKS.evidence}>OPEN IN REGISTRY EVIDENCE VIEWER →</Link>
          </li>;
        })}
      </ol>
      <div className="digests">
        <div><small>REGISTRY RECORD DIGEST · SHA-256</small><code>{HROS_RECORD.recordDigestSha256}</code></div>
        <div><small>PUBLIC PROJECTION DIGEST · {HROS_RECORD.publicProjectionDigestVersion}</small><code>{HROS_RECORD.publicProjectionDigestSha256}</code></div>
      </div>
    </section>

    <section aria-labelledby="boundary-h">
      <p className="eyebrow">THE REGISTRATION BOUNDARY</p>
      <h2 id="boundary-h">What registration established — and what it did not.</h2>
      <div className="boundary">
        <article className="yes">
          <span className="tag">WHAT REGISTRATION ESTABLISHED</span>
          <ul>{REGISTRATION_ESTABLISHED.map((line) => <li key={line}>{line}</li>)}</ul>
        </article>
        <article className="no">
          <span className="tag">WHAT REGISTRATION DID NOT ESTABLISH</span>
          <ul>{REGISTRATION_NOT_ESTABLISHED.map((line) => <li key={line}><span aria-hidden="true">✕</span> {line}</li>)}</ul>
        </article>
      </div>
      <p className="statement">Registration establishes the attributable, bounded, preserved Registry record. It is not certification, technical validation, patent validation, legal approval, safety assurance, interoperability proof, performance proof, or execution authorization.</p>
    </section>

    <section aria-labelledby="next-h">
      <p className="eyebrow">NEXT EXAMINATION SURFACE</p>
      <h2 id="next-h">Where a declaration could become a demonstrated result.</h2>
      <p className="sub">Candidate surfaces only. Nothing below is scheduled, agreed or performed, and none of it is a TA-14 finding. Any examination requires its own separately governed scope and would be appended to the history below.</p>
      <div className="surfaces">
        {NEXT_EXAMINATION_SURFACES.map((surface) => <Link key={surface.kind} href={surface.href}>
          <span className="tag">{surface.kind} · OPEN · NOT ENTERED</span>
          <h3>{surface.title}</h3>
          <ul>{surface.questions.map((q) => <li key={q}>{q}</li>)}</ul>
          <b>OPEN {surface.kind} →</b>
        </Link>)}
      </div>
    </section>

    <section aria-labelledby="provenance-visual-h">
      <p className="eyebrow">FROM AUTHORIZATION TO ATTRIBUTABLE HISTORY</p>
      <h2 id="provenance-visual-h">Execution is not the end of the chain.</h2>
      <p className="sub">HROS also declares a provenance layer: the proposal, authority, receipt and resulting execution must remain attributable after the consequence occurs. That is a different problem from merely allowing the action.</p>
      <figure className="visual">
        <img src="/hros-provenance-execution-record.png" alt="HROS teaching visual representing authorization, execution receipt and preserved provenance after a consequential action." />
        <figcaption><b>THE RECORD AFTER THE CONSEQUENCE</b><span>The question changes after execution: can the system still show what was proposed, who authorized it, what actually executed and which record preserves that sequence? The image represents the declared provenance problem; it is not evidence that HROS has demonstrated it.</span></figcaption>
      </figure>
    </section>

    <section aria-labelledby="history-h">
      <p className="eyebrow">LIVING HISTORY · APPEND-ONLY</p>
      <h2 id="history-h">History accumulates. It is never rewritten.</h2>
      <ol className="history">
        {HROS_LIVING_HISTORY.map((entry, i) => <li key={i} data-kind={entry.kind}>
          <time>{entry.date}</time><div><b>{entry.title}</b><p>{entry.detail}</p></div>
        </li>)}
        <li className="open"><time>NEXT ENTRY</time><div><b>Open</b><p>Future demonstrations, examinations, versions, responses and corrections are appended here. Earlier entries stay as they were.</p></div></li>
      </ol>
      <Link className="textlink" href={HROS_LINKS.history}>OPEN THE AUTHORITATIVE LIFE HISTORY →</Link>
    </section>

    <section aria-labelledby="record-h" className="final">
      <p className="eyebrow">THE PERMANENT RECORD</p>
      <h2 id="record-h">The showroom presents. The Registry record controls.</h2>
      <div className="cta">
        <Link className="primary" href={HROS_LINKS.record}>OPEN {HROS_RECORD.registryIdentifier} →</Link>
        <Link href={HROS_LINKS.evidence}>PRESERVED EVIDENCE →</Link>
        <Link href={HROS_LINKS.registry}>AI GOVERNANCE REGISTRY →</Link>
        <Link href={HROS_LINKS.artifactRegistry}>ARTIFACT REGISTRY →</Link>
        <Link href={HROS_LINKS.governanceShowcase}>ALL GOVERNANCE SHOWCASES →</Link>
      </div>
    </section>

    <footer><b>HUMAN ROUTER PROTOCOL OPERATING SYSTEM · INTERACTIVE REGISTERED-GOVERNANCE SHOWROOM</b><br />{HROS_RECORD.boundary} Evidence presence is not a TA-14 finding. Declared architecture is not demonstrated behaviour.</footer>
  </div><style>{`
    .hros *{box-sizing:border-box}.hros{min-height:100vh;background:radial-gradient(circle at 84% 2%,#1b4a4a66,transparent 30%),radial-gradient(circle at 10% 38%,#6d4c1c40,transparent 27%),linear-gradient(#02070c,#061a1d 52%,#02070c);color:#eef6fb;font-family:Arial,sans-serif}
    .hros .wrap{width:min(1180px,calc(100% - 32px));margin:auto;padding-bottom:80px}.hros a{color:inherit;text-decoration:none}
    .hros a:focus-visible,.hros button:focus-visible{outline:2px solid #f2c66d;outline-offset:3px}
    .hros nav{min-height:76px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;border-bottom:1px solid #ffffff16}.hros nav a{color:#9dd6fa;font-size:11px;font-weight:900;letter-spacing:.08em}.hros nav span{display:flex;gap:20px;flex-wrap:wrap}
    .hros header{padding:72px 0 54px}.hros .eyebrow{color:#f2c66d;font-size:10px;font-weight:950;letter-spacing:.17em;line-height:1.6}
    .hros .badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:22px}.hros .badges b{padding:8px 11px;border:1px solid #f2c66d44;border-radius:999px;color:#f2c66d;font-size:9px}
    .hros h1{max-width:1080px;font:clamp(40px,7vw,84px)/.98 Georgia,serif;letter-spacing:-.035em;margin:14px 0 24px}.hros h2{max-width:980px;font:clamp(30px,5vw,54px)/1.05 Georgia,serif;margin:12px 0 18px}
    .hros .lede{max-width:930px;color:#abc0cd;font-size:18px;line-height:1.72}.hros .lede em{color:#78e8d8;font-style:normal;font-weight:700}.hros .sub{max-width:900px;color:#9fb5c4;line-height:1.65;margin:0 0 22px}
    .hros .cta{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.hros .cta a{display:inline-flex;align-items:center;min-height:46px;padding:0 16px;border:1px solid #78e8d855;border-radius:12px;color:#bdf3ea;font-size:11px;font-weight:900;letter-spacing:.06em}.hros .cta a.primary{background:linear-gradient(135deg,#f2c66d,#b08432);border-color:transparent;color:#07121a}
    .hros .facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:34px 0 0;border:1px solid #ffffff16;border-radius:16px;overflow:hidden;background:#ffffff12}.hros .facts div{padding:16px 18px;background:#05121a}.hros .facts dt{color:#7f98a6;font-size:9px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.hros .facts dd{margin:6px 0 0;font-size:14px;color:#e6f1f6}
    .hros section{padding:62px 0;border-top:1px solid #ffffff14}
    .hros .visual{margin:30px 0 28px;border:1px solid #f2c66d44;border-radius:18px;overflow:hidden;background:#06131e;box-shadow:0 22px 70px #0008}.hros .visual img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.hros .visual figcaption{display:grid;grid-template-columns:minmax(190px,.34fr) 1fr;gap:20px;padding:20px 22px;border-top:1px solid #ffffff14}.hros .visual figcaption b{color:#f2c66d;font-size:10px;letter-spacing:.12em}.hros .visual figcaption span{color:#a9beca;font-size:13px;line-height:1.6}
    .hros .controls{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 18px}.hros .controls button{cursor:pointer;min-height:44px;background:#0b1a27;color:#cce2ef;border:1px solid #ffffff22;border-radius:10px;padding:11px 14px;font-weight:900;font-size:10px;letter-spacing:.05em;transition:.15s}.hros .controls button:hover{border-color:#78e8d888}.hros .controls button[aria-pressed="true"]{background:#f2c66d;color:#07121a;border-color:#f2c66d}
    .hros .chain{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.hros .node{position:relative;padding:16px 14px;border:1px solid #78e8d833;border-radius:14px;background:#06131e;min-height:190px;display:flex;flex-direction:column;transition:.2s}
    .hros .node .num{color:#f2c66d;font-size:8px;font-weight:900;letter-spacing:.06em}.hros .node b{margin-top:10px;font-size:12px;letter-spacing:.06em}.hros .node p{color:#8ea6b4;font-size:12px;line-height:1.45;margin:8px 0 12px;flex:1}.hros .node em{font-style:normal;font-size:9px;font-weight:950;letter-spacing:.08em;padding:6px 7px;border-radius:7px;align-self:flex-start}
    .hros .node i{position:absolute;right:-10px;top:42%;color:#f2c66d;font-style:normal;z-index:2}
    .hros .s-pass{border-color:#5fd9a355}.hros .s-pass em{background:#5fd9a31f;color:#86efbf}
    .hros .s-halted{border-color:#ff8a7a;background:#2a0f0f;box-shadow:0 0 0 1px #ff8a7a55}.hros .s-halted em{background:#ff8a7a;color:#1b0707}
    .hros .s-blocked{border-color:#ffb36b;background:#2a1a0b;box-shadow:0 0 0 1px #ffb36b55}.hros .s-blocked em{background:#ffb36b;color:#1f1205}
    .hros .s-unreached{opacity:.5;border-style:dashed}.hros .s-unreached em{border:1px solid #ffffff33;color:#9fb5c4}
    .hros .s-dependent{border-color:#f2c66d88;background:#221b0a}.hros .s-dependent em{background:#f2c66d26;color:#f2c66d}
    .hros .s-undeclared{border-style:dashed;border-color:#b69cff77}.hros .s-undeclared em{background:#b69cff22;color:#cdbcff}
    .hros .state{margin-top:14px;padding:26px;border:1px solid #f2c66d55;border-radius:18px;background:#f2c66d0b}.hros .declared-tag{display:inline-block;margin-bottom:14px;padding:6px 10px;border-radius:999px;background:#78e8d81a;border:1px solid #78e8d855;color:#9ff0e3;font-size:9px;font-weight:950;letter-spacing:.12em}
    .hros .state small,.hros .digests small,.hros .hash small{display:block;color:#8299a8;font-size:9px;font-weight:900;letter-spacing:.14em}.hros .state strong{display:block;color:#9edfff;margin:8px 0}.hros .state h3{font:clamp(22px,3vw,30px)/1.15 Georgia,serif;color:#f2c66d;margin:8px 0 12px}.hros .state>p{max-width:960px;color:#c1d0d8;line-height:1.65}
    .hros .gap{padding:14px 16px;border-left:3px solid #b69cff;background:#b69cff12;color:#d6cbff!important}.hros .gap b,.hros .examined b,.hros .note b{display:block;font-size:9px;letter-spacing:.14em;margin-bottom:4px}
    .hros .basis{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:18px 0}.hros .basis ul,.hros .quotes{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:10px}
    .hros .basis li,.hros .quotes li{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:12px 14px;border:1px solid #ffffff14;border-radius:12px;background:#040d14}.hros .qn{color:#f2c66d;font-size:9px;font-weight:950;letter-spacing:.08em;white-space:nowrap;padding-top:2px}.hros .basis li b,.hros .quotes li b{font-size:13px;color:#e8f3f8}.hros .basis li p,.hros .quotes li p{margin:5px 0 0;color:#9fb5c4;font-size:13px;line-height:1.55}
    .hros .examined{margin:0;padding:14px 16px;border:1px dashed #ffffff33;border-radius:12px;color:#c8d6de;font-size:13px}.hros .examined b{color:#ff9d8f}
    .hros .rule{margin-top:16px;padding:18px;border-left:3px solid #f2c66d;background:#f2c66d0d;color:#bcae8d;line-height:1.65;font-size:13px}.hros .rule b{color:#f2c66d}
    .hros .tag{display:block;color:#78e8d8;font-size:9px;font-weight:900;letter-spacing:.12em;line-height:1.5}
    .hros .columns{display:grid;grid-template-columns:1.1fr 1fr;gap:14px}.hros .stack{display:grid;gap:14px;align-content:start}.hros .col{padding:22px;border:1px solid #ffffff16;border-radius:18px;background:#06111c}.hros .col h3{font:24px/1.1 Georgia,serif;margin:10px 0 4px}.hros .col.declared{border-color:#78e8d844}.hros .col.bound .tag{color:#f2c66d}
    .hros .trace{min-height:22px;color:#bdf3ea;font-size:13px;margin:0 0 16px}
    .hros .evidence{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.hros .evidence li{padding:22px;border:1px solid #ffffff18;border-radius:18px;background:#07131fcc;transition:.2s;min-width:0}.hros .evidence li.on{border-color:#78e8d855}.hros .evidence li.off{opacity:.35}
    .hros .evidence h3{font:20px/1.2 Georgia,serif;margin:10px 0 6px;overflow-wrap:anywhere}.hros .evidence .claims{color:#f2c66d;font-size:12px;font-weight:700;margin:0 0 10px}.hros blockquote{margin:0 0 12px;padding:0 0 0 14px;border-left:2px solid #ffffff2a;color:#aec2ce;line-height:1.6;font-size:14px}
    .hros .note{padding:12px 14px;border-radius:10px;background:#f2c66d12;border:1px solid #f2c66d33;color:#d9c9a2;font-size:12px;line-height:1.55}.hros .note b{color:#f2c66d}
    .hros code{display:block;margin-top:5px;font:12px/1.5 ui-monospace,Menlo,monospace;color:#bfe8ff;overflow-wrap:anywhere;word-break:break-all}.hros .hash{margin:0 0 14px}.hros .evidence a,.hros .textlink{color:#f2c66d;font-size:10px;font-weight:900;letter-spacing:.06em}
    .hros .digests{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.hros .digests div{padding:16px 18px;border:1px solid #ffffff14;border-radius:14px;background:#040d14;min-width:0}
    .hros .boundary{display:grid;grid-template-columns:1fr 1fr;gap:14px}.hros .boundary article{padding:24px;border-radius:18px;border:1px solid}.hros .boundary .yes{border-color:#5fd9a355;background:#5fd9a30b}.hros .boundary .yes .tag{color:#86efbf}.hros .boundary .no{border-color:#ff8a7a55;background:#ff8a7a0b}.hros .boundary .no .tag{color:#ffa699}
    .hros .boundary ul{margin:14px 0 0;padding-left:18px;color:#c8d6de;line-height:1.6}.hros .boundary .no ul{list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}.hros .boundary .no li span{color:#ff8a7a}
    .hros .statement{margin:16px 0 0;padding:18px;border-left:3px solid #f2c66d;background:#f2c66d0d;color:#e3d4ae;line-height:1.65}
    .hros .surfaces{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.hros .surfaces a{padding:24px;border:1px dashed #78e8d855;border-radius:18px;background:#07131fbb;transition:.15s}.hros .surfaces a:hover{border-color:#78e8d8;border-style:solid}.hros .surfaces h3{font:23px/1.15 Georgia,serif;margin:12px 0}.hros .surfaces ul{color:#98aebb;line-height:1.55;font-size:14px;padding-left:18px}.hros .surfaces b{color:#f2c66d;font-size:10px}
    .hros .history{list-style:none;padding:0;margin:0 0 20px;border-left:2px solid #f2c66d55}.hros .history li{display:grid;grid-template-columns:170px 1fr;gap:16px;padding:0 0 22px 22px;position:relative}.hros .history li::before{content:"";position:absolute;left:-7px;top:4px;width:12px;height:12px;border-radius:50%;background:#f2c66d}
    .hros .history li.open::before{background:transparent;border:2px dashed #f2c66d}.hros .history time{color:#f2c66d;font-size:11px;font-weight:900;letter-spacing:.08em}.hros .history b{font-size:15px}.hros .history p{margin:5px 0 0;color:#9fb5c4;line-height:1.55;font-size:14px}.hros .history li.open b{color:#8299a8}
    .hros .final h2{margin-bottom:6px}
    .hros footer{margin-top:30px;padding:28px;border:1px solid #f2c66d33;border-radius:18px;color:#d4c49f;line-height:1.6}.hros footer b{color:#f2c66d;font-size:10px;letter-spacing:.12em}
    @media(max-width:1020px){.hros .chain{grid-template-columns:repeat(3,1fr)}.hros .node i{display:none}.hros .columns{grid-template-columns:1fr}}
    @media(max-width:760px){.hros .chain,.hros .basis,.hros .evidence,.hros .digests,.hros .boundary,.hros .surfaces,.hros .facts{grid-template-columns:1fr}.hros .node{min-height:0}.hros .boundary .no ul{grid-template-columns:1fr}.hros .history li{grid-template-columns:1fr;gap:4px}.hros .lede{font-size:16px}.hros .state{padding:18px}}
    @media(prefers-reduced-motion:reduce){.hros *{transition:none!important}}
  `}</style></main>;
}
