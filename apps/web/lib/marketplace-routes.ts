export const marketplaceRoutes = {
  home: '/marketplace',
  postNeed: '/marketplace/post-a-need',
  opportunities: '/marketplace/opportunities',
  professionals: '/marketplace/professionals',
  organizations: '/marketplace/organizations',
  records: '/marketplace/records',
  reviews: '/marketplace/reviews',
} as const;

export type MarketplaceRouteKey = keyof typeof marketplaceRoutes;

export const marketplaceNavigation = [
  {
    key: 'home',
    label: 'Marketplace Home',
    href: marketplaceRoutes.home,
    description:
      'Open the TA-14 AI Governance Exchange Marketplace directory.',
  },
  {
    key: 'opportunities',
    label: 'Opportunities',
    href: marketplaceRoutes.opportunities,
    description:
      'Browse declared governance work, collaboration needs, and open scopes.',
  },
  {
    key: 'professionals',
    label: 'Professionals',
    href: marketplaceRoutes.professionals,
    description:
      'Browse independent professionals with declared capabilities and boundaries.',
  },
  {
    key: 'organizations',
    label: 'Organizations',
    href: marketplaceRoutes.organizations,
    description:
      'Browse organizations participating in governed work and collaboration.',
  },
  {
    key: 'records',
    label: 'Records',
    href: marketplaceRoutes.records,
    description:
      'Browse preserved Marketplace records and declared proof boundaries.',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    href: marketplaceRoutes.reviews,
    description:
      'Browse bounded independent reviews and their declared findings.',
  },
] as const satisfies ReadonlyArray<{
  key: MarketplaceRouteKey;
  label: string;
  href: string;
  description: string;
}>;

export const marketplaceActions = {
  postNeed: {
    label: 'Post a Governance Need',
    shortLabel: 'Post a Need',
    href: marketplaceRoutes.postNeed,
    description:
      'Declare the problem, consequential action, evidence, deliverable, timing, budget, and known boundaries.',
  },
} as const;

export type MarketplaceEntityType =
  | 'opportunity'
  | 'professional'
  | 'organization'
  | 'record'
  | 'review';

const marketplaceEntityCollections = {
  opportunity: marketplaceRoutes.opportunities,
  professional: marketplaceRoutes.professionals,
  organization: marketplaceRoutes.organizations,
  record: marketplaceRoutes.records,
  review: marketplaceRoutes.reviews,
} as const satisfies Record<MarketplaceEntityType, string>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidMarketplaceSlug(value: string): boolean {
  return slugPattern.test(value);
}

export function normalizeMarketplaceSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function assertMarketplaceSlug(
  value: string,
  context = 'Marketplace route',
): string {
  if (!isValidMarketplaceSlug(value)) {
    throw new Error(
      `${context} received an invalid slug: "${value}". Expected lowercase letters, numbers, and single hyphens only.`,
    );
  }

  return value;
}

export function buildMarketplaceEntityRoute(
  type: MarketplaceEntityType,
  slug: string,
): string {
  const validSlug = assertMarketplaceSlug(
    slug,
    `${type} route builder`,
  );

  return `${marketplaceEntityCollections[type]}/${validSlug}`;
}

export function buildOpportunityRoute(slug: string): string {
  return buildMarketplaceEntityRoute('opportunity', slug);
}

export function buildProfessionalRoute(slug: string): string {
  return buildMarketplaceEntityRoute('professional', slug);
}

export function buildOrganizationRoute(slug: string): string {
  return buildMarketplaceEntityRoute('organization', slug);
}

export function buildRecordRoute(slug: string): string {
  return buildMarketplaceEntityRoute('record', slug);
}

export function buildReviewRoute(slug: string): string {
  return buildMarketplaceEntityRoute('review', slug);
}

export function isMarketplaceRoute(value: string): boolean {
  return (
    value === marketplaceRoutes.home ||
    value.startsWith(`${marketplaceRoutes.home}/`)
  );
}

export function getMarketplaceCollectionRoute(
  type: MarketplaceEntityType,
): string {
  return marketplaceEntityCollections[type];
}

export const marketplaceRouteManifest = [
  {
    id: 'marketplace-home',
    pathname: marketplaceRoutes.home,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-post-need',
    pathname: marketplaceRoutes.postNeed,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-opportunities',
    pathname: marketplaceRoutes.opportunities,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-opportunity-detail',
    pathname: `${marketplaceRoutes.opportunities}/[slug]`,
    kind: 'dynamic',
    status: 'implemented',
  },
  {
    id: 'marketplace-professionals',
    pathname: marketplaceRoutes.professionals,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-professional-detail',
    pathname: `${marketplaceRoutes.professionals}/[slug]`,
    kind: 'dynamic',
    status: 'implemented',
  },
  {
    id: 'marketplace-organizations',
    pathname: marketplaceRoutes.organizations,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-organization-detail',
    pathname: `${marketplaceRoutes.organizations}/[slug]`,
    kind: 'dynamic',
    status: 'implemented',
  },
  {
    id: 'marketplace-records',
    pathname: marketplaceRoutes.records,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-record-detail',
    pathname: `${marketplaceRoutes.records}/[slug]`,
    kind: 'dynamic',
    status: 'implemented',
  },
  {
    id: 'marketplace-reviews',
    pathname: marketplaceRoutes.reviews,
    kind: 'static',
    status: 'implemented',
  },
  {
    id: 'marketplace-review-detail',
    pathname: `${marketplaceRoutes.reviews}/[slug]`,
    kind: 'dynamic',
    status: 'implemented',
  },
] as const satisfies ReadonlyArray<{
  id: string;
  pathname: string;
  kind: 'static' | 'dynamic';
  status: 'implemented';
}>;

export type MarketplaceRouteManifestEntry =
  (typeof marketplaceRouteManifest)[number];
