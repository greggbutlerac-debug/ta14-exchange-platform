"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type LawStatus =
  | "In force"
  | "Phased implementation"
  | "Enacted"
  | "Proposed";

type Jurisdiction =
  | "European Union"
  | "United States"
  | "United Kingdom"
  | "Canada"
  | "China"
  | "International";

type LawRecord = {
  id: string;
  shortName: string;
  title: string;
  jurisdiction: Jurisdiction;
  status: LawStatus;
  authorityType: string;
  summary: string;
  applicability: string[];
  obligations: string[];
  evidence: string[];
  executionBoundary: string;
  sourceNotice: string;
};

const lawRecords: LawRecord[] = [
  {
    id: "eu-ai-act",
    shortName: "EU AI Act",
    title: "European Union Artificial Intelligence Act",
    jurisdiction: "European Union",
    status: "Phased implementation",
    authorityType: "Binding regional legislation",
    summary:
      "A risk-based legal framework governing prohibited AI practices, high-risk AI systems, transparency duties, general-purpose AI models, governance, enforcement, and market oversight.",
    applicability: [
      "Providers placing AI systems or models on the EU market",
      "Deployers using AI systems within the European Union",
      "Importers, distributors, product manufacturers, and authorized representatives",
      "Certain providers and deployers outside the European Union when system outputs are used within the Union",
    ],
    obligations: [
      "Determine the regulated role and system classification",
      "Identify prohibited, high-risk, transparency, or general-purpose AI duties",
      "Maintain required technical documentation and records",
      "Establish risk management, data governance, human oversight, and monitoring controls",
      "Support incident reporting, corrective action, and regulatory cooperation",
    ],
    evidence: [
      "System classification record",
      "Role and entity determination",
      "Risk-management file",
      "Technical documentation",
      "Validation and testing results",
      "Human-oversight record",
      "Post-market monitoring record",
    ],
    executionBoundary:
      "A classification or conformity record may support a governance determination, but the executing entity must still establish that the exact system, use, authority, evidence, and runtime conditions remain valid.",
    sourceNotice:
      "Consult the official consolidated regulation, implementation dates, delegated acts, standards, guidance, and competent authority materials.",
  },
  {
    id: "colorado-ai-act",
    shortName: "Colorado AI Act",
    title: "Colorado Artificial Intelligence Act",
    jurisdiction: "United States",
    status: "Enacted",
    authorityType: "State legislation",
    summary:
      "A state-level framework addressing developers and deployers of certain high-risk artificial intelligence systems and the prevention of algorithmic discrimination in consequential decisions.",
    applicability: [
      "Developers of covered high-risk artificial intelligence systems",
      "Deployers using covered systems for consequential decisions",
      "Organizations operating within the statute’s jurisdictional and threshold boundaries",
    ],
    obligations: [
      "Use reasonable care to protect consumers from known or reasonably foreseeable algorithmic discrimination",
      "Provide required documentation and disclosures",
      "Complete impact assessments where required",
      "Maintain risk-management and governance processes",
      "Support consumer notice, correction, appeal, or human-review mechanisms where applicable",
    ],
    evidence: [
      "Covered-system determination",
      "Developer documentation",
      "Impact assessment",
      "Risk-management policy",
      "Consumer notice",
      "Appeal or human-review record",
      "Monitoring and corrective-action record",
    ],
    executionBoundary:
      "A general policy or developer statement does not prove that a particular consequential decision was properly authorized, evidence-supported, reviewed, and preserved.",
    sourceNotice:
      "Consult the enacted statutory text, amendments, attorney-general materials, rulemaking, effective dates, and applicable exemptions.",
  },
  {
    id: "nyc-local-law-144",
    shortName: "NYC Local Law 144",
    title:
      "New York City Automated Employment Decision Tool Requirements",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "Municipal legislation",
    summary:
      "Requirements governing certain automated employment decision tools used in hiring and promotion, including bias-audit and notice obligations.",
    applicability: [
      "Employers and employment agencies using a covered automated employment decision tool",
      "Covered hiring or promotion decisions involving candidates or employees in New York City",
    ],
    obligations: [
      "Determine whether the tool falls within the covered definition",
      "Obtain the required independent bias audit",
      "Make required audit information publicly available",
      "Provide required notices before tool use",
      "Preserve records supporting the determination and disclosures",
    ],
    evidence: [
      "Tool-scope determination",
      "Independent bias audit",
      "Published audit summary",
      "Candidate or employee notice",
      "Tool-use record",
      "Version and change history",
    ],
    executionBoundary:
      "A published audit does not establish that every later employment decision used the same tool version, data conditions, process, authority, or human-review controls.",
    sourceNotice:
      "Consult the official city law, enforcement rules, definitions, frequently asked questions, and current enforcement guidance.",
  },
  {
    id: "illinois-aiv-interview-act",
    shortName: "Illinois AI Video Interview Act",
    title: "Illinois Artificial Intelligence Video Interview Act",
    jurisdiction: "United States",
    status: "In force",
    authorityType: "State legislation",
    summary:
      "Requirements applying to certain uses of artificial intelligence to analyze applicant-submitted video interviews for positions based in Illinois.",
    applicability: [
      "Employers requesting applicant video interviews for Illinois-based positions",
      "Covered uses of artificial intelligence to analyze submitted interview videos",
    ],
    obligations: [
      "Notify applicants that artificial intelligence may be used",
      "Explain generally how the system works and what characteristics it evaluates",
      "Obtain required consent",
      "Limit sharing of submitted videos",
      "Address deletion requests within the applicable requirements",
    ],
    evidence: [
      "Applicant notice",
      "System explanation",
      "Consent record",
      "Video-access record",
      "Deletion request",
      "Deletion completion record",
    ],
    executionBoundary:
      "Consent to an AI-assisted interview process does not authorize unrelated processing, expanded sharing, or decisions beyond the declared employment purpose.",
    sourceNotice:
      "Consult the official statute, amendments, reporting duties, definitions, and relevant state guidance.",
  },
  {
    id: "executive-order-14110",
    shortName: "Executive Order 14110",
    title:
      "United States Executive Order on Safe, Secure, and Trustworthy Artificial Intelligence",
    jurisdiction: "United States",
    status: "Enacted",
    authorityType: "Federal executive action",
    summary:
      "A federal executive directive assigning artificial-intelligence-related actions, standards work, reporting, evaluation, procurement, security, civil-rights, workforce, and innovation responsibilities across agencies.",
    applicability: [
      "Federal departments and agencies assigned duties by the order",
      "Organizations affected through federal procurement, reporting, standards, or program requirements",
      "Developers or operators falling within specifically defined reporting or government-use conditions",
    ],
    obligations: [
      "Identify the controlling agency action rather than relying on the executive order alone",
      "Determine whether subsequent guidance, standards, rules, or procurement terms apply",
      "Preserve required safety, security, testing, or reporting records",
      "Track changes in agency implementation and legal authority",
    ],
    evidence: [
      "Agency applicability determination",
      "Procurement requirement",
      "Testing or evaluation result",
      "Reporting record",
      "Security documentation",
      "Implementation guidance",
    ],
    executionBoundary:
      "An executive directive may cause downstream agency obligations, but the operative requirement must be traced to the responsible authority, instrument, scope, and current implementation state.",
    sourceNotice:
      "Consult the official order and current agency actions. Executive actions and their implementation status can change.",
  },
  {
    id: "canada-aida",
    shortName: "AIDA",
    title: "Artificial Intelligence and Data Act Proposal",
    jurisdiction: "Canada",
    status: "Proposed",
    authorityType: "Legislative proposal",
    summary:
      "A proposed Canadian framework intended to govern certain artificial intelligence systems through risk-management, transparency, oversight, and enforcement requirements.",
    applicability: [
      "Potentially covered organizations designing, developing, making available, or managing regulated AI systems",
      "Activities falling within the final enacted scope, should legislation be adopted",
    ],
    obligations: [
      "Do not represent a proposal as binding enacted law",
      "Track the bill’s legislative status and revisions",
      "Separate anticipated duties from current legal requirements",
      "Preserve the date and source of any proposal-based assessment",
    ],
    evidence: [
      "Legislative-status record",
      "Bill-version record",
      "Preliminary applicability analysis",
      "Gap assessment",
      "Readiness plan",
    ],
    executionBoundary:
      "Readiness work may be valuable, but proposed obligations cannot be treated as final controlling law unless and until they are enacted and effective.",
    sourceNotice:
      "Consult the current parliamentary record and official government materials before relying on any proposed requirement.",
  },
  {
    id: "uk-ai-framework",
    shortName: "UK AI Framework",
    title:
      "United Kingdom Pro-Innovation Approach to AI Regulation",
    jurisdiction: "United Kingdom",
    status: "Phased implementation",
    authorityType: "Cross-regulator policy framework",
    summary:
      "A principles-based approach relying substantially on existing regulators applying cross-sector artificial-intelligence principles within their legal remits.",
    applicability: [
      "Organizations subject to UK sector regulators and existing legal duties",
      "AI uses falling within data protection, consumer, competition, employment, safety, financial, or other regulated domains",
    ],
    obligations: [
      "Identify the competent regulator and existing legal authority",
      "Determine which cross-sector principles and sector rules apply",
      "Avoid treating nonbinding policy language as an independent statutory command",
      "Preserve regulator-specific evidence and determinations",
    ],
    evidence: [
      "Regulator mapping",
      "Sector-law applicability record",
      "Risk assessment",
      "Transparency record",
      "Accountability assignment",
      "Monitoring record",
    ],
    executionBoundary:
      "A broad national principle does not replace the specific statutory power, regulatory rule, sector duty, or contractual authority controlling the actual use.",
    sourceNotice:
      "Consult current UK government policy, regulator guidance, sector law, and any subsequent legislation.",
  },
  {
    id: "china-interim-generative-ai-measures",
    shortName: "Generative AI Measures",
    title:
      "China Interim Measures for the Management of Generative Artificial Intelligence Services",
    jurisdiction: "China",
    status: "In force",
    authorityType: "National administrative measures",
    summary:
      "Administrative requirements addressing certain generative artificial intelligence services offered to the public within the relevant territorial and service scope.",
    applicability: [
      "Providers offering covered generative artificial intelligence services to the public",
      "Activities and services falling within the territorial and definitional scope of the measures",
    ],
    obligations: [
      "Determine whether the service and provider are covered",
      "Address content, data, security, user-protection, and service-management duties",
      "Complete applicable filings, assessments, or algorithm-related procedures",
      "Maintain complaint, correction, and operational records",
    ],
    evidence: [
      "Service-scope determination",
      "Provider record",
      "Data and training documentation",
      "Security assessment",
      "Algorithm filing or registration record",
      "User complaint and correction record",
    ],
    executionBoundary:
      "A provider-level filing or assessment does not automatically authorize every downstream use, output, transfer, or consequential decision.",
    sourceNotice:
      "Consult the official Chinese-language measures, related algorithm rules, data and cybersecurity laws, filing requirements, and regulator materials.",
  },
  {
    id: "oecd-ai-principles",
    shortName: "OECD AI Principles",
    title:
      "Organisation for Economic Co-operation and Development AI Principles",
    jurisdiction: "International",
    status: "In force",
    authorityType: "Intergovernmental policy principles",
    summary:
      "International principles promoting inclusive growth, human-centered values, transparency, robustness, security, safety, and accountability in artificial intelligence.",
    applicability: [
      "Governments, organizations, and institutions adopting or referencing the principles",
      "Policy, procurement, assurance, and governance programs using the principles as a normative source",
    ],
    obligations: [
      "Distinguish policy principles from directly binding legislation",
      "Identify any law, contract, standard, or internal control implementing the principle",
      "Translate broad principles into measurable evidence and accountable controls",
    ],
    evidence: [
      "Principle adoption record",
      "Control mapping",
      "Policy implementation record",
      "Risk assessment",
      "Monitoring and outcome record",
    ],
    executionBoundary:
      "A voluntary or policy-level principle can guide governance but does not independently create the authority needed to release a consequential action.",
    sourceNotice:
      "Consult the official OECD text, updates, national implementations, and any binding instruments that incorporate the principles.",
  },
];

const jurisdictions: Array<"All jurisdictions" | Jurisdiction> = [
  "All jurisdictions",
  "European Union",
  "United States",
  "United Kingdom",
  "Canada",
  "China",
  "International",
];

const statuses: Array<"All statuses" | LawStatus> = [
  "All statuses",
  "In force",
  "Phased implementation",
  "Enacted",
  "Proposed",
];

function statusClass(status: LawStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function LawsPage() {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState<
    "All jurisdictions" | Jurisdiction
  >("All jurisdictions");
  const [status, setStatus] = useState<
    "All statuses" | LawStatus
  >("All statuses");
  const [selectedLawId, setSelectedLawId] = useState(
    lawRecords[0].id,
  );

  const filteredLaws = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return lawRecords.filter((law) => {
      const jurisdictionMatches =
        jurisdiction === "All jurisdictions" ||
        law.jurisdiction === jurisdiction;

      const statusMatches =
        status === "All statuses" ||
        law.status === status;

      const searchable = [
        law.shortName,
        law.title,
        law.jurisdiction,
        law.status,
        law.authorityType,
        law.summary,
        law.executionBoundary,
        ...law.applicability,
        ...law.obligations,
        ...law.evidence,
      ]
        .join(" ")
        .toLowerCase();

      const queryMatches =
        normalizedQuery.length === 0 ||
        normalizedQuery
          .split(/\s+/)
          .every((token) => searchable.includes(token));

      return (
        jurisdictionMatches &&
        statusMatches &&
        queryMatches
      );
    });
  }, [jurisdiction, query, status]);

  const selectedLaw =
    lawRecords.find((law) => law.id === selectedLawId) ??
    filteredLaws[0] ??
    lawRecords[0];

  const metrics = useMemo(
    () => ({
      authorities: lawRecords.length,
      jurisdictions: new Set(
        lawRecords.map((law) => law.jurisdiction),
      ).size,
      active: lawRecords.filter(
        (law) =>
          law.status === "In force" ||
          law.status === "Phased implementation",
      ).length,
      proposed: lawRecords.filter(
        (law) => law.status === "Proposed",
      ).length,
      evidenceTypes: new Set(
        lawRecords.flatMap((law) => law.evidence),
      ).size,
    }),
    [],
  );

  function clearFilters() {
    setQuery("");
    setJurisdiction("All jurisdictions");
    setStatus("All statuses");
  }

  return (
    <main className="lawsPage">
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
            Authority navigation workspace
          </div>

          <Link
            href="/governance-library/applicability"
            className="topbarAction"
          >
            Run Applicability →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>GL</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AI GOVERNANCE LIBRARY
          </p>

          <h1>
            AI Governance
            <span> Laws & Authorities</span>
          </h1>

          <p className="lead">
            Navigate selected artificial-intelligence laws,
            regulatory instruments, policy frameworks, and
            jurisdictional authorities. Each record separates general
            governance relevance from applicability, evidence, legal
            status, and TA-14 execution boundaries.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{metrics.authorities}</span>
              <small>Authority records</small>
            </article>

            <article>
              <span>{metrics.jurisdictions}</span>
              <small>Jurisdictions</small>
            </article>

            <article>
              <span>{metrics.active}</span>
              <small>Active or phasing</small>
            </article>

            <article>
              <span>{metrics.proposed}</span>
              <small>Proposed instruments</small>
            </article>

            <article>
              <span>{metrics.evidenceTypes}</span>
              <small>Evidence references</small>
            </article>
          </div>
        </header>

        <section className="librarySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                AUTHORITY CONTROL DESK
              </p>

              <h2>
                Find the authority. Test the scope.
              </h2>
            </div>

            <p>
              A law’s existence does not establish that it applies to
              a particular entity, system, role, territory, date, or
              execution. Applicability must be separately determined
              and preserved.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search laws and authorities
              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search EU AI Act, high-risk, deployer, employment..."
              />
            </label>

            <label>
              Jurisdiction
              <select
                value={jurisdiction}
                onChange={(event) =>
                  setJurisdiction(
                    event.target.value as
                      | "All jurisdictions"
                      | Jurisdiction,
                  )
                }
              >
                {jurisdictions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Legal status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "All statuses"
                      | LawStatus,
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
            <aside className="lawIndex">
              <div className="indexHeading">
                <div>
                  <span>Authority index</span>
                  <strong>
                    {filteredLaws.length} records
                  </strong>
                </div>

                <small>
                  Select a record to inspect its governance
                  conditions.
                </small>
              </div>

              <div className="lawList">
                {filteredLaws.map((law, index) => (
                  <button
                    key={law.id}
                    type="button"
                    className={
                      selectedLaw.id === law.id
                        ? "lawButton active"
                        : "lawButton"
                    }
                    onClick={() => setSelectedLawId(law.id)}
                  >
                    <span className="lawNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="lawIdentity">
                      <small>{law.jurisdiction}</small>
                      <strong>{law.shortName}</strong>
                      <em>{law.authorityType}</em>
                    </span>

                    <span
                      className={`statusDot ${statusClass(
                        law.status,
                      )}`}
                    />
                  </button>
                ))}

                {filteredLaws.length === 0 ? (
                  <div className="emptyIndex">
                    <span>00</span>
                    <strong>No authority matched.</strong>
                    <p>
                      Broaden the search or clear the current
                      filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="lawRecord">
              <div className="recordHeader">
                <div className="recordIdentity">
                  <div className="recordSeal">
                    {selectedLaw.shortName
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .slice(0, 3)}
                  </div>

                  <div>
                    <p>{selectedLaw.jurisdiction}</p>
                    <h3>{selectedLaw.shortName}</h3>
                    <span>{selectedLaw.title}</span>
                  </div>
                </div>

                <div
                  className={`statusBadge ${statusClass(
                    selectedLaw.status,
                  )}`}
                >
                  {selectedLaw.status}
                </div>
              </div>

              <div className="authorityStrip">
                <div>
                  <span>Authority type</span>
                  <strong>{selectedLaw.authorityType}</strong>
                </div>

                <div>
                  <span>Jurisdiction</span>
                  <strong>{selectedLaw.jurisdiction}</strong>
                </div>

                <div>
                  <span>Record condition</span>
                  <strong>Navigation only</strong>
                </div>
              </div>

              <div className="summaryCard">
                <span>Authority summary</span>
                <p>{selectedLaw.summary}</p>
              </div>

              <div className="recordColumns">
                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Potential applicability</span>
                    <strong>
                      {selectedLaw.applicability.length}
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedLaw.applicability.map(
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
                    <span>Governance obligations</span>
                    <strong>
                      {selectedLaw.obligations.length}
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedLaw.obligations.map(
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
              </div>

              <article className="evidenceCard">
                <div className="cardHeading">
                  <span>Evidence commonly associated</span>
                  <strong>{selectedLaw.evidence.length}</strong>
                </div>

                <div className="evidenceGrid">
                  {selectedLaw.evidence.map(
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
                  <p>{selectedLaw.executionBoundary}</p>
                </div>
              </article>

              <article className="sourceCard">
                <span>Official-source requirement</span>
                <p>{selectedLaw.sourceNotice}</p>
              </article>

              <div className="recordActions">
                <Link
                  href="/governance-library/applicability"
                  className="secondaryAction"
                >
                  Test Applicability
                </Link>

                <Link
                  href="/governance-library/crosswalks"
                  className="secondaryAction"
                >
                  Compare Frameworks
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
                AUTHORITY DETERMINATION SEQUENCE
              </p>

              <h2>
                Law must be translated into governed execution.
              </h2>
            </div>

            <p>
              A reliable governance route preserves the authority,
              interpretation, evidence, decision, execution, and
              resulting outcome rather than relying on a general
              compliance claim.
            </p>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Identify",
                text: "Identify the official authority, instrument, version, jurisdiction, and effective date.",
              },
              {
                code: "02",
                title: "Classify",
                text: "Classify the entity, regulated role, system, use, risk level, and territorial connection.",
              },
              {
                code: "03",
                title: "Interpret",
                text: "Determine the applicable duty, exemption, threshold, and competent authority.",
              },
              {
                code: "04",
                title: "Evidence",
                text: "Collect attributable records demonstrating whether each relevant condition is supported.",
              },
              {
                code: "05",
                title: "Determine",
                text: "Issue a bounded determination without converting uncertainty into a compliance claim.",
              },
              {
                code: "06",
                title: "Control",
                text: "Bind the determination to ALLOW, HOLD, DENY, or ESCALATE execution conditions.",
              },
              {
                code: "07",
                title: "Preserve",
                text: "Preserve the legal source, evidence, reviewer, decision, execution, and outcome record.",
              },
              {
                code: "08",
                title: "Revalidate",
                text: "Reassess when the law, system, use, role, evidence, or operating condition changes.",
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
            <span>LB</span>
            <small>Legal boundary</small>
          </div>

          <p className="eyebrow gold">
            LEGAL NAVIGATION BOUNDARY
          </p>

          <h2>
            A library record is not a legal determination.
          </h2>

          <p>
            This workspace organizes selected governance authorities
            and identifies evidence and execution questions. It does
            not provide legal advice, establish that a law applies,
            determine compliance, issue certification, replace a
            regulator or court, or authorize execution. Official
            sources, current law, competent counsel, qualified
            reviewers, and the applicable authority remain
            controlling.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>LIBRARY PROVIDES</span>
              <strong>
                Authority navigation, applicability questions,
                obligation mapping, and evidence orientation
              </strong>
            </article>

            <article>
              <span>LIBRARY DOES NOT PROVIDE</span>
              <strong>
                Legal advice, regulatory approval, conformity,
                certification, or universal compliance
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Current authority, admissible evidence, binding,
                control, and preserved outcome proof
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
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Open Testing
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
        .lawsPage {
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

        .librarySection,
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

        input:focus,
        select:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
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
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .lawIndex,
        .lawRecord {
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        .lawIndex {
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
          letter-spacing: 0.1em;
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

        .lawList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .lawButton {
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
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .lawButton:hover,
        .lawButton.active {
          transform: translateX(3px);
          border-color: rgba(99, 230, 255, 0.28);
          background: rgba(99, 230, 255, 0.05);
        }

        .lawNumber {
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

        .lawIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .lawIdentity small {
          color: #728995;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .lawIdentity strong {
          overflow: hidden;
          color: #dce8ec;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lawIdentity em {
          overflow: hidden;
          color: #71858f;
          font-size: 8px;
          font-style: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #63727a;
        }

        .statusDot.in-force {
          background: #72e6b2;
          box-shadow: 0 0 10px rgba(114, 230, 178, 0.6);
        }

        .statusDot.phased-implementation {
          background: #71d7ef;
        }

        .statusDot.enacted {
          background: #efc76e;
        }

        .statusDot.proposed {
          background: #b77be2;
        }

        .emptyIndex {
          padding: 35px 18px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          text-align: center;
        }

        .emptyIndex span {
          color: #efc875;
          font: 700 22px Georgia, serif;
        }

        .emptyIndex strong {
          display: block;
          margin-top: 10px;
          font-size: 12px;
        }

        .emptyIndex p {
          margin: 8px 0 0;
          color: #748b96;
          font-size: 9px;
          line-height: 1.5;
        }

        .lawRecord {
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
          background: rgba(255, 198, 82, 0.04);
          font: 700 18px Georgia, serif;
        }

        .recordIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .recordIdentity h3 {
          margin: 6px 0 0;
          font-size: clamp(29px, 3vw, 43px);
          line-height: 1;
        }

        .recordIdentity span {
          display: block;
          max-width: 710px;
          margin-top: 8px;
          color: #8499a3;
          font-size: 11px;
          line-height: 1.5;
        }

        .statusBadge {
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #9fb1b9;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .statusBadge.in-force {
          color: #89efc2;
          border-color: rgba(114, 230, 178, 0.24);
          background: rgba(114, 230, 178, 0.06);
        }

        .statusBadge.phased-implementation {
          color: #85e7f6;
          border-color: rgba(113, 215, 239, 0.24);
          background: rgba(113, 215, 239, 0.06);
        }

        .statusBadge.enacted {
          color: #f3cf7d;
          border-color: rgba(239, 199, 110, 0.25);
          background: rgba(239, 199, 110, 0.06);
        }

        .statusBadge.proposed {
          color: #d39af0;
          border-color: rgba(183, 123, 226, 0.25);
          background: rgba(183, 123, 226, 0.06);
        }

        .authorityStrip {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .authorityStrip div {
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .authorityStrip span,
        .summaryCard > span,
        .sourceCard > span {
          color: #70ddec;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          color: #d4e1e5;
          font-size: 10px;
        }

        .summaryCard,
        .sourceCard {
          margin-top: 14px;
          padding: 19px;
          border: 1px solid rgba(99, 230, 255, 0.1);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .summaryCard p,
        .sourceCard p {
          margin: 9px 0 0;
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

        .recordCard,
        .evidenceCard {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.14);
        }

        .evidenceCard {
          margin-top: 14px;
        }

        .cardHeading {
          padding-bottom: 13px;
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

        .numberedList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .numberedList div {
          display: grid;
          grid-template-columns: 31px minmax(0, 1fr);
          align-items: start;
          gap: 10px;
        }

        .numberedList div > span {
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

        .numberedList p {
          margin: 5px 0 0;
          color: #a0b2ba;
          font-size: 10px;
          line-height: 1.55;
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
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.14);
        }

        .evidenceGrid span {
          color: #6fdced;
          font-size: 7px;
          font-weight: 900;
        }

        .evidenceGrid strong {
          color: #aabcc4;
          font-size: 9px;
          line-height: 1.45;
        }

        .executionCard {
          margin-top: 14px;
          padding: 19px;
          display: grid;
          grid-template-columns: 60px minmax(0, 1fr);
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 198, 82, 0.19);
          border-radius: 16px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 198, 82, 0.07),
              transparent 34%
            ),
            rgba(0, 0, 0, 0.16);
        }

        .executionSeal {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc875;
          font: 700 15px Georgia, serif;
        }

        .executionCard span {
          color: #e4b95e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .executionCard p {
          margin: 8px 0 0;
          color: #d3e0e4;
          font-size: 12px;
          line-height: 1.62;
        }

        .recordActions {
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
          font-size: 10px;
          line-height: 1.58;
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
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .filterPanel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .workspaceGrid {
            grid-template-columns: 330px minmax(0, 1fr);
          }

          .evidenceGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .lawIndex {
            position: static;
          }

          .lawList {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .recordColumns {
            grid-template-columns: 1fr;
          }

          .sequenceGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .filterPanel,
          .lawList,
          .authorityStrip,
          .evidenceGrid,
          .sequenceGrid {
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

          .heroMetrics {
            grid-template-columns: 1fr;
          }

          .lawIndex,
          .lawRecord,
          .boundarySection {
            padding: 21px;
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
