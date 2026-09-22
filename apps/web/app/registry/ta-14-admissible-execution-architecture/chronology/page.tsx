'use client';

import Link from 'next/link';

const chronology = [
  {
    date: 'May 1, 2025',
    title: 'Earliest public architecture claim',
    text:
      'The TA-14 chain was publicly described through The Atmospheric Integrity Network, establishing the earliest preserved public chronology currently cited by the Registry.',
    status: 'FOUNDATIONAL',
  },
  {
    date: 'December 14, 2025',
    title: 'Provisional diagnostic and electrical integrity filing',
    text:
      'A provisional patent filing was made for standardized HVAC diagnostic and electrical integrity architecture.',
    status: 'PATENT RECORD',
  },
  {
    date: 'December 19, 2025',
    title: 'Non-provisional filing',
    text:
      'The standardized HVAC diagnostic and electrical integrity architecture advanced into a non-provisional filing.',
    status: 'PATENT RECORD',
  },
  {
    date: 'January 9, 2026',
    title: 'Analyzer-driven refrigerant governor filing',
    text:
      'A provisional filing was made for the Analyzer-Driven Refrigerant Governor, extending governed execution into refrigerant handling and control.',
    status: 'PATENT RECORD',
  },
  {
    date: 'January 12, 2026',
    title: 'Diagnostic truth formally declared',
    text:
      'TA-14 formally distinguished diagnostic truth as an evidence-bound, rule-constrained diagnostic determination rather than an ungoverned opinion or label.',
    status: 'CANONICAL',
  },
  {
    date: 'June 10, 2026',
    title: 'Environmental Integrity Governance publication',
    text:
      'Environmental Integrity Governance: Atmospheric Integrity Records and the Governance of Air Reality was published, extending the architecture into governed environmental records.',
    status: 'PUBLICATION',
  },
  {
    date: 'June 2026',
    title: 'Twenty-four-link admissibility chain introduced',
    text:
      'The runtime governance model expanded into a twenty-four-link admissibility chain with ALLOW, HOLD, DENY, and ESCALATE classifications.',
    status: 'ARCHITECTURE',
  },
  {
    date: 'July 2026',
    title: 'TA-14 AI Governance Exchange opened',
    text:
      'The TA-14 AI Governance Exchange became publicly available as a free governance playground for route building, testing, records, verification, and execution mapping.',
    status: 'PLATFORM',
  },
  {
    date: 'July 2026',
    title: 'TA-14 Foundation established as a public reference layer',
    text:
      'The Foundation was organized to preserve canonical concepts, architecture, chronology, publications, completion conditions, and institutional boundaries.',
    status: 'INSTITUTION',
  },
  {
    date: 'July 22, 2026',
    title: 'Founding Registry record established',
    text:
      'The TA-14 AI Governance Registry established TA-14-AIGR-0001 as the public founding architecture record for the TA-14 Admissible Execution Architecture.',
    status: 'REGISTRY',
  },
];

const evidenceClasses = [
  {
    title: 'Publication evidence',
    text:
      'Books, articles, public essays, repository records, and institutional pages used to support chronology claims.',
  },
  {
    title: 'Repository evidence',
    text:
      'Git history, commits, release history, build records, deployment records, and public source files.',
  },
  {
    title: 'Patent evidence',
    text:
      'Provisional and non-provisional filing records used to preserve invention chronology and declared scope.',
  },
  {
    title: 'Platform evidence',
    text:
      'Public demonstrations, routes, records, verification receipts, playground releases, and preserved runtime artifacts.',
  },
  {
    title: 'Institutional declarations',
    text:
      'Founding declarations, governance identity records, standards, challenges, corrections, and supersession notices.',
  },
  {
    title: 'External corroboration',
    text:
      'Independent publications, citations, reviews, witnesses, dated communications, and third-party archival records.',
  },
];

const chronologyRules = [
  'A later upload date does not automatically prove a later creation date.',
  'A publication date does not automatically prove first conception.',
  'A patent filing date preserves filing chronology, not universal priority.',
  'A repository commit can support chronology but may not prove authorship by itself.',
  'A copied or republished document must retain its original source date where known.',
  'Disputed dates must remain visible until corrected, resolved, or superseded.',
  'No chronology claim should be represented as conclusive when supporting evidence is incomplete.',
];

export default function ChronologyPage() {
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
            <strong>Architecture Chronology</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Architecture chronology navigation">
          <a href="#timeline">Timeline</a>
          <a href="#evidence">Evidence Classes</a>
          <a href="#rules">Chronology Rules</a>
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
          <span>CHRONOLOGY RECORD</span>
          <span>VERSIONED</span>
          <span>PUBLIC</span>
        </div>

        <p className="eyebrow">DATED CLAIMS • SUPPORTING RECORDS • OPEN CHALLENGE</p>

        <h1>
          Chronology of the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This chronology preserves the publicly declared development sequence
          of TA-14. It records dates, milestones, evidence classes, and
          limitations without treating chronology preservation as conclusive
          adjudication of priority, ownership, or originality.
        </p>

        <div className="hero-actions">
          <a href="#timeline" className="button button-primary">
            Open the Timeline
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/claims-and-boundaries"
            className="button button-secondary"
          >
            Claims and Boundaries
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>Chronology is preserved evidence, not self-executing proof.</strong>
          <p>
            Every milestone remains subject to source review, provenance,
            correction, challenge, competing claims, and later supersession.
          </p>
        </div>
      </section>

      <section id="timeline" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">PUBLIC DEVELOPMENT TIMELINE</p>
          <h2>The Registry preserves sequence so later claims do not erase earlier records.</h2>
          <p>
            This timeline represents the currently declared chronology of the
            architecture and its institutional development.
          </p>
        </div>

        <div className="timeline">
          {chronology.map((item, index) => (
            <article key={`${item.date}-${item.title}`}>
              <div className="timeline-marker">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>

              <div className="timeline-card">
                <div className="timeline-meta">
                  <time>{item.date}</time>
                  <span>{item.status}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="evidence" className="section shell evidence-section">
        <div className="section-heading">
          <p className="eyebrow">CHRONOLOGY EVIDENCE CLASSES</p>
          <h2>A date becomes more credible when its source, provenance, and limits are visible.</h2>
          <p>
            The Registry can preserve multiple evidence classes for the same
            chronology event without collapsing them into a single conclusion.
          </p>
        </div>

        <div className="evidence-grid">
          {evidenceClasses.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="rules" className="section shell rules-section">
        <div className="section-heading">
          <p className="eyebrow">CHRONOLOGY GOVERNANCE RULES</p>
          <h2>The Registry must preserve time without overstating what time proves.</h2>
          <p>
            These rules apply whenever a date is added, cited, corrected,
            challenged, or used to support attribution.
          </p>
        </div>

        <div className="rules-card">
          <ol>
            {chronologyRules.map((rule, index) => (
              <li key={rule}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{rule}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="boundary" className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">CHRONOLOGY BOUNDARY</p>
          <h2>What this timeline preserves—and what it cannot conclusively decide.</h2>

          <div className="boundary-columns">
            <div>
              <h3>This chronology preserves</h3>
              <ul>
                <li>Declared dates and milestones.</li>
                <li>Supporting evidence classes and public references.</li>
                <li>Version history, corrections, disputes, and supersession.</li>
                <li>The sequence connecting publications, filings, platforms, and institutions.</li>
                <li>The public basis for challenge and independent review.</li>
              </ul>
            </div>

            <div>
              <h3>This chronology does not decide</h3>
              <ul>
                <li>Ultimate invention priority.</li>
                <li>Exclusive authorship or ownership.</li>
                <li>Trademark, patent, or copyright validity.</li>
                <li>The absence of earlier private work or competing public claims.</li>
                <li>Legal sufficiency in any jurisdiction.</li>
              </ul>
            </div>
          </div>

          <div className="boundary-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/evidence"
              className="button button-primary"
            >
              Open Supporting Evidence
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-secondary"
            >
              Challenge a Chronology Claim
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Architecture Chronology</strong>
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
          max-width: 900px;
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

        .timeline {
          position: relative;
          display: grid;
          gap: 18px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 28px;
          width: 1px;
          background: linear-gradient(
            180deg,
            rgba(242, 191, 109, 0.48),
            rgba(109, 216, 255, 0.34),
            transparent
          );
        }

        .timeline article {
          position: relative;
          display: grid;
          grid-template-columns: 58px 1fr;
          gap: 18px;
        }

        .timeline-marker {
          position: relative;
          z-index: 2;
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          border: 1px solid rgba(242, 191, 109, 0.38);
          background: linear-gradient(
            145deg,
            rgba(105, 63, 20, 0.88),
            rgba(7, 29, 46, 0.96)
          );
          box-shadow: 0 14px 38px rgba(0, 0, 0, 0.32);
        }

        .timeline-marker span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .timeline-card {
          padding: 26px 28px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.9),
            rgba(4, 15, 26, 0.94)
          );
        }

        .timeline-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .timeline-meta time {
          color: #f6d69a;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .timeline-meta span {
          padding: 6px 9px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: rgba(10, 44, 69, 0.5);
          color: #8edcff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .timeline-card h3 {
          margin: 18px 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          font-weight: 500;
        }

        .timeline-card p {
          margin: 0;
          color: #a8b8c6;
          font-size: 14px;
          line-height: 1.74;
        }

        .evidence-section,
        .rules-section,
        .boundary-section {
          padding-top: 60px;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .evidence-grid article {
          min-height: 245px;
          padding: 25px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.88),
            rgba(4, 15, 26, 0.92)
          );
        }

        .evidence-grid span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .evidence-grid h3 {
          margin: 42px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
        }

        .evidence-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.68;
        }

        .rules-card {
          padding: 34px;
          border-radius: 24px;
          border: 1px solid rgba(242, 191, 109, 0.2);
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(242, 191, 109, 0.08),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              rgba(34, 28, 18, 0.52),
              rgba(6, 17, 29, 0.95)
            );
        }

        .rules-card ol {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .rules-card li {
          min-height: 110px;
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 14px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(242, 191, 109, 0.13);
          background: rgba(18, 16, 12, 0.45);
        }

        .rules-card li span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .rules-card li p {
          margin: 0;
          color: #b9c4ce;
          font-size: 13px;
          line-height: 1.65;
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

        .boundary-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 34px;
        }

        .boundary-columns > div {
          padding: 26px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.78);
        }

        .boundary-columns > div:last-child {
          border-color: rgba(255, 147, 147, 0.17);
          background: rgba(47, 20, 23, 0.34);
        }

        .boundary-columns h3 {
          margin: 0 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .boundary-columns ul {
          margin: 0;
          padding-left: 20px;
          color: #aebdca;
        }

        .boundary-columns li {
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

          .evidence-grid {
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

          .evidence-grid,
          .rules-card ol,
          .boundary-columns {
            grid-template-columns: 1fr;
          }

          .timeline article {
            grid-template-columns: 48px 1fr;
            gap: 12px;
          }

          .timeline::before {
            left: 23px;
          }

          .timeline-marker {
            width: 48px;
            height: 48px;
            border-radius: 15px;
          }

          .timeline-card {
            padding: 22px 20px;
          }

          .rules-card,
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
