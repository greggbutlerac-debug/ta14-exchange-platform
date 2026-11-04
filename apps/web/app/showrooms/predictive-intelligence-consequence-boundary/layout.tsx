import type { Metadata } from 'next';

const canonical = '/showrooms/predictive-intelligence-consequence-boundary';

export const metadata: Metadata = {
  title: 'Predictive Intelligence: From AI Forecast to Authorized Action',
  description: 'Eight visual lessons explain why predictive AI in building automation requires traceable evidence, local authority, bounded execution, and verified physical outcomes.',
  alternates: { canonical },
  openGraph: { type: 'article', url: canonical, title: 'Predictive Intelligence: From AI Forecast to Authorized Action', description: 'Eight visual lessons explain why predictive AI in building automation requires traceable evidence, local authority, bounded execution, and verified physical outcomes.' },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
