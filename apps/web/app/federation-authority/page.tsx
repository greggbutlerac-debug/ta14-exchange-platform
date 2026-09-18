import Link from 'next/link';

export const metadata = {
  title: 'Federation & Authority | TA-14 Exchange',
  description: 'Cross-domain authority context, Authority Passports, Connection Profiles, interoperability evidence, and bounded recognition.',
};

const flow = ['ISSUING DOMAIN','AUTHORITY PASSPORT','CONNECTION PROFILE','RECEIVING DOMAIN'];
const local = ['LOCAL COMPILATION','ADMISSIBILITY','LOCAL LEASE','LOCAL CAPSULE','EFFECT'];
const decisions = ['ACCEPT','ACCEPT_NARROWED','HOLD','REJECT','QUARANTINE','SUSPEND','ESCALATE'];

export default function FederationAuthorityPage(){
  return <main style={{minHeight:'100vh',background:'linear-gradient(180deg,#02080e,#06151c 48%,#02080e)',color:'#eefcff',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{width:'min(1180px,calc(100% - 36px))',margin:'0 auto',padding:'28px 0 90px'}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0 28px',borderBottom:'1px solid #17333b'}}>
        <Link href="/" style={{color:'#fff',textDecoration:'none',fontWeight:900,letterSpacing:'.12em'}}>TA-14 EXCHANGE</Link>
        <span style={{fontSize:11,color:'#78d9d3',letterSpacing:'.12em'}}>FEDERATION & AUTHORITY</span>
      </nav>
      <section style={{padding:'76px 0 50px',maxWidth:930}}>
        <div style={{fontSize:11,fontWeight:900,letterSpacing:'.18em',color:'#70e7e0'}}>AUTHORITY PASSPORT PROTOCOL · CROSS-DOMAIN GOVERNANCE</div>
        <h1 style={{fontSize:'clamp(48px,8vw,92px)',lineHeight:.94,letterSpacing:'-.05em',margin:'18px 0'}}>AUTHORITY CAN TRAVEL.<br/><span style={{color:'#70e7e0'}}>EXECUTION AUTHORITY CANNOT.</span></h1>
        <p style={{fontSize:20,lineHeight:1.65,color:'#a9c3ca',maxWidth:820}}>TA-14 Federation & Authority exposes the governed seam between independent domains: what authority context may cross, what the receiving domain may accept, and what must still be re-established locally before protected consequence.</p>
      </section>
      <section style={{padding:'30px',border:'1px solid #1f4a51',borderRadius:22,background:'rgba(4,20,27,.78)'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.16em',color:'#70e7e0',marginBottom:18}}>CROSS-DOMAIN SEAM</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center'}}>{flow.map((x,i)=><span key={x} style={{padding:'14px 16px',border:'1px solid #2a646a',borderRadius:10,fontSize:11,fontWeight:900}}>{x}{i<flow.length-1?'  →':''}</span>)}</div>
        <div style={{margin:'28px 0 18px',padding:'12px 14px',border:'1px dashed #d8b45f',color:'#e4ca87',fontSize:11,fontWeight:900,letterSpacing:'.1em'}}>BOUNDARY: ACCEPTANCE DOES NOT GRANT COMMIT OR EXECUTION AUTHORITY</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>{local.map((x,i)=><span key={x} style={{padding:'10px 12px',background:'#071a21',borderRadius:8,color:'#a9c3ca',fontSize:10,fontWeight:800}}>{x}{i<local.length-1?'  →':''}</span>)}</div>
      </section>
      <section style={{padding:'64px 0 20px'}}>
        <h2 style={{fontSize:38,letterSpacing:'-.03em'}}>Enter the federation work.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:14}}>
          {[
            ['AUTHORITY PASSPORT PROTOCOL','Canonical AVP architecture, object model, lifecycle, receipts, revocation, trust and closure.'],
            ['CONNECTION PROFILES','AVP × CNS/CP interface mapping: provider, consumer, positive space, negative space and versioned profile semantics.'],
            ['PASSPORT LAB','Simulate presentation, receipt, narrowing, freshness, revocation and receiving-domain decisions.'],
            ['INTEROPERABILITY TESTS','Run bounded reference vectors and preserve passes, failures, HOLDs and restraint evidence.'],
            ['CONFORMANCE & RECOGNITION','SELF_DECLARED → INDEPENDENT_ASSESSED → TA14_RECOGNIZED, with scope and validity preserved.'],
            ['IMPLEMENTER CENTER','Schemas, fixtures, implementation guidance and evidence requirements for real integrations.']
          ].map(([t,p])=><article key={t} style={{padding:22,border:'1px solid #173f47',borderRadius:15,background:'rgba(3,15,21,.9)'}}><strong style={{fontSize:12,color:'#70e7e0',letterSpacing:'.08em'}}>{t}</strong><p style={{fontSize:13,lineHeight:1.6,color:'#94adb5'}}>{p}</p></article>)}
        </div>
      </section>
      <section style={{padding:'48px 0'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#70e7e0'}}>RECEIVING-DOMAIN DECISIONS</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:9,marginTop:16}}>{decisions.map(x=><span key={x} style={{padding:'9px 12px',border:'1px solid #28545b',borderRadius:8,fontSize:10,fontWeight:900}}>{x}</span>)}</div>
      </section>
      <section style={{padding:30,border:'1px solid #5b4d2a',borderRadius:18,background:'rgba(42,32,8,.28)'}}>
        <div style={{fontSize:10,fontWeight:900,letterSpacing:'.15em',color:'#e4ca87'}}>COMMERCIAL ENTRY</div>
        <h2 style={{fontSize:30,margin:'10px 0'}}>Need to prove a real cross-domain authority seam?</h2>
        <p style={{color:'#aebdc1',lineHeight:1.65}}>Begin with a bounded readiness review. Map what crosses, what does not, what evidence exists, and what the receiving runtime must independently establish before consequence.</p>
        <Link href="/review" style={{display:'inline-block',marginTop:10,padding:'13px 16px',borderRadius:9,background:'#70e7e0',color:'#031216',textDecoration:'none',fontSize:11,fontWeight:900}}>REQUEST TA-14 READINESS REVIEW →</Link>
      </section>
    </div>
  </main>
}
