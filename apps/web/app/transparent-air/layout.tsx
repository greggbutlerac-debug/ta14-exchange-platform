import type { Metadata } from 'next';
import TransparentAirCallAnalytics from './TransparentAirCallAnalytics';
import TransparentAirLocalNav from './TransparentAirLocalNav';
import TransparentAirAuthorityCTA from './TransparentAirAuthorityCTA';

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
    'AC maintenance Gulfport FL',
    'AC maintenance St Petersburg FL',
    'AC not working near me South St Petersburg',
    'heat pump heating check St Petersburg',
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
      <a href="tel:+13863377215" className="ta-mobile-call" aria-label="Call Transparent Air at 386-337-7215">Call Transparent Air · 386-337-7215</a>
      <style>{` .ta-mobile-call{display:none} @media(max-width:700px){.ta-mobile-call{display:flex;align-items:center;justify-content:center;position:fixed;bottom:12px;left:12px;right:12px;z-index:9999;min-height:54px;padding:12px 18px;background:#e7ad45;color:#082934;font-weight:900;text-decoration:none;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.3);font-size:15px} body{padding-bottom:70px}} `}</style>
      {children}
      <TransparentAirAuthorityCTA />
      <TransparentAirLocalNav />
    </>
  );
}
