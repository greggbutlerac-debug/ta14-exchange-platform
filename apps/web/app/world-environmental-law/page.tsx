'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Jurisdiction = {
  id: string;
  code: string;
  name: string;
  region: string;
  x: number;
  y: number;
  authority: string;
  instruments: string[];
  note: string;
};

const jurisdictions: Jurisdiction[] = [
  { id:'us', code:'US', name:'United States', region:'North America', x:20, y:35, authority:'Federal + state + tribal + local', instruments:['Clean Air Act','Clean Water Act','Safe Drinking Water Act','RCRA · CERCLA · TSCA'], note:'Open federal authority first, then descend into state and local implementation.' },
  { id:'ca', code:'CA', name:'Canada', region:'North America', x:21, y:22, authority:'Federal + provincial + territorial', instruments:['Canadian Environmental Protection Act','Impact Assessment Act','Fisheries Act'], note:'Preserve federal and provincial competence separately.' },
  { id:'br', code:'BR', name:'Brazil', region:'South America', x:34, y:67, authority:'Federal + state + municipal', instruments:['National Environmental Policy framework','Environmental Crimes framework','Forest protection framework'], note:'Map licensing, enforcement and environmental competence to the responsible authority.' },
  { id:'eu', code:'EU', name:'European Union', region:'Europe', x:51, y:31, authority:'EU law + Member State implementation', instruments:['Ambient Air Quality framework','Water Framework Directive','Industrial Emissions framework','REACH'], note:'Keep EU-level authority distinct from national transposition and enforcement.' },
  { id:'uk', code:'UK', name:'United Kingdom', region:'Europe', x:47, y:27, authority:'UK + devolved administrations', instruments:['Environment Act framework','Environmental permitting regimes','Air quality duties'], note:'Show England, Scotland, Wales and Northern Ireland separately where authority diverges.' },
  { id:'za', code:'ZA', name:'South Africa', region:'Africa', x:52, y:72, authority:'National + provincial + municipal', instruments:['National Environmental Management Act','Air Quality Act','Water Act framework'], note:'Connect constitutional environmental rights to statutory implementation pathways.' },
  { id:'in', code:'IN', name:'India', region:'Asia', x:66, y:47, authority:'Union + state + local', instruments:['Environment (Protection) Act','Air Act','Water Act'], note:'Map central rules, boards, consent mechanisms and state implementation.' },
  { id:'cn', code:'CN', name:'China', region:'Asia', x:74, y:36, authority:'National + provincial + local', instruments:['Environmental Protection Law','Air Pollution Prevention framework','Water Pollution Prevention framework'], note:'Preserve the legal instrument, issuing authority, locality and current implementing rule.' },
  { id:'jp', code:'JP', name:'Japan', region:'Asia', x:84, y:37, authority:'National + prefectural + municipal', instruments:['Basic Environment framework','Air Pollution Control Act','Water Pollution Control Act'], note:'Tie national controls to local implementation and monitoring duties.' },
  { id:'au', code:'AU', name:'Australia', region:'Oceania', x:82, y:72, authority:'Commonwealth + state + territory', instruments:['EPBC framework','State environmental protection laws','Water and biodiversity regimes'], note:'Do not flatten Commonwealth and state authority into one legal layer.' },
  { id:'global', code:'INT', name:'International Environmental Law', region:'Global', x:58, y:12, authority:'Treaties + protocols + conventions', instruments:['Montreal Protocol','Paris Agreement','Basel Convention','Convention on Biological Diversity'], note:'Show treaty status, parties, implementation and whether a provision is binding, procedural or aspirational.' },
];

const domains = ['Air & Atmosphere','Water','Waste & Chemicals','Climate','Biodiversity','Buildings & Indoor Environment','Environmental Evidence','Permitting & Enforcement'];

export default function WorldEnvironmentalLawPage(){
  const [selectedId,setSelectedId]=useState('global');
  const [query,setQuery]=useState('');
  const selected=jurisdictions.find(j=>j.id===selectedId) ?? jurisdictions[0];
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return jurisdictions;
    return jurisdictions.filter(j=>[j.name,j.region,j.authority,...j.instruments].join(' ').toLowerCase().includes(q));
  },[query]);

  return <main className="page">
    <div className="atmosphere" aria-hidden="true"><i/><i/><i/></div>
    <nav className="nav shell">
      <Link href="/atlas-front-door" className="brand"><b>TA-14</b><span>AUTHORITY GOVERNANCE INSTITUTION</span></Link>
      <div><Link href="#world-map">WORLD MAP</Link><Link href="#law-stack">LAW STACK</Link><Link href="/governance-library/laws">SOURCE LIBRARY</Link><Link href="/academy">ACADEMY</Link></div>
      <Link href="/law-standards-public-policy" className="legacy">LEGACY LAW DIVISION ↗</Link>
    </nav>

    <section className="hero shell">
      <div className="heroCopy">
        <small>FOURTH DOOR · WORLD ENVIRONMENTAL LAW</small>
        <h1>Every place has a law.<br/><em>Every law has a boundary.</em></h1>
        <p>Navigate environmental authority by place, jurisdiction, instrument and consequence. Preserve the law as it actually exists. Then inspect what TA-14 believes must be added for evidence, admissibility, binding authority, execution integrity and verified outcomes.</p>
        <div className="heroButtons"><a href="#world-map">ENTER THE WORLD MAP ↓</a><Link href="/governance-library/laws">OPEN SOURCE LAW LIBRARY ↗</Link></div>
        <div className="rule"><b>GOVERNING RULE</b><span>TA-14 interpretation does not replace law. Current law, proposed upgrades, standards and governance analysis remain visibly separate.</span></div>
      </div>
      <div className="planet" aria-label="World Environmental Law globe"><div className="globe"><i className="lat a"/><i className="lat b"/><i className="lat c"/><i className="lon a"/><i className="lon b"/><i className="lon c"/><strong>WORLD<br/>LAW</strong></div><span>JURISDICTION → AUTHORITY → DUTY → EVIDENCE → CONSEQUENCE</span></div>
    </section>

    <section className="stats shell"><article><strong>GLOBAL</strong><span>Jurisdiction-first navigation</span></article><article><strong>4 LAYERS</strong><span>International · national · regional · local</span></article><article><strong>2 VIEWS</strong><span>What law says · what TA-14 adds</span></article><article><strong>LIVE MODEL</strong><span>Coverage expands without pretending completion</span></article></section>

    <section className="mapSection shell" id="world-map">
      <div className="heading"><small>THE WORLD IS THE INDEX</small><h2>Choose a jurisdiction. Open the governing instruments attached to that place.</h2><p>This first production shell seeds major jurisdictions and international instruments. It is intentionally explicit that global coverage is not yet complete.</p></div>
      <div className="search"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search country, region, law, authority…"/><span>{filtered.length} jurisdiction nodes</span></div>
      <div className="mapLayout">
        <div className="worldMap" role="img" aria-label="Interactive world environmental law jurisdiction map">
          <div className="grid"/>
          <div className="continent na">NORTH<br/>AMERICA</div><div className="continent sa">SOUTH<br/>AMERICA</div><div className="continent eu">EUROPE</div><div className="continent af">AFRICA</div><div className="continent as">ASIA</div><div className="continent oc">OCEANIA</div>
          {filtered.map(j=><button key={j.id} className={selectedId===j.id?'marker active':'marker'} style={{left:`${j.x}%`,top:`${j.y}%`}} onClick={()=>setSelectedId(j.id)}><b>{j.code}</b><span>{j.name}</span></button>)}
          <div className="equator"/><div className="prime"/>
        </div>
        <aside className="jurisdictionCard">
          <small>{selected.region} · {selected.code}</small><h3>{selected.name}</h3><p className="authority">{selected.authority}</p>
          <div className="instrumentList">{selected.instruments.map((x,i)=><button key={x}><span>{String(i+1).padStart(2,'0')}</span><b>{x}</b><em>OPEN ↗</em></button>)}</div>
          <p className="note">{selected.note}</p>
          <Link href="/governance-library/laws" className="open">OPEN CONTROLLING SOURCES →</Link>
        </aside>
      </div>
    </section>

    <section className="stack shell" id="law-stack">
      <div className="heading"><small>DO NOT FLATTEN AUTHORITY</small><h2>The same location can sit under several legal layers at once.</h2></div>
      <div className="stackGrid">{[
        ['01','INTERNATIONAL','Treaties, protocols, conventions and transboundary obligations.'],
        ['02','NATIONAL','Constitutions, statutes, national regulations and national authorities.'],
        ['03','REGIONAL / STATE','States, provinces, territories, devolved administrations and supranational implementation.'],
        ['04','LOCAL','Municipal ordinances, permits, building requirements and local enforcement.']
      ].map(([n,t,p])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></article>)}</div>
    </section>

    <section className="comparison shell">
      <div className="heading"><small>THE TA-14 DIFFERENCE</small><h2>Read the law first. Then expose the execution gap without rewriting history.</h2></div>
      <div className="compareGrid"><article className="current"><small>CURRENT LAW</small><h3>What governs now</h3><p>Official instrument, issuing authority, jurisdiction, applicability, duties, prohibitions, evidence requirements, enforcement and current legal status.</p><b>AUTHORITATIVE SOURCE REQUIRED</b></article><div className="bridge">→</div><article className="ta"><small>TA-14 GOVERNANCE ANALYSIS</small><h3>What the execution boundary still needs</h3><p>Record identity, continuity, admissibility, binding consequence, commit authority, execution correspondence, outcome verification and preserved correction history.</p><b>CLEARLY LABELED · CHALLENGEABLE · VERSIONED</b></article></div>
    </section>

    <section className="domains shell"><div className="heading"><small>ENVIRONMENTAL LAW DOMAINS</small><h2>Enter by place or by environmental consequence.</h2></div><div className="domainGrid">{domains.map((d,i)=><button key={d}><span>{String(i+1).padStart(2,'0')}</span><b>{d}</b><em>EXPLORE →</em></button>)}</div></section>

    <section className="roadmap shell"><div><small>BUILD STATUS</small><h2>This is the World Law shell—not a false claim that every jurisdiction is already indexed.</h2><p>Next coverage work is data: authoritative sources, effective dates, hierarchy, applicability, enforcement body, territorial scope, amendment history, source snapshots and TA-14 comparison records.</p></div><div className="roadSteps">{['Jurisdiction registry','Authoritative source records','Law-to-place mapping','Instrument detail pages','TA-14 comparison records','Academy learning routes','Challenge / correction history','Verified global coverage'].map((x,i)=><span key={x}><b>{i<1?'LIVE':'NEXT'}</b>{x}</span>)}</div></section>

    <footer className="footer shell"><b>TA-14 WORLD ENVIRONMENTAL LAW</b><span>NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.</span><Link href="/atlas-front-door">RETURN TO THE FOUR WORLDS ↑</Link></footer>

    <style jsx>{`
      *{box-sizing:border-box}.page{min-height:100vh;background:#050908;color:#eef8f2;font-family:Inter,ui-sans-serif,system-ui;overflow:hidden;position:relative}.shell{width:min(1480px,calc(100% - 56px));margin:auto;position:relative;z-index:2}.atmosphere{position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 72% 8%,rgba(66,216,144,.13),transparent 28%),radial-gradient(circle at 14% 31%,rgba(226,188,97,.09),transparent 24%),linear-gradient(180deg,#07110d,#030504)}.atmosphere i{position:absolute;border:1px solid rgba(117,224,169,.08);border-radius:50%;width:680px;height:680px;right:-260px;top:140px}.atmosphere i:nth-child(2){width:420px;height:420px;right:-120px;top:270px}.atmosphere i:nth-child(3){width:920px;height:920px;left:-620px;top:48%}.nav{height:88px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.09)}.brand{display:flex;align-items:center;gap:13px;color:inherit;text-decoration:none}.brand b{font-size:23px;letter-spacing:-1px;color:#e6c574}.brand span{font-size:10px;letter-spacing:1.5px;color:#a2b5aa;max-width:120px;line-height:1.2}.nav>div{display:flex;gap:26px}.nav a{color:#a9b9b0;text-decoration:none;font-size:11px;letter-spacing:1px}.nav a:hover{color:#e9cb78}.legacy{border:1px solid rgba(230,197,116,.28);padding:11px 14px;border-radius:3px}.hero{display:grid;grid-template-columns:1.15fr .85fr;min-height:650px;align-items:center;gap:70px}.heroCopy>small,.heading small,.roadmap small{letter-spacing:2.2px;color:#dcb85e;font-weight:800;font-size:11px}.hero h1{font-size:74px;line-height:.98;letter-spacing:-4.5px;margin:18px 0 26px}.hero h1 em{font-style:normal;color:#86e1ad}.hero p{font-size:17px;line-height:1.8;color:#aebdb5;max-width:780px}.heroButtons{display:flex;gap:12px;margin:32px 0}.heroButtons a,.open{padding:14px 18px;border:1px solid rgba(134,225,173,.35);color:#e9fff3;text-decoration:none;font-size:11px;font-weight:800;letter-spacing:.7px;background:rgba(46,128,84,.11)}.heroButtons a:first-child{background:#b5903e;color:#09100c;border-color:#d8b966}.rule{border-left:2px solid #d0ae59;padding:12px 0 12px 17px;display:flex;gap:18px;max-width:760px}.rule b{font-size:10px;color:#e2c06a;white-space:nowrap}.rule span{font-size:12px;color:#9eaea5;line-height:1.5}.planet{display:flex;flex-direction:column;align-items:center;gap:24px}.globe{width:390px;height:390px;border:1px solid rgba(114,232,164,.34);border-radius:50%;position:relative;display:grid;place-items:center;background:radial-gradient(circle at 34% 30%,rgba(74,211,134,.2),rgba(9,34,23,.55) 46%,rgba(2,7,5,.95) 70%);box-shadow:0 0 120px rgba(70,205,132,.14),inset -50px -50px 80px rgba(0,0,0,.7)}.globe:after{content:'';position:absolute;inset:10%;border-radius:50%;background:radial-gradient(ellipse at 33% 34%,rgba(118,219,153,.36) 0 6%,transparent 7%),radial-gradient(ellipse at 44% 40%,rgba(118,219,153,.23) 0 12%,transparent 13%),radial-gradient(ellipse at 63% 45%,rgba(118,219,153,.28) 0 16%,transparent 17%),radial-gradient(ellipse at 70% 66%,rgba(118,219,153,.2) 0 9%,transparent 10%);filter:blur(1px)}.globe strong{position:relative;z-index:4;text-align:center;font-size:38px;line-height:.9;letter-spacing:-2px;color:#f0d27f;text-shadow:0 0 25px rgba(239,204,109,.25)}.lat,.lon{position:absolute;inset:15%;border:1px solid rgba(153,244,189,.16);border-radius:50%}.lat.a{transform:scaleY(.35)}.lat.b{transform:scaleY(.65)}.lat.c{transform:scaleY(.82)}.lon.a{transform:scaleX(.3)}.lon.b{transform:scaleX(.6)}.lon.c{transform:rotate(64deg) scaleX(.42)}.planet>span{font-size:9px;letter-spacing:1.8px;color:#73877c}.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,.09);border-bottom:1px solid rgba(255,255,255,.09)}.stats article{padding:25px;border-right:1px solid rgba(255,255,255,.08)}.stats strong{display:block;color:#e3c36c;font-size:18px}.stats span{font-size:11px;color:#91a197}.mapSection,.stack,.comparison,.domains,.roadmap{padding:100px 0}.heading{max-width:900px;margin-bottom:40px}.heading h2,.roadmap h2{font-size:46px;letter-spacing:-2.2px;margin:12px 0}.heading p,.roadmap p{color:#95a69d;line-height:1.7}.search{display:flex;justify-content:space-between;align-items:center;margin:0 0 18px}.search input{width:min(520px,100%);background:#09120e;border:1px solid rgba(134,225,173,.18);padding:14px 16px;color:white;outline:none}.search span{font-size:10px;color:#788b80;letter-spacing:1px}.mapLayout{display:grid;grid-template-columns:1fr 390px;gap:18px}.worldMap{height:650px;border:1px solid rgba(137,222,173,.18);background:radial-gradient(circle at 50% 48%,rgba(20,65,43,.23),transparent 52%),#07100c;position:relative;overflow:hidden}.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(127,220,165,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(127,220,165,.055) 1px,transparent 1px);background-size:5% 10%}.equator{position:absolute;left:0;right:0;top:50%;border-top:1px dashed rgba(208,174,89,.2)}.prime{position:absolute;top:0;bottom:0;left:50%;border-left:1px dashed rgba(208,174,89,.16)}.continent{position:absolute;color:rgba(116,196,149,.13);font-weight:900;font-size:38px;line-height:.85;letter-spacing:-2px}.continent.na{left:9%;top:26%}.continent.sa{left:27%;top:58%}.continent.eu{left:44%;top:24%;font-size:25px}.continent.af{left:46%;top:50%}.continent.as{left:64%;top:28%;font-size:44px}.continent.oc{left:76%;top:69%;font-size:24px}.marker{position:absolute;transform:translate(-50%,-50%);background:transparent;border:0;cursor:pointer;z-index:3;color:white}.marker b{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;border:1px solid #6fcc97;background:#0b2418;color:#b9f5d0;box-shadow:0 0 0 6px rgba(85,212,138,.06),0 0 22px rgba(87,211,139,.13)}.marker span{display:block;white-space:nowrap;font-size:9px;margin-top:5px;color:#98aaa0}.marker.active b,.marker:hover b{background:#d0ae59;color:#07100c;border-color:#f1d37f;box-shadow:0 0 0 8px rgba(208,174,89,.08),0 0 30px rgba(208,174,89,.25)}.jurisdictionCard{border:1px solid rgba(230,197,116,.22);background:linear-gradient(180deg,rgba(25,33,27,.95),rgba(7,12,9,.98));padding:28px}.jurisdictionCard>small{font-size:10px;color:#d2b35f;letter-spacing:1.5px}.jurisdictionCard h3{font-size:34px;margin:9px 0}.authority{color:#8ea096;font-size:12px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:18px}.instrumentList{display:grid;gap:8px;margin:20px 0}.instrumentList button{display:grid;grid-template-columns:30px 1fr auto;align-items:center;text-align:left;gap:8px;background:#0b1510;border:1px solid rgba(255,255,255,.07);padding:13px;color:#e8f1ec}.instrumentList button span{color:#668275;font-size:9px}.instrumentList button b{font-size:11px}.instrumentList button em{font-style:normal;font-size:9px;color:#d8b75f}.note{font-size:12px!important;line-height:1.6!important;color:#90a097!important}.open{display:block;margin-top:20px;text-align:center}.stack{border-top:1px solid rgba(255,255,255,.07)}.stackGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.stackGrid article{padding:26px;border:1px solid rgba(255,255,255,.08);background:#07100c}.stackGrid span{color:#d2b15b;font-weight:800}.stackGrid h3{font-size:17px}.stackGrid p{font-size:12px;color:#8fa096;line-height:1.6}.compareGrid{display:grid;grid-template-columns:1fr 70px 1fr;align-items:stretch}.compareGrid article{padding:38px;border:1px solid rgba(255,255,255,.1)}.compareGrid h3{font-size:31px;margin:8px 0}.compareGrid p{color:#9aaca1;line-height:1.75}.compareGrid b{font-size:9px;letter-spacing:1.5px}.current{background:rgba(207,169,75,.06)}.current small,.current b{color:#e0bd66}.ta{background:rgba(62,183,111,.06)}.ta small,.ta b{color:#7ee0a8}.bridge{display:grid;place-items:center;font-size:38px;color:#587064}.domainGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.domainGrid button{min-height:110px;background:#08110d;border:1px solid rgba(255,255,255,.08);color:white;text-align:left;padding:18px;display:grid;grid-template-columns:30px 1fr auto;align-items:center}.domainGrid span{font-size:9px;color:#6f8277}.domainGrid b{font-size:14px}.domainGrid em{font-size:9px;color:#d6b65d;font-style:normal}.roadmap{display:grid;grid-template-columns:1fr 1fr;gap:70px;border-top:1px solid rgba(255,255,255,.08)}.roadSteps{display:grid;grid-template-columns:1fr 1fr;gap:8px}.roadSteps span{border:1px solid rgba(255,255,255,.08);padding:15px;color:#c8d5ce;font-size:11px}.roadSteps b{display:block;font-size:8px;color:#d4b35c;margin-bottom:5px}.footer{min-height:100px;border-top:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between;font-size:10px;letter-spacing:1px;color:#82938a}.footer b{color:#e0c16c}.footer a{color:#aac0b3;text-decoration:none}@media(max-width:980px){.nav>div,.legacy{display:none}.hero{grid-template-columns:1fr;padding:70px 0}.hero h1{font-size:54px}.planet{display:none}.stats{grid-template-columns:1fr 1fr}.mapLayout{grid-template-columns:1fr}.worldMap{height:500px}.jurisdictionCard{min-height:0}.stackGrid,.domainGrid{grid-template-columns:1fr 1fr}.roadmap{grid-template-columns:1fr}.compareGrid{grid-template-columns:1fr}.bridge{height:60px;transform:rotate(90deg)}}@media(max-width:620px){.shell{width:min(100% - 28px,1480px)}.hero h1{font-size:43px;letter-spacing:-2.6px}.heading h2,.roadmap h2{font-size:34px}.stats,.stackGrid,.domainGrid,.roadSteps{grid-template-columns:1fr}.mapSection,.stack,.comparison,.domains,.roadmap{padding:70px 0}.worldMap{height:420px}.continent{font-size:20px}.marker span{display:none}.search span{display:none}.footer{flex-direction:column;justify-content:center;gap:12px}}
    `}</style>
  </main>
}
