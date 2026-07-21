// apps/web/app/eu-ai-act/classifier/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Answer = 'yes' | 'no' | 'unknown';

type QuestionId =
  | 'developsSystem'
  | 'usesSystem'
  | 'placesOnMarket'
  | 'outsideUnionProvider'
  | 'makesAvailable'
  | 'productIntegration'
  | 'writtenMandate'
  | 'developsGpai'
  | 'directInteraction'
  | 'syntheticContent'
  | 'emotionOrBiometric'
  | 'deepfakeOrPublicInterest'
  | 'safetyComponent'
  | 'annexContext'
  | 'prohibitedIndicator'
  | 'materialModification';

type Question = {
  id: QuestionId;
  section: string;
  title: string;
  description: string;
};

type ClassificationStatus =
  | 'LIKELY IN SCOPE'
  | 'POSSIBLY IN SCOPE'
  | 'INSUFFICIENT EVIDENCE'
  | 'REVIEW REQUIRED'
  | 'NO CURRENT INDICATOR';

type Finding = {
  title: string;
  status: ClassificationStatus;
  explanation: string;
  evidence: string[];
  href?: string;
};

const questions: Question[] = [
  {
    id: 'developsSystem',
    section: 'Actor role',
    title: 'Do you develop an AI system and place it on the market or put it into service under your own name or trademark?',
    description:
      'A “yes” can indicate a provider role. Record who develops the system, whose name appears on it, and who controls its intended purpose.',
  },
  {
    id: 'usesSystem',
    section: 'Actor role',
    title: 'Do you use an AI system under your authority in a professional or organisational context?',
    description:
      'A “yes” can indicate a deployer role. Personal, non-professional use may require separate treatment.',
  },
  {
    id: 'placesOnMarket',
    section: 'Actor role',
    title: 'Do you place an AI system on the Union market under another provider’s name or trademark?',
    description:
      'This question helps distinguish importer, distributor, and other supply-chain roles.',
  },
  {
    id: 'outsideUnionProvider',
    section: 'Actor role',
    title: 'Is the named provider established outside the European Union?',
    description:
      'A Union-established actor placing that provider’s system on the market may have importer obligations.',
  },
  {
    id: 'makesAvailable',
    section: 'Actor role',
    title: 'Do you make an AI system available on the Union market without being the provider or importer?',
    description:
      'A “yes” can indicate a distributor role.',
  },
  {
    id: 'productIntegration',
    section: 'Actor role',
    title: 'Do you place an AI system on the market or put it into service together with a product under your own name or trademark?',
    description:
      'This can indicate a product-manufacturer pathway where AI is integrated with another regulated product.',
  },
  {
    id: 'writtenMandate',
    section: 'Actor role',
    title: 'Do you hold a written mandate to perform specified tasks for a provider established outside the Union?',
    description:
      'A “yes” can indicate an authorised-representative role. Preserve the mandate and its exact scope.',
  },
  {
    id: 'developsGpai',
    section: 'Model scope',
    title: 'Do you develop or place a general-purpose AI model on the market?',
    description:
      'A “yes” can trigger a model-level governance pathway distinct from an AI-system pathway.',
  },
  {
    id: 'directInteraction',
    section: 'Transparency',
    title: 'Does the AI system interact directly with natural persons?',
    description:
      'This may trigger Article 50 interaction-disclosure analysis, subject to applicable exceptions.',
  },
  {
    id: 'syntheticContent',
    section: 'Transparency',
    title: 'Does the system generate or manipulate audio, image, video, or text content?',
    description:
      'This may trigger machine-readable marking and detectability analysis.',
  },
  {
    id: 'emotionOrBiometric',
    section: 'Transparency',
    title: 'Does the deployment involve emotion recognition or biometric categorisation?',
    description:
      'This may trigger notice obligations and can also require a broader prohibited-practice or high-risk review.',
  },
  {
    id: 'deepfakeOrPublicInterest',
    section: 'Transparency',
    title: 'Will the system produce or deploy deepfakes or AI-generated text intended to inform the public on matters of public interest?',
    description:
      'This may trigger deployer-side disclosure analysis under Article 50.',
  },
  {
    id: 'safetyComponent',
    section: 'Risk classification',
    title: 'Is the AI system a safety component of a regulated product, or is the AI system itself such a product?',
    description:
      'This may indicate a high-risk pathway when the relevant product is subject to third-party conformity assessment.',
  },
  {
    id: 'annexContext',
    section: 'Risk classification',
    title: 'Is the system used in a context commonly associated with high-risk classifications?',
    description:
      'Examples can include certain biometric, critical-infrastructure, education, employment, essential-service, law-enforcement, migration, or justice contexts.',
  },
  {
    id: 'prohibitedIndicator',
    section: 'Risk classification',
    title: 'Does the use case involve manipulation, exploitation of vulnerability, social scoring, certain biometric categorisation, emotion recognition, or real-time remote biometric identification?',
    description:
      'A “yes” does not complete a legal determination, but it requires immediate prohibited-practice review.',
  },
  {
    id: 'materialModification',
    section: 'Change and responsibility',
    title: 'Have you made a substantial modification or changed the intended purpose of another provider’s system?',
    description:
      'A material change can alter role allocation and may cause an actor to assume provider responsibilities.',
  },
];

const defaultAnswers = Object.fromEntries(
  questions.map((question) => [question.id, 'unknown']),
) as Record<QuestionId, Answer>;

const statusClass: Record<ClassificationStatus, string> = {
  'LIKELY IN SCOPE': 'likely',
  'POSSIBLY IN SCOPE': 'possible',
  'INSUFFICIENT EVIDENCE': 'insufficient',
  'REVIEW REQUIRED': 'review',
  'NO CURRENT INDICATOR': 'none',
};

function countAnswers(
  answers: Record<QuestionId, Answer>,
  ids: QuestionId[],
  value: Answer,
) {
  return ids.filter((id) => answers[id] === value).length;
}

export default function EuAiActClassifierPage() {
  const [answers, setAnswers] =
    useState<Record<QuestionId, Answer>>(defaultAnswers);
  const [activeSection, setActiveSection] = useState('All');

  const sections = useMemo(
    () => ['All', ...Array.from(new Set(questions.map((question) => question.section)))],
    [],
  );

  const visibleQuestions = useMemo(
    () =>
      activeSection === 'All'
        ? questions
        : questions.filter((question) => question.section === activeSection),
    [activeSection],
  );

  const answeredCount = Object.values(answers).filter(
    (answer) => answer !== 'unknown',
  ).length;

  const findings = useMemo<Finding[]>(() => {
    const result: Finding[] = [];

    const providerYes =
      answers.developsSystem === 'yes' ||
      answers.materialModification === 'yes';
    const providerUnknown =
      answers.developsSystem === 'unknown' ||
      answers.materialModification === 'unknown';

    result.push({
      title: 'Provider pathway',
      status: providerYes
        ? 'LIKELY IN SCOPE'
        : providerUnknown
          ? 'INSUFFICIENT EVIDENCE'
          : 'NO CURRENT INDICATOR',
      explanation: providerYes
        ? 'Your declarations contain at least one provider indicator. Provider status still requires confirmation of identity, intended purpose, branding, control, and any substantial modification.'
        : providerUnknown
          ? 'Provider status cannot yet be bounded because one or more provider facts remain unresolved.'
          : 'The current declarations do not show a direct provider indicator. This is not a final legal conclusion.',
      evidence: [
        'System and model identity',
        'Named provider and trademark',
        'Intended-purpose declaration',
        'Development and control records',
        'Modification and version history',
      ],
      href: '/eu-ai-act/roles/provider',
    });

    result.push({
      title: 'Deployer pathway',
      status:
        answers.usesSystem === 'yes'
          ? 'LIKELY IN SCOPE'
          : answers.usesSystem === 'unknown'
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        answers.usesSystem === 'yes'
          ? 'Your declaration indicates professional or organisational use under your authority, which can support a deployer classification.'
          : answers.usesSystem === 'unknown'
            ? 'The use context and authority relationship remain unresolved.'
            : 'The current declarations do not show a deployer indicator.',
      evidence: [
        'Deployment context',
        'Operator and authority structure',
        'Intended use',
        'Affected-person context',
        'Operational procedures',
      ],
      href: '/eu-ai-act/roles/deployer',
    });

    const importerYes =
      answers.placesOnMarket === 'yes' &&
      answers.outsideUnionProvider === 'yes';
    const importerUnknown =
      answers.placesOnMarket === 'unknown' ||
      answers.outsideUnionProvider === 'unknown';

    result.push({
      title: 'Importer pathway',
      status: importerYes
        ? 'LIKELY IN SCOPE'
        : importerUnknown
          ? 'INSUFFICIENT EVIDENCE'
          : 'NO CURRENT INDICATOR',
      explanation: importerYes
        ? 'Your declarations indicate a Union-market placement involving a provider established outside the Union.'
        : importerUnknown
          ? 'The named provider’s establishment and market-placement facts are incomplete.'
          : 'The current declarations do not show the combined importer indicators.',
      evidence: [
        'Provider legal identity',
        'Provider establishment location',
        'Market-placement records',
        'Product and system labelling',
        'Supply-chain agreements',
      ],
      href: '/eu-ai-act/roles/importer',
    });

    result.push({
      title: 'Distributor pathway',
      status:
        answers.makesAvailable === 'yes'
          ? 'POSSIBLY IN SCOPE'
          : answers.makesAvailable === 'unknown'
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        answers.makesAvailable === 'yes'
          ? 'Making a system available can indicate a distributor role, but provider and importer status must first be excluded.'
          : answers.makesAvailable === 'unknown'
            ? 'The supply-chain role remains unresolved.'
            : 'The current declarations do not show a distributor indicator.',
      evidence: [
        'Supply-chain position',
        'Invoices and distribution agreements',
        'Provider and importer identity',
        'Market availability chronology',
      ],
      href: '/eu-ai-act/roles/distributor',
    });

    result.push({
      title: 'Product-manufacturer pathway',
      status:
        answers.productIntegration === 'yes'
          ? 'POSSIBLY IN SCOPE'
          : answers.productIntegration === 'unknown'
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        answers.productIntegration === 'yes'
          ? 'Your declaration indicates AI may be placed on the market or put into service together with a product under your name or trademark.'
          : answers.productIntegration === 'unknown'
            ? 'Product integration and branding remain unresolved.'
            : 'The current declarations do not show a product-manufacturer indicator.',
      evidence: [
        'Product identity',
        'Integrated AI function',
        'Product manufacturer identity',
        'Applicable product legislation',
        'Conformity-assessment pathway',
      ],
      href: '/eu-ai-act/roles/product-manufacturer',
    });

    result.push({
      title: 'Authorised-representative pathway',
      status:
        answers.writtenMandate === 'yes'
          ? 'LIKELY IN SCOPE'
          : answers.writtenMandate === 'unknown'
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        answers.writtenMandate === 'yes'
          ? 'A written mandate is a strong indicator of an authorised-representative pathway. The mandate’s scope controls what tasks are actually assigned.'
          : answers.writtenMandate === 'unknown'
            ? 'The existence and scope of a written mandate remain unresolved.'
            : 'The current declarations do not show an authorised-representative indicator.',
      evidence: [
        'Executed written mandate',
        'Provider identity and establishment',
        'Assigned tasks',
        'Authority limitations',
        'Communication and retention duties',
      ],
      href: '/eu-ai-act/roles/authorised-representative',
    });

    result.push({
      title: 'General-purpose AI pathway',
      status:
        answers.developsGpai === 'yes'
          ? 'LIKELY IN SCOPE'
          : answers.developsGpai === 'unknown'
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        answers.developsGpai === 'yes'
          ? 'Your declaration indicates a possible general-purpose AI model-provider pathway requiring model-level obligations to be separated from downstream system obligations.'
          : answers.developsGpai === 'unknown'
            ? 'The model type, provider identity, and market-placement facts remain unresolved.'
            : 'The current declarations do not show a GPAI-provider indicator.',
      evidence: [
        'Model identity and release record',
        'Provider identity',
        'Training and technical information',
        'Downstream documentation',
        'Systemic-risk analysis where applicable',
      ],
      href: '/eu-ai-act/gpai',
    });

    const article50Yes = countAnswers(
      answers,
      [
        'directInteraction',
        'syntheticContent',
        'emotionOrBiometric',
        'deepfakeOrPublicInterest',
      ],
      'yes',
    );
    const article50Unknown = countAnswers(
      answers,
      [
        'directInteraction',
        'syntheticContent',
        'emotionOrBiometric',
        'deepfakeOrPublicInterest',
      ],
      'unknown',
    );

    result.push({
      title: 'Article 50 transparency pathway',
      status:
        article50Yes > 0
          ? 'LIKELY IN SCOPE'
          : article50Unknown > 0
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        article50Yes > 0
          ? `${article50Yes} declared transparency indicator${article50Yes === 1 ? '' : 's'} require mapping against the relevant Article 50 pathway and exceptions.`
          : article50Unknown > 0
            ? 'One or more transparency-trigger facts remain unresolved.'
            : 'The current declarations do not show an Article 50 trigger.',
      evidence: [
        'Interface and disclosure captures',
        'Synthetic-content marking design',
        'Detectability testing',
        'Deployment context',
        'Exception analysis',
      ],
      href: '/eu-ai-act#article-50-workspace',
    });

    const highRiskYes = countAnswers(
      answers,
      ['safetyComponent', 'annexContext'],
      'yes',
    );
    const highRiskUnknown = countAnswers(
      answers,
      ['safetyComponent', 'annexContext'],
      'unknown',
    );

    result.push({
      title: 'High-risk classification pathway',
      status:
        highRiskYes > 0
          ? 'REVIEW REQUIRED'
          : highRiskUnknown > 0
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        highRiskYes > 0
          ? 'At least one declared fact may support a high-risk classification pathway. Annex scope, intended purpose, exceptions, and product-legislation conditions require structured review.'
          : highRiskUnknown > 0
            ? 'High-risk classification cannot be bounded because system context remains incomplete.'
            : 'The current declarations do not show a direct high-risk indicator.',
      evidence: [
        'Intended purpose',
        'Sector and use context',
        'Affected persons',
        'Applicable Annex category',
        'Product legislation and assessment route',
      ],
      href: '/eu-ai-act/high-risk',
    });

    result.push({
      title: 'Prohibited-practice review',
      status:
        answers.prohibitedIndicator === 'yes'
          ? 'REVIEW REQUIRED'
          : answers.prohibitedIndicator === 'unknown'
            ? 'INSUFFICIENT EVIDENCE'
            : 'NO CURRENT INDICATOR',
      explanation:
        answers.prohibitedIndicator === 'yes'
          ? 'Your declaration contains a potential prohibited-practice indicator. Do not treat this classifier as permission to proceed. Escalate for qualified legal and governance review before execution.'
          : answers.prohibitedIndicator === 'unknown'
            ? 'The use case has not been sufficiently described to exclude a prohibited-practice pathway.'
            : 'The current declarations do not show a direct prohibited-practice indicator.',
      evidence: [
        'Detailed use-case description',
        'Affected-person characteristics',
        'Decision and influence mechanism',
        'Biometric or emotion functionality',
        'Exception and authority analysis',
      ],
      href: '/eu-ai-act/prohibited-practices',
    });

    return result;
  }, [answers]);

  const unresolvedCount = Object.values(answers).filter(
    (answer) => answer === 'unknown',
  ).length;

  const reset = () => {
    setAnswers(defaultAnswers);
    setActiveSection('All');
  };

  return (
    <main className="page-shell">
      <div className="ambient-field" aria-hidden="true">
        <span className="orbit orbit-one" />
        <span className="orbit orbit-two" />
        <span className="node node-one" />
        <span className="node node-two" />
        <span className="node node-three" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">TA-14 AI Governance Exchange</Link>
          <span>/</span>
          <Link href="/eu-ai-act">EU AI Act</Link>
          <span>/</span>
          <span>Guided Classification</span>
        </nav>

        <header className="hero">
          <span className="eyebrow">GUIDED ROLE AND SYSTEM CLASSIFICATION</span>
          <h1>Separate known facts from assumptions before choosing a compliance route.</h1>
          <p className="hero-copy">
            This guided workspace helps identify possible actor roles, transparency triggers,
            high-risk indicators, prohibited-practice concerns, and evidence gaps. It does not make
            a final legal determination, certify compliance, or authorise deployment.
          </p>

          <div className="boundary-panel">
            <strong>Classification boundary</strong>
            <p>
              Results are generated only from your declarations. Unknown facts remain unknown.
              Possible classifications remain possible until supported by evidence and qualified
              review.
            </p>
          </div>

          <div className="summary-strip">
            <div>
              <span>Questions answered</span>
              <strong>
                {answeredCount} / {questions.length}
              </strong>
            </div>
            <div>
              <span>Unresolved facts</span>
              <strong>{unresolvedCount}</strong>
            </div>
            <div>
              <span>Current output</span>
              <strong>NON-BINDING</strong>
            </div>
          </div>
        </header>

        <section className="workflow-section">
          <div className="section-heading">
            <span className="eyebrow">DECLARED-FACT WORKSPACE</span>
            <h2>Answer only what you can presently support.</h2>
            <p>
              Choose “Unknown” whenever the fact has not been established. The classifier preserves
              uncertainty instead of converting missing information into a conclusion.
            </p>
          </div>

          <div className="section-filters" aria-label="Question sections">
            {sections.map((section) => (
              <button
                key={section}
                type="button"
                className={activeSection === section ? 'selected' : ''}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="question-grid">
            {visibleQuestions.map((question, index) => (
              <article className="question-card" key={question.id}>
                <div className="question-topline">
                  <span>{question.section}</span>
                  <small>
                    {String(
                      questions.findIndex((item) => item.id === question.id) + 1,
                    ).padStart(2, '0')}
                  </small>
                </div>

                <h3>{question.title}</h3>
                <p>{question.description}</p>

                <div
                  className="answer-row"
                  role="group"
                  aria-label={`Answer: ${question.title}`}
                >
                  {(['yes', 'no', 'unknown'] as const).map((answer) => (
                    <button
                      key={answer}
                      type="button"
                      className={
                        answers[question.id] === answer
                          ? `answer-button selected ${answer}`
                          : `answer-button ${answer}`
                      }
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: answer,
                        }))
                      }
                    >
                      {answer === 'yes'
                        ? 'Yes'
                        : answer === 'no'
                          ? 'No'
                          : 'Unknown'}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="results-section">
          <div className="section-heading">
            <span className="eyebrow">BOUNDED CLASSIFICATION OUTPUT</span>
            <h2>Possible pathways generated from the declared facts.</h2>
            <p>
              Each finding states what the current declarations can support, what remains unresolved,
              and which evidence should be preserved before a stronger determination is attempted.
            </p>
          </div>

          <div className="legend">
            {(
              [
                'LIKELY IN SCOPE',
                'POSSIBLY IN SCOPE',
                'INSUFFICIENT EVIDENCE',
                'REVIEW REQUIRED',
                'NO CURRENT INDICATOR',
              ] as const
            ).map((status) => (
              <span className={statusClass[status]} key={status}>
                {status}
              </span>
            ))}
          </div>

          <div className="finding-grid">
            {findings.map((finding) => (
              <article className="finding-card" key={finding.title}>
                <div className="finding-topline">
                  <h3>{finding.title}</h3>
                  <span className={`finding-status ${statusClass[finding.status]}`}>
                    {finding.status}
                  </span>
                </div>

                <p className="finding-explanation">{finding.explanation}</p>

                <div className="evidence-box">
                  <span>Evidence still required</span>
                  <ul>
                    {finding.evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {finding.href ? (
                  <Link className="finding-link" href={finding.href}>
                    Open governed pathway →
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="record-section">
          <div className="section-heading">
            <span className="eyebrow">WHAT THIS RESULT IS—and IS NOT</span>
            <h2>A classification aid is not a compliance certificate.</h2>
          </div>

          <div className="boundary-grid">
            <article>
              <span>THIS RESULT CAN</span>
              <ul>
                <li>Preserve your declared facts.</li>
                <li>Expose unresolved facts and evidence gaps.</li>
                <li>Identify possible actor and obligation pathways.</li>
                <li>Direct you toward the next governed workspace.</li>
                <li>Support a later qualified review.</li>
              </ul>
            </article>

            <article>
              <span>THIS RESULT CANNOT</span>
              <ul>
                <li>Provide legal advice.</li>
                <li>Make a final legal classification.</li>
                <li>Certify EU AI Act compliance.</li>
                <li>Replace conformity assessment.</li>
                <li>Authorise a prohibited or high-risk use.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="final-actions">
          <div>
            <span className="eyebrow">NEXT GOVERNED STEP</span>
            <h2>Preserve the facts, resolve the unknowns, and then map the route.</h2>
            <p>
              A future backend connection can convert these declarations into a saved applicability
              record, evidence request, reviewer package, and governed route. This page currently
              performs client-side guidance only.
            </p>
          </div>

          <div className="action-row">
            <Link className="primary-button" href="/eu-ai-act">
              Return to EU AI Act
            </Link>
            <Link className="secondary-button" href="/marketplace/professionals">
              Find Independent Review
            </Link>
            <button className="reset-button" type="button" onClick={reset}>
              Reset Classification
            </button>
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
          color: #eff8ff;
          background: #06101b;
        }

        :global(a) {
          color: inherit;
        }

        button {
          font: inherit;
        }

        .page-shell {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            linear-gradient(rgba(4, 14, 24, 0.8), rgba(4, 14, 24, 0.98)),
            radial-gradient(circle at 12% 4%, rgba(17, 129, 171, 0.2), transparent 33%),
            radial-gradient(circle at 87% 8%, rgba(149, 102, 31, 0.13), transparent 31%);
        }

        .content-shell {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
        }

        .ambient-field {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.6;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(112, 216, 239, 0.11);
          border-radius: 50%;
          animation: rotate 26s linear infinite;
        }

        .orbit-one {
          top: 8%;
          right: -14vw;
          width: 52vw;
          height: 52vw;
        }

        .orbit-two {
          bottom: -25vw;
          left: -16vw;
          width: 62vw;
          height: 62vw;
          animation-direction: reverse;
          animation-duration: 34s;
        }

        .node {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #89e7fa;
          box-shadow: 0 0 22px rgba(93, 215, 243, 0.95);
          animation: drift 12s ease-in-out infinite;
        }

        .node-one {
          top: 15%;
          right: 13%;
        }

        .node-two {
          top: 48%;
          left: 8%;
          animation-delay: -4s;
        }

        .node-three {
          bottom: 16%;
          right: 18%;
          animation-delay: -8s;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 58px;
          color: #83a8b7;
          font-size: 0.86rem;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover {
          color: #ffffff;
        }

        .eyebrow {
          display: inline-block;
          color: #70d8ef;
          font-size: 0.74rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        .hero {
          max-width: 1040px;
          padding-bottom: 74px;
        }

        h1 {
          margin: 18px 0 24px;
          font-size: clamp(3rem, 7vw, 6.7rem);
          line-height: 0.95;
          letter-spacing: -0.058em;
        }

        .hero-copy {
          max-width: 900px;
          color: #b5cbd6;
          font-size: 1.08rem;
          line-height: 1.8;
        }

        .boundary-panel {
          margin-top: 24px;
          padding: 18px 20px;
          border-left: 3px solid #dcba5d;
          border-radius: 0 15px 15px 0;
          background: rgba(206, 154, 36, 0.065);
        }

        .boundary-panel strong {
          color: #ffe29a;
        }

        .boundary-panel p {
          margin: 8px 0 0;
          color: #bfb58f;
          line-height: 1.65;
        }

        .summary-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .summary-strip > div {
          padding: 20px;
          border: 1px solid rgba(103, 194, 218, 0.16);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.74);
        }

        .summary-strip span {
          display: block;
          color: #7899a8;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .summary-strip strong {
          display: block;
          margin-top: 18px;
          font-size: 1.4rem;
        }

        .workflow-section,
        .results-section,
        .record-section {
          padding-top: 76px;
        }

        .section-heading {
          max-width: 930px;
          margin-bottom: 30px;
        }

        .section-heading h2,
        .final-actions h2 {
          margin: 12px 0 17px;
          font-size: clamp(2.25rem, 5vw, 4.55rem);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .section-heading p,
        .final-actions p {
          color: #a8bec8;
          line-height: 1.75;
        }

        .section-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 20px;
          padding: 16px;
          border: 1px solid rgba(103, 194, 220, 0.16);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.68);
        }

        .section-filters button {
          border: 1px solid rgba(123, 202, 224, 0.18);
          border-radius: 999px;
          padding: 10px 13px;
          color: #acd3df;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .section-filters button.selected {
          border-color: #67d4eb;
          color: #031019;
          background: #77dff4;
          font-weight: 900;
        }

        .question-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .question-card {
          display: flex;
          min-height: 320px;
          flex-direction: column;
          padding: 24px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 23px;
          background: linear-gradient(
            145deg,
            rgba(14, 38, 55, 0.93),
            rgba(7, 23, 36, 0.9)
          );
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.14);
        }

        .question-topline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: #70d8ef;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .question-topline small {
          color: #607d8b;
        }

        .question-card h3 {
          margin: 32px 0 13px;
          font-size: 1.42rem;
          line-height: 1.25;
          letter-spacing: -0.025em;
        }

        .question-card p {
          color: #9fb6c1;
          line-height: 1.66;
        }

        .answer-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: auto;
          padding-top: 20px;
        }

        .answer-button {
          min-height: 44px;
          border: 1px solid rgba(126, 199, 219, 0.18);
          border-radius: 12px;
          color: #a9c5cf;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
          transition:
            transform 170ms ease,
            border-color 170ms ease,
            background 170ms ease;
        }

        .answer-button:hover,
        .answer-button:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(126, 207, 228, 0.48);
          outline: none;
        }

        .answer-button.selected.yes {
          border-color: rgba(71, 209, 145, 0.55);
          color: #081b13;
          background: #8cebc3;
          font-weight: 900;
        }

        .answer-button.selected.no {
          border-color: rgba(133, 176, 201, 0.48);
          color: #eef8fc;
          background: rgba(77, 113, 134, 0.55);
          font-weight: 900;
        }

        .answer-button.selected.unknown {
          border-color: rgba(218, 177, 69, 0.48);
          color: #261d08;
          background: #ffe09a;
          font-weight: 900;
        }

        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .legend span,
        .finding-status {
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.65rem;
          font-weight: 950;
          letter-spacing: 0.06em;
        }

        .likely {
          color: #8cebc3;
          background: rgba(45, 163, 113, 0.11);
        }

        .possible {
          color: #a7dcff;
          background: rgba(52, 129, 178, 0.11);
        }

        .insufficient {
          color: #ffe09a;
          background: rgba(184, 131, 27, 0.11);
        }

        .review {
          color: #ffb2b2;
          background: rgba(184, 58, 58, 0.12);
        }

        .none {
          color: #9cb1bb;
          background: rgba(111, 137, 149, 0.1);
        }

        .finding-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .finding-card {
          display: flex;
          min-height: 360px;
          flex-direction: column;
          padding: 24px;
          border: 1px solid rgba(103, 194, 220, 0.16);
          border-radius: 22px;
          background: rgba(10, 30, 45, 0.74);
        }

        .finding-topline {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          align-items: flex-start;
        }

        .finding-topline h3 {
          margin: 0;
          font-size: 1.35rem;
        }

        .finding-status {
          flex: 0 0 auto;
        }

        .finding-explanation {
          margin: 24px 0 0;
          color: #a5bbc5;
          line-height: 1.67;
        }

        .evidence-box {
          margin-top: 19px;
          padding: 17px;
          border-left: 3px solid #5fcde7;
          border-radius: 0 14px 14px 0;
          background: rgba(59, 169, 198, 0.06);
        }

        .evidence-box > span {
          color: #79a8b6;
          font-size: 0.69rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .evidence-box ul,
        .boundary-grid ul {
          margin: 10px 0 0;
          padding-left: 18px;
          color: #a4bac4;
          line-height: 1.65;
        }

        .finding-link {
          margin-top: auto;
          padding-top: 22px;
          color: #9feaff;
          font-size: 0.85rem;
          font-weight: 900;
          text-decoration: none;
        }

        .finding-link:hover {
          color: #ffffff;
        }

        .boundary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .boundary-grid article {
          min-height: 290px;
          padding: 27px;
          border: 1px solid rgba(103, 194, 220, 0.16);
          border-radius: 22px;
          background: rgba(10, 30, 45, 0.74);
        }

        .boundary-grid article:first-child {
          border-color: rgba(71, 209, 145, 0.22);
        }

        .boundary-grid article:last-child {
          border-color: rgba(218, 177, 69, 0.24);
        }

        .boundary-grid span {
          color: #70d8ef;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .final-actions {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 34px;
          align-items: end;
          margin-top: 82px;
          padding: clamp(30px, 5vw, 54px);
          border: 1px solid rgba(117, 205, 228, 0.19);
          border-radius: 28px;
          background:
            radial-gradient(circle at top left, rgba(56, 173, 205, 0.11), transparent 48%),
            rgba(10, 30, 46, 0.84);
        }

        .action-row {
          display: flex;
          min-width: 245px;
          flex-direction: column;
          gap: 10px;
        }

        .primary-button,
        .secondary-button,
        .reset-button {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 18px;
          font-weight: 950;
          text-decoration: none;
          cursor: pointer;
        }

        .primary-button {
          border: 1px solid #88e5f8;
          color: #031019;
          background: linear-gradient(135deg, #a5efff, #55cae7);
        }

        .secondary-button {
          border: 1px solid rgba(147, 208, 227, 0.3);
          color: #eaf9ff;
          background: rgba(10, 29, 44, 0.82);
        }

        .reset-button {
          border: 1px solid rgba(218, 177, 69, 0.28);
          color: #ffe2a0;
          background: rgba(193, 132, 18, 0.07);
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
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

        @media (max-width: 900px) {
          .question-grid,
          .finding-grid {
            grid-template-columns: 1fr;
          }

          .final-actions {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .action-row {
            min-width: 0;
          }
        }

        @media (max-width: 680px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .summary-strip,
          .boundary-grid {
            grid-template-columns: 1fr;
          }

          .finding-topline {
            flex-direction: column;
          }

          .answer-row {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .orbit,
          .node {
            animation: none;
          }

          .answer-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
