import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Governed Records Marketplace',
  description:
    'Explore governed record requests, record frameworks, and evidence-bound record services inside the TA-14 AI Governance Exchange Marketplace.',
};

const recordTypes = [
  {
    title: 'Atmospheric Integrity Record',
    slug: 'atmospheric-integrity-record',
    category: 'Air',
    status: 'REQUEST OPEN',
    visibility: 'Public',
    price: 'Request proposals',
    timeline: '14 days',
    summary:
      'A governed record of atmospheric conditions, evidence sources, continuity, contributor identity, interpretation boundaries, and preserved daily state.',
    includes: [
      'Source evidence map',
      'Contributor declarations',
      'Continuity review',
      'Daily record structure',
      'Governed interpretation boundary',
      'Correction and supersession states',
    ],
  },
  {
    title: 'Personal Atmospheric Integrity Record',
    slug: 'personal-atmospheric-integrity-record',
    category: 'Personal Air',
    status: 'INVITATION ONLY',
    visibility: 'Private',
    price: 'Scoped engagement',
    timeline: '21 days',
    summary:
      'A private, attributable environmental record for personal atmospheric exposure evidence without converting the record into diagnosis.',
    includes: [
      'Private evidence vault',
      'Exposure chronology',
      'Location and source attribution',
      'Governed interpretation',
      'Medical non-diagnosis boundary',
      'Access and sharing permissions',
    ],
  },
  {
    title: 'Building Environmental Record',
    slug: 'building-environmental-record',
    category: 'Buildings',
    status: 'REQUEST OPEN',
    visibility: 'Public',
    price: '$4,500 starting scope',
    timeline: '30 days',
    summary:
      'A governed environmental record that binds building sensor, service, occupancy, event, and intervention evidence into a preserved record.',
    includes: [
      'Building identity',
      'Sensor and service evidence',
      'Record Steward role',
      'Event and intervention log',
      'Continuity scoring',
      'Post-intervention comparison',
    ],
  },
  {
    title: 'Hospital Environmental Record',
    slug: 'hospital-environmental-record',
    category: 'Healthcare',
    status: 'PREVIEW',
    visibility: 'Invitation only',
    price: 'Enterprise scope',
    timeline: '45-90 days',
    summary:
      'A hospital environmental record framework that preserves source, contributor, continuity, interpretation, correction, and proof boundaries.',
    includes: [
      'Department and room context',
      'Facilities evidence',
      'Clinical non-diagnosis boundary',
      'Laboratory and vendor records',
      'Restricted access controls',
      'Daily governed interpretation',
    ],
  },
  {
    title: 'HVAC Performance Record',
    slug: 'hvac-performance-record',
    category: 'HVAC',
    status: 'REQUEST OPEN',
    visibility: 'Public',
    price: '$1,850 starting scope',
    timeline: '7-14 days',
    summary:
      'A governed baseline, diagnostic-determination, intervention, and post-intervention performance record for HVAC systems.',
    includes: [
      'Original-state baseline',
      'Non-invasive entry threshold',
      'Declared diagnostic determinations',
      'Intervention evidence',
      'Post-state comparison',
      'Performance claim boundary',
    ],
  },
  {
    title: 'Land Integrity Record',
    slug: 'land-integrity-record',
    category: 'Land',
    status: 'PREVIEW',
    visibility: 'Public',
    price: 'Request proposals',
    timeline: 'Scope dependent',
    summary:
      'A governed land record preserving sampling, observation, custody, interpretation, intervention, and change over time.',
    includes: [
      'Parcel and location identity',
      'Sampling and observation evidence',
      'Custody continuity',
      'Intervention history',
      'Interpretation scope',
      'Versioned condition record',
    ],
  },
  {
    title: 'Water Integrity Record',
    slug: 'water-integrity-record',
    category: 'Water',
    status: 'REQUEST OPEN',
    visibility: 'Public',
    price: 'Request proposals',
    timeline: '14-30 days',
    summary:
      'A governed water record for source, sampling, laboratory evidence, custody, interpretation, correction, and preservation.',
    includes: [
      'Source identity',
      'Sampling event record',
      'Laboratory evidence',
      'Chain of custody',
      'Governed interpretation',
      'Correction and supersession',
    ],
  },
  {
    title: 'Laboratory Environmental Record',
    slug: 'laboratory-environmental-record',
    category: 'Laboratory',
    status: 'INVITATION ONLY',
    visibility: 'Private',
    price: 'Scoped engagement',
    timeline: '30 days',
    summary:
      'A controlled environmental record for laboratories requiring attributable evidence, restricted contributors, and exact preservation boundaries.',
    includes: [
      'Controlled-zone identity',
      'Instrument source records',
      'Contributor permissions',
      'Deviation history',
      'Independent review',
      'Restricted download controls',
    ],
  },
];

const recordPrinciples = [
  {
    title: 'Record',
    description:
      'The preserved evidence, source identity, contributor identity, timestamps, version state, and declared conditions.',
  },
  {
    title: 'Interpretation',
    description:
      'A bounded explanation of what the preserved record shows under declared rules and evidence limitations.',
  },
  {
    title: 'Diagnosis',
    description:
      'A separate determination layer that must not be silently merged into the source record or interpretation.',
  },
  {
    title: 'Optimization',
    description:
      'A separate action layer that may recommend or execute change only after admissible evidence and authority exist.',
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none">
      <path
        d="m5 12.5 4 4L19 7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 8v5M12 17.2v.1M10.3 3.7 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GovernedRecordsMarketplacePage() {
  return (
    <main className="recordsPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
      </div>

      <section className="heroSection">
        <div className="pageShell">
          <Link className="backLink" href="/marketplace">
            <span aria-hidden="true">←</span>
            Back to Marketplace
          </Link>

          <div className="heroGrid">
            <div>
              <span className="kicker">GOVERNED RECORDS MARKETPLACE</span>
              <h1>Request, build, review, and preserve governed records.</h1>
              <p className="heroLead">
                Environmental, operational, technical, and consequential records
                should preserve evidence, source identity, continuity,
                contributor authority, interpretation boundaries, and change
                over time.
              </p>

              <div className="heroActions">
                <a className="primaryButton" href="#records">
                  Explore record types
                  <ArrowIcon />
                </a>
                <Link className="secondaryButton" href="/marketplace/post-a-need">
                  Request a custom record
                </Link>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This is the Marketplace record catalog architecture. Live
                  intake, storage, access permissions, file download, payments,
                  contributor matching, and record issuance are not connected
                  yet.
                </span>
              </div>
            </div>

            <aside className="heroPanel">
              <div className="heroPanelHeader">
                <span>GOVERNED RECORD CHAIN</span>
                <strong>Preserve before interpretation. Separate before action.</strong>
              </div>

              {[
                ['01', 'Reality', 'The actual condition or event'],
                ['02', 'Record', 'Preserved source evidence'],
                ['03', 'Continuity', 'Custody, identity, version, time'],
                ['04', 'Admissibility', 'Evidence fit for declared use'],
                ['05', 'Interpretation', 'Bounded explanation'],
                ['06', 'Action', 'Separate authorized response'],
              ].map(([number, title, description]) => (
                <div className="heroPanelRow" key={number}>
                  <span>{number}</span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">SEPARATED LAYERS</span>
              <h2>A record is not a diagnosis, and a diagnosis is not an optimization.</h2>
            </div>
            <p>
              The Marketplace preserves these as separate scopes so one layer
              cannot silently overwrite, corrupt, or overstate another.
            </p>
          </div>

          <div className="principleGrid">
            {recordPrinciples.map((principle, index) => (
              <article className="principleCard" key={principle.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="records">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">RECORD CATALOG</span>
              <h2>Governed record requests and frameworks</h2>
            </div>
            <p>
              Each listing declares the record category, scope, evidence
              expectations, visibility, timing, and current Marketplace status.
            </p>
          </div>

          <div className="filterBar" aria-label="Record filters">
            <label>
              <span>Search records</span>
              <input
                type="search"
                placeholder="Search by record type, domain, or evidence class"
                disabled
              />
            </label>

            <label>
              <span>Category</span>
              <select defaultValue="all" disabled>
                <option value="all">All categories</option>
                <option value="air">Air</option>
                <option value="building">Buildings</option>
                <option value="healthcare">Healthcare</option>
                <option value="hvac">HVAC</option>
                <option value="land">Land</option>
                <option value="water">Water</option>
              </select>
            </label>

            <label>
              <span>Visibility</span>
              <select defaultValue="all" disabled>
                <option value="all">All visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="invitation">Invitation only</option>
              </select>
            </label>

            <div className="filterBoundary">
              Preview filters
            </div>
          </div>

          <div className="recordsGrid">
            {recordTypes.map((record) => (
              <article className="recordCard" key={record.slug}>
                <div className="recordTopline">
                  <span className="categoryBadge">{record.category}</span>
                  <span className="statusBadge">{record.status}</span>
                </div>

                <h3>{record.title}</h3>
                <p>{record.summary}</p>

                <div className="recordMeta">
                  <div>
                    <span>Visibility</span>
                    <strong>{record.visibility}</strong>
                  </div>
                  <div>
                    <span>Pricing</span>
                    <strong>{record.price}</strong>
                  </div>
                  <div>
                    <span>Timing</span>
                    <strong>{record.timeline}</strong>
                  </div>
                </div>

                <div className="includesList">
                  <span>Record scope may include</span>
                  {record.includes.map((item) => (
                    <div key={item}>
                      <CheckIcon />
                      <small>{item}</small>
                    </div>
                  ))}
                </div>

                <div className="recordActions">
                  <Link
                    className="recordLink"
                    href={`/marketplace/records/${record.slug}`}
                  >
                    View record scope
                    <ArrowIcon />
                  </Link>
                  <button type="button" disabled>
                    Request record
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell workflowGrid">
          <div>
            <span className="kicker">HOW A RECORD REQUEST WORKS</span>
            <h2>From declared need to preserved governed record.</h2>
            <p>
              The final workflow will create a versioned request, select a
              Record Steward, identify contributors, preserve evidence,
              complete continuity review, issue a bounded interpretation, and
              maintain correction and supersession history.
            </p>
          </div>

          <div className="workflowSteps">
            {[
              'Declare the record need',
              'Identify the subject and scope',
              'Assign the Record Steward',
              'Collect attributable evidence',
              'Review continuity and admissibility',
              'Issue the governed record',
              'Add bounded interpretation',
              'Preserve corrections and new versions',
            ].map((item, index) => (
              <div className="workflowStep" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">MARKETPLACE ROLES</span>
              <h2>Records are collaborative, but authority remains separated.</h2>
            </div>
            <p>
              Contributors may provide evidence or specialized review without
              gaining ownership, approval authority, or execution authority.
            </p>
          </div>

          <div className="rolesGrid">
            {[
              {
                title: 'Requester',
                text: 'Declares the need, subject, intended use, timing, visibility, and desired deliverable.',
              },
              {
                title: 'Record Steward',
                text: 'Maintains structure, contributor permissions, continuity, version state, and preservation.',
              },
              {
                title: 'Evidence Contributor',
                text: 'Provides attributable source evidence within declared authority and scope.',
              },
              {
                title: 'Domain Interpreter',
                text: 'Produces a bounded interpretation without silently converting it into diagnosis.',
              },
              {
                title: 'Independent Reviewer',
                text: 'Reviews evidence continuity, scope, claims, boundaries, and unresolved gaps.',
              },
              {
                title: 'Verifier',
                text: 'Tests record integrity, dependencies, version continuity, and declared proof claims.',
              },
            ].map((role) => (
              <article className="roleCard" key={role.title}>
                <h3>{role.title}</h3>
                <p>{role.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell proofPanel">
          <div>
            <span className="kicker">PROOF BOUNDARY</span>
            <h2>Registration or issuance does not prove everything claimed about a record.</h2>
            <p>
              The final record page must distinguish what was submitted, what
              continuity supports, what was interpreted, what was independently
              reviewed, what was verified, and what remains unresolved.
            </p>
          </div>

          <div className="proofStates">
            {[
              ['SUBMITTED', 'Evidence or files were provided.'],
              ['PRESERVED', 'The record was stored with version and time state.'],
              ['CONTINUITY REVIEWED', 'Source, custody, identity, and transfer were examined.'],
              ['INTERPRETED', 'A bounded interpretation was issued.'],
              ['INDEPENDENTLY REVIEWED', 'A separate reviewer examined the declared scope.'],
              ['VERIFIED', 'Declared integrity or replay checks passed.'],
            ].map(([status, description]) => (
              <div key={status}>
                <strong>{status}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="kicker">GOVERNED RECORDS MARKETPLACE</span>
            <h2>Build records that can survive review, correction, and time.</h2>
            <p>
              Governed records preserve the evidence before diagnosis,
              recommendation, optimization, or execution is allowed to claim
              authority over it.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Request a custom record
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/marketplace">
              Return to Marketplace
            </Link>
          </div>

          <div className="maxim">
            No admissible evidence. No admissible execution.
          </div>
        </div>
      </section>

      <style>{`
        :root {
          --bg: #041019;
          --border: rgba(118, 213, 220, 0.2);
          --border-strong: rgba(118, 213, 220, 0.42);
          --text: #f3fbfc;
          --muted: #a9c1c8;
          --teal: #67e0df;
          --blue: #62a9ff;
          --gold: #ffd878;
          --violet: #bca4ff;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
        }

        .recordsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .recordsPage::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .backgroundLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.13;
          animation: glowPulse 9s ease-in-out infinite;
        }

        .glowOne {
          top: 4%;
          left: -130px;
          background: var(--teal);
        }

        .glowTwo {
          top: 42%;
          right: -150px;
          background: var(--blue);
          animation-delay: 3s;
        }

        .line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(103, 224, 223, 0.58), transparent);
          filter: drop-shadow(0 0 7px rgba(103, 224, 223, 0.35));
          animation: lineMove 13s linear infinite;
        }

        .lineOne {
          top: 13%;
          left: -10%;
          width: 46vw;
          transform: rotate(17deg);
        }

        .lineTwo {
          top: 58%;
          right: -8%;
          width: 38vw;
          transform: rotate(-19deg);
          animation-delay: -6s;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 12px white;
          animation: twinkle 4.2s ease-in-out infinite;
        }

        .starOne { top: 7%; left: 24%; }
        .starTwo { top: 16%; right: 14%; animation-delay: 1.2s; }
        .starThree { top: 44%; left: 7%; animation-delay: 2.4s; }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .heroSection {
          padding: 86px 0 90px;
        }

        .backLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 52px;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 700;
          transition: color 180ms ease, transform 180ms ease;
        }

        .backLink:hover {
          color: var(--teal);
          transform: translateX(-3px);
        }

        .heroGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.72fr);
          gap: 58px;
          align-items: center;
        }

        .kicker {
          display: inline-flex;
          color: var(--teal);
          font-size: 0.74rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 14px 0 24px;
          font-size: clamp(3.25rem, 6.7vw, 6.9rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          text-wrap: balance;
        }

        .heroLead {
          max-width: 760px;
          color: var(--muted);
          font-size: clamp(1.05rem, 1.6vw, 1.28rem);
          line-height: 1.75;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 20px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 0.94rem;
          font-weight: 800;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .primaryButton {
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 12px 34px rgba(37, 185, 189, 0.24);
        }

        .secondaryButton {
          color: var(--text);
          border: 1px solid var(--border-strong);
          background: rgba(10, 30, 42, 0.64);
          backdrop-filter: blur(12px);
        }

        .primaryButton:hover,
        .secondaryButton:hover {
          transform: translateY(-2px);
        }

        .secondaryButton:hover {
          border-color: var(--teal);
          background: rgba(14, 42, 54, 0.9);
        }

        .boundaryNotice {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          max-width: 760px;
          margin-top: 28px;
          padding: 14px 16px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 14px;
          color: #eadfbf;
          background: rgba(255, 216, 120, 0.06);
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .boundaryNotice svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--gold);
        }

        .heroPanel {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .heroPanelHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(118, 213, 220, 0.15);
        }

        .heroPanelHeader span {
          color: var(--teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .heroPanelHeader strong {
          line-height: 1.45;
        }

        .heroPanelRow {
          display: grid;
          grid-template-columns: 34px minmax(86px, auto) 1fr;
          gap: 12px;
          align-items: center;
          padding: 13px 0;
          border-bottom: 1px solid rgba(118, 213, 220, 0.09);
        }

        .heroPanelRow:last-child {
          border-bottom: 0;
        }

        .heroPanelRow > span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.7rem;
          font-weight: 900;
        }

        .heroPanelRow strong {
          font-size: 0.86rem;
        }

        .heroPanelRow small {
          color: var(--muted);
          line-height: 1.45;
        }

        .sectionBlock {
          position: relative;
          padding: 105px 0;
          scroll-margin-top: 70px;
        }

        .sectionTint {
          border-top: 1px solid rgba(118, 213, 220, 0.08);
          border-bottom: 1px solid rgba(118, 213, 220, 0.08);
          background: linear-gradient(180deg, rgba(9, 28, 39, 0.66), rgba(5, 18, 26, 0.45));
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 480px);
          gap: 38px;
          align-items: end;
          margin-bottom: 48px;
        }

        .sectionHeading h2,
        .workflowGrid h2,
        .proofPanel h2,
        .finalPanel h2 {
          margin: 10px 0 0;
          font-size: clamp(2.3rem, 4.6vw, 4.8rem);
          line-height: 1.04;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .sectionHeading p,
        .workflowGrid > div:first-child p,
        .proofPanel > div:first-child p,
        .finalPanel p {
          margin: 0;
          color: var(--muted);
          font-size: 1.03rem;
          line-height: 1.75;
        }

        .principleGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .principleCard {
          position: relative;
          overflow: hidden;
          min-height: 230px;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
        }

        .principleCard > span {
          position: absolute;
          top: 15px;
          right: 18px;
          color: rgba(103, 224, 223, 0.13);
          font-size: 3.2rem;
          font-weight: 900;
        }

        .principleCard h3 {
          position: relative;
          z-index: 1;
          margin-top: 60px;
          font-size: 1.35rem;
        }

        .principleCard p {
          position: relative;
          z-index: 1;
          color: var(--muted);
          line-height: 1.65;
        }

        .filterBar {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(180px, 0.7fr) minmax(180px, 0.7fr) auto;
          gap: 12px;
          align-items: end;
          margin-bottom: 24px;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.018);
        }

        .filterBar label {
          display: grid;
          gap: 7px;
        }

        .filterBar label span {
          color: #cfe0e3;
          font-size: 0.74rem;
          font-weight: 800;
        }

        .filterBar input,
        .filterBar select {
          min-height: 44px;
          width: 100%;
          padding: 0 12px;
          border: 1px solid rgba(118, 213, 220, 0.15);
          border-radius: 10px;
          color: #789098;
          background: rgba(2, 14, 22, 0.72);
          font: inherit;
        }

        .filterBoundary {
          display: grid;
          place-items: center;
          min-height: 44px;
          padding: 0 14px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 10px;
          color: var(--gold);
          background: rgba(255, 216, 120, 0.05);
          font-size: 0.7rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .recordsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .recordCard {
          display: grid;
          align-content: start;
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: 22px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.14);
        }

        .recordTopline {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 18px;
        }

        .categoryBadge,
        .statusBadge {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .categoryBadge {
          color: var(--teal);
          border: 1px solid rgba(103, 224, 223, 0.2);
          background: rgba(103, 224, 223, 0.06);
        }

        .statusBadge {
          color: #2b230e;
          background: var(--gold);
        }

        .recordCard h3 {
          margin-bottom: 12px;
          font-size: 1.55rem;
          line-height: 1.2;
        }

        .recordCard > p {
          color: var(--muted);
          line-height: 1.67;
        }

        .recordMeta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 10px;
        }

        .recordMeta > div {
          display: grid;
          gap: 5px;
          padding: 11px;
          border: 1px solid rgba(118, 213, 220, 0.1);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
        }

        .recordMeta span {
          color: #78959d;
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .recordMeta strong {
          color: #e2eef0;
          font-size: 0.74rem;
          line-height: 1.4;
        }

        .includesList {
          display: grid;
          gap: 8px;
          margin-top: 20px;
        }

        .includesList > span {
          color: var(--teal);
          font-size: 0.67rem;
          font-weight: 850;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .includesList > div {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          color: #dcebed;
        }

        .includesList svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: var(--teal);
        }

        .includesList small {
          line-height: 1.5;
        }

        .recordActions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(118, 213, 220, 0.1);
        }

        .recordLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--teal);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 850;
        }

        .recordActions button {
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #718890;
          background: rgba(255, 255, 255, 0.025);
          font-weight: 800;
          cursor: not-allowed;
        }

        .workflowGrid,
        .proofPanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(380px, 0.8fr);
          gap: 58px;
          align-items: start;
        }

        .workflowGrid > div:first-child p,
        .proofPanel > div:first-child p {
          margin-top: 20px;
        }

        .workflowSteps,
        .proofStates {
          display: grid;
          gap: 10px;
        }

        .workflowStep,
        .proofStates > div {
          display: grid;
          gap: 10px;
          align-items: center;
          padding: 13px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .workflowStep {
          grid-template-columns: 38px 1fr;
        }

        .workflowStep > span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.67rem;
          font-weight: 900;
        }

        .workflowStep strong {
          font-size: 0.85rem;
        }

        .rolesGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .roleCard {
          min-height: 200px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(10, 31, 43, 0.8), rgba(4, 18, 27, 0.94));
        }

        .roleCard h3 {
          margin-bottom: 11px;
          color: #eaf6f7;
          font-size: 1.25rem;
        }

        .roleCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .proofStates > div {
          gap: 6px;
        }

        .proofStates strong {
          color: var(--gold);
          font-size: 0.72rem;
          letter-spacing: 0.08em;
        }

        .proofStates span {
          color: #d8cfb9;
          font-size: 0.8rem;
          line-height: 1.45;
        }

        .finalSection {
          padding: 60px 0 80px;
        }

        .finalPanel {
          display: grid;
          gap: 30px;
          padding: 42px;
          border: 1px solid var(--border-strong);
          border-radius: 30px;
          background:
            radial-gradient(circle at 86% 12%, rgba(98, 169, 255, 0.13), transparent 32%),
            radial-gradient(circle at 10% 88%, rgba(103, 224, 223, 0.12), transparent 32%),
            linear-gradient(145deg, rgba(8, 30, 42, 0.95), rgba(3, 15, 23, 0.98));
        }

        .finalPanel p {
          max-width: 820px;
          margin-top: 20px;
        }

        .maxim {
          padding-top: 24px;
          border-top: 1px solid rgba(118, 213, 220, 0.14);
          color: var(--teal);
          font-size: 0.84rem;
          font-weight: 850;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.09;
            transform: scale(0.92);
          }
          50% {
            opacity: 0.17;
            transform: scale(1.08);
          }
        }

        @keyframes lineMove {
          0% {
            opacity: 0;
            translate: -12% 0;
          }
          20%,
          80% {
            opacity: 0.72;
          }
          100% {
            opacity: 0;
            translate: 38% 0;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @media (max-width: 1020px) {
          .heroGrid,
          .sectionHeading,
          .workflowGrid,
          .proofPanel {
            grid-template-columns: 1fr;
          }

          .principleGrid,
          .rolesGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filterBar {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .pageShell {
            width: min(100% - 24px, 1180px);
          }

          .heroSection {
            padding-top: 56px;
          }

          .backLink {
            margin-bottom: 38px;
          }

          .sectionBlock {
            padding: 78px 0;
          }

          .recordsGrid,
          .principleGrid,
          .rolesGrid,
          .filterBar {
            grid-template-columns: 1fr;
          }

          .recordMeta {
            grid-template-columns: 1fr;
          }

          .heroPanelRow {
            grid-template-columns: 32px 1fr;
          }

          .heroPanelRow small {
            grid-column: 2;
          }

          .finalPanel {
            padding: 30px 22px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
          }

          .heroActions,
          .finalActions {
            flex-direction: column;
            align-items: stretch;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
          }

          .recordCard {
            padding: 20px 17px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
