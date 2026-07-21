import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Governance Organizations Marketplace',
  description:
    'Explore governance organizations, review entities, verification labs, record institutions, and specialist practices inside the TA-14 AI Governance Exchange Marketplace.',
};

const organizations = [
  {
    slug: 'independent-governance-practice',
    name: 'Independent Governance Practice',
    initials: 'IGP',
    type: 'Governance Architecture Practice',
    location: 'United States',
    status: 'ACTIVE',
    verification: 'ORGANIZATION VERIFIED',
    summary:
      'Designs consequential execution routes, authority boundaries, evidence requirements, challenge states, and governed review packages.',
    domains: [
      'AI Governance',
      'Financial Execution',
      'Authority Governance',
      'Evidence Continuity',
    ],
    services: [
      'Route architecture',
      'Authority mapping',
      'Challenge-case design',
      'Independent architecture review',
    ],
    stats: [
      ['18', 'Governed records'],
      ['14', 'Routes delivered'],
      ['9', 'Independent reviews'],
      ['97%', 'Replay success'],
    ],
    evidence: [
      'Organization identity verified',
      'Methodology preserved',
      'Public scope statement current',
      'Conflict disclosure on file',
    ],
  },
  {
    slug: 'building-evidence-collaborative',
    name: 'Building Evidence Collaborative',
    initials: 'BEC',
    type: 'Environmental Record Institution',
    location: 'Canada',
    status: 'ACTIVE',
    verification: 'ORGANIZATION VERIFIED',
    summary:
      'Develops attributable building and environmental records with contributor controls, continuity review, and bounded interpretation.',
    domains: [
      'Environmental Integrity',
      'Building Records',
      'Indoor Environmental Quality',
      'Record Stewardship',
    ],
    services: [
      'Building record frameworks',
      'Daily environmental records',
      'Contributor governance',
      'Interpretation boundary review',
    ],
    stats: [
      ['42', 'Governed records'],
      ['8', 'Routes delivered'],
      ['16', 'Independent reviews'],
      ['94%', 'Continuity score'],
    ],
    evidence: [
      'Organization identity verified',
      'Record templates preserved',
      'Review history logged',
      'Stewardship policy current',
    ],
  },
  {
    slug: 'patel-review-studio',
    name: 'Patel Review Studio',
    initials: 'PRS',
    type: 'Independent Review Entity',
    location: 'United Kingdom',
    status: 'ACTIVE',
    verification: 'ORGANIZATION VERIFIED',
    summary:
      'Performs bounded independent reviews of governance architectures, evidence chains, public claims, and verification packages.',
    domains: [
      'Independent Review',
      'Evidence Integrity',
      'Claim Boundaries',
      'Route Verification',
    ],
    services: [
      'Architecture gap review',
      'Claim-boundary review',
      'Evidence-chain review',
      'Verification-package assessment',
    ],
    stats: [
      ['24', 'Governed records'],
      ['5', 'Routes delivered'],
      ['31', 'Independent reviews'],
      ['98%', 'Review completion'],
    ],
    evidence: [
      'Organization identity verified',
      'Review method preserved',
      'Independence policy current',
      'Public review summaries logged',
    ],
  },
  {
    slug: 'replay-integrity-lab',
    name: 'Replay Integrity Lab',
    initials: 'RIL',
    type: 'Execution Verification Laboratory',
    location: 'Germany',
    status: 'ACTIVE',
    verification: 'ORGANIZATION VERIFIED',
    summary:
      'Tests route packages, signatures, evidence dependencies, commit integrity, replay cases, and execution-to-outcome correspondence.',
    domains: [
      'Replay Verification',
      'Cryptographic Binding',
      'Execution Integrity',
      'Record Dependencies',
    ],
    services: [
      'Independent route replay',
      'Digest and signature checks',
      'Dependency verification',
      'Execution correspondence review',
    ],
    stats: [
      ['29', 'Governed records'],
      ['17', 'Routes verified'],
      ['22', 'Independent reviews'],
      ['99%', 'Replay success'],
    ],
    evidence: [
      'Organization identity verified',
      'Verification suite preserved',
      'Challenge cases published',
      'Technical boundary statement current',
    ],
  },
  {
    slug: 'clinical-environment-review-group',
    name: 'Clinical Environment Review Group',
    initials: 'CERG',
    type: 'Healthcare Environmental Review Entity',
    location: 'United States',
    status: 'INVITATION ONLY',
    verification: 'ORGANIZATION VERIFIED',
    summary:
      'Defines healthcare environmental record boundaries, restricted contributor roles, interpretation limits, and clinical non-diagnosis controls.',
    domains: [
      'Healthcare Environment',
      'Hospital Records',
      'Restricted Evidence',
      'Interpretation Boundaries',
    ],
    services: [
      'Hospital record frameworks',
      'Restricted evidence review',
      'Clinical boundary review',
      'Environmental interpretation governance',
    ],
    stats: [
      ['33', 'Governed records'],
      ['7', 'Routes delivered'],
      ['15', 'Independent reviews'],
      ['96%', 'Continuity score'],
    ],
    evidence: [
      'Organization identity verified',
      'Restricted-record method preserved',
      'Privacy boundary statement current',
      'Clinical non-diagnosis declaration on file',
    ],
  },
  {
    slug: 'bose-consequence-systems',
    name: 'Bose Consequence Systems',
    initials: 'BCS',
    type: 'Authority and Commit Governance Practice',
    location: 'Singapore',
    status: 'ACTIVE',
    verification: 'ORGANIZATION VERIFIED',
    summary:
      'Separates identity, standing, authority, binding, commit, execution, and outcome across high-consequence workflows.',
    domains: [
      'Authority Governance',
      'Commit Integrity',
      'Multi-Agent Execution',
      'Escalation Design',
    ],
    services: [
      'Authority architecture',
      'Commit-state design',
      'Multi-agent route governance',
      'Escalation and refusal logic',
    ],
    stats: [
      ['21', 'Governed records'],
      ['19', 'Routes delivered'],
      ['12', 'Independent reviews'],
      ['97%', 'Replay success'],
    ],
    evidence: [
      'Organization identity verified',
      'Architecture paper preserved',
      'Route artifacts reviewed',
      'Current service declaration on file',
    ],
  },
];

const organizationTypes = [
  {
    title: 'Governance Practice',
    description:
      'Designs governance routes, authority models, challenge states, and bounded execution architectures.',
  },
  {
    title: 'Independent Review Entity',
    description:
      'Examines architecture, evidence, claims, conflicts, and proof boundaries without owning execution.',
  },
  {
    title: 'Verification Laboratory',
    description:
      'Tests route integrity, signatures, dependencies, replay cases, and execution-to-outcome correspondence.',
  },
  {
    title: 'Record Institution',
    description:
      'Maintains governed records, contributor permissions, continuity, versions, corrections, and preservation.',
  },
  {
    title: 'Domain Specialist Practice',
    description:
      'Contributes bounded domain expertise without silently taking governance or execution authority.',
  },
  {
    title: 'Partner Review Organization',
    description:
      'Performs declared specialized review inside a separated multi-entity review structure.',
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

export default function MarketplaceOrganizationsDirectoryPage() {
  return (
    <main className="organizationsPage">
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
              <span className="kicker">GOVERNANCE ORGANIZATIONS</span>
              <h1>Find institutions by declared scope and preserved evidence.</h1>
              <p className="heroLead">
                Explore governance practices, review entities, verification
                laboratories, record institutions, and specialist organizations
                through attributable identity, documented methods, governed
                work, independent review, and explicit proof boundaries.
              </p>

              <div className="heroActions">
                <a className="primaryButton" href="#directory">
                  Explore organizations
                  <ArrowIcon />
                </a>
                <Link className="secondaryButton" href="/marketplace/post-a-need">
                  Post a Governance Need
                </Link>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This is the organization directory architecture. Live
                  organization registration, document upload, identity
                  verification, contact requests, contracting, payment, and
                  reputation updates are not connected yet.
                </span>
              </div>
            </div>

            <aside className="heroPanel">
              <div className="heroPanelHeader">
                <span>ORGANIZATION EVIDENCE</span>
                <strong>Institutional claims must remain reviewable.</strong>
              </div>

              {[
                ['Identity', 'The organization exists as declared'],
                ['Stewardship', 'Named accountable representatives'],
                ['Method', 'Documented operating or review method'],
                ['Artifacts', 'Preserved work and public evidence'],
                ['Independence', 'Declared conflicts and role boundaries'],
                ['Performance', 'Review, replay, and continuity history'],
              ].map(([title, description], index) => (
                <div className="heroPanelRow" key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
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
              <span className="kicker">ORGANIZATION TYPES</span>
              <h2>Different institutions hold different roles.</h2>
            </div>
            <p>
              Registration, architecture, evidence stewardship, independent
              review, verification, and execution must remain separated and
              specifically declared.
            </p>
          </div>

          <div className="typeGrid">
            {organizationTypes.map((type) => (
              <article className="typeCard" key={type.title}>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock" id="directory">
        <div className="pageShell">
          <div className="sectionHeading">
            <div>
              <span className="kicker">ORGANIZATION DIRECTORY</span>
              <h2>Review scope, evidence, services, and institutional standing.</h2>
            </div>
            <p>
              Each profile distinguishes self-declared services, verified
              identity, preserved methods, governed artifacts, independent
              reviews, and specific performance evidence.
            </p>
          </div>

          <div className="filterBar" aria-label="Organization filters">
            <label>
              <span>Search organizations</span>
              <input
                type="search"
                placeholder="Search by name, type, domain, or service"
                disabled
              />
            </label>

            <label>
              <span>Organization type</span>
              <select defaultValue="all" disabled>
                <option value="all">All types</option>
                <option value="practice">Governance practice</option>
                <option value="review">Review entity</option>
                <option value="verification">Verification laboratory</option>
                <option value="records">Record institution</option>
                <option value="specialist">Specialist practice</option>
              </select>
            </label>

            <label>
              <span>Status</span>
              <select defaultValue="all" disabled>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="limited">Limited</option>
                <option value="invitation">Invitation only</option>
              </select>
            </label>

            <div className="filterBoundary">Preview filters</div>
          </div>

          <div className="organizationsGrid">
            {organizations.map((organization) => (
              <article className="organizationCard" key={organization.slug}>
                <div className="organizationHeader">
                  <div className="avatar" aria-hidden="true">
                    {organization.initials}
                  </div>

                  <div>
                    <span className="verificationBadge">
                      {organization.verification}
                    </span>
                    <h3>{organization.name}</h3>
                    <p>{organization.type}</p>
                  </div>
                </div>

                <div className="organizationMeta">
                  <span>{organization.location}</span>
                  <span className="statusBadge">{organization.status}</span>
                </div>

                <p className="organizationSummary">{organization.summary}</p>

                <div className="domains">
                  {organization.domains.map((domain) => (
                    <span key={domain}>{domain}</span>
                  ))}
                </div>

                <div className="servicesList">
                  <span>Declared services</span>
                  {organization.services.map((service) => (
                    <div key={service}>
                      <CheckIcon />
                      <small>{service}</small>
                    </div>
                  ))}
                </div>

                <div className="statsGrid">
                  {organization.stats.map(([value, label]) => (
                    <div key={label}>
                      <strong>{value}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="evidenceList">
                  <span>Preserved organization evidence</span>
                  {organization.evidence.map((item) => (
                    <div key={item}>
                      <CheckIcon />
                      <small>{item}</small>
                    </div>
                  ))}
                </div>

                <div className="cardActions">
                  <Link
                    className="profileLink"
                    href={`/marketplace/organizations/${organization.slug}`}
                  >
                    View organization profile
                    <ArrowIcon />
                  </Link>
                  <button type="button" disabled>
                    Request contact
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell proofGrid">
          <div>
            <span className="kicker">ORGANIZATION STATES</span>
            <h2>Verification must state exactly what was checked.</h2>
            <p>
              An organization may be registered, documented, identity verified,
              independently reviewed, or technically verified. Those states are
              not interchangeable.
            </p>
          </div>

          <div className="proofStates">
            {[
              ['REGISTERED', 'The organization created a Marketplace record.'],
              ['DOCUMENTED', 'Supporting evidence or formal documents were provided.'],
              ['ORGANIZATION VERIFIED', 'Institutional identity or legal existence was checked.'],
              ['STEWARD VERIFIED', 'A named accountable representative was checked.'],
              ['INDEPENDENTLY REVIEWED', 'A separate reviewer examined a declared scope.'],
              ['VERIFIED', 'A specific technical, continuity, or replay check passed.'],
            ].map(([state, description]) => (
              <div key={state}>
                <strong>{state}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell engagementPanel">
          <div>
            <span className="kicker">GOVERNED ENGAGEMENT</span>
            <h2>Organization contact begins with a declared scope.</h2>
            <p>
              The connected workflow will require the requester to declare the
              governance need, consequential action, available evidence,
              expected deliverable, budget, timing, visibility, and conflicts
              before contact is released.
            </p>

            <div className="requirementsGrid">
              {[
                'Governance need',
                'Consequential action',
                'Evidence available',
                'Scope and exclusions',
                'Budget and timing',
                'Visibility preference',
                'Conflict disclosure',
                'Expected deliverable',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="engagementAction">
            <span>CONTACT WORKFLOW NOT CONNECTED</span>
            <button type="button" disabled>
              Start organization contact request
            </button>
            <small>
              This control remains disabled until authenticated identity,
              permissions, messaging, matching, and engagement workflows are
              implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="kicker">MARKETPLACE PRINCIPLE</span>
            <h2>Institutional reputation should follow preserved evidence.</h2>
            <p>
              The TA-14 AI Governance Exchange Marketplace separates
              registration from endorsement, documentation from verification,
              and visibility from proven competence.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Post a Governance Need
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

        .organizationsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .organizationsPage::before {
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
          background: linear-gradient(
            90deg,
            transparent,
            rgba(103, 224, 223, 0.58),
            transparent
          );
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
          grid-template-columns: 34px minmax(94px, auto) 1fr;
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
          background: linear-gradient(
            180deg,
            rgba(9, 28, 39, 0.66),
            rgba(5, 18, 26, 0.45)
          );
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 480px);
          gap: 38px;
          align-items: end;
          margin-bottom: 48px;
        }

        .sectionHeading h2,
        .proofGrid h2,
        .engagementPanel h2,
        .finalPanel h2 {
          margin: 10px 0 0;
          font-size: clamp(2.3rem, 4.6vw, 4.8rem);
          line-height: 1.04;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .sectionHeading p,
        .proofGrid > div:first-child p,
        .engagementPanel p,
        .finalPanel p {
          margin: 0;
          color: var(--muted);
          font-size: 1.03rem;
          line-height: 1.75;
        }

        .typeGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .typeCard {
          min-height: 200px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(10, 31, 43, 0.8),
            rgba(4, 18, 27, 0.94)
          );
        }

        .typeCard h3 {
          margin-bottom: 11px;
          font-size: 1.25rem;
        }

        .typeCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.65;
        }

        .filterBar {
          display: grid;
          grid-template-columns:
            minmax(0, 1.5fr)
            minmax(180px, 0.7fr)
            minmax(180px, 0.7fr)
            auto;
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

        .organizationsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .organizationCard {
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

        .organizationHeader {
          display: grid;
          grid-template-columns: 74px 1fr;
          gap: 15px;
          align-items: center;
        }

        .avatar {
          width: 74px;
          height: 74px;
          display: grid;
          place-items: center;
          border: 1px solid var(--border-strong);
          border-radius: 20px;
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 14px 36px rgba(37, 185, 189, 0.2);
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .verificationBadge {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          padding: 0 8px;
          border: 1px solid rgba(103, 224, 223, 0.18);
          border-radius: 999px;
          color: var(--teal);
          background: rgba(103, 224, 223, 0.05);
          font-size: 0.58rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .organizationHeader h3 {
          margin: 9px 0 4px;
          font-size: 1.4rem;
        }

        .organizationHeader p {
          margin: 0;
          color: var(--muted);
          font-size: 0.79rem;
          line-height: 1.45;
        }

        .organizationMeta {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          margin-top: 18px;
          padding: 11px 0;
          border-top: 1px solid rgba(118, 213, 220, 0.1);
          border-bottom: 1px solid rgba(118, 213, 220, 0.1);
          color: #b9ccd1;
          font-size: 0.75rem;
        }

        .statusBadge {
          color: var(--gold);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .organizationSummary {
          margin: 18px 0 0;
          color: var(--muted);
          line-height: 1.67;
        }

        .domains {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 17px;
        }

        .domains span {
          display: inline-flex;
          align-items: center;
          min-height: 29px;
          padding: 0 9px;
          border: 1px solid rgba(103, 224, 223, 0.14);
          border-radius: 999px;
          color: #dcebed;
          background: rgba(103, 224, 223, 0.05);
          font-size: 0.67rem;
        }

        .servicesList,
        .evidenceList {
          display: grid;
          gap: 8px;
          margin-top: 18px;
        }

        .servicesList > span,
        .evidenceList > span {
          color: var(--teal);
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .servicesList > div,
        .evidenceList > div {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          color: #dcebed;
        }

        .servicesList svg,
        .evidenceList svg {
          flex: 0 0 auto;
          margin-top: 1px;
          color: var(--teal);
        }

        .servicesList small,
        .evidenceList small {
          line-height: 1.45;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 7px;
          margin-top: 18px;
        }

        .statsGrid > div {
          display: grid;
          gap: 4px;
          padding: 10px 7px;
          border: 1px solid rgba(118, 213, 220, 0.1);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.016);
          text-align: center;
        }

        .statsGrid strong {
          color: var(--teal);
          font-size: 1.1rem;
        }

        .statsGrid span {
          color: #78959d;
          font-size: 0.58rem;
          line-height: 1.3;
        }

        .cardActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          margin-top: 22px;
          padding-top: 17px;
          border-top: 1px solid rgba(118, 213, 220, 0.1);
        }

        .profileLink {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--teal);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 850;
        }

        .cardActions button {
          min-height: 38px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #718890;
          background: rgba(255, 255, 255, 0.025);
          font-weight: 800;
          cursor: not-allowed;
        }

        .proofGrid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(380px, 0.8fr);
          gap: 58px;
          align-items: start;
        }

        .proofGrid > div:first-child p {
          margin-top: 20px;
        }

        .proofStates {
          display: grid;
          gap: 10px;
        }

        .proofStates > div {
          display: grid;
          gap: 6px;
          padding: 13px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .proofStates strong {
          color: var(--gold);
          font-size: 0.7rem;
          letter-spacing: 0.08em;
        }

        .proofStates span {
          color: #d8cfb9;
          font-size: 0.79rem;
          line-height: 1.45;
        }

        .engagementPanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.42fr);
          gap: 44px;
          align-items: center;
          padding: 34px;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.12), transparent 26%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.9), rgba(4, 17, 25, 0.96));
        }

        .engagementPanel p {
          margin-top: 18px;
        }

        .requirementsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .requirementsGrid > div {
          display: flex;
          gap: 9px;
          align-items: center;
          padding: 11px 12px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
          color: #dcebed;
          font-size: 0.78rem;
        }

        .requirementsGrid svg {
          flex: 0 0 auto;
          color: var(--teal);
        }

        .engagementAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .engagementAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .engagementAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .engagementAction small {
          color: #a99f87;
          line-height: 1.5;
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
          margin-top: 18px;
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
          .proofGrid,
          .engagementPanel {
            grid-template-columns: 1fr;
          }

          .typeGrid {
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

          .organizationsGrid,
          .typeGrid,
          .filterBar,
          .requirementsGrid {
            grid-template-columns: 1fr;
          }

          .heroPanelRow {
            grid-template-columns: 32px 1fr;
          }

          .heroPanelRow small {
            grid-column: 2;
          }

          .statsGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .engagementPanel,
          .finalPanel {
            padding: 28px 22px;
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

          .organizationCard {
            padding: 20px 17px;
          }

          .organizationHeader {
            grid-template-columns: 1fr;
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
