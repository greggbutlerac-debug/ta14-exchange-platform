import type { Metadata } from 'next';

const canonical = '/showrooms/environmental-accountability';

export const metadata: Metadata = {
  title: 'Environmental Accountability: From Promise to Verified Consequence',
  description: 'Ten lessons connect environmental commitments with admissible evidence, responsible authorities, authorized corrective action, and independently examinable outcomes.',
  alternates: { canonical },
  openGraph: { type: 'article', url: canonical, title: 'Environmental Accountability: From Promise to Verified Consequence', description: 'Ten lessons connect environmental commitments with admissible evidence, responsible authorities, authorized corrective action, and independently examinable outcomes.' },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
