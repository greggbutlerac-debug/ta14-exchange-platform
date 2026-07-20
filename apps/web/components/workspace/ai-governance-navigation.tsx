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

const partnerReviewNetworkHref =
  '/workspace/ai-governance/partner-review-network';

const workspaceNavigation: NavigationItem[] = [
  {
    href: '/workspace/ai-governance',
    label: 'Playground',
    glyph: '◈',
    matchPrefixes: ['/workspace/ai-governance'],
  },
  {
    href: '/workspace/demonstrations',
    label: 'Demonstrations',
    glyph: '◎',
    matchPrefixes: ['/workspace/demonstrations'],
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
    href: '/workspace/ai-governance/pricing',
    label: 'Pricing',
    glyph: '$',
    matchPrefixes: ['/workspace/ai-governance/pricing'],
  },
];

const mobileNavigation: NavigationItem[] = [
  workspaceNavigation[0],
  workspaceNavigation[2],
  workspaceNavigation[3],
  workspaceNavigation[4],
  workspaceNavigation[5],
];

function isItemActive(pathname: string, item: NavigationItem) {
  const prefixes = item.matchPrefixes ?? [item.href];

  if (item.href === '/workspace/routes') {
    return (
      pathname === '/workspace/routes' ||
      (pathname.startsWith('/workspace/routes/') &&
        !pathname.startsWith('/workspace/routes/new'))
    );
  }

  if (item.href === '/workspace/ai-governance') {
    return pathname === '/workspace/ai-governance';
  }

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
