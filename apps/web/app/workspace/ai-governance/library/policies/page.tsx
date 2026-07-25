"use client";

import Link from "next/link";

export default function PoliciesPage() {
  return (
    <main style={{padding:48,fontFamily:"Inter,sans-serif",background:"#050914",color:"#fff",minHeight:"100vh"}}>
      <h1>Policies</h1>
      <p>
        Policies define organizational expectations and governance direction.
        They differ from laws, regulations, standards, controls, and procedures.
      </p>

      <h2>Policy Library</h2>
      <ul>
        <li>AI Acceptable Use Policy</li>
        <li>Model Development Policy</li>
        <li>Human Oversight Policy</li>
        <li>Data Governance Policy</li>
        <li>Incident Response Policy</li>
        <li>Change Management Policy</li>
        <li>Record Preservation Policy</li>
        <li>Third-Party AI Policy</li>
      </ul>

      <h2>TA-14 Boundary</h2>
      <p>
        A policy establishes expectations, but execution still depends on
        admissible evidence, authority, bounded decisions, and preserved outcomes.
      </p>

      <div style={{display:"flex",gap:16,marginTop:32}}>
        <Link href="/workspace/ai-governance/library">← Governance Library</Link>
        <Link href="/workspace/routes/new">Build Policy Route →</Link>
      </div>
    </main>
  );
}
