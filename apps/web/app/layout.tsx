import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

import { SiteActivityCounter } from '../components/site-activity-counter';

import './globals.css';

const GA_MEASUREMENT_ID = 'G-QENCGQJ41B';

export const metadata: Metadata = {
  metadataBase: new URL('https://ta14exchange.com'),
  title: {
    default: 'TA-14 Authority Governance Institution',
    template: '%s | TA-14 Authority Governance Institution',
  },
  description:
    'Govern AI systems, evidence, obligations, decisions, change, and consequence through TA-14 admissible execution records and governed operating worlds.',
  applicationName: 'TA-14 Authority Governance Institution',
  authors: [
    {
      name: 'Greggory Don Butler',
    },
  ],
  creator: 'Greggory Don Butler',
  publisher: 'TA-14 Authority Governance Institution',
  keywords: [
    'TA-14',
    'Admissible Execution',
    'AI Governance',
    'EU AI Act compliance',
    'EU AI Act governance',
    'AI compliance evidence',
    'AI system governance',
    'Execution Governance',
    'Evidence Integrity',
    'Admissible Execution Record',
    'AER',
    'Runtime Governance',
    'Authority Governance',
    'Consequential Execution',
    'TA14-RID',
    'Global Admissible Execution Exchange',
  ],
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'TA-14 Authority Governance Institution',
    title: 'TA-14 Authority Governance Institution',
    description:
      'Every consequence has a route. TA-14 proves whether it should exist.',
    images: [
      {
        url: '/ta14-social-preview.png',
        width: 1200,
        height: 630,
        alt: 'TA-14 Authority Governance Institution',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TA-14 Authority Governance Institution',
    description:
      'Every consequence has a route. TA-14 proves whether it should exist.',
    images: ['/ta14-social-preview.png'],
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
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#03060b',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#03060b',
    },
  ],
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: true
            });
          `}
        </Script>

        {children}

        <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))]">
          <SiteActivityCounter />
        </div>

        <Analytics />
      </body>
    </html>
  );
}
