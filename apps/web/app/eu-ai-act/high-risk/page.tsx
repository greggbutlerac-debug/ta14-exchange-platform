// apps/web/app/eu-ai-act/high-risk/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type ClassificationPath =
  | 'Safety component of a regulated product'
  | 'Annex III use case'
  | 'Potential exception or exclusion'
  | 'Unclear';

type LifecycleStage =
  | 'Classification'
  | 'Development'
  | 'Pre-market'
  | 'Deployment'
  | 'Operation'
  | 'Incident or corrective action';

type GateState = 'OPEN' | 'HOLD' | 'REVIEW' | 'NOT STARTED';

type Gate = {
  id: string;
  stage: LifecycleStage;
  title: string;
  owner: string;
  purpose: string;
  evidence: string[];
  failureStates: string[];
  outputs: string[];
};

const gates: Gate[] = [
  {
    id: 'TA-14-HR-01',
    stage: 'Classification',
    title: 'High-risk applicability determination',
    owner: 'Provider or responsible economic operator',
    purpose:
      'Determine whether the system is high-risk because it is a safety component of a regulated product, falls within an Annex III use case, or qualifies for an applicable exception.',
    evidence: [
      'System identity and intended purpose',
      'Product-sector classification',
      'Annex I and Annex III analysis',
      'Deployment-context record',
      'Exception or exclusion analysis',
      'Versioned classification decision',
    ],
    failureStates: [
      'Intended purpose is undefined',
      'System version is not identified',
      'Annex analysis is missing',
      'Exception is asserted without evidence',
    ],
    outputs: [
      'Classification record',
      'Applicable-role map',
      'Exception record',
      'Independent-review referral',
    ],
  },
  {
    id: 'TA-14-HR-02',
    stage: 'Development',
    title: 'Risk-management system',
    owner: 'Provider',
    purpose:
      'Establish a continuous, iterative lifecycle process for identifying, estimating, evaluating, mitigating, testing, and monitoring risks.',
    evidence: [
      'Known and foreseeable risk inventory',
      'Risk-estimation method',
      'Risk-acceptance thresholds',
      'Mitigation decisions',
      'Residual-risk determination',
      'Testing and post-market feedback route',
    ],
    failureStates: [
      'Risks are described but not evaluated',
      'No declared acceptance threshold',
      'Mitigations are not tested',
      'Residual risk has no accountable determination',
    ],
    outputs: [
      'Risk register',
      'Mitigation record',
      'Residual-risk decision',
      'Lifecycle review schedule',
    ],
  },
  {
    id: 'TA-14-HR-03',
    stage: 'Development',
    title: 'Data-governance and data-quality controls',
    owner: 'Provider',
    purpose:
      'Preserve data provenance, preparation, relevance, representativeness, quality, bias analysis, and known limitations.',
    evidence: [
      'Dataset identities and lineage',
      'Collection and preparation methods',
      'Relevance and representativeness testing',
      'Bias and gap analysis',
      'Data-quality controls',
      'Version and change history',
    ],
    failureStates: [
      'Dataset origin is unknown',
      'Training, validation, and testing sets are not distinguished',
      'Bias analysis is absent',
      'Data changes are not versioned',
    ],
    outputs: [
      'Dataset admissibility record',
      'Data limitation record',
      'Bias-evaluation record',
      'Version continuity record',
    ],
  },
  {
    id: 'TA-14-HR-04',
    stage: 'Development',
    title: 'Technical documentation',
    owner: 'Provider',
    purpose:
      'Create a coherent technical package that demonstrates the system architecture, development process, performance, controls, limitations, and conformity route.',
    evidence: [
      'System and architecture description',
      'Model and data documentation',
      'Development methods',
      'Performance and limitation evidence',
      'Risk controls',
      'Change and version history',
    ],
    failureStates: [
      'Claims cannot be tied to evidence',
      'Documentation does not match the deployed version',
      'Limitations are omitted',
      'Material changes are not recorded',
    ],
    outputs: [
      'Governed technical record',
      'Evidence-to-claim map',
      'Versioned architecture record',
      'Conformity evidence package',
    ],
  },
  {
    id: 'TA-14-HR-05',
    stage: 'Development',
    title: 'Logging and record-keeping architecture',
    owner: 'Provider with deployer responsibilities where logs are controlled',
    purpose:
      'Ensure the system can automatically record relevant events and preserve identity, timing, continuity, integrity, retention, and access.',
    evidence: [
      'Event taxonomy',
      'Logging architecture',
      'Timestamp and identity controls',
      'Retention policy',
      'Integrity and access controls',
      'Replay and incident evidence',
    ],
    failureStates: [
      'Material events are not logged',
      'Logs cannot be tied to a system version',
      'Time or identity is unreliable',
      'Retention is shorter than the declared need',
    ],
    outputs: [
      'Logging specification',
      'Admissible event record',
      'Replay-verification record',
      'Retention and access record',
    ],
  },
  {
    id: 'TA-14-HR-06',
    stage: 'Development',
    title: 'Transparency and instructions for use',
    owner: 'Provider',
    purpose:
      'Provide deployers with enough information to interpret outputs, understand limitations, assign oversight, and operate the system appropriately.',
    evidence: [
      'Intended purpose',
      'Instructions for use',
      'Performance characteristics',
      'Known limitations',
      'Input requirements',
      'Maintenance and update instructions',
    ],
    failureStates: [
      'Instructions omit material limitations',
      'Performance claims have no evidence',
      'Operator dependencies are undefined',
      'Instructions are not updated after material change',
    ],
    outputs: [
      'Instruction record',
      'Limitation record',
      'Operator dependency map',
      'Change-notification record',
    ],
  },
  {
    id: 'TA-14-HR-07',
    stage: 'Development',
    title: 'Human oversight design',
    owner: 'Provider and deployer',
    purpose:
      'Define who can understand, intervene, override, stop, escalate, and accept responsibility for consequential system operation.',
    evidence: [
      'Oversight-role definition',
      'Competency evidence',
      'Intervention and stop controls',
      'Alert and escalation design',
      'Automation-bias safeguards',
      'Override and outcome records',
    ],
    failureStates: [
      'No authorised human is assigned',
      'The assigned person lacks sufficient information',
      'Stop or override controls are unavailable',
      'Intervention outcomes are not recorded',
    ],
    outputs: [
      'Authority record',
      'Oversight route',
      'Override record',
      'HOLD and ESCALATE record',
    ],
  },
  {
    id: 'TA-14-HR-08',
    stage: 'Development',
    title: 'Accuracy, robustness, and cybersecurity',
    owner: 'Provider with deployer operational controls',
    purpose:
      'Declare, test, monitor, and maintain appropriate performance, robustness, resilience, and cybersecurity throughout the lifecycle.',
    evidence: [
      'Declared performance metrics',
      'Validation and test results',
      'Robustness testing',
      'Cybersecurity controls',
      'Failure-mode analysis',
      'Corrective-action records',
    ],
    failureStates: [
      'No declared threshold exists',
      'Testing does not match intended use',
      'Known failure modes are not bounded',
      'Operational degradation is not monitored',
    ],
    outputs: [
      'Performance baseline',
      'Threshold record',
      'Failure-state route',
      'Post-intervention comparison',
    ],
  },
  {
    id: 'TA-14-HR-09',
    stage: 'Pre-market',
    title: 'Quality-management system',
    owner: 'Provider',
    purpose:
      'Bind compliance strategy, design controls, testing, records, responsibility, supplier controls, change management, and corrective action into one governed system.',
    evidence: [
      'Quality policy and procedures',
      'Responsibility matrix',
      'Design and development controls',
      'Testing and validation procedures',
      'Supplier controls',
      'Corrective and preventive actions',
    ],
    failureStates: [
      'Responsibilities are unclear',
      'Procedures are not followed in practice',
      'Supplier changes bypass review',
      'Corrective actions are not closed',
    ],
    outputs: [
      'Quality-system record',
      'Role and authority map',
      'Change-control route',
      'Corrective-action evidence chain',
    ],
  },
  {
    id: 'TA-14-HR-10',
    stage: 'Pre-market',
    title: 'Conformity assessment, declaration, marking, and registration',
    owner: 'Provider and other responsible economic operators',
    purpose:
      'Complete the applicable conformity route before market placement or use, preserve the declaration, marking, registration, and substantial-modification analysis.',
    evidence: [
      'Conformity-assessment route',
      'Assessment evidence package',
      'EU declaration of conformity',
      'CE-marking record',
      'Registration record',
      'Substantial-modification analysis',
    ],
    failureStates: [
      'Assessment route is not established',
      'Evidence package is incomplete',
      'Registration does not match the system version',
      'A substantial modification bypasses reassessment',
    ],
    outputs: [
      'Conformity decision record',
      'Declaration record',
      'Registration continuity record',
      'Modification reassessment route',
    ],
  },
  {
    id: 'TA-14-HR-11',
    stage: 'Deployment',
    title: 'Deployer readiness and operating controls',
    owner: 'Deployer',
    purpose:
      'Confirm that the system is used under instructions, competent oversight is assigned, input data is appropriate, and suspension or escalation routes exist.',
    evidence: [
      'Deployment-context record',
      'Instructions accepted and implemented',
      'Oversight assignment',
      'Input-data relevance analysis',
      'Monitoring plan',
      'Suspension and escalation procedure',
    ],
    failureStates: [
      'Deployment differs materially from intended purpose',
      'Oversight is not assigned',
      'Input data is unsuitable',
      'No suspension pathway exists',
    ],
    outputs: [
      'Deployment authorisation record',
      'Operator readiness record',
      'Input suitability record',
      'Suspend or escalate route',
    ],
  },
  {
    id: 'TA-14-HR-12',
    stage: 'Deployment',
    title: 'Fundamental-rights impact assessment',
    owner: 'Applicable deployer or public authority',
    purpose:
      'Assess affected persons, foreseeable impacts, mitigation, oversight, complaint, remedy, and reassessment triggers before deployment where required.',
    evidence: [
      'Process and deployment description',
      'Affected-person and group analysis',
      'Fundamental-rights risk pathways',
      'Mitigation and oversight measures',
      'Complaint and remedy pathways',
      'Review and notification record',
    ],
    failureStates: [
      'Affected groups are not identified',
      'Risks are described without mitigation',
      'Complaint or remedy routes are absent',
      'Material changes do not trigger reassessment',
    ],
    outputs: [
      'Impact-assessment record',
      'Affected-party evidence map',
      'Mitigation route',
      'Change-triggered reassessment',
    ],
  },
  {
    id: 'TA-14-HR-13',
    stage: 'Operation',
    title: 'Post-market monitoring',
    owner: 'Provider with deployer signal inputs',
    purpose:
      'Collect, analyse, and act on operational performance, complaints, incidents, drift, failure states, and corrective-action signals.',
    evidence: [
      'Post-market monitoring plan',
      'Operational performance data',
      'Complaint and incident signals',
      'Trend and drift records',
      'Corrective-action evidence',
      'Updated risk-management record',
    ],
    failureStates: [
      'Monitoring is passive or undefined',
      'Operational signals are not analysed',
      'Drift is observed but not governed',
      'Corrective action does not update the risk record',
    ],
    outputs: [
      'Operational evidence stream',
      'Drift record',
      'Corrective-action route',
      'Updated outcome determination',
    ],
  },
  {
    id: 'TA-14-HR-14',
    stage: 'Incident or corrective action',
    title: 'Serious incident and corrective-action route',
    owner: 'Provider with deployer cooperation',
    purpose:
      'Preserve incident chronology, severity, authority notification, investigation, correction, prevention, closure, and residual risk.',
    evidence: [
      'Incident identity and chronology',
      'Severity assessment',
      'Authority-notification record',
      'Root-cause evidence',
      'Corrective and preventive action',
      'Closure and residual-risk record',
    ],
    failureStates: [
      'Incident timing is uncertain',
      'Severity is not assessed',
      'Notification duties are not evaluated',
      'Closure occurs without residual-risk determination',
    ],
    outputs: [
      'Incident record',
      'Notification record',
      'Correction evidence package',
      'Closure determination',
    ],
  },
];

const lifecycleStages: Array<'All' | LifecycleStage> = [
  'All',
  'Classification',
  'Development',
  'Pre-market',
  'Deployment',
  'Operation',
  'Incident or corrective action',
];

export default function HighRiskAiWorkspacePage() {
  const [classificationPath, setClassificationPath] =
    useState<ClassificationPath>('Unclear');
  const [stage, setStage] = useState<'All' | LifecycleStage>('All');
  const [query, setQuery] = useState('');
  const [completedGates, setCompletedGates] = useState<string[]>([]);
  const [reviewedGates, setReviewedGates] = useState<string[]>([]);

  const filteredGates = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return gates.filter((gate) => {
      const stageMatch = stage === 'All' || gate.stage === stage;
      const queryMatch =
        !normalized ||
        [
          gate.id,
          gate.stage,
          gate.title,
          gate.owner,
          gate.purpose,
          ...gate.evidence,
          ...gate.failureStates,
          ...gate.outputs,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      return stageMatch && queryMatch;
    });
  }, [query, stage]);

  function toggleCompleted(id: string) {
    setCompletedGates((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleReviewed(id: string) {
    setReviewedGates((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function getGateState(id: string): GateState {
    if (completedGates.includes(id) && reviewedGates.includes(id)) {
      return 'OPEN';
    }

    if (completedGates.includes(id) && !reviewedGates.includes(id)) {
      return 'REVIEW';
    }

    if (!completedGates.includes(id) && reviewedGates.includes(id)) {
      return 'HOLD';
    }

    return 'NOT STARTED';
  }

  const completedCount = completedGates.length;
  const reviewedCount = reviewedGates.length;
  const openCount = gates.filter((gate) => getGateState(gate.id) === 'OPEN').length;

  return (
    <main className="page-shell">
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="orb orb-three" />
        <span className="line line-one" />
        <span className="line line-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <Link href="/eu-ai-act">EU AI Act</Link>
          <span>/</span>
          <span>High-Risk AI Systems</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">HIGH-RISK AI SYSTEMS WORKSPACE</span>
          <h1>Govern the full lifecycle, not merely the classification label.</h1>
          <p className="hero-copy">
            A high-risk designation is only the entrance to the route. The organisation must still
            preserve classification evidence, risk management, data governance, technical
            documentation, logging, human oversight, performance, conformity, deployment controls,
            monitoring, and incident response.
          </p>

          <div className="boundary-banner">
            <strong>Demonstration workspace only.</strong>
            <p>
              This page does not determine legal classification, conduct conformity assessment,
              register systems, issue CE markings, notify authorities, or certify compliance.
            </p>
          </div>

          <div className="action-row">
            <a className="primary-button" href="#classification">
              Start high-risk route
            </a>
            <Link className="secondary-button" href="/eu-ai-act/requirements">
              View all requirements
            </Link>
            <Link className="text-link" href="/marketplace/professionals">
              Find independent review
            </Link>
          </div>
        </header>

        <section className="summary-grid">
          <article>
            <span>Lifecycle gates</span>
            <strong>{gates.length}</strong>
            <p>Classification through serious-incident and corrective-action response.</p>
          </article>
          <article>
            <span>Evidence declared</span>
            <strong>{completedCount}</strong>
            <p>Gates currently marked as having a declared evidence package.</p>
          </article>
          <article>
            <span>Independent review</span>
            <strong>{reviewedCount}</strong>
            <p>Gates currently marked as independently reviewed.</p>
          </article>
          <article>
            <span>Open gates</span>
            <strong>{openCount}</strong>
            <p>Gates with both evidence declared and review declared.</p>
          </article>
        </section>

        <section className="classification-section" id="classification">
          <div className="section-heading">
            <span className="eyebrow">STEP 01 · CLASSIFICATION PATH</span>
            <h2>Declare why the system may be high-risk.</h2>
            <p>
              Classification must remain tied to the actual system identity, intended purpose,
              product context, Annex pathway, deployment context, and any claimed exception.
            </p>
          </div>

          <div className="classification-grid">
            {(
              [
                'Safety component of a regulated product',
                'Annex III use case',
                'Potential exception or exclusion',
                'Unclear',
              ] as ClassificationPath[]
            ).map((item) => (
              <button
                key={item}
                type="button"
                className={classificationPath === item ? 'classification-card selected' : 'classification-card'}
                onClick={() => setClassificationPath(item)}
              >
                <span>
                  {item === 'Safety component of a regulated product'
                    ? 'ANNEX I PATH'
                    : item === 'Annex III use case'
                      ? 'ANNEX III PATH'
                      : item === 'Potential exception or exclusion'
                        ? 'EXCEPTION PATH'
                        : 'REVIEW PATH'}
                </span>
                <strong>{item}</strong>
                <p>
                  {item === 'Safety component of a regulated product'
                    ? 'Assess whether the AI system is a safety component of, or itself, a regulated product subject to third-party conformity assessment.'
                    : item === 'Annex III use case'
                      ? 'Assess whether the intended use falls within a listed high-risk domain such as employment, education, essential services, law enforcement, migration, justice, or elections.'
                      : item === 'Potential exception or exclusion'
                        ? 'Preserve the exact basis for any exception, exclusion, or non-material-risk position without treating the assertion as self-proving.'
                        : 'Hold the route until system identity, intended purpose, product context, and deployment context are sufficiently defined.'}
                </p>
              </button>
            ))}
          </div>

          <div className="classification-record">
            <span>Current declared path</span>
            <strong>{classificationPath}</strong>
            <p>
              This declaration has not been validated. It is browser state only and creates no legal
              classification.
            </p>
          </div>
        </section>

        <section className="lifecycle-section">
          <div className="section-heading">
            <span className="eyebrow">STEP 02 · LIFECYCLE GATES</span>
            <h2>Inspect each gate, its evidence, failure states, and governed outputs.</h2>
          </div>

          <div className="filter-panel">
            <label>
              <span>Search gates</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search stage, duty, evidence, failure state, or output"
              />
            </label>

            <label>
              <span>Lifecycle stage</span>
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value as 'All' | LifecycleStage)}
              >
                {lifecycleStages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="results-meta">
            <span>{filteredGates.length} lifecycle gate(s)</span>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setStage('All');
              }}
            >
              Reset filters
            </button>
          </div>

          <div className="gate-grid">
            {filteredGates.map((gate) => {
              const currentState = getGateState(gate.id);
              const evidenceDeclared = completedGates.includes(gate.id);
              const reviewDeclared = reviewedGates.includes(gate.id);

              return (
                <article className="gate-card" key={gate.id}>
                  <div className="gate-topline">
                    <div>
                      <span>{gate.stage}</span>
                      <small>{gate.id}</small>
                    </div>
                    <span
                      className={`gate-state ${currentState.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      {currentState}
                    </span>
                  </div>

                  <h3>{gate.title}</h3>
                  <p className="owner">Primary owner: {gate.owner}</p>
                  <p className="purpose">{gate.purpose}</p>

                  <div className="gate-details">
                    <div>
                      <span>Evidence required</span>
                      <ul>
                        {gate.evidence.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span>Failure states</span>
                      <ul>
                        {gate.failureStates.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span>Governed outputs</span>
                      <ul>
                        {gate.outputs.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="declaration-row">
                    <label className={evidenceDeclared ? 'declaration active' : 'declaration'}>
                      <input
                        type="checkbox"
                        checked={evidenceDeclared}
                        onChange={() => toggleCompleted(gate.id)}
                      />
                      <span>
                        <strong>Evidence package declared</strong>
                        <small>No upload or validation occurs.</small>
                      </span>
                    </label>

                    <label className={reviewDeclared ? 'declaration active' : 'declaration'}>
                      <input
                        type="checkbox"
                        checked={reviewDeclared}
                        onChange={() => toggleReviewed(gate.id)}
                      />
                      <span>
                        <strong>Independent review declared</strong>
                        <small>No reviewer identity is verified.</small>
                      </span>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="route-section">
          <div className="section-heading">
            <span className="eyebrow">HIGH-RISK GOVERNANCE ROUTE</span>
            <h2>Classification must remain connected to execution and outcome.</h2>
          </div>

          <div className="route-chain">
            {[
              ['01', 'System identity', 'Identify the exact system, version, intended purpose, actor, and deployment context.'],
              ['02', 'Classification', 'Preserve Annex pathway, product context, listed use case, exceptions, and review.'],
              ['03', 'Lifecycle evidence', 'Bind each duty to documents, tests, logs, owners, dates, versions, and limitations.'],
              ['04', 'Conformity and deployment', 'Establish the pre-market route and the deployer operating conditions.'],
              ['05', 'Operational continuity', 'Monitor performance, drift, incidents, complaints, changes, and corrective actions.'],
              ['06', 'Outcome record', 'Preserve ALLOW, HOLD, DENY, ESCALATE, suspension, reassessment, or withdrawal.'],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="connected-section">
          <div className="section-heading">
            <span className="eyebrow">CONNECTED WORKSPACES</span>
            <h2>Move from high-risk classification into the required evidence routes.</h2>
          </div>

          <div className="connected-grid">
            <Link href="/eu-ai-act/fundamental-rights">
              <span>01</span>
              <h3>Fundamental Rights</h3>
              <p>Structure affected-party analysis, risk pathways, mitigation, remedy, and reassessment.</p>
            </Link>
            <Link href="/marketplace/governed-records">
              <span>02</span>
              <h3>Governed Records</h3>
              <p>Preserve classification, technical, testing, conformity, deployment, and incident records.</p>
            </Link>
            <Link href="/marketplace/routes">
              <span>03</span>
              <h3>Governance Routes</h3>
              <p>Convert lifecycle duties into evidence gates, failure states, review, and bounded outcomes.</p>
            </Link>
            <Link href="/verification">
              <span>04</span>
              <h3>Verification</h3>
              <p>Test evidence continuity, performance claims, replay conditions, and outcome integrity.</p>
            </Link>
            <Link href="/marketplace/professionals">
              <span>05</span>
              <h3>Independent Review</h3>
              <p>Find specialists for classification, conformity, technical, rights, cybersecurity, and sector review.</p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span>
          <h2>High-risk governance is a lifecycle discipline, not a one-time form.</h2>
          <p>
            The system must remain identifiable, the evidence must remain current, authority must
            remain valid, changes must trigger reassessment, and operational outcomes must remain
            traceable to the rules and records that supported them.
          </p>

          <div className="action-row centered">
            <a className="primary-button" href="#classification">
              Return to classification
            </a>
            <Link className="secondary-button" href="/marketplace/opportunities">
              Post a high-risk review need
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #eef8ff;
          background: #06101b;
        }

        :global(a) {
          color: inherit;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 14, 24, 0.83), rgba(4, 14, 24, 0.98)),
            radial-gradient(circle at 11% 5%, rgba(18, 132, 174, 0.21), transparent 32%),
            radial-gradient(circle at 88% 9%, rgba(76, 61, 176, 0.16), transparent 31%);
        }

        .content-shell {
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.68;
        }

        .orb {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #87e7f9;
          box-shadow: 0 0 22px rgba(91, 215, 243, 0.95);
          animation: drift 12s ease-in-out infinite;
        }

        .orb-one {
          top: 14%;
          right: 11%;
        }

        .orb-two {
          top: 49%;
          left: 8%;
          animation-delay: -4s;
        }

        .orb-three {
          bottom: 15%;
          right: 18%;
          animation-delay: -8s;
        }

        .line {
          position: absolute;
          width: 46vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79, 205, 234, 0.3), transparent);
          animation: pulse 8s ease-in-out infinite;
        }

        .line-one {
          top: 23%;
          left: -5%;
          transform: rotate(-16deg);
        }

        .line-two {
          bottom: 21%;
          right: -8%;
          transform: rotate(20deg);
          animation-delay: -3s;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 58px;
          color: #83a7b6;
          font-size: 0.86rem;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover,
        .text-link:hover {
          color: #ffffff;
        }

        .eyebrow {
          display: inline-block;
          color: #70d8ef;
          font-size: 0.73rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        .hero {
          max-width: 1030px;
          padding-bottom: 70px;
        }

        h1 {
          margin: 18px 0 24px;
          font-size: clamp(3.1rem, 7vw, 6.75rem);
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .hero-copy {
          max-width: 930px;
          color: #b5cbd6;
          font-size: 1.09rem;
          line-height: 1.8;
        }

        .boundary-banner {
          margin-top: 27px;
          border-left: 3px solid #d9b656;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(201, 149, 29, 0.07);
        }

        .boundary-banner p {
          margin: 8px 0 0;
          color: #beb28b;
          line-height: 1.64;
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 950;
          text-decoration: none;
          transition: transform 170ms ease;
        }

        .primary-button {
          border: 1px solid #88e5f8;
          color: #031019;
          background: linear-gradient(135deg, #a5efff, #55cae7);
          box-shadow: 0 12px 34px rgba(60, 191, 222, 0.17);
        }

        .secondary-button {
          border: 1px solid rgba(147, 208, 227, 0.3);
          color: #eaf9ff;
          background: rgba(10, 29, 44, 0.82);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-2px);
        }

        .text-link {
          color: #96ccdc;
          font-weight: 850;
          text-decoration: none;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          padding-bottom: 82px;
        }

        .summary-grid article {
          min-height: 190px;
          padding: 21px;
          border: 1px solid rgba(103, 194, 218, 0.16);
          border-radius: 20px;
          background: rgba(9, 29, 44, 0.74);
        }

        .summary-grid span {
          color: #7899a8;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .summary-grid strong {
          display: block;
          margin: 40px 0 11px;
          font-size: 1.48rem;
        }

        .summary-grid p {
          color: #91aab5;
          line-height: 1.57;
        }

        .classification-section,
        .lifecycle-section,
        .route-section,
        .connected-section {
          padding-top: 82px;
        }

        .section-heading {
          max-width: 940px;
          margin-bottom: 28px;
        }

        .section-heading h2 {
          margin: 12px 0 14px;
          font-size: clamp(2.3rem, 5vw, 4.6rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .section-heading p {
          color: #a5bbc5;
          line-height: 1.72;
        }

        .classification-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .classification-card {
          min-height: 285px;
          padding: 21px;
          border: 1px solid rgba(103, 194, 220, 0.16);
          border-radius: 20px;
          color: #edf8fc;
          background: rgba(10, 30, 45, 0.72);
          text-align: left;
          cursor: pointer;
        }

        .classification-card.selected {
          border-color: rgba(104, 218, 239, 0.62);
          background: rgba(48, 158, 188, 0.11);
          box-shadow: inset 0 0 0 1px rgba(104, 218, 239, 0.18);
        }

        .classification-card > span {
          color: #75cfe3;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .classification-card strong {
          display: block;
          margin: 47px 0 12px;
          font-size: 1.24rem;
        }

        .classification-card p {
          color: #94acb7;
          line-height: 1.61;
        }

        .classification-record {
          margin-top: 14px;
          border-left: 3px solid #66d7ec;
          border-radius: 0 17px 17px 0;
          padding: 18px 20px;
          background: rgba(58, 175, 204, 0.07);
        }

        .classification-record span {
          color: #789eaa;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .classification-record strong {
          display: block;
          margin: 8px 0;
          font-size: 1.25rem;
        }

        .classification-record p {
          margin: 0;
          color: #8fa7b1;
        }

        .filter-panel {
          display: grid;
          grid-template-columns: 1.6fr 0.8fr;
          gap: 12px;
          padding: 24px;
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
        }

        label > span {
          display: block;
          margin-bottom: 8px;
          color: #7899a7;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 13px;
          padding: 11px 13px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.82);
          outline: none;
        }

        select option {
          color: #eaf7fb;
          background: #091b2a;
        }

        input:focus,
        select:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder {
          color: #648091;
        }

        .results-meta {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: center;
          padding: 18px 4px;
          color: #7f9cab;
          font-size: 0.82rem;
        }

        .results-meta button {
          border: 0;
          color: #92d5e5;
          background: transparent;
          cursor: pointer;
          font-weight: 850;
        }

        .gate-grid {
          display: grid;
          gap: 16px;
        }

        .gate-card {
          padding: 25px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.14);
        }

        .gate-topline {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
        }

        .gate-topline > div {
          display: grid;
          gap: 5px;
        }

        .gate-topline > div > span {
          color: #83d5e7;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .gate-topline small {
          color: #678492;
        }

        .gate-state {
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          white-space: nowrap;
        }

        .gate-state.open {
          color: #8cebc3;
          background: rgba(45, 163, 113, 0.11);
        }

        .gate-state.hold {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.12);
        }

        .gate-state.review {
          color: #a7dcff;
          background: rgba(52, 129, 178, 0.11);
        }

        .gate-state.not-started {
          color: #b0c0c7;
          background: rgba(115, 132, 140, 0.1);
        }

        .gate-card h3 {
          margin: 21px 0 8px;
          font-size: 1.58rem;
          letter-spacing: -0.025em;
        }

        .owner {
          color: #e2c66f;
          font-size: 0.84rem;
          font-weight: 850;
        }

        .purpose {
          color: #a4bac4;
          line-height: 1.67;
        }

        .gate-details {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .gate-details > div {
          padding: 16px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.027);
        }

        .gate-details > div > span {
          color: #79a8b6;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .gate-details ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #9fb5bf;
          line-height: 1.64;
        }

        .declaration-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .declaration {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 11px;
          align-items: center;
          padding: 14px;
          border: 1px solid rgba(105, 190, 214, 0.14);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.022);
          cursor: pointer;
        }

        .declaration.active {
          border-color: rgba(80, 211, 155, 0.33);
          background: rgba(48, 157, 112, 0.07);
        }

        .declaration input {
          width: 18px;
          height: 18px;
          accent-color: #64d8ee;
        }

        .declaration > span {
          display: grid;
          gap: 4px;
          margin: 0;
          color: inherit;
          font-size: inherit;
          letter-spacing: 0;
          text-transform: none;
        }

        .declaration small {
          color: #7593a0;
        }

        .route-chain {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
        }

        .route-chain article,
        .connected-grid a {
          min-height: 235px;
          padding: 20px;
          border: 1px solid rgba(103, 194, 220, 0.15);
          border-radius: 19px;
          background: rgba(10, 30, 45, 0.72);
        }

        .route-chain article > span,
        .connected-grid a > span {
          color: #5ed0e9;
          font-size: 0.74rem;
        }

        .route-chain h3,
        .connected-grid h3 {
          margin: 48px 0 10px;
          font-size: 1.17rem;
        }

        .route-chain p,
        .connected-grid p {
          color: #94abb6;
          line-height: 1.58;
        }

        .connected-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 11px;
        }

        .connected-grid a {
          text-decoration: none;
        }

        .connected-grid a:hover {
          border-color: rgba(103, 194, 220, 0.42);
          background: rgba(20, 53, 73, 0.78);
        }

        .final-cta {
          max-width: 960px;
          margin: 86px auto 0;
          padding: clamp(32px, 5vw, 60px);
          border: 1px solid rgba(117, 205, 228, 0.19);
          border-radius: 30px;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(56, 173, 205, 0.11), transparent 48%),
            rgba(10, 30, 46, 0.84);
        }

        .final-cta h2 {
          margin: 12px 0 17px;
          font-size: clamp(2rem, 4vw, 3.55rem);
          letter-spacing: -0.04em;
        }

        .final-cta p {
          color: #aabec9;
          line-height: 1.77;
        }

        .centered {
          justify-content: center;
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.4;
          }
          50% {
            transform: translate3d(20px, -24px, 0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.82;
          }
        }

        @media (max-width: 1080px) {
          .summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .classification-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .route-chain {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .connected-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .gate-details,
          .connected-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .content-shell {
            width: min(100% - 24px, 1220px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .summary-grid,
          .classification-grid,
          .filter-panel,
          .declaration-row,
          .route-chain {
            grid-template-columns: 1fr;
          }

          .results-meta {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .orb,
          .line {
            animation: none;
          }

          .primary-button,
          .secondary-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
