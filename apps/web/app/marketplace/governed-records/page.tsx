// apps/web/app/marketplace/governed-records/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type RecordCategory =
  | 'Atmospheric'
  | 'Building'
  | 'HVAC'
  | 'Hospital'
  | 'Laboratory'
  | 'Land'
  | 'Water'
  | 'AI governance'
  | 'Other';

type RecordRequest = {
  id: string;
  title: string;
  requester: string;
  category: RecordCategory;
  status: 'OPEN' | 'REVIEWING' | 'MATCHED' | 'CLOSED';
  visibility: 'PUBLIC DEMONSTRATION' | 'PRIVATE DEMONSTRATION';
  summary: string;
  recordType: string;
  requestedWork: string[];
  evidenceAvailable: string[];
  evidenceMissing: string[];
  boundary: string;
  timeline: string;
  budget: string;
  posted: string;
};

const MARKETPLACE_ROUTES = {
  home: '/marketplace',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  postNeed: '/marketplace/post-a-need',
} as const;

const RECORD_REQUESTS: RecordRequest[] = [
  {
    id: 'TA-14-GRR-001',
    title: 'School atmospheric record continuity and interpretation review',
    requester: 'Demonstration Public Facilities Group',
    category: 'Atmospheric',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'A facilities group is seeking a bounded review of seven days of atmospheric records from classrooms, occupied corridors, and mechanical spaces.',
    recordType: 'Building Atmospheric Integrity Record package',
    requestedWork: [
      'Record identity review',
      'Contributor and instrument continuity review',
      'Calibration-evidence assessment',
      'Governed interpretation record',
      'Evidence-gap report',
      'Post-intervention comparison route',
    ],
    evidenceAvailable: [
      'Seven days of sensor exports',
      'Floor plans',
      'HVAC equipment schedule',
      'Maintenance chronology',
      'Occupancy schedule',
    ],
    evidenceMissing: [
      'Outdoor reference conditions for two periods',
      'Calibration certificates for three instruments',
      'Contributor identity for an overnight export',
    ],
    boundary:
      'The request is for governed record review and interpretation. Diagnosis, medical conclusions, and optimization remain outside the scope.',
    timeline: '21 days',
    budget: '$2,500-$5,000 demonstration range',
    posted: 'July 21, 2026',
  },
  {
    id: 'TA-14-GRR-002',
    title: 'Hospital isolation-room environmental record review',
    requester: 'Clinical Facilities Demonstration Network',
    category: 'Hospital',
    status: 'REVIEWING',
    visibility: 'PRIVATE DEMONSTRATION',
    summary:
      'A hospital facilities team wants an independent continuity review of pressure, temperature, humidity, and door-state records for an isolation-room event.',
    recordType: 'Hospital Environmental Record',
    requestedWork: [
      'Record chronology reconstruction',
      'Sensor and contributor identity review',
      'Declared threshold comparison',
      'Continuity-break identification',
      'Bounded interpretation record',
    ],
    evidenceAvailable: [
      'BMS trend export',
      'Door-state logs',
      'Room pressure logs',
      'Facilities response chronology',
    ],
    evidenceMissing: [
      'Verified instrument calibration state',
      'Complete alarm acknowledgement history',
      'Independent reference measurement',
    ],
    boundary:
      'The request does not ask for clinical diagnosis, infection-control determination, or legal compliance certification.',
    timeline: '14 days',
    budget: '$4,000-$8,000 demonstration range',
    posted: 'July 20, 2026',
  },
  {
    id: 'TA-14-GRR-003',
    title: 'HVAC diagnostic record admissibility review',
    requester: 'Independent Mechanical Contractor',
    category: 'HVAC',
    status: 'OPEN',
    visibility: 'PUBLIC DEMONSTRATION',
    summary:
      'A contractor wants a diagnostic record reviewed for sequence, baseline, declared determinations, intervention traceability, and post-intervention proof.',
    recordType: 'HVAC Diagnostic Record',
    requestedWork: [
      'Sequence completeness review',
      'Baseline sufficiency review',
      'Diagnostic determination boundary review',
      'Intervention attribution review',
      'Post-intervention comparison',
    ],
    evidenceAvailable: [
      'Electrical readings',
      'Airflow measurements',
      'Refrigerant measurements',
      'Technician chronology',
      'Post-repair operating data',
    ],
    evidenceMissing: [
      'Pre-intervention fan curve evidence',
      'Instrument serial numbers for two readings',
      'Technician video continuity',
    ],
    boundary:
      'The record review does not replace field diagnosis and does not retroactively supply missing evidence.',
    timeline: '10 days',
    budget: '$1,500-$3,000 demonstration range',
    posted: 'July 19, 2026',
  },
];

const categories: Array<'All' | RecordCategory> = [
  'All',
  'Atmospheric',
  'Building',
  'HVAC',
  'Hospital',
  'Laboratory',
  'Land',
  'Water',
  'AI governance',
  'Other',
];

function statusClass(status: RecordRequest['status']) {
  return `status-${status.toLowerCase()}`;
}

export default function GovernedRecordRequestsMarketplacePage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<RecordRequest | null>(RECORD_REQUESTS[0]);
  const [responseOpen, setResponseOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredRequests = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return RECORD_REQUESTS.filter((request) => {
      const categoryMatch = category === 'All' || request.category === category;
      const queryMatch =
        !normalized ||
        [
          request.title,
          request.requester,
          request.category,
          request.recordType,
          request.summary,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalized);

      return categoryMatch && queryMatch;
    });
  }, [category, query]);

  const openRequest = (request: RecordRequest) => {
    setSelected(request);
    setResponseOpen(false);
    setSubmitted(false);
    window.scrollTo({ top: 520, behavior: 'smooth' });
  };

  const createResponsePreview = () => {
    setSubmitted(true);
    setResponseOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-shell">
      <div className="cosmos" aria-hidden="true">
        <span className="star star-one" />
        <span className="star star-two" />
        <span className="star star-three" />
        <span className="star star-four" />
        <span className="orbit orbit-one">
          <span />
        </span>
        <span className="orbit orbit-two">
          <span />
        </span>
        <span className="route route-one" />
        <span className="route route-two" />
      </div>

      <div className="content-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href={MARKETPLACE_ROUTES.home}>Marketplace</Link>
          <span>/</span>
          <span>Governed Record Requests</span>
        </nav>

        {submitted ? (
          <section className="submission-panel" aria-live="polite">
            <span className="eyebrow">DEMONSTRATION RESPONSE CREATED</span>
            <h1>Your governed-record response preview has been created.</h1>
            <p>
              No response was transmitted, no requester was contacted, and no professional
              engagement was formed. This front-end demonstration shows the structure that should
              be preserved before a live governed-record workflow is connected.
            </p>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={() => setSubmitted(false)}>
                Return to requests
              </button>
              <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                Browse professionals
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="hero">
              <span className="eyebrow">TA-14 Collaborative Governance Marketplace</span>
              <h1>Governed Record Requests</h1>
              <p className="hero-copy">
                Find requests for record creation, continuity review, interpretation, comparison,
                verification, and preservation across environmental, operational, and AI governance
                domains.
              </p>

              <div className="boundary-banner">
                <strong>Record first. Interpretation second. Diagnosis and optimization remain separate.</strong>
                <p>
                  The Marketplace must not silently merge evidence, interpretation, diagnosis,
                  intervention, or outcome claims.
                </p>
              </div>

              <div className="action-row">
                <Link className="primary-button" href={MARKETPLACE_ROUTES.postNeed}>
                  Post a governed-record need
                </Link>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                  Find a record specialist
                </Link>
              </div>
            </header>

            <section className="sequence" aria-label="Governed record request sequence">
              {[
                'Record identified',
                'Evidence declared',
                'Continuity reviewed',
                'Scope bounded',
                'Work performed',
                'Interpretation preserved',
                'Outcome separated',
              ].map((step, index) => (
                <article key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step}</strong>
                </article>
              ))}
            </section>

            <section className="explorer">
              <div className="filter-panel">
                <div className="filter-heading">
                  <span className="eyebrow">REQUEST EXPLORER</span>
                  <h2>Browse by record domain</h2>
                </div>

                <label className="search-field">
                  Search requests
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search title, requester, record type, or domain"
                  />
                </label>

                <div className="category-row" aria-label="Record category filters">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={category === item ? 'category-button selected' : 'category-button'}
                      type="button"
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="results-meta">
                <span>{filteredRequests.length} demonstration request(s)</span>
                <span>No live persistence or matching is connected.</span>
              </div>

              <div className="request-grid">
                {filteredRequests.map((request) => (
                  <article className="request-card" key={request.id}>
                    <div className="request-topline">
                      <span className={`status-badge ${statusClass(request.status)}`}>
                        {request.status}
                      </span>
                      <span>{request.visibility}</span>
                    </div>

                    <span className="request-id">{request.id}</span>
                    <h2>{request.title}</h2>
                    <p className="requester">{request.requester}</p>
                    <p>{request.summary}</p>

                    <div className="request-facts">
                      <div>
                        <span>Category</span>
                        <strong>{request.category}</strong>
                      </div>
                      <div>
                        <span>Record type</span>
                        <strong>{request.recordType}</strong>
                      </div>
                      <div>
                        <span>Timeline</span>
                        <strong>{request.timeline}</strong>
                      </div>
                      <div>
                        <span>Budget</span>
                        <strong>{request.budget}</strong>
                      </div>
                    </div>

                    <button className="card-button" type="button" onClick={() => openRequest(request)}>
                      Open request workspace
                    </button>
                  </article>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="empty-state">
                  <h2>No demonstration requests match those filters.</h2>
                  <p>Clear the search or choose another record category.</p>
                </div>
              )}
            </section>

            {selected && (
              <section className="workspace">
                <div className="workspace-header">
                  <div>
                    <span className="eyebrow">SELECTED GOVERNED RECORD REQUEST</span>
                    <h2>{selected.title}</h2>
                    <p>{selected.requester}</p>
                  </div>
                  <span className={`status-badge ${statusClass(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="workspace-layout">
                  <div className="workspace-main">
                    <section className="detail-card">
                      <div className="section-heading">
                        <span>01</span>
                        <div>
                          <h3>Requested work</h3>
                          <p>The declared work product expected from the engagement.</p>
                        </div>
                      </div>

                      <div className="item-grid">
                        {selected.requestedWork.map((item) => (
                          <article key={item}>
                            <span>✓</span>
                            <strong>{item}</strong>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section className="detail-card">
                      <div className="section-heading">
                        <span>02</span>
                        <div>
                          <h3>Evidence state</h3>
                          <p>Available and missing evidence remain visibly separated.</p>
                        </div>
                      </div>

                      <div className="evidence-grid">
                        <div className="evidence-panel available">
                          <h3>Evidence available</h3>
                          <ul>
                            {selected.evidenceAvailable.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="evidence-panel missing">
                          <h3>Evidence missing or unresolved</h3>
                          <ul>
                            {selected.evidenceMissing.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section className="detail-card">
                      <div className="section-heading">
                        <span>03</span>
                        <div>
                          <h3>Declared boundary</h3>
                          <p>The request must not silently expand beyond this scope.</p>
                        </div>
                      </div>

                      <div className="boundary-box">
                        <strong>Scope boundary</strong>
                        <p>{selected.boundary}</p>
                      </div>
                    </section>
                  </div>

                  <aside className="workspace-sidebar">
                    <section className="sidebar-card">
                      <span className="eyebrow">REQUEST RECORD</span>
                      <dl>
                        <div>
                          <dt>Request ID</dt>
                          <dd>{selected.id}</dd>
                        </div>
                        <div>
                          <dt>Record type</dt>
                          <dd>{selected.recordType}</dd>
                        </div>
                        <div>
                          <dt>Category</dt>
                          <dd>{selected.category}</dd>
                        </div>
                        <div>
                          <dt>Timeline</dt>
                          <dd>{selected.timeline}</dd>
                        </div>
                        <div>
                          <dt>Budget</dt>
                          <dd>{selected.budget}</dd>
                        </div>
                        <div>
                          <dt>Posted</dt>
                          <dd>{selected.posted}</dd>
                        </div>
                      </dl>

                      <button
                        className="primary-button full-width"
                        type="button"
                        onClick={() => setResponseOpen(true)}
                      >
                        Respond to request
                      </button>
                    </section>
                  </aside>
                </div>
              </section>
            )}

            {selected && responseOpen && (
              <section className="response-panel">
                <div className="response-heading">
                  <div>
                    <span className="eyebrow">DEMONSTRATION RESPONSE</span>
                    <h2>Respond to {selected.id}</h2>
                  </div>
                  <button
                    className="close-button"
                    type="button"
                    onClick={() => setResponseOpen(false)}
                    aria-label="Close response panel"
                  >
                    ×
                  </button>
                </div>

                <div className="form-grid">
                  <label>
                    Professional or organization
                    <input placeholder="Name or organization" />
                  </label>

                  <label>
                    Record-domain expertise
                    <textarea
                      rows={4}
                      placeholder="Describe your relevant governed-record, continuity, interpretation, technical, or domain expertise."
                    />
                  </label>

                  <label>
                    Proposed bounded scope
                    <textarea
                      rows={5}
                      placeholder="State what you can review, produce, compare, interpret, verify, or preserve."
                    />
                  </label>

                  <label>
                    Evidence limitations and dependencies
                    <textarea
                      rows={4}
                      placeholder="Declare missing evidence, access requirements, instrument dependencies, conflicts, or assumptions."
                    />
                  </label>

                  <label>
                    Separation statement
                    <textarea
                      rows={4}
                      placeholder="Explain how you will keep the record, interpretation, diagnosis, intervention, and optimization layers separate."
                    />
                  </label>

                  <div className="response-boundary">
                    <strong>Demonstration boundary</strong>
                    <p>
                      Creating this preview does not transmit a response, verify qualifications,
                      establish payment, or authorize access to records.
                    </p>
                  </div>

                  <button className="primary-button" type="button" onClick={createResponsePreview}>
                    Create response preview
                  </button>
                </div>
              </section>
            )}

            <section className="final-cta">
              <span className="eyebrow">NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span>
              <h2>Governed records should travel with identity, continuity, boundaries, and history.</h2>
              <p>
                The future Marketplace workflow should preserve the original request, every
                evidence declaration, reviewer scope, interpretation boundary, version, challenge,
                and final record.
              </p>
              <div className="action-row centered-actions">
                <Link className="primary-button" href={MARKETPLACE_ROUTES.postNeed}>
                  Post a governed-record need
                </Link>
                <Link className="secondary-button" href={MARKETPLACE_ROUTES.professionals}>
                  Browse record specialists
                </Link>
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
          color: #eef8ff;
          background: #06111d;
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
            linear-gradient(rgba(4, 15, 26, 0.8), rgba(4, 15, 26, 0.97)),
            radial-gradient(circle at 16% 5%, rgba(22, 139, 180, 0.18), transparent 34%),
            radial-gradient(circle at 82% 7%, rgba(112, 70, 193, 0.14), transparent 31%);
        }

        .content-shell {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
          padding: 34px 0 96px;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.72;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e8fbff;
          box-shadow: 0 0 16px rgba(139, 229, 255, 0.95);
          animation: drift 13s ease-in-out infinite;
        }

        .star-one {
          top: 14%;
          left: 8%;
        }

        .star-two {
          top: 31%;
          right: 11%;
          animation-delay: -5s;
        }

        .star-three {
          bottom: 26%;
          left: 15%;
          animation-delay: -9s;
        }

        .star-four {
          bottom: 11%;
          right: 17%;
          animation-delay: -3s;
        }

        .orbit {
          position: absolute;
          width: 320px;
          height: 320px;
          border: 1px solid rgba(103, 205, 233, 0.12);
          border-radius: 50%;
          animation: rotate 32s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #84e7fa;
          box-shadow: 0 0 20px rgba(99, 218, 242, 0.9);
          left: 50%;
          top: -5px;
        }

        .orbit-one {
          right: -165px;
          top: 5%;
        }

        .orbit-two {
          left: -185px;
          bottom: 12%;
          width: 390px;
          height: 390px;
          animation-direction: reverse;
        }

        .route {
          position: absolute;
          width: 42vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(78, 204, 233, 0.34), transparent);
          animation: pulse 7s ease-in-out infinite;
        }

        .route-one {
          top: 24%;
          left: -7%;
          transform: rotate(-18deg);
        }

        .route-two {
          right: -5%;
          bottom: 22%;
          transform: rotate(22deg);
          animation-delay: -3s;
        }

        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          color: #8eb4c5;
          font-size: 0.88rem;
          margin-bottom: 58px;
        }

        .breadcrumbs a {
          text-decoration: none;
        }

        .breadcrumbs a:hover {
          color: #ffffff;
        }

        .eyebrow {
          display: inline-block;
          color: #72d8ef;
          font-size: 0.75rem;
          font-weight: 900;
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
          max-width: 960px;
          padding-bottom: 54px;
        }

        h1 {
          margin: 18px 0 22px;
          font-size: clamp(3rem, 7vw, 6.5rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .hero-copy {
          max-width: 820px;
          color: #b8ced9;
          font-size: 1.1rem;
          line-height: 1.78;
        }

        .boundary-banner,
        .boundary-box,
        .response-boundary {
          margin-top: 26px;
          border-left: 3px solid #dfba58;
          border-radius: 0 15px 15px 0;
          padding: 18px 20px;
          background: rgba(205, 152, 31, 0.075);
        }

        .boundary-banner p,
        .boundary-box p,
        .response-boundary p {
          margin: 7px 0 0;
          color: #c4b88e;
          line-height: 1.65;
        }

        .action-row,
        .response-heading,
        .workspace-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .action-row {
          margin-top: 30px;
        }

        .primary-button,
        .secondary-button {
          border-radius: 999px;
          padding: 14px 21px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform 180ms ease,
            border-color 180ms ease;
          cursor: pointer;
        }

        .primary-button {
          border: 1px solid #87e4f8;
          color: #031019;
          background: linear-gradient(135deg, #a5efff, #56cae7);
          box-shadow: 0 12px 34px rgba(60, 191, 222, 0.18);
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

        .sequence {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          padding: 10px 0 70px;
        }

        .sequence article {
          min-height: 120px;
          padding: 16px;
          border: 1px solid rgba(103, 194, 218, 0.15);
          border-radius: 18px;
          background: rgba(9, 29, 44, 0.7);
        }

        .sequence span {
          display: block;
          margin-bottom: 36px;
          color: #57cee9;
          font-size: 0.75rem;
        }

        .sequence strong {
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .explorer {
          padding-bottom: 70px;
        }

        .filter-panel,
        .workspace,
        .response-panel,
        .submission-panel {
          border: 1px solid rgba(103, 194, 220, 0.18);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.94), rgba(7, 23, 36, 0.91));
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.18);
        }

        .filter-panel {
          padding: clamp(24px, 4vw, 40px);
        }

        .filter-heading h2 {
          margin: 9px 0 25px;
          font-size: clamp(2rem, 4vw, 3.4rem);
          letter-spacing: -0.04em;
        }

        .search-field {
          display: block;
          color: #edfaff;
          font-weight: 800;
        }

        input,
        textarea {
          width: 100%;
          display: block;
          margin-top: 9px;
          padding: 14px 15px;
          border: 1px solid rgba(130, 207, 227, 0.22);
          border-radius: 14px;
          color: #f5fbff;
          background: rgba(4, 16, 27, 0.78);
          outline: none;
          resize: vertical;
        }

        input:focus,
        textarea:focus {
          border-color: #70d8ef;
          box-shadow: 0 0 0 3px rgba(76, 198, 227, 0.13);
        }

        input::placeholder,
        textarea::placeholder {
          color: #648091;
        }

        .category-row {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }

        .category-button {
          border: 1px solid rgba(123, 202, 224, 0.18);
          border-radius: 999px;
          padding: 10px 13px;
          color: #acd3df;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .category-button.selected {
          border-color: #67d4eb;
          color: #031019;
          background: #77dff4;
          font-weight: 900;
        }

        .results-meta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 4px;
          color: #7f9cab;
          font-size: 0.82rem;
        }

        .request-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .request-card {
          padding: 25px;
          border: 1px solid rgba(103, 194, 220, 0.17);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(14, 38, 55, 0.93), rgba(7, 23, 36, 0.9));
          box-shadow: 0 22px 56px rgba(0, 0, 0, 0.15);
        }

        .request-topline {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          color: #7695a4;
          font-size: 0.68rem;
          letter-spacing: 0.07em;
        }

        .status-badge {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          padding: 7px 9px;
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .status-open {
          color: #89efc5;
          border: 1px solid rgba(74, 213, 156, 0.3);
          background: rgba(53, 163, 119, 0.1);
        }

        .status-reviewing {
          color: #ffe29a;
          border: 1px solid rgba(228, 179, 54, 0.3);
          background: rgba(184, 131, 27, 0.1);
        }

        .status-matched {
          color: #a6dcff;
          border: 1px solid rgba(86, 167, 220, 0.3);
          background: rgba(45, 118, 168, 0.1);
        }

        .status-closed {
          color: #bac4ca;
          border: 1px solid rgba(160, 174, 182, 0.25);
          background: rgba(107, 121, 129, 0.08);
        }

        .request-id {
          display: block;
          margin-top: 24px;
          color: #70909f;
          font-size: 0.76rem;
        }

        .request-card h2 {
          margin: 10px 0 8px;
          font-size: 1.55rem;
          letter-spacing: -0.025em;
        }

        .requester {
          color: #ebcd78;
          font-weight: 800;
        }

        .request-card > p:not(.requester) {
          color: #a7bdc8;
          line-height: 1.68;
        }

        .request-facts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .request-facts div {
          min-height: 84px;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.028);
        }

        .request-facts span {
          display: block;
          margin-bottom: 7px;
          color: #7593a2;
          font-size: 0.69rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .request-facts strong {
          font-size: 0.86rem;
          line-height: 1.4;
        }

        .card-button {
          width: 100%;
          margin-top: 21px;
          border: 1px solid rgba(124, 209, 231, 0.27);
          border-radius: 999px;
          padding: 12px 15px;
          color: #dff8ff;
          background: rgba(64, 177, 207, 0.08);
          font-weight: 900;
          cursor: pointer;
        }

        .empty-state {
          padding: 50px 24px;
          border: 1px dashed rgba(127, 199, 219, 0.22);
          border-radius: 22px;
          text-align: center;
          color: #8fa9b5;
        }

        .workspace {
          margin-top: 14px;
          padding: clamp(24px, 4vw, 42px);
        }

        .workspace-header {
          justify-content: space-between;
          padding-bottom: 26px;
          margin-bottom: 26px;
          border-bottom: 1px solid rgba(111, 197, 220, 0.14);
        }

        .workspace-header h2 {
          margin: 9px 0 8px;
          font-size: clamp(2rem, 4vw, 3.2rem);
          letter-spacing: -0.04em;
        }

        .workspace-header p {
          margin: 0;
          color: #e5c873;
          font-weight: 800;
        }

        .workspace-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 290px;
          gap: 22px;
          align-items: start;
        }

        .workspace-main {
          display: grid;
          gap: 16px;
        }

        .detail-card,
        .sidebar-card {
          padding: 24px;
          border: 1px solid rgba(103, 194, 220, 0.14);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.022);
        }

        .section-heading {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          padding-bottom: 20px;
          margin-bottom: 21px;
          border-bottom: 1px solid rgba(111, 197, 220, 0.12);
        }

        .section-heading > span {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 40px;
          height: 40px;
          border-radius: 50%;
          color: #78dcf3;
          background: rgba(80, 199, 227, 0.11);
          font-weight: 900;
        }

        .section-heading h3 {
          margin: 2px 0 5px;
          font-size: 1.35rem;
        }

        .section-heading p {
          margin: 0;
          color: #8fa7b3;
          line-height: 1.5;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 11px;
        }

        .item-grid article {
          min-height: 90px;
          padding: 16px;
          border: 1px solid rgba(113, 196, 219, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.022);
        }

        .item-grid span {
          display: block;
          margin-bottom: 17px;
          color: #78e4bb;
          font-weight: 900;
        }

        .item-grid strong {
          line-height: 1.4;
        }

        .evidence-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .evidence-panel {
          padding: 20px;
          border-radius: 18px;
        }

        .evidence-panel.available {
          border: 1px solid rgba(79, 205, 151, 0.2);
          background: rgba(46, 145, 105, 0.065);
        }

        .evidence-panel.missing {
          border: 1px solid rgba(229, 170, 64, 0.22);
          background: rgba(177, 115, 23, 0.07);
        }

        .evidence-panel h3 {
          font-size: 1rem;
        }

        .evidence-panel ul {
          margin: 0;
          padding-left: 19px;
          color: #adc2cc;
          line-height: 1.72;
        }

        dl {
          margin: 0;
        }

        dl div {
          padding: 12px 0;
          border-bottom: 1px solid rgba(111, 197, 220, 0.11);
        }

        dt {
          color: #7595a4;
          font-size: 0.69rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        dd {
          margin: 6px 0 0;
          color: #f0fbff;
          font-weight: 800;
          line-height: 1.45;
        }

        .full-width {
          width: 100%;
          margin-top: 21px;
        }

        .response-panel {
          margin-top: 24px;
          padding: clamp(24px, 4vw, 42px);
        }

        .response-heading {
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .response-heading h2 {
          margin: 8px 0 0;
          font-size: 2rem;
        }

        .close-button {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(139, 210, 230, 0.22);
          border-radius: 50%;
          color: #dff7ff;
          background: rgba(255, 255, 255, 0.035);
          font-size: 1.45rem;
          cursor: pointer;
        }

        .form-grid {
          display: grid;
          gap: 18px;
        }

        label {
          color: #edfaff;
          font-weight: 800;
        }

        .submission-panel {
          max-width: 880px;
          margin: 20px auto;
          padding: clamp(35px, 6vw, 70px);
        }

        .submission-panel h1 {
          margin-top: 20px;
          font-size: clamp(2.6rem, 6vw, 5rem);
        }

        .submission-panel p {
          color: #aec2cc;
          line-height: 1.75;
          font-size: 1.08rem;
        }

        .final-cta {
          max-width: 920px;
          margin: 80px auto 0;
          padding: clamp(32px, 5vw, 58px);
          border: 1px solid rgba(117, 205, 228, 0.19);
          border-radius: 30px;
          text-align: center;
          background:
            radial-gradient(circle at top, rgba(56, 173, 205, 0.11), transparent 48%),
            rgba(10, 30, 46, 0.84);
        }

        .final-cta h2 {
          margin: 12px 0 16px;
          font-size: clamp(2rem, 4vw, 3.5rem);
          letter-spacing: -0.035em;
        }

        .final-cta p {
          color: #aabec9;
          line-height: 1.75;
        }

        .centered-actions {
          justify-content: center;
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0.46;
          }
          50% {
            transform: translate3d(18px, -22px, 0) scale(1.35);
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
            opacity: 0.2;
          }
          50% {
            opacity: 0.78;
          }
        }

        @media (max-width: 1040px) {
          .sequence {
            grid-template-columns: repeat(4, 1fr);
          }

          .workspace-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .request-grid,
          .item-grid,
          .evidence-grid {
            grid-template-columns: 1fr;
          }

          .results-meta {
            flex-direction: column;
          }
        }

        @media (max-width: 600px) {
          .content-shell {
            width: min(100% - 24px, 1180px);
            padding-top: 22px;
          }

          .breadcrumbs {
            margin-bottom: 42px;
          }

          .sequence {
            grid-template-columns: repeat(2, 1fr);
          }

          .request-facts {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(html) {
            scroll-behavior: auto;
          }

          .star,
          .orbit,
          .route {
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
