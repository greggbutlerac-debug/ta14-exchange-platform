import Link from "next/link";

const gdprQuestions = [
  "Is personal data in scope, and whose data is it?",
  "What controller / processor role is actually held?",
  "What purpose and lawful basis support the processing?",
  "Are minimisation, retention, sharing and rights pathways evidenced?",
];

const aiActQuestions = [
  "What AI-system role and risk classification apply?",
  "Which obligations attach to this actor and use case?",
  "What evidence supports risk management, oversight, logging and monitoring?",
  "Has a material system or deployment change made prior reliance stale?",
];

const changeTriggers = [
  "Purpose changes",
  "Personal-data scope changes",
  "Controller / processor role changes",
  "AI-system role or classification changes",
  "Deployment context changes",
  "Authority or oversight changes",
  "Evidence becomes stale, contradicted or incomplete",
];

export default function GdprEuAiActIntersectionPage() {
  return (
    <main style={{minHeight:"100vh",background:"#07111f",color:"#edf4ff",padding:"48px 24px",fontFamily:"system-ui, sans-serif"}}>
      <div style={{maxWidth:1120,margin:"0 auto"}}>
        <nav style={{fontSize:14,opacity:.8,marginBottom:32}}>
          <Link href="/">TA-14 AI Governance Exchange</Link> <span>›</span>{" "}
          <Link href="/eu-ai-act">EU AI Act</Link> <span>›</span> GDPR Intersection
        </nav>

        <header style={{padding:"28px 0 36px"}}>
          <div style={{letterSpacing:2,fontSize:12,fontWeight:800,color:"#a8c8ff"}}>GDPR × EU AI ACT GOVERNED INTERSECTION</div>
          <h1 style={{fontSize:"clamp(40px,7vw,76px)",lineHeight:1.02,maxWidth:980,margin:"16px 0"}}>Two legal boundaries. One system. No collapsed compliance claim.</h1>
          <p style={{fontSize:20,lineHeight:1.6,maxWidth:900,color:"#c9d7ea"}}>GDPR governs personal-data processing. The EU AI Act governs AI-system risk and actor obligations. A system may implicate both, but evidence supporting one boundary does not automatically satisfy the other. This workspace preserves the separation and makes the overlap examinable.</p>
        </header>

        <section style={{border:"1px solid #8b6b2e",background:"#201b10",padding:20,borderRadius:16,marginBottom:28}}>
          <strong>Governance boundary</strong>
          <p style={{marginBottom:0,lineHeight:1.6}}>TA-14 structures evidence, gaps, changed conditions and bounded determinations. It does not provide legal advice, certify statutory compliance, or convert evidence of a control into authority to execute.</p>
        </section>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20,margin:"32px 0"}}>
          <article style={{border:"1px solid #29405f",borderRadius:18,padding:24,background:"#0c192b"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>BOUNDARY A</div>
            <h2>GDPR · Personal-data governance</h2>
            {gdprQuestions.map(q=><p key={q}>• {q}</p>)}
            <div style={{marginTop:20,fontWeight:700}}>A GDPR-positive evidence state does not establish EU AI Act compliance.</div>
          </article>
          <article style={{border:"1px solid #29405f",borderRadius:18,padding:24,background:"#0c192b"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>BOUNDARY B</div>
            <h2>EU AI Act · AI-risk governance</h2>
            {aiActQuestions.map(q=><p key={q}>• {q}</p>)}
            <div style={{marginTop:20,fontWeight:700}}>An AI-Act-positive evidence state does not establish GDPR compliance.</div>
          </article>
        </section>

        <section style={{padding:"30px 0"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>INTERSECTION CHAIN</div>
          <h2 style={{fontSize:34}}>Data → Evidence → AI Risk → Authority → Execution</h2>
          <p style={{fontSize:18,lineHeight:1.7,maxWidth:900,color:"#c9d7ea"}}>The chain is deliberately non-substitutive. Lawful or evidenced data processing does not by itself establish that an AI consequence is authorized. AI-risk controls do not retroactively establish a lawful basis for personal-data processing. Each proposition must retain its own source, evidence, standing and unresolved conditions.</p>
        </section>

        <section style={{border:"1px solid #29405f",borderRadius:18,padding:24,background:"#0c192b",margin:"24px 0"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>CHANGE RADAR</div>
          <h2>Prior support does not travel silently.</h2>
          <p>Revalidation is required when a material condition changes between determination and reliance.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12}}>{changeTriggers.map(t=><div key={t} style={{border:"1px solid #29405f",borderRadius:12,padding:14}}>{t}</div>)}</div>
        </section>

        <section style={{padding:"28px 0"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#a8c8ff"}}>EVIDENCE MATRIX</div>
          <h2>Preserve four states, not one compliance badge.</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
            {[['GDPR evidence','Lawful basis, purpose, role, data scope, minimisation, retention, rights and sharing evidence.'],['EU AI Act evidence','Classification, actor duties, risk controls, oversight, documentation, logging, monitoring and change evidence.'],['Shared evidence','System identity, versions, chronology, deployment facts and artifacts that legitimately support both boundaries.'],['Unresolved gaps','Unknown, stale, contradicted or missing facts remain explicit and cannot manufacture a favorable result.']].map(([title,copy])=><article key={title} style={{border:"1px solid #29405f",borderRadius:14,padding:18}}><strong>{title}</strong><p style={{lineHeight:1.55,color:"#c9d7ea"}}>{copy}</p></article>)}
          </div>
        </section>

        <section style={{border:"1px solid #7a3340",background:"#211218",padding:24,borderRadius:18,margin:"24px 0 40px"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:1.5,color:"#ffb9c4"}}>FAIL-CLOSED RULE</div>
          <h2>Unknown is not compliant.</h2>
          <p style={{lineHeight:1.65}}>Missing evidence, unresolved applicability, stale state or an unverified material change must remain incomplete or review-required. The workspace must not infer a favorable GDPR state from an EU AI Act state, or a favorable EU AI Act state from a GDPR state.</p>
        </section>

        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <Link href="/eu-ai-act" style={{padding:"14px 18px",border:"1px solid #44658d",borderRadius:10}}>Return to EU AI Act World</Link>
          <Link href="/eu-ai-act/classifier" style={{padding:"14px 18px",border:"1px solid #44658d",borderRadius:10}}>Classify AI System</Link>
          <Link href="/eu-ai-act/command-center" style={{padding:"14px 18px",border:"1px solid #44658d",borderRadius:10}}>Open Command Center</Link>
        </div>
      </div>
    </main>
  );
}
