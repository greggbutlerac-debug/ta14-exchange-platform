// apps/web/app/marketplace/post-a-need/page.tsx
'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';

type NeedType =
  | 'AI governance'
  | 'Governed record'
  | 'Route design'
  | 'Independent review'
  | 'Verification'
  | 'Environmental integrity'
  | 'Other';

type Visibility = 'Public opportunity' | 'Private invitation' | 'Draft only';

type FormState = {
  title: string;
  organization: string;
  contactName: string;
  email: string;
  needType: NeedType;
  domain: string;
  consequentialAction: string;
  existingEvidence: string;
  desiredDeliverable: string;
  timeline: string;
  budget: string;
  requiredExpertise: string;
  visibility: Visibility;
  consent: boolean;
};

const initialState: FormState = {
  title: '',
  organization: '',
  contactName: '',
  email: '',
  needType: 'AI governance',
  domain: '',
  consequentialAction: '',
  existingEvidence: '',
  desiredDeliverable: '',
  timeline: '',
  budget: '',
  requiredExpertise: '',
  visibility: 'Draft only',
  consent: false,
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  governedRecords: '/marketplace/governed-records',
  routes: '/marketplace/routes',
} as const;

const guidedMission = [
  {
    label: 'Define the need',
    text: 'Describe the real governance problem instead of starting with a product or service request.',
  },
  {
    label: 'Declare the consequence',
    text: 'Identify what decision, action, person, system, payment, record, or outcome may be affected.',
  },
  {
    label: 'Expose the evidence state',
    text: 'Show what evidence already exists, what is missing, and what cannot yet be verified.',
  },
  {
    label: 'Bound the deliverable',
    text: 'Request a specific route, record, review, interpretation, verification, or implementation artifact.',
  },
];

const needCards: Array<{
  type: NeedType;
  title: string;
  description: string;
}> = [
  {
    type: 'AI governance',
    title: 'AI Governance Need',
    description: 'Classify, map, test, or document an AI governance requirement.',
  },
  {
    type: 'Governed record',
    title: 'Governed Record',
    description: 'Request creation, interpretation, continuity review, or preservation of a record.',
  },
  {
    type: 'Route design',
    title: 'Governance Route',
    description: 'Build an evidence-bound route from requirement through decision and outcome.',
  },
  {
    type: 'Independent review',
    title: 'Independent Review',
    description: 'Request a bounded review from a qualified governance professional.',
  },
  {
    type: 'Verification',
    title: 'Verification',
    description: 'Evaluate a declared route, receipt, replay package, or evidence chain.',
  },
  {
    type: 'Environmental integrity',
    title: 'Environmental Integrity',
    description: 'Request work involving land, water, air, building, HVAC, hospital, or laboratory records.',
  },
];

function FieldGuide({ children }: { children: React.ReactNode }) {
  return <p className="field-guide">{children}</p>;
}

function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="progress-shell" aria-label={`Form completion: ${percent}%`}>
      <div className="progress-meta">
        <span>Opportunity readiness</span>
        <strong>{percent}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function PostAGovernanceNeedPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const completedFields = useMemo(() => {
    const checks = [
      form.title.trim(),
      form.organization.trim(),
      form.contactName.trim(),
      form.email.trim(),
      form.domain.trim(),
      form.consequentialAction.trim(),
      form.desiredDeliverable.trim(),
      form.timeline.trim(),
      form.requiredExpertise.trim(),
      form.consent ? 'yes' : '',
    ];

    return checks.filter(Boolean).length;
  }, [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.consent) {
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(initialState);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-shell">
      <div className="cosmos" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="star star-five" />
        <span className="orbit orbit-one">
          <span />
        </span>
        <span className="orbit orbit-two">
          <span />
        </span>
        <span className="route-line route-line-one" />
        <span className="route-line route-line-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={MARKETPLACE_ROUTES.home}>Marketplace</Link>
          <span aria-hidden="true">/</span>
          <span>Post a Governance Need</span>
        </nav>

        {submitted ? (
          <section className="success-panel" aria-live="polite">
            <div className="status-badge">DEMONSTRATION DRAFT CREATED</div>
            <h1>Your governance need has been structured.</h1>
            <p>
              This front-end demonstration does not publish data or create a live marketplace
              opportunity. It shows the record that will be created once Marketplace persistence,
              review, and publication workflows are connected.
            </p>

            <div className="summary-grid">
              <article>
                <span>Opportunity</span>
                <strong>{form.title || 'Untitled governance need'}</strong>
              </article>
              <article>
                <span>Need type</span>
                <strong>{form.needType}</strong>
              </article>
              <article>
                <span>Visibility</span>
                <strong>{form.visibility}</strong>
              </article>
              <article>
                <span>Timeline</span>
                <strong>{form.timeline || 'Not declared'}</strong>
              </article>
            </div>

            <div className="boundary-box">
              <strong>Marketplace boundary</strong>
              <p>
                Submission does not certify the opportunity, verify the requester, guarantee a
                match, establish legal compliance, or authorize consequential execution.
              </p>
            </div>

            <div className="action-row">
              <button type="button" className="primary-button" onClick={resetForm}>
                Create another draft
              </button>
              <Link className="secondary-button" href={MARKETPLACE_ROUTES.home}>
                Return to Marketplace
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="hero">
              <div className="eyebrow">TA-14 Collaborative Governance Marketplace</div>
              <h1>Post a Governance Need</h1>
              <p className="hero-copy">
                Describe what must be governed, what may be affected, what evidence exists, and
                what bounded result you need. The Marketplace should begin with the consequence,
                not with a generic job listing.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="#guided-intake">
                  Start guided intake
                </a>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.home}>
                  Return to Marketplace
                </Link>
              </div>
            </header>

            <section className="mission-section" aria-labelledby="guided-mission-title">
              <div className="section-heading">
                <span>Guided Mission</span>
                <h2 id="guided-mission-title">Why this intake is different</h2>
                <p>
                  Every question exists to protect scope, continuity, attribution, and
                  admissibility.
                </p>
              </div>

              <div className="mission-grid">
                {guidedMission.map((item, index) => (
                  <article className="mission-card" key={item.label}>
                    <span className="mission-number">{String(index + 1).padStart(2, '0')}</span>
                    <h3>{item.label}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="door-section" aria-labelledby="need-type-title">
              <div className="section-heading">
                <span>Choose a doorway</span>
                <h2 id="need-type-title">What kind of governance help do you need?</h2>
              </div>

              <div className="door-grid">
                {needCards.map((card) => {
                  const selected = form.needType === card.type;

                  return (
                    <button
                      className={`door-card${selected ? ' selected' : ''}`}
                      key={card.type}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => update('needType', card.type)}
                    >
                      <span className="door-light" />
                      <strong>{card.title}</strong>
                      <p>{card.description}</p>
                      <span className="door-action">
                        {selected ? 'Selected' : 'Choose this doorway'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section id="guided-intake" className="intake-layout">
              <aside className="intake-aside">
                <div className="sticky-panel">
                  <span className="panel-kicker">Opportunity record</span>
                  <h2>Build a bounded request</h2>
                  <p>
                    Complete the declared facts. Missing information remains visible instead of
                    being silently assumed.
                  </p>

                  <ProgressBar completed={completedFields} total={10} />

                  <div className="record-preview">
                    <div>
                      <span>Type</span>
                      <strong>{form.needType}</strong>
                    </div>
                    <div>
                      <span>Domain</span>
                      <strong>{form.domain || 'Not declared'}</strong>
                    </div>
                    <div>
                      <span>Visibility</span>
                      <strong>{form.visibility}</strong>
                    </div>
                    <div>
                      <span>Evidence</span>
                      <strong>{form.existingEvidence ? 'Declared' : 'Not declared'}</strong>
                    </div>
                  </div>
                </div>
              </aside>

              <form className="intake-form" onSubmit={handleSubmit}>
                <section className="form-section">
                  <div className="form-section-heading">
                    <span>01</span>
                    <div>
                      <h2>Requester and opportunity identity</h2>
                      <p>Establish who is asking and how the request should be recognized.</p>
                    </div>
                  </div>

                  <div className="field-grid two-columns">
                    <label>
                      Opportunity title
                      <input
                        required
                        value={form.title}
                        onChange={(event) => update('title', event.target.value)}
                        placeholder="Example: Independent review of an AI hiring route"
                      />
                      <FieldGuide>Use a specific outcome-oriented title.</FieldGuide>
                    </label>

                    <label>
                      Organization
                      <input
                        required
                        value={form.organization}
                        onChange={(event) => update('organization', event.target.value)}
                        placeholder="Organization or project name"
                      />
                    </label>

                    <label>
                      Contact name
                      <input
                        required
                        value={form.contactName}
                        onChange={(event) => update('contactName', event.target.value)}
                        placeholder="Primary requester"
                      />
                    </label>

                    <label>
                      Contact email
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) => update('email', event.target.value)}
                        placeholder="name@example.com"
                      />
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span>02</span>
                    <div>
                      <h2>Governance scope</h2>
                      <p>Describe the domain, consequence, and current evidence state.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label>
                      Domain
                      <input
                        required
                        value={form.domain}
                        onChange={(event) => update('domain', event.target.value)}
                        placeholder="AI, healthcare, finance, environmental, BAS, public sector..."
                      />
                      <FieldGuide>
                        State the operating domain, not merely the technology name.
                      </FieldGuide>
                    </label>

                    <label>
                      Consequential action or outcome
                      <textarea
                        required
                        rows={5}
                        value={form.consequentialAction}
                        onChange={(event) => update('consequentialAction', event.target.value)}
                        placeholder="What decision, action, person, payment, system, record, or outcome could be affected?"
                      />
                      <FieldGuide>
                        This is the center of the request. Explain what may bind, change, deny,
                        approve, release, or affect someone.
                      </FieldGuide>
                    </label>

                    <label>
                      Existing evidence
                      <textarea
                        rows={5}
                        value={form.existingEvidence}
                        onChange={(event) => update('existingEvidence', event.target.value)}
                        placeholder="Documents, logs, policies, tests, records, screenshots, source code, receipts, or known gaps"
                      />
                      <FieldGuide>
                        It is acceptable to state that evidence is missing, disputed, inaccessible,
                        or stale.
                      </FieldGuide>
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span>03</span>
                    <div>
                      <h2>Requested result</h2>
                      <p>Bound the deliverable, qualifications, timing, and commercial expectations.</p>
                    </div>
                  </div>

                  <div className="field-grid">
                    <label>
                      Desired deliverable
                      <textarea
                        required
                        rows={5}
                        value={form.desiredDeliverable}
                        onChange={(event) => update('desiredDeliverable', event.target.value)}
                        placeholder="Example: Article-level applicability map, governed route, evidence-gap report, and independent review"
                      />
                    </label>

                    <div className="field-grid two-columns">
                      <label>
                        Timeline
                        <input
                          required
                          value={form.timeline}
                          onChange={(event) => update('timeline', event.target.value)}
                          placeholder="Example: 30 days"
                        />
                      </label>

                      <label>
                        Budget or commercial range
                        <input
                          value={form.budget}
                          onChange={(event) => update('budget', event.target.value)}
                          placeholder="Optional"
                        />
                      </label>
                    </div>

                    <label>
                      Required expertise
                      <textarea
                        required
                        rows={4}
                        value={form.requiredExpertise}
                        onChange={(event) => update('requiredExpertise', event.target.value)}
                        placeholder="Domains, credentials, review experience, technical disciplines, jurisdictions, or independence requirements"
                      />
                    </label>
                  </div>
                </section>

                <section className="form-section">
                  <div className="form-section-heading">
                    <span>04</span>
                    <div>
                      <h2>Visibility and publication state</h2>
                      <p>
                        Keep drafting, prepare a private invitation, or plan a public opportunity.
                      </p>
                    </div>
                  </div>

                  <fieldset className="choice-grid">
                    <legend>Choose visibility</legend>
                    {(
                      [
                        {
                          value: 'Draft only',
                          text: 'Save as a private draft until persistence is connected.',
                        },
                        {
                          value: 'Private invitation',
                          text: 'Prepare a scoped invitation for selected professionals.',
                        },
                        {
                          value: 'Public opportunity',
                          text: 'Prepare a public marketplace listing after review.',
                        },
                      ] as Array<{ value: Visibility; text: string }>
                    ).map((option) => (
                      <label
                        className={`choice-card${
                          form.visibility === option.value ? ' selected' : ''
                        }`}
                        key={option.value}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={form.visibility === option.value}
                          onChange={() => update('visibility', option.value)}
                        />
                        <strong>{option.value}</strong>
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </fieldset>
                </section>

                <section className="form-section final-section">
                  <label className="consent-row">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(event) => update('consent', event.target.checked)}
                    />
                    <span>
                      I understand this demonstration creates only a browser-local preview. It does
                      not publish an opportunity, verify identities, collect payment, establish
                      legal compliance, or authorize execution.
                    </span>
                  </label>

                  <div className="boundary-box">
                    <strong>No evidence is silently supplied.</strong>
                    <p>
                      The future Marketplace workflow must preserve missing facts, disputed claims,
                      scope limits, reviewer independence, version history, and the original
                      request.
                    </p>
                  </div>

                  <div className="submit-row">
                    <button className="primary-button" type="submit" disabled={!form.consent}>
                      Create demonstration draft
                    </button>
                    <button className="text-button" type="button" onClick={resetForm}>
                      Clear form
                    </button>
                  </div>
                </section>
              </form>
            </section>

            <section className="how-it-works">
              <div className="section-heading">
                <span>Governed exchange sequence</span>
                <h2>What happens after a need is posted?</h2>
              </div>

              <div className="sequence">
                {[
                  'Request preserved',
                  'Scope reviewed',
                  'Professionals matched',
                  'Evidence exchanged',
                  'Work performed',
                  'Review completed',
                  'Records preserved',
                ].map((step, index) => (
                  <div className="sequence-step" key={step}>
                    <span>{index + 1}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
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
          background:
            radial-gradient(circle at 20% 10%, rgba(32, 142, 181, 0.16), transparent 30%),
            radial-gradient(circle at 78% 4%, rgba(114, 69, 199, 0.15), transparent 31%),
            #06111d;
          color: #eef8ff;
        }

        :global(a) {
          color: inherit;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .page-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(rgba(5, 17, 29, 0.76), rgba(5, 17, 29, 0.96)),
            radial-gradient(circle at center, rgba(23, 101, 137, 0.12), transparent 56%);
        }

        .content-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 90px;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.8;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #dff8ff;
          box-shadow: 0 0 16px rgba(157, 234, 255, 0.95);
          animation: drift 13s ease-in-out infinite;
        }

        .star-one {
          top: 14%;
          left: 8%;
        }

        .star-two {
          top: 28%;
          right: 12%;
          animation-delay: -4s;
        }

        .star-three {
          top: 61%;
          left: 15%;
          animation-delay: -8s;
        }

        .star-four {
          top: 76%;
          right: 18%;
          animation-delay: -2s;
        }

        .star-five {
          top: 44%;
          left: 52%;
          animation-delay: -10s;
        }

        .orbit {
          position: absolute;
          width: 280px;
          height: 280px;
          border: 1px solid rgba(104, 211, 238, 0.13);
          border-radius: 50%;
          animation: rotate 28s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #8feaff;
          box-shadow: 0 0 22px rgba(77, 210, 242, 0.9);
          left: 50%;
          top: -5px;
        }

        .orbit-one {
          top: 7%;
          right: -120px;
        }

        .orbit-two {
          bottom: 10%;
          left: -140px;
          width: 360px;
          height: 360px;
          animation-direction: reverse;
          animation-duration: 34s;
        }

        .route-line {
          position: absolute;
          height: 1px;
          width: 34vw;
          background: linear-gradient(90deg, transparent, rgba(74, 211, 239, 0.32), transparent);
          transform: rotate(-18deg);
          animation: pulse 7s ease-in-out infinite;
        }

        .route-line-one {
          top: 23%;
          left: 3%;
        }

        .route-line-two {
          bottom: 22%;
          right: 4%;
          transform: rotate(24deg);
          animation-delay: -3s;
        }

        .breadcrumbs {
          display: flex;
          gap: 10px;
          align-items: center;
          color: #9dc9dc;
          font-size: 0.88rem;
          margin-bottom: 56px;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover {
          color: #ffffff;
        }

        .hero {
          max-width: 900px;
          padding-bottom: 70px;
        }

        .eyebrow,
        .panel-kicker,
        .section-heading > span {
          display: inline-block;
          color: #78d9f0;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 0.78rem;
          font-weight: 800;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 18px 0 22px;
          font-size: clamp(3rem, 8vw, 6.8rem);
          line-height: 0.94;
          letter-spacing: -0.055em;
          max-width: 850px;
        }

        .hero-copy {
          max-width: 760px;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          line-height: 1.75;
          color: #bed4df;
        }

        .hero-actions,
        .action-row,
        .submit-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button,
        .text-button {
          border-radius: 999px;
          padding: 14px 22px;
          font-weight: 800;
          text-decoration: none;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .primary-button {
          border: 1px solid #81e3fa;
          color: #031019;
          background: linear-gradient(135deg, #a6efff, #55cbe9);
          box-shadow: 0 12px 34px rgba(61, 193, 226, 0.2);
          cursor: pointer;
        }

        .primary-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .primary-button:not(:disabled):hover,
        .secondary-button:hover {
          transform: translateY(-2px);
        }

        .secondary-button {
          border: 1px solid rgba(151, 211, 230, 0.34);
          background: rgba(11, 31, 47, 0.76);
          color: #edfaff;
        }

        .text-button {
          border: 0;
          color: #9fd5e5;
          background: transparent;
          cursor: pointer;
        }

        .mission-section,
        .door-section,
        .how-it-works {
          padding: 40px 0 84px;
        }

        .section-heading {
          max-width: 760px;
          margin-bottom: 28px;
        }

        .section-heading h2 {
          margin: 10px 0 12px;
          font-size: clamp(2rem, 4vw, 3.6rem);
          letter-spacing: -0.04em;
        }

        .section-heading p {
          color: #aebfca;
          line-height: 1.7;
        }

        .mission-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .mission-card {
          min-height: 230px;
          border: 1px solid rgba(112, 200, 224, 0.18);
          border-radius: 24px;
          padding: 24px;
          background: linear-gradient(
            145deg,
            rgba(17, 43, 61, 0.94),
            rgba(8, 24, 38, 0.82)
          );
        }

        .mission-number {
          display: inline-flex;
          color: #58d1ed;
          font-size: 0.82rem;
          margin-bottom: 50px;
        }

        .mission-card h3 {
          font-size: 1.2rem;
        }

        .mission-card p {
          color: #aabdc8;
          line-height: 1.65;
        }

        .door-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .door-card {
          min-height: 270px;
          position: relative;
          overflow: hidden;
          padding: 28px;
          border-radius: 26px 26px 10px 10px;
          border: 1px solid rgba(238, 199, 94, 0.34);
          color: #fff9e3;
          text-align: left;
          cursor: pointer;
          background:
            linear-gradient(90deg, rgba(75, 47, 6, 0.92), rgba(155, 108, 20, 0.86)),
            #6a470b;
          box-shadow:
            inset 0 0 40px rgba(255, 213, 92, 0.06),
            0 18px 45px rgba(0, 0, 0, 0.18);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease;
        }

        .door-card::before,
        .door-card::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(255, 232, 170, 0.24);
        }

        .door-card::before {
          left: 14px;
        }

        .door-card::after {
          right: 14px;
        }

        .door-card:hover,
        .door-card.selected {
          transform: translateY(-5px);
          border-color: rgba(255, 224, 134, 0.9);
          box-shadow:
            inset 0 0 60px rgba(255, 224, 134, 0.11),
            0 22px 55px rgba(7, 12, 17, 0.34);
        }

        .door-light {
          width: 7px;
          height: 7px;
          position: absolute;
          right: 28px;
          top: 50%;
          border-radius: 50%;
          background: #fff3bb;
          box-shadow: 0 0 18px #ffe17d;
        }

        .door-card strong {
          display: block;
          max-width: 78%;
          font-size: 1.5rem;
          line-height: 1.1;
        }

        .door-card p {
          margin: 72px 0 25px;
          color: rgba(255, 246, 214, 0.78);
          line-height: 1.58;
        }

        .door-action {
          font-size: 0.82rem;
          font-weight: 800;
          color: #fff0aa;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .intake-layout {
          display: grid;
          grid-template-columns: 310px minmax(0, 1fr);
          gap: 28px;
          align-items: start;
          padding-top: 36px;
        }

        .sticky-panel {
          position: sticky;
          top: 24px;
          border-radius: 26px;
          border: 1px solid rgba(105, 205, 233, 0.2);
          background: rgba(8, 27, 43, 0.88);
          padding: 25px;
          backdrop-filter: blur(18px);
        }

        .sticky-panel h2 {
          margin: 10px 0;
          font-size: 1.7rem;
        }

        .sticky-panel > p {
          color: #aebfca;
          line-height: 1.6;
        }

        .progress-shell {
          padding: 22px 0;
        }

        .progress-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 9px;
          color: #c7e3ec;
          font-size: 0.84rem;
        }

        .progress-track {
          height: 8px;
          border-radius: 999px;
          background: rgba(144, 204, 220, 0.12);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #4ccbe9, #9deaff);
          transition: width 220ms ease;
        }

        .record-preview {
          display: grid;
          gap: 10px;
          padding-top: 8px;
        }

        .record-preview div {
          padding: 13px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.035);
        }

        .record-preview span,
        .summary-grid span {
          display: block;
          color: #7fa5b6;
          font-size: 0.73rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 5px;
        }

        .record-preview strong {
          font-size: 0.91rem;
        }

        .intake-form {
          display: grid;
          gap: 20px;
        }

        .form-section,
        .success-panel {
          border-radius: 28px;
          border: 1px solid rgba(103, 194, 220, 0.18);
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.9));
          padding: clamp(24px, 4vw, 42px);
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
        }

        .form-section-heading {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding-bottom: 26px;
          margin-bottom: 26px;
          border-bottom: 1px solid rgba(113, 197, 220, 0.14);
        }

        .form-section-heading > span {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(86, 202, 232, 0.12);
          color: #79dff5;
          font-weight: 900;
        }

        .form-section-heading h2 {
          margin: 2px 0 7px;
          font-size: 1.55rem;
        }

        .form-section-heading p {
          color: #9fb4c0;
          margin-bottom: 0;
        }

        .field-grid {
          display: grid;
          gap: 20px;
        }

        .two-columns {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        label,
        legend {
          font-weight: 800;
          color: #eaf8fd;
        }

        input,
        textarea {
          display: block;
          width: 100%;
          margin-top: 9px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 15px;
          padding: 14px 15px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.78);
          outline: none;
          resize: vertical;
        }

        input:focus,
        textarea:focus {
          border-color: #71d9f0;
          box-shadow: 0 0 0 3px rgba(79, 203, 232, 0.13);
        }

        input::placeholder,
        textarea::placeholder {
          color: #648091;
        }

        .field-guide {
          margin: 8px 0 0;
          color: #7894a3;
          font-size: 0.82rem;
          line-height: 1.55;
          font-weight: 500;
        }

        .choice-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 0;
          margin: 0;
          border: 0;
        }

        .choice-grid legend {
          grid-column: 1 / -1;
          margin-bottom: 4px;
        }

        .choice-card {
          position: relative;
          min-height: 160px;
          border: 1px solid rgba(113, 196, 219, 0.18);
          border-radius: 20px;
          padding: 20px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.025);
        }

        .choice-card.selected {
          border-color: #63d4ed;
          background: rgba(78, 196, 224, 0.08);
        }

        .choice-card input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .choice-card strong,
        .choice-card span {
          display: block;
        }

        .choice-card strong {
          margin-bottom: 16px;
        }

        .choice-card span {
          color: #93adba;
          line-height: 1.55;
          font-weight: 500;
        }

        .consent-row {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          line-height: 1.6;
        }

        .consent-row input {
          flex: 0 0 20px;
          width: 20px;
          height: 20px;
          margin: 3px 0 0;
          accent-color: #53cde9;
        }

        .boundary-box {
          margin-top: 24px;
          border-left: 3px solid #dfba58;
          border-radius: 0 16px 16px 0;
          padding: 18px 20px;
          background: rgba(205, 152, 31, 0.08);
        }

        .boundary-box p {
          margin: 8px 0 0;
          color: #c6b98f;
          line-height: 1.65;
        }

        .sequence {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .sequence-step {
          min-height: 130px;
          border: 1px solid rgba(103, 197, 220, 0.15);
          border-radius: 18px;
          padding: 16px;
          background: rgba(11, 32, 48, 0.72);
        }

        .sequence-step span {
          display: inline-flex;
          color: #60d4ee;
          margin-bottom: 38px;
          font-size: 0.8rem;
        }

        .sequence-step strong {
          display: block;
          font-size: 0.92rem;
          line-height: 1.35;
        }

        .success-panel {
          max-width: 960px;
          margin: 20px auto 0;
          padding: clamp(32px, 6vw, 70px);
        }

        .status-badge {
          display: inline-block;
          border: 1px solid rgba(100, 222, 179, 0.38);
          border-radius: 999px;
          padding: 8px 12px;
          color: #8aefc5;
          background: rgba(54, 170, 126, 0.08);
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .success-panel h1 {
          font-size: clamp(2.6rem, 6vw, 5.4rem);
          margin-top: 24px;
        }

        .success-panel > p {
          max-width: 760px;
          color: #aebfca;
          line-height: 1.75;
          font-size: 1.08rem;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 34px;
        }

        .summary-grid article {
          border-radius: 16px;
          padding: 17px;
          background: rgba(255, 255, 255, 0.035);
        }

        .summary-grid strong {
          line-height: 1.45;
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0.48;
          }
          50% {
            transform: translate3d(18px, -24px, 0) scale(1.35);
            opacity: 1;
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.22;
          }
          50% {
            opacity: 0.78;
          }
        }

        @media (max-width: 980px) {
          .mission-grid,
          .summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .door-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .intake-layout {
            grid-template-columns: 1fr;
          }

          .sticky-panel {
            position: relative;
            top: 0;
          }

          .sequence {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 680px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 40px;
          }

          .mission-grid,
          .door-grid,
          .summary-grid,
          .two-columns,
          .choice-grid {
            grid-template-columns: 1fr;
          }

          .mission-card,
          .door-card {
            min-height: 220px;
          }

          .sequence {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero {
            padding-bottom: 44px;
          }

          .mission-section,
          .door-section,
          .how-it-works {
            padding-bottom: 58px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .star,
          .orbit,
          .route-line {
            animation: none;
          }

          .primary-button,
          .secondary-button,
          .door-card {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
