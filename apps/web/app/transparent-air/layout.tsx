import type { Metadata } from 'next';
import TransparentAirCallAnalytics from './TransparentAirCallAnalytics';
import TransparentAirLocalNav from './TransparentAirLocalNav';

export const metadata: Metadata = {
  title: {
    default: 'Transparent Air | AC Repair in Gulfport & South St. Petersburg',
    template: '%s',
  },
  description:
    'Transparent Air provides evidence-based AC repair evaluations, diagnostics, and second opinions across Gulfport, South St. Petersburg, Maximo and Pinellas Point, Seminole, and Pinellas Park, Florida.',
  applicationName: 'Transparent Air',
  authors: [{ name: 'Greggory Don Butler' }],
  creator: 'Greggory Don Butler',
  publisher: 'Transparent Air',
  keywords: [
    'Transparent Air',
    'AC repair Gulfport FL',
    'AC repair South St Petersburg FL',
    'AC repair Maximo St Petersburg FL',
    'AC repair Pinellas Point FL',
    'AC repair 33711',
    'AC repair Seminole FL',
    'AC repair Pinellas Park FL',
    'air conditioning repair Gulfport FL',
    'air conditioning repair South St Petersburg',
    'AC second opinion Pinellas County',
    'air conditioner second opinion',
    'AC diagnostics',
    'HVAC diagnostics',
    'AC not cooling',
    'Pinellas County AC repair',
    'Greggory Don Butler HVAC',
  ],
  category: 'home services',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Transparent Air',
    title: 'Transparent Air | Gulfport & South St. Petersburg AC Repair',
    description:
      'Evidence-based AC diagnostics, repair evaluations, and second opinions serving Gulfport, South St. Petersburg, Maximo / Pinellas Point, Seminole, and Pinellas Park.',
  },
  twitter: {
    card: 'summary',
    title: 'Transparent Air | Gulfport & South St. Petersburg AC Repair',
    description:
      'AC diagnostics, repair evaluations, and second opinions across Transparent Air’s South Pinellas service area.',
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
  return (
    <>
      <TransparentAirCallAnalytics />
      {children}
      <TransparentAirLocalNav />
    </>
  );
}
