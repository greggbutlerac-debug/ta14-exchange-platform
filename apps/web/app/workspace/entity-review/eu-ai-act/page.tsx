"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReviewStatus =
  | "Not Reviewed"
  | "Supported"
  | "Partial"
  | "Hold"
  | "Escalate";

type ReviewItem = {
  id: string;
  article: string;
  title: string;
  obligation: string;
  evidenceNeeded: string[];
  defaultStatus: ReviewStatus;
};

type Finding = {
  status: ReviewStatus;
  evidence: string;
  reviewer: string;
  authority: string;
  notes: string;
};

const reviewItems: ReviewItem[] = [
  {
    id: "article-9",
    article: "Article 9",
    title: "Risk Management",
    obligation:
      "Establish, implement, document, and maintain a continuous risk-management system for the lifecycle of the high-risk AI system.",
    evidenceNeeded: [
      "Risk register",
      "Lifecycle review history",
      "Mitigation records",
      "Outcome verification",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-10",
    article: "Article 10",
    title: "Data and Data Governance",
    obligation:
      "Demonstrate appropriate governance and management of training, validation, and testing datasets.",
    evidenceNeeded: [
      "Dataset provenance",
      "Version history",
      "Selection criteria",
      "Known limitations",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-11",
    article: "Article 11",
    title: "Technical Documentation",
    obligation:
      "Maintain documentation sufficient to demonstrate conformity and support assessment by competent authorities.",
    evidenceNeeded: [
      "System architecture",
      "Intended purpose",
      "Technical specifications",
      "Change history",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-12",
    article: "Article 12",
    title: "Record-Keeping",
    obligation:
      "Enable automatic recording of events relevant to risk identification, system operation, and post-market monitoring.",
    evidenceNeeded: [
      "Execution logs",
      "Event history",
      "Replay records",
      "Version-linked outcomes",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-13",
    article: "Article 13",
    title: "Transparency and Instructions",
    obligation:
      "Provide sufficient transparency and instructions for deployers to interpret outputs and use the system appropriately.",
    evidenceNeeded: [
      "Instructions for use",
      "Declared limitations",
      "Prohibited uses",
      "Acknowledgment records",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-14",
    article: "Article 14",
    title: "Human Oversight",
    obligation:
      "Provide measures enabling effective human oversight, intervention, pause, override, or escalation.",
    evidenceNeeded: [
      "Oversight roles",
      "Authority assignments",
      "Intervention history",
      "Reviewer determinations",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-15",
    article: "Article 15",
    title: "Accuracy, Robustness, and Cybersecurity",
    obligation:
      "Demonstrate appropriate levels of accuracy, robustness, and cybersecurity throughout the lifecycle.",
    evidenceNeeded: [
      "Performance thresholds",
      "Test evidence",
      "Failure history",
      "Cybersecurity controls",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-17",
    article: "Article 17",
    title: "Quality Management",
    obligation:
      "Maintain a documented quality-management system covering responsibilities, procedures, testing, records, and corrective actions.",
    evidenceNeeded: [
      "Quality procedures",
      "Role ownership",
      "Corrective actions",
      "Governance history",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-26",
    article: "Article 26",
    title: "Deployer Obligations",
    obligation:
      "Use the system according to instructions, assign oversight, monitor operation, preserve logs, and address relevant risks.",
    evidenceNeeded: [
      "Deployment record",
      "Operating context",
      "Oversight assignment",
      "Monitoring history",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-27",
    article: "Article 27",
    title: "Fundamental Rights Impact Assessment",
    obligation:
      "Complete an impact assessment before deployment where the obligation applies.",
    evidenceNeeded: [
      "Use-case declaration",
      "Affected-party analysis",
      "Impact evidence",
      "Mitigation record",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-50",
    article: "Article 50",
    title: "Transparency for Certain AI Systems",
    obligation:
      "Provide required disclosures, notices, or machine-readable markings for applicable interactions or generated content.",
    evidenceNeeded: [
      "Disclosure record",
      "Marking evidence",
      "Publication record",
      "Applicability rationale",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-72",
    article: "Article 72",
    title: "Post-Market Monitoring",
    obligation:
      "Maintain a system for collecting, documenting, and analyzing performance data throughout the lifecycle.",
    evidenceNeeded: [
      "Monitoring plan",
      "Baseline",
      "Drift history",
      "Post-intervention outcomes",
    ],
    defaultStatus: "Not Reviewed",
  },
  {
    id: "article-73",
    article: "Article 73",
    title: "Serious Incident Reporting",
    obligation:
      "Preserve and report serious incidents to relevant authorities within applicable timelines.",
    evidenceNeeded: [
      "Incident chronology",
      "Notification evidence",
      "Affected route",
      "Corrective action",
    ],
    defaultStatus: "Not Reviewed",
  },
];

const statusOptions: ReviewStatus[] = [
  "Not Reviewed",
  "Supported",
  "Partial",
  "Hold",
  "Escalate",
];

export default function EuAiActEntityReviewPage() {
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState("AI System");
  const [systemRole, setSystemRole] = useState("Provider");
  const [reviewQuestion, setReviewQuestion] = useState(
    "Does the submitted entity demonstrate support for the declared EU AI Act obligations?",
  );
  const [findings, setFindings] = useState<Record<string, Finding>>(
    Object.fromEntries(
      reviewItems.map((item) => [
        item.id,
        {
          status: item.defaultStatus,
          evidence: "",
          reviewer: "",
          authority: "",
          notes: "",
        },
      ]),
    ),
  );
  const [expanded, setExpanded] = useState<string | null>("article-9");
  const [filter, setFilter] = useState<"All" | ReviewStatus>("All");

  const filteredItems = useMemo(() => {
    return reviewItems.filter((item) => {
      const current = findings[item.id]?.status ?? "Not Reviewed";
      return filter === "All" || current === filter;
    });
  }, [filter, findings]);

  const counts = useMemo(() => {
    const result: Record<ReviewStatus, number> = {
      "Not Reviewed": 0,
      Supported: 0,
      Partial: 0,
      Hold: 0,
      Escalate: 0,
    };

    reviewItems.forEach((item) => {
      const status = findings[item.id]?.status ?? "Not Reviewed";
      result[status] += 1;
    });

    return result;
  }, [findings]);

  const updateFinding = (
    id: string,
    patch: Partial<Finding>,
  ) => {
    setFindings((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  };

  const reviewedCount =
    reviewItems.length - counts["Not Reviewed"];

  const reviewOutcome =
    counts.Hold > 0
      ? "HOLD"
      : counts.Escalate > 0
        ? "ESCALATE"
        : reviewedCount === 0
          ? "NOT STARTED"
          : counts.Partial > 0 || counts["Not Reviewed"] > 0
            ? "PARTIAL"
            : "SUPPORTED";

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/workspace/entity-review" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Entity Review</strong>
            <small>Entity Review Workspace</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance/eu-ai-act">
            Requirements
          </Link>
          <Link href="/workspace/governed-records/eu-ai-act">
            Record Requirements
          </Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">EU AI ACT ENTITY REVIEW</p>
          <h1>Review the entity against the obligation—not the marketing claim.</h1>
          <p className="lead">
            Declare the entity, role, review question, evidence, reviewer, and
            authority. Preserve a bounded finding for each applicable
            requirement without converting missing evidence into confidence.
          </p>
        </div>

        <div className="outcomePanel">
          <span className="panelLabel">CURRENT REVIEW OUTCOME</span>
          <strong className={`outcome ${reviewOutcome.toLowerCase().replace(" ", "-")}`}>
            {reviewOutcome}
          </strong>
          <p>
            {reviewedCount} of {reviewItems.length} requirements reviewed
          </p>
        </div>
      </section>

      <section className="entityForm shell">
        <div className="sectionIntro">
          <p className="eyebrow">ENTITY DECLARATION</p>
          <h2>Start by identifying exactly what is under review.</h2>
        </div>

        <div className="formGrid">
          <label>
            <span>Entity name</span>
            <input
              value={entityName}
              onChange={(event) => setEntityName(event.target.value)}
              placeholder="Organization, system, architecture, or route"
            />
          </label>

          <label>
            <span>Entity type</span>
            <select
              value={entityType}
              onChange={(event) => setEntityType(event.target.value)}
            >
              <option>AI System</option>
              <option>Organization</option>
              <option>Governance Architecture</option>
              <option>Consequential Route</option>
              <option>Deployment</option>
            </select>
          </label>

          <label>
            <span>Declared role</span>
            <select
              value={systemRole}
              onChange={(event) => setSystemRole(event.target.value)}
            >
              <option>Provider</option>
              <option>Deployer</option>
              <option>Importer</option>
              <option>Distributor</option>
              <option>Product Manufacturer</option>
              <option>Authorized Representative</option>
              <option>Multiple Roles</option>
            </select>
          </label>

          <label className="wide">
            <span>Review question</span>
            <textarea
              value={reviewQuestion}
              onChange={(event) => setReviewQuestion(event.target.value)}
              rows={4}
            />
          </label>
        </div>
      </section>

      <section className="summary shell">
        <article>
          <span>{counts.Supported}</span>
          <strong>Supported</strong>
        </article>
        <article>
          <span>{counts.Partial}</span>
          <strong>Partial</strong>
        </article>
        <article>
          <span>{counts.Hold}</span>
          <strong>Hold</strong>
        </article>
        <article>
          <span>{counts.Escalate}</span>
          <strong>Escalate</strong>
        </article>
        <article>
          <span>{counts["Not Reviewed"]}</span>
          <strong>Not reviewed</strong>
        </article>
      </section>

      <section className="reviewSection shell">
        <div className="reviewHeader">
          <div>
            <p className="eyebrow">REQUIREMENT REVIEW</p>
            <h2>Preserve one attributable finding at a time.</h2>
            <p>
              A requirement can be supported, partially supported, held for
              missing evidence, escalated beyond current authority, or left
              unreviewed.
            </p>
          </div>

          <div className="filterGroup">
            {(["All", ...statusOptions] as const).map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setFilter(status)}
                className={filter === status ? "active" : ""}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="reviewList">
          {filteredItems.map((item) => {
            const finding = findings[item.id];
            const isOpen = expanded === item.id;

            return (
              <article className={`reviewItem ${isOpen ? "open" : ""}`} key={item.id}>
                <button
                  type="button"
                  className="reviewItemHeader"
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                >
                  <div className="articleBadge">{item.article}</div>

                  <div className="titleBlock">
                    <span className={`statusPill ${finding.status.toLowerCase().replace(" ", "-")}`}>
                      {finding.status}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.obligation}</p>
                  </div>

                  <span className="expandIcon">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="reviewBody">
                    <div className="evidenceNeeded">
                      <span className="detailLabel">Evidence expected</span>
                      <div className="tagGrid">
                        {item.evidenceNeeded.map((evidence) => (
                          <span key={evidence}>{evidence}</span>
                        ))}
                      </div>
                    </div>

                    <div className="findingGrid">
                      <label>
                        <span>Status</span>
                        <select
                          value={finding.status}
                          onChange={(event) =>
                            updateFinding(item.id, {
                              status: event.target.value as ReviewStatus,
                            })
                          }
                        >
                          {statusOptions.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>

                      <label>
                        <span>Reviewer identity</span>
                        <input
                          value={finding.reviewer}
                          onChange={(event) =>
                            updateFinding(item.id, {
                              reviewer: event.target.value,
                            })
                          }
                          placeholder="Named reviewer"
                        />
                      </label>

                      <label>
                        <span>Review authority</span>
                        <input
                          value={finding.authority}
                          onChange={(event) =>
                            updateFinding(item.id, {
                              authority: event.target.value,
                            })
                          }
                          placeholder="Declared role or authority"
                        />
                      </label>

                      <label className="wide">
                        <span>Evidence references</span>
                        <textarea
                          rows={4}
                          value={finding.evidence}
                          onChange={(event) =>
                            updateFinding(item.id, {
                              evidence: event.target.value,
                            })
                          }
                          placeholder="Record IDs, document versions, log references, or unresolved evidence gaps"
                        />
                      </label>

                      <label className="wide">
                        <span>Bounded finding</span>
                        <textarea
                          rows={5}
                          value={finding.notes}
                          onChange={(event) =>
                            updateFinding(item.id, {
                              notes: event.target.value,
                            })
                          }
                          placeholder="What is supported, what remains unresolved, and what this finding does not establish"
                        />
                      </label>
                    </div>

                    <div className="reviewActions">
                      <Link
                        href={`/workspace/governed-records/builder?article=${encodeURIComponent(
                          item.article,
                        )}&entity=${encodeURIComponent(entityName)}`}
                      >
                        Create supporting record
                        <span>→</span>
                      </Link>

                      <Link
                        href={`/workspace/governed-records/eu-ai-act?article=${encodeURIComponent(
                          item.article,
                        )}`}
                      >
                        View record requirements
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="determination shell">
        <div>
          <p className="eyebrow">REVIEW DETERMINATION</p>
          <h2>{reviewOutcome}</h2>
          <p>
            This outcome reflects only the current requirement findings for the
            declared entity and review question. It does not constitute legal
            certification, conformity assessment, market authorization, or
            regulatory approval.
          </p>
        </div>

        <div className="determinationFacts">
          <span>
            <strong>Entity</strong>
            {entityName || "Not declared"}
          </span>
          <span>
            <strong>Type</strong>
            {entityType}
          </span>
          <span>
            <strong>Role</strong>
            {systemRole}
          </span>
          <span>
            <strong>Reviewed</strong>
            {reviewedCount} / {reviewItems.length}
          </span>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Evidence support is not the same as legal conformity.</h2>
        </div>
        <p>
          This workspace preserves the entity, obligation, submitted evidence,
          reviewer, authority, status, and bounded finding. Qualified legal
          counsel, notified bodies, competent authorities, or market-surveillance
          authorities may be required for formal legal conclusions.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">NEXT STEP</p>
          <h2>Complete the missing records before advancing the claim.</h2>
          <p>
            Use the Governed Records workspace to create, interpret, and review
            the evidence supporting unresolved obligations.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/governed-records/eu-ai-act"
        >
          Open Record Requirements
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/entity-review">Return to Entity Review</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #090a0d;
        }

        :global(body) {
          margin: 0;
          color: #fffaf0;
          background:
            radial-gradient(circle at 12% 8%, rgba(255, 177, 30, 0.12), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(202, 118, 22, 0.1), transparent 28%),
            linear-gradient(180deg, #090a0d 0%, #11100f 50%, #08090d 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(255,183,48,.6) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .glow {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.11;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #ffb31e;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #ca6f18;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(190, 160, 112, 0.17);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #1a1003;
          background: linear-gradient(135deg, #ffb31f, #ffe7a8);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #958a78;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #b9ae9e;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 520px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 48px;
          align-items: center;
          padding: 72px 0 52px;
        }

        .eyebrow {
          margin: 0;
          color: #ffb421;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 860px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 760px;
          margin: 0;
          color: #b5aa9b;
          font-size: 18px;
          line-height: 1.68;
        }

        .outcomePanel {
          min-height: 260px;
          padding: 34px;
          border-radius: 28px;
          border: 1px solid rgba(255, 186, 48, 0.24);
          background:
            radial-gradient(circle at 50% 30%, rgba(255, 177, 27, 0.11), transparent 46%),
            linear-gradient(180deg, rgba(30, 23, 14, 0.94), rgba(13, 11, 9, 0.98));
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .panelLabel {
          color: #b9965b;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .outcome {
          margin-top: 18px;
          font-size: clamp(38px, 6vw, 68px);
          letter-spacing: -0.05em;
        }

        .outcome.supported {
          color: #79e3b5;
        }

        .outcome.partial {
          color: #ffd16a;
        }

        .outcome.hold {
          color: #ff9f63;
        }

        .outcome.escalate {
          color: #c2a3ff;
        }

        .outcome.not-started {
          color: #a99d8d;
        }

        .outcomePanel p {
          margin: 12px 0 0;
          color: #9c9182;
        }

        .entityForm,
        .reviewSection,
        .determination,
        .boundary,
        .finalCta {
          border: 1px solid rgba(181, 148, 96, 0.17);
          background:
            linear-gradient(180deg, rgba(24, 20, 15, 0.91), rgba(12, 11, 10, 0.96));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
        }

        .entityForm {
          padding: 42px;
        }

        .sectionIntro h2,
        .reviewHeader h2,
        .determination h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .formGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 28px;
        }

        label {
          display: grid;
          gap: 9px;
        }

        label span {
          color: #c9bba9;
          font-size: 12px;
          font-weight: 800;
        }

        .wide {
          grid-column: 1 / -1;
        }

        input,
        select,
        textarea {
          width: 100%;
          border-radius: 13px;
          border: 1px solid rgba(180, 149, 103, 0.2);
          background: rgba(8, 8, 7, 0.84);
          color: #fff8ec;
          outline: none;
          font: inherit;
        }

        input,
        select {
          min-height: 50px;
          padding: 0 14px;
        }

        textarea {
          padding: 14px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(255, 183, 43, 0.54);
          box-shadow: 0 0 0 3px rgba(255, 180, 34, 0.07);
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          padding: 26px 0 70px;
        }

        .summary article {
          min-height: 120px;
          padding: 22px;
          border-radius: 18px;
          border: 1px solid rgba(179, 145, 95, 0.16);
          background: rgba(20, 17, 13, 0.8);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .summary span {
          color: #ffbd3d;
          font-size: 34px;
          font-weight: 900;
        }

        .summary strong {
          margin-top: 7px;
          color: #d6c7b5;
          font-size: 13px;
        }

        .reviewSection {
          padding: 42px;
        }

        .reviewHeader {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 34px;
          align-items: end;
        }

        .reviewHeader > div:first-child p:not(.eyebrow),
        .determination p,
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #b4aa9d;
          line-height: 1.68;
        }

        .filterGroup {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .filterGroup button {
          min-height: 38px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(180, 148, 101, 0.17);
          background: rgba(255, 255, 255, 0.025);
          color: #b7aa98;
          cursor: pointer;
          font-weight: 800;
        }

        .filterGroup button.active {
          border-color: rgba(255, 184, 42, 0.46);
          background: rgba(169, 102, 17, 0.12);
          color: #fff1d4;
        }

        .reviewList {
          display: grid;
          gap: 12px;
          margin-top: 30px;
        }

        .reviewItem {
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(179, 145, 95, 0.16);
          background: rgba(15, 13, 10, 0.88);
        }

        .reviewItem.open {
          border-color: rgba(255, 181, 34, 0.42);
        }

        .reviewItemHeader {
          width: 100%;
          min-height: 118px;
          display: grid;
          grid-template-columns: 112px 1fr 42px;
          gap: 20px;
          align-items: center;
          padding: 20px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .articleBadge {
          min-height: 56px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(255, 184, 44, 0.28);
          background: rgba(167, 99, 16, 0.08);
          color: #ffc65d;
          font-size: 15px;
          font-weight: 900;
        }

        .titleBlock h3 {
          margin: 9px 0 6px;
          font-size: 23px;
          letter-spacing: -0.025em;
        }

        .titleBlock p {
          margin: 0;
          color: #978b7c;
          font-size: 13px;
          line-height: 1.5;
        }

        .statusPill {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .statusPill.supported {
          color: #91efc8;
          border: 1px solid rgba(89, 216, 158, 0.22);
          background: rgba(65, 193, 137, 0.1);
        }

        .statusPill.partial {
          color: #ffd875;
          border: 1px solid rgba(237, 181, 64, 0.22);
          background: rgba(214, 156, 42, 0.1);
        }

        .statusPill.hold {
          color: #ffad78;
          border: 1px solid rgba(241, 139, 76, 0.22);
          background: rgba(216, 100, 35, 0.1);
        }

        .statusPill.escalate {
          color: #c8adff;
          border: 1px solid rgba(171, 128, 247, 0.22);
          background: rgba(129, 83, 211, 0.1);
        }

        .statusPill.not-reviewed {
          color: #b4a897;
          border: 1px solid rgba(180, 164, 144, 0.18);
          background: rgba(134, 118, 98, 0.08);
        }

        .expandIcon {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 184, 42, 0.21);
          color: #ffc455;
          font-size: 22px;
        }

        .reviewBody {
          padding: 0 20px 24px 152px;
          border-top: 1px solid rgba(180, 148, 101, 0.12);
        }

        .evidenceNeeded {
          padding-top: 22px;
        }

        .detailLabel {
          color: #ffbd3e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .tagGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 12px;
        }

        .tagGrid span {
          padding: 9px 11px;
          border-radius: 999px;
          border: 1px solid rgba(255, 182, 36, 0.18);
          background: rgba(165, 99, 17, 0.06);
          color: #f1e3cf;
          font-size: 12px;
          font-weight: 750;
        }

        .findingGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 24px;
        }

        .reviewActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .reviewActions a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 0 14px;
          border-radius: 11px;
          border: 1px solid rgba(255, 184, 42, 0.22);
          background: rgba(165, 98, 16, 0.06);
          color: #ffc459;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .determination {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 34px;
          align-items: center;
        }

        .determination h2 {
          color: #ffbd3e;
        }

        .determinationFacts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .determinationFacts span {
          min-height: 92px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(180, 148, 101, 0.15);
          background: rgba(255, 255, 255, 0.02);
          color: #d9cbb8;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .determinationFacts strong {
          margin-bottom: 6px;
          color: #a99882;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .boundary {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
        }

        .boundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 74px;
          padding: 54px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .finalCta > div {
          max-width: 760px;
        }

        .primaryButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          color: #1b1002;
          background: linear-gradient(135deg, #ffb51f, #ffe6a4);
          box-shadow: 0 14px 38px rgba(255, 174, 28, 0.18);
          text-decoration: none;
          font-weight: 850;
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #887d6e;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes glowMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @media (max-width: 980px) {
          nav {
            display: none;
          }

          .hero,
          .reviewHeader,
          .determination,
          .boundary {
            grid-template-columns: 1fr;
          }

          .formGrid,
          .findingGrid {
            grid-template-columns: 1fr;
          }

          .summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filterGroup {
            justify-content: flex-start;
          }

          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 680px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .entityForm,
          .reviewSection,
          .determination,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .summary,
          .determinationFacts {
            grid-template-columns: 1fr;
          }

          .reviewItemHeader {
            grid-template-columns: 1fr 38px;
          }

          .articleBadge {
            grid-column: 1 / -1;
            width: fit-content;
            min-width: 110px;
          }

          .reviewBody {
            padding: 0 20px 24px;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
