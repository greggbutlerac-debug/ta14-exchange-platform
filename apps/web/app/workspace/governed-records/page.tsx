import Link from 'next/link';

const GOVERNED_RECORD_ELEMENTS = [
  {
    number: '01',
    title: 'Declared reality',
    description:
      'The record begins with a bounded statement of what was observed, measured, received, or asserted. It does not begin with a conclusion.',
  },
  {
    number: '02',
    title: 'Identified source',
    description:
      'The person, instrument, system, organization, or authority that produced each element is identified rather than implied.',
  },
  {
    number: '03',
    title: 'Preserved continuity',
    description:
      'Time, sequence, custody, version history, gaps, overlaps, and changes remain visible from creation through later use.',
  },
  {
    number: '04',
    title: 'Proof boundaries',
    description:
      'The record explicitly states what the evidence proves, what it does not prove, and where interpretation must stop.',
  },
  {
    number: '05',
    title: 'Authority and admissibility',
    description:
      'The authority to create, alter, interpret, bind, preserve, or rely on the record is declared and reviewable.',
  },
  {
    number: '06',
    title: 'Independent verification',
    description:
      'Identity, integrity, source, continuity, authority, and preservation can be checked without trusting the interface that created the record.',
  },
] as const;

const RECORD_DIFFERENCES = [
  {
    label: 'Creation',
    ordinary: 'Captures information.',
    governed: 'Captures information under declared rules, identity, source, and authority.',
  },
  {
    label: 'Meaning',
    ordinary: 'Meaning is often assumed by whoever reads it.',
    governed: 'Meaning is bounded by explicit proof limits and declared interpretation rules.',
  },
  {
    label: 'Change',
    ordinary: 'May be edited, replaced, or overwritten without a durable history.',
    governed: 'Corrections create traceable versions while preserving the prior state.',
  },
  {
    label: 'Continuity',
    ordinary: 'A timestamp may exist, but gaps and custody are often unclear.',
    governed: 'Sequence, gaps, overlaps, custody, and source changes are reviewable.',
  },
  {
    label: 'Authority',
    ordinary: 'Possession of the record may be mistaken for authority over it.',
    governed: 'Authority to create, interpret, approve, bind, or use the record is separated.',
  },
  {
    label: 'Verification',
    ordinary: 'Usually depends on trusting the creator or platform.',
    governed: 'Can be independently checked against preserved references and declared conditions.',
  },
  {
    label: 'Use',
    ordinary: 'May be treated as sufficient merely because it exists.',
    governed: 'Cannot support consequential use beyond what its evidence and authority admit.',
  },
] as const;

const ACTIONS = [
  {
    eyebrow: 'Create',
    title: 'Build a Governed Record',
    description:
      'Construct a record from declared reality, source evidence, continuity, authority, and proof boundaries.',
    href: '/workspace/governed-records/build',
    action: 'Build the Record',
    glyph: '＋',
  },
  {
    eyebrow: 'Find',
    title: 'Look Up a Record',
    description:
      'Open your record library and locate records by identity, type, date, state, source, or preserved reference.',
    href: '/workspace/governed-records/my-records',
    action: 'Open My Records',
    glyph: '⌕',
  },
  {
    eyebrow: 'Examine',
    title: 'Review Continuity',
    description:
      'Inspect sequence, gaps, overlaps, source changes, authority changes, and continuity standing.',
    href: '/workspace/governed-records/continuity-review',
    action: 'Open Continuity Review',
    glyph: 'C',
  },
  {
    eyebrow: 'Compare',
    title: 'Compare Record States',
    description:
      'Compare two governed records while keeping comparison separate from diagnosis and optimization.',
    href: '/workspace/governed-records/comparison',
    action: 'Open Comparison',
    glyph: '≋',
  },
  {
    eyebrow: 'Preserve',
    title: 'Open Preserved Records',
    description:
      'Review immutable versions, correction history, integrity references, and preservation receipts.',
    href: '/workspace/governed-records/preserved-records',
    action: 'Open Preserved Records',
    glyph: 'P',
  },
  {
    eyebrow: 'Verify',
    title: 'Verify a Record',
    description:
      'Check identity, integrity, source, authority, continuity, preservation, and proof boundaries.',
    href: '/workspace/governed-records/verification',
    action: 'Open Verification',
    glyph: '✓',
  },
] as const;

export default function GovernedRecordsHomePage() {
  return (
    <main className="recordsHome">
      <section className="hero">
        <div className="heroGlow" aria-hidden="true" />
        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">TA-14 Governed Records</p>
            <h1>
              A record says
              <span>something happened.</span>
            </h1>
            <h2>A governed record shows what can be admitted about it.</h2>
            <p className="lede">
              A record may contain facts, measurements, statements, files,
              timestamps, or signatures. But the existence of information does
              not establish its identity, continuity, authority, integrity,
              meaning, or permissible use.
            </p>
            <p>
              A governed record preserves those boundaries. It separates the
              evidence from the interpretation, the interpretation from the
              determination, and the determination from any later approval,
              optimization, or execution.
            </p>

            <div className="heroActions">
              <Link className="primaryButton" href="/workspace/governed-records/build">
                Build the Record
              </Link>
              <Link className="secondaryButton" href="/workspace/governed-records/my-records">
                Look Up a Record
              </Link>
            </div>
          </div>

          <aside className="principleCard">
            <p className="eyebrow">Governing principle</p>
            <blockquote>
              No admissible evidence.
              <br />
              No admissible execution.
            </blockquote>
            <div className="principleLine" />
            <p>
              A governed record does not make a claim true. It preserves the
              evidence, authority, continuity, and proof boundaries needed to
              determine what may legitimately be concluded or done.
            </p>
          </aside>
        </div>
      </section>

      <section className="definitionSection">
        <div className="sectionHeading">
          <p className="eyebrow">The essential distinction</p>
          <h2>Information becomes governable only when its boundaries remain attached.</h2>
        </div>

        <div className="definitionGrid">
          <article className="definitionCard ordinaryCard">
            <span className="definitionLabel">A record</span>
            <h3>Preserves content.</h3>
            <p>
              It may show a reading, statement, transaction, inspection,
              decision, event, or condition. It can be useful and accurate, yet
              still fail under scrutiny because the source, sequence,
              authority, integrity, or limits are missing.
            </p>
            <ul>
              <li>May contain evidence</li>
              <li>May include a timestamp</li>
              <li>May identify a creator</li>
              <li>May still leave meaning and authority ambiguous</li>
            </ul>
          </article>

          <article className="definitionCard governedCard">
            <span className="definitionLabel">A governed record</span>
            <h3>Preserves content and the conditions governing its use.</h3>
            <p>
              It keeps the record connected to declared reality, source,
              identity, continuity, authority, integrity, proof boundaries,
              version history, and independent verification.
            </p>
            <ul>
              <li>Separates evidence from interpretation</li>
              <li>Declares what is proven and not proven</li>
              <li>Preserves corrections without erasing prior states</li>
              <li>Constrains consequential use to admitted evidence</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="comparisonSection">
        <div className="sectionHeading narrow">
          <p className="eyebrow">Side-by-side</p>
          <h2>The difference is not formatting. It is governability.</h2>
          <p>
            A polished report, signed form, sensor dashboard, database row, or
            exported PDF may still be only a record. Governance comes from the
            preserved conditions surrounding the record.
          </p>
        </div>

        <div className="comparisonTable" role="table" aria-label="Record and governed record comparison">
          <div className="comparisonHeader" role="row">
            <span role="columnheader">Condition</span>
            <strong role="columnheader">Record</strong>
            <strong role="columnheader">Governed record</strong>
          </div>

          {RECORD_DIFFERENCES.map((item) => (
            <div className="comparisonRow" role="row" key={item.label}>
              <span className="comparisonLabel" role="cell">{item.label}</span>
              <p role="cell">{item.ordinary}</p>
              <p className="governedAnswer" role="cell">{item.governed}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="anatomySection">
        <div className="sectionHeading">
          <p className="eyebrow">Anatomy of a governed record</p>
          <h2>Six conditions that keep evidence from becoming detached from reality.</h2>
        </div>

        <div className="anatomyGrid">
          {GOVERNED_RECORD_ELEMENTS.map((item) => (
            <article className="anatomyCard" key={item.number}>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="separationSection">
        <div className="separationCopy">
          <p className="eyebrow">Intentional separation</p>
          <h2>The record is not the diagnosis, determination, or optimization.</h2>
          <p>
            The record preserves what entered the system. Interpretation
            explains the bounded meaning of that evidence. A diagnostic
            determination applies declared rules to the admitted evidence.
            Optimization proposes what might improve the condition. These
            layers must remain separate so that one cannot silently rewrite or
            corrupt another.
          </p>
        </div>

        <div className="separationFlow" aria-label="Governed records separation">
          <div>
            <span>01</span>
            <strong>Record</strong>
            <small>What was preserved</small>
          </div>
          <i>→</i>
          <div>
            <span>02</span>
            <strong>Interpretation</strong>
            <small>What it can mean</small>
          </div>
          <i>→</i>
          <div>
            <span>03</span>
            <strong>Determination</strong>
            <small>What rules admit</small>
          </div>
          <i>→</i>
          <div>
            <span>04</span>
            <strong>Optimization</strong>
            <small>What may improve it</small>
          </div>
        </div>
      </section>

      <section className="actionSection">
        <div className="sectionHeading actionHeading">
          <p className="eyebrow">Enter the workspace</p>
          <h2>Build, find, examine, preserve, and verify the record.</h2>
          <p>
            Start with the evidence. Keep every later layer bounded by what the
            record can actually support.
          </p>
        </div>

        <div className="actionGrid">
          {ACTIONS.map((action, index) => (
            <Link
              className={`actionCard ${index === 0 ? 'featuredAction' : ''}`}
              href={action.href}
              key={action.title}
            >
              <div className="actionTop">
                <span className="actionGlyph">{action.glyph}</span>
                <span className="actionArrow">↗</span>
              </div>
              <p className="eyebrow">{action.eyebrow}</p>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <strong>{action.action}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="finalCta">
        <div>
          <p className="eyebrow">Begin with reality</p>
          <h2>Do not start with a conclusion. Build the record first.</h2>
        </div>
        <div className="finalActions">
          <Link className="primaryButton" href="/workspace/governed-records/build">
            Build the Record
          </Link>
          <Link className="secondaryButton" href="/workspace/governed-records/pricing">
            View Pricing
          </Link>
        </div>
      </section>

      <footer className="footer">
        <Link href="/workspace/ai-governance">← AI Governance</Link>
        <span>No admissible evidence. No admissible execution.</span>
        <Link href="/workspace/governed-records/my-records">My Records →</Link>
      </footer>

      <style>{`
        .recordsHome {
          --cyan: #6ee7ff;
          --green: #66f0bd;
          --violet: #aa9cff;
          --amber: #ffc978;
          --ink: #061018;
          --panel: rgba(9, 25, 36, 0.88);
          --line: rgba(145, 205, 225, 0.16);
          min-height: 100vh;
          padding: 42px clamp(16px, 4vw, 64px) 54px;
          color: #f4fafc;
          background:
            radial-gradient(circle at 82% 6%, rgba(110, 231, 255, 0.12), transparent 28%),
            radial-gradient(circle at 7% 46%, rgba(170, 156, 255, 0.08), transparent 30%),
            linear-gradient(180deg, #061018 0%, #03090e 100%);
        }

        .recordsHome::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.24;
          background-image:
            linear-gradient(rgba(110, 231, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110, 231, 255, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .hero,
        .definitionSection,
        .comparisonSection,
        .anatomySection,
        .separationSection,
        .actionSection,
        .finalCta,
        .footer {
          position: relative;
          z-index: 1;
          width: min(1240px, 100%);
          margin-inline: auto;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: clamp(28px, 5vw, 68px);
          border: 1px solid var(--line);
          border-radius: 30px;
          background:
            linear-gradient(145deg, rgba(15, 39, 53, 0.96), rgba(5, 16, 24, 0.98));
          box-shadow: 0 34px 92px rgba(0, 0, 0, 0.3);
        }

        .heroGlow {
          position: absolute;
          top: -190px;
          right: -120px;
          width: 480px;
          height: 480px;
          border-radius: 999px;
          background: var(--cyan);
          filter: blur(120px);
          opacity: 0.14;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
          gap: clamp(34px, 6vw, 80px);
          align-items: end;
        }

        .eyebrow {
          margin: 0 0 13px;
          color: var(--cyan);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 880px;
          margin: 0;
          font-size: clamp(3.4rem, 7vw, 7.8rem);
          line-height: 0.88;
          letter-spacing: -0.075em;
        }

        .hero h1 span {
          display: block;
          margin-top: 0.13em;
          color: transparent;
          background: linear-gradient(90deg, #ffffff, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero h2 {
          max-width: 760px;
          margin: 30px 0 0;
          color: #d7e9f0;
          font-size: clamp(1.35rem, 2.6vw, 2.35rem);
          line-height: 1.2;
          letter-spacing: -0.04em;
        }

        .heroCopy > p:not(.eyebrow) {
          max-width: 780px;
          color: #96adba;
          font-size: 15px;
          line-height: 1.82;
        }

        .heroCopy .lede {
          margin-top: 24px;
          color: #b7cbd4;
          font-size: 16px;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .primaryButton {
          color: #031118;
          background: linear-gradient(135deg, var(--cyan), var(--green));
        }

        .secondaryButton {
          border: 1px solid rgba(110, 231, 255, 0.27);
          color: #dcf7ff;
          background: rgba(110, 231, 255, 0.055);
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .principleCard {
          padding: 28px;
          border: 1px solid rgba(102, 240, 189, 0.22);
          border-radius: 22px;
          background: rgba(3, 14, 21, 0.75);
        }

        .principleCard blockquote {
          margin: 20px 0;
          font-size: clamp(1.6rem, 3vw, 2.45rem);
          line-height: 1.14;
          font-weight: 850;
          letter-spacing: -0.045em;
        }

        .principleLine {
          height: 1px;
          margin: 22px 0;
          background: linear-gradient(90deg, var(--green), transparent);
        }

        .principleCard > p:last-child {
          margin: 0;
          color: #8fa7b5;
          font-size: 13px;
          line-height: 1.72;
        }

        .definitionSection,
        .comparisonSection,
        .anatomySection,
        .actionSection {
          padding-top: 82px;
        }

        .sectionHeading {
          max-width: 930px;
          margin-bottom: 30px;
        }

        .sectionHeading.narrow {
          max-width: 760px;
        }

        .sectionHeading h2,
        .separationCopy h2,
        .finalCta h2 {
          margin: 0;
          font-size: clamp(2.2rem, 4.5vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: -0.058em;
        }

        .sectionHeading > p:last-child {
          margin: 18px 0 0;
          color: #8fa7b5;
          line-height: 1.78;
        }

        .definitionGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .definitionCard {
          padding: clamp(26px, 4vw, 42px);
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(8, 24, 34, 0.83);
        }

        .governedCard {
          border-color: rgba(102, 240, 189, 0.28);
          background:
            radial-gradient(circle at 90% 10%, rgba(102, 240, 189, 0.09), transparent 34%),
            rgba(8, 27, 35, 0.9);
        }

        .definitionLabel {
          display: inline-flex;
          padding: 7px 10px;
          border: 1px solid rgba(110, 231, 255, 0.2);
          border-radius: 999px;
          color: var(--cyan);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .governedCard .definitionLabel {
          border-color: rgba(102, 240, 189, 0.25);
          color: var(--green);
        }

        .definitionCard h3 {
          margin: 24px 0 16px;
          font-size: clamp(1.8rem, 3vw, 3.1rem);
          letter-spacing: -0.05em;
        }

        .definitionCard p,
        .definitionCard li {
          color: #91a8b6;
          line-height: 1.76;
        }

        .definitionCard ul {
          margin: 24px 0 0;
          padding-left: 20px;
        }

        .definitionCard li + li {
          margin-top: 8px;
        }

        .comparisonTable {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: rgba(7, 21, 30, 0.9);
        }

        .comparisonHeader,
        .comparisonRow {
          display: grid;
          grid-template-columns: 0.55fr 1fr 1fr;
          gap: 0;
        }

        .comparisonHeader {
          color: #cfe3eb;
          background: rgba(110, 231, 255, 0.06);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .comparisonHeader > *,
        .comparisonRow > * {
          margin: 0;
          padding: 18px 20px;
          border-right: 1px solid var(--line);
        }

        .comparisonHeader > *:last-child,
        .comparisonRow > *:last-child {
          border-right: 0;
        }

        .comparisonRow {
          border-top: 1px solid var(--line);
        }

        .comparisonRow p {
          color: #8fa7b5;
          font-size: 13px;
          line-height: 1.68;
        }

        .comparisonLabel {
          color: #dbeaf0;
          font-size: 12px;
          font-weight: 850;
        }

        .comparisonRow .governedAnswer {
          color: #b9e9d6;
          background: rgba(102, 240, 189, 0.025);
        }

        .anatomyGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .anatomyCard {
          min-height: 240px;
          padding: 26px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background:
            linear-gradient(145deg, rgba(12, 32, 44, 0.9), rgba(5, 16, 24, 0.96));
        }

        .anatomyCard > span {
          color: var(--green);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .anatomyCard h3 {
          margin: 42px 0 13px;
          font-size: 1.45rem;
          letter-spacing: -0.035em;
        }

        .anatomyCard p {
          margin: 0;
          color: #8ca4b2;
          font-size: 13px;
          line-height: 1.7;
        }

        .separationSection {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: clamp(34px, 5vw, 70px);
          align-items: center;
          margin-top: 82px;
          padding: clamp(30px, 5vw, 54px);
          border: 1px solid rgba(170, 156, 255, 0.24);
          border-radius: 26px;
          background:
            radial-gradient(circle at 90% 15%, rgba(170, 156, 255, 0.1), transparent 36%),
            rgba(12, 20, 34, 0.82);
        }

        .separationCopy p:last-child {
          color: #9ca9b9;
          line-height: 1.8;
        }

        .separationFlow {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          gap: 10px;
          align-items: center;
        }

        .separationFlow > div {
          min-height: 150px;
          padding: 18px;
          border: 1px solid rgba(170, 156, 255, 0.18);
          border-radius: 16px;
          background: rgba(5, 12, 22, 0.62);
        }

        .separationFlow span,
        .separationFlow strong,
        .separationFlow small {
          display: block;
        }

        .separationFlow span {
          color: var(--violet);
          font-size: 9px;
          font-weight: 900;
        }

        .separationFlow strong {
          margin-top: 32px;
          font-size: 13px;
        }

        .separationFlow small {
          margin-top: 7px;
          color: #7f8b9d;
          line-height: 1.4;
        }

        .separationFlow i {
          color: var(--violet);
          font-style: normal;
        }

        .actionHeading {
          max-width: 790px;
        }

        .actionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .actionCard {
          display: flex;
          min-height: 300px;
          flex-direction: column;
          padding: 25px;
          border: 1px solid var(--line);
          border-radius: 20px;
          color: inherit;
          text-decoration: none;
          background: rgba(8, 23, 33, 0.82);
          transition: transform 190ms ease, border-color 190ms ease, box-shadow 190ms ease;
        }

        .actionCard:hover {
          transform: translateY(-6px);
          border-color: rgba(110, 231, 255, 0.38);
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.26);
        }

        .featuredAction {
          grid-column: span 2;
          background:
            radial-gradient(circle at 12% 18%, rgba(110, 231, 255, 0.1), transparent 34%),
            linear-gradient(145deg, rgba(13, 39, 52, 0.96), rgba(6, 20, 29, 0.96));
        }

        .actionTop {
          display: flex;
          justify-content: space-between;
          margin-bottom: 42px;
        }

        .actionGlyph {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(110, 231, 255, 0.24);
          border-radius: 14px;
          color: var(--cyan);
          background: rgba(110, 231, 255, 0.055);
          font-size: 19px;
          font-weight: 900;
        }

        .actionArrow {
          color: #577484;
          font-size: 20px;
        }

        .actionCard h3 {
          margin: 0;
          font-size: 1.55rem;
          letter-spacing: -0.035em;
        }

        .actionCard > p:not(.eyebrow) {
          flex: 1;
          margin: 15px 0 26px;
          color: #8fa7b5;
          font-size: 13px;
          line-height: 1.72;
        }

        .actionCard > strong {
          color: var(--green);
          font-size: 12px;
        }

        .finalCta {
          display: flex;
          justify-content: space-between;
          gap: 34px;
          align-items: center;
          margin-top: 82px;
          padding: clamp(30px, 5vw, 54px);
          border: 1px solid rgba(102, 240, 189, 0.24);
          border-radius: 25px;
          background:
            radial-gradient(circle at 10% 50%, rgba(102, 240, 189, 0.1), transparent 32%),
            rgba(7, 27, 30, 0.86);
        }

        .finalCta h2 {
          max-width: 760px;
        }

        .finalActions {
          flex-shrink: 0;
          margin-top: 0;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 34px;
          padding: 22px 4px 0;
          border-top: 1px solid var(--line);
          color: #718b99;
          font-size: 11px;
          font-weight: 750;
        }

        .footer a {
          color: #87a1b0;
          text-decoration: none;
        }

        .footer a:hover {
          color: var(--cyan);
        }

        @media (max-width: 1000px) {
          .heroGrid,
          .separationSection {
            grid-template-columns: 1fr;
          }

          .anatomyGrid,
          .actionGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .featuredAction {
            grid-column: span 2;
          }

          .separationFlow {
            grid-template-columns: 1fr;
          }

          .separationFlow i {
            transform: rotate(90deg);
            text-align: center;
          }

          .finalCta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 720px) {
          .recordsHome {
            padding-inline: 12px;
          }

          .hero {
            padding: 26px 20px 30px;
            border-radius: 21px;
          }

          .hero h1 {
            font-size: clamp(3.1rem, 16vw, 5.4rem);
          }

          .definitionGrid,
          .anatomyGrid,
          .actionGrid {
            grid-template-columns: 1fr;
          }

          .featuredAction {
            grid-column: auto;
          }

          .comparisonTable {
            overflow-x: auto;
          }

          .comparisonHeader,
          .comparisonRow {
            min-width: 760px;
          }

          .footer {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}
