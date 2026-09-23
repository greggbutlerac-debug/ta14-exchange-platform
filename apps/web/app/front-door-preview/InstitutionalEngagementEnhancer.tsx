'use client';

import { useEffect } from 'react';

export default function InstitutionalEngagementEnhancer() {
  useEffect(() => {
    const root = document.querySelector('.fdp');
    const grid = root?.querySelector('.doorGrid');
    const sectionHead = grid?.previousElementSibling;
    if (!root || !grid) return;

    const kicker = sectionHead?.querySelector('small');
    if (kicker && kicker.textContent?.includes('FIVE GOVERNED DOORS')) {
      kicker.textContent = 'ONE INSTITUTION · SIX GOVERNED DOORS';
    }

    if (grid.querySelector('[data-sixth-world="institutional-engagement"]')) return;

    const door = document.createElement('a');
    door.href = '/global-institutional-engagement';
    door.className = 'door sovereign';
    door.setAttribute('data-sixth-world', 'institutional-engagement');
    door.innerHTML = `
      <span>GI</span>
      <small>GOVERNED DOOR 07</small>
      <h3>GLOBAL INSTITUTIONAL ENGAGEMENT</h3>
      <p>Enter country-specific public showrooms built from real institutional conversations, local evidence pathways, sovereign authority contexts, and preserved engagement records.</p>
      <strong>ENTER WORLD →</strong>
    `;
    grid.appendChild(door);

    const style = document.createElement('style');
    style.setAttribute('data-sixth-world-style', 'institutional-engagement');
    style.textContent = `
      .fdp .doorGrid{grid-template-columns:repeat(6,1fr)!important}
      .fdp .doorGrid .door{grid-column:span 2!important}
      .fdp .door.sovereign{--accent:#ff5f57;background:linear-gradient(180deg,rgba(255,95,87,.14),rgba(3,10,16,.98) 64%)}
      .fdp .door.sovereign:after{content:'WORLD 07';position:absolute;right:18px;top:18px;font-size:8px;font-weight:950;letter-spacing:.16em;color:rgba(255,255,255,.52)}
      @media(max-width:900px){.fdp .doorGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.fdp .doorGrid .door{grid-column:span 1!important}}
      @media(max-width:620px){.fdp .doorGrid{grid-template-columns:1fr!important}.fdp .doorGrid .door{grid-column:span 1!important}}
    `;
    root.appendChild(style);
  }, []);

  return null;
}
