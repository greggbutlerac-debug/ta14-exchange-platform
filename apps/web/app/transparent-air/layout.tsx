import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Transparent Air | AC Repair & Second Opinions',
    template: '%s | Transparent Air',
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

export default function TransparentAirLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
