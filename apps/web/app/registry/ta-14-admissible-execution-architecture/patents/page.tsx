'use client';

import Link from 'next/link';

const patentRecords = [
  {
    number: '01',
    identifier: '63/940,392',
    title: 'Standardized HVAC Diagnostic & Electrical Integrity',
    filingType: 'Provisional Patent Application',
    filingDate: 'December 14, 2025',
    status: 'FILED',
    description:
      'Preserves the declared filing chronology for standardized HVAC diagnostic and electrical integrity architecture.',
  },
  {
    number: '02',
    identifier: '19/427,932',
    title: 'Standardized HVAC Diagnostic & Electrical Integrity',
    filingType: 'Non-Provisional Patent Application',
    filingDate: 'December 19, 2025',
    status: 'FILED',
    description:
      'Preserves the declared non-provisional filing record and its relationship to the earlier provisional filing.',
  },
  {
    number: '03',
    identifier: '63/957,580',
    title: 'Analyzer-Driven Refrigerant Governor',
    filingType: 'Provisional Patent Application',
    filingDate: 'January 9, 2026',
    status: 'FILED',
    description:
      'Preserves the declared filing chronology for analyzer-driven refrigerant governance, evidence capture, and bounded execution control.',
  },
];

const filingFields = [
  {
    title: 'Filing identifier',
    text:
      'The official application or filing number associated with the preserved patent record.',
  },
  {
    title: 'Filing type',
    text:
      'The declared classification of the record, including provisional, non-provisional, continuation, divisional, international, or other filing type.',
  },
  {
    title: 'Filing date',
    text:
      'The date the filing was submitted or otherwise recorded by the relevant filing authority.',
  },
  {
    title: 'Applicant and inventor',
    text:
      'The declared applicant, inventor, assignee, or other party identified in the filing record.',
  },
  {
    title: 'Title and scope statement',
    text:
      'The title and a bounded description of the architecture, system, process, or claimed subject matter associated with the filing.',
  },
  {
    title: 'Relationship to prior filings',
    text:
      'Any declared priority claim, conversion, continuation, continuation-in-part, or other relationship to earlier records.',
  },
  {
    title: 'Current status',
    text:
      'The best available status of the filing, including pending, abandoned, published, issued, expired, withdrawn, or otherwise unresolved.',
  },
  {
    title: 'Supporting documents',
    text:
      'Receipts, filing confirmations, publications, official notices, assignment records, amendments, or other supporting artifacts.',
  },
];

const patentBoundaries = [
  'A filing date preserves chronology but does not automatically prove first conception.',
  'A provisional filing does not itself create an issued patent right.',
  'A non-provisional filing does not guarantee allowance, issuance, enforceability, or commercial validity.',
  'A patent record does not automatically establish that every broader architectural claim is covered by the filing.',
  'A Registry summary is not a substitute for the official patent-office record.',
  'A filing title does not define the complete legal scope of any issued or pending claims.',
  'The Registry does not provide patentability, infringement, freedom-to-operate, or legal advice.',
  'Competing filings, earlier publications, prior art, assignments, and disputes must remain separately reviewable.',
];

const patentStates = [
  {
    state: 'DECLARED',
    description:
      'The architecture steward has submitted the filing identifier, title, date, type, and relationship to the architecture.',
  },
  {
    state: 'DOCUMENTED',
    description:
      'Supporting filing receipts, official notices, publications, or other source records have been preserved or linked.',
  },
  {
    state: 'PENDING',
    description:
      'The filing remains unresolved before the relevant patent authority or its present status has not been conclusively established.',
  },
  {
    state: 'ISSUED',
    description:
      'An official patent record indicates that rights were granted, subject to jurisdiction, claims, maintenance, and later challenge.',
  },
  {
    state: 'ABANDONED',
    description:
      'The filing is no longer active according to the best available official record.',
  },
  {
    state: 'CONTESTED',
    description:
      'A material dispute concerns ownership, inventorship, priority, scope, attribution, validity, or relationship to the architecture.',
  },
];

export default function PatentsPage() {
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
            <strong>Patent & Filing Records</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Patent record navigation">
          <a href="#records">Filing Records</a>
          <a href="#fields">Required Fields</a>
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
          <span>PATENT RECORD</span>
          <span>ATTRIBUTED</span>
          <span>NON-ADJUDICATIVE</span>
        </div>

        <p className="eyebrow">FILING • CHRONOLOGY • SCOPE • STATUS • LIMITS</p>

        <h1>
          Patent and Filing Records for the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This record preserves declared patent filings associated with TA-14
          while maintaining a strict separation between filing chronology,
          legal rights, inventorship, validity, scope, and final adjudication.
        </p>

        <div className="hero-actions">
          <a href="#records" className="button button-primary">
            Open the Filing Record
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/evidence"
            className="button button-secondary"
          >
            Supporting Evidence
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>A filing preserves a legal-process record, not an automatic institutional conclusion.</strong>
          <p>
            Registration does not determine patentability, ownership,
            inventorship, priority, validity, enforceability, infringement, or
            freedom to operate.
          </p>
        </div>
      </section>

      <section id="records" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">DECLARED PATENT AND FILING RECORDS</p>
          <h2>The Registry preserves the filing trail without overstating what the filing proves.</h2>
          <p>
            Each entry remains tied to its identifier, filing type, filing
            date, declared architectural relationship, supporting documents,
            and current status.
          </p>
        </div>

        <div className="patent-list">
          {patentRecords.map((record) => (
            <article key={record.identifier}>
              <div className="patent-index">
                <span>{record.number}</span>
                <strong>{record.status}</strong>
              </div>

              <div className="patent-content">
                <div className="patent-meta">
                  <span>{record.identifier}</span>
                  <time>{record.filingDate}</time>
                  <small>{record.filingType}</small>
                </div>

                <h3>{record.title}</h3>
                <p>{record.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="fields" className="section shell fields-section">
        <div className="section-heading">
          <p className="eyebrow">MINIMUM FILING RECORD FIELDS</p>
          <h2>A filing entry must remain precise enough to verify against the official record.</h2>
          <p>
            These fields define the minimum patent-record discipline for TA-14
            and future Registry architectures.
          </p>
        </div>

        <div className="fields-grid">
          {filingFields.map((item, index) => (
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
          <p className="eyebrow">PATENT RECORD STATES</p>
          <h2>The filing record must show its current condition without implying more than is known.</h2>
          <p>
            Registry state is descriptive. It does not replace the official
            patent-office record or a legal determination.
          </p>
        </div>

        <div className="states-grid">
          {patentStates.map((item) => (
            <article key={item.state}>
              <strong>{item.state}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="boundary" className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">PATENT RECORD BOUNDARY</p>
          <h2>Chronology must remain visible without becoming automatic priority.</h2>

          <div className="boundary-layout">
            <div>
              <h3>The Registry can preserve</h3>
              <ul>
                <li>Declared filing identifiers, types, dates, titles, and applicants.</li>
                <li>Relationships between provisional, non-provisional, continuation, and related filings.</li>
                <li>Supporting receipts, official notices, publications, amendments, and status records.</li>
                <li>The architecture steward’s declared relationship between a filing and TA-14.</li>
                <li>Challenges concerning attribution, inventorship, scope, ownership, or chronology.</li>
              </ul>
            </div>

            <div className="boundary-negative">
              <h3>The Registry cannot automatically determine</h3>
              <ul>
                {patentBoundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="boundary-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/rights"
              className="button button-primary"
            >
              Open Rights and Stewardship
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-secondary"
            >
              Challenge a Filing Record
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Patent and Filing Records</strong>
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

        .patent-list {
          display: grid;
          gap: 14px;
        }

        .patent-list article {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 18px;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.9),
            rgba(4, 15, 26, 0.94)
          );
        }

        .patent-index {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 18px 12px;
          border-radius: 16px;
          border: 1px solid rgba(242, 191, 109, 0.24);
          background: linear-gradient(
            145deg,
            rgba(91, 55, 20, 0.44),
            rgba(7, 29, 46, 0.9)
          );
        }

        .patent-index span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .patent-index strong {
          color: #9de3ff;
          font-size: 8px;
          letter-spacing: 0.11em;
        }

        .patent-content {
          padding: 8px 8px 8px 4px;
        }

        .patent-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .patent-meta span,
        .patent-meta time,
        .patent-meta small {
          min-height: 28px;
          display: inline-flex;
          align-items: center;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background: rgba(10, 42, 65, 0.48);
          color: #9fdfff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .patent-meta time,
        .patent-meta small {
          color: #c4d1dc;
        }

        .patent-content h3 {
          margin: 22px 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(25px, 3vw, 36px);
          font-weight: 500;
        }

        .patent-content p {
          margin: 0;
          color: #a9bac8;
          font-size: 14px;
          line-height: 1.72;
        }

        .fields-section,
        .states-section,
        .boundary-section {
          padding-top: 60px;
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .fields-grid article {
          min-height: 245px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.88),
            rgba(4, 15, 26, 0.92)
          );
        }

        .fields-grid span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .fields-grid h3 {
          margin: 42px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .fields-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.68;
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

          .fields-grid {
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

          .patent-list article {
            grid-template-columns: 1fr;
          }

          .patent-index {
            min-height: auto;
            flex-direction: row;
          }

          .fields-grid,
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
