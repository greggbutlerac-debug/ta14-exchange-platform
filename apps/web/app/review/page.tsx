'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';

type ReviewLane = {
  id: string;
  title: string;
  price: string;
  timing: string;
  description: string;
  includes: string[];
};

const reviewLanes: ReviewLane[] = [
  {
    id: 'reviewability',
    title: 'Reviewability Check',
    price: '$49',
    timing: 'Initial screening',
    description:
      'A fast first-pass assessment of whether your route, evidence, and execution artifacts are structured well enough for meaningful TA-14 review.',
    includes: [
      'Route visibility check',
      'Evidence and continuity scan',
      'Initial missing-artifact findings',
      'Credit toward API Readiness Check',
    ],
  },
  {
    id: 'api-readiness',
    title: 'API Readiness Check',
    price: '$250',
    timing: 'Technical intake',
    description:
      'A structured review of whether an API, agent, workflow, or execution surface can expose the evidence and control points required for admissibility governance.',
    includes: [
      'Execution boundary mapping',
      'Identity and authority review',
      'Evidence interface requirements',
      'Integration findings and next steps',
    ],
  },
  {
    id: 'evidence-review',
    title: 'Evidence Integrity Review',
    price: 'From $450',
    timing: 'Scoped review',
    description:
      'A deeper review of provenance, continuity, completeness, contradiction handling, binding, and preserved execution artifacts.',
    includes: [
      'Evidence-chain analysis',
      'Continuity and provenance findings',
      'Binding and correspondence review',
      'Written TA-14 findings brief',
    ],
  },
  {
    id: 'runtime-readiness',
    title: 'Runtime Readiness Review',
    price: 'From $1,000',
    timing: 'Advanced scope',
    description:
      'A route-level review for systems preparing to govern consequence through ALLOW, HOLD, DENY, and ESCALATE states.',
    includes: [
      '24-link gate mapping',
      'Commit and execution correspondence',
      'Receipt and replay requirements',
      'Runtime implementation roadmap',
    ],
  },
];

const sectors = [
  'AI governance',
  'Financial execution',
  'Healthcare and clinical systems',
  'Building and environmental systems',
  'Critical infrastructure',
  'Public-sector decision systems',
  'Education and workforce systems',
  'Other consequential execution',
];

export default function ReviewPage() {
  const [selectedLane, setSelectedLane] = useState(reviewLanes[1].id);
  const [submitted, setSubmitted] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState(sectors[0]);
  const [summary, setSummary] = useState('');
  const [evidence, setEvidence] = useState('');

  const lane = useMemo(
    () => reviewLanes.find((item) => item.id === selectedLane) ?? reviewLanes[0],
    [selectedLane],
  );

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #02050a;
          --panel: rgba(8, 17, 29, 0.8);
          --line: rgba(126, 180, 230, 0.16);
          --text: #f4f8ff;
          --muted: #91a5ba;
          --cyan: #57e6ff;
          --blue: #319cff;
          --green: #38f2a2;
          --gold: #ffd36b;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          color: var(--text);
          background:
            radial-gradient(circle at 14% 0%, rgba(49,156,255,0.16), transparent 30%),
            radial-gradient(circle at 88% 18%, rgba(56,242,162,0.08), transparent 28%),
            linear-gradient(180deg, #02050a 0%, #07111d 50%, #02050a 100%);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        .review-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .review-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.2;
          background-image:
            linear-gradient(rgba(255,255,255,0.024) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.024) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: linear-gradient(to bottom, black, transparent 95%);
        }

        .shell {
          width: min(1240px, 92vw);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid var(--line);
          background: rgba(3, 8, 15, 0.82);
          backdrop-filter: blur(20px);
        }

        .topbar-inner {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--cyan);
          border: 1px solid rgba(87,230,255,0.38);
          background: linear-gradient(145deg, rgba(49,156,255,0.18), rgba(56,242,162,0.06));
          box-shadow: 0 0 28px rgba(87,230,255,0.16);
        }

        .top-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .top-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
        }

        .top-links a:hover {
          color: white;
        }

        .hero {
          padding: 88px 0 54px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 36px;
          align-items: end;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 14px 0 20px;
          max-width: 920px;
          font-size: clamp(56px, 7.2vw, 98px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .gradient {
          color: transparent;
          background: linear-gradient(90deg, white, var(--cyan), var(--green));
          background-clip: text;
          -webkit-background-clip: text;
        }

        .hero p {
          max-width: 820px;
          margin: 0;
          color: #b2c2d4;
          font-size: 19px;
          line-height: 1.72;
        }

        .hero-note {
          min-width: 250px;
          padding: 18px;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.025);
        }

        .hero-note span {
          display: block;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hero-note strong {
          display: block;
          margin-top: 8px;
          line-height: 1.45;
        }

        .lanes {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .lane-card {
          min-height: 260px;
          padding: 22px;
          color: white;
          text-align: left;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: var(--panel);
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .lane-card:hover {
          transform: translateY(-4px);
          border-color: rgba(87,230,255,0.25);
        }

        .lane-card.active {
          border-color: rgba(87,230,255,0.38);
          background: linear-gradient(145deg, rgba(49,156,255,0.12), rgba(56,242,162,0.045));
          box-shadow: 0 22px 60px rgba(0,0,0,0.22);
        }

        .lane-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .lane-card code {
          color: var(--cyan);
          font-size: 10px;
          letter-spacing: 0.08em;
        }

        .lane-card h2 {
          margin: 14px 0 10px;
          font-size: 21px;
          letter-spacing: -0.025em;
        }

        .lane-card p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .price {
          flex: 0 0 auto;
          color: var(--green);
          font-weight: 950;
          font-size: 17px;
        }

        .timing {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 9px;
          border-radius: 999px;
          color: var(--gold);
          border: 1px solid rgba(255,211,107,0.26);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .workspace {
          display: grid;
          grid-template-columns: 0.72fr 1.28fr;
          gap: 20px;
          padding-bottom: 90px;
        }

        .panel {
          border: 1px solid var(--line);
          border-radius: 24px;
          background: var(--panel);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 70px rgba(0,0,0,0.22);
        }

        .scope-panel {
          padding: 28px;
        }

        .panel-label {
          color: var(--muted);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .scope-panel h2,
        .form-panel h2 {
          margin: 10px 0 12px;
          font-size: 30px;
          letter-spacing: -0.035em;
        }

        .scope-panel > p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .scope-list {
          margin: 24px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 12px;
        }

        .scope-list li {
          padding: 14px 14px 14px 42px;
          position: relative;
          border-radius: 14px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.024);
          color: #d7e3ef;
          line-height: 1.5;
          font-size: 14px;
        }

        .scope-list li::before {
          content: "✓";
          position: absolute;
          left: 15px;
          top: 13px;
          color: var(--green);
          font-weight: 950;
        }

        .boundary {
          margin-top: 22px;
          padding: 17px;
          border-radius: 16px;
          border: 1px solid rgba(255,211,107,0.23);
          background: rgba(255,211,107,0.05);
        }

        .boundary strong {
          display: block;
          color: var(--gold);
          margin-bottom: 7px;
        }

        .boundary span {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .form-panel {
          padding: 30px;
        }

        .form-intro {
          margin: 0 0 24px;
          color: var(--muted);
          line-height: 1.7;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .field-group {
          display: grid;
          gap: 8px;
        }

        .field-group.full {
          grid-column: 1 / -1;
        }

        .field-group label {
          color: #dbe6f1;
          font-size: 12px;
          font-weight: 800;
        }

        .field {
          width: 100%;
          min-height: 48px;
          padding: 0 14px;
          border-radius: 13px;
          border: 1px solid var(--line);
          color: white;
          background: rgba(255,255,255,0.03);
          outline: none;
        }

        textarea.field {
          min-height: 120px;
          resize: vertical;
          padding-top: 13px;
          padding-bottom: 13px;
        }

        .field:focus {
          border-color: rgba(87,230,255,0.38);
          box-shadow: 0 0 0 3px rgba(87,230,255,0.08);
        }

        .submit {
          margin-top: 18px;
          width: 100%;
          min-height: 52px;
          border: 0;
          border-radius: 15px;
          color: #03110b;
          font-weight: 950;
          cursor: pointer;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 34px rgba(87,230,255,0.18);
          transition: transform 180ms ease;
        }

        .submit:hover {
          transform: translateY(-2px);
        }

        .privacy {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.55;
        }

        .success {
          padding: 38px;
          text-align: center;
        }

        .success-mark {
          width: 72px;
          height: 72px;
          margin: 0 auto 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #03110b;
          background: var(--green);
          font-size: 30px;
          font-weight: 950;
          box-shadow: 0 0 40px rgba(56,242,162,0.28);
        }

        .success h2 {
          margin: 0 0 12px;
          font-size: 36px;
        }

        .success p {
          max-width: 620px;
          margin: 0 auto;
          color: var(--muted);
          line-height: 1.7;
        }

        .success-actions {
          margin-top: 24px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primary,
        .secondary {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          text-decoration: none;
          font-weight: 900;
        }

        .primary {
          color: #03110b;
          background: linear-gradient(90deg, var(--cyan), var(--green));
        }

        .secondary {
          color: white;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.03);
        }

        @media (max-width: 1080px) {
          .lanes {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero,
          .workspace {
            grid-template-columns: 1fr;
          }

          .hero-note {
            min-width: 0;
          }
        }

        @media (max-width: 720px) {
          .top-links a:not(:last-child) {
            display: none;
          }

          .hero {
            padding-top: 60px;
          }

          h1 {
            font-size: 52px;
          }

          .lanes,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .field-group.full {
            grid-column: auto;
          }

          .scope-panel,
          .form-panel {
            padding: 22px;
          }
        }
      `}</style>

      <div className="review-page">
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 GOVERNANCE REVIEW DESK</span>
            </Link>

            <nav className="top-links">
              <Link href="/architecture">Architecture</Link>
              <Link href="/runtime">Runtime Gate</Link>
              <Link href="/records">Records</Link>
              <Link href="/">Exchange</Link>
            </nav>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <div>
              <div className="eyebrow">Request a TA-14 review</div>
              <h1>
                Bring the route.
                <br />
                <span className="gradient">We review the legitimacy.</span>
              </h1>
              <p>
                Submit an AI, operational, financial, environmental, clinical,
                infrastructure, or public-sector execution route for structured
                review under the TA-14 Admissible Execution Architecture.
              </p>
            </div>

            <div className="hero-note">
              <span>Governing principle</span>
              <strong>No admissible evidence. No admissible execution.</strong>
            </div>
          </section>

          <section className="lanes">
            {reviewLanes.map((item) => (
              <button
                className={`lane-card ${selectedLane === item.id ? 'active' : ''}`}
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedLane(item.id);
                  setSubmitted(false);
                }}
              >
                <div className="lane-top">
                  <code>{item.id.toUpperCase()}</code>
                  <span className="price">{item.price}</span>
                </div>

                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span className="timing">{item.timing}</span>
              </button>
            ))}
          </section>

          <section className="workspace">
            <aside className="panel scope-panel">
              <div className="panel-label">Selected review lane</div>
              <h2>{lane.title}</h2>
              <p>{lane.description}</p>

              <ul className="scope-list">
                {lane.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="boundary">
                <strong>Review independence</strong>
                <span>
                  Payment purchases review effort, not a favorable result. TA-14
                  findings, route states, and governing thresholds are not altered
                  to produce ALLOW.
                </span>
              </div>
            </aside>

            <section className="panel form-panel">
              {submitted ? (
                <div className="success">
                  <div className="success-mark">✓</div>
                  <h2>Review request prepared.</h2>
                  <p>
                    Your {lane.title} intake has been structured for submission.
                    The next production step will connect this form to the secure
                    intake endpoint and confirmation workflow.
                  </p>

                  <div className="success-actions">
                    <button
                      className="primary"
                      type="button"
                      onClick={() => setSubmitted(false)}
                    >
                      Edit Request
                    </button>

                    <a
                      className="secondary"
                      href="mailto:ta14admissibleexecution@gmail.com"
                    >
                      Send by Email
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="panel-label">Structured intake</div>
                  <h2>Describe the execution route</h2>
                  <p className="form-intro">
                    Provide enough detail to identify the actor, authority,
                    evidence, proposed consequence, and current execution boundary.
                  </p>

                  <form onSubmit={submitRequest}>
                    <div className="form-grid">
                      <div className="field-group">
                        <label htmlFor="route-name">Route or project name</label>
                        <input
                          id="route-name"
                          className="field"
                          value={routeName}
                          onChange={(event) => setRouteName(event.target.value)}
                          placeholder="Example: Supplier payment approval route"
                          required
                        />
                      </div>

                      <div className="field-group">
                        <label htmlFor="organization">Organization</label>
                        <input
                          id="organization"
                          className="field"
                          value={organization}
                          onChange={(event) => setOrganization(event.target.value)}
                          placeholder="Organization name"
                          required
                        />
                      </div>

                      <div className="field-group">
                        <label htmlFor="email">Contact email</label>
                        <input
                          id="email"
                          className="field"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="name@organization.com"
                          required
                        />
                      </div>

                      <div className="field-group">
                        <label htmlFor="sector">Execution sector</label>
                        <select
                          id="sector"
                          className="field"
                          value={sector}
                          onChange={(event) => setSector(event.target.value)}
                        >
                          {sectors.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field-group full">
                        <label htmlFor="summary">
                          What consequence can this route create?
                        </label>
                        <textarea
                          id="summary"
                          className="field"
                          value={summary}
                          onChange={(event) => setSummary(event.target.value)}
                          placeholder="Describe the action, decision, transaction, intervention, or outcome the route may create."
                          required
                        />
                      </div>

                      <div className="field-group full">
                        <label htmlFor="evidence">
                          What evidence and execution artifacts currently exist?
                        </label>
                        <textarea
                          id="evidence"
                          className="field"
                          value={evidence}
                          onChange={(event) => setEvidence(event.target.value)}
                          placeholder="List records, logs, policies, receipts, model outputs, signatures, manifests, screenshots, APIs, or replay artifacts."
                          required
                        />
                      </div>
                    </div>

                    <button className="submit" type="submit">
                      Prepare {lane.title} Request
                    </button>

                    <p className="privacy">
                      This current page is a frontend intake experience. It does
                      not yet transmit or store submitted information until the
                      production intake endpoint is connected.
                    </p>
                  </form>
                </>
              )}
            </section>
          </section>
        </main>
      </div>
    </>
  );
}
