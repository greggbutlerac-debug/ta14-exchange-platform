"use client";

import Link from "next/link";

const domains = [
  "Governance Metrics",
  "Key Risk Indicators (KRIs)",
  "Key Performance Indicators (KPIs)",
  "Control Effectiveness",
  "Evidence Completeness",
  "Runtime Decision Statistics",
  "Route Outcomes",
  "Review Timelines",
];

export default function MetricsPage() {
  return (
    <main style={{padding:"48px",fontFamily:"Inter, sans-serif",background:"#050914",color:"#fff",minHeight:"100vh"}}>
      <h1>Metrics & Measurement</h1>
      <p>
        Governance metrics quantify how well a governance program is operating.
        TA-14 distinguishes operational measurements from governance evidence
        and preserved execution records.
      </p>

      <h2>Measurement Domains</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"16px",marginTop:"24px"}}>
        {domains.map((d)=>(
          <div key={d} style={{border:"1px solid #2b3b55",borderRadius:12,padding:16,background:"#0b1220"}}>
            <strong>{d}</strong>
          </div>
        ))}
      </div>

      <h2 style={{marginTop:40}}>TA-14 Perspective</h2>
      <p>
        Metrics indicate performance trends, but they do not independently prove
        admissibility, authority, or correctness. Decisions should remain bound
        to preserved evidence and execution records.
      </p>

      <div style={{display:"flex",gap:16,marginTop:36}}>
        <Link href="/workspace/ai-governance/library">← Governance Library</Link>
        <Link href="/workspace/routes/new">Build Metrics Route →</Link>
      </div>
    </main>
  );
}
