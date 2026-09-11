'use client';

import { useEffect } from 'react';

const architectures = [
  {
    code: 'HPS',
    title: 'HUMAN PERFORMANCE STACK',
    description: 'Can this human perform under present conditions?',
    href: 'https://sites.google.com/view/humanperformancestackhps/home',
  },
  {
    code: 'AHIA',
    title: 'ADMISSIBLE HUMAN INTERVENTION',
    description: 'May this human legitimately intervene in this consequential route?',
    href: 'https://sites.google.com/view/ta-14-admissible-human-interve/home',
  },
  {
    code: 'ACA',
    title: 'ADMISSIBLE COMPUTATION',
    description: 'May this computation occur under present conditions?',
    href: '/ai-governance/admissible-computation',
  },
  {
    code: 'AEA',
    title: 'ADMISSIBLE EXECUTION',
    description: 'May this consequence-bearing route proceed to execution?',
    href: '/registry/ta-14-admissible-execution-architecture',
  },
];

export default function ArchitectureFamilyEnhancer() {
  useEffect(() => {
    const group = document.querySelector('.fdp .architectureGroup');
    const grid = group?.querySelector('.architectureGrid');
    if (!group || !grid) return;

    const heading = group.querySelector('h3');
    const intro = group.querySelector(':scope > p');
    if (heading) heading.textContent = 'THE TA-14 CANONICAL ARCHITECTURE FAMILY';
    if (intro) intro.textContent = 'Distinct jurisdictions may interoperate, but no component may borrow authority from another component’s admissibility.';

    grid.innerHTML = '';
    grid.setAttribute('style', 'grid-template-columns:repeat(4,minmax(0,1fr))');

    architectures.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'architecture';
      link.href = item.href;
      link.innerHTML = `<span>${item.code}</span><h4>${item.title}</h4><p>${item.description}</p>`;
      grid.appendChild(link);
    });

    const showroom = document.createElement('a');
    showroom.href = '/ai-governance/ta14-architecture-showroom';
    showroom.className = 'btn secondary';
    showroom.textContent = 'ENTER THE TA-14 ARCHITECTURE SHOWROOM →';
    showroom.setAttribute('style', 'margin-top:20px');
    group.appendChild(showroom);
  }, []);

  return null;
}
