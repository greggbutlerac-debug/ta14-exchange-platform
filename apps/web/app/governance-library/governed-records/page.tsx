"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GovernedRecord = {
  title: string;
  category: string;
  stage: string;
  description: string;
  purpose: string;
  evidence: string[];
  route: string;
  accent: string;
};

const records: GovernedRecord[] = [
  {
    title: "Technical Documentation",
    category: "Documentation",
    stage: "Pre-Execution",
    description:
      "Design records, architecture, intended purpose, limitations, dependencies, configuration, and implementation evidence.",
    purpose:
      "Establish what the system is, what it is intended to do, how it is configured, and which operating boundaries govern its use.",
    evidence: [
      "System Description",
      "Architecture Record",
      "Intended-Purpose Statement",
      "Limitation Record",
      "Version History",
    ],
    route: "TA-14 Governed Documentation Route",
    accent: "TD",
  },
  {
    title: "Risk Assessments",
    category: "Risk",
    stage: "Pre-Execution",
    description:
      "Preserved evaluations of identified risks, mitigations, controls, uncertainty, and residual risk.",
    purpose:
      "Bind risk claims to identifiable evidence, authorized review, treatment decisions, and declared acceptance conditions.",
    evidence: [
      "Risk Register",
      "Risk Assessment",
      "Treatment Decision",
      "Residual Risk Record",
      "Approval Evidence",
    ],
    route: "TA-14 Risk and Evidence Route",
    accent: "RA",
  },
  {
    title: "Validation Evidence",
    category: "Assurance",
    stage: "Pre-Execution",
    description:
      "Evidence demonstrating that the AI system performs acceptably for its intended use and declared operating conditions.",
    purpose:
      "Determine whether testing methods, thresholds, results, limitations, and reviewer authority support an admissibility decision.",
    evidence: [
      "Validation Plan",
      "Test Results",
      "Threshold Record",
      "Failure Evidence",
      "Independent Review",
    ],
    route: "TA-14 Testing and Assurance Route",
    accent: "VE",
  },
  {
    title: "Runtime Execution Records",
    category: "Execution",
    stage: "Runtime",
    description:
      "Execution-time evidence including authority validation, admissibility decisions, committed actions, and preserved outcomes.",
    purpose:
      "Prove what was proposed, what evidence was available, who had authority, which gate decision was issued, and what occurred.",
    evidence: [
      "Execution Request",
      "Authority Record",
      "Gate Decision",
      "Commit Record",
      "Execution Receipt",
    ],
    route: "TA-14 Admissible Execution Route",
    accent: "ER",
  },
  {
    title: "Monitoring Records",
    category: "Operations",
    stage: "Post-Execution",
    description:
      "Operational monitoring, drift detection, incidents, complaints, anomalies, and post-deployment observations.",
    purpose:
      "Preserve new operational evidence capable of confirming, challenging, or invalidating prior assumptions and approvals.",
    evidence: [
      "Monitoring Plan",
      "Operational Metrics",
      "Drift Record",
      "Complaint Record",
      "Revalidation Decision",
    ],
    route: "TA-14 Continuous Admissibility Route",
    accent: "MR",
  },
  {
    title: "Audit Records",
    category: "Assurance",
    stage: "Post-Execution",
    description:
      "Independent governance reviews, findings, corrective actions, verification evidence, and closure determinations.",
    purpose:
      "Preserve the scope, method, independence, findings, corrective action, and final verification of governance review.",
    evidence: [
      "Audit Scope",
      "Review Evidence",
      "Finding Record",
      "Corrective Action",
      "Closure Verification",
    ],
    route: "TA-14 Audit and Verification Route",
    accent: "AR",
  },
  {
    title: "Authority Records",
    category: "Authority",
    stage: "Pre-Execution",
    description:
      "Preserved evidence establishing who may approve, deny, escalate, intervene, modify, or execute a governed action.",
    purpose:
      "Prevent execution from relying on assumed, outdated, delegated, expired, or contextually invalid authority.",
    evidence: [
      "Role Assignment",
      "Delegation Record",
      "Scope of Authority",
      "Expiration Condition",
      "Approval Record",
    ],
    route: "TA-14 Authority Validation Route",
    accent: "AU",
  },
  {
    title: "Data Governance Records",
    category: "Data",
    stage: "Lifecycle",
    description:
      "Records preserving data identity, provenance, quality, authorized use, access, processing, retention, and transformation.",
    purpose:
      "Determine whether data can responsibly support a model, decision, review, claim, or execution condition.",
    evidence: [
      "Data Inventory",
      "Provenance Record",
      "Quality Assessment",
      "Access Record",
      "Retention Evidence",
    ],
    route: "TA-14 Data Admissibility Route",
    accent: "DG",
  },
  {
    title: "Incident Records",
    category: "Operations",
    stage: "Post-Execution",
    description:
      "Preserved evidence of detection, containment, investigation, correction, escalation, revalidation, and outcome review.",
    purpose:
      "Convert an operational failure or anomaly into an attributable and reviewable governance sequence.",
    evidence: [
      "Incident Report",
      "Containment Record",
      "Root-Cause Analysis",
      "Corrective Action",
      "Revalidation Record",
    ],
    route: "TA-14 Incident Revalidation Route",
    accent: "IR",
  },
];

const categories = [
  "All Categories",
  ...Array.from(new Set(records.map((record) => record.category))),
];

const stages = [
  "All Stages",
  ...Array.from(new Set(records.map((record) => record.stage))),
];

export default function GovernedRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("All Categories");
  const [activeStage, setActiveStage] = useState("All Stages");
  const [expandedRecords, setExpandedRecords] = useState<string[]>([]);

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return records.filter((record) => {
      const matchesCategory =
        activeCategory === "All Categories" ||
        record.category === activeCategory;

      const matchesStage =
        activeStage === "All Stages" ||
        record.stage === activeStage;

      const matchesSearch =
        query.length === 0 ||
        [
          record.title,
          record.category,
          record.stage,
          record.description,
          record.purpose,
          record.route,
          ...record.evidence,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesStage && matchesSearch;
    });
  }, [activeCategory, activeStage, searchQuery]);

  const totalEvidenceTypes = records.reduce(
    (total, record) => total + record.evidence.length,
    0,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeCategory !== "All Categories",
    activeStage !== "All Stages",
  ].filter(Boolean).length;

  function toggleRecord(title: string) {
    setExpandedRecords((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setActiveCategory("All Categories");
    setActiveStage("All Stages");
  }

  return (
    <main className="recordsPage">
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
            Governed-record architecture active
          </div>

          <Link
            href="/governed-records"
            className="topbarAction"
          >
            Open Records Workspace ↗
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GR</span>
            <small>Governed records</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            Governed
            <span> Records</span>
          </h1>

          <p className="lead">
            Explore the evidence records used to establish
            governance, admissibility, authority, accountability,
            traceability, controlled execution, and preserved outcome
            integrity across the AI lifecycle.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{records.length}</span>
              <small>Record classes</small>
            </article>

            <article>
              <span>{totalEvidenceTypes}</span>
              <small>Evidence types</small>
            </article>

            <article>
              <span>{categories.length - 1}</span>
              <small>Governance categories</small>
            </article>

            <article>
              <span>{stages.length - 1}</span>
              <small>Lifecycle stages</small>
            </article>

            <article>
              <span>{visibleRecords.length}</span>
              <small>Records shown</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                GOVERNED-RECORD CONTROL DESK
              </p>

              <h2>
                Find the evidence required to govern action.
              </h2>
            </div>

            <p>
              A record becomes governed when its identity, source,
              authority, continuity, integrity, context, relationship,
              and execution relevance are preserved well enough to
              support review and admissibility.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search records and evidence
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search risk, authority, validation, execution..."
              />
            </label>

            <label>
              Record category
              <select
                value={activeCategory}
                onChange={(event) =>
                  setActiveCategory(event.target.value)
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Lifecycle stage
              <select
                value={activeStage}
                onChange={(event) =>
                  setActiveStage(event.target.value)
                }
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="resultBar">
            <div>
              <span>{visibleRecords.length}</span>
              <small>
                {visibleRecords.length === 1
                  ? "record displayed"
                  : "records displayed"}
              </small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{expandedRecords.length}</span>
              <small>Records expanded</small>
            </div>
          </div>
        </section>

        <section className="recordsSection">
          {visibleRecords.length > 0 ? (
            <div className="recordsGrid">
              {visibleRecords.map((record, index) => {
                const isExpanded = expandedRecords.includes(
                  record.title,
                );

                return (
                  <article
                    key={record.title}
                    className="recordCard"
                  >
                    <div className="cardHeader">
                      <div className="recordSeal">
                        {record.accent}
                      </div>

                      <div className="recordNumber">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="recordMeta">
                      <span>{record.category}</span>
                      <strong>{record.stage}</strong>
                    </div>

                    <h2>{record.title}</h2>

                    <p className="recordDescription">
                      {record.description}
                    </p>

                    <div className="purposeBlock">
                      <span>Governance purpose</span>
                      <p>{record.purpose}</p>
                    </div>

                    <div className="evidenceHeading">
                      <span>Preserved evidence</span>
                      <strong>
                        {record.evidence.length} record types
                      </strong>
                    </div>

                    <div className="evidenceList">
                      {(isExpanded
                        ? record.evidence
                        : record.evidence.slice(0, 3)
                      ).map((item) => (
                        <div key={item}>
                          <span>◆</span>
                          <strong>{item}</strong>
                        </div>
                      ))}
                    </div>

                    {record.evidence.length > 3 ? (
                      <button
                        type="button"
                        className="expandButton"
                        onClick={() =>
                          toggleRecord(record.title)
                        }
                      >
                        {isExpanded
                          ? "Show fewer evidence types"
                          : `Show ${
                              record.evidence.length - 3
                            } more evidence types`}
                      </button>
                    ) : null}

                    <div className="routeBlock">
                      <span>Execution route</span>
                      <strong>{record.route}</strong>
                    </div>

                    <div className="cardActions">
                      <Link
                        href="/governance-library/dictionary"
                        className="secondaryAction"
                      >
                        Related Terms
                      </Link>

                      <Link
                        href="/governance-library/crosswalks"
                        className="primaryAction"
                      >
                        Map Evidence →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>
                No governed records match the current filters.
              </h2>

              <p>
                Reset the control desk or search for a broader
                evidence concept.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset record search
              </button>
            </div>
          )}
        </section>

        <section className="recordSequence">
          <p className="eyebrow gold">
            TA-14 GOVERNED-RECORD SEQUENCE
          </p>

          <h2>
            Evidence must remain connected from reality to outcome.
          </h2>

          <div className="sequenceGrid">
            {[
              ["01", "Reality", "Establish the condition or event."],
              ["02", "Record", "Preserve attributable evidence."],
              ["03", "Continuity", "Protect sequence and integrity."],
              ["04", "Admissibility", "Determine usable evidence."],
              ["05", "Binding", "Bind evidence to the decision."],
              ["06", "Commit", "Preserve the approved action."],
              ["07", "Execution", "Record controlled performance."],
              ["08", "Outcome", "Preserve what actually occurred."],
            ].map(([number, title, description]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="recordsBoundary">
          <div className="boundarySeal">
            <span>RB</span>
            <small>Record boundary</small>
          </div>

          <p className="eyebrow gold">
            GOVERNED-RECORD BOUNDARY
          </p>

          <h2>
            A stored file is not automatically governed evidence.
          </h2>

          <p>
            Documents, logs, screenshots, reports, approvals, test
            results, and system outputs may exist without being
            attributable, continuous, authentic, complete,
            authorized, contextually relevant, or admissible. TA-14
            separates the existence of information from the
            governance quality required to rely on it before
            execution.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>A RECORD MAY EXIST</span>
              <strong>
                Without validated identity, authority, chronology,
                integrity, scope, or decision relevance
              </strong>
            </article>

            <article>
              <span>A GOVERNED RECORD PRESERVES</span>
              <strong>
                Source, custody, context, continuity, interpretation,
                decision relationship, and outcome
              </strong>
            </article>

            <article>
              <span>ADMISSIBLE USE REQUIRES</span>
              <strong>
                Evidence review, authority validation, binding,
                controlled execution, and preserved outcome proof
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/assurance"
              className="secondaryAction"
            >
              Review Assurance
            </Link>

            <Link
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Review Testing
            </Link>

            <Link
              href="/governed-records"
              className="primaryAction"
            >
              Open Records Workspace ↗
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .recordsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(37, 145, 192, 0.18),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 48%,
              rgba(81, 224, 242, 0.06),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 76%,
              rgba(235, 177, 66, 0.06),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 52%,
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
            transparent 88%
          );
        }

        .glowOne {
          background: radial-gradient(
            circle at 17% 20%,
            rgba(99, 230, 255, 0.07),
            transparent 26%
          );
        }

        .glowTwo {
          background: radial-gradient(
            circle at 84% 55%,
            rgba(255, 196, 79, 0.05),
            transparent 24%
          );
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
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
        .primaryAction,
        .secondaryAction {
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
        .primaryAction:hover,
        .secondaryAction:hover {
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
          max-width: 1140px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .boundarySeal {
          width: 106px;
          height: 106px;
          margin: 0 auto 27px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 198, 82, 0.37);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.16),
              transparent 36%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.09),
            inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .heroSeal span,
        .boundarySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .boundarySeal small {
          color: #8199a4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
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
        h2 {
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
          max-width: 950px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMetrics span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .controlSection {
          padding-top: 78px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .recordSequence h2,
        .recordsBoundary h2 {
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

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(280px, 1.4fr)
            minmax(180px, 0.7fr)
            minmax(180px, 0.7fr)
            auto;
          align-items: end;
          gap: 12px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        label {
          display: grid;
          gap: 8px;
          color: #80a1af;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          box-sizing: border-box;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e8f2f5;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        select option {
          color: #e8f2f5;
          background: #06131f;
        }

        input:focus,
        select:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        .filterPanel button,
        .emptyState button {
          min-height: 46px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b5c7cf;
          background: rgba(0, 0, 0, 0.19);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .resultBar {
          margin-top: 12px;
          padding: 15px 17px;
          display: flex;
          align-items: center;
          gap: 28px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(5, 18, 30, 0.66);
        }

        .resultBar > div {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .resultBar span {
          color: #efcc82;
          font: 700 23px Georgia, serif;
        }

        .resultBar small {
          color: #7c939e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .recordsSection {
          padding-top: 27px;
        }

        .recordsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .recordCard {
          min-width: 0;
          padding: 22px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.05),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              rgba(9, 29, 44, 0.95),
              rgba(3, 13, 22, 0.98)
            );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .recordSeal {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          color: #f1ce83;
          background: rgba(255, 198, 82, 0.05);
          font: 700 14px Georgia, serif;
        }

        .recordNumber {
          color: #607985;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .recordMeta {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .recordMeta span,
        .recordMeta strong {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .recordMeta span {
          color: #70dce9;
        }

        .recordMeta strong {
          color: #b19a68;
        }

        .recordCard h2 {
          margin: 10px 0 0;
          color: #e6f0f3;
          font-size: 29px;
          line-height: 1.08;
        }

        .recordDescription {
          margin: 14px 0 0;
          color: #91a6b0;
          font-size: 13px;
          line-height: 1.65;
        }

        .purposeBlock,
        .routeBlock {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .purposeBlock span,
        .routeBlock span,
        .evidenceHeading span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .purposeBlock p {
          margin: 8px 0 0;
          color: #b7c6cc;
          font-size: 11px;
          line-height: 1.6;
        }

        .evidenceHeading {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .evidenceHeading strong {
          color: #d1ae67;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .evidenceList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .evidenceList div {
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.13);
        }

        .evidenceList span {
          color: #6fdce9;
          font-size: 7px;
        }

        .evidenceList strong {
          color: #c9d7dc;
          font-size: 10px;
        }

        .expandButton {
          margin-top: 11px;
          padding: 0;
          border: 0;
          color: #79dce9;
          background: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .routeBlock strong {
          display: block;
          margin-top: 7px;
          color: #efd18d;
          font: 700 13px/1.4 Georgia, serif;
        }

        .cardActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .cardActions .primaryAction,
        .cardActions .secondaryAction {
          justify-self: stretch;
        }

        .emptyState {
          padding: 72px 25px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(5, 18, 30, 0.67);
          text-align: center;
        }

        .emptySeal {
          width: 70px;
          height: 70px;
          margin: auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          font: 700 24px Georgia, serif;
        }

        .emptyState h2 {
          margin: 20px 0 0;
          font-size: 29px;
        }

        .emptyState p {
          margin: 13px 0 0;
          color: #849aa5;
          font-size: 12px;
        }

        .emptyState button {
          margin-top: 20px;
        }

        .recordSequence {
          margin-top: 88px;
          padding: 50px 34px;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(99, 230, 255, 0.08),
              transparent 39%
            ),
            rgba(4, 16, 27, 0.88);
          text-align: center;
        }

        .recordSequence h2 {
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .sequenceGrid {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .sequenceGrid article {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.16);
        }

        .sequenceGrid span {
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 7px;
          color: #dce7eb;
          font: 700 18px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 8px 0 0;
          color: #788f9a;
          font-size: 10px;
          line-height: 1.5;
        }

        .recordsBoundary {
          margin-top: 88px;
          padding: 56px 34px;
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
          margin-bottom: 22px;
        }

        .boundarySeal span {
          font-size: 23px;
        }

        .boundarySeal small {
          font-size: 6px;
        }

        .recordsBoundary h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .recordsBoundary > p:not(.eyebrow) {
          max-width: 990px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1100px;
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
          .recordsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .filterPanel {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
          }

          .sequenceGrid,
          .boundaryGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .filterPanel,
          .recordsGrid,
          .sequenceGrid,
          .boundaryGrid {
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

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .cardActions {
            grid-template-columns: 1fr;
          }

          .recordSequence,
          .recordsBoundary {
            padding: 30px 20px;
          }

          .boundaryActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
