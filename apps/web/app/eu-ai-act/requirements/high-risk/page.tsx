"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Status = "complete" | "partial" | "missing" | "not-applicable" | "";

type ControlArea = {
  id: string;
  number: string;
  title: string;
  article: string;
  summary: string;
  provider: string[];
  deployer: string[];
  evidence: string[];
  records: string[];
};

const controlAreas: ControlArea[] = [
  {
    id: "classification",
    number: "01",
    title: "High-Risk Classification",
    article: "Articles 6–7 · Annexes I and III",
    summary:
      "Establish the exact high-risk pathway, operator roles, intended purpose, use context, exceptions, and evidence basis before lifecycle obligations are mapped.",
    provider: [
      "Define intended purpose and system boundaries.",
      "Identify whether the system enters through Annex I product integration or Annex III use.",
      "Preserve claimed exceptions and non-high-risk reasoning where applicable.",
    ],
    deployer: [
      "Preserve actual deployment context and any deviation from provider instructions.",
      "Identify whether local use changes the applicable category or operator responsibility.",
      "Escalate unresolved classification before consequential use.",
    ],
    evidence: [
      "System identity and version",
      "Intended-purpose statement",
      "Annex I or Annex III mapping",
      "Actual-use description",
      "Role classification",
      "Exception analysis",
    ],
    records: [
      "High-Risk Applicability Record",
      "Operator Role Record",
      "Classification Review Record",
    ],
  },
  {
    id: "risk-management",
    number: "02",
    title: "Risk Management System",
    article: "Article 9",
    summary:
      "Establish an iterative lifecycle process for identifying, estimating, evaluating, mitigating, testing, and monitoring reasonably foreseeable risks.",
    provider: [
      "Create and maintain the risk-management system throughout the lifecycle.",
      "Identify known and reasonably foreseeable risks under intended use and foreseeable misuse.",
      "Evaluate residual risk and test mitigation effectiveness.",
    ],
    deployer: [
      "Monitor risks arising from the actual deployment context.",
      "Report risk signals and adverse conditions to the provider or relevant operator.",
      "Suspend or escalate where use indicates unacceptable risk.",
    ],
    evidence: [
      "Risk register",
      "Hazard and misuse analysis",
      "Mitigation decisions",
      "Residual-risk record",
      "Testing and validation",
      "Lifecycle updates",
    ],
    records: [
      "Risk Management Record",
      "Residual Risk Record",
      "Mitigation Effectiveness Record",
    ],
  },
  {
    id: "data-governance",
    number: "03",
    title: "Data and Data Governance",
    article: "Article 10",
    summary:
      "Govern training, validation, and testing data through relevance, representativeness, quality, provenance, bias analysis, processing, and documentation.",
    provider: [
      "Apply data-governance and management practices appropriate to the intended purpose.",
      "Preserve data provenance, preparation, assumptions, gaps, and bias-reduction measures.",
      "Assess relevance and representativeness for the people or groups affected.",
    ],
    deployer: [
      "Ensure input data under deployer control is relevant and sufficiently representative for the local use.",
      "Preserve local data limitations and operating-context differences.",
      "Escalate material mismatch between provider assumptions and deployment reality.",
    ],
    evidence: [
      "Dataset inventory",
      "Data provenance",
      "Collection and preparation methods",
      "Representativeness analysis",
      "Bias and gap analysis",
      "Local input-data suitability",
    ],
    records: [
      "Data Governance Record",
      "Dataset Provenance Record",
      "Local Input Suitability Record",
    ],
  },
  {
    id: "technical-documentation",
    number: "04",
    title: "Technical Documentation",
    article: "Article 11 · Annex IV",
    summary:
      "Preserve system identity, intended purpose, architecture, components, data, testing, performance, limitations, versions, changes, and compliance evidence.",
    provider: [
      "Prepare documentation before market placement or service entry.",
      "Keep documentation current throughout the system lifecycle.",
      "Make required evidence available to competent authorities and conformity bodies.",
    ],
    deployer: [
      "Retain provider instructions and locally controlled documentation.",
      "Preserve configuration, integration, deployment, and change records.",
      "Document local controls and deviations affecting system operation.",
    ],
    evidence: [
      "Architecture and component description",
      "Model and software versions",
      "Data and training information",
      "Performance and validation results",
      "Known limitations",
      "Change history",
    ],
    records: [
      "Technical Documentation Record",
      "Version and Change Record",
      "Deployment Configuration Record",
    ],
  },
  {
    id: "logging",
    number: "05",
    title: "Recordkeeping and Logs",
    article: "Article 12",
    summary:
      "Enable automatic event recording appropriate to the intended purpose so operation, risk, intervention, and outcome can be reconstructed.",
    provider: [
      "Design logging capabilities sufficient for lifecycle monitoring and traceability.",
      "Define which events, outputs, errors, interventions, and changes are recorded.",
      "Protect log integrity, chronology, attribution, and accessibility.",
    ],
    deployer: [
      "Retain logs under deployer control for the applicable period.",
      "Connect logs to users, decisions, interventions, incidents, and outcomes.",
      "Preserve access, retention, deletion, and export records.",
    ],
    evidence: [
      "Logging specification",
      "Event schema",
      "Timestamp and identity controls",
      "Retention schedule",
      "Access history",
      "Replay and reconstruction tests",
    ],
    records: [
      "Logging Architecture Record",
      "Operational Event Record",
      "Replay Verification Record",
    ],
  },
  {
    id: "transparency",
    number: "06",
    title: "Transparency and Instructions",
    article: "Article 13",
    summary:
      "Provide deployers with sufficiently transparent information to interpret outputs and use the system appropriately within defined conditions and limitations.",
    provider: [
      "Supply clear instructions for use and operating conditions.",
      "Disclose capabilities, limitations, performance, oversight measures, and foreseeable circumstances affecting operation.",
      "Preserve updates to instructions and downstream communications.",
    ],
    deployer: [
      "Use the system in accordance with instructions and documented limits.",
      "Train users and oversight personnel on interpretation and intervention.",
      "Preserve misuse, misunderstanding, and instruction-gap evidence.",
    ],
    evidence: [
      "Instructions for use",
      "Capability and limitation statements",
      "Performance characteristics",
      "User training materials",
      "Change notices",
      "Acknowledgment and acceptance records",
    ],
    records: [
      "Instructions for Use Record",
      "Capability and Limitation Record",
      "User Competence Record",
    ],
  },
  {
    id: "human-oversight",
    number: "07",
    title: "Human Oversight",
    article: "Article 14",
    summary:
      "Design and assign human authority capable of understanding, monitoring, intervening, disregarding, overriding, or stopping the system where appropriate.",
    provider: [
      "Design technical and organisational oversight measures.",
      "Enable meaningful monitoring, intervention, override, and stop functions.",
      "Communicate automation-bias and interpretation risks.",
    ],
    deployer: [
      "Assign competent natural persons with adequate authority and support.",
      "Preserve interventions, overrides, escalation, suspension, and outcomes.",
      "Ensure oversight is operational rather than nominal.",
    ],
    evidence: [
      "Oversight design",
      "Assigned personnel",
      "Competence evidence",
      "Authority matrix",
      "Intervention tests",
      "Override and stop records",
    ],
    records: [
      "Human Oversight Record",
      "Authority Assignment Record",
      "Intervention and Override Record",
    ],
  },
  {
    id: "performance",
    number: "08",
    title: "Accuracy, Robustness, and Cybersecurity",
    article: "Article 15",
    summary:
      "Achieve and preserve appropriate levels of accuracy, robustness, resilience, consistency, fault tolerance, and cybersecurity throughout the lifecycle.",
    provider: [
      "Define declared performance levels and operating conditions.",
      "Test against errors, faults, manipulation, adversarial activity, and material changes.",
      "Preserve trade-offs, limitations, fallback states, and corrective action.",
    ],
    deployer: [
      "Monitor local performance and environmental conditions.",
      "Preserve drift, anomalies, failures, security events, and post-intervention outcomes.",
      "Stop or escalate when performance departs from declared boundaries.",
    ],
    evidence: [
      "Performance metrics",
      "Validation and stress testing",
      "Robustness and fault testing",
      "Cybersecurity assessment",
      "Drift monitoring",
      "Incident and corrective-action records",
    ],
    records: [
      "Performance Validation Record",
      "Robustness and Cybersecurity Record",
      "Drift and Degradation Record",
    ],
  },
  {
    id: "quality-management",
    number: "09",
    title: "Quality Management",
    article: "Article 17",
    summary:
      "Establish documented policies, procedures, responsibilities, controls, corrective action, supplier governance, and evidence retention supporting continuing conformity.",
    provider: [
      "Maintain a documented quality-management system proportionate to the organisation.",
      "Assign responsibilities for compliance, design, testing, documentation, and post-market activity.",
      "Preserve supplier, subcontractor, change, complaint, and corrective-action controls.",
    ],
    deployer: [
      "Maintain local operational governance and accountability.",
      "Preserve procurement, configuration, user, oversight, and escalation controls.",
      "Feed deployment findings into provider and organisational quality processes.",
    ],
    evidence: [
      "Quality policy and procedures",
      "Responsibility matrix",
      "Supplier and subcontractor controls",
      "Audit and review records",
      "Corrective and preventive action",
      "Document control",
    ],
    records: [
      "Quality Management Record",
      "Supplier Governance Record",
      "Corrective Action Record",
    ],
  },
  {
    id: "conformity",
    number: "10",
    title: "Conformity Assessment and Registration",
    article: "Articles 43, 47–49",
    summary:
      "Preserve the applicable conformity route, evidence package, declaration, marking, registration, reviewers, findings, corrections, and resulting standing.",
    provider: [
      "Determine the applicable conformity-assessment procedure.",
      "Complete required internal control or third-party assessment.",
      "Issue the declaration, apply marking, register where required, and preserve changes affecting conformity.",
    ],
    deployer: [
      "Verify required provider evidence before deployment.",
      "Preserve procurement and acceptance checks.",
      "Escalate missing, stale, inconsistent, or invalid conformity evidence.",
    ],
    evidence: [
      "Selected conformity route",
      "Assessment evidence package",
      "Reviewer or notified-body findings",
      "Declaration of conformity",
      "Marking and registration",
      "Post-assessment changes",
    ],
    records: [
      "Conformity Assessment Record",
      "Declaration and Registration Record",
      "Assessment Finding Record",
    ],
  },
  {
    id: "deployer-obligations",
    number: "11",
    title: "Deployer Operational Duties",
    article: "Article 26",
    summary:
      "Govern local use, assigned oversight, relevant input data, monitoring, worker information, log retention, impact information, and suspension or notification where risk appears.",
    provider: [
      "Provide instructions, support, and technical information enabling deployer compliance.",
      "Receive and act on deployment risk signals.",
      "Preserve provider-deployer communications and corrective actions.",
    ],
    deployer: [
      "Use according to instructions and assign competent oversight.",
      "Monitor operation, retain logs, inform workers where applicable, and preserve impact information.",
      "Suspend use and notify relevant parties where risk or serious incident is indicated.",
    ],
    evidence: [
      "Deployment acceptance record",
      "Assigned oversight",
      "Worker and affected-person information",
      "Local monitoring",
      "Log retention",
      "Suspension and notification chronology",
    ],
    records: [
      "Deployer Compliance Record",
      "Worker Information Record",
      "Operational Suspension Record",
    ],
  },
  {
    id: "fria",
    number: "12",
    title: "Fundamental Rights Impact Assessment",
    article: "Article 27",
    summary:
      "Where applicable, assess affected-person context, duration, categories, risks, safeguards, human oversight, complaints, and notification before deployment.",
    provider: [
      "Provide information needed for deployer impact assessment.",
      "Preserve known risks, limitations, and affected-person implications.",
      "Support downstream clarification and updates.",
    ],
    deployer: [
      "Determine whether the FRIA obligation applies.",
      "Complete the assessment before deployment where required.",
      "Preserve affected groups, risks, safeguards, governance, complaints, and notification.",
    ],
    evidence: [
      "Deployer category and use case",
      "Affected persons and groups",
      "Duration and frequency",
      "Risk and safeguard analysis",
      "Human oversight",
      "Complaint and redress pathways",
    ],
    records: [
      "FRIA Applicability Record",
      "Fundamental Rights Impact Record",
      "Affected-Person Safeguard Record",
    ],
  },
  {
    id: "post-market",
    number: "13",
    title: "Post-Market Monitoring",
    article: "Article 72",
    summary:
      "Systematically collect, document, analyse, and act upon relevant performance and risk information throughout the high-risk system’s lifetime.",
    provider: [
      "Create and maintain the post-market monitoring plan.",
      "Collect and analyse data from deployers and other sources.",
      "Update risk management, documentation, controls, and corrective action.",
    ],
    deployer: [
      "Monitor actual operation and communicate relevant findings.",
      "Preserve complaints, failures, incidents, drift, interventions, and outcomes.",
      "Support continuing validity review after material changes.",
    ],
    evidence: [
      "Post-market monitoring plan",
      "Performance and risk data",
      "Complaint and feedback records",
      "Trend and drift analysis",
      "Corrective actions",
      "Continuing-validity review",
    ],
    records: [
      "Post-Market Monitoring Record",
      "Continuing Validity Record",
      "Material Change Record",
    ],
  },
  {
    id: "incidents",
    number: "14",
    title: "Serious Incident Reporting",
    article: "Article 73",
    summary:
      "Detect, classify, preserve, notify, investigate, correct, and close serious incidents through an attributable chronology.",
    provider: [
      "Maintain processes for serious-incident detection and reporting.",
      "Investigate causes, preserve evidence, and take corrective action.",
      "Coordinate with deployers, representatives, importers, distributors, and authorities.",
    ],
    deployer: [
      "Recognise and escalate incident signals promptly.",
      "Preserve local chronology, affected persons, outputs, decisions, interventions, and outcomes.",
      "Support provider and authority investigation.",
    ],
    evidence: [
      "Incident definition and classification",
      "Detection time and chronology",
      "Affected persons and consequence",
      "Notifications",
      "Root-cause investigation",
      "Correction and closure evidence",
    ],
    records: [
      "Serious Incident Record",
      "Notification Chronology Record",
      "Corrective Outcome Record",
    ],
  },
];

const initialStatuses: Record<string, Status> = Object.fromEntries(
  controlAreas.map((area) => [area.id, ""]),
);

export default function EuAiActHighRiskPage() {
  const [statuses, setStatuses] =
    useState<Record<string, Status>>(initialStatuses);
  const [activeArea, setActiveArea] = useState(0);
  const [roleView, setRoleView] = useState<"provider" | "deployer">("provider");

  const complete = Object.values(statuses).filter(
    (status) => status === "complete" || status === "not-applicable",
  ).length;
  const partial = Object.values(statuses).filter(
    (status) => status === "partial",
  ).length;
  const missing = Object.values(statuses).filter(
    (status) => status === "missing" || status === "",
  ).length;

  const determination = useMemo(() => {
    if (Object.values(statuses).some((status) => status === "missing")) {
      return {
        tone: "red",
        status: "HOLD",
        title: "One or more required control areas are declared missing.",
        text:
          "The present route does not support a readiness claim. Preserve each missing control, responsible owner, corrective action, evidence target, and review status.",
      };
    }

    if (partial > 0 || missing > 0) {
      return {
        tone: "amber",
        status: "EVIDENCE GAP",
        title: "The high-risk lifecycle package is incomplete.",
        text:
          "One or more control areas remain partial or unassessed. The route should remain bounded until the evidence package is completed and reviewed.",
      };
    }

    return {
      tone: "green",
      status: "REVIEW READY",
      title: "All control areas have a declared status.",
      text:
        "This does not certify conformity. It indicates that the lifecycle map is complete enough to enter evidence review, challenge, correction, and formal assessment.",
    };
  }, [missing, partial, statuses]);

  const selected = controlAreas[activeArea];

  const updateStatus = (id: string, status: Status) => {
    setStatuses((current) => ({ ...current, [id]: status }));

    const index = controlAreas.findIndex((area) => area.id === id);
    if (index >= 0 && index < controlAreas.length - 1) {
      setActiveArea(index + 1);
    }
  };

  const reset = () => {
    setStatuses(initialStatuses);
    setActiveArea(0);
  };

  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
        <div className="orbit orbitOne"><i /></div>
        <div className="orbit orbitTwo"><i /></div>
      </div>

      <header className="topbar shell">
        <Link href="/eu-ai-act" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act High-Risk Systems</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Exchange</Link>
          <Link href="/workspace">Workspace</Link>
          <Link className="active" href="/eu-ai-act">EU AI Act</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/entity-review">Review</Link>
        </nav>

        <Link className="headerButton" href="/eu-ai-act/requirements/risk-classification">
          Risk Classification <span>→</span>
        </Link>
      </header>

      <div className="breadcrumbs shell">
        <Link href="/eu-ai-act">EU AI Act</Link>
        <span>/</span>
        <span>Requirements</span>
        <span>/</span>
        <strong>High-Risk AI Systems</strong>
      </div>

      <section className="hero shell">
        <div>
          <p className="eyebrow">HIGH-RISK LIFECYCLE WORKSPACE</p>
          <h1>
            High-risk governance must survive the <em>entire lifecycle.</em>
          </h1>
          <p className="lead">
            Classification is only the entry point. A defensible route must
            preserve risk management, data governance, documentation, logging,
            transparency, oversight, performance, conformity, deployment,
            fundamental-rights assessment, monitoring, incidents, changes, and
            outcomes.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#control-map">
              Open Lifecycle Map <span>→</span>
            </a>
            <Link
              className="secondaryButton"
              href="/workspace/entity-review/eu-ai-act?scope=high-risk"
            >
              Request Independent Review
            </Link>
          </div>
        </div>

        <aside className={`heroStatus ${determination.tone}`}>
          <span>CURRENT LIFECYCLE STATUS</span>
          <strong>{determination.status}</strong>
          <h2>{determination.title}</h2>
          <p>{determination.text}</p>

          <div className="statusCounts">
            <div>
              <strong>{complete}</strong>
              <span>Complete / N.A.</span>
            </div>
            <div>
              <strong>{partial}</strong>
              <span>Partial</span>
            </div>
            <div>
              <strong>{missing}</strong>
              <span>Missing / unassessed</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="boundary shell">
        <div>
          <span>TA-14 HIGH-RISK BOUNDARY</span>
          <strong>
            Completing this map does not certify conformity or legal compliance.
          </strong>
        </div>
        <p>
          Each control status remains a declaration until supported by dated,
          attributable evidence and reviewed against the controlling legal
          source, actual system, operator role, intended purpose, deployment
          context, changes, and outcomes.
        </p>
      </section>

      <section className="lifecycleStrip shell">
        {[
          ["01", "Classify"],
          ["02", "Design"],
          ["03", "Test"],
          ["04", "Assess"],
          ["05", "Deploy"],
          ["06", "Monitor"],
          ["07", "Correct"],
          ["08", "Preserve"],
        ].map(([number, title]) => (
          <article key={number}>
            <span>{number}</span>
            <strong>{title}</strong>
          </article>
        ))}
      </section>

      <section className="controlMap shell" id="control-map">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">CONTROL AREA MAP</p>
            <h2>Assess each lifecycle obligation separately.</h2>
            <p>
              Mark each area complete, partial, missing, or not applicable.
              Preserve the evidence and reasoning supporting every status.
            </p>
          </div>

          <div className="headerControls">
            <div className="roleToggle">
              <button
                className={roleView === "provider" ? "active" : ""}
                type="button"
                onClick={() => setRoleView("provider")}
              >
                Provider View
              </button>
              <button
                className={roleView === "deployer" ? "active" : ""}
                type="button"
                onClick={() => setRoleView("deployer")}
              >
                Deployer View
              </button>
            </div>
            <button className="reset" type="button" onClick={reset}>
              Reset Map
            </button>
          </div>
        </div>

        <div className="controlLayout">
          <aside className="controlRail">
            {controlAreas.map((area, index) => (
              <button
                className={activeArea === index ? "active" : ""}
                key={area.id}
                type="button"
                onClick={() => setActiveArea(index)}
              >
                <span>{area.number}</span>
                <div>
                  <strong>{area.title}</strong>
                  <small>
                    {statuses[area.id]
                      ? statuses[area.id]
                          .replace("-", " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : "Not assessed"}
                  </small>
                </div>
                <i className={statuses[area.id] || "empty"} />
              </button>
            ))}
          </aside>

          <article className="activeControl">
            <div className="controlTop">
              <span>CONTROL AREA {selected.number}</span>
              <strong>{selected.article}</strong>
            </div>

            <h3>{selected.title}</h3>
            <p className="summary">{selected.summary}</p>

            <div className="statusChoices">
              {[
                ["complete", "Complete", "Evidence exists and is current."],
                ["partial", "Partial", "Some controls or evidence remain incomplete."],
                ["missing", "Missing", "Required control or evidence is not established."],
                [
                  "not-applicable",
                  "Not applicable",
                  "A reasoned exclusion is preserved.",
                ],
              ].map(([value, label, description]) => (
                <button
                  className={statuses[selected.id] === value ? "chosen" : ""}
                  key={value}
                  type="button"
                  onClick={() => updateStatus(selected.id, value as Status)}
                >
                  <strong>{label}</strong>
                  <p>{description}</p>
                </button>
              ))}
            </div>

            <div className="rolePanel">
              <span>
                {roleView === "provider"
                  ? "PROVIDER RESPONSIBILITIES"
                  : "DEPLOYER RESPONSIBILITIES"}
              </span>
              <ul>
                {(roleView === "provider"
                  ? selected.provider
                  : selected.deployer
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detailGrid">
              <div>
                <span>EVIDENCE TO PRESERVE</span>
                <ul>
                  {selected.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span>GOVERNED RECORDS</span>
                <ul>
                  {selected.records.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="navigation">
              <button
                disabled={activeArea === 0}
                type="button"
                onClick={() =>
                  setActiveArea((current) => Math.max(0, current - 1))
                }
              >
                ← Previous
              </button>
              <button
                disabled={activeArea === controlAreas.length - 1}
                type="button"
                onClick={() =>
                  setActiveArea((current) =>
                    Math.min(controlAreas.length - 1, current + 1),
                  )
                }
              >
                Next Control →
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className={`determination shell ${determination.tone}`}>
        <div className="determinationHeader">
          <div>
            <p className="eyebrow">CURRENT HIGH-RISK DETERMINATION</p>
            <span className="statusBadge">{determination.status}</span>
            <h2>{determination.title}</h2>
            <p>{determination.text}</p>
          </div>

          <div className="completionRing">
            <strong>
              {Math.round((complete / controlAreas.length) * 100)}%
            </strong>
            <span>CONTROL COMPLETION</span>
          </div>
        </div>

        <div className="resultGrid">
          {controlAreas.map((area) => {
            const status = statuses[area.id];
            return (
              <article key={area.id}>
                <span>{area.article}</span>
                <strong>{area.title}</strong>
                <i className={status || "empty"}>
                  {status
                    ? status.replace("-", " ").toUpperCase()
                    : "UNASSESSED"}
                </i>
              </article>
            );
          })}
        </div>

        <div className="determinationActions">
          <Link href="/workspace/governed-records/builder?framework=eu-ai-act&record=High-Risk%20Lifecycle%20Record">
            Create Lifecycle Record <span>→</span>
          </Link>
          <Link href="/workspace/routes/new?framework=eu-ai-act&requirement=high-risk">
            Build High-Risk Route <span>→</span>
          </Link>
          <Link href="/workspace/entity-review/eu-ai-act?scope=high-risk">
            Request Independent Review <span>→</span>
          </Link>
        </div>
      </section>

      <section className="roleSeparation shell">
        <div className="sectionIntro">
          <p className="eyebrow">OPERATOR SEPARATION</p>
          <h2>Provider evidence and deployer evidence must not be collapsed.</h2>
          <p>
            The provider governs system design, declared purpose, lifecycle
            controls, documentation, conformity, and post-market responsibilities.
            The deployer governs actual use, local data, assigned oversight,
            affected persons, logs, monitoring, impact assessment, intervention,
            suspension, and operational outcomes.
          </p>
        </div>

        <div className="roleGrid">
          <article>
            <span>PROVIDER LAYER</span>
            <h3>System responsibility</h3>
            <ul>
              <li>Design and intended purpose</li>
              <li>Risk and data governance</li>
              <li>Technical documentation</li>
              <li>Logging and oversight design</li>
              <li>Performance and cybersecurity</li>
              <li>Conformity and post-market monitoring</li>
            </ul>
            <Link href="/eu-ai-act/roles/provider">
              Open Provider Pathway <b>→</b>
            </Link>
          </article>

          <article>
            <span>DEPLOYER LAYER</span>
            <h3>Operational responsibility</h3>
            <ul>
              <li>Actual use and local context</li>
              <li>Relevant input data</li>
              <li>Assigned human oversight</li>
              <li>Worker and affected-person information</li>
              <li>FRIA, monitoring, and logs</li>
              <li>Suspension, notification, and outcomes</li>
            </ul>
            <Link href="/eu-ai-act/roles/deployer">
              Open Deployer Pathway <b>→</b>
            </Link>
          </article>
        </div>
      </section>

      <section className="conformityFlow shell">
        <div className="sectionIntro">
          <p className="eyebrow">CONFORMITY AND EXECUTION FLOW</p>
          <h2>Do not allow the route to jump from documentation to deployment.</h2>
        </div>

        <div className="flow">
          {[
            ["01", "Classified", "High-risk basis and operator roles preserved."],
            ["02", "Controlled", "Lifecycle controls designed and assigned."],
            ["03", "Evidenced", "Documents, tests, logs, and records bound."],
            ["04", "Assessed", "Applicable conformity route completed."],
            ["05", "Registered", "Declaration, marking, and registration preserved."],
            ["06", "Accepted", "Deployer verifies the package and local conditions."],
            ["07", "Monitored", "Performance, drift, incidents, and changes governed."],
            ["08", "Corrected", "Intervention and outcome remain inspectable."],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="recordArchitecture shell">
        <div className="sectionIntro">
          <p className="eyebrow">HIGH-RISK GOVERNED RECORDS</p>
          <h2>Each material lifecycle claim should become a dated record.</h2>
        </div>

        <div className="recordGrid">
          {[
            [
              "High-Risk Applicability Record",
              "Preserves role, system, intended purpose, Annex pathway, exceptions, evidence, and current classification standing.",
            ],
            [
              "Risk and Data Governance Record",
              "Binds identified risks, mitigations, residual risks, datasets, provenance, representativeness, bias, and updates.",
            ],
            [
              "Technical and Performance Record",
              "Preserves architecture, versions, tests, accuracy, robustness, cybersecurity, limitations, and material changes.",
            ],
            [
              "Human Oversight and Logging Record",
              "Preserves assigned authority, competence, intervention, override, event capture, retention, access, and replay.",
            ],
            [
              "Conformity and Deployment Record",
              "Preserves assessment route, declaration, registration, procurement verification, local configuration, and acceptance.",
            ],
            [
              "Post-Market and Incident Record",
              "Preserves monitoring, drift, complaints, serious incidents, notification, correction, and continuing validity.",
            ],
          ].map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <Link
                href={`/workspace/governed-records/builder?framework=eu-ai-act&record=${encodeURIComponent(
                  title,
                )}`}
              >
                Create Record <b>→</b>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="connected shell">
        <div className="sectionIntro">
          <p className="eyebrow">CONNECTED REQUIREMENT ROUTES</p>
          <h2>Continue into the control area requiring deeper evidence.</h2>
        </div>

        <div className="connectedGrid">
          {[
            [
              "Technical Documentation",
              "/eu-ai-act/requirements/technical-documentation",
              "Open the complete Annex IV evidence architecture.",
            ],
            [
              "Human Oversight",
              "/eu-ai-act/requirements/human-oversight",
              "Define authority, competence, intervention, override, stop, and escalation.",
            ],
            [
              "FRIA",
              "/eu-ai-act/requirements/fria",
              "Assess affected persons, rights risks, safeguards, complaints, and governance.",
            ],
            [
              "Conformity Assessment",
              "/eu-ai-act/requirements/conformity-assessment",
              "Preserve assessment route, findings, declaration, marking, and registration.",
            ],
            [
              "Post-Market Monitoring",
              "/eu-ai-act/requirements/post-market-monitoring",
              "Govern continuing performance, drift, feedback, changes, and corrective action.",
            ],
            [
              "Incident Reporting",
              "/eu-ai-act/requirements/incident-reporting",
              "Preserve detection, classification, notification, investigation, correction, and closure.",
            ],
          ].map(([title, href, description]) => (
            <Link href={href} key={title}>
              <span>OPEN PATHWAY</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <div>
                Explore Requirement <b>→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</p>
          <h2>High-risk status is the beginning of governance—not the conclusion.</h2>
          <p>
            Build the lifecycle route, bind the evidence, preserve role
            separation, complete the applicable assessment, monitor actual
            operation, and keep every intervention and outcome reconstructable.
          </p>
        </div>

        <div className="finalActions">
          <Link
            className="primaryButton"
            href="/workspace/governed-records/builder?framework=eu-ai-act&record=High-Risk%20Lifecycle%20Record"
          >
            Create Lifecycle Record <span>→</span>
          </Link>
          <Link
            className="secondaryButton"
            href="/workspace/entity-review/eu-ai-act?scope=high-risk"
          >
            Open Independent Review
          </Link>
        </div>
      </section>

      <footer className="shell">
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <span>No admissible evidence. No admissible execution.</span>
        </div>
        <Link href="/eu-ai-act">Return to EU AI Act Workspace</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }

        :global(html) {
          background: #030914;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f4f9ff;
          background:
            radial-gradient(circle at 8% 3%, rgba(40, 141, 207, .14), transparent 28%),
            radial-gradient(circle at 92% 22%, rgba(226, 164, 42, .08), transparent 29%),
            linear-gradient(180deg, #030914 0%, #071522 52%, #030914 100%);
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
          width: min(1280px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -4;
        }

        .stars {
          position: absolute;
          inset: -15%;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.72) 0 1px, transparent 1.5px);
          background-size: 108px 108px;
          animation: starMove 44s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(77,185,255,.62) 0 1px, transparent 1.5px);
          background-size: 174px 174px;
          background-position: 41px 63px;
          animation: starMoveReverse 58s linear infinite;
        }

        .line {
          position: absolute;
          width: 72vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(81, 189, 240, .44), transparent);
        }

        .lineOne {
          left: -24%;
          top: 25%;
          transform: rotate(11deg);
          animation: lineMove 18s linear infinite;
        }

        .lineTwo {
          right: -25%;
          top: 68%;
          transform: rotate(-9deg);
          animation: lineMoveReverse 24s linear infinite;
        }

        .orbit {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 999px;
          border: 1px solid rgba(88, 185, 231, .16);
          animation: orbital 20s linear infinite;
        }

        .orbit i {
          position: absolute;
          right: -7px;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #69ccfa;
          box-shadow: 0 0 18px #69ccfa;
        }

        .orbitOne { right: 3%; top: 9%; }

        .orbitTwo {
          left: 3%;
          bottom: 7%;
          width: 190px;
          height: 190px;
          border-color: rgba(255, 190, 66, .18);
          animation-direction: reverse;
          animation-duration: 16s;
        }

        .orbitTwo i {
          background: #ffc653;
          box-shadow: 0 0 18px #ffc653;
        }

        .topbar {
          min-height: 82px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          border-bottom: 1px solid rgba(105, 159, 188, .16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 66px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #07121b;
          background: linear-gradient(135deg, #6bcdfa, #d9f7ff);
          font-size: 13px;
          font-weight: 950;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          margin-top: 3px;
          color: #7e9baa;
          font-size: 11px;
        }

        nav {
          display: flex;
          justify-content: center;
          gap: 22px;
        }

        nav a {
          color: #a8bcc7;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }

        nav a.active { color: #f7d687; }

        .headerButton {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 193, 71, .36);
          color: #ffd783;
          background: rgba(116, 74, 5, .12);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .breadcrumbs {
          min-height: 62px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #718d9d;
          font-size: 12px;
        }

        .breadcrumbs a {
          color: #75cfee;
          text-decoration: none;
        }

        .breadcrumbs strong { color: #dbe8ef; }

        .eyebrow {
          margin: 0;
          color: #6dd2f5;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .hero {
          min-height: 540px;
          display: grid;
          grid-template-columns: 1.16fr .84fr;
          gap: 48px;
          align-items: center;
          padding: 54px 0 70px;
        }

        h1 {
          max-width: 900px;
          margin: 16px 0 0;
          font-size: clamp(54px, 7.5vw, 96px);
          line-height: .94;
          letter-spacing: -.065em;
        }

        h1 em {
          color: #ffc85c;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 500;
        }

        .lead {
          max-width: 850px;
          margin: 24px 0 0;
          color: #a7bac6;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 0 18px;
          border-radius: 13px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .primaryButton {
          color: #06131d;
          background: linear-gradient(135deg, #67caf6, #d8f7ff);
          box-shadow: 0 14px 36px rgba(73, 181, 229, .17);
        }

        .secondaryButton {
          color: #e5f3fa;
          border: 1px solid rgba(100, 184, 222, .23);
          background: rgba(24, 66, 88, .14);
        }

        .heroStatus,
        .boundary,
        .controlMap,
        .determination,
        .roleSeparation,
        .conformityFlow,
        .recordArchitecture,
        .connected,
        .finalCta {
          border: 1px solid rgba(111, 163, 190, .15);
          background:
            linear-gradient(180deg, rgba(10, 24, 35, .93), rgba(5, 12, 19, .97));
          border-radius: 24px;
          box-shadow: 0 22px 65px rgba(0,0,0,.23);
        }

        .heroStatus { padding: 32px; }

        .heroStatus.red,
        .determination.red { border-color: rgba(255, 91, 91, .36); }

        .heroStatus.amber,
        .determination.amber { border-color: rgba(255, 171, 64, .31); }

        .heroStatus.green,
        .determination.green { border-color: rgba(91, 218, 159, .28); }

        .heroStatus > span {
          color: #8199a7;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .16em;
        }

        .heroStatus > strong {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ffd47a;
          background: rgba(255, 190, 62, .08);
          font-size: 10px;
          letter-spacing: .12em;
        }

        .heroStatus h2 {
          margin: 17px 0 10px;
          font-size: 38px;
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .heroStatus > p {
          color: #a9bbc5;
          line-height: 1.62;
        }

        .statusCounts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 24px;
        }

        .statusCounts div {
          padding: 15px;
          border-radius: 13px;
          border: 1px solid rgba(106, 161, 188, .13);
          background: rgba(30, 81, 103, .04);
        }

        .statusCounts strong,
        .statusCounts span { display: block; }

        .statusCounts strong { font-size: 25px; }

        .statusCounts span {
          margin-top: 4px;
          color: #839aa6;
          font-size: 9px;
        }

        .boundary {
          padding: 25px 30px;
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 32px;
          align-items: center;
          border-color: rgba(255, 191, 66, .21);
        }

        .boundary div span {
          display: block;
          color: #ffc65d;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .boundary div strong {
          display: block;
          margin-top: 8px;
          font-size: 20px;
        }

        .boundary p {
          margin: 0;
          color: #b9ad95;
          line-height: 1.62;
        }

        .lifecycleStrip {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 9px;
          margin-top: 20px;
        }

        .lifecycleStrip article {
          min-height: 94px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(104, 171, 200, .13);
          background: rgba(10, 27, 38, .88);
        }

        .lifecycleStrip span {
          color: #69d0f4;
          font-size: 9px;
          font-weight: 950;
        }

        .lifecycleStrip strong {
          display: block;
          margin-top: 18px;
          font-size: 14px;
        }

        .controlMap,
        .determination,
        .roleSeparation,
        .conformityFlow,
        .recordArchitecture,
        .connected {
          margin-top: 20px;
          padding: 42px;
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          align-items: end;
        }

        .sectionHeader > div:first-child {
          max-width: 850px;
        }

        .sectionHeader h2,
        .determinationHeader h2,
        .sectionIntro h2,
        .finalCta h2 {
          margin: 10px 0 0;
          font-size: clamp(34px, 4.8vw, 56px);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .sectionHeader p:not(.eyebrow),
        .sectionIntro p:not(.eyebrow),
        .determinationHeader p,
        .finalCta p:not(.eyebrow) {
          color: #9fb3c0;
          line-height: 1.68;
        }

        .headerControls {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-end;
        }

        .roleToggle {
          display: flex;
          padding: 4px;
          border-radius: 12px;
          border: 1px solid rgba(103, 177, 209, .17);
          background: rgba(27, 77, 99, .06);
        }

        .roleToggle button,
        .reset {
          min-height: 38px;
          padding: 0 13px;
          border: 0;
          border-radius: 9px;
          color: #8ca4b0;
          background: transparent;
          font: inherit;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .roleToggle button.active {
          color: #06131d;
          background: linear-gradient(135deg, #68caf6, #d8f7ff);
        }

        .reset {
          border: 1px solid rgba(255, 190, 65, .21);
          color: #ffd27a;
          background: rgba(113, 73, 6, .07);
        }

        .controlLayout {
          display: grid;
          grid-template-columns: .78fr 1.22fr;
          gap: 18px;
          margin-top: 28px;
        }

        .controlRail {
          display: grid;
          gap: 8px;
        }

        .controlRail > button {
          width: 100%;
          min-height: 76px;
          padding: 12px;
          display: grid;
          grid-template-columns: 34px 1fr 10px;
          gap: 11px;
          align-items: center;
          border-radius: 14px;
          border: 1px solid rgba(98, 164, 194, .13);
          color: inherit;
          background: rgba(32, 87, 112, .035);
          text-align: left;
          cursor: pointer;
        }

        .controlRail > button.active {
          border-color: rgba(105, 206, 244, .42);
          background: rgba(39, 119, 151, .09);
        }

        .controlRail > button > span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #69d0f4;
          background: rgba(58, 155, 194, .09);
          font-size: 10px;
          font-weight: 950;
        }

        .controlRail strong,
        .controlRail small { display: block; }

        .controlRail strong {
          font-size: 12px;
          line-height: 1.35;
        }

        .controlRail small {
          margin-top: 5px;
          color: #718b99;
          font-size: 10px;
        }

        .controlRail i {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #334b58;
        }

        .controlRail i.complete { background: #72d8ad; }
        .controlRail i.partial { background: #ffad53; }
        .controlRail i.missing {
          background: #ff6557;
          box-shadow: 0 0 10px rgba(255, 90, 75, .6);
        }
        .controlRail i.not-applicable { background: #92a9b4; }

        .activeControl {
          min-height: 760px;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid rgba(255, 191, 66, .17);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 183, 38, .045), transparent 33%),
            rgba(10, 18, 23, .88);
        }

        .controlTop {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #ffc75a;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .activeControl h3 {
          max-width: 800px;
          margin: 18px 0 12px;
          font-size: clamp(31px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .summary {
          color: #a8bac4;
          line-height: 1.65;
        }

        .statusChoices {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .statusChoices button {
          min-height: 116px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(103, 175, 207, .14);
          color: inherit;
          background: rgba(31, 88, 113, .035);
          text-align: left;
          cursor: pointer;
        }

        .statusChoices button.chosen {
          border-color: rgba(104, 207, 246, .48);
          background: rgba(44, 130, 165, .11);
        }

        .statusChoices strong { font-size: 15px; }

        .statusChoices p {
          margin: 8px 0 0;
          color: #8299a5;
          font-size: 11px;
          line-height: 1.45;
        }

        .rolePanel,
        .detailGrid > div {
          padding: 19px;
          border-radius: 15px;
          border: 1px solid rgba(104, 178, 210, .13);
          background: rgba(31, 88, 113, .035);
        }

        .rolePanel { margin-top: 16px; }

        .rolePanel > span,
        .detailGrid span {
          color: #6dd2f5;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .rolePanel ul,
        .detailGrid ul {
          display: grid;
          gap: 8px;
          margin: 15px 0 0;
          padding-left: 18px;
          color: #c7d3d9;
        }

        .rolePanel li,
        .detailGrid li { line-height: 1.45; }

        .detailGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
          margin-top: 11px;
        }

        .navigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
        }

        .navigation button {
          min-height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid rgba(99, 178, 213, .18);
          color: #c9e4ef;
          background: rgba(36, 101, 128, .05);
          font: inherit;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        .navigation button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .determination { border-width: 2px; }

        .determinationHeader {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 30px;
          align-items: center;
        }

        .determinationHeader > div:first-child { max-width: 880px; }

        .statusBadge {
          display: inline-flex;
          margin-top: 18px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ffd27a;
          background: rgba(255, 190, 62, .08);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .completionRing {
          width: 170px;
          height: 170px;
          display: grid;
          place-content: center;
          border-radius: 999px;
          border: 2px solid rgba(104, 205, 244, .28);
          background: radial-gradient(circle, rgba(55, 145, 180, .12), transparent 65%);
          text-align: center;
        }

        .completionRing strong { font-size: 43px; }

        .completionRing span {
          margin-top: 3px;
          color: #7f98a6;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .resultGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 28px;
        }

        .resultGrid article {
          min-height: 132px;
          padding: 16px;
          border-radius: 15px;
          border: 1px solid rgba(102, 168, 197, .13);
          background: rgba(30, 83, 105, .035);
        }

        .resultGrid article > span {
          color: #7393a2;
          font-size: 9px;
          font-weight: 900;
        }

        .resultGrid article > strong {
          display: block;
          margin-top: 10px;
          min-height: 42px;
          font-size: 13px;
          line-height: 1.35;
        }

        .resultGrid i {
          display: inline-flex;
          margin-top: 10px;
          padding: 5px 8px;
          border-radius: 999px;
          color: #7c929d;
          background: rgba(84, 108, 119, .07);
          font-size: 8px;
          font-style: normal;
          font-weight: 950;
          letter-spacing: .09em;
        }

        .resultGrid i.complete {
          color: #79dbb3;
          background: rgba(50, 145, 103, .08);
        }

        .resultGrid i.partial {
          color: #ffbc72;
          background: rgba(164, 90, 22, .08);
        }

        .resultGrid i.missing {
          color: #ff8d80;
          background: rgba(179, 54, 40, .09);
        }

        .resultGrid i.not-applicable {
          color: #aabac2;
          background: rgba(97, 119, 128, .08);
        }

        .determinationActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .determinationActions a {
          min-height: 44px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          border-radius: 11px;
          border: 1px solid rgba(102, 190, 227, .22);
          color: #85d8f7;
          background: rgba(38, 112, 143, .06);
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
        }

        .sectionIntro { max-width: 900px; }

        .roleGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .roleGrid article {
          min-height: 330px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border-radius: 18px;
          border: 1px solid rgba(102, 178, 209, .14);
          background: rgba(31, 87, 111, .04);
        }

        .roleGrid article > span {
          color: #6dd2f5;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .roleGrid h3 {
          margin: 15px 0 10px;
          font-size: 28px;
        }

        .roleGrid ul {
          display: grid;
          gap: 9px;
          padding-left: 18px;
          color: #aabcc6;
        }

        .roleGrid a {
          min-height: 44px;
          margin-top: auto;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          border: 1px solid rgba(101, 190, 227, .21);
          color: #82d5f5;
          background: rgba(41, 117, 149, .06);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .flow {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .flow article {
          min-height: 170px;
          padding: 19px;
          border-radius: 16px;
          border: 1px solid rgba(255, 192, 70, .15);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 182, 38, .05), transparent 35%),
            rgba(12, 20, 24, .85);
        }

        .flow span {
          color: #ffc95e;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .flow strong {
          display: block;
          margin-top: 17px;
          font-size: 19px;
        }

        .flow p {
          margin: 9px 0 0;
          color: #9eadb5;
          line-height: 1.5;
        }

        .recordGrid,
        .connectedGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
          margin-top: 28px;
        }

        .recordGrid article,
        .connectedGrid > a {
          min-height: 240px;
          padding: 21px;
          display: flex;
          flex-direction: column;
          border-radius: 17px;
          border: 1px solid rgba(101, 176, 209, .14);
          background: rgba(31, 87, 111, .04);
        }

        .recordGrid article > span,
        .connectedGrid > a > span {
          color: #6dd2f5;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .recordGrid h3,
        .connectedGrid h3 {
          margin: 16px 0 10px;
          font-size: 22px;
        }

        .recordGrid p,
        .connectedGrid p {
          margin: 0;
          color: #9fb1bc;
          line-height: 1.55;
        }

        .recordGrid a {
          min-height: 42px;
          margin-top: auto;
          padding: 0 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          border: 1px solid rgba(100, 190, 229, .21);
          color: #82d5f5;
          background: rgba(41, 117, 149, .06);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .connectedGrid > a {
          color: inherit;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .connectedGrid > a:hover {
          transform: translateY(-5px);
          border-color: rgba(105, 204, 243, .45);
        }

        .connectedGrid > a > div {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          color: #82d5f5;
          font-size: 12px;
          font-weight: 900;
        }

        .finalCta {
          margin-top: 70px;
          padding: 48px 42px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          border-color: rgba(102, 190, 227, .22);
        }

        .finalCta > div:first-child { max-width: 760px; }

        .finalActions {
          justify-content: flex-end;
          margin-top: 0;
        }

        footer {
          min-height: 120px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          color: #718894;
          font-size: 12px;
        }

        footer > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        footer strong { color: #a6bac5; }

        footer a {
          color: #78d1f2;
          text-decoration: none;
          font-weight: 850;
        }

        @keyframes starMove {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(110px,145px,0); }
        }

        @keyframes starMoveReverse {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-120px,100px,0); }
        }

        @keyframes lineMove {
          from { transform: translateX(-35vw) rotate(11deg); opacity: 0; }
          18% { opacity: .5; }
          82% { opacity: .3; }
          to { transform: translateX(105vw) rotate(11deg); opacity: 0; }
        }

        @keyframes lineMoveReverse {
          from { transform: translateX(35vw) rotate(-9deg); opacity: 0; }
          18% { opacity: .45; }
          82% { opacity: .28; }
          to { transform: translateX(-105vw) rotate(-9deg); opacity: 0; }
        }

        @keyframes orbital { to { transform: rotate(360deg); } }

        @media (max-width: 1080px) {
          nav { display: none; }
          .topbar { grid-template-columns: 1fr auto; }

          .hero,
          .controlLayout {
            grid-template-columns: 1fr;
          }

          .lifecycleStrip,
          .resultGrid,
          .flow {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .shell { width: min(100% - 20px, 1280px); }

          .brand small,
          .headerButton span { display: none; }

          .hero {
            min-height: auto;
            padding: 42px 0 56px;
          }

          .boundary,
          .determinationHeader,
          .detailGrid {
            grid-template-columns: 1fr;
          }

          .lifecycleStrip,
          .statusChoices,
          .resultGrid,
          .flow,
          .recordGrid,
          .connectedGrid,
          .roleGrid {
            grid-template-columns: 1fr;
          }

          .sectionHeader,
          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          .headerControls { align-items: flex-start; }

          .controlMap,
          .determination,
          .roleSeparation,
          .conformityFlow,
          .recordArchitecture,
          .connected,
          .finalCta {
            padding: 28px 22px;
          }

          .completionRing {
            width: 130px;
            height: 130px;
          }

          .finalActions { justify-content: flex-start; }

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
