import Link from 'next/link';

export const metadata = {
  title: 'Atmospheric Integrity Records (AIR) | TA14 Authority Governance Institution',
  description: 'Independent educational demonstration of outdoor and indoor atmospheric observations, provenance, continuity, admissibility, authority and verified environmental outcomes.'
};

const chapters = [
  {name:'01 · Atmospheric reality', body:'Outdoor and indoor environments are connected, but not interchangeable. Weather, outdoor sources, building envelope, ventilation, filtration, occupancy and indoor sources affect conditions. Record the boundary and the context before interpreting observations.'},
  {name:'02 · Observation', body:'Identify pollutant, unit, sampling location, averaging period, device, calibration status and environmental conditions. A reading is a candidate observation—not proof of personal dose, disease, source attribution or compliance.'},
  {name:'03 · Record', body:'Preserve original readings with time, provenance, instrument identity, custody, corrections and access history. Keep raw and adjusted values separate, with methods and uncertainty disclosed.'},
  {name:'04 · Continuity', body:'Track missing intervals, instrument replacement, location changes, ventilation changes and other breaks. A record cannot silently bridge an unobserved period or a changed physical condition.'},
  {name:'05 · Admissibility', body:'Examine whether the evidence is sufficient for the specific proposed claim. Indoor/outdoor comparisons require aligned time windows, appropriate instruments and contextual limitations. Observed is not inferred. Inferred is not authorized.'},
  {name:'06 · Authority and standing', body:'Identify who proposes an action, who is affected, the applicable legal and operational authority, consent and the scope of permission. TA14 does not itself grant regulatory, medical or building-control authority.'},
  {name:'07 · Bounded intervention', body:'Describe the proposed HVAC, filtration, source-control or public-health action, the authorized actor, permitted limits, safety constraints and evidence required before execution. A dashboard recommendation is not a command.'},
  {name:'08 · Verified outcome', body:'Preserve post-intervention observations, changed conditions, comparison methods and uncertainty. A measured environmental change does not by itself establish reduced individual exposure, clinical benefit or causation.'}
];
const links=[
  ['/environmental-integrity-governance','Environmental Integrity Governance (EIG)'],
  ['/environmental-integrity-governance/pair','Personal Atmospheric Integrity Records (PAIR)'],
  ['/showrooms/tamale-community-air-evidence','Community air evidence · Tamale'],
  ['/showrooms/school-air-quality-governance','School air quality governance'],
  ['/showrooms/environmental-accountability','Environmental accountability']
];
export default function AtmosphericIntegrityRecords() {
 return <main style={{maxWidth:1000,margin:'0 auto',padding:'48px 24px 100px',lineHeight:1.7}}>
  <nav><Link href="/showrooms/environmental-atmospheric">← Environmental & Atmospheric</Link> · <Link href="/showrooms">All Showrooms</Link></nav>
  <p style={{letterSpacing:'.1em',fontSize:13,marginTop:38}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT EDUCATIONAL ARCHITECTURE</p>
  <h1 style={{fontSize:'clamp(2rem,5vw,4rem)',lineHeight:1.1}}>Atmospheric Integrity Records <span style={{whiteSpace:'nowrap'}}>(AIR)</span></h1>
  <p style={{fontSize:'1.35rem'}}>One atmosphere. Indoor and outdoor reality. Defensible evidence.</p>
  <p><strong>EDUCATIONAL DEMONSTRATION · NO LIVE MONITORING · NO FROZEN BASELINE · NO FORMAL DISPOSITION.</strong> All scenarios are illustrative. This page does not assert clinical efficacy, regulatory approval, independent validation, or endorsement by third parties.</p>
  <section style={{padding:'24px',border:'1px solid currentColor',borderRadius:12,margin:'32px 0'}}>
   <h2>The governing question</h2>
   <p><strong>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</strong></p>
   <p>Atmospheric Integrity Records preserve what was observed, where, when, how, and under which limitations. AIR does not convert observation into diagnosis, prediction into permission, or intervention into verified benefit.</p>
  </section>
  <h2>Eight evidence-to-consequence chapters</h2>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:16}}>
   {chapters.map(c=><article key={c.name} style={{padding:22,border:'1px solid #7776',borderRadius:12}}><h3>{c.name}</h3><p>{c.body}</p></article>)}
  </div>
  <section style={{marginTop:36}}>
   <h2>Illustrative classroom crossing</h2>
   <p>Outdoor PM2.5 increases during a regional smoke episode. An indoor sensor also reports elevated PM2.5. The observations must be preserved with timestamps, sensor metadata, ventilation state, window position, occupancy and uncertainty. The two readings alone do not prove infiltration rate, personal exposure or health harm.</p>
   <p>A proposed filtration or ventilation adjustment remains a <strong>proposed consequence</strong> until claim-specific evidence, applicable authority, standing and safe execution limits are established. After any authorized intervention, record actual execution and compare relevant post-condition measurements without overstating the result.</p>
  </section>
  <section style={{marginTop:36}}>
   <h2>How AIR connects to TA14</h2>
   <p><strong>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</strong></p>
   <p>Possible dispositions at an examined consequence boundary: <strong>ALLOW / HOLD / DENY / ESCALATE</strong>. No disposition is issued by this teaching room.</p>
   <ul>{links.map(([href,label])=><li key={href}><Link href={href}>{label} →</Link></li>)}</ul>
  </section>
  <p style={{marginTop:36}}><Link href="/showrooms/environmental-atmospheric">← Return to Environmental & Atmospheric showrooms</Link></p>
 </main>;
}
