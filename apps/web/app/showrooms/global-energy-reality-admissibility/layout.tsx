import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Energy Reality & Admissibility Architecture · GERAA v1.0',
  description: 'Eight educational lessons examining physical energy evidence, forecasts, reconciliation, admissibility, authority, and standing. Independent synthetic demonstration.',
  alternates: { canonical: '/showrooms/global-energy-reality-admissibility' },
  openGraph: {
    title: 'Global Energy Reality & Admissibility Architecture · GERAA v1.0',
    description: 'Eight lessons on energy evidence and admissible consequence. Independent educational demonstration.',
    url: '/showrooms/global-energy-reality-admissibility',
    images: [{ url: '/ta14-social-preview.png', width: 1200, height: 630, alt: 'TA14 Authority Governance Institution' }],
  },
  twitter: { card: 'summary_large_image', images: ['/ta14-social-preview.png'] },
};

export default function GeraaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
