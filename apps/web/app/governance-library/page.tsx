"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type Gateway = {
  code: string;
  title: string;
  description: string;
  accent: string;
  links: {
    label: string;
    href: string;
  }[];
};

const gateways: Gateway[] = [
  {
    code: "01",
    title: "Learn",
    description:
      "Understand the laws, regulations, standards, frameworks, principles, and recommendations that shape artificial-intelligence governance.",
    accent: "#63e6ff",
    links: [
      {
        label: "Laws",
        href: "/governance-library/laws",
      },
      {
        label: "Regulations",
        href: "/governance-library/regulations",
      },
      {
        label: "Standards",
        href: "/governance-library/standards",
      },
      {
        label: "Frameworks",
        href: "/governance-library/frameworks",
      },
      {
        label: "Principles",
        href: "/governance-library/principles",
      },
      {
        label: "Recommendations",
        href: "/governance-library/recommendations",
      },
    ],
  },
  {
    code: "02",
    title: "Determine",
    description:
      "Identify which authorities, jurisdictions, roles, sectors, lifecycle stages, and risk obligations apply to a specific organization or system.",
    accent: "#72e6b2",
    links: [
      {
        label: "Applicability Engine",
        href: "/governance-library/applicability",
      },
      {
        label: "Jurisdictions",
        href: "/governance-library/jurisdiction",
      },
      {
        label: "Governance Roles",
        href: "/governance-library/roles",
      },
      {
        label: "Sector Governance",
        href: "/governance-library/sector-governance",
      },
      {
        label: "Risk Management",
        href: "/governance-library/risk-management",
      },
      {
        label: "Lifecycle Governance",
        href: "/governance-library/lifecycle",
      },
    ],
  },
  {
    code: "03",
    title: "Build",
    description:
      "Translate applicable governance requirements into structured mappings, evidence expectations, governed records, and TA-14 execution routes.",
    accent: "#ffc65c",
    links: [
      {
        label: "Crosswalk Engine",
        href: "/governance-library/crosswalks",
      },
      {
        label: "Compare Sources",
        href: "/governance-library/compare",
      },
      {
        label: "Coverage Analysis",
        href: "/governance-library/coverage",
      },
      {
        label: "Governed Records",
        href: "/governance-library/governed-records",
      },
      {
        label: "TA-14 Route Builder",
        href: "/workspace/ai-governance",
      },
    ],
  },
  {
    code: "04",
    title: "Verify",
    description:
      "Test governance claims, preserve source authority, examine assurance boundaries, and maintain reviewable evidence across time.",
    accent: "#c68cff",
    links: [
      {
        label: "Testing",
        href: "/governance-library/testing",
      },
      {
        label: "Assurance",
        href: "/governance-library/assurance",
      },
      {
        label: "References",
        href: "/governance-library/references",
      },
      {
        label: "Authorities",
        href: "/governance-library/authorities",
      },
      {
        label: "Timeline",
        href: "/governance-library/timeline",
      },
      {
        label: "Source Index",
        href: "/governance-library/sources",
      },
    ],
  },
];

const sourceClasses = [
  {
    code: "01",
    title: "Laws & Regulations",
    description:
      "Binding legal instruments, duties, prohibitions, enforcement structures, and jurisdiction-specific obligations.",
    href: "/governance-library/laws",
    tag: "Binding authority",
  },
  {
    code: "02",
    title: "Standards",
    description:
      "Technical, management-system, risk, governance, and assurance standards.",
    href: "/governance-library/standards",
    tag: "Normative systems",
  },
  {
    code: "03",
    title: "Frameworks",
    description:
      "Structured systems for risk, trustworthiness, accountability, and organizational governance.",
    href: "/governance-library/frameworks",
    tag: "Operational guidance",
  },
  {
    code: "04",
    title: "Principles & Recommendations",
    description:
      "Ethical, rights-based, public-interest, and policy guidance from recognized institutions.",
    href: "/governance-library/principles",
    tag: "Policy direction",
  },
  {
    code: "05",
    title: "Testing & Assurance",
    description:
      "Impact assessments, red teaming, conformity review, assurance cases, and validation systems.",
    href: "/governance-library/testing",
    tag: "Verification systems",
  },
  {
    code: "06",
    title: "Sector Overlays",
    description:
      "Healthcare, finance, buildings, public services, infrastructure, insurance, and other domains.",
    href: "/governance-library/sector-governance",
    tag: "Domain application",
  },
];

const journey = [
  "Learn",
  "Determine",
  "Map",
  "Build",
  "Test",
  "Review",
  "Verify",
  "Export",
];

const intelligenceLinks = [
  {
    label: "Library Dashboard",
    href: "/governance-library/dashboard",
  },
  {
    label: "AI Governance Dictionary",
    href: "/governance-library/dictionary",
  },
  {
    label: "Governance Glossary",
    href: "/governance-library/glossary",
  },
  {
    label: "Relationship Map",
    href: "/governance-library/relationships",
  },
  {
    label: "Topic Map",
    href: "/governance-library/topic-map",
  },
  {
    label: "Publisher Matrix",
    href: "/governance-library/publisher-matrix",
  },
];

export default function GovernanceLibraryPage() {
  return (
    <main className="libraryPage">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <div className="gridOverlay" />

      <section className="shell">
        <div className="topbar">
          <Link href="/" className="button quiet">
            ← Return to Exchange
          </Link>

          <div className="topbarCenter">
            <span className="statusDot" />
            Institutional governance intelligence
          </div>

          <Link
            href="/workspace/ai-governance"
            className="button primary"
          >
            Enter AI Governance →
          </Link>
        </div>

        <header className="hero">
          <div className="heroOrbit">
            <div className="orbit orbitOne" />
            <div className="orbit orbitTwo" />

            <div className="seal">
              <span>GL</span>
              <small>TA-14</small>
            </div>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Decode the landscape
            <span> before governing within it.</span>
          </h1>

          <p className="lead">
            Explore laws, regulations, standards, frameworks,
            principles, recommendations, testing systems, and sector
            overlays. Every source remains connected to its issuer,
            class, authority, version, applicability, evidence
            expectations, and TA-14 execution pathway.
          </p>

          <div className="heroMeta">
            <div>
              <span>30+</span>
              <small>Institutional Library Departments</small>
            </div>

            <div>
              <span>1000+</span>
              <small>Governance Records Ready</small>
            </div>

            <div>
              <span>TA-14</span>
              <small>Execution Architecture</small>
            </div>
          </div>

          <div className="heroActions">
            <Link
              href="/governance-library/dashboard"
              className="button primary"
            >
              Browse the Library →
            </Link>

            <Link
              href="/governance-library/applicability"
              className="button secondaryButton"
            >
              Find What Applies →
            </Link>

            <Link
              href="/workspace/ai-governance"
              className="button goldButton"
            >
              Build a Route →
            </Link>

            <Link
              href="/governance-library/assurance"
              className="button quiet"
            >
              Verify Evidence →
            </Link>
          </div>
        </header>

        <section className="journeyPanel">
          <div className="journeyIntro">
            <p className="eyebrow gold">
              GOVERNANCE JOURNEY
            </p>

            <h2>
              Move from understanding to preserved proof.
            </h2>
          </div>

          <div className="journey">
            {journey.map((label, index) => (
              <div className="journeyStep" key={label}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{label}</strong>

                {index < journey.length - 1 ? (
                  <i aria-hidden="true">→</i>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="gatewaySection">
          <div className="heading">
            <div>
              <p className="eyebrow">
                INSTITUTIONAL GATEWAYS
              </p>

              <h2>
                Four ways into the governance operating system.
              </h2>
            </div>

            <p>
              The Library is organized around the actual work of
              governance: understanding authority, determining
              applicability, building controlled execution, and
              verifying what can be proved.
            </p>
          </div>

          <div className="gatewayGrid">
            {gateways.map((gateway) => (
              <article
                className="gatewayCard"
                key={gateway.title}
                style={
                  {
                    "--accent": gateway.accent,
                  } as CSSProperties
                }
              >
                <div className="gatewayGlow" />

                <div className="gatewayHeader">
                  <span className="gatewayCode">
                    {gateway.code}
                  </span>

                  <span className="gatewayStatus">
                    Institutional gateway
                  </span>
                </div>

                <h3>{gateway.title}</h3>

                <p className="gatewayDescription">
                  {gateway.description}
                </p>

                <div className="gatewayLinks">
                  {gateway.links.map((link) => (
                    <Link
                      href={link.href}
                      className="gatewayLink"
                      key={`${gateway.title}-${link.href}`}
                    >
                      <span>{link.label}</span>
                      <i aria-hidden="true">→</i>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="categorySection">
          <div className="heading">
            <div>
              <p className="eyebrow">
                EXPLORE BY SOURCE TYPE
              </p>

              <h2>
                Know what kind of authority you are looking at.
              </h2>
            </div>

            <p>
              A regulation is not a standard. A standard is not a
              framework. A framework is not a certification. The
              Library keeps every source class and every boundary
              visible.
            </p>
          </div>

          <div className="categoryGrid">
            {sourceClasses.map((category) => (
              <Link
                className="categoryCard"
                href={category.href}
                key={category.title}
              >
                <div className="categoryTop">
                  <span className="categoryNumber">
                    {category.code}
                  </span>

                  <span className="categoryTag">
                    {category.tag}
                  </span>
                </div>

                <div className="categoryGlyph">
                  <span />
                  <span />
                  <span />
                </div>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

                <div className="cardAction">
                  <strong>Explore department</strong>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="intelligenceSection">
          <div className="heading">
            <div>
              <p className="eyebrow">
                LIBRARY INTELLIGENCE
              </p>

              <h2>
                Navigate the source landscape from every angle.
              </h2>
            </div>

            <p>
              Search definitions, inspect relationships, follow
              publishers, compare sources, and understand how
              governance records connect across the Library.
            </p>
          </div>

          <div className="intelligenceGrid">
            {intelligenceLinks.map((link, index) => (
              <Link
                href={link.href}
                className="intelligenceCard"
                key={link.href}
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{link.label}</strong>

                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>

        <section className="boundary">
          <div className="boundaryHalo" />

          <div className="boundarySeal">
            <span>SB</span>
            <small>Source boundary</small>
          </div>

          <p className="eyebrow gold">
            SOURCE AND INTERPRETATION BOUNDARY
          </p>

          <h2>
            The Library explains governance. It does not fabricate
            authority.
          </h2>

          <p>
            Every entry should preserve the issuing body, official
            source, version, dates, legal or normative force,
            interpretation status, relationships, unresolved
            questions, and review history. Summaries and TA-14
            implementation routes do not replace original source
            materials, legal advice, accreditation, conformity
            assessment, or independent certification.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>PROVES</span>
              <strong>
                Source identity and interpreted scope
              </strong>
            </article>

            <article>
              <span>DOES NOT PROVE</span>
              <strong>
                Certification, legal advice, or conformity
              </strong>
            </article>

            <article>
              <span>REQUIRES</span>
              <strong>
                Review, evidence, authority, and version control
              </strong>
            </article>
          </div>

          <div className="actions">
            <Link
              href="/governance-library/dictionary"
              className="button primary"
            >
              Open Acronym Dictionary →
            </Link>

            <Link
              href="/governance-library/applicability"
              className="button goldButton"
            >
              Find What Applies →
            </Link>
          </div>
        </section>
      </section>

      <style jsx>{`
        .libraryPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(31, 120, 169, 0.18),
              transparent 36%
            ),
            radial-gradient(
              circle at 8% 34%,
              rgba(65, 203, 227, 0.08),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 66%,
              rgba(239, 185, 89, 0.07),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 48%,
              #01060c 100%
            );
        }

        .ambient,
        .gridOverlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .ambientOne {
          background: radial-gradient(
            circle at 20% 10%,
            rgba(99, 230, 255, 0.08),
            transparent 24%
          );
          animation: driftOne 14s ease-in-out infinite alternate;
        }

        .ambientTwo {
          background: radial-gradient(
            circle at 78% 34%,
            rgba(255, 197, 82, 0.06),
            transparent 23%
          );
          animation: driftTwo 17s ease-in-out infinite alternate;
        }

        .gridOverlay {
          opacity: 0.16;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 82%
          );
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 90px;
        }

        .topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
        }

        .topbarCenter {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .statusDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 16px rgba(114, 230, 178, 0.9);
        }

        .button {
          min-height: 46px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition:
            transform 0.22s,
            border-color 0.22s,
            box-shadow 0.22s;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .quiet {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .primary {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
          box-shadow: 0 10px 30px rgba(76, 204, 226, 0.18);
        }

        .secondaryButton {
          color: #dffbff;
          border: 1px solid rgba(104, 224, 245, 0.34);
          background: linear-gradient(
            135deg,
            rgba(34, 123, 151, 0.35),
            rgba(7, 31, 45, 0.8)
          );
        }

        .goldButton {
          color: #241704;
          border: 1px solid #ffe09a;
          background: linear-gradient(
            135deg,
            #fff0bd,
            #eeb84b
          );
          box-shadow: 0 10px 30px rgba(238, 184, 75, 0.16);
        }

        .hero {
          max-width: 1180px;
          margin: auto;
          padding: 94px 0 72px;
          text-align: center;
        }

        .heroOrbit {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 30px;
          display: grid;
          place-items: center;
        }

        .orbit {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(99, 230, 255, 0.18);
          border-radius: 50%;
        }

        .orbitOne {
          transform: rotate(18deg) scaleX(1.16);
          animation: rotateOne 16s linear infinite;
        }

        .orbitTwo {
          transform: rotate(-32deg) scaleY(1.12);
          border-color: rgba(255, 199, 82, 0.14);
          animation: rotateTwo 22s linear infinite reverse;
        }

        .seal {
          position: relative;
          z-index: 2;
          width: 112px;
          height: 112px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 199, 82, 0.44);
          border-radius: 50%;
          color: #ffe5a0;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.18),
              transparent 34%
            ),
            radial-gradient(
              circle,
              rgba(255, 193, 64, 0.12),
              rgba(4, 18, 30, 0.95) 68%
            );
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.11),
            inset 0 0 30px rgba(255, 255, 255, 0.03);
        }

        .seal span {
          font: 900 34px Georgia, serif;
        }

        .seal small {
          color: #8da6b2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .eyebrow.gold {
          color: #efbd59;
        }

        h1,
        h2,
        h3 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          max-width: 1100px;
          margin: 15px auto 0;
          font-size: clamp(54px, 6.7vw, 98px);
          line-height: 0.94;
          letter-spacing: -0.056em;
          text-wrap: balance;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 930px;
          margin: 28px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMeta {
          max-width: 850px;
          margin: 38px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .heroMeta div {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMeta span {
          display: block;
          color: #f0d28f;
          font: 700 25px Georgia, serif;
        }

        .heroMeta small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .heroActions {
          margin-top: 26px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .heroActions .button {
          justify-self: auto;
        }

        .journeyPanel {
          padding: 32px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 34px;
          align-items: center;
          border: 1px solid rgba(255, 197, 82, 0.18);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 193, 64, 0.09),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(11, 30, 46, 0.9),
              rgba(4, 14, 24, 0.95)
            );
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.27);
        }

        .journeyIntro h2 {
          margin: 10px 0 0;
          font-size: clamp(32px, 3.8vw, 54px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .journey {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .journeyStep {
          position: relative;
          min-height: 88px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 15px;
          background: rgba(1, 9, 16, 0.36);
        }

        .journeyStep span {
          color: #708792;
          font-size: 9px;
          font-weight: 900;
        }

        .journeyStep strong {
          margin-top: 7px;
          color: #d8f7fb;
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .journeyStep i {
          position: absolute;
          right: -9px;
          top: 36px;
          z-index: 3;
          color: #e5b956;
          font-style: normal;
        }

        .gatewaySection,
        .categorySection,
        .intelligenceSection {
          padding: 88px 0 0;
        }

        .heading {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
          margin-bottom: 34px;
        }

        .heading h2,
        .boundary h2 {
          margin: 12px 0 0;
          font-size: clamp(40px, 4.6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.048em;
        }

        .heading > p {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .gatewayGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .gatewayCard {
          --accent: #63e6ff;
          position: relative;
          min-height: 470px;
          padding: 28px;
          overflow: hidden;
          border: 1px solid
            color-mix(
              in srgb,
              var(--accent) 30%,
              rgba(255, 255, 255, 0.05)
            );
          border-radius: 28px;
          background: linear-gradient(
            145deg,
            rgba(10, 29, 46, 0.96),
            rgba(4, 13, 23, 0.99)
          );
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .gatewayGlow {
          position: absolute;
          inset: -120px -80px auto auto;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: color-mix(
            in srgb,
            var(--accent) 13%,
            transparent
          );
          filter: blur(18px);
        }

        .gatewayHeader {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .gatewayCode {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border: 1px solid var(--accent);
          border-radius: 17px;
          color: var(--accent);
          background: rgba(0, 0, 0, 0.22);
          font-size: 15px;
          font-weight: 950;
        }

        .gatewayStatus {
          color: #728a96;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .gatewayCard h3 {
          position: relative;
          z-index: 2;
          margin: 27px 0 0;
          color: #ffffff;
          font-size: 48px;
          line-height: 1;
        }

        .gatewayDescription {
          position: relative;
          z-index: 2;
          margin: 16px 0 24px;
          color: #9bb0ba;
          font-size: 15px;
          line-height: 1.7;
        }

        .gatewayLinks {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .gatewayLink {
          min-height: 52px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 12px;
          color: #d6e6eb;
          background: rgba(0, 0, 0, 0.18);
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .gatewayLink i {
          color: var(--accent);
          font-style: normal;
        }

        .gatewayLink:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
          background: color-mix(
            in srgb,
            var(--accent) 8%,
            rgba(0, 0, 0, 0.22)
          );
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .categoryCard {
          position: relative;
          min-height: 300px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 26px;
          color: inherit;
          text-decoration: none;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(99, 230, 255, 0.07),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(10, 31, 47, 0.95),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow:
            0 24px 58px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition:
            transform 0.26s,
            border-color 0.26s,
            box-shadow 0.26s;
        }

        .categoryCard:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 230, 255, 0.48);
          box-shadow:
            0 32px 70px rgba(0, 0, 0, 0.36),
            0 0 34px rgba(99, 230, 255, 0.08);
        }

        .categoryTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .categoryNumber {
          color: #74dff1;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .categoryTag {
          padding: 7px 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          color: #7f96a1;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .categoryGlyph {
          width: 74px;
          height: 50px;
          margin-top: 28px;
          display: flex;
          align-items: flex-end;
          gap: 7px;
        }

        .categoryGlyph span {
          width: 16px;
          border: 1px solid rgba(99, 230, 255, 0.38);
          border-radius: 6px 6px 2px 2px;
          background: linear-gradient(
            180deg,
            rgba(99, 230, 255, 0.18),
            rgba(99, 230, 255, 0.03)
          );
        }

        .categoryGlyph span:nth-child(1) {
          height: 27px;
        }

        .categoryGlyph span:nth-child(2) {
          height: 42px;
        }

        .categoryGlyph span:nth-child(3) {
          height: 35px;
        }

        .categoryCard h3 {
          margin: 23px 0 0;
          font-size: 29px;
          line-height: 1.03;
        }

        .categoryCard p {
          flex: 1;
          color: #96abb5;
          font-size: 14px;
          line-height: 1.68;
        }

        .cardAction {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #8fefff;
          font-size: 11px;
          letter-spacing: 0.04em;
        }

        .cardAction span {
          font-size: 18px;
        }

        .intelligenceGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .intelligenceCard {
          min-height: 90px;
          padding: 20px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          color: #dce9ed;
          background: linear-gradient(
            145deg,
            rgba(10, 29, 44, 0.86),
            rgba(3, 12, 21, 0.94)
          );
          text-decoration: none;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .intelligenceCard span {
          color: #6edff2;
          font-size: 9px;
          font-weight: 900;
        }

        .intelligenceCard strong {
          font-size: 13px;
        }

        .intelligenceCard i {
          color: #e9bd61;
          font-style: normal;
          font-size: 18px;
        }

        .intelligenceCard:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 230, 255, 0.34);
          background: linear-gradient(
            145deg,
            rgba(15, 43, 62, 0.94),
            rgba(4, 15, 25, 0.98)
          );
        }

        .boundary {
          position: relative;
          margin-top: 90px;
          padding: 58px 36px;
          overflow: hidden;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(255, 185, 44, 0.12),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              rgba(8, 20, 33, 0.97),
              rgba(3, 10, 18, 0.99)
            );
          box-shadow:
            0 28px 78px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .boundaryHalo {
          position: absolute;
          inset: -260px auto auto 50%;
          width: 520px;
          height: 520px;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 197, 82, 0.08);
          border-radius: 50%;
        }

        .boundarySeal {
          position: relative;
          z-index: 2;
          width: 82px;
          height: 82px;
          margin: 0 auto 22px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 197, 82, 0.32);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.18);
        }

        .boundarySeal span {
          color: #f2ca75;
          font: 700 23px Georgia, serif;
        }

        .boundarySeal small {
          color: #788b94;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .boundary h2 {
          position: relative;
          z-index: 2;
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundary > p:not(.eyebrow) {
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 24px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          position: relative;
          z-index: 2;
          max-width: 1080px;
          margin: 32px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .boundaryGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .actions {
          position: relative;
          z-index: 2;
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .actions .button {
          justify-self: auto;
        }

        @keyframes rotateOne {
          from {
            transform: rotate(18deg) scaleX(1.16);
          }

          to {
            transform: rotate(378deg) scaleX(1.16);
          }
        }

        @keyframes rotateTwo {
          from {
            transform: rotate(-32deg) scaleY(1.12);
          }

          to {
            transform: rotate(328deg) scaleY(1.12);
          }
        }

        @keyframes driftOne {
          from {
            transform: translate3d(-1%, -1%, 0);
          }

          to {
            transform: translate3d(2%, 1%, 0);
          }
        }

        @keyframes driftTwo {
          from {
            transform: translate3d(1%, 0, 0);
          }

          to {
            transform: translate3d(-2%, 2%, 0);
          }
        }

        @media (max-width: 1180px) {
          .journeyPanel {
            grid-template-columns: 1fr;
          }

          .gatewayGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .categoryGrid,
          .intelligenceGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .heading {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarCenter {
            display: none;
          }

          .heroMeta,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr;
          }

          .quiet,
          .primary {
            justify-self: stretch;
          }

          .button {
            width: 100%;
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .categoryGrid,
          .intelligenceGrid,
          .journey,
          .gatewayLinks {
            grid-template-columns: 1fr;
          }

          .journeyStep i {
            display: none;
          }

          .journeyPanel,
          .boundary {
            padding: 38px 20px;
          }

          .gatewaySection,
          .categorySection,
          .intelligenceSection {
            padding-top: 68px;
          }

          .gatewayCard {
            min-height: auto;
            padding: 23px;
          }

          .gatewayCard h3 {
            font-size: 42px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
