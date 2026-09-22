'use client';

import Link from 'next/link';

const evidenceRecords = [
  {
    number: '01',
    title: 'Founding Declaration',
    type: 'Institutional Declaration',
    description:
      'Preserves the declared establishment, purpose, founder, steward, and founding intent of the TA-14 Admissible Execution Architecture.',
    status: 'ACTIVE',
  },
  {
    number: '02',
    title: 'Governance Identity Record',
    type: 'Registry Identity',
    description:
      'Preserves the official architecture name, Registry identifier, founder, steward, version, status, visibility, and canonical naming rules.',
    status: 'ACTIVE',
  },
  {
    number: '03',
    title: 'Claims and Boundaries Record',
    type: 'Architecture Boundary',
    description:
      'States the architecture’s affirmative claims, explicit non-claims, declared limitations, and prohibited inferences.',
    status: 'ACTIVE',
  },
  {
    number: '04',
    title: 'Architecture Chronology',
    type: 'Chronology Evidence',
    description:
      'Preserves dated milestones, public development sequence, patent events, publications, platform releases, and institutional formation.',
    status: 'ACTIVE',
  },
  {
    number: '05',
    title: 'Architecture Publications',
    type: 'Publication Evidence',
    description:
      'Preserves books, articles, training records, public claims, publication dates, and their stated relationship to TA-14.',
    status: 'ACTIVE',
  },
  {
    number: '06',
    title: 'Patent and Filing Records',
    type: 'Patent Evidence',
    description:
      'Preserves declared provisional and non-provisional filings, filing dates, identifiers, scope statements, and limitations.',
    status: 'PENDING PAGE',
  },
  {
    number: '07',
    title: 'GitHub Repository History',
    type: 'Repository Evidence',
    description:
      'Preserves commits, source files, build history, release chronology, and public implementation records for the TA-14 platform.',
    status: 'PUBLIC SOURCE',
  },
  {
    number: '08',
    title: 'Deployment and Verification Records',
    type: 'Operational Evidence',
    description:
      'Preserves build results, deployment events, verification runs, runtime demonstrations, and public route behavior.',
    status: 'PUBLIC SOURCE',
  },
  {
    number: '09',
    title: 'TA-14 Foundation Pages',
    type: 'Canonical Reference',
    description:
      'Preserves the public conceptual reference layer for admissibility, continuity, governed records, chronology, publications, and completion.',
    status: 'ACTIVE',
  },
  {
    number: '10',
    title: 'TA-14 AI Governance Exchange',
    type: 'Platform Evidence',
    description:
      'Demonstrates public route building, testing, records, verification, replay, execution mapping, and bounded governance behavior.',
    status: 'ACTIVE',
  },
  {
    number: '11',
    title: 'TA-14 Academy Materials',
    type: 'Training Evidence',
    description:
      'Preserves educational materials that translate TA-14 sequencing, evidence, diagnostic determination, and execution discipline into instruction.',
    status: 'ACTIVE',
  },
  {
    number: '12',
    title: 'Independent Reviews and Citations',
    type: 'External Corroboration',
    description:
      'Preserves third-party reviews, citations, public discussions, acknowledgments, critiques, and independent archival references.',
    status: 'OPEN',
  },
];

const evidenceRequirements = [
  {
    title: 'Attribution',
    text:
      'Every evidence artifact should identify who created, submitted, maintained, or asserted it.',
  },
  {
    title: 'Source',
    text:
      'The original or best available source should remain linked or otherwise identifiable.',
  },
  {
    title: 'Date and time',
    text:
      'Creation, publication, filing, upload, modification, and registration dates should remain distinguishable.',
  },
  {
    title: 'Version',
    text:
      'The specific version, edition, release, commit, or revision should be preserved where applicable.',
  },
  {
    title: 'Scope',
    text:
      'The evidence record should state what claim, event, identity field, or architectural element it supports.',
  },
  {
    title: 'Limitations',
    text:
      'Known gaps, missing sources, uncertain dates, unresolved provenance, and contested interpretations should remain visible.',
  },
  {
    title: 'Continuity',
    text:
      'The custody, integrity, storage, and transformation history of important artifacts should remain inspectable.',
  },
  {
    title: 'Challenge status',
    text:
      'Any dispute, correction, supersession, withdrawal, or unresolved challenge should remain attached to the record.',
  },
];

const evidenceStates = [
  {
    state: 'PRESERVED',
    description:
      'The artifact has been stored or linked with declared source, date, attribution, and scope.',
  },
  {
    state: 'CORROBORATED',
    description:
      'One or more independent sources materially support the same claim, date, or event.',
  },
  {
    state: 'CONTESTED',
    description:
      'A material challenge has been submitted and remains unresolved or only partially resolved.',
  },
  {
    state: 'SUPERSEDED',
    description:
      'A newer artifact, correction, or record has replaced the earlier controlling version without erasing it.',
  },
  {
    state: 'INCOMPLETE',
    description:
      'The evidence record is missing material provenance, source, date, version, scope, or continuity information.',
  },
  {
    state: 'WITHDRAWN',
    description:
      'The claimant or steward has formally withdrawn reliance on the artifact or claim.',
  },
];

const prohibitedEvidenceInferences = [
  'Preserved evidence is not automatically verified evidence.',
  'Corroborated evidence is not automatically conclusive evidence.',
  'A public source is not automatically an authoritative source.',
  'A patent filing is not automatic proof of validity, enforceability, or invention priority.',
  'A repository commit is not automatic proof of sole authorship.',
  'A successful build is not automatic proof of correctness, security, or operational fitness.',
  'A publication is not automatic proof that every claim inside it is true.',
  'A Registry record is not certification, endorsement, accreditation, or legal approval.',
];

export default function EvidencePage() {
  return (
    <main className="page">
      <div className="background" aria-hidden="true">
        <div className="stars stars-one" />
        <div className="stars stars-two" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link
          href="/registry/ta-14-admissible-execution-architecture"
          className="brand"
        >
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Supporting Evidence</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Supporting evidence navigation">
          <a href="#records">Evidence Records</a>
          <a href="#requirements">Requirements</a>
          <a href="#states">States</a>
          <a href="#boundary">Boundary</a>
        </nav>

        <Link
          href="/registry/ta-14-admissible-execution-architecture"
          className="top-action"
        >
          Return to Founding Record
        </Link>
      </header>

      <section className="hero">
        <div className="status-row">
          <span>TA-14-AIGR-0001</span>
          <span>SUPPORTING EVIDENCE</span>
          <span>ATTRIBUTED</span>
          <span>CHALLENGEABLE</span>
        </div>

        <p className="eyebrow">SOURCE • PROVENANCE • VERSION • CONTINUITY • LIMITS</p>

        <h1>
          Supporting Evidence for the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This record organizes the evidence used to support the identity,
          chronology, claims, publications, filings, implementation history,
          and institutional development of TA-14.
        </p>

        <div className="hero-actions">
          <a href="#records" className="button button-primary">
            Open the Evidence Record
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/publications"
            className="button button-secondary"
          >
            Architecture Publications
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>Evidence supports a claim only within its declared scope.</strong>
          <p>
            The Registry preserves source, attribution, timing, version,
            continuity, and limitations so that evidence is not silently
            transformed into a broader conclusion than it can sustain.
          </p>
        </div>
      </section>

      <section id="records" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">FOUNDING ARCHITECTURE EVIDENCE RECORDS</p>
          <h2>The Registry preserves multiple evidence classes without collapsing them into one conclusion.</h2>
          <p>
            Each record supports a different part of the architecture and
            remains separately attributable, versioned, bounded, and
            challengeable.
          </p>
        </div>

        <div className="records-grid">
          {evidenceRecords.map((record) => (
            <article key={record.number}>
              <div className="record-topline">
                <span>{record.number}</span>
                <strong>{record.status}</strong>
              </div>
              <small>{record.type}</small>
              <h3>{record.title}</h3>
              <p>{record.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="requirements" className="section shell requirements-section">
        <div className="section-heading">
          <p className="eyebrow">MINIMUM EVIDENCE REQUIREMENTS</p>
          <h2>An artifact without provenance, scope, and limits is not a complete Registry evidence record.</h2>
          <p>
            These fields define the minimum evidence-control discipline for the
            founding architecture and future Registry submissions.
          </p>
        </div>

        <div className="requirements-grid">
          {evidenceRequirements.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="states" className="section shell states-section">
        <div className="section-heading">
          <p className="eyebrow">EVIDENCE STATES</p>
          <h2>The condition of the evidence must remain visible throughout the life of the record.</h2>
          <p>
            Evidence state is separate from the truth of the underlying claim
            and separate from the Registry status of the architecture itself.
          </p>
        </div>

        <div className="states-grid">
          {evidenceStates.map((item) => (
            <article key={item.state}>
              <strong>{item.state}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="boundary" className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">EVIDENCE BOUNDARY</p>
          <h2>What supporting evidence can establish—and what must remain unresolved.</h2>

          <div className="boundary-layout">
            <div className="boundary-positive">
              <h3>Supporting evidence can establish</h3>
              <ul>
                <li>That a record, publication, filing, commit, declaration, or deployment existed by a preserved date.</li>
                <li>Who publicly asserted, authored, filed, uploaded, or maintained the artifact.</li>
                <li>Which architecture claim, chronology event, or identity field the artifact was submitted to support.</li>
                <li>Whether the artifact has been corrected, challenged, superseded, or withdrawn.</li>
                <li>Whether multiple sources materially corroborate the same bounded assertion.</li>
              </ul>
            </div>

            <div className="boundary-negative">
              <h3>Supporting evidence does not automatically establish</h3>
              <ul>
                {prohibitedEvidenceInferences.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="boundary-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/patents"
              className="button button-primary"
            >
              Open Patent and Filing Records
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-secondary"
            >
              Challenge an Evidence Record
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Supporting Evidence</strong>
          <span>Permanent Registry record TA-14-AIGR-0001.</span>
        </div>

        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #020813;
          --text: #f2f7ff;
          --muted: #a8b7c6;
          --line: rgba(129, 192, 239, 0.18);
          --blue: #6dd8ff;
          --gold: #f2bf6d;
          --red: #ff9393;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, rgba(38, 112, 178, 0.22), transparent 32%),
            linear-gradient(180deg, #020711 0%, #06121f 52%, #020811 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .background {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .stars {
          position: absolute;
          inset: -20%;
          opacity: 0.68;
          background-repeat: repeat;
        }

        .stars-one {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.82) 0 1px,
            transparent 1.4px
          );
          background-size: 91px 91px;
          animation: drift 48s linear infinite;
        }

        .stars-two {
          background-image: radial-gradient(
            circle,
            rgba(109, 216, 255, 0.8) 0 1px,
            transparent 1.7px
          );
          background-size: 149px 149px;
          animation: drift 72s linear infinite reverse;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.2;
        }

        .glow-one {
          width: 540px;
          height: 540px;
          top: 2%;
          left: -220px;
          background: #2a8bd3;
        }

        .glow-two {
          width: 640px;
          height: 640px;
          top: 40%;
          right: -340px;
          background: #b87822;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(242, 191, 109, 0.15);
          border-radius: 50%;
        }

        .orbit-one {
          width: 620px;
          height: 180px;
          top: 6%;
          left: -180px;
          transform: rotate(-17deg);
        }

        .orbit-two {
          width: 720px;
          height: 210px;
          top: 9%;
          right: -260px;
          transform: rotate(16deg);
        }

        .topbar,
        .hero,
        .section,
        .footer {
          position: relative;
          z-index: 2;
        }

        .topbar {
          width: min(1480px, calc(100% - 40px));
          min-height: 76px;
          margin: 18px auto 0;
          padding: 12px 14px 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(139, 201, 247, 0.18);
          border-radius: 20px;
          background: rgba(2, 10, 19, 0.74);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.32);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 280px;
        }

        .brand-mark {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          border: 1px solid rgba(242, 191, 109, 0.46);
          background: linear-gradient(
            145deg,
            rgba(138, 86, 29, 0.34),
            rgba(29, 100, 153, 0.22)
          );
          color: var(--gold);
          font-size: 13px;
          font-weight: 900;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
        }

        .brand small {
          color: #91a9bc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .topbar nav {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .topbar nav a {
          padding: 10px 12px;
          border-radius: 11px;
          color: #b5c8d8;
          font-size: 12px;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .topbar nav a:hover {
          color: white;
          background: rgba(109, 216, 255, 0.08);
          transform: translateY(-1px);
        }

        .top-action {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137, 205, 255, 0.27);
          background: linear-gradient(
            180deg,
            rgba(34, 79, 112, 0.76),
            rgba(8, 27, 43, 0.88)
          );
          color: #e6f4ff;
          font-size: 11px;
          font-weight: 900;
        }

        .hero {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          padding: 118px 0 92px;
          text-align: center;
        }

        .status-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .status-row span {
          min-height: 31px;
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(137, 205, 255, 0.2);
          background: rgba(7, 28, 45, 0.72);
          color: #a9c9df;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .status-row span:first-child,
        .status-row span:nth-child(2) {
          color: #ffdb98;
          border-color: rgba(242, 191, 109, 0.3);
          background: rgba(100, 62, 20, 0.2);
        }

        .eyebrow {
          margin: 0 0 16px;
          color: var(--gold);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 1120px;
          margin: 0 auto;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 8vw, 105px);
          font-weight: 500;
          line-height: 0.95;
          letter-spacing: -0.052em;
        }

        .hero h1 span {
          display: block;
          margin-top: 12px;
          color: transparent;
          background: linear-gradient(
            100deg,
            #f9fcff 0%,
            #7bdcff 45%,
            #ffd48b 84%
          );
          -webkit-background-clip: text;
          background-clip: text;
          font-style: italic;
        }

        .hero-copy {
          max-width: 900px;
          margin: 34px auto 0;
          color: #c0cfdb;
          font-size: clamp(17px, 2vw, 23px);
          line-height: 1.72;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 34px;
        }

        .button {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 20px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.045em;
          transition: transform 0.22s ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .button-primary {
          color: #03111d;
          border-color: rgba(209, 243, 255, 0.9);
          background: linear-gradient(
            135deg,
            #c7f2ff,
            #68ceff 55%,
            #369cec
          );
          box-shadow: 0 14px 34px rgba(53, 170, 247, 0.22);
        }

        .button-secondary {
          color: #e4f2ff;
          border-color: rgba(139, 204, 249, 0.24);
          background: linear-gradient(
            180deg,
            rgba(36, 78, 109, 0.7),
            rgba(7, 24, 39, 0.88)
          );
        }

        .hero-notice {
          max-width: 1020px;
          margin: 36px auto 0;
          padding: 22px 24px;
          text-align: left;
          border-radius: 18px;
          border: 1px solid rgba(242, 191, 109, 0.26);
          background: linear-gradient(
            90deg,
            rgba(98, 59, 18, 0.25),
            rgba(8, 25, 40, 0.8)
          );
        }

        .hero-notice strong {
          display: block;
          color: #ffe0a5;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
        }

        .hero-notice p {
          margin: 8px 0 0;
          color: #bdc9d4;
          font-size: 13px;
          line-height: 1.7;
        }

        .shell {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
        }

        .section {
          padding: 100px 0;
        }

        .section-heading {
          max-width: 920px;
          margin-bottom: 46px;
        }

        .section-heading h2,
        .boundary-card h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        .section-heading > p:last-child {
          margin: 20px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .records-grid,
        .requirements-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .records-grid article,
        .requirements-grid article {
          min-height: 250px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.9),
            rgba(4, 15, 26, 0.94)
          );
        }

        .record-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }

        .record-topline span,
        .requirements-grid article > span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .record-topline strong {
          padding: 6px 8px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: rgba(10, 44, 69, 0.5);
          color: #8edcff;
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .records-grid small {
          display: block;
          margin-top: 34px;
          color: #87a9c0;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .records-grid h3,
        .requirements-grid h3 {
          margin: 12px 0 11px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          font-weight: 500;
        }

        .records-grid p,
        .requirements-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.7;
        }

        .requirements-section,
        .states-section,
        .boundary-section {
          padding-top: 60px;
        }

        .requirements-grid article > span {
          display: block;
          margin-bottom: 42px;
        }

        .states-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .states-grid article {
          padding: 24px;
          border-radius: 18px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: linear-gradient(
            145deg,
            rgba(10, 32, 50, 0.86),
            rgba(4, 14, 24, 0.94)
          );
        }

        .states-grid strong {
          color: #ffd58b;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        .states-grid p {
          margin: 12px 0 0;
          color: #a8b8c6;
          font-size: 13px;
          line-height: 1.68;
        }

        .boundary-card {
          padding: 42px;
          border-radius: 28px;
          border: 1px solid rgba(242, 191, 109, 0.25);
          background:
            radial-gradient(
              circle at 12% 0%,
              rgba(189, 119, 32, 0.15),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(9, 28, 45, 0.96),
              rgba(4, 13, 23, 0.98)
            );
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.32);
        }

        .boundary-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 34px;
        }

        .boundary-layout > div {
          padding: 26px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.78);
        }

        .boundary-layout .boundary-negative {
          border-color: rgba(255, 147, 147, 0.17);
          background: rgba(47, 20, 23, 0.34);
        }

        .boundary-layout h3 {
          margin: 0 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .boundary-layout ul {
          margin: 0;
          padding-left: 20px;
          color: #aebdca;
        }

        .boundary-layout li {
          margin: 10px 0;
          font-size: 13px;
          line-height: 1.6;
        }

        .boundary-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding: 45px 0 60px;
          border-top: 1px solid var(--line);
          color: #8599aa;
        }

        .footer div {
          display: grid;
          gap: 5px;
        }

        .footer strong {
          color: #d7e7f3;
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .footer span,
        .footer p {
          margin: 0;
          font-size: 12px;
        }

        .footer p {
          color: var(--gold);
          font-family: Georgia, serif;
          font-style: italic;
        }

        @keyframes drift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(120px, 90px, 0);
          }
        }

        @media (max-width: 1100px) {
          .topbar nav {
            display: none;
          }

          .records-grid,
          .requirements-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .topbar {
            width: min(100% - 22px, 1480px);
          }

          .brand {
            min-width: 0;
          }

          .brand small,
          .top-action {
            display: none;
          }

          .hero {
            width: min(100% - 28px, 1240px);
            padding: 80px 0 72px;
          }

          .shell {
            width: min(100% - 28px, 1200px);
          }

          .section {
            padding: 78px 0;
          }

          .records-grid,
          .requirements-grid,
          .states-grid,
          .boundary-layout {
            grid-template-columns: 1fr;
          }

          .boundary-card {
            padding: 30px 22px;
          }

          .footer {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
