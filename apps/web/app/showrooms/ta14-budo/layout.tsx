import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Budo Magaru-Ilaitia | Crusaders Air Solution | Papua New Guinea | TA-14',
  description: 'A collaborative-review showroom honoring Budo Magaru-Ilaitia and Crusaders Air Solution in Papua New Guinea. Explore eight illustrated chapters on local clean-air advocacy, an accepted voluntary TA-14 ambassador invitation, and a proposed—unimplemented—Atmospheric Integrity Pilot.',
  alternates: { canonical: '/showrooms/ta14-budo' },
  openGraph: {
    title: 'Budo Magaru-Ilaitia & Crusaders Air Solution | TA-14',
    description: 'Papua New Guinea clean-air leadership, community capability, eight educational chapters and a proposed atmospheric-integrity partnership.',
    url: 'https://www.ta14exchange.com/showrooms/ta14-budo',
    type: 'website',
  },
};

export default function BudoShowroomLayout({ children }: { children: ReactNode }) {
  return children;
}
