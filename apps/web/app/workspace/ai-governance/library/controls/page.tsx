"use client";

import Link from "next/link";

export default function ControlsPage() {
  const controls = [
    "Preventive controls",
    "Detective controls",
    "Corrective controls",
    "Runtime controls",
    "Administrative controls",
    "Technical controls",
    "Evidence controls",
    "Execution controls",
  ];

  return (
    <main style={{padding:"48px",fontFamily:"Inter,sans-serif",background:"#050914",color:"#fff",minHeight:"100vh"}}>
      <h1>Governance Controls</h1>
      <p>
        Controls are the mechanisms used to enforce governance requirements.
        This module distinguishes controls from policies, standards, laws,
        and evidence.
      </p>

      <h2>Control Categories</h2>
      <ul>
        {controls.map(c => <li key={c}>{c}</li>)}
      </ul>

      <h2>TA-14 Perspective</h2>
      <p>
        Controls influence execution but do not replace admissible evidence,
        authority, continuity, binding, or preserved outcomes.
      </p>

      <div style={{display:"flex",gap:16,marginTop:32}}>
        <Link href="/workspace/ai-governance/library">← Governance Library</Link>
        <Link href="/workspace/routes/new">Build Control Route →</Link>
      </div>
    </main>
  );
}
