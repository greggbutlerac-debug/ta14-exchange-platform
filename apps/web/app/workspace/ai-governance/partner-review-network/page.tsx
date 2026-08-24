"use client";

import { useState } from "react";

type Partner = {
  name: string;
  initials: string;
  status: string;
  lane: string;
  summary: string;
  governs: string[];
  contribution: string;
  boundary: string;
  pathwayUrl: string;
  accent: "cyan" | "violet";
};

const partners: Partner[] = [
  {
    name: "Elias / LOVE-OS",
    initials: "EL",
    status: "Signed Partner Review Pathway",
    lane: "Runtime Misexecution Pressure Assessment + TA-14 Admissible Execution Boundary Review",
    summary:
      "A specialized runtime-governance pathway focused on how systems behave under ambiguity, pressure, changing conditions, and consequence-bearing decision risk.",
    governs: [
      "Runtime misexecution exposure",
      "Refusal and escalation behavior",
      "Witness continuity",
      "Bounded execution behavior",
      "Operational pressure dynamics",
      "Intervention survivability",
    ],
    contribution:
      "Elias / LOVE-OS contributes the specialized runtime-governance and misexecution-pressure assessment layer. TA-14 contributes the second-layer review of the broader consequence-bearing route.",
    boundary:
      "This pathway is not a merger, certification, endorsement, production validation, security assurance, legal opinion, or claim that either architecture implements or absorbs the other.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/elias-love-os-partner-review-pathway",
    accent: "cyan",
  },
  {
    name: "AnchorStack",
    initials: "AS",
    status: "Signed Partner Review Pathway",
    lane: "Evidence Maturity / Pressure-Route Assessment + TA-14 Admissible Execution Boundary Review",
    summary:
      "A specialized evidence-maturity and pressure-route pathway examining whether governance evidence and route behavior remain credible before consequence attaches.",
    governs: [
      "Evidence maturity",
      "Pressure-route behavior",
      "Invalid operational continuation",
      "Bypass resistance",
      "Replay packets",
      "Assumption governance",
      "Route-governance artifacts",
      "Claim discipline",
    ],
    contribution:
      "AnchorStack contributes the evidence-maturity and pressure-route assessment layer. TA-14 reviews whether those findings support admissible execution across the full route from reality through outcome.",
    boundary:
      "Evidence maturity is not automatically route-complete admissibility. The pathway does not imply certification, endorsement, production validation, a source-code audit, or unrestricted TA-14 status.",
    pathwayUrl:
      "https://sites.google.com/view/ta-14partnerreviewnetworkanewc/anchorstack-partner-review-pathway",
    accent: "violet",
  },
];

const architectureSteps = [
  ["01", "Independent architecture", "The partner preserves its own identity, methods, system, expertise, and review layer."],
  ["02", "Written boundary", "The pathway states what is reviewed, what the evidence supports, and what remains outside scope."],
  ["03", "Specialized assessment", "The partner reviews governance surfaces inside its declared field of competence."],
  ["04", "TA-14 second layer", "TA-14 reviews whether the larger consequence-bearing route supports admissible execution."],
];

export default function PartnerReviewNetworkWorkspacePage() {
  const [openPartner, setOpenPartner] = useState<number | null>(0);

  return (
    <main className="prn-page">
      <style>{`
        :root {
          --prn-bg: #030712;
          --prn-panel: rgba(7,15,28,.82);
          --prn-line: rgba(255,255,255,.11);
          --prn-text: #f7fbff;
          --prn-muted: #a9b8ca;
          --prn-cyan: #54e8ff;
          --prn-violet: #b59bff;
        }
        .prn-page { min-height:100vh; color:var(--prn-text); background:radial-gradient(circle at 15% 10%,rgba(28,183,255,.16),transparent 28%),radial-gradient(circle at 85% 18%,rgba(153,102,255,.14),transparent 30%),linear-gradient(180deg,#020611 0%,#06101c 54%,#02060d 100%); }
        .prn-page * { box-sizing:border-box; }
        .prn-shell { width:min(1220px,calc(100% - 36px)); margin:0 auto; padding:46px 0 84px; }
        .prn-hero { padding:48px; border:1px solid var(--prn-line); border-radius:32px; background:rgba(4,11,22,.72); box-shadow:0 30px 100px rgba(0,0,0,.38); }
        .prn-kicker { color:#bff8ff; font-size:12px; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
        .prn-title { margin:16px 0 14px; font-size:clamp(46px,7vw,80px); line-height:.98; letter-spacing:-.05em; }
        .prn-title span { display:block; color:transparent; background:linear-gradient(90deg,#aaf6ff,#fff 48%,#d3c5ff); background-clip:text; -webkit-background-clip:text; }
        .prn-lead { max-width:860px; margin:0; color:var(--prn-muted); font-size:18px; line-height:1.75; }
        .prn-rule { margin-top:28px; padding:20px 22px; border:1px solid rgba(84,232,255,.18); border-radius:18px; background:rgba(84,232,255,.05); font-weight:800; }
        .prn-section { padding-top:72px; }
        .prn-eyebrow { color:var(--prn-cyan); font-size:12px; font-weight:900; letter-spacing:.18em; text-transform:uppercase; }
        .prn-section-title { margin:12px 0 12px; font-size:clamp(32px,4.5vw,54px); line-height:1.05; letter-spacing:-.04em; }
        .prn-section-copy { max-width:820px; color:var(--prn-muted); line-height:1.75; }
        .prn-partners { display:grid; gap:18px; margin-top:28px; }
        .prn-card { overflow:hidden; border:1px solid var(--prn-line); border-radius:24px; background:var(--prn-panel); }
        .prn-card-button { width:100%; display:grid; grid-template-columns:72px 1fr auto; gap:18px; align-items:center; padding:24px; border:0; color:inherit; background:transparent; text-align:left; cursor:pointer; }
        .prn-badge { width:58px; height:58px; display:grid; place-items:center; border-radius:18px; font-weight:950; font-size:18px; }
        .prn-badge.cyan { color:#d7fbff; border:1px solid rgba(84,232,255,.28); background:rgba(84,232,255,.09); }
        .prn-badge.violet { color:#eee9ff; border:1px solid rgba(181,155,255,.28); background:rgba(181,155,255,.09); }
        .prn-path { color:#dfe8f3; font-size:12px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .prn-name { margin-top:5px; font-size:25px; font-weight:900; }
        .prn-lane { margin-top:5px; color:var(--prn-muted); line-height:1.5; }
        .prn-toggle { font-size:28px; color:#c8d4e2; }
        .prn-detail { padding:0 24px 26px 114px; }
        .prn-status { display:inline-flex; margin-bottom:14px; padding:7px 10px; border-radius:999px; border:1px solid var(--prn-line); color:#d7e3f0; font-size:12px; font-weight:800; }
        .prn-summary { color:#c3d0df; line-height:1.7; }
        .prn-columns { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:20px; }
        .prn-box { padding:20px; border:1px solid var(--prn-line); border-radius:18px; background:rgba(255,255,255,.025); }
        .prn-box h4 { margin:0 0 12px; font-size:15px; }
        .prn-box ul { margin:0; padding-left:18px; color:var(--prn-muted); line-height:1.75; }
        .prn-box p { margin:0; color:var(--prn-muted); line-height:1.7; }
        .prn-link { display:inline-flex; margin-top:18px; padding:11px 16px; border-radius:12px; color:#03100c; background:linear-gradient(90deg,var(--prn-cyan),#a7f4ff); font-weight:900; text-decoration:none; }
        .prn-arch { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:28px; }
        .prn-step { padding:22px; border:1px solid var(--prn-line); border-radius:20px; background:rgba(7,15,28,.68); }
        .prn-step-num { color:var(--prn-cyan); font-size:12px; font-weight:900; letter-spacing:.14em; }
        .prn-step h3 { margin:10px 0 8px; font-size:18px; }
        .prn-step p { margin:0; color:var(--prn-muted); line-height:1.65; }
        .prn-chain { margin-top:26px; padding:28px; border:1px solid rgba(181,155,255,.2); border-radius:22px; background:rgba(181,155,255,.05); text-align:center; }
        .prn-chain strong { display:block; margin-bottom:10px; font-size:20px; }
        .prn-chain div { color:#e5e1ff; font-weight:850; letter-spacing:.02em; }
        .prn-principle { margin-top:26px; padding:34px; border:1px solid rgba(84,232,255,.18); border-radius:26px; background:linear-gradient(135deg,rgba(84,232,255,.06),rgba(181,155,255,.05)); }
        .prn-principle h2 { margin:0 0 10px; font-size:34px; }
        .prn-principle p { margin:0; color:var(--prn-muted); line-height:1.75; }
        @media (max-width:800px) {
          .prn-hero { padding:30px 24px; }
          .prn-card-button { grid-template-columns:58px 1fr auto; padding:20px; }
          .prn-detail { padding:0 20px 22px; }
          .prn-columns,.prn-arch { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="prn-shell">
        <section className="prn-hero">
          <div className="prn-kicker">Independent Governance Network</div>
          <h1 className="prn-title">TA-14 <span>Partner Review Network</span></h1>
          <p className="prn-lead">
            Independent architectures remain independent. Their specialized findings enter a written pathway, meet declared boundaries, and receive TA-14 second-layer admissible-execution review.
          </p>
          <div className="prn-rule">Independence is preserved. Boundaries are written. Claims stay attached to evidence.</div>
        </section>

        <section className="prn-section" id="network">
          <div className="prn-eyebrow">Current pathways</div>
          <h2 className="prn-section-title">Two specialized governance lenses. One bounded network.</h2>
          <p className="prn-section-copy">
            Each current pathway declares what it reviews, what it contributes, and what it does not prove. TA-14 does not absorb the partner architecture. It reviews the consequence-bearing route around it.
          </p>

          <div className="prn-partners">
            {partners.map((partner, index) => {
              const open = openPartner === index;
              return (
                <article className="prn-card" key={partner.name}>
                  <button className="prn-card-button" onClick={() => setOpenPartner(open ? null : index)} aria-expanded={open}>
                    <div className={`prn-badge ${partner.accent}`}>{partner.initials}</div>
                    <div>
                      <div className="prn-path">Pathway {String(index + 1).padStart(2, "0")}</div>
                      <div className="prn-name">{partner.name}</div>
                      <div className="prn-lane">{partner.lane}</div>
                    </div>
                    <div className="prn-toggle">{open ? "×" : "+"}</div>
                  </button>

                  {open && (
                    <div className="prn-detail">
                      <div className="prn-status">Independent · {partner.status}</div>
                      <p className="prn-summary">{partner.summary}</p>
                      <div className="prn-columns">
                        <div className="prn-box">
                          <h4>Specialized review surfaces</h4>
                          <ul>{partner.governs.map((item) => <li key={item}>{item}</li>)}</ul>
                        </div>
                        <div className="prn-box">
                          <h4>Network contribution</h4>
                          <p>{partner.contribution}</p>
                          <h4 style={{ marginTop: 18 }}>Declared boundary</h4>
                          <p>{partner.boundary}</p>
                        </div>
                      </div>
                      <a className="prn-link" href={partner.pathwayUrl} target="_blank" rel="noreferrer">Open Full Public Pathway</a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="prn-section" id="architecture">
          <div className="prn-eyebrow">Network architecture</div>
          <h2 className="prn-section-title">Specialized governance without architectural absorption</h2>
          <div className="prn-arch">
            {architectureSteps.map(([number, title, copy]) => (
              <div className="prn-step" key={number}>
                <div className="prn-step-num">{number}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
          <div className="prn-chain">
            <strong>The TA-14 admissibility chain</strong>
            <div>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome</div>
          </div>
          <div className="prn-principle">
            <div className="prn-eyebrow">Network principle</div>
            <h2>No admissible evidence. No admissible execution.</h2>
            <p>
              The TA-14 Partner Review Network does not sell blanket approval. It preserves independence, written boundaries, evidence discipline, and second-layer scrutiny before stronger claims are permitted.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
