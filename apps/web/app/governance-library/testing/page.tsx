"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TestingMethod = {
  id: string;
  code: string;
  title: string;
  category: string;
  stage: string;
  purpose: string;
  description: string;
  evidence: string[];
  tests: string[];
  outcomes: string[];
};

type TestStatus =
  | "Not tested"
  | "Supported"
  | "Partial"
  | "Hold"
  | "Escalate";

type TestRecord = {
  status: TestStatus;
  evidenceReference: string;
  reviewerNote: string;
};

const methods: TestingMethod[] = [
  {
    id: "conformity-assessment",
    code: "CA",
    title: "Conformity Assessment",
    category: "Pre-execution assurance",
    stage: "Before deployment",
    purpose:
      "Evaluate whether the declared AI system satisfies defined governance requirements before release or deployment.",
    description:
      "Conformity assessment compares a bounded system, declared use, documented controls, and preserved evidence against an identified requirement set. It must not be represented as certification unless a competent authority or authorized conformity process supports that conclusion.",
    evidence: [
      "Declared system purpose and operating boundary",
      "Applicable authority or requirement set",
      "Technical documentation and control descriptions",
      "Risk assessment and mitigation records",
      "Verification and validation results",
      "Human oversight and accountability assignments",
    ],
    tests: [
      "Is the tested system identity fixed and attributable?",
      "Are the governing requirements identified and current?",
      "Is each claimed control supported by preserved evidence?",
      "Are unresolved limitations explicitly bounded?",
      "Is the final conclusion narrower than the evidence?",
    ],
    outcomes: [
      "Supported",
      "Partially supported",
      "Hold pending evidence",
      "Escalate for qualified review",
    ],
  },
  {
    id: "validation-testing",
    code: "VT",
    title: "Validation Testing",
    category: "System fitness",
    stage: "Before and after change",
    purpose:
      "Demonstrate whether the AI system performs acceptably for its intended and declared use.",
    description:
      "Validation testing determines whether the system is fit for a specific use under defined operating conditions. General benchmark performance does not establish fitness for every deployment, population, environment, or consequence level.",
    evidence: [
      "Intended-use statement",
      "Acceptance criteria",
      "Representative validation dataset",
      "Performance and error analysis",
      "Known limitation record",
      "Post-change comparison record",
    ],
    tests: [
      "Does the validation population match the declared use?",
      "Are acceptance thresholds fixed before testing?",
      "Are errors measured by consequence and affected group?",
      "Are material limitations preserved in the record?",
      "Has the system changed since the evidence was produced?",
    ],
    outcomes: [
      "Validated for bounded use",
      "Validated with limitations",
      "Not demonstrated",
      "Invalidated by material change",
    ],
  },
  {
    id: "runtime-governance-testing",
    code: "RT",
    title: "Runtime Governance Testing",
    category: "Execution control",
    stage: "At decision time",
    purpose:
      "Verify execution-time controls, evidence preservation, admissibility decisions, and governed release behavior.",
    description:
      "Runtime governance testing evaluates what happens when a proposed AI action reaches the execution boundary. It tests whether evidence, authority, continuity, binding, and control conditions are evaluated before the action is released.",
    evidence: [
      "Proposed action record",
      "Identity and authority evidence",
      "Runtime policy and control configuration",
      "Admissibility determination",
      "ALLOW, HOLD, DENY, or ESCALATE receipt",
      "Preserved execution and outcome record",
    ],
    tests: [
      "Is the proposed action attributable to a fixed system identity?",
      "Is the action bound to the evidence used to evaluate it?",
      "Does missing evidence produce HOLD rather than silent release?",
      "Can denied or escalated actions bypass the gate?",
      "Is the outcome preserved after execution?",
    ],
    outcomes: [
      "ALLOW",
      "HOLD",
      "DENY",
      "ESCALATE",
    ],
  },
  {
    id: "red-team-exercises",
    code: "RT",
    title: "Red Team Exercises",
    category: "Adversarial assurance",
    stage: "Before and during operation",
    purpose:
      "Challenge AI systems and governance controls using adversarial scenarios designed to expose weaknesses and bypass paths.",
    description:
      "Red team exercises test whether technical safeguards, governance controls, human processes, and evidence requirements withstand deliberate pressure. Findings must remain tied to the tested version, scenario, and scope.",
    evidence: [
      "Threat model and exercise scope",
      "Test authorization",
      "Attack scenarios and prompts",
      "Observed system behavior",
      "Control bypass attempts",
      "Finding, remediation, and retest records",
    ],
    tests: [
      "Can the system be induced to exceed its declared authority?",
      "Can evidence requirements be bypassed or fabricated?",
      "Can restricted actions be released indirectly?",
      "Can identity, context, or provenance be manipulated?",
      "Do remediated findings survive retesting?",
    ],
    outcomes: [
      "Control resisted",
      "Control degraded",
      "Control bypassed",
      "Retest required",
    ],
  },
  {
    id: "continuous-monitoring",
    code: "CM",
    title: "Continuous Monitoring",
    category: "Operational oversight",
    stage: "After deployment",
    purpose:
      "Observe deployed AI systems for drift, incidents, control degradation, and changes affecting prior determinations.",
    description:
      "Continuous monitoring identifies conditions that may invalidate earlier evidence or approvals. Monitoring is not governance by itself; it must connect detected conditions to bounded responses, review thresholds, and controlled execution decisions.",
    evidence: [
      "Baseline performance record",
      "Monitoring metrics and thresholds",
      "Drift and anomaly records",
      "Incident reports",
      "Change and version history",
      "Review and intervention decisions",
    ],
    tests: [
      "Are monitoring thresholds defined before an incident?",
      "Does material drift invalidate prior evidence?",
      "Are alerts connected to accountable review?",
      "Can degraded controls automatically produce HOLD?",
      "Are interventions followed by outcome evidence?",
    ],
    outcomes: [
      "Within boundary",
      "Review required",
      "Control degraded",
      "Operation held",
    ],
  },
  {
    id: "audit-assurance",
    code: "AA",
    title: "Audit and Assurance",
    category: "Independent review",
    stage: "Periodic or event-driven",
    purpose:
      "Review governance controls, preserved evidence, decision records, and execution history against a defined assurance scope.",
    description:
      "Audit and assurance evaluate whether the documented governance process is supported by actual records and whether controls operated as represented. An audit conclusion must remain within the competence, independence, evidence, and scope of the review.",
    evidence: [
      "Defined audit scope and criteria",
      "Control inventory",
      "Decision and execution receipts",
      "Evidence chain and provenance",
      "Exception and escalation records",
      "Corrective-action evidence",
    ],
    tests: [
      "Does the operating record match the documented process?",
      "Are material exceptions preserved rather than omitted?",
      "Can decisions be independently replayed or reviewed?",
      "Are reviewers independent and appropriately qualified?",
      "Are corrective actions verified rather than merely declared?",
    ],
    outcomes: [
      "Assurance supported",
      "Qualified conclusion",
      "Material deficiency",
      "Insufficient evidence",
    ],
  },
];

const statusOptions: TestStatus[] = [
  "Not tested",
  "Supported",
  "Partial",
  "Hold",
  "Escalate",
];

function createInitialRecords(): Record<string, TestRecord> {
  return Object.fromEntries(
    methods.map((method) => [
      method.id,
      {
        status: "Not tested" as TestStatus,
        evidenceReference: "",
        reviewerNote: "",
      },
    ]),
  );
}

function getStatusClass(status: TestStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function TestingPage() {
  const [selectedMethodId, setSelectedMethodId] = useState(
    methods[0].id,
  );
  const [records, setRecords] = useState<
    Record<string, TestRecord>
  >(createInitialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All categories");

  const selectedMethod =
    methods.find((method) => method.id === selectedMethodId) ??
    methods[0];

  const selectedRecord = records[selectedMethod.id];

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(
        new Set(methods.map((method) => method.category)),
      ),
    ],
    [],
  );

  const visibleMethods = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return methods.filter((method) => {
      const categoryMatches =
        categoryFilter === "All categories" ||
        method.category === categoryFilter;

      const queryMatches =
        normalizedQuery.length === 0 ||
        [
          method.title,
          method.category,
          method.stage,
          method.purpose,
          method.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return categoryMatches && queryMatches;
    });
  }, [categoryFilter, searchQuery]);

  const summary = useMemo(() => {
    const values = Object.values(records);

    return {
      total: values.length,
      supported: values.filter(
        (record) => record.status === "Supported",
      ).length,
      partial: values.filter(
        (record) => record.status === "Partial",
      ).length,
      hold: values.filter(
        (record) => record.status === "Hold",
      ).length,
      escalate: values.filter(
        (record) => record.status === "Escalate",
      ).length,
      completed: values.filter(
        (record) => record.status !== "Not tested",
      ).length,
    };
  }, [records]);

  const completionPercentage = Math.round(
    (summary.completed / summary.total) * 100,
  );

  function updateSelectedRecord(
    field: keyof TestRecord,
    value: string,
  ) {
    setRecords((current) => ({
      ...current,
      [selectedMethod.id]: {
        ...current[selectedMethod.id],
        [field]: value,
      },
    }));
  }

  function resetWorkspace() {
    setRecords(createInitialRecords());
  }

  return (
    <main className="testingPage">
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
            Evidence testing workspace
          </div>

          <Link
            href="/workspace/ai-governance"
            className="topbarAction"
          >
            Build TA-14 Route →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GT</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Governance
            <span> Testing Workspace</span>
          </h1>

          <p className="lead">
            Convert governance claims into bounded tests, evidence
            requirements, reviewer determinations, and execution
            conditions. Testing establishes what has been examined
            and what the evidence supports. It does not convert an
            unsupported claim into compliance, certification, or
            execution authority.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{methods.length}</span>
              <small>Testing methods</small>
            </article>

            <article>
              <span>{summary.completed}</span>
              <small>Methods reviewed</small>
            </article>

            <article>
              <span>{summary.hold}</span>
              <small>Hold determinations</small>
            </article>

            <article>
              <span>{summary.escalate}</span>
              <small>Escalations</small>
            </article>

            <article>
              <span>{completionPercentage}%</span>
              <small>Workspace completion</small>
            </article>
          </div>
        </header>

        <section className="workspaceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                TESTING CONTROL DESK
              </p>

              <h2>
                Select a method. Test the evidence.
              </h2>
            </div>

            <p>
              Every determination remains bound to the declared
              system, version, authority, evidence set, reviewer,
              scope, and testing conditions. A result outside that
              boundary requires a new review.
            </p>
          </div>

          <div className="workspaceGrid">
            <aside className="methodPanel">
              <div className="filterStack">
                <label>
                  Search testing methods
                  <input
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search by method, purpose, or stage"
                  />
                </label>

                <label>
                  Testing category
                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="methodList">
                {visibleMethods.map((method, index) => {
                  const record = records[method.id];
                  const active =
                    method.id === selectedMethod.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      className={`methodButton ${
                        active ? "active" : ""
                      }`}
                      onClick={() =>
                        setSelectedMethodId(method.id)
                      }
                    >
                      <span className="methodIndex">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="methodText">
                        <strong>{method.title}</strong>
                        <small>{method.stage}</small>
                      </span>

                      <span
                        className={`statusDot ${getStatusClass(
                          record.status,
                        )}`}
                        aria-label={record.status}
                      />
                    </button>
                  );
                })}

                {visibleMethods.length === 0 ? (
                  <div className="emptyState">
                    No testing methods match the current filters.
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="testingDesk">
              <div className="deskHeader">
                <div className="deskIdentity">
                  <div className="deskCode">
                    {selectedMethod.code}
                  </div>

                  <div>
                    <p>{selectedMethod.category}</p>
                    <h3>{selectedMethod.title}</h3>
                    <span>{selectedMethod.stage}</span>
                  </div>
                </div>

                <div
                  className={`currentStatus ${getStatusClass(
                    selectedRecord.status,
                  )}`}
                >
                  {selectedRecord.status}
                </div>
              </div>

              <div className="purposeCard">
                <span>Testing purpose</span>
                <strong>{selectedMethod.purpose}</strong>
                <p>{selectedMethod.description}</p>
              </div>

              <div className="testingColumns">
                <article className="evidenceCard">
                  <div className="cardHeading">
                    <span>Required evidence</span>
                    <strong>
                      {selectedMethod.evidence.length}
                    </strong>
                  </div>

                  <div className="checkList">
                    {selectedMethod.evidence.map(
                      (evidence, index) => (
                        <div key={evidence}>
                          <span>
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                          <p>{evidence}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>

                <article className="evidenceCard">
                  <div className="cardHeading">
                    <span>Test questions</span>
                    <strong>
                      {selectedMethod.tests.length}
                    </strong>
                  </div>

                  <div className="checkList">
                    {selectedMethod.tests.map(
                      (test, index) => (
                        <div key={test}>
                          <span>
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                          <p>{test}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              </div>

              <div className="determinationPanel">
                <div className="panelTitle">
                  <div>
                    <p className="eyebrow">
                      REVIEW DETERMINATION
                    </p>
                    <h3>
                      Record what the evidence supports.
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={resetWorkspace}
                    className="resetButton"
                  >
                    Reset workspace
                  </button>
                </div>

                <div className="statusOptions">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`statusOption ${getStatusClass(
                        status,
                      )} ${
                        selectedRecord.status === status
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateSelectedRecord(
                          "status",
                          status,
                        )
                      }
                    >
                      <span />
                      {status}
                    </button>
                  ))}
                </div>

                <div className="recordFields">
                  <label>
                    Evidence reference
                    <input
                      value={
                        selectedRecord.evidenceReference
                      }
                      onChange={(event) =>
                        updateSelectedRecord(
                          "evidenceReference",
                          event.target.value,
                        )
                      }
                      placeholder="Record ID, repository path, receipt, or evidence package"
                    />
                  </label>

                  <label>
                    Reviewer note
                    <textarea
                      value={selectedRecord.reviewerNote}
                      onChange={(event) =>
                        updateSelectedRecord(
                          "reviewerNote",
                          event.target.value,
                        )
                      }
                      placeholder="State the evidence reviewed, limitation, unresolved condition, or reason for the determination."
                      rows={5}
                    />
                  </label>
                </div>

                <div className="outcomeStrip">
                  <span>Method-specific outcomes</span>

                  <div>
                    {selectedMethod.outcomes.map((outcome) => (
                      <small key={outcome}>{outcome}</small>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="summarySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                TESTING SUMMARY
              </p>

              <h2>
                Read the condition of the review.
              </h2>
            </div>

            <p>
              Counts show the current workspace condition only. They
              do not represent a legal conclusion, independent
              assurance opinion, certification, or authorization to
              execute.
            </p>
          </div>

          <div className="summaryGrid">
            <article>
              <span>Supported</span>
              <strong>{summary.supported}</strong>
              <p>
                Evidence presently supports the bounded testing
                conclusion.
              </p>
            </article>

            <article>
              <span>Partial</span>
              <strong>{summary.partial}</strong>
              <p>
                Some requirements are supported, but material limits
                remain.
              </p>
            </article>

            <article>
              <span>Hold</span>
              <strong>{summary.hold}</strong>
              <p>
                Evidence or authority is insufficient for release.
              </p>
            </article>

            <article>
              <span>Escalate</span>
              <strong>{summary.escalate}</strong>
              <p>
                Qualified review or higher authority is required.
              </p>
            </article>
          </div>

          <div className="completionCard">
            <div>
              <span>Review completion</span>
              <strong>{completionPercentage}%</strong>
            </div>

            <div className="progressTrack">
              <div
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p>
              {summary.completed} of {summary.total} testing methods
              currently contain a determination.
            </p>
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                GOVERNED TESTING SEQUENCE
              </p>

              <h2>
                Testing must remain connected to execution.
              </h2>
            </div>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Declare",
                text: "Fix the system, version, purpose, actor, environment, and proposed use.",
              },
              {
                code: "02",
                title: "Bind",
                text: "Bind the test to identified requirements, evidence, and acceptance conditions.",
              },
              {
                code: "03",
                title: "Test",
                text: "Evaluate the preserved evidence against the declared test questions.",
              },
              {
                code: "04",
                title: "Determine",
                text: "Record supported, partial, hold, or escalation outcomes without overstating scope.",
              },
              {
                code: "05",
                title: "Control",
                text: "Connect the determination to ALLOW, HOLD, DENY, or ESCALATE conditions.",
              },
              {
                code: "06",
                title: "Preserve",
                text: "Preserve the test, evidence, reviewer, decision, execution, and outcome record.",
              },
            ].map((step) => (
              <article key={step.code}>
                <span>{step.code}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>TB</span>
            <small>Testing boundary</small>
          </div>

          <p className="eyebrow gold">
            TESTING BOUNDARY
          </p>

          <h2>
            A completed test is not automatic permission to act.
          </h2>

          <p>
            Governance testing establishes what was tested, against
            which requirements, using which evidence, under which
            conditions, and with what bounded result. It does not by
            itself establish legal compliance, certification,
            conformity, admissibility, or execution authority.
            Release requires the applicable authority, evidence
            continuity, binding, admissibility determination, and
            governed execution control.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>TESTING PROVES</span>
              <strong>
                What was evaluated and what the reviewed evidence
                supports within the declared scope
              </strong>
            </article>

            <article>
              <span>TESTING DOES NOT PROVE</span>
              <strong>
                Universal fitness, legal compliance, certification,
                or authority beyond the tested boundary
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Admissible evidence, authority, binding, runtime
                controls, and preserved outcome proof
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Run Applicability
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalk Engine
            </Link>

            <Link
              href="/workspace/ai-governance"
              className="primaryAction"
            >
              Build Governed Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .testingPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(37, 145, 192, 0.17),
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
          max-width: 1120px;
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
          max-width: 940px;
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

        .workspaceSection,
        .summarySection,
        .sequenceSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
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

        .workspaceGrid {
          display: grid;
          grid-template-columns: 370px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .methodPanel,
        .testingDesk {
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.05),
              transparent 26%
            ),
            linear-gradient(
              145deg,
              rgba(9, 29, 44, 0.95),
              rgba(3, 13, 22, 0.98)
            );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        .methodPanel {
          position: sticky;
          top: 20px;
          padding: 18px;
        }

        .filterStack {
          display: grid;
          gap: 12px;
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
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e8f2f5;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        input,
        select {
          min-height: 44px;
          padding: 0 12px;
        }

        textarea {
          padding: 13px;
          resize: vertical;
          line-height: 1.55;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        select option {
          color: #e8f2f5;
          background: #071520;
        }

        .methodList {
          margin-top: 17px;
          display: grid;
          gap: 9px;
        }

        .methodButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr) 10px;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .methodButton:hover,
        .methodButton.active {
          transform: translateX(3px);
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .methodIndex {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.16);
          border-radius: 10px;
          color: #6bd9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .methodText {
          min-width: 0;
          display: grid;
          gap: 5px;
        }

        .methodText strong {
          overflow: hidden;
          color: #dce8ec;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .methodText small {
          color: #728995;
          font-size: 8px;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #53656e;
        }

        .statusDot.supported {
          background: #72e6b2;
          box-shadow: 0 0 10px rgba(114, 230, 178, 0.6);
        }

        .statusDot.partial {
          background: #efc76e;
        }

        .statusDot.hold {
          background: #ef9b57;
        }

        .statusDot.escalate {
          background: #df77dd;
        }

        .emptyState {
          padding: 28px 18px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 13px;
          color: #748b96;
          font-size: 11px;
          line-height: 1.5;
          text-align: center;
        }

        .testingDesk {
          padding: 26px;
        }

        .deskHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .deskIdentity {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .deskCode {
          width: 66px;
          height: 66px;
          flex: 0 0 66px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.28);
          border-radius: 50%;
          color: #f1cb7c;
          background: rgba(255, 198, 82, 0.04);
          font: 700 20px Georgia, serif;
        }

        .deskIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .deskIdentity h3 {
          margin: 6px 0 0;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
        }

        .deskIdentity span {
          display: block;
          margin-top: 7px;
          color: #7f949e;
          font-size: 10px;
        }

        .currentStatus {
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #9fb1b9;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .currentStatus.supported {
          color: #89efc2;
          border-color: rgba(114, 230, 178, 0.24);
          background: rgba(114, 230, 178, 0.06);
        }

        .currentStatus.partial {
          color: #f3cf7d;
          border-color: rgba(239, 199, 110, 0.25);
          background: rgba(239, 199, 110, 0.06);
        }

        .currentStatus.hold {
          color: #f5ad72;
          border-color: rgba(239, 155, 87, 0.25);
          background: rgba(239, 155, 87, 0.06);
        }

        .currentStatus.escalate {
          color: #e68be3;
          border-color: rgba(223, 119, 221, 0.25);
          background: rgba(223, 119, 221, 0.06);
        }

        .purposeCard {
          margin-top: 24px;
          padding: 21px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.15);
        }

        .purposeCard > span {
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .purposeCard strong {
          display: block;
          margin-top: 9px;
          color: #e4edf0;
          font-size: 16px;
          line-height: 1.5;
        }

        .purposeCard p {
          margin: 13px 0 0;
          color: #91a7b1;
          font-size: 13px;
          line-height: 1.68;
        }

        .testingColumns {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .evidenceCard {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.14);
        }

        .cardHeading {
          padding-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #78ddeb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .checkList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .checkList div {
          display: grid;
          grid-template-columns: 31px minmax(0, 1fr);
          align-items: start;
          gap: 10px;
        }

        .checkList span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 9px;
          color: #68d9ea;
          font-size: 7px;
          font-weight: 900;
        }

        .checkList p {
          margin: 5px 0 0;
          color: #a0b2ba;
          font-size: 11px;
          line-height: 1.52;
        }

        .determinationPanel {
          margin-top: 18px;
          padding: 22px;
          border: 1px solid rgba(255, 198, 82, 0.18);
          border-radius: 19px;
          background:
            radial-gradient(
              circle at 100% 0,
              rgba(255, 198, 82, 0.06),
              transparent 30%
            ),
            rgba(0, 0, 0, 0.17);
        }

        .panelTitle {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
        }

        .panelTitle h3 {
          margin: 8px 0 0;
          font-size: 27px;
        }

        .resetButton {
          min-height: 39px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          color: #9fb0b8;
          background: rgba(0, 0, 0, 0.16);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .statusOptions {
          margin-top: 19px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
        }

        .statusOption {
          min-height: 45px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 11px;
          color: #8ea2ac;
          background: rgba(0, 0, 0, 0.16);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .statusOption span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #52636c;
        }

        .statusOption.selected {
          border-color: rgba(99, 230, 255, 0.32);
          color: #dce8ec;
          background: rgba(99, 230, 255, 0.07);
        }

        .statusOption.supported span {
          background: #72e6b2;
        }

        .statusOption.partial span {
          background: #efc76e;
        }

        .statusOption.hold span {
          background: #ef9b57;
        }

        .statusOption.escalate span {
          background: #df77dd;
        }

        .recordFields {
          margin-top: 17px;
          display: grid;
          gap: 14px;
        }

        .outcomeStrip {
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .outcomeStrip > span {
          color: #829aa5;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .outcomeStrip div {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .outcomeStrip small {
          padding: 7px 9px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 999px;
          color: #9fb2bb;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .summaryGrid article,
        .completionCard {
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(6, 20, 32, 0.68);
        }

        .summaryGrid span,
        .completionCard span {
          color: #7bddec;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .summaryGrid strong {
          display: block;
          margin-top: 9px;
          color: #efcd85;
          font: 700 38px Georgia, serif;
        }

        .summaryGrid p,
        .completionCard p {
          margin: 10px 0 0;
          color: #859ca6;
          font-size: 11px;
          line-height: 1.55;
        }

        .completionCard {
          margin-top: 14px;
        }

        .completionCard > div:first-child {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .completionCard strong {
          color: #efcd85;
          font: 700 25px Georgia, serif;
        }

        .progressTrack {
          height: 8px;
          margin-top: 16px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progressTrack div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #3eb2ca,
            #7de6f3
          );
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        .sequenceGrid article {
          min-height: 205px;
          padding: 19px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: linear-gradient(
            180deg,
            rgba(10, 30, 45, 0.9),
            rgba(3, 12, 20, 0.96)
          );
        }

        .sequenceGrid article > span {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
          color: #e1ecef;
          font: 700 19px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 11px;
          line-height: 1.55;
        }

        .boundarySection {
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

        .boundarySection h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundarySection > p:not(.eyebrow) {
          max-width: 970px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1080px;
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
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .workspaceGrid {
            grid-template-columns: 320px minmax(0, 1fr);
          }

          .summaryGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .sequenceGrid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .statusOptions {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 920px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading,
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .methodPanel {
            position: static;
          }

          .methodList {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .testingColumns {
            grid-template-columns: 1fr;
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
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

          .heroMetrics,
          .methodList,
          .summaryGrid,
          .sequenceGrid,
          .statusOptions {
            grid-template-columns: 1fr;
          }

          .testingDesk,
          .methodPanel,
          .boundarySection {
            padding: 21px;
          }

          .deskHeader,
          .panelTitle {
            flex-direction: column;
          }

          .deskIdentity {
            align-items: flex-start;
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
