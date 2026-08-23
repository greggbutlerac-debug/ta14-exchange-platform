import Link from 'next/link';

export const metadata = {
  title: 'Keystone RC8 | TA-14 Governed Showcase',
  description: 'TA-14 governed showcase for the frozen Keystone v1.0.0-rc8 financial-execution architecture registered as TA-14-AIGR-000026.',
};

const claims = [
  'Identity, authority, and execution permission are distinct governance states.',
  'Technical capability, model output, or identity credentials alone do not create execution authority.',
  'A governed execution permission is required before a consequence-bearing financial action proceeds.',
  'Authorization is payload-bound to the specific governed action.',
  'Defined governance boundaries fail closed when required execution conditions cannot be established.',
  'Relevant conditions are revalidated at the execution boundary.',
  'Provenance and evidence of governed determinations and execution decisions are preserved.',
  'An AI component cannot independently create the authority required to authorize its own financial execution.',
];

const boundaries = [
  'Not regulatory or legal approval.',
  'Not TA-14 certification or endorsement.',
  'Not production-readiness certification.',
  'Not universal security or immunity from compromise.',
  'Not proof that RC8 trust-anchor or registration-continuity hardening is solved.',
  'Not blanket validation of successor releases or propositions outside the frozen evidence boundary.',
];

export default function KeystoneShowcase(){
  return <main style={{minHeight:'100vh',padding:'70px 22px 100px',background:'radial-gradient(circle at 85% 0,rgba(65,210,255,.17),transparent 32%),radial-gradient(circle at 10% 30%,rgba(67,235,169,.09),transparent 28%),#040a12',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{maxWidth:1180,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <div><div style={{fontSize:11,letterSpacing:2.1,color:'#71e7ff',fontWeight:900}}>TA-14 GOVERNED SHOWCASE · EXTERNAL ARCHITECTURE</div><div style={{marginTop:7,color:'#7ff0bd',fontWeight:850}}>TA-14-AIGR-000026 · REGISTERED AUGUST 23, 2026</div></div>
        <Link href="/registry/records/TA-14-AIGR-000026" style={{color:'#dbeaf5',textDecoration:'none',border:'1px solid rgba(113,231,255,.25)',padding:'11px 15px',borderRadius:10}}>Open Permanent Registry Record</Link>
      </div>

      <section style={{marginTop:28,padding:'clamp(28px,5vw,54px)',border:'1px solid rgba(113,231,255,.18)',borderRadius:26,background:'linear-gradient(145deg,rgba(10,30,46,.92),rgba(5,14,24,.96))',boxShadow:'0 30px 90px rgba(0,0,0,.3)'}}>
        <div style={{color:'#7ff0bd',fontSize:12,fontWeight:900,letterSpacing:'.16em'}}>ELIAS SYSTEMS LTD · GARY WILLIAMS</div>
        <h1 style={{fontSize:'clamp(52px,9vw,104px)',lineHeight:.88,letterSpacing:'-.065em',margin:'18px 0 20px'}}>KEYSTONE</h1>
        <p style={{fontSize:'clamp(22px,3vw,34px)',lineHeight:1.2,margin:'0 0 22px',maxWidth:900}}>Governed financial execution where <strong style={{color:'#71e7ff'}}>capability does not equal authority.</strong></p>
        <p style={{color:'#a8bbc8',fontSize:17,lineHeight:1.8,maxWidth:900}}>Keystone v1.0.0-rc8 is preserved here as a frozen historical baseline. It governs the execution boundary through identity, authority, permission, payload-bound authorization, fail-closed behavior, execution-time revalidation, and provenance. The point of this showcase is not to make Keystone bigger than its evidence. It is to make the evidence boundary visible.</p>
        <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:26}}>{['FROZEN RC8','256 / 256 REPORTED SYSTEM TESTS','PUBLIC EVIDENCE','ADVERSE FINDING PRESERVED'].map(x=><b key={x} style={{padding:'8px 11px',borderRadius:999,border:'1px solid rgba(127,240,189,.24)',color:'#7ff0bd',fontSize:10,letterSpacing:'.08em'}}>{x}</b>)}</div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,margin:'24px 0'}}>{[['Architecture','Governed financial execution'],['Version','v1.0.0-rc8'],['Claimant','Gary Williams'],['Organization','Elias Systems Ltd'],['Registry','TA-14-AIGR-000026'],['Baseline date','August 22, 2026']].map(([k,v])=><div key={k} style={{padding:18,border:'1px solid rgba(113,231,255,.12)',borderRadius:14,background:'rgba(7,18,30,.78)'}}><small style={{color:'#71899a',textTransform:'uppercase',letterSpacing:1.2}}>{k}</small><div style={{marginTop:7,fontWeight:850}}>{v}</div></div>)}</section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:15,marginTop:32}}>
        <article style={{padding:28,border:'1px solid rgba(113,231,255,.14)',borderRadius:18,background:'rgba(7,18,30,.72)'}}><div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>WHAT KEYSTONE CLAIMS</div><div style={{marginTop:17,display:'grid',gap:11}}>{claims.map((x,i)=><div key={x} style={{display:'grid',gridTemplateColumns:'28px 1fr',gap:10,color:'#afc1cd',lineHeight:1.6}}><b style={{color:'#7ff0bd'}}>{String(i+1).padStart(2,'0')}</b><span>{x}</span></div>)}</div></article>
        <article style={{padding:28,border:'1px solid rgba(242,204,104,.18)',borderRadius:18,background:'linear-gradient(145deg,rgba(242,204,104,.045),rgba(7,18,30,.78))'}}><div style={{color:'#f2cc68',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>WHAT THIS RECORD DOES NOT CLAIM</div><div style={{marginTop:17,display:'grid',gap:12}}>{boundaries.map(x=><div key={x} style={{padding:'11px 13px',borderLeft:'3px solid #f2cc68',background:'rgba(242,204,104,.04)',color:'#aebdc8',lineHeight:1.55}}>{x}</div>)}</div></article>
      </section>

      <section style={{marginTop:32,padding:30,border:'1px solid rgba(242,204,104,.24)',borderRadius:20,background:'linear-gradient(135deg,rgba(50,38,9,.42),rgba(7,18,30,.82))'}}>
        <div style={{color:'#f2cc68',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>PRESERVED ADVERSE CONDITION · H4/H5</div>
        <h2 style={{fontSize:32,margin:'11px 0 12px'}}>The weakness stays attached to the frozen version.</h2>
        <p style={{color:'#b6c4ce',lineHeight:1.8,fontSize:16,margin:0}}>The RC8 record preserves a bounded trust-anchor and registration-continuity condition in which an unrelated K2 replacement could inherit a K1 checkpoint without authorized rotation. The condition is not erased by the 256/256 reported test position. Any correction belongs to a distinct successor release with its own evidence and, where applicable, re-examination.</p>
      </section>

      <section style={{marginTop:32,padding:30,border:'1px solid rgba(127,240,189,.2)',borderRadius:20,background:'linear-gradient(135deg,rgba(24,74,57,.22),rgba(7,18,30,.82))'}}>
        <div style={{color:'#7ff0bd',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>WHY THIS BASELINE MATTERS NOW</div>
        <h2 style={{fontSize:32,margin:'11px 0 12px'}}>The comparison can begin without moving either architecture.</h2>
        <p style={{color:'#b6c9c0',lineHeight:1.8,fontSize:16,margin:0}}>Keystone RC8 is now a dated, attributable, versioned object that predates the proposed bounded comparison with TA-14 Financial Execution Integrity Governance. That allows the Exchange to examine overlap, complementarity, or interface without rewriting Keystone after exposure to TA-14 FEIG and without presuming that similar terminology means equivalent architecture.</p>
      </section>

      <section style={{marginTop:32,padding:30,border:'1px solid rgba(113,231,255,.18)',borderRadius:20,background:'rgba(6,20,32,.78)'}}>
        <div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>PROPOSED NEXT GATE · NOT YET A FINDING</div>
        <h2 style={{fontSize:32,margin:'11px 0 12px'}}>Keystone × TA-14 FEIG bounded interoperability examination</h2>
        <p style={{color:'#aebfcb',lineHeight:1.8,fontSize:16,margin:0}}>Freeze one proposition before testing: can an action that satisfies Keystone identity, authority, permission, and payload-bound authorization still be withheld when TA-14 independently finds that the evidence required for admissible financial consequence lacks present standing? The examination should preserve both sovereign architectures and allow SUPPORTED, PARTIALLY SUPPORTED, NOT SUPPORTED, HOLD, or ESCALATE-type outcomes according to the evidence.</p>
      </section>

      <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:32}}><Link href="/registry/records/TA-14-AIGR-000026" style={{padding:'13px 17px',borderRadius:11,textDecoration:'none',fontWeight:850,background:'linear-gradient(135deg,#71e7ff,#3ba4c7)',color:'#03131a'}}>Permanent Registry Record →</Link><Link href="/artifacts/interoperability-examinations" style={{padding:'13px 17px',borderRadius:11,textDecoration:'none',fontWeight:850,border:'1px solid rgba(127,240,189,.24)',color:'#c9f6df'}}>Interoperability Examinations</Link><Link href="/artifacts" style={{padding:'13px 17px',borderRadius:11,textDecoration:'none',fontWeight:850,border:'1px solid rgba(113,231,255,.18)',color:'#dbeaf5'}}>Artifact Registry</Link></div>
    </div>
  </main>;
}
