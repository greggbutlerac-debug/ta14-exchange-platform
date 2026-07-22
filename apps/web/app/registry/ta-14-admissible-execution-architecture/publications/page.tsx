'use client';

import Link from 'next/link';

const publications = [
  {
    year: '2025',
    date: 'May 1, 2025',
    title: 'The Atmospheric Integrity Network',
    type: 'Book / Foundational Public Record',
    contribution:
      'Preserved the earliest currently cited public expression of the TA-14 chain and the relationship between atmospheric evidence, continuity, governance, and execution.',
    status: 'FOUNDATIONAL',
  },
  {
    year: '2026',
    date: 'June 10, 2026',
    title:
      'Environmental Integrity Governance: Atmospheric Integrity Records and the Governance of Air Reality',
    type: 'Book',
    contribution:
      'Extended TA-14 into environmental integrity governance, Atmospheric Integrity Records, governed air reality, admissibility, and attributable environmental outcomes.',
    status: 'ACTIVE',
  },
  {
    year: '2026',
    date: 'June 10, 2026',
    title: 'Admissible Reality: Why AI Fails Before Execution',
    type: 'Book',
    contribution:
      'Applied the TA-14 admissibility thesis to artificial intelligence systems, emphasizing that governance failure often occurs before execution begins.',
    status: 'ACTIVE',
  },
  {
    year: '2026',
    date: 'June 10, 2026',
    title: 'The Lettered Van Illusion',
    type: 'Book',
    contribution:
      'Examined the difference between visible professional appearance and evidence-bound operational truth.',
    status: 'ACTIVE',
  },
  {
    year: '2026',
    date: 'June 20, 2026',
    title: 'HVACDR: Why the D Is There',
    type: 'Book',
    contribution:
      'Preserved the distinction between data, diagnosis, diagnostic determination, intervention, and post-intervention proof within HVAC practice.',
    status: 'ACTIVE',
  },
  {
    year: '2026',
    date: 'June 22, 2026',
    title: 'TA-14 Academy EPA 608 Universal Quick Memory Workbook',
    type: 'Training Publication',
    contribution:
      'Converted refrigerant knowledge into a structured educational artifact within the TA-14 Academy training system.',
    status: 'ACTIVE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'Air Pollution Made Admissible: The Atmospheric Integrity Network',
    type: 'Book',
    contribution:
      'Connected air pollution measurement, governance, continuity, interpretation, and admissibility into a public environmental evidence framework.',
    status: 'ACTIVE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'From Sensors to Evidence',
    type: 'Article',
    contribution:
      'Explained why sensor output is not automatically evidence and why continuity, context, provenance, and interpretation matter.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'The Smart Building’s Evidence Problem',
    type: 'Article',
    contribution:
      'Applied TA-14 reasoning to smart buildings, emphasizing that automation without admissible evidence can accelerate ambiguity.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'Buildings Are Becoming Intelligent Before They Are Admissible',
    type: 'Article',
    contribution:
      'Distinguished building intelligence from governed proof and admissible operational authority.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'Before the Building Acts',
    type: 'Article',
    contribution:
      'Focused on the evidence, authority, and route conditions that should exist before automated building execution.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'The Building Is Now Health Infrastructure',
    type: 'Article',
    contribution:
      'Framed buildings as health-relevant environments requiring governed records and attributable performance.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'Why AI Trust Breaks Down in Operational Environments',
    type: 'Article',
    contribution:
      'Explained why AI assurance weakens when model outputs are separated from real-world evidence, authority, execution, and outcome.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'When Filters, Coatings, and Dashboards Are Not Enough',
    type: 'Article',
    contribution:
      'Distinguished environmental products and visualizations from governed proof of environmental performance.',
    status: 'PUBLIC ARTICLE',
  },
  {
    year: '2026',
    date: '2026',
    title: 'TA-14 Partner Review Network — A New Category for Admissible Execution Governance',
    type: 'Article',
    contribution:
      'Introduced a review-network model based on explicit boundaries, specialized review lanes, attribution, and second-layer governance.',
    status: 'PUBLIC ARTICLE',
  },
];

const publicationFunctions = [
  {
    title: 'Chronology support',
    text:
      'A publication can preserve that a concept, architecture, phrase, claim, or sequence was publicly expressed by a certain date.',
  },
  {
    title: 'Concept definition',
    text:
      'A publication can define terms, distinctions, chains, boundaries, and declared methods used by the architecture.',
  },
  {
    title: 'Public accountability',
    text:
      'A publication creates a record that can be examined, cited, criticized, compared, challenged, and corrected.',
  },
  {
    title: 'Institutional continuity',
    text:
      'A publication can connect later platforms, standards, patents, courses, and Registry records to an earlier public foundation.',
  },
  {
    title: 'Evidence package contribution',
    text:
      'A publication may become one supporting component in a larger evidence package without proving every claim it contains.',
  },
  {
    title: 'Boundary preservation',
    text:
      'A publication can preserve explicit non-claims and limitations so later summaries do not overstate the architecture.',
  },
];

const publicationBoundaries = [
  'Publication does not automatically prove first conception.',
  'Publication does not automatically prove exclusive authorship or ownership.',
  'Publication does not automatically prove technical validity.',
  'Publication does not automatically establish legal, regulatory, scientific, or professional acceptance.',
  'Publication does not convert every statement into an independently verified fact.',
  'Publication evidence must remain connected to edition, date, source, author, and available archival records.',
];

export default function PublicationsPage() {
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
            <strong>Architecture Publications</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Architecture publications navigation">
          <a href="#catalog">Catalog</a>
          <a href="#functions">Functions</a>
          <a href="#boundaries">Boundaries</a>
          <a href="#record">Registry Record</a>
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
          <span>PUBLICATION RECORD</span>
          <span>ATTRIBUTED</span>
          <span>PUBLIC</span>
        </div>

        <p className="eyebrow">BOOKS • ARTICLES • TRAINING RECORDS • PUBLIC CLAIMS</p>

        <h1>
          Publications of the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This record preserves publications that define, explain, extend, or
          publicly evidence the development of TA-14. Each entry remains
          attributable to its source, date, edition, scope, and declared
          limitations.
        </p>

        <div className="hero-actions">
          <a href="#catalog" className="button button-primary">
            Open the Publication Catalog
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/chronology"
            className="button button-secondary"
          >
            Architecture Chronology
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>Publication creates a public record, not automatic validation.</strong>
          <p>
            A publication can support chronology, attribution, concept
            definition, and institutional continuity without conclusively
            proving originality, exclusivity, technical correctness, or legal
            priority.
          </p>
        </div>
      </section>

      <section id="catalog" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">PUBLICATION CATALOG</p>
          <h2>The written record shows how the architecture entered public view.</h2>
          <p>
            This catalog combines foundational books, applied publications,
            educational materials, and public articles that support the TA-14
            institutional record.
          </p>
        </div>

        <div className="publication-list">
          {publications.map((item, index) => (
            <article key={`${item.date}-${item.title}`}>
              <div className="publication-index">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{item.year}</small>
              </div>

              <div className="publication-content">
                <div className="publication-meta">
                  <span>{item.type}</span>
                  <time>{item.date}</time>
                  <strong>{item.status}</strong>
                </div>

                <h3>{item.title}</h3>
                <p>{item.contribution}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="functions" className="section shell functions-section">
        <div className="section-heading">
          <p className="eyebrow">REGISTRY FUNCTIONS OF PUBLICATION EVIDENCE</p>
          <h2>Publications serve the record only when their role is explicitly bounded.</h2>
          <p>
            The Registry treats publications as evidence artifacts with defined
            functions rather than as self-authenticating proof.
          </p>
        </div>

        <div className="functions-grid">
          {publicationFunctions.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="boundaries" className="section shell boundaries-section">
        <div className="section-heading">
          <p className="eyebrow">PUBLICATION BOUNDARIES</p>
          <h2>The Registry must not confuse publication with conclusive proof.</h2>
          <p>
            These boundaries apply whenever a book, article, workbook, website,
            repository, or public post is cited as evidence.
          </p>
        </div>

        <div className="boundaries-card">
          <ol>
            {publicationBoundaries.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="record" className="section shell record-section">
        <div className="record-card">
          <p className="eyebrow">PUBLICATION RECORD CONTROL</p>
          <h2>Every publication entry should remain source-linked, versioned, and challengeable.</h2>
          <p>
            A complete publication record should preserve title, author,
            publication date, publisher or platform, edition, identifier,
            source link, archival copy where permitted, relationship to the
            architecture, status, corrections, and disputes.
          </p>

          <div className="record-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/evidence"
              className="button button-primary"
            >
              Open the Evidence Record
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-secondary"
            >
              Challenge a Publication Entry
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Architecture Publications</strong>
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
        .record-card h2 {
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

        .publication-list {
          display: grid;
          gap: 14px;
        }

        .publication-list article {
          display: grid;
          grid-template-columns: 86px 1fr;
          gap: 18px;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.9),
            rgba(4, 15, 26, 0.94)
          );
          box-shadow: 0 18px 54px rgba(0, 0, 0, 0.18);
        }

        .publication-index {
          min-height: 116px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 15px 10px;
          border-radius: 15px;
          border: 1px solid rgba(242, 191, 109, 0.23);
          background: linear-gradient(
            145deg,
            rgba(91, 55, 20, 0.43),
            rgba(7, 29, 46, 0.9)
          );
        }

        .publication-index span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .publication-index small {
          color: #8db5ce;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .publication-content {
          padding: 6px 6px 7px;
        }

        .publication-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .publication-meta span,
        .publication-meta time,
        .publication-meta strong {
          min-height: 26px;
          display: inline-flex;
          align-items: center;
          padding: 0 9px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background: rgba(10, 42, 65, 0.48);
          color: #9fdfff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .publication-meta time {
          color: #c4d1dc;
        }

        .publication-meta strong {
          color: #ffd58b;
          border-color: rgba(242, 191, 109, 0.2);
          background: rgba(88, 54, 18, 0.27);
        }

        .publication-content h3 {
          margin: 19px 0 10px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(23px, 3vw, 34px);
          font-weight: 500;
          line-height: 1.16;
        }

        .publication-content p {
          margin: 0;
          color: #a9bac8;
          font-size: 14px;
          line-height: 1.72;
        }

        .functions-section,
        .boundaries-section,
        .record-section {
          padding-top: 60px;
        }

        .functions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .functions-grid article {
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

        .functions-grid span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .functions-grid h3 {
          margin: 42px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
        }

        .functions-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.68;
        }

        .boundaries-card {
          padding: 34px;
          border-radius: 24px;
          border: 1px solid rgba(255, 147, 147, 0.18);
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(255, 147, 147, 0.08),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              rgba(44, 20, 25, 0.52),
              rgba(6, 17, 29, 0.95)
            );
        }

        .boundaries-card ol {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .boundaries-card li {
          min-height: 108px;
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 14px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 147, 147, 0.13);
          background: rgba(18, 13, 20, 0.56);
        }

        .boundaries-card li span {
          color: var(--red);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .boundaries-card li p {
          margin: 0;
          color: #b9c4ce;
          font-size: 13px;
          line-height: 1.65;
        }

        .record-card {
          padding: 44px;
          border-radius: 28px;
          border: 1px solid rgba(242, 191, 109, 0.25);
          background:
            radial-gradient(
              circle at 12% 0%,
              rgba(189, 119, 32, 0.16),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(9, 28, 45, 0.96),
              rgba(4, 13, 23, 0.98)
            );
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.32);
        }

        .record-card > p:not(.eyebrow) {
          max-width: 940px;
          margin: 22px 0 0;
          color: #aebdca;
          font-size: 15px;
          line-height: 1.8;
        }

        .record-actions {
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

          .functions-grid {
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

          .publication-list article {
            grid-template-columns: 1fr;
          }

          .publication-index {
            min-height: auto;
            flex-direction: row;
          }

          .functions-grid,
          .boundaries-card ol {
            grid-template-columns: 1fr;
          }

          .boundaries-card,
          .record-card {
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
