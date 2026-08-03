import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getRecordBySlug,
  getRelatedRecords,
} from "../../../lib/governance-library";

type Props = {
  params: Promise<{ slug: string }>;
};

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
] as const;

const authorityQuestions = [
  "Who issued or published this instrument?",
  "What legal, regulatory, contractual, professional, or voluntary force does it carry?",
  "Which edition, amendment, or publication state is being relied upon?",
  "Has it been adopted, incorporated, superseded, withdrawn, stayed, or replaced?",
  "Does the cited authority govern this actor, system, place, activity, and time?",
  "What evidence proves that the authority was current at the decision boundary?",
];

const applicabilityQuestions = [
  "Which jurisdiction or institutional boundary governs the matter?",
  "What actor role is being evaluated: provider, deployer, owner, operator, reviewer, or authority?",
  "Which lifecycle stage or operational event triggered review?",
  "Which system, environment, process, population, or consequence is within scope?",
  "What exemptions, thresholds, transition periods, or sector overlays may alter applicability?",
  "What unresolved facts require HOLD or ESCALATE rather than assumption?",
];

const evidenceQuestions = [
  "What primary source was inspected?",
  "What version, date, edition, or official publication identifier was preserved?",
  "What evidence connects the instrument to the specific governed route?",
  "What continuity records show that the evidence remained intact and attributable?",
  "What limitations, conflicts, or unverified dependencies remain?",
  "What outcome evidence will be preserved after execution?",
];

const failureModes = [
  {
    title: "Title-only reliance",
    text: "A recognizable title is treated as sufficient authority without verifying edition, issuer, status, scope, or source.",
    decision: "HOLD",
  },
  {
    title: "Voluntary-to-binding inflation",
    text: "A framework, standard, principle, or guidance document is described as law without a separate adoption or contractual basis.",
    decision: "DENY",
  },
  {
    title: "Jurisdiction substitution",
    text: "An instrument from one jurisdiction is used as though it directly governs another place, actor, or public authority.",
    decision: "HOLD",
  },
  {
    title: "Edition drift",
    text: "A newer publication is assumed to control even though an older edition remains the legally adopted or contractually incorporated version.",
    decision: "ESCALATE",
  },
  {
    title: "Applicability collapse",
    text: "The existence of an instrument is mistaken for proof that every requirement applies to the present system or action.",
    decision: "HOLD",
  },
  {
    title: "Summary substitution",
    text: "A secondary summary, article, checklist, or vendor interpretation replaces inspection of the controlling source.",
    decision: "DENY",
  },
  {
    title: "Unbounded crosswalk",
    text: "Similarity between two instruments is presented as equivalence without preserving differences in authority, scope, and evidence.",
    decision: "ESCALATE",
  },
  {
    title: "Outcome omission",
    text: "The record stops at policy interpretation and preserves no evidence of what was executed or what consequence followed.",
    decision: "HOLD",
  },
];

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (["active", "adopted", "published", "foundational"].includes(normalized)) {
    return "good";
  }
  if (["voluntary", "draft", "proposed"].includes(normalized)) {
    return "caution";
  }
  return "neutral";
}

export default async function GovernanceRecordPage({ params }: Props) {
  const { slug } = await params;
  const record = getRecordBySlug(slug);

  if (!record) {
    notFound();
  }

  const related = getRelatedRecords(record);
  const tone = statusTone(record.status);

  return (
    <main className="pageShell">
      <style>{styles}</style>

      <header className="institutionBar">
        <div className="institutionBarInner">
          <Link href="/" className="institutionMark" aria-label="TA-14 Authority home">
            <span className="markBadge">TA-14</span>
            <span>
              <strong>Authority Governance Institution</strong>
              <small>Governance Library · Institutional Record</small>
            </span>
          </Link>

          <nav className="topNav" aria-label="Institutional navigation">
            <Link href="/governance-library">Library</Link>
            <Link href="/law-standards-public-policy">Law &amp; Standards</Link>
            <Link href="/academy">Academy</Link>
          </nav>
        </div>
      </header>

      <div className="breadcrumbBar">
        <div className="contentWidth breadcrumbs">
          <Link href="/">TA-14 Authority</Link>
          <span>/</span>
          <Link href="/governance-library">Governance Library</Link>
          <span>/</span>
          <span aria-current="page">{record.shortTitle}</span>
        </div>
      </div>

      <section className="hero">
        <div className="contentWidth heroGrid">
          <div>
            <div className="eyebrowRow">
              <span className="eyebrow">Governance Record</span>
              <span className={`statusPill ${tone}`}>{formatLabel(record.status)}</span>
            </div>

            <p className="recordType">{formatLabel(record.recordType)}</p>
            <h1>{record.title}</h1>
            <p className="heroSummary">{record.summary}</p>

            <div className="heroActions">
              {record.officialUrl ? (
                <a href={record.officialUrl} target="_blank" rel="noreferrer" className="primaryAction">
                  Inspect Official Source
                </a>
              ) : (
                <span className="disabledAction" aria-disabled="true">Official Source Not Recorded</span>
              )}
              <Link href="/governance-library/applicability" className="secondaryAction">
                Determine Applicability
              </Link>
              <Link href="/governance-library" className="textAction">
                ← Return to Library
              </Link>
            </div>
          </div>

          <aside className="identityCard" aria-label="Record identity">
            <div className="identityHeader">
              <span>Record identity</span>
              <strong>{record.shortTitle}</strong>
            </div>
            <dl>
              <div><dt>Instrument type</dt><dd>{formatLabel(record.recordType)}</dd></div>
              <div><dt>Jurisdiction</dt><dd>{record.jurisdiction}</dd></div>
              <div><dt>Publisher</dt><dd>{record.publisher}</dd></div>
              <div><dt>Status</dt><dd>{formatLabel(record.status)}</dd></div>
              <div><dt>Library identifier</dt><dd className="mono">{record.slug}</dd></div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="sectionBand darkBand">
        <div className="contentWidth">
          <div className="sectionHeading lightHeading">
            <span>Constitutional reading</span>
            <h2>A governance instrument is not self-executing.</h2>
            <p>
              The record identifies an instrument and preserves a bounded institutional interpretation. It does not, by title alone,
              prove current authority, applicability, compliance, technical enforcement, or outcome.
            </p>
          </div>

          <div className="chainGrid">
            {chain.map((stage, index) => (
              <div className="chainCard" key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage}</strong>
                <small>{chainDescriptions[stage]}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBand">
        <div className="contentWidth twoColumn">
          <article className="primaryColumn">
            <section className="contentCard accentCard">
              <div className="cardKicker">Institutional summary</div>
              <h2>What this record represents</h2>
              <p className="leadText">{record.summary}</p>
              <div className="divider" />
              <h3>Why it matters</h3>
              <p>{record.whyItMatters}</p>
            </section>

            <section className="contentCard">
              <div className="cardKicker">Classification</div>
              <h2>How the library classifies this instrument</h2>
              <div className="classificationGrid">
                <div><span>Type</span><strong>{formatLabel(record.recordType)}</strong></div>
                <div><span>Status</span><strong>{formatLabel(record.status)}</strong></div>
                <div><span>Jurisdiction</span><strong>{record.jurisdiction}</strong></div>
                <div><span>Publisher</span><strong>{record.publisher}</strong></div>
              </div>

              <h3>Categories</h3>
              <div className="tagList">
                {record.categories.map((category) => (
                  <Link href={`/governance-library/category?category=${encodeURIComponent(category)}`} key={category} className="tag">
                    {formatLabel(category)}
                  </Link>
                ))}
              </div>

              <h3>Key topics</h3>
              <div className="tagList">
                {record.keyTopics.map((topic) => (
                  <Link href={`/governance-library/topics?topic=${encodeURIComponent(topic)}`} key={topic} className="tag topicTag">
                    {topic}
                  </Link>
                ))}
              </div>
            </section>

            <section className="contentCard">
              <div className="cardKicker">Authority resolution</div>
              <h2>Questions that must be answered before reliance</h2>
              <QuestionList items={authorityQuestions} />
              <div className="boundaryNotice">
                <strong>Authority boundary</strong>
                <p>
                  Publication, recognition, or institutional importance does not automatically establish binding force. The user must
                  preserve the legal, regulatory, contractual, professional, or organizational path that gives this instrument effect.
                </p>
              </div>
            </section>

            <section className="contentCard">
              <div className="cardKicker">Applicability resolution</div>
              <h2>Questions that connect the instrument to the governed matter</h2>
              <QuestionList items={applicabilityQuestions} />
              <div className="decisionRow">
                <Decision label="ALLOW" text="Authority, scope, evidence, and route are sufficiently resolved." />
                <Decision label="HOLD" text="Material evidence or applicability facts remain missing." />
                <Decision label="DENY" text="The proposed reliance conflicts with the verified authority boundary." />
                <Decision label="ESCALATE" text="Competent legal, technical, professional, or regulatory review is required." />
              </div>
            </section>

            <section className="contentCard">
              <div className="cardKicker">Evidence package</div>
              <h2>What a defensible reliance record should preserve</h2>
              <QuestionList items={evidenceQuestions} />
              <div className="evidenceGrid">
                {evidencePackage.map((item) => (
                  <div className="evidenceItem" key={item.title}>
                    <span>{item.code}</span>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="contentCard">
              <div className="cardKicker">Failure controls</div>
              <h2>Common ways governance records are overstated</h2>
              <div className="failureGrid">
                {failureModes.map((failure) => (
                  <article className="failureCard" key={failure.title}>
                    <div><span>{failure.decision}</span><strong>{failure.title}</strong></div>
                    <p>{failure.text}</p>
                  </article>
                ))}
              </div>
            </section>

            {related.length > 0 ? (
              <section className="contentCard">
                <div className="cardKicker">Connected authority</div>
                <h2>Related governance records</h2>
                <p className="sectionIntro">
                  Related records may support, implement, overlap with, or differ from this instrument. Relationship does not establish equivalence.
                </p>
                <div className="relatedGrid">
                  {related.map((item) => (
                    <Link key={item.slug} href={`/governance-library/${item.slug}`} className="relatedCard">
                      <div className="relatedMeta">
                        <span>{formatLabel(item.recordType)}</span>
                        <span>{item.jurisdiction}</span>
                      </div>
                      <h3>{item.shortTitle}</h3>
                      <p>{item.summary}</p>
                      <strong>Inspect record →</strong>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="contentCard academyCard">
              <div className="cardKicker">TA-14 Academy</div>
              <h2>Learn how to read governance instruments without overstating them</h2>
              <p>
                The Academy separates recognition from authority, authority from applicability, applicability from admissibility,
                and admissibility from executed outcome. That separation is essential when governance claims may bind consequence to reality.
              </p>
              <div className="academyTracks">
                {academyTracks.map((track) => (
                  <div key={track.title}>
                    <span>{track.number}</span>
                    <strong>{track.title}</strong>
                    <p>{track.text}</p>
                  </div>
                ))}
              </div>
              <Link href="/academy" className="primaryAction">Enter TA-14 Academy</Link>
            </section>
          </article>

          <aside className="secondaryColumn">
            <div className="stickyStack">
              <section className="sideCard">
                <span className="sideKicker">Record controls</span>
                <h2>Inspection pathways</h2>
                <nav className="sideLinks">
                  <Link href="/governance-library/authorities">Resolve authority <span>→</span></Link>
                  <Link href="/governance-library/applicability">Determine applicability <span>→</span></Link>
                  <Link href="/governance-library/status">Verify status <span>→</span></Link>
                  <Link href="/governance-library/sources">Inspect sources <span>→</span></Link>
                  <Link href="/governance-library/crosswalks">Review crosswalks <span>→</span></Link>
                  <Link href="/governance-library/timeline">Inspect chronology <span>→</span></Link>
                </nav>
              </section>

              <section className="sideCard warningCard">
                <span className="sideKicker">Proof boundary</span>
                <h2>This page does not prove compliance.</h2>
                <p>
                  It preserves a library-level institutional record. Compliance, conformity, legal effect, technical enforcement,
                  and outcome require separate evidence and competent review.
                </p>
              </section>

              <section className="sideCard">
                <span className="sideKicker">Official source</span>
                <h2>Primary-source discipline</h2>
                <p>
                  Inspect the official publication whenever available. Preserve the exact version relied upon and record any unresolved status or adoption question.
                </p>
                {record.officialUrl ? (
                  <a href={record.officialUrl} target="_blank" rel="noreferrer" className="sideButton">Open source ↗</a>
                ) : (
                  <span className="sideDisabled">No official URL recorded</span>
                )}
              </section>

              <section className="sideCard institutionalCard">
                <span className="sideKicker">TA-14 principle</span>
                <blockquote>No admissible evidence. No admissible execution.</blockquote>
                <p>
                  A governance instrument becomes operationally meaningful only when authority, evidence, route, determination,
                  execution, and outcome are preserved within a bounded record.
                </p>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBand closingBand">
        <div className="contentWidth closingGrid">
          <div>
            <span className="eyebrow">Institutional boundary</span>
            <h2>Recognize the instrument. Resolve the authority. Preserve the proof.</h2>
            <p>
              TA-14 does not convert voluntary instruments into law, provide legal advice, replace regulators or standards bodies,
              or certify compliance through a library page. It provides an institutional pathway for disciplined inspection and governed reliance.
            </p>
          </div>
          <div className="closingActions">
            <Link href="/governance-library" className="primaryAction">Return to Governance Library</Link>
            <Link href="/law-standards-public-policy" className="secondaryAction">Law, Standards &amp; Public Policy</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="contentWidth footerInner">
          <div>
            <strong>TA-14 Authority Governance Institution</strong>
            <p>Institutional record inspection for law, regulation, standards, frameworks, guidance, and governed proposals.</p>
          </div>
          <nav>
            <Link href="/">Authority Home</Link>
            <Link href="/governance-library">Governance Library</Link>
            <Link href="/academy">TA-14 Academy</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function QuestionList({ items }: { items: string[] }) {
  return (
    <ol className="questionList">
      {items.map((item, index) => (
        <li key={item}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}

function Decision({ label, text }: { label: string; text: string }) {
  return (
    <div className={`decision ${label.toLowerCase()}`}>
      <strong>{label}</strong>
      <p>{text}</p>
    </div>
  );
}

const chainDescriptions: Record<(typeof chain)[number], string> = {
  Reality: "Identify the actual system, place, actor, event, and consequence.",
  Record: "Preserve the instrument, source, version, and relevant facts.",
  Continuity: "Maintain attribution, integrity, chronology, and dependency traceability.",
  Admissibility: "Test whether evidence and authority are sufficient for the proposed reliance.",
  Binding: "Bind the current authority and evidence to the exact governed route.",
  Commit: "Preserve the determination before consequence crosses the execution boundary.",
  Execution: "Record what operational or institutional action actually occurred.",
  Outcome: "Preserve the resulting state, limitations, unresolved findings, and proof boundary.",
};

const evidencePackage = [
  { code: "01", title: "Primary source", text: "Official text, publication page, issuing authority, and stable source reference." },
  { code: "02", title: "Version identity", text: "Edition, amendment, publication date, effective date, and adoption state." },
  { code: "03", title: "Authority path", text: "The legal, regulatory, contractual, professional, or organizational basis for reliance." },
  { code: "04", title: "Applicability facts", text: "Jurisdiction, actor, lifecycle stage, system, sector, thresholds, and exclusions." },
  { code: "05", title: "Requirement mapping", text: "The specific provisions, controls, or expectations connected to the governed route." },
  { code: "06", title: "Determination record", text: "ALLOW, HOLD, DENY, or ESCALATE with reasons and unresolved evidence." },
  { code: "07", title: "Execution evidence", text: "What technical or institutional action was actually enforced or prevented." },
  { code: "08", title: "Outcome evidence", text: "The resulting state, observed consequence, limitations, and future reliance boundary." },
];

const academyTracks = [
  { number: "01", title: "Instrument literacy", text: "Distinguish laws, regulations, standards, frameworks, principles, guidance, and architectures." },
  { number: "02", title: "Authority literacy", text: "Identify how an instrument acquires binding, contractual, professional, or voluntary force." },
  { number: "03", title: "Applicability literacy", text: "Resolve actor, system, jurisdiction, lifecycle, threshold, exemption, and sector questions." },
  { number: "04", title: "Evidence literacy", text: "Preserve source identity, version continuity, requirement mappings, determinations, and outcomes." },
];

const styles = String.raw`

:root {
  color-scheme: dark;
  --ink: #07111f;
  --navy: #06101d;
  --navy-2: #0a1728;
  --panel: #0d1d30;
  --line: rgba(148, 180, 215, 0.18);
  --line-strong: rgba(77, 190, 255, 0.35);
  --sky: #57c7ff;
  --sky-soft: rgba(87, 199, 255, 0.12);
  --mint: #72e6c1;
  --gold: #f4ce71;
  --red: #ff8e96;
  --white: #f7fbff;
  --muted: #a7b6c8;
  --muted-2: #788ba1;
  --shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--navy); }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
.pageShell {
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 0%, rgba(53, 136, 194, 0.16), transparent 32rem),
    linear-gradient(180deg, #06101d 0%, #081421 45%, #06101d 100%);
  color: var(--white);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.contentWidth { width: min(1180px, calc(100% - 40px)); margin: 0 auto; }
.institutionBar {
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--line);
  background: rgba(4, 11, 21, 0.92);
  backdrop-filter: blur(18px);
}
.institutionBarInner {
  width: min(1280px, calc(100% - 36px));
  min-height: 76px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.institutionMark { display: flex; align-items: center; gap: 14px; }
.institutionMark strong { display: block; font-size: 14px; letter-spacing: .04em; }
.institutionMark small { display: block; margin-top: 3px; color: var(--muted); font-size: 11px; }
.markBadge {
  display: grid;
  place-items: center;
  width: 58px;
  height: 42px;
  border: 1px solid var(--line-strong);
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(87,199,255,.16), rgba(87,199,255,.04));
  color: var(--sky);
  font-weight: 900;
  letter-spacing: .08em;
}
.topNav { display: flex; align-items: center; gap: 8px; }
.topNav a { padding: 10px 12px; border-radius: 8px; color: var(--muted); font-size: 13px; }
.topNav a:hover { background: rgba(255,255,255,.05); color: var(--white); }
.breadcrumbBar { border-bottom: 1px solid var(--line); background: rgba(8,20,33,.72); }
.breadcrumbs { min-height: 46px; display: flex; align-items: center; flex-wrap: wrap; gap: 9px; color: var(--muted-2); font-size: 12px; }
.breadcrumbs a:hover { color: var(--sky); }
.hero { padding: 86px 0 74px; position: relative; }
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(rgba(87,199,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(87,199,255,.035) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, black, transparent);
}
.heroGrid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, .7fr); gap: 58px; align-items: start; }
.eyebrowRow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.eyebrow, .cardKicker, .sideKicker {
  color: var(--sky);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .2em;
  text-transform: uppercase;
}
.statusPill { padding: 6px 9px; border-radius: 999px; font-size: 10px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
.statusPill.good { color: var(--mint); background: rgba(114,230,193,.1); border: 1px solid rgba(114,230,193,.25); }
.statusPill.caution { color: var(--gold); background: rgba(244,206,113,.1); border: 1px solid rgba(244,206,113,.25); }
.statusPill.neutral { color: var(--muted); background: rgba(167,182,200,.08); border: 1px solid var(--line); }
.recordType { margin: 26px 0 0; color: var(--muted); font-size: 14px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.hero h1 { max-width: 900px; margin: 12px 0 0; font-size: clamp(42px, 6vw, 76px); line-height: .98; letter-spacing: -.045em; }
.heroSummary { max-width: 790px; margin: 26px 0 0; color: #c4d0dd; font-size: clamp(18px, 2vw, 22px); line-height: 1.62; }
.heroActions { margin-top: 34px; display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.primaryAction, .secondaryAction, .textAction, .disabledAction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 900;
}
.primaryAction { background: linear-gradient(135deg, #79d7ff, #40bdf5); color: #03111c; box-shadow: 0 12px 28px rgba(64,189,245,.18); }
.primaryAction:hover { transform: translateY(-1px); }
.secondaryAction { border: 1px solid var(--line-strong); background: var(--sky-soft); color: #dff5ff; }
.secondaryAction:hover { border-color: var(--sky); }
.textAction { padding-inline: 10px; color: var(--muted); }
.textAction:hover { color: var(--white); }
.disabledAction { border: 1px solid var(--line); background: rgba(255,255,255,.025); color: var(--muted-2); cursor: not-allowed; }
.identityCard { border: 1px solid var(--line-strong); border-radius: 18px; background: linear-gradient(180deg, rgba(16,37,60,.92), rgba(7,20,34,.92)); box-shadow: var(--shadow); overflow: hidden; }
.identityHeader { padding: 20px 22px; border-bottom: 1px solid var(--line); background: rgba(87,199,255,.06); }
.identityHeader span { display: block; color: var(--muted); font-size: 10px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; }
.identityHeader strong { display: block; margin-top: 7px; font-size: 21px; }
.identityCard dl { margin: 0; padding: 4px 22px 18px; }
.identityCard dl div { display: grid; grid-template-columns: 115px minmax(0,1fr); gap: 14px; padding: 15px 0; border-bottom: 1px solid var(--line); }
.identityCard dl div:last-child { border-bottom: 0; }
.identityCard dt { color: var(--muted-2); font-size: 11px; }
.identityCard dd { margin: 0; color: #dce8f3; font-size: 12px; font-weight: 800; text-align: right; overflow-wrap: anywhere; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.sectionBand { padding: 84px 0; }
.darkBand { border-block: 1px solid var(--line); background: #040c16; }
.sectionHeading { max-width: 790px; }
.sectionHeading > span { color: var(--sky); font-size: 11px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; }
.sectionHeading h2 { margin: 12px 0 0; font-size: clamp(32px, 4vw, 52px); letter-spacing: -.035em; line-height: 1.05; }
.sectionHeading p { margin: 18px 0 0; color: var(--muted); font-size: 17px; line-height: 1.7; }
.chainGrid { margin-top: 42px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.chainCard { min-height: 176px; padding: 20px; border: 1px solid var(--line); border-radius: 14px; background: linear-gradient(180deg, rgba(14,31,50,.75), rgba(7,17,29,.75)); }
.chainCard > span { color: var(--sky); font-family: ui-monospace, monospace; font-size: 11px; }
.chainCard strong { display: block; margin-top: 25px; font-size: 18px; }
.chainCard small { display: block; margin-top: 10px; color: var(--muted); line-height: 1.55; }
.twoColumn { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 28px; align-items: start; }
.primaryColumn { display: grid; gap: 24px; }
.secondaryColumn { min-width: 0; }
.stickyStack { position: sticky; top: 24px; display: grid; gap: 16px; }
.contentCard, .sideCard { border: 1px solid var(--line); border-radius: 18px; background: rgba(10,25,41,.86); box-shadow: 0 18px 50px rgba(0,0,0,.16); }
.contentCard { padding: clamp(26px, 4vw, 46px); }
.accentCard { border-color: var(--line-strong); background: linear-gradient(145deg, rgba(15,37,60,.96), rgba(7,20,34,.96)); }
.contentCard h2 { margin: 9px 0 0; font-size: clamp(27px, 3.4vw, 42px); letter-spacing: -.035em; line-height: 1.08; }
.contentCard h3 { margin: 30px 0 12px; font-size: 18px; }
.contentCard p { color: var(--muted); line-height: 1.72; }
.leadText { font-size: 19px; color: #d4e0eb !important; }
.divider { height: 1px; margin: 30px 0; background: var(--line); }
.classificationGrid { margin-top: 28px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.classificationGrid div { padding: 18px; border: 1px solid var(--line); border-radius: 12px; background: rgba(255,255,255,.022); }
.classificationGrid span { display: block; color: var(--muted-2); font-size: 10px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.classificationGrid strong { display: block; margin-top: 8px; font-size: 15px; }
.tagList { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { padding: 8px 10px; border: 1px solid var(--line); border-radius: 999px; background: rgba(255,255,255,.025); color: #c9d6e2; font-size: 12px; }
.tag:hover { border-color: var(--sky); color: var(--sky); }
.topicTag { border-color: rgba(114,230,193,.18); background: rgba(114,230,193,.055); }
.questionList { margin: 28px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.questionList li { display: grid; grid-template-columns: 42px minmax(0,1fr); gap: 14px; align-items: start; padding: 15px; border: 1px solid var(--line); border-radius: 11px; background: rgba(255,255,255,.018); }
.questionList span { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 9px; background: var(--sky-soft); color: var(--sky); font-size: 11px; font-weight: 900; }
.questionList p { margin: 6px 0 0; color: #d2dde8; }
.boundaryNotice { margin-top: 24px; padding: 20px; border-left: 3px solid var(--gold); border-radius: 0 12px 12px 0; background: rgba(244,206,113,.065); }
.boundaryNotice strong { color: var(--gold); }
.boundaryNotice p { margin: 8px 0 0; }
.decisionRow { margin-top: 28px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.decision { padding: 17px; border: 1px solid var(--line); border-radius: 12px; }
.decision strong { font-size: 12px; letter-spacing: .12em; }
.decision p { margin: 8px 0 0; font-size: 12px; line-height: 1.55; }
.decision.allow { border-color: rgba(114,230,193,.22); background: rgba(114,230,193,.05); }
.decision.allow strong { color: var(--mint); }
.decision.hold { border-color: rgba(244,206,113,.22); background: rgba(244,206,113,.05); }
.decision.hold strong { color: var(--gold); }
.decision.deny { border-color: rgba(255,142,150,.22); background: rgba(255,142,150,.05); }
.decision.deny strong { color: var(--red); }
.decision.escalate { border-color: rgba(87,199,255,.22); background: rgba(87,199,255,.05); }
.decision.escalate strong { color: var(--sky); }
.evidenceGrid { margin-top: 28px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.evidenceItem { min-height: 170px; padding: 20px; border: 1px solid var(--line); border-radius: 13px; background: rgba(255,255,255,.02); }
.evidenceItem > span { color: var(--sky); font-family: ui-monospace, monospace; font-size: 11px; }
.evidenceItem strong { display: block; margin-top: 18px; font-size: 16px; }
.evidenceItem p { margin: 9px 0 0; font-size: 13px; }
.failureGrid { margin-top: 28px; display: grid; gap: 10px; }
.failureCard { padding: 19px; border: 1px solid rgba(255,142,150,.17); border-radius: 12px; background: rgba(255,142,150,.035); }
.failureCard > div { display: flex; align-items: center; gap: 11px; }
.failureCard span { padding: 5px 7px; border-radius: 6px; background: rgba(255,142,150,.1); color: var(--red); font-size: 9px; font-weight: 900; letter-spacing: .12em; }
.failureCard strong { font-size: 15px; }
.failureCard p { margin: 9px 0 0; font-size: 13px; }
.sectionIntro { max-width: 730px; }
.relatedGrid { margin-top: 26px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.relatedCard { padding: 22px; border: 1px solid var(--line); border-radius: 14px; background: rgba(255,255,255,.02); transition: transform .18s ease, border-color .18s ease; }
.relatedCard:hover { transform: translateY(-2px); border-color: var(--sky); }
.relatedMeta { display: flex; justify-content: space-between; gap: 12px; color: var(--muted-2); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
.relatedCard h3 { margin: 16px 0 0; }
.relatedCard p { font-size: 13px; }
.relatedCard > strong { display: block; margin-top: 18px; color: var(--sky); font-size: 12px; }
.academyCard { background: linear-gradient(145deg, rgba(29,48,70,.93), rgba(8,20,34,.93)); }
.academyTracks { margin: 28px 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.academyTracks > div { padding: 18px; border: 1px solid var(--line); border-radius: 12px; }
.academyTracks span { color: var(--sky); font-size: 10px; font-family: ui-monospace, monospace; }
.academyTracks strong { display: block; margin-top: 12px; }
.academyTracks p { margin: 8px 0 0; font-size: 12px; }
.sideCard { padding: 22px; }
.sideCard h2 { margin: 9px 0 0; font-size: 20px; line-height: 1.2; }
.sideCard p { color: var(--muted); font-size: 13px; line-height: 1.65; }
.sideLinks { margin-top: 17px; display: grid; }
.sideLinks a { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--line); color: #d2dde8; font-size: 12px; }
.sideLinks a:last-child { border-bottom: 0; }
.sideLinks a:hover { color: var(--sky); }
.warningCard { border-color: rgba(244,206,113,.24); background: rgba(244,206,113,.045); }
.sideButton, .sideDisabled { display: flex; justify-content: center; margin-top: 16px; padding: 11px 13px; border-radius: 9px; font-size: 12px; font-weight: 900; }
.sideButton { border: 1px solid var(--line-strong); background: var(--sky-soft); color: var(--sky); }
.sideDisabled { border: 1px solid var(--line); color: var(--muted-2); }
.institutionalCard blockquote { margin: 18px 0 0; color: var(--white); font-size: 20px; font-weight: 900; line-height: 1.35; }
.closingBand { border-top: 1px solid var(--line); background: linear-gradient(180deg, rgba(11,27,44,.96), rgba(4,12,22,.96)); }
.closingGrid { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 50px; align-items: center; }
.closingGrid h2 { margin: 12px 0 0; max-width: 760px; font-size: clamp(31px, 4vw, 50px); line-height: 1.05; letter-spacing: -.035em; }
.closingGrid p { max-width: 800px; color: var(--muted); line-height: 1.7; }
.closingActions { display: grid; gap: 10px; min-width: 260px; }
.footer { border-top: 1px solid var(--line); background: #030912; }
.footerInner { min-height: 180px; display: flex; align-items: center; justify-content: space-between; gap: 30px; }
.footer strong { font-size: 14px; }
.footer p { max-width: 610px; margin: 8px 0 0; color: var(--muted-2); font-size: 12px; }
.footer nav { display: flex; flex-wrap: wrap; gap: 14px; color: var(--muted); font-size: 12px; }
.footer a:hover { color: var(--sky); }
@media (max-width: 980px) {
  .heroGrid, .twoColumn, .closingGrid { grid-template-columns: 1fr; }
  .chainGrid { grid-template-columns: repeat(2, 1fr); }
  .secondaryColumn { order: -1; }
  .stickyStack { position: static; grid-template-columns: repeat(2, 1fr); }
  .closingActions { min-width: 0; max-width: 520px; }
}
@media (max-width: 720px) {
  .contentWidth { width: min(100% - 24px, 1180px); }
  .institutionBarInner { width: min(100% - 24px, 1280px); min-height: 68px; }
  .institutionMark small { display: none; }
  .topNav a:not(:first-child) { display: none; }
  .hero { padding: 58px 0 52px; }
  .hero h1 { font-size: clamp(38px, 13vw, 58px); }
  .identityCard dl div { grid-template-columns: 1fr; gap: 5px; }
  .identityCard dd { text-align: left; }
  .sectionBand { padding: 58px 0; }
  .chainGrid, .classificationGrid, .decisionRow, .evidenceGrid, .relatedGrid, .academyTracks, .stickyStack { grid-template-columns: 1fr; }
  .contentCard { border-radius: 14px; }
  .questionList li { grid-template-columns: 36px minmax(0,1fr); padding: 13px; }
  .footerInner { min-height: 220px; flex-direction: column; align-items: flex-start; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
`;
