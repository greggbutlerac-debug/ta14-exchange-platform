'use client';

import Link from 'next/link';

const identityFields = [
  {
    label: 'Official governance name',
    value: 'TA-14 Admissible Execution Architecture',
    note: 'The complete public name preserved by the founding Registry record.',
  },
  {
    label: 'Short name',
    value: 'TA-14',
    note: 'Transparent Air TA-14 institutional governance architecture.',
  },
  {
    label: 'Registry identifier',
    value: 'TA-14-AIGR-0001',
    note: 'Permanent founding architecture record.',
  },
  {
    label: 'Record class',
    value: 'Founding Architecture Record',
    note: 'System-seeded, public, versioned, and challengeable.',
  },
  {
    label: 'Current version',
    value: '1.0',
    note: 'The active version represented by this page.',
  },
  {
    label: 'Effective date',
    value: 'July 22, 2026',
    note: 'The effective date for this Registry identity record.',
  },
  {
    label: 'Claimed establishment date',
    value: 'May 1, 2025',
    note: 'Subject to chronology evidence, dispute, correction, and supersession.',
  },
  {
    label: 'Founder',
    value: 'Greggory Don Butler',
    note: 'Declared founder and originating institutional steward.',
  },
  {
    label: 'Institutional steward',
    value: 'TA-14 Authority Governance Institution',
    note: 'Steward of the Foundation, Exchange, Registry, Academy, and related systems.',
  },
  {
    label: 'Primary governance category',
    value: 'Admissible Execution Governance',
    note: 'Architecture for preserving evidence-bound routes from reality to outcome.',
  },
  {
    label: 'Visibility',
    value: 'Public',
    note: 'The identity record is intended for permanent public access.',
  },
  {
    label: 'Status',
    value: 'Active',
    note: 'The record remains active unless archived, superseded, disputed, or withdrawn.',
  },
];

const statusDefinitions = [
  {
    name: 'ACTIVE',
    description:
      'The architecture is represented as current and institutionally maintained.',
  },
  {
    name: 'ARCHIVED',
    description:
      'The record remains preserved but is no longer represented as current.',
  },
  {
    name: 'SUPERSEDED',
    description:
      'A newer version or replacement record has become the controlling public representation.',
  },
  {
    name: 'DISPUTED',
    description:
      'A material challenge concerning attribution, chronology, claims, or identity remains unresolved.',
  },
  {
    name: 'WITHDRAWN',
    description:
      'The claimant or steward has formally withdrawn the record from active representation.',
  },
];

const namingRules = [
  'The prefix must be written as TA-14.',
  'The number must not appear alone when referring to the architecture.',
  'The official platform name is TA-14 AI Governance Exchange.',
  'The official Registry name is TA-14 AI Governance Registry.',
  'The parent architecture name is TA-14 Admissible Execution Architecture.',
  'Domain architectures must declare their relationship to the parent architecture.',
];

export default function GovernanceIdentityPage() {
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
            <strong>Governance Identity</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Governance identity navigation">
          <a href="#identity">Identity</a>
          <a href="#naming">Naming</a>
          <a href="#status">Status</a>
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
          <span>GOVERNANCE IDENTITY</span>
          <span>ACTIVE</span>
          <span>PUBLIC</span>
        </div>

        <p className="eyebrow">PERMANENT IDENTITY RECORD</p>

        <h1>
          Governance Identity of the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This record preserves the official name, short name, Registry
          identifier, founder, institutional steward, category, version,
          claimed establishment date, visibility, and status of TA-14.
        </p>

        <div className="hero-actions">
          <a href="#identity" className="button button-primary">
            Open Identity Record
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/founding-declaration"
            className="button button-secondary"
          >
            Founding Declaration
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="identity-notice">
          <strong>Identity preservation is not identity adjudication.</strong>
          <p>
            The Registry records what the claimant and steward call the
            architecture and how it is publicly represented. It does not decide
            trademark priority, exclusive ownership, legal validity, or the
            absence of competing claims.
          </p>
        </div>
      </section>

      <section id="identity" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">CANONICAL IDENTITY FIELDS</p>
          <h2>The architecture must remain attributable, versioned, and unmistakably named.</h2>
          <p>
            These fields form the minimum public identity record for the
            founding architecture behind the TA-14 institutional ecosystem.
          </p>
        </div>

        <div className="identity-grid">
          {identityFields.map((field, index) => (
            <article key={field.label}>
              <div className="field-topline">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <small>{field.label}</small>
              </div>
              <strong>{field.value}</strong>
              <p>{field.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="naming" className="section shell naming-section">
        <div className="section-heading">
          <p className="eyebrow">CANONICAL NAMING RULES</p>
          <h2>The name is part of the record, not decorative branding.</h2>
          <p>
            Consistent naming protects chronology, attribution, searchability,
            version continuity, and the public relationship between the parent
            architecture and its institutional surfaces.
          </p>
        </div>

        <div className="naming-layout">
          <article className="official-name">
            <p>OFFICIAL PARENT ARCHITECTURE NAME</p>
            <h3>TA-14 Admissible Execution Architecture</h3>
            <span>
              Use this name when referring to the complete parent governance
              architecture.
            </span>
          </article>

          <article className="rules-card">
            <p>NAMING CONTROLS</p>
            <ul>
              {namingRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="status" className="section shell status-section">
        <div className="section-heading">
          <p className="eyebrow">STATUS MODEL</p>
          <h2>The identity record must show whether it is current, preserved, disputed, or replaced.</h2>
          <p>
            Status is a declared condition of the record. It does not erase the
            prior history or prevent the Registry from preserving later
            corrections and competing assertions.
          </p>
        </div>

        <div className="status-grid">
          {statusDefinitions.map((status) => (
            <article key={status.name}>
              <strong>{status.name}</strong>
              <p>{status.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="boundary" className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">IDENTITY BOUNDARY</p>
          <h2>What this governance identity record establishes—and what it does not.</h2>

          <div className="boundary-columns">
            <div>
              <h3>This record establishes</h3>
              <ul>
                <li>The name under which the architecture is publicly registered.</li>
                <li>The declared founder and institutional steward.</li>
                <li>The version, date, visibility, status, and record class.</li>
                <li>The relationship between the parent architecture and TA-14 institutions.</li>
                <li>The canonical spelling and naming controls used by the Registry.</li>
                <li>The public pathway for later correction, dispute, and supersession.</li>
              </ul>
            </div>

            <div>
              <h3>This record does not establish</h3>
              <ul>
                <li>Trademark registration or exclusive naming rights.</li>
                <li>Legal ownership priority over any competing architecture.</li>
                <li>Regulatory approval or standards conformity.</li>
                <li>Technical effectiveness or implementation fidelity.</li>
                <li>Certification, endorsement, accreditation, or legal compliance.</li>
                <li>The absence of earlier, parallel, or conflicting claims.</li>
              </ul>
            </div>
          </div>

          <div className="boundary-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-primary"
            >
              Submit an Identity Challenge
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/claims-and-boundaries"
              className="button button-secondary"
            >
              Open Claims and Non-Claims
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Governance Identity</strong>
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

        .identity-notice {
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

        .identity-notice strong {
          display: block;
          color: #ffe0a5;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
        }

        .identity-notice p {
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

        .identity-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .identity-grid article {
          min-height: 240px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.88),
            rgba(4, 15, 26, 0.92)
          );
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .field-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .field-topline span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .field-topline small {
          color: #89a5ba;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: right;
          text-transform: uppercase;
        }

        .identity-grid strong {
          display: block;
          margin-top: 40px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
          line-height: 1.2;
        }

        .identity-grid p {
          margin: 12px 0 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.68;
        }

        .naming-section,
        .status-section,
        .boundary-section {
          padding-top: 60px;
        }

        .naming-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
        }

        .official-name,
        .rules-card {
          padding: 32px;
          border-radius: 23px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.84);
        }

        .official-name {
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(109, 216, 255, 0.15),
              transparent 34%
            ),
            linear-gradient(
              155deg,
              rgba(12, 37, 57, 0.94),
              rgba(4, 15, 26, 0.95)
            );
        }

        .official-name > p,
        .rules-card > p {
          margin: 0;
          color: var(--gold);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .official-name h3 {
          max-width: 640px;
          margin: 56px 0 18px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.035em;
        }

        .official-name span {
          color: #aab9c6;
          font-size: 14px;
          line-height: 1.7;
        }

        .rules-card ul {
          margin: 28px 0 0;
          padding-left: 20px;
          color: #aebdca;
        }

        .rules-card li {
          margin: 13px 0;
          font-size: 13px;
          line-height: 1.65;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .status-grid article {
          min-height: 190px;
          padding: 22px;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.82);
        }

        .status-grid strong {
          color: var(--blue);
          font-size: 11px;
          letter-spacing: 0.13em;
        }

        .status-grid p {
          margin: 30px 0 0;
          color: #a7b7c5;
          font-size: 12px;
          line-height: 1.62;
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

          .identity-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .status-grid {
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

          .identity-grid,
          .naming-layout,
          .status-grid,
          .boundary-columns {
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
