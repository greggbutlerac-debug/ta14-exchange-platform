import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Script from 'next/script';

import {
  marketplaceActions,
  marketplaceRoutes,
} from '../lib/marketplace-routes';

import './globals.css';

const GA_MEASUREMENT_ID = 'G-QENCGQJ41B';

const primaryNavigation = [
  {
    label: 'Exchange',
    href: '/',
  },
  {
    label: 'Workspace',
    href: '/workspace',
  },
  {
    label: 'EU AI Act',
    href: '/eu-ai-act',
  },
  {
    label: 'Marketplace',
    href: marketplaceRoutes.home,
  },
  {
    label: 'Records',
    href: '/records',
  },
  {
    label: 'Verification',
    href: '/workspace/verify',
  },
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(
    'https://ta14-exchange-platform-x2g7.vercel.app',
  ),
  title: {
    default: 'TA-14 AI Governance Exchange',
    template: '%s | TA-14 AI Governance Exchange',
  },
  description:
    'Build, test, correct, preserve, and independently verify AI governance routes, governed records, and European Union Artificial Intelligence Act obligations through the TA-14 AI Governance Exchange.',
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
    'European Union Artificial Intelligence Act',
    'EU AI Act',
    'Regulation (EU) 2024/1689',
    'EU AI Act Requirements',
    'Article 50 Transparency',
    'High-Risk AI Systems',
    'Fundamental Rights Impact Assessment',
    'GPAI',
    'General-Purpose AI',
    'AI Compliance',
    'AI Governance Laboratory',
    'AI Governance Playground',
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
      'Build, test, and verify AI governance. Explore the European Union AI Act through interactive governance routes, governed records, and admissible execution.',
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
      'Build, test, and verify AI governance. Explore the European Union AI Act through interactive governance routes, governed records, and admissible execution.',
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
        <header className="siteHeader">
          <div className="siteHeaderInner">
            <Link
              className="siteBrand"
              href="/"
              aria-label="TA-14 AI Governance Exchange home"
            >
              <span className="siteBrandMark">TA-14</span>

              <span className="siteBrandText">
                <strong>AI Governance Exchange</strong>
                <small>
                  No admissible evidence. No admissible execution.
                </small>
              </span>
            </Link>

            <nav
              className="siteNavigation"
              aria-label="Primary navigation"
            >
              {primaryNavigation.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              aria-label={marketplaceActions.postNeed.description}
              className="siteHeaderAction"
              href={marketplaceActions.postNeed.href}
            >
              {marketplaceActions.postNeed.shortLabel}
            </Link>
          </div>
        </header>

        <div className="siteContent">{children}</div>

        <Script
          id="ta14-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id':
                  'https://ta14-exchange-platform-x2g7.vercel.app/#organization',
                name: 'TA-14 Authority Governance Institution',
                url: 'https://ta14-exchange-platform-x2g7.vercel.app',
                founder: {
                  '@type': 'Person',
                  name: 'Greggory Don Butler',
                },
              },
              {
                '@type': 'WebSite',
                '@id':
                  'https://ta14-exchange-platform-x2g7.vercel.app/#website',
                url: 'https://ta14-exchange-platform-x2g7.vercel.app',
                name: 'TA-14 AI Governance Exchange',
                description:
                  'An interactive AI governance exchange for governed routes, governed records, verification, and European Union Artificial Intelligence Act requirements.',
                publisher: {
                  '@id':
                    'https://ta14-exchange-platform-x2g7.vercel.app/#organization',
                },
                inLanguage: 'en-US',
              },
              {
                '@type': 'SoftwareApplication',
                '@id':
                  'https://ta14-exchange-platform-x2g7.vercel.app/#application',
                name: 'TA-14 AI Governance Exchange',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                url: 'https://ta14-exchange-platform-x2g7.vercel.app',
                description:
                  'A web-based AI governance laboratory for building, testing, correcting, preserving, and independently verifying consequential governance routes.',
                creator: {
                  '@id':
                    'https://ta14-exchange-platform-x2g7.vercel.app/#organization',
                },
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                  category: 'Free AI governance workspace access',
                },
                featureList: [
                  'AI governance route construction',
                  'Governed record creation',
                  'Admissible execution testing',
                  'Independent verification',
                  'EU AI Act requirements exploration',
                  'Article 50 transparency workspace',
                  'High-risk AI lifecycle governance',
                  'Fundamental rights impact assessment support',
                ],
              },
              {
                '@type': 'LearningResource',
                '@id':
                  'https://ta14-exchange-platform-x2g7.vercel.app/eu-ai-act#learning-resource',
                name: 'TA-14 EU AI Act Governance Laboratory',
                url:
                  'https://ta14-exchange-platform-x2g7.vercel.app/eu-ai-act',
                description:
                  'A source-linked interactive learning and governance environment for exploring Regulation (EU) 2024/1689, applicable roles, obligations, evidence expectations, and governed implementation routes.',
                learningResourceType: [
                  'Interactive governance laboratory',
                  'Requirements registry',
                  'AI governance playground',
                ],
                educationalUse: [
                  'Instruction',
                  'Governance modeling',
                  'Requirements mapping',
                  'Scenario testing',
                ],
                teaches: [
                  'European Union Artificial Intelligence Act',
                  'Regulation (EU) 2024/1689',
                  'Article 50 transparency',
                  'High-risk AI systems',
                  'Fundamental rights impact assessment',
                  'General-purpose AI governance',
                ],
                isPartOf: {
                  '@id':
                    'https://ta14-exchange-platform-x2g7.vercel.app/#website',
                },
                inLanguage: 'en-US',
              },
            ],
          })}
        </Script>

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

        <style>{`
          .siteHeader {
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(118, 213, 220, 0.14);
            background:
              linear-gradient(
                180deg,
                rgba(3, 10, 16, 0.96),
                rgba(3, 10, 16, 0.86)
              );
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
          }

          .siteHeaderInner {
            width: min(1240px, calc(100% - 32px));
            min-height: 76px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 28px;
            align-items: center;
          }

          .siteBrand {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            color: #f3fbfc;
            text-decoration: none;
          }

          .siteBrandMark {
            display: inline-grid;
            place-items: center;
            min-width: 58px;
            height: 38px;
            padding: 0 10px;
            border: 1px solid rgba(103, 224, 223, 0.38);
            border-radius: 999px;
            color: #031114;
            background: linear-gradient(135deg, #67e0df, #b2f7f1);
            box-shadow: 0 0 24px rgba(103, 224, 223, 0.18);
            font-size: 0.78rem;
            font-weight: 900;
            letter-spacing: 0.04em;
          }

          .siteBrandText {
            display: grid;
            gap: 3px;
          }

          .siteBrandText strong {
            font-size: 0.9rem;
            letter-spacing: -0.01em;
          }

          .siteBrandText small {
            color: #829da5;
            font-size: 0.62rem;
            line-height: 1.35;
          }

          .siteNavigation {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          }

          .siteNavigation a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 38px;
            padding: 0 10px;
            border: 1px solid transparent;
            border-radius: 999px;
            color: #a9c1c8;
            text-decoration: none;
            font-size: 0.76rem;
            font-weight: 750;
            transition:
              color 180ms ease,
              border-color 180ms ease,
              background 180ms ease,
              transform 180ms ease;
          }

          .siteNavigation a[href='/eu-ai-act'] {
            border-color: rgba(240, 202, 110, 0.28);
            color: #ffe4a0;
            background:
              linear-gradient(
                135deg,
                rgba(240, 202, 110, 0.1),
                rgba(240, 168, 65, 0.035)
              );
          }

          .siteNavigation a[href='/eu-ai-act']:hover,
          .siteNavigation a[href='/eu-ai-act']:focus-visible {
            border-color: rgba(240, 202, 110, 0.62);
            color: #fff1c2;
            background:
              linear-gradient(
                135deg,
                rgba(240, 202, 110, 0.18),
                rgba(240, 168, 65, 0.07)
              );
          }

          .siteNavigation a:hover,
          .siteNavigation a:focus-visible {
            color: #f3fbfc;
            border-color: rgba(118, 213, 220, 0.26);
            background: rgba(103, 224, 223, 0.06);
            transform: translateY(-1px);
            outline: none;
          }

          .siteHeaderAction {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 0 16px;
            border-radius: 999px;
            color: #031114;
            background: linear-gradient(135deg, #67e0df, #b2f7f1);
            box-shadow: 0 10px 28px rgba(37, 185, 189, 0.18);
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 850;
            transition:
              transform 180ms ease,
              box-shadow 180ms ease;
          }

          .siteHeaderAction:hover,
          .siteHeaderAction:focus-visible {
            transform: translateY(-2px);
            box-shadow: 0 14px 34px rgba(37, 185, 189, 0.24);
            outline: none;
          }

          .siteContent {
            min-height: calc(100vh - 76px);
          }

          @media (max-width: 1040px) {
            .siteHeaderInner {
              grid-template-columns: auto auto;
              justify-content: space-between;
              gap: 18px;
              padding: 12px 0;
            }

            .siteNavigation {
              grid-column: 1 / -1;
              order: 3;
              justify-content: flex-start;
              overflow-x: auto;
              padding-bottom: 2px;
              scrollbar-width: thin;
            }

            .siteNavigation a {
              flex: 0 0 auto;
            }
          }

          @media (max-width: 620px) {
            .siteHeaderInner {
              width: min(100% - 20px, 1240px);
            }

            .siteBrandText small {
              display: none;
            }

            .siteBrandText strong {
              font-size: 0.8rem;
            }

            .siteBrandMark {
              min-width: 54px;
              height: 36px;
              font-size: 0.73rem;
            }

            .siteHeaderAction {
              min-height: 36px;
              padding: 0 12px;
              font-size: 0.72rem;
            }

            .siteNavigation {
              gap: 4px;
            }

            .siteNavigation a {
              min-height: 34px;
              padding: 0 10px;
              font-size: 0.73rem;
            }
          }

          @media (max-width: 430px) {
            .siteBrandText {
              display: none;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .siteNavigation a,
            .siteHeaderAction {
              transition-duration: 0.001ms !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
