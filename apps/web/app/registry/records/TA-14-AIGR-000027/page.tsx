import Link from 'next/link';

export const metadata = {
  title: 'TA-14-AIGR-000027 | S3DVS Version 1.0',
  description: 'Permanent TA-14 AI Governance Registry record for the frozen S3DVS Version 1.0 baseline.',
};

const evidence = [
  ['01','TA-14 cover letter','Formal submission defining the GRC and physical enforcement boundary.'],
  ['02','Registration dossier','Technical specification of eight memory categories, Dual-Processor separation model, and declared non-claims.'],
  ['03','Empirical evidence report','Hardware Demonstrator evidence covering Demonstrator Protocols 1–10.'],
  ['04','Patent DE 10 2013 005 971 B3','German patent specification for Schadsoftware-sicheres Datenverarbeitungssystem.'],
];

export default function S3DVSRegistryRecord(){
  return <main style={{minHeight:'100vh',padding:'68px 22px 100px',background:'radial-gradient(circle at 84% 0,rgba(78,180,255,.17),transparent 31%),radial-gradient(circle at 8% 34%,rgba(126,240,195,.08),transparent 26%),#040a12',color:'#eef7fb',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{maxWidth:1180,margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <div><div style={{fontSize:11,letterSpacing:2.1,color:'#71e7ff',fontWeight:900}}>TA-14 AI GOVERNANCE REGISTRY · PERMANENT RECORD</div><div style={{marginTop:7,color:'#7ff0bd',fontWeight:850}}>TA-14-AIGR-000027 · FROZEN BASELINE</div></div>
        <Link href="/artifacts/s3dvs-v1" style={{color:'#03131a',textDecoration:'none',fontWeight:900,background:'linear-gradient(135deg,#71e7ff,#7ff0bd)',padding:'11px 16px',borderRadius:10}}>Open Governed Showcase →</Link>
      </div>

      <section style={{marginTop:28,padding:'clamp(28px,5vw,54px)',border:'1px solid rgba(113,231,255,.18)',borderRadius:26,background:'linear-gradient(145deg,rgba(10,30,46,.94),rgba(5,14,24,.97))',boxShadow:'0 30px 90px rgba(0,0,0,.3)'}}>
        <div style={{color:'#7ff0bd',fontSize:12,fontWeight:900,letterSpacing:'.16em'}}>MARIO KOEHN · EXTERNAL ARCHITECTURE</div>
        <h1 style={{fontSize:'clamp(50px,9vw,100px)',lineHeight:.9,letterSpacing:'-.06em',margin:'18px 0 18px'}}>S3DVS</h1>
        <p style={{fontSize:'clamp(21px,3vw,32px)',lineHeight:1.22,margin:'0 0 20px',maxWidth:940}}>A frozen Version 1.0 baseline centered on a <strong style={{color:'#71e7ff'}}>physical consequence boundary</strong> and a declared question of non-bypassability under compromised runtime conditions.</p>
        <p style={{color:'#a8bbc8',fontSize:17,lineHeight:1.8,maxWidth:920}}>This permanent record establishes identity, chronology, evidence scope, and the proposition carried forward into bounded examination. TA-14 preserves the submitted architecture as an attributable object; registration does not convert its claims into TA-14 findings.</p>
        <div style={{display:'flex',gap:9,flexWrap:'wrap',marginTop:25}}>{['VERSION 1.0','FROZEN','4-DOCUMENT EVIDENCE SET','EXAMINATION PENDING'].map(x=><b key={x} style={{padding:'8px 11px',borderRadius:999,border:'1px solid rgba(127,240,189,.24)',color:'#7ff0bd',fontSize:10,letterSpacing:'.08em'}}>{x}</b>)}</div>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,margin:'24px 0'}}>{[['Architecture','S3DVS'],['Version','1.0'],['Claimant','Mario Koehn'],['Registry','TA-14-AIGR-000027'],['Identity','dcb.office.becker@gmail.com'],['Frozen','September 1, 2026']].map(([k,v])=><div key={k} style={{padding:18,border:'1px solid rgba(113,231,255,.12)',borderRadius:14,background:'rgba(7,18,30,.78)'}}><small style={{color:'#71899a',textTransform:'uppercase',letterSpacing:1.2}}>{k}</small><div style={{marginTop:7,fontWeight:850,overflowWrap:'anywhere'}}>{v}</div></div>)}</section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:15,marginTop:32}}>
        <article style={{padding:28,border:'1px solid rgba(113,231,255,.14)',borderRadius:18,background:'rgba(7,18,30,.72)'}}><div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>FROZEN EVIDENCE MANIFEST</div><div style={{marginTop:17,display:'grid',gap:13}}>{evidence.map(([n,t,d])=><div key={n} style={{display:'grid',gridTemplateColumns:'34px 1fr',gap:10}}><b style={{color:'#7ff0bd'}}>{n}</b><div><strong>{t}</strong><div style={{color:'#9fb2bf',lineHeight:1.6,marginTop:4}}>{d}</div></div></div>)}</div></article>
        <article style={{padding:28,border:'1px solid rgba(242,204,104,.18)',borderRadius:18,background:'linear-gradient(145deg,rgba(242,204,104,.045),rgba(7,18,30,.78))'}}><div style={{color:'#f2cc68',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>CLAIM BOUNDARY</div><h2 style={{fontSize:29,margin:'12px 0'}}>Registration is not validation.</h2><p style={{color:'#aebdc8',lineHeight:1.75}}>This record does not certify the patent claims, empirical conclusions, universal security, production readiness, or the proposed non-bypassability proposition. It records what was frozen, by whom, under which identity, and what evidence belongs to that baseline.</p></article>
      </section>

      <section style={{marginTop:32,padding:30,border:'1px solid rgba(127,240,189,.2)',borderRadius:20,background:'linear-gradient(135deg,rgba(24,74,57,.22),rgba(7,18,30,.82))'}}><div style={{color:'#7ff0bd',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>DECLARED NEXT GOVERNED QUESTION</div><h2 style={{fontSize:32,margin:'11px 0 12px'}}>Can the consequence boundary remain physically non-bypassable?</h2><p style={{color:'#b6c9c0',lineHeight:1.8,fontSize:16,margin:0}}>The participant proposes a bounded examination of whether an inadmissible execution remains physically non-bypassable at the consequence boundary even under a compromised runtime. That proposition remains unvalidated until the separately governed examination produces evidence sufficient for a finding.</p></section>

      <section style={{marginTop:32,padding:30,border:'1px solid rgba(113,231,255,.16)',borderRadius:20,background:'rgba(6,20,32,.78)'}}><div style={{color:'#71e7ff',fontWeight:900,fontSize:11,letterSpacing:'.14em'}}>INSTITUTIONAL CONTINUITY</div><p style={{color:'#afc1cd',lineHeight:1.8,fontSize:16,margin:0}}>Independent registration → authenticated identity → frozen baseline → bounded proposition → examination → preserved finding. No authority is transferred by registration. No evidence is rewritten by TA-14. A later result must remain distinguishable from Mario Koehn's registered claim and from the evidence used to examine it.</p></section>
    </div>
  </main>;
}
