"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RequirementStatus = "Mapped" | "Partial" | "Unmapped";

type Requirement = {
  id: string;
  article: string;
  title: string;
  appliesTo: string;
  summary: string;
  ta14Response: string[];
  evidence: string[];
  status: RequirementStatus;
};

const requirements: Requirement[] = [
  {
    id: "risk-management",
    article: "Article 9",
    title: "Risk management system",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Establish, implement, document, and maintain a continuous risk-management process across the lifecycle of the high-risk AI system.",
    ta14Response: [
      "Separate declared hazards, evidence, determinations, interventions, and outcomes.",
      "Preserve route-level HOLD, DENY, ESCALATE, and ALLOW conditions.",
      "Maintain change history and post-intervention verification records.",
    ],
    evidence: [
      "Risk register",
      "Route review records",
      "Change history",
      "Outcome verification records",
    ],
    status: "Mapped",
  },
  {
    id: "data-governance",
    article: "Article 10",
    title: "Data and data governance",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Use training, validation, and testing datasets subject to appropriate governance and management practices.",
    ta14Response: [
      "Preserve source, version, custody, scope, provenance, and declared limitations.",
      "Separate dataset facts from interpretations and downstream determinations.",
      "Expose missing continuity and unsupported claims before execution.",
    ],
    evidence: [
      "Dataset provenance records",
      "Version records",
      "Continuity review",
      "Declared limitations",
    ],
    status: "Mapped",
  },
  {
    id: "technical-documentation",
    article: "Article 11",
    title: "Technical documentation",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Prepare documentation demonstrating that the system complies with applicable requirements and supports assessment by competent authorities.",
    ta14Response: [
      "Create governed records with attributable authorship, dates, scope, and preserved versions.",
      "Bind architecture claims to evidence and review findings.",
      "Maintain explicit proof and non-proof boundaries.",
    ],
    evidence: [
      "Governed technical record",
      "Architecture review",
      "Evidence index",
      "Version history",
    ],
    status: "Mapped",
  },
  {
    id: "record-keeping",
    article: "Article 12",
    title: "Record-keeping and logging",
    appliesTo: "Providers and deployers of high-risk AI systems",
    summary:
      "Enable automatic recording of events relevant to identifying risks, post-market monitoring, and system operation.",
    ta14Response: [
      "Preserve execution, authority, payload, tool, route, and outcome events.",
      "Maintain replay and verification history.",
      "Separate logging from interpretation and final determinations.",
    ],
    evidence: [
      "Execution logs",
      "Admissible Execution Records",
      "Replay records",
      "Outcome records",
    ],
    status: "Mapped",
  },
  {
    id: "transparency-instructions",
    article: "Article 13",
    title: "Transparency and instructions for use",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Ensure sufficient transparency for deployers to interpret outputs and use the system appropriately.",
    ta14Response: [
      "Declare purpose, scope, system boundaries, dependencies, and prohibited uses.",
      "Preserve the difference between output, interpretation, determination, and action.",
      "Expose known limitations and unresolved conditions.",
    ],
    evidence: [
      "Instructions for use",
      "Declared scope",
      "Boundary record",
      "Known limitation record",
    ],
    status: "Mapped",
  },
  {
    id: "human-oversight",
    article: "Article 14",
    title: "Human oversight",
    appliesTo: "Providers and deployers of high-risk AI systems",
    summary:
      "Design and use systems so that natural persons can effectively oversee operation and intervene when necessary.",
    ta14Response: [
      "Declare who holds authority to review, pause, override, deny, or escalate.",
      "Preserve the evidence available to the human reviewer at decision time.",
      "Record whether human action occurred before or after execution.",
    ],
    evidence: [
      "Authority record",
      "Oversight role record",
      "Pause or override record",
      "Reviewer determination",
    ],
    status: "Mapped",
  },
  {
    id: "accuracy-robustness-cybersecurity",
    article: "Article 15",
    title: "Accuracy, robustness, and cybersecurity",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Achieve appropriate levels of accuracy, robustness, and cybersecurity throughout the lifecycle.",
    ta14Response: [
      "Preserve declared performance thresholds and test evidence.",
      "Record drift, failures, attack conditions, and continuity breaks.",
      "Prevent unsupported performance claims from becoming execution authority.",
    ],
    evidence: [
      "Performance test record",
      "Robustness evidence",
      "Cybersecurity review",
      "Drift record",
    ],
    status: "Mapped",
  },
  {
    id: "quality-management",
    article: "Article 17",
    title: "Quality management system",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Implement a documented quality-management system covering strategy, procedures, responsibilities, testing, data, records, and corrective action.",
    ta14Response: [
      "Bind procedures, roles, evidence, reviews, corrective actions, and outcomes into a preserved chain.",
      "Maintain accountability for each declared determination.",
      "Preserve changes without overwriting the historical record.",
    ],
    evidence: [
      "Quality procedures",
      "Role assignments",
      "Corrective action records",
      "Governance history",
    ],
    status: "Partial",
  },
  {
    id: "deployer-obligations",
    article: "Article 26",
    title: "Obligations of deployers",
    appliesTo: "Deployers of high-risk AI systems",
    summary:
      "Use systems according to instructions, assign oversight, monitor operation, preserve logs, and address relevant risks.",
    ta14Response: [
      "Create deployer-side authority and use-condition records.",
      "Preserve actual operating context and deviations from instructions.",
      "Record monitoring, interventions, and post-use outcomes.",
    ],
    evidence: [
      "Deployment record",
      "Operating context record",
      "Human oversight record",
      "Monitoring history",
    ],
    status: "Mapped",
  },
  {
    id: "fundamental-rights-impact",
    article: "Article 27",
    title: "Fundamental rights impact assessment",
    appliesTo: "Certain deployers of high-risk AI systems",
    summary:
      "Assess the impact of use on fundamental rights before deployment in applicable circumstances.",
    ta14Response: [
      "Preserve the declared use case, affected persons, risks, evidence, mitigations, and unresolved conditions.",
      "Separate impact evidence from legal determinations.",
      "Maintain attributable reviewer and authority records.",
    ],
    evidence: [
      "Impact assessment record",
      "Affected-party analysis",
      "Mitigation record",
      "Authority review",
    ],
    status: "Partial",
  },
  {
    id: "post-market-monitoring",
    article: "Article 72",
    title: "Post-market monitoring",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Establish and document a system to actively collect, document, and analyze performance data throughout the lifecycle.",
    ta14Response: [
      "Preserve ongoing outcome, incident, drift, and intervention records.",
      "Compare post-deployment performance against declared baselines.",
      "Maintain continuity across versions and operating contexts.",
    ],
    evidence: [
      "Post-market monitoring plan",
      "Outcome history",
      "Drift history",
      "Version comparison",
    ],
    status: "Mapped",
  },
  {
    id: "serious-incidents",
    article: "Article 73",
    title: "Serious incident reporting",
    appliesTo: "Providers of high-risk AI systems",
    summary:
      "Report serious incidents to relevant authorities within applicable timelines.",
    ta14Response: [
      "Create incident records with event time, evidence, affected route, actions, and authority.",
      "Preserve what was known at each stage.",
      "Separate initial notice from later causal or legal determinations.",
    ],
    evidence: [
      "Incident record",
      "Initial notification",
      "Evidence chronology",
      "Corrective action record",
    ],
    status: "Partial",
  },
  {
    id: "article-50",
    article: "Article 50",
    title: "Transparency obligations for certain AI systems",
    appliesTo: "Providers and deployers of specified AI systems",
    summary:
      "Provide required notices, machine-readable marking, or disclosure for certain AI interactions and generated or manipulated content.",
    ta14Response: [
      "Preserve the content type, generation context, disclosure rule, marking method, and deployer action.",
      "Record which obligation was considered applicable and why.",
      "Maintain evidence of disclosure or marking at the point of publication or interaction.",
    ],
    evidence: [
      "Disclosure record",
      "Marking evidence",
      "Publication record",
      "Applicability determination",
    ],
    status: "Mapped",
  },
];

const statusOrder: Record<RequirementStatus, number> = {
  Mapped: 0,
  Partial: 1,
  Unmapped: 2,
};

export default function EuAiActRequirementsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RequirementStatus>("All");
  const [expanded, setExpanded] = useState<string | null>("risk-management");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return requirements
      .filter((item) => {
        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        const matchesQuery =
          !normalized ||
          [
            item.article,
            item.title,
            item.appliesTo,
            item.summary,
            ...item.ta14Response,
            ...item.evidence,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalized);

        return matchesStatus && matchesQuery;
      })
      .sort(
        (a, b) =>
          statusOrder[a.status] - statusOrder[b.status] ||
          a.article.localeCompare(b.article),
      );
  }, [query, statusFilter]);

  const mappedCount = requirements.filter((item) => item.status === "Mapped").length;
  const partialCount = requirements.filter((item) => item.status === "Partial").length;
  const unmappedCount = requirements.filter((item) => item.status === "Unmapped").length;

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/workspace/ai-governance" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Requirements</strong>
            <small>AI Governance Workspace</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">EU AI ACT WORKSPACE</p>
          <h1>Map every applicable requirement to evidence that can survive review.</h1>
          <p className="lead">
            Use this workspace to identify applicable EU AI Act obligations,
            connect each requirement to governed records and controls, expose
            unresolved gaps, and preserve the declared compliance approach.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#requirements">
              Review Requirements
              <span>↓</span>
            </a>
            <Link
              className="secondaryButton"
              href="/workspace/entity-review/eu-ai-act"
            >
              Start Entity Review
            </Link>
          </div>
        </div>

        <div className="visual" aria-hidden="true">
          <div className="europe">
            <span className="euStars">✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</span>
            <strong>EU</strong>
            <small>Requirement Mapping</small>
          </div>
          <div className="orbit orbitOne">
            <span />
          </div>
          <div className="orbit orbitTwo">
            <span />
          </div>
        </div>
      </section>

      <section className="boundaryNotice shell">
        <p className="eyebrow">IMPORTANT BOUNDARY</p>
        <h2>This workspace supports compliance evidence. It does not provide legal certification.</h2>
        <p>
          Applicability, legal interpretation, conformity assessment, and
          regulatory conclusions may require qualified legal counsel, notified
          bodies, competent authorities, or market-surveillance authorities.
          TA-14 preserves the evidence, rationale, limitations, and review path.
        </p>
      </section>

      <section className="summary shell">
        <article>
          <span>{requirements.length}</span>
          <strong>Requirements listed</strong>
        </article>
        <article>
          <span>{mappedCount}</span>
          <strong>Mapped to TA-14</strong>
        </article>
        <article>
          <span>{partialCount}</span>
          <strong>Partially mapped</strong>
        </article>
        <article>
          <span>{unmappedCount}</span>
          <strong>Unmapped</strong>
        </article>
      </section>

      <section className="requirementsSection shell" id="requirements">
        <div className="sectionIntro">
          <p className="eyebrow">REQUIREMENT LIBRARY</p>
          <h2>Review the applicable obligation and the evidence needed to support it.</h2>
          <p>
            The mapping below is a governance architecture view. It should be
            validated against the entity’s role, system classification, use
            case, jurisdiction, and current legal interpretation.
          </p>
        </div>

        <div className="filters">
          <label>
            <span>Search requirements</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search article, evidence, obligation, or TA-14 response"
            />
          </label>

          <div className="filterButtons" aria-label="Filter by mapping status">
            {(["All", "Mapped", "Partial", "Unmapped"] as const).map((status) => (
              <button
                type="button"
                className={statusFilter === status ? "active" : ""}
                onClick={() => setStatusFilter(status)}
                key={status}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="requirementList">
          {filtered.map((item) => {
            const isOpen = expanded === item.id;

            return (
              <article className={`requirement ${isOpen ? "open" : ""}`} key={item.id}>
                <button
                  type="button"
                  className="requirementHeader"
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <div className="articleBadge">{item.article}</div>
                  <div className="requirementTitle">
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.appliesTo}</p>
                  </div>
                  <span className="expandIcon">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="requirementBody">
                    <div className="summaryBlock">
                      <span>Requirement summary</span>
                      <p>{item.summary}</p>
                    </div>

                    <div className="detailGrid">
                      <div>
                        <span className="detailLabel">TA-14 governance response</span>
                        <ul>
                          {item.ta14Response.map((response) => (
                            <li key={response}>{response}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="detailLabel">Evidence to preserve</span>
                        <div className="evidenceTags">
                          {item.evidence.map((evidence) => (
                            <span key={evidence}>{evidence}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="requirementActions">
                      <Link
                        href={`/workspace/governed-records/builder?requirement=${encodeURIComponent(
                          item.article,
                        )}`}
                      >
                        Create supporting record
                        <span>→</span>
                      </Link>
                      <Link
                        href={`/workspace/entity-review/eu-ai-act?requirement=${encodeURIComponent(
                          item.article,
                        )}`}
                      >
                        Review this requirement
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </article>
            );
          })}

          {filtered.length === 0 && (
            <div className="emptyState">
              <h3>No requirements match this filter.</h3>
              <p>Change the search term or mapping-status filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="workflow shell">
        <div>
          <p className="eyebrow">GOVERNED COMPLIANCE WORKFLOW</p>
          <h2>Requirement → Evidence → Review → Determination → Preservation</h2>
        </div>

        <div className="workflowGrid">
          <article>
            <span>01</span>
            <h3>Identify applicability</h3>
            <p>Declare the role, system class, use case, obligation, and jurisdiction.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Bind the evidence</h3>
            <p>Connect the requirement to current records, controls, owners, and limitations.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Review the gap</h3>
            <p>Preserve supported, partial, unresolved, disputed, or out-of-scope conditions.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Preserve the determination</h3>
            <p>Record who decided what, on which evidence, at which time, and within which authority.</p>
          </article>
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">NEXT STEP</p>
          <h2>Turn the requirement list into an attributable review record.</h2>
          <p>
            Start an EU AI Act entity review or create governed records for the
            evidence supporting each applicable requirement.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/entity-review/eu-ai-act"
        >
          Start EU AI Act Review
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance">Return to AI Governance</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #040914;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f7fbff;
          background:
            radial-gradient(circle at 12% 8%, rgba(58, 119, 255, 0.13), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(63, 201, 255, 0.1), transparent 28%),
            linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
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
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(91,176,255,.62) 0 1px, transparent 1.4px);
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
          opacity: 0.12;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #346dff;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #31bdf4;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(132, 154, 188, 0.16);
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
          color: #04111d;
          background: linear-gradient(135deg, #5caeff, #c5efff);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #7e91a6;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #a9b8ca;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 50px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #68b6ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 870px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 88px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 770px;
          margin: 0;
          color: #9fb0c4;
          font-size: 18px;
          line-height: 1.68;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 850;
        }

        .primaryButton {
          color: #04111d;
          background: linear-gradient(135deg, #5caeff, #c3edff);
          box-shadow: 0 14px 38px rgba(71, 160, 255, 0.18);
        }

        .secondaryButton {
          color: #dce8f4;
          border: 1px solid rgba(130, 162, 188, 0.25);
          background: rgba(255, 255, 255, 0.035);
        }

        .visual {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .europe {
          width: 225px;
          height: 225px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(105, 181, 255, 0.7);
          background:
            radial-gradient(circle, rgba(64, 137, 255, 0.18), rgba(7, 18, 36, 0.97) 68%);
          box-shadow:
            0 0 50px rgba(67, 146, 255, 0.28),
            inset 0 0 34px rgba(64, 151, 255, 0.15);
          z-index: 3;
          animation: float 4s ease-in-out infinite alternate;
        }

        .euStars {
          width: 150px;
          color: #ffd866;
          font-size: 12px;
          text-align: center;
          line-height: 1.8;
          letter-spacing: 5px;
        }

        .europe strong {
          margin-top: 8px;
          font-size: 48px;
          letter-spacing: -0.05em;
        }

        .europe small {
          color: #7dbbff;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(100, 174, 255, 0.2);
          animation: rotate 22s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          right: -5px;
          top: 50%;
          border-radius: 999px;
          background: #6fb8ff;
          box-shadow: 0 0 14px #6fb8ff;
        }

        .orbitOne {
          width: 320px;
          height: 320px;
        }

        .orbitTwo {
          width: 430px;
          height: 430px;
          animation-duration: 32s;
          animation-direction: reverse;
        }

        .orbitTwo span {
          background: #ffd75e;
          box-shadow: 0 0 14px #ffd75e;
        }

        .boundaryNotice,
        .requirementsSection,
        .workflow,
        .finalCta {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .boundaryNotice {
          padding: 44px;
          text-align: center;
        }

        .boundaryNotice h2,
        .sectionIntro h2,
        .workflow h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .boundaryNotice > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .workflow p,
        .finalCta p:not(.eyebrow) {
          color: #9fafc2;
          line-height: 1.68;
        }

        .boundaryNotice > p:not(.eyebrow) {
          max-width: 900px;
          margin: 0 auto;
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          padding: 28px 0 74px;
        }

        .summary article {
          min-height: 130px;
          padding: 24px;
          border-radius: 18px;
          border: 1px solid rgba(130, 154, 188, 0.16);
          background: rgba(10, 18, 32, 0.76);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .summary span {
          color: #6db8ff;
          font-size: 36px;
          font-weight: 900;
        }

        .summary strong {
          margin-top: 7px;
          color: #cbd8e6;
          font-size: 13px;
        }

        .requirementsSection {
          padding: 42px;
        }

        .sectionIntro {
          max-width: 920px;
        }

        .sectionIntro h2 {
          font-size: clamp(32px, 4.8vw, 54px);
        }

        .filters {
          margin-top: 32px;
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 18px;
          align-items: end;
        }

        .filters label {
          display: grid;
          gap: 9px;
        }

        .filters label span {
          color: #a8b8ca;
          font-size: 12px;
          font-weight: 800;
        }

        input {
          width: 100%;
          min-height: 52px;
          padding: 0 16px;
          border-radius: 13px;
          border: 1px solid rgba(127, 159, 194, 0.22);
          background: rgba(4, 11, 22, 0.82);
          color: #f5fbff;
          outline: none;
          font: inherit;
        }

        input:focus {
          border-color: rgba(97, 180, 255, 0.65);
          box-shadow: 0 0 0 3px rgba(86, 167, 255, 0.08);
        }

        .filterButtons {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .filterButtons button {
          min-height: 44px;
          border-radius: 11px;
          border: 1px solid rgba(126, 157, 193, 0.17);
          background: rgba(255, 255, 255, 0.025);
          color: #aebed0;
          cursor: pointer;
          font-weight: 800;
        }

        .filterButtons button.active {
          border-color: rgba(94, 177, 255, 0.58);
          background: rgba(69, 144, 226, 0.13);
          color: #eaf6ff;
        }

        .requirementList {
          display: grid;
          gap: 12px;
          margin-top: 28px;
        }

        .requirement {
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(128, 155, 188, 0.16);
          background: rgba(8, 16, 29, 0.86);
        }

        .requirement.open {
          border-color: rgba(91, 174, 255, 0.42);
        }

        .requirementHeader {
          width: 100%;
          min-height: 112px;
          display: grid;
          grid-template-columns: 120px 1fr 42px;
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
          min-height: 58px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(102, 181, 255, 0.28);
          background: rgba(61, 139, 224, 0.08);
          color: #83c2ff;
          font-size: 15px;
          font-weight: 900;
        }

        .requirementTitle {
          min-width: 0;
        }

        .status {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .status.mapped {
          color: #91efc8;
          background: rgba(65, 193, 137, 0.1);
          border: 1px solid rgba(89, 216, 158, 0.22);
        }

        .status.partial {
          color: #ffd875;
          background: rgba(214, 156, 42, 0.1);
          border: 1px solid rgba(237, 181, 64, 0.22);
        }

        .status.unmapped {
          color: #ff9292;
          background: rgba(220, 76, 76, 0.1);
          border: 1px solid rgba(235, 92, 92, 0.22);
        }

        .requirementTitle h3 {
          margin: 9px 0 5px;
          font-size: 23px;
          letter-spacing: -0.025em;
        }

        .requirementTitle p {
          margin: 0;
          color: #8fa1b5;
          font-size: 13px;
        }

        .expandIcon {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(112, 172, 229, 0.23);
          color: #75baff;
          font-size: 22px;
        }

        .requirementBody {
          padding: 0 20px 24px 160px;
          border-top: 1px solid rgba(130, 155, 188, 0.12);
        }

        .summaryBlock {
          padding-top: 22px;
        }

        .summaryBlock > span,
        .detailLabel {
          color: #72b9ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .summaryBlock p {
          margin: 10px 0 0;
          color: #a9b8ca;
          line-height: 1.65;
        }

        .detailGrid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 30px;
          margin-top: 24px;
        }

        ul {
          margin: 12px 0 0;
          padding-left: 20px;
          color: #b6c4d4;
        }

        li {
          margin-bottom: 9px;
          line-height: 1.55;
        }

        .evidenceTags {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 12px;
        }

        .evidenceTags span {
          padding: 9px 11px;
          border-radius: 999px;
          border: 1px solid rgba(99, 179, 255, 0.2);
          background: rgba(66, 142, 224, 0.06);
          color: #d5e8fa;
          font-size: 12px;
          font-weight: 750;
        }

        .requirementActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .requirementActions a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          padding: 0 14px;
          border-radius: 11px;
          border: 1px solid rgba(102, 180, 255, 0.23);
          background: rgba(66, 141, 223, 0.06);
          color: #83c3ff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .emptyState {
          padding: 48px 20px;
          text-align: center;
          border-radius: 18px;
          border: 1px dashed rgba(130, 156, 189, 0.24);
          color: #96a8bc;
        }

        .emptyState h3 {
          margin: 0 0 8px;
          color: #e4eef8;
        }

        .workflow {
          margin-top: 22px;
          padding: 42px;
        }

        .workflow h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .workflowGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .workflowGrid article {
          padding: 24px 20px;
          border-radius: 18px;
          border: 1px solid rgba(112, 168, 219, 0.16);
          background: rgba(58, 118, 185, 0.05);
        }

        .workflowGrid span {
          color: #69b3ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .workflowGrid h3 {
          margin: 16px 0 10px;
          font-size: 22px;
        }

        .workflowGrid p {
          margin: 0;
          line-height: 1.58;
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

        .finalCta h2 {
          font-size: clamp(36px, 5vw, 58px);
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #74869a;
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

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          from {
            transform: translateY(-8px);
          }
          to {
            transform: translateY(9px);
          }
        }

        @media (max-width: 900px) {
          nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .filters,
          .detailGrid {
            grid-template-columns: 1fr;
          }

          .workflowGrid,
          .summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .visual {
            min-height: 430px;
            transform: scale(0.8);
          }

          .boundaryNotice,
          .requirementsSection,
          .workflow,
          .finalCta {
            padding: 28px 24px;
          }

          .summary,
          .workflowGrid {
            grid-template-columns: 1fr;
          }

          .filterButtons {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .requirementHeader {
            grid-template-columns: 1fr 38px;
          }

          .articleBadge {
            grid-column: 1 / -1;
            width: fit-content;
            min-width: 110px;
          }

          .requirementBody {
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
