'use client';
import Link from 'next/link';
import {useMemo,useState} from 'react';

const collections=[
['PEOPLE & PRACTITIONERS','People whose work is examined, taught or connected to TA14.'],
['COUNTRIES & PUBLIC INSTITUTIONS','Country-facing and institutional technical rooms.'],
['ORGANIZATIONS & PARTNERS','Organizations, collaborators and public company rooms.'],
['ENVIRONMENT & ATMOSPHERIC INTEGRITY','Air, environmental evidence, AIR, PAIR and EIG.'],
['BUILDINGS & HVAC','Building systems, commissioning, HVAC and operational consequence.'],
['AI & MACHINE INTELLIGENCE','AI, ML, agents, computation and machine-generated proposals.'],
['INTEROPERABILITY & SYSTEMS','Connections, protocols, federation and system boundaries.'],
['GOVERNANCE & ARCHITECTURES','TA14 architectures and registered governance teaching surfaces.'],
['EXAMINATIONS & DEMONSTRATIONS','Bounded examinations, proving-ground demonstrations and tests.'],
['EVENTS & PRESENTATIONS','Conference, meeting and presentation experiences.'],
] as const;

const rooms=[
['Aaron Hastings · Building ML','/showrooms/aaron-hastings-building-ml','PEOPLE & PRACTITIONERS','machine learning building automation HVAC analytics AEA ACA authority evidence consequence'],
['Anto Budiardjo','/showrooms/anto-budiardjo','PEOPLE & PRACTITIONERS','CNS CP federation AFA buildings interoperability'],
['Kimon Onuma','/showrooms/onuma','PEOPLE & PRACTITIONERS','ONUMA BIM buildings interoperability'],
['Yong Ku Kim','/showrooms/yong-ku-kim','PEOPLE & PRACTITIONERS','buildings practitioner'],
['Michael Bordenaro','/showrooms/michael-bordenaro','PEOPLE & PRACTITIONERS','practitioner buildings'],
['Bruno Tudal','/showrooms/bruno-tudal','PEOPLE & PRACTITIONERS','France indoor air practitioner'],
['Steven Stobo · WeRAI','/showrooms/steven-stobo-werai','PEOPLE & PRACTITIONERS','WeRAI AHIA human router AI'],
['Geoff Crawford','/showrooms/eight24-solutions/geoff-crawford','PEOPLE & PRACTITIONERS','Eight24 HVAC training'],
['David Greenberg','/showrooms/eight24-solutions/david-greenberg','PEOPLE & PRACTITIONERS','Eight24 HVAC training'],
['Jayesh Chavan','/showrooms/eight24-solutions/jayesh-chavan','PEOPLE & PRACTITIONERS','Eight24 HVAC training'],
['United States · EPA Indoor Air','/global-institutional-engagement/united-states-epa-indoor-air','COUNTRIES & PUBLIC INSTITUTIONS','USA EPA indoor air institutional'],
['Palestine','/global-institutional-engagement/palestine','COUNTRIES & PUBLIC INSTITUTIONS','EQA environmental air'],
['Guatemala','/global-institutional-engagement/guatemala','COUNTRIES & PUBLIC INSTITUTIONS','MARN environmental air'],
['Bosnia and Herzegovina','/environmental-integrity-governance/bosnia-herzegovina','COUNTRIES & PUBLIC INSTITUTIONS','FHMZBiH air quality authority'],
['UAE','/environmental-integrity-governance/uae','COUNTRIES & PUBLIC INSTITUTIONS','United Arab Emirates air quality'],
['Papua New Guinea · Atmospheric Integrity Pilot','/environmental-integrity-governance/png-atmospheric-integrity-pilot','COUNTRIES & PUBLIC INSTITUTIONS','PNG Crusaders AIR EIG pilot'],
['Eight24 Solutions','/showrooms/eight24-solutions','ORGANIZATIONS & PARTNERS','HVAC training organization'],
['AutomatedBuildings.com · Ken Sinclair','/showrooms/automatedbuildings','ORGANIZATIONS & PARTNERS','Ken Sinclair building automation'],
['Daikin Industries','/showrooms/daikin-industries','ORGANIZATIONS & PARTNERS','HVAC FUSION30 Japan'],
['Airthings Space Radon','/environmental-integrity-governance/showcase/airthings-space-radon','ENVIRONMENT & ATMOSPHERIC INTEGRITY','radon sensors AIR evidence'],
['Fungal Spore Evidence','/environmental-integrity-governance/fungal-spore-evidence','ENVIRONMENT & ATMOSPHERIC INTEGRITY','mold spores evidence'],
['Building Governed Air','/environmental-integrity-governance/building-governed-air','BUILDINGS & HVAC','classroom CO2 HVAC AIR AEA EIG'],
['Governed Air','/global-institutional-engagement/governed-air','ENVIRONMENT & ATMOSPHERIC INTEGRITY','AIR ACA AI AEA governed intelligence'],
['The Gap Between Scopes','/showrooms/gap-between-scopes','BUILDINGS & HVAC','RACI commissioning handoff acceptance consequence'],
['Admissible Search Proof','/ai-governance/admissible-computation/showcase/admissible-search-proof','AI & MACHINE INTELLIGENCE','ACA search AI evidence'],
['The Six Results You Never Saw','/ai-governance/admissible-computation/showcase/six-results-you-never-saw','AI & MACHINE INTELLIGENCE','ACA search admitted evidence'],
['Tulshekar Gangireddy · Autonomous Agent','/autonomous-agent-examination/tulshekar-gangireddy','AI & MACHINE INTELLIGENCE','agent credentials validation AFA AEA EABA ACA'],
['Admissible Federation Architecture','/admissible-federation-architecture','GOVERNANCE & ARCHITECTURES','AFA federation authority'],
['Execution Authority Boundary Architecture','/execution-authority-boundary-architecture','GOVERNANCE & ARCHITECTURES','EABA execution commit boundary'],
['Human Performance Stack','/human-performance-stack','GOVERNANCE & ARCHITECTURES','HPS human performance consequence'],
['TA14 Canonical Architecture Showroom','/ai-governance/ta14-architecture-showroom','GOVERNANCE & ARCHITECTURES','HPS AHIA ACA AEA architecture'],
['Federation Authority Foundations','/federation-authority/foundations','GOVERNANCE & ARCHITECTURES','federation authority foundations'],
['AFA × EABA Operational Challenge','/afa-eaba-operational-challenge','EXAMINATIONS & DEMONSTRATIONS','AFA EABA challenge examination'],
['Stop the Cyber Attack','/examinations/stop-the-cyber-attack','EXAMINATIONS & DEMONSTRATIONS','cyber building authority evidence'],
['David Holmberg Technical Challenge','/examinations/david-holmberg-technical-challenge','EXAMINATIONS & DEMONSTRATIONS','technical challenge'],
['SCGA Examination Architecture v0.4','/governance-showcase/scga-v0-4','EXAMINATIONS & DEMONSTRATIONS','SCGA Elias adversarial examination'],
['Global Framework for Action','/global-framework-for-action','EXAMINATIONS & DEMONSTRATIONS','healthy indoor air global framework'],
['Stop the Cyber Attack · Presentation','/examinations/stop-the-cyber-attack/presentation','EVENTS & PRESENTATIONS','cyber presentation building'],
['NIST AI-Optimized Building Controls','/nist-ai-optimized-building-controls','EVENTS & PRESENTATIONS','NIST meeting AI building controls non endorsement'],
['Greenbuild · ONUMA × TA14 RE1','/greenbuild/onuma-re1','EVENTS & PRESENTATIONS','Greenbuild ONUMA RE1'],
['Proof Over Promise · Chicago','/showrooms/proof-over-promise-chicago','EVENTS & PRESENTATIONS','Chicago ASHRAE AHR proof'],
] as const;

export default function Showrooms(){
 const [q,setQ]=useState(''); const [cat,setCat]=useState('ALL');
 const visible=useMemo(()=>rooms.filter(r=>(cat==='ALL'||r[2]===cat)&&(!q||r.join(' ').toLowerCase().includes(q.toLowerCase()))),[q,cat]);
 return <main className="page"><div className="shell">
  <nav><Link href="/">← TA14 EXCHANGE</Link><b>SHOWROOM LIBRARY · INVENTORY V1</b></nav>
  <header><p>PUBLIC TECHNICAL LIBRARY</p><h1>FIND YOUR<br/><em>SHOWROOM.</em></h1><p className="lead">One searchable door into TA14 public teaching, examination and presentation surfaces. A showroom teaches or examines. Artifacts prove or preserve. Indexes organize. Registry records establish identity or status.</p></header>
  <section className="search"><label>SEARCH ALL SHOWROOMS<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Try: Aaron Hastings, Palestine, radon, ONUMA, HVAC, BACnet, AI, authority, mold…"/></label><div className="filters"><button onClick={()=>setCat('ALL')} className={cat==='ALL'?'on':''}>ALL</button>{collections.map(c=><button key={c[0]} onClick={()=>setCat(c[0])} className={cat===c[0]?'on':''}>{c[0]}</button>)}</div><b>{visible.length} MATCH{visible.length===1?'':'ES'}</b></section>
  <section className="grid">{visible.map(r=><Link href={r[1]} key={r[1]} className="card"><small>{r[2]}</small><h2>{r[0]}</h2><p>{r[3].split(' ').slice(0,8).join(' · ')}</p><b>ENTER SHOWROOM →</b></Link>)}</section>
  <section className="collections"><p>PRIMARY COLLECTIONS</p>{collections.map(c=><button key={c[0]} onClick={()=>{setCat(c[0]);setQ('');scrollTo({top:0,behavior:'smooth'})}}><b>{c[0]}</b><span>{c[1]}</span></button>)}</section>
  <footer>TA14 AUTHORITY GOVERNANCE INSTITUTION · SHOWROOM LIBRARY · INVENTORY V1<br/><span>One substantive public room = one showroom. Language variants and continuation surfaces do not multiply the count.</span></footer>
 </div><style jsx>{`
 .page{min-height:100vh;background:#03090e;color:#eaf5f7;font-family:Arial,sans-serif}.shell{max-width:1320px;margin:auto;padding:28px}nav{display:flex;justify-content:space-between;border-bottom:1px solid #17313b;padding-bottom:18px;font-size:12px;letter-spacing:.12em}nav a{color:#91e8f5;text-decoration:none}header{padding:70px 0 38px}header>p:first-child,.collections>p{color:#64dceb;font-weight:900;letter-spacing:.2em;font-size:11px}h1{font-size:clamp(58px,10vw,128px);line-height:.82;letter-spacing:-.07em;margin:18px 0}h1 em{color:#75efba;font-style:normal}.lead{max-width:850px;color:#9db3bc;font-size:19px;line-height:1.65}.search{position:sticky;top:0;background:#03090ef2;backdrop-filter:blur(14px);z-index:5;padding:18px 0;border-block:1px solid #17313b}.search label{font-size:10px;letter-spacing:.16em;font-weight:900}.search input{display:block;width:100%;box-sizing:border-box;margin:9px 0 13px;padding:17px;border-radius:12px;border:1px solid #244a57;background:#07141b;color:white;font-size:16px}.filters{display:flex;gap:7px;overflow:auto;padding-bottom:8px}.filters button{white-space:nowrap;background:#07141b;color:#86a2ad;border:1px solid #17313b;border-radius:999px;padding:8px 11px;font-size:9px;font-weight:900}.filters button.on{color:#03100c;background:#75efba;border-color:#75efba}.search>b{font-size:10px;color:#75efba}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px;padding:28px 0 70px}.card{min-height:190px;padding:22px;border:1px solid #17313b;border-radius:16px;background:#061117;text-decoration:none;color:inherit;display:flex;flex-direction:column}.card:hover{border-color:#64dceb;transform:translateY(-2px)}.card small{color:#64dceb;font-weight:900;letter-spacing:.12em;font-size:9px}.card h2{font-size:24px;line-height:1.05;margin:18px 0 10px}.card p{color:#718c97;font-size:11px;line-height:1.6;text-transform:uppercase}.card>b{margin-top:auto;color:#75efba;font-size:11px}.collections{border-top:1px solid #17313b;padding:55px 0}.collections button{width:100%;display:grid;grid-template-columns:minmax(240px,1fr) 2fr;text-align:left;padding:18px 0;border:0;border-bottom:1px solid #122832;background:none;color:inherit}.collections b{font-size:13px;color:#eaf5f7}.collections span{color:#78919b}footer{border-top:1px solid #17313b;padding:30px 0 50px;color:#6f8993;font-size:10px;letter-spacing:.1em;line-height:1.8}footer span{letter-spacing:0}@media(max-width:700px){.collections button{grid-template-columns:1fr;gap:7px}nav{gap:20px}h1{font-size:60px}}
 `}</style></main>
}