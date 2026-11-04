import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TA14 Founding Institutional Sponsorship',
  description:
    'Explore TA14 Authority Governance Institution founding sponsorship, Governed Air, AI governance, admissible execution, technical governance, public education, and independent technical collaboration.',
  keywords: [
    'TA14 Founding Institutional Sponsorship',
    'TA14 Authority Governance Institution',
    'Governed Air',
    'AI governance',
    'admissible execution',
    'technical governance',
    'institutional sponsorship',
  ],
  alternates: {
    canonical: '/showrooms/founding-institutional-sponsorship',
  },
  openGraph: {
    title: 'TA14 Founding Institutional Sponsorship',
    description:
      'Support public technical infrastructure, Governed Air, AI governance, education, and independently examinable work without purchasing technical outcomes.',
    url: '/showrooms/founding-institutional-sponsorship',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TA14 Founding Institutional Sponsorship',
    description:
      'Support the work. Strengthen the world. Sponsorship may support TA14 work; sponsorship cannot determine the result.',
  },
};

export default function SponsorshipLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
