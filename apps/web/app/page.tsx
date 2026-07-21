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
  question: string;
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
    question: "I want to govern AI.",
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
    question: "I want to preserve or interpret a record.",
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
    question: "I want to govern environmental evidence.",
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
    question: "I want to review an organization or system.",
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
  const [activeDoor, setActiveDoor] = useState<string | null>(null);

  const toggleDoor = (doorNumber: string) => {
    setActiveDoor((current) => (current === doorNumber ? null : doorNumber));
  };

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
          {doors.map((door, index) => {
            const isOpen = activeDoor === door.number;

            return (
            <article
              className={`door-card gold-door door-${index + 1} ${isOpen ? "is-open" : ""}`}
              id={`door-${door.number}`}
              key={door.title}
            >
              <button
                className="gold-door-face"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`door-panel-${door.number}`}
                onClick={() => toggleDoor(door.number)}
              >
                <span className="gold-door-frame" aria-hidden="true" />
                <span className="gold-door-panel panel-top" aria-hidden="true" />
                <span className="gold-door-panel panel-middle" aria-hidden="true" />
                <span className="gold-door-panel panel-bottom" aria-hidden="true" />
                <span className="gold-door-handle" aria-hidden="true" />
                <span className="gold-door-light" aria-hidden="true" />

                <span className="door-number">{door.number}</span>
                <span className="door-emblem">
                  <span>{door.badge}</span>
                  <i />
                </span>

                <span className="gold-door-copy">
                  <span className="door-kicker">PRIMARY EXCHANGE DOOR</span>
                  <span className="intent-question">{door.question}</span>
                  <span className="gold-door-title">{door.title}</span>
                  <span className="gold-door-statement">{door.statement}</span>
                  <span className="gold-door-instruction">
                    {isOpen ? "Close this door" : "Open this door"}
                    <b>{isOpen ? "−" : "+"}</b>
                  </span>
                </span>

                <span className="star-burst burst-one" aria-hidden="true" />
                <span className="star-burst burst-two" aria-hidden="true" />
                <span className="star-burst burst-three" aria-hidden="true" />
                <span className="star-burst burst-four" aria-hidden="true" />
                <span className="star-burst burst-five" aria-hidden="true" />
              </button>

              <div
                className="door-panel"
                id={`door-panel-${door.number}`}
                hidden={!isOpen}
              >
                <div className={`door-visual visual-${index + 1}`} aria-hidden="true">
                  <div className="visual-grid" />
                  <div className="visual-core">
                    <span>{door.badge}</span>
                  </div>
                  <span className="visual-node node-a" />
                  <span className="visual-node node-b" />
                  <span className="visual-node node-c" />
                  <span className="visual-node node-d" />
                  <span className="visual-route route-a" />
                  <span className="visual-route route-b" />
                  <span className="visual-route route-c" />
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
              </div>
            </article>
            );
          })}
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
          border: 0;
          border-radius: 30px;
          overflow: visible;
          background: transparent;
          box-shadow: none;
          backdrop-filter: none;
        }

        .door-card::before {
          display: none;
        }

        .gold-door-face {
          position: relative;
          display: grid;
          grid-template-columns: 58px 88px minmax(0, 1fr);
          gap: 20px;
          align-items: center;
          width: 100%;
          min-height: 365px;
          padding: clamp(30px, 5vw, 58px);
          overflow: hidden;
          border: 1px solid rgba(255, 215, 112, 0.8);
          border-radius: 30px;
          color: #fff9e8;
          text-align: left;
          cursor: pointer;
          background:
            linear-gradient(135deg, rgba(255,244,190,.12), transparent 26%),
            linear-gradient(180deg, #2e210b 0%, #171006 48%, #090703 100%);
          box-shadow:
            0 30px 95px rgba(0,0,0,.48),
            inset 0 0 0 2px rgba(129,82,10,.75),
            inset 0 0 0 8px rgba(255,206,88,.08),
            inset 0 0 70px rgba(255,188,52,.08);
          transition:
            transform .32s ease,
            box-shadow .32s ease,
            border-color .32s ease;
        }

        .gold-door-face:hover,
        .gold-door-face:focus-visible {
          transform: translateY(-5px) perspective(1200px) rotateX(1deg);
          border-color: #ffe09a;
          box-shadow:
            0 40px 120px rgba(0,0,0,.56),
            0 0 45px rgba(255,195,58,.18),
            inset 0 0 0 2px rgba(150,96,12,.9),
            inset 0 0 0 8px rgba(255,221,128,.11),
            inset 0 0 90px rgba(255,195,58,.12);
          outline: none;
        }

        .gold-door.is-open .gold-door-face {
          transform: perspective(1300px) rotateY(-2.2deg) translateX(-5px);
          border-color: #ffe9ae;
          box-shadow:
            26px 34px 110px rgba(0,0,0,.62),
            0 0 70px rgba(255,195,58,.24),
            inset 0 0 0 2px rgba(173,112,14,.95),
            inset 0 0 0 8px rgba(255,226,143,.13);
        }

        .gold-door-frame {
          position: absolute;
          inset: 18px;
          border: 2px solid rgba(255,215,112,.34);
          border-radius: 21px;
          box-shadow:
            inset 0 0 0 7px rgba(93,57,7,.75),
            0 0 26px rgba(255,197,61,.08);
          pointer-events: none;
        }

        .gold-door-panel {
          position: absolute;
          right: 5.2%;
          width: 30%;
          border: 1px solid rgba(255,215,112,.3);
          border-radius: 12px;
          background:
            linear-gradient(145deg, rgba(255,220,128,.09), transparent 45%),
            rgba(79,48,7,.2);
          box-shadow:
            inset 0 0 0 5px rgba(18,12,3,.5),
            inset 0 0 35px rgba(255,190,37,.05);
          pointer-events: none;
        }

        .panel-top {
          top: 12%;
          height: 21%;
        }

        .panel-middle {
          top: 38%;
          height: 21%;
        }

        .panel-bottom {
          top: 64%;
          height: 24%;
        }

        .gold-door-handle {
          position: absolute;
          right: 7.2%;
          top: 50%;
          width: 16px;
          height: 16px;
          border: 2px solid #ffe39c;
          border-radius: 50%;
          background: #b97a12;
          box-shadow:
            0 0 0 5px rgba(59,35,5,.92),
            0 0 21px rgba(255,202,73,.48);
          transform: translateY(-50%);
          pointer-events: none;
        }

        .gold-door-light {
          position: absolute;
          top: -38%;
          left: 17%;
          width: 34%;
          height: 170%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,239,179,.14),
            transparent
          );
          transform: rotate(18deg);
          animation: goldSweep 8s ease-in-out infinite;
          pointer-events: none;
        }

        .door-number {
          position: relative;
          z-index: 3;
          color: #c7973b;
          font-size: .8rem;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .door-emblem {
          position: relative;
          z-index: 3;
          display: grid;
          place-items: center;
          width: 82px;
          height: 82px;
          border: 1px solid rgba(255,219,126,.7);
          border-radius: 22px;
          color: #ffe19a;
          background:
            radial-gradient(circle, rgba(255,218,118,.18), rgba(83,48,4,.38));
          font-size: 1.25rem;
          font-weight: 950;
          box-shadow:
            inset 0 0 30px rgba(255,210,91,.11),
            0 0 30px rgba(255,195,58,.08);
        }

        .door-emblem i {
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(255,224,147,.25);
          border-radius: 16px;
          animation: pulse 4s ease-in-out infinite;
        }

        .gold-door-copy {
          position: relative;
          z-index: 3;
          display: block;
          max-width: 760px;
          padding-right: 29%;
        }

        .door-kicker {
          display: block;
          margin: 0 0 10px;
          color: #e8b951;
        }

        .intent-question {
          display: block;
          margin: 0 0 9px;
          color: #fff7df;
          font-size: clamp(1rem, 1.5vw, 1.32rem);
          font-weight: 900;
          letter-spacing: -.02em;
        }

        .gold-door-title {
          display: block;
          margin-bottom: 9px;
          color: #fff;
          font-size: clamp(2.2rem, 4.2vw, 4.7rem);
          font-weight: 950;
          line-height: .96;
          letter-spacing: -.055em;
        }

        .gold-door-statement {
          display: block;
          max-width: 690px;
          color: #d7c8a4;
          font-size: 1rem;
          font-weight: 760;
          line-height: 1.58;
        }

        .gold-door-instruction {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 25px;
          color: #ffe29b;
          font-size: .78rem;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .gold-door-instruction b {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(255,221,136,.48);
          border-radius: 50%;
          font-size: 1.1rem;
        }

        .star-burst {
          position: absolute;
          z-index: 7;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          opacity: 0;
          background: #fff9d9;
          box-shadow:
            0 0 9px #fff,
            0 0 20px #ffd66d,
            0 0 42px rgba(255,193,43,.9);
          pointer-events: none;
        }

        .burst-one { top: 18%; left: 14%; }
        .burst-two { top: 22%; right: 16%; }
        .burst-three { bottom: 20%; left: 24%; }
        .burst-four { bottom: 14%; right: 27%; }
        .burst-five { top: 52%; left: 52%; }

        .gold-door.is-open .star-burst {
          animation: explodeStar 1.15s cubic-bezier(.17,.84,.31,1) both;
        }

        .gold-door.is-open .burst-two { animation-delay: .08s; }
        .gold-door.is-open .burst-three { animation-delay: .14s; }
        .gold-door.is-open .burst-four { animation-delay: .2s; }
        .gold-door.is-open .burst-five { animation-delay: .26s; }

        .door-panel {
          margin: 16px 20px 0;
          padding: clamp(24px, 4vw, 44px);
          border: 1px solid rgba(255,215,112,.24);
          border-radius: 0 0 28px 28px;
          background:
            radial-gradient(circle at 50% 0%, rgba(255,195,58,.08), transparent 38%),
            rgba(10,14,23,.94);
          box-shadow: 0 28px 85px rgba(0,0,0,.38);
          animation: revealPanel .36s ease both;
        }

        .door-visual {
          position: relative;
          z-index: 1;
          height: 215px;
          margin: 0 0 24px;
          border: 1px solid rgba(255,215,112,.16);
          border-radius: 22px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 50%, rgba(255,197,61,.11), transparent 28%),
            rgba(4,9,18,.7);
        }

        .visual-grid {
          position: absolute;
          inset: 0;
          opacity: .22;
          background-image:
            linear-gradient(rgba(255,215,112,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,215,112,.1) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(90deg, transparent, black 20%, black 80%, transparent);
        }

        .visual-core {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          place-items: center;
          width: 92px;
          height: 92px;
          border: 1px solid rgba(255,219,126,.52);
          border-radius: 50%;
          color: #ffe19a;
          background: radial-gradient(circle, rgba(255,212,94,.17), rgba(4,9,18,.94) 70%);
          box-shadow: 0 0 50px rgba(255,195,58,.18);
          transform: translate(-50%, -50%);
          animation: corePulse 4.5s ease-in-out infinite;
        }

        .visual-core::before,
        .visual-core::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(255,219,126,.18);
          border-radius: 50%;
          animation: rotate 16s linear infinite;
        }

        .visual-core::before { inset: -34px; }
        .visual-core::after {
          inset: -62px;
          animation-direction: reverse;
          animation-duration: 24s;
        }

        .visual-core span {
          font-weight: 950;
          letter-spacing: .08em;
        }

        .visual-node {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffd76f;
          box-shadow: 0 0 16px rgba(255,207,83,.85);
          animation: nodeFloat 5s ease-in-out infinite;
        }

        .node-a { left: 15%; top: 28%; }
        .node-b { right: 17%; top: 24%; animation-delay: -1.4s; }
        .node-c { left: 23%; bottom: 23%; animation-delay: -2.6s; }
        .node-d { right: 24%; bottom: 22%; animation-delay: -3.6s; }

        .visual-route {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 32%;
          height: 1px;
          transform-origin: left center;
          background: linear-gradient(90deg, rgba(255,211,100,.82), transparent);
          filter: drop-shadow(0 0 5px rgba(255,202,73,.52));
          animation: routeGlow 3.2s ease-in-out infinite;
        }

        .route-a { transform: rotate(-150deg); }
        .route-b { transform: rotate(-30deg); animation-delay: -1.1s; }
        .route-c { transform: rotate(145deg); animation-delay: -2.1s; }

        .door-content {

          position: relative;
          z-index: 3;
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

        @keyframes goldSweep {
          0%, 15% { transform: translateX(-180%) rotate(18deg); opacity: 0; }
          34% { opacity: 1; }
          62%, 100% { transform: translateX(330%) rotate(18deg); opacity: 0; }
        }

        @keyframes explodeStar {
          0% {
            opacity: 0;
            transform: scale(.15);
          }
          18% {
            opacity: 1;
            transform: scale(1.8);
          }
          45% {
            opacity: .9;
            transform: scale(5.5);
            box-shadow:
              0 0 14px #fff,
              0 0 38px #ffd66d,
              0 0 90px rgba(255,193,43,.95);
          }
          100% {
            opacity: 0;
            transform: scale(12);
          }
        }

        @keyframes revealPanel {
          from {
            opacity: 0;
            transform: translateY(-18px) scale(.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes corePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(.96); }
          50% { transform: translate(-50%, -50%) scale(1.04); }
        }

        @keyframes nodeFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: .65; }
          50% { transform: translate3d(0, -12px, 0); opacity: 1; }
        }

        @keyframes routeGlow {
          0%, 100% { opacity: .22; }
          50% { opacity: .95; }
        }

        @keyframes environmentalMorph {
          0%, 100% {
            transform: translate(-50%, -50%) scale(.97) rotate(0deg);
            border-radius: 48% 52% 45% 55% / 55% 43% 57% 45%;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.04) rotate(4deg);
            border-radius: 55% 45% 58% 42% / 44% 58% 42% 56%;
          }
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

          .gold-door-face {
            grid-template-columns: 50px 75px 1fr;
          }

          .door-emblem {
            width: 70px;
            height: 70px;
          }

          .gold-door-copy {
            padding-right: 22%;
          }

          .gold-door-panel {
            width: 22%;
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

          .gold-door-face {
            grid-template-columns: 42px 58px 1fr;
            gap: 10px;
            min-height: 330px;
            padding: 24px 18px;
          }

          .door-emblem {
            width: 58px;
            height: 58px;
            border-radius: 16px;
          }

          .door-number {
            font-size: .7rem;
          }

          .gold-door-title {
            font-size: 1.75rem;
          }

          .gold-door-copy {
            padding-right: 0;
          }

          .gold-door-statement {
            display: none;
          }

          .gold-door-panel,
          .gold-door-handle {
            display: none;
          }

          .door-panel {
            margin-left: 0;
            margin-right: 0;
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
          .door-emblem i,
          .visual-core,
          .visual-core::before,
          .visual-core::after,
          .visual-node,
          .visual-route,
          .gold-door-light,
          .star-burst {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
