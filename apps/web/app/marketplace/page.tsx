import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Governance Exchange Marketplace',
  description:
    'Post governance needs, find qualified builders, request governed records, and explore proven governance routes inside the TA-14 AI Governance Exchange.',
};

type MarketplaceDoorway = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  status: string;
};

type Opportunity = {
  title: string;
  domain: string;
  deliverable: string;
  budget: string;
  timing: string;
  visibility: string;
  qualifications: string[];
};

type Professional = {
  name: string;
  role: string;
  organization: string;
  domains: string[];
  credentialStatus: string;
  completedWork: string;
};

const doorwayCards: MarketplaceDoorway[] = [
  {
    eyebrow: 'FOR ORGANIZATIONS',
    title: 'Post a Governance Need',
    description:
      'Describe a consequential problem, the action that must be governed, the evidence already available, the authorities involved, and the result you need.',
    href: '#post-a-need',
    action: 'Preview Need Intake',
    status: 'INTAKE COMING NEXT',
  },
  {
    eyebrow: 'FOR BUILDERS AND REVIEWERS',
    title: 'Find Governance Work',
    description:
      'Explore clearly bounded opportunities that call for governance architects, record creators, reviewers, verifiers, and domain specialists.',
    href: '#open-opportunities',
    action: 'View Opportunities',
    status: 'DEMONSTRATION DATA',
  },
  {
    eyebrow: 'FOR RECORD REQUESTERS',
    title: 'Request a Governed Record',
    description:
      'Invite qualified contributors to assemble a governed record with attributable evidence, continuity review, verification, and declared proof boundaries.',
    href: '#governed-records',
    action: 'Explore Record Requests',
    status: 'WORKFLOW PREVIEW',
  },
  {
    eyebrow: 'FOR BUYERS AND LICENSEES',
    title: 'Browse Proven Routes',
    description:
      'Discover governance routes that have been tested against declared scenarios and can be delivered, transferred, or licensed within stated boundaries.',
    href: '#proven-routes',
    action: 'Browse Route Preview',
    status: 'LIBRARY PREVIEW',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Declare the Need',
    description:
      'State the real problem, consequential action, affected parties, evidence, authority, exclusions, budget, timing, and required deliverable.',
  },
  {
    number: '02',
    title: 'Select Qualified Contributors',
    description:
      'Review declared qualifications, credential evidence, scope, conflicts, prior work, proposal terms, and availability.',
  },
  {
    number: '03',
    title: 'Build and Test Together',
    description:
      'Collaborate inside a bounded workspace where evidence, questions, changes, challenges, approvals, and tests remain attributable.',
  },
  {
    number: '04',
    title: 'Verify, Preserve, and Deliver',
    description:
      'Deliver a versioned artifact with verification results, exceptions, proof boundaries, authorship, rights, and preservation history.',
  },
];

const opportunities: Opportunity[] = [
  {
    title: 'High-Risk Vendor Payment Approval Route',
    domain: 'Financial Execution Governance',
    deliverable: 'Custom consequential execution route',
    budget: '$3,200 fixed scope',
    timing: 'Requested within 12 days',
    visibility: 'Public demonstration opportunity',
    qualifications: [
      'AI governance architecture',
      'Financial controls',
      'Route testing',
    ],
  },
  {
    title: 'Hospital Environmental Record Framework',
    domain: 'Healthcare Environmental Governance',
    deliverable: 'Governed record template and continuity review',
    budget: '$12,000 proposed budget',
    timing: 'Four-week target',
    visibility: 'Invitation-only example',
    qualifications: [
      'Healthcare operations',
      'Environmental records',
      'Evidence continuity',
    ],
  },
  {
    title: 'HVAC Baseline and Post-Intervention Record',
    domain: 'HVAC Performance Governance',
    deliverable: 'Record workflow, evidence requirements, and verification',
    budget: '$2,100 fixed scope',
    timing: 'Two-week target',
    visibility: 'Public demonstration opportunity',
    qualifications: [
      'HVAC diagnostics',
      'Performance measurement',
      'Evidence-governed records',
    ],
  },
];

const professionals: Professional[] = [
  {
    name: 'Demonstration Governance Architect',
    role: 'Consequential Route Builder',
    organization: 'Independent Marketplace Provider',
    domains: [
      'AI Governance',
      'Execution Routes',
      'Replay and Verification',
    ],
    credentialStatus: 'Self-declared — not independently verified',
    completedWork: 'Demonstration profile only',
  },
  {
    name: 'Demonstration Environmental Specialist',
    role: 'Governed Record Contributor',
    organization: 'Independent Marketplace Provider',
    domains: [
      'Indoor Air Quality',
      'Environmental Records',
      'Continuity Review',
    ],
    credentialStatus: 'Evidence submission preview',
    completedWork: 'Demonstration profile only',
  },
  {
    name: 'Demonstration Independent Reviewer',
    role: 'Route and Record Reviewer',
    organization: 'Independent Marketplace Provider',
    domains: [
      'Challenge Review',
      'Evidence Boundaries',
      'Verification Scope',
    ],
    credentialStatus: 'Review process not yet connected',
    completedWork: 'Demonstration profile only',
  },
];

const trustControls = [
  {
    title: 'Identity',
    description:
      'Every material action is tied to a known account and displayed participant identity.',
  },
  {
    title: 'Attribution',
    description:
      '
