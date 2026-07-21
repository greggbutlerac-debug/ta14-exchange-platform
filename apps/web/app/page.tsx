/* apps/web/app/page.tsx */
"use client";

import Link from "next/link";
import { useState } from "react";

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

type Door = {
  number: string;
  badge: string;
  title: string;
  statement: string;
  description: string;
  href: string;
  action: string;
  marketplaceLabel: string;
  attributes: string[];
  links: Array<{
    label: string;
    href: string;
    kind?: "special";
  }>;
};

const doors: Door[] = [
  {
    number: "01",
    badge: "AI",
    title: "AI Governance Store",
    statement: "Build, test, register, study, and strengthen AI governance.",
    description:
      "Enter the operating side of the Exchange for consequential AI systems, agents, architectures, routes, governance tools, laboratories, education, and implementation support.",
    href: "/workspace/ai-governance",
    action: "Enter AI Governance",
    marketplaceLabel: "AI Governance Marketplace",
    attributes: [
      "Free governance playground",
      "Route construction and testing",
      "Runtime evaluation",
      "AI governance architectures",
      "Governance education",
      "Specialized laboratories",
    ],
    links: [
      { label: "Open Playground", href: "/workspace/ai-governance" },
      { label: "Build a Route", href: "/workspace/build" },
      { label: "Browse AI Governance Registry", href: "/ai-governance-registry" },
      { label: "Explore EU AI Act", href: "/eu-ai-act", kind: "special" },
    ],
  },
  {
    number: "02",
    badge: "GR",
    title: "Governed Records",
    statement: "Preserve what happened, why it happened, and what the record can prove.",
    description:
      "Create, interpret, verify, compare, and preserve records that keep identity, chronology, evidence, authority, boundaries, determinations, execution, and outcomes visible.",
    href: "/workspace/governed-records",
    action: "Enter Governed Records",
    marketplaceLabel: "Governed Records Marketplace",
    attributes: [
      "Governed record creation",
      "Evidence and chronology preservation",
      "Version continuity",
      "Bounded interpretation",
      "Verification and replay",
      "Outcome records",
    ],
    links: [
      { label: "Create a Record", href: "/workspace/governed-records/build" },
      { label: "Open Record Interpreter", href: "/workspace/governed-records" },
      { label: "Verify a Record", href: "/verification" },
      { label: "EU AI Act Evidence Records", href: "/eu-ai-act", kind: "special" },
    ],
  },
  {
    number: "03",
    badge: "ER",
    title: "Environmental Records",
    statement: "Turn land, water, air, building, and atmospheric evidence into governed records.",
    description:
      "Bring environmental reality into a record system that separates observation from interpretation, diagnosis, optimization, intervention, and verified outcome.",
    href: "/workspace/environmental-records",
    action: "Enter Environmental Records",
    marketplaceLabel: "Environmental Records Marketplace",
    attributes: [
      "Atmospheric Integrity Records",
      "Personal and building records",
      "Land, water, and air evidence",
      "HVAC and IAQ records",
      "Hospital and laboratory records",
      "Baseline, drift, and restoration",
    ],
    links: [
      { label: "Explore Record Types", href: "/workspace/environmental-records" },
      { label: "Open Environmental Interpreter", href: "/workspace/environmental-records" },
      { label: "View Atmospheric Records", href: "/workspace/environmental-records" },
      { label: "Building and HVAC Evidence", href: "/workspace/environmental-records" },
    ],
  },
  {
    number: "04",
    badge: "◎",
    title: "Entity Review",
    statement: "Examine the entity, not merely the document it presents.",
    description:
      "Submit organizations, AI systems, governance programs, architectures, partners, operational systems, or consequential routes for bounded review across the full evidence chain.",
    href: "/workspace/entity-review",
    action: "Enter Entity Review",
    marketplaceLabel: "Entity Review Marketplace",
    attributes: [
      "Organization and system review",
      "Governance readiness",
      "Evidence-gap analysis",
      "Architectural review",
      "Partner Review Network",
      "Bounded findings and review records",
    ],
    links: [
      { label: "Start Entity Review", href: "/workspace/entity-review" },
      { label: "Find a Reviewer", href: "/marketplace/professionals" },
      {
        label: "Partner Review Network",
        href: "/workspace/entity-review/partner-review-network/pricing",
      },
      { label: "EU AI Act Entity Review", href: "/eu-ai-act", kind: "special" },
    ],
  },
];

const exchangeSteps = [
  ["01", "Choose a door", "Enter the section that matches what you are bringing to the Exchange."],
  ["02", "Declare the object", "Identify the system, record, entity, route, or environmental evidence."],
  ["03", "Build or bring evidence", "Construct a route, upload a record, or assemble a review package."],
  ["04", "Expose the gaps", "Identify missing evidence, stale authority, continuity breaks, and unsupported claims."],
  ["05", "Review and correct", "Repair defects without erasing the original result, uncertainty, or chronology."],
  ["06", "Preserve the outcome", "Create a bounded record that can be inspected, replayed, and verified."],
] as const;

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="page-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="ambient" aria-hidden="true">
        <span className="star-field stars-one" />
        <span className="star-field stars-two" />
        <span className="orbit orbit-one"><i /></span>
        <span className="orbit orbit-two"><i /></span>
        <span className="moving-line line-one" />
        <span className="moving-line line-two" />
        <span className="nova nova-one" />
        <span className="nova nova-two" />
      </div>

      <header className="site-header">
        <Link className="brand" href="/" aria-label="TA-14 AI Governance Exchange home">
          <span className="brand-mark">TA-14</span>
          <span className="brand-copy">
            <strong>TA-14</strong>
            <small>AI GOVERNANCE EXCHANGE</small>
          </span>
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          ☰
        </button>

        <nav className={mobileOpen ? "main-nav open" : "main-nav"}>
          <a href="#doors" onClick={() => setMobileOpen(false)}>Four Doors</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How It Works</a>
          <Link href="/marketplace" onClick={() => setMobileOpen(false)}>Marketplace</Link>
          <Link href="/account" onClick={() => setMobileOpen(false)}>Sign In</Link>
          <Link className="nav-cta" href="/workspace" onClick={() => setMobileOpen(false)}>
            Open Exchange
          </Link>
        </nav>
      </header>

      <section className="hero section-wrap" id="main-content">
        <div className="hero-copy">
          <p className="eyebrow">THE FRONT DOOR TO THE COMPLETE EXCHANGE</p>
          <h1>
            Four doors.
            <span>One governed exchange.</span>
          </h1>
          <p className="hero-lead">
            The TA-14 AI Governance Exchange is where people bring AI governance,
            governed records, environmental records, and entities for building,
            interpretation, testing, preservation, review, marketplace exchange,
            and verification.
          </p>
          <p className="hero-support">
            The homepage explains the institution. Each door takes you into a
            dedicated operating environment with its own tools, records, routes,
            specialists, and bounded outcomes.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#doors">Choose Your Door</a>
            <Link className="button secondary" href="/workspace">Open the Exchange</Link>
            <Link className="button ghost" href="/marketplace">Visit Marketplace</Link>
          </div>
          <div className="trust-row">
            <span>Declaration without certification</span>
            <span>Preservation without ownership</span>
            <span>Review without silent authority transfer</span>
          </div>
        </div>

        <aside className="exchange-compass" aria-label="Exchange overview">
          <div className="compass-core">
            <span>TA-14</span>
            <strong>EXCHANGE</strong>
            <small>Reality to Outcome</small>
          </div>
          <div className="compass-grid">
            {doors.map((door) => (
              <a key={door.title} href={`#door-${door.number}`}>
                <span>{door.badge}</span>
                <div>
                  <strong>{door.title}</strong>
                  <small>{door.statement}</small>
                </div>
                <b>→</b>
              </a>
            ))}
          </div>
          <p>
            The Marketplace connects every door. The AI Governance Registry belongs
            only inside AI Governance.
          </p>
        </aside>
      </section>

      <section className="section-wrap doors-section" id="doors">
        <div className="section-heading">
          <p className="eyebrow">THE FOUR PRIMARY DOORS</p>
          <h2>Choose what you are bringing to the Exchange.</h2>
          <p>
            Each door is represented once. Each card explains its purpose,
            identifies its major capabilities, and provides direct routes into
            the areas that belong inside it.
          </p>
        </div>

        <div className="door-stack">
          {doors.map((door, index) => (
            <article
              className={`door-card door-${index + 1}`}
              id={`door-${door.number}`}
              key={door.title}
            >
              <div className="door-identity">
                <div className="door-number">{door.number}</div>
                <div className="door-emblem">
                  <span>{door.badge}</span>
                  <i />
                </div>
                <div>
                  <p className="door-kicker">PRIMARY EXCHANGE DOOR</p>
                  <h3>{door.title}</h3>
                  <strong>{door.statement}</strong>
                </div>
              </div>

              <div className="door-content">
                <div className="door-explanation">
                  <p>{door.description}</p>
                  <ul>
                    {door.attributes.map((attribute) => (
                      <li key={attribute}>
                        <span>✓</span>
                        {attribute}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="door-actions">
                  <Link className="button primary door-primary" href={door.href}>
                    {door.action}
                    <span>→</span>
                  </Link>

                  <div className="route-buttons">
                    {door.links.map((link) => (
                      <Link
                        key={link.label}
                        className={link.kind === "special" ? "route-chip special" : "route-chip"}
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <Link className="marketplace-button" href="/marketplace">
                    <span>Marketplace</span>
                    <strong>{door.marketplaceLabel}</strong>
                    <b>↗</b>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap marketplace-bridge">
        <div className="marketplace-shell">
          <div>
            <p className="eyebrow">ONE MARKETPLACE ACROSS ALL FOUR DOORS</p>
            <h2>The Marketplace connects needs, systems, records, entities, and specialists.</h2>
            <p>
              Post a governance need, find work, request a governed record, locate
              environmental record capabilities, discover qualified reviewers, or
              browse proven routes without turning the Marketplace into a fifth
              competing front door.
            </p>
          </div>
          <div className="marketplace-actions">
            <Link className="button primary" href="/marketplace">Open Marketplace</Link>
            <Link className="button secondary" href="/marketplace/opportunities">
              Browse Opportunities
            </Link>
            <Link className="button secondary" href="/marketplace/professionals">
              Find Professionals
            </Link>
          </div>
        </div>
      </section>

      <section className="section-wrap how-section" id="how-it-works">
        <div className="section-heading centered">
          <p className="eyebrow">HOW THE EXCHANGE WORKS</p>
          <h2>Explain first. Operate second. Preserve the result.</h2>
          <p>
            The front door helps visitors choose the correct environment. The
            dedicated workspace then carries the actual record, route, review,
            interpretation, correction, and verification process.
          </p>
        </div>

        <div className="steps-grid">
          {exchangeSteps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap chain-section">
        <div className="section-heading centered">
          <p className="eyebrow">ONE CONSTITUTIONAL CHAIN</p>
          <h2>Different doors. The same demand for admissibility.</h2>
          <p>
            Every workspace must keep the underlying route visible from observed
            reality through preserved outcome.
          </p>
        </div>

        <div className="chain-track" aria-label="TA-14 governing chain">
          {chain.map((stage, index) => (
            <div key={stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage}</strong>
              {index < chain.length - 1 ? <i>→</i> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrap boundary-section">
        <div className="boundary-grid">
          <article>
            <p className="eyebrow">THE EXCHANGE DOES</p>
            <h3>Make governance inspectable.</h3>
            <ul>
              <li>Expose evidence and continuity</li>
              <li>Preserve declarations and boundaries</li>
              <li>Separate records from interpretation</li>
              <li>Make review scope visible</li>
              <li>Preserve adverse and uncertain outcomes</li>
            </ul>
          </article>
          <article>
            <p className="eyebrow">THE EXCHANGE DOES NOT</p>
            <h3>Silently manufacture authority.</h3>
            <ul>
              <li>Does not certify every declaration</li>
              <li>Does not transfer ownership through preservation</li>
              <li>Does not merge independent review authorities</li>
              <li>Does not erase chronology when a route is corrected</li>
              <li>Does not turn a score into admissible evidence</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section-wrap final-cta">
        <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
        <h2>No admissible evidence. No admissible execution.</h2>
        <p>
          Choose the door that matches what you are bringing. Enter the operating
          environment. Build, preserve, review, interpret, test, and verify the
          route without allowing one domain to take over the entire Exchange.
        </p>
        <div className="final-actions">
          <a className="button primary" href="#doors">Choose a Door</a>
          <Link className="button secondary" href="/workspace">Open Exchange</Link>
          <Link className="button ghost" href="/marketplace">Visit Marketplace</Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <Link className="brand" href="/">
            <span className="brand-mark">TA-14</span>
            <span className="brand-copy">
              <strong>TA-14</strong>
              <small>AI GOVERNANCE EXCHANGE</small>
            </span>
          </Link>
          <p>Four doors. One governed exchange. One visible chain.</p>
        </div>

        <div>
          <h3>Doors</h3>
          <Link href="/workspace/ai-governance">AI Governance Store</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/environmental-records">Environmental Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </div>

        <div>
          <h3>Shared Routes</h3>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/ai-governance-registry">AI Governance Registry</Link>
          <Link href="/verification">Verification</Link>
          <Link href="/account">Sign In</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <a href="mailto:ta14admissibleexecution@gmail.com">
            ta14admissibleexecution@gmail.com
          </a>
          <a
            href="https://github.com/greggbutlerac-debug/ta14-exchange-platform"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

        <p className="footer-chain">
          Reality → Record → Continuity → Admissibility → Binding → Commit →
          Execution → Outcome
        </p>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f5f8ff;
          background: #050811;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        :global(button) {
          font: inherit;
        }

        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 8% 3%, rgba(45, 107, 255, 0.18), transparent 27%),
            radial-gradient(circle at 90% 4%, rgba(44, 226, 182, 0.12), transparent 23%),
            linear-gradient(180deg, #060914 0%, #09111e 48%, #050811 100%);
        }

        .page-shell > :not(.ambient) {
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .star-field {
          position: absolute;
          inset: -25%;
          background-repeat: repeat;
        }

        .stars-one {
          opacity: 0.28;
          background-image: radial-gradient(circle, rgba(255,255,255,.9) 0 1px, transparent 1.7px);
          background-size: 118px 118px;
          animation: starDrift 58s linear infinite;
        }

        .stars-two {
          opacity: 0.18;
          background-image: radial-gradient(circle, rgba(100,230,201,.9) 0 1px, transparent 1.7px);
          background-size: 181px 181px;
          animation: starDriftReverse 76s linear infinite;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(109, 230, 201, 0.11);
          border-radius: 50%;
          animation: rotate 42s linear infinite;
        }

        .orbit i {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #74e4c6;
          box-shadow: 0 0 18px #74e4c6, 0 0 44px rgba(116,228,198,.55);
        }

        .orbit-one {
          width: 620px;
          height: 620px;
          top: 6%;
          left: -260px;
        }

        .orbit-one i {
          right: -4px;
          top: 48%;
        }

        .orbit-two {
          width: 760px;
          height: 760px;
          top: 37%;
          right: -330px;
          animation-duration: 57s;
          animation-direction: reverse;
        }

        .orbit-two i {
          left: 13%;
          top: 11%;
          background: #95b0ff;
          box-shadow: 0 0 18px #95b0ff, 0 0 44px rgba(149,176,255,.5);
        }

        .moving-line {
          position: absolute;
          width: 45vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(116,228,198,.65), transparent);
          filter: drop-shadow(0 0 8px rgba(116,228,198,.42));
          opacity: .35;
          animation: sweep 17s ease-in-out infinite;
        }

        .line-one {
          top: 20%;
          left: -48vw;
          transform: rotate(16deg);
        }

        .line-two {
          top: 66%;
          right: -48vw;
          transform: rotate(-12deg);
          animation-delay: -8s;
        }

        .nova {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 18px #fff, 0 0 42px #74e4c6;
          animation: nova 8s ease-in-out infinite;
        }

        .nova-one {
          top: 16%;
          left: 79%;
        }

        .nova-two {
          top: 72%;
          left: 16%;
          animation-delay: -4s;
        }

        .skip-link {
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 1000;
          padding: 10px 14px;
          border-radius: 9px;
          color: #06110e;
          background: #74e4c6;
          font-weight: 900;
          transform: translateY(-170%);
        }

        .skip-link:focus {
          transform: translateY(0);
        }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-height: 76px;
          padding: 13px clamp(18px, 4vw, 62px);
          border-bottom: 1px solid rgba(151, 178, 220, 0.14);
          background: rgba(5, 8, 17, 0.87);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          display: inline-grid;
          place-items: center;
          min-width: 58px;
          height: 40px;
          padding: 0 9px;
          border: 1px solid rgba(116, 228, 198, 0.46);
          border-radius: 10px;
          color: #74e4c6;
          background: rgba(116, 228, 198, 0.07);
          font-weight: 950;
        }

        .brand-copy {
          display: grid;
          gap: 2px;
        }

        .brand-copy strong {
          font-size: .78rem;
          letter-spacing: .08em;
        }

        .brand-copy small {
          color: #8795aa;
          font-size: .67rem;
          font-weight: 850;
          letter-spacing: .11em;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px;
          border: 1px solid rgba(151, 178, 220, 0.13);
          border-radius: 999px;
          background: rgba(8, 14, 26, 0.66);
        }

        .main-nav a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid transparent;
          border-radius: 999px;
          color: #b8c5d9;
          font-size: .8rem;
          font-weight: 800;
          transition: .2s ease;
        }

        .main-nav a:hover {
          color: #fff;
          border-color: rgba(116, 228, 198, 0.22);
          background: rgba(116, 228, 198, 0.07);
          transform: translateY(-1px);
        }

        .main-nav .nav-cta {
          color: #06110e;
          border-color: #74e4c6;
          background: linear-gradient(135deg, #8af0d4, #49cbaa);
        }

        .menu-button {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(151, 178, 220, 0.2);
          border-radius: 10px;
          color: #fff;
          background: rgba(15, 23, 39, 0.8);
        }

        .section-wrap {
          width: min(1450px, calc(100% - 34px));
          margin: 0 auto;
          padding: 92px 0;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(410px, .92fr);
          gap: clamp(35px, 6vw, 95px);
          align-items: center;
          min-height: calc(100vh - 76px);
        }

        .eyebrow,
        .door-kicker {
          margin: 0 0 11px;
          color: #74e4c6;
          font-size: .72rem;
          font-weight: 950;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        h1, h2, h3, p {
          margin-top: 0;
        }

        h1 {
          max-width: 900px;
          margin-bottom: 27px;
          font-size: clamp(3.5rem, 7.2vw, 7rem);
          line-height: .92;
          letter-spacing: -.07em;
        }

        h1 span {
          display: block;
          color: #74e4c6;
        }

        h2 {
          margin-bottom: 18px;
          font-size: clamp(2.25rem, 4.7vw, 4.8rem);
          line-height: 1;
          letter-spacing: -.052em;
        }

        h3 {
          margin-bottom: 10px;
        }

        p {
          color: #a9b7ca;
          line-height: 1.72;
        }

        .hero-lead {
          max-width: 820px;
          font-size: clamp(1.05rem, 1.6vw, 1.3rem);
        }

        .hero-support {
          max-width: 760px;
        }

        .hero-actions,
        .final-actions,
        .marketplace-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 47px;
          padding: 0 19px;
          border-radius: 12px;
          font-weight: 900;
          transition: transform .18s ease, border-color .18s ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .primary {
          border: 1px solid #74e4c6;
          color: #06110e;
          background: #74e4c6;
        }

        .secondary {
          border: 1px solid rgba(151, 178, 220, 0.3);
          color: #eff5ff;
          background: rgba(18, 28, 47, 0.82);
        }

        .ghost {
          border: 1px solid transparent;
          color: #b9c7db;
        }

        .trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 28px;
        }

        .trust-row span {
          padding: 7px 10px;
          border: 1px solid rgba(151, 178, 220, 0.17);
          border-radius: 999px;
          color: #9faec2;
          background: rgba(10, 16, 29, 0.64);
          font-size: .75rem;
          font-weight: 760;
        }

        .exchange-compass,
        .door-card,
        .marketplace-shell,
        .steps-grid article,
        .boundary-grid article {
          border: 1px solid rgba(151, 178, 220, 0.16);
          background: rgba(10, 16, 29, 0.78);
          box-shadow: 0 32px 100px rgba(0,0,0,.32);
          backdrop-filter: blur(18px);
        }

        .exchange-compass {
          padding: 25px;
          border-radius: 27px;
        }

        .compass-core {
          display: grid;
          place-items: center;
          width: 145px;
          height: 145px;
          margin: 0 auto 31px;
          border: 1px solid rgba(116, 228, 198, 0.45);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(116,228,198,.18), rgba(45,89,101,.06) 58%, transparent 60%);
          box-shadow: 0 0 60px rgba(116,228,198,.15);
        }

        .compass-core span {
          font-size: 1.35rem;
          font-weight: 950;
        }

        .compass-core strong {
          margin-top: -27px;
          color: #74e4c6;
          font-size: .68rem;
          letter-spacing: .18em;
        }

        .compass-core small {
          margin-top: -28px;
          color: #7e8da2;
        }

        .compass-grid {
          display: grid;
          gap: 9px;
        }

        .compass-grid a {
          display: grid;
          grid-template-columns: 42px 1fr auto;
          gap: 13px;
          align-items: center;
          padding: 13px;
          border: 1px solid rgba(151, 178, 220, 0.12);
          border-radius: 14px;
          background: rgba(5,10,19,.66);
          transition: .2s ease;
        }

        .compass-grid a:hover {
          border-color: rgba(116, 228, 198, 0.38);
          transform: translateX(4px);
        }

        .compass-grid a > span {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 11px;
          color: #74e4c6;
          background: rgba(116,228,198,.08);
          font-weight: 950;
        }

        .compass-grid strong,
        .compass-grid small {
          display: block;
        }

        .compass-grid small {
          margin-top: 3px;
          color: #78879c;
          line-height: 1.4;
        }

        .compass-grid b {
          color: #74e4c6;
        }

        .exchange-compass > p {
          margin: 17px 0 0;
          color: #718096;
          font-size: .75rem;
        }

        .section-heading {
          max-width: 980px;
          margin-bottom: 36px;
        }

        .section-heading > p:last-child {
          max-width: 850px;
          margin-bottom: 0;
          font-size: 1.03rem;
        }

        .centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .centered > p:last-child {
          margin-left: auto;
          margin-right: auto;
        }

        .doors-section {
          padding-top: 118px;
        }

        .door-stack {
          display: grid;
          gap: 24px;
        }

        .door-card {
          position: relative;
          padding: clamp(25px, 4vw, 48px);
          border-radius: 30px;
          overflow: hidden;
        }

        .door-card::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: linear-gradient(180deg, #74e4c6, transparent);
        }

        .door-2::before {
          background: linear-gradient(180deg, #8aa8ff, transparent);
        }

        .door-3::before {
          background: linear-gradient(180deg, #6ed5ff, transparent);
        }

        .door-4::before {
          background: linear-gradient(180deg, #c888ff, transparent);
        }

        .door-identity {
          display: grid;
          grid-template-columns: 58px 88px minmax(0, 1fr);
          gap: 20px;
          align-items: center;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(151,178,220,.13);
        }

        .door-number {
          color: #5f6f85;
          font-size: .8rem;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .door-emblem {
          position: relative;
          display: grid;
          place-items: center;
          width: 82px;
          height: 82px;
          border: 1px solid rgba(116,228,198,.38);
          border-radius: 22px;
          color: #74e4c6;
          background: rgba(116,228,198,.07);
          font-size: 1.25rem;
          font-weight: 950;
          box-shadow: inset 0 0 30px rgba(116,228,198,.05);
        }

        .door-emblem i {
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(116,228,198,.13);
          border-radius: 16px;
          animation: pulse 4s ease-in-out infinite;
        }

        .door-identity h3 {
          margin: 0 0 6px;
          font-size: clamp(2rem, 3.7vw, 4rem);
          letter-spacing: -.045em;
        }

        .door-identity > div:last-child > strong {
          color: #dbe6f7;
          font-size: 1.02rem;
          line-height: 1.5;
        }

        .door-content {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(360px, .88fr);
          gap: clamp(30px, 5vw, 70px);
          padding-top: 30px;
        }

        .door-explanation > p {
          max-width: 760px;
          font-size: 1.04rem;
        }

        .door-explanation ul,
        .boundary-grid ul {
          display: grid;
          gap: 10px;
          margin: 24px 0 0;
          padding: 0;
          list-style: none;
        }

        .door-explanation li {
          display: flex;
          gap: 11px;
          align-items: center;
          color: #cfdaea;
        }

        .door-explanation li span {
          color: #74e4c6;
        }

        .door-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .door-primary {
          justify-content: space-between;
          min-height: 58px;
          padding: 0 22px;
          font-size: 1rem;
        }

        .route-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .route-chip {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid rgba(151,178,220,.18);
          border-radius: 999px;
          color: #bdcadc;
          background: rgba(6,11,21,.62);
          font-size: .76rem;
          font-weight: 820;
          transition: .18s ease;
        }

        .route-chip:hover {
          color: #fff;
          border-color: rgba(116,228,198,.38);
          transform: translateY(-1px);
        }

        .route-chip.special {
          color: #d7e1ff;
          border-color: rgba(138,168,255,.28);
          background: rgba(103,129,216,.08);
        }

        .marketplace-button {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4px 12px;
          align-items: center;
          margin-top: 2px;
          padding: 13px 15px;
          border: 1px solid rgba(151,178,220,.15);
          border-radius: 13px;
          background: rgba(5,10,19,.58);
        }

        .marketplace-button span {
          color: #728197;
          font-size: .67rem;
          font-weight: 900;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .marketplace-button strong {
          grid-column: 1;
          color: #d9e5f5;
          font-size: .82rem;
        }

        .marketplace-button b {
          grid-column: 2;
          grid-row: 1 / span 2;
          color: #74e4c6;
        }

        .marketplace-shell {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(320px, .8fr);
          gap: 50px;
          align-items: center;
          padding: clamp(30px, 5vw, 58px);
          border-radius: 30px;
          background:
            radial-gradient(circle at 92% 20%, rgba(116,228,198,.11), transparent 35%),
            rgba(10,16,29,.8);
        }

        .marketplace-shell h2 {
          font-size: clamp(2rem, 4vw, 4rem);
        }

        .marketplace-actions {
          justify-content: flex-end;
          margin-top: 0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .steps-grid article {
          min-height: 230px;
          padding: 23px;
          border-radius: 20px;
        }

        .steps-grid article > span {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 28px;
          border: 1px solid rgba(116,228,198,.35);
          border-radius: 11px;
          color: #74e4c6;
          font-weight: 950;
        }

        .steps-grid h3 {
          font-size: 1.2rem;
        }

        .steps-grid p {
          margin-bottom: 0;
          font-size: .9rem;
        }

        .chain-track {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
        }

        .chain-track div {
          position: relative;
          min-height: 120px;
          padding: 16px;
          border: 1px solid rgba(151,178,220,.14);
          border-radius: 16px;
          background: rgba(10,16,29,.7);
        }

        .chain-track span {
          color: #74e4c6;
          font-size: .7rem;
          font-weight: 950;
        }

        .chain-track strong {
          display: block;
          margin-top: 47px;
          font-size: .88rem;
        }

        .chain-track i {
          position: absolute;
          top: 50%;
          right: -9px;
          z-index: 2;
          color: #526178;
          font-style: normal;
        }

        .boundary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .boundary-grid article {
          padding: clamp(28px, 4vw, 45px);
          border-radius: 26px;
        }

        .boundary-grid h3 {
          font-size: clamp(1.8rem, 3vw, 3rem);
        }

        .boundary-grid li {
          color: #c0ccdc;
        }

        .final-cta {
          max-width: 1060px;
          text-align: center;
        }

        .final-cta p {
          max-width: 850px;
          margin-left: auto;
          margin-right: auto;
        }

        .final-actions {
          justify-content: center;
        }

        .site-footer {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, minmax(160px, .65fr));
          gap: 32px;
          width: min(1450px, calc(100% - 34px));
          margin: 0 auto;
          padding: 65px 0 34px;
          border-top: 1px solid rgba(151,178,220,.13);
        }

        .site-footer h3 {
          margin-bottom: 15px;
          color: #dfe9f7;
          font-size: .82rem;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .site-footer > div:not(.footer-brand) {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .site-footer a {
          color: #8f9eb3;
          font-size: .82rem;
        }

        .site-footer a:hover {
          color: #fff;
        }

        .footer-brand p {
          max-width: 360px;
          margin-top: 18px;
        }

        .footer-chain {
          grid-column: 1 / -1;
          margin: 20px 0 0;
          padding-top: 22px;
          border-top: 1px solid rgba(151,178,220,.1);
          color: #65748a;
          text-align: center;
          font-size: .78rem;
        }

        @keyframes starDrift {
          to { transform: translate3d(170px, 120px, 0); }
        }

        @keyframes starDriftReverse {
          to { transform: translate3d(-180px, 145px, 0); }
        }

        @keyframes rotate {
          to { transform: rotate(360deg); }
        }

        @keyframes sweep {
          0%, 15% { transform: translateX(0) rotate(16deg); opacity: 0; }
          35% { opacity: .42; }
          80%, 100% { transform: translateX(165vw) rotate(16deg); opacity: 0; }
        }

        @keyframes nova {
          0%, 84%, 100% { transform: scale(.2); opacity: .1; }
          88% { transform: scale(1.4); opacity: 1; }
          92% { transform: scale(5); opacity: .22; }
        }

        @keyframes pulse {
          0%, 100% { opacity: .35; transform: scale(.96); }
          50% { opacity: 1; transform: scale(1.04); }
        }

        @media (max-width: 1100px) {
          .hero {
            grid-template-columns: 1fr;
            padding-top: 80px;
          }

          .exchange-compass {
            max-width: 760px;
          }

          .door-content,
          .marketplace-shell {
            grid-template-columns: 1fr;
          }

          .marketplace-actions {
            justify-content: flex-start;
          }

          .chain-track {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .menu-button {
            display: block;
          }

          .main-nav {
            position: absolute;
            top: 66px;
            right: 16px;
            display: none;
            width: min(330px, calc(100vw - 32px));
            padding: 12px;
            border-radius: 18px;
            flex-direction: column;
            align-items: stretch;
          }

          .main-nav.open {
            display: flex;
          }

          .main-nav a {
            justify-content: flex-start;
          }

          .door-identity {
            grid-template-columns: 50px 75px 1fr;
          }

          .door-emblem {
            width: 70px;
            height: 70px;
          }

          .steps-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .site-footer {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer-chain {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 620px) {
          .section-wrap {
            width: min(100% - 24px, 1450px);
            padding: 70px 0;
          }

          .site-header {
            padding-left: 12px;
            padding-right: 12px;
          }

          .brand-copy small {
            display: none;
          }

          .door-identity {
            grid-template-columns: 46px 62px 1fr;
            gap: 11px;
          }

          .door-emblem {
            width: 58px;
            height: 58px;
            border-radius: 16px;
          }

          .door-number {
            font-size: .7rem;
          }

          .door-identity h3 {
            font-size: 1.65rem;
          }

          .door-identity > div:last-child > strong {
            display: none;
          }

          .steps-grid,
          .boundary-grid,
          .chain-track,
          .site-footer {
            grid-template-columns: 1fr;
          }

          .chain-track i {
            display: none;
          }

          .footer-chain {
            grid-column: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) { scroll-behavior: auto; }
          .star-field,
          .orbit,
          .moving-line,
          .nova,
          .door-emblem i {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
