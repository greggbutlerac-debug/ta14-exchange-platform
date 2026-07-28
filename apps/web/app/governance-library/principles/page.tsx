"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type GovernancePrinciple = {
  number: string;
  title: string;
  category: string;
  status: string;
  description: string;
  governingQuestion: string;
  obligations: string[];
  evidence: string[];
  relatedAreas: string[];
  executionBoundary: string;
  accent: string;
};

const principles: GovernancePrinciple[] = [
  {
    number: "01",
    title: "Human Agency and Oversight",
    category: "Human Authority",
    status: "Foundational",
    description:
      "AI systems should preserve meaningful human authority, intervention paths, informed review, and accountability for consequential decisions.",
    governingQuestion:
      "Can an authorized human understand, challenge, interrupt, override, or refuse the system’s proposed action before harm becomes irreversible?",
    obligations: [
      "Define accountable human decision authorities",
      "Preserve intervention and override capability",
      "Prevent nominal or ineffective human review",
      "Document escalation and exception routes",
      "Ensure reviewers have sufficient information and competence",
      "Preserve evidence of human approvals and interventions",
    ],
    evidence: [
      "Authority Matrix",
      "Human Oversight Plan",
      "Intervention Record",
      "Escalation Log",
      "Reviewer Competence Record",
      "Approval Receipt",
    ],
    relatedAreas: [
      "Roles",
      "Accountability",
      "Lifecycle",
      "Assurance",
      "Incident Response",
    ],
    executionBoundary:
      "Execution must be held when required human authority is absent, uninformed, conflicted, or unable to intervene.",
    accent: "HA",
  },
  {
    number: "02",
    title: "Technical Robustness and Safety",
    category: "System Integrity",
    status: "Foundational",
    description:
      "AI systems should operate reliably, resist foreseeable failure, remain within approved conditions, and fail safely when boundaries are exceeded.",
    governingQuestion:
      "Does the system remain dependable under expected, degraded, adversarial, and out-of-distribution operating conditions?",
    obligations: [
      "Define operational and safety thresholds",
      "Test foreseeable misuse and failure modes",
      "Implement fallback, rollback, and safe-state controls",
      "Monitor reliability, drift, and boundary violations",
      "Preserve configuration and version continuity",
      "Revalidate after material change or incident",
    ],
    evidence: [
      "Safety Case",
      "Robustness Test Results",
      "Failure Mode Analysis",
      "Rollback Verification",
      "Configuration Record",
      "Revalidation Decision",
    ],
    relatedAreas: [
      "Testing",
      "Risk Management",
      "Lifecycle",
      "Monitoring",
      "Change Control",
    ],
    executionBoundary:
      "Execution must not proceed when the system is outside validated conditions or when safe failure cannot be assured.",
    accent: "TS",
  },
  {
    number: "03",
    title: "Privacy and Data Governance",
    category: "Data Governance",
    status: "Foundational",
    description:
      "Data should be lawfully obtained, appropriately governed, traceable, secure, proportionate, and limited to legitimate purposes.",
    governingQuestion:
      "Can the organization prove where the data came from, why it may be used, how it was transformed, and who remains accountable for it?",
    obligations: [
      "Establish lawful basis and legitimate purpose",
      "Preserve provenance and transformation history",
      "Minimize collection and retention",
      "Control access, sharing, and secondary use",
      "Assess privacy and re-identification risk",
      "Govern correction, deletion, and challenge rights",
    ],
    evidence: [
      "Data Provenance Record",
      "Lawful Basis Assessment",
      "Data Inventory",
      "Access Control Record",
      "Privacy Impact Assessment",
      "Retention Decision",
    ],
    relatedAreas: [
      "Data",
      "Privacy",
      "Security",
      "Provenance",
      "Rights",
    ],
    executionBoundary:
      "Execution must be restricted when data authority, provenance, permitted purpose, integrity, or access control cannot be demonstrated.",
    accent: "DG",
  },
  {
    number: "04",
    title: "Transparency and Explainability",
    category: "Information Integrity",
    status: "Foundational",
    description:
      "Relevant parties should be able to understand the system’s role, limitations, evidence basis, decision path, and material consequences.",
    governingQuestion:
      "Is the explanation sufficient for the affected party, operator, reviewer, regulator, or decision authority who must rely on it?",
    obligations: [
      "Disclose AI involvement where material",
      "Explain intended purpose and limitations",
      "Preserve decision logic and evidence basis",
      "Provide audience-appropriate explanations",
      "Document uncertainty and confidence boundaries",
      "Support challenge, review, and correction",
    ],
    evidence: [
      "System Disclosure",
      "Model Card",
      "Decision Explanation",
      "Limitation Statement",
      "Confidence Record",
      "Challenge Response",
    ],
    relatedAreas: [
      "Explainability",
      "Disclosure",
      "Documentation",
      "Rights",
      "Auditability",
    ],
    executionBoundary:
      "Execution should be held when required parties cannot understand the decision, its basis, or its material limitations.",
    accent: "TX",
  },
  {
    number: "05",
    title: "Fairness and Non-Discrimination",
    category: "Rights and Equity",
    status: "Foundational",
    description:
      "AI governance should identify, evaluate, prevent, and remedy unjustified differential treatment, exclusion, and harmful bias.",
    governingQuestion:
      "Are materially different outcomes justified by legitimate evidence, or do they reflect avoidable bias, proxy discrimination, or structural exclusion?",
    obligations: [
      "Identify affected groups and protected interests",
      "Assess representativeness and data imbalance",
      "Test differential outcomes and error rates",
      "Document justification for material disparities",
      "Provide challenge and remedy mechanisms",
      "Monitor fairness after deployment",
    ],
    evidence: [
      "Fairness Assessment",
      "Dataset Representation Review",
      "Disparity Test Results",
      "Justification Record",
      "Remedy Record",
      "Post-Deployment Monitoring",
    ],
    relatedAreas: [
      "Bias",
      "Human Rights",
      "Impact Assessment",
      "Testing",
      "Remedy",
    ],
    executionBoundary:
      "Execution must be restricted when material disparity lacks lawful, proportionate, evidence-supported justification.",
    accent: "FN",
  },
  {
    number: "06",
    title: "Accountability and Auditability",
    category: "Governance Authority",
    status: "Foundational",
    description:
      "Roles, authority, evidence, approvals, execution decisions, interventions, and outcomes should be attributable and reviewable.",
    governingQuestion:
      "Can every consequential decision be traced to the responsible actors, governing authority, evidence basis, and preserved outcome?",
    obligations: [
      "Assign ownership for systems and decisions",
      "Separate review, approval, and execution roles",
      "Preserve complete decision and action records",
      "Maintain traceable authority and delegation",
      "Enable independent review and challenge",
      "Document corrective action and closure",
    ],
    evidence: [
      "Responsibility Matrix",
      "Delegation Record",
      "Decision Log",
      "Execution Receipt",
      "Audit Trail",
      "Corrective Action Record",
    ],
    relatedAreas: [
      "Roles",
      "Assurance",
      "Governed Records",
      "Audit",
      "Enforcement",
    ],
    executionBoundary:
      "Execution must not proceed when responsibility, authority, decision ownership, or record preservation is materially unclear.",
    accent: "AA",
  },
  {
    number: "07",
    title: "Environmental and Social Well-Being",
    category: "Public Interest",
    status: "Foundational",
    description:
      "AI systems should account for broader environmental, social, institutional, and public-interest consequences across their lifecycle.",
    governingQuestion:
      "What direct, indirect, cumulative, and externalized effects could the system impose on people, communities, institutions, or the environment?",
    obligations: [
      "Assess environmental and social impacts",
      "Identify affected communities and stakeholders",
      "Evaluate energy, resource, and infrastructure burdens",
      "Consider systemic and cumulative consequences",
      "Document public-interest tradeoffs",
      "Monitor long-term and indirect effects",
    ],
    evidence: [
      "Impact Assessment",
      "Stakeholder Record",
      "Resource Use Record",
      "Public Interest Analysis",
      "Mitigation Plan",
      "Long-Term Monitoring Record",
    ],
    relatedAreas: [
      "Environment",
      "Society",
      "Sustainability",
      "Public Interest",
      "Impact",
    ],
    executionBoundary:
      "Execution should be restricted when foreseeable public or environmental harm is unassessed, unmanaged, or disproportionate.",
    accent: "EW",
  },
  {
    number: "08",
    title: "Security and Resilience",
    category: "Operational Protection",
    status: "Foundational",
    description:
      "AI systems, data, interfaces, dependencies, and governing records should be protected against unauthorized access, manipulation, disruption, and compromise.",
    governingQuestion:
      "Can the system preserve trusted operation and recover safely when attacked, corrupted, interrupted, or deprived of critical dependencies?",
    obligations: [
      "Identify threat actors and attack surfaces",
      "Secure models, data, interfaces, and credentials",
      "Test adversarial and abuse scenarios",
      "Monitor compromise and unauthorized change",
      "Preserve recovery and continuity capability",
      "Govern third-party and supply-chain dependencies",
    ],
    evidence: [
      "Threat Model",
      "Security Test Results",
      "Access Log",
      "Incident Record",
      "Recovery Verification",
      "Supplier Security Assessment",
    ],
    relatedAreas: [
      "Cybersecurity",
      "Resilience",
      "Supply Chain",
      "Incident Response",
      "Continuity",
    ],
    executionBoundary:
      "Execution must be denied or suspended when system integrity, access control, dependency trust, or recovery capability is compromised.",
    accent: "SR",
  },
  {
    number: "09",
    title: "Contestability and Remedy",
    category: "Procedural Rights",
    status: "Foundational",
    description:
      "Affected parties should have accessible routes to question, challenge, correct, appeal, and obtain remedy for consequential AI outcomes.",
    governingQuestion:
      "Can a materially affected person meaningfully contest the decision and obtain review by an authorized party with power to change the outcome?",
    obligations: [
      "Provide notice of consequential AI use",
      "Establish accessible challenge routes",
      "Preserve evidence needed for review",
      "Assign independent appeal authority",
      "Correct erroneous data or decisions",
      "Document remedy and closure",
    ],
    evidence: [
      "Decision Notice",
      "Challenge Submission",
      "Review Record",
      "Appeal Decision",
      "Correction Record",
      "Remedy Closure",
    ],
    relatedAreas: [
      "Rights",
      "Appeals",
      "Transparency",
      "Human Oversight",
      "Accountability",
    ],
    executionBoundary:
      "Execution should be held or reversed when required notice, review, correction, appeal, or remedy mechanisms are unavailable.",
    accent: "CR",
  },
  {
    number: "10",
    title: "Proportionality and Purpose Limitation",
    category: "Use Governance",
    status: "Foundational",
    description:
      "AI use, control intensity, data processing, and intervention should remain proportionate to the declared purpose, risk, and affected interests.",
    governingQuestion:
      "Is this use necessary, suitable, bounded, and proportionate to the legitimate objective it claims to serve?",
    obligations: [
      "Declare specific intended purpose",
      "Prohibit incompatible secondary use",
      "Match controls to risk and consequence",
      "Use the least intrusive effective approach",
      "Review purpose drift and scope expansion",
      "Retire uses that no longer remain justified",
    ],
    evidence: [
      "Purpose Statement",
      "Necessity Assessment",
      "Proportionality Review",
      "Use Restriction Record",
      "Purpose Drift Assessment",
      "Retirement Decision",
    ],
    relatedAreas: [
      "Applicability",
      "Purpose",
      "Risk",
      "Privacy",
      "Lifecycle",
    ],
    executionBoundary:
      "Execution must not proceed when the use exceeds declared purpose, necessity, authority, or proportionality.",
    accent: "PP",
  },
  {
    number: "11",
    title: "Evidence Integrity and Continuity",
    category: "Record Integrity",
    status: "TA-14 Governing Principle",
    description:
      "Governance evidence should remain attributable, authentic, complete, temporally relevant, and continuous from reality through outcome.",
    governingQuestion:
      "Can the evidence supporting this decision be trusted as a complete and current representation of the governed reality?",
    obligations: [
      "Preserve origin, custody, and transformation history",
      "Maintain version and temporal continuity",
      "Prevent unauthorized alteration or substitution",
      "Identify gaps, conflicts, and stale evidence",
      "Bind records to the governed entity and decision",
      "Preserve outcome evidence after execution",
    ],
    evidence: [
      "Reality Record",
      "Chain-of-Custody Record",
      "Version History",
      "Continuity Determination",
      "Binding Record",
      "Outcome Evidence",
    ],
    relatedAreas: [
      "Governed Records",
      "Continuity",
      "Provenance",
      "Admissibility",
      "Outcome",
    ],
    executionBoundary:
      "No consequential execution should occur when the evidence chain is incomplete, stale, conflicting, unauthenticated, or disconnected from the governed reality.",
    accent: "EC",
  },
  {
    number: "12",
    title: "Admissible Execution",
    category: "Execution Governance",
    status: "TA-14 Governing Principle",
    description:
      "Execution should occur only when evidence, authority, continuity, applicability, binding, and governing conditions are satisfied.",
    governingQuestion:
      "Has the proposed action earned permission to alter reality under the applicable authority, evidence, controls, and conditions?",
    obligations: [
      "Establish admissible truth before intervention",
      "Determine applicable authority and requirements",
      "Verify continuity of evidence and system state",
      "Bind conditions, limitations, and decision authority",
      "Issue allow, hold, deny, or escalate decisions",
      "Preserve execution and outcome records",
    ],
    evidence: [
      "Applicability Determination",
      "Admissibility Decision",
      "Authority Record",
      "Binding Record",
      "Execution Receipt",
      "Outcome Record",
    ],
    relatedAreas: [
      "Admissibility",
      "Authority",
      "Binding",
      "Execution",
      "Outcome",
    ],
    executionBoundary:
      "No admissible evidence. No admissible execution.",
    accent: "AE",
  },
];

const categories = [
  "All Principle Categories",
  ...Array.from(new Set(principles.map((principle) => principle.category))),
];

const statuses = [
  "All Statuses",
  ...Array.from(new Set(principles.map((principle) => principle.status))),
];

export default function PrinciplesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    "All Principle Categories",
  );
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [expandedPrinciples, setExpandedPrinciples] = useState<string[]>([]);

  const visiblePrinciples = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return principles.filter((principle) => {
      const matchesCategory =
        activeCategory === "All Principle Categories" ||
        principle.category === activeCategory;

      const matchesStatus =
        activeStatus === "All Statuses" ||
        principle.status === activeStatus;

      const matchesSearch =
        query.length === 0 ||
        [
          principle.title,
          principle.category,
          principle.status,
          principle.description,
          principle.governingQuestion,
          principle.executionBoundary,
          ...principle.obligations,
          ...principle.evidence,
          ...principle.relatedAreas,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [activeCategory, activeStatus, searchQuery]);

  const totalObligations = principles.reduce(
    (total, principle) => total + principle.obligations.length,
    0,
  );

  const totalEvidenceTypes = principles.reduce(
    (total, principle) => total + principle.evidence.length,
    0,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeCategory !== "All Principle Categories",
    activeStatus !== "All Statuses",
  ].filter(Boolean).length;

  function togglePrinciple(title: string) {
    setExpandedPrinciples((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setActiveCategory("All Principle Categories");
    setActiveStatus("All Statuses");
  }

  return (
    <main className="principlesPage">
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
            Principle architecture active
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
            <span>PR</span>
            <small>Governing principles</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            AI Governance
            <span> Principles</span>
          </h1>

          <p className="lead">
            Explore the foundational principles that shape AI laws,
            standards, frameworks, management systems, assurance practices,
            organizational responsibilities, and evidence-bound execution
            decisions.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{principles.length}</span>
              <small>Principles indexed</small>
            </article>

            <article>
              <span>{categories.length - 1}</span>
              <small>Principle categories</small>
            </article>

            <article>
              <span>{totalObligations}</span>
              <small>Governance obligations</small>
            </article>

            <article>
              <span>{totalEvidenceTypes}</span>
              <small>Evidence types</small>
            </article>

            <article>
              <span>{visiblePrinciples.length}</span>
              <small>Principles shown</small>
            </article>
          </div>
        </header>

        <section className="definitionSection">
          <div className="definitionSeal">
            <span>GP</span>
            <small>Principle function</small>
          </div>

          <div>
            <p className="eyebrow gold">PRINCIPLE GOVERNANCE</p>

            <h2>
              Principles define the values governance must protect, but
              evidence determines whether those values were actually upheld.
            </h2>
          </div>

          <p>
            A principle becomes operational only when it is translated into
            roles, controls, thresholds, records, review requirements,
            execution conditions, and preserved outcomes. Without that
            translation, principle language may guide intent without governing
            action.
          </p>
        </section>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">PRINCIPLE CONTROL DESK</p>

              <h2>
                Search the governing values that shape trustworthy AI
                decisions.
              </h2>
            </div>

            <p>
              Compare principle categories, governing questions, expected
              obligations, required evidence, related governance areas, and
              the execution boundaries each principle establishes.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search governance principles
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search oversight, fairness, transparency, evidence, execution..."
              />
            </label>

            <label>
              Principle category
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={activeStatus}
                onChange={(event) => setActiveStatus(event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
              <span>{visiblePrinciples.length}</span>
              <small>Principles displayed</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{expandedPrinciples.length}</span>
              <small>Principles expanded</small>
            </div>
          </div>
        </section>

        <section className="principlesSection">
          {visiblePrinciples.length > 0 ? (
            <div className="principlesGrid">
              {visiblePrinciples.map((principle) => {
                const isExpanded = expandedPrinciples.includes(
                  principle.title,
                );

                return (
                  <article key={principle.title} className="principleCard">
                    <div className="cardHeader">
                      <div className="principleSeal">{principle.accent}</div>

                      <div className="principleNumber">
                        {principle.number}
                      </div>
                    </div>

                    <div className="principleMeta">
                      <span>{principle.category}</span>
                      <strong>{principle.status}</strong>
                    </div>

                    <h2>{principle.title}</h2>

                    <p className="description">{principle.description}</p>

                    <div className="questionBlock">
                      <span>Governing question</span>
                      <p>{principle.governingQuestion}</p>
                    </div>

                    <div className="listHeading">
                      <span>Operational obligations</span>
                      <strong>{principle.obligations.length} duties</strong>
                    </div>

                    <div className="obligationList">
                      {(isExpanded
                        ? principle.obligations
                        : principle.obligations.slice(0, 4)
                      ).map((obligation) => (
                        <div key={obligation}>
                          <span>◆</span>
                          <strong>{obligation}</strong>
                        </div>
                      ))}
                    </div>

                    {principle.obligations.length > 4 ? (
                      <button
                        type="button"
                        className="expandButton"
                        onClick={() => togglePrinciple(principle.title)}
                      >
                        {isExpanded
                          ? "Show fewer obligations"
                          : `Show ${
                              principle.obligations.length - 4
                            } more obligations`}
                      </button>
                    ) : null}

                    <div className="evidenceBlock">
                      <span>Expected evidence</span>

                      <div className="evidenceGrid">
                        {principle.evidence.map((record) => (
                          <div key={record}>
                            <span />
                            <strong>{record}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="relatedBlock">
                      <span>Related governance areas</span>

                      <div className="tagList">
                        {principle.relatedAreas.map((area) => (
                          <strong key={area}>{area}</strong>
                        ))}
                      </div>
                    </div>

                    <div className="boundaryBlock">
                      <span>Execution boundary</span>
                      <strong>{principle.executionBoundary}</strong>
                    </div>

                    <div className="cardActions">
                      <Link
                        href="/governance-library/crosswalks"
                        className="primaryAction"
                      >
                        View Crosswalks →
                      </Link>

                      <Link
                        href="/governance-library/dictionary"
                        className="secondaryAction"
                      >
                        Related Terms
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No governance principles match the current filters.</h2>

              <p>
                Reset the control desk or search for a broader governance
                value, obligation, evidence type, or execution boundary.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset principle search
              </button>
            </div>
          )}
        </section>

        <section className="principleSequence">
          <p className="eyebrow gold">
            FROM PRINCIPLE TO GOVERNED EXECUTION
          </p>

          <h2>
            A principle must be translated into something the organization can
            prove, enforce, and preserve.
          </h2>

          <div className="sequenceTrack">
            {[
              [
                "01",
                "Principle",
                "Declare the value or protected interest.",
              ],
              [
                "02",
                "Requirement",
                "Translate the principle into a governing obligation.",
              ],
              [
                "03",
                "Control",
                "Define the mechanism that enforces the obligation.",
              ],
              [
                "04",
                "Evidence",
                "Preserve proof that the control exists and operated.",
              ],
              [
                "05",
                "Decision",
                "Determine whether the evidence satisfies the requirement.",
              ],
              [
                "06",
                "Execution",
                "Permit, hold, deny, or escalate the proposed action.",
              ],
            ].map(([number, title, description]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admissibilitySection">
          <div className="admissibilitySeal">
            <span>AE</span>
            <small>Admissible execution</small>
          </div>

          <p className="eyebrow gold">
            PRINCIPLE-TO-EXECUTION BOUNDARY
          </p>

          <h2>
            Principles guide governance. Admissibility determines whether the
            action may proceed.
          </h2>

          <p>
            Human oversight, fairness, transparency, safety, privacy,
            accountability, resilience, and public interest are not satisfied
            by statements of intent alone. Their governing force depends on
            whether the required evidence exists, whether authority remains
            valid, whether controls are operating, and whether the proposed
            execution remains inside the approved conditions.
          </p>

          <div className="admissibilityGrid">
            <article>
              <span>PRINCIPLE LANGUAGE DEFINES</span>
              <strong>
                The value, right, condition, interest, or outcome governance is
                expected to protect.
              </strong>
            </article>

            <article>
              <span>GOVERNANCE CONTROLS DEFINE</span>
              <strong>
                The roles, thresholds, processes, tests, records, and review
                mechanisms required to protect it.
              </strong>
            </article>

            <article>
              <span>ADMISSIBILITY DETERMINES</span>
              <strong>
                Whether the available evidence and authority are sufficient
                for consequential execution.
              </strong>
            </article>

            <article>
              <span>OUTCOME EVIDENCE PROVES</span>
              <strong>
                Whether the governed execution actually preserved the
                principle in operational reality.
              </strong>
            </article>
          </div>

          <div className="governingChain">
            <span>PRINCIPLE</span>
            <strong>→</strong>
            <span>REQUIREMENT</span>
            <strong>→</strong>
            <span>CONTROL</span>
            <strong>→</strong>
            <span>EVIDENCE</span>
            <strong>→</strong>
            <span>ADMISSIBILITY</span>
            <strong>→</strong>
            <span>EXECUTION</span>
            <strong>→</strong>
            <span>OUTCOME</span>
          </div>

          <div className="admissibilityActions">
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Applicability
            </Link>

            <Link
              href="/governance-library/assurance"
              className="secondaryAction"
            >
              Assurance
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
        .principlesPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f4fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(33, 154, 203, 0.18),
              transparent 36%
            ),
            radial-gradient(
              circle at 7% 44%,
              rgba(83, 225, 241, 0.06),
              transparent 26%
            ),
            radial-gradient(
              circle at 94% 74%,
              rgba(236, 180, 68, 0.06),
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
          mask-image: linear-gradient(to bottom, black, transparent 88%);
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
          max-width: 1160px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .definitionSeal,
        .admissibilitySeal {
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
        .definitionSeal span,
        .admissibilitySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .definitionSeal small,
        .admissibilitySeal small {
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
          max-width: 960px;
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

        .definitionSection {
          padding: 34px;
          display: grid;
          grid-template-columns: auto 1.15fr 0.85fr;
          align-items: center;
          gap: 30px;
          border: 1px solid rgba(255, 198, 82, 0.17);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 0 50%,
              rgba(255, 190, 59, 0.07),
              transparent 30%
            ),
            rgba(5, 18, 30, 0.78);
        }

        .definitionSeal {
          width: 82px;
          height: 82px;
          margin: 0;
        }

        .definitionSeal span {
          font-size: 23px;
        }

        .definitionSeal small {
          font-size: 6px;
        }

        .definitionSection h2 {
          margin: 10px 0 0;
          font-size: clamp(31px, 3.2vw, 48px);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .definitionSection > p {
          margin: 0;
          color: #9fb2bb;
          font-size: 14px;
          line-height: 1.75;
        }

        .controlSection {
          padding-top: 82px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .principleSequence h2,
        .admissibilitySection h2 {
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
            minmax(260px, 1fr)
            minmax(210px, 0.55fr)
            minmax(180px, 0.42fr)
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

        .principlesSection {
          padding-top: 27px;
        }

        .principlesGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .principleCard {
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

        .principleSeal {
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

        .principleNumber {
          color: #607985;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .principleMeta {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .principleMeta span,
        .principleMeta strong {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .principleMeta span {
          color: #70dce9;
        }

        .principleMeta strong {
          color: #b19a68;
          text-align: right;
        }

        .principleCard h2 {
          margin: 10px 0 0;
          color: #e6f0f3;
          font-size: 31px;
          line-height: 1.08;
        }

        .description {
          margin: 14px 0 0;
          color: #91a6b0;
          font-size: 13px;
          line-height: 1.65;
        }

        .questionBlock,
        .evidenceBlock,
        .relatedBlock,
        .boundaryBlock {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .questionBlock span,
        .evidenceBlock > span,
        .relatedBlock > span,
        .boundaryBlock span,
        .listHeading span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .questionBlock p {
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

        .obligationList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .obligationList div {
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.13);
        }

        .obligationList span {
          color: #6fdce9;
          font-size: 7px;
        }

        .obligationList strong {
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

        .evidenceGrid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
        }

        .evidenceGrid div {
          padding: 9px;
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.015);
        }

        .evidenceGrid span {
          width: 5px;
          height: 5px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #d7b462;
          box-shadow: 0 0 9px rgba(215, 180, 98, 0.45);
        }

        .evidenceGrid strong {
          color: #aebfc6;
          font-size: 8px;
          line-height: 1.35;
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

        .boundaryBlock strong {
          display: block;
          margin-top: 7px;
          color: #efd18d;
          font: 700 14px/1.45 Georgia, serif;
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

        .principleSequence {
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

        .principleSequence h2 {
          max-width: 1040px;
          margin-left: auto;
          margin-right: auto;
        }

        .sequenceTrack {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
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

        .admissibilitySection {
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

        .admissibilitySeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .admissibilitySeal span {
          font-size: 23px;
        }

        .admissibilitySeal small {
          font-size: 6px;
        }

        .admissibilitySection h2 {
          max-width: 1060px;
          margin: 14px auto 0;
        }

        .admissibilitySection > p:not(.eyebrow) {
          max-width: 1010px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .admissibilityGrid {
          max-width: 1160px;
          margin: 31px auto 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .admissibilityGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .admissibilityGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .admissibilityGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .governingChain {
          max-width: 1180px;
          margin: 26px auto 0;
          padding: 17px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.17);
        }

        .governingChain span {
          color: #acd3dc;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .governingChain strong {
          color: #dfb65c;
          font-size: 12px;
        }

        .admissibilityActions {
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

          .definitionSection {
            grid-template-columns: auto 1fr;
          }

          .definitionSection > p {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 980px) {
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

          .principlesGrid {
            grid-template-columns: 1fr;
          }

          .sequenceTrack {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .definitionSection,
          .filterPanel,
          .sequenceTrack,
          .admissibilityGrid {
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

          .definitionSeal {
            margin: auto;
          }

          .definitionSection {
            text-align: center;
          }

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .principleMeta {
            align-items: flex-start;
            flex-direction: column;
          }

          .principleMeta strong {
            text-align: left;
          }

          .evidenceGrid,
          .cardActions {
            grid-template-columns: 1fr;
          }

          .principleSequence,
          .admissibilitySection {
            padding: 30px 20px;
          }

          .admissibilityActions {
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
