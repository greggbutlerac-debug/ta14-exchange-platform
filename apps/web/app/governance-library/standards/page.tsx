"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StandardStatus =
  | "Published"
  | "Under development"
  | "Guidance";

type StandardRecord = {
  id: string;
  name: string;
  title: string;
  organization: string;
  type: string;
  status: StandardStatus;
  year: string;
  summary: string;
  purpose: string;
  coreAreas: string[];
  evidence: string[];
  relationships: string[];
  boundary: string;
  href?: string;
};

const standards: StandardRecord[] = [
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    title:
      "Artificial intelligence — Management system",
    organization: "ISO/IEC",
    type: "AI Management System",
    status: "Published",
    year: "2023",
    summary:
      "Requirements for establishing, implementing, maintaining, and continually improving an artificial intelligence management system.",
    purpose:
      "Provides an organizational management structure for governing the responsible development, provision, and use of artificial intelligence.",
    coreAreas: [
      "Organizational context",
      "Leadership and accountability",
      "AI policy",
      "Risk and opportunity planning",
      "Operational controls",
      "Performance evaluation",
      "Internal audit",
      "Continual improvement",
    ],
    evidence: [
      "Management-system scope",
      "AI policy",
      "Risk assessment",
      "Statement of applicability",
      "Operational control record",
      "Internal audit",
      "Management review",
      "Corrective-action record",
    ],
    relationships: [
      "ISO/IEC 23894",
      "NIST AI RMF",
      "EU AI Act",
    ],
    boundary:
      "Management-system conformity may support organizational assurance, but it does not independently prove that a specific AI action was authorized, evidence-supported, admissible, and properly executed.",
    href: "/governance-library/iso-iec-42001-2023",
  },
  {
    id: "iso-23894",
    name: "ISO/IEC 23894",
    title:
      "Artificial intelligence — Guidance on risk management",
    organization: "ISO/IEC",
    type: "AI Risk Management",
    status: "Guidance",
    year: "2023",
    summary:
      "Guidance for integrating artificial-intelligence risk management into organizational activities and functions.",
    purpose:
      "Supports the identification, analysis, evaluation, treatment, monitoring, review, recording, and communication of AI risk.",
    coreAreas: [
      "Risk context",
      "Risk identification",
      "Risk analysis",
      "Risk evaluation",
      "Risk treatment",
      "Monitoring",
      "Communication",
      "Documentation",
    ],
    evidence: [
      "Risk criteria",
      "Risk register",
      "Risk assessment",
      "Treatment plan",
      "Residual-risk decision",
      "Monitoring result",
      "Review record",
    ],
    relationships: [
      "ISO/IEC 42001",
      "NIST AI RMF",
      "ISO 31000",
    ],
    boundary:
      "A risk-management record may support a governance decision, but risk assessment alone does not establish authority or permission for consequential execution.",
  },
  {
    id: "iso-22989",
    name: "ISO/IEC 22989",
    title:
      "Artificial intelligence — Concepts and terminology",
    organization: "ISO/IEC",
    type: "Terminology Standard",
    status: "Published",
    year: "2022",
    summary:
      "Defines concepts and terminology used across artificial-intelligence systems and governance activities.",
    purpose:
      "Provides a common vocabulary to improve consistency across standards, policies, technical documentation, and governance records.",
    coreAreas: [
      "AI concepts",
      "Machine learning",
      "System lifecycle",
      "Actors and roles",
      "Data concepts",
      "System characteristics",
      "Trustworthiness terminology",
    ],
    evidence: [
      "Terminology mapping",
      "Definition source",
      "Version record",
      "System classification",
      "Role classification",
      "Documentation reference",
    ],
    relationships: [
      "ISO/IEC 23053",
      "ISO/IEC 42001",
      "ISO/IEC 23894",
    ],
    boundary:
      "Shared terminology improves interpretation, but a definition does not prove legal applicability, system performance, evidence sufficiency, or execution authority.",
  },
  {
    id: "iso-23053",
    name: "ISO/IEC 23053",
    title:
      "Framework for artificial intelligence systems using machine learning",
    organization: "ISO/IEC",
    type: "Technical Framework",
    status: "Published",
    year: "2022",
    summary:
      "A framework describing artificial-intelligence systems that use machine-learning technology.",
    purpose:
      "Supports consistent technical descriptions of machine-learning systems, components, functions, and lifecycle relationships.",
    coreAreas: [
      "Machine-learning system structure",
      "Training",
      "Inference",
      "Data flow",
      "Model lifecycle",
      "System components",
      "Functional relationships",
    ],
    evidence: [
      "System architecture",
      "Model description",
      "Training record",
      "Inference record",
      "Data-flow map",
      "Lifecycle record",
      "Component traceability",
    ],
    relationships: [
      "ISO/IEC 22989",
      "ISO/IEC 5338",
      "ISO/IEC 42001",
    ],
    boundary:
      "A technical framework can describe how a system operates, but description alone does not establish that its data, model, output, or action is admissible.",
  },
  {
    id: "iso-5338",
    name: "ISO/IEC 5338",
    title:
      "Artificial intelligence system life cycle processes",
    organization: "ISO/IEC",
    type: "Lifecycle Standard",
    status: "Published",
    year: "2023",
    summary:
      "Defines lifecycle processes for artificial-intelligence systems.",
    purpose:
      "Supports structured planning, development, operation, maintenance, governance, and retirement across the AI system lifecycle.",
    coreAreas: [
      "Lifecycle planning",
      "Development",
      "Verification",
      "Validation",
      "Deployment",
      "Operation",
      "Maintenance",
      "Retirement",
    ],
    evidence: [
      "Lifecycle plan",
      "Requirements record",
      "Verification result",
      "Validation result",
      "Deployment approval",
      "Operational record",
      "Change record",
      "Retirement record",
    ],
    relationships: [
      "ISO/IEC 42001",
      "ISO/IEC 23053",
      "ISO/IEC 23894",
    ],
    boundary:
      "Lifecycle discipline can preserve process integrity, but each consequential execution still requires current authority, evidence, binding, and outcome preservation.",
  },
  {
    id: "iso-24027",
    name: "ISO/IEC TR 24027",
    title:
      "Bias in AI systems and AI-aided decision making",
    organization: "ISO/IEC",
    type: "Technical Report",
    status: "Guidance",
    year: "2021",
    summary:
      "Guidance addressing bias in artificial-intelligence systems and AI-supported decision-making.",
    purpose:
      "Supports identification, understanding, assessment, and treatment of bias sources across AI systems and lifecycle activities.",
    coreAreas: [
      "Bias sources",
      "Data bias",
      "Model bias",
      "Human bias",
      "Evaluation",
      "Mitigation",
      "Monitoring",
    ],
    evidence: [
      "Bias assessment",
      "Dataset analysis",
      "Evaluation result",
      "Mitigation record",
      "Stakeholder review",
      "Monitoring record",
      "Outcome analysis",
    ],
    relationships: [
      "ISO/IEC 24028",
      "ISO/IEC 23894",
      "NIST AI RMF",
    ],
    boundary:
      "Bias assessment supports governance, but it must be tied to the actual system version, affected population, use context, decision, and preserved outcome.",
  },
  {
    id: "iso-24028",
    name: "ISO/IEC TR 24028",
    title:
      "Overview of trustworthiness in artificial intelligence",
    organization: "ISO/IEC",
    type: "Technical Report",
    status: "Guidance",
    year: "2020",
    summary:
      "An overview of trustworthiness characteristics and considerations for artificial-intelligence systems.",
    purpose:
      "Provides a structured view of characteristics such as reliability, robustness, safety, security, privacy, transparency, and accountability.",
    coreAreas: [
      "Reliability",
      "Robustness",
      "Safety",
      "Security",
      "Privacy",
      "Transparency",
      "Accountability",
      "Resilience",
    ],
    evidence: [
      "Trustworthiness criteria",
      "Test result",
      "Security assessment",
      "Safety record",
      "Reliability analysis",
      "Transparency record",
      "Accountability assignment",
    ],
    relationships: [
      "ISO/IEC 42001",
      "ISO/IEC 23894",
      "ISO/IEC 24027",
    ],
    boundary:
      "Trustworthiness characteristics guide evaluation, but a general trust claim cannot substitute for admissible evidence tied to a particular decision and execution.",
  },
  {
    id: "ieee-7000",
    name: "IEEE 7000",
    title:
      "Model process for addressing ethical concerns during system design",
    organization: "IEEE",
    type: "Ethical Design Standard",
    status: "Published",
    year: "2021",
    summary:
      "A process for identifying stakeholder values and translating ethical concerns into system requirements.",
    purpose:
      "Supports traceable incorporation of ethical values, stakeholder concerns, and value-based requirements into system design.",
    coreAreas: [
      "Stakeholder identification",
      "Value elicitation",
      "Ethical risk",
      "Requirement translation",
      "Traceability",
      "Verification",
      "Lifecycle review",
    ],
    evidence: [
      "Stakeholder record",
      "Value analysis",
      "Ethical-risk record",
      "Requirement trace",
      "Design decision",
      "Verification result",
      "Review record",
    ],
    relationships: [
      "ISO/IEC 42001",
      "UNESCO AI Ethics",
      "NIST AI RMF",
    ],
    boundary:
      "Ethically informed design strengthens governance, but it does not independently prove runtime authority, evidence continuity, or admissible execution.",
  },
];

const types = [
  "All types",
  ...Array.from(
    new Set(standards.map((standard) => standard.type)),
  ),
];

const statuses: Array<
  "All statuses" | StandardStatus
> = [
  "All statuses",
  "Published",
  "Under development",
  "Guidance",
];

function statusClass(status: StandardStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function StandardsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState<
    "All statuses" | StandardStatus
  >("All statuses");
  const [selectedId, setSelectedId] = useState(
    standards[0].id,
  );

  const filteredStandards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return standards.filter((standard) => {
      const typeMatches =
        type === "All types" || standard.type === type;

      const statusMatches =
        status === "All statuses" ||
        standard.status === status;

      const searchable = [
        standard.name,
        standard.title,
        standard.organization,
        standard.type,
        standard.status,
        standard.year,
        standard.summary,
        standard.purpose,
        standard.boundary,
        ...standard.coreAreas,
        ...standard.evidence,
        ...standard.relationships,
      ]
        .join(" ")
        .toLowerCase();

      const queryMatches =
        normalizedQuery.length === 0 ||
        normalizedQuery
          .split(/\s+/)
          .every((token) => searchable.includes(token));

      return typeMatches && statusMatches && queryMatches;
    });
  }, [query, status, type]);

  const selectedStandard =
    standards.find(
      (standard) => standard.id === selectedId,
    ) ??
    filteredStandards[0] ??
    standards[0];

  const metrics = useMemo(
    () => ({
      records: standards.length,
      organizations: new Set(
        standards.map(
          (standard) => standard.organization,
        ),
      ).size,
      types: new Set(
        standards.map((standard) => standard.type),
      ).size,
      evidence: new Set(
        standards.flatMap(
          (standard) => standard.evidence,
        ),
      ).size,
      published: standards.filter(
        (standard) =>
          standard.status === "Published",
      ).length,
    }),
    [],
  );

  function clearFilters() {
    setQuery("");
    setType("All types");
    setStatus("All statuses");
  }

  return (
    <main className="standardsPage">
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
            Standards navigation workspace
          </div>

          <Link
            href="/governance-library/crosswalks"
            className="topbarAction"
          >
            Open Crosswalks →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>ST</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Governance
            <span> Standards</span>
          </h1>

          <p className="lead">
            Navigate selected international standards,
            technical reports, lifecycle specifications,
            management systems, and ethical design processes
            supporting responsible artificial-intelligence
            governance.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{metrics.records}</span>
              <small>Standard records</small>
            </article>

            <article>
              <span>{metrics.organizations}</span>
              <small>Organizations</small>
            </article>

            <article>
              <span>{metrics.types}</span>
              <small>Standard types</small>
            </article>

            <article>
              <span>{metrics.evidence}</span>
              <small>Evidence references</small>
            </article>

            <article>
              <span>{metrics.published}</span>
              <small>Published standards</small>
            </article>
          </div>
        </header>

        <section className="standardsSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STANDARDS CONTROL DESK
              </p>

              <h2>
                Find the standard. Preserve its boundary.
              </h2>
            </div>

            <p>
              Standards may define requirements, guidance,
              terminology, lifecycle processes, or technical
              practices. Their governance effect depends on
              adoption, scope, version, contractual use, and
              applicable authority.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search standards
              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search ISO, IEEE, lifecycle, bias, risk..."
              />
            </label>

            <label>
              Standard type
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
              >
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Publication status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "All statuses"
                      | StandardStatus,
                  )
                }
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="clearButton"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="standardIndex">
              <div className="indexHeading">
                <div>
                  <span>Standards index</span>
                  <strong>
                    {filteredStandards.length} records
                  </strong>
                </div>

                <small>
                  Select a standard to inspect its purpose,
                  evidence relationships, and execution
                  boundary.
                </small>
              </div>

              <div className="standardList">
                {filteredStandards.map(
                  (standard, index) => (
                    <button
                      key={standard.id}
                      type="button"
                      className={
                        selectedStandard.id === standard.id
                          ? "standardButton active"
                          : "standardButton"
                      }
                      onClick={() =>
                        setSelectedId(standard.id)
                      }
                    >
                      <span className="standardNumber">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="standardIdentity">
                        <small>{standard.type}</small>
                        <strong>{standard.name}</strong>
                        <em>
                          {standard.organization} ·{" "}
                          {standard.year}
                        </em>
                      </span>

                      <span
                        className={`statusDot ${statusClass(
                          standard.status,
                        )}`}
                      />
                    </button>
                  ),
                )}

                {filteredStandards.length === 0 ? (
                  <div className="emptyIndex">
                    <span>00</span>
                    <strong>No standard matched.</strong>
                    <p>
                      Broaden the search or clear the current
                      filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="standardRecord">
              <div className="recordHeader">
                <div className="recordIdentity">
                  <div className="recordSeal">
                    {selectedStandard.name
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .slice(0, 3)}
                  </div>

                  <div>
                    <p>{selectedStandard.organization}</p>
                    <h3>{selectedStandard.name}</h3>
                    <span>{selectedStandard.title}</span>
                  </div>
                </div>

                <div
                  className={`statusBadge ${statusClass(
                    selectedStandard.status,
                  )}`}
                >
                  {selectedStandard.status}
                </div>
              </div>

              <div className="authorityStrip">
                <div>
                  <span>Standard type</span>
                  <strong>{selectedStandard.type}</strong>
                </div>

                <div>
                  <span>Publisher</span>
                  <strong>
                    {selectedStandard.organization}
                  </strong>
                </div>

                <div>
                  <span>Publication year</span>
                  <strong>{selectedStandard.year}</strong>
                </div>
              </div>

              <article className="summaryCard">
                <span>Standard summary</span>
                <strong>{selectedStandard.summary}</strong>
                <p>{selectedStandard.purpose}</p>
              </article>

              <div className="recordColumns">
                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Core areas</span>
                    <strong>
                      {selectedStandard.coreAreas.length}
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedStandard.coreAreas.map(
                      (item, index) => (
                        <div key={item}>
                          <span>
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>
                          <p>{item}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>

                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Related authorities</span>
                    <strong>
                      {
                        selectedStandard.relationships
                          .length
                      }
                    </strong>
                  </div>

                  <div className="relatedList">
                    {selectedStandard.relationships.map(
                      (item) => (
                        <div key={item}>
                          <span>↔</span>
                          <strong>{item}</strong>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              </div>

              <article className="evidenceCard">
                <div className="cardHeading">
                  <span>
                    Evidence commonly associated
                  </span>
                  <strong>
                    {selectedStandard.evidence.length}
                  </strong>
                </div>

                <div className="evidenceGrid">
                  {selectedStandard.evidence.map(
                    (item, index) => (
                      <div key={item}>
                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>
                        <strong>{item}</strong>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="executionCard">
                <div className="executionSeal">T14</div>

                <div>
                  <span>TA-14 execution boundary</span>
                  <p>{selectedStandard.boundary}</p>
                </div>
              </article>

              <div className="recordActions">
                {selectedStandard.href ? (
                  <Link
                    href={selectedStandard.href}
                    className="secondaryAction"
                  >
                    View Standard Record
                  </Link>
                ) : null}

                <Link
                  href="/governance-library/crosswalks"
                  className="secondaryAction"
                >
                  Open Crosswalk
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
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                STANDARD APPLICATION SEQUENCE
              </p>

              <h2>
                Conformance must be translated into evidence.
              </h2>
            </div>

            <p>
              Citing a standard is not the same as proving that
              its requirements were adopted, implemented,
              verified, and bound to a specific governance
              decision.
            </p>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Identify",
                text: "Identify the official title, publisher, version, date, and applicable edition.",
              },
              {
                code: "02",
                title: "Scope",
                text: "Determine the organizational, technical, lifecycle, or system boundary covered.",
              },
              {
                code: "03",
                title: "Adopt",
                text: "Preserve how the standard became applicable through law, contract, policy, certification, or voluntary use.",
              },
              {
                code: "04",
                title: "Map",
                text: "Map requirements or guidance to accountable controls, systems, owners, and evidence.",
              },
              {
                code: "05",
                title: "Verify",
                text: "Test whether the declared controls and outcomes are actually supported.",
              },
              {
                code: "06",
                title: "Determine",
                text: "Issue a bounded conclusion without overstating certification, conformity, or compliance.",
              },
              {
                code: "07",
                title: "Control",
                text: "Bind the conclusion to ALLOW, HOLD, DENY, or ESCALATE execution conditions.",
              },
              {
                code: "08",
                title: "Preserve",
                text: "Preserve the source, evidence, determination, execution, and outcome record.",
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
            <span>SB</span>
            <small>Standards boundary</small>
          </div>

          <p className="eyebrow gold">
            STANDARDS NAVIGATION BOUNDARY
          </p>

          <h2>
            A standard is not self-executing authority.
          </h2>

          <p>
            This workspace provides standards navigation,
            functional mapping, and evidence orientation. It
            does not reproduce official standards, grant
            access rights, provide certification, establish
            conformity, determine legal applicability, or
            authorize execution. Official published editions,
            licensing conditions, accredited certification
            bodies, applicable law, contracts, and qualified
            reviewers remain controlling.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>LIBRARY PROVIDES</span>
              <strong>
                Standards navigation, functional context,
                evidence relationships, and crosswalk entry
                points
              </strong>
            </article>

            <article>
              <span>LIBRARY DOES NOT PROVIDE</span>
              <strong>
                Official standard text, certification,
                accreditation, conformity, or legal advice
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Valid authority, admissible evidence,
                continuity, binding, control, and preserved
                outcome proof
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/frameworks"
              className="secondaryAction"
            >
              Browse Frameworks
            </Link>

            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalks
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
        .standardsPage {
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
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.28);
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
          transition: transform 0.22s;
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
          background: rgba(4, 18, 30, 0.96);
          box-shadow: 0 0 60px rgba(255, 193, 64, 0.09);
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

        .standardsSection,
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

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 220px 220px auto;
          align-items: end;
          gap: 12px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
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
          min-height: 47px;
          box-sizing: border-box;
          padding: 0 13px;
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
          background: #071520;
        }

        .clearButton {
          min-height: 47px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b5c7cf;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .standardIndex,
        .standardRecord {
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
        }

        .standardIndex {
          position: sticky;
          top: 20px;
          padding: 18px;
        }

        .indexHeading {
          padding: 4px 3px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeading div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .indexHeading span {
          color: #70ddec;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .indexHeading strong {
          color: #edca80;
          font: 700 16px Georgia, serif;
        }

        .indexHeading small {
          display: block;
          margin-top: 8px;
          color: #718995;
          font-size: 9px;
          line-height: 1.5;
        }

        .standardList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .standardButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 9px;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
        }

        .standardButton:hover,
        .standardButton.active {
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .standardNumber {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.15);
          border-radius: 10px;
          color: #6bd9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .standardIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .standardIdentity small {
          color: #728995;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .standardIdentity strong {
          color: #dce8ec;
          font-size: 11px;
        }

        .standardIdentity em {
          color: #71858f;
          font-size: 8px;
          font-style: normal;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #63727a;
        }

        .statusDot.published {
          background: #72e6b2;
        }

        .statusDot.guidance {
          background: #71d7ef;
        }

        .statusDot.under-development {
          background: #efc76e;
        }

        .emptyIndex {
          padding: 35px 18px;
          text-align: center;
        }

        .standardRecord {
          padding: 26px;
        }

        .recordHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .recordIdentity {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .recordSeal {
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.28);
          border-radius: 50%;
          color: #f1cb7c;
          font: 700 18px Georgia, serif;
        }

        .recordIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordIdentity h3 {
          margin: 6px 0 0;
          font-size: clamp(29px, 3vw, 43px);
        }

        .recordIdentity span {
          display: block;
          margin-top: 8px;
          color: #8499a3;
          font-size: 11px;
        }

        .statusBadge {
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #9fb1b9;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .authorityStrip {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .authorityStrip div,
        .summaryCard,
        .recordCard,
        .evidenceCard {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .authorityStrip span,
        .summaryCard > span {
          color: #70ddec;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          font-size: 10px;
        }

        .summaryCard {
          margin-top: 14px;
        }

        .summaryCard > strong {
          display: block;
          margin-top: 9px;
          font: 700 18px Georgia, serif;
          line-height: 1.4;
        }

        .summaryCard p {
          margin: 11px 0 0;
          color: #9dafb8;
          font-size: 12px;
          line-height: 1.68;
        }

        .recordColumns {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .evidenceCard {
          margin-top: 14px;
        }

        .cardHeading {
          padding-bottom: 13px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #78ddeb;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .numberedList,
        .relatedList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .numberedList div,
        .relatedList div {
          display: grid;
          grid-template-columns: 31px 1fr;
          gap: 10px;
        }

        .numberedList span,
        .relatedList span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 9px;
          color: #68d9ea;
          font-size: 7px;
        }

        .numberedList p {
          margin: 5px 0 0;
          color: #a0b2ba;
          font-size: 10px;
        }

        .relatedList strong {
          margin-top: 8px;
          font-size: 10px;
        }

        .evidenceGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .evidenceGrid div {
          min-height: 75px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
        }

        .evidenceGrid span {
          color: #6fdced;
          font-size: 7px;
        }

        .evidenceGrid strong {
          display: block;
          margin-top: 8px;
          color: #aabcc4;
          font-size: 9px;
        }

        .executionCard {
          margin-top: 14px;
          padding: 19px;
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 16px;
          border: 1px solid rgba(255, 198, 82, 0.19);
          border-radius: 16px;
        }

        .executionSeal {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc875;
        }

        .executionCard span {
          color: #e4b95e;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .executionCard p {
          margin: 8px 0 0;
          color: #d3e0e4;
          font-size: 12px;
          line-height: 1.62;
        }

        .recordActions,
        .boundaryActions {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .sequenceGrid article {
          min-height: 190px;
          padding: 19px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: rgba(10, 30, 45, 0.7);
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
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
          font: 700 19px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 10px;
          line-height: 1.58;
        }

        .boundarySection {
          margin-top: 88px;
          padding: 56px 34px;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 31px;
          background: rgba(8, 20, 33, 0.97);
          text-align: center;
        }

        .boundarySeal {
          width: 82px;
          height: 82px;
        }

        .boundarySection h2 {
          margin-top: 14px;
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
        }

        .boundaryGrid span {
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          font-size: 12px;
        }

        .boundaryActions {
          justify-content: center;
        }

        @media (max-width: 980px) {
          .sectionHeading,
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .standardIndex {
            position: static;
          }

          .recordColumns {
            grid-template-columns: 1fr;
          }

          .sequenceGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .filterPanel,
          .heroMetrics,
          .authorityStrip,
          .evidenceGrid,
          .sequenceGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .recordHeader {
            flex-direction: column;
          }

          .recordIdentity {
            align-items: flex-start;
          }

          .executionCard {
            grid-template-columns: 1fr;
          }

          .recordActions,
          .boundaryActions {
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
