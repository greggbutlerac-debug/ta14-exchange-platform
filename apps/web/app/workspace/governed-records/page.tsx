import Link from 'next/link';

const CAPABILITIES = [
  {
    title: 'Bring a Record',
    description:
      'Upload, paste, import, or open an existing record without forcing it into an unrelated schema.',
    icon: '01',
  },
  {
    title: 'Identify What It Is',
    description:
      'Classify the record, its source, its declared purpose, its time boundary, and the authority behind it.',
    icon: '02',
  },
  {
    title: 'Preserve What It Proves',
    description:
      'Keep supported facts connected to the original evidence instead of turning assumptions into findings.',
    icon: '03',
  },
  {
    title: 'Declare What It Does Not Prove',
    description:
      'Expose missing continuity, unsupported conclusions, expired authority, and evidence gaps.',
    icon: '04',
  },
  {
    title: 'Generate a Governed Interpretation',
    description:
      'Create a bounded interpretation that can be reviewed, preserved, replayed, and independently verified.',
    icon: '05',
  },
  {
    title: 'Compare and Verify',
    description:
      'Reopen earlier interpretations, compare changes over time, and verify the preserved record path.',
    icon: '06',
  },
] as const;

const RECORD_TYPES = [
  'Atmospheric Integrity Records',
  'Personal Atmospheric Integrity Records',
  'Building Environmental Records',
  'Hospital Environmental Records',
  'Laboratory Reports',
  'Indoor Air Quality Reports',
  'HVAC Diagnostic Records',
  'Sensor Packages',
  'Land Records',
  'Water Records',
  'Operational Records',
  'Other Consequential Evidence',
] as const;

const PROCESS = [
  'Upload',
  'Identify',
  'Validate',
  'Interpret',
  'Review',
  'Generate Report',
] as const;

export default function GovernedRecordsIntroductionPage() {
  return (
    <main className="recordsIntro">
      <div className="grid" aria-hidden="true" />
      <div className="glow glowOne" aria-hidden="true" />
      <div className="glow glowTwo" aria-hidden="true" />

      <section className="shell">
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brandMark">TA</span>
            <span>
              <strong>TA-14 AI Governance Exchange</strong>
              <small>Governed Records</small>
            </span>
          </Link>

          <nav>
            <Link href="/">Homepage</Link>
            <Link href="/workspace">All Playgrounds</Link>
            <Link className="navButton" href="/workspace/records">
              Enter Playground
            </Link>
          </nav>
        </header>

        <section className="hero">
          <div className="heroCopy">
            <p className="eyebrow">Governed Records Introduction</p>

            <h1>
              A record is not the same
              <span>as a governed interpretation.</span>
            </h1>

            <p className="lede">
              The Governed Records section is where evidence is interpreted
              without manufacturing certainty. It preserves what a record
              proves, declares what it does not prove, and keeps every finding
              connected to the record, continuity, authority, and boundary that
              support it.
            </p>

            <div className="actions">
              <Link className="primaryButton" href="/workspace/records">
                Enter the Governed Records Playground
              </Link>

              <a className="secondaryButton" href="#purpose">
                Learn What It Does
              </a>
            </div>

            <p className="accessNote">
              Free to explore · No credit card required · Use the tools before
              preserving a formal governed interpretation
            </p>
          </div>

          <aside className="definitionCard">
            <p className="eyebrow">Core output</p>
            <h2>Governed Interpretation Record</h2>
            <p>
              A preserved record of the interpretation itself: what evidence
              was reviewed, what findings were admitted, which limitations were
              declared, and what remains unresolved.
            </p>

            <div className="definitionRule" />

            <strong>
              The system does not ask, “What story can we tell from this
              record?”
            </strong>

            <span>
              It asks, “What can this record support under scrutiny?”
            </span>
          </aside>
        </section>

        <section className="process" aria-label="Governed record process">
          {PROCESS.map((step, index) => (
            <div className="processStep" key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step}</strong>
              {index < PROCESS.length - 1 ? <i>→</i> : null}
            </div>
          ))}
        </section>

        <section className="section purpose" id="purpose">
          <div className="sectionHeading">
            <p className="eyebrow">Purpose</p>
            <h2>Interpret the evidence without exceeding the evidence.</h2>
          </div>

          <div className="purposeGrid">
            <article>
              <h3>Why this section exists</h3>
              <p>
                Records are routinely summarized, scored, diagnosed, or used to
                justify action without preserving the limits of the underlying
                evidence. Governed Records creates a disciplined layer between
                the original record and any conclusion drawn from it.
              </p>
            </article>

            <article>
              <h3>What it protects against</h3>
              <p>
                Unsupported certainty, missing provenance, broken continuity,
                conclusions outside the measurement period, authority that was
                never established, and interpretations that cannot be replayed
                or independently reviewed.
              </p>
            </article>

            <article>
              <h3>Who it is for</h3>
              <p>
                Individuals, buildings, hospitals, laboratories, schools,
                manufacturers, HVAC professionals, environmental teams,
                governance reviewers, and any institution that depends on
                consequential records.
              </p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="sectionHeading">
            <p className="eyebrow">What you can do</p>
            <h2>Move from raw record to bounded interpretation.</h2>
            <p>
              The playground is designed to help users understand the record,
              challenge its limits, preserve admissible findings, and generate
              an interpretation that remains reviewable.
            </p>
          </div>

          <div className="capabilityGrid">
            {CAPABILITIES.map((capability) => (
              <article className="capabilityCard" key={capability.title}>
                <span>{capability.icon}</span>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section recordTypes">
          <div className="recordTypesCopy">
            <p className="eyebrow">Supported evidence classes</p>
            <h2>Not limited to one type of record.</h2>
            <p>
              Governed Records is a general interpretation discipline. It can
              support environmental, operational, technical, institutional, and
              personal evidence while preserving the boundaries unique to each
              domain.
            </p>

            <Link className="primaryButton" href="/workspace/records">
              Open the Record Workspace
            </Link>
          </div>

          <div className="recordList">
            {RECORD_TYPES.map((recordType) => (
              <span key={recordType}>
                <i>✓</i>
                {recordType}
              </span>
            ))}
          </div>
        </section>

        <section className="boundary">
          <div>
            <p className="eyebrow">Declared boundary</p>
            <h2>An interpretation does not repair a deficient record.</h2>
          </div>

          <p>
            If continuity is broken, evidence is missing, provenance cannot be
            established, or the record does not support a requested
            conclusion, the governed interpretation must say so. TA-14 does not
            convert incomplete evidence into certainty merely because a user
            wants an answer.
          </p>
        </section>

        <section className="enterPanel">
          <div>
            <p className="eyebrow">Ready to begin?</p>
            <h2>Enter the Governed Records playground.</h2>
            <p>
              Bring a record, examine its boundaries, and begin building a
              governed interpretation that can withstand review.
            </p>
          </div>

          <Link className="enterButton" href="/workspace/records">
            Enter Playground
            <span>→</span>
          </Link>
        </section>

        <footer>
          <Link href="/">← Return to public homepage</Link>
          <span>No admissible evidence. No admissible execution.</span>
          <Link href="/workspace">View all playgrounds →</Link>
        </footer>
      </section>

      <style>{`
        .recordsIntro {
          --teal: #62efb9;
          --cyan: #68e5ff;
          --gold: #ffbf69;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbfd;
          background:
            radial-gradient(circle at 86% 10%, rgba(98, 239, 185, 0.13), transparent 28%),
            radial-gradient(circle at 5% 48%, rgba(104, 229, 255, 0.09), transparent 34%),
            linear-gradient(180deg, #03100f 0%, #030a0d 54%, #020709 100%);
        }

        .recordsIntro * {
          box-sizing: border-box;
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(98, 239, 185, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(98, 239, 185, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          pointer-events: none;
        }

        .glowOne {
          top: -160px;
          right: -100px;
          width: 440px;
          height: 440px;
          opacity: 0.12;
          background: var(--teal);
        }

        .glowTwo {
          top: 42%;
          left: -180px;
          width: 360px;
          height: 360px;
          opacity: 0.07;
          background: var(--cyan);
        }

        .shell {
          position: relative;
          z-index: 1;
          width: min(1280px, calc(100% - 28px));
          margin-inline: auto;
          padding: 24px 0 44px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 12px 4px 26px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: inherit;
          text-decoration: none;
        }

        .brandMark {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(98, 239, 185, 0.3);
          border-radius: 12px;
          color: var(--teal);
          background: rgba(98, 239, 185, 0.06);
          font-size: 13px;
          font-weight: 950;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .brand small {
          margin-top: 3px;
          color: #77948f;
          font-size: 10px;
        }

        .topbar nav {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .topbar nav a {
          color: #8ca5a2;
          font-size: 12px;
          font-weight: 750;
          text-decoration: none;
        }

        .topbar nav a:hover {
          color: var(--teal);
        }

        .navButton {
          padding: 10px 14px;
          border: 1px solid rgba(98, 239, 185, 0.28);
          border-radius: 10px;
          background: rgba(98, 239, 185, 0.06);
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.32fr) minmax(300px, 0.68fr);
          gap: clamp(34px, 6vw, 82px);
          align-items: center;
          padding: clamp(34px, 6vw, 76px);
          border: 1px solid rgba(137, 205, 193, 0.15);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(9, 35, 33, 0.94), rgba(4, 18, 20, 0.97));
          box-shadow: 0 34px 90px rgba(0, 0, 0, 0.3);
        }

        .eyebrow {
          margin: 0 0 14px;
          color: var(--teal);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 820px;
          margin: 0;
          font-size: clamp(3.1rem, 7vw, 7.2rem);
          line-height: 0.91;
          letter-spacing: -0.072em;
        }

        .hero h1 span {
          display: block;
          margin-top: 0.11em;
          color: transparent;
          background: linear-gradient(90deg, #fff, var(--teal), var(--cyan));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .lede {
          max-width: 780px;
          margin: 28px 0 0;
          color: #9ab1ad;
          font-size: 16px;
          line-height: 1.82;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton,
        .enterButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 19px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
          transition: transform 180ms ease;
        }

        .primaryButton {
          color: #03100c;
          background: linear-gradient(135deg, var(--teal), var(--cyan));
        }

        .secondaryButton {
          border: 1px solid rgba(98, 239, 185, 0.25);
          color: #e3fff5;
          background: rgba(98, 239, 185, 0.05);
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .enterButton:hover {
          transform: translateY(-2px);
        }

        .accessNote {
          margin: 17px 0 0;
          color: #657e7a;
          font-size: 11px;
          font-weight: 700;
        }

        .definitionCard {
          padding: 27px;
          border: 1px solid rgba(98, 239, 185, 0.2);
          border-radius: 21px;
          background: rgba(2, 14, 15, 0.74);
        }

        .definitionCard h2 {
          margin: 0;
          font-size: 2rem;
          line-height: 1.05;
          letter-spacing: -0.045em;
        }

        .definitionCard > p:not(.eyebrow) {
          margin: 18px 0 0;
          color: #8fa8a3;
          font-size: 13px;
          line-height: 1.72;
        }

        .definitionRule {
          height: 1px;
          margin: 24px 0;
          background: linear-gradient(90deg, var(--teal), transparent);
          opacity: 0.35;
        }

        .definitionCard strong {
          display: block;
          color: #e8f8f3;
          font-size: 14px;
          line-height: 1.6;
        }

        .definitionCard span {
          display: block;
          margin-top: 12px;
          color: var(--teal);
          font-size: 13px;
          line-height: 1.6;
        }

        .process {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          margin-top: 18px;
          overflow: hidden;
          border: 1px solid rgba(137, 205, 193, 0.13);
          border-radius: 17px;
          background: rgba(5, 22, 22, 0.88);
        }

        .processStep {
          position: relative;
          padding: 17px 12px;
          border-right: 1px solid rgba(137, 205, 193, 0.13);
          text-align: center;
        }

        .processStep:last-child {
          border-right: 0;
        }

        .processStep span {
          display: block;
          margin-bottom: 5px;
          color: #4d716a;
          font-size: 9px;
          font-weight: 900;
        }

        .processStep strong {
          color: #c7ddd7;
          font-size: 10px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .processStep i {
          position: absolute;
          top: 50%;
          right: -5px;
          z-index: 2;
          color: var(--teal);
          font-style: normal;
          transform: translateY(-50%);
        }

        .section {
          padding-top: 76px;
        }

        .sectionHeading {
          max-width: 850px;
          margin-bottom: 30px;
        }

        .sectionHeading h2,
        .recordTypesCopy h2,
        .boundary h2,
        .enterPanel h2 {
          margin: 0;
          font-size: clamp(2.1rem, 4.5vw, 4.6rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .sectionHeading > p:last-child,
        .recordTypesCopy > p:not(.eyebrow) {
          margin: 18px 0 0;
          color: #8ca39f;
          line-height: 1.78;
        }

        .purposeGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .purposeGrid article,
        .capabilityCard {
          padding: 26px;
          border: 1px solid rgba(137, 205, 193, 0.14);
          border-radius: 19px;
          background:
            linear-gradient(145deg, rgba(9, 31, 31, 0.88), rgba(4, 17, 19, 0.92));
        }

        .purposeGrid h3,
        .capabilityCard h3 {
          margin: 0;
          font-size: 1.35rem;
          letter-spacing: -0.035em;
        }

        .purposeGrid p,
        .capabilityCard p {
          margin: 15px 0 0;
          color: #88a09b;
          font-size: 13px;
          line-height: 1.74;
        }

        .capabilityGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .capabilityCard {
          min-height: 230px;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .capabilityCard:hover {
          transform: translateY(-5px);
          border-color: rgba(98, 239, 185, 0.32);
        }

        .capabilityCard > span {
          display: inline-grid;
          place-items: center;
          width: 44px;
          height: 44px;
          margin-bottom: 34px;
          border: 1px solid rgba(98, 239, 185, 0.24);
          border-radius: 13px;
          color: var(--teal);
          background: rgba(98, 239, 185, 0.05);
          font-size: 11px;
          font-weight: 950;
        }

        .recordTypes {
          display: grid;
          grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
          gap: 52px;
          align-items: center;
        }

        .recordTypesCopy .primaryButton {
          margin-top: 26px;
        }

        .recordList {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .recordList span {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 11px 14px;
          border: 1px solid rgba(137, 205, 193, 0.12);
          border-radius: 12px;
          color: #a4b9b4;
          background: rgba(5, 22, 22, 0.68);
          font-size: 12px;
          font-weight: 700;
        }

        .recordList i {
          color: var(--teal);
          font-style: normal;
        }

        .boundary {
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 48px;
          align-items: center;
          margin-top: 76px;
          padding: clamp(28px, 5vw, 48px);
          border: 1px solid rgba(255, 191, 105, 0.19);
          border-radius: 22px;
          background: rgba(36, 27, 14, 0.43);
        }

        .boundary .eyebrow {
          color: var(--gold);
        }

        .boundary > p {
          margin: 0;
          color: #aaa294;
          font-size: 14px;
          line-height: 1.82;
        }

        .enterPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 34px;
          margin-top: 26px;
          padding: clamp(28px, 5vw, 48px);
          border: 1px solid rgba(98, 239, 185, 0.2);
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(11, 45, 39, 0.74), rgba(5, 22, 24, 0.9));
        }

        .enterPanel > div {
          max-width: 760px;
        }

        .enterPanel p:last-child {
          margin: 17px 0 0;
          color: #91a9a4;
          line-height: 1.72;
        }

        .enterButton {
          gap: 26px;
          flex: 0 0 auto;
          min-height: 58px;
          padding-inline: 24px;
          color: #03110d;
          background: linear-gradient(135deg, var(--teal), var(--cyan));
        }

        .enterButton span {
          font-size: 20px;
        }

        footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          margin-top: 34px;
          padding: 22px 4px 0;
          border-top: 1px solid rgba(137, 205, 193, 0.12);
          color: #657e79;
          font-size: 11px;
          font-weight: 750;
        }

        footer a {
          color: #7f9994;
          text-decoration: none;
        }

        footer a:hover {
          color: var(--teal);
        }

        @media (max-width: 980px) {
          .hero,
          .recordTypes,
          .boundary {
            grid-template-columns: 1fr;
          }

          .purposeGrid,
          .capabilityGrid {
            grid-template-columns: 1fr;
          }

          .process {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .processStep:nth-child(3) {
            border-right: 0;
          }

          .processStep:nth-child(-n + 3) {
            border-bottom: 1px solid rgba(137, 205, 193, 0.13);
          }
        }

        @media (max-width: 720px) {
          .shell {
            width: min(100% - 20px, 1280px);
          }

          .topbar nav a:not(.navButton) {
            display: none;
          }

          .hero {
            padding: 26px 20px 30px;
            border-radius: 20px;
          }

          .hero h1 {
            font-size: clamp(3rem, 15.5vw, 5.1rem);
          }

          .recordList {
            grid-template-columns: 1fr;
          }

          .process {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .processStep {
            border-bottom: 1px solid rgba(137, 205, 193, 0.13);
          }

          .processStep:nth-child(even) {
            border-right: 0;
          }

          .processStep:nth-child(n + 5) {
            border-bottom: 0;
          }

          .enterPanel,
          footer {
            align-items: stretch;
            flex-direction: column;
          }

          .enterButton {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
