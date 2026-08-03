"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type RiskSeverity = "Low" | "Medium" | "High" | "Critical";
type RiskStatus = "Open" | "Monitoring" | "Escalating" | "Controlled";

type RiskRecord = {
  id: string;
  title: string;
  domain: string;
  severity: RiskSeverity;
  status: RiskStatus;
  summary: string;
  indicators: string[];
  evidence: string[];
  determination: string;
};

type RiskDomain = {
  id: string;
  title: string;
  description: string;
  accent: string;
};
const riskDomains: RiskDomain[] = [
  {
    id: 'ai',
    title: 'AI Governance',
    description: 'Models, agents, automated decisions, identity, authority, execution, and outcome risk.',
    accent: '#65b8ff',
  },
  {
    id: 'environment',
    title: 'Environmental Integrity',
    description: 'Air, water, land, buildings, HVAC, contamination, intervention, and public protection risk.',
    accent: '#64e5b2',
  },
  {
    id: 'law',
    title: 'Law & Regulation',
    description: 'Applicability, jurisdiction, authority, enforcement, statutory duty, and legal-status risk.',
    accent: '#f0bd62',
  },
  {
    id: 'standards',
    title: 'Standards & Codes',
    description: 'Edition, adoption, incorporation, conformity, method, and technical implementation risk.',
    accent: '#ff956e',
  },
  {
    id: 'evidence',
    title: 'Evidence & Records',
    description: 'Attribution, custody, continuity, calibration, provenance, admissibility, and preservation risk.',
    accent: '#b38cff',
  },
  {
    id: 'institution',
    title: 'Institutional Governance',
    description: 'Role, delegation, competence, conflict, review, publication, and future-reliance risk.',
    accent: '#6ee7f3',
  },
];

const riskRecords: RiskRecord[] = [
  {
    id: 'authority-drift',
    title: 'Authority Drift',
    domain: 'AI Governance',
    severity: 'High',
    status: 'Escalating',
    summary: 'Current authority no longer matches the action, system, role, jurisdiction, or operating condition.',
    indicators: [
      'Expired delegation',
      'Revoked permission',
      'Role reassignment',
      'Changed jurisdiction',
    ],
    evidence: [
      'Authority record',
      'Delegation instrument',
      'Version history',
      'Revocation check',
    ],
    determination: 'HOLD until current authority is re-established and bound to the proposed action.',
  },
  {
    id: 'evidence-discontinuity',
    title: 'Evidence Discontinuity',
    domain: 'Evidence & Records',
    severity: 'Critical',
    status: 'Open',
    summary: 'A break in identity, custody, chronology, calibration, provenance, or version continuity weakens reliance.',
    indicators: [
      'Missing timestamps',
      'Instrument substitution',
      'Broken chain of custody',
      'Unexplained data gaps',
    ],
    evidence: [
      'Continuity package',
      'Custody log',
      'Calibration record',
      'Hash or integrity proof',
    ],
    determination: 'DENY reliance where the missing continuity is material to the determination.',
  },
  {
    id: 'model-drift',
    title: 'Model or System Drift',
    domain: 'AI Governance',
    severity: 'High',
    status: 'Monitoring',
    summary: 'Behavior, performance, dependencies, or operating context changes after approval or validation.',
    indicators: [
      'Model update',
      'Prompt change',
      'Data shift',
      'Toolchain change',
    ],
    evidence: [
      'Version manifest',
      'Change record',
      'Regression test',
      'Outcome monitoring',
    ],
    determination: 'ESCALATE when drift may alter consequence, affected population, or permitted use.',
  },
  {
    id: 'environmental-misclassification',
    title: 'Environmental Misclassification',
    domain: 'Environmental Integrity',
    severity: 'High',
    status: 'Open',
    summary: 'Measurement, interpretation, diagnosis, compliance, safety, and intervention are collapsed into one unsupported conclusion.',
    indicators: [
      'Single-sensor reliance',
      'Threshold misuse',
      'Context omission',
      'Medical overreach',
    ],
    evidence: [
      'Instrument record',
      'Activity context',
      'Interpretation boundary',
      'Qualified review',
    ],
    determination: 'HOLD the claim until measurement and interpretation boundaries are restored.',
  },
  {
    id: 'jurisdiction-conflict',
    title: 'Jurisdiction Conflict',
    domain: 'Law & Regulation',
    severity: 'Critical',
    status: 'Escalating',
    summary: 'Two or more authorities, territories, sectors, or instruments may govern the same activity differently.',
    indicators: [
      'Cross-border service',
      'Concurrent regulators',
      'Local code variance',
      'Treaty implementation gap',
    ],
    evidence: [
      'Jurisdiction map',
      'Official source',
      'Applicability analysis',
      'Conflict memorandum',
    ],
    determination: 'ESCALATE to qualified authority resolution before execution.',
  },
  {
    id: 'edition-mismatch',
    title: 'Edition and Adoption Mismatch',
    domain: 'Standards & Codes',
    severity: 'High',
    status: 'Open',
    summary: 'A current published edition is treated as controlling even though another edition was adopted, incorporated, or contracted.',
    indicators: [
      'Unverified edition',
      'Code cycle mismatch',
      'Contract reference gap',
      'Superseded method',
    ],
    evidence: [
      'Adoption record',
      'Code citation',
      'Contract clause',
      'Edition comparison',
    ],
    determination: 'HOLD conformity or compliance claims until the controlling edition is verified.',
  },
  {
    id: 'residual-risk-overstatement',
    title: 'Residual Risk Overstatement',
    domain: 'Institutional Governance',
    severity: 'Medium',
    status: 'Monitoring',
    summary: 'Controls reduce risk, but the remaining uncertainty is described as eliminated, safe, compliant, or guaranteed.',
    indicators: [
      'Absolute language',
      'Missing uncertainty',
      'No residual owner',
      'No revalidation trigger',
    ],
    evidence: [
      'Residual risk record',
      'Limitation statement',
      'Risk owner',
      'Revalidation plan',
    ],
    determination: 'ALLOW only within the declared residual-risk boundary.',
  },
  {
    id: 'intervention-outcome-gap',
    title: 'Intervention–Outcome Gap',
    domain: 'Environmental Integrity',
    severity: 'Critical',
    status: 'Open',
    summary: 'An intervention occurred, but the intended real-world outcome was not measured, verified, or preserved.',
    indicators: [
      'No post-test',
      'Wrong comparison',
      'Short observation window',
      'Unverified restoration',
    ],
    evidence: [
      'Pre/post evidence',
      'Outcome criteria',
      'Verification record',
      'Persistence check',
    ],
    determination: 'HOLD closure, reopening, or success claims until outcome evidence exists.',
  },
  {
    id: 'automation-bias',
    title: 'Automation Bias and Human Deference',
    domain: 'AI Governance',
    severity: 'High',
    status: 'Monitoring',
    summary: 'People over-rely on system outputs because they appear confident, fast, technical, or institutionally approved.',
    indicators: [
      'Rubber-stamp review',
      'Weak challenge path',
      'Opaque confidence',
      'Authority confusion',
    ],
    evidence: [
      'Human review record',
      'Challenge log',
      'Override evidence',
      'Training record',
    ],
    determination: 'ESCALATE high-consequence decisions where meaningful human judgment is not demonstrated.',
  },
  {
    id: 'confidentiality-boundary',
    title: 'Confidentiality and Publication Boundary',
    domain: 'Institutional Governance',
    severity: 'High',
    status: 'Open',
    summary: 'Evidence needed for review conflicts with privacy, trade-secret, contractual, security, or publication restrictions.',
    indicators: [
      'Over-disclosure',
      'Insufficient evidence',
      'Unclear consent',
      'IP extraction risk',
    ],
    evidence: [
      'Confidentiality schedule',
      'Redaction map',
      'Permission record',
      'Disclosure boundary',
    ],
    determination: 'HOLD publication while permitting bounded confidential review where authority exists.',
  },
  {
    id: 'sampling-invalidity',
    title: 'Sampling and Method Invalidity',
    domain: 'Evidence & Records',
    severity: 'Critical',
    status: 'Open',
    summary: 'Sampling design, collection, preservation, method selection, laboratory competence, or detection limits do not support the claim.',
    indicators: [
      'Wrong method',
      'Invalid hold time',
      'Biased location',
      'Unqualified laboratory',
    ],
    evidence: [
      'Sampling plan',
      'Method citation',
      'Field log',
      'Laboratory quality record',
    ],
    determination: 'DENY the unsupported environmental or technical proposition.',
  },
  {
    id: 'role-conflict',
    title: 'Role Conflict and Segregation Failure',
    domain: 'Institutional Governance',
    severity: 'High',
    status: 'Escalating',
    summary: 'The same actor proposes, approves, executes, verifies, and closes a consequential route without adequate independence.',
    indicators: [
      'Self-approval',
      'No verifier',
      'Commercial pressure',
      'Unclear accountability',
    ],
    evidence: [
      'Role matrix',
      'Conflict disclosure',
      'Independent review',
      'Approval history',
    ],
    determination: 'ESCALATE or impose independent review before commitment.',
  },
  {
    id: 'threshold-misuse',
    title: 'Threshold and Limit Misuse',
    domain: 'Law & Regulation',
    severity: 'High',
    status: 'Open',
    summary: 'A screening level, guideline, standard, permit limit, health recommendation, or legal threshold is used outside its actual purpose.',
    indicators: [
      'Guidance treated as law',
      'Average used for peak',
      'Occupational limit misapplied',
      'Wrong population',
    ],
    evidence: [
      'Official source',
      'Threshold purpose',
      'Population scope',
      'Qualified interpretation',
    ],
    determination: 'HOLD the conclusion until the threshold is matched to the correct proposition.',
  },
  {
    id: 'control-failure',
    title: 'Control Design or Operating Failure',
    domain: 'AI Governance',
    severity: 'Critical',
    status: 'Monitoring',
    summary: 'A declared safeguard exists on paper but is absent, bypassed, stale, misconfigured, or ineffective in operation.',
    indicators: [
      'Policy-only control',
      'Bypass path',
      'No test evidence',
      'Unmonitored exception',
    ],
    evidence: [
      'Control design',
      'Operating test',
      'Exception record',
      'Runtime evidence',
    ],
    determination: 'DENY execution where the failed control was required for admissibility.',
  },
  {
    id: 'supersession-risk',
    title: 'Supersession and Historical Reliance',
    domain: 'Standards & Codes',
    severity: 'Medium',
    status: 'Monitoring',
    summary: 'A record remains historically valid but is incorrectly presented as current, controlling, or suitable for future reliance.',
    indicators: [
      'Old edition',
      'Deprecated method',
      'Repealed rule',
      'Unmarked archive',
    ],
    evidence: [
      'Status record',
      'Supersession link',
      'Historical scope',
      'Current source',
    ],
    determination: 'ALLOW historical use only with explicit status and limitation labels.',
  },
  {
    id: 'compound-risk',
    title: 'Compound and Cascading Risk',
    domain: 'Environmental Integrity',
    severity: 'Critical',
    status: 'Escalating',
    summary: 'Multiple individually manageable risks interact across systems, populations, facilities, authorities, or time to create larger consequence.',
    indicators: [
      'Power plus ventilation loss',
      'Wildfire plus indoor infiltration',
      'Model plus data drift',
      'Flood plus contamination',
    ],
    evidence: [
      'Dependency map',
      'Scenario analysis',
      'Escalation plan',
      'Outcome monitoring',
    ],
    determination: 'ESCALATE when combined consequence exceeds the authority or evidence of the original route.',
  },
];

const lifecycle = [
  ["01", "Context", "Define the system, environment, people, activity, authority, place, and consequence under review."],
  ["02", "Identify", "Identify foreseeable hazards, failure modes, dependencies, affected parties, and uncertainty."],
  ["03", "Analyze", "Evaluate likelihood, severity, exposure, detectability, reversibility, and evidence quality."],
  ["04", "Treat", "Design controls, restrictions, escalation, human review, technical barriers, and evidence duties."],
  ["05", "Determine", "Issue ALLOW, HOLD, DENY, or ESCALATE within a bounded and attributable route."],
  ["06", "Bind", "Bind the determination to the correct authority, version, system, subject, time, and action."],
  ["07", "Monitor", "Observe drift, incidents, control failure, environmental change, and new evidence."],
  ["08", "Outcome", "Verify what actually happened and return the result to the risk and governance record."],
] as const;

const failureModes = [
  ["Risk register without execution control", "The organization documents risk but does not prevent an inadmissible action from crossing the commit boundary."],
  ["Generic score without preserved evidence", "A red, amber, or green score hides the measurements, assumptions, authority, and uncertainty supporting it."],
  ["Likelihood used to erase severity", "A low estimated probability is allowed to neutralize catastrophic or irreversible consequence without escalation."],
  ["Control existence confused with control operation", "A policy, feature, or procedure is listed as a mitigation without evidence that it operated for the actual event."],
  ["Residual risk has no owner", "Remaining uncertainty is accepted without a named authority, review date, trigger, or revocation pathway."],
  ["Monitoring without intervention authority", "Drift or failure is detected, but no current actor has authority to hold, deny, stop, or escalate execution."],
  ["Incident closure without outcome evidence", "A ticket is closed because work was completed even though real-world protection was never verified."],
  ["Framework conformity treated as universal permission", "A management or risk framework is used as a substitute for specific legal, technical, and execution authority."],
] as const;

const academyModules = [
  ["RM-01", "Risk language and classification", "Separate hazard, exposure, vulnerability, consequence, uncertainty, control, residual risk, and outcome."],
  ["RM-02", "Evidence-aware risk analysis", "Build risk conclusions from attributable records rather than unsupported scoring conventions."],
  ["RM-03", "Authority and risk acceptance", "Determine who may accept which risk, for what scope, under which instrument, and for how long."],
  ["RM-04", "Control verification", "Test design, implementation, operation, exceptions, bypass paths, and control dependence."],
  ["RM-05", "Environmental consequence", "Evaluate people, buildings, air, water, land, systems, public health, and restoration outcomes."],
  ["RM-06", "AI consequence", "Evaluate automated recommendation, identity, access, payment, health, employment, and public-service routes."],
  ["RM-07", "Residual risk and limitations", "Write bounded findings that preserve uncertainty and prevent universal safety or compliance claims."],
  ["RM-08", "Monitoring and revalidation", "Define triggers, cadence, evidence channels, authority checks, and conditions that reopen determination."],
] as const;

function severityClass(value: RiskSeverity): string {
  return value.toLowerCase();
}

function statusClass(value: RiskStatus): string {
  return value.toLowerCase();
}

export default function RiskManagementPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");
  const [severity, setSeverity] = useState<"All severities" | RiskSeverity>("All severities");
  const [selectedId, setSelectedId] = useState(riskRecords[0].id);
  const [activeStage, setActiveStage] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return riskRecords.filter((record) => {
      const domainMatches = domain === "All domains" || record.domain === domain;
      const severityMatches = severity === "All severities" || record.severity === severity;
      const searchable = [
        record.title,
        record.domain,
        record.severity,
        record.status,
        record.summary,
        record.determination,
        ...record.indicators,
        ...record.evidence,
      ]
        .join(" ")
        .toLowerCase();
      const queryMatches =
        normalized.length === 0 ||
        normalized.split(/\s+/).every((token) => searchable.includes(token));

      return domainMatches && severityMatches && queryMatches;
    });
  }, [domain, query, severity]);

  const selected =
    riskRecords.find((record) => record.id === selectedId) ??
    filtered[0] ??
    riskRecords[0];

  const metrics = useMemo(
    () => ({
      records: riskRecords.length,
      critical: riskRecords.filter((record) => record.severity === "Critical").length,
      domains: new Set(riskRecords.map((record) => record.domain)).size,
      open: riskRecords.filter((record) => record.status === "Open").length,
      evidence: new Set(riskRecords.flatMap((record) => record.evidence)).size,
    }),
    [],
  );

  return (
    <main className="riskPage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="pageShell">
        <header className="topbar">
          <Link href="/governance-library" className="quietAction">
            ← Governance Library
          </Link>
          <div className="topbarState">
            <span />
            Institutional risk-management system
          </div>
          <Link href="/governance-library/applicability" className="primaryAction">
            Resolve Applicability →
          </Link>
        </header>

        <section className="hero">
          <div className="heroCopy">
            <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
            <h1>
              Risk must become
              <em> governed execution conditions.</em>
            </h1>
            <p className="lead">
              TA-14 Institutional Risk Management connects AI, environmental reality,
              law, standards, evidence, authority, controls, determinations, execution,
              and outcome. A risk register may describe concern. A governed route must
              determine what is allowed to happen next and preserve why.
            </p>
            <div className="heroActions">
              <a href="#workspace" className="primaryAction">
                Open Risk Workspace ↓
              </a>
              <Link href="/governance-library/authorities" className="quietAction">
                Resolve Authority ↗
              </Link>
              <Link href="/academy" className="quietAction">
                Enter Risk Academy ↗
              </Link>
            </div>
          </div>

          <div className="heroInstrument" aria-label="TA-14 risk governance instrument">
            <div className="instrumentCore">
              <span>RM</span>
              <strong>Risk Governance</strong>
              <small>EVIDENCE · AUTHORITY · CONTROL · OUTCOME</small>
            </div>
            <i className="orbit orbitA" />
            <i className="orbit orbitB" />
            <i className="orbit orbitC" />
            <div className="instrumentMetrics">
              <article><strong>{metrics.records}</strong><span>Risk records</span></article>
              <article><strong>{metrics.critical}</strong><span>Critical classes</span></article>
              <article><strong>{metrics.domains}</strong><span>Institutional domains</span></article>
            </div>
          </div>
        </section>

        <section className="metricBand">
          <article><span>OPEN RISKS</span><strong>{metrics.open}</strong><p>Require evidence, treatment, determination, or escalation.</p></article>
          <article><span>EVIDENCE TYPES</span><strong>{metrics.evidence}</strong><p>Distinct records associated with the indexed risk classes.</p></article>
          <article><span>DETERMINATIONS</span><strong>4</strong><p>ALLOW, HOLD, DENY, and ESCALATE before consequence.</p></article>
          <article><span>GOVERNING RULE</span><strong>01</strong><p>No admissible evidence. No admissible execution.</p></article>
        </section>

        <section className="domainSection">
          <div className="sectionHeading centered">
            <p className="eyebrow">INSTITUTIONAL RISK DOMAINS</p>
            <h2>Risk does not belong to one department.</h2>
            <p>
              Consequential routes often cross technical, environmental, legal,
              evidentiary, organizational, and public boundaries. The institution keeps
              those boundaries visible while preserving one route to determination.
            </p>
          </div>
          <div className="domainGrid">
            {riskDomains.map((item) => (
              <article key={item.id} style={{ "--accent": item.accent } as CSSProperties}>
                <span>{item.id.slice(0, 2).toUpperCase()}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button type="button" onClick={() => setDomain(item.title)}>
                  Filter this domain →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="workspaceSection" id="workspace">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">RISK CONTROL DESK</p>
              <h2>Find the risk. Inspect the evidence. Determine the boundary.</h2>
            </div>
            <p>
              Select a risk class to inspect indicators, evidence, status, severity,
              and the TA-14 execution determination that should follow.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search risk records
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search authority, evidence, drift, environment, control..."
              />
            </label>
            <label>
              Domain
              <select value={domain} onChange={(event) => setDomain(event.target.value)}>
                <option>All domains</option>
                {riskDomains.map((item) => <option key={item.id}>{item.title}</option>)}
              </select>
            </label>
            <label>
              Severity
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value as "All severities" | RiskSeverity)}
              >
                <option>All severities</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            <button
              type="button"
              className="clearButton"
              onClick={() => {
                setQuery("");
                setDomain("All domains");
                setSeverity("All severities");
              }}
            >
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="riskIndex">
              <div className="indexHeader">
                <span>RISK INDEX</span>
                <strong>{filtered.length} records</strong>
              </div>
              <div className="riskList">
                {filtered.map((record, index) => (
                  <button
                    key={record.id}
                    type="button"
                    className={selected.id === record.id ? "riskButton active" : "riskButton"}
                    onClick={() => setSelectedId(record.id)}
                  >
                    <span className="riskNumber">{String(index + 1).padStart(2, "0")}</span>
                    <span className="riskIdentity">
                      <small>{record.domain}</small>
                      <strong>{record.title}</strong>
                      <em>{record.status}</em>
                    </span>
                    <span className={`severityDot ${severityClass(record.severity)}`} />
                  </button>
                ))}
              </div>
            </aside>

            <article className="riskRecord">
              <div className="recordHeader">
                <div className="recordSeal">{selected.title.split(/\s+/).map((word) => word[0]).join("").slice(0, 3)}</div>
                <div>
                  <p>{selected.domain}</p>
                  <h3>{selected.title}</h3>
                  <span>{selected.summary}</span>
                </div>
                <div className="recordBadges">
                  <b className={`severityBadge ${severityClass(selected.severity)}`}>{selected.severity}</b>
                  <b className={`statusBadge ${statusClass(selected.status)}`}>{selected.status}</b>
                </div>
              </div>

              <div className="recordColumns">
                <section>
                  <div className="cardHeader"><span>RISK INDICATORS</span><strong>{selected.indicators.length}</strong></div>
                  <div className="numberList">
                    {selected.indicators.map((item, index) => (
                      <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="cardHeader"><span>REQUIRED EVIDENCE</span><strong>{selected.evidence.length}</strong></div>
                  <div className="numberList evidenceList">
                    {selected.evidence.map((item, index) => (
                      <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="determinationCard">
                <div className="determinationSeal">T14</div>
                <div>
                  <span>TA-14 RISK DETERMINATION</span>
                  <p>{selected.determination}</p>
                </div>
              </section>

              <div className="recordActions">
                <Link href="/governance-library/applicability" className="quietAction">Resolve applicability</Link>
                <Link href="/governance-library/authorities" className="quietAction">Resolve authority</Link>
                <Link href="/workspace/entity-review" className="primaryAction">Submit for review →</Link>
              </div>
            </article>
          </div>
        </section>

        <section className="lifecycleSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TA-14 RISK LIFECYCLE</p>
              <h2>Risk management must continue through outcome.</h2>
            </div>
            <p>
              A route is not governed merely because risk was assessed at the beginning.
              Each stage must remain attributable, reviewable, and capable of stopping execution.
            </p>
          </div>
          <div className="lifecycleInterface">
            <div className="lifecycleTrack">
              {lifecycle.map(([code, title], index) => (
                <button
                  type="button"
                  key={code}
                  className={activeStage === index ? "active" : ""}
                  onClick={() => setActiveStage(index)}
                >
                  <span>{code}</span>
                  <strong>{title}</strong>
                  {index < lifecycle.length - 1 ? <i>→</i> : null}
                </button>
              ))}
            </div>
            <article className="stageDetail">
              <span>STAGE {lifecycle[activeStage][0]}</span>
              <h3>{lifecycle[activeStage][1]}</h3>
              <p>{lifecycle[activeStage][2]}</p>
              <div>
                <strong>Governing question</strong>
                <p>{[
                  "What exactly is being governed, who may be affected, and what consequence could bind to reality?",
                  "Which hazards, dependencies, failure modes, populations, and unknowns must be made visible?",
                  "What evidence supports likelihood, severity, exposure, reversibility, and uncertainty?",
                  "Which controls are required, who owns them, and how will operation be verified?",
                  "What bounded state is supported before the action crosses the commit boundary?",
                  "Is the determination bound to the correct system, version, authority, place, subject, and time?",
                  "What changes, incidents, exceptions, or new evidence require hold, denial, escalation, or revalidation?",
                  "What happened in reality, did the control and action work, and what must change for future reliance?",
                ][activeStage]}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="matrixSection">
          <div className="sectionHeading centered">
            <p className="eyebrow">CONSEQUENCE MATRIX</p>
            <h2>Likelihood does not erase consequence.</h2>
            <p>
              TA-14 uses matrices as orientation, not as authority. High-consequence,
              irreversible, rights-affecting, public-health, or environmentally persistent
              routes may require escalation even when estimated likelihood is low.
            </p>
          </div>
          <div className="riskMatrix">
            <div className="matrixCorner">LIKELIHOOD<br />×<br />CONSEQUENCE</div>
            {['Limited','Material','Serious','Severe','Catastrophic'].map((item) => <div className="matrixHead" key={item}>{item}</div>)}
            {['Rare','Unlikely','Possible','Likely','Frequent'].map((row, rowIndex) => (
              <div className="matrixRow" key={row}>
                <div className="rowHead">{row}</div>
                {[0,1,2,3,4].map((columnIndex) => {
                  const score = rowIndex + columnIndex;
                  const level = score <= 2 ? 'low' : score <= 4 ? 'medium' : score <= 6 ? 'high' : 'critical';
                  return <div key={columnIndex} className={`matrixCell ${level}`}><span>{level.toUpperCase()}</span><small>{score + 1}</small></div>;
                })}
              </div>
            ))}
          </div>
          <div className="matrixBoundary">
            <strong>Matrix boundary</strong>
            <p>A matrix does not decide authority, legal applicability, evidence admissibility, or permission to execute. It supports—not replaces—the governed determination.</p>
          </div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">RISK GOVERNANCE FAILURE MODES</p>
              <h2>Where conventional risk programs become too weak.</h2>
            </div>
            <p>
              The institution teaches these failures so reviewers can recognize when a
              risk process creates confidence without creating control.
            </p>
          </div>
          <div className="failureGrid">
            {failureModes.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="academySection">
          <div className="academyVisual" aria-hidden="true">
            <div className="academyCore"><small>TA-14</small><strong>RISK</strong><span>ACADEMY</span></div>
            <i className="academyOrbit academyA" />
            <i className="academyOrbit academyB" />
            <i className="academyOrbit academyC" />
          </div>
          <div className="academyCopy">
            <p className="eyebrow">THE ACADEMY INSIDE RISK MANAGEMENT</p>
            <h2>Learn the risk. Build the evidence. Practice the determination.</h2>
            <p>
              The Risk Management Academy teaches participants why each element matters,
              how weak risk claims fail, how controls are verified, and when a route must
              move from ALLOW to HOLD, DENY, or ESCALATE.
            </p>
            <div className="academyGrid">
              {academyModules.map(([code, title, text]) => (
                <article key={code}>
                  <span>{code}</span>
                  <div><strong>{title}</strong><p>{text}</p></div>
                </article>
              ))}
            </div>
            <div className="academyActions">
              <Link href="/academy" className="primaryAction">Enter TA-14 Academy →</Link>
              <Link href="/academy/simulation-center" className="quietAction">Open Simulation Center</Link>
            </div>
          </div>
        </section>

        <section className="closingSection">
          <p className="eyebrow">TA-14 INSTITUTIONAL RISK MANAGEMENT</p>
          <h2>Do not merely record risk. Govern what may happen next.</h2>
          <p>
            Identify the risk, preserve the evidence, resolve the authority, verify the
            control, issue the determination, bind the execution, and return the outcome
            to the record.
          </p>
          <div className="closingActions">
            <a href="#workspace" className="primaryAction">Return to Risk Workspace ↑</a>
            <Link href="/workspace/entity-review" className="quietAction">Begin Entity Review</Link>
            <Link href="/governance-library" className="quietAction">Return to Governance Library</Link>
          </div>
          <strong className="finalRule">No admissible evidence. No admissible execution.</strong>
        </section>

        <footer>
          <span>TA-14 Authority Governance Institution</span>
          <span>Institutional Risk Management · TA14Authority.org</span>
        </footer>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #020810;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f7fbff;
          background: #020810;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .riskPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% -8%, rgba(51, 133, 199, 0.18), transparent 34%),
            linear-gradient(180deg, rgba(2, 8, 16, 0.72), rgba(3, 9, 15, 0.96));
        }

        .background {
          position: fixed;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(circle at 15% 24%, rgba(81, 192, 255, 0.08), transparent 27%),
            radial-gradient(circle at 86% 68%, rgba(255, 183, 73, 0.07), transparent 25%);
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(102, 205, 244, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 205, 244, 0.2) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(to bottom, black, transparent 92%);
        }

        .glow {
          position: absolute;
          width: 720px;
          height: 720px;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.12;
          animation: floatGlow 18s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -280px;
          top: 18%;
          background: #138fd2;
        }

        .glowTwo {
          right: -300px;
          top: 56%;
          background: #c1832c;
          animation-delay: -8s;
        }

        .route {
          position: absolute;
          width: 74vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(88, 193, 243, 0.56), rgba(255, 202, 98, 0.45), transparent);
          filter: drop-shadow(0 0 7px rgba(88, 193, 243, 0.44));
        }

        .route::after {
          content: "";
          position: absolute;
          top: -3px;
          left: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff0a8;
          box-shadow: 0 0 18px rgba(255, 222, 105, 0.92);
          animation: packet 8s linear infinite;
        }

        .routeOne {
          left: -18%;
          top: 26%;
          transform: rotate(-8deg);
        }

        .routeTwo {
          right: -20%;
          top: 72%;
          transform: rotate(9deg);
        }

        .pageShell {
          width: min(1500px, calc(100% - 38px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
          padding: 18px 0 80px;
        }

        .topbar {
          min-height: 68px;
          padding: 11px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(109, 209, 239, 0.13);
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(9, 28, 44, 0.88), rgba(4, 15, 25, 0.82));
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(16px);
        }

        .quietAction,
        .primaryAction {
          min-height: 46px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
        }

        .quietAction {
          color: #c5d6de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.17);
        }

        .primaryAction {
          color: #03151d;
          border: 1px solid #a8ecfa;
          background: linear-gradient(135deg, #d7fbff, #72d9ed 63%, #349dbd);
          box-shadow: 0 12px 28px rgba(57, 174, 207, 0.16);
        }

        .quietAction:hover,
        .primaryAction:hover {
          transform: translateY(-3px);
        }

        .topbar > .quietAction {
          justify-self: start;
        }

        .topbar > .primaryAction {
          justify-self: end;
        }

        .topbarState {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #829da8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topbarState span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6ce6b0;
          box-shadow: 0 0 15px rgba(108, 230, 176, 0.88);
        }

        .hero {
          min-height: 760px;
          padding: 88px 0 78px;
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(440px, 0.88fr);
          gap: 72px;
          align-items: center;
        }

        .eyebrow {
          margin: 0;
          color: #6ddff3;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero h1,
        .sectionHeading h2,
        .academyCopy h2,
        .closingSection h2 {
          margin: 14px 0 20px;
          font-family: Georgia, "Times New Roman", serif;
          line-height: 0.97;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .hero h1 {
          max-width: 900px;
          font-size: clamp(54px, 6.4vw, 94px);
        }

        .hero h1 em {
          display: block;
          color: #ffd164;
          font-style: italic;
          font-weight: 500;
          text-shadow: 0 0 34px rgba(255, 202, 75, 0.14);
        }

        .lead {
          max-width: 860px;
          margin: 0;
          color: #b5c8d0;
          font-size: 18px;
          line-height: 1.72;
        }

        .heroActions,
        .recordActions,
        .academyActions,
        .closingActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 30px;
        }

        .heroInstrument {
          min-height: 590px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .instrumentCore {
          width: 245px;
          height: 245px;
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid rgba(255, 211, 109, 0.54);
          background: radial-gradient(circle at 50% 38%, rgba(255, 225, 138, 0.15), rgba(5, 23, 36, 0.95) 66%);
          box-shadow: 0 0 75px rgba(75, 190, 230, 0.2), inset 0 0 38px rgba(255, 213, 111, 0.07);
          text-align: center;
        }

        .instrumentCore > span {
          color: #ffe29a;
          font-family: Georgia, serif;
          font-size: 65px;
          font-weight: 900;
        }

        .instrumentCore strong {
          font-family: Georgia, serif;
          font-size: 22px;
        }

        .instrumentCore small {
          max-width: 180px;
          margin-top: 8px;
          color: #74c9dc;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.13em;
        }

        .orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(103, 211, 238, 0.28);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: orbitSpin 24s linear infinite;
        }

        .orbitA {
          width: 340px;
          height: 450px;
        }

        .orbitB {
          width: 470px;
          height: 280px;
          animation-direction: reverse;
          animation-duration: 19s;
        }

        .orbitC {
          width: 530px;
          height: 530px;
          border-color: rgba(255, 210, 98, 0.16);
          animation-duration: 36s;
        }

        .instrumentMetrics {
          width: min(100%, 520px);
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .instrumentMetrics article {
          padding: 14px 10px;
          border: 1px solid rgba(103, 211, 238, 0.13);
          border-radius: 12px;
          background: rgba(5, 22, 33, 0.82);
          text-align: center;
        }

        .instrumentMetrics strong {
          display: block;
          color: #ffe6a6;
          font-family: Georgia, serif;
          font-size: 25px;
        }

        .instrumentMetrics span {
          display: block;
          margin-top: 4px;
          color: #78929c;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .metricBand {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
          padding-bottom: 88px;
        }

        .metricBand article {
          padding: 23px;
          border: 1px solid rgba(101, 207, 237, 0.12);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(10, 31, 46, 0.8), rgba(4, 16, 25, 0.86));
        }

        .metricBand span {
          color: #7395a2;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.13em;
        }

        .metricBand strong {
          display: block;
          margin-top: 12px;
          color: #f0ce84;
          font-family: Georgia, serif;
          font-size: 34px;
        }

        .metricBand p {
          margin: 8px 0 0;
          color: #879fa9;
          font-size: 11px;
          line-height: 1.5;
        }

        .domainSection,
        .workspaceSection,
        .lifecycleSection,
        .matrixSection,
        .failureSection,
        .academySection,
        .closingSection {
          padding: 92px 0;
        }

        .sectionHeading {
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 42px;
          align-items: end;
        }

        .sectionHeading.centered {
          display: block;
          margin-inline: auto;
          text-align: center;
        }

        .sectionHeading h2,
        .academyCopy h2,
        .closingSection h2 {
          font-size: clamp(42px, 5vw, 74px);
        }

        .sectionHeading > p,
        .sectionHeading.centered > p:last-child,
        .academyCopy > p,
        .closingSection > p {
          margin: 0;
          color: #a0b5be;
          font-size: 16px;
          line-height: 1.72;
        }

        .sectionHeading.centered > p:last-child {
          max-width: 920px;
          margin-inline: auto;
        }

        .domainGrid {
          margin-top: 42px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .domainGrid article {
          min-height: 285px;
          padding: 25px;
          position: relative;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(10, 33, 48, 0.84), rgba(3, 16, 25, 0.92));
        }

        .domainGrid article::after {
          content: "";
          position: absolute;
          right: -70px;
          bottom: -80px;
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: var(--accent);
          filter: blur(65px);
          opacity: 0.1;
        }

        .domainGrid article > span {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          border: 1px solid var(--accent);
          color: var(--accent);
          font-size: 11px;
          font-weight: 950;
        }

        .domainGrid h3 {
          margin: 24px 0 11px;
          font-family: Georgia, serif;
          font-size: 26px;
        }

        .domainGrid p {
          color: #91a7b0;
          font-size: 12px;
          line-height: 1.6;
        }

        .domainGrid button {
          margin-top: 18px;
          padding: 0;
          border: 0;
          color: var(--accent);
          background: none;
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
        }

        .filterPanel {
          margin-top: 34px;
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 230px 190px auto;
          gap: 12px;
          align-items: end;
          border: 1px solid rgba(104, 211, 238, 0.13);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(9, 29, 43, 0.95), rgba(3, 14, 23, 0.98));
        }

        label {
          display: grid;
          gap: 8px;
          color: #789aa7;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e9f3f7;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        select option {
          color: #e9f3f7;
          background: #071520;
        }

        .clearButton {
          min-height: 48px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b3c5cd;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 405px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .riskIndex,
        .riskRecord {
          border: 1px solid rgba(104, 211, 238, 0.13);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(9, 29, 43, 0.95), rgba(3, 14, 23, 0.98));
        }

        .riskIndex {
          position: sticky;
          top: 18px;
          padding: 18px;
        }

        .indexHeader {
          padding: 3px 2px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeader span {
          color: #69d9ec;
          font-size: 8px;
          font-weight: 900;
        }

        .indexHeader strong {
          color: #edcb81;
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .riskList {
          margin-top: 13px;
          display: grid;
          gap: 8px;
        }

        .riskButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 10px;
          gap: 11px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.2s, transform 0.2s;
        }

        .riskButton:hover,
        .riskButton.active {
          transform: translateX(4px);
          border-color: rgba(103, 218, 242, 0.3);
          background: rgba(103, 218, 242, 0.045);
        }

        .riskNumber {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(103, 218, 242, 0.14);
          border-radius: 10px;
          color: #65d7e9;
          font-size: 8px;
          font-weight: 900;
        }

        .riskIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .riskIdentity small {
          color: #718894;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .riskIdentity strong {
          color: #dce8ed;
          font-size: 11px;
        }

        .riskIdentity em {
          color: #758b95;
          font-size: 8px;
          font-style: normal;
        }

        .severityDot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .severityDot.low,
        .severityBadge.low {
          background: #6ee5ad;
        }

        .severityDot.medium,
        .severityBadge.medium {
          background: #65cbea;
        }

        .severityDot.high,
        .severityBadge.high {
          background: #f0c461;
        }

        .severityDot.critical,
        .severityBadge.critical {
          background: #ff7185;
        }

        .riskRecord {
          padding: 27px;
        }

        .recordHeader {
          display: grid;
          grid-template-columns: 74px minmax(0, 1fr) auto;
          gap: 18px;
          align-items: start;
        }

        .recordSeal {
          width: 74px;
          height: 74px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 203, 91, 0.28);
          border-radius: 50%;
          color: #f1cc7b;
          font-family: Georgia, serif;
          font-size: 19px;
          font-weight: 800;
        }

        .recordHeader p {
          margin: 0;
          color: #69d8ec;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordHeader h3 {
          margin: 7px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(32px, 3vw, 46px);
          line-height: 1;
        }

        .recordHeader div > span {
          display: block;
          margin-top: 11px;
          color: #92a8b1;
          font-size: 12px;
          line-height: 1.6;
        }

        .recordBadges {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .severityBadge,
        .statusBadge {
          padding: 8px 10px;
          border-radius: 999px;
          color: #071019;
          font-size: 7px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .statusBadge {
          color: #b9cbd2;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
        }

        .statusBadge.escalating {
          color: #f0ca76;
          border-color: rgba(240, 202, 118, 0.3);
        }

        .statusBadge.monitoring {
          color: #77d9ef;
          border-color: rgba(119, 217, 239, 0.3);
        }

        .statusBadge.controlled {
          color: #79e5b2;
          border-color: rgba(121, 229, 178, 0.3);
        }

        .recordColumns {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .recordColumns > section {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.13);
        }

        .cardHeader {
          padding-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeader span {
          color: #70d9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .cardHeader strong {
          color: #edc97c;
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .numberList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .numberList > div {
          display: grid;
          grid-template-columns: 33px 1fr;
          gap: 10px;
          align-items: center;
        }

        .numberList span {
          width: 33px;
          height: 33px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(104, 216, 240, 0.13);
          border-radius: 9px;
          color: #66d7e8;
          font-size: 7px;
        }

        .numberList p {
          margin: 0;
          color: #9eb1b9;
          font-size: 10px;
        }

        .evidenceList span {
          color: #e7bf68;
          border-color: rgba(231, 191, 104, 0.15);
        }

        .determinationCard {
          margin-top: 14px;
          padding: 20px;
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 17px;
          align-items: center;
          border: 1px solid rgba(255, 202, 87, 0.2);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(55, 40, 10, 0.26), rgba(3, 16, 24, 0.75));
        }

        .determinationSeal {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 202, 87, 0.25);
          border-radius: 50%;
          color: #efc776;
          font-family: Georgia, serif;
        }

        .determinationCard span {
          color: #e2b85b;
          font-size: 8px;
          font-weight: 900;
        }

        .determinationCard p {
          margin: 8px 0 0;
          color: #d5e0e4;
          font-size: 13px;
          line-height: 1.62;
        }

        .recordActions {
          justify-content: flex-end;
          margin-top: 17px;
        }

        .lifecycleInterface {
          margin-top: 38px;
          overflow: hidden;
          border: 1px solid rgba(104, 216, 240, 0.14);
          border-radius: 24px;
          background: rgba(4, 18, 27, 0.84);
        }

        .lifecycleTrack {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          border-bottom: 1px solid rgba(104, 216, 240, 0.12);
        }

        .lifecycleTrack button {
          min-width: 0;
          padding: 21px 7px;
          position: relative;
          border: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          color: #7e98a3;
          background: transparent;
          cursor: pointer;
        }

        .lifecycleTrack button:last-child {
          border-right: 0;
        }

        .lifecycleTrack button.active {
          color: #fff1bd;
          background: linear-gradient(180deg, rgba(255, 207, 93, 0.11), rgba(92, 206, 235, 0.06));
          box-shadow: inset 0 -3px #ffd05e;
        }

        .lifecycleTrack span,
        .lifecycleTrack strong {
          display: block;
        }

        .lifecycleTrack span {
          font-size: 8px;
        }

        .lifecycleTrack strong {
          margin-top: 7px;
          font-size: 10px;
        }

        .lifecycleTrack i {
          position: absolute;
          right: -6px;
          top: 50%;
          z-index: 2;
          color: #487d8b;
          font-style: normal;
        }

        .stageDetail {
          padding: 42px;
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 7px 30px;
        }

        .stageDetail > span {
          grid-row: 1 / 4;
          color: #63d7eb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .stageDetail h3 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 47px;
        }

        .stageDetail > p {
          margin: 0;
          color: #a9bbc3;
          font-size: 16px;
          line-height: 1.65;
        }

        .stageDetail > div {
          grid-column: 2;
          margin-top: 17px;
          padding: 19px;
          border-left: 3px solid #ffd05e;
          background: rgba(255, 208, 94, 0.045);
        }

        .stageDetail > div strong {
          color: #e9be61;
          font-size: 8px;
          letter-spacing: 0.13em;
        }

        .stageDetail > div p {
          margin: 8px 0 0;
          color: #d3dfe3;
          font-family: Georgia, serif;
          font-size: 18px;
          line-height: 1.5;
        }

        .riskMatrix {
          max-width: 1150px;
          margin: 42px auto 0;
          display: grid;
          grid-template-columns: 140px repeat(5, 1fr);
          gap: 7px;
        }

        .matrixCorner,
        .matrixHead,
        .rowHead,
        .matrixCell {
          min-height: 82px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          text-align: center;
        }

        .matrixCorner {
          color: #7594a0;
          font-size: 8px;
          font-weight: 900;
          line-height: 1.5;
        }

        .matrixHead,
        .rowHead {
          color: #9eb2ba;
          background: rgba(8, 27, 40, 0.74);
          font-size: 9px;
          font-weight: 900;
        }

        .matrixRow {
          display: contents;
        }

        .matrixCell {
          min-height: 96px;
          gap: 4px;
          align-content: center;
        }

        .matrixCell span {
          font-size: 9px;
          font-weight: 950;
        }

        .matrixCell small {
          color: rgba(255, 255, 255, 0.48);
          font-size: 8px;
        }

        .matrixCell.low {
          color: #70e5ae;
          background: rgba(69, 189, 127, 0.1);
        }

        .matrixCell.medium {
          color: #6dd8ed;
          background: rgba(70, 176, 210, 0.1);
        }

        .matrixCell.high {
          color: #f0c564;
          background: rgba(224, 166, 58, 0.11);
        }

        .matrixCell.critical {
          color: #ff788c;
          background: rgba(224, 73, 96, 0.11);
        }

        .matrixBoundary {
          max-width: 980px;
          margin: 18px auto 0;
          padding: 18px;
          border-left: 3px solid #ffd05e;
          background: rgba(255, 208, 94, 0.045);
        }

        .matrixBoundary strong {
          color: #e8bc5c;
          font-size: 8px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .matrixBoundary p {
          margin: 7px 0 0;
          color: #b7c5ca;
          font-size: 12px;
          line-height: 1.6;
        }

        .failureGrid {
          margin-top: 38px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }

        .failureGrid article {
          min-height: 270px;
          padding: 23px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(10, 31, 45, 0.78), rgba(3, 15, 23, 0.9));
        }

        .failureGrid article > span {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 119, 139, 0.22);
          border-radius: 50%;
          color: #ff7a8e;
          font-size: 8px;
        }

        .failureGrid h3 {
          margin: 24px 0 10px;
          font-family: Georgia, serif;
          font-size: 23px;
          line-height: 1.1;
        }

        .failureGrid p {
          margin: 0;
          color: #8fa5ae;
          font-size: 11px;
          line-height: 1.6;
        }

        .academySection {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 60px;
          align-items: center;
          border-top: 1px solid rgba(104, 216, 240, 0.12);
          border-bottom: 1px solid rgba(104, 216, 240, 0.12);
        }

        .academyVisual {
          min-height: 540px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .academyCore {
          width: 250px;
          height: 250px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #69e9b0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(105, 233, 176, 0.15), rgba(3, 24, 30, 0.95));
          box-shadow: 0 0 70px rgba(85, 223, 162, 0.18);
        }

        .academyCore small {
          color: #72bca1;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .academyCore strong {
          color: #b8ffda;
          font-family: Georgia, serif;
          font-size: 48px;
        }

        .academyCore span {
          margin-top: 4px;
          color: #67dba8;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .academyOrbit {
          position: absolute;
          border: 1px solid rgba(105, 233, 176, 0.25);
          border-radius: 50%;
          animation: academySpin 24s linear infinite;
        }

        .academyA {
          width: 340px;
          height: 460px;
        }

        .academyB {
          width: 480px;
          height: 290px;
          animation-direction: reverse;
        }

        .academyC {
          width: 520px;
          height: 520px;
          border-color: rgba(255, 208, 94, 0.13);
          animation-duration: 38s;
        }

        .academyGrid {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .academyGrid article {
          padding: 14px;
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: 12px;
          border: 1px solid rgba(105, 233, 176, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.022);
        }

        .academyGrid article > span {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(105, 233, 176, 0.34);
          border-radius: 11px;
          color: #7eeabb;
          font-size: 8px;
          font-weight: 900;
        }

        .academyGrid strong {
          font-size: 11px;
        }

        .academyGrid p {
          margin: 5px 0 0;
          color: #7d969f;
          font-size: 9px;
          line-height: 1.45;
        }

        .closingSection {
          text-align: center;
        }

        .closingSection > p {
          max-width: 900px;
          margin-inline: auto;
        }

        .closingActions {
          justify-content: center;
        }

        .finalRule {
          display: block;
          margin-top: 28px;
          color: #ffe29a;
          font-family: Georgia, serif;
          font-size: 22px;
        }

        footer {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(104, 216, 240, 0.12);
          color: #5f7b86;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        @keyframes floatGlow {
          to {
            transform: translate3d(70px, -35px, 0) scale(1.08);
          }
        }

        @keyframes packet {
          from {
            left: 0;
          }
          to {
            left: 100%;
          }
        }

        @keyframes orbitSpin {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes academySpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1180px) {
          .hero {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .heroInstrument {
            min-height: 560px;
          }

          .domainGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .riskIndex {
            position: static;
          }

          .lifecycleTrack {
            grid-template-columns: repeat(4, 1fr);
          }

          .failureGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .academySection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 820px) {
          .pageShell {
            width: min(100% - 24px, 1500px);
          }

          .topbar {
            grid-template-columns: 1fr auto;
          }

          .topbarState {
            display: none;
          }

          .hero {
            padding: 66px 0;
          }

          .hero h1 {
            font-size: 54px;
          }

          .metricBand,
          .domainGrid,
          .recordColumns,
          .academyGrid {
            grid-template-columns: 1fr;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
          }

          .filterPanel {
            grid-template-columns: 1fr;
          }

          .recordHeader {
            grid-template-columns: 70px 1fr;
          }

          .recordBadges {
            grid-column: 1 / -1;
            justify-content: flex-start;
          }

          .stageDetail {
            grid-template-columns: 1fr;
          }

          .stageDetail > span {
            grid-row: auto;
          }

          .stageDetail > div {
            grid-column: 1;
          }

          .riskMatrix {
            grid-template-columns: 100px repeat(5, minmax(90px, 1fr));
            overflow-x: auto;
          }
        }

        @media (max-width: 620px) {
          .topbar {
            grid-template-columns: 1fr;
          }

          .topbar > .quietAction,
          .topbar > .primaryAction {
            width: 100%;
            justify-self: stretch;
          }

          .hero h1 {
            font-size: 46px;
          }

          .lead {
            font-size: 15px;
          }

          .heroInstrument {
            min-height: 430px;
            transform: scale(0.78);
            margin: -44px 0;
          }

          .instrumentMetrics {
            grid-template-columns: 1fr;
          }

          .instrumentMetrics article:nth-child(n + 2) {
            display: none;
          }

          .lifecycleTrack {
            grid-template-columns: 1fr 1fr;
          }

          .failureGrid {
            grid-template-columns: 1fr;
          }

          .recordHeader {
            grid-template-columns: 1fr;
          }

          .determinationCard {
            grid-template-columns: 1fr;
          }

          .heroActions > *,
          .recordActions > *,
          .academyActions > *,
          .closingActions > * {
            width: 100%;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
