'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {useMemo,useState} from 'react';

type NavItem={label:string;href:string;glyph:string;academy:string;match?:string[];group:'Start'|'Operate'|'Requirements'|'Evidence & Review'|'Learn'};

const nav:NavItem[]=[
 {label:'EU AI Act Home',href:'/eu-ai-act',glyph:'EU',academy:'overview',group:'Start'},
 {label:'Start Here',href:'/eu-ai-act/start',glyph:'01',academy:'start-here',group:'Start'},
 {label:'Command Center',href:'/eu-ai-act/command-center',glyph:'CC',academy:'command-center',group:'Operate'},
 {label:'System Passport',href:'/eu-ai-act/system-passport',glyph:'SP',academy:'system-passport',group:'Operate'},
 {label:'Classifier',href:'/eu-ai-act/classifier',glyph:'CL',academy:'classifier',group:'Operate'},
 {label:'Article 50 Transparency',href:'/eu-ai-act#article-50-workspace',glyph:'50',academy:'article-50',group:'Requirements'},
 {label:'Requirements Explorer',href:'/eu-ai-act#requirements-explorer',glyph:'RX',academy:'requirements-explorer',group:'Requirements'},
 {label:'Prohibited Practices',href:'/eu-ai-act#requirements-explorer',glyph:'P5',academy:'prohibited-practices',group:'Requirements'},
 {label:'High-Risk AI',href:'/eu-ai-act#requirements-explorer',glyph:'HR',academy:'high-risk-ai',group:'Requirements'},
 {label:'GPAI',href:'/eu-ai-act#requirements-roadmap',glyph:'GP',academy:'gpai',group:'Requirements'},
 {label:'FRIA',href:'/eu-ai-act#requirements-explorer',glyph:'FR',academy:'fria',group:'Requirements'},
 {label:'Human Oversight',href:'/eu-ai-act#requirements-roadmap',glyph:'HO',academy:'human-oversight',group:'Requirements'},
 {label:'Technical Documentation',href:'/eu-ai-act#requirements-roadmap',glyph:'TD',academy:'technical-documentation',group:'Requirements'},
 {label:'Governed Records',href:'/workspace/governed-records/eu-ai-act',glyph:'GR',academy:'governed-records',group:'Evidence & Review'},
 {label:'Evidence Passport',href:'/eu-ai-act/passport',glyph:'EP',academy:'evidence-passport',group:'Evidence & Review'},
 {label:'Proof Lab',href:'/eu-ai-act/proof-lab',glyph:'PL',academy:'proof-lab',group:'Evidence & Review'},
 {label:'Change & Revalidation',href:'/eu-ai-act/command-center',glyph:'RV',academy:'revalidation',group:'Evidence & Review'},
 {label:'Controlled Examination',href:'/eu-ai-act/command-center',glyph:'EX',academy:'controlled-examination',group:'Evidence & Review'},
 {label:'EU AI Act Academy',href:'/academy/eu-ai-act',glyph:'AC',academy:'overview',group:'Learn'},
 {label:'Access & Plans',href:'/eu-ai-act/commercial',glyph:'$',academy:'access-and-plans',group:'Learn'},
];

const routeAcademy:[string,string][]=[
 ['/eu-ai-act/command-center','command-center'],['/eu-ai-act/system-passport','system-passport'],['/eu-ai-act/classifier','classifier'],['/eu-ai-act/passport','evidence-passport'],['/eu-ai-act/proof-lab','proof-lab'],['/eu-ai-act/commercial','access-and-plans'],['/eu-ai-act/start','start-here'],['/eu-ai-act','overview']
];

function isActive(pathname:string,item:NavItem){
 if(item.href.includes('#')) return false;
 if(item.href==='/eu-ai-act') return pathname==='/eu-ai-act';
 return (item.match??[item.href]).some(x=>pathname===x||pathname.startsWith(`${x}/`));
}

export default function EUAIActWorldLayout({children}:{children:ReactNode}){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const academySlug=useMemo(()=>routeAcademy.find(([route])=>pathname===route||pathname.startsWith(`${route}/`))?.[1]??'overview',[pathname]);
 const groups=['Start','Operate','Requirements','Evidence & Review','Learn'] as const;
 return <div className="euShell">
  <style>{`
   .euShell{min-height:100vh;background:#02050a;color:#eef7ff}.euSidebar{position:fixed;left:0;top:0;bottom:0;z-index:1200;width:276px;overflow-y:auto;padding:16px 13px 24px;border-right:1px solid rgba(126,230,255,.16);background:radial-gradient(circle at 50% 0,rgba(76,201,240,.13),transparent 24%),rgba(2,8,15,.96);backdrop-filter:blur(24px);box-shadow:16px 0 55px rgba(0,0,0,.24)}.euBrand{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:center;padding:8px 8px 15px;color:#fff;text-decoration:none;border-bottom:1px solid rgba(126,230,255,.12)}.euMark{width:44px;height:44px;display:grid;place-items:center;border:1px solid rgba(126,230,255,.38);border-radius:14px;background:linear-gradient(145deg,rgba(42,184,226,.25),rgba(7,24,40,.8));color:#aef3ff;font-size:11px;font-weight:950}.euBrand strong{display:block;font-size:12px;letter-spacing:.08em}.euBrand span{display:block;margin-top:3px;color:#7f9cb1;font-size:9px;line-height:1.35}.euBack{display:flex;align-items:center;justify-content:center;margin:13px 7px 17px;min-height:38px;border:1px solid rgba(255,255,255,.1);border-radius:11px;color:#bed1df;text-decoration:none;font-size:10px;font-weight:850}.euGroup{margin-top:13px}.euGroup>span{display:block;padding:0 10px 7px;color:#58758c;font-size:8px;font-weight:950;letter-spacing:.17em;text-transform:uppercase}.euNav{display:grid;gap:4px}.euItem{display:grid;grid-template-columns:31px 1fr;gap:9px;align-items:center;min-height:43px;padding:6px 9px;border:1px solid transparent;border-radius:11px;color:#9fb6c8;text-decoration:none;font-size:11px;font-weight:760;transition:.16s ease}.euItem:hover{color:#fff;border-color:rgba(126,230,255,.18);background:rgba(126,230,255,.055);transform:translateX(2px)}.euItem.active{color:#fff;border-color:rgba(126,230,255,.28);background:linear-gradient(135deg,rgba(126,230,255,.14),rgba(44,245,175,.03));box-shadow:inset 3px 0 0 #7ee6ff}.euGlyph{width:30px;height:30px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.08);border-radius:9px;color:#7ee6ff;background:rgba(255,255,255,.025);font-size:8px;font-weight:950}.euAcademyCard{margin:18px 7px 0;padding:14px;border:1px solid rgba(242,196,86,.25);border-radius:14px;background:linear-gradient(145deg,rgba(242,196,86,.09),rgba(126,230,255,.035))}.euAcademyCard b{display:block;color:#f3d889;font-size:9px;letter-spacing:.12em}.euAcademyCard p{margin:7px 0 11px;color:#9eb1bf;font-size:10px;line-height:1.5}.euAcademyCard a{display:flex;justify-content:center;padding:9px;border-radius:9px;background:#f2c456;color:#091019;text-decoration:none;font-size:9px;font-weight:950}.euMain{min-width:0;margin-left:276px}.euTop{position:relative;z-index:1000;display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;padding:9px 18px;background:linear-gradient(90deg,#071a36,#0b315d,#071a36);border-bottom:1px solid rgba(106,213,255,.35);font-family:Inter,system-ui,sans-serif;font-size:10px;letter-spacing:.08em}.euTop strong{color:#7ee6ff}.euTop span{color:#b7cce0}.euTop a{padding:7px 11px;border:1px solid #7ee6ff;border-radius:999px;color:#071a36;background:#7ee6ff;text-decoration:none;font-weight:900}.euMobile{display:none}.euMenuBtn{display:none}
   @media(max-width:900px){.euSidebar{transform:translateX(-102%);transition:.2s ease;width:min(86vw,300px)}.euSidebar.open{transform:none}.euMain{margin-left:0}.euMenuBtn{display:block;position:fixed;right:14px;bottom:14px;z-index:1300;width:52px;height:52px;border:1px solid rgba(126,230,255,.45);border-radius:50%;background:#082039;color:#bff5ff;font-weight:950;box-shadow:0 12px 35px rgba(0,0,0,.35)}.euTop{padding-right:76px}.euMobile{display:block}}
  `}</style>
  <aside className={`euSidebar ${open?'open':''}`}>
   <Link className="euBrand" href="/eu-ai-act"><span className="euMark">EU</span><span><strong>EU AI ACT</strong><span>Governed operating environment</span></span></Link>
   <Link className="euBack" href="/">← TA-14 AI Governance Exchange</Link>
   {groups.map(group=><div className="euGroup" key={group}><span>{group}</span><nav className="euNav">{nav.filter(x=>x.group===group).map(item=><Link key={`${group}-${item.label}`} href={item.href} className={`euItem ${isActive(pathname,item)?'active':''}`} onClick={()=>setOpen(false)}><span className="euGlyph">{item.glyph}</span><span>{item.label}</span></Link>)}</nav></div>)}
   <div className="euAcademyCard"><b>NEED HELP?</b><p>Learn what this page does, what you need, how to complete it, and what to do next.</p><Link href={`/academy/eu-ai-act/${academySlug}`}>UNDERSTAND THIS PAGE →</Link></div>
  </aside>
  <button className="euMenuBtn" onClick={()=>setOpen(v=>!v)} aria-label="Open EU AI Act navigation">{open?'×':'EU'}</button>
  <div className="euMain">
   <div className="euTop"><strong>EU AI ACT · GOVERNED OPERATING ENVIRONMENT</strong><span>Know what applies · prove why · preserve change</span><Link href={`/academy/eu-ai-act/${academySlug}`}>? LEARN THIS PAGE</Link></div>
   {children}
  </div>
 </div>
}
