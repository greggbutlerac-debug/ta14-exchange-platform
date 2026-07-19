import type { Metadata, Viewport } from 'next';

import ShareExchangeButton from '../components/share-exchange-button';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://ta14-exchange-platform-x2g7.vercel.app',
  ),
  title: {
    default: 'TA-14 Exchange Platform',
    template: '%s | TA-14 Exchange Platform',
  },
  description:
    'Build, test, correct, preserve, and verify consequential execution routes through TA-14 admissible execution records.',
  applicationName: 'TA-14 Exchange Platform',
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'TA-14 Exchange Platform',
    title: 'TA-14 Exchange Platform',
    description:
      'Every consequence has a route. TA-14 proves whether it should exist.',
    images: [
      {
        url: '/ta14-social-preview.png',
        width: 1200,
        height: 630,
        alt: 'TA-14 Global Admissible Execution Exchange',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TA-14 Exchange Platform',
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
        <div
          style={{
            position: 'fixed',
            top: '18px',
            right: '18px',
            zIndex: 1000,
          }}
        >
          <ShareExchangeButton />
        </div>

        {children}
      </body>
    </html>
  );
}
