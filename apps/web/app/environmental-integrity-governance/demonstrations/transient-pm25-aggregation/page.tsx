import Link from 'next/link';

const windows=[
  ['1-MINUTE EVENT','A short PM2.5 excursion is preserved at native time resolution.','EVENT VISIBLE'],
  ['15-MINUTE SUMMARY','The same excursion is diluted by surrounding lower measurements.','SIGNAL REDUCED'],
  ['24-HOUR AVERAGE','The transient event may disappear inside an apparently ordinary daily value.','EVENT OBSCURED'],
] as const;

export default function TransientPM25AggregationDemo(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#3b2910 0,#151007 38%,#060504 78%)',color:'#fff8e9',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(255,211,104,.2)'}}><Link href='/environmental-integrity-governance/demonstrations' style={{color:'#f0cf75',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL PROVING GROUND</Link></nav>
    <section style={{maxWidth:1200,margin:'0 auto',padding:'76px 24px 34px'}}>
      <p style={{color:'#f0cf75',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>EIG DEMONSTRATION 004 · R1 · TIME-RESOLUTION FAILURE</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(42px,7vw,78px)',lineHeight:.98,margin:'14px 0 20px'}}>When the average<br/>erases the event.</h1>
      <p style={{maxWidth:900,color:'#d5c9ae',fontSize:18,lineHeight:1.7}}>A measurement can be mathematically correct and still be evidentially inadequate for a different proposition. This demonstration tests whether temporal aggregation is allowed to conceal a short-duration particulate event that may matter to the consequence under review.</p>
      <div style={{marginTop:24,padding:18,border:'1px solid rgba(255,211,104,.35)',background:'rgba(85,58,8,.2)',color:'#f1d994'}}><strong>NON-CLAIM:</strong> This demonstration does not establish a medical diagnosis, individual health causation, a universal PM2.5 safety threshold, or that every transient excursion requires intervention. It governs preservation and use of time-resolved evidence.</div>
    </section>
    <section style={{maxWidth:1200,margin:'0 auto',padding:24,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14}}>{windows.map(([title,body,state])=><article key={title} style={{padding:26,border:'1px solid rgba(255,211,104,.22)',background:'rgba(37,27,10,.72)',borderRadius:18}}><small style={{color:'#f0cf75',fontWeight:900}}>{title}</small><h2 style={{fontFamily:'Georgia,serif',fontSize:31,margin:'10px 0'}}>{state}</h2><p style={{color:'#d1c4a8',lineHeight:1.7}}>{body}</p></article>)}</section>
    <section style={{maxWidth:1200,margin:'20px auto',padding:24}}><div style={{padding:30,border:'1px solid rgba(255,146,106,.4)',background:'rgba(66,22,9,.42)',borderRadius:18}}><small style={{color:'#ffad8e',fontWeight:900,letterSpacing:'.14em'}}>GOVERNANCE FAILURE CONDITION</small><h2 style={{fontFamily:'Georgia,serif',fontSize:40,margin:'8px 0'}}>Aggregation cannot silently substitute for the evidence resolution required by the proposition.</h2><p style={{color:'#e2c7b8',lineHeight:1.75,maxWidth:1000}}>If the governed question concerns whether a short-duration environmental event occurred, a daily average cannot be treated as though it answered that question merely because it was calculated correctly. The native event record, aggregation method, time window, missingness, instrument identity, context, and intended consequence must remain distinguishable.</p></div></section>
    <section style={{maxWidth:1200,margin:'0 auto',padding:'24px 24px 90px'}}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12}}>{[
      ['P1','Did a transient event occur?','Requires time resolution capable of preserving the event.'],
      ['P2','What was the longer-period average?','May properly use an explicitly declared aggregation window.'],
      ['P3','Does the event authorize intervention?','Requires proposition-specific admissibility, authority, context, and present standing.'],
      ['P4','Did conditions change afterward?','Requires revalidation before stale evidence crosses Commit.'],
    ].map(([p,t,b])=><article key={p} style={{padding:22,border:'1px solid rgba(255,211,104,.18)',background:'rgba(28,21,9,.66)',borderRadius:14}}><small style={{color:'#f0cf75',fontWeight:900}}>{p}</small><strong style={{display:'block',fontSize:19,margin:'8px 0'}}>{t}</strong><p style={{color:'#cbbfa5',lineHeight:1.65,margin:0}}>{b}</p></article>)}</div><blockquote style={{margin:'38px 0 0',padding:'24px 28px',borderLeft:'3px solid #f0cf75',background:'rgba(31,23,9,.68)',fontFamily:'Georgia,serif',fontSize:25,lineHeight:1.45}}>Averages answer questions about averages. They do not automatically answer questions about events.</blockquote></section>
  </main>;
}
