import Link from 'next/link';

const regions = [
  { name: 'REALITY & EVIDENCE', links: ['Admissible Reality','Record','Continuity','Evidence Governance','Admissible Evidence','Admissible Truth'] },
  { name: 'RELIANCE · AUTHORITY · CONSEQUENCE', links: ['Reliance','Authority','Legitimacy','Consequence Formation','Attachment / Assent'] },
  { name: 'BINDING & COMMIT', links: ['Binding Reality','Binding','Commit Reality','Commit'] },
  { name: 'EXECUTION & NON-OCCURRENCE', links: ['Execution Reality','Admissible Non-Occurrence','Prevented Consequence','Execution'] },
  { name: 'OUTCOME · MEMORY · FUTURE CHAIN', links: ['Outcome Reality','Outcome','New Reality','Memory','Future Chain'] },
];

export default function CanonicalChain24(){
  let n = 0;
  return <section className="chain24">
    <div className="chain24Head">
      <small>TA-14 CANONICAL RUNTIME ARCHITECTURE</small>
      <h2>THE 24-LINK ADMISSIBLE EXECUTION CHAIN</h2>
      <p>The eight public anchors are the parent route. These 24 governed links expose the higher-resolution architecture from Admissible Reality through Future Chain.</p>
    </div>
    <div className="chain24Regions">
      {regions.map(region => <div className="chain24Region" key={region.name}>
        <b>{region.name}</b>
        <div className="chain24Links">{region.links.map(name => { n += 1; return <span key={name}><i>{String(n).padStart(2,'0')}</i>{name}</span>; })}</div>
      </div>)}
    </div>
    <div className="chain24Rule">PRESERVING ADMISSIBILITY IS THE GOAL · NON-EXECUTION CAN BE A GOVERNED SUCCESS</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:10}}>
      <Link className="chain24Cta" href="/academy/24-link-architecture">EXPLORE THE COMPLETE 24-LINK ARCHITECTURE →</Link>
      <Link className="chain24Cta" href="/ai-governance/ta14-architecture-showroom">ENTER THE TA-14 ARCHITECTURE SHOWROOM →</Link>
    </div>
  </section>;
}
