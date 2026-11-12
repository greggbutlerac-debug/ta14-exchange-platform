import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Open Water Integrity Governance (GO-WIG) | TA-14',
  description: 'An open educational proposal for water-quality evidence integrity, accountable intervention and verified outcomes across drinking water and environmental water systems.',
  alternates: { canonical: '/water-integrity-governance' },
};

const steps = [
  ['01', 'OBSERVE', 'Identify the water source, sampling location, operating conditions and proposed consequence.'],
  ['02', 'PRESERVE', 'Record samples, laboratory methods, sensor calibration, provenance, timestamps and uncertainty.'],
  ['03', 'EXAMINE', 'Assess whether the evidence is admissible for the particular determination.'],
  ['04', 'AUTHORIZE', 'Establish applicable law, responsible authority, and standing at the moment of action.'],
  ['05', 'GOVERN', 'Evaluate the proposed intervention and cross-system environmental consequences.'],
  ['06', 'VERIFY', 'Preserve the actual outcome, exceptions, limitations and the next evidence state.'],
];

export default function WaterIntegrityGovernance() {
  return <main style={{background:'#061c29',color:'#eef8fa',minHeight:'100vh',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{width:'min(1100px,calc(100% - 36px))',margin:'auto',padding:'48px 0 80px'}}>
      <nav style={{display:'flex',gap:24,flexWrap:'wrap',fontSize:14}}><Link style={{color:'#9ce4e6'}} href="/">← TA-14 EXCHANGE</Link><Link style={{color:'#9ce4e6'}} href="/indoor-air-governance">GO-IAQG · INDOOR AIR</Link><Link style={{color:'#9ce4e6'}} href="/showrooms/environmental-atmospheric">ENVIRONMENTAL SHOWROOMS</Link></nav>
      <header style={{padding:'72px 0 45px',borderBottom:'1px solid #36596a'}}>
        <p style={{color:'#7ce2d6',fontSize:13,fontWeight:800,letterSpacing:2}}>TA-14 AUTHORITY GOVERNANCE INSTITUTION · OPEN EDUCATIONAL INITIATIVE</p>
        <h1 style={{fontSize:'clamp(44px,7vw,86px)',lineHeight:1.04,letterSpacing:-2,margin:'18px 0'}}>GO-WIG<br/><span style={{color:'#7ce2d6'}}>Global Open Water Integrity Governance</span></h1>
        <p style={{fontSize:'clamp(21px,2.5vw,29px)',lineHeight:1.4,maxWidth:880}}>Water quality is measured. Water integrity is governed.</p>
        <p style={{fontSize:18,lineHeight:1.75,maxWidth:920,color:'#c3d8e0'}}>Water monitoring, laboratory results, treatment systems and digital intelligence can inform decisions. None alone proves that a consequential intervention is supported by admissible evidence and authorized to occur now. GO-WIG proposes an independently examinable connection between water evidence, legitimate authority, action and verified outcomes.</p>
        <a href="#examination" style={{display:'inline-block',background:'#7ce2d6',color:'#05232b',padding:'15px 22px',borderRadius:9,fontWeight:800,textDecoration:'none'}}>EXPLORE THE GOVERNANCE EXAMINATION →</a>
      </header>
      <section style={{padding:'48px 0'}}><h2 style={{fontSize:34}}>Beyond a water-quality score</h2><p style={{fontSize:18,lineHeight:1.7,maxWidth:940}}>GO-WIG is a proposed governance framework, not a water-testing service, a certification, a new water standard or a substitute for established water safety plans. Its initial scope includes drinking-water sources, treatment and distribution; the same principles may be examined for groundwater, surface water, wastewater and industrial discharge, subject to each jurisdiction's distinct requirements.</p></section>
      <section id="examination" style={{padding:'24px 0 50px'}}><h2 style={{fontSize:34}}>Six boundaries of a justified intervention</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16}}>{steps.map(([n,title,copy])=><article key={n} style={{background:'#103244',border:'1px solid #315a69',borderRadius:14,padding:23}}><small style={{color:'#7ce2d6',fontWeight:800}}>{n} · {title}</small><p style={{lineHeight:1.6,fontSize:17}}>{copy}</p></article>)}</div></section>
      <section style={{borderTop:'1px solid #36596a',padding:'42px 0'}}><h2 style={{fontSize:34}}>The TA-14 governance architecture</h2><p style={{fontSize:18,lineHeight:1.7}}>Admissible Execution Architecture (AEA) examines <strong>Admissible Evidence, Applicable Authority, and Established Standing</strong> at the consequence boundary. Environmental Integrity Governance (EIG) examines combined effects across water, energy, public health and ecosystems. Environmental Integrity Records (EIR) preserve attributable measurements, revisions, uncertainty and verified outcomes.</p><p style={{fontSize:18,lineHeight:1.7}}>A proposed change in chemical dosing, treatment settings or distribution operation must be examined against the applicable rules, evidence and safeguards. Required emergency protections, safety interlocks and legally mandated responses must not be delayed or overridden by an unvalidated governance layer.</p></section>
      <section style={{background:'#103244',borderRadius:16,padding:'28px',margin:'20px 0 40px'}}><h2 style={{fontSize:30}}>An invitation to independent technical examination</h2><p style={{fontSize:18,lineHeight:1.7}}>Water utilities, public-health agencies, environmental ministries, universities, laboratories and technology developers are invited to examine the proposal. An initial bounded demonstration can use synthetic or appropriately authorized historical data without controlling live water infrastructure.</p><a href="mailto:ta14admissibleexecution@gmail.com?subject=GO-WIG%20Technical%20Examination" style={{color:'#7ce2d6',fontWeight:800}}>CONTACT TA-14 ABOUT GO-WIG →</a></section>
      <p style={{fontSize:13,lineHeight:1.6,color:'#a9c2cc'}}>Public educational proposal only. No government endorsement, regulatory approval, independent validation, certified water-safety benefit or production deployment is claimed. Any real-world implementation requires independent scientific and engineering validation, applicable legal authority and local safety review.</p>
    </div>
  </main>;
}
