import type { Metadata } from 'next';

const canonical = '/showrooms/the-filter-is-not-the-proof';

export const metadata: Metadata = {
  title: 'The Filter Is Not the Proof: HVAC Filtration Governance',
  description: 'Eight visual lessons on filtration claims, installation evidence, operating conditions, admissibility, authorized action, and verified indoor air outcomes.',
  alternates: { canonical },
  openGraph: { type: 'article', url: canonical, title: 'The Filter Is Not the Proof: HVAC Filtration Governance', description: 'Eight visual lessons on filtration claims, installation evidence, operating conditions, admissibility, authorized action, and verified indoor air outcomes.' },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
