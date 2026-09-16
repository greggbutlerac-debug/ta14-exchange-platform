import Link from "next/link";

export const metadata = {
  title: "Guatemala · MARN | TA-14 Institutional Engagement",
  description: "Superficie bilingüe de examen técnico institucional entre Guatemala y TA-14 Authority.",
};

const chain = ["Reality", "Record", "Continuity", "Admissibility", "Binding", "Commit", "Execution", "Outcome"];
const decisions = ["ALLOW", "HOLD", "DENY", "ESCALATE"];

export default function GuatemalaInstitutionalShowroom() {
  return (
    <main style={{minHeight:"100vh",background:"radial-gradient(circle at 20% 0%,#12345a 0,#071321 34%,#030812 72%)",color:"#f8fafc",fontFamily:"Arial,Helvetica,sans-serif"}}>
      <section style={{maxWidth:1180,margin:"0 auto",padding:"42px 24px 72px"}}>
        <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,paddingBottom:24,borderBottom:"1px solid rgba(125,211,252,.28)"}}>
          <div style={{fontSize:48}}>🇬🇹</div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:3,color:"#f6c453"}}>TA-14 AUTHORITY · GLOBAL INSTITUTIONAL ENGAGEMENT</div>
            <div style={{marginTop:8,fontSize:15,color:"#cbd5e1"}}>Guatemala ↔ United States · Technical Engagement</div>
          </div>
          <div style={{fontSize:48}}>🇺🇸</div>
        </header>

        <section style={{marginTop:34,border:"1px solid rgba(125,211,252,.28)",borderRadius:28,padding:"44px 46px",background:"linear-gradient(135deg,rgba(14,49,82,.88),rgba(5,15,29,.92))",boxShadow:"0 24px 70px rgba(0,0,0,.35)"}}>
          <div style={{display:"inline-block",padding:"8px 12px",borderRadius:999,border:"1px solid rgba(246,196,83,.4)",background:"rgba(246,196,83,.08)",fontSize:12,fontWeight:800,letterSpacing:1.6,color:"#f6c453"}}>GUATEMALA · MINISTERIO DE AMBIENTE Y RECURSOS NATURALES (MARN)</div>
          <h1 style={{maxWidth:900,margin:"24px 0 0",fontSize:"clamp(38px,5vw,68px)",lineHeight:1.02,letterSpacing:-1.8}}>De la evidencia de calidad del aire a la acción gobernada.</h1>
          <p style={{maxWidth:900,margin:"28px 0 0",fontSize:20,lineHeight:1.65,color:"#e2e8f0"}}>Superficie de examen técnico preparada por TA-14 Authority para apoyar la conversación solicitada con el personal especializado del Laboratorio de Análisis y Calidad Atmosférica y Audial de MARN.</p>
          <p style={{maxWidth:900,margin:"12px 0 0",fontSize:14,lineHeight:1.65,color:"#94a3b8"}}>Technical examination surface prepared by TA-14 Authority to support MARN Guatemala’s requested discussion with specialized atmospheric-analysis and air-quality personnel.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:12,marginTop:30}}>
            <span style={{padding:"10px 14px",borderRadius:10,background:"rgba(56,189,248,.12)",border:"1px solid rgba(56,189,248,.28)",fontWeight:700,color:"#bae6fd"}}>Technical Examination Open</span>
            <span style={{padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.12)",color:"#cbd5e1"}}>Proposed format · Virtual meeting</span>
          </div>
        </section>

        <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:20,marginTop:24}}>
          <article style={{border:"1px solid rgba(125,211,252,.2)",borderRadius:22,padding:30,background:"rgba(10,25,43,.78)"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:2,color:"#7dd3fc"}}>01 · EXAMEN</div>
            <h2 style={{fontSize:27,margin:"12px 0 0"}}>La pregunta técnica</h2>
            <p style={{margin:"18px 0 0",fontSize:17,lineHeight:1.7,color:"#e2e8f0"}}>¿Cuándo los datos técnicamente válidos de calidad del aire se convierten en un registro probatorio suficientemente gobernado para respaldar una decisión o acción con consecuencias, y qué debe seguir siendo verdadero entre la medición y la ejecución para que esa decisión permanezca defendible tanto probatoria como operacionalmente?</p>
            <p style={{margin:"18px 0 0",fontSize:13,lineHeight:1.65,color:"#94a3b8"}}>When does technically valid air-quality data become a sufficiently governed evidentiary record to support consequential action, and what must remain true between measurement and execution?</p>
          </article>
          <article style={{border:"1px solid rgba(246,196,83,.22)",borderRadius:22,padding:30,background:"rgba(10,25,43,.78)"}}>
            <div style={{fontSize:12,fontWeight:800,letterSpacing:2,color:"#f6c453"}}>02 · LÍMITE</div>
            <h2 style={{fontSize:27,margin:"12px 0 0"}}>Límite institucional</h2>
            <p style={{margin:"18px 0 0",fontSize:17,lineHeight:1.7,color:"#e2e8f0"}}>TA-14 no sustituye la medición, el análisis de laboratorio, la regulación ambiental, la competencia institucional de MARN ni la autoridad pública de Guatemala. Examina la continuidad de evidencia y autoridad cuando un registro puede conducir a una acción con consecuencias.</p>
            <div style={{marginTop:22,padding:18,borderLeft:"3px solid #f6c453",background:"rgba(246,196,83,.06)",fontSize:13,lineHeight:1.65,color:"#cbd5e1"}}>This technical-conversation surface does not imply endorsement, adoption, regulatory recognition, procurement, contracting, or pilot authorization.</div>
          </article>
        </section>

        <section style={{marginTop:24,border:"1px solid rgba(125,211,252,.2)",borderRadius:22,padding:30,background:"rgba(3,12,24,.84)"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:2,color:"#7dd3fc"}}>03 · EXECUTION AUTHORITY</div>
          <h2 style={{fontSize:29,margin:"10px 0 0"}}>Cadena de ejecución admisible</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(115px,1fr))",gap:10,marginTop:26}}>
            {chain.map((item,i)=><div key={item} style={{position:"relative",padding:"18px 10px",borderRadius:14,textAlign:"center",background:"linear-gradient(180deg,rgba(56,189,248,.13),rgba(255,255,255,.025))",border:"1px solid rgba(125,211,252,.24)"}}><div style={{fontSize:10,color:"#64748b",marginBottom:7}}>0{i+1}</div><strong style={{fontSize:14}}>{item}</strong></div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginTop:20}}>
            {decisions.map((item,i)=><div key={item} style={{padding:"16px 12px",textAlign:"center",borderRadius:12,border:i===1?"1px solid rgba(246,196,83,.55)":"1px solid rgba(255,255,255,.13)",background:i===1?"rgba(246,196,83,.09)":"rgba(255,255,255,.035)",fontWeight:900,letterSpacing:1.5,color:i===1?"#fde68a":"#e2e8f0"}}>{item}</div>)}
          </div>
          <div style={{marginTop:24,padding:"20px 22px",borderRadius:14,background:"rgba(246,196,83,.07)",border:"1px solid rgba(246,196,83,.18)"}}><strong style={{color:"#fde68a"}}>El contexto cambiado exige revalidación.</strong><span style={{color:"#cbd5e1"}}> La ausencia de una negativa no se convierte en autorización.</span><div style={{marginTop:7,fontSize:13,color:"#94a3b8"}}>Changed context requires revalidation. The absence of refusal does not become authorization.</div></div>
        </section>

        <section style={{marginTop:24,border:"1px solid rgba(255,255,255,.12)",borderRadius:22,padding:30,background:"rgba(10,25,43,.68)"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:2,color:"#7dd3fc"}}>04 · INSTITUTIONAL RECORD</div>
          <h2 style={{fontSize:29,margin:"10px 0 0"}}>Estado del compromiso institucional</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14,marginTop:24}}>
            {[["Institución","MARN · Guatemala"],["Estado","Technical Examination Open"],["Formato propuesto","Reunión virtual"]].map(([a,b])=><div key={a} style={{padding:20,borderRadius:14,border:"1px solid rgba(255,255,255,.09)",background:"rgba(255,255,255,.03)"}}><div style={{fontSize:10,fontWeight:800,letterSpacing:1.6,color:"#64748b"}}>{a.toUpperCase()}</div><div style={{marginTop:9,fontSize:17,fontWeight:700}}>{b}</div></div>)}
          </div>
          <p style={{margin:"22px 0 0",fontSize:14,lineHeight:1.7,color:"#94a3b8"}}>Registro: MARN recibió la solicitud de TA-14 y pidió ampliar el tema, indicar modalidad y proponer fechas para una reunión técnica con personal especializado. Esta página conserva el alcance técnico sin atribuir adopción o representación a ninguna persona.</p>
        </section>

        <nav style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12,marginTop:24}}>
          <Link style={{padding:16,borderRadius:12,border:"1px solid rgba(125,211,252,.25)",textAlign:"center",textDecoration:"none",color:"#e0f2fe",background:"rgba(56,189,248,.05)"}} href="/environmental-integrity-governance">Environmental Integrity Governance</Link>
          <Link style={{padding:16,borderRadius:12,border:"1px solid rgba(125,211,252,.25)",textAlign:"center",textDecoration:"none",color:"#e0f2fe",background:"rgba(56,189,248,.05)"}} href="/environmental-integrity-governance">Atmospheric Integrity Records</Link>
          <Link style={{padding:16,borderRadius:12,border:"1px solid rgba(125,211,252,.25)",textAlign:"center",textDecoration:"none",color:"#e0f2fe",background:"rgba(56,189,248,.05)"}} href="/registry/ta-14-admissible-execution-architecture">Admissible Execution Architecture</Link>
          <Link style={{padding:16,borderRadius:12,border:"1px solid rgba(246,196,83,.35)",textAlign:"center",textDecoration:"none",color:"#fde68a",background:"rgba(246,196,83,.05)"}} href="/global-institutional-engagement">All Institutional Showrooms</Link>
          <Link style={{padding:16,borderRadius:12,textAlign:"center",textDecoration:"none",fontWeight:900,color:"#071321",background:"linear-gradient(135deg,#f8fafc,#bae6fd)"}} href="/registry/ta-14-admissible-execution-architecture">Explore the Architecture</Link>
        </nav>
      </section>
    </main>
  );
}
