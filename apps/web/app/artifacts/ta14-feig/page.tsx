import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TA-14 Financial Execution Integrity Governance | TA-14 Exchange',
  description: 'Governed public showcase for TA-14 Financial Execution Integrity Governance v1.0, Registry TA-14-AIGR-000027.',
};

const claims = [
  'Financial consequence must not bind merely because a system is technically capable of executing it.',
  'Evidence continuity, admissibility, action context, temporal validity, authority, and commitment conditions are evaluated before consequential execution proceeds.',
  'The architecture applies Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome to financial systems.',
  'The governing implementation may produce ALLOW, HOLD/BLOCK, DENY, or ESCALATE-type determinations according to the admitted evidence and declared conditions.',
  'Where required admissibility conditions are not established, execution standing is withheld rather than inferred.',
];

const boundaries = [
  'Registration is not certification, regulatory approval, legal compliance, or investment endorsement.',
  'The record does not prove that any specific bank, payment rail, agent, model, institution, or implementation conforms to TA-14 FEIG.',
  'The architecture does not replace applicable financial law, licensed professional judgment, institutional authority, or required human/legal authorization.',
  'Implementation behavior, production connectivity, cybersecurity adequacy, and interoperability must be separately demonstrated inside bounded evidence.',
  'No interoperability finding with Keystone or any other architecture is created by this registration.',
];

export default function FeigShowcase() {
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 18% 0%,rgba(31,151,212,.22),transparent 32%),radial-gradient(circle at 88% 8%,rgba(218,171,70,.12),transparent 28%),linear-gradient(180deg,#020813,#06111e 50%,#02070d)',color:'#f3f7fa',padding:'62px 20px 90px'}}>
    <div style={{width:'min(1120px,100%)',margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <Link href="/artifacts" style={{color:'#a7bed0',textDecoration:'none'}}>← Artifact Registry</Link>
        <Link href="/registry/TA-14-AIGR-000027" style={{color:'#f1cf70',textDecoration:'none',fontWeight:800}}>Open Permanent Registry Record →</Link>
      </div>

      <section style={{marginTop:34,border:'1px solid rgba(242,204,104,.26)',borderRadius:30,padding:'clamp(28px,6vw,62px)',background:'linear-gradient(145deg,rgba(7,25,42,.95),rgba(4,14,25,.99))',boxShadow:'0 30px 100px rgba(0,0,0,.35)'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:900,letterSpacing:'.16em',textTransform:'uppercase'}}>TA-14 GOVERNED SHOWCASE · INSTITUTIONAL ARCHITECTURE</div>
        <div style={{marginTop:10,color:'#78ddff',fontWeight:850}}>TA-14-AIGR-000027 · REGISTERED AUGUST 23, 2026</div>
        <h1 style={{fontSize:'clamp(42px,7vw,80px)',lineHeight:.96,letterSpacing:'-.05em',margin:'24px 0 14px'}}>TA-14 Financial Execution Integrity Governance</h1>
        <p style={{fontSize:23,color:'#f0c963',margin:'0 0 18px'}}>Proof-bound financial execution under the TA-14 Admissible Execution Architecture.</p>
        <p style={{maxWidth:900,color:'#b6c7d4',fontSize:17,lineHeight:1.8,margin:0}}>TA-14 FEIG governs whether a financial action may become binding by requiring admissible, time-sequenced evidence at the execution boundary. It separates evidence, admissibility, authority, commitment, execution, and outcome so that consequence does not proceed merely because a system has capability or permission.</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12,marginTop:30}}>
          {[
            ['Architecture','Financial Execution Integrity Governance'],['Version','1.0'],['Claimant','Greggory Don Butler'],['Institution','TA-14 Authority'],['Registry','TA-14-AIGR-000027'],['Establishment date','April 25, 2026'],['Effective version','August 23, 2026'],['Visibility','Public'],
          ].map(([k,v])=><div key={k} style={{padding:18,border:'1px solid rgba(126,221,255,.13)',borderRadius:15,background:'rgba(255,255,255,.02)'}}><small style={{display:'block',color:'#70899f',fontSize:9,fontWeight:850,letterSpacing:'.13em',textTransform:'uppercase'}}>{k}</small><strong style={{display:'block',marginTop:7,fontSize:16}}>{v}</strong></div>)}
        </div>
      </section>

      <section style={{marginTop:28,padding:'28px 30px',border:'1px solid rgba(126,221,255,.16)',borderRadius:20,background:'rgba(7,20,33,.8)'}}>
        <div style={{color:'#78ddff',fontSize:11,fontWeight:900,letterSpacing:'.15em',textTransform:'uppercase'}}>Parent execution architecture</div>
        <h2 style={{fontSize:30,margin:'10px 0 14px'}}>The domain changes. The parent chain does not.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:9}}>
          {['Reality','Record','Continuity','Admissibility','Binding','Commit','Execution','Outcome'].map((x,i)=><div key={x} style={{padding:16,border:'1px solid rgba(242,204,104,.17)',borderRadius:13,background:'rgba(242,204,104,.035)'}}><small style={{color:'#7e93a3'}}>0{i+1}</small><div style={{fontWeight:850,marginTop:5}}>{x}</div></div>)}
        </div>
      </section>

      <section style={{marginTop:30}}>
        <div style={{color:'#78ddff',fontSize:11,fontWeight:900,letterSpacing:'.15em',textTransform:'uppercase'}}>What TA-14 FEIG claims</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))',gap:12,marginTop:14}}>
          {claims.map((x,i)=><article key={x} style={{padding:22,border:'1px solid rgba(126,221,255,.14)',borderRadius:16,background:'rgba(5,19,31,.72)'}}><div style={{color:'#f2cc68',fontWeight:900,fontSize:12}}>0{i+1}</div><p style={{margin:'8px 0 0',color:'#b4c5d1',lineHeight:1.72}}>{x}</p></article>)}
        </div>
      </section>

      <section style={{marginTop:30,border:'1px solid rgba(242,204,104,.2)',borderRadius:20,padding:28,background:'rgba(45,34,9,.34)'}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:900,letterSpacing:'.15em',textTransform:'uppercase'}}>Frozen public baseline</div>
        <h2 style={{fontSize:29,margin:'10px 0 10px'}}>A dated, attributable, version-bound financial governance object.</h2>
        <p style={{color:'#c3ced7',lineHeight:1.75,margin:0}}>The registered baseline is preserved in <strong>TA14_FEIG_Public_Baseline_Specification_v1.0_FROZEN.pdf</strong>. Its preserved SHA-256 evidence identity is:</p>
        <code style={{display:'block',marginTop:14,padding:14,borderRadius:11,background:'rgba(0,0,0,.25)',color:'#dff7ff',overflowWrap:'anywhere'}}>eae234d2c1cb79d06ca8eb24683075251dd5d7cc924d40a091625be964041d38</code>
        <p style={{margin:'15px 0 0',color:'#9db0be',lineHeight:1.7}}>Zenodo archival DOI: <a href="https://doi.org/10.5281/zenodo.22067955" target="_blank" rel="noreferrer" style={{color:'#78ddff'}}>10.5281/zenodo.22067955</a></p>
      </section>

      <section style={{marginTop:28,border:'1px solid rgba(126,221,255,.17)',borderRadius:20,padding:28,background:'rgba(6,20,33,.72)'}}>
        <div style={{color:'#78ddff',fontSize:11,fontWeight:900,letterSpacing:'.15em',textTransform:'uppercase'}}>Patent lineage</div>
        <h2 style={{fontSize:27,margin:'10px 0 8px'}}>Proof-bound financial execution</h2>
        <p style={{margin:0,color:'#b2c2ce',lineHeight:1.75}}>The Registry links the architecture to U.S. application <strong>US 64/021,710</strong>, titled <em>Systems and Methods for Proof-Bound Financial Execution Using Append-Only Integrity Records and Non-Bypassable Commit-Time Admissibility Boundaries</em>. The filing relationship is preserved as patent lineage; Registry registration does not adjudicate patent scope, validity, ownership disputes, or enforceability.</p>
      </section>

      <section style={{marginTop:28}}>
        <div style={{color:'#f2cc68',fontSize:11,fontWeight:900,letterSpacing:'.15em',textTransform:'uppercase'}}>What this record does not establish</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:10,marginTop:13}}>
          {boundaries.map(x=><div key={x} style={{padding:18,border:'1px solid rgba(242,204,104,.16)',borderRadius:14,color:'#aebfca',lineHeight:1.65,background:'rgba(242,204,104,.025)'}}>{x}</div>)}
        </div>
      </section>

      <section style={{marginTop:30,border:'1px solid rgba(120,239,189,.2)',borderRadius:20,padding:28,background:'linear-gradient(135deg,rgba(31,87,68,.17),rgba(5,20,31,.68))'}}>
        <div style={{color:'#78efbd',fontSize:11,fontWeight:900,letterSpacing:'.15em',textTransform:'uppercase'}}>Next governed gate · not yet a finding</div>
        <h2 style={{fontSize:29,margin:'10px 0 12px'}}>TA-14 FEIG × Keystone bounded interoperability examination</h2>
        <p style={{margin:0,color:'#b8ccc3',lineHeight:1.78}}>Keystone and TA-14 FEIG now exist as separately frozen, separately attributable registry objects. The next step is not to declare them complementary. It is to freeze a falsifiable proposition and test whether authority-valid execution can still be withheld when TA-14 independently finds that the evidence required for admissible financial consequence lacks present standing.</p>
      </section>

      <div style={{display:'flex',gap:11,flexWrap:'wrap',marginTop:32}}>
        <Link href="/registry/TA-14-AIGR-000027" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:850,background:'linear-gradient(135deg,#f2cc68,#b68529)',color:'#07111a'}}>Permanent Registry Record →</Link>
        <a href="https://sites.google.com/view/ta-14financialexecutionintegri/home" target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(126,221,255,.22)',color:'#d6ebf5'}}>Public Architecture Site ↗</a>
        <a href="https://doi.org/10.5281/zenodo.22067955" target="_blank" rel="noreferrer" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(120,239,189,.22)',color:'#c9f4df'}}>Zenodo DOI ↗</a>
      </div>
    </div>
  </main>;
}
