'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type BillingMode = 'one-time' | 'enterprise';

type Offer = {
  name: string;
  price: string;
  enterprisePrice?: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const offers: Offer[] = [
  {
    name: 'Sandbox',
    price: 'Free',
    description:
      'Explore the TA-14 route model, test decision states, and inspect demonstration records before beginning a formal review.',
    features: [
      'Interactive runtime demonstration',
      'ALLOW / HOLD / DENY / ESCALATE simulation',
      'Demonstration execution records',
      'Public architecture access',
    ],
    cta: 'Open Sandbox',
    href: '/runtime',
  },
  {
    name: 'Reviewability Check',
    price: '$49',
    badge: 'Fastest entry point',
    description:
      'A focused first-pass assessment of whether your route and evidence are structured well enough for meaningful review.',
    features: [
      'Route visibility screening',
      'Evidence and continuity scan',
      'Initial missing-artifact findings',
      '$49 credited toward API Readiness',
    ],
    cta: 'Request Reviewability Check',
    href: '/review',
  },
  {
    name: 'API Readiness Check',
    price: '$250',
    badge: 'Most popular',
    description:
      'A structured technical review for APIs, agents, workflows, and execution surfaces preparing for admissibility governance.',
    features: [
      'Identity and authority mapping',
      'Evidence interface requirements',
      'Execution boundary review',
      'Integration findings and next steps',
    ],
    cta: 'Start API Readiness',
    href: '/review',
    highlighted: true,
  },
  {
    name: 'Evidence Integrity Review',
    price: 'From $450',
    enterprisePrice: 'Custom scope',
    description:
      'A deeper analysis of provenance, continuity, completeness, contradiction handling, binding, and preserved artifacts.',
    features: [
      'Evidence-chain analysis',
      'Provenance and continuity findings',
      'Binding and correspondence review',
      'Written TA-14 findings brief',
    ],
    cta: 'Request Evidence Review',
    href: '/review',
  },
  {
    name: 'Runtime Readiness Review',
    price: 'From $1,000',
    enterprisePrice: 'Custom scope',
    description:
      'A route-level review for systems preparing to govern consequence through the full 24-link execution gate.',
    features: [
      '24-link gate mapping',
      'Commit and execution correspondence',
      'Receipt and replay requirements',
      'Implementation roadmap',
    ],
    cta: 'Request Runtime Review',
    href: '/review',
  },
  {
    name: 'Enterprise Governance Program',
    price: 'Custom',
    enterprisePrice: '$25k–$75k+ pilots',
    description:
      'For organizations that need sustained route governance, system integration, evidence architecture, and institutional deployment.',
    features: [
      'Multi-route governance program',
      'Architecture and integration support',
      'Pilot or enterprise deployment',
      'Independent review and replay design',
    ],
    cta: 'Contact Governance Desk',
    href: 'mailto:ta14admissibleexecution@gmail.com',
  },
];

const comparisons = [
  {
    feature: 'Public architecture access',
    sandbox: true,
    reviewability: true,
    api: true,
    evidence: true,
    runtime: true,
  },
  {
    feature: 'Interactive route simulation',
    sandbox: true,
    reviewability: true,
    api: true,
    evidence: true,
    runtime: true,
  },
  {
    feature: 'Written TA-14 findings',
    sandbox: false,
    reviewability: true,
    api: true,
    evidence: true,
    runtime: true,
  },
  {
    feature: 'Evidence continuity analysis',
    sandbox: false,
    reviewability: 'Initial',
    api: 'Scoped',
    evidence: true,
    runtime: true,
  },
  {
    feature: 'API and agent boundary mapping',
    sandbox: false,
    reviewability: false,
    api: true,
    evidence: 'Optional',
    runtime: true,
  },
  {
    feature: '24-link runtime gate mapping',
    sandbox: 'Demo',
    reviewability: false,
    api: 'Initial',
    evidence: 'Optional',
    runtime: true,
  },
  {
    feature: 'Replay and receipt design',
    sandbox: false,
    reviewability: false,
    api: 'Initial',
    evidence: 'Scoped',
    runtime: true,
  },
  {
    feature: 'Enterprise implementation roadmap',
    sandbox: false,
    reviewability: false,
    api: false,
    evidence: false,
    runtime: true,
  },
];

function renderValue(value: boolean | string) {
  if (value === true) return <span className="yes">✓</span>;
  if (value === false) return <span className="no">—</span>;
  return <span className="partial">{value}</span>;
}

export default function PricingPage() {
  const [billingMode, setBillingMode] = useState<BillingMode>('one-time');

  const displayedOffers = useMemo(
    () =>
      offers.map((offer) => ({
        ...offer,
        displayPrice:
          billingMode === 'enterprise' && offer.enterprisePrice
            ? offer.enterprisePrice
            : offer.price,
      })),
    [billingMode],
  );

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

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

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

        button { font: inherit; }

        .pricing-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .pricing-page::before {
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
          width: min(1260px, 92vw);
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

        .top-links a:hover { color: white; }

        .hero {
          padding: 88px 0 52px;
          text-align: center;
        }

        .eyebrow {
          color: var(--cyan);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h1 {
          margin: 14px auto 20px;
          max-width: 980px;
          font-size: clamp(56px, 7vw, 96px);
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
          margin: 0 auto;
          color: #b2c2d4;
          font-size: 19px;
          line-height: 1.72;
        }

        .mode-switch {
          width: fit-content;
          margin: 28px auto 0;
          padding: 5px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 15px;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.03);
        }

        .mode-switch button {
          min-height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          color: var(--muted);
          background: transparent;
          cursor: pointer;
          font-weight: 850;
        }

        .mode-switch button.active {
          color: #03110b;
          background: linear-gradient(90deg, var(--cyan), var(--green));
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 84px;
        }

        .offer {
          min-height: 520px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          border-radius: 24px;
          border: 1px solid var(--line);
          background: var(--panel);
          box-shadow: 0 24px 70px rgba(0,0,0,0.2);
        }

        .offer.highlighted {
          border-color: rgba(87,230,255,0.38);
          background:
            radial-gradient(circle at 88% 5%, rgba(87,230,255,0.14), transparent 26%),
            linear-gradient(145deg, rgba(49,156,255,0.13), rgba(56,242,162,0.04));
          transform: translateY(-6px);
        }

        .badge {
          width: fit-content;
          margin-bottom: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: var(--gold);
          border: 1px solid rgba(255,211,107,0.26);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .offer h2 {
          margin: 0 0 8px;
          font-size: 25px;
          letter-spacing: -0.035em;
        }

        .price {
          margin: 8px 0 14px;
          color: var(--green);
          font-size: 34px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .offer > p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
          font-size: 14px;
        }

        .features {
          margin: 24px 0 26px;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 11px;
        }

        .features li {
          position: relative;
          padding-left: 25px;
          color: #d8e4ef;
          font-size: 14px;
          line-height: 1.5;
        }

        .features li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--green);
          font-weight: 950;
        }

        .cta {
          margin-top: auto;
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
          color: white;
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.035);
        }

        .highlighted .cta {
          color: #03110b;
          border: 0;
          background: linear-gradient(90deg, var(--cyan), var(--green));
          box-shadow: 0 0 34px rgba(87,230,255,0.18);
        }

        .comparison {
          margin-bottom: 84px;
        }

        .section-heading {
          max-width: 820px;
          margin-bottom: 26px;
        }

        .section-heading h2 {
          margin: 10px 0 12px;
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .section-heading p {
          margin: 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.7;
        }

        .table-wrap {
          overflow-x: auto;
          border-radius: 22px;
          border: 1px solid var(--line);
          background: var(--panel);
        }

        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 17px;
          text-align: center;
          border-bottom: 1px solid var(--line);
        }

        th:first-child,
        td:first-child {
          text-align: left;
        }

        th {
          color: white;
          font-size: 13px;
          background: rgba(255,255,255,0.03);
        }

        td {
          color: var(--muted);
          font-size: 13px;
        }

        tr:last-child td {
          border-bottom: 0;
        }

        .yes {
          color: var(--green);
          font-weight: 950;
        }

        .no {
          color: #53677b;
        }

        .partial {
          color: var(--gold);
          font-weight: 800;
        }

        .principle {
          margin-bottom: 90px;
          padding: 42px;
          border-radius: 28px;
          border: 1px solid rgba(87,230,255,0.24);
          background:
            linear-gradient(135deg, rgba(49,156,255,0.1), rgba(56,242,162,0.05), rgba(255,211,107,0.04));
        }

        .principle h2 {
          margin: 10px 0 14px;
          font-size: clamp(36px, 5vw, 60px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .principle p {
          max-width: 900px;
          margin: 0;
          color: #b5c5d6;
          font-size: 18px;
          line-height: 1.72;
        }

        .principle-actions {
          margin-top: 24px;
          display: flex;
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

        @media (max-width: 1040px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 720px) {
          .top-links a:not(:last-child) { display: none; }

          .hero { padding-top: 60px; }

          h1 { font-size: 52px; }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .offer.highlighted {
            transform: none;
          }

          .principle {
            padding: 28px;
          }
        }
      `}</style>

      <div className="pricing-page">
        <header className="topbar">
          <div className="shell topbar-inner">
            <Link className="brand" href="/">
              <span className="brand-mark">14</span>
              <span>TA-14 PRICING</span>
            </Link>

            <nav className="top-links">
              <Link href="/architecture">Architecture</Link>
              <Link href="/runtime">Runtime Gate</Link>
              <Link href="/records">Records</Link>
              <Link href="/review">Request Review</Link>
            </nav>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <div className="eyebrow">Transparent review pathways</div>

            <h1>
              Pay for the review.
              <br />
              <span className="gradient">Never for the outcome.</span>
            </h1>

            <p>
              TA-14 pricing is structured around review effort, evidence depth,
              execution complexity, and implementation scope. Payment never
              purchases ALLOW, removes a finding, or weakens a governing threshold.
            </p>

            <div className="mode-switch" aria-label="Pricing mode">
              <button
                className={billingMode === 'one-time' ? 'active' : ''}
                type="button"
                onClick={() => setBillingMode('one-time')}
              >
                Review pricing
              </button>

              <button
                className={billingMode === 'enterprise' ? 'active' : ''}
                type="button"
                onClick={() => setBillingMode('enterprise')}
              >
                Enterprise scope
              </button>
            </div>
          </section>

          <section className="pricing-grid">
            {displayedOffers.map((offer) => (
              <article
                className={`offer ${offer.highlighted ? 'highlighted' : ''}`}
                key={offer.name}
              >
                {offer.badge && <span className="badge">{offer.badge}</span>}

                <h2>{offer.name}</h2>
                <div className="price">{offer.displayPrice}</div>
                <p>{offer.description}</p>

                <ul className="features">
                  {offer.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <Link className="cta" href={offer.href}>
                  {offer.cta}
                </Link>
              </article>
            ))}
          </section>

          <section className="comparison">
            <div className="section-heading">
              <div className="eyebrow">Compare review depth</div>
              <h2>Choose the scope that matches the consequence.</h2>
              <p>
                Start small when the route is still forming. Move into deeper
                evidence and runtime review as the system approaches real execution.
              </p>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Capability</th>
                    <th>Sandbox</th>
                    <th>Reviewability</th>
                    <th>API Readiness</th>
                    <th>Evidence Review</th>
                    <th>Runtime Review</th>
                  </tr>
                </thead>

                <tbody>
                  {comparisons.map((row) => (
                    <tr key={row.feature}>
                      <td>{row.feature}</td>
                      <td>{renderValue(row.sandbox)}</td>
                      <td>{renderValue(row.reviewability)}</td>
                      <td>{renderValue(row.api)}</td>
                      <td>{renderValue(row.evidence)}</td>
                      <td>{renderValue(row.runtime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="principle">
            <div className="eyebrow">Independent review boundary</div>
            <h2>No favorable result can be purchased.</h2>
            <p>
              TA-14 review fees compensate the work required to examine the route,
              evidence, authority, continuity, binding, commit, execution, and
              outcome. The resulting findings remain independent of commercial
              preference.
            </p>

            <div className="principle-actions">
              <Link className="primary" href="/review">
                Request a Review
              </Link>

              <a
                className="secondary"
                href="mailto:ta14admissibleexecution@gmail.com"
              >
                Discuss Enterprise Scope
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
