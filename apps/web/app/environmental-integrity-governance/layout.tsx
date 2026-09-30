'use client';

import Link from 'next/link';
import type {ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {useState} from 'react';

export default function EnvironmentalIntegrityLayout({children}:{children:ReactNode}){
  const pathname=usePathname();
  const isShowroom=pathname.includes('/showcase/');
  const [dismissed,setDismissed]=useState(false);
  return <>
    {children}
    {!isShowroom&&!dismissed?<div className="environmentalCtas">
      <button className="dismissCtas" type="button" aria-label="Hide environmental action buttons" title="Hide these buttons" onClick={()=>setDismissed(true)}>×</button>
      <Link href="/environmental-integrity-governance/verification" className="cta commercial"><small>PAID COMMERCIAL ENGINE</small><strong>ENVIRONMENTAL INTEGRITY VERIFICATION →</strong><em>Baseline · pathway · intervention · post-intervention evidence · bounded closure</em></Link>
      <Link href="/workspace/environmental-records/playground" className="cta records"><small>ENVIRONMENTAL RECORDS PLAYGROUND</small><strong>BRING YOUR RECORD. ASK WHAT IT CAN PROVE. →</strong></Link>
      <Link href="/environmental-integrity-governance/demonstrations" className="cta demos"><small>DOOR 03 · PROVING GROUND</small><strong>RUN GOVERNED DEMONSTRATIONS →</strong></Link>
      <style jsx>{`
        .environmentalCtas{position:fixed;right:18px;bottom:18px;z-index:95;display:grid;gap:8px;width:min(410px,calc(100vw - 36px))}
        .dismissCtas{position:absolute;right:-8px;top:-12px;z-index:3;width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.55);background:#081116;color:#fff;font-size:21px;line-height:23px;cursor:pointer;opacity:0;transform:scale(.85);transition:opacity .16s ease,transform .16s ease,background .16s ease;box-shadow:0 5px 18px rgba(0,0,0,.4)}
        .environmentalCtas:hover .dismissCtas,.dismissCtas:focus-visible{opacity:1;transform:scale(1)}
        .dismissCtas:hover{background:#9d302d}
        .cta{display:block;padding:12px 16px;border-radius:14px;text-decoration:none}
        .cta small{display:block;font-size:8px;font-weight:900}
        .cta strong{display:block;margin-top:4px;font-size:12px}
        .cta em{display:block;margin-top:4px;font-size:8px;font-style:normal}
        .commercial{border:1px solid rgba(255,209,92,.58);background:linear-gradient(135deg,rgba(45,32,6,.98),rgba(18,12,3,.98));color:#fff8df}
        .commercial small{color:#ffd15c;letter-spacing:.14em}.commercial em{color:#c8b98d}
        .records{border:1px solid rgba(201,175,255,.48);background:#160f25;color:#f5efff}.records small{color:#c9afff}
        .demos{border:1px solid rgba(116,235,182,.62);background:#061e16;color:#eefbf5}.demos small{color:#79dbae}
        @media (hover:none){.dismissCtas{opacity:.82;transform:scale(1)}}
      `}</style>
    </div>:null}
  </>;
}
