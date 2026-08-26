import type { Metadata } from 'next';
import Link from 'next/link';
import TransparentAirCallAnalytics from './TransparentAirCallAnalytics';

export const metadata: Metadata = {
  title: {
    default: 'Transparent Air | AC Repair & Second Opinions',
    template: '%s',
  },
  description:
    'Transparent Air provides evidence-based air-conditioning diagnostics, AC repair evaluations, and second opinions for homeowners in selected Pinellas County, Florida communities.',
  applicationName: 'Transparent Air',
  authors: [{ name: 'Greggory Don Butler' }],
  creator: 'Greggory Don Butler',
  publisher: 'Transparent Air',
  keywords: [
    'Transparent Air',
    'AC repair',
    'air conditioning repair',
    'AC second opinion',
    'air conditioner second opinion',
    'AC diagnostics',
    'HVAC diagnostics',
    'AC not cooling',
    'AC repair Gulfport FL',
    'AC repair Seminole FL',
    'AC repair Pinellas Park FL',
    'AC repair South St Petersburg FL',
    'Pinellas County AC repair',
    'Greggory Don Butler HVAC',
  ],
  category: 'home services',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Transparent Air',
    title: 'Transparent Air | AC Repair & Second Opinions',
    description:
      'Evidence-based AC diagnostics, repair evaluations, and second opinions from Transparent Air.',
  },
  twitter: {
    card: 'summary',
    title: 'Transparent Air | AC Repair & Second Opinions',
    description:
      'Evidence-based AC diagnostics, repair evaluations, and second opinions for selected Pinellas County communities.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const localPages = [
  { href: '/transparent-air/gulfport-ac-repair', label: 'Gulfport AC Repair' },
  { href: '/transparent-air/seminole-ac-repair', label: 'Seminole AC Repair' },
  { href: '/transparent-air/pinellas-park-ac-repair', label: 'Pinellas Park AC Repair' },
  { href: '/transparent-air/south-st-petersburg-ac-repair', label: 'South St. Petersburg AC Repair' },
  { href: '/transparent-air/second-opinion', label: 'Pinellas County AC Second Opinions' },
];

export default function TransparentAirLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <TransparentAirCallAnalytics />
      {children}
      <nav aria-label="Transparent Air local service areas" style={{ background: '#062531', color: '#dcebed', padding: '30px 4vw 38px', borderTop: '1px solid #174653' }}>
        <div style={{ width: 'min(1160px, 92vw)', margin: '0 auto' }}>
          <div style={{ fontSize: '.76rem', fontWeight: 900, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7ee0df', marginBottom: 12 }}>
            Transparent Air local service areas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px' }}>
            {localPages.map((page) => (
              <Link key={page.href} href={page.href} style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 4 }}>
                {page.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
