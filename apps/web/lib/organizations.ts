import { randomUUID } from 'node:crypto';

export const ORGANIZATION_ROLES = [
  'OWNER',
  'ADMIN',
  'ARCHITECT',
  'REVIEWER',
  'MEMBER',
] as const;

export type OrganizationRole =
  (typeof ORGANIZATION_ROLES)[number];

export const SUBSCRIPTION_PLANS = [
  'FREE',
  'PRO',
  'ORGANIZATION',
  'ENTERPRISE',
] as const;

export type SubscriptionPlan =
  (typeof SUBSCRIPTION_PLANS)[number];

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIALING'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'INCOMPLETE';

export type OrganizationVisibility =
  | 'PRIVATE'
  | 'UNLISTED'
  | 'PUBLIC';

export type Organization = {
  organizationId: string;
  name: string;
  slug: string;
  visibility: OrganizationVisibility;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMembership = {
  membershipId: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  invitedBy?: string;
  invitedAt?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationInvitation = {
  invitationId: string;
  organizationId: string;
  email: string;
  role: Exclude<OrganizationRole, 'OWNER'>;
  tokenHash: string;
  invitedBy: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PlanEntitlements = {
  plan: SubscriptionPlan;
  monthlyPriceUsd: number | null;
  maximumMembers: number | null;
  maximumActiveDrafts: number | null;
  includedPreservedRunsPerMonth: number;
  additionalPreservedRunPriceUsd: number;
  privateRoutes: boolean;
  privateGovernedRecords: boolean;
  organizationWorkspace: boolean;
  teamCollaboration: boolean;
  roleBasedAccess: boolean;
  versionHistory: boolean;
  routeComparison: boolean;
  privateReplayHistory: boolean;
  exportImport: boolean;
  customBranding: boolean;
  professionalTemplates: boolean;
  advancedEvidenceChecklists: boolean;
  continuityWarnings: boolean;
  authorityReviewPrompts: boolean;
  publicPrivateSharingControls: boolean;
  shareableVerificationLinks: boolean;
  publishedProBadge: boolean;
  monthlyGovernanceReport: boolean;
  governanceCaseWorkspace: boolean;
  apiAccess: boolean;
  singleSignOn: boolean;
  privateDeployment: boolean;
  prioritySupport: boolean;
};

export const PLAN_ENTITLEMENTS: Record<
  SubscriptionPlan,
  PlanEntitlements
> = {
  FREE: {
    plan: 'FREE',
    monthlyPriceUsd: 0,
    maximumMembers: 1,
    maximumActiveDrafts: 5,
    includedPreservedRunsPerMonth: 0,
    additionalPreservedRunPriceUsd: 9,
    privateRoutes: false,
    privateGovernedRecords: false,
    organizationWorkspace: false,
    teamCollaboration: false,
    roleBasedAccess: false,
    versionHistory: false,
    routeComparison: false,
    privateReplayHistory: false,
    exportImport: true,
    customBranding: false,
    professionalTemplates: false,
    advancedEvidenceChecklists: false,
    continuityWarnings: true,
    authorityReviewPrompts: true,
    publicPrivateSharingControls: false,
    shareableVerificationLinks: true,
    publishedProBadge: false,
    monthlyGovernanceReport: false,
    governanceCaseWorkspace: false,
    apiAccess: false,
    singleSignOn: false,
    privateDeployment: false,
    prioritySupport: false,
  },

  PRO: {
    plan: 'PRO',
    monthlyPriceUsd: 99,
    maximumMembers: 5,
    maximumActiveDrafts: null,
    includedPreservedRunsPerMonth: 5,
    additionalPreservedRunPriceUsd: 5,
    privateRoutes: true,
    privateGovernedRecords: true,
    organizationWorkspace: true,
    teamCollaboration: true,
    roleBasedAccess: true,
    versionHistory: true,
    routeComparison: true,
    privateReplayHistory: true,
    exportImport: true,
    customBranding: true,
    professionalTemplates: true,
    advancedEvidenceChecklists: true,
    continuityWarnings: true,
    authorityReviewPrompts: true,
    publicPrivateSharingControls: true,
    shareableVerificationLinks: true,
    publishedProBadge: true,
    monthlyGovernanceReport: true,
    governanceCaseWorkspace: true,
    apiAccess: false,
    singleSignOn: false,
    privateDeployment: false,
    prioritySupport: true,
  },

  ORGANIZATION: {
    plan: 'ORGANIZATION',
    monthlyPriceUsd: 299,
    maximumMembers: 25,
    maximumActiveDrafts: null,
    includedPreservedRunsPerMonth: 20,
    additionalPreservedRunPriceUsd: 4,
    privateRoutes: true,
    privateGovernedRecords: true,
    organizationWorkspace: true,
    teamCollaboration: true,
    roleBasedAccess: true,
    versionHistory: true,
    routeComparison: true,
    privateReplayHistory: true,
    exportImport: true,
    customBranding: true,
    professionalTemplates: true,
    advancedEvidenceChecklists: true,
    continuityWarnings: true,
    authorityReviewPrompts: true,
    publicPrivateSharingControls: true,
    shareableVerificationLinks: true,
    publishedProBadge: true,
    monthlyGovernanceReport: true,
    governanceCaseWorkspace: true,
    apiAccess: true,
    singleSignOn: false,
    privateDeployment: false,
    prioritySupport: true,
  },

  ENTERPRISE: {
    plan: 'ENTERPRISE',
    monthlyPriceUsd: null,
    maximumMembers: null,
    maximumActiveDrafts: null,
    includedPreservedRunsPerMonth: 100,
    additionalPreservedRunPriceUsd: 0,
    privateRoutes: true,
    privateGovernedRecords: true,
    organizationWorkspace: true,
    teamCollaboration: true,
    roleBasedAccess: true,
    versionHistory: true,
    routeComparison: true,
    privateReplayHistory: true,
    exportImport: true,
    customBranding: true,
    professionalTemplates: true,
    advancedEvidenceChecklists: true,
    continuityWarnings: true,
    authorityReviewPrompts: true,
    publicPrivateSharingControls: true,
    shareableVerificationLinks: true,
    publishedProBadge: true,
    monthlyGovernanceReport: true,
    governanceCaseWorkspace: true,
    apiAccess: true,
    singleSignOn: true,
    privateDeployment: true,
    prioritySupport: true,
  },
};

export const ORGANIZATION_PERMISSIONS = [
  'organization:read',
  'organization:update',
  'organization:delete',
  'organization:manage_billing',
  'membership:read',
  'membership:invite',
  'membership:update',
  'membership:remove',
  'route:create',
  'route:read',
  'route:update',
  'route:delete',
  'route:publish',
  'route:submit_for_review',
  'record:create',
  'record:read',
  'record:update',
  'record:delete',
  'record:verify',
  'record:replay',
  'record:export',
] as const;

export type OrganizationPermission =
  (typeof ORGANIZATION_PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<
  OrganizationRole,
  readonly OrganizationPermission[]
> = {
  OWNER: ORGANIZATION_PERMISSIONS,

  ADMIN: [
    'organization:read',
    'organization:update',
    'membership:read',
    'membership:invite',
    'membership:update',
    'membership:remove',
    'route:create',
    'route:read',
    'route:update',
    'route:delete',
    'route:publish',
    'route:submit_for_review',
    'record:create',
    'record:read',
    'record:update',
    'record:delete',
    'record:verify',
    'record:replay',
    'record:export',
  ],

  ARCHITECT: [
    'organization:read',
    'membership:read',
    'route:create',
    'route:read',
    'route:update',
    'route:delete',
    'route:publish',
    'route:submit_for_review',
    'record:create',
    'record:read',
    'record:update',
    'record:verify',
    'record:replay',
    'record:export',
  ],

  REVIEWER: [
    'organization:read',
    'membership:read',
    'route:read',
    'route:submit_for_review',
    'record:read',
    'record:verify',
    'record:replay',
    'record:export',
  ],

  MEMBER: [
    'organization:read',
    'membership:read',
    'route:create',
    'route:read',
    'route:update',
    'record:create',
    'record:read',
    'record:update',
    'record:replay',
    'record:export',
  ],
};

export function getPlanEntitlements(
  plan: SubscriptionPlan,
): PlanEntitlements {
  return PLAN_ENTITLEMENTS[plan];
}

export function hasPlanEntitlement(
  plan: SubscriptionPlan,
  entitlement: keyof Omit<
    PlanEntitlements,
    | 'plan'
    | 'monthlyPriceUsd'
    | 'maximumMembers'
    | 'maximumActiveDrafts'
    | 'includedPreservedRunsPerMonth'
    | 'additionalPreservedRunPriceUsd'
  >,
): boolean {
  return PLAN_ENTITLEMENTS[plan][entitlement];
}

export function hasOrganizationPermission(
  role: OrganizationRole,
  permission: OrganizationPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAddOrganizationMember(
  plan: SubscriptionPlan,
  activeMemberCount: number,
): boolean {
  const maximumMembers =
    PLAN_ENTITLEMENTS[plan].maximumMembers;

  if (maximumMembers === null) {
    return true;
  }

  return activeMemberCount < maximumMembers;
}

export function canCreateDraft(
  plan: SubscriptionPlan,
  activeDraftCount: number,
): boolean {
  const maximumActiveDrafts =
    PLAN_ENTITLEMENTS[plan].maximumActiveDrafts;

  if (maximumActiveDrafts === null) {
    return true;
  }

  return activeDraftCount < maximumActiveDrafts;
}

export function createOrganization(input: {
  name: string;
  slug?: string;
  createdBy: string;
  plan?: SubscriptionPlan;
  visibility?: OrganizationVisibility;
  createdAt?: string;
}): Organization {
  const now = input.createdAt ?? new Date().toISOString();
  const name = input.name.trim();

  if (!name) {
    throw new Error('Organization name is required.');
  }

  const createdBy = input.createdBy.trim();

  if (!createdBy) {
    throw new Error('Organization creator is required.');
  }

  const slug = normalizeOrganizationSlug(
    input.slug?.trim() || name,
  );

  return {
    organizationId: `org_${randomUUID()}`,
    name,
    slug,
    visibility: input.visibility ?? 'PRIVATE',
    plan: input.plan ?? 'FREE',
    subscriptionStatus: 'ACTIVE',
    createdBy,
    createdAt: now,
    updatedAt: now,
  };
}

export function createOwnerMembership(input: {
  organizationId: string;
  userId: string;
  createdAt?: string;
}): OrganizationMembership {
  const now = input.createdAt ?? new Date().toISOString();

  if (!input.organizationId.trim()) {
    throw new Error('Organization ID is required.');
  }

  if (!input.userId.trim()) {
    throw new Error('User ID is required.');
  }

  return {
    membershipId: `membership_${randomUUID()}`,
    organizationId: input.organizationId,
    userId: input.userId,
    role: 'OWNER',
    status: 'ACTIVE',
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeOrganizationSlug(
  value: string,
): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

  if (!slug) {
    throw new Error('Organization slug is invalid.');
  }

  return slug;
}

export function isOrganizationRole(
  value: string,
): value is OrganizationRole {
  return ORGANIZATION_ROLES.includes(
    value as OrganizationRole,
  );
}

export function isSubscriptionPlan(
  value: string,
): value is SubscriptionPlan {
  return SUBSCRIPTION_PLANS.includes(
    value as SubscriptionPlan,
  );
}
