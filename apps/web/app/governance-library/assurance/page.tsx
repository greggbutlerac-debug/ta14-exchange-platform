"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AssuranceTopic = {
  id: string;
  code: string;
  title: string;
  category: string;
  stage: string;
  purpose: string;
  description: string;
  evidence: string[];
  reviewQuestions: string[];
  outcomes: string[];
};

type AssuranceStatus =
  | "Not reviewed"
  | "Supported"
  | "Qualified"
  | "Hold"
  | "Escalate";

type AssuranceRecord = {
  status: AssuranceStatus;
  evidenceReference: string;
  reviewer: string;
  reviewerNote: string;
};

const assuranceTopics: AssuranceTopic[] = [
  {
    id: "independent-review",
    code: "IR",
    title: "Independent Review",
    category: "Review independence",
    stage: "Before approval or periodically",
    purpose:
      "Assess governance controls, evidence, decisions, and execution records through a reviewer who is sufficiently independent from the activity being examined.",
    description:
      "Independent review evaluates whether the evidence and governance process support the conclusion being claimed. Independence must be appropriate to the consequence, authority, and assurance level involved.",
    evidence: [
      "Declared review scope",
      "Reviewer identity and qualifications",
      "Conflict-of-interest disclosure",
      "Applicable criteria and authority",
      "Evidence package and decision records",
      "Review conclusion and limitations",
    ],
    reviewQuestions: [
      "Is the reviewer sufficiently independent from the system owner and decision maker?",
      "Does the reviewer possess the competence required for the defined scope?",
      "Are the applicable criteria fixed before the review begins?",
      "Can the reviewer inspect the complete evidence chain?",
      "Are limitations and unresolved conditions preserved in the conclusion?",
    ],
    outcomes: [
      "Independent review supported",
      "Qualified review",
      "Insufficient independence",
      "Escalation required",
    ],
  },
  {
    id: "conformity-assessment",
    code: "CA",
    title: "Conformity Assessment",
    category: "Requirement conformity",
    stage: "Before deployment or material change",
    purpose:
      "Determine whether a bounded AI system satisfies an identified set of legal, regulatory, technical, or governance requirements.",
    description:
      "Conformity assessment compares the declared system and preserved evidence against applicable requirements. A conclusion must remain bound to the reviewed system, version, scope, authority, and evidence set.",
    evidence: [
      "System identity and declared purpose",
      "Applicable requirement set",
      "Technical documentation",
      "Risk and control records",
      "Verification and validation evidence",
      "Conformity conclusion and exceptions",
    ],
    reviewQuestions: [
      "Is the system version fixed and attributable?",
      "Are the applicable requirements identified and current?",
      "Is each claimed control supported by preserved evidence?",
      "Are material exceptions explicitly recorded?",
      "Does the conclusion remain narrower than the evidence reviewed?",
    ],
    outcomes: [
      "Conformity supported",
      "Partial conformity",
      "Hold pending evidence",
      "Qualified authority required",
    ],
  },
  {
    id: "evidence-verification",
    code: "EV",
    title: "Evidence Verification",
    category: "Evidence integrity",
    stage: "Before determination",
    purpose:
      "Verify that governance conclusions are supported by attributable, preserved, complete, and admissible evidence.",
    description:
      "Evidence verification tests whether the evidence is real, traceable, current, relevant, and bound to the claim or action being evaluated. Unsupported assertions cannot be converted into governance truth through repetition or presentation.",
    evidence: [
      "Evidence source and origin",
      "Creation and preservation timestamp",
      "Chain of custody",
      "Version and integrity record",
      "Authority and relevance basis",
      "Evidence-to-claim binding",
    ],
    reviewQuestions: [
      "Can the evidence source be independently identified?",
      "Has the evidence changed since collection?",
      "Is the evidence relevant to the precise claim being made?",
      "Is the evidence current enough for the present decision?",
      "Does the evidence support the full conclusion or only part of it?",
    ],
    outcomes: [
      "Evidence verified",
      "Evidence partially verified",
      "Evidence inadmissible",
      "Further verification required",
    ],
  },
  {
    id: "execution-assurance",
    code: "EA",
    title: "Execution Assurance",
    category: "Runtime control",
    stage: "At and after execution",
    purpose:
      "Confirm that execution controls operated as designed and that the released action remained within the authorized governance boundary.",
    description:
      "Execution assurance evaluates whether the runtime gate received the correct evidence, applied the correct controls, produced the correct determination, and preserved the resulting execution and outcome record.",
    evidence: [
      "Proposed action record",
      "Runtime evidence package",
      "Authority and policy configuration",
      "ALLOW, HOLD, DENY, or ESCALATE receipt",
      "Execution event record",
      "Preserved outcome evidence",
    ],
    reviewQuestions: [
      "Was the action evaluated before release?",
      "Was the decision bound to the evidence reviewed?",
      "Could missing evidence bypass the execution gate?",
      "Did the released action match the authorized action?",
      "Was the actual outcome preserved and compared with the expected result?",
    ],
    outcomes: [
      "Execution assured",
      "Execution qualified",
      "Execution control failed",
      "Outcome review required",
    ],
  },
  {
    id: "continuous-assurance",
    code: "CO",
    title: "Continuous Assurance",
    category: "Operational continuity",
    stage: "During operation",
    purpose:
      "Maintain confidence through ongoing monitoring, reassessment, evidence refresh, and controlled response to drift or material change.",
    description:
      "Continuous assurance connects monitoring to governance decisions. Detection alone is not assurance. Material change must trigger review, invalidate stale evidence where necessary, and produce governed responses.",
    evidence: [
      "Approved operational baseline",
      "Monitoring metrics and thresholds",
      "Drift and anomaly records",
      "System and environment changes",
      "Intervention and review decisions",
      "Post-intervention outcome records",
    ],
    reviewQuestions: [
      "Are monitoring thresholds defined before incidents occur?",
      "Does material drift invalidate prior assurance conclusions?",
      "Are detected conditions routed to accountable reviewers?",
      "Can degraded conditions automatically produce HOLD?",
      "Are corrective actions followed by preserved outcome evidence?",
    ],
    outcomes: [
      "Assurance maintained",
      "Reassessment required",
      "Control degraded",
      "Operation held",
    ],
  },
  {
    id: "audit-readiness",
    code: "AR",
    title: "Audit Readiness",
    category: "Review preparedness",
    stage: "Continuous and event-driven",
    purpose:
      "Prepare organizations for internal audit, external assurance, certification review, regulatory inspection, and post-event investigation.",
    description:
      "Audit readiness requires more than document storage. Records must be attributable, searchable, preserved, complete, and capable of showing what authority existed, what evidence was used, what decision was made, and what happened afterward.",
    evidence: [
      "Governance record inventory",
      "Authority and accountability assignments",
      "Evidence retention controls",
      "Decision and execution receipts",
      "Exception and escalation history",
      "Corrective-action verification",
    ],
    reviewQuestions: [
      "Can the organization reproduce the evidence behind a past decision?",
      "Are material exceptions preserved rather than omitted?",
      "Can decision records be independently reviewed or replayed?",
      "Are retention and access controls documented?",
      "Can corrective actions be verified through outcome evidence?",
    ],
    outcomes: [
      "Audit ready",
      "Partially ready",
      "Material deficiency",
      "Insufficient evidence",
    ],
  },
];

const statusOptions: AssuranceStatus[] = [
  "Not reviewed",
  "Supported",
  "Qualified",
  "Hold",
  "Escalate",
];

function createInitialRecords(): Record<string, AssuranceRecord> {
  return Object.fromEntries(
    assuranceTopics.map((topic) => [
      topic.id,
      {
        status: "Not reviewed" as AssuranceStatus,
        evidenceReference: "",
        reviewer: "",
        reviewerNote: "",
      },
    ]),
  );
}

function getStatusClass(status: AssuranceStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function AssurancePage() {
  const [selectedTopicId, setSelectedTopicId] = useState(
    assuranceTopics[0].id,
  );
  const [records, setRecords] = useState<
    Record<string, AssuranceRecord>
  >(createInitialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All categories");

  const selectedTopic =
    assuranceTopics.find((topic) => topic.id === selectedTopicId) ??
    assuranceTopics[0];

  const selectedRecord = records[selectedTopic.id];

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(
        new Set(assuranceTopics.map((topic) => topic.category)),
      ),
    ],
    [],
  );

  const visibleTopics = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return assuranceTopics.filter((topic) => {
      const categoryMatches =
        categoryFilter === "All categories" ||
        topic.category === categoryFilter;

      const queryMatches =
        normalizedQuery.length === 0 ||
        [
          topic.title,
          topic.category,
          topic.stage,
          topic.purpose,
          topic.description,
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
      qualified: values.filter(
        (record) => record.status === "Qualified",
      ).length,
      hold: values.filter((record) => record.status === "Hold")
        .length,
      escalate: values.filter(
        (record) => record.status === "Escalate",
      ).length,
      completed: values.filter(
        (record) => record.status !== "Not reviewed",
      ).length,
    };
  }, [records]);

  const completionPercentage = Math.round(
    (summary.completed / summary.total) * 100,
  );

  function updateSelectedRecord(
    field: keyof AssuranceRecord,
    value: string,
  ) {
    setRecords((current) => ({
      ...current,
      [selectedTopic.id]: {
        ...current[selectedTopic.id],
        [field]: value,
      },
    }));
  }

  function resetWorkspace() {
    setRecords(createInitialRecords());
  }

  return (
    <main className="assurancePage">
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
            Assurance review workspace
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
            <span>GA</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Governance
            <span> Assurance Workspace</span>
          </h1>

          <p className="lead">
            Evaluate whether governance controls, evidence, review
            processes, execution decisions, and preserved outcomes
            support the assurance conclusion being claimed.
            Assurance must remain bounded by competence,
            independence, authority, evidence, scope, and time.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{assuranceTopics.length}</span>
              <small>Assurance domains</small>
            </article>

            <article>
              <span>{summary.completed}</span>
              <small>Domains reviewed</small>
            </article>

            <article>
              <span>{summary.supported}</span>
              <small>Supported conclusions</small>
            </article>

            <article>
              <span>{summary.hold}</span>
              <small>Hold determinations</small>
            </article>

            <article>
              <span>{completionPercentage}%</span>
              <small>Review completion</small>
            </article>
          </div>
        </header>

        <section className="workspaceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                ASSURANCE CONTROL DESK
              </p>

              <h2>
                Select the assurance domain.
              </h2>
            </div>

            <p>
              Every conclusion remains bound to the identified
              system, version, authority, evidence set, reviewer,
              methodology, operating context, and review date.
              Material change requires reassessment.
            </p>
          </div>

          <div className="workspaceGrid">
            <aside className="topicPanel">
              <div className="filterStack">
                <label>
                  Search assurance domains
                  <input
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search by domain, purpose, or stage"
                  />
                </label>

                <label>
                  Assurance category
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

              <div className="topicList">
                {visibleTopics.map((topic, index) => {
                  const record = records[topic.id];
                  const active = topic.id === selectedTopic.id;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`topicButton ${
                        active ? "active" : ""
                      }`}
                      onClick={() => setSelectedTopicId(topic.id)}
                    >
                      <span className="topicIndex">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="topicText">
                        <strong>{topic.title}</strong>
                        <small>{topic.stage}</small>
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

                {visibleTopics.length === 0 ? (
                  <div className="emptyState">
                    No assurance domains match the current filters.
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="assuranceDesk">
              <div className="deskHeader">
                <div className="deskIdentity">
                  <div className="deskCode">
                    {selectedTopic.code}
                  </div>

                  <div>
                    <p>{selectedTopic.category}</p>
                    <h3>{selectedTopic.title}</h3>
                    <span>{selectedTopic.stage}</span>
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
                <span>Assurance purpose</span>
                <strong>{selectedTopic.purpose}</strong>
                <p>{selectedTopic.description}</p>
              </div>

              <div className="assuranceColumns">
                <article className="evidenceCard">
                  <div className="cardHeading">
                    <span>Required evidence</span>
                    <strong>
                      {selectedTopic.evidence.length}
                    </strong>
                  </div>

                  <div className="checkList">
                    {selectedTopic.evidence.map(
                      (evidence, index) => (
                        <div key={evidence}>
                          <span>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p>{evidence}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>

                <article className="evidenceCard">
                  <div className="cardHeading">
                    <span>Review questions</span>
                    <strong>
                      {selectedTopic.reviewQuestions.length}
                    </strong>
                  </div>

                  <div className="checkList">
                    {selectedTopic.reviewQuestions.map(
                      (question, index) => (
                        <div key={question}>
                          <span>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p>{question}</p>
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
                      ASSURANCE DETERMINATION
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
                        updateSelectedRecord("status", status)
                      }
                    >
                      <span />
                      {status}
                    </button>
                  ))}
                </div>

                <div className="recordFields">
                  <label>
                    Reviewer
                    <input
                      value={selectedRecord.reviewer}
                      onChange={(event) =>
                        updateSelectedRecord(
                          "reviewer",
                          event.target.value,
                        )
                      }
                      placeholder="Reviewer name, organization, or role"
                    />
                  </label>

                  <label>
                    Evidence reference
                    <input
                      value={selectedRecord.evidenceReference}
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
                      placeholder="State the reviewed evidence, conclusion, limitation, unresolved condition, or escalation basis."
                      rows={5}
                    />
                  </label>
                </div>

                <div className="outcomeStrip">
                  <span>Domain-specific outcomes</span>

                  <div>
                    {selectedTopic.outcomes.map((outcome) => (
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
                ASSURANCE SUMMARY
              </p>

              <h2>
                Read the condition of assurance.
              </h2>
            </div>

            <p>
              These counts show the current workspace condition.
              They do not constitute certification, regulatory
              approval, legal advice, or permission to execute.
            </p>
          </div>

          <div className="summaryGrid">
            <article>
              <span>Supported</span>
              <strong>{summary.supported}</strong>
              <p>
                Evidence presently supports the bounded assurance
                conclusion.
              </p>
            </article>

            <article>
              <span>Qualified</span>
              <strong>{summary.qualified}</strong>
              <p>
                Assurance is supported only with stated limitations
                or exceptions.
              </p>
            </article>

            <article>
              <span>Hold</span>
              <strong>{summary.hold}</strong>
              <p>
                Evidence, authority, independence, or control is
                insufficient.
              </p>
            </article>

            <article>
              <span>Escalate</span>
              <strong>{summary.escalate}</strong>
              <p>
                A higher authority or more qualified reviewer is
                required.
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
              {summary.completed} of {summary.total} assurance
              domains currently contain a determination.
            </p>
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                GOVERNED ASSURANCE SEQUENCE
              </p>

              <h2>
                Assurance must follow the evidence.
              </h2>
            </div>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Declare",
                text: "Fix the system, version, purpose, scope, consequence, and assurance claim.",
              },
              {
                code: "02",
                title: "Qualify",
                text: "Confirm reviewer competence, independence, authority, and conflicts.",
              },
              {
                code: "03",
                title: "Verify",
                text: "Verify the origin, integrity, relevance, currency, and completeness of evidence.",
              },
              {
                code: "04",
                title: "Assess",
                text: "Evaluate controls and records against the declared assurance criteria.",
              },
              {
                code: "05",
                title: "Determine",
                text: "Record supported, qualified, hold, or escalation outcomes without overstating scope.",
              },
              {
                code: "06",
                title: "Preserve",
                text: "Preserve the evidence, reviewer, conclusion, execution decision, and resulting outcome.",
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
            <span>AB</span>
            <small>Assurance boundary</small>
          </div>

          <p className="eyebrow gold">
            ASSURANCE BOUNDARY
          </p>

          <h2>
            Assurance is not unlimited authority.
          </h2>

          <p>
            Assurance establishes what was reviewed, by whom, under
            which criteria, using which evidence, within which
            boundary, and with what conclusion. It does not
            automatically establish universal compliance,
            certification, legal conformity, admissibility, or
            permission to execute. Execution requires applicable
            authority, evidence continuity, binding, admissibility,
            runtime control, and preserved outcome proof.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>ASSURANCE PROVES</span>
              <strong>
                What was reviewed and what the evidence supports
                within the declared assurance boundary
              </strong>
            </article>

            <article>
              <span>ASSURANCE DOES NOT PROVE</span>
              <strong>
                Universal fitness, permanent compliance, unlimited
                certification, or authority beyond the reviewed scope
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Admissible evidence, authority, continuity, binding,
                runtime control, and preserved outcome evidence
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Open Testing
            </Link>

            <Link
              href="/governance-library/governed-records"
              className="secondaryAction"
            >
              Open Governed Records
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
        .assurancePage {
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

        .topicPanel,
        .assuranceDesk {
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

        .topicPanel {
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

        .topicList {
          margin-top: 17px;
          display: grid;
          gap: 9px;
        }

        .topicButton {
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

        .topicButton:hover,
        .topicButton.active {
          transform: translateX(3px);
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .topicIndex {
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

        .topicText {
          min-width: 0;
          display: grid;
          gap: 5px;
        }

        .topicText strong {
          overflow: hidden;
          color: #dce8ec;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .topicText small {
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

        .statusDot.qualified {
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

        .assuranceDesk {
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

        .currentStatus.qualified {
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

        .assuranceColumns {
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

        .statusOption.qualified span {
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

          .topicPanel {
            position: static;
          }

          .topicList {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .assuranceColumns {
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
          .topicList,
          .summaryGrid,
          .sequenceGrid,
          .statusOptions {
            grid-template-columns: 1fr;
          }

          .assuranceDesk,
          .topicPanel,
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
