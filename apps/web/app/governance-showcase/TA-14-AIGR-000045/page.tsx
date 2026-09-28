import Link from 'next/link';

export const metadata={
  title:'ExecutionProof™ · TA-14-AIGR-000045 | TA-14 Exchange',
  description:'Public registration identity for ExecutionProof™. Underlying governance materials remain private / record-only.'
};

const publicItems=[
  'ExecutionProof™',
  'Derek Hone',
  'Remnant Fieldworks Inc.',
  'TA-14-AIGR-000045',
  'Registered Governance'
];

const privateItems=[
  'Governance materials',
  'Claims and propositions',
  'Evidence and supporting records',
  'Artifacts and demonstrations',
  'Examinations and findings'
];

export default function Page(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 78% 6%,#102431 0,#061018 26%,#02070c 62%)',color:'#edf5f8',fontFamily:'Arial,sans-serif',padding:'0 20px'}}>
    <div style={{maxWidth:1120,margin:'auto'}}>
      <nav style={{padding:'28px 0',borderBottom:'1px solid #18303b',display:'flex',justifyContent:'space-between',gap:18,flexWrap:'wrap'}}>
        <Link href="/showrooms/registered-governance" style={{color:'#70dcff',textDecoration:'none',fontWeight:900}}>← REGISTERED GOVERNANCE</Link>
        <span style={{color:'#6f8994',fontSize:11,fontWeight:800,letterSpacing:1.5}}>TA-14 EXCHANGE · PUBLIC IDENTITY SURFACE</span>
      </nav>

      <header style={{padding:'92px 0 60px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:42,alignItems:'end'}}>
        <div>
          <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2.2}}>PUBLIC REGISTRATION IDENTITY · PRIVATE / RECORD-ONLY</p>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(54px,8vw,94px)',lineHeight:.92,margin:'18px 0 24px'}}>ExecutionProof™</h1>
          <p style={{color:'#a9bec7',fontSize:21,lineHeight:1.65,margin:'0 0 28px'}}>Derek Hone · Remnant Fieldworks Inc.</p>
          <div style={{display:'inline-flex',alignItems:'center',gap:12,padding:'12px 16px',border:'1px solid #574a22',borderRadius:999,background:'#171407',color:'#efc86c',fontSize:12,fontWeight:900,letterSpacing:1.2}}>TA-14-AIGR-000045 · REGISTERED GOVERNANCE</div>
        </div>

        <div style={{border:'1px solid #244452',borderRadius:26,background:'linear-gradient(145deg,#071821,#03090d)',padding:'30px 30px 28px',boxShadow:'0 24px 80px rgba(0,0,0,.35)'}}>
          <div style={{fontSize:42,marginBottom:18}}>🔒</div>
          <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:1.7,margin:'0 0 12px'}}>RECORD STATUS</p>
          <h2 style={{fontFamily:'Georgia,serif',fontSize:34,margin:'0 0 14px'}}>Private by design.</h2>
          <p style={{color:'#92aab5',fontSize:15,lineHeight:1.7,margin:0}}>This showroom confirms identity and registration while preserving the private governance record behind the disclosure boundary.</p>
        </div>
      </header>

      <section style={{padding:'12px 0 56px'}}>
        <p style={{color:'#6f8994',fontSize:11,fontWeight:900,letterSpacing:2,margin:'0 0 18px'}}>THE BOUNDARY IS THE SHOWROOM</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:18}}>
          <div style={{border:'1px solid #1d4657',borderRadius:22,background:'#06141b',padding:'30px'}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',marginBottom:22}}>
              <h2 style={{fontFamily:'Georgia,serif',fontSize:30,margin:0}}>Public surface</h2>
              <span style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:1.4}}>VISIBLE</span>
            </div>
            <p style={{color:'#8fa7b1',lineHeight:1.65,fontSize:14,margin:'0 0 22px'}}>The public record establishes only the authorized registration identity.</p>
            <div style={{display:'grid',gap:10}}>{publicItems.map(item=><div key={item} style={{padding:'13px 14px',border:'1px solid #163746',borderRadius:12,color:'#dbe9ee',fontSize:14}}>✓ {item}</div>)}</div>
          </div>

          <div style={{border:'1px solid #40371f',borderRadius:22,background:'#100e07',padding:'30px'}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',marginBottom:22}}>
              <h2 style={{fontFamily:'Georgia,serif',fontSize:30,margin:0}}>Private record</h2>
              <span style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:1.4}}>SEALED</span>
            </div>
            <p style={{color:'#a49a79',lineHeight:1.65,fontSize:14,margin:'0 0 22px'}}>These categories remain private unless separately authorized for disclosure.</p>
            <div style={{display:'grid',gap:10}}>{privateItems.map(item=><div key={item} style={{padding:'13px 14px',border:'1px solid #3a321d',borderRadius:12,color:'#d9cfad',fontSize:14}}>— {item}</div>)}</div>
          </div>
        </div>
      </section>

      <section style={{borderTop:'1px solid #17323e',borderBottom:'1px solid #17323e',padding:'58px 0',marginBottom:56,textAlign:'center'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2,margin:'0 0 16px'}}>DISCLOSURE BOUNDARY</p>
        <blockquote style={{fontFamily:'Georgia,serif',fontSize:'clamp(28px,4.4vw,48px)',lineHeight:1.15,maxWidth:900,margin:'0 auto 22px',color:'#f2f6f7'}}>Identity can be public while the governance record remains private.</blockquote>
        <p style={{color:'#849aa4',fontSize:15,lineHeight:1.75,maxWidth:760,margin:'0 auto'}}>This public showroom establishes registration identity only. It does not publish, summarize, characterize, infer, or disclose the private governance record.</p>
      </section>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16,paddingBottom:78}}>
        <div style={{padding:24,border:'1px solid #173746',borderRadius:18}}>
          <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.5,marginTop:0}}>01 · IDENTITY</p>
          <p style={{color:'#a9bec7',lineHeight:1.65,marginBottom:0}}>The governance has a public name and attributable registration identity.</p>
        </div>
        <div style={{padding:24,border:'1px solid #173746',borderRadius:18}}>
          <p style={{color:'#70dcff',fontSize:10,fontWeight:900,letterSpacing:1.5,marginTop:0}}>02 · REGISTRATION</p>
          <p style={{color:'#a9bec7',lineHeight:1.65,marginBottom:0}}>Its presence in the Exchange can be acknowledged without opening the underlying record.</p>
        </div>
        <div style={{padding:24,border:'1px solid #40371f',borderRadius:18}}>
          <p style={{color:'#efc86c',fontSize:10,fontWeight:900,letterSpacing:1.5,marginTop:0}}>03 · AUTHORITY</p>
          <p style={{color:'#bdb493',lineHeight:1.65,marginBottom:0}}>TA-14 stops where disclosure authority stops. Private material remains private.</p>
        </div>
      </section>

      <footer style={{padding:'40px 0 60px',borderTop:'1px solid #142832',display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap',color:'#647d88',fontSize:10,letterSpacing:1}}>
        <span>IDENTITY MAY BE PUBLIC WHILE THE GOVERNANCE RECORD REMAINS PRIVATE</span>
        <span>TA-14-AIGR-000045</span>
      </footer>
    </div>
  </main>
}