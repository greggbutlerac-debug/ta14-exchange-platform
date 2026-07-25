"use client";

import Link from "next/link";

const topics = [
  {
    title: "Assurance",
    description: "Independent confidence that governance activities, controls, and evidence meet defined objectives.",
  },
  {
    title: "Verification",
    description: "Confirm that documented requirements, evidence, and execution records match what actually occurred.",
  },
  {
    title: "Validation",
    description: "Evaluate whether the governed solution is appropriate for its intended purpose and operating context.",
  },
  {
    title: "Audit",
    description: "Systematic examination of governance activities against defined criteria, standards, or obligations.",
  },
  {
    title: "Continuous Monitoring",
    description: "Observe governance performance over time and preserve meaningful changes for future review.",
  },
  {
    title: "Independent Review",
    description: "Separate reviewer assessment that preserves findings, disagreements, and supporting evidence.",
  },
];

export default function AssurancePage() {
  return (
    <main style={{padding:"48px",fontFamily:"Inter,sans-serif",background:"#050914",color:"#fff",minHeight:"100vh"}}>
      <h1>Assurance & Oversight</h1>

      <p style={{maxWidth:900,lineHeight:1.7}}>
        Governance assurance provides confidence that governance activities are
        operating as intended. TA-14 distinguishes assurance, verification,
        validation, auditing, monitoring, and independent review so each
        preserves its own evidence and boundaries.
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
        gap:"18px",
        marginTop:"32px"
      }}>
        {topics.map(topic => (
          <div key={topic.title}
            style={{
              border:"1px solid #29384d",
              borderRadius:14,
              padding:20,
              background:"#0b1220"
            }}>
            <h3>{topic.title}</h3>
            <p style={{color:"#b8c7da",lineHeight:1.6}}>
              {topic.description}
            </p>
          </div>
        ))}
      </div>

      <section style={{marginTop:48}}>
        <h2>TA-14 Boundary</h2>
        <p style={{maxWidth:900,lineHeight:1.7}}>
          Assurance activities increase confidence in governance, but they do
          not replace admissible evidence, execution authority, or preserved
          outcome records. Every assurance activity should itself become a
          governed record.
        </p>
      </section>

      <div style={{display:"flex",gap:18,marginTop:40}}>
        <Link href="/workspace/ai-governance/library">
          ← Governance Library
        </Link>

        <Link href="/workspace/routes/new">
          Build Assurance Route →
        </Link>
      </div>
    </main>
  );
}
