"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

const lanes = [
  ["RX","Runtime & Execution","runtime-execution","Live authority, commit, permissions, intervention, execution, drift, and outcome correspondence.","#63e6ff"],
  ["MG","Model Governance","model","Model identity, approved purpose, evaluation, thresholds, limitations, version, change, and retirement.","#b58cff"],
  ["DP","Data & Provenance","data-provenance","Origin, rights, consent or basis, lineage, quality, access, transformation, retention, and geography.","#72e6b2"],
  ["AT","Agent & Tool","agent-tools","Delegation, objective, tools, memory, sub-agents, communications, financial limits, and termination.","#ffc65c"],
  ["DG","Decision Governance","decision","Consequential decision basis, authority, affected party, notice, review, appeal, and traceability.","#c68cff"],
  ["PC","Policy & Controls","policy-controls","Translation of written policy into owned, enforceable, evidenced operational control.","#7da6ff"],
  ["RG","Risk Governance","risk","Risk ownership, treatment, residual acceptance, expiration, triggers, and monitoring.","#ff826f"],
  ["CR","Compliance & Regulation","compliance","Applicability, regulated actor, obligation, control, evidence, interpretation, and continuing duty.","#b7ef68"],
  ["SG","Security Governance","security","Environment, credentials, permissions, dependencies, incidents, containment, restoration, and proof.","#ff8db5"],
  ["HO","Human Oversight","human-oversight","Qualification, information, time, intervention power, conflict, escalation, and decision record.","#87d8ff"],
  ["VT","Vendor & Third Party","vendor-third-party","Contracts, versions, access, subprocessors, evidence, change notice, incidents, and exit.","#f0a86e"],
  ["OA","Outcome & Assurance","outcome-assurance","Execution-result correspondence, success measures, adverse effects, independence, and monitoring.","#dce8f3"],
];

export default function AIGovernancePage() {
  return (
    <main className="aiPage">
      <section className="shell">
        <div className="topbar">
          <Link href="/" className="button quiet">← Return to Exchange</Link>
          <Link href="/governance-library" className="button libraryButton">
            Open Governance Library →
          </Link>
        </div>

        <header className="hero">
          <div className="seal">AI</div>
          <p className="eyebrow">TA-14 AI GOVERNANCE</p>
          <h1>Test the exact governance layer an architecture claims to control.</h1>
          <p className="lead">
            The AI Governance workspace contains twelve specialized governance
            lanes. Each lane preserves its own boundaries, fields, evidence
            rules, gates, scenarios, determinations, non-claims, and replayable
            results.
          </p>
          <div className="determinations">
            {["ALLOW", "HOLD", "DENY", "ESCALATE"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </header>

        <section className="statement">
          <strong>Institutional rule</strong>
          <p>
            Descriptions, policies, evaluations, dashboards, monitoring,
            approvals, and assurance reports must never be mistaken for
            execution authority.
          </p>
        </section>

        <section className="laneSection">
          <div className="heading">
            <div>
              <p className="eyebrow">TWELVE SPECIALIZED GOVERNANCE LANES</p>
              <h2>Choose the operational layer to test.</h2>
            </div>
            <p>
              ALLOW in one lane never automatically produces ALLOW in another.
              Cross-lane handoffs preserve evidence and continuity without
              merging authority or determinations.
            </p>
          </div>

          <div className="laneGrid">
            {lanes.map(([code,title,slug,description,accent], index) => (
              <Link
                key={slug}
                href={`/workspace/ai-governance/playground/specialized/${slug}`}
                className="laneCard"
                style={{"--accent":accent} as CSSProperties}
              >
                <div className="top">
                  <span className="code">{code}</span>
                  <span className="number">{String(index+1).padStart(2,"0")}</span>
                </div>
                <p className="type">Governance-specific playground</p>
                <h3>{title}</h3>
                <p className="description">{description}</p>
                <div className="route">
                  <span>Claim</span><i/><span>Evidence</span><i/><span>Test</span>
                </div>
                <strong>Enter specialized lane →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="gateSection">
          <p className="eyebrow gold">SHARED GOVERNANCE TEST CONTRACT</p>
          <h2>One typed shell. Twelve bounded configurations.</h2>
          <div className="gateGrid">
            {[
              ["Claim","One bounded governance claim plus an unsupported-layer warning."],
              ["Evidence","Provenance, integrity, freshness, visibility, and unavailable states."],
              ["Scenarios","Baseline, failure, drift, adversarial, recovery, and compound tests."],
              ["Determination","ALLOW, HOLD, DENY, or ESCALATE with scope and invalidation triggers."],
              ["Preserve","Governed record, evidence manifest, route receipt, export, and replay."],
              ["Challenge","Counterevidence, response, review finding, correction, and supersession."],
            ].map(([title,text]) => (
              <article key={title}><strong>{title}</strong><p>{text}</p></article>
            ))}
          </div>
          <Link href="/workspace/ai-governance/playground/specialized" className="button primary">
            Open Specialized Playground Catalog →
          </Link>
        </section>
      </section>

      <style jsx>{`
        .aiPage{min-height:100vh;color:#f7fbff;background:radial-gradient(circle at 50% -10%,rgba(51,126,211,.13),transparent 34%)}
        .shell{width:min(1480px,calc(100% - 40px));margin:auto;padding:24px 0 80px}.topbar{display:flex;justify-content:space-between;gap:14px;padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(4,17,29,.74);backdrop-filter:blur(16px)}
        .button{min-height:46px;padding:0 17px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.quiet{color:#c4d5de;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.18)}.libraryButton{color:#241704;border:1px solid #ffe09a;background:linear-gradient(135deg,#fff0bd,#eeb84b)}.primary{color:#041a23;border:1px solid #aaf2ff;background:linear-gradient(135deg,#d9fbff,#76deef 64%,#38aeca)}
        .hero{max-width:1180px;margin:auto;padding:82px 0 58px;text-align:center}.seal{width:112px;height:112px;margin:0 auto 26px;display:grid;place-items:center;border:1px solid rgba(99,230,255,.42);border-radius:50%;color:#c9f8ff;background:radial-gradient(circle,rgba(99,230,255,.15),rgba(4,18,30,.86) 66%);font:900 34px Georgia,serif}.eyebrow{margin:0;color:#6fe8ff;font-size:10px;font-weight:950;letter-spacing:.22em;text-transform:uppercase}.eyebrow.gold{color:#efbd59}
        h1,h2,h3{font-family:Georgia,"Times New Roman",serif}.hero h1{max-width:1120px;margin:14px auto 0;font-size:clamp(50px,6.4vw,92px);line-height:.96;letter-spacing:-.052em}.lead{max-width:900px;margin:26px auto 0;color:#b3c6cf;font-size:18px;line-height:1.72}.determinations{margin-top:32px;display:flex;flex-wrap:wrap;justify-content:center;gap:10px}.determinations span{padding:10px 15px;border:1px solid rgba(99,230,255,.18);border-radius:999px;background:rgba(99,230,255,.06);font-size:10px;font-weight:950;letter-spacing:.12em}
        .statement{max-width:1080px;margin:0 auto 70px;padding:24px 28px;display:grid;grid-template-columns:190px 1fr;gap:24px;border:1px solid rgba(255,197,82,.2);border-radius:20px;background:linear-gradient(90deg,rgba(255,190,63,.08),rgba(6,20,32,.82))}.statement strong{color:#ffd984;font:700 22px Georgia,serif}.statement p{margin:0;color:#b5c4cb;line-height:1.7}
        .heading{display:grid;grid-template-columns:1.2fr .8fr;align-items:end;gap:40px;margin-bottom:32px}.heading h2,.gateSection h2{margin:12px 0 0;font-size:clamp(38px,4.5vw,66px);line-height:1;letter-spacing:-.045em}.heading>p{margin:0;color:#9fb2bc;font-size:15px;line-height:1.7}
        .laneGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.laneCard{--accent:#63e6ff;min-height:385px;padding:25px;display:flex;flex-direction:column;border:1px solid color-mix(in srgb,var(--accent) 30%,rgba(255,255,255,.06));border-radius:27px;color:inherit;text-decoration:none;background:linear-gradient(145deg,rgba(10,29,46,.96),rgba(4,13,23,.99));box-shadow:0 24px 58px rgba(0,0,0,.31);transition:.27s}.laneCard:hover{transform:translateY(-8px);border-color:var(--accent);box-shadow:0 30px 68px rgba(0,0,0,.39),0 0 30px color-mix(in srgb,var(--accent) 24%,transparent)}
        .top{display:flex;justify-content:space-between}.code{width:68px;height:68px;display:grid;place-items:center;border:1px solid var(--accent);border-radius:18px;color:var(--accent);background:rgba(0,0,0,.22);font-size:20px;font-weight:950}.number{color:#6d8390;font-size:9px;font-weight:900}.type{margin:27px 0 0;color:var(--accent);font-size:10px;font-weight:950;letter-spacing:.17em;text-transform:uppercase}.laneCard h3{margin:10px 0 0;font-size:30px;line-height:1.04}.description{flex:1;color:#98adb7;font-size:14px;line-height:1.7}.route{display:flex;align-items:center;gap:8px;color:color-mix(in srgb,var(--accent) 70%,white);font-size:9px;font-weight:900;text-transform:uppercase}.route i{flex:1;height:1px;background:linear-gradient(90deg,var(--accent),transparent);opacity:.3}.laneCard>strong{margin-top:20px;padding:15px;border:1px solid color-mix(in srgb,var(--accent) 40%,transparent);border-radius:13px;color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,rgba(0,0,0,.18));font-size:12px}
        .gateSection{margin-top:90px;padding:52px 34px;border:1px solid rgba(255,197,82,.22);border-radius:30px;background:radial-gradient(circle at 50% 0%,rgba(255,185,44,.1),transparent 42%),linear-gradient(180deg,rgba(8,20,33,.96),rgba(3,10,18,.98));text-align:center}.gateGrid{margin:34px 0 30px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;text-align:left}.gateGrid article{padding:20px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(0,0,0,.16)}.gateGrid strong{color:#ffe1a0;font:700 19px Georgia,serif}.gateGrid p{margin:9px 0 0;color:#9fb0b8;font-size:13px;line-height:1.6}
        @media(max-width:1100px){.laneGrid{grid-template-columns:repeat(2,1fr)}.heading{grid-template-columns:1fr;gap:16px}}@media(max-width:800px){.gateGrid{grid-template-columns:1fr 1fr}.statement{grid-template-columns:1fr}}@media(max-width:650px){.shell{width:calc(100% - 22px)}.topbar{flex-direction:column}.button{width:100%}.hero{padding:58px 0}.laneGrid,.gateGrid{grid-template-columns:1fr}.gateSection{padding:40px 20px}}
      `}</style>
    </main>
  );
}
