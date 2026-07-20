import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import './globals.css';

const GA_MEASUREMENT_ID = 'G-QENCGQJ41B';

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://ta14-exchange-platform-x2g7.vercel.app',
  ),
  title: {
    default: 'TA-14 AI Governance Exchange',
    template: '%s | TA-14 AI Governance Exchange',
  },
  description:
    'Build, test, correct, preserve, and independently verify consequential execution routes through TA-14 admissible execution records.',
  applicationName: 'TA-14 AI Governance Exchange',
  authors: [
    {
      name: 'Greggory Don Butler',
    },
  ],
  creator: 'Greggory Don Butler',
  publisher: 'TA-14 Authority Governance Institution',
  keywords: [
    'TA-14',
    'TA-14 AI Governance Exchange',
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
    siteName: 'TA-14 AI Governance Exchange',
    title: 'TA-14 AI Governance Exchange',
    description:
      'Constitutional execution for the physical and digital world. No admissible evidence. No admissible execution.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'TA-14 AI Governance Exchange',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TA-14 AI Governance Exchange',
    description:
      'Constitutional execution for the physical and digital world. No admissible evidence. No admissible execution.',
    images: ['/opengraph-image.png'],
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
        {children}

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag() {
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}
