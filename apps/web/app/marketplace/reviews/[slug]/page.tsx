import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ReviewRecord = {
  slug: string;
  title: string;
  subject: string;
  reviewer: string;
  reviewerType: string;
  reviewerLocation: string;
  date: string;
  status: string;
  result: string;
  reviewClass: string;
  reviewId: string;
  summary: string;
  scope: string[];
  exclusions: string[];
  method: string[];
  evidence: {
    title: string;
    type: string;
    state: string;
  }[];
  findings: {
    id: string;
    title: string;
    classification: string;
    status: string;
    detail: string;
  }[];
  strengths: string[];
  gaps: string[];
  subjectResponse: string;
  conflicts: string[];
  proofBoundaries: string[];
  stats: {
    value: string;
    label: string;
  }[];
};

const reviews: ReviewRecord[] = [
  {
    slug: 'runtime-refusal-architecture-review',
    title: 'Runtime Refusal Architecture Review',
    subject: 'Bounded Runtime Governance Framework',
    reviewer: 'Patel Review Studio',
    reviewerType: 'Independent Review Entity',
    reviewerLocation: 'United Kingdom',
    date: 'July 18, 2026',
    status: 'PUBLISHED',
    result: 'PASSED WITH BOUNDED CORRECTIONS',
    reviewClass: 'Architecture Review',
    reviewId: 'TA-14-RVW-2026-000018',
    summary:
      'The reviewed architecture demonstrated a coherent refusal path and preserved no-bind evidence, but required clearer distinction between runtime standing and downstream execution authority.',
    scope: [
      'Refusal before consequential execution',
      'Standing and admissibility evaluation',
      'Escalation and no-bind outcomes',
      'Witness continuity',
      'Receipt integrity',
      'Authority separation',
    ],
    exclusions: [
      'No legal or regulatory compliance opinion',
      'No production security audit',
      'No certification of the underlying implementation',
      'No determination of intellectual-property ownership',
    ],
    method: [
      'Reviewed the submitted architecture statement and declared claims.',
      'Mapped refusal behavior to the stated execution chain.',
      'Tested missing-standing, stale-authority, and contradictory-authority scenarios.',
      'Examined no-bind receipts for attribution, continuity, and dependency clarity.',
      'Compared declared runtime authority with downstream execution authority.',
    ],
    evidence: [
      {
        title: 'Runtime Governance Architecture Specification v1.3',
        type: 'Architecture document',
        state: 'REVIEWED',
      },
      {
        title: 'No-Bind Receipt Demonstration Package',
        type: 'Route artifact',
        state: 'REPLAYED',
      },
      {
        title: 'Standing and Authority Matrix',
        type: 'Governance matrix',
        state: 'REVIEWED',
      },
      {
        title: 'Escalation and Refusal Test Cases',
        type: 'Challenge package',
        state: 'TESTED',
      },
      {
        title: 'Public Boundary and Non-Claims Statement',
        type: 'Boundary declaration',
        state: 'REVIEWED',
      },
    ],
    findings: [
      {
        id: 'F-01',
        title: 'Refusal occurs before bind and consequence',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The architecture places standing and admissibility evaluation before binding, commit, and execution. In the supplied challenge cases, inadmissible objects did not acquire execution authority.',
      },
      {
        id: 'F-02',
        title: 'No-bind receipt preserves attributable refusal evidence',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The refusal package records the object identity, evaluated boundary, missing standing, decision state, timestamp, and route dependency context.',
      },
      {
        id: 'F-03',
        title: 'Runtime standing and downstream execution authority require clearer separation',
        classification: 'CORRECTION',
        status: 'OPEN',
        detail:
          'The architecture distinguishes standing from authority conceptually, but the submitted matrix does not fully define how standing expires or how downstream execution authority is independently established.',
      },
      {
        id: 'F-04',
        title: 'Cross-system authority transfer is not yet evidenced',
        classification: 'EXCEPTION',
        status: 'OPEN',
        detail:
          'The reviewed materials describe transferred authority but do not provide a preserved external authority record or challenge case demonstrating invalid transfer handling.',
      },
      {
        id: 'F-05',
        title: 'Escalation state remains distinguishable from denial',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The architecture preserves ESCALATE as a distinct state requiring a declared receiving authority rather than silently treating escalation as denial or approval.',
      },
    ],
    strengths: [
      'Refusal before consequence',
      'Preserved no-bind receipts',
      'Explicit escalation state',
      'Declared authority boundaries',
      'Reviewable challenge cases',
    ],
    gaps: [
      'Standing expiration not fully specified',
      'Cross-system authority transfer requires preserved evidence',
    ],
    subjectResponse:
      'The subject accepted both bounded corrections and stated that standing-expiration rules and transferred-authority evidence will be added in the next architecture version. No objection was filed against the factual findings.',
    conflicts: [
      'The reviewer reported no ownership interest in the reviewed architecture.',
      'The reviewer reported no payment contingent on a positive result.',
      'The reviewer previously reviewed one unrelated governance package submitted by the same organization.',
    ],
    proofBoundaries: [
      'This review is limited to the submitted architecture and evidence package.',
      'The result does not certify production security, legal compliance, or regulatory conformity.',
      'A coherent refusal architecture does not prove every implementation will refuse correctly.',
      'The review does not establish originality, ownership, or patentability.',
      'Open corrections remain unresolved until evidenced in a later version or review.',
    ],
    stats: [
      { value: '8', label: 'Artifacts reviewed' },
      { value: '12', label: 'Findings recorded' },
      { value: '2', label: 'Open corrections' },
      { value: '4', label: 'Challenge cases' },
    ],
  },
  {
    slug: 'multi-agent-payment-route-review',
    title: 'Multi-Agent Payment Route Review',
    subject: 'Governed Vendor Payment Architecture',
    reviewer: 'Independent Governance Practice',
    reviewerType: 'Governance Architecture Practice',
    reviewerLocation: 'United States',
    date: 'July 14, 2026',
    status: 'PUBLISHED',
    result: 'HOLD PENDING AUTHORITY CORRECTION',
    reviewClass: 'Execution Route Review',
    reviewId: 'TA-14-RVW-2026-000017',
    summary:
      'The route correctly refused progression when procurement authority and beneficiary evidence were incomplete. The architecture remained reviewable and independently replayable.',
    scope: [
      'Agent identity and standing',
      'Procurement authority',
      'Finance authority',
      'Beneficiary verification',
      'Commit integrity',
      'Execution-to-outcome correspondence',
    ],
    exclusions: [
      'No banking compliance opinion',
      'No fraud certification',
      'No assessment of external payment processors',
      'No legal opinion on contract enforceability',
    ],
    method: [
      'Reviewed the route package and declared payment purpose.',
      'Mapped every dependency required before commit.',
      'Replayed the route using the preserved evidence set.',
      'Tested missing procurement authority and unverified beneficiary scenarios.',
      'Compared the decision receipt with the declared execution state.',
    ],
    evidence: [
      {
        title: 'Vendor Payment Route Package',
        type: 'Execution route',
        state: 'REPLAYED',
      },
      {
        title: 'Supplier and Beneficiary Identity Records',
        type: 'Identity evidence',
        state: 'PARTIAL',
      },
      {
        title: 'Procurement Authority Declaration',
        type: 'Authority record',
        state: 'MISSING',
      },
      {
        title: 'Finance Approval Record',
        type: 'Authority record',
        state: 'UNVERIFIED',
      },
      {
        title: 'HOLD Decision Receipt',
        type: 'Decision receipt',
        state: 'VERIFIED',
      },
    ],
    findings: [
      {
        id: 'F-01',
        title: 'Route refused progression before commit',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The preserved route produced HOLD before payment commitment because required authority and beneficiary dependencies were incomplete.',
      },
      {
        id: 'F-02',
        title: 'Beneficiary verification is an explicit dependency',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The route does not treat supplier identity as sufficient proof of the receiving beneficiary.',
      },
      {
        id: 'F-03',
        title: 'Procurement authority is missing',
        classification: 'BLOCKING GAP',
        status: 'OPEN',
        detail:
          'No attributable record established that the initiating actor held valid procurement authority for the declared amount and supplier.',
      },
      {
        id: 'F-04',
        title: 'Finance authority is not independently verified',
        classification: 'BLOCKING GAP',
        status: 'OPEN',
        detail:
          'The route references finance approval but the preserved evidence does not independently bind the approver, role, amount, and validity period.',
      },
      {
        id: 'F-05',
        title: 'HOLD decision is independently replayable',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'A separate replay reproduced the same HOLD outcome from the supplied route package.',
      },
    ],
    strengths: [
      'Clear HOLD logic',
      'Beneficiary evidence dependency',
      'Commit-state preservation',
      'Replayable route package',
    ],
    gaps: [
      'Procurement authority missing',
      'Finance authority not independently verified',
    ],
    subjectResponse:
      'The subject accepted the HOLD result and indicated that the route will remain non-executable until both authority records and beneficiary verification are replaced with attributable evidence.',
    conflicts: [
      'The reviewer reported no financial interest in the vendor transaction.',
      'The reviewer did not design the submitted payment route.',
      'The reviewer received a fixed review fee unrelated to outcome.',
    ],
    proofBoundaries: [
      'This review does not determine whether the supplier or transaction is lawful.',
      'Replayability does not create missing authority.',
      'A HOLD decision is not an accusation of fraud.',
      'The review is limited to the submitted route and preserved dependencies.',
      'Execution remains prohibited until the blocking gaps are corrected.',
    ],
    stats: [
      { value: '11', label: 'Artifacts reviewed' },
      { value: '14', label: 'Findings recorded' },
      { value: '2', label: 'Blocking gaps' },
      { value: '5', label: 'Replay cases' },
    ],
  },
  {
    slug: 'building-record-continuity-review',
    title: 'Building Record Continuity Review',
    subject: 'Daily Building Environmental Record',
    reviewer: 'Building Evidence Collaborative',
    reviewerType: 'Environmental Record Institution',
    reviewerLocation: 'Canada',
    date: 'July 10, 2026',
    status: 'PUBLISHED',
    result: 'PASSED',
    reviewClass: 'Record Continuity Review',
    reviewId: 'TA-14-RVW-2026-000016',
    summary:
      'The record model preserved source changes and correction events without erasing prior state. The review confirmed that interpretation remained separated from diagnosis and optimization.',
    scope: [
      'Source attribution',
      'Daily timestamps',
      'Version transitions',
      'Sensor replacement continuity',
      'Correction history',
      'Interpretation boundaries',
    ],
    exclusions: [
      'No assessment of clinical causation',
      'No certification of sensor accuracy beyond supplied calibration evidence',
      'No energy-performance guarantee',
      'No diagnosis of building or occupant health',
    ],
    method: [
      'Reviewed the daily record schema and source declarations.',
      'Examined a sensor-replacement transition and correction event.',
      'Tested whether prior states remained addressable.',
      'Compared interpretation language with declared diagnosis and optimization boundaries.',
      'Reviewed restricted-source treatment.',
    ],
    evidence: [
      {
        title: 'Daily Environmental Record Schema',
        type: 'Record specification',
        state: 'REVIEWED',
      },
      {
        title: 'Thirty-Day Demonstration Record',
        type: 'Record set',
        state: 'REVIEWED',
      },
      {
        title: 'Sensor Replacement Event',
        type: 'Continuity event',
        state: 'VERIFIED',
      },
      {
        title: 'Correction and Supersession Log',
        type: 'Record history',
        state: 'VERIFIED',
      },
      {
        title: 'Interpretation Boundary Statement',
        type: 'Boundary declaration',
        state: 'REVIEWED',
      },
    ],
    findings: [
      {
        id: 'F-01',
        title: 'Prior daily states remain addressable',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'Corrections and updated interpretations create later events while preserving the original daily record.',
      },
      {
        id: 'F-02',
        title: 'Sensor replacement is explicitly recorded',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The record identifies the removed source, replacement source, transition time, and continuity note.',
      },
      {
        id: 'F-03',
        title: 'Interpretation remains separated from diagnosis',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The reviewed record describes environmental conditions and evidence limits without silently diagnosing occupants or equipment.',
      },
      {
        id: 'F-04',
        title: 'Restricted-source disclosure policy needs expansion',
        classification: 'IMPROVEMENT',
        status: 'OPEN',
        detail:
          'The framework identifies restricted evidence but should specify when public summaries disclose that withheld evidence affected interpretation.',
      },
    ],
    strengths: [
      'Daily continuity preserved',
      'Source replacement events recorded',
      'Prior states remain addressable',
      'Interpretation separated from diagnosis',
    ],
    gaps: [
      'Restricted-source disclosure policy should be expanded',
    ],
    subjectResponse:
      'The subject accepted the improvement item and agreed to add a public indicator when restricted evidence materially affects an interpretation.',
    conflicts: [
      'The reviewer is also the record institution responsible for the demonstration framework.',
      'Because this is not fully independent, the review is classified as institutional continuity review rather than independent verification.',
      'No outcome-based compensation was reported.',
    ],
    proofBoundaries: [
      'Continuity does not prove environmental causation.',
      'The review does not diagnose occupants, equipment, or buildings.',
      'Source attribution is limited to supplied records and access.',
      'Institutional review is not independent certification.',
      'Restricted evidence may limit public reproducibility.',
    ],
    stats: [
      { value: '15', label: 'Artifacts reviewed' },
      { value: '9', label: 'Findings recorded' },
      { value: '1', label: 'Open improvement' },
      { value: '30', label: 'Daily records' },
    ],
  },
  {
    slug: 'independent-route-replay-review',
    title: 'Independent Route Replay Review',
    subject: 'Consequential Execution Package',
    reviewer: 'Replay Integrity Lab',
    reviewerType: 'Execution Verification Laboratory',
    reviewerLocation: 'Germany',
    date: 'July 7, 2026',
    status: 'PUBLISHED',
    result: 'VERIFIED',
    reviewClass: 'Technical Verification',
    reviewId: 'TA-14-RVW-2026-000015',
    summary:
      'The route package replayed to the same ALLOW decision. Evidence dependencies, signatures, receipt continuity, and execution correspondence were reproducible from the preserved package.',
    scope: [
      'Package integrity',
      'Route identity',
      'Ed25519 signatures',
      'SHA-256 digests',
      'Evidence dependencies',
      'Commit and outcome correspondence',
    ],
    exclusions: [
      'No validation of external source truth beyond preserved evidence',
      'No cybersecurity penetration test',
      'No legal compliance review',
      'No operational safety certification',
    ],
    method: [
      'Validated the package manifest and route identifier.',
      'Verified supplied signatures and digests.',
      'Reconstructed evidence dependencies.',
      'Replayed the decision logic from the preserved package.',
      'Compared commit, execution, and outcome receipts.',
    ],
    evidence: [
      {
        title: 'Consequential Execution Package',
        type: 'Replay package',
        state: 'VERIFIED',
      },
      {
        title: 'Signature Manifest',
        type: 'Cryptographic evidence',
        state: 'VERIFIED',
      },
      {
        title: 'Evidence Dependency Graph',
        type: 'Dependency record',
        state: 'VERIFIED',
      },
      {
        title: 'Commit and Execution Receipts',
        type: 'Execution evidence',
        state: 'VERIFIED',
      },
      {
        title: 'Outcome Correspondence Record',
        type: 'Outcome evidence',
        state: 'VERIFIED',
      },
    ],
    findings: [
      {
        id: 'F-01',
        title: 'Decision replay reproduced the original ALLOW state',
        classification: 'VERIFICATION',
        status: 'CONFIRMED',
        detail:
          'The independent replay reached the same decision from the supplied ruleset and evidence package.',
      },
      {
        id: 'F-02',
        title: 'Package signatures and digests matched',
        classification: 'VERIFICATION',
        status: 'CONFIRMED',
        detail:
          'The package manifest, record digests, and supplied Ed25519 signatures were internally consistent.',
      },
      {
        id: 'F-03',
        title: 'Commit, execution, and outcome remained correspondent',
        classification: 'VERIFICATION',
        status: 'CONFIRMED',
        detail:
          'The executed action and declared outcome matched the committed target and preserved action identity.',
      },
      {
        id: 'F-04',
        title: 'External clock source was not independently anchored',
        classification: 'LIMITATION',
        status: 'OPEN',
        detail:
          'The package includes timestamps, but the review did not independently validate an external trusted time source.',
      },
    ],
    strengths: [
      'Decision reproducibility',
      'Signature verification',
      'Dependency continuity',
      'Execution correspondence',
    ],
    gaps: [
      'External clock source not independently anchored',
    ],
    subjectResponse:
      'The subject accepted the timestamp limitation and stated that trusted-time anchoring is planned for a later package version.',
    conflicts: [
      'The verification laboratory reported no role in designing the route.',
      'The verification fee was fixed and not contingent on a VERIFIED result.',
      'No ownership or licensing interest was reported.',
    ],
    proofBoundaries: [
      'A valid signature does not prove that the underlying claim is true.',
      'Replay success is limited to the preserved package.',
      'Technical verification does not establish legal compliance.',
      'The review does not create execution authority.',
      'External systems outside the package were not independently audited.',
    ],
    stats: [
      { value: '19', label: 'Artifacts verified' },
      { value: '10', label: 'Findings recorded' },
      { value: '1', label: 'Open limitation' },
      { value: '6', label: 'Replay checks' },
    ],
  },
  {
    slug: 'hospital-environment-boundary-review',
    title: 'Hospital Environmental Boundary Review',
    subject: 'Hospital Environmental Record Framework',
    reviewer: 'Clinical Environment Review Group',
    reviewerType: 'Healthcare Environmental Review Entity',
    reviewerLocation: 'United States',
    date: 'July 3, 2026',
    status: 'PUBLISHED',
    result: 'PASSED WITH CORRECTIONS',
    reviewClass: 'Domain Boundary Review',
    reviewId: 'TA-14-RVW-2026-000014',
    summary:
      'The framework appropriately separated environmental evidence from patient diagnosis, but needed stronger language preventing inferred clinical causation from environmental records alone.',
    scope: [
      'Restricted evidence',
      'Contributor roles',
      'Environmental interpretation',
      'Clinical non-diagnosis boundaries',
      'Correction handling',
      'Disclosure controls',
    ],
    exclusions: [
      'No patient diagnosis',
      'No medical causation determination',
      'No hospital accreditation review',
      'No privacy-law certification',
    ],
    method: [
      'Reviewed the hospital environmental record framework.',
      'Mapped contributor roles and access boundaries.',
      'Examined interpretation language for clinical overreach.',
      'Tested correction, supersession, and disclosure events.',
      'Reviewed restricted-evidence handling.',
    ],
    evidence: [
      {
        title: 'Hospital Environmental Record Framework',
        type: 'Record architecture',
        state: 'REVIEWED',
      },
      {
        title: 'Restricted Contributor Matrix',
        type: 'Permission record',
        state: 'REVIEWED',
      },
      {
        title: 'Environmental Interpretation Template',
        type: 'Interpretation record',
        state: 'REVIEWED',
      },
      {
        title: 'Correction and Disclosure Event Log',
        type: 'Continuity evidence',
        state: 'PARTIAL',
      },
      {
        title: 'Clinical Non-Diagnosis Boundary',
        type: 'Boundary declaration',
        state: 'REVIEWED',
      },
    ],
    findings: [
      {
        id: 'F-01',
        title: 'Environmental evidence remains separate from patient diagnosis',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The framework does not authorize environmental reviewers to create clinical diagnoses.',
      },
      {
        id: 'F-02',
        title: 'Contributor permissions are explicit',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'Submission, viewing, interpretation, correction, release, and challenge roles are separately defined.',
      },
      {
        id: 'F-03',
        title: 'Clinical causation language is too broad',
        classification: 'CORRECTION',
        status: 'OPEN',
        detail:
          'Some interpretation examples could be read as implying that environmental conditions caused a patient outcome without independent clinical evidence.',
      },
      {
        id: 'F-04',
        title: 'Disclosure events need stronger receipts',
        classification: 'CORRECTION',
        status: 'OPEN',
        detail:
          'The framework records disclosure actions but does not yet preserve complete recipient, purpose, scope, and authorization evidence.',
      },
    ],
    strengths: [
      'Restricted evidence roles',
      'Non-diagnosis boundary',
      'Correction and supersession logic',
      'Environmental interpretation controls',
    ],
    gaps: [
      'Clinical causation language too broad',
      'Disclosure events need stronger receipts',
    ],
    subjectResponse:
      'The subject accepted both corrections and committed to revising causation language and adding disclosure receipts before pilot deployment.',
    conflicts: [
      'The reviewer reported domain expertise but no operational role in the subject hospital.',
      'No patient-specific evidence was reviewed.',
      'The reviewer received a fixed review fee unrelated to result.',
    ],
    proofBoundaries: [
      'This review does not diagnose patients or determine medical causation.',
      'The review does not certify privacy-law compliance.',
      'Environmental evidence may support inquiry but does not prove clinical effect.',
      'Restricted evidence limits public reproducibility.',
      'Corrections remain open until a later version is reviewed.',
    ],
    stats: [
      { value: '13', label: 'Artifacts reviewed' },
      { value: '16', label: 'Findings recorded' },
      { value: '2', label: 'Open corrections' },
      { value: '7', label: 'Boundary tests' },
    ],
  },
  {
    slug: 'constitutional-governance-gap-review',
    title: 'Constitutional Governance Gap Review',
    subject: 'AI Governance Constitution and Runtime Model',
    reviewer: 'Bose Consequence Systems',
    reviewerType: 'Authority and Commit Governance Practice',
    reviewerLocation: 'Singapore',
    date: 'June 28, 2026',
    status: 'PUBLISHED',
    result: 'PASSED WITH EXCEPTIONS',
    reviewClass: 'Constitutional Review',
    reviewId: 'TA-14-RVW-2026-000013',
    summary:
      'The constitution provided strong first principles and refusal logic. The review identified unresolved transfer conditions between constitutional approval and operational commit authority.',
    scope: [
      'Constitutional first principles',
      'Runtime interpretation',
      'Standing and authority',
      'Binding and commit',
      'Escalation and refusal',
      'Outcome accountability',
    ],
    exclusions: [
      'No judicial or statutory interpretation',
      'No legal enforceability opinion',
      'No production implementation audit',
      'No claim of universal constitutional applicability',
    ],
    method: [
      'Reviewed the constitution and runtime model.',
      'Mapped constitutional principles to operational states.',
      'Examined authority transfer and revocation conditions.',
      'Tested refusal and escalation scenarios.',
      'Reviewed amendment and version continuity.',
    ],
    evidence: [
      {
        title: 'AI Governance Constitution v2.1',
        type: 'Constitutional document',
        state: 'REVIEWED',
      },
      {
        title: 'Runtime Interpretation Model',
        type: 'Architecture document',
        state: 'REVIEWED',
      },
      {
        title: 'Commit Authority Matrix',
        type: 'Authority record',
        state: 'PARTIAL',
      },
      {
        title: 'Refusal and Escalation Cases',
        type: 'Challenge package',
        state: 'TESTED',
      },
      {
        title: 'Amendment and Version History',
        type: 'Continuity record',
        state: 'REVIEWED',
      },
    ],
    findings: [
      {
        id: 'F-01',
        title: 'Constitutional first principles are explicit',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'The architecture declares governing principles and does not rely solely on policy prose embedded inside implementation logic.',
      },
      {
        id: 'F-02',
        title: 'Refusal logic remains connected to constitutional boundaries',
        classification: 'STRENGTH',
        status: 'CONFIRMED',
        detail:
          'Challenge cases show that runtime refusal is tied to declared principles rather than arbitrary model preference.',
      },
      {
        id: 'F-03',
        title: 'Authority transfer conditions are incomplete',
        classification: 'EXCEPTION',
        status: 'OPEN',
        detail:
          'The architecture does not fully define when constitutional approval transfers into operational commit authority or when that authority expires.',
      },
      {
        id: 'F-04',
        title: 'Execution revocation timing is unspecified',
        classification: 'EXCEPTION',
        status: 'OPEN',
        detail:
          'The model requires revocation but does not define the latest admissible point at which a pending execution can still be stopped.',
      },
    ],
    strengths: [
      'Constitutional first principles',
      'Runtime refusal logic',
      'Commit boundaries',
      'Outcome accountability',
    ],
    gaps: [
      'Authority transfer conditions incomplete',
      'Execution revocation timing unspecified',
    ],
    subjectResponse:
      'The subject accepted the exceptions and stated that the next constitutional version will add explicit authority-transfer and revocation timing rules.',
    conflicts: [
      'The reviewer reported no ownership interest in the constitution.',
      'The reviewer has published work on authority and commit governance relevant to the review.',
      'The review fee was fixed and not contingent on outcome.',
    ],
    proofBoundaries: [
      'The review does not establish legal enforceability.',
      'A constitutional model does not prove correct runtime implementation.',
      'The result is limited to the supplied version and evidence package.',
      'Open exceptions remain unresolved.',
      'The review does not establish originality or ownership.',
    ],
    stats: [
      { value: '17', label: 'Artifacts reviewed' },
      { value: '18', label: 'Findings recorded' },
      { value: '2', label: 'Open exceptions' },
      { value: '6', label: 'Challenge cases' },
    ],
  },
];

function getReview(slug: string) {
  return reviews.find((review) => review.slug === slug);
}

export function generateStaticParams() {
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const review = getReview(slug);

  if (!review) {
    return {
      title: 'Governance Review',
    };
  }

  return {
    title: review.title,
    description: review.summary,
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

export default async function MarketplaceReviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const review = getReview(slug);

  if (!review) {
    notFound();
  }

  return (
    <main className="reviewPage">
      <div className="backgroundLayer" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="star starOne" />
        <div className="star starTwo" />
        <div className="star starThree" />
      </div>

      <section className="heroSection">
        <div className="pageShell">
          <Link className="backLink" href="/marketplace/reviews">
            <span aria-hidden="true">←</span>
            Back to Governance Reviews
          </Link>

          <div className="heroGrid">
            <div>
              <div className="reviewMetaRow">
                <span className="classBadge">{review.reviewClass}</span>
                <span className="statusBadge">{review.status}</span>
              </div>

              <h1>{review.title}</h1>
              <p className="subjectLine">{review.subject}</p>
              <p className="heroLead">{review.summary}</p>

              <div className="heroMeta">
                <span>{review.reviewId}</span>
                <span>{review.date}</span>
                <span>{review.reviewer}</span>
                <span>{review.reviewerLocation}</span>
              </div>

              <div className="resultPanel">
                <span>REVIEW RESULT</span>
                <strong>{review.result}</strong>
              </div>

              <div className="heroActions">
                <a className="primaryButton" href="#findings">
                  Read findings
                  <ArrowIcon />
                </a>
                <a className="secondaryButton" href="#evidence">
                  Review evidence
                </a>
              </div>

              <div className="boundaryNotice">
                <AlertIcon />
                <span>
                  This is a demonstration review record. It does not represent a
                  live certification, legal determination, regulatory approval,
                  or production assurance. Connected review submission,
                  signatures, evidence-room access, payment, dispute, and
                  publication workflows are not yet active.
                </span>
              </div>
            </div>

            <aside className="reviewSummaryCard">
              <div className="summaryHeader">
                <span>REVIEW SUMMARY</span>
                <strong>Every result remains tied to a declared scope.</strong>
              </div>

              <div className="statsGrid">
                {review.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              <dl>
                <div>
                  <dt>Reviewer</dt>
                  <dd>{review.reviewer}</dd>
                </div>
                <div>
                  <dt>Reviewer class</dt>
                  <dd>{review.reviewerType}</dd>
                </div>
                <div>
                  <dt>Review class</dt>
                  <dd>{review.reviewClass}</dd>
                </div>
                <div>
                  <dt>Publication state</dt>
                  <dd>{review.status}</dd>
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
              <span className="sectionKicker">DECLARED SCOPE</span>
              <h2>What the reviewer examined</h2>

              <div className="checkList">
                {review.scope.map((item) => (
                  <div className="checkItem" key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">EXCLUSIONS</span>
              <h2>What the review did not determine</h2>

              <div className="boundaryList">
                {review.exclusions.map((item) => (
                  <div className="boundaryItem" key={item}>
                    <AlertIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">REVIEW METHOD</span>
              <h2>How the evidence was examined</h2>

              <div className="methodList">
                {review.method.map((item, index) => (
                  <div key={item}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard" id="evidence">
              <span className="sectionKicker">EVIDENCE PACKAGE</span>
              <h2>Artifacts included in the bounded review</h2>

              <div className="evidenceTable">
                {review.evidence.map((item) => (
                  <div className="evidenceRow" key={item.title}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.type}</span>
                    </div>
                    <span className="evidenceState">{item.state}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard" id="findings">
              <span className="sectionKicker">FINDINGS</span>
              <h2>Preserved findings and open items</h2>

              <div className="findingsList">
                {review.findings.map((finding) => (
                  <div className="findingCard" key={finding.id}>
                    <div className="findingTopline">
                      <span>{finding.id}</span>
                      <strong>{finding.classification}</strong>
                      <small>{finding.status}</small>
                    </div>
                    <h3>{finding.title}</h3>
                    <p>{finding.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="contentCard">
              <span className="sectionKicker">SUBJECT RESPONSE</span>
              <h2>Recorded response to the review</h2>
              <p className="longText">{review.subjectResponse}</p>
            </article>

            <article className="contentCard proofCard">
              <span className="sectionKicker">PROOF BOUNDARIES</span>
              <h2>What this published review does not prove</h2>

              <div className="boundaryList">
                {review.proofBoundaries.map((item) => (
                  <div className="boundaryItem" key={item}>
                    <AlertIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <aside className="sideColumn">
            <div className="sideCard">
              <span className="sectionKicker">CONFIRMED STRENGTHS</span>
              <h3>Review-supported strengths</h3>

              <div className="smallList">
                {review.strengths.map((item) => (
                  <div key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard gapCard">
              <span className="sectionKicker">OPEN GAPS</span>
              <h3>Items not yet resolved</h3>

              <div className="smallList">
                {review.gaps.map((item) => (
                  <div key={item}>
                    <AlertIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard">
              <span className="sectionKicker">CONFLICT DISCLOSURE</span>
              <h3>Declared reviewer relationships</h3>

              <div className="smallList">
                {review.conflicts.map((item) => (
                  <div key={item}>
                    <ShieldIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sideCard stateCard">
              <span className="sectionKicker">REVIEW STATE</span>
              <h3>Current preserved status</h3>

              <div className="stateList">
                <div>
                  <span>Submission</span>
                  <strong>ACCEPTED</strong>
                </div>
                <div>
                  <span>Conflict disclosure</span>
                  <strong>PRESERVED</strong>
                </div>
                <div>
                  <span>Evidence review</span>
                  <strong>COMPLETE</strong>
                </div>
                <div>
                  <span>Publication</span>
                  <strong>{review.status}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="sectionBlock sectionTint">
        <div className="pageShell responsePanel">
          <div>
            <span className="sectionKicker">RELATED REVIEW REQUEST</span>
            <h2>Request a bounded review of your own architecture or route.</h2>
            <p>
              The connected workflow will require a declared subject, requested
              review class, claims, non-claims, evidence package, known
              conflicts, visibility preference, and expected deliverable before
              reviewer assignment.
            </p>

            <div className="requirementsGrid">
              {[
                'Review subject',
                'Requested scope',
                'Declared claims',
                'Explicit non-claims',
                'Evidence package',
                'Known conflicts',
                'Visibility preference',
                'Expected deliverable',
              ].map((item) => (
                <div key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="requestAction">
            <span>REVIEW WORKFLOW NOT CONNECTED</span>
            <button type="button" disabled>
              Request related review
            </button>
            <small>
              This control remains disabled until authenticated submission,
              evidence-room permissions, reviewer assignment, payment,
              publication, correction, and dispute workflows are implemented.
            </small>
          </div>
        </div>
      </section>

      <section className="finalSection">
        <div className="pageShell finalPanel">
          <div>
            <span className="sectionKicker">MARKETPLACE PRINCIPLE</span>
            <h2>A result without scope is not a trustworthy review.</h2>
            <p>
              The TA-14 AI Governance Exchange Marketplace preserves the
              reviewer, method, evidence, findings, conflicts, response, and
              proof boundaries behind every published review state.
            </p>
          </div>

          <div className="finalActions">
            <Link className="primaryButton" href="/marketplace/post-a-need">
              Request a Governance Review
              <ArrowIcon />
            </Link>
            <Link className="secondaryButton" href="/marketplace/reviews">
              Return to reviews
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

        .reviewPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 12% 8%, rgba(37, 185, 189, 0.15), transparent 30%),
            radial-gradient(circle at 86% 18%, rgba(188, 164, 255, 0.12), transparent 28%),
            linear-gradient(180deg, #031019 0%, #071821 54%, #031019 100%);
        }

        .reviewPage::before {
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
          background: var(--violet);
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

        .reviewMetaRow {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .classBadge,
        .statusBadge {
          display: inline-flex;
          align-items: center;
          min-height: 29px;
          padding: 0 10px;
          border-radius: 999px;
          font-size: 0.64rem;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .classBadge {
          border: 1px solid rgba(188, 164, 255, 0.2);
          color: #d9ceff;
          background: rgba(188, 164, 255, 0.07);
        }

        .statusBadge {
          border: 1px solid rgba(103, 224, 223, 0.2);
          color: var(--teal);
          background: rgba(103, 224, 223, 0.06);
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin: 16px 0 10px;
          font-size: clamp(3rem, 5.9vw, 6rem);
          line-height: 0.96;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .subjectLine {
          margin: 0;
          color: #dce9eb;
          font-size: 1.08rem;
        }

        .heroLead {
          max-width: 780px;
          margin-top: 24px;
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

        .resultPanel {
          display: grid;
          gap: 7px;
          margin-top: 22px;
          padding: 16px;
          border: 1px solid rgba(255, 216, 120, 0.22);
          border-radius: 14px;
          background: rgba(255, 216, 120, 0.05);
        }

        .resultPanel span {
          color: #baa766;
          font-size: 0.65rem;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .resultPanel strong {
          color: var(--gold);
          font-size: 1rem;
          line-height: 1.45;
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

        .reviewSummaryCard {
          padding: 24px;
          border: 1px solid var(--border-strong);
          border-radius: 26px;
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.13), transparent 30%),
            linear-gradient(145deg, rgba(17, 25, 45, 0.92), rgba(4, 17, 25, 0.97));
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
        }

        .summaryHeader {
          display: grid;
          gap: 6px;
          margin-bottom: 20px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(188, 164, 255, 0.15);
        }

        .summaryHeader span {
          color: #d9ceff;
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .summaryHeader strong {
          line-height: 1.45;
        }

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .statsGrid > div {
          display: grid;
          gap: 4px;
          padding: 14px;
          border: 1px solid rgba(188, 164, 255, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .statsGrid strong {
          color: var(--teal);
          font-size: 1.7rem;
        }

        .statsGrid span {
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

        .methodList {
          display: grid;
          gap: 10px;
        }

        .methodList > div {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 13px;
          align-items: start;
          padding: 14px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .methodList > div > span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #031114;
          background: var(--teal);
          font-size: 0.7rem;
          font-weight: 900;
        }

        .methodList p {
          margin: 3px 0 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .evidenceTable {
          display: grid;
          gap: 10px;
        }

        .evidenceRow {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 15px;
          border: 1px solid rgba(118, 213, 220, 0.12);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.018);
        }

        .evidenceRow > div {
          display: grid;
          gap: 5px;
        }

        .evidenceRow strong {
          font-size: 0.92rem;
        }

        .evidenceRow > div span {
          color: var(--muted);
          font-size: 0.74rem;
        }

        .evidenceState {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .findingsList {
          display: grid;
          gap: 14px;
        }

        .findingCard {
          padding: 18px;
          border: 1px solid rgba(118, 213, 220, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.018);
        }

        .findingTopline {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 9px;
          margin-bottom: 13px;
        }

        .findingTopline span,
        .findingTopline strong,
        .findingTopline small {
          display: inline-flex;
          align-items: center;
          min-height: 27px;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 0.62rem;
          font-weight: 850;
          letter-spacing: 0.08em;
        }

        .findingTopline span {
          color: #031114;
          background: var(--teal);
        }

        .findingTopline strong {
          border: 1px solid rgba(188, 164, 255, 0.18);
          color: #d7c9ff;
          background: rgba(188, 164, 255, 0.06);
        }

        .findingTopline small {
          border: 1px solid rgba(255, 216, 120, 0.18);
          color: var(--gold);
          background: rgba(255, 216, 120, 0.05);
        }

        .findingCard h3 {
          margin-bottom: 8px;
          font-size: 1.15rem;
        }

        .findingCard p,
        .longText {
          margin: 0;
          color: var(--muted);
          line-height: 1.68;
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

        .gapCard {
          border-color: rgba(255, 216, 120, 0.2);
          background:
            radial-gradient(circle at 0 0, rgba(255, 216, 120, 0.08), transparent 28%),
            linear-gradient(145deg, rgba(35, 30, 18, 0.72), rgba(15, 18, 22, 0.95));
        }

        .gapCard .smallList svg {
          color: var(--gold);
        }

        .stateCard {
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.1), transparent 28%),
            linear-gradient(145deg, rgba(22, 23, 45, 0.84), rgba(4, 18, 27, 0.95));
        }

        .stateList {
          display: grid;
          gap: 10px;
        }

        .stateList > div {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 11px 12px;
          border: 1px solid rgba(188, 164, 255, 0.14);
          border-radius: 11px;
          background: rgba(188, 164, 255, 0.04);
        }

        .stateList span {
          color: #bcb3d5;
          font-size: 0.72rem;
        }

        .stateList strong {
          color: #e8e1ff;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
        }

        .responsePanel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.42fr);
          gap: 44px;
          align-items: center;
          padding: 34px;
          border: 1px solid var(--border-strong);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(188, 164, 255, 0.11), transparent 26%),
            linear-gradient(145deg, rgba(18, 24, 43, 0.9), rgba(4, 17, 25, 0.96));
        }

        .responsePanel h2,
        .finalPanel h2 {
          margin: 10px 0 16px;
          font-size: clamp(2.2rem, 4.4vw, 4.6rem);
          line-height: 1.05;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .responsePanel p,
        .finalPanel p {
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.75;
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

        .requestAction {
          display: grid;
          gap: 12px;
          padding: 22px;
          border: 1px solid rgba(255, 216, 120, 0.2);
          border-radius: 20px;
          background: rgba(255, 216, 120, 0.05);
        }

        .requestAction > span {
          color: var(--gold);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.13em;
        }

        .requestAction button {
          min-height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #789098;
          background: rgba(255, 255, 255, 0.035);
          font-weight: 800;
          cursor: not-allowed;
        }

        .requestAction small {
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
          .responsePanel {
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

          .sideColumn,
          .requirementsGrid {
            grid-template-columns: 1fr;
          }

          .contentCard {
            padding: 23px 19px;
          }

          .responsePanel,
          .finalPanel {
            padding: 28px 22px;
          }

          .evidenceRow {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: clamp(2.8rem, 16vw, 4.2rem);
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

          .statsGrid {
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
