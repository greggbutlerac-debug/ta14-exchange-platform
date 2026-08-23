import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TA-14-AIGR-000026 | Keystone',
  description: 'Permanent public TA-14 AI Governance Registry record for Keystone v1.0.0-rc8 by Elias Systems Ltd.',
};

const facts = [
  ['Status','Registered'],['Visibility','Public'],['Registry identifier','TA-14-AIGR-000026'],['Version','v1.0.0-rc8'],
  ['Steward','Gary Williams'],['Organization','Elias Systems Ltd'],['Established','August 22, 2026'],['Registered','August 23, 2026'],
];

const controls = [
  ['Identity','Who or what is acting is distinguished from what it is permitted to do.'],
  ['Authority','Authority is treated as a governed state rather than inferred from capability or credentials alone.'],
  ['Payload-bound permission','Execution permission is associated with the specific governed action under evaluation.'],
  ['Fail-closed boundary','Where required execution conditions cannot be established, the defined boundary can withhold execution.'],
  ['Execution-time revalidation','Relevant conditions are re-evaluated at the execution boundary rather than inherited indefinitely from an earlier state.'],
  ['Provenance','Governed determinations, execution decisions, and relevant evidence are preserved for later examination.'],
];

export default function KeystonePermanentRegistryRecord() {
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 12% 0%,rgba(42,168,210,.22),transparent 30%),radial-gradient(circle at 92% 10%,rgba(74,224,169,.12),transparent 28%),linear-gradient(180deg,#020813,#06111e 48%,#020710)',color:'#f3f6f9',padding:'64px 20px'}}>
    <div style={{width:'min(1080px,100%)',margin:'0 auto'}}>
      <Link href="/workspace/ai-governance/registry/directory" style={{color:'#a9bfd2',textDecoration:'none'}}>← AI Governance Registry</Link>
      <div style={{marginTop:38,border:'1px solid rgba(86,220,255,.24)',borderRadius:28,background:'linear-gradient(135deg,rgba(8,28,45,.94),rgba(4,15,27,.99))',padding:'clamp(28px,6vw,58px)',boxShadow:'0 28px 90px rgba(0,0,0,.34)'}}>
        <div style={{color:'#6fe6ff',fontSize:12,fontWeight:800,letterSpacing:'.15em',textTransform:'uppercase'}}>TA-14 AI Governance Registry · Permanent Public Record</div>
        <h1 style={{margin:'18px 0 10px',fontSize:'clamp(48px,8vw,88px)',lineHeight:.94,letterSpacing:'-.055em'}}>KEYSTONE</h1>
        <p style={{margin:'0 0 12px',color:'#78efbd',fontSize:22,lineHeight:1.5}}>Governed Financial Execution · Elias Systems Ltd</p>
        <p style={{margin:'0 0 32px',color:'#9fb5c4',fontSize:16,lineHeight:1.75,maxWidth:850}}>A frozen historical baseline for a financial-execution architecture built around one governing distinction: <strong style={{color:'#eaf8ff'}}>capability is not authority</strong>. This record preserves Keystone exactly as registered before any later TA-14 Financial Execution Integrity Governance interoperability examination.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14,marginBottom:34}}>
          {facts.map(([label,value])=><div key={label} style={{border:'1px solid rgba(111,199,222,.16)',borderRadius:16,padding:18,background:'rgba(255,255,255,.02)'}}><div style={{color:'#70899f',fontSize:10,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:7}}>{label}</div><div style={{color:'#edf2f6',fontSize:17,fontWeight:700}}>{value}</div></div>)}
        </div>

        <section style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:30}}>
          <div style={{color:'#78efbd',fontSize:11,fontWeight:850,letterSpacing:'.14em',textTransform:'uppercase'}}>Registered governance proposition</div>
          <h2 style={{margin:'10px 0 14px',fontSize:32}}>Authority must survive all the way to the execution boundary.</h2>
          <p style={{margin:0,color:'#b4c5d5',fontSize:17,lineHeight:1.8}}>Keystone separates identity, authority, and execution permission. It does not treat technical capability, model output, or possession of credentials as sufficient authority to execute a consequence-bearing financial action. The frozen RC8 baseline represents payload-bound authorization, fail-closed behavior, execution-time revalidation, and preserved provenance as distinct controls.</p>
        </section>

        <section style={{marginTop:34}}>
          <h2 style={{fontSize:30,marginBottom:16}}>Execution-control surface</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:12}}>
            {controls.map(([title,body])=><article key={title} style={{border:'1px solid rgba(86,220,255,.14)',borderRadius:16,padding:20,background:'rgba(5,22,34,.72)'}}><div style={{color:'#6fe6ff',fontWeight:850,fontSize:15}}>{title}</div><p style={{color:'#9eb4c3',fontSize:14,lineHeight:1.7,margin:'8px 0 0'}}>{body}</p></article>)}
          </div>
        </section>

        <section style={{marginTop:32,border:'1px solid rgba(120,239,189,.2)',borderRadius:18,padding:24,background:'linear-gradient(135deg,rgba(35,91,71,.18),rgba(5,20,31,.62))'}}>
          <div style={{color:'#78efbd',fontSize:11,fontWeight:850,letterSpacing:'.14em',textTransform:'uppercase'}}>Frozen evidence posture</div>
          <h2 style={{margin:'10px 0',fontSize:28}}>256 / 256 system tests · adverse condition preserved</h2>
          <p style={{margin:0,color:'#c2d6cd',fontSize:15,lineHeight:1.75}}>The submitted RC8 evidence record preserves the reported 256/256 system-test position while also preserving the H4/H5 trust-anchor and registration-continuity condition. In that bounded condition, an unrelated K2 replacement could inherit a K1 checkpoint without authorized rotation. The finding remains attached to RC8 and is not represented as retrospectively solved.</p>
          <p style={{margin:'14px 0 0',color:'#98adbb',fontSize:13,lineHeight:1.7}}>Preserved evidence SHA-256: <code style={{color:'#dff8ff'}}>a20b1d6af7a92ddbed149cba2019b298b830b9df1aefc0b1ce0fdf616b808499</code></p>
        </section>

        <section style={{marginTop:28,border:'1px solid rgba(242,204,104,.22)',borderRadius:18,padding:24,background:'rgba(47,36,10,.36)'}}>
          <div style={{color:'#f2cc68',fontSize:11,fontWeight:850,letterSpacing:'.14em',textTransform:'uppercase'}}>Claim boundary</div>
          <p style={{margin:'10px 0 0',color:'#c5d0d9',fontSize:15,lineHeight:1.75}}>TA-14-AIGR-000026 records identity, chronology, claims, limitations, rights, and the admitted evidence state. Registration is not TA-14 certification, endorsement, regulatory approval, production-readiness certification, security assurance, investment endorsement, or proof of interoperability with TA-14 FEIG or any other architecture.</p>
        </section>

        <section style={{marginTop:28,border:'1px solid rgba(86,220,255,.2)',borderRadius:18,padding:24,background:'rgba(4,23,35,.52)'}}>
          <div style={{color:'#6fe6ff',fontSize:11,fontWeight:850,letterSpacing:'.14em',textTransform:'uppercase'}}>Next governed question</div>
          <h2 style={{margin:'10px 0 10px',fontSize:28}}>Keystone × TA-14 Financial Execution Integrity Governance</h2>
          <p style={{margin:0,color:'#aebfcb',fontSize:15,lineHeight:1.75}}>No interoperability claim is made by this registration. The proposed next step is a separately frozen, falsifiable Exchange examination asking whether a Keystone-valid execution authority can remain non-executable unless the corresponding TA-14 admissibility conditions are independently satisfied at the same execution boundary. The result must be allowed to fail, partially hold, or establish only the relationship supported by the evidence.</p>
        </section>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:34}}>
          <Link href="/artifacts/keystone-rc8" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:850,background:'linear-gradient(135deg,#6fe6ff,#3ba3c7)',color:'#03131a'}}>Open Keystone Showcase →</Link>
          <Link href="/artifacts/interoperability-examinations" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(120,239,189,.25)',color:'#c9f6df'}}>Interoperability Examinations</Link>
          <a href="https://eliassystems.co.uk" target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(130,169,204,.25)',color:'#c9dbe9'}}>Elias Systems ↗</a>
        </div>
      </div>
    </div>
  </main>;
}
