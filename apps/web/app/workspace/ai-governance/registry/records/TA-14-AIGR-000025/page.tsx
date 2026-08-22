import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TA-14-AIGR-000025 | Validation Standing Assurance',
  description: 'Permanent TA-14 AI Governance Registry record for Validation Standing Assurance (VSA) v1.0 and its governed demonstration lineage.',
};

export default function VsaPermanentRegistryRecord() {
  const facts = [
    ['Status','Registered'],['Visibility','Public'],['Registry identifier','TA-14-AIGR-000025'],['Version','1.0'],
    ['Steward','Taiwo Yusuf'],['Organization','TEAM 22'],['Established','August 18, 2026'],['Registered','August 20, 2026'],
  ];

  const caseCard = (label:string,title:string,result:string,record:string,condition:string,href:string,gfr:string) => (
    <section style={{marginTop:24,border:'1px solid rgba(105,239,179,.24)',borderRadius:18,padding:22,background:'linear-gradient(135deg,rgba(21,79,61,.22),rgba(7,22,31,.64))'}}>
      <div style={{color:'#7aefba',fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:9}}>{label}</div>
      <h2 style={{margin:'0 0 10px',fontSize:25}}>{title}</h2>
      <p style={{margin:'0 0 10px',color:'#c3d7ce',fontSize:15,lineHeight:1.75}}><strong style={{color:'#83efbd'}}>{result}</strong></p>
      <p style={{margin:'0 0 10px',color:'#c3d0dc',fontSize:14,lineHeight:1.7}}><strong>Governed finding record:</strong> {record}</p>
      <p style={{margin:'0 0 18px',color:'#9eb4c3',fontSize:13,lineHeight:1.7}}>{condition}</p>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        <Link href={href} style={{display:'inline-flex',alignItems:'center',minHeight:44,padding:'0 14px',borderRadius:10,textDecoration:'none',fontWeight:800,background:'linear-gradient(135deg,#69efb3,#2e9d73)',color:'#03130e'}}>Open Demonstration →</Link>
        <Link href={gfr} style={{display:'inline-flex',alignItems:'center',minHeight:44,padding:'0 14px',borderRadius:10,textDecoration:'none',fontWeight:800,border:'1px solid rgba(105,239,179,.25)',color:'#c9f6df'}}>Open Governed Finding →</Link>
      </div>
    </section>
  );

  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 15% 0%,rgba(28,83,139,.24),transparent 30%),radial-gradient(circle at 90% 8%,rgba(213,167,75,.13),transparent 26%),linear-gradient(180deg,#020813,#06111e 48%,#020710)',color:'#f3f6f9',padding:'64px 20px'}}>
    <div style={{width:'min(1040px,100%)',margin:'0 auto'}}>
      <Link href="/workspace/ai-governance/registry/directory" style={{color:'#a9bfd2',textDecoration:'none'}}>← Governance Registry</Link>
      <div style={{marginTop:38,border:'1px solid rgba(213,167,75,.28)',borderRadius:28,background:'linear-gradient(135deg,rgba(8,26,45,.92),rgba(4,15,27,.98))',padding:'clamp(28px,6vw,58px)',boxShadow:'0 28px 90px rgba(0,0,0,.3)'}}>
        <div style={{color:'#d7aa51',fontSize:12,fontWeight:800,letterSpacing:'.15em',textTransform:'uppercase'}}>TA-14 AI Governance Registry · Permanent Public Record</div>
        <h1 style={{margin:'18px 0 12px',fontSize:'clamp(42px,7vw,76px)',lineHeight:.98,letterSpacing:'-.045em'}}>Validation Standing Assurance</h1>
        <p style={{margin:'0 0 30px',color:'#e1b85f',fontSize:22,lineHeight:1.5}}>VSA v1.0 · TA-14-AIGR-000025</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14,marginBottom:34}}>
          {facts.map(([label,value])=><div key={label} style={{border:'1px solid rgba(111,153,192,.16)',borderRadius:16,padding:18,background:'rgba(255,255,255,.02)'}}><div style={{color:'#70899f',fontSize:10,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:7}}>{label}</div><div style={{color:'#edf2f6',fontSize:17,fontWeight:700}}>{value}</div></div>)}
        </div>

        <section style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:28}}>
          <h2 style={{margin:'0 0 14px',fontSize:28}}>Permanent registration identity</h2>
          <p style={{margin:0,color:'#b4c5d5',fontSize:17,lineHeight:1.8}}>TA-14-AIGR-000025 permanently preserves the attributable VSA v1.0 governance baseline submitted by Taiwo Yusuf. The registration identity remains distinct from later Founding Demonstrations and governed findings. Those later records bind back to this identity without rewriting the original registration.</p>
        </section>

        <section style={{marginTop:30}}>
          <h2 style={{fontSize:28}}>Registered governance proposition</h2>
          <p style={{color:'#b4c5d5',fontSize:17,lineHeight:1.8}}>Historical validation does not by itself establish present validation standing. VSA separates historical validation, current supportability, and downstream action authority. Where qualifying current evidence cannot re-establish supportability, the architecture preserves uncertainty and supports reassessment rather than silently inheriting the earlier state.</p>
        </section>

        <section style={{marginTop:32,borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:28}}>
          <div style={{color:'#79d8f5',fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase'}}>Governed lineage under this registry identity</div>
          <h2 style={{margin:'10px 0 8px',fontSize:30}}>Two completed governed demonstrations. Different bounded propositions.</h2>
          <p style={{margin:0,color:'#9fb5c4',lineHeight:1.7}}>Registration is not itself a finding. Each demonstration below preserves its own frozen proposition, evidence boundary, result, limitations, and governed finding record.</p>
        </section>

        {caseCard(
          'CASE 01 · CLOSED · FINAL INSTITUTIONAL SEAL',
          'COBIT-Chain Azure MCP Gateway R1',
          'SUPPORTED - BOUNDED PASS',
          'TA14-VSA-GREG-R1-002-GFR',
          'Catalog correspondence remains NOT ESTABLISHED and is permanently preserved with the bounded PASS. Participant factual review is complete. Independent live reproduction by TA-14 was not performed.',
          '/artifacts/vsa-cobit-chain-r1',
          '/artifacts/governed/ta14-vsa-greg-r1-002-gfr'
        )}

        {caseCard(
          'CASE 02 · FD-2026-0006 · GOVERNED FINDING COMPLETE',
          'VSA Environmental Validation Standing Under Hidden Physical Context Drift',
          'SUPPORTED - BOUNDED SYNTHETIC FOUNDING DEMONSTRATION',
          'FD-2026-0006-GFR',
          'TA-14 independently reproduced the declared T0-T5 proposition-specific standing sequence. Condition C01 remains preserved: the evidence governs standing after a changed physical/context condition is represented in the evidence surface; autonomous discovery of otherwise unrepresented hidden drift is not established.',
          '/artifacts/vsa-environmental-standing-r2a',
          '/artifacts/governed/fd-2026-0006-gfr'
        )}

        <section style={{marginTop:30,border:'1px solid rgba(213,167,75,.22)',borderRadius:18,padding:22,background:'rgba(30,23,9,.42)'}}>
          <div style={{color:'#d7aa51',fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:9}}>Registration Boundary</div>
          <p style={{margin:0,color:'#c3d0dc',fontSize:15,lineHeight:1.75}}>Registration preserves identity, chronology, declared claims, boundaries, and the submitted governance baseline. It is not certification, endorsement, regulatory conformity, legal sufficiency, safety assurance, proof of production effectiveness, or proof of behavior outside the separately governed demonstrations.</p>
        </section>

        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:32}}>
          <Link href="/artifacts/founding-demonstrations" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,background:'linear-gradient(135deg,#d7ab52,#9e6e20)',color:'#06101c'}}>Open Founding Demonstrations →</Link>
          <Link href="/workspace/ai-governance/registry/directory" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(130,169,204,.28)',color:'#c9dbe9'}}>Browse Public Registry</Link>
        </div>
      </div>
    </div>
  </main>;
}
