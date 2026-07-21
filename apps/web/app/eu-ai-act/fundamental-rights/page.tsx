// apps/web/app/eu-ai-act/fundamental-rights/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Applicability =
  | 'Public-law body'
  | 'Private entity providing public services'
  | 'Creditworthiness assessment'
  | 'Life or health insurance risk assessment'
  | 'Other or uncertain';

type AssessmentState =
  | 'NOT STARTED'
  | 'APPLICABILITY REVIEW'
  | 'EVIDENCE INCOMPLETE'
  | 'REVIEW READY';

type Section = {
  id: string;
  number: string;
  title: string;
  purpose: string;
  questions: string[];
  evidence: string[];
  nonClaims: string[];
};

const sections: Section[] = [
  {
    id: 'process',
    number: '01',
    title: 'Deployer process and intended use',
    purpose:
      'Describe the deployer process in which the high-risk AI system will be used and bind that process to the provider-declared intended purpose.',
    questions: [
      'What operational process will use the system?',
      'What decision, recommendation, prioritisation, or action can follow?',
      'Does the actual use remain within the provider-declared intended purpose?',
      'Which people and organisational roles control the process?',
    ],
    evidence: [
      'Process map',
      'System identity and version',
      'Provider instructions for use',
      'Deployment-context record',
      'Decision and action pathway',
    ],
    nonClaims: [
      'A vendor description does not prove the actual deployment context.',
      'An intended-purpose statement does not prove the system is used accordingly.',
    ],
  },
  {
    id: 'duration',
    number: '02',
    title: 'Period and frequency of use',
    purpose:
      'Preserve how long, how often, and under which operating conditions the high-risk AI system is intended to be used.',
    questions: [
      'When will deployment begin and end?',
      'Is use continuous, periodic, event-triggered, or discretionary?',
      'How many people or decisions may be affected?',
      'Are peak, emergency, or exceptional conditions materially different?',
    ],
    evidence: [
      'Deployment schedule',
      'Frequency and volume estimates',
      'Operating-condition record',
      'Exceptional-use procedure',
      'Change history',
    ],
    nonClaims: [
      'A pilot-period assessment does not automatically cover scaled deployment.',
      'Average use does not represent exceptional or peak conditions.',
    ],
  },
  {
    id: 'affected',
    number: '03',
    title: 'Affected natural persons and groups',
    purpose:
      'Identify the categories of natural persons and groups likely to be affected in the specific context of use.',
    questions: [
      'Who is directly subject to the system?',
      'Who may be indirectly affected by its outputs?',
      'Are children, disabled persons, workers, patients, applicants, consumers, migrants, or other vulnerable groups involved?',
      'Could effects differ across demographic or social groups?',
    ],
    evidence: [
      'Affected-person inventory',
      'Group and vulnerability analysis',
      'Direct and indirect impact map',
      'Stakeholder input',
      'Population and context data',
    ],
    nonClaims: [
      'A general user persona does not prove all affected groups were considered.',
      'Absence of complaints does not prove absence of impact.',
    ],
  },
  {
    id: 'harms',
    number: '04',
    title: 'Specific risks of harm to fundamental rights',
    purpose:
      'Identify specific harm pathways for the affected persons and groups, taking account of provider information and the actual context of use.',
    questions: [
      'Which rights could be affected?',
      'How could the system create, amplify, or conceal harm?',
      'What is the severity, likelihood, duration, and reversibility of each harm?',
      'Could errors compound through downstream human or automated decisions?',
    ],
    evidence: [
      'Fundamental-rights risk register',
      'Provider limitation evidence',
      'Historical and contextual evidence',
      'Severity and likelihood method',
      'Downstream consequence map',
    ],
    nonClaims: [
      'A generic risk list does not prove context-specific analysis.',
      'Low model error does not prove low fundamental-rights impact.',
    ],
  },
  {
    id: 'oversight',
    number: '05',
    title: 'Human oversight and governance arrangements',
    purpose:
      'Define who can understand, challenge, intervene, override, stop, and accept responsibility for system use.',
    questions: [
      'Who is authorised to oversee the system?',
      'What information does the overseer receive?',
      'Can the person intervene before harm becomes consequential?',
      'How are automation bias, workload, and conflicts of interest addressed?',
    ],
    evidence: [
      'Oversight authority record',
      'Competency evidence',
      'Intervention and stop controls',
      'Escalation procedure',
      'Override and outcome logs',
    ],
    nonClaims: [
      'A named human does not prove effective oversight.',
      'An override button does not prove a person can use it meaningfully.',
    ],
  },
  {
    id: 'mitigation',
    number: '06',
    title: 'Measures for preventing and responding to harm',
    purpose:
      'Preserve technical, organisational, procedural, and human measures that prevent harm or respond when risk materialises.',
    questions: [
      'Which preventive controls apply before the system is used?',
      'Which thresholds trigger HOLD, suspension, review, or withdrawal?',
      'What happens when harm or elevated risk is detected?',
      'Who verifies that corrective measures worked?',
    ],
    evidence: [
      'Mitigation plan',
      'Declared thresholds',
      'Suspension and withdrawal route',
      'Corrective-action record',
      'Post-intervention verification',
    ],
    nonClaims: [
      'A planned mitigation does not prove implementation.',
      'Implementation does not prove effectiveness without outcome evidence.',
    ],
  },
  {
    id: 'complaints',
    number: '07',
    title: 'Complaint, explanation, contest, and remedy pathways',
    purpose:
      'Describe how affected persons can obtain information, submit complaints, challenge outcomes, seek human review, and access remedy.',
    questions: [
      'How is an affected person informed?',
      'How can the person contest or seek review of an outcome?',
      'Is the pathway accessible, timely, and understandable?',
      'How are complaint outcomes and corrective actions preserved?',
    ],
    evidence: [
      'Notice and explanation process',
      'Complaint channel',
      'Human-review procedure',
      'Remedy and redress record',
      'Complaint outcome logs',
    ],
    nonClaims: [
      'A contact form does not prove an effective remedy pathway.',
      'An explanation does not prove the underlying decision was lawful or correct.',
    ],
  },
  {
    id: 'stakeholders',
    number: '08',
    title: 'Stakeholder and independent-expert involvement',
    purpose:
      'Preserve relevant participation by representatives of affected groups, independent experts, civil society, workers, or other stakeholders where appropriate.',
    questions: [
      'Which affected groups were invited to contribute?',
      'Were independent experts involved?',
      'What concerns, objections, or alternatives were raised?',
      'How did stakeholder input change the assessment or deployment?',
    ],
    evidence: [
      'Stakeholder map',
      'Consultation invitations',
      'Meeting and submission records',
      'Objection and response log',
      'Resulting change record',
    ],
    nonClaims: [
      'Consultation does not transfer accountability to participants.',
      'Attendance does not prove concerns were addressed.',
    ],
  },
  {
    id: 'notification',
    number: '09',
    title: 'Authority notification and related assessments',
    purpose:
      'Preserve the notification route and identify where a data-protection impact assessment or other assessment already addresses part of the obligation.',
    questions: [
      'Which market-surveillance authority is relevant?',
      'What assessment result must be notified?',
      'Has a DPIA already addressed overlapping issues?',
      'How does the FRIA complement rather than duplicate that assessment?',
    ],
    evidence: [
      'Authority identity',
      'Notification package',
      'Submission and receipt record',
      'DPIA or related assessment map',
      'Overlap and gap analysis',
    ],
    nonClaims: [
      'Preparing a notification does not prove submission.',
      'A DPIA does not automatically satisfy every FRIA requirement.',
    ],
  },
  {
    id: 'reassessment',
    number: '10',
    title: 'Change monitoring and reassessment',
    purpose:
      'Define the changes that invalidate or reopen the assessment and preserve the resulting review, correction, or suspension.',
    questions: [
      'Which system, process, population, purpose, or operating changes trigger reassessment?',
      'How are changes detected?',
      'Can deployment continue while reassessment is incomplete?',
      'How are superseded assessments retained?',
    ],
    evidence: [
      'Change-trigger register',
      'Version and deployment monitoring',
      'Reassessment procedure',
      'Suspension decision record',
      'Supersession history',
    ],
    nonClaims: [
      'A completed assessment does not remain valid after every material change.',
      'Version history alone does not prove impacts were reassessed.',
    ],
  },
];

export default function FundamentalRightsWorkspacePage() {
  const [applicability, setApplicability] =
    useState<Applicability>('Other or uncertain');
  const [completed, setCompleted] = useState<string[]>([]);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const visibleSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return sections.filter((section) =>
      !normalized
        ? true
        : [
            section.id,
            section.title,
            section.purpose,
            ...section.questions,
            ...section.evidence,
            ...section.nonClaims,
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalized),
    );
  }, [query]);

  const applicabilityClear = applicability !== 'Other or uncertain';
  const completedCount = completed.length;
  const reviewedCount = reviewed.length;

  const assessmentState: AssessmentState = !applicabilityClear
    ? 'APPLICABILITY REVIEW'
    : completedCount === 0
      ? 'NOT STARTED'
      : completedCount < sections.length || reviewedCount < Math.ceil(sections.length / 2)
        ? 'EVIDENCE INCOMPLETE'
        : 'REVIEW READY';

  function toggle(setter: React.Dispatch<React.SetStateAction<string[]>>, id: string) {
    setter((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <main className="page-shell">
      <div className="ambient" aria-hidden="true">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="beam b1" />
        <span className="beam b2" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <Link href="/eu-ai-act">EU AI Act</Link>
          <span>/</span>
          <span>Fundamental Rights Impact Assessment</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">ARTICLE 27 FRIA WORKSPACE</span>
          <h1>Make the impact assessment inspectable before the system is deployed.</h1>
          <p className="hero-copy">
            The fundamental-rights impact assessment must remain separate from the high-risk
            classification, provider risk assessment, data-protection impact assessment, deployment
            decision, and final legal conclusion. This workspace preserves the deployer’s context,
            affected persons, harm pathways, governance arrangements, mitigation, remedy, notification,
            and reassessment record.
          </p>

          <div className="boundary-banner">
            <strong>Assessment architecture, not legal advice.</strong>
            <p>
              This page does not determine Article 27 applicability, complete an official
              questionnaire, notify an authority, validate evidence, or certify lawful deployment.
            </p>
          </div>

          <div className="action-row">
            <a className="primary-button" href="#fria-builder">
              Start FRIA route
            </a>
            <Link className="secondary-button" href="/eu-ai-act/high-risk">
              Return to high-risk workspace
            </Link>
            <Link className="text-link" href="/marketplace/professionals">
              Find independent review
            </Link>
          </div>
        </header>

        <section className="summary-grid">
          <article>
            <span>Assessment sections</span>
            <strong>{sections.length}</strong>
            <p>Context, affected groups, harms, oversight, mitigation, remedy, and continuity.</p>
          </article>
          <article>
            <span>Evidence declared</span>
            <strong>{completedCount}</strong>
            <p>Sections currently marked as having a declared evidence package.</p>
          </article>
          <article>
            <span>Review declared</span>
            <strong>{reviewedCount}</strong>
            <p>Sections currently marked as independently reviewed.</p>
          </article>
          <article>
            <span>Current state</span>
            <strong>{assessmentState}</strong>
            <p>No legal determination or authority submission is created by this state.</p>
          </article>
        </section>

        <section className="builder-section" id="fria-builder">
          <div className="section-heading">
            <span className="eyebrow">STEP 01 · APPLICABILITY CONTEXT</span>
            <h2>Identify the deployer category before assessing the impact.</h2>
            <p>
              Article 27 applies to specified deployers of certain high-risk systems. The selected
              category below is only a declaration and must be independently tested against the
              regulation and current official guidance.
            </p>
          </div>

          <div className="applicability-grid">
            {(
              [
                'Public-law body',
                'Private entity providing public services',
                'Creditworthiness assessment',
                'Life or health insurance risk assessment',
                'Other or uncertain',
              ] as Applicability[]
            ).map((item) => (
              <button
                key={item}
                type="button"
                className={applicability === item ? 'app-card selected' : 'app-card'}
                onClick={() => setApplicability(item)}
              >
                <span>
                  {item === 'Other or uncertain' ? 'HOLD FOR REVIEW' : 'POTENTIAL ARTICLE 27 PATH'}
                </span>
                <strong>{item}</strong>
              </button>
            ))}
          </div>

          <div className="status-panel">
            <div>
              <span>Declared applicability context</span>
              <strong>{applicability}</strong>
            </div>
            <div>
              <span>Assessment state</span>
              <strong className={assessmentState.toLowerCase().replaceAll(' ', '-')}>
                {assessmentState}
              </strong>
            </div>
          </div>
        </section>

        <section className="assessment-section">
          <div className="section-heading">
            <span className="eyebrow">STEP 02 · ASSESSMENT RECORD</span>
            <h2>Preserve each required layer without collapsing evidence into conclusion.</h2>
          </div>

          <div className="search-panel">
            <label>
              <span>Search assessment</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions, evidence, harms, mitigation, or non-claims"
              />
            </label>
            <span>{visibleSections.length} section(s)</span>
          </div>

          <div className="section-list">
            {visibleSections.map((section) => {
              const evidenceDeclared = completed.includes(section.id);
              const reviewDeclared = reviewed.includes(section.id);

              return (
                <article className="assessment-card" key={section.id}>
                  <div className="card-topline">
                    <div>
                      <span>{section.number}</span>
                      <small>{section.id.toUpperCase()}</small>
                    </div>
                    <div className="state-row">
                      <span className={evidenceDeclared ? 'badge active' : 'badge'}>
                        {evidenceDeclared ? 'EVIDENCE DECLARED' : 'EVIDENCE OPEN'}
                      </span>
                      <span className={reviewDeclared ? 'badge reviewed' : 'badge'}>
                        {reviewDeclared ? 'REVIEW DECLARED' : 'REVIEW OPEN'}
                      </span>
                    </div>
                  </div>

                  <h3>{section.title}</h3>
                  <p className="purpose">{section.purpose}</p>

                  <div className="content-grid">
                    <div>
                      <span>Questions to resolve</span>
                      <ul>
                        {section.questions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span>Evidence to preserve</span>
                      <ul>
                        {section.evidence.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span>Claims this layer cannot support alone</span>
                      <ul>
                        {section.nonClaims.map((item) => (
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
                        onChange={() => toggle(setCompleted, section.id)}
                      />
                      <span>
                        <strong>Evidence package declared</strong>
                        <small>No evidence is uploaded, authenticated, or inspected.</small>
                      </span>
                    </label>

                    <label className={reviewDeclared ? 'declaration active' : 'declaration'}>
                      <input
                        type="checkbox"
                        checked={reviewDeclared}
                        onChange={() => toggle(setReviewed, section.id)}
                      />
                      <span>
                        <strong>Independent review declared</strong>
                        <small>No reviewer identity or scope is verified.</small>
                      </span>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rights-section">
          <div className="section-heading">
            <span className="eyebrow">FUNDAMENTAL-RIGHTS LENS</span>
            <h2>The assessment should test concrete pathways of impact.</h2>
          </div>

          <div className="rights-grid">
            {[
              ['Human dignity', 'Could the system objectify, manipulate, stigmatise, or deny meaningful human agency?'],
              ['Equality and non-discrimination', 'Could performance, data, thresholds, or deployment create unequal treatment or indirect discrimination?'],
              ['Privacy and data protection', 'Could collection, inference, combination, retention, or disclosure exceed justified boundaries?'],
              ['Freedom of expression and information', 'Could ranking, moderation, generation, or access controls suppress or distort lawful expression or information?'],
              ['Fair working conditions', 'Could monitoring, evaluation, allocation, discipline, or termination routes create unjustified worker harm?'],
              ['Access to services and social protection', 'Could the system improperly restrict healthcare, education, housing, credit, insurance, or public benefits?'],
              ['Effective remedy and fair process', 'Can affected persons understand, contest, correct, and obtain meaningful human review?'],
              ['Rights of children and vulnerable persons', 'Are age, dependency, disability, power imbalance, and heightened susceptibility addressed?'],
            ].map(([title, description]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="route-section">
          <div className="section-heading">
            <span className="eyebrow">FRIA GOVERNANCE CHAIN</span>
            <h2>The assessment must remain connected to deployment authority and outcome.</h2>
          </div>

          <div className="route-chain">
            {[
              ['01', 'Applicability', 'Establish whether the deployer, system, and use context fall within the Article 27 route.'],
              ['02', 'Context record', 'Preserve process, duration, frequency, system identity, intended purpose, and deployment conditions.'],
              ['03', 'Affected parties', 'Identify people and groups exposed directly or indirectly to consequential effects.'],
              ['04', 'Harm and mitigation', 'Map rights risks, thresholds, oversight, controls, complaint, remedy, and response.'],
              ['05', 'Review and notification', 'Preserve independent challenge, corrections, related assessments, and authority notification.'],
              ['06', 'Deployment outcome', 'Record ALLOW, HOLD, DENY, ESCALATE, condition, suspension, reassessment, or withdrawal.'],
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
            <h2>Move the impact record into review, governance, and preserved execution.</h2>
          </div>

          <div className="connected-grid">
            <Link href="/eu-ai-act/high-risk">
              <span>01</span>
              <h3>High-Risk Systems</h3>
              <p>Return to classification, lifecycle duties, conformity, deployment, and monitoring.</p>
            </Link>
            <Link href="/marketplace/governed-records">
              <span>02</span>
              <h3>Governed Records</h3>
              <p>Preserve affected-party, harm, mitigation, consultation, notification, and outcome records.</p>
            </Link>
            <Link href="/marketplace/routes">
              <span>03</span>
              <h3>Governance Routes</h3>
              <p>Convert risks and mitigations into explicit gates, thresholds, holds, escalation, and outcomes.</p>
            </Link>
            <Link href="/marketplace/professionals">
              <span>04</span>
              <h3>Independent Review</h3>
              <p>Find legal, rights, sector, accessibility, labour, data-protection, and technical specialists.</p>
            </Link>
            <Link href="/marketplace/opportunities">
              <span>05</span>
              <h3>Post a FRIA Need</h3>
              <p>Create a bounded opportunity for assessment, affected-party analysis, evidence mapping, or review.</p>
            </Link>
          </div>
        </section>

        <section className="final-cta">
          <span className="eyebrow">THE RECORD IS NOT THE DETERMINATION</span>
          <h2>A completed form does not prove that fundamental rights are protected.</h2>
          <p>
            The assessment must remain tied to the actual system, version, deployer process, affected
            population, risk pathways, implemented controls, complaint and remedy routes, independent
            review, notification, change history, and deployment outcome.
          </p>

          <div className="action-row centered">
            <a className="primary-button" href="#fria-builder">
              Return to FRIA route
            </a>
            <Link className="secondary-button" href="/marketplace/opportunities">
              Post an independent review need
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; }
        :global(body) { margin: 0; color: #eef8ff; background: #06101b; }
        :global(a) { color: inherit; }
        button, input { font: inherit; }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 14, 24, .83), rgba(4, 14, 24, .98)),
            radial-gradient(circle at 11% 5%, rgba(18,132,174,.21), transparent 32%),
            radial-gradient(circle at 88% 9%, rgba(76,61,176,.16), transparent 31%);
        }

        .content-shell {
          width: min(1220px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .ambient { position: fixed; inset: 0; pointer-events: none; opacity: .68; }
        .particle {
          position: absolute; width: 7px; height: 7px; border-radius: 50%;
          background: #87e7f9; box-shadow: 0 0 22px rgba(91,215,243,.95);
          animation: drift 12s ease-in-out infinite;
        }
        .p1 { top: 14%; right: 11%; }
        .p2 { top: 49%; left: 8%; animation-delay: -4s; }
        .p3 { bottom: 15%; right: 18%; animation-delay: -8s; }
        .beam {
          position: absolute; width: 46vw; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,205,234,.3), transparent);
          animation: pulse 8s ease-in-out infinite;
        }
        .b1 { top: 23%; left: -5%; transform: rotate(-16deg); }
        .b2 { bottom: 21%; right: -8%; transform: rotate(20deg); animation-delay: -3s; }

        .breadcrumbs {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 58px;
          color: #83a7b6; font-size: .86rem;
        }
        .breadcrumbs a, .text-link { text-decoration: none; }
        .breadcrumbs a:hover, .text-link:hover { color: #fff; }

        .eyebrow {
          display: inline-block; color: #70d8ef; font-size: .73rem;
          font-weight: 950; letter-spacing: .13em; text-transform: uppercase;
        }

        h1, h2, h3, p { margin-top: 0; }
        .hero { max-width: 1030px; padding-bottom: 70px; }
        h1 {
          margin: 18px 0 24px; font-size: clamp(3.1rem, 7vw, 6.75rem);
          line-height: .95; letter-spacing: -.058em;
        }
        .hero-copy { max-width: 930px; color: #b5cbd6; font-size: 1.09rem; line-height: 1.8; }

        .boundary-banner {
          margin-top: 27px; border-left: 3px solid #d9b656;
          border-radius: 0 15px 15px 0; padding: 18px 20px;
          background: rgba(201,149,29,.07);
        }
        .boundary-banner p { margin: 8px 0 0; color: #beb28b; line-height: 1.64; }

        .action-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 30px; }
        .primary-button, .secondary-button {
          border-radius: 999px; padding: 14px 21px; font-weight: 950;
          text-decoration: none; transition: transform 170ms ease;
        }
        .primary-button {
          border: 1px solid #88e5f8; color: #031019;
          background: linear-gradient(135deg, #a5efff, #55cae7);
          box-shadow: 0 12px 34px rgba(60,191,222,.17);
        }
        .secondary-button {
          border: 1px solid rgba(147,208,227,.3); color: #eaf9ff;
          background: rgba(10,29,44,.82);
        }
        .primary-button:hover, .secondary-button:hover { transform: translateY(-2px); }
        .text-link { color: #96ccdc; font-weight: 850; }

        .summary-grid {
          display: grid; grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px; padding-bottom: 82px;
        }
        .summary-grid article {
          min-height: 190px; padding: 21px; border: 1px solid rgba(103,194,218,.16);
          border-radius: 20px; background: rgba(9,29,44,.74);
        }
        .summary-grid span, .status-panel span {
          color: #7899a8; font-size: .7rem; font-weight: 900;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .summary-grid strong { display: block; margin: 40px 0 11px; font-size: 1.25rem; }
        .summary-grid p { color: #91aab5; line-height: 1.57; }

        .builder-section, .assessment-section, .rights-section, .route-section, .connected-section {
          padding-top: 82px;
        }
        .section-heading { max-width: 940px; margin-bottom: 28px; }
        .section-heading h2 {
          margin: 12px 0 14px; font-size: clamp(2.3rem, 5vw, 4.6rem);
          line-height: 1; letter-spacing: -.05em;
        }
        .section-heading p { color: #a5bbc5; line-height: 1.72; }

        .applicability-grid {
          display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 10px;
        }
        .app-card {
          min-height: 185px; padding: 20px; border: 1px solid rgba(103,194,220,.16);
          border-radius: 19px; color: #edf8fc; background: rgba(10,30,45,.72);
          text-align: left; cursor: pointer;
        }
        .app-card.selected {
          border-color: rgba(104,218,239,.62); background: rgba(48,158,188,.11);
          box-shadow: inset 0 0 0 1px rgba(104,218,239,.18);
        }
        .app-card span {
          color: #75cfe3; font-size: .65rem; font-weight: 950; letter-spacing: .08em;
        }
        .app-card strong { display: block; margin-top: 47px; font-size: 1.12rem; line-height: 1.3; }

        .status-panel {
          display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; margin-top: 12px;
        }
        .status-panel > div {
          padding: 18px; border-radius: 16px; background: rgba(65,175,202,.06);
          border: 1px solid rgba(100,199,222,.14);
        }
        .status-panel strong { display: block; margin-top: 8px; }
        .status-panel strong.review-ready { color: #8cebc3; }
        .status-panel strong.evidence-incomplete { color: #ffe09a; }
        .status-panel strong.applicability-review { color: #a7dcff; }

        .search-panel {
          display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 16px;
          align-items: end; padding: 23px; border: 1px solid rgba(103,194,220,.18);
          border-radius: 22px; background: rgba(10,30,45,.75);
        }
        label > span {
          display: block; margin-bottom: 8px; color: #7899a7; font-size: .7rem;
          font-weight: 900; letter-spacing: .08em; text-transform: uppercase;
        }
        input[type='search'] {
          width: 100%; min-height: 46px; padding: 11px 13px;
          border: 1px solid rgba(130,207,227,.22); border-radius: 13px;
          color: #f5fbff; background: rgba(4,16,27,.82); outline: none;
        }
        input:focus { border-color: #70d8ef; box-shadow: 0 0 0 3px rgba(76,198,227,.13); }
        input::placeholder { color: #648091; }
        .search-panel > span { color: #7f9cab; font-size: .82rem; }

        .section-list { display: grid; gap: 16px; margin-top: 16px; }
        .assessment-card {
          padding: 25px; border: 1px solid rgba(103,194,220,.17);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(14,38,55,.93), rgba(7,23,36,.9));
        }
        .card-topline { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
        .card-topline > div:first-child { display: grid; gap: 5px; }
        .card-topline > div:first-child span { color: #83d5e7; font-weight: 950; }
        .card-topline small { color: #678492; }
        .state-row { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px; }
        .badge {
          border-radius: 999px; padding: 7px 9px; color: #aebfc6;
          background: rgba(115,132,140,.1); font-size: .62rem; font-weight: 950;
        }
        .badge.active { color: #8cebc3; background: rgba(45,163,113,.11); }
        .badge.reviewed { color: #a7dcff; background: rgba(52,129,178,.11); }
        .assessment-card h3 { margin: 20px 0 10px; font-size: 1.58rem; }
        .purpose { color: #a4bac4; line-height: 1.67; }

        .content-grid {
          display: grid; grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 10px; margin-top: 18px;
        }
        .content-grid > div {
          padding: 16px; border-radius: 15px; background: rgba(255,255,255,.027);
        }
        .content-grid > div > span {
          color: #79a8b6; font-size: .69rem; font-weight: 950;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .content-grid ul { margin: 10px 0 0; padding-left: 18px; color: #9fb5bf; line-height: 1.64; }

        .declaration-row {
          display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; margin-top: 18px;
        }
        .declaration {
          display: grid; grid-template-columns: auto minmax(0,1fr); gap: 11px; align-items: center;
          padding: 14px; border: 1px solid rgba(105,190,214,.14);
          border-radius: 14px; background: rgba(255,255,255,.022); cursor: pointer;
        }
        .declaration.active { border-color: rgba(80,211,155,.33); background: rgba(48,157,112,.07); }
        .declaration input { width: 18px; height: 18px; accent-color: #64d8ee; }
        .declaration > span {
          display: grid; gap: 4px; margin: 0; color: inherit;
          font-size: inherit; letter-spacing: 0; text-transform: none;
        }
        .declaration small { color: #7593a0; }

        .rights-grid {
          display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 11px;
        }
        .rights-grid article, .route-chain article, .connected-grid a {
          min-height: 220px; padding: 20px; border: 1px solid rgba(103,194,220,.15);
          border-radius: 19px; background: rgba(10,30,45,.72);
        }
        .rights-grid h3 { margin-bottom: 14px; font-size: 1.15rem; }
        .rights-grid p, .route-chain p, .connected-grid p { color: #94abb6; line-height: 1.58; }

        .route-chain { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 10px; }
        .route-chain article > span, .connected-grid a > span { color: #5ed0e9; font-size: .74rem; }
        .route-chain h3, .connected-grid h3 { margin: 48px 0 10px; font-size: 1.17rem; }

        .connected-grid { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 11px; }
        .connected-grid a { text-decoration: none; }
        .connected-grid a:hover {
          border-color: rgba(103,194,220,.42); background: rgba(20,53,73,.78);
        }

        .final-cta {
          max-width: 960px; margin: 86px auto 0; padding: clamp(32px,5vw,60px);
          border: 1px solid rgba(117,205,228,.19); border-radius: 30px; text-align: center;
          background: radial-gradient(circle at top, rgba(56,173,205,.11), transparent 48%),
            rgba(10,30,46,.84);
        }
        .final-cta h2 {
          margin: 12px 0 17px; font-size: clamp(2rem,4vw,3.55rem);
          letter-spacing: -.04em;
        }
        .final-cta p { color: #aabec9; line-height: 1.77; }
        .centered { justify-content: center; }

        @keyframes drift {
          0%,100% { transform: translate3d(0,0,0) scale(.85); opacity: .4; }
          50% { transform: translate3d(20px,-24px,0) scale(1.35); opacity: 1; }
        }
        @keyframes pulse { 0%,100% { opacity: .2; } 50% { opacity: .82; } }

        @media (max-width: 1080px) {
          .summary-grid, .rights-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .applicability-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .route-chain { grid-template-columns: repeat(3,minmax(0,1fr)); }
          .connected-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
        }
        @media (max-width: 820px) {
          .content-grid, .connected-grid { grid-template-columns: 1fr; }
          .applicability-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
        }
        @media (max-width: 640px) {
          .content-shell { width: min(100% - 24px,1220px); padding-top: 22px; }
          .breadcrumbs { margin-bottom: 42px; }
          .summary-grid, .applicability-grid, .status-panel, .search-panel,
          .declaration-row, .rights-grid, .route-chain { grid-template-columns: 1fr; }
          .card-topline { flex-direction: column; }
          .state-row { justify-content: flex-start; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(html) { scroll-behavior: auto; }
          .particle, .beam { animation: none; }
          .primary-button, .secondary-button { transition: none; }
        }
      `}</style>
    </main>
  );
}
