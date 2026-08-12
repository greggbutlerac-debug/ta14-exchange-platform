"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type WorkspaceCard = {
  code: string;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  accent: string;
  features: string[];
};

const governedPathways = [
  {
    code: "FD",
    title: "Founding Demonstrations",
    eyebrow: "FREEZE A CLAIM · TEST IT · PRESERVE THE RESULT",
    href: "/artifacts/founding-demonstrations",
    accent: "#f4bd61",
    description:
      "Public governed demonstrations where an architecture enters under a bounded proposition, evidence is admitted, the result is examined, and the finding remains tied to what the record actually supports.",
    proof: "Harmonic Cases 001–003 · Shango FD-2026-0005",
    callout: "The Exchange can preserve successful, partial, corrected, and unexpected outcomes without rewriting history.",
  },
  {
    code: "IE",
    title: "Interoperability Examinations",
    eyebrow: "FREEZE THE INTERFACE · SEPARATE THE AUTHORITIES · EXAMINE",
    href: "/artifacts/interoperability-examinations",
    accent: "#6ee2ff",
    description:
      "Controlled examinations of whether independently governed architectures can interact across a bounded interface while preserving provenance, limitations, attribution, normative lineage, and architectural sovereignty.",
    proof: "TA-14 / ANDEKS™ IE-2026-001",
    callout: "Supported interoperability can remain narrow, inspectable, and non-merger by design.",
  },
] as const;

const workspaceCards: WorkspaceCard[] = [
  {
    code: "PG",
    title: "AI Governance Playground",
    eyebrow: "BUILD, TEST, AND CHALLENGE",
    description:
      "Construct and test consequential AI governance routes before execution is allowed to bind to reality.",
    href: "/workspace/ai-governance/playground",
    accent: "#63e6ff",
    features: ["Evidence and authority testing", "ALLOW, HOLD, DENY, and ESCALATE", "Preserved governance runs"],
  },
  {
    code: "EU",
    title: "EU AI Act Workspace",
    eyebrow: "REVIEW REGULATORY APPLICABILITY",
    description:
      "Examine provider, deployer, system, risk, transparency, documentation, oversight, and evidence requirements.",
    href: "/workspace/ai-governance/eu-ai-act",
    accent: "#8eb6ff",
    features: ["Role and system classification", "Requirement-by-requirement review", "Supported, partial, and unresolved findings"],
  },
  {
    code: "DM",
    title: "Guided Demonstrations",
    eyebrow: "LEARN GOVERNANCE IN OPERATION",
    description:
      "Inspect guided examples showing how evidence, admissibility, binding, execution, and outcomes remain distinct before entering a governed public demonstration.",
    href: "/workspace/ai-governance/demonstrations",
    accent: "#72e6b2",
    features: ["Guided governance examples", "Visible execution boundaries", "Inspectable governed records"],
  },
  {
    code: "RG",
    title: "AI Governance Registry",
    eyebrow: "PRESERVE IDENTITY, ATTRIBUTION, AND PRIOR ART",
    description:
      "Review dated, attributable, searchable, challengeable, and preserved governance architectures, claims, and records.",
    href: "/workspace/ai-governance/registry",
    accent: "#c68cff",
    features: ["Dated registry entries", "Architecture attribution", "Challenge and review history"],
  },
  {
    code: "AR",
    title: "Artifact Registry",
    eyebrow: "FOLLOW THE GOVERNED RECORD",
    description:
      "Inspect public governed artifacts, findings, evidence boundaries, corrections, participant responses, and institutional chronology.",
    href: "/artifacts/registry",
    accent: "#f3c572",
    features: ["Governed artifact identity", "Bounded findings and limitations", "Public chronology and preserved responses"],
  },
  {
    code: "RR",
    title: "Reviews & Responses",
    eyebrow: "PRESERVE SEPARATE VOICES",
    description:
      "Inspect participant reviews, independent reviews, evidence challenges, factual corrections, technical comments, and external publication references.",
    href: "/workspace/ai-governance/reviews",
    accent: "#7dd3fc",
    features: ["Attributable participant responses", "Independent review records", "Corrections without silent rewrite"],
  },
  {
    code: "GL",
    title: "Governance Library",
    eyebrow: "UNDERSTAND THE AUTHORITY LANDSCAPE",
    description:
      "Explore connected laws, regulations, standards, frameworks, principles, recommendations, and assurance systems.",
    href: "/workspace/ai-governance/library",
    accent: "#ffc65c",
    features: ["Source and authority intelligence", "Applicability and relationship mapping", "Crosswalks, coverage, and references"],
  },
  {
    code: "PRN",
    title: "Partner Review Network",
    eyebrow: "REQUEST BOUNDED INDEPENDENT REVIEW",
    description:
      "Connect governance architectures, implementations, and evidence packages to declared review pathways while preserving written boundaries.",
    href: "/workspace/ai-governance/partner-review-network",
    accent: "#ff8db5",
    features: ["Scoped independent review", "Declared expertise and limitations", "Preserved findings and objections"],
  },
  {
    code: "$",
    title: "Pricing",
    eyebrow: "REVIEW THE SERVICE MODEL",
    description:
      "Understand preserved-run pricing, governed-record services, review pathways, and implementation options.",
    href: "/workspace/ai-governance/pricing",
    accent: "#ff9d72",
    features: ["Workspace access", "Preserved governance runs", "Review and implementation scopes"],
  },
];

const anchorChain = ["Reality", "Record", "Continuity", "Admissibility", "Binding", "Commit", "Execution", "Outcome"];

export default function AiGovernanceWorkspacePage() {
  return (
    <main className="workspacePage">
      <div className="gridOverlay" />
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <section className="shell">
        <div className="topbar">
          <Link href="/" className="button quiet">← Return to Exchange</Link>
          <div className="status"><span /> Consequential execution workspace</div>
          <Link href="/workspace/ai-governance/registry" className="button primary">Open Governance Registry →</Link>
        </div>

        <header className="hero">
          <div className="seal"><strong>AI</strong><small>TA-14</small></div>
          <p className="eyebrow">TA-14 AI GOVERNANCE EXCHANGE</p>
          <h1>Govern the route <span>before execution becomes reality.</span></h1>
          <p className="lead">
            Register architectures. Freeze propositions. Admit evidence. Demonstrate claims. Examine bounded interoperability. Preserve findings, corrections, limitations, participant responses, and institutional chronology without allowing one layer to silently substitute for another.
          </p>

          <div className="heroActions">
            <Link href="/artifacts/founding-demonstrations" className="button gold">Founding Demonstrations →</Link>
            <Link href="/artifacts/interoperability-examinations" className="button secondary">Interoperability Examinations →</Link>
            <Link href="/workspace/ai-governance/registry" className="button secondary">Governance Registry →</Link>
          </div>

          <div className="metrics">
            <article><span>24</span><small>Governed architecture links</small></article>
            <article><span>04</span><small>Public founding artifacts showcased</small></article>
            <article><span>01</span><small>Controlled interoperability examination</small></article>
            <article><span>02</span><small>Distinct governed examination pathways</small></article>
          </div>
        </header>

        <section className="pathwaySection">
          <div className="heading pathwayHeading">
            <div>
              <p className="eyebrow goldText">GOVERNED PUBLIC EXAMINATION PATHWAYS</p>
              <h2>Do not confuse learning, registration, demonstration, and interoperability.</h2>
            </div>
            <p>
              The Exchange now separates the public pathways that produce governed findings. A Founding Demonstration examines a bounded proposition about an architecture. An Interoperability Examination examines a bounded relationship between independent architectures. Neither pathway creates certification or a stronger claim than the admitted evidence supports.
            </p>
          </div>

          <div className="pathwayGrid">
            {governedPathways.map((pathway) => (
              <Link
                href={pathway.href}
                className="pathwayCard"
                key={pathway.code}
                style={{ "--accent": pathway.accent } as CSSProperties}
              >
                <div className="pathwayTop"><span>{pathway.code}</span><small>PUBLIC GOVERNED PATHWAY</small></div>
                <p className="pathwayEyebrow">{pathway.eyebrow}</p>
                <h3>{pathway.title}</h3>
                <p className="pathwayDescription">{pathway.description}</p>
                <div className="precedent"><small>CURRENT PUBLIC PRECEDENT</small><strong>{pathway.proof}</strong></div>
                <div className="pathwayCallout">{pathway.callout}</div>
                <div className="pathwayAction"><strong>Explore governed records</strong><span>→</span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="precedentSection">
          <div className="precedentLabel">WHAT THE EXCHANGE HAS NOW PROVED ABOUT ITS OWN PROCESS</div>
          <div className="precedentGrid">
            <article><span>HARMONIC CASE 003</span><strong>An unexpected result can remain preserved.</strong><p>The evidence supported authority-loss classification and blocking while the frozen changed-state test object remained not established as frozen.</p><Link href="/artifacts/fd-2026-0002-case-003">Open Case 003 →</Link></article>
            <article><span>TA-14 / ANDEKS™ IE-2026-001</span><strong>A positive interoperability finding can remain sovereign and bounded.</strong><p>Documentary governance-interface interoperability was supported without converting the result into runtime, API, production, certification, or joint-authority claims.</p><Link href="/artifacts/ta14-andeks-ie-2026-001">Open examination →</Link></article>
          </div>
        </section>

        <section className="workspaceSection">
          <div className="heading">
            <div><p className="eyebrow">AI GOVERNANCE OPERATING SYSTEM</p><h2>Choose what you need to do.</h2></div>
            <p>
              The public examination pathways sit alongside the working environments that support registration, learning, research, review, evidence, governance runs, and institutional preservation.
            </p>
          </div>

          <div className="cardGrid">
            {workspaceCards.map((card, index) => (
              <Link href={card.href} className="workspaceCard" key={card.title} style={{ "--accent": card.accent } as CSSProperties}>
                <div className="cardTop"><span className="cardCode">{card.code}</span><span className="cardNumber">{String(index + 1).padStart(2, "0")}</span></div>
                <p className="cardEyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p className="cardDescription">{card.description}</p>
                <ul>{card.features.map((feature) => <li key={feature}><span>✦</span>{feature}</li>)}</ul>
                <div className="cardAction"><strong>Open workspace</strong><span>→</span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="chainSection">
          <div className="heading">
            <div><p className="eyebrow goldText">TA-14 ADMISSIBLE EXECUTION ARCHITECTURE</p><h2>Eight visible anchors. Twenty-four governed links.</h2></div>
            <p>
              The visible anchor chain makes the route legible. The complete TA-14 architecture applies deeper authority, evidence, continuity, admissibility, review, intervention, commitment, and verification controls before consequence is released.
            </p>
          </div>
          <div className="chain">
            {anchorChain.map((item, index) => <div className="chainNode" key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < anchorChain.length - 1 ? <i>→</i> : null}</div>)}
          </div>
          <div className="principle"><span>TA-14 GOVERNING PRINCIPLE</span><strong>No admissible evidence. No admissible execution.</strong></div>
        </section>

        <section className="boundary">
          <div className="boundarySeal"><strong>EB</strong><small>Execution boundary</small></div>
          <p className="eyebrow goldText">GOVERNANCE AND EXECUTION BOUNDARY</p>
          <h2>A policy, framework, assessment, finding, or approval is not the execution.</h2>
          <p>
            The Exchange preserves the distinction between what an authority requires, what an architecture claims, what evidence actually supports, what an independent review determines, what an authorized actor commits, what a system executes, and what actually occurs.
          </p>
          <div className="boundaryGrid">
            <article><span>DECLARE</span><strong>Governed object, intended action, authority, scope, actor, version, and operating conditions</strong></article>
            <article><span>DETERMINE</span><strong>Evidence sufficiency, continuity, admissibility, limitations, conflicts, falsification, and unresolved requirements</strong></article>
            <article><span>PRESERVE</span><strong>Finding, participant response, correction, commitment, execution, outcome, objection, and chronology</strong></article>
          </div>
        </section>
      </section>

      <style jsx>{`
        .workspacePage{position:relative;min-height:100vh;overflow:hidden;color:#f7fbff;background:radial-gradient(circle at 50% -10%,rgba(31,120,169,.22),transparent 36%),radial-gradient(circle at 8% 34%,rgba(65,203,227,.08),transparent 24%),radial-gradient(circle at 88% 66%,rgba(239,185,89,.07),transparent 27%),linear-gradient(180deg,#04101b 0%,#020913 48%,#01060c 100%)}
        .gridOverlay,.ambient{position:fixed;inset:0;pointer-events:none}.gridOverlay{opacity:.17;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 84%)}.ambientOne{background:radial-gradient(circle at 18% 12%,rgba(99,230,255,.08),transparent 25%)}.ambientTwo{background:radial-gradient(circle at 82% 42%,rgba(255,198,92,.06),transparent 26%)}
        .shell{position:relative;z-index:2;width:min(1480px,calc(100% - 40px));margin:auto;padding:24px 0 90px}.topbar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:14px;padding:12px;border:1px solid rgba(255,255,255,.09);border-radius:20px;background:rgba(5,19,32,.78);box-shadow:0 18px 54px rgba(0,0,0,.28);backdrop-filter:blur(18px)}
        .status{display:flex;align-items:center;gap:9px;color:#8fa9b6;font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.status span{width:7px;height:7px;border-radius:50%;background:#72e6b2;box-shadow:0 0 16px rgba(114,230,178,.9)}
        .button{min-height:48px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;text-decoration:none;font-size:10px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;transition:transform .22s}.button:hover{transform:translateY(-2px)}.quiet{justify-self:start;color:#c4d5de;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.18)}.primary{justify-self:end;color:#041a23;border:1px solid #aaf2ff;background:linear-gradient(135deg,#d9fbff,#76deef 64%,#38aeca)}.secondary{color:#dffbff;border:1px solid rgba(104,224,245,.34);background:linear-gradient(135deg,rgba(34,123,151,.35),rgba(7,31,45,.84))}.gold{color:#241704;border:1px solid #ffe09a;background:linear-gradient(135deg,#fff0bd,#eeb84b)}
        .hero{max-width:1240px;margin:auto;padding:92px 0 74px;text-align:center}.seal{width:120px;height:120px;margin:0 auto 30px;display:grid;place-items:center;align-content:center;gap:4px;border:1px solid rgba(255,199,82,.44);border-radius:50%;background:radial-gradient(circle at 50% 34%,rgba(255,220,146,.18),transparent 34%),radial-gradient(circle,rgba(99,230,255,.12),rgba(4,18,30,.96) 68%);box-shadow:0 0 70px rgba(99,230,255,.12),inset 0 0 32px rgba(255,198,92,.07)}.seal strong{color:#ffe1a0;font:900 38px Georgia,serif}.seal small{color:#86a1ae;font-size:8px;font-weight:900;letter-spacing:.2em}
        .eyebrow{margin:0;color:#6fe8ff;font-size:10px;font-weight:950;letter-spacing:.22em;text-transform:uppercase}.goldText{color:#efbd59}h1,h2,h3{font-family:Georgia,"Times New Roman",serif}.hero h1{max-width:1160px;margin:15px auto 0;font-size:clamp(54px,6.8vw,100px);line-height:.94;letter-spacing:-.056em;text-wrap:balance}.hero h1 span{display:block;color:#9fb4bf;font-style:italic;font-weight:500}.lead{max-width:1040px;margin:28px auto 0;color:#afc1ca;font-size:18px;line-height:1.75}.heroActions{margin-top:28px;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}.heroActions .button{justify-self:auto}.metrics{max-width:1050px;margin:38px auto 0;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.metrics article{padding:20px 14px;border:1px solid rgba(255,255,255,.075);border-radius:17px;background:rgba(5,19,31,.62)}.metrics span{display:block;color:#f0d28f;font:700 28px Georgia,serif}.metrics small{display:block;margin-top:6px;color:#788f9a;font-size:8px;font-weight:900;letter-spacing:.09em;text-transform:uppercase}
        .pathwaySection,.workspaceSection{padding-top:88px}.heading{display:grid;grid-template-columns:1.2fr .8fr;align-items:end;gap:40px;margin-bottom:34px}.heading h2,.boundary h2{margin:12px 0 0;font-size:clamp(40px,4.6vw,68px);line-height:.98;letter-spacing:-.048em}.heading>p{margin:0;color:#98adb7;font-size:15px;line-height:1.75}.pathwayHeading{align-items:start}.pathwayGrid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.pathwayCard{--accent:#6ee2ff;position:relative;min-height:500px;padding:34px;display:flex;flex-direction:column;border:1px solid color-mix(in srgb,var(--accent) 40%,rgba(255,255,255,.05));border-radius:30px;color:inherit;text-decoration:none;background:radial-gradient(circle at 100% 0,color-mix(in srgb,var(--accent) 14%,transparent),transparent 33%),linear-gradient(145deg,rgba(10,30,47,.98),rgba(3,12,21,.99));box-shadow:0 32px 85px rgba(0,0,0,.32);transition:transform .25s,border-color .25s,box-shadow .25s}.pathwayCard:hover{transform:translateY(-8px);border-color:var(--accent);box-shadow:0 40px 95px rgba(0,0,0,.4),0 0 40px color-mix(in srgb,var(--accent) 14%,transparent)}.pathwayTop{display:flex;align-items:center;justify-content:space-between;gap:15px}.pathwayTop>span{width:64px;height:64px;display:grid;place-items:center;border:1px solid var(--accent);border-radius:18px;color:var(--accent);font-size:18px;font-weight:950}.pathwayTop small{color:#6f8997;font-size:8px;font-weight:900;letter-spacing:.14em}.pathwayEyebrow{margin:30px 0 0;color:var(--accent);font-size:9px;font-weight:900;letter-spacing:.14em}.pathwayCard h3{margin:10px 0 0;font-size:clamp(34px,4vw,58px);line-height:.98}.pathwayDescription{margin:20px 0 0;color:#a9bec9;font-size:15px;line-height:1.75}.precedent{margin-top:25px;padding:18px;border:1px solid rgba(255,255,255,.075);border-radius:15px;background:rgba(0,0,0,.18)}.precedent small,.precedent strong{display:block}.precedent small{color:#738c99;font-size:8px;font-weight:900;letter-spacing:.12em}.precedent strong{margin-top:7px;color:#dbeef5;font-size:13px}.pathwayCallout{margin-top:13px;padding:16px 18px;border-left:2px solid var(--accent);border-radius:0 13px 13px 0;background:color-mix(in srgb,var(--accent) 7%,transparent);color:#c8dce5;font-size:13px;line-height:1.6}.pathwayAction{margin-top:auto;padding-top:24px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.07);color:var(--accent);font-size:12px}.pathwayAction span{font-size:20px}
        .precedentSection{margin-top:28px;padding:28px;border:1px solid rgba(255,255,255,.08);border-radius:24px;background:rgba(3,13,22,.72)}.precedentLabel{color:#8ca5b2;font-size:9px;font-weight:900;letter-spacing:.16em;text-align:center}.precedentGrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}.precedentGrid article{padding:23px;border:1px solid rgba(255,255,255,.07);border-radius:18px;background:rgba(255,255,255,.025)}.precedentGrid article>span{color:#efbd59;font-size:9px;font-weight:900;letter-spacing:.12em}.precedentGrid strong{display:block;margin-top:8px;font:700 22px/1.15 Georgia,serif}.precedentGrid p{color:#9db3be;font-size:13px;line-height:1.65}.precedentGrid a{color:#8de6fb;font-size:12px;font-weight:850;text-decoration:none}
        .cardGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.workspaceCard{--accent:#63e6ff;min-height:430px;padding:26px;display:flex;flex-direction:column;border:1px solid color-mix(in srgb,var(--accent) 31%,rgba(255,255,255,.05));border-radius:28px;color:inherit;text-decoration:none;background:linear-gradient(145deg,rgba(10,30,47,.96),rgba(4,13,23,.99));box-shadow:0 25px 60px rgba(0,0,0,.3);transition:transform .26s,border-color .26s,box-shadow .26s}.workspaceCard:hover{transform:translateY(-8px);border-color:var(--accent);box-shadow:0 34px 76px rgba(0,0,0,.38),0 0 34px color-mix(in srgb,var(--accent) 20%,transparent)}.cardTop{display:flex;align-items:center;justify-content:space-between}.cardCode{min-width:66px;height:66px;padding:0 10px;display:grid;place-items:center;border:1px solid var(--accent);border-radius:18px;color:var(--accent);background:rgba(0,0,0,.22);font-size:15px;font-weight:950}.cardNumber{color:#6f8590;font-size:9px;font-weight:900}.cardEyebrow{margin:26px 0 0;color:var(--accent);font-size:9px;font-weight:900;letter-spacing:.14em}.workspaceCard h3{margin:10px 0 0;font-size:33px;line-height:1.02}.cardDescription{margin:15px 0 0;color:#9bb0ba;font-size:14px;line-height:1.68}.workspaceCard ul{margin:22px 0 0;padding:0;display:grid;gap:10px;list-style:none}.workspaceCard li{display:grid;grid-template-columns:16px 1fr;gap:8px;color:#d2e0e5;font-size:11px;line-height:1.45}.workspaceCard li span{color:var(--accent)}.cardAction{margin-top:auto;padding-top:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid rgba(255,255,255,.065);color:var(--accent);font-size:11px}.cardAction>span{font-size:19px}
        .chainSection{margin-top:88px;padding:54px 40px;border:1px solid rgba(255,197,82,.2);border-radius:32px;background:radial-gradient(circle at 50% 0,rgba(255,190,61,.1),transparent 40%),linear-gradient(145deg,rgba(10,29,44,.95),rgba(3,11,20,.99));box-shadow:0 30px 80px rgba(0,0,0,.32)}.chain{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin-top:38px}.chainNode{position:relative;min-height:104px;padding:15px 10px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,198,92,.16);border-radius:15px;background:rgba(0,0,0,.2);text-align:center}.chainNode span{color:#857249;font-size:8px;font-weight:900}.chainNode strong{margin-top:10px;color:#f0d38f;font-size:11px;letter-spacing:.05em;text-transform:uppercase}.chainNode i{position:absolute;right:-9px;top:43px;z-index:3;color:#e7b64f;font-style:normal}.principle{margin-top:24px;padding:22px;display:flex;align-items:center;justify-content:space-between;gap:25px;border:1px solid rgba(255,198,92,.18);border-radius:17px;background:rgba(84,54,8,.1)}.principle span{color:#b79655;font-size:9px;font-weight:900;letter-spacing:.15em}.principle strong{color:#ffe4a5;font:700 23px Georgia,serif}
        .boundary{margin-top:90px;padding:58px 36px;border:1px solid rgba(255,197,82,.24);border-radius:32px;background:radial-gradient(circle at 50% 0,rgba(255,185,44,.12),transparent 42%),linear-gradient(180deg,rgba(8,20,33,.97),rgba(3,10,18,.99));box-shadow:0 28px 78px rgba(0,0,0,.35);text-align:center}.boundarySeal{width:84px;height:84px;margin:0 auto 22px;display:grid;place-items:center;align-content:center;gap:3px;border:1px solid rgba(255,197,82,.32);border-radius:50%;background:rgba(0,0,0,.18)}.boundarySeal strong{color:#f2ca75;font:700 23px Georgia,serif}.boundarySeal small{color:#788b94;font-size:6px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.boundary h2{max-width:1080px;margin:14px auto 0}.boundary>p:not(.eyebrow){max-width:1000px;margin:24px auto 0;color:#a4b4bc;font-size:15px;line-height:1.78}.boundaryGrid{max-width:1120px;margin:32px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.boundaryGrid article{padding:21px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(0,0,0,.17)}.boundaryGrid span{display:block;color:#e3b759;font-size:8px;font-weight:900;letter-spacing:.12em}.boundaryGrid strong{display:block;margin-top:10px;color:#d9e4e8;font-size:12px;line-height:1.48}
        @media(max-width:1180px){.cardGrid{grid-template-columns:repeat(2,1fr)}.chain{grid-template-columns:repeat(4,1fr)}.chainNode i{display:none}}@media(max-width:900px){.topbar{grid-template-columns:1fr 1fr}.status{display:none}.heading,.pathwayGrid,.precedentGrid{grid-template-columns:1fr;gap:16px}.metrics,.boundaryGrid{grid-template-columns:repeat(2,1fr)}.principle{flex-direction:column;align-items:flex-start}}@media(max-width:650px){.shell{width:calc(100% - 22px)}.topbar{grid-template-columns:1fr}.quiet,.primary{justify-self:stretch}.button{width:100%}.hero{padding:64px 0}.hero h1{font-size:clamp(45px,14vw,68px)}.cardGrid,.metrics,.boundaryGrid{grid-template-columns:1fr}.chain{grid-template-columns:repeat(2,1fr)}.chainSection,.boundary{padding:38px 20px}.workspaceCard,.pathwayCard{min-height:auto}.pathwayCard{padding:26px}}
      `}</style>
    </main>
  );
}
