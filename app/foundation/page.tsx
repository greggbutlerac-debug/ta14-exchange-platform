"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

const foundationDomains = [
  {
    code: "01",
    title: "Institution & Stewardship",
    text: "The named institution, founder, authorship, stewardship, declared ownership, contact route, and responsibility for maintaining the public record.",
    href: "/workspace/ai-governance/registry#foundation",
  },
  {
    code: "02",
    title: "Founding Architecture",
    text: "The TA-14 Admissible Execution Architecture, governing chain, architecture family, scope, claims, non-claims, and declared boundaries.",
    href: "/registry/ta-14-admissible-execution-architecture",
  },
  {
    code: "03",
    title: "Standards Family",
    text: "Named standards, methods, thresholds, route classifications, admissibility disciplines, and implementation requirements associated with TA-14.",
    href: "/workspace/ai-governance/registry#standards",
  },
  {
    code: "04",
    title: "Public Chronology",
    text: "Dated declarations, releases, public milestones, publication history, architecture versions, and institutional development.",
    href: "/workspace/ai-governance/registry#timeline",
  },
  {
    code: "05",
    title: "Books & Articles",
    text: "Published books, technical articles, public explanations, and written works documenting the architecture and its applications.",
    href: "/workspace/ai-governance/registry#publications",
  },
  {
    code: "06",
    title: "Zenodo & Public Deposits",
    text: "Dated public records and research deposits supporting attribution, chronology, provenance, and public inspection.",
    href: "/workspace/ai-governance/registry#publications",
  },
  {
    code: "07",
    title: "GitHub & Technical Artifacts",
    text: "Repositories, code, public platform implementations, demonstrations, records, and technical artifacts associated with TA-14.",
    href: "/workspace/ai-governance/registry#implementations",
  },
  {
    code: "08",
    title: "Filings & Rights Declarations",
    text: "Patent references, filings, ownership declarations, licensing statements, and rights assertions preserved as public claims rather than automatic legal conclusions.",
    href: "/registry/ta-14-admissible-execution-architecture",
  },
  {
    code: "09",
    title: "Reference Implementations",
    text: "Operational examples showing how TA-14 architecture is translated into governed routes, records, review, verification, and execution controls.",
    href: "/workspace",
  },
  {
    code: "10",
    title: "Claims, Challenges & Corrections",
    text: "Declared claims, explicit non-claims, limitations, disputes, objections, corrections, superseded versions, and challenge routes.",
    href: "/registry/about",
  },
];

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];


const institutionTimeline = [
  {
    date: "May 2025",
    title: "Earliest public chain publication",
    text: "The TA-14 governing chain entered the public record through published work describing the route from reality and record through admissibility, execution, and outcome.",
    type: "Publication milestone",
  },
  {
    date: "December 2025",
    title: "Diagnostic and electrical integrity filings",
    text: "Filings preserved the standardized diagnostic, electrical integrity, evidence, and execution concepts associated with the developing TA-14 architecture.",
    type: "Filing milestone",
  },
  {
    date: "January 2026",
    title: "Admissible execution architecture expanded",
    text: "The public architecture developed into an explicit consequence-bearing governance model separating evidence, continuity, authority, binding, commitment, execution, and outcome.",
    type: "Architecture milestone",
  },
  {
    date: "June 2026",
    title: "Books, articles, and standards corpus expanded",
    text: "The public record grew across books, applied articles, environmental integrity governance, atmospheric integrity records, admissible execution, and standards-family material.",
    type: "Public corpus",
  },
  {
    date: "July 2026",
    title: "TA-14 AI Governance Exchange launched",
    text: "The architecture became operational through a public workspace for routes, records, verification, registry functions, demonstrations, and governed implementation.",
    type: "Platform milestone",
  },
  {
    date: "July 2026",
    title: "Foundational Architectural Registry established",
    text: "The architecture family, standards, public chronology, repositories, implementation layers, claims, and boundaries were connected in a dedicated architectural registry.",
    type: "Registry milestone",
  },
];

const claims = [
  "TA-14 claims authorship and stewardship of the named TA-14 architecture family, standards family, public records, and associated reference implementations identified in this record.",
  "TA-14 claims that consequence-bearing execution should remain connected to admissible evidence, current authority, bounded intent, and recorded outcome.",
  "TA-14 claims that records, diagnostic determinations, interventions, optimizations, and outcomes should remain separated so they cannot silently corrupt one another.",
  "TA-14 claims that proof of restraint—when a route is held, denied, or escalated—is a legitimate governance record alongside proof of execution.",
  "TA-14 claims a dated public development history across publications, repositories, filings, demonstrations, architecture pages, and operational implementations.",
];

const nonClaims = [
  "This record does not claim government recognition, accreditation, certification, or standards-body adoption.",
  "Publication dates and registry records do not automatically determine legal ownership, legal priority, patent validity, or exclusivity.",
  "A reference implementation does not prove that every deployment performs correctly or remains suitable for every use.",
  "A public repository does not establish that every stated architectural capability is complete, deployed, or independently validated.",
  "Registration does not substitute for legal review, regulatory judgment, independent technical review, or evidence-based verification of a specific route.",
];

const evidenceDirectory = [
  {
    title: "Books & Long-Form Works",
    text: "Published books preserving the extended reasoning, terminology, architecture, environmental integrity work, atmospheric integrity records, and admissible execution concepts.",
    href: "/workspace/ai-governance/registry#public-record",
    label: "Published corpus",
  },
  {
    title: "Applied Articles",
    text: "Public articles connecting TA-14 architecture to buildings, environmental systems, operational AI, evidence, records, and consequence-bearing execution.",
    href: "/workspace/ai-governance/registry#public-record",
    label: "Applied analysis",
  },
  {
    title: "Zenodo Records",
    text: "Persistent deposits intended to preserve versioned architecture, standards, monographs, and research records for public inspection.",
    href: "/workspace/ai-governance/registry#public-record",
    label: "Persistent deposits",
  },
  {
    title: "GitHub Repositories",
    text: "Public source repositories preserving architecture sites, execution gates, platform code, migrations, schemas, tests, and implementation history.",
    href: "https://github.com/greggbutlerac-debug",
    label: "Technical artifacts",
    external: true,
  },
  {
    title: "Google Sites Archive",
    text: "Public architecture pages preserving foundational concepts, governance models, definitions, lifecycle explanations, and institutional development.",
    href: "/workspace/ai-governance/registry#public-record",
    label: "Architecture archive",
  },
  {
    title: "Demonstrations & Exchange Records",
    text: "Operational examples showing route construction, review, restraint, verification, records, and the translation of architecture into governed workflows.",
    href: "/workspace",
    label: "Operational evidence",
  },
  {
    title: "Registry Records",
    text: "Dated and attributable governance records preserving identity, claims, non-claims, evidence, status, disputes, and version history.",
    href: "/registry",
    label: "Registered declarations",
  },
  {
    title: "Filings & Rights Declarations",
    text: "Patent references, filing chronology, ownership declarations, licensing statements, and bounded rights assertions preserved as public claims.",
    href: "/registry/ta-14-admissible-execution-architecture",
    label: "Rights record",
  },
];

const architectureFamily = [
  {
    title: "Admissible Execution Architecture",
    text: "The governing architecture preserving the route from observed reality through evidence, authority, committed intent, execution, and recorded outcome.",
    href: "/workspace/ai-governance/registry#architecture-family",
  },
  {
    title: "Environmental Integrity Governance",
    text: "Governed evidence, records, interpretation, determination, and consequence controls for land, water, air, buildings, and environmental conditions.",
    href: "/workspace/ai-governance",
  },
  {
    title: "Atmospheric Integrity Records",
    text: "Time-bounded atmospheric records preserving observations, context, continuity, provenance, scope, and declared limitations.",
    href: "/workspace/governed-records",
  },
  {
    title: "Governed Records",
    text: "Records whose identity, source, continuity, limitations, access, correction, reliance, and lifecycle remain explicitly preserved.",
    href: "/workspace/governed-records",
  },
  {
    title: "AI Governance",
    text: "The application of admissible execution, evidence governance, authority, review, restraint, and outcome preservation to consequential AI routes.",
    href: "/workspace/ai-governance",
  },
  {
    title: "Replay Verification",
    text: "Independent re-examination of a preserved route without silently replacing the original determination or erasing its history.",
    href: "/workspace/verification",
  },
  {
    title: "TA-14 Standards Family",
    text: "Named standards, protocols, verification methods, restraint records, conformance boundaries, and implementation expectations.",
    href: "/workspace/ai-governance/registry#standards-family",
  },
  {
    title: "TA-14 AI Governance Exchange",
    text: "The operational workspace connecting routes, records, reviews, verification, registry functions, requirements, demonstrations, and implementation.",
    href: "/workspace",
  },
];

const institutionNavigation = [
  {
    title: "Credentials & Public Record",
    text: "Institutional identity, stewardship, chronology, publications, repositories, claims, non-claims, corrections, and evidence.",
    href: "/foundation",
  },
  {
    title: "Foundational Architectural Registry",
    text: "The canonical architecture record connecting the TA-14 architecture family, standards, implementations, chronology, and registry controls.",
    href: "/workspace/ai-governance/registry",
  },
  {
    title: "AI Governance Registry",
    text: "Individual dated and attributable governance architecture records with status, evidence, claims, non-claims, and version history.",
    href: "/registry",
  },
  {
    title: "TA-14 AI Governance Exchange",
    text: "The operational workspace for building, testing, reviewing, preserving, and verifying consequential governance routes.",
    href: "/workspace",
  },
  {
    title: "Governed Records",
    text: "Create, preserve, inspect, and interpret records without collapsing the record into diagnosis, intervention, or optimization.",
    href: "/workspace/governed-records",
  },
  {
    title: "EU AI Act Requirements",
    text: "Explore requirement pathways and the records used to support declared compliance approaches and implementation boundaries.",
    href: "/workspace/ai-governance/eu-ai-act",
  },
  {
    title: "Partner Review Network",
    text: "Independent bounded review pathways, review roles, partner-track relationships, and specialized governance review.",
    href: "/workspace/entity-review",
  },
  {
    title: "Reference Implementations",
    text: "Public architecture, execution-gate, and Exchange implementations showing how the architecture is translated into operational systems.",
    href: "/workspace/ai-governance/registry#implementations",
  },
];

export default function FoundationPage() {
  return (
    <main className="page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="glow glowBlue" />
        <div className="glow glowGold" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>TA-14 Credentials & Public Record</strong>
            <small>Identity • Claims • Architecture • Evidence</small>
          </span>
        </Link>

        <nav aria-label="Foundation navigation">
          <a href="#credentials-record">Credentials</a>
          <a href="#timeline">Timeline</a>
          <a href="#claims">Claims</a>
          <a href="#evidence-directory">Evidence</a>
          <a href="#architecture-family">Architecture</a>
          <a href="#corrections">Corrections</a>
        </nav>

        <Link className="topAction" href="/workspace">
          Open Exchange
        </Link>
      </header>

      <section className="hero shell">
        <div className="seal" aria-hidden="true">
          <span>TA-14</span>
          <strong>PUBLIC RECORD</strong>
          <i />
          <i />
          <i />
        </div>

        <p className="eyebrow">TA-14 CREDENTIALS & PUBLIC RECORD</p>

        <h1>
          Who we are should be visible
          <em> in one public record.</em>
        </h1>

        <p className="heroLead">
          This is the public credentials entrance for TA-14: institution,
          founder and stewardship identity, declared claims and boundaries,
          founding architecture, chronology, publications, repositories,
          filings, demonstrations, reference implementations, and challenge
          routes.
        </p>

        <div className="heroActions">
          <a className="button gold" href="#evidence-map">
            Explore the Credentials Record <span>↓</span>
          </a>
          <Link className="button primary" href="/workspace/ai-governance/registry">
            Open the Architectural Registry <span>↗</span>
          </Link>
          <Link className="button glass" href="/registry">
            Open the AI Governance Registry <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="hierarchyStrip shell" aria-label="TA-14 institutional hierarchy">
        {[
          "Homepage",
          "Credentials & Public Record",
          "Foundational Architectural Registry",
          "Individual Registry Records",
          "Operational Exchange",
        ].map((item, index, array) => (
          <div key={item}>
            <span>{item}</span>
            {index < array.length - 1 && <b aria-hidden="true">→</b>}
          </div>
        ))}
      </section>

      <section id="credentials-record" className="recordSection shell">
        <div className="recordCopy">
          <span className="status">PUBLIC CREDENTIAL RECORD ACTIVE</span>
          <p className="eyebrow">IDENTITY & STEWARDSHIP</p>
          <h2>TA-14 Authority Governance Institution</h2>
          <p>
            This record is intended to let any visitor inspect who TA-14 says it
            is, who claims and stewards the architecture, what has been
            architected and published, what evidence is publicly available,
            what remains only a declared claim, and where challenge,
            correction, or dispute should be directed.
          </p>

          <div className="identityGrid">
            <div>
              <small>Institution</small>
              <strong>TA-14 Authority Governance Institution</strong>
            </div>
            <div>
              <small>Founder and steward</small>
              <strong>Greggory Don Butler</strong>
            </div>
            <div>
              <small>Public record identifier</small>
              <strong>TA-14-CREDENTIALS-000001</strong>
            </div>
            <div>
              <small>Visibility and status</small>
              <strong>Public • Active</strong>
            </div>
          </div>
        </div>

        <div className="chainPanel">
          <p className="eyebrow">THE TA-14 GOVERNING CHAIN</p>
          <div className="chain">
            {chain.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < chain.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
          <p>
            Each link remains distinguishable so evidence, authority,
            determination, execution, and outcome cannot silently collapse into
            one another.
          </p>
        </div>
      </section>

      <section id="evidence-map" className="mapSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">CREDENTIALS & EVIDENCE MAP</p>
          <h2>Every category of public proof in one entrance.</h2>
          <p>
            Each category answers a different question: who claims the work,
            what was created, when it appeared, where it was published, what
            was implemented, and what remains bounded, disputed, or unverified.
          </p>
        </div>

        <div className="foundationGrid">
          {foundationDomains.map((item, index) => (
            <Link
              href={item.href}
              className="foundationCard"
              key={item.title}
              style={{ "--delay": `${index * 0.04}s` } as CSSProperties}
            >
              <span>{item.code}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div>
                Open record <b>→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="timeline" className="institutionSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">INSTITUTION TIMELINE</p>
          <h2>A dated record of architectural and institutional development.</h2>
          <p>
            The chronology below preserves major public milestones without treating any single
            publication, filing, repository, or platform release as the entire TA-14 record.
          </p>
        </div>

        <div className="institutionTimeline">
          {institutionTimeline.map((item, index) => (
            <article key={`${item.date}-${item.title}`}>
              <div className="timelineIndex">{String(index + 1).padStart(2, "0")}</div>
              <div className="timelineDate">{item.date}</div>
              <div>
                <span>{item.type}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="claims" className="claimsSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">CLAIMS & NON-CLAIMS</p>
          <h2>What TA-14 declares—and what this record does not establish.</h2>
          <p>
            Institutional credibility requires affirmative claims to remain distinguishable from
            limitations, legal conclusions, certification, and independent validation.
          </p>
        </div>

        <div className="claimsGrid">
          <article>
            <span className="claimLabel">TA-14 DECLARES</span>
            <ul>
              {claims.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article>
            <span className="nonClaimLabel">THIS RECORD DOES NOT ESTABLISH</span>
            <ul>
              {nonClaims.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="evidence-directory" className="institutionSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">PUBLIC EVIDENCE DIRECTORY</p>
          <h2>The public record is distributed across multiple evidence channels.</h2>
          <p>
            No single website, repository, publication, filing, or demonstration is treated as the
            entire proof record. Each channel preserves a different relationship to identity,
            chronology, architecture, implementation, or declared rights.
          </p>
        </div>

        <div className="evidenceDirectory">
          {evidenceDirectory.map((item, index) =>
            item.external ? (
              <a
                key={item.title}
                className="evidenceCard"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{ "--delay": `${index * 0.035}s` } as CSSProperties}
              >
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <b>Open evidence channel ↗</b>
              </a>
            ) : (
              <Link
                key={item.title}
                className="evidenceCard"
                href={item.href}
                style={{ "--delay": `${index * 0.035}s` } as CSSProperties}
              >
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <b>Open evidence channel →</b>
              </Link>
            ),
          )}
        </div>
      </section>

      <section id="architecture-family" className="architectureSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">TA-14 ARCHITECTURAL FAMILY</p>
          <h2>A connected institutional architecture, not isolated product claims.</h2>
          <p>
            Each domain occupies a defined role in the route from reality and record to review,
            restraint, execution, and outcome.
          </p>
        </div>

        <div className="architectureFamilyGrid">
          {architectureFamily.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="architectureFamilyCard"
              style={{ "--delay": `${index * 0.04}s` } as CSSProperties}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <b>Explore architecture →</b>
            </Link>
          ))}
        </div>
      </section>

      <section id="corrections" className="correctionsSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">CHALLENGES, CORRECTIONS & VERSION HISTORY</p>
          <h2>A public record must provide a route to challenge the record.</h2>
          <p>
            TA-14 treats correction, dispute, supersession, and transparent limitation as part of
            institutional integrity rather than as damage to be concealed.
          </p>
        </div>

        <div className="correctionGrid">
          <article>
            <span>01</span>
            <h3>Challenge route</h3>
            <p>
              Attribution, ownership, scope, chronology, evidence, implementation, and material
              accuracy may be challenged through a documented review route.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Correction policy</h3>
            <p>
              Confirmed errors should be corrected without erasing the prior public state, the date
              of correction, or the reason for the change.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Superseded records</h3>
            <p>
              Material revisions create a new version linked to the earlier record rather than
              silently replacing history.
            </p>
          </article>
          <article>
            <span>04</span>
            <h3>Dispute preservation</h3>
            <p>
              A dispute may remain visible alongside the original claim so later readers can inspect
              the challenge, response, status, and supporting evidence.
            </p>
          </article>
          <article>
            <span>05</span>
            <h3>Transparency statement</h3>
            <p>
              This page distinguishes public proof, TA-14 declarations, third-party evidence,
              implementation status, and matters that require independent judgment.
            </p>
          </article>
          <article>
            <span>06</span>
            <h3>Current public version</h3>
            <p>
              The credentials record remains active and expanding. New releases should preserve
              effective dates, relationships, and the version they supersede.
            </p>
          </article>
        </div>
      </section>

      <section id="boundary" className="boundarySection shell">
        <div>
          <p className="eyebrow">CREDENTIALS BOUNDARY</p>
          <h2>Public proof is not the same as independent validation.</h2>
          <p>
            This credentials record documents identity, stewardship,
            architecture, chronology, publications, repositories, filings,
            implementations, claims, non-claims, and declared boundaries. It
            does not automatically provide legal priority, regulatory approval,
            accreditation, certification, independent validation, or proof that
            any implementation performs as claimed.
          </p>
        </div>

        <div className="boundaryGrid">
          <article>
            <strong>The credentials record preserves</strong>
            <p>
              Architecture, chronology, stewardship, public evidence,
              publications, repositories, versions, relationships, and
              declared scope.
            </p>
          </article>
          <article>
            <strong>The Registry preserves</strong>
            <p>
              Individual dated and attributable governance records, including
              claims, non-claims, evidence, status, and version history.
            </p>
          </article>
          <article>
            <strong>Verification must still establish</strong>
            <p>
              Whether a specific implementation, route, execution, or outcome
              remains supported by admissible evidence.
            </p>
          </article>
        </div>
      </section>

      <section className="institutionNavigation shell">
        <div className="sectionHeading">
          <p className="eyebrow">TA-14 INSTITUTION NAVIGATION</p>
          <h2>Move from identity into architecture, records, requirements, review, and execution.</h2>
          <p>
            Each destination serves a different institutional responsibility and should not be
            treated as interchangeable with the others.
          </p>
        </div>

        <div className="institutionNavigationGrid">
          {institutionNavigation.map((item) => (
            <Link key={item.title} href={item.href}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="closing shell">
        <p className="eyebrow">TA-14 CREDENTIALS & PUBLIC RECORD</p>
        <h2>Start with who we are. Then inspect what we built.</h2>
        <div className="heroActions">
          <Link className="button gold" href="/workspace/ai-governance/registry">
            Open Architectural Registry <span>↗</span>
          </Link>
          <Link className="button primary" href="/workspace">
            Enter the Exchange <span>↗</span>
          </Link>
        </div>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 Credentials & Public Record</span>
        <span>Identity • Claims • Architecture • Publications • Evidence</span>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #020711;
          --text: #f5f9ff;
          --muted: #a9bac6;
          --blue: #72dff0;
          --gold: #f1c36d;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: var(--bg);
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 0%, rgba(31, 104, 164, 0.2), transparent 34%),
            linear-gradient(180deg, #020711, #07121e 55%, #020711);
        }

        .shell {
          width: min(1320px, calc(100% - 40px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .hierarchyStrip {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 22px;
          border-radius: 20px;
          border: 1px solid rgba(123, 208, 232, 0.17);
          background: rgba(4, 17, 29, 0.78);
          box-shadow: 0 20px 70px rgba(0, 0, 0, 0.24);
        }

        .hierarchyStrip div {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .hierarchyStrip span {
          min-height: 40px;
          display: grid;
          place-items: center;
          padding: 0 13px;
          border-radius: 12px;
          border: 1px solid rgba(109, 216, 255, 0.15);
          background: rgba(7, 26, 41, 0.8);
          color: #d7e9f3;
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .hierarchyStrip div:nth-child(2) span {
          color: var(--gold);
          border-color: rgba(242, 191, 109, 0.34);
        }

        .hierarchyStrip b {
          color: var(--gold);
        }

        .cosmos {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -2;
        }

        .stars {
          position: absolute;
          inset: -15%;
        }

        .starsOne {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 0 1px,
            transparent 1.4px
          );
          background-size: 96px 96px;
          animation: drift 50s linear infinite;
        }

        .starsTwo {
          background-image: radial-gradient(
            circle,
            rgba(102, 214, 241, 0.72) 0 1px,
            transparent 1.5px
          );
          background-size: 161px 161px;
          animation: drift 68s linear infinite reverse;
        }

        .glow {
          position: absolute;
          width: 680px;
          height: 680px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .glowBlue {
          left: -300px;
          top: 12%;
          background: #087ed2;
        }

        .glowGold {
          right: -340px;
          top: 40%;
          background: #c78220;
        }

        .route {
          position: absolute;
          width: 85vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(111, 218, 239, 0.5),
            rgba(242, 191, 109, 0.45),
            transparent
          );
        }

        .routeOne {
          top: 28%;
          left: -20%;
          transform: rotate(-8deg);
          animation: routeMove 18s linear infinite;
        }

        .routeTwo {
          top: 70%;
          right: -25%;
          transform: rotate(10deg);
          animation: routeMove 24s linear infinite reverse;
        }

        .topbar {
          width: min(1480px, calc(100% - 36px));
          min-height: 76px;
          margin: 18px auto 0;
          padding: 12px 14px 12px 18px;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(123, 208, 232, 0.18);
          border-radius: 20px;
          background: rgba(2, 10, 19, 0.74);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brandMark {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(242, 191, 109, 0.44);
          color: var(--gold);
          background: rgba(117, 72, 13, 0.18);
          font-size: 12px;
          font-weight: 950;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .brand small {
          color: #8fa7b7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .topbar nav {
          display: flex;
          gap: 7px;
        }

        .topbar nav a {
          padding: 10px 12px;
          border-radius: 11px;
          color: #b6c8d4;
          font-size: 11px;
          font-weight: 850;
        }

        .topbar nav a:hover {
          color: white;
          background: rgba(109, 216, 255, 0.08);
        }

        .topAction {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137, 205, 255, 0.27);
          background: linear-gradient(
            180deg,
            rgba(34, 79, 112, 0.76),
            rgba(8, 27, 43, 0.88)
          );
          font-size: 11px;
          font-weight: 900;
        }

        .hero {
          padding: 100px 0 105px;
          text-align: center;
        }

        .seal {
          width: 190px;
          height: 190px;
          margin: 0 auto 30px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid rgba(242, 191, 109, 0.56);
          background: radial-gradient(
            circle,
            rgba(83, 200, 224, 0.18),
            rgba(6, 21, 34, 0.95) 62%
          );
          box-shadow:
            0 0 70px rgba(74, 195, 225, 0.18),
            inset 0 0 35px rgba(255, 192, 66, 0.08);
        }

        .seal span {
          color: var(--blue);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2em;
        }

        .seal strong {
          margin-top: 8px;
          color: #ffe3a2;
          font-family: Georgia, serif;
          font-size: 23px;
          letter-spacing: 0.05em;
        }

        .seal i {
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          border: 1px solid rgba(111, 218, 239, 0.24);
          animation: spin 15s linear infinite;
        }

        .seal i:nth-of-type(2) {
          inset: 32px;
          border-color: rgba(242, 191, 109, 0.25);
          animation-direction: reverse;
          animation-duration: 11s;
        }

        .seal i:nth-of-type(3) {
          inset: -22px;
          border-color: rgba(197, 126, 255, 0.18);
          animation-duration: 22s;
        }

        .eyebrow {
          margin: 0;
          color: var(--gold);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
        }

        .hero h1,
        .recordCopy h2,
        .sectionHeading h2,
        .boundarySection h2,
        .closing h2 {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.048em;
          text-wrap: balance;
        }

        .hero h1 {
          max-width: 1120px;
          margin: 18px auto 22px;
          font-size: clamp(52px, 7.2vw, 100px);
          line-height: 0.95;
          font-weight: 500;
        }

        .hero h1 em {
          color: #ffc95c;
          font-style: italic;
        }

        .heroLead {
          max-width: 960px;
          margin: 0 auto;
          color: #c0d0da;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
        }

        .button {
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 12px;
          font-weight: 950;
          transition: transform 0.22s ease;
        }

        .button:hover {
          transform: translateY(-3px);
        }

        .button.primary {
          color: #031019;
          border-color: #a8effa;
          background: linear-gradient(135deg, #c7f5ff, #68d2ec 62%, #339fc1);
        }

        .button.gold {
          color: #281600;
          border-color: #f6d487;
          background: linear-gradient(135deg, #fff0b0, #efbd58 62%, #b66e12);
        }

        .button.glass {
          color: #e8f8ff;
          border-color: rgba(124, 215, 236, 0.28);
          background: linear-gradient(
            180deg,
            rgba(18, 49, 68, 0.9),
            rgba(7, 24, 38, 0.92)
          );
        }

        .recordSection {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 24px;
          padding: 90px 0;
        }

        .recordCopy,
        .chainPanel {
          padding: 38px;
          border-radius: 28px;
          border: 1px solid rgba(112, 210, 234, 0.17);
          background: linear-gradient(
            145deg,
            rgba(12, 35, 51, 0.92),
            rgba(5, 16, 28, 0.97)
          );
        }

        .status {
          display: inline-flex;
          min-height: 31px;
          align-items: center;
          padding: 0 11px;
          margin-bottom: 24px;
          border-radius: 999px;
          border: 1px solid rgba(242, 191, 109, 0.3);
          color: #ffdf9c;
          background: rgba(104, 62, 10, 0.16);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .recordCopy h2,
        .sectionHeading h2,
        .boundarySection h2,
        .closing h2 {
          margin: 12px 0 16px;
          font-size: clamp(40px, 5vw, 68px);
          line-height: 1;
          font-weight: 500;
        }

        .recordCopy > p:last-of-type,
        .sectionHeading > p:last-child,
        .boundarySection > div:first-child > p:last-child {
          color: var(--muted);
          line-height: 1.75;
        }

        .identityGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 28px;
        }

        .identityGrid div {
          padding: 15px;
          border-radius: 14px;
          border: 1px solid rgba(109, 216, 255, 0.14);
          background: rgba(4, 20, 33, 0.72);
        }

        .identityGrid small {
          display: block;
          color: #8099aa;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .identityGrid strong {
          display: block;
          margin-top: 7px;
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .chain {
          display: grid;
          gap: 9px;
          margin-top: 24px;
        }

        .chain > div {
          min-height: 48px;
          display: grid;
          grid-template-columns: 42px 1fr 24px;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(242, 191, 109, 0.16);
          background: rgba(71, 45, 9, 0.11);
        }

        .chain span {
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
        }

        .chain strong {
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .chain i {
          color: var(--gold);
          font-style: normal;
        }

        .chainPanel > p:last-child {
          color: #9fb0bb;
          font-size: 12px;
          line-height: 1.65;
        }

        .mapSection {
          padding: 100px 0;
        }

        .institutionSection,
        .architectureSection,
        .claimsSection,
        .correctionsSection,
        .institutionNavigation {
          padding: 100px 0;
        }

        .institutionTimeline {
          position: relative;
          display: grid;
          gap: 12px;
          margin-top: 42px;
        }

        .institutionTimeline::before {
          content: "";
          position: absolute;
          left: 24px;
          top: 24px;
          bottom: 24px;
          width: 1px;
          background: linear-gradient(var(--blue), var(--gold));
          opacity: 0.45;
        }

        .institutionTimeline article {
          position: relative;
          display: grid;
          grid-template-columns: 50px 150px 1fr;
          gap: 20px;
          align-items: start;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(109, 216, 255, 0.15);
          background: linear-gradient(145deg, rgba(11, 33, 50, 0.9), rgba(4, 15, 26, 0.96));
        }

        .timelineIndex {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #071e30;
          border: 1px solid rgba(109, 216, 255, 0.35);
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
          z-index: 2;
        }

        .timelineDate {
          padding-top: 7px;
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 15px;
        }

        .institutionTimeline article > div:last-child > span {
          color: var(--blue);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .institutionTimeline h3 {
          margin: 8px 0 8px;
          font-family: Georgia, serif;
          font-size: 24px;
          font-weight: 500;
        }

        .institutionTimeline p {
          margin: 0;
          color: #9fb1bc;
          font-size: 13px;
          line-height: 1.68;
        }

        .claimsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 40px;
        }

        .claimsGrid article {
          padding: 30px;
          border-radius: 24px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background: linear-gradient(145deg, rgba(10, 34, 49, 0.94), rgba(4, 15, 25, 0.98));
        }

        .claimsGrid article:last-child {
          border-color: rgba(242, 191, 109, 0.22);
          background: linear-gradient(145deg, rgba(52, 35, 13, 0.42), rgba(7, 16, 24, 0.98));
        }

        .claimLabel,
        .nonClaimLabel {
          display: inline-flex;
          min-height: 30px;
          align-items: center;
          padding: 0 11px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .claimLabel {
          color: var(--blue);
          border: 1px solid rgba(109, 216, 255, 0.25);
          background: rgba(22, 101, 123, 0.12);
        }

        .nonClaimLabel {
          color: var(--gold);
          border: 1px solid rgba(242, 191, 109, 0.28);
          background: rgba(109, 68, 13, 0.14);
        }

        .claimsGrid ul {
          margin: 24px 0 0;
          padding-left: 22px;
        }

        .claimsGrid li {
          margin: 14px 0;
          color: #afc0ca;
          line-height: 1.65;
          font-size: 13px;
        }

        .evidenceDirectory {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .evidenceCard {
          min-height: 270px;
          padding: 23px;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          border: 1px solid rgba(109, 216, 255, 0.15);
          background: linear-gradient(145deg, rgba(10, 32, 49, 0.9), rgba(4, 15, 26, 0.97));
          animation: rise 0.6s ease both;
          animation-delay: var(--delay);
          transition: transform 0.22s ease, border-color 0.22s ease;
        }

        .evidenceCard:hover {
          transform: translateY(-5px);
          border-color: rgba(242, 191, 109, 0.38);
        }

        .evidenceCard > span {
          color: var(--blue);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .evidenceCard h3 {
          margin: 25px 0 10px;
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 500;
        }

        .evidenceCard p {
          margin: 0;
          color: #9fb1bc;
          font-size: 12px;
          line-height: 1.68;
        }

        .evidenceCard b {
          margin-top: auto;
          padding-top: 24px;
          color: var(--gold);
          font-size: 10px;
        }

        .architectureFamilyGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .architectureFamilyCard {
          min-height: 280px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border-radius: 21px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background:
            radial-gradient(circle at 100% 0%, rgba(109, 216, 255, 0.09), transparent 38%),
            linear-gradient(150deg, rgba(11, 34, 52, 0.92), rgba(4, 15, 26, 0.98));
          animation: rise 0.6s ease both;
          animation-delay: var(--delay);
          transition: transform 0.22s ease, border-color 0.22s ease;
        }

        .architectureFamilyCard:hover {
          transform: translateY(-5px);
          border-color: rgba(242, 191, 109, 0.4);
        }

        .architectureFamilyCard > span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 13px;
          letter-spacing: 0.12em;
        }

        .architectureFamilyCard h3 {
          margin: 36px 0 11px;
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 500;
        }

        .architectureFamilyCard p {
          margin: 0;
          color: #9fb1bc;
          font-size: 12px;
          line-height: 1.68;
        }

        .architectureFamilyCard b {
          margin-top: auto;
          padding-top: 22px;
          color: var(--blue);
          font-size: 10px;
        }

        .correctionGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .correctionGrid article {
          min-height: 235px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(242, 191, 109, 0.18);
          background: linear-gradient(145deg, rgba(44, 31, 13, 0.28), rgba(5, 16, 27, 0.97));
        }

        .correctionGrid span {
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .correctionGrid h3 {
          margin: 34px 0 10px;
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 500;
        }

        .correctionGrid p {
          margin: 0;
          color: #a3b4bf;
          font-size: 12px;
          line-height: 1.68;
        }

        .institutionNavigationGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 40px;
        }

        .institutionNavigationGrid > a {
          min-height: 155px;
          padding: 23px;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          border-radius: 19px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background: rgba(5, 19, 31, 0.84);
          transition: transform 0.22s ease, border-color 0.22s ease;
        }

        .institutionNavigationGrid > a:hover {
          transform: translateY(-4px);
          border-color: rgba(242, 191, 109, 0.38);
        }

        .institutionNavigationGrid h3 {
          margin: 0 0 10px;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 500;
        }

        .institutionNavigationGrid p {
          margin: 0;
          color: #9fb1bc;
          font-size: 12px;
          line-height: 1.65;
        }

        .institutionNavigationGrid > a > span {
          color: var(--gold);
          font-size: 22px;
        }

        .sectionHeading {
          max-width: 950px;
        }

        .foundationGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .foundationCard {
          min-height: 255px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          border-radius: 22px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background:
            radial-gradient(circle at 100% 0%, rgba(109, 216, 255, 0.08), transparent 38%),
            linear-gradient(155deg, rgba(12, 35, 54, 0.92), rgba(4, 15, 26, 0.97));
          transition:
            transform 0.24s ease,
            border-color 0.24s ease;
          animation: rise 0.6s ease both;
          animation-delay: var(--delay);
        }

        .foundationCard:hover {
          transform: translateY(-6px);
          border-color: rgba(242, 191, 109, 0.44);
        }

        .foundationCard > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(109, 216, 255, 0.28);
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
        }

        .foundationCard h3 {
          margin: 24px 0 10px;
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 500;
        }

        .foundationCard p {
          margin: 0;
          color: #9fb1bc;
          font-size: 13px;
          line-height: 1.68;
        }

        .foundationCard div {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 24px;
          color: #ddf4ff;
          font-size: 11px;
          font-weight: 900;
        }

        .boundarySection {
          padding: 70px 42px;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(circle at 0 0, rgba(183, 112, 26, 0.14), transparent 35%),
            linear-gradient(145deg, rgba(11, 28, 43, 0.95), rgba(4, 13, 23, 0.98));
        }

        .boundarySection > div:first-child {
          max-width: 930px;
        }

        .boundaryGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 34px;
        }

        .boundaryGrid article {
          padding: 22px;
          border-radius: 17px;
          border: 1px solid rgba(109, 216, 255, 0.14);
          background: rgba(5, 20, 33, 0.73);
        }

        .boundaryGrid strong {
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .boundaryGrid p {
          color: #9fb0bc;
          font-size: 12px;
          line-height: 1.65;
        }

        .closing {
          margin-top: 110px;
          padding: 78px 32px;
          text-align: center;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(circle at 50% 0%, rgba(242, 191, 109, 0.12), transparent 40%),
            linear-gradient(145deg, rgba(24, 25, 29, 0.94), rgba(5, 15, 25, 0.98));
        }

        .closing > strong {
          display: block;
          margin-top: 30px;
          color: #f4dfa7;
          font-family: Georgia, serif;
        }

        footer {
          min-height: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #768c9b;
          font-size: 11px;
        }

        @keyframes drift {
          to {
            transform: translate3d(120px, 90px, 0);
          }
        }

        @keyframes routeMove {
          from {
            translate: -30vw 0;
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.35;
          }
          to {
            translate: 120vw 0;
            opacity: 0;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1050px) {
          .topbar nav {
            display: none;
          }

          .recordSection {
            grid-template-columns: 1fr;
          }

          .evidenceDirectory,
          .architectureFamilyGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .correctionGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: min(100% - 24px, 1320px);
          }

          .topbar {
            width: min(100% - 22px, 1480px);
          }

          .brand small,
          .topAction {
            display: none;
          }

          .hero {
            padding: 76px 0 82px;
          }

          .heroLead {
            font-size: 16px;
          }

          .heroActions .button {
            width: 100%;
            justify-content: center;
          }

          .recordCopy,
          .chainPanel,
          .boundarySection {
            padding: 28px 20px;
          }

          .foundationGrid,
          .identityGrid,
          .boundaryGrid,
          .claimsGrid,
          .evidenceDirectory,
          .architectureFamilyGrid,
          .correctionGrid,
          .institutionNavigationGrid {
            grid-template-columns: 1fr;
          }

          .hierarchyStrip {
            align-items: stretch;
          }

          .hierarchyStrip div {
            flex: 1 1 100%;
          }

          .hierarchyStrip span {
            flex: 1;
          }

          .hierarchyStrip b {
            transform: rotate(90deg);
          }

          .institutionTimeline article {
            grid-template-columns: 42px 1fr;
          }

          .timelineDate {
            grid-column: 2;
            padding-top: 0;
          }

          .institutionTimeline article > div:last-child {
            grid-column: 2;
          }

          footer {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
