import type { Metadata } from 'next';

const path = '/showrooms/smart-city-admissible-governance';

export const metadata: Metadata = {
  title: 'Smart City Governance: Who Authorizes Physical AI Actions?',
  description: 'Explore eight TA14 governance anchors for municipal and building AI: preserve evidence, establish local authority and standing, bound execution, and verify outcomes.',
  alternates: { canonical: path },
  openGraph: {
    type: 'article',
    url: path,
    title: 'Smart City Governance: Who Authorizes Physical AI Actions?',
    description: 'Explore eight TA14 governance anchors for municipal and building AI: preserve evidence, establish local authority and standing, bound execution, and verify outcomes.',
  },
};

export default function ShowroomLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
