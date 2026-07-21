import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type OrganizationRecord = {
  slug: string;
  name: string;
  initials: string;
  type: string;
  location: string;
  status: string;
  verification: string;
  summary: string;
  founded: string;
  steward: string;
  visibility: string;
  domains: string[];
  services: string[];
  stats: {
    value: string;
    label: string;
  }[];
  evidenceHistory: string[];
  methods: {
    title: string;
    description: string;
    state: string;
  }[];
  reviewHistory: {
    title: string;
    scope: string;
    result: string;
    date: string;
  }[];
  proofBoundaries: string[];
};

const organizations: OrganizationRecord[] = [
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
    founded: '2024',
    steward: 'Mara Ellington',
    visibility: 'Public profile with restricted engagement details',
    domains: [
      'AI Governance',
      'Financial Execution',
      'Authority Governance',
      'Evidence Continuity',
    ],
    services: [
      'Consequential route architecture',
      'Authority and standing mapping',
      'Evidence requirement design',
      'Challenge and escalation cases',
      'Independent architecture review',
      'Replay package preparation',
    ],
    stats: [
      { value: '18', label: 'Governed records' },
      { value: '14', label: 'Routes delivered' },
      { value: '9', label: 'Independent reviews' },
      { value: '97%', label: 'Replay success' },
    ],
    evidenceHistory: [
      'Organization identity verified',
      'Named steward identity verified',
      'Public methodology statement preserved',
      'Portfolio artifacts reviewed',
      'Conflict disclosure current',
      'Service declaration dated July 21, 2026',
    ],
    methods: [
      {
        title: 'Governance Route Architecture',
        description:
          'Defines Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome for a declared consequential action.',
        state: 'DOCUMENTED',
      },
      {
        title: 'Authority Boundary Mapping',
        description:
          'Separates identity, standing, role, approval, binding authority, commit authority, and execution authority.',
        state: 'REVIEWED',
      },
      {
        title: 'Challenge-State Design',
        description:
          'Builds missing-evidence, stale-evidence, contradictory-authority, and execution-divergence test cases.',
        state: 'PUBLISHED',
      },
    ],
    reviewHistory: [
      {
        title: 'Financial Approval Architecture Review',
        scope: 'Authority, evidence continuity, binding, and commit integrity',
        result: 'Passed with bounded corrections',
        date: 'July 2026',
      },
      {
        title: 'Public AI Disclosure Route Review',
        scope: 'Attribution, approval, publication, challenge, and correction',
        result: 'Passed',
        date: 'June 2026',
      },
      {
        title: 'Cross-Organization Approval Route',
        scope: 'Identity and transferred execution authority',
        result: 'HOLD pending authority correction',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Organization verification does not certify legal competence in every jurisdiction.',
      'A documented method does not prove successful execution in every domain.',
      'Replay success is limited to preserved test cases.',
      'Portfolio review does not imply universal applicability.',
      'Marketplace status does not replace engagement-specific review.',
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
    founded: '2023',
    steward: 'Daniel Cho',
    visibility: 'Public profile with private client evidence',
    domains: [
      'Environmental Integrity',
      'Building Records',
      'Indoor Environmental Quality',
      'Record Stewardship',
    ],
    services: [
      'Building environmental record frameworks',
      'Daily environmental record operations',
      'Contributor and source governance',
      'Continuity and custody review',
      'Governed interpretation',
      'Post-intervention comparison',
    ],
    stats: [
      { value: '42', label: 'Governed records' },
      { value: '8', label: 'Routes delivered' },
      { value: '16', label: 'Independent reviews' },
      { value: '94%', label: 'Continuity score' },
    ],
    evidenceHistory: [
      'Organization identity verified',
      'Named steward identity verified',
      'Record templates preserved',
      'Independent review history logged',
      'Stewardship policy current',
      'Service declaration dated July 21, 2026',
    ],
    methods: [
      {
        title: 'Daily Building Environmental Record',
        description:
          'Preserves source systems, room context, occupancy, service history, environmental conditions, and daily interpretation.',
        state: 'PILOT REVIEWED',
      },
      {
        title: 'Contributor Authority Protocol',
        description:
          'Separates record stewardship, evidence contribution, interpretation, diagnosis, optimization, and execution.',
        state: 'DOCUMENTED',
      },
      {
        title: 'Post-Intervention Comparison',
        description:
          'Compares declared post-state evidence against a preserved original-state baseline.',
        state: 'REVIEWED',
      },
    ],
    reviewHistory: [
      {
        title: 'Building Record Continuity Review',
        scope: 'Source attribution, timestamps, version state, and daily preservation',
        result: 'Passed',
        date: 'July 2026',
      },
      {
        title: 'Environmental Interpretation Boundary Review',
        scope: 'Record, interpretation, diagnosis, and optimization separation',
        result: 'Passed with corrections',
        date: 'June 2026',
      },
      {
        title: 'Sensor Replacement Continuity Challenge',
        scope: 'Source change, version transition, and missing-period handling',
        result: 'Resolved',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Environmental records do not diagnose occupants.',
      'Continuity does not prove causation.',
      'Record completeness depends on declared sources and access.',
      'A public summary may omit restricted evidence.',
      'Interpretation remains limited to preserved evidence.',
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
    founded: '2025',
    steward: 'Nina Patel',
    visibility: 'Public profile with private client review files',
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
      'Challenge-case assessment',
      'Verification-package assessment',
      'Independent review memoranda',
    ],
    stats: [
      { value: '24', label: 'Governed records' },
      { value: '5', label: 'Routes delivered' },
      { value: '31', label: 'Independent reviews' },
      { value: '98%', label: 'Review completion' },
    ],
    evidenceHistory: [
      'Organization identity verified',
      'Named steward identity verified',
      'Review method preserved',
      'Independence policy current',
      'Public review summaries logged',
      'Conflict disclosure current',
    ],
    methods: [
      {
        title: 'Bounded Architecture Review',
        description:
          'Examines only the declared architecture, claims, evidence, exclusions, and unresolved gaps.',
        state: 'DOCUMENTED',
      },
      {
        title: 'Claim-to-Evidence Mapping',
        description:
          'Maps each public or technical claim to supporting evidence, review state, and proof boundary.',
        state: 'PUBLISHED',
      },
      {
        title: 'Independent Challenge Review',
        description:
          'Assesses stale evidence, missing authority, contradictory sources, and execution divergence.',
        state: 'REVIEWED',
      },
    ],
    reviewHistory: [
      {
        title: 'Governed Multi-Agent Route Review',
        scope: 'Identity, authority, binding, commit, execution, and outcome',
        result: 'Passed with bounded exceptions',
        date: 'July 2026',
      },
      {
        title: 'Evidence Maturity Review',
        scope: 'Assumption drift, guardian state, and evidence continuity',
        result: 'Passed',
        date: 'June 2026',
      },
      {
        title: 'Runtime Refusal Architecture',
        scope: 'Refusal, escalation, witness continuity, and receipt integrity',
        result: 'Passed',
        date: 'June 2026',
      },
    ],
    proofBoundaries: [
      'Independent review is limited to the declared scope.',
      'A passed review is not legal certification.',
      'Review history does not guarantee future performance.',
      'Unreviewed claims remain the responsibility of the claimant.',
      'Independence depends on current conflict disclosure.',
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
    founded: '2024',
    steward: 'Jonas Reed',
    visibility: 'Public profile with restricted verification packages',
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
      'Ledger continuity review',
      'Commit integrity testing',
      'Execution-to-outcome correspondence review',
    ],
    stats: [
      { value: '29', label: 'Governed records' },
      { value: '17', label: 'Routes verified' },
      { value: '22', label: 'Independent reviews' },
      { value: '99%', label: 'Replay success' },
    ],
    evidenceHistory: [
      'Organization identity verified',
      'Named steward identity verified',
      'Verification suite preserved',
      'Challenge cases published',
      'Technical boundary statement current',
      'Current verification declaration on file',
    ],
    methods: [
      {
        title: 'Independent Route Replay',
        description:
          'Reconstructs the preserved route from supplied records and tests decision reproducibility.',
        state: 'VERIFIED',
      },
      {
        title: 'Cryptographic Integrity Review',
        description:
          'Checks digests, signatures, identities, record dependencies, and package consistency.',
        state: 'DOCUMENTED',
      },
      {
        title: 'Execution Correspondence Review',
        description:
          'Tests whether authorized commit, execution evidence, and declared outcome remain aligned.',
        state: 'REVIEWED',
      },
    ],
    reviewHistory: [
      {
        title: 'Vendor Payment Route Replay',
        scope: 'Evidence, authority, commit, execution, and outcome correspondence',
        result: 'Verified',
        date: 'July 2026',
      },
      {
        title: 'Governed Publication Route Replay',
        scope: 'Attribution, approval, publication, correction, and receipt dependencies',
        result: 'Verified',
        date: 'June 2026',
      },
      {
        title: 'Missing Beneficiary Evidence Challenge',
        scope: 'Dependency failure and HOLD-state reproduction',
        result: 'Verified HOLD',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Technical verification is limited to supplied packages and declared checks.',
      'A valid signature does not prove the underlying claim is true.',
      'Replay success does not prove legal or regulatory compliance.',
      'Verification does not transfer execution authority.',
      'Unpreserved dependencies cannot be verified.',
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
    founded: '2025',
    steward: 'Ava Morales',
    visibility: 'Restricted profile with invitation-only engagement',
    domains: [
      'Healthcare Environment',
      'Hospital Records',
      'Restricted Evidence',
      'Interpretation Boundaries',
    ],
    services: [
      'Hospital environmental record frameworks',
      'Restricted evidence review',
      'Clinical non-diagnosis boundary review',
      'Environmental interpretation governance',
      'Contributor permission design',
      'Correction and supersession review',
    ],
    stats: [
      { value: '33', label: 'Governed records' },
      { value: '7', label: 'Routes delivered' },
      { value: '15', label: 'Independent reviews' },
      { value: '96%', label: 'Continuity score' },
    ],
    evidenceHistory: [
      'Organization identity verified',
      'Named steward identity verified',
      'Restricted-record method preserved',
      'Privacy boundary statement current',
      'Clinical non-diagnosis declaration on file',
      'Invitation-only status current',
    ],
    methods: [
      {
        title: 'Hospital Environmental Record Framework',
        description:
          'Preserves room, facilities, laboratory, contributor, event, and interpretation evidence under restricted access.',
        state: 'DOCUMENTED',
      },
      {
        title: 'Clinical Non-Diagnosis Boundary Review',
        description:
          'Checks that environmental evidence is not silently converted into patient diagnosis or causation.',
        state: 'REVIEWED',
      },
      {
        title: 'Restricted Contributor Governance',
        description:
          'Defines who may submit, view, interpret, challenge, correct, and release institutional evidence.',
        state: 'PUBLISHED',
      },
    ],
    reviewHistory: [
      {
        title: 'Hospital Record Interpretation Review',
        scope: 'Environmental interpretation and clinical boundary separation',
        result: 'Passed with corrections',
        date: 'July 2026',
      },
      {
        title: 'Restricted Evidence Access Review',
        scope: 'Contributor roles, visibility, downloads, and disclosure history',
        result: 'Passed',
        date: 'June 2026',
      },
      {
        title: 'Clinical Causation Overclaim Challenge',
        scope: 'Environmental claim boundary and escalation handling',
        result: 'Resolved',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Environmental review does not diagnose patients.',
      'The organization does not establish clinical causation.',
      'Restricted access requires institution-specific configuration.',
      'Review does not replace hospital policy or clinical governance.',
      'Environmental interpretation remains limited to preserved evidence.',
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
    founded: '2024',
    steward: 'Samir Bose',
    visibility: 'Public profile with restricted client route packages',
    domains: [
      'Authority Governance',
      'Commit Integrity',
      'Multi-Agent Execution',
      'Escalation Design',
    ],
    services: [
      'Authority architecture',
      'Standing and role separation',
      'Commit-state design',
      'Multi-agent route governance',
      'Escalation and refusal logic',
      'Execution-boundary review',
    ],
    stats: [
      { value: '21', label: 'Governed records' },
      { value: '19', label: 'Routes delivered' },
      { value: '12', label: 'Independent reviews' },
      { value: '97%', label: 'Replay success' },
    ],
    evidenceHistory: [
      'Organization identity verified',
      'Named steward identity verified',
      'Architecture paper preserved',
      'Route artifacts reviewed',
      'Current service declaration on file',
      'Conflict disclosure current',
    ],
    methods: [
      {
        title: 'Authority Separation Architecture',
        description:
          'Separates identity, standing, role, approval, binding, commit, and execution authority.',
        state: 'DOCUMENTED',
      },
      {
        title: 'Commit Integrity Protocol',
        description:
          'Requires preserved authority, action identity, target identity, evidence dependencies, and immutable commit state.',
        state: 'REVIEWED',
      },
      {
        title: 'Escalation and Refusal Logic',
        description:
          'Defines HOLD, DENY, ESCALATE, and no-bind outcomes for inadmissible or conflicting routes.',
        state: 'PUBLISHED',
      },
    ],
    reviewHistory: [
      {
        title: 'Multi-Agent Financial Route Review',
        scope: 'Agent identity, authority, commit, execution, and beneficiary evidence',
        result: 'Passed with bounded exceptions',
        date: 'July 2026',
      },
      {
        title: 'Commit Integrity Challenge',
        scope: 'Changed target after approval and commit invalidation',
        result: 'Verified DENY',
        date: 'June 2026',
      },
      {
        title: 'Authority Transfer Route Review',
        scope: 'Delegation, standing, expiration, and execution limits',
        result: 'Passed',
        date: 'May 2026',
      },
    ],
    proofBoundaries: [
      'Architecture does not create legal authority by itself.',
      'A valid commit does not prove the underlying action is lawful.',
      'Multi-agent governance remains limited to declared identities and integrations.',
      'Replay success is limited to preserved route packages.',
      'Execution authority must be independently established.',
    ],
  },
];

function getOrganization(slug: string) {
  return organizations.find((organization) => organization.slug === slug);
}

export function generateStaticParams() {
  return organizations.map((organization) => ({
    slug: organization.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const organization = getOrganization(slug);

  if (!organization) {
    return {
      title: 'Marketplace Organization',
    };
  }

  return {
    title: organization.name,
    description: organization.summary,
  };
}

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
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
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

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
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

export default async function OrganizationProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organization = getOrganization(slug);

  if (!organization) {
    notFound();
  }

  return (
    <main className="organizationPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
      </div>

      <section className="heroSection">
        <div className="pageShell">
          <Link className="backLink" href="/marketplace/organizations">
            <span aria-hidden="true">←</span>
            Back to Governance Organizations
          </Link>

          <div className="heroGrid">
            <div>
              <div className="identityRow">
                <div className="avatar" aria-hidden="true">
                  {organization.initials}
                </div>

                <div>
                  <span className="verificationBadge">
                    <ShieldIcon />
                    {organization.verification}
                  </span>
                  <h1>{organization.name}</h1>
                  <p className="roleLine">
                    {organization.type} · {organization.location}
                  </p>
                </div>
              </div>

              <p className="heroLead">{organization.summary}</p>

              <div className="heroMeta">
                <span>{organization.status}</span>
                <span>Founded {organization.founded}</span>
                <span>Steward: {organization.steward}</span>
                <span>{organization.visibility}</span>
              </div>

              <div className="heroActions">
                <a className="primaryButton" href="#contact">
                  Request organization contact
                  <ArrowIcon />
                </a>
                <a className="secondaryButton" href="#methods">
                  Review documented methods
                </a>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This is a demonstration organization profile. Live
                  registration, identity checks, document upload, messaging,
                  contracting, payments, review submissions, and status updates
                  are not connected yet.
                </span>
              </div>
            </div>

            <aside className="scoreCard" aria-label="Organization evidence summary">
              <div className="scoreHeader">
                <span>ORGANIZATION EVIDENCE</span>
                <strong>Institutional standing should be specific and reviewable.</strong>
              </div>

              <div className="scoreGrid">
                {organization.stats.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <dl>
                <div>
                  <dt>Organization type</dt>
                  <dd>{organization.type}</dd>
                </div>
                <div>
                  <dt>Current status</dt>
                  <dd>{organization.status}</dd>
                </div>
                <div>
                  <dt>Named steward</dt>
                  <dd>{organization.steward}</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{organization.visibility}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="sectionBlock">
        <div className="pageShell twoColumnLayout">
          <div className="mainColumn">
            <article className="contentCard">
              <span className="sectionKicker">DOMAINS</span>
              <h2>Declared institutional fields</h2>

              <div className="chipList">
                {organization.domains.map((domain) => (
                  <span className="chip" key={domain}>
                    {domain}
                  </span>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">DECLARED SERVICES</span>
              <h2>Available scopes</h2>

              <div className="checkList">
                {organization.services.map((service) => (
                  <div className="checkItem" key={service}>
                    <CheckIcon />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard" id="methods">
              <span className="sectionKicker">DOCUMENTED METHODS</span>
              <h2>Preserved institutional methods</h2>

              <div className="methodGrid">
                {organization.methods.map((method) => (
                  <div className="methodCard" key={method.title}>
                    <div className="methodTopline">
                      <span>METHOD</span>
                      <strong>{method.state}</strong>
                    </div>
                    <h3>{method.title}</h3>
                    <p>{method.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">REVIEW HISTORY</span>
              <h2>Independent and technical review record</h2>

              <div className="reviewList">
                {organization.reviewHistory.map((review) => (
                  <div className="reviewItem" key={`${review.title}-${review.date}`}>
                    <div>
                      <h3>{review.title}</h3>
                      <p>{review.scope}</p>
                    </div>
                    <div className="reviewResult">
                      <strong>{review.result}</strong>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard proofCard">
              <span className="sectionKicker">PROOF BOUNDARIES</span>
              <h2>What this organization profile does not prove</h2>

              <div className="boundaryList">
                {organization.proofBoundaries.map((boundary) => (
                  <div className="boundaryItem" key={boundary}>
                    <AlertIcon />
                    <span>{boundary}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="sideColumn">
            <div className="sideCard">
              <span className="sectionKicker">EVIDENCE HISTORY</span>
              <h3>Preserved organization evidence</h3>

              <div className="smallList">
                {organization.evidenceHistory.map((item) => (
                  <div key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard">
              <span className="sectionKicker">ENGAGEMENT FIT</span>
              <h3>Appropriate uses</h3>

              <div className="smallList">
                {[
                  'Scoped governance architecture',
                  'Independent organizational review',
                  'Governed record design',
                  'Verification and replay',
                  'Specialized partner review',
                  'Evidence continuity assessment',
                ].map((item) => (
                  <div key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard governanceCard">
              <span className="sectionKicker">PROFILE STATE</span>
              <h3>Current organization record</h3>

              <div className="statusList">
                <div>
                  <span>Organization</span>
                  <strong>VERIFIED</strong>
                </div>
                <div>
                  <span>Named steward</span>
                  <strong>VERIFIED</strong>
                </div>
                <div>
                  <span>Methods</span>
                  <strong>DOCUMENTED</strong>
                </div>
                <div>
                  <span>Service declaration</span>
                  <strong>CURRENT</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBlock sectionTint" id="contact">
        <div className="pageShell contactPanel">
          <div>
            <span className="sectionKicker">ORGANIZATION CONTACT REQUEST</span>
            <h2>Open a governed institutional conversation.</h2>
            <p>
              The connected workflow will require the requester to declare the
              problem, consequential action, expected scope, available evidence,
              timing, budget, visibility, conflicts, and intended deliverable
              before contact is released.
            </p>

            <div className="contactRequirements">
              {[
                'Declared governance need',
                'Consequential action',
                'Expected scope',
                'Evidence available',
                'Budget and timing',
                'Visibility preference',
                'Conflict disclosure',
                'Desired deliverable',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="contactAction">
            <span>CONTACT WORKFLOW NOT CONNECTED</span>
            <button type="button" disabled>
              Request organization contact
            </button>
            <small>
              This control remains disabled until authenticated messaging,
              permissions, matching, and engagement workflows are implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="sectionKicker">MARKETPLACE PRINCIPLE</span>
            <h2>Institutional reputation should follow preserved evidence.</h2>
            <p>
              Registration, documentation, identity verification, independent
              review, and technical verification remain distinct Marketplace
              states.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Post a Governance Need
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/marketplace/organizations">
              Return to organizations
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

        .organizationPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(98, 169, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .organizationPage::before {
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
          top: 40%;
          right: -150px;
          background: var(--blue);
          animation-delay: 3s;
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
          width: min(1160px, calc(100% - 40px));
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
          grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.72fr);
          gap: 58px;
          align-items: start;
        }

        .identityRow {
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .avatar {
          flex: 0 0 auto;
          width: 102px;
          height: 102px;
          display: grid;
          place-items: center;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          color: #031114;
          background: linear-gradient(135deg, var(--teal), #b2f7f1);
          box-shadow: 0 18px 46px rgba(37, 185, 189, 0.24);
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .verificationBadge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 30px;
          padding: 0 10px;
          border: 1px solid rgba(103, 224, 223, 0.2);
          border-radius: 999px;
          color: var(--teal);
          background: rgba(103, 224, 223, 0.06);
          font-size: 0.67rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 12px 0 8px;
          font-size: clamp(3rem, 5.7vw, 5.8rem);
          line-height: 0.96;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .roleLine {
          margin: 0;
          color: #d8e6e9;
          font-size: 1rem;
          line-height: 1.6;
        }

        .heroLead {
          max-width: 780px;
          margin-top: 26px;
          color: var(--muted);
          font-size: clamp(1.05rem, 1.6vw, 1.28rem);
          line-height: 1.75;
        }

        .heroMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .heroMeta span {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 11px;
          border: 1px solid rgba(118, 213, 220, 0.14);
          border-radius: 999px;
          color: #cfe0e3;
          background: rgba(255, 255, 255, 0.018);
          font-size: 0.75rem;
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

        .scoreCard {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(9, 32, 44, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .scoreHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(118, 213, 220, 0.15);
        }

        .scoreHeader span {
          color: var(--teal);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .scoreHeader strong {
          line-height: 1.45;
        }

        .scoreGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .scoreGrid > div {
          display: grid;
          gap: 4px;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .scoreGrid strong {
          color: var(--teal);
          font-size: 1.7rem;
        }

        .scoreGrid span {
          color: var(--muted);
          font-size: 0.72rem;
          line-height: 1.4;
        }

        dl {
          display: grid;
          gap: 0;
          margin: 18px 0 0;
        }

        dl > div {
          display: grid;
          gap: 6px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(118, 213, 220, 0.09);
        }

        dl > div:last-child {
          border-bottom: 0;
        }

        dt {
          color: #78959d;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        dd {
          margin: 0;
          color: #e4f0f2;
          font-size: 0.82rem;
          line-height: 1.5;
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

        .twoColumnLayout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.38fr);
          gap: 26px;
          align-items: start;
        }

        .mainColumn,
        .sideColumn {
          display: grid;
          gap: 20px;
        }

        .sideColumn {
          position: sticky;
          top: 24px;
        }

        .contentCard,
        .sideCard {
          border: 1px solid var(--border);
          background:
            radial-gradient(circle at 0 0, rgba(103, 224, 223, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(10, 31, 43, 0.86), rgba(4, 18, 27, 0.95));
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.16);
        }

        .contentCard {
          padding: 30px;
          border-radius: 24px;
        }

        .sideCard {
          padding: 22px;
          border-radius: 20px;
        }

        .sectionKicker {
          display: inline-flex;
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 850;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .contentCard h2 {
          margin: 10px 0 20px;
          font-size: clamp(2rem, 3.7vw, 3.7rem);
          line-height: 1.08;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .sideCard h3 {
          margin: 10px 0 18px;
          font-size: 1.2rem;
        }

        .chipList {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(103, 224, 223, 0.16);
          border-radius: 999px;
          color: #dcebed;
          background: rgba(103, 224, 223, 0.06);
          font-size: 0.76rem;
          line-height: 1.4;
        }

        .checkList,
        .boundaryList {
          display: grid;
          gap: 12px;
        }

        .checkItem,
        .boundaryItem {
          display: flex;
          gap: 11px;
          align-items: flex-start;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
          color: #dcebed;
          line-height: 1.6;
        }

        .checkItem svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--teal);
        }

        .boundaryItem svg {
          flex: 0 0 auto;
          margin-top: 3px;
          color: var(--gold);
        }

        .methodGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .methodCard {
          padding: 18px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.018);
        }

        .methodCard:last-child {
          grid-column: 1 / -1;
        }

        .methodTopline {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }

        .methodTopline span {
          color: var(--teal);
          font-size: 0.66rem;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .methodTopline strong {
          color: var(--gold);
          font-size: 0.66rem;
        }

        .methodCard h3 {
          margin-bottom: 8px;
          font-size: 1.05rem;
        }

        .methodCard p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .reviewList {
          display: grid;
          gap: 12px;
        }

        .reviewItem {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          padding: 16px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.018);
        }

        .reviewItem h3 {
          margin-bottom: 6px;
          font-size: 1rem;
        }

        .reviewItem p {
          margin: 0;
          color: var(--muted);
          line-height: 1.55;
        }

        .reviewResult {
          display: grid;
          gap: 6px;
          justify-items: end;
          align-content: start;
          text-align: right;
        }

        .reviewResult strong {
          color: var(--teal);
          font-size: 0.78rem;
        }

        .reviewResult span {
          color: #78959d;
          font-size: 0.72rem;
        }

        .proofCard {
          border-color: rgba(255, 216, 120, 0.22);
          background:
            radial-gradient(circle at 0 0, rgba(255, 216, 120, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(35, 30, 18, 0.72), rgba(15, 18, 22, 0.95));
        }

        .smallList {
          display: grid;
          gap: 10px;
        }

        .smallList > div {
          display: flex;
          gap: 9px;
          align-items: flex-start;
          color: #dbe9eb;
          font-size: 0.78rem;
          line-height: 1.55;
        }

        .smallList svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: var(--teal);
        }

        .governanceCard {
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.1), transparent 28%),
            linear-gradient(145deg, rgba(22, 23, 45, 0.84), rgba(4, 18, 27, 0.95));
        }

        .statusList {
          display: grid;
          gap: 10px;
        }

        .statusList > div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 11px 12px;
          border: 1px solid rgba(188, 164, 255, 0.14);
          border-radius: 11px;
          background: rgba(188, 164, 255, 0.04);
        }

        .statusList span {
          color: #bcb3d5;
          font-size: 0.72rem;
        }

        .statusList strong {
          color: #e8e1ff;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
        }

        .contactPanel {
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

        .contactPanel h2,
        .finalPanel h2 {
          margin: 10px 0 16px;
          font-size: clamp(2.2rem, 4.4vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .contactPanel p,
        .finalPanel p {
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.75;
        }

        .contactRequirements {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 26px;
        }

        .contactRequirements > div {
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

        .contactRequirements svg {
          flex: 0 0 auto;
          color: var(--teal);
        }

        .contactAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .contactAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .contactAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .contactAction small {
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
          margin: 0;
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

        @media (max-width: 980px) {
          .heroGrid,
          .twoColumnLayout,
          .contactPanel {
            grid-template-columns: 1fr;
          }

          .sideColumn {
            position: static;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            width: min(100% - 24px, 1160px);
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

          .identityRow {
            align-items: flex-start;
            flex-direction: column;
          }

          .sideColumn,
          .methodGrid,
          .contactRequirements {
            grid-template-columns: 1fr;
          }

          .methodCard:last-child {
            grid-column: auto;
          }

          .reviewItem {
            grid-template-columns: 1fr;
          }

          .reviewResult {
            justify-items: start;
            text-align: left;
          }

          .contentCard {
            padding: 23px 19px;
          }

          .contactPanel,
          .finalPanel {
            padding: 28px 22px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
          }

          .avatar {
            width: 86px;
            height: 86px;
            border-radius: 24px;
          }

          .heroActions,
          .finalActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryButton,
          .secondaryButton {
            width: 100%;
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
