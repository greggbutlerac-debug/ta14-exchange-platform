"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReviewStatus =
  | "Not Reviewed"
  | "Supported"
  | "Partial"
  | "Hold"
  | "Escalate";

type EvidenceSupport = "No Evidence" | "Some Evidence" | "Strong Evidence";

type ReviewItem = {
  id: string;
  article: string;
  title: string;
  obligation: string;
  plainLanguage: string;
  whyItMatters: string;
  commonMistake: string;
  evidenceNeeded: string[];
  defaultStatus: ReviewStatus;
};

type Finding = {
  status: ReviewStatus;
  evidenceSupport: EvidenceSupport;
  evidence: string;
  reviewer: string;
  authority: string;
  notes: string;
  boundary: string;
};

type EntityMetadata = {
  jurisdiction: string;
  entityVersion: string;
  modelVersion: string;
  documentationVersion: string;
  evidencePackageVersion: string;
  reviewVersion: string;
  evidenceCutoffDate: string;
};

const reviewItems: ReviewItem[] = [
  {
    id: "article-9",
    article: "Article 9",
    title: "Risk Management",
    obligation:
      "Establish, implement, document, and maintain a continuous risk-management system for the lifecycle of the high-risk AI system.",
    plainLanguage:
      "Show how risks are identified, tested, reduced, monitored, and reviewed from design through operation.",
    whyItMatters:
      "A risk policy alone does not show that risks are being continuously governed in the real system.",
    commonMistake:
      "Submitting a policy without dated risk records, mitigation evidence, or outcome verification.",
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
    plainLanguage:
      "Show where the data came from, why it was selected, how it changed, and which limitations remain.",
    whyItMatters:
      "Weak or untraceable data can make later testing and system claims impossible to verify.",
    commonMistake:
      "Listing datasets without provenance, version history, selection criteria, or known limitations.",
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
    plainLanguage:
      "Create a clear, versioned explanation of what the system is, what it is for, how it works, and how it changed.",
    whyItMatters:
      "A reviewer cannot test claims that are not connected to the exact system and version under review.",
    commonMistake:
      "Providing product descriptions instead of version-specific technical documentation.",
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
    plainLanguage:
      "Preserve enough event history to reconstruct what happened, which version acted, and what outcome followed.",
    whyItMatters:
      "Without reliable records, failures, drift, and disputed actions cannot be independently reconstructed.",
    commonMistake:
      "Keeping activity logs that are not linked to versions, decisions, outcomes, or preserved continuity.",
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
    plainLanguage:
      "Tell users what the system can do, what it cannot do, how to use it, and when not to rely on it.",
    whyItMatters:
      "A capable system can still create harm when its limits and required operating conditions are unclear.",
    commonMistake:
      "Providing broad disclaimers without role-specific instructions, limitations, and prohibited uses.",
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
    plainLanguage:
      "Identify who can supervise the system, what they can do, and how intervention is preserved in the record.",
    whyItMatters:
      "Human oversight is not meaningful when the reviewer lacks authority, context, or a usable intervention path.",
    commonMistake:
      "Naming a human reviewer without showing authority, training, intervention controls, or review history.",
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
    plainLanguage:
      "Define measurable performance limits, test them, preserve failures, and protect the system against misuse and attack.",
    whyItMatters:
      "A one-time benchmark does not establish that performance and security remain acceptable in operation.",
    commonMistake:
      "Submitting headline accuracy claims without thresholds, test conditions, failure records, or security evidence.",
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
    plainLanguage:
      "Show who owns each quality responsibility and how testing, problems, corrections, and records are managed.",
    whyItMatters:
      "Quality claims are weak when responsibilities and corrective actions cannot be traced over time.",
    commonMistake:
      "Providing procedures without proof of ownership, use, corrective action, or governance history.",
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
    plainLanguage:
      "Show that the deployed system is being used in the declared context, by authorized people, with active monitoring.",
    whyItMatters:
      "A compliant design can still become unsafe or unsupported through poor deployment and use.",
    commonMistake:
      "Relying on provider documentation without preserving the actual deployment context and monitoring history.",
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
    plainLanguage:
      "Identify who may be affected, which rights may be influenced, and what mitigations are required before use.",
    whyItMatters:
      "Consequences to people must be examined before deployment, not reconstructed only after harm occurs.",
    commonMistake:
      "Treating a general risk assessment as a substitute for an affected-party and rights-specific assessment.",
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
    plainLanguage:
      "Show when people are informed about AI interaction or generated content and how required marking is applied.",
    whyItMatters:
      "Transparency must be visible, timely, accessible, and connected to the actual output or interaction.",
    commonMistake:
      "Using a general website notice instead of preserving output-specific disclosure or marking evidence.",
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
    plainLanguage:
      "Continuously compare operational evidence with the declared baseline, thresholds, and expected outcomes.",
    whyItMatters:
      "Approval at one moment does not prove that the system remains admissible as reality changes.",
    commonMistake:
      "Collecting metrics without a baseline, drift interpretation, corrective action, or post-intervention record.",
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
    plainLanguage:
      "Preserve what happened, when it happened, who was affected, what was reported, and what changed afterward.",
    whyItMatters:
      "Incomplete incident chronology can weaken reporting, correction, accountability, and later review.",
    commonMistake:
      "Recording the incident without connecting it to the affected route, notification, and corrective action.",
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

const evidenceSupportOptions: EvidenceSupport[] = [
  "No Evidence",
  "Some Evidence",
  "Strong Evidence",
];

const authorityOptions = [
  "Internal Review",
  "Independent Review",
  "Legal Review",
  "Competent Authority",
  "Market Surveillance",
  "Notified Body",
  "Other",
];

const workflowSteps = [
  ["1", "Declare entity", "Name the exact system, organization, route, or deployment."],
  ["2", "Confirm scope", "Record role, jurisdiction, versions, and evidence cutoff date."],
  ["3", "Open an article", "Read the requirement in plain language before reviewing."],
  ["4", "Connect evidence", "Mark expected records and add exact record references."],
  ["5", "Record finding", "Choose evidence support, status, authority, and reviewer."],
  ["6", "Preserve boundary", "State what is supported and what remains unresolved."],
  ["7", "Finish review", "Inspect missing evidence and generate the bounded review summary."],
];

function makeInitialFindings(): Record<string, Finding> {
  return Object.fromEntries(
    reviewItems.map((item) => [
      item.id,
      {
        status: item.defaultStatus,
        evidenceSupport: "No Evidence",
        evidence: "",
        reviewer: "",
        authority: "Internal Review",
        notes: "",
        boundary: "",
      },
    ]),
  );
}

function makeInitialEvidenceChecks(): Record<string, string[]> {
  return Object.fromEntries(reviewItems.map((item) => [item.id, []]));
}

export default function EuAiActEntityReviewPage() {
  const [entityName, setEntityName] = useState("");
  const [entityType, setEntityType] = useState("AI System");
  const [systemRole, setSystemRole] = useState("Provider");
  const [reviewQuestion, setReviewQuestion] = useState(
    "Does the submitted entity demonstrate evidence support for the declared EU AI Act obligations?",
  );
  const [metadata, setMetadata] = useState<EntityMetadata>({
    jurisdiction: "European Union",
    entityVersion: "",
    modelVersion: "",
    documentationVersion: "",
    evidencePackageVersion: "",
    reviewVersion: "1.0",
    evidenceCutoffDate: "",
  });
  const [findings, setFindings] = useState<Record<string, Finding>>(
    makeInitialFindings,
  );
  const [evidenceChecks, setEvidenceChecks] = useState<Record<string, string[]>>(
    makeInitialEvidenceChecks,
  );
  const [expanded, setExpanded] = useState<string | null>("article-9");
  const [filter, setFilter] = useState<"All" | ReviewStatus>("All");
  const [showGuide, setShowGuide] = useState(true);
  const [showReport, setShowReport] = useState(false);

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

  const reviewedCount = reviewItems.length - counts["Not Reviewed"];
  const reviewProgress = Math.round((reviewedCount / reviewItems.length) * 100);
  const evidenceConnectedCount = Object.values(evidenceChecks).filter(
    (items) => items.length > 0,
  ).length;
  const findingsWrittenCount = Object.values(findings).filter(
    (finding) => finding.notes.trim().length > 0,
  ).length;
  const boundariesWrittenCount = Object.values(findings).filter(
    (finding) => finding.boundary.trim().length > 0,
  ).length;

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

  const reportId = useMemo(() => {
    const safeEntity = (entityName || "UNDECLARED")
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 20);
    return `TA14-EUAI-${safeEntity || "ENTITY"}-${metadata.reviewVersion.replace(/[^0-9A-Za-z]+/g, "-")}`;
  }, [entityName, metadata.reviewVersion]);

  const updateFinding = (id: string, patch: Partial<Finding>) => {
    setFindings((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch,
      },
    }));
  };

  const updateMetadata = (patch: Partial<EntityMetadata>) => {
    setMetadata((current) => ({ ...current, ...patch }));
  };

  const toggleEvidence = (id: string, evidence: string) => {
    setEvidenceChecks((current) => {
      const selected = current[id] ?? [];
      return {
        ...current,
        [id]: selected.includes(evidence)
          ? selected.filter((item) => item !== evidence)
          : [...selected, evidence],
      };
    });
  };

  const markArticleComplete = (id: string) => {
    const finding = findings[id];
    if (finding.status === "Not Reviewed") {
      updateFinding(id, {
        status:
          finding.evidenceSupport === "Strong Evidence"
            ? "Supported"
            : finding.evidenceSupport === "Some Evidence"
              ? "Partial"
              : "Hold",
      });
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />
      <div className="orbit orbitOne"><span /></div>
      <div className="orbit orbitTwo"><span /></div>

      <header className="topbar shell">
        <Link href="/workspace/entity-review" className="brand ctaLink">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Entity Review</strong>
            <small>Guided Evidence Review Workspace</small>
          </span>
        </Link>

        <nav aria-label="Entity review navigation">
          <Link className="navButton" href="/">Home</Link>
          <Link className="navButton" href="/workspace/ai-governance/eu-ai-act">Requirements</Link>
          <Link className="navButton" href="/workspace/governed-records/eu-ai-act">Records</Link>
          <Link className="navButton navButtonActive" href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">EU AI ACT ENTITY REVIEW</p>
          <h1>Review the evidence behind the claim.</h1>
          <p className="lead">
            Follow one clear path from entity declaration to bounded review. Every
            article explains what to inspect, which records are expected, what is
            missing, and what the current evidence can actually support.
          </p>

          <div className="heroActions">
            <button className="primaryButton" type="button" onClick={() => scrollTo("how-it-works")}>
              Start Guided Review <span>→</span>
            </button>
            <button className="secondaryButton" type="button" onClick={() => scrollTo("requirement-review")}>
              Open Requirements <span>→</span>
            </button>
          </div>
        </div>

        <div className="outcomePanel">
          <span className="panelLabel">CURRENT REVIEW OUTCOME</span>
          <strong className={`outcome ${reviewOutcome.toLowerCase().replace(" ", "-")}`}>
            {reviewOutcome}
          </strong>
          <p>{reviewedCount} of {reviewItems.length} requirements reviewed</p>
          <div className="progressTrack" aria-label={`${reviewProgress}% complete`}>
            <span style={{ width: `${reviewProgress}%` }} />
          </div>
          <small>{reviewProgress}% of requirement findings recorded</small>
        </div>
      </section>

      <section className="guide shell" id="how-it-works">
        <div className="sectionHeading compactHeading">
          <div>
            <p className="eyebrow">HOW TO USE THIS REVIEW</p>
            <h2>Seven small steps. One bounded result.</h2>
          </div>
          <button className="miniButton" type="button" onClick={() => setShowGuide((current) => !current)}>
            {showGuide ? "Hide Guide" : "Show Guide"}
          </button>
        </div>

        {showGuide && (
          <>
            <div className="processDiagram" aria-label="Seven-step entity review process">
              {workflowSteps.map(([number, title], index) => (
                <div className="processNode" key={number}>
                  <span className="stepNumber">{number}</span>
                  <strong>{title}</strong>
                  {index < workflowSteps.length - 1 && <span className="processArrow">→</span>}
                </div>
              ))}
            </div>

            <div className="stepGrid">
              {workflowSteps.map(([number, title, description]) => (
                <article key={number}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="entityForm shell" id="entity-declaration">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">STEPS 1 AND 2</p>
            <h2>Declare the entity and freeze the review scope.</h2>
            <p className="sectionCopy">
              Record the exact entity, role, versions, jurisdiction, and evidence cutoff date before reviewing any article.
            </p>
          </div>
          <span className={`completionBadge ${entityName.trim() ? "complete" : ""}`}>
            {entityName.trim() ? "Entity Declared" : "Entity Needed"}
          </span>
        </div>

        <div className="formGrid">
          <label>
            <span>Entity name</span>
            <input value={entityName} onChange={(event) => setEntityName(event.target.value)} placeholder="Organization, system, architecture, or route" />
          </label>

          <label>
            <span>Entity type</span>
            <select value={entityType} onChange={(event) => setEntityType(event.target.value)}>
              <option>AI System</option>
              <option>Organization</option>
              <option>Governance Architecture</option>
              <option>Consequential Route</option>
              <option>Deployment</option>
            </select>
          </label>

          <label>
            <span>Declared role</span>
            <select value={systemRole} onChange={(event) => setSystemRole(event.target.value)}>
              <option>Provider</option>
              <option>Deployer</option>
              <option>Importer</option>
              <option>Distributor</option>
              <option>Product Manufacturer</option>
              <option>Authorized Representative</option>
              <option>Multiple Roles</option>
            </select>
          </label>

          <label>
            <span>Jurisdiction</span>
            <input value={metadata.jurisdiction} onChange={(event) => updateMetadata({ jurisdiction: event.target.value })} placeholder="European Union" />
          </label>

          <label>
            <span>Entity version</span>
            <input value={metadata.entityVersion} onChange={(event) => updateMetadata({ entityVersion: event.target.value })} placeholder="Example: 2.3" />
          </label>

          <label>
            <span>Model version</span>
            <input value={metadata.modelVersion} onChange={(event) => updateMetadata({ modelVersion: event.target.value })} placeholder="Model or release identifier" />
          </label>

          <label>
            <span>Documentation version</span>
            <input value={metadata.documentationVersion} onChange={(event) => updateMetadata({ documentationVersion: event.target.value })} placeholder="Example: DOC-4.1" />
          </label>

          <label>
            <span>Evidence package version</span>
            <input value={metadata.evidencePackageVersion} onChange={(event) => updateMetadata({ evidencePackageVersion: event.target.value })} placeholder="Example: EVID-1.0" />
          </label>

          <label>
            <span>Review version</span>
            <input value={metadata.reviewVersion} onChange={(event) => updateMetadata({ reviewVersion: event.target.value })} placeholder="1.0" />
          </label>

          <label>
            <span>Evidence cutoff date</span>
            <input type="date" value={metadata.evidenceCutoffDate} onChange={(event) => updateMetadata({ evidenceCutoffDate: event.target.value })} />
          </label>

          <label className="wide">
            <span>Review question</span>
            <textarea value={reviewQuestion} onChange={(event) => setReviewQuestion(event.target.value)} rows={4} />
          </label>
        </div>

        <div className="formActions">
          <button className="primaryButton" type="button" onClick={() => scrollTo("requirement-review")}>Continue to Article Review <span>→</span></button>
          <Link className="secondaryButton ctaLink" href="/workspace/ai-governance/eu-ai-act">Review EU AI Act Requirements <span>→</span></Link>
        </div>
      </section>

      <section className="progressSection shell">
        <div className="progressHeader">
          <div>
            <p className="eyebrow">REVIEW PROGRESS</p>
            <h2>See exactly what remains.</h2>
          </div>
          <strong>{reviewProgress}%</strong>
        </div>

        <div className="largeProgressTrack"><span style={{ width: `${reviewProgress}%` }} /></div>

        <div className="progressCards">
          <article><span>{entityName.trim() ? "✓" : "1"}</span><strong>Entity</strong><small>{entityName.trim() ? "Declared" : "Not declared"}</small></article>
          <article><span>{evidenceConnectedCount}</span><strong>Evidence</strong><small>Articles with records selected</small></article>
          <article><span>{reviewedCount}</span><strong>Reviewed</strong><small>of {reviewItems.length} requirements</small></article>
          <article><span>{findingsWrittenCount}</span><strong>Findings</strong><small>Bounded findings written</small></article>
          <article><span>{boundariesWrittenCount}</span><strong>Boundaries</strong><small>Limits explicitly preserved</small></article>
        </div>

        <div className="statusSummary">
          <button type="button" onClick={() => setFilter("Supported")}><span>{counts.Supported}</span><strong>Supported</strong></button>
          <button type="button" onClick={() => setFilter("Partial")}><span>{counts.Partial}</span><strong>Partial</strong></button>
          <button type="button" onClick={() => setFilter("Hold")}><span>{counts.Hold}</span><strong>Hold</strong></button>
          <button type="button" onClick={() => setFilter("Escalate")}><span>{counts.Escalate}</span><strong>Escalate</strong></button>
          <button type="button" onClick={() => setFilter("Not Reviewed")}><span>{counts["Not Reviewed"]}</span><strong>Remaining</strong></button>
        </div>
      </section>

      <section className="reviewSection shell" id="requirement-review">
        <div className="reviewHeader">
          <div>
            <p className="eyebrow">STEPS 3 THROUGH 6</p>
            <h2>Review one requirement at a time.</h2>
            <p>
              Open an article, read the plain-language explanation, select the evidence that exists, record the finding, and preserve the boundary.
            </p>
          </div>

          <div className="filterGroup" aria-label="Filter requirement findings">
            {(["All", ...statusOptions] as const).map((status) => (
              <button type="button" key={status} onClick={() => setFilter(status)} className={filter === status ? "active" : ""}>
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="reviewList">
          {filteredItems.map((item) => {
            const finding = findings[item.id];
            const selectedEvidence = evidenceChecks[item.id] ?? [];
            const isOpen = expanded === item.id;
            const missingEvidence = item.evidenceNeeded.filter((evidence) => !selectedEvidence.includes(evidence));
            const articleComplete = finding.status !== "Not Reviewed" && finding.notes.trim() && finding.boundary.trim();

            return (
              <article className={`reviewItem ${isOpen ? "open" : ""}`} key={item.id}>
                <button type="button" className="reviewItemHeader" onClick={() => setExpanded(isOpen ? null : item.id)}>
                  <div className="articleBadge">{item.article}</div>
                  <div className="titleBlock">
                    <div className="pillRow">
                      <span className={`statusPill ${finding.status.toLowerCase().replace(" ", "-")}`}>{finding.status}</span>
                      <span className={`evidencePill ${finding.evidenceSupport.toLowerCase().replaceAll(" ", "-")}`}>{finding.evidenceSupport}</span>
                      {articleComplete && <span className="completePill">Review Complete</span>}
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.plainLanguage}</p>
                  </div>
                  <span className="expandButton">{isOpen ? "Close" : "Open"}</span>
                </button>

                {isOpen && (
                  <div className="reviewBody">
                    <div className="articleGuide">
                      <article>
                        <span className="guideIcon">1</span>
                        <div><strong>What this requires</strong><p>{item.obligation}</p></div>
                      </article>
                      <article>
                        <span className="guideIcon">2</span>
                        <div><strong>Why it matters</strong><p>{item.whyItMatters}</p></div>
                      </article>
                      <article>
                        <span className="guideIcon">3</span>
                        <div><strong>Common mistake</strong><p>{item.commonMistake}</p></div>
                      </article>
                    </div>

                    <div className="evidenceWorkspace">
                      <div className="workspaceHeading">
                        <div><span className="detailLabel">EXPECTED EVIDENCE</span><h4>Select the records currently available.</h4></div>
                        <span className="recordCount">{selectedEvidence.length} of {item.evidenceNeeded.length} selected</span>
                      </div>

                      <div className="evidenceChecklist">
                        {item.evidenceNeeded.map((evidence) => {
                          const checked = selectedEvidence.includes(evidence);
                          return (
                            <button type="button" className={checked ? "selected" : ""} key={evidence} onClick={() => toggleEvidence(item.id, evidence)}>
                              <span>{checked ? "✓" : "+"}</span><strong>{evidence}</strong>
                            </button>
                          );
                        })}
                      </div>

                      <div className="missingEvidence">
                        <strong>Missing evidence</strong>
                        <p>{missingEvidence.length ? missingEvidence.join(" • ") : "No expected record category is currently marked missing."}</p>
                      </div>

                      <div className="recordActions">
                        <Link className="actionButton ctaLink" href={`/workspace/governed-records/builder?article=${encodeURIComponent(item.article)}&entity=${encodeURIComponent(entityName)}`}>Create Record <span>→</span></Link>
                        <Link className="actionButton ctaLink" href={`/workspace/governed-records/eu-ai-act?article=${encodeURIComponent(item.article)}`}>View Requirements <span>→</span></Link>
                        <Link className="actionButton ctaLink" href={`/workspace/governed-records/interpreter?article=${encodeURIComponent(item.article)}`}>Interpret Record <span>→</span></Link>
                      </div>
                    </div>

                    <div className="findingGrid">
                      <label>
                        <span>Evidence support</span>
                        <select value={finding.evidenceSupport} onChange={(event) => updateFinding(item.id, { evidenceSupport: event.target.value as EvidenceSupport })}>
                          {evidenceSupportOptions.map((option) => <option key={option}>{option}</option>)}
                        </select>
                      </label>

                      <label>
                        <span>Review status</span>
                        <select value={finding.status} onChange={(event) => updateFinding(item.id, { status: event.target.value as ReviewStatus })}>
                          {statusOptions.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </label>

                      <label>
                        <span>Review authority</span>
                        <select value={finding.authority} onChange={(event) => updateFinding(item.id, { authority: event.target.value })}>
                          {authorityOptions.map((authority) => <option key={authority}>{authority}</option>)}
                        </select>
                      </label>

                      <label>
                        <span>Reviewer identity</span>
                        <input value={finding.reviewer} onChange={(event) => updateFinding(item.id, { reviewer: event.target.value })} placeholder="Named reviewer" />
                      </label>

                      <label className="wide">
                        <span>Evidence references</span>
                        <textarea rows={4} value={finding.evidence} onChange={(event) => updateFinding(item.id, { evidence: event.target.value })} placeholder="Record IDs, document versions, log references, links, or unresolved evidence gaps" />
                      </label>

                      <label className="wide">
                        <span>Bounded finding</span>
                        <textarea rows={5} value={finding.notes} onChange={(event) => updateFinding(item.id, { notes: event.target.value })} placeholder="State what the submitted evidence supports and what remains unresolved." />
                      </label>

                      <label className="wide">
                        <span>Finding boundary</span>
                        <textarea rows={4} value={finding.boundary} onChange={(event) => updateFinding(item.id, { boundary: event.target.value })} placeholder="State what this review does not establish, which assumptions remain, and which authority is outside scope." />
                      </label>
                    </div>

                    <div className="articleCompletion">
                      <div>
                        <strong>Article completion check</strong>
                        <span>{selectedEvidence.length > 0 ? "✓ Evidence selected" : "○ Evidence still needed"}</span>
                        <span>{finding.notes.trim() ? "✓ Finding written" : "○ Finding still needed"}</span>
                        <span>{finding.boundary.trim() ? "✓ Boundary preserved" : "○ Boundary still needed"}</span>
                      </div>
                      <button className="primaryButton" type="button" onClick={() => markArticleComplete(item.id)}>Mark Article Reviewed <span>→</span></button>
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
          <p className="eyebrow">CURRENT DETERMINATION</p>
          <h2>{reviewOutcome}</h2>
          <p>
            This outcome reflects only the current requirement findings, declared scope, selected evidence, reviewer authority, and evidence cutoff date.
          </p>
        </div>

        <div className="determinationFacts">
          <span><strong>Entity</strong>{entityName || "Not declared"}</span>
          <span><strong>Type</strong>{entityType}</span>
          <span><strong>Role</strong>{systemRole}</span>
          <span><strong>Reviewed</strong>{reviewedCount} / {reviewItems.length}</span>
          <span><strong>Evidence cutoff</strong>{metadata.evidenceCutoffDate || "Not declared"}</span>
          <span><strong>Review ID</strong>{reportId}</span>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">REVIEW BOUNDARY</p>
          <h2>Evidence support is not legal certification.</h2>
        </div>
        <div>
          <p>
            This workspace preserves the entity, scope, versions, obligation, selected evidence, reviewer, authority, status, finding, and boundary. It does not issue conformity assessment, market authorization, regulatory approval, or legal advice.
          </p>
          <div className="boundaryButtons">
            <Link className="secondaryButton ctaLink" href="/workspace/governed-records/eu-ai-act">Open Record Requirements <span>→</span></Link>
            <Link className="secondaryButton ctaLink" href="/workspace/verification">Open Verification <span>→</span></Link>
          </div>
        </div>
      </section>

      <section className="finalCta shell" id="final-review">
        <div>
          <p className="eyebrow">STEP 7</p>
          <h2>Generate the bounded review summary.</h2>
          <p>
            Inspect the current entity, scope, evidence coverage, findings, holds, escalations, and unresolved requirements in one readable review panel.
          </p>
        </div>
        <button className="primaryButton largeButton" type="button" onClick={() => setShowReport((current) => !current)}>
          {showReport ? "Hide Review Summary" : "Generate Review Summary"} <span>→</span>
        </button>
      </section>

      {showReport && (
        <section className="report shell" aria-live="polite">
          <div className="reportHeader">
            <div>
              <p className="eyebrow">EU AI ACT EVIDENCE REVIEW</p>
              <h2>{entityName || "Undeclared Entity"}</h2>
              <p>{reviewQuestion}</p>
            </div>
            <span className={`reportOutcome ${reviewOutcome.toLowerCase().replace(" ", "-")}`}>{reviewOutcome}</span>
          </div>

          <div className="reportGrid">
            <article><strong>Review ID</strong><span>{reportId}</span></article>
            <article><strong>Entity type</strong><span>{entityType}</span></article>
            <article><strong>Declared role</strong><span>{systemRole}</span></article>
            <article><strong>Jurisdiction</strong><span>{metadata.jurisdiction || "Not declared"}</span></article>
            <article><strong>Entity version</strong><span>{metadata.entityVersion || "Not declared"}</span></article>
            <article><strong>Model version</strong><span>{metadata.modelVersion || "Not declared"}</span></article>
            <article><strong>Documentation</strong><span>{metadata.documentationVersion || "Not declared"}</span></article>
            <article><strong>Evidence package</strong><span>{metadata.evidencePackageVersion || "Not declared"}</span></article>
            <article><strong>Review version</strong><span>{metadata.reviewVersion || "Not declared"}</span></article>
            <article><strong>Evidence cutoff</strong><span>{metadata.evidenceCutoffDate || "Not declared"}</span></article>
            <article><strong>Articles reviewed</strong><span>{reviewedCount} of {reviewItems.length}</span></article>
            <article><strong>Evidence connected</strong><span>{evidenceConnectedCount} article workspaces</span></article>
          </div>

          <div className="reportStatusGrid">
            <span><strong>{counts.Supported}</strong>Supported</span>
            <span><strong>{counts.Partial}</strong>Partial</span>
            <span><strong>{counts.Hold}</strong>Hold</span>
            <span><strong>{counts.Escalate}</strong>Escalate</span>
            <span><strong>{counts["Not Reviewed"]}</strong>Not reviewed</span>
          </div>

          <div className="reportArticles">
            {reviewItems.map((item) => {
              const finding = findings[item.id];
              return (
                <article key={item.id}>
                  <div><span>{item.article}</span><strong>{item.title}</strong></div>
                  <span className={`statusPill ${finding.status.toLowerCase().replace(" ", "-")}`}>{finding.status}</span>
                  <p><strong>Evidence:</strong> {finding.evidence || "No evidence references recorded."}</p>
                  <p><strong>Finding:</strong> {finding.notes || "No bounded finding recorded."}</p>
                  <p><strong>Boundary:</strong> {finding.boundary || "No explicit boundary recorded."}</p>
                </article>
              );
            })}
          </div>

          <div className="reportBoundary">
            <strong>Formal boundary</strong>
            <p>
              This evidence review is a bounded governance record. It does not constitute legal advice, certification, conformity assessment, market authorization, or a determination by a regulator, notified body, competent authority, or market-surveillance authority.
            </p>
          </div>

          <div className="reportActions">
            <button className="primaryButton" type="button" onClick={() => window.print()}>Print Review Summary <span>→</span></button>
            <Link className="secondaryButton ctaLink" href="/workspace/governed-records/eu-ai-act">Complete Missing Records <span>→</span></Link>
          </div>
        </section>
      )}

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <div className="footerActions">
          <Link className="footerButton" href="/workspace/entity-review">Entity Review Home</Link>
          <Link className="footerButton" href="/workspace">Return to Workspace</Link>
        </div>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { background: #090a0d; scroll-behavior: smooth; }
        :global(body) {
          margin: 0;
          color: #fffaf0;
          background:
            radial-gradient(circle at 12% 8%, rgba(255, 177, 30, 0.13), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(202, 118, 22, 0.11), transparent 28%),
            linear-gradient(180deg, #090a0d 0%, #11100f 50%, #08090d 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        :global(a) { text-decoration: none !important; }
        :global(button), :global(input), :global(select), :global(textarea) { font: inherit; }
        main { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; }
        .shell { width: min(1260px, calc(100% - 36px)); margin-inline: auto; position: relative; z-index: 2; }
        .stars { position: fixed; inset: -12%; pointer-events: none; z-index: -4; opacity: .34; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.4px); background-size: 92px 92px; animation: starDrift 34s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle, rgba(255,183,48,.6) 0 1px, transparent 1.4px); background-size: 156px 156px; background-position: 39px 58px; animation: starDrift 48s linear infinite reverse; }
        .glow { position: fixed; width: 470px; height: 470px; border-radius: 999px; filter: blur(120px); opacity: .11; z-index: -3; animation: glowMove 14s ease-in-out infinite alternate; }
        .glowOne { left: -170px; top: -180px; background: #ffb31e; }
        .glowTwo { right: -180px; top: 44%; background: #ca6f18; animation-delay: -6s; }
        .orbit { position: fixed; width: 480px; height: 480px; border: 1px solid rgba(255, 188, 63, .09); border-radius: 50%; z-index: -2; pointer-events: none; animation: orbitSpin 32s linear infinite; }
        .orbit span { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #ffc55d; box-shadow: 0 0 22px rgba(255, 190, 71, .85); top: 50%; left: -5px; }
        .orbitOne { right: -250px; top: 180px; }
        .orbitTwo { left: -300px; bottom: 160px; width: 620px; height: 620px; animation-direction: reverse; animation-duration: 42s; }
        .topbar { min-height: 88px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(190,160,112,.17); }
        .brand { display: flex; align-items: center; gap: 12px; color: white; border: 1px solid transparent; border-radius: 16px; padding: 8px 10px; transition: 180ms ease; }
        .brand:hover { border-color: rgba(255,184,42,.22); background: rgba(255,255,255,.025); }
        .brandMark { min-width: 64px; height: 38px; border-radius: 999px; display: grid; place-items: center; color: #1a1003; background: linear-gradient(135deg,#ffb31f,#ffe7a8); font-size: 13px; font-weight: 900; letter-spacing: .05em; }
        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand small { color: #958a78; margin-top: 2px; }
        nav { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
        .navButton, .footerButton { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 999px; border: 1px solid rgba(180,148,101,.16); color: #c8bcaa; background: rgba(255,255,255,.025); font-size: 13px; font-weight: 800; transition: 180ms ease; }
        .navButton:hover, .footerButton:hover, .navButtonActive { color: #fff2d6; border-color: rgba(255,184,42,.42); background: rgba(169,102,17,.12); transform: translateY(-1px); }
        .hero { min-height: 560px; display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; align-items: center; padding: 72px 0 52px; }
        .eyebrow { margin: 0; color: #ffb421; font-size: 11px; font-weight: 900; letter-spacing: .18em; }
        h1 { max-width: 860px; margin: 18px 0 22px; font-size: clamp(48px,7vw,88px); line-height: .98; letter-spacing: -.06em; }
        h2 { margin: 14px 0 16px; font-size: clamp(32px,5vw,56px); line-height: 1.04; letter-spacing: -.045em; }
        .lead, .sectionCopy, .reviewHeader p, .determination p, .boundary p, .finalCta p, .reportHeader p { color: #b5aa9b; font-size: 17px; line-height: 1.68; }
        .heroActions, .formActions, .boundaryButtons, .reportActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .primaryButton, .secondaryButton, .miniButton, .actionButton, .largeButton { border: 1px solid rgba(255,184,42,.26); border-radius: 14px; min-height: 48px; padding: 0 18px; display: inline-flex; align-items: center; justify-content: center; gap: 18px; cursor: pointer; font-weight: 900; transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease; }
        .primaryButton { color: #1b1002; background: linear-gradient(135deg,#ffb51f,#ffe6a4); box-shadow: 0 14px 38px rgba(255,174,28,.16); }
        .secondaryButton, .actionButton, .miniButton { color: #ffd786; background: rgba(165,98,16,.07); }
        .primaryButton:hover, .secondaryButton:hover, .actionButton:hover, .miniButton:hover { transform: translateY(-2px); border-color: rgba(255,201,94,.62); box-shadow: 0 18px 38px rgba(0,0,0,.24); }
        .outcomePanel { min-height: 292px; padding: 34px; border-radius: 28px; border: 1px solid rgba(255,186,48,.24); background: radial-gradient(circle at 50% 30%,rgba(255,177,27,.11),transparent 46%),linear-gradient(180deg,rgba(30,23,14,.94),rgba(13,11,9,.98)); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; box-shadow: 0 28px 70px rgba(0,0,0,.28); }
        .panelLabel { color: #b9965b; font-size: 11px; font-weight: 900; letter-spacing: .16em; }
        .outcome { margin-top: 18px; font-size: clamp(38px,6vw,68px); letter-spacing: -.05em; }
        .outcome.supported, .reportOutcome.supported { color:#79e3b5; } .outcome.partial, .reportOutcome.partial { color:#ffd16a; } .outcome.hold, .reportOutcome.hold { color:#ff9f63; } .outcome.escalate, .reportOutcome.escalate { color:#c2a3ff; } .outcome.not-started, .reportOutcome.not-started { color:#a99d8d; }
        .outcomePanel p { margin: 12px 0 16px; color:#9c9182; }
        .progressTrack, .largeProgressTrack { width: 100%; overflow: hidden; border-radius: 999px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,184,42,.1); }
        .progressTrack { height: 10px; }
        .largeProgressTrack { height: 14px; margin: 24px 0; }
        .progressTrack span, .largeProgressTrack span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#e48c13,#ffe69c); transition: width 300ms ease; }
        .outcomePanel small { color:#a99d8d; margin-top: 10px; }
        .guide, .entityForm, .progressSection, .reviewSection, .determination, .boundary, .finalCta, .report { border: 1px solid rgba(181,148,96,.17); background: linear-gradient(180deg,rgba(24,20,15,.91),rgba(12,11,10,.96)); border-radius: 26px; box-shadow: 0 22px 70px rgba(0,0,0,.24); }
        .guide, .entityForm, .progressSection, .reviewSection, .determination, .boundary, .report { padding: 42px; margin-bottom: 24px; }
        .sectionHeading, .progressHeader, .reportHeader { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
        .compactHeading { align-items: center; }
        .processDiagram { display: grid; grid-template-columns: repeat(7,minmax(0,1fr)); gap: 12px; align-items: stretch; margin-top: 28px; }
        .processNode { min-height: 112px; position: relative; display: grid; place-items: center; text-align: center; gap: 8px; padding: 16px 10px; border-radius: 18px; border: 1px solid rgba(255,184,42,.18); background: rgba(165,99,17,.05); }
        .stepNumber { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; color: #1a1003; background: linear-gradient(135deg,#ffb31f,#ffe7a8); font-weight: 900; }
        .processNode strong { font-size: 13px; color:#f2e4cf; }
        .processArrow { position: absolute; right: -19px; color:#d69a34; font-size: 20px; z-index: 3; }
        .stepGrid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; margin-top: 18px; }
        .stepGrid article { display: grid; grid-template-columns: 42px 1fr; gap: 14px; padding: 16px; border-radius: 16px; border: 1px solid rgba(180,148,101,.13); background: rgba(255,255,255,.02); }
        .stepGrid article > span { width: 38px; height: 38px; display:grid; place-items:center; border-radius:12px; color:#ffc458; background:rgba(165,98,16,.08); border:1px solid rgba(255,184,42,.2); font-weight:900; }
        .stepGrid strong { color:#f1e4d1; }
        .stepGrid p { margin:5px 0 0; color:#9f9384; line-height:1.5; font-size:13px; }
        .completionBadge { min-height: 38px; display:inline-flex; align-items:center; padding:0 14px; border-radius:999px; border:1px solid rgba(180,164,144,.18); color:#b4a897; background:rgba(134,118,98,.08); font-size:12px; font-weight:900; }
        .completionBadge.complete { color:#91efc8; border-color:rgba(89,216,158,.22); background:rgba(65,193,137,.1); }
        .formGrid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-top:28px; }
        label { display:grid; gap:9px; }
        label span { color:#c9bba9; font-size:12px; font-weight:800; }
        .wide { grid-column:1/-1; }
        input, select, textarea { width:100%; border-radius:13px; border:1px solid rgba(180,149,103,.2); background:rgba(8,8,7,.84); color:#fff8ec; outline:none; }
        input, select { min-height:50px; padding:0 14px; }
        textarea { padding:14px; resize:vertical; }
        input:focus, select:focus, textarea:focus { border-color:rgba(255,183,43,.54); box-shadow:0 0 0 3px rgba(255,180,34,.07); }
        .progressHeader strong { color:#ffbd3e; font-size:clamp(42px,6vw,76px); letter-spacing:-.05em; }
        .progressCards { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; }
        .progressCards article { min-height:132px; display:flex; flex-direction:column; justify-content:center; padding:20px; border-radius:18px; border:1px solid rgba(179,145,95,.16); background:rgba(20,17,13,.8); }
        .progressCards span { color:#ffbd3d; font-size:32px; font-weight:900; }
        .progressCards strong { margin-top:7px; color:#eadcc8; }
        .progressCards small { margin-top:6px; color:#948878; line-height:1.4; }
        .statusSummary { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; margin-top:12px; }
        .statusSummary button { min-height:86px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; padding:16px; border-radius:16px; border:1px solid rgba(180,148,101,.14); background:rgba(255,255,255,.02); color:#d8c9b6; cursor:pointer; transition:160ms ease; }
        .statusSummary button:hover { transform:translateY(-2px); border-color:rgba(255,184,42,.36); }
        .statusSummary span { color:#ffbd3e; font-size:24px; font-weight:900; }
        .statusSummary strong { margin-top:4px; font-size:12px; }
        .reviewHeader { display:grid; grid-template-columns:1fr .8fr; gap:34px; align-items:end; }
        .filterGroup { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; }
        .filterGroup button { min-height:38px; padding:0 12px; border-radius:999px; border:1px solid rgba(180,148,101,.17); background:rgba(255,255,255,.025); color:#b7aa98; cursor:pointer; font-weight:800; }
        .filterGroup button.active, .filterGroup button:hover { border-color:rgba(255,184,42,.46); background:rgba(169,102,17,.12); color:#fff1d4; }
        .reviewList { display:grid; gap:12px; margin-top:30px; }
        .reviewItem { overflow:hidden; border-radius:18px; border:1px solid rgba(179,145,95,.16); background:rgba(15,13,10,.88); }
        .reviewItem.open { border-color:rgba(255,181,34,.42); box-shadow:0 20px 46px rgba(0,0,0,.22); }
        .reviewItemHeader { width:100%; min-height:122px; display:grid; grid-template-columns:112px 1fr 94px; gap:20px; align-items:center; padding:20px; border:0; background:transparent; color:inherit; text-align:left; cursor:pointer; }
        .articleBadge { min-height:58px; display:grid; place-items:center; border-radius:14px; border:1px solid rgba(255,184,44,.28); background:rgba(167,99,16,.08); color:#ffc65d; font-size:15px; font-weight:900; }
        .pillRow { display:flex; flex-wrap:wrap; gap:7px; }
        .titleBlock h3 { margin:9px 0 6px; font-size:23px; letter-spacing:-.025em; }
        .titleBlock p { margin:0; color:#978b7c; font-size:13px; line-height:1.5; }
        .statusPill, .evidencePill, .completePill { display:inline-flex; padding:5px 9px; border-radius:999px; font-size:10px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
        .statusPill.supported, .completePill { color:#91efc8; border:1px solid rgba(89,216,158,.22); background:rgba(65,193,137,.1); }
        .statusPill.partial { color:#ffd875; border:1px solid rgba(237,181,64,.22); background:rgba(214,156,42,.1); }
        .statusPill.hold { color:#ffad78; border:1px solid rgba(241,139,76,.22); background:rgba(216,100,35,.1); }
        .statusPill.escalate { color:#c8adff; border:1px solid rgba(171,128,247,.22); background:rgba(129,83,211,.1); }
        .statusPill.not-reviewed { color:#b4a897; border:1px solid rgba(180,164,144,.18); background:rgba(134,118,98,.08); }
        .evidencePill.no-evidence { color:#b4a897; border:1px solid rgba(180,164,144,.18); background:rgba(134,118,98,.08); }
        .evidencePill.some-evidence { color:#ffd875; border:1px solid rgba(237,181,64,.22); background:rgba(214,156,42,.1); }
        .evidencePill.strong-evidence { color:#91efc8; border:1px solid rgba(89,216,158,.22); background:rgba(65,193,137,.1); }
        .expandButton { min-height:40px; display:grid; place-items:center; padding:0 14px; border-radius:999px; border:1px solid rgba(255,184,42,.21); color:#ffc455; font-size:12px; font-weight:900; }
        .reviewBody { padding:24px; border-top:1px solid rgba(180,148,101,.12); }
        .articleGuide { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
        .articleGuide article { display:grid; grid-template-columns:38px 1fr; gap:12px; padding:18px; border-radius:16px; border:1px solid rgba(180,148,101,.14); background:rgba(255,255,255,.02); }
        .guideIcon { width:34px; height:34px; display:grid; place-items:center; border-radius:10px; color:#ffc65d; background:rgba(167,99,16,.08); border:1px solid rgba(255,184,44,.22); font-weight:900; }
        .articleGuide strong { color:#f1e3cf; }
        .articleGuide p { margin:7px 0 0; color:#9d9182; line-height:1.55; font-size:13px; }
        .evidenceWorkspace { margin-top:20px; padding:22px; border-radius:18px; border:1px solid rgba(255,184,42,.16); background:rgba(165,99,17,.04); }
        .workspaceHeading { display:flex; justify-content:space-between; gap:18px; align-items:center; }
        .detailLabel { color:#ffbd3e; font-size:11px; font-weight:900; letter-spacing:.12em; }
        .workspaceHeading h4 { margin:7px 0 0; font-size:20px; }
        .recordCount { min-height:34px; display:inline-flex; align-items:center; padding:0 12px; border-radius:999px; border:1px solid rgba(255,184,42,.18); color:#d6c6af; font-size:12px; font-weight:850; }
        .evidenceChecklist { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-top:18px; }
        .evidenceChecklist button { min-height:56px; display:flex; align-items:center; gap:12px; padding:0 14px; border-radius:13px; border:1px solid rgba(180,148,101,.16); background:rgba(8,8,7,.62); color:#d7c9b7; cursor:pointer; text-align:left; }
        .evidenceChecklist button span { width:28px; height:28px; display:grid; place-items:center; border-radius:9px; border:1px solid rgba(255,184,42,.2); color:#ffc65d; }
        .evidenceChecklist button.selected { border-color:rgba(89,216,158,.32); background:rgba(65,193,137,.08); color:#c9f6e1; }
        .evidenceChecklist button.selected span { color:#0b2c20; background:#91efc8; border-color:#91efc8; }
        .missingEvidence { margin-top:16px; padding:15px 16px; border-radius:14px; border:1px solid rgba(241,139,76,.16); background:rgba(216,100,35,.05); }
        .missingEvidence strong { color:#ffb183; }
        .missingEvidence p { margin:6px 0 0; color:#aa9988; line-height:1.5; font-size:13px; }
        .recordActions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
        .actionButton { min-height:42px; border-radius:11px; font-size:12px; }
        .findingGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-top:24px; }
        .articleCompletion { display:flex; justify-content:space-between; align-items:center; gap:24px; margin-top:24px; padding:20px; border-radius:17px; border:1px solid rgba(180,148,101,.15); background:rgba(255,255,255,.02); }
        .articleCompletion > div { display:grid; gap:6px; }
        .articleCompletion strong { color:#f0e1cb; }
        .articleCompletion span { color:#9f9384; font-size:13px; }
        .determination, .boundary { margin-top:22px; display:grid; grid-template-columns:1fr .9fr; gap:34px; align-items:center; }
        .determination h2 { color:#ffbd3e; }
        .determinationFacts { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
        .determinationFacts span { min-height:92px; padding:18px; border-radius:16px; border:1px solid rgba(180,148,101,.15); background:rgba(255,255,255,.02); color:#d9cbb8; display:flex; flex-direction:column; justify-content:center; overflow-wrap:anywhere; }
        .determinationFacts strong { margin-bottom:6px; color:#a99882; font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .boundary h2 { font-size:clamp(28px,4vw,44px); }
        .finalCta { margin-top:72px; padding:54px 46px; display:flex; justify-content:space-between; align-items:center; gap:30px; }
        .finalCta > div { max-width:760px; }
        .largeButton { min-height:58px; white-space:nowrap; }
        .report { margin-top:24px; }
        .reportHeader { padding-bottom:24px; border-bottom:1px solid rgba(180,148,101,.14); }
        .reportHeader h2 { margin-bottom:8px; }
        .reportHeader p { margin:0; }
        .reportOutcome { min-height:52px; display:inline-flex; align-items:center; padding:0 18px; border-radius:999px; border:1px solid currentColor; font-weight:950; letter-spacing:.06em; }
        .reportGrid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-top:24px; }
        .reportGrid article { min-height:96px; display:flex; flex-direction:column; justify-content:center; padding:16px; border-radius:15px; border:1px solid rgba(180,148,101,.14); background:rgba(255,255,255,.02); }
        .reportGrid strong { color:#9f927f; font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
        .reportGrid span { margin-top:7px; color:#eadcc8; overflow-wrap:anywhere; }
        .reportStatusGrid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; margin-top:12px; }
        .reportStatusGrid span { min-height:88px; display:flex; flex-direction:column; justify-content:center; padding:16px; border-radius:15px; border:1px solid rgba(180,148,101,.14); color:#a99b89; background:rgba(255,255,255,.02); }
        .reportStatusGrid strong { color:#ffbd3e; font-size:28px; }
        .reportArticles { display:grid; gap:10px; margin-top:24px; }
        .reportArticles article { display:grid; grid-template-columns:minmax(180px,.45fr) auto 1fr; gap:16px; align-items:start; padding:18px; border-radius:16px; border:1px solid rgba(180,148,101,.14); background:rgba(255,255,255,.018); }
        .reportArticles article > div { display:flex; flex-direction:column; gap:5px; }
        .reportArticles article > div span { color:#ffbd3e; font-size:12px; font-weight:900; }
        .reportArticles p { margin:0; color:#9d9182; font-size:13px; line-height:1.55; }
        .reportArticles p + p { margin-top:6px; }
        .reportBoundary { margin-top:22px; padding:20px; border-radius:16px; border:1px solid rgba(255,184,42,.17); background:rgba(165,99,17,.05); }
        .reportBoundary strong { color:#ffd786; }
        .reportBoundary p { margin:7px 0 0; color:#aa9c8a; line-height:1.6; }
        footer { min-height:128px; display:flex; align-items:center; justify-content:space-between; gap:24px; color:#887d6e; font-size:12px; }
        .footerActions { display:flex; flex-wrap:wrap; gap:8px; }
        @keyframes starDrift { from { transform:translate3d(0,0,0); } to { transform:translate3d(90px,140px,0); } }
        @keyframes glowMove { from { transform:translate3d(0,0,0) scale(1); } to { transform:translate3d(55px,35px,0) scale(1.1); } }
        @keyframes orbitSpin { to { transform:rotate(360deg); } }
        @media (max-width:1080px) {
          nav { display:none; }
          .hero, .reviewHeader, .determination, .boundary { grid-template-columns:1fr; }
          .processDiagram { grid-template-columns:repeat(4,minmax(0,1fr)); }
          .processArrow { display:none; }
          .progressCards, .statusSummary { grid-template-columns:repeat(3,minmax(0,1fr)); }
          .findingGrid, .reportGrid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .filterGroup { justify-content:flex-start; }
          .reportArticles article { grid-template-columns:1fr; }
        }
        @media (max-width:760px) {
          .shell { width:min(100% - 20px,1260px); }
          .hero { min-height:auto; padding:58px 0; }
          .guide, .entityForm, .progressSection, .reviewSection, .determination, .boundary, .finalCta, .report { padding:28px 22px; border-radius:20px; }
          .sectionHeading, .progressHeader, .reportHeader, .finalCta, .articleCompletion, .workspaceHeading, footer { flex-direction:column; align-items:flex-start; }
          .processDiagram, .stepGrid, .formGrid, .progressCards, .statusSummary, .articleGuide, .evidenceChecklist, .findingGrid, .determinationFacts, .reportGrid, .reportStatusGrid { grid-template-columns:1fr; }
          .reviewItemHeader { grid-template-columns:1fr 80px; }
          .articleBadge { grid-column:1/-1; width:fit-content; min-width:110px; }
          .reviewBody { padding:20px; }
          .heroActions, .formActions, .boundaryButtons, .reportActions, .recordActions { flex-direction:column; align-items:stretch; }
          .primaryButton, .secondaryButton, .actionButton { width:100%; }
          .largeButton { white-space:normal; }
        }
        @media print {
          .topbar, .hero, .guide, .entityForm, .progressSection, .reviewSection, .determination, .boundary, .finalCta, footer, .stars, .glow, .orbit, .reportActions { display:none !important; }
          :global(body) { background:white; color:black; }
          .report { display:block !important; width:100%; margin:0; border:0; box-shadow:none; background:white; color:black; }
          .reportHeader p, .reportArticles p, .reportBoundary p { color:#333; }
          .reportGrid article, .reportStatusGrid span, .reportArticles article, .reportBoundary { border-color:#bbb; background:white; }
        }
        @media (prefers-reduced-motion:reduce) {
          *, *::before, *::after { scroll-behavior:auto !important; animation-duration:.01ms !important; animation-iteration-count:1 !important; }
        }
      `}</style>
    </main>
  );
}
