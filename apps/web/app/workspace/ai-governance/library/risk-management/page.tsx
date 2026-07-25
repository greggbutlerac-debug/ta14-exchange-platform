"use client";

import Link from "next/link";

export default function RiskManagementPage() {
  return (
    <main style={{padding:"48px",fontFamily:"Inter, sans-serif",background:"#050914",color:"#fff",minHeight:"100vh"}}>
      <h1>Risk Management</h1>
      <p>This module introduces AI risk management within the TA-14 Governance Library.</p>

      <h2>Core Topics</h2>
      <ul>
        <li>Risk identification</li>
        <li>Risk analysis</li>
        <li>Risk evaluation</li>
        <li>Risk treatment</li>
        <li>Residual risk</li>
        <li>Continuous monitoring</li>
        <li>Evidence preservation</li>
        <li>Outcome verification</li>
      </ul>

      <h2>TA-14 Perspective</h2>
      <p>
        Risk alone does not authorize execution. Evidence, authority,
        admissibility, binding, and preserved outcomes remain separate
        governance questions.
      </p>

      <div style={{display:"flex",gap:"12px",marginTop:"32px"}}>
        <Link href="/workspace/ai-governance/library">← Governance Library</Link>
        <Link href="/workspace/routes/new">Build Risk Route →</Link>
      </div>
    </main>
  );
}
