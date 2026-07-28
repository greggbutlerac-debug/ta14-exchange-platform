"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LifecycleStage = {
  number: string;
  title: string;
  phase: string;
  description: string;
  objective: string;
  responsibilities: string[];
  evidence: string[];
  decision: string;
  accent: string;
};

const lifecycleStages: LifecycleStage[] = [
  {
    number: "01",
    title: "Governance Planning",
    phase: "Before Development",
    description:
      "Establish governance policies, objectives, roles, authorities, boundaries, and accountability before AI development begins.",
    objective:
      "Define the conditions under which the system may be designed, evaluated, approved, operated, challenged, changed, and retired.",
    responsibilities: [
      "Define intended purpose and prohibited uses",
      "Assign accountable owners and decision authorities",
      "Establish risk, evidence, and assurance requirements",
      "Identify applicable laws, standards, and frameworks",
      "Define escalation, exception, and challenge routes",
    ],
    evidence: [
      "Governance Charter",
      "Authority Matrix",
      "Intended-Purpose Record",
      "Applicability Assessment",
      "Lifecycle Control Plan",
    ],
    decision: "Authorize governed development",
    accent: "GP",
  },
  {
    number: "02",
    title: "Design & Development",
    phase: "System Creation",
    description:
      "Apply governance requirements during architecture, data preparation, model development, integration, and control design.",
    objective:
      "Ensure governance is engineered into the system rather than added after technical decisions have already been made.",
    responsibilities: [
      "Bind requirements to system architecture",
      "Preserve data provenance and transformation history",
      "Document assumptions, dependencies, and limitations",
      "Implement human, technical, and procedural controls",
      "Maintain traceable design and version decisions",
    ],
    evidence: [
      "Architecture Record",
      "Data Provenance Record",
      "Design Decision Log",
      "Control Implementation Evidence",
      "Version History",
    ],
    decision: "Authorize validation",
    accent: "DD",
  },
  {
    number: "03",
    title: "Validation & Approval",
    phase: "Pre-Deployment",
    description:
      "Verify readiness through testing, risk review, documentation, independent challenge, and execution authorization.",
    objective:
      "Determine whether available evidence supports admissibility for the declared purpose, environment, users, and operating boundaries.",
    responsibilities: [
      "Test performance against declared thresholds",
      "Validate safety, security, robustness, and fairness",
      "Review unresolved limitations and residual risk",
      "Confirm authority and segregation of duties",
      "Issue an allow, hold, deny, or escalate decision",
    ],
    evidence: [
      "Validation Plan",
      "Test Results",
      "Residual Risk Record",
      "Independent Review",
      "Approval Decision",
    ],
    decision: "Authorize or withhold deployment",
    accent: "VA",
  },
  {
    number: "04",
    title: "Deployment",
    phase: "Controlled Release",
    description:
      "Release AI systems with approved configuration, documented controls, monitoring, rollback capability, and preserved evidence.",
    objective:
      "Ensure the system entering operation is the same governed system that was reviewed and approved.",
    responsibilities: [
      "Verify approved model, data, and configuration",
      "Bind deployment to authorized environments",
      "Activate monitoring and incident controls",
      "Preserve release and execution evidence",
      "Confirm rollback and safe-state capability",
    ],
    evidence: [
      "Deployment Package",
      "Configuration Record",
      "Release Authorization",
      "Monitoring Activation Record",
      "Rollback Verification",
    ],
    decision: "Commit controlled release",
    accent: "DP",
  },
  {
    number: "05",
    title: "Operations & Monitoring",
    phase: "Runtime Governance",
    description:
      "Continuously monitor performance, incidents, drift, authority, compliance, execution integrity, and operational outcomes.",
    objective:
      "Maintain admissibility after deployment by detecting changes that could invalidate prior evidence, assumptions, or approvals.",
    responsibilities: [
      "Monitor performance and operating conditions",
      "Detect model, data, policy, and context drift",
      "Preserve decisions, interventions, and outcomes",
      "Investigate incidents and stakeholder complaints",
      "Trigger revalidation, restriction, or suspension",
    ],
    evidence: [
      "Runtime Execution Record",
      "Monitoring Record",
      "Drift Assessment",
      "Incident Record",
      "Revalidation Decision",
    ],
    decision: "Continue, restrict, suspend, or escalate",
    accent: "OM",
  },
  {
    number: "06",
    title: "Change & Revalidation",
    phase: "Controlled Modification",
    description:
      "Govern updates to models, data, integrations, policies, thresholds, environments, and operating purpose.",
    objective:
      "Prevent material changes from bypassing the evidence, authority, testing, and approval conditions that governed the original system.",
    responsibilities: [
      "Classify the materiality of each proposed change",
      "Identify affected controls and prior approvals",
      "Repeat required testing and risk review",
      "Preserve change authority and implementation evidence",
      "Issue a renewed admissibility determination",
    ],
    evidence: [
      "Change Request",
      "Impact Assessment",
      "Updated Test Evidence",
      "Reapproval Record",
      "Configuration Baseline",
    ],
    decision: "Authorize modified operation",
    accent: "CR",
  },
  {
    number: "07",
    title: "Incident Response",
    phase: "Exception Governance",
    description:
      "Detect, contain, investigate, correct, report, and learn from failures, anomalies, misuse, harm, or governance breakdowns.",
    objective:
      "Convert operational failure into a preserved and reviewable governance sequence with accountable corrective action.",
    responsibilities: [
      "Contain harmful or unauthorized execution",
      "Preserve evidence before systems are altered",
      "Determine cause, scope, and affected parties",
      "Implement corrective and preventive action",
      "Verify closure and renewed operating authority",
    ],
    evidence: [
      "Incident Report",
      "Containment Record",
      "Root-Cause Analysis",
      "Corrective Action Plan",
      "Closure Verification",
    ],
    decision: "Resume, restrict, redesign, or retire",
    accent: "IR",
  },
  {
    number: "08",
    title: "Retirement & Preservation",
    phase: "End of Operation",
    description:
      "Retire systems responsibly while preserving governance records, execution history, dependencies, and audit evidence.",
    objective:
      "End active operation without losing accountability, historical truth, legal evidence, or control over residual system effects.",
    responsibilities: [
      "Authorize retirement and final operating date",
      "Disable execution paths and system access",
      "Preserve required records and model artifacts",
      "Address retained data and downstream dependencies",
      "Document final outcomes and unresolved obligations",
    ],
    evidence: [
      "Retirement Authorization",
      "Decommission Record",
      "Archive Manifest",
      "Data Disposition Record",
      "Final Governance Report",
    ],
    decision: "Close active lifecycle authority",
    accent: "RP",
  },
];

const phases = [
  "All Phases",
  ...Array.from(new Set(lifecycleStages.map((stage) => stage.phase))),
];

export default function LifecyclePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePhase, setActivePhase] = useState("All Phases");
  const [expandedStages, setExpandedStages] = useState<string[]>([]);

  const visibleStages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return lifecycleStages.filter((stage) => {
      const matchesPhase =
        activePhase === "All Phases" || stage.phase === activePhase;

      const matchesSearch =
        query.length === 0 ||
        [
          stage.title,
          stage.phase,
          stage.description,
          stage.objective,
          stage.decision,
          ...stage.responsibilities,
          ...stage.evidence,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesPhase && matchesSearch;
    });
  }, [activePhase, searchQuery]);

  const totalResponsibilities = lifecycleStages.reduce(
    (total, stage) => total + stage.responsibilities.length,
    0,
  );

  const totalEvidenceTypes = lifecycleStages.reduce(
    (total, stage) => total + stage.evidence.length,
    0,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activePhase !== "All Phases",
  ].filter(Boolean).length;

  function toggleStage(title: string) {
    setExpandedStages((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setActivePhase("All Phases");
  }

  return (
    <main className="lifecyclePage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link href="/governance-library" className="topbarLink">
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Lifecycle architecture active
          </div>

          <Link
            href="/governance-library/governed-records"
            className="topbarAction"
          >
            Open Governed Records →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>LC</span>
            <small>Lifecycle governance</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            AI Governance
            <span> Lifecycle</span>
          </h1>

          <p className="lead">
            Explore the responsibilities, evidence, authorities,
            decisions, and execution boundaries required to govern an
            AI system from initial planning through controlled
            retirement and final record preservation.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{lifecycleStages.length}</span>
              <small>Lifecycle stages</small>
            </article>

            <article>
              <span>{totalResponsibilities}</span>
              <small>Governance responsibilities</small>
            </article>

            <article>
              <span>{totalEvidenceTypes}</span>
              <small>Evidence types</small>
            </article>

            <article>
              <span>{phases.length - 1}</span>
              <small>Operating phases</small>
            </article>

            <article>
              <span>{visibleStages.length}</span>
              <small>Stages shown</small>
            </article>
          </div>
        </header>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">LIFECYCLE CONTROL DESK</p>

              <h2>
                Governance must remain continuous from intent to
                retirement.
              </h2>
            </div>

            <p>
              A system does not remain governed merely because it was
              once approved. Evidence, authority, context, risk,
              performance, configuration, and operating conditions can
              change throughout the lifecycle.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search lifecycle responsibilities
              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search validation, drift, approval, incident, retirement..."
              />
            </label>

            <label>
              Lifecycle phase
              <select
                value={activePhase}
                onChange={(event) =>
                  setActivePhase(event.target.value)
                }
              >
                {phases.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
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
              <span>{visibleStages.length}</span>
              <small>Stages displayed</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{expandedStages.length}</span>
              <small>Stages expanded</small>
            </div>
          </div>
        </section>

        <section className="lifecycleSection">
          {visibleStages.length > 0 ? (
            <div className="lifecycleGrid">
              {visibleStages.map((stage) => {
                const isExpanded = expandedStages.includes(stage.title);

                return (
                  <article key={stage.title} className="stageCard">
                    <div className="cardHeader">
                      <div className="stageSeal">{stage.accent}</div>
                      <div className="stageNumber">{stage.number}</div>
                    </div>

                    <div className="stageMeta">
                      <span>Lifecycle stage</span>
                      <strong>{stage.phase}</strong>
                    </div>

                    <h2>{stage.title}</h2>

                    <p className="stageDescription">
                      {stage.description}
                    </p>

                    <div className="objectiveBlock">
                      <span>Governance objective</span>
                      <p>{stage.objective}</p>
                    </div>

                    <div className="listHeading">
                      <span>Primary responsibilities</span>
                      <strong>
                        {stage.responsibilities.length} controls
                      </strong>
                    </div>

                    <div className="responsibilityList">
                      {(isExpanded
                        ? stage.responsibilities
                        : stage.responsibilities.slice(0, 3)
                      ).map((responsibility) => (
                        <div key={responsibility}>
                          <span>◆</span>
                          <strong>{responsibility}</strong>
                        </div>
                      ))}
                    </div>

                    {stage.responsibilities.length > 3 ? (
                      <button
                        type="button"
                        className="expandButton"
                        onClick={() => toggleStage(stage.title)}
                      >
                        {isExpanded
                          ? "Show fewer responsibilities"
                          : `Show ${
                              stage.responsibilities.length - 3
                            } more responsibilities`}
                      </button>
                    ) : null}

                    <div className="evidenceBlock">
                      <span>Required evidence</span>

                      <div className="tagList">
                        {stage.evidence.map((item) => (
                          <strong key={item}>{item}</strong>
                        ))}
                      </div>
                    </div>

                    <div className="decisionBlock">
                      <span>Governing decision</span>
                      <strong>{stage.decision}</strong>
                    </div>

                    <div className="cardActions">
                      <Link
                        href="/governance-library/frameworks"
                        className="secondaryAction"
                      >
                        Frameworks
                      </Link>

                      <Link
                        href="/governance-library/assurance"
                        className="primaryAction"
                      >
                        Assurance →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No lifecycle stages match the current filters.</h2>

              <p>
                Reset the control desk or search for a broader
                governance responsibility.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset lifecycle search
              </button>
            </div>
          )}
        </section>

        <section className="governanceSequence">
          <p className="eyebrow gold">
            TA-14 LIFECYCLE GOVERNING SEQUENCE
          </p>

          <h2>
            Every stage must preserve the evidence required by the
            next.
          </h2>

          <div className="sequenceTrack">
            {[
              ["01", "Plan", "Declare purpose, authority, and boundaries."],
              ["02", "Design", "Engineer governance into the system."],
              ["03", "Validate", "Test evidence against requirements."],
              ["04", "Approve", "Issue an authorized gate decision."],
              ["05", "Deploy", "Release the approved configuration."],
              ["06", "Monitor", "Preserve runtime evidence and drift."],
              ["07", "Revalidate", "Govern changes and incidents."],
              ["08", "Retire", "Close execution and preserve history."],
            ].map(([number, title, description]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="continuitySection">
          <div className="continuitySeal">
            <span>GC</span>
            <small>Governance continuity</small>
          </div>

          <p className="eyebrow gold">
            LIFECYCLE CONTINUITY BOUNDARY
          </p>

          <h2>
            Approval at one point in time does not govern the entire
            future.
          </h2>

          <p>
            AI systems change through new data, model updates,
            integrations, user behavior, environmental conditions,
            policy changes, incidents, and operational drift.
            Lifecycle governance must preserve the relationship
            between the system that was approved, the system that is
            operating, the evidence available now, and the authority
            permitting continued execution.
          </p>

          <div className="continuityGrid">
            <article>
              <span>INITIAL APPROVAL ESTABLISHES</span>
              <strong>
                A bounded decision for a specific system, purpose,
                configuration, environment, authority, and evidence
                state
              </strong>
            </article>

            <article>
              <span>CONTINUED OPERATION REQUIRES</span>
              <strong>
                Monitoring, preserved execution evidence, drift
                review, incident response, authority continuity, and
                revalidation
              </strong>
            </article>

            <article>
              <span>RETIREMENT MUST PRESERVE</span>
              <strong>
                Final authority, execution history, unresolved
                obligations, data disposition, and governance records
              </strong>
            </article>
          </div>

          <div className="continuityActions">
            <Link
              href="/governance-library/risk-management"
              className="secondaryAction"
            >
              Risk Management
            </Link>

            <Link
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Testing
            </Link>

            <Link
              href="/governance-library/governed-records"
              className="primaryAction"
            >
              Governed Records →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .lifecyclePage {
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
        .continuitySeal {
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
        .continuitySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .continuitySeal small {
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
        .governanceSequence h2,
        .continuitySection h2 {
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
          grid-template-columns: minmax(280px, 1fr) minmax(200px, 0.45fr) auto;
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

        .lifecycleSection {
          padding-top: 27px;
        }

        .lifecycleGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .stageCard {
          min-width: 0;
          padding: 23px;
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

        .stageSeal {
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

        .stageNumber {
          color: #607985;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .stageMeta {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .stageMeta span,
        .stageMeta strong {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .stageMeta span {
          color: #70dce9;
        }

        .stageMeta strong {
          color: #b19a68;
        }

        .stageCard h2 {
          margin: 10px 0 0;
          color: #e6f0f3;
          font-size: 31px;
          line-height: 1.08;
        }

        .stageDescription {
          margin: 14px 0 0;
          color: #91a6b0;
          font-size: 13px;
          line-height: 1.65;
        }

        .objectiveBlock,
        .evidenceBlock,
        .decisionBlock {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .objectiveBlock span,
        .evidenceBlock > span,
        .decisionBlock span,
        .listHeading span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .objectiveBlock p {
          margin: 8px 0 0;
          color: #b7c6cc;
          font-size: 11px;
          line-height: 1.6;
        }

        .listHeading {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .listHeading strong {
          color: #d1ae67;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .responsibilityList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .responsibilityList div {
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.13);
        }

        .responsibilityList span {
          color: #6fdce9;
          font-size: 7px;
        }

        .responsibilityList strong {
          color: #c9d7dc;
          font-size: 10px;
          line-height: 1.45;
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

        .tagList {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tagList strong {
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 999px;
          color: #9fc4cd;
          background: rgba(99, 230, 255, 0.03);
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .decisionBlock strong {
          display: block;
          margin-top: 7px;
          color: #efd18d;
          font: 700 14px/1.4 Georgia, serif;
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

        .governanceSequence {
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

        .governanceSequence h2 {
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .sequenceTrack {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .sequenceTrack article {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.16);
        }

        .sequenceTrack span {
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .sequenceTrack strong {
          display: block;
          margin-top: 7px;
          color: #dce7eb;
          font: 700 18px Georgia, serif;
        }

        .sequenceTrack p {
          margin: 8px 0 0;
          color: #788f9a;
          font-size: 10px;
          line-height: 1.5;
        }

        .continuitySection {
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

        .continuitySeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .continuitySeal span {
          font-size: 23px;
        }

        .continuitySeal small {
          font-size: 6px;
        }

        .continuitySection h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .continuitySection > p:not(.eyebrow) {
          max-width: 990px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .continuityGrid {
          max-width: 1100px;
          margin: 31px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .continuityGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .continuityGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .continuityGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .continuityActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading,
          .filterPanel {
            grid-template-columns: 1fr;
          }

          .lifecycleGrid {
            grid-template-columns: 1fr;
          }

          .sequenceTrack,
          .continuityGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .sequenceTrack,
          .continuityGrid {
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

          .governanceSequence,
          .continuitySection {
            padding: 30px 20px;
          }

          .continuityActions {
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
