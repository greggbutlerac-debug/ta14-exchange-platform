import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TA-14-AIGR-000023 | Governed State Spine',
  description: 'Selective-visibility TA-14 AI Governance Registry record for Governed State Spine v3.02.',
};

export default function GovernedStateSpineSelectiveRegistryRecord() {
  return (
    <main style={{minHeight:'100vh',background:'radial-gradient(circle at 15% 0%, rgba(28,83,139,.22), transparent 30%), linear-gradient(180deg,#020813,#06111e 48%,#020710)',color:'#f3f6f9',padding:'64px 20px'}}>
      <div style={{width:'min(980px,100%)',margin:'0 auto'}}>
        <Link href="/workspace/ai-governance/registry/profiles/governed-state-spine" style={{color:'#a9bfd2',textDecoration:'none'}}>← Governance Showcase</Link>

        <div style={{marginTop:38,border:'1px solid rgba(213,167,75,.28)',borderRadius:28,background:'linear-gradient(135deg,rgba(8,26,45,.9),rgba(4,15,27,.97))',padding:'clamp(28px,6vw,58px)',boxShadow:'0 28px 90px rgba(0,0,0,.3)'}}>
          <div style={{color:'#d7aa51',fontSize:12,fontWeight:800,letterSpacing:'.15em',textTransform:'uppercase'}}>TA-14 AI Governance Registry · Selective Visibility</div>
          <h1 style={{margin:'18px 0 12px',fontSize:'clamp(42px,7vw,76px)',lineHeight:.98,letterSpacing:'-.045em'}}>Governed State Spine</h1>
          <p style={{margin:'0 0 30px',color:'#e1b85f',fontSize:22,lineHeight:1.5}}>GSS v3.02 · TA-14-AIGR-000023</p>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14,marginBottom:34}}>
            {[
              ['Status','Registered'],
              ['Visibility','Selective'],
              ['Organization','R2 Tech Consultants, LLC'],
              ['Steward','Mark Rewers'],
            ].map(([label,value]) => (
              <div key={label} style={{border:'1px solid rgba(111,153,192,.16)',borderRadius:16,padding:18,background:'rgba(255,255,255,.02)'}}>
                <div style={{color:'#70899f',fontSize:10,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:7}}>{label}</div>
                <div style={{color:'#edf2f6',fontSize:17,fontWeight:700}}>{value}</div>
              </div>
            ))}
          </div>

          <section style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:28}}>
            <h2 style={{margin:'0 0 14px',fontSize:28}}>Permanent registration identity</h2>
            <p style={{margin:0,color:'#b4c5d5',fontSize:17,lineHeight:1.8}}>TA-14-AIGR-000023 is a completed registration in the TA-14 AI Governance Registry. The registrant selected selective visibility. This page confirms the permanent registry identity and permitted public registration facts without publishing evidence or record material outside that selected boundary.</p>
          </section>

          <section style={{marginTop:30,border:'1px solid rgba(213,167,75,.22)',borderRadius:18,padding:22,background:'rgba(30,23,9,.42)'}}>
            <div style={{color:'#d7aa51',fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:9}}>Publication Boundary</div>
            <p style={{margin:0,color:'#c3d0dc',fontSize:15,lineHeight:1.75}}>The underlying Registry record and submitted evidence remain governed by the registrant’s selected visibility settings. Registration is not certification, endorsement, independent technical validation, ownership adjudication, regulatory approval, or proof of production performance.</p>
          </section>

          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:32}}>
            <Link href="/workspace/ai-governance/registry/profiles/governed-state-spine" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,background:'linear-gradient(135deg,#d7ab52,#9e6e20)',color:'#06101c'}}>Open Governance Showcase →</Link>
            <Link href="/workspace/ai-governance/registry/directory" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(130,169,204,.28)',color:'#c9dbe9'}}>Browse Public Registry</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
