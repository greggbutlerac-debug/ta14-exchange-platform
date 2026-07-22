"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RecordStatus = "Required" | "Recommended" | "Conditional";

type RecordRequirement = {
  id: string;
  title: string;
  article: string;
  status: RecordStatus;
  purpose: string;
  proves: string[];
  doesNotProve: string[];
  fields: string[];
};

const recordRequirements: RecordRequirement[] = [
  {
    id: "risk-management-record",
    title: "Risk Management Record",
    article: "Article 9",
    status: "Required",
    purpose:
      "Preserve the continuous risk-management process, identified risks, mitigations, reviews, and post-intervention outcomes.",
    proves: [
      "Which risks were identified",
      "Which evidence supported each determination",
      "Which mitigations were selected",
      "Who held review authority",
      "Whether outcomes were later verified",
    ],
    doesNotProve: [
      "That every risk was identified",
      "That a mitigation was legally sufficient",
      "That the system is safe in every operating context",
    ],
    fields: [
      "System identity",
      "Risk description",
      "Evidence references",
      "Severity and likelihood rationale",
      "Mitigation",
      "Authority",
      "Review date",
      "Outcome verification",
    ],
  },
  {
    id: "data-governance-record",
    title: "Data Governance Record",
    article: "Article 10",
    status: "Required",
    purpose:
      "Preserve dataset identity, source, provenance, version, governance practices, limitations, and declared suitability.",
    proves: [
      "Which dataset version was used",
      "Where the data came from",
      "Which governance controls were applied",
      "Which known limitations were declared",
      "Which reviewer accepted or rejected use",
    ],
    doesNotProve: [
      "That the dataset is unbiased",
      "That the dataset is representative in every context",
      "That downstream model behavior will be lawful or accurate",
    ],
    fields: [
      "Dataset identity",
      "Source",
      "Provenance",
      "Version",
      "Collection period",
      "Selection criteria",
      "Known gaps",
      "Review authority",
    ],
  },
  {
    id: "technical-documentation-record",
    title: "Technical Documentation Record",
    article: "Article 11",
    status: "Required",
    purpose:
      "Preserve the technical architecture, intended purpose, components, dependencies, controls, testing, and change history.",
    proves: [
      "What architecture was declared",
      "Which version was reviewed",
      "Which components and dependencies were identified",
      "Which evidence was attached",
      "What remained unresolved",
    ],
    doesNotProve: [
      "That the architecture performs as described",
      "That the implementation matches the documentation",
      "That all compliance obligations are satisfied",
    ],
    fields: [
      "System version",
      "Architecture",
      "Intended purpose",
      "Dependencies",
      "Controls",
      "Testing evidence",
      "Known limitations",
      "Change history",
    ],
  },
  {
    id: "logging-record",
    title: "Logging and Event Record",
    article: "Article 12",
    status: "Required",
    purpose:
      "Preserve automatically recorded events relevant to operation, risk identification, post-market monitoring, and incident review.",
    proves: [
      "Which event occurred",
      "When it occurred",
      "Which system version was active",
      "Which route, tool, or payload was involved",
      "Which outcome or exception followed",
    ],
    doesNotProve: [
      "Why the event occurred",
      "That every relevant event was captured",
      "That the event was lawful or authorized",
    ],
    fields: [
      "Timestamp",
      "System identity",
      "Version",
      "Event type",
      "Actor",
      "Tool or dependency",
      "Payload reference",
      "Outcome",
    ],
  },
  {
    id: "transparency-record",
    title: "Transparency and Instructions Record",
    article: "Article 13",
    status: "Required",
    purpose:
      "Preserve the instructions, declared operating conditions, limitations, oversight expectations, and prohibited uses communicated to deployers.",
    proves: [
      "Which instructions were issued",
      "Which limitations were disclosed",
      "Which version was in effect",
      "Who received the instructions",
      "When they were acknowledged",
    ],
    doesNotProve: [
      "That the deployer understood the instructions",
      "That the system was used according to instructions",
      "That the instructions were legally complete",
    ],
    fields: [
      "Instruction version",
      "Recipient",
      "Declared purpose",
      "Operating conditions",
      "Limitations",
      "Prohibited uses",
      "Acknowledgment",
      "Effective date",
    ],
  },
  {
    id: "human-oversight-record",
    title: "Human Oversight Record",
    article: "Article 14",
    status: "Required",
    purpose:
      "Preserve oversight roles, authority, available evidence, interventions, overrides, pauses, and escalations.",
    proves: [
      "Who held oversight authority",
      "What evidence was available",
      "Whether intervention occurred",
      "When execution was paused or overridden",
      "Which determination was made",
    ],
    doesNotProve: [
      "That oversight was meaningful",
      "That the reviewer was competent",
      "That the intervention was correct",
    ],
    fields: [
      "Reviewer identity",
      "Authority",
      "Evidence presented",
      "Decision",
      "Intervention",
      "Timestamp",
      "Escalation",
      "Outcome",
    ],
  },
  {
    id: "performance-record",
    title: "Accuracy, Robustness, and Cybersecurity Record",
    article: "Article 15",
    status: "Required",
    purpose:
      "Preserve declared performance thresholds, testing conditions, robustness evidence, cybersecurity controls, drift, and failures.",
    proves: [
      "Which tests were performed",
      "Which thresholds were declared",
      "Which failures were observed",
      "Which conditions applied",
      "Which corrective actions followed",
    ],
    doesNotProve: [
      "That the system will remain accurate",
      "That the system is secure against every threat",
      "That a passing test supports every deployment context",
    ],
    fields: [
      "Test identity",
      "Version",
      "Test conditions",
      "Threshold",
      "Observed performance",
      "Failure mode",
      "Corrective action",
      "Retest result",
    ],
  },
  {
    id: "quality-management-record",
    title: "Quality Management Record",
    article: "Article 17",
    status: "Required",
    purpose:
      "Preserve procedures, responsibilities, testing, corrective actions, document control, and governance history.",
    proves: [
      "Which quality procedures existed",
      "Who owned each responsibility",
      "Which corrective actions were taken",
      "Which record version was current",
      "How governance changed over time",
    ],
    doesNotProve: [
      "That procedures were consistently followed",
      "That the quality system was effective",
      "That regulatory conformity was achieved",
    ],
    fields: [
      "Procedure",
      "Owner",
      "Version",
      "Approval",
      "Audit record",
      "Corrective action",
      "Change record",
      "Review outcome",
    ],
  },
  {
    id: "deployment-record",
    title: "Deployment and Operating Context Record",
    article: "Article 26",
    status: "Required",
    purpose:
      "Preserve the actual deployment context, use conditions, assigned oversight, deviations, monitoring, and operational outcomes.",
    proves: [
      "Where and how the system was deployed",
      "Which use case was declared",
      "Who operated and oversaw it",
      "Which deviations occurred",
      "Which outcomes were observed",
    ],
    doesNotProve: [
      "That deployment was lawful",
      "That instructions were followed correctly",
      "That every affected person was identified",
    ],
    fields: [
      "Deployer identity",
      "Location",
      "Use case",
      "System version",
      "Operating conditions",
      "Oversight assignment",
      "Deviation",
      "Outcome",
    ],
  },
  {
    id: "fundamental-rights-record",
    title: "Fundamental Rights Impact Record",
    article: "Article 27",
    status: "Conditional",
    purpose:
      "Preserve the applicable impact assessment, affected persons, evidence, risks, mitigations, authority, and unresolved concerns.",
    proves: [
      "Which impacts were considered",
      "Which affected groups were identified",
      "Which evidence supported the assessment",
      "Which mitigations were proposed",
      "Who approved the assessment",
    ],
    doesNotProve: [
      "That every affected person was identified",
      "That the legal analysis was correct",
      "That the mitigation eliminates the impact",
    ],
    fields: [
      "Use case",
      "Affected persons",
      "Impact category",
      "Evidence",
      "Risk determination",
      "Mitigation",
      "Authority",
      "Review date",
    ],
  },
  {
    id: "post-market-record",
    title: "Post-Market Monitoring Record",
    article: "Article 72",
    status: "Required",
    purpose:
      "Preserve ongoing system performance, drift, incidents, interventions, version changes, and comparison to declared baselines.",
    proves: [
      "Which monitoring occurred",
      "Which baseline was used",
      "Which drift or incident was observed",
      "Which intervention followed",
      "Whether post-intervention performance changed",
    ],
    doesNotProve: [
      "That monitoring captured every issue",
      "That the cause of drift is known",
      "That the intervention permanently corrected the condition",
    ],
    fields: [
      "Monitoring period",
      "Baseline",
      "Metric",
      "Observed condition",
      "Drift",
      "Incident",
      "Intervention",
      "Post-intervention result",
    ],
  },
  {
    id: "incident-record",
    title: "Serious Incident Record",
    article: "Article 73",
    status: "Conditional",
    purpose:
      "Preserve the incident chronology, evidence, affected route, notifications, authority, corrective actions, and later determinations.",
    proves: [
      "What was known at each stage",
      "When the event was detected",
      "Which notifications were made",
      "Which evidence was preserved",
      "Which corrective actions followed",
    ],
    doesNotProve: [
      "The final legal cause",
      "That every required authority was notified",
      "That corrective action was sufficient",
    ],
    fields: [
      "Incident identity",
      "Detection time",
      "Initial evidence",
      "Affected system",
      "Notification",
      "Authority",
      "Corrective action",
      "Final determination",
    ],
  },
  {
    id: "disclosure-record",
    title: "Disclosure and Marking Record",
    article: "Article 50",
    status: "Conditional",
    purpose:
      "Preserve notices, disclosures, machine-readable markings, publication context, applicability determinations, and evidence of delivery.",
    proves: [
      "Which disclosure was used",
      "Which content or interaction it applied to",
      "When it was delivered",
      "Which marking method was used",
      "Who determined applicability",
    ],
    doesNotProve: [
      "That the notice was legally sufficient",
      "That every recipient understood it",
      "That every generated item was marked",
    ],
    fields: [
      "Content identity",
      "Interaction type",
      "Applicability",
      "Disclosure text",
      "Marking method",
      "Delivery evidence",
      "Publication time",
      "Authority",
    ],
  },
];

export default function EuAiActRecordRequirementsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RecordStatus>("All");
  const [expanded, setExpanded] = useState<string | null>("risk-management-record");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return recordRequirements.filter((record) => {
      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;
      const matchesQuery =
        !normalized ||
        [
          record.title,
          record.article,
          record.purpose,
          ...record.proves,
          ...record.doesNotProve,
          ...record.fields,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  const requiredCount = recordRequirements.filter(
    (record) => record.status === "Required",
  ).length;
  const conditionalCount = recordRequirements.filter(
    (record) => record.status === "Conditional",
  ).length;
  const recommendedCount = recordRequirements.filter(
    (record) => record.status === "Recommended",
  ).length;

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/workspace/governed-records" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Record Requirements</strong>
            <small>Governed Records Workspace</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance/eu-ai-act">
            EU AI Act Requirements
          </Link>
          <Link href="/workspace/governed-records">Governed Records</Link>
          <Link href="/workspace/entity-review/eu-ai-act">
            Entity Review
          </Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">EU AI ACT RECORD WORKSPACE</p>
          <h1>Know which records must exist before anyone claims compliance.</h1>
          <p className="lead">
            Build the record architecture supporting each applicable EU AI Act
            obligation. Preserve what every record proves, what it does not
            prove, who owns it, which version applies, and where evidence remains
            incomplete.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#record-library">
              Review Record Requirements
              <span>↓</span>
            </a>
            <Link
              className="secondaryButton"
              href="/workspace/governed-records/builder"
            >
              Create a Governed Record
            </Link>
          </div>
        </div>

        <div className="recordVisual" aria-hidden="true">
          <div className="recordCard backCard" />
          <div className="recordCard middleCard" />
          <div className="recordCard frontCard">
            <div className="seal">EU</div>
            <strong>Record Architecture</strong>
            <small>Evidence · Boundary · Continuity</small>
            <div className="lines">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="boundaryNotice shell">
        <p className="eyebrow">IMPORTANT BOUNDARY</p>
        <h2>A record can support a compliance claim without proving the claim is legally correct.</h2>
        <p>
          Governed Records preserve evidence, versions, ownership, authority,
          continuity, and declared limitations. Legal applicability, conformity
          assessment, certification, and regulatory conclusions remain separate
          determinations.
        </p>
      </section>

      <section className="summary shell">
        <article>
          <span>{recordRequirements.length}</span>
          <strong>Record types listed</strong>
        </article>
        <article>
          <span>{requiredCount}</span>
          <strong>Required records</strong>
        </article>
        <article>
          <span>{conditionalCount}</span>
          <strong>Conditional records</strong>
        </article>
        <article>
          <span>{recommendedCount}</span>
          <strong>Recommended records</strong>
        </article>
      </section>

      <section className="library shell" id="record-library">
        <div className="sectionIntro">
          <p className="eyebrow">RECORD REQUIREMENT LIBRARY</p>
          <h2>Every obligation needs a record that can be inspected later.</h2>
          <p>
            Search by article, record type, evidence field, proof boundary, or
            governance purpose.
          </p>
        </div>

        <div className="filters">
          <label>
            <span>Search record requirements</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search article, record, field, proof, or limitation"
            />
          </label>

          <div className="filterButtons">
            {(["All", "Required", "Conditional", "Recommended"] as const).map(
              (status) => (
                <button
                  type="button"
                  className={statusFilter === status ? "active" : ""}
                  onClick={() => setStatusFilter(status)}
                  key={status}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="recordList">
          {filtered.map((record) => {
            const isOpen = expanded === record.id;

            return (
              <article className={`record ${isOpen ? "open" : ""}`} key={record.id}>
                <button
                  type="button"
                  className="recordHeader"
                  onClick={() => setExpanded(isOpen ? null : record.id)}
                  aria-expanded={isOpen}
                >
                  <div className="articleBadge">{record.article}</div>

                  <div className="recordTitle">
                    <span className={`status ${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                    <h3>{record.title}</h3>
                    <p>{record.purpose}</p>
                  </div>

                  <span className="expandIcon">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="recordBody">
                    <div className="proofGrid">
                      <div className="proofBlock">
                        <span className="detailLabel provesLabel">
                          What this record can prove
                        </span>
                        <ul>
                          {record.proves.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="proofBlock">
                        <span className="detailLabel limitationLabel">
                          What this record does not prove
                        </span>
                        <ul>
                          {record.doesNotProve.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="fieldsBlock">
                      <span className="detailLabel">Minimum governed fields</span>
                      <div className="fieldTags">
                        {record.fields.map((field) => (
                          <span key={field}>{field}</span>
                        ))}
                      </div>
                    </div>

                    <div className="recordActions">
                      <Link
                        href={`/workspace/governed-records/builder?record=${encodeURIComponent(
                          record.title,
                        )}&article=${encodeURIComponent(record.article)}`}
                      >
                        Create this record
                        <span>→</span>
                      </Link>

                      <Link
                        href={`/workspace/governed-records/interpreter?record=${encodeURIComponent(
                          record.title,
                        )}`}
                      >
                        Interpret an existing record
                        <span>→</span>
                      </Link>

                      <Link
                        href={`/workspace/entity-review/eu-ai-act?article=${encodeURIComponent(
                          record.article,
                        )}`}
                      >
                        Review supporting entity
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
              <h3>No records match this filter.</h3>
              <p>Change the search term or record-status filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="architecture shell">
        <div>
          <p className="eyebrow">RECORD ARCHITECTURE</p>
          <h2>Requirement → Record → Continuity → Review → Determination</h2>
          <p>
            The requirement should never be connected directly to a compliance
            claim. A governed record must preserve the evidence and boundary
            between them.
          </p>
        </div>

        <div className="architectureGrid">
          <article>
            <span>01</span>
            <h3>Declare the obligation</h3>
            <p>Identify the article, role, system, use case, and applicability rationale.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Create the record</h3>
            <p>Preserve evidence, ownership, scope, dates, versions, and limitations.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Review continuity</h3>
            <p>Confirm that the record remains connected across source, time, custody, and change.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Preserve the determination</h3>
            <p>Record who concluded what, from which evidence, under which authority.</p>
          </article>
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">CREATE THE SUPPORTING RECORD</p>
          <h2>Start with the evidence before making the compliance claim.</h2>
          <p>
            Build the governed record, preserve its proof boundaries, and then
            route it into continuity review, entity review, or execution
            readiness.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/governed-records/builder"
        >
          Open Governed Record Builder
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/governed-records">
          Return to Governed Records
        </Link>
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
            radial-gradient(circle at 12% 8%, rgba(52, 118, 230, 0.13), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(63, 200, 255, 0.1), transparent 28%),
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

        .recordVisual {
          min-height: 470px;
          position: relative;
          display: grid;
          place-items: center;
          perspective: 1000px;
        }

        .recordCard {
          width: 286px;
          height: 375px;
          border-radius: 26px;
          position: absolute;
          border: 1px solid rgba(96, 175, 255, 0.35);
          background:
            linear-gradient(180deg, rgba(18, 37, 68, 0.95), rgba(6, 14, 28, 0.99));
          box-shadow:
            0 30px 70px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .backCard {
          transform: translate(-72px, -28px) rotateZ(-6deg);
          opacity: 0.45;
        }

        .middleCard {
          transform: translate(62px, -12px) rotateZ(5deg);
          opacity: 0.68;
        }

        .frontCard {
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          animation: float 4s ease-in-out infinite alternate;
        }

        .seal {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 2px solid #c4ebff;
          background: rgba(24, 77, 127, 0.28);
          color: #e4f7ff;
          font-size: 27px;
          font-weight: 900;
          box-shadow:
            0 0 28px rgba(76, 168, 255, 0.3),
            inset 0 0 22px rgba(76, 168, 255, 0.18);
        }

        .frontCard strong {
          margin-top: 22px;
          font-size: 23px;
        }

        .frontCard small {
          margin-top: 7px;
          color: #78bcf3;
        }

        .lines {
          width: 100%;
          display: grid;
          gap: 10px;
          margin-top: 28px;
        }

        .lines i {
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(94, 176, 255, 0.5),
            rgba(94, 176, 255, 0.08)
          );
        }

        .lines i:nth-child(2) {
          width: 82%;
        }

        .lines i:nth-child(3) {
          width: 68%;
        }

        .lines i:nth-child(4) {
          width: 88%;
        }

        .boundaryNotice,
        .library,
        .architecture,
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
        .architecture h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .boundaryNotice > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .architecture p,
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

        .library {
          padding: 42px;
        }

        .sectionIntro {
          max-width: 900px;
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

        .recordList {
          display: grid;
          gap: 12px;
          margin-top: 28px;
        }

        .record {
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(128, 155, 188, 0.16);
          background: rgba(8, 16, 29, 0.86);
        }

        .record.open {
          border-color: rgba(91, 174, 255, 0.42);
        }

        .recordHeader {
          width: 100%;
          min-height: 122px;
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

        .recordTitle {
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

        .status.required {
          color: #91efc8;
          background: rgba(65, 193, 137, 0.1);
          border: 1px solid rgba(89, 216, 158, 0.22);
        }

        .status.conditional {
          color: #ffd875;
          background: rgba(214, 156, 42, 0.1);
          border: 1px solid rgba(237, 181, 64, 0.22);
        }

        .status.recommended {
          color: #bda4ff;
          background: rgba(136, 93, 222, 0.1);
          border: 1px solid rgba(161, 120, 240, 0.22);
        }

        .recordTitle h3 {
          margin: 9px 0 7px;
          font-size: 23px;
          letter-spacing: -0.025em;
        }

        .recordTitle p {
          margin: 0;
          color: #8fa1b5;
          font-size: 13px;
          line-height: 1.5;
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

        .recordBody {
          padding: 0 20px 24px 160px;
          border-top: 1px solid rgba(130, 155, 188, 0.12);
        }

        .proofGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          padding-top: 24px;
        }

        .proofBlock {
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(123, 157, 190, 0.14);
          background: rgba(255, 255, 255, 0.018);
        }

        .detailLabel {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .provesLabel {
          color: #88e7be;
        }

        .limitationLabel {
          color: #ffc46d;
        }

        ul {
          margin: 13px 0 0;
          padding-left: 20px;
          color: #b6c4d4;
        }

        li {
          margin-bottom: 9px;
          line-height: 1.55;
        }

        .fieldsBlock {
          margin-top: 24px;
        }

        .fieldsBlock > .detailLabel {
          color: #72b9ff;
        }

        .fieldTags {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 12px;
        }

        .fieldTags span {
          padding: 9px 11px;
          border-radius: 999px;
          border: 1px solid rgba(99, 179, 255, 0.2);
          background: rgba(66, 142, 224, 0.06);
          color: #d5e8fa;
          font-size: 12px;
          font-weight: 750;
        }

        .recordActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .recordActions a {
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

        .architecture {
          margin-top: 22px;
          padding: 42px;
        }

        .architecture h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .architectureGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .architectureGrid article {
          padding: 24px 20px;
          border-radius: 18px;
          border: 1px solid rgba(112, 168, 219, 0.16);
          background: rgba(58, 118, 185, 0.05);
        }

        .architectureGrid span {
          color: #69b3ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .architectureGrid h3 {
          margin: 16px 0 10px;
          font-size: 22px;
        }

        .architectureGrid p {
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
          .proofGrid {
            grid-template-columns: 1fr;
          }

          .summary,
          .architectureGrid {
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

          .recordVisual {
            min-height: 440px;
            transform: scale(0.82);
          }

          .boundaryNotice,
          .library,
          .architecture,
          .finalCta {
            padding: 28px 24px;
          }

          .summary,
          .architectureGrid {
            grid-template-columns: 1fr;
          }

          .filterButtons {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recordHeader {
            grid-template-columns: 1fr 38px;
          }

          .articleBadge {
            grid-column: 1 / -1;
            width: fit-content;
            min-width: 110px;
          }

          .recordBody {
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
