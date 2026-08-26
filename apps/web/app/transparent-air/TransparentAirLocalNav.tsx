'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const localPages = [
  { href: '/transparent-air/gulfport-ac-repair', label: 'Gulfport AC Repair' },
  { href: '/transparent-air/seminole-ac-repair', label: 'Seminole AC Repair' },
  { href: '/transparent-air/pinellas-park-ac-repair', label: 'Pinellas Park AC Repair' },
  { href: '/transparent-air/south-st-petersburg-ac-repair', label: 'South St. Petersburg AC Repair' },
  { href: '/transparent-air/second-opinion', label: 'Pinellas County AC Second Opinions' },
];

export default function TransparentAirLocalNav() {
  const pathname = usePathname();
  if (pathname === '/transparent-air/command-center') return null;

  return (
    <nav aria-label="Transparent Air local service areas" style={{ background: '#062531', color: '#dcebed', padding: '30px 4vw 38px', borderTop: '1px solid #174653' }}>
      <div style={{ width: 'min(1160px, 92vw)', margin: '0 auto' }}>
        <div style={{ fontSize: '.76rem', fontWeight: 900, letterSpacing: '.14em', textTransform: 'uppercase', color: '#7ee0df', marginBottom: 12 }}>
          Transparent Air local service areas
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px' }}>
          {localPages.map((page) => (
            <Link key={page.href} href={page.href} style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: 4 }}>
              {page.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
