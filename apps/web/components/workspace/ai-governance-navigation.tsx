'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavigationItem = {
  href: string;
  label: string;
  glyph: string;
  matchPrefixes?: string[];
  partner?: boolean;
};

const aiGovernanceHomeHref = '/workspace/ai-governance';
const playgroundHref = '/workspace/ai-governance/playground';
const demonstrationsHref = '/workspace/ai-governance/demonstrations';
const euAiActHref = '/workspace/ai-governance/eu-ai-act';
const governanceLibraryHref = '/workspace/ai-governance/library';
const registryHref = '/workspace/ai-governance/registry';
const partnerReviewNetworkHref =
  '/workspace/ai-governance/partner-review-network';
const pricingHref = '/workspace/ai-governance/pricing';

const workspaceNavigation: NavigationItem[] = [
  {
    href: aiGovernanceHomeHref,
    label: 'Workspace Home',
    glyph: '⌂',
    matchPrefixes: [aiGovernanceHomeHref],
  },
  {
    href: playgroundHref,
    label: 'Playground',
    glyph: '◈',
    matchPrefixes: [playgroundHref],
  },
  {
    href: demonstrationsHref,
    label: 'Demonstrations',
    glyph: '◎',
    matchPrefixes: [demonstrationsHref],
  },
  {
    href: euAiActHref,
    label: 'EU AI Act',
    glyph: 'EU',
    matchPrefixes: [euAiActHref],
  },
  {
    href: governanceLibraryHref,
    label: 'Governance Library',
    glyph: 'L',
    matchPrefixes: [governanceLibraryHref],
  },
  {
    href: registryHref,
    label: 'Registry',
    glyph: 'RG',
    matchPrefixes: [registryHref],
  },
  {
    href: '/workspace/routes/new',
    label: 'Build a Route',
    glyph: '◇',
    matchPrefixes: ['/workspace/routes/new'],
  },
  {
    href: '/workspace/routes',
    label: 'My AI Routes',
    glyph: 'R',
    matchPrefixes: ['/workspace/routes'],
  },
  {
    href: partnerReviewNetworkHref,
    label: 'Partner Review Network',
    glyph: 'P',
    matchPrefixes: [partnerReviewNetworkHref],
    partner: true,
  },
  {
    href: pricingHref,
    label: 'Pricing',
    glyph: '$',
    matchPrefixes: [pricingHref],
  },
];

const mobileNavigation: NavigationItem[] = [
  workspaceNavigation[0],
  workspaceNavigation[1],
  workspaceNavigation[6],
  workspaceNavigation[7],
  workspaceNavigation[8],
];

function isItemActive(pathname: string, item: NavigationItem) {
  if (item.href === '/workspace/routes') {
    return (
      pathname === '/workspace/routes' ||
      (pathname.startsWith('/workspace/routes/') &&
        !pathname.startsWith('/workspace/routes/new'))
    );
  }

  if (item.href === aiGovernanceHomeHref) {
    return pathname === aiGovernanceHomeHref;
  }

  const prefixes = item.matchPrefixes ?? [item.href];

  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function AiGovernanceNavigation() {
  const pathname = usePathname();

  return (
    <>
      <aside
        className="ta14-sidebar"
        aria-label="AI Governance workspace navigation"
      >
        <section>
          <span className="ta14-nav-label">AI Governance</span>

          <nav className="ta14-nav-list">
            {workspaceNavigation.map((item) => {
              const active = isItemActive(pathname, item);

              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={`ta14-nav-item${active ? ' active' : ''}${
                    item.partner ? ' partner' : ''
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <span className="ta14-nav-glyph" aria-hidden="true">
                    {item.glyph}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        <article className="ta14-sidebar-note">
          <small>TA-14 Partner Review Network</small>
          <strong>Independent architectures. Written boundaries.</strong>
          <p>
            Explore the current partner-review pathways and learn what each
            governance architecture contributes.
          </p>
          <Link href={partnerReviewNetworkHref}>Explore the network →</Link>
        </article>
      </aside>

      <nav
        className="ta14-mobile-nav"
        aria-label="Mobile AI Governance navigation"
      >
        {mobileNavigation.map((item) => {
          const active = isItemActive(pathname, item);

          return (
            <Link
              aria-current={active ? 'page' : undefined}
              className={`ta14-mobile-link${active ? ' active' : ''}${
                item.partner ? ' partner' : ''
              }`}
              href={item.href}
              key={item.href}
            >
              <b aria-hidden="true">{item.glyph}</b>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
