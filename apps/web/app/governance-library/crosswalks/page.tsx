"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SupportStatus =
  | "Supported"
  | "Partial"
  | "Not Explicit"
  | "Review Required";

type CrosswalkRow = {
  id: string;
  concept: string;
  category: string;
  description: string;
  eu: SupportStatus;
  nist: SupportStatus;
  iso42001: SupportStatus;
  iso23894: SupportStatus;
  oecd: SupportStatus;
  ta14: string;
  evidence: string[];
  route: string;
};

const crosswalkRows: CrosswalkRow[] = [
  {
    id: "risk-management",
    concept: "Risk Management",
    category: "Risk",
    description:
      "The structured identification, analysis, evaluation, treatment, monitoring, and review of AI-related risk.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Supported",
    ta14:
      "Risk claims are converted into evidence-bound admissibility gates, review thresholds, and controlled execution conditions.",
    evidence: [
      "Risk Register",
      "Risk Assessment",
      "Risk Treatment Decision",
      "Residual Risk Record",
      "Monitoring Criteria",
    ],
    route: "TA-14 Risk and Evidence Route",
  },
  {
    id: "human-oversight",
    concept: "Human Oversight",
    category: "Authority",
    description:
      "The allocation of meaningful human authority, intervention capability, escalation responsibility, and review control.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Partial",
    oecd: "Partial",
    ta14:
      "Human oversight is mapped to authority validation, escalation rights, intervention evidence, and preserved decision accountability.",
    evidence: [
      "Authority Record",
      "Oversight Plan",
      "Escalation Procedure",
      "Intervention Log",
      "Review Decision",
    ],
    route: "TA-14 Authority and Oversight Route",
  },
  {
    id: "technical-documentation",
    concept: "Technical Documentation",
    category: "Documentation",
    description:
      "The structured documentation necessary to understand a system, its intended purpose, design, limitations, controls, and performance.",
    eu: "Supported",
    nist: "Partial",
    iso42001: "Supported",
    iso23894: "Partial",
    oecd: "Partial",
    ta14:
      "Documentation becomes governed evidence only when source identity, version, continuity, authority, and execution relevance are preserved.",
    evidence: [
      "System Description",
      "Model Documentation",
      "Data Documentation",
      "Version Record",
      "Change History",
    ],
    route: "TA-14 Governed Documentation Route",
  },
  {
    id: "data-governance",
    concept: "Data Governance",
    category: "Data",
    description:
      "The governance of data quality, provenance, relevance, representativeness, access, processing, retention, and use.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Partial",
    ta14:
      "Data cannot support execution unless its identity, provenance, integrity, authorized use, and relationship to the decision are established.",
    evidence: [
      "Data Inventory",
      "Data Provenance Record",
      "Quality Assessment",
      "Access Record",
      "Retention Policy",
    ],
    route: "TA-14 Data Admissibility Route",
  },
  {
    id: "transparency",
    concept: "Transparency",
    category: "Trustworthiness",
    description:
      "The disclosure and communication necessary for affected parties, operators, reviewers, and authorities to understand AI use and limitations.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Partial",
    oecd: "Supported",
    ta14:
      "Transparency is preserved as attributable disclosure evidence tied to system identity, operating context, decision boundaries, and affected parties.",
    evidence: [
      "Transparency Notice",
      "User Disclosure",
      "System Limitation Record",
      "Decision Explanation",
      "Affected-Party Communication",
    ],
    route: "TA-14 Transparency Evidence Route",
  },
  {
    id: "accountability",
    concept: "Accountability",
    category: "Authority",
    description:
      "The assignment and preservation of responsibility for governance decisions, operational actions, review, and outcomes.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Partial",
    oecd: "Supported",
    ta14:
      "Accountability requires attributable actors, validated authority, bound decisions, execution receipts, and preserved outcome evidence.",
    evidence: [
      "Responsibility Matrix",
      "Authority Assignment",
      "Approval Record",
      "Execution Receipt",
      "Outcome Review",
    ],
    route: "TA-14 Accountability Route",
  },
  {
    id: "testing-validation",
    concept: "Testing and Validation",
    category: "Assurance",
    description:
      "The structured examination of system performance, reliability, safety, limitations, and control effectiveness.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Partial",
    ta14:
      "Testing evidence is evaluated for method, scope, authority, continuity, limitations, and relevance before it can support execution.",
    evidence: [
      "Test Plan",
      "Validation Results",
      "Performance Thresholds",
      "Failure Record",
      "Independent Review",
    ],
    route: "TA-14 Testing and Assurance Route",
  },
  {
    id: "logging-traceability",
    concept: "Logging and Traceability",
    category: "Evidence",
    description:
      "The preservation of records capable of reconstructing system activity, decisions, changes, interventions, and outcomes.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Partial",
    oecd: "Partial",
    ta14:
      "Logs become admissible records only when identity, time, sequence, integrity, custody, continuity, and decision relevance are preserved.",
    evidence: [
      "System Log",
      "Decision Record",
      "Change Log",
      "Chain-of-Custody Record",
      "Replay Package",
    ],
    route: "TA-14 Traceability and Replay Route",
  },
  {
    id: "incident-management",
    concept: "Incident Management",
    category: "Operations",
    description:
      "The detection, reporting, containment, investigation, correction, and review of AI-related incidents and failures.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Partial",
    ta14:
      "Incident evidence can trigger HOLD, DENY, ESCALATE, corrective action, revalidation, and preservation of the post-incident outcome.",
    evidence: [
      "Incident Report",
      "Containment Record",
      "Root-Cause Analysis",
      "Corrective Action",
      "Revalidation Record",
    ],
    route: "TA-14 Incident Revalidation Route",
  },
  {
    id: "post-market-monitoring",
    concept: "Post-Market Monitoring",
    category: "Lifecycle",
    description:
      "The continuous collection and evaluation of operational evidence after deployment.",
    eu: "Supported",
    nist: "Partial",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Partial",
    ta14:
      "New operational evidence can invalidate prior assumptions and trigger runtime revalidation before further execution is permitted.",
    evidence: [
      "Monitoring Plan",
      "Operational Metrics",
      "Drift Record",
      "Complaint Record",
      "Revalidation Decision",
    ],
    route: "TA-14 Continuous Admissibility Route",
  },
  {
    id: "impact-assessment",
    concept: "Impact Assessment",
    category: "Risk",
    description:
      "The evaluation of foreseeable effects on people, rights, safety, organizations, infrastructure, and society.",
    eu: "Supported",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Supported",
    ta14:
      "Impact claims are separated from proof and bound to declared scope, affected parties, evidence quality, uncertainty, and authorized review.",
    evidence: [
      "Impact Assessment",
      "Affected-Party Analysis",
      "Rights Review",
      "Safety Assessment",
      "Mitigation Record",
    ],
    route: "TA-14 Impact Admissibility Route",
  },
  {
    id: "change-management",
    concept: "Change Management",
    category: "Lifecycle",
    description:
      "The governance of system, model, data, configuration, purpose, ownership, and operating-environment changes.",
    eu: "Partial",
    nist: "Supported",
    iso42001: "Supported",
    iso23894: "Supported",
    oecd: "Not Explicit",
    ta14:
      "A material change breaks prior continuity until the new state, authority, evidence, controls, and execution conditions are revalidated.",
    evidence: [
      "Change Request",
      "Impact Review",
      "Version Record",
      "Approval Record",
      "Post-Change Validation",
    ],
    route: "TA-14 Change Revalidation Route",
  },
];

const sourceOptions = [
  { id: "eu", label: "EU AI Act" },
  { id: "nist", label: "NIST AI RMF" },
  { id: "iso42001", label: "ISO/IEC 42001" },
  { id: "iso23894", label: "ISO/IEC 23894" },
  { id: "oecd", label: "OECD AI Principles" },
] as const;

type SourceId = (typeof sourceOptions)[number]["id"];

const categories = [
  "All Categories",
  "Risk",
  "Authority",
  "Documentation",
  "Data",
  "Trustworthiness",
  "Assurance",
  "Evidence",
  "Operations",
  "Lifecycle",
];

function statusClass(status: SupportStatus) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export default function CrosswalksPage() {
  const [primarySource, setPrimarySource] =
    useState<SourceId>("eu");

  const [comparisonSource, setComparisonSource] =
    useState<SourceId>("iso42001");

  const [category, setCategory] = useState("All Categories");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return crosswalkRows.filter((row) => {
      const matchesCategory =
        category === "All Categories" ||
        row.category === category;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        row.concept.toLowerCase().includes(normalizedSearch) ||
        row.description.toLowerCase().includes(normalizedSearch) ||
        row.ta14.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [category, searchTerm]);

  const exactMatches = filteredRows.filter(
    (row) =>
      row[primarySource] === "Supported" &&
      row[comparisonSource] === "Supported",
  ).length;

  const partialMatches = filteredRows.filter(
    (row) =>
      row[primarySource] === "Partial" ||
      row[comparisonSource] === "Partial",
  ).length;

  const reviewRequired = filteredRows.filter(
    (row) =>
      row[primarySource] === "Review Required" ||
      row[comparisonSource] === "Review Required" ||
      row[primarySource] === "Not Explicit" ||
      row[comparisonSource] === "Not Explicit",
  ).length;

  const getSourceLabel = (sourceId: SourceId) =>
    sourceOptions.find((source) => source.id === sourceId)?.label ??
    sourceId;

  return (
    <main className="crosswalkPage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link
            href="/governance-library"
            className="topbarLink"
          >
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Source-to-source mapping workspace
          </div>

          <Link
            href="/governance-library/compare"
            className="topbarAction"
          >
            Compare Full Sources →
          </Link>
        </div>

        <header className="hero">
          <div className="heroMark">
            <div className="heroRing ringOne" />
            <div className="heroRing ringTwo" />

            <div className="heroSeal">
              <span>CW</span>
              <small>TA-14</small>
            </div>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Governance
            <span> Crosswalk Engine</span>
          </h1>

          <p className="lead">
            Compare governance concepts across major authorities,
            identify meaningful overlap and divergence, preserve
            interpretation boundaries, and translate source
            relationships into TA-14 admissible execution routes.
          </p>

          <div className="heroMeta">
            <article>
              <span>{crosswalkRows.length}</span>
              <small>Governance concepts</small>
            </article>

            <article>
              <span>{sourceOptions.length}</span>
              <small>Source authorities</small>
            </article>

            <article>
              <span>TA-14</span>
              <small>Execution interpretation</small>
            </article>
          </div>
        </header>

        <section className="configurationSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 01 · SELECT THE COMPARISON
              </p>

              <h2>
                Choose the authorities and concepts to examine.
              </h2>
            </div>

            <p>
              Crosswalks identify conceptual relationships. They do
              not establish legal equivalence, certification,
              conformity, or interchangeable compliance.
            </p>
          </div>

          <div className="configurationPanel">
            <label>
              <span>Primary Authority</span>

              <select
                value={primarySource}
                onChange={(event) =>
                  setPrimarySource(
                    event.target.value as SourceId,
                  )
                }
              >
                {sourceOptions.map((source) => (
                  <option value={source.id} key={source.id}>
                    {source.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="comparisonMark" aria-hidden="true">
              <span>↔</span>
            </div>

            <label>
              <span>Comparison Authority</span>

              <select
                value={comparisonSource}
                onChange={(event) =>
                  setComparisonSource(
                    event.target.value as SourceId,
                  )
                }
              >
                {sourceOptions.map((source) => (
                  <option value={source.id} key={source.id}>
                    {source.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Concept Category</span>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((categoryOption) => (
                  <option
                    value={categoryOption}
                    key={categoryOption}
                  >
                    {categoryOption}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Search Concepts</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Risk, oversight, evidence..."
              />
            </label>
          </div>
        </section>

        <section className="summarySection">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">
                CROSSWALK SUMMARY
              </p>

              <h2>
                {getSourceLabel(primarySource)} compared with{" "}
                {getSourceLabel(comparisonSource)}.
              </h2>
            </div>
          </div>

          <div className="summaryGrid">
            <article>
              <span>{filteredRows.length}</span>
              <small>Concepts displayed</small>
            </article>

            <article>
              <span>{exactMatches}</span>
              <small>Shared supported concepts</small>
            </article>

            <article>
              <span>{partialMatches}</span>
              <small>Partial relationships</small>
            </article>

            <article>
              <span>{reviewRequired}</span>
              <small>Boundary review required</small>
            </article>
          </div>
        </section>

        <section className="matrixSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STEP 02 · INSPECT THE RELATIONSHIPS
              </p>

              <h2>
                Concept-level governance mapping.
              </h2>
            </div>

            <p>
              Each concept includes source support status, TA-14
              interpretation, recommended evidence, and the execution
              route needed to move from guidance to controlled action.
            </p>
          </div>

          <div className="matrixPanel">
            <div className="tableScroll">
              <table>
                <thead>
                  <tr>
                    <th>Governance Concept</th>
                    <th>{getSourceLabel(primarySource)}</th>
                    <th>{getSourceLabel(comparisonSource)}</th>
                    <th>TA-14 Interpretation</th>
                    <th>Execution Route</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRows.map((row, index) => (
                    <tr key={row.id}>
                      <td>
                        <div className="conceptCell">
                          <span>
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div>
                            <small>{row.category}</small>
                            <strong>{row.concept}</strong>
                            <p>{row.description}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`statusBadge ${statusClass(
                            row[primarySource],
                          )}`}
                        >
                          {row[primarySource]}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`statusBadge ${statusClass(
                            row[comparisonSource],
                          )}`}
                        >
                          {row[comparisonSource]}
                        </span>
                      </td>

                      <td>
                        <p className="interpretation">
                          {row.ta14}
                        </p>

                        <div className="evidenceList">
                          {row.evidence.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                      </td>

                      <td>
                        <div className="routeCell">
                          <strong>{row.route}</strong>

                          <Link
                            href="/workspace/ai-governance"
                            className="routeLink"
                          >
                            Build route →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRows.length === 0 ? (
              <div className="emptyState">
                <span>No matching concepts</span>

                <h3>
                  Adjust the search or category filter.
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("All Categories");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="legendSection">
          <div className="sectionHeading compact">
            <div>
              <p className="eyebrow">
                STATUS INTERPRETATION
              </p>

              <h2>
                Read the crosswalk without overstating it.
              </h2>
            </div>
          </div>

          <div className="legendGrid">
            <article>
              <span className="legendStatus supported">
                Supported
              </span>

              <p>
                The source expressly addresses the concept at a
                meaningful level.
              </p>
            </article>

            <article>
              <span className="legendStatus partial">
                Partial
              </span>

              <p>
                The source addresses part of the concept, uses a
                different scope, or requires interpretation.
              </p>
            </article>

            <article>
              <span className="legendStatus not-explicit">
                Not Explicit
              </span>

              <p>
                The concept is not clearly stated in the selected
                source and should not be inferred as equivalent.
              </p>
            </article>

            <article>
              <span className="legendStatus review-required">
                Review Required
              </span>

              <p>
                The relationship cannot be responsibly stated without
                source-level and contextual review.
              </p>
            </article>
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>XB</span>
            <small>Crosswalk boundary</small>
          </div>

          <p className="eyebrow gold">
            SOURCE RELATIONSHIP BOUNDARY
          </p>

          <h2>
            Similar governance concepts do not create equivalent
            authority.
          </h2>

          <p>
            A crosswalk can identify relationships, shared themes,
            missing concepts, and implementation opportunities. It
            cannot convert a voluntary framework into law, replace a
            standard with a principle, establish conformity, or prove
            that satisfying one source satisfies another.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>CROSSWALK PROVES</span>
              <strong>
                Documented conceptual relationships and interpretation
              </strong>
            </article>

            <article>
              <span>CROSSWALK DOES NOT PROVE</span>
              <strong>
                Equivalence, conformity, certification, or compliance
              </strong>
            </article>

            <article>
              <span>REQUIRED NEXT STEP</span>
              <strong>
                Source review, evidence mapping, and authorized
                determination
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/sources"
              className="secondaryAction"
            >
              Review Source Records
            </Link>

            <Link
              href="/governance-library/coverage"
              className="secondaryAction"
            >
              Open Coverage Analysis
            </Link>

            <Link
              href="/workspace/ai-governance"
              className="primaryAction"
            >
              Build TA-14 Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .crosswalkPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(34, 133, 183, 0.17),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 42%,
              rgba(83, 220, 241, 0.07),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 70%,
              rgba(236, 179, 68, 0.07),
              transparent 27%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 50%,
              #01060c 100%
            );
        }

        .backgroundGrid,
        .backgroundGlow {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .backgroundGrid {
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
            transparent 84%
          );
        }

        .glowOne {
          background: radial-gradient(
            circle at 16% 18%,
            rgba(91, 224, 246, 0.07),
            transparent 25%
          );
        }

        .glowTwo {
          background: radial-gradient(
            circle at 84% 46%,
            rgba(255, 197, 82, 0.055),
            transparent 24%
          );
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1520px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 90px;
        }

        .topbar {
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 19px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
        }

        .topbarLink,
        .topbarAction,
        .secondaryAction,
        .primaryAction,
        .routeLink {
          min-height: 44px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .topbarLink {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarAction,
        .primaryAction {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .secondaryAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .secondaryAction:hover,
        .primaryAction:hover,
        .routeLink:hover {
          transform: translateY(-2px);
        }

        .topbarStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topbarStatus span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 15px rgba(114, 230, 178, 0.9);
        }

        .hero {
          max-width: 1080px;
          margin: auto;
          padding: 90px 0 72px;
          text-align: center;
        }

        .heroMark {
          position: relative;
          width: 146px;
          height: 146px;
          margin: 0 auto 28px;
          display: grid;
          place-items: center;
        }

        .heroRing {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(99, 230, 255, 0.18);
          border-radius: 50%;
        }

        .ringOne {
          transform: rotate(18deg) scaleX(1.15);
        }

        .ringTwo {
          transform: rotate(-30deg) scaleY(1.11);
          border-color: rgba(255, 199, 82, 0.15);
        }

        .heroSeal {
          position: relative;
          z-index: 2;
          width: 108px;
          height: 108px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 199, 82, 0.4);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.17),
              transparent 34%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.1),
            inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .heroSeal span {
          color: #ffe5a0;
          font: 900 31px Georgia, serif;
        }

        .heroSeal small {
          color: #8da6b2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.19em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.21em;
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
          margin: 15px auto 0;
          font-size: clamp(52px, 6.3vw, 90px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 920px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMeta,
        .summaryGrid {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .heroMeta article,
        .summaryGrid article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
          text-align: center;
        }

        .heroMeta span,
        .summaryGrid span {
          display: block;
          color: #f0d28f;
          font: 700 25px Georgia, serif;
        }

        .heroMeta small,
        .summaryGrid small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .configurationSection,
        .summarySection,
        .matrixSection,
        .legendSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading.compact {
          grid-template-columns: 1fr;
        }

        .sectionHeading h2,
        .boundarySection h2 {
          margin: 11px 0 0;
          font-size: clamp(38px, 4.3vw, 64px);
          line-height: 0.99;
          letter-spacing: -0.047em;
        }

        .sectionHeading > p {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .configurationPanel {
          padding: 26px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            auto
            minmax(0, 1fr)
            minmax(0, 0.8fr)
            minmax(0, 0.8fr);
          gap: 16px;
          align-items: end;
          border: 1px solid rgba(99, 230, 255, 0.14);
          border-radius: 27px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.07),
              transparent 29%
            ),
            linear-gradient(
              145deg,
              rgba(10, 31, 47, 0.94),
              rgba(4, 14, 24, 0.98)
            );
          box-shadow: 0 26px 66px rgba(0, 0, 0, 0.28);
        }

        .configurationPanel label {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .configurationPanel label span {
          color: #9db1bb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .configurationPanel select,
        .configurationPanel input {
          width: 100%;
          min-height: 52px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 12px;
          outline: none;
          color: #edf8fb;
          background: #071421;
          font: inherit;
          font-size: 13px;
        }

        .configurationPanel input::placeholder {
          color: #5f7682;
        }

        .configurationPanel select:focus,
        .configurationPanel input:focus {
          border-color: rgba(99, 230, 255, 0.55);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.08);
        }

        .comparisonMark {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #edc36d;
          background: rgba(255, 197, 82, 0.06);
          font-size: 19px;
        }

        .summaryGrid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 0;
        }

        .matrixPanel {
          overflow: hidden;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 28, 43, 0.96),
            rgba(3, 12, 21, 0.99)
          );
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.31);
        }

        .tableScroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 1320px;
          border-collapse: collapse;
        }

        th {
          padding: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          color: #83dcea;
          background: rgba(255, 255, 255, 0.035);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-align: left;
          text-transform: uppercase;
        }

        th:nth-child(2),
        th:nth-child(3) {
          text-align: center;
        }

        td {
          padding: 20px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          vertical-align: top;
        }

        tbody tr:last-child td {
          border-bottom: 0;
        }

        tbody tr {
          transition: background 0.2s;
        }

        tbody tr:hover {
          background: rgba(99, 230, 255, 0.025);
        }

        .conceptCell {
          min-width: 300px;
          display: flex;
          gap: 14px;
        }

        .conceptCell > span {
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.22);
          border-radius: 12px;
          color: #6edff2;
          background: rgba(0, 0, 0, 0.2);
          font-size: 10px;
          font-weight: 900;
        }

        .conceptCell small {
          display: block;
          color: #748b97;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .conceptCell strong {
          display: block;
          margin-top: 5px;
          color: #e5f0f3;
          font-size: 15px;
        }

        .conceptCell p {
          max-width: 380px;
          margin: 8px 0 0;
          color: #8fa5af;
          font-size: 12px;
          line-height: 1.55;
        }

        td:nth-child(2),
        td:nth-child(3) {
          min-width: 145px;
          text-align: center;
        }

        .statusBadge,
        .legendStatus {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 96px;
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .supported {
          color: #8ff4c6;
          border-color: rgba(114, 230, 178, 0.3);
          background: rgba(114, 230, 178, 0.08);
        }

        .partial {
          color: #ffd580;
          border-color: rgba(255, 197, 82, 0.3);
          background: rgba(255, 197, 82, 0.08);
        }

        .not-explicit {
          color: #aab8bf;
          border-color: rgba(170, 184, 191, 0.22);
          background: rgba(170, 184, 191, 0.06);
        }

        .review-required {
          color: #e6adff;
          border-color: rgba(198, 140, 255, 0.3);
          background: rgba(198, 140, 255, 0.08);
        }

        .interpretation {
          min-width: 360px;
          margin: 0;
          color: #b5c6cd;
          font-size: 13px;
          line-height: 1.65;
        }

        .evidenceList {
          max-width: 430px;
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .evidenceList span {
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 999px;
          color: #8dcbd7;
          background: rgba(99, 230, 255, 0.04);
          font-size: 8px;
          font-weight: 800;
        }

        .routeCell {
          min-width: 220px;
        }

        .routeCell strong {
          display: block;
          color: #f0d28f;
          font-size: 12px;
          line-height: 1.45;
        }

        .routeLink {
          min-height: 36px;
          margin-top: 13px;
          padding: 0 12px;
          color: #061920;
          border: 1px solid #9cecf8;
          background: linear-gradient(
            135deg,
            #d8faff,
            #69d6e8
          );
        }

        .emptyState {
          padding: 60px 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          text-align: center;
        }

        .emptyState span {
          color: #6edff2;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .emptyState h3 {
          margin: 12px 0 0;
          font-size: 30px;
        }

        .emptyState button {
          min-height: 42px;
          margin-top: 18px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #d4e3e8;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font: inherit;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .legendGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .legendGrid article {
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(5, 18, 29, 0.7);
        }

        .legendGrid p {
          margin: 15px 0 0;
          color: #91a6b0;
          font-size: 13px;
          line-height: 1.6;
        }

        .boundarySection {
          position: relative;
          margin-top: 88px;
          padding: 56px 34px;
          overflow: hidden;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 31px;
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
            inset 0 1px rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .boundarySeal {
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

        .boundarySection h2 {
          max-width: 1020px;
          margin: 14px auto 0;
        }

        .boundarySection > p:not(.eyebrow) {
          max-width: 960px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1060px;
          margin: 31px auto 0;
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

        .boundaryActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 1180px) {
          .configurationPanel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .comparisonMark {
            display: none;
          }

          .legendGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 880px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .heroMeta,
          .summaryGrid,
          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 620px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr;
          }

          .topbarLink,
          .topbarAction {
            justify-self: stretch;
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .configurationPanel,
          .heroMeta,
          .summaryGrid,
          .legendGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .configurationPanel,
          .boundarySection {
            padding: 22px;
          }

          .boundaryActions {
            align-items: stretch;
            flex-direction: column;
          }

          .secondaryAction,
          .primaryAction {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
