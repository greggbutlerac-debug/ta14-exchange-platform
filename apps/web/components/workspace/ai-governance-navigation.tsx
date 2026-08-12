'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavigationItem = {
  href: string;
  label: string;
  glyph: string;
  matchPrefixes?: string[];
  partner?: boolean;
  institutional?: boolean;
};

const missionControlHref = '/workspace/mission-control';
const aiGovernanceHomeHref = '/workspace/ai-governance';
const playgroundHref = '/workspace/ai-governance/playground';
const demonstrationsHref = '/workspace/ai-governance/demonstrations';
const foundingDemonstrationsHref = '/artifacts/founding-demonstrations';
const interoperabilityExaminationsHref = '/artifacts/interoperability-examinations';
const andeksExaminationHref = '/artifacts/ta14-andeks-ie-2026-001';
const andeksResponseHref = '/artifacts/ta14-andeks-ie-2026-001/independent-response';
const reviewsResponsesHref = '/workspace/ai-governance/reviews';
const artifactsHref = '/artifacts';
const euAiActHref = '/workspace/ai-governance/eu-ai-act';
const governanceLibraryHref = '/workspace/ai-governance/library';
const registryHref = '/workspace/ai-governance/registry';
const registryInboxHref = '/workspace/ai-governance/registry/inbox';
const partnerReviewNetworkHref = '/workspace/ai-governance/partner-review-network';
const pricingHref = '/workspace/ai-governance/pricing';

const workspaceNavigation: NavigationItem[] = [
  { href: missionControlHref, label: 'Mission Control', glyph: 'MC', matchPrefixes: [missionControlHref], institutional: true },
  { href: aiGovernanceHomeHref, label: 'AI Governance Home', glyph: '⌂', matchPrefixes: [aiGovernanceHomeHref] },
  { href: playgroundHref, label: 'Playground', glyph: '◈', matchPrefixes: [playgroundHref] },
  { href: demonstrationsHref, label: 'Demonstrations', glyph: '◎', matchPrefixes: [demonstrationsHref] },
  { href: foundingDemonstrationsHref, label: 'Founding Demonstrations', glyph: 'FD', matchPrefixes: [foundingDemonstrationsHref], institutional: true },
  { href: interoperabilityExaminationsHref, label: 'Interoperability Examinations', glyph: 'IE', matchPrefixes: [interoperabilityExaminationsHref, andeksExaminationHref], institutional: true },
  { href: reviewsResponsesHref, label: 'Reviews & Responses', glyph: 'RR', matchPrefixes: [reviewsResponsesHref] },
  { href: artifactsHref, label: 'Artifact Registry', glyph: 'AR', matchPrefixes: [artifactsHref], institutional: true },
  { href: euAiActHref, label: 'EU AI Act', glyph: 'EU', matchPrefixes: [euAiActHref] },
  { href: governanceLibraryHref, label: 'Governance Library', glyph: 'L', matchPrefixes: [governanceLibraryHref] },
  { href: registryHref, label: 'Registry', glyph: 'RG', matchPrefixes: [registryHref] },
  { href: registryInboxHref, label: 'Registry Inbox', glyph: 'IN', matchPrefixes: [registryInboxHref], institutional: true },
  { href: '/workspace/routes/new', label: 'Build a Route', glyph: '◇', matchPrefixes: ['/workspace/routes/new'] },
  { href: '/workspace/routes', label: 'My AI Routes', glyph: 'R', matchPrefixes: ['/workspace/routes'] },
  { href: partnerReviewNetworkHref, label: 'Partner Review Network', glyph: 'P', matchPrefixes: [partnerReviewNetworkHref], partner: true },
  { href: pricingHref, label: 'Pricing', glyph: '$', matchPrefixes: [pricingHref] },
];

const mobileLabels = new Set([
  'Mission Control',
  'AI Governance Home',
  'Playground',
  'Founding Demonstrations',
  'Interoperability Examinations',
  'Reviews & Responses',
  'Artifact Registry',
  'Registry Inbox',
]);

const mobileNavigation = workspaceNavigation.filter((item) => mobileLabels.has(item.label));

function isItemActive(pathname: string, item: NavigationItem) {
  if (item.href === '/workspace/routes') {
    return pathname === '/workspace/routes' || (pathname.startsWith('/workspace/routes/') && !pathname.startsWith('/workspace/routes/new'));
  }
  if (item.href === aiGovernanceHomeHref) return pathname === aiGovernanceHomeHref;
  if (item.href === registryHref) {
    return pathname === registryHref || (pathname.startsWith(`${registryHref}/`) && !pathname.startsWith(registryInboxHref));
  }
  const prefixes = item.matchPrefixes ?? [item.href];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AiGovernanceNavigation() {
  const pathname = usePathname();
  return (
    <>
      <aside className="ta14-sidebar" aria-label="TA-14 institutional and AI Governance workspace navigation">
        <section>
          <span className="ta14-nav-label">Institution</span>
          <nav className="ta14-nav-list">
            {workspaceNavigation.map((item) => {
              const active = isItemActive(pathname, item);
              return (
                <Link
                  aria-current={active ? 'page' : undefined}
                  className={`ta14-nav-item${active ? ' active' : ''}${item.partner ? ' partner' : ''}${item.institutional ? ' institutional' : ''}`}
                  href={item.href}
                  key={item.href}
                >
                  <span className="ta14-nav-glyph" aria-hidden="true">{item.glyph}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        <article className="ta14-sidebar-note">
          <small>Latest Controlled Examination State</small>
          <strong>TA-14 / ANDEKS™ IE-2026-001 is documentarily complete.</strong>
          <p>
            TA-14&apos;s finding remains independently issued. ANDEKS™ has independently preserved its response and identified no material factual inaccuracies in TA-14&apos;s representation. Pilot authorization has not been issued; the next-gate decision remains reserved.
          </p>
          <Link href={andeksExaminationHref}>Open completed examination →</Link>
          <br />
          <Link href={andeksResponseHref}>Open ANDEKS™ independent response →</Link>
        </article>

        <article className="ta14-sidebar-note">
          <small>TA-14 Governed Examination Pathways</small>
          <strong>Demonstrate a claim. Examine an interface.</strong>
          <p>
            Founding Demonstrations preserve bounded claims and findings. Interoperability Examinations preserve bounded relationships between independent architectures without collapsing their authority or identity.
          </p>
          <Link href={foundingDemonstrationsHref}>Open Founding Demonstrations →</Link>
          <br />
          <Link href={interoperabilityExaminationsHref}>Open Interoperability Examinations →</Link>
        </article>

        <article className="ta14-sidebar-note">
          <small>TA-14 Institutional Mission Control</small>
          <strong>Identity. Action. Records. Continuity.</strong>
          <p>
            See active work, required actions, registered entities, reviews, artifacts, credentials, commercial scopes, and institutional history in one operating view.
          </p>
          <Link href={missionControlHref}>Open Mission Control →</Link>
        </article>

        <article className="ta14-sidebar-note">
          <small>TA-14 Reviews & Responses</small>
          <strong>Independent voices. Preserved chronology.</strong>
          <p>
            Inspect participant reviews, independent reviews, evidence challenges, factual corrections, technical comments, external publications, and governed responses attached to the institutional record.
          </p>
          <Link href={reviewsResponsesHref}>Open Reviews & Responses →</Link>
        </article>

        <article className="ta14-sidebar-note">
          <small>TA-14 Partner Review Network</small>
          <strong>Independent architectures. Written boundaries.</strong>
          <p>Explore the current partner-review pathways and learn what each governance architecture contributes.</p>
          <Link href={partnerReviewNetworkHref}>Explore the network →</Link>
        </article>
      </aside>

      <nav className="ta14-mobile-nav" aria-label="Mobile institutional and AI Governance navigation">
        {mobileNavigation.map((item) => {
          const active = isItemActive(pathname, item);
          return (
            <Link
              aria-current={active ? 'page' : undefined}
              className={`ta14-mobile-link${active ? ' active' : ''}${item.partner ? ' partner' : ''}${item.institutional ? ' institutional' : ''}`}
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
