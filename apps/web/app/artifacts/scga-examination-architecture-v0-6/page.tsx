import Link from 'next/link';

export const metadata = {
  title: 'SCGA Examination Architecture v0.6 | TA-14 Governed Examination Record',
  description: 'Permanent TA-14 governed record of the adversarial redesign lineage for the Elias Systems SCGA Examination Architecture through frozen v0.6.',
};

const lineage = [
  {
    version: 'v0.4',
    state: 'ARCHITECTURE REDESIGN CONTINUES',
    findings: '5 findings · 3 BLOCKING · 2 MAJOR',
    detail: 'A materially new primitive/layer/mechanism failure class remained and a materially false strongest-positive pathway remained. SR-1 through SR-4 were INDETERMINATE because the stopping-rule content was not itself contained in the supplied review object.',
  },
  {
    version: 'v0.5',
    state: 'ARCHITECTURE REDESIGN CONTINUES',
    findings: '1 finding · 1 BLOCKING',
    detail: 'The v0.4 failure classes did not reproduce, but B-01 Applicability-Entitlement / Conditional-Gate Suppression remained. Predicate state could still suppress a materially applicable branch without sufficiently establishing exclusion against reality.',
  },
  {
    version: 'v0.6',
    state: 'ARCHITECTURE REDESIGN STOPS',
    findings: '0 BLOCKING · 0 new failure classes',
    detail: 'AP-001 Applicability Entitlement / Predicate-to-Reality Fidelity prevented unresolved applicability from disappearing before dependency closure. No materially false strongest-positive pathway was established within the frozen bounded claim scope.',
  },
] as const;

const hashes = [
  ['Package root SHA-256', '97bf5931dc9c3ec25781299df85235866341f7fc1f733703288e9cfd869493af'],
  ['Exact controlling ZIP SHA-256', 'b956b8c80cd3c5611ffae31b9880153adb5f4d627aa30f7a32eb804f8709e89f'],
  ['Frozen Stopping Rule v1.0 SHA-256', 'f9408ec60d216bbc7b7f3f12a5b1e9709efa9def3dc57b75cf78907013378f8b'],
] as const;

export default function ScgaExaminationArchitectureV06() {
  return (
    <main style={{minHeight:'100vh',padding:'70px 22px 100px',background:'radial-gradient(circle at 84% 0,rgba(94,214,255,.16),transparent 31%),radial-gradient(circle at 8% 38%,rgba(132,255,193,.08),transparent 25%),#040a12',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{maxWidth:1220,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:18,alignItems:'center',flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:11,fontWeight:900,letterSpacing:2.1,color:'#71e7ff'}}>TA-14 GOVERNED EXAMINATION RECORD · ELIAS SYSTEMS LTD</div>
            <div style={{marginTop:7,color:'#82f1bb',fontWeight:850}}>SCGA EXAMINATION ARCHITECTURE · v0.6 · FROZEN FOR EXECUTION</div>
          </div>
          <Link href="/artifacts" style={{color:'#dbeaf5',textDecoration:'none',border:'1px solid rgba(113,231,255,.24)',padding:'11px 15px',borderRadius:10}}>Artifact Registry</Link>
        </div>

        <section style={{marginTop:28,padding:'clamp(30px,5vw,58px)',border:'1px solid rgba(113,231,255,.18)',borderRadius:28,background:'linear-gradient(145deg,rgba(10,31,47,.95),rgba(5,14,24,.98))',boxShadow:'0 30px 90px rgba(0,0,0,.3)'}}>
          <div style={{color:'#f3ce6a',fontWeight:900,fontSize:11,letterSpacing:'.15em'}}>THE EXAMINER HAD TO EARN THE RIGHT TO STOP REDESIGNING</div>
          <h1 style={{fontSize:'clamp(44px,7.5vw,88px)',lineHeight:.92,letterSpacing:'-.055em',margin:'18px 0 22px'}}>SCGA Examination Architecture<br/><span style={{color:'#71e7ff'}}>Adversarial Redesign Closure</span></h1>
          <p style={{fontSize:'clamp(19px,2.5vw,29px)',lineHeight:1.28,maxWidth:1000,margin:0,color:'#c4d7e3'}}>Frozen v0.4 was allowed to lose. Frozen v0.5 was allowed to lose. Frozen v0.6 was attacked under the same pre-frozen stopping rule and reached the condition required to stop architecture redesign.</p>
          <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:28}}>{['0 BLOCKING FINDINGS','0 NEW FAILURE CLASSES','SR-1 · PASS','SR-2 · PASS','SR-3 · PASS','SR-4 · PASS','ARCHITECTURE_REDESIGN_STOPS = TRUE'].map(x=><b key={x} style={{padding:'8px 11px',borderRadius:999,border:'1px solid rgba(130,241,187,.25)',color:'#82f1bb',background:'rgba(130,241,187,.04)',fontSize:9,letterSpacing:'.07em'}}>{x}</b>)}</div>
        </section>

        <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:12,marginTop:24}}>
          {[['Participant','Gary Williams · Elias Systems Ltd'],['Object','Sovereign Constitutional Governance Architecture Examination Architecture'],['Frozen version','v0.6'],['Registry posture','SUBMITTED · permanent identifier pending'],['Examination posture','Architecture frozen for execution'],['SCGA result','NONE PRESUMED']].map(([k,v])=><div key={k} style={{padding:18,border:'1px solid rgba(113,231,255,.12)',borderRadius:14,background:'rgba(7,18,30,.78)'}}><small style={{color:'#71899a',textTransform:'uppercase',letterSpacing:1.1}}>{k}</small><div style={{marginTop:7,fontWeight:850,lineHeight:1.45}}>{v}</div></div>)}
        </section>

        <section style={{marginTop:34}}>
          <div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>FROZEN REDESIGN LINEAGE</div>
          <h2 style={{fontSize:'clamp(30px,4vw,48px)',margin:'9px 0 20px',letterSpacing:'-.035em'}}>Every loss stays attached to the version that earned it.</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))',gap:14}}>{lineage.map((r,i)=><article key={r.version} style={{padding:26,border:`1px solid ${i===2?'rgba(130,241,187,.24)':'rgba(243,206,106,.20)'}`,borderRadius:18,background:i===2?'linear-gradient(145deg,rgba(37,88,65,.22),rgba(7,18,30,.86))':'linear-gradient(145deg,rgba(76,55,12,.16),rgba(7,18,30,.86))'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><b style={{fontSize:28,color:i===2?'#82f1bb':'#f3ce6a'}}>{r.version}</b><span style={{fontSize:9,fontWeight:900,letterSpacing:'.08em',color:'#9fb0bd',textAlign:'right'}}>{r.state}</span></div><h3 style={{fontSize:18,margin:'18px 0 11px'}}>{r.findings}</h3><p style={{color:'#aabcc8',lineHeight:1.72,margin:0}}>{r.detail}</p></article>)}</div>
        </section>

        <section style={{marginTop:34,padding:30,border:'1px solid rgba(113,231,255,.17)',borderRadius:20,background:'rgba(6,20,32,.78)'}}>
          <div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>v0.6 INTEGRITY GATE</div>
          <h2 style={{fontSize:32,margin:'11px 0 17px'}}>Exact object first.</h2>
          <div style={{display:'grid',gap:10}}>{hashes.map(([label,value])=><div key={label} style={{padding:15,border:'1px solid rgba(113,231,255,.10)',borderRadius:12,background:'rgba(1,9,16,.5)'}}><small style={{display:'block',color:'#7f99aa',textTransform:'uppercase',letterSpacing:1}}>{label}</small><code style={{display:'block',marginTop:7,color:'#d9eaf3',fontSize:12,overflowWrap:'anywhere'}}>{value}</code></div>)}</div>
          <p style={{color:'#9db2bf',lineHeight:1.75,margin:'18px 0 0'}}>TA-14 first held the examination when Quick Share transmissions produced ZIP-container hashes that did not reconcile to the frozen controlling ZIP identity, despite 18/18 constituent hashes, package root, and stopping-rule identity matching. The hold was lifted only after the exact producer-controlled ZIP was transmitted by email and independently reconciled. The transport mismatches remain historical transport records, not replacement freeze identities.</p>
        </section>

        <section style={{marginTop:34,padding:30,border:'1px solid rgba(130,241,187,.22)',borderRadius:20,background:'linear-gradient(135deg,rgba(24,75,56,.22),rgba(7,18,30,.82))'}}>
          <div style={{color:'#82f1bb',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>FINAL v0.6 ARCHITECTURE DETERMINATION</div>
          <h2 style={{fontSize:'clamp(30px,4vw,46px)',margin:'10px 0 14px'}}>ARCHITECTURE_REDESIGN_STOPS = TRUE</h2>
          <p style={{color:'#b7cac0',lineHeight:1.8,fontSize:16,margin:0}}>TA-14 established no BLOCKING finding, no materially new primitive/layer/mechanism failure class, and no materially false strongest-positive pathway within the expressly frozen and bounded claim scope. The v0.5 applicability-entitlement failure did not reproduce. SR-1 through SR-4 therefore PASS under the unchanged Frozen Stopping Rule v1.0.</p>
        </section>

        <section style={{marginTop:24,padding:30,border:'1px solid rgba(243,206,106,.24)',borderRadius:20,background:'linear-gradient(135deg,rgba(62,45,10,.26),rgba(7,18,30,.82))'}}>
          <div style={{color:'#f3ce6a',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>CRITICAL BOUNDARY</div>
          <h2 style={{fontSize:32,margin:'10px 0 12px'}}>This is not a finding that SCGA passes.</h2>
          <p style={{color:'#c7c0a8',lineHeight:1.8,fontSize:16,margin:0}}>The result closes the adversarial redesign cycle for the examination architecture. It does not establish that the Sovereign Constitutional Governance Architecture itself possesses or lacks the runtime properties that the frozen examiner will test. Registration is not validation. Survival of examiner redesign is not validation of the target. The substantive SCGA result remains open.</p>
        </section>

        <section style={{marginTop:24,padding:30,border:'1px solid rgba(113,231,255,.15)',borderRadius:20,background:'rgba(7,18,30,.75)'}}>
          <div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>NEXT CONTROLLED GATE</div>
          <h2 style={{fontSize:32,margin:'10px 0 12px'}}>Freeze the execution record. Then let the examination speak.</h2>
          <p style={{color:'#aebfcb',lineHeight:1.8,fontSize:16,margin:0}}>The next chain is a separate SCGA execution/examination chain. The v0.6 examiner is frozen for execution, but no SCGA execution result, validation result, or strongest-positive disposition is presumed by this artifact. Any execution must establish its own current reality, record, continuity, admissibility, binding, commit, execution, and outcome.</p>
        </section>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:32}}>
          <Link href="/artifacts" style={{padding:'13px 17px',borderRadius:11,textDecoration:'none',fontWeight:850,background:'linear-gradient(135deg,#71e7ff,#3ba4c7)',color:'#03131a'}}>Artifact Registry →</Link>
          <Link href="/ai-governance-registry" style={{padding:'13px 17px',borderRadius:11,textDecoration:'none',fontWeight:850,border:'1px solid rgba(130,241,187,.24)',color:'#c9f6df'}}>AI Governance Registry</Link>
        </div>
      </div>
    </main>
  );
}
