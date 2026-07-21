"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Reviewer = {
  name: string;
  role: string;
  lane: string;
  availability: "Available" | "Limited" | "By Request";
  specialties: string[];
  description: string;
};

const reviewers: Reviewer[] = [
  {
    name: "Partner Review Network",
    role: "Independent Review Network",
    lane: "Multi-Lane Review",
    availability: "By Request",
    specialties: [
      "Entity Review",
      "Governance Architecture",
      "Evidence Integrity",
      "Consequential Routes",
    ],
    description:
      "A bounded network path for review needs that require multiple specialists, independent lanes, or a second-layer TA-14 review.",
  },
  {
    name: "Governance Architecture Reviewer",
    role: "Architecture Review",
    lane: "Scoped Review Candidate",
    availability: "Available",
    specialties: [
      "AI Governance",
      "Authority Boundaries",
      "Runtime Governance",
      "Admissible Execution",
    ],
    description:
      "Reviews whether governance architecture connects evidence, authority, binding, execution, and preserved outcomes without silently merging them.",
  },
  {
    name: "Evidence Integrity Reviewer",
    role: "Evidence and Records Review",
    lane: "Scoped Review Candidate",
    availability: "Available",
    specialties: [
      "Governed Records",
      "Continuity",
      "Record Interpretation",
      "Outcome Evidence",
    ],
    description:
      "Examines what a record proves, what it does not prove, whether continuity is preserved, and where evidence becomes inadmissible or incomplete.",
  },
  {
    name: "Operational Systems Reviewer",
    role: "Operational Environment Review",
    lane: "Specialized Review",
    availability: "Limited",
    specialties: [
      "Buildings",
      "Environmental Systems",
      "Healthcare Environments",
      "Industrial Operations",
    ],
    description:
      "Reviews real-world environments where software, people, machines, measurements, interventions, and consequences interact.",
  },
  {
    name: "EU AI Act Review Route",
    role: "Regulatory Readiness Review",
    lane: "Specialized Laboratory",
    availability: "By Request",
    specialties: [
      "Role Identification",
      "Article 50",
      "High-Risk AI",
      "Evidence Readiness",
    ],
    description:
      "A specialized review path for entities that need to examine EU AI Act roles, obligations, evidence, and implementation boundaries.",
  },
  {
    name: "Partner or Reviewer Candidate",
    role: "Network Qualification Review",
    lane: "Partner-Track Candidate",
    availability: "By Request",
    specialties: [
      "Reviewer Boundaries",
      "Independent Architecture",
      "Referral Lanes",
      "Partner Review Network",
    ],
    description:
      "A route for proposed reviewers, specialists, and governance partners to declare their architecture, boundaries, evidence, and proposed review lane.",
  },
];

const specialties = [
  "All",
  "AI Governance",
  "Governed Records",
  "Evidence Integrity",
  "Governance Architecture",
  "Environmental Systems",
  "EU AI Act",
  "Partner Review Network",
];

export default function ProfessionalMarketplacePage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [query, setQuery] = useState("");

  const filteredReviewers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviewers.filter((reviewer) => {
      const matchesSpecialty =
        selectedSpecialty === "All" ||
        reviewer.specialties.some((specialty) =>
          specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()),
        ) ||
        reviewer.name
          .toLowerCase()
          .includes(selectedSpecialty.toLowerCase());

      const searchable = [
        reviewer.name,
        reviewer.role,
        reviewer.lane,
        reviewer.description,
        ...reviewer.specialties,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesSpecialty &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [query, selectedSpecialty]);

  return (
    <main className="marketplace-page">
      <div className="ambient" aria-hidden="true">
        <span className="nova nova-one" />
        <span className="nova nova-two" />
        <span className="nova nova-three" />
        <span className="moving-line line-one" />
        <span className="moving-line line-two" />
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Reviewer Marketplace</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>

        <nav>
          <Link href="/workspace/entity-review">Entity Review</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/workspace/entity-review/partner-review-network/pricing">
            Partner Network
          </Link>
          <Link className="nav-cta" href="/">
            Four Doors
          </Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">INDEPENDENT REVIEW CAPACITY</p>
          <h1>
            Find the right reviewer
            <span>for the declared review object.</span>
          </h1>
          <p className="lead">
            Reviewer selection begins with scope. Choose the entity, system,
            architecture, record, environmental environment, regulatory duty, or
            consequential route that actually requires review.
          </p>

          <div className="hero-actions">
            <Link className="button primary" href="/workspace/entity-review">
              Begin Entity Review Intake
            </Link>
            <Link
              className="button secondary"
              href="/workspace/entity-review/partner-review-network/pricing"
            >
              Explore Partner Review Network
            </Link>
          </div>

          <div className="boundary-row">
            <span>Independent lanes</span>
            <span>Declared scope</span>
            <span>Visible limitations</span>
            <span>No automatic certification</span>
          </div>
        </div>

        <aside className="market-map">
          <div className="market-core">
            <span>REVIEW</span>
            <strong>MARKETPLACE</strong>
          </div>
          <span className="ring ring-one" />
          <span className="ring ring-two" />
          <span className="ring ring-three" />
          <div className="market-node node-one">Entity</div>
          <div className="market-node node-two">Evidence</div>
          <div className="market-node node-three">Architecture</div>
          <div className="market-node node-four">Environment</div>
          <div className="market-node node-five">Regulation</div>
          <div className="market-node node-six">Outcome</div>
        </aside>
      </section>

      <section className="shell controls-section">
        <div className="section-heading">
          <p className="eyebrow">SEARCH REVIEW CAPACITY</p>
          <h2>Do not choose a reviewer before choosing the review lane.</h2>
          <p>
            A reviewer may be qualified for one declared lane and unqualified for
            another. Search by the actual object, evidence, architecture, or duty
            under review.
          </p>
        </div>

        <div className="controls">
          <label>
            <span>Search reviewers and specialties</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search entity review, evidence, architecture, EU AI Act..."
            />
          </label>

          <div className="filters" aria-label="Reviewer specialty filters">
            {specialties.map((specialty) => (
              <button
                className={selectedSpecialty === specialty ? "active" : ""}
                type="button"
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        <div className="results-heading">
          <strong>{filteredReviewers.length} review routes shown</strong>
          <span>
            Marketplace participation does not itself establish qualification,
            authority, or certification.
          </span>
        </div>

        <div className="reviewer-grid">
          {filteredReviewers.map((reviewer, index) => (
            <article className="reviewer-card" key={reviewer.name}>
              <div className="card-top">
                <span className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`availability ${reviewer.availability
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {reviewer.availability}
                </span>
              </div>

              <p className="lane">{reviewer.lane}</p>
              <h3>{reviewer.name}</h3>
              <strong className="role">{reviewer.role}</strong>
              <p>{reviewer.description}</p>

              <div className="specialty-list">
                {reviewer.specialties.map((specialty) => (
                  <span key={specialty}>{specialty}</span>
                ))}
              </div>

              <div className="card-actions">
                <Link
                  className="button primary"
                  href={`/workspace/entity-review?reviewer=${encodeURIComponent(
                    reviewer.name,
                  )}`}
                >
                  Start Review Intake
                </Link>

                {reviewer.name === "EU AI Act Review Route" ? (
                  <Link className="button ghost" href="/eu-ai-act">
                    Open Laboratory
                  </Link>
                ) : reviewer.name === "Partner Review Network" ||
                  reviewer.name === "Partner or Reviewer Candidate" ? (
                  <Link
                    className="button ghost"
                    href="/workspace/entity-review/partner-review-network/pricing"
                  >
                    View Network
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {filteredReviewers.length === 0 ? (
          <div className="empty-state">
            <span>NO DIRECT MATCH</span>
            <h3>Declare the review need instead.</h3>
            <p>
              The current marketplace view does not contain a matching lane.
              Begin an Entity Review intake so the need can be defined before a
              reviewer is selected.
            </p>
            <Link className="button primary" href="/workspace/entity-review">
              Declare Review Need
            </Link>
          </div>
        ) : null}
      </section>

      <section className="shell process-section">
        <div className="section-heading centered">
          <p className="eyebrow">HOW REVIEWER SELECTION WORKS</p>
          <h2>Selection should follow the evidence and authority boundary.</h2>
        </div>

        <div className="process-grid">
          {[
            [
              "01",
              "Declare the review object",
              "Identify the organization, system, architecture, record, environment, partner, or consequential route.",
            ],
            [
              "02",
              "Define the review question",
              "State what the review must determine and what remains outside scope.",
            ],
            [
              "03",
              "Match the review lane",
              "Find a reviewer whose declared specialty matches the object and question.",
            ],
            [
              "04",
              "Preserve independence",
              "Keep reviewer identity, authority, limitations, conflicts, and dissent visible.",
            ],
            [
              "05",
              "Issue bounded findings",
              "Preserve what was supported, what remained unresolved, and what the review did not establish.",
            ],
          ].map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell network-section">
        <div>
          <p className="eyebrow">PARTNER REVIEW NETWORK</p>
          <h2>Some entities require more than one review lane.</h2>
          <p>
            A consequential system may require governance architecture review,
            evidence review, environmental or operational expertise, regulatory
            review, and a second-layer TA-14 examination. The Partner Review
            Network preserves those lanes rather than pretending one reviewer is
            universally qualified.
          </p>
        </div>

        <div className="network-actions">
          <Link
            className="button primary"
            href="/workspace/entity-review/partner-review-network/pricing"
          >
            Explore Network Participation
          </Link>
          <Link className="button secondary" href="/workspace/entity-review">
            Submit an Entity Review Intake
          </Link>
        </div>
      </section>

      <footer>
        <Link className="brand" href="/">
          <span>TA-14</span>
          <div>
            <strong>Reviewer Marketplace</strong>
            <small>TA-14 AI Governance Exchange</small>
          </div>
        </Link>

        <p>
          Reviewer visibility is not certification. Findings remain bounded by
          declared scope, evidence, authority, and preserved review records.
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
          color: #f9f7ff;
          background: #05060a;
        }

        :global(a) {
          color: inherit;
          text-decoration: none;
        }

        :global(button),
        :global(input) {
          font: inherit;
        }

        .marketplace-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(
              circle at 9% 2%,
              rgba(116, 228, 198, 0.12),
              transparent 27%
            ),
            radial-gradient(
              circle at 91% 10%,
              rgba(255, 197, 71, 0.09),
              transparent 24%
            ),
            linear-gradient(180deg, #06080d 0%, #091016 48%, #05060a 100%);
        }

        .marketplace-page > :not(.ambient) {
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .nova {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          box-shadow:
            0 0 11px #fff,
            0 0 28px rgba(116, 228, 198, 0.95);
          animation: explode 10s ease-in-out infinite;
        }

        .nova-one {
          top: 15%;
          left: 83%;
        }

        .nova-two {
          top: 57%;
          left: 8%;
          animation-delay: -3.2s;
        }

        .nova-three {
          top: 81%;
          left: 69%;
          animation-delay: -6.3s;
        }

        .moving-line {
          position: absolute;
          width: 43vw;
          height: 1px;
          opacity: 0.3;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(116, 228, 198, 0.78),
            transparent
          );
          animation: travel 19s linear infinite;
        }

        .line-one {
          top: 30%;
          left: -50vw;
          transform: rotate(11deg);
        }

        .line-two {
          top: 72%;
          right: -50vw;
          transform: rotate(-14deg);
          animation-delay: -8.5s;
        }

        .orbit {
          position: absolute;
          width: 650px;
          height: 650px;
          border: 1px solid rgba(116, 228, 198, 0.07);
          border-radius: 50%;
          animation: rotate 52s linear infinite;
        }

        .orbit-one {
          top: 6%;
          left: -330px;
        }

        .orbit-two {
          right: -370px;
          top: 44%;
          width: 800px;
          height: 800px;
          animation-direction: reverse;
          animation-duration: 69s;
        }

        .shell {
          width: min(1420px, calc(100% - 34px));
          margin: 0 auto;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          min-height: 76px;
          padding: 13px clamp(18px, 4vw, 62px);
          border-bottom: 1px solid rgba(116, 228, 198, 0.13);
          background: rgba(5, 7, 10, 0.89);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .brand > span {
          display: grid;
          place-items: center;
          min-width: 60px;
          height: 42px;
          padding: 0 9px;
          border: 1px solid rgba(116, 228, 198, 0.5);
          border-radius: 11px;
          color: #8df0d5;
          background: rgba(116, 228, 198, 0.07);
          font-weight: 950;
        }

        .brand div {
          display: grid;
          gap: 2px;
        }

        .brand strong {
          font-size: 0.82rem;
          letter-spacing: 0.08em;
        }

        .brand small {
          color: #798b87;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px;
          border: 1px solid rgba(116, 228, 198, 0.12);
          border-radius: 999px;
          background: rgba(8, 13, 16, 0.77);
        }

        nav a {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          color: #97aaa6;
          font-size: 0.77rem;
          font-weight: 850;
        }

        nav a:hover {
          color: #fff;
          background: rgba(116, 228, 198, 0.08);
        }

        nav .nav-cta {
          color: #06100d;
          background: #74e4c6;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(430px, 0.92fr);
          gap: clamp(45px, 7vw, 100px);
          align-items: center;
          min-height: calc(100vh - 76px);
          padding: 90px 0;
        }

        .eyebrow {
          margin: 0 0 12px;
          color: #74e4c6;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 920px;
          margin-bottom: 25px;
          font-size: clamp(3.6rem, 7vw, 7.2rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        h1 span {
          display: block;
          color: #74e4c6;
        }

        h2 {
          margin-bottom: 18px;
          font-size: clamp(2.25rem, 4.7vw, 4.9rem);
          line-height: 1;
          letter-spacing: -0.054em;
        }

        p {
          color: #9cacaa;
          line-height: 1.72;
        }

        .lead {
          max-width: 830px;
          color: #c9d6d3;
          font-size: clamp(1.08rem, 1.65vw, 1.34rem);
        }

        .hero-actions,
        .network-actions,
        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 19px;
          border: 1px solid transparent;
          border-radius: 12px;
          font-weight: 900;
          transition: 0.18s ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .primary {
          color: #06100d;
          border-color: #74e4c6;
          background: #74e4c6;
        }

        .secondary {
          color: #effffb;
          border-color: rgba(116, 228, 198, 0.26);
          background: rgba(11, 25, 22, 0.83);
        }

        .ghost {
          color: #a8bbb7;
          background: transparent;
        }

        .boundary-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 28px;
        }

        .boundary-row span {
          padding: 7px 10px;
          border: 1px solid rgba(116, 228, 198, 0.15);
          border-radius: 999px;
          color: #91a39f;
          background: rgba(8, 14, 16, 0.67);
          font-size: 0.74rem;
          font-weight: 800;
        }

        .market-map {
          position: relative;
          min-height: 570px;
          border: 1px solid rgba(116, 228, 198, 0.16);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(116, 228, 198, 0.1),
              transparent 48%
            ),
            rgba(7, 12, 14, 0.69);
          box-shadow:
            0 35px 110px rgba(0, 0, 0, 0.42),
            inset 0 0 90px rgba(116, 228, 198, 0.04);
        }

        .market-core {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          display: grid;
          place-items: center;
          width: 155px;
          height: 155px;
          border: 1px solid rgba(141, 240, 213, 0.55);
          border-radius: 50%;
          color: #91f0d6;
          background: radial-gradient(
            circle,
            rgba(116, 228, 198, 0.17),
            rgba(7, 12, 14, 0.96) 70%
          );
          box-shadow: 0 0 60px rgba(116, 228, 198, 0.18);
          transform: translate(-50%, -50%);
          animation: corePulse 4.5s ease-in-out infinite;
        }

        .market-core span,
        .market-core strong {
          display: block;
        }

        .market-core span {
          font-size: 1.2rem;
          font-weight: 950;
        }

        .market-core strong {
          margin-top: -34px;
          font-size: 0.64rem;
          letter-spacing: 0.16em;
        }

        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(116, 228, 198, 0.12);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 37s linear infinite;
        }

        .ring-one {
          width: 235px;
          height: 235px;
        }

        .ring-two {
          width: 365px;
          height: 365px;
          animation-direction: reverse;
          animation-duration: 49s;
        }

        .ring-three {
          width: 490px;
          height: 490px;
          animation-duration: 63s;
        }

        .market-node {
          position: absolute;
          z-index: 4;
          min-width: 112px;
          padding: 11px;
          border: 1px solid rgba(116, 228, 198, 0.2);
          border-radius: 13px;
          color: #c7d9d4;
          text-align: center;
          background: rgba(8, 14, 16, 0.88);
          font-size: 0.79rem;
          font-weight: 850;
        }

        .node-one {
          top: 7%;
          left: 50%;
          transform: translateX(-50%);
        }

        .node-two {
          top: 23%;
          right: 4%;
        }

        .node-three {
          right: 5%;
          bottom: 20%;
        }

        .node-four {
          bottom: 6%;
          left: 50%;
          transform: translateX(-50%);
        }

        .node-five {
          bottom: 20%;
          left: 5%;
        }

        .node-six {
          top: 23%;
          left: 4%;
        }

        .controls-section,
        .process-section {
          padding: 110px 0;
        }

        .section-heading {
          max-width: 980px;
          margin-bottom: 38px;
        }

        .section-heading > p:last-child {
          max-width: 860px;
          font-size: 1.03rem;
        }

        .centered {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .controls {
          display: grid;
          gap: 18px;
          padding: 24px;
          border: 1px solid rgba(116, 228, 198, 0.15);
          border-radius: 22px;
          background: rgba(7, 13, 15, 0.78);
        }

        label {
          display: grid;
          gap: 8px;
        }

        label span {
          color: #c4d2cf;
          font-size: 0.78rem;
          font-weight: 850;
        }

        input {
          width: 100%;
          min-height: 51px;
          padding: 0 14px;
          border: 1px solid rgba(116, 228, 198, 0.17);
          border-radius: 12px;
          color: #f4fffc;
          background: rgba(4, 8, 10, 0.85);
          outline: none;
        }

        input:focus {
          border-color: rgba(141, 240, 213, 0.7);
          box-shadow: 0 0 0 3px rgba(116, 228, 198, 0.07);
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filters button {
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(116, 228, 198, 0.15);
          border-radius: 999px;
          color: #97aaa6;
          cursor: pointer;
          background: rgba(5, 10, 12, 0.66);
          font-size: 0.76rem;
          font-weight: 850;
        }

        .filters button:hover,
        .filters button.active {
          color: #06100d;
          border-color: #74e4c6;
          background: #74e4c6;
        }

        .results-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin: 28px 0 17px;
        }

        .results-heading strong {
          color: #d7e4e1;
        }

        .results-heading span {
          max-width: 660px;
          color: #778884;
          font-size: 0.78rem;
          text-align: right;
        }

        .reviewer-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .reviewer-card {
          display: flex;
          flex-direction: column;
          min-height: 520px;
          padding: 24px;
          border: 1px solid rgba(116, 228, 198, 0.14);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(116, 228, 198, 0.07),
              transparent 32%
            ),
            rgba(7, 13, 15, 0.78);
          box-shadow: 0 25px 75px rgba(0, 0, 0, 0.27);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 26px;
        }

        .card-number {
          color: #74e4c6;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .availability {
          padding: 6px 9px;
          border: 1px solid rgba(116, 228, 198, 0.17);
          border-radius: 999px;
          color: #9cb1ac;
          font-size: 0.67rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .availability.available {
          color: #89e8cf;
        }

        .availability.limited {
          color: #e4c27d;
        }

        .lane {
          margin-bottom: 8px;
          color: #74e4c6;
          font-size: 0.69rem;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .reviewer-card h3 {
          margin-bottom: 7px;
          font-size: 1.45rem;
        }

        .role {
          display: block;
          margin-bottom: 15px;
          color: #c8d5d2;
          font-size: 0.82rem;
        }

        .reviewer-card > p:not(.lane) {
          font-size: 0.9rem;
        }

        .specialty-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin: 18px 0 24px;
        }

        .specialty-list span {
          padding: 6px 8px;
          border: 1px solid rgba(116, 228, 198, 0.13);
          border-radius: 999px;
          color: #90a39e;
          background: rgba(5, 10, 12, 0.58);
          font-size: 0.69rem;
          font-weight: 800;
        }

        .card-actions {
          margin-top: auto;
        }

        .card-actions .button {
          min-height: 43px;
          padding: 0 13px;
          font-size: 0.76rem;
        }

        .empty-state {
          margin-top: 17px;
          padding: 48px;
          border: 1px solid rgba(116, 228, 198, 0.15);
          border-radius: 22px;
          text-align: center;
          background: rgba(7, 13, 15, 0.76);
        }

        .empty-state > span {
          color: #74e4c6;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .empty-state h3 {
          margin: 10px 0;
          font-size: 1.7rem;
        }

        .empty-state p {
          max-width: 680px;
          margin-left: auto;
          margin-right: auto;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 13px;
        }

        .process-grid article {
          min-height: 285px;
          padding: 23px;
          border: 1px solid rgba(116, 228, 198, 0.14);
          border-radius: 20px;
          background: rgba(7, 13, 15, 0.74);
        }

        .process-grid article > span {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          margin-bottom: 28px;
          border: 1px solid rgba(116, 228, 198, 0.3);
          border-radius: 11px;
          color: #74e4c6;
          font-weight: 950;
        }

        .process-grid h3 {
          font-size: 1.1rem;
        }

        .process-grid p {
          margin-bottom: 0;
          font-size: 0.85rem;
        }

        .network-section {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 55px;
          align-items: center;
          margin-bottom: 110px;
          padding: clamp(34px, 6vw, 72px);
          border: 1px solid rgba(255, 197, 71, 0.2);
          border-radius: 29px;
          background:
            radial-gradient(
              circle at 90% 20%,
              rgba(255, 197, 71, 0.09),
              transparent 36%
            ),
            rgba(12, 14, 13, 0.84);
          box-shadow: 0 35px 105px rgba(0, 0, 0, 0.31);
        }

        .network-section > div:first-child {
          max-width: 880px;
        }

        .network-section .eyebrow {
          color: #e8bd5d;
        }

        .network-actions {
          flex-direction: column;
          min-width: 280px;
          margin-top: 0;
        }

        footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
          width: min(1420px, calc(100% - 34px));
          margin: 0 auto;
          padding: 38px 0;
          border-top: 1px solid rgba(116, 228, 198, 0.12);
        }

        footer p {
          max-width: 760px;
          margin: 0;
          color: #6e7f7b;
          font-size: 0.76rem;
          text-align: right;
        }

        @keyframes explode {
          0%,
          83%,
          100% {
            opacity: 0.1;
            transform: scale(0.15);
          }
          87% {
            opacity: 1;
            transform: scale(1.4);
          }
          92% {
            opacity: 0.25;
            transform: scale(7);
          }
        }

        @keyframes travel {
          from {
            transform: translateX(0) rotate(11deg);
          }
          to {
            transform: translateX(170vw) rotate(11deg);
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(0.96);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.04);
          }
        }

        @media (max-width: 1120px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .market-map {
            width: min(620px, 100%);
          }

          .reviewer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .network-section {
            grid-template-columns: 1fr;
          }

          .network-actions {
            min-width: 0;
          }
        }

        @media (max-width: 850px) {
          nav {
            display: none;
          }

          .results-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .results-heading span {
            text-align: left;
          }
        }

        @media (max-width: 650px) {
          .shell {
            width: min(100% - 24px, 1420px);
          }

          .hero,
          .controls-section,
          .process-section {
            padding: 75px 0;
          }

          .market-map {
            min-height: 490px;
            border-radius: 28px;
          }

          .market-node {
            min-width: 96px;
            padding: 8px;
          }

          .reviewer-grid,
          .process-grid {
            grid-template-columns: 1fr;
          }

          footer {
            align-items: flex-start;
            flex-direction: column;
          }

          footer p {
            text-align: left;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .nova,
          .moving-line,
          .orbit,
          .ring,
          .market-core {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
