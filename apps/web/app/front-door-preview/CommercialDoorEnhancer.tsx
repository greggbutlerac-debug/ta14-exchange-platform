'use client';

import { useEffect } from 'react';

export default function CommercialDoorEnhancer() {
  useEffect(() => {
    const root = document.querySelector('.fdp');
    const grid = root?.querySelector('.doorGrid');
    const sectionHead = grid?.previousElementSibling;
    if (!root || !grid) return;

    const kicker = sectionHead?.querySelector('small');
    if (kicker) kicker.textContent = 'ONE INSTITUTION · EIGHT GOVERNED DOORS';

    if (!grid.querySelector('[data-eighth-world="execution-artifacts"]')) {
      const artifacts = document.createElement('a');
      artifacts.href = '/artifacts';
      artifacts.className = 'door artifactDoor';
      artifacts.setAttribute('data-eighth-world', 'execution-artifacts');
      artifacts.innerHTML = `
        <span>EA</span>
        <small>GOVERNED DOOR 08</small>
        <h3>EXECUTION ARTIFACTS</h3>
        <p>Inspect portable records of determinations, execution effects, evidence boundaries, receipts, replay, verification and preserved outcomes.</p>
        <strong>INSPECT THE RECORD →</strong>
      `;
      grid.appendChild(artifacts);
    }

    if (!grid.querySelector('[data-commercial-entry="work-with-ta14"]')) {
      const commercial = document.createElement('a');
      commercial.href = '/work-with-ta14';
      commercial.className = 'door commercialDoor';
      commercial.setAttribute('data-commercial-entry', 'work-with-ta14');
      commercial.innerHTML = `
        <span>→</span>
        <small>COMMERCIAL ENTRY</small>
        <h3>WORK WITH TA-14</h3>
        <p>Need governance architecture, an interoperability examination, execution-readiness review, institutional pilot, training, or a custom integration? Start here.</p>
        <strong>SEE WHAT YOU CAN HIRE TA-14 TO DO →</strong>
      `;
      grid.appendChild(commercial);
    }

    const style = document.createElement('style');
    style.setAttribute('data-commercial-door-style', 'commercial-entry');
    style.textContent = `
      .fdp .doorGrid{grid-template-columns:repeat(6,1fr)!important}
      .fdp .doorGrid .door{grid-column:span 2!important}
      .fdp .door.artifactDoor{--accent:#61d7ff}
      .fdp .door.commercialDoor{
        --accent:#ffd166;
        grid-column:1 / -1!important;
        min-height:315px;
        padding:72px 44px 38px 230px;
        border-radius:28px;
        background:radial-gradient(circle at 10% 35%,rgba(255,209,102,.30),transparent 28%),linear-gradient(135deg,rgba(74,50,8,.92),rgba(4,15,24,.98) 62%);
        box-shadow:inset 0 0 85px rgba(255,209,102,.10),0 30px 80px rgba(0,0,0,.45),0 0 32px rgba(255,209,102,.12)
      }
      .fdp .door.commercialDoor:before{left:102px;top:72px;width:126px;height:126px;transform:none}
      .fdp .door.commercialDoor>span{left:165px;top:112px;transform:none;font-size:30px}
      .fdp .door.commercialDoor h3{font-size:clamp(34px,5vw,58px);min-height:0;margin-top:13px;letter-spacing:-.035em}
      .fdp .door.commercialDoor p{font-size:16px;line-height:1.65;max-width:760px;min-height:0}
      .fdp .door.commercialDoor strong{font-size:11px;margin-top:24px}
      .fdp .door.commercialDoor:after{content:'START HERE IF YOU WANT TO HIRE US';position:absolute;right:28px;top:24px;font-size:8px;font-weight:950;letter-spacing:.16em;color:rgba(255,230,170,.72)}
      @media(max-width:900px){
        .fdp .doorGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        .fdp .doorGrid .door{grid-column:span 1!important}
        .fdp .door.commercialDoor{grid-column:1 / -1!important;padding:170px 28px 30px}
        .fdp .door.commercialDoor:before{left:50%;top:28px;transform:translateX(-50%)}
        .fdp .door.commercialDoor>span{left:50%;top:70px;transform:translateX(-50%)}
      }
      @media(max-width:620px){
        .fdp .doorGrid{grid-template-columns:1fr!important}
        .fdp .doorGrid .door,.fdp .door.commercialDoor{grid-column:span 1!important}
      }
    `;
    root.appendChild(style);
  }, []);

  return null;
}
